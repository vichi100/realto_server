const ResidentialRentPropertyMatch = require('../models/match/residentialRentPropertyMatch');
const ResidentialPropertyCustomerRent = require('../models/residentialPropertyCustomerRent');

const getmatchedResidentialCustomerRentList = async (req, res) => {
  try {
    const propertyDetails = JSON.parse(JSON.stringify(req.body));
    const property_id = propertyDetails.property_id;

    // 1) Get matched property using property_id from residentialRentPropertyMatch
    const matchedProperty = await ResidentialRentPropertyMatch.findOne({ property_id: property_id });

    if (!matchedProperty) {
      res.status(404).send("No matched property found");
      return;
    }

    // 2) Get matched_customer_id_mine from matched property
    const matchedCustomerMineIds = matchedProperty.matched_customer_id_mine.map(customer => customer.customer_id);

    // 3) Get customer details using matched_customer_id_mine from residentialPropertyCustomerRent
    const matchedCustomerRentDetailsMine = await ResidentialPropertyCustomerRent.find({ customer_id: { $in: matchedCustomerMineIds } });

    const matchedCustomerDetailsMine = [...matchedCustomerRentDetailsMine];

    // 4) Get matched_customer_id_other from matched property
    const matchedCustomerOtherIds = matchedProperty.matched_customer_id_other.map(customer => customer.customer_id);

    // 5) Get customer details using matched_customer_id_other from residentialPropertyCustomerRent
    const matchedCustomerRentDetailsOther = await ResidentialPropertyCustomerRent.find({ customer_id: { $in: matchedCustomerOtherIds } });

    const matchedCustomerDetailsOther = [...matchedCustomerRentDetailsOther];
    // after getting   matchedCustomerDetailsOther replace customer deatils with the agent deatils 
    // 6) Send both customer details
    res.send({
      matchedCustomerDetailsMine,
      matchedCustomerDetailsOther
    });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getmatchedResidentialCustomerRentList
};
