const detailsModel = require("../models/details-products-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.inv_id
  const data = await detailsModel.getInventoryDetailsById(classification_id)
  const grid = await utilities.buildDetailsView(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  res.render("./detailsInventory/details", {
    title: className,
    nav,
    grid,
  })
}


module.exports = invCont