// services/match/residentialBuyPropertyMatchService.js
const ResidentialBuyPropertyMatch = require('../../models/match/residentialBuyPropertyMatch');
const ResidentialPropertyCustomerBuy = require('../../models/residentialPropertyCustomerBuy');
const User = require('../../models/user');
const AppError = require('../../utils/appError');
const { replaceCustomerDetailsWithAgentDetails } = require('../../utils/helpers');

class ResidentialBuyPropertyMatchService {
  static async getMatchedResidentialCustomerBuyList(propertyId, reqUserId) {
    const matchedProperty = await ResidentialBuyPropertyMatch.findOne({ property_id: propertyId }).lean().exec();

    if (!matchedProperty) {
      return { matchedCustomerDetailsMine: [], matchedCustomerDetailsOther: [] };
    }

    const myMatchedCustomeryList = matchedProperty.matched_customer_id_mine || [];
    const myMatchedCustomeryDictList = new Map(myMatchedCustomeryList.map(c => [c.customer_id, c.matched_percentage]));

    const otherMatchedCustomeryList = matchedProperty.matched_customer_id_other || [];
    const otherMatchedCustomeryDictList = new Map(otherMatchedCustomeryList.map(c => [c.customer_id, c.matched_percentage]));

    const matchedCustomerMineIds = myMatchedCustomeryList.map(customer => customer.customer_id);
    const matchedCustomerRentDetailsMine = await ResidentialPropertyCustomerBuy.find({ customer_id: { $in: matchedCustomerMineIds } }).lean().exec();

    matchedCustomerRentDetailsMine.forEach(cust => {
      cust.matched_percentage = myMatchedCustomeryDictList.get(cust.customer_id);
    });
    const matchedCustomerDetailsMine = [...matchedCustomerRentDetailsMine];

    const matchedCustomerOtherIds = otherMatchedCustomeryList.map(customer => customer.customer_id);
    let matchedCustomerRentDetailsOther = await ResidentialPropertyCustomerBuy.find({ customer_id: { $in: matchedCustomerOtherIds } }).lean().exec();

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

module.exports = ResidentialBuyPropertyMatchService;