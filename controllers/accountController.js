const utilities = require('../utilities/index.js')
const accountModel = require("../models/account-model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login.ejs", {
    title: "Login",
    nav,
    errors:null,
  })
}

/* ****************************************
 *  Process logout request
 * ************************************ */

async function accountLogout(req, res) {
  res.clearCookie("jwt");
  res.locals.loggedin = 0;
  res.locals.user = "";
  req.flash("notice", "You are now logged out.");
  res.redirect("/account/login");
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register.ejs", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Account View after login
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  console.log("res.locals:", res.locals);
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
    user: res.locals.user,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, 
          account_lastname, 
          account_email, 
          account_password 
        } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login.ejs", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register.ejs", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}


/* ****************************************
*  Process Login request
* *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { login_email, login_password } = req.body
  const accountData = await accountModel.getAccountByEmail(login_email)
  console.log("user:", accountData);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      login_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(login_password, accountData.account_password)) {
      delete accountData.login_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        login_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


async function buildEditAccount(req, res, next) {
  let nav = await utilities.getNav();
  const userId = req.params.accountId;
  const data = await accountModel.getAccountById(userId);
  res.render("account/edit.ejs", {
    title: "Edit Account Details",
    nav: nav,
    errors: null,
    user: data,
  });
}


async function updateAccountInfo(req, res, next) {
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;
  let nav = await utilities.getNav();
  const result = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
  if (result) {
    req.flash("notice", "Your account information has been updated."),
      res.render("account/account.ejs", {
        title: "Account Management",
        nav: nav,
        errors: null,
        user: res.locals.user,
      });
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/edit.ejs", {
      title: "Edit Account Details",
      nav: nav,
      errors: result.message,
      user: res.locals.user,
    });
  }
}

async function updateAccountPassword(req, res, next) {
  const { account_id, account_password } = req.body;
  let nav = await utilities.getNav();
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the password update."
    );
    res.status(500).render("account/edit.ejs", {
      title: "Edit Account Details",
      nav,
      errors: null,
      user: res.locals.user,
    });
  }
  const updateResult = await accountModel.updateAccountPassword(
    hashedPassword,
    account_id
  );
  if (updateResult) {
    req.flash("notice", `You\'re account password was succesfully updated.`);
    res.status(201).render("account/account.ejs", {
      title: "Account Management",
      nav,
      errors: null,
      user: res.locals.user,
    });
  } else {
    req.flash("notice", `Sorry, the password update failed.`);
    res.status(501).render("account/edit.ejs", {
      title: "Edit Account Details",
      nav,
      errors: null,
      user: res.locals.user,
    });
  }
}

async function buildAdminPanel(req, res, next) {
  let nav = await utilities.getNav();
  const allUsers = await utilities.sortUsersById(await accountModel.getAllAccounts());
  const options = await accountModel.getAccountTypes();
  res.render("account/admin.ejs", {
    title: "Admin Panel",
    nav: nav,
    errors: null,
    user: res.locals.user,
    tableData: allUsers,
    options: options,
  });
  next();
}

async function processAdminBulkUpdate(req, res, next) {
  let nav = await utilities.getNav();
  let accounts = await utilities.sortUsersById(req.body.accounts);
  const options = await accountModel.getAccountTypes();
  const results = await Promise.all(
    // check if values differ from current values
    accounts.map(async (account) => {

      let originalAccount = await accountModel.getAccountById(account.account_id)
      console.log("accountId requested:", account.account_id, "accountId received:", originalAccount.account_id, ", account_email requested:", account.account_email, "account_email received:", originalAccount.account_email);
      let thisResult = await accountModel.updateAccountInfo(
        account.account_id,
        account.account_firstname,
        account.account_lastname,
        account.account_email,
        account.account_type
      );

      console.log("account.account_firstname:", account.account_firstname, "originalAccount.account_firstname:", originalAccount.account_firstname, "account.account_lastname:", account.account_lastname, "originalAccount.account_lastname:", originalAccount.account_lastname, "account.account_email:", account.account_email, "originalAccount.account_email:", originalAccount.account_email, "account.account_type:", account.account_type, "originalAccount.account_type:", originalAccount.account_type);


      if (account.account_firstname !== originalAccount.account_firstname || account.account_lastname !== originalAccount.account_lastname || account.account_email !== originalAccount.account_email || account.account_type !== originalAccount.account_type) {
        req.flash(
          "notice",
          `Account ${account.account_id + " " + account.account_email} was updated .`
        );
      }

      if (!thisResult) {
        req.flash(
          "notice",
          `An error occured for user ${
            account.account_id + " " + account.account_email
          } failed to update.`
        );
      } 
      return thisResult;
    })
  );

  const sortedResults = await utilities.sortUsersById(results);
  res.render("account/admin.ejs", {
    title: "Admin Panel",
    nav: nav,
    errors: null,
    user: res.locals.user,
    tableData: sortedResults,
    options: options,
  });
}




module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccount, 
  accountLogout,
  buildEditAccount,
  updateAccountInfo,
  updateAccountPassword,
  buildAdminPanel,
  processAdminBulkUpdate}
