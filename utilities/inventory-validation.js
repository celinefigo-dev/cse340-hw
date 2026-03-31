const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/* **********************************
  * Classification Validation Rules
  * ********************************** */
validate.classificationRules = () => {
  return [
    // classification_name is required and must not contain spaces or special characters
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters. Only letters and numbers are allowed."),
  ]
}

/* **************************
  * Check Classification Data
  * ************************* */
validate.checkClassification = (req, res, next) => {
  const { errors } = validationResult(req)
  if (!errors.length) {
    return next()
  }
  let nav
  utilities = require("./index")
  nav = utilities.getNav()
  return res.render("inventory/add-classification", {
    errors,
    title: "Add Classification",
    nav,
  })
}

/* **************************
  * Check Inventory Data
  * ************************* */
validate.checkInventory = async (req, res, next) => {
  const { errors } = validationResult(req)
  if (!errors.length) {
    return next()
  }
  let nav
  utilities = require("./index")
  nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(req.body.classification_id)
  return res.render("inventory/add-vehicle", {
    errors,
    title: "Add Vehicle",
    nav,
    classificationList,
    inv_make: req.body.inv_make,
    inv_model: req.body.inv_model,
    inv_year: req.body.inv_year,
    inv_description: req.body.inv_description,
    inv_price: req.body.inv_price,
    inv_miles: req.body.inv_miles,
    inv_color: req.body.inv_color,
    classification_id: req.body.classification_id,
  })
}

/* **********************************
  * New Inventory Validation Rules
  * ********************************** */
validate.inventoryRules = () => {
  return [
    // inv_make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a make."),

    // inv_model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a model."),

    // inv_year is required and must be a valid year (4 digits)
    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Please provide a year.")
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be 4 digits."),

    // inv_description is required
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Please provide a description."),

    // inv_image is required
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide an image path."),

    // inv_thumbnail is required
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide a thumbnail path."),

    // inv_price is required and must be a number
    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Please provide a price.")
      .isNumeric()
      .withMessage("Price must be a number."),

    // inv_miles is required and must be a number
    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Please provide miles.")
      .isNumeric()
      .withMessage("Miles must be a number."),

    // inv_color is required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a color."),

    // classification_id is required
    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification.")
      .isNumeric()
      .withMessage("Classification must be selected."),
  ]
}

module.exports = validate