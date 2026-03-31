const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ****************************************
*  Build add classification view
* *************************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process add classification
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  let nav = await utilities.getNav()
  
  const regResult = await invModel.addClassification(classification_name)
  
  if (regResult.rowCount > 0) {
    // Get updated nav with new classification
    nav = await utilities.getNav()
    req.flash("notice", `Classification "${classification_name}" successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      grid: await utilities.buildVehicleManagementView(),
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}

/* ****************************************
*  Build add vehicle view
* *************************************** */
invCont.buildAddVehicleView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-vehicle", {
    title: "Add Vehicle",
    nav,
    classificationList,
    errors: null
  })
}

/* ****************************************
*  Process add vehicle
* *************************************** */
invCont.addVehicle = async function (req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let nav = await utilities.getNav()
  
  const regResult = await invModel.addVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
  
  if (regResult.rowCount > 0) {
    req.flash("notice", `Vehicle "${inv_make} ${inv_model}" successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      grid: await utilities.buildVehicleManagementView(),
      errors: null
    })
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, adding the vehicle failed.")
    res.status(501).render("inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      errors: null
    })
  }
}

module.exports = invCont