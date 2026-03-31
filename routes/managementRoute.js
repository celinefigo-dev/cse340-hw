// Needed Resources 
const express = require("express")
const router = new express.Router()
const managementController = require("../controllers/managementController")

// Route to build management view
router.get("/", managementController.buildManagement)

module.exports = router