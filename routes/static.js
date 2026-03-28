const express = require('express');
const router = express.Router();
const staticController = require('../controllers/staticController')

// Static files
router.use(express.static("public"));

// Routes
router.get("/", staticController.buildHome)
router.get("/about", staticController.buildAbout)
router.get("/contact", staticController.buildContact)

module.exports = router;