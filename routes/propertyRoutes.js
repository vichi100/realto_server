// routes/propertyRoutes.js
const express = require('express');
const propertyController = require('../controllers/propertyController');

const router = express.Router();

router.post('/addNewResidentialProperty', propertyController.addNewResidentialProperty);
router.post('/addNewCommercialProperty', propertyController.addNewCommercialProperty);
router.post('/commercialPropertyListings', propertyController.getCommercialPropertyListings);
router.post('/residentialPropertyListings', propertyController.getResidentialPropertyListings);
router.post('/getPropertyListingForMeeting', propertyController.getPropertyListingForMeeting);
router.post('/getPropertyDetailsByIdToShare', propertyController.getPropertyDetailsByIdToShare);


module.exports = router;

