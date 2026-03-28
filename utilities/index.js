const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  console.log(data)
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build the inventory view HTML
 * ************************************ */

Util.buildInventoryGrid = async function (data) {
  let grid;
  console.log("data length", data.length);
  let vehicle = data[0];
  switch (data.length) {
    case 0:
      grid = `<p>Sorry, we can't find any matching vehicles could be found.</p>`;
      break;
    case 1:
      // grid = '<div><h1>' + vehicle.inv_model + ' ' + vehicle.inv_make + '</h1><div class="inv__details">'+ vehicle.inv_model + ' ' + vehicle.inv_make + '</div></div>'
      grid = `
            <div id="inv_page__detail">
              <div class="inv__image">
                <img src="${vehicle.inv_image}" alt="Image of ${
        vehicle.inv_color
      } ${vehicle.inv_make} ${vehicle.inv_model}"></div>
              <div class="inv__details"> 
                <h2> ${vehicle.inv_model} ${vehicle.inv_make} details</h2>
                <ul class="inv__details-content">
                  <li><span>Price:</span> <span>$ ${vehicle.inv_price.toLocaleString()}</span></li>
                  <li><span>Miles:</span> <span>${vehicle.inv_miles.toLocaleString()}</span></li>
                 <li><span>Color:</span> <span>${vehicle.inv_color}</span></li>
                 <li class="inv__details-content_description" ><span>Description: </span><span>${
                   vehicle.inv_description
                 }</span></li></ul>
              </div>
            </div>`;
      break;
    default:
      grid = "<p>Sorry, no matching vehicles could be found.</p";
  }
  return grid;
};

//Build inventory dropdown
Util.buildClassificationDropdown = async function (classification_id) {
  let selectedOption = classification_id;
  let data = await invModel.getClassifications();
  console.log("buildClassificationDropdown data", data);
  let classDropOptions = "";
  data.rows.forEach((row) => {
    if (row.classification_id == selectedOption) {
      classDropOptions += `<option value="${row.classification_id}" selected>${row.classification_name}</option>`;
    } else {
      classDropOptions += `<option value="${row.classification_id}">${row.classification_name}</option>`;
    }
  });
  console.log("classDrop", classDropOptions);
  return classDropOptions;
};


/* ****************************************
 *  Check Login JWT
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  // console.log("Checking login");
  try {
    const decoded = jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (res.locals.loggedin && req.cookies.jwt && decoded) {
      console.log("Token passed");
      console.log("Checking decoded Token:", decoded);
      res.locals.user = decoded;
      //saving account_id to use on ratings
      req.session.account_id = decoded.account_id;
      next();
    } else {
      Util.accountFail(req, res, next);
    }
  } catch (error) {
    Util.accountFail(req, res, next);
  }
};

/*Util.checkLogin = (requ, res, next) => {
  if (res.locals.loggedin){
    next()
  }else{
    requ.flash("notice","Please log in")
    return res.redirect("/account/login")
  }
}*/



/* **************************************
* Formatting the item detail view HTML
* ************************************ */
Util.formatItem = async function(item){
  const formattedPrice = Number(item.inv_price).toLocaleString('en-US', {style: 'currency', currency: 'USD'})
  const formattedMileage = Number(item.inv_miles).toLocaleString()

  const itemHTML = `
  <div class = "detail">
    <img src ="${item.inv_image}" alt = "${item.inv_make} ${item.inv_model}" class="image" />
    <div class = "item-content">
      <h2>${item.inv_make} ${item.inv_model}</h2>
      <p>Make and Model:${item.inv_make} ${item.inv_model}</p>
      <p>Year: ${item.inv_year}</p>
      <p>Price: ${formattedPrice}</p>
      <p>Mileage: ${formattedMileage}</p>
      <p>Description: ${item.inv_description}</p>
    </div>
  </div>
    `
  return itemHTML
}

//Check token validity
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt){
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function(err, accountData){
        if(err){
          req.flash("notice", "Please Log In")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  }else{
    next()
  }
}


Util.accountFail = (req, res, next) => {
  req.flash("notice", "Please log in.");
  res.clearCookie("jwt");
  res.locals.loggedin = 0;
  res.locals.user = "";
  return res.redirect("/account/login");
};

Util.accountTypeCheck = (req, res, next) => {
  try {
    if (
      res.locals.loggedin &&
      req.cookies.jwt &&
      !(
        res.locals.user.account_type === "Admin" ||
        res.locals.user.account_type === "Employee"
      )
    ) {
      req.flash(
        "notice",
        "You are not have sufficient permission to access this resource. Please log into an authorized account."
      );
      return res.redirect("/account/login");
    }
    next();
  } catch (error) {
    checkJWTToken(req, res, next);
  }
};
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 *  check Account Type for permissions
 * if account type !admin and !employee, redirect + error to login page
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  try {
    if (
      res.locals.loggedin &&
      req.cookies.jwt &&
      !(
        res.locals.user.account_type === "Admin" ||
        res.locals.user.account_type === "Employee"
      )
    ) {
      req.flash(
        "notice",
        "You are not have sufficient permission to access this resource. Please log into an authorized account."
      );
      return res.redirect("/account/login");
    }
    next();
  } catch (error) {
    Util.checkJWTToken(req, res, next);
  }
};


/* ****************************************
 *  Check Ownership
 * ************************************ */
Util.checkOwnership = (req, res, next) => {
  try {
    if (
      res.locals.loggedin &&
      req.cookies.jwt &&
        res.locals.user.account_type !== "Owner"
    ) {
      req.flash(
        "notice",
        "You are not have sufficient permission to access this resource. Please log into an authorized account."
      );
      return res.redirect("/account/login");
    }
    next();
  } catch (error) {
    checkJWTToken(req, res, next);
  }
};

Util.sortUsersById = async function (data){
  // console.log("Data to be sorted: ", data);
  sortedData = await data.sort((a, b) => a.account_id - b.account_id);
  // console.log("Sorted Data: ", sortedData);
  return sortedData;
}


module.exports = Util