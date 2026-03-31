// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build add classification view
router.get("/add-classification", invController.buildAddClassificationView);

// Route to add new classification
router.post("/add-classification", 
  validate.classificationRules(),
  validate.checkClassification,
  utilities.handleErrors(invController.addClassification)
);

// Route to build add vehicle view
router.get("/add-vehicle", invController.buildAddVehicleView);

// Route to add new vehicle
router.post("/add-vehicle",
  validate.inventoryRules(),
  validate.checkInventory,
  utilities.handleErrors(invController.addVehicle)
);

module.exports = router;