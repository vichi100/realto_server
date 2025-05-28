// routes/customerRoutes.js
const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

router.post('/addNewResidentialCustomer', customerController.addNewResidentialCustomer);
router.post('/addNewCommercialCustomer', customerController.addNewCommercialCustomer);
router.post('/commercialCustomerList', customerController.getCommercialCustomerListings);
router.post('/residentialCustomerList', customerController.getResidentialCustomerListings);
router.post('/getCustomerDetailsByIdToShare', customerController.getCustomerDetailsByIdToShare);
router.post('/getCustomerListForMeeting', customerController.getCustomerListForMeeting);


module.exports = router;
