const express = require('express');
const router = express.Router();
const { getmatchedResidentialCustomerRentList } = require('../controllers/matchController');

// This one is for Rent
router.post("/matchedResidentialCustomerRentList", function (req, res) {
  console.log("matchedResidentialCustomerRentList");
  getmatchedResidentialCustomerRentList(req, res);
});

module.exports = router;
