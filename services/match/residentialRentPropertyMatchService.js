// services/match/residentialRentPropertyMatchService.js
const ResidentialRentPropertyMatch = require('../../models/match/residentialRentPropertyMatch');
const ResidentialPropertyCustomerRent = require('../../models/residentialPropertyCustomerRent');
const User = require('../../models/user');
const AppError = require('../../utils/appError');
const { replaceCustomerDetailsWithAgentDetails } = require('../../utils/helpers');

class ResidentialRentPropertyMatchService {
  static async getMatchedResidentialCustomerRentList(propertyId, reqUserId) {
    const matchedProperty = await ResidentialRentPropertyMatch.findOne({ property_id: propertyId }).lean().exec();

    if (!matchedProperty) {
      return { matchedCustomerDetailsMine: [], matchedCustomerDetailsOther: [] };
    }

    const myMatchedCustomeryList = matchedProperty.matched_customer_id_mine || [];
    const myMatchedCustomeryDictList = new Map(myMatchedCustomeryList.map(c => [c.customer_id, c.matched_percentage]));

    const otherMatchedCustomeryList = matchedProperty.matched_customer_id_other || [];
    const otherMatchedCustomeryDictList = new Map(otherMatchedCustomeryList.map(c => [c.customer_id, c.matched_percentage]));

    const matchedCustomerMineIds = myMatchedCustomeryList.map(customer => customer.customer_id);
    const matchedCustomerRentDetailsMine = await ResidentialPropertyCustomerRent.find({ customer_id: { $in: matchedCustomerMineIds } }).lean().exec();

    matchedCustomerRentDetailsMine.forEach(cust => {
      cust.matched_percentage = myMatchedCustomeryDictList.get(cust.customer_id);
    });
    const matchedCustomerDetailsMine = [...matchedCustomerRentDetailsMine];

    const matchedCustomerOtherIds = otherMatchedCustomeryList.map(customer => customer.customer_id);
    let matchedCustomerRentDetailsOther = await ResidentialPropertyCustomerRent.find({ customer_id: { $in: matchedCustomerOtherIds } }).lean().exec();

    matchedCustomerRentDetailsOther.forEach(cust => {
      cust.matched_percentage = otherMatchedCustomeryDictList.get(cust.customer_id);
    });

    const maskedOtherCustomers = await replaceCustomerDetailsWithAgentDetails(matchedCustomerRentDetailsOther, reqUserId);

    return {
      matchedCustomerDetailsMine,
      matchedCustomerDetailsOther: maskedOtherCustomers
    };
  }
}

module.exports = ResidentialRentPropertyMatchService;