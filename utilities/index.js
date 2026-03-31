const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = '<ul class="navegation">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  // Route to build inventory by classification view
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
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_image
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
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
* Build the details view HTML
* ************************************ */
Util.buildDetailsView = async function (data) {
  let grid
  if (data.length > 0) {
    data.forEach(vehicle => {
      grid = '<div class="detailsView">'
      grid += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" />'
      grid += '<div class="details">'
      grid += '<h3>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h3>'
      grid += '<h4>Price:$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</h4>';
      grid += '<strong>Description: </strong>';
      grid += '<span>' + vehicle.inv_description + '</span>';
      grid += '<br />'
      grid += '<br />'
      grid += '<strong>Color: </strong>';
      grid += '<span> ' + vehicle.inv_color + ' </span>'
      grid += '<br />'
      grid += '<br />'
      grid += '<strong>Miles: </strong>';
      grid += '<span> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span>'
    })
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the vehicle Management view HTML
* ************************************ */
Util.buildVehicleManagementView = async function (data) {
  let grid
  grid = '<ul id="vehicle-management">'
  grid += '<li>'
  grid += '<a href="/inv/add-classification" title="Add a new classification">' + 'Add New Classification' + '</a>'
  grid += '</li>'
  grid += '<li>'
  grid += '<a href="/inv/add-vehicle" title="Add a new vehicle">' + 'Add New Vehicle' + '</a>'
  grid += '</li>'
  grid += '</ul>'
  return grid
}


/* **************************************
* Build the Classification List dropdown
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}




/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util