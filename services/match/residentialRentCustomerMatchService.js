// services/match/residentialRentCustomerMatchService.js
const ResidentialRentCustomerMatch = require('../../models/match/residentialRentCustomerMatch');
const ResidentialPropertyRent = require('../../models/residentialPropertyRent');
const User = require('../../models/user');
const AppError = require('../../utils/appError');
const { replaceOwnerDetailsWithAgentDetails } = require('../../utils/helpers');

class ResidentialRentCustomerMatchService {
  static async getMatchedResidentialProptiesRentList(customerId, reqUserId) {
    const matchedPCustomer = await ResidentialRentCustomerMatch.findOne({ customer_id: customerId }).lean().exec();

    if (!matchedPCustomer) {
      return { matchedPropertyDetailsMine: [], matchedPropertyDetailsOther: [] };
    }

    const mineMatchedPropertyList = matchedPCustomer.matched_property_id_mine || [];
    const mineMatchedPropertyDictList = new Map(mineMatchedPropertyList.map(p => [p.property_id, p.matched_percentage]));

    const otherMatchedPropertyList = matchedPCustomer.matched_property_id_other || [];
    const otherMatchedPropertyDictList = new Map(otherMatchedPropertyList.map(p => [p.property_id, p.matched_percentage]));

    const matchedPropertyMineIds = mineMatchedPropertyList.map(property => property.property_id);
    const matchedPropertyRentDetailsMine = await ResidentialPropertyRent.find({ property_id: { $in: matchedPropertyMineIds } }).lean().exec();

    matchedPropertyRentDetailsMine.forEach(prop => {
      prop.matched_percentage = mineMatchedPropertyDictList.get(prop.property_id);
    });
    const matchedPropertyDetailsMine = [...matchedPropertyRentDetailsMine];

    const matchedPropertyOtherIds = otherMatchedPropertyList.map(property => property.property_id);
    let matchedPropertyRentDetailsOther = await ResidentialPropertyRent.find({ property_id: { $in: matchedPropertyOtherIds } }).lean().exec();

    matchedPropertyRentDetailsOther.forEach(prop => {
      prop.matched_percentage = otherMatchedPropertyDictList.get(prop.property_id);
    });

    const maskedOtherProperties = await replaceOwnerDetailsWithAgentDetails(matchedPropertyRentDetailsOther, reqUserId);

    return {
      matchedPropertyDetailsMine,
      matchedPropertyDetailsOther: maskedOtherProperties
    };
  }
}

module.exports = ResidentialRentCustomerMatchService;