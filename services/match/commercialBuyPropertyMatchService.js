// services/match/commercialBuyPropertyMatchService.js
const CommercialBuyPropertyMatch = require('../../models/match/commercialBuyPropertyMatch');
const CommercialPropertyCustomerBuy = require('../../models/commercialPropertyCustomerBuy');
const User = require('../../models/user');
const AppError = require('../../utils/appError');
const { replaceCustomerDetailsWithAgentDetails } = require('../../utils/helpers');

class CommercialBuyPropertyMatchService {
  static async getMatchedCommercialCustomerSellList(propertyId, reqUserId) {
    const matchedProperty = await CommercialBuyPropertyMatch.findOne({ property_id: propertyId }).lean().exec();

    if (!matchedProperty) {
      return { matchedCustomerDetailsMine: [], matchedCustomerDetailsOther: [] };
    }

    const myMatchedCustomeryList = matchedProperty.matched_customer_id_mine || [];
    const myMatchedCustomeryDictList = new Map(myMatchedCustomeryList.map(c => [c.customer_id, c.matched_percentage]));

    const otherMatchedCustomeryList = matchedProperty.matched_customer_id_other || [];
    const otherMatchedCustomeryDictList = new Map(otherMatchedCustomeryList.map(c => [c.customer_id, c.matched_percentage]));

    const matchedCustomerMineIds = myMatchedCustomeryList.map(customer => customer.customer_id);
    const matchedCustomerBuyDetailsMine = await CommercialPropertyCustomerBuy.find({ customer_id: { $in: matchedCustomerMineIds } }).lean().exec();

    matchedCustomerBuyDetailsMine.forEach(cust => {
      cust.matched_percentage = myMatchedCustomeryDictList.get(cust.customer_id);
    });
    const matchedCustomerDetailsMine = [...matchedCustomerBuyDetailsMine];

    const matchedCustomerOtherIds = otherMatchedCustomeryList.map(customer => customer.customer_id);
    let matchedCustomerBuyDetailsOther = await CommercialPropertyCustomerBuy.find({ customer_id: { $in: matchedCustomerOtherIds } }).lean().exec();

    matchedCustomerBuyDetailsOther.forEach(cust => {
      cust.matched_percentage = otherMatchedCustomeryDictList.get(cust.customer_id);
    });

    const maskedOtherCustomers = await replaceCustomerDetailsWithAgentDetails(matchedCustomerBuyDetailsOther, reqUserId);

    return {
      matchedCustomerDetailsMine,
      matchedCustomerDetailsOther: maskedOtherCustomers
    };
  }
}

module.exports = CommercialBuyPropertyMatchService;