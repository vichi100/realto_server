// routes/matchRoutes.js
const express = require('express');
const commercialBuyCustomerMatchController = require('../controllers/match/commercialBuyCustomerMatchController');
const commercialBuyPropertyMatchController = require('../controllers/match/commercialBuyPropertyMatchController');
const commercialRentCustomerMatchController = require('../controllers/match/commercialRentCustomerMatchController');
const commercialRentPropertyMatchController = require('../controllers/match/commercialRentPropertyMatchController');
const residentialBuyCustomerMatchController = require('../controllers/match/residentialBuyCustomerMatchController');
const residentialBuyPropertyMatchController = require('../controllers/match/residentialBuyPropertyMatchController');
const residentialRentCustomerMatchController = require('../controllers/match/residentialRentCustomerMatchController');
const residentialRentPropertyMatchController = require('../controllers/match/residentialRentPropertyMatchController');

const router = express.Router();

// Residential Matches
router.post("/matchedResidentialCustomerRentList", residentialRentPropertyMatchController.getMatchedResidentialCustomerRentList);
router.post("/matchedResidentialProptiesRentList", residentialRentCustomerMatchController.getMatchedResidentialProptiesRentList);
router.post("/matchedResidentialProptiesBuyList", residentialBuyCustomerMatchController.matchedResidentialProptiesBuyList);
router.post("/matchedResidentialCustomerBuyList", residentialBuyPropertyMatchController.getMatchedResidentialCustomerBuyList);

// Commercial Matches
router.post("/matchedCommercialProptiesRentList", commercialRentCustomerMatchController.getMatchedCommercialProptiesRentList);
router.post("/matchedCommercialProptiesBuyList", commercialBuyCustomerMatchController.getMatchedCommercialProptiesBuyList);
router.post("/matchedCommercialCustomerRentList", commercialRentPropertyMatchController.getMatchedCommercialCustomerRentList);
router.post("/matchedCommercialCustomerSellList", commercialBuyPropertyMatchController.getMatchedCommercialCustomerSellList);

module.exports = router;