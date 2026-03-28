// Handling errors
const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

// route
router.get('/generate-error', errorController.triggerError);

module.exports = router;