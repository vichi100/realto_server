// routes/miscRoutes.js
const express = require('express');
const router = express.Router();
const miscController = require('../controllers/miscController');

// Ensure all routes reference valid functions
router.post('/getGlobalSearchResult', miscController.getGlobalSearchResult);
router.post('/getTotalListingSummary', miscController.getTotalListingSummary);
router.post('/sendMessage', miscController.sendMessage);
router.post('/getMessagesList', miscController.getMessagesList);
router.post('/getSubjectDetails', miscController.getSubjectDetails);
router.post('/getAllGlobalListingByLocations', miscController.getAllGlobalListingByLocations);

// Remove or comment out routes with undefined functions
// Example: If miscController.someFunction is undefined, remove or comment out the route
// router.post('/some-endpoint', miscController.someFunction);

module.exports = router;

