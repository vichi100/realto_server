// services/match/commercialRentCustomerMatchService.js
const CommercialRentCustomerMatch = require('../../models/match/commercialRentCustomerMatch');
const CommercialPropertyRent = require('../../models/commercialPropertyRent');
const User = require('../../models/user');
const AppError = require('../../utils/appError');
const { replaceOwnerDetailsWithAgentDetails } = require('../../utils/helpers');

class CommercialRentCustomerMatchService {
  static async getMatchedCommercialProptiesRentList(customerId, reqUserId) {
    const matchedPCustomer = await CommercialRentCustomerMatch.findOne({ customer_id: customerId }).lean().exec();

    if (!matchedPCustomer) {
      return { matchedPropertyDetailsMine: [], matchedPropertyDetailsOther: [] };
    }

    const mineMatchedPropertyList = matchedPCustomer.matched_property_id_mine || [];
    const mineMatchedPropertyMap = new Map(mineMatchedPropertyList.map(p => [p.property_id, p.matched_percentage]));

    const otherMatchedPropertyList = matchedPCustomer.matched_property_id_other || [];
    const otherMatchedPropertyMap = new Map(otherMatchedPropertyList.map(p => [p.property_id, p.matched_percentage]));

    const matchedPropertyMineIds = mineMatchedPropertyList.map(property => property.property_id);
    const matchedPropertyRentDetailsMine = await CommercialPropertyRent.find({ property_id: { $in: matchedPropertyMineIds } }).lean().exec();

    matchedPropertyRentDetailsMine.forEach(prop => {
      prop.matched_percentage = mineMatchedPropertyMap.get(prop.property_id);
    });
    const matchedPropertyDetailsMine = [...matchedPropertyRentDetailsMine];

    const matchedPropertyOtherIds = otherMatchedPropertyList.map(property => property.property_id);
    let matchedPropertyRentDetailsOther = await CommercialPropertyRent.find({ property_id: { $in: matchedPropertyOtherIds } }).lean().exec();

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

module.exports = CommercialRentCustomerMatchService;