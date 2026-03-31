const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const invCont = {}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const grid = await utilities.buildVehicleManagementView()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    grid,
    errors: null
  })
}

module.exports = invCont