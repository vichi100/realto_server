// services/match/commercialBuyCustomerMatchService.js
const CommercialBuyCustomerMatch = require('../../models/match/commercialBuyCustomerMatch');
const CommercialPropertySell = require('../../models/commercialPropertySell'); // Assuming sell is the "buy" for properties
const User = require('../../models/user');
const AppError = require('../../utils/appError');
const { replaceOwnerDetailsWithAgentDetails } = require('../../utils/helpers');

class CommercialBuyCustomerMatchService {
  static async getMatchedCommercialProptiesBuyList(customerId, reqUserId) {
    const matchedPCustomer = await CommercialBuyCustomerMatch.findOne({ customer_id: customerId }).lean().exec();

    if (!matchedPCustomer) {
      return { matchedPropertyDetailsMine: [], matchedPropertyDetailsOther: [] };
    }

    const mineMatchedPropertyDictList = matchedPCustomer.matched_property_id_mine || [];
    const mineMatchedPropertyMap = new Map(mineMatchedPropertyDictList.map(p => [p.property_id, p.matched_percentage]));

    const otherMatchedPropertyDictList = matchedPCustomer.matched_property_id_other || [];
    const otherMatchedPropertyMap = new Map(otherMatchedPropertyDictList.map(p => [p.property_id, p.matched_percentage]));

    const matchedPropertyMineIds = mineMatchedPropertyDictList.map(property => property.property_id);
    const matchedPropertyRentDetailsMine = await CommercialPropertySell.find({ property_id: { $in: matchedPropertyMineIds } }).lean().exec();

    matchedPropertyRentDetailsMine.forEach(prop => {
      prop.matched_percentage = mineMatchedPropertyMap.get(prop.property_id);
    });
    const matchedPropertyDetailsMine = [...matchedPropertyRentDetailsMine];

    const matchedPropertyOtherIds = otherMatchedPropertyDictList.map(property => property.property_id);
    let matchedPropertyRentDetailsOther = await CommercialPropertySell.find({ property_id: { $in: matchedPropertyOtherIds } }).lean().exec();

    matchedPropertyRentDetailsOther.forEach(prop => {
      prop.matched_percentage = otherMatchedPropertyMap.get(prop.property_id);
    });

    const maskedOtherProperties = await replaceOwnerDetailsWithAgentDetails(matchedPropertyRentDetailsOther, reqUserId);

    return {
      matchedPropertyDetailsMine,
      matchedPropertyDetailsOther: maskedOtherProperties
    };
  }
}

module.exports = CommercialBuyCustomerMatchService;