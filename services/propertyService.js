// services/propertyService.js
const ResidentialPropertyRent = require("../models/residentialPropertyRent");
const ResidentialPropertySell = require('../models/residentialPropertySell');
const CommercialPropertyRent = require("../models/commercialPropertyRent");
const CommercialPropertySell = require("../models/commercialPropertySell");
const AppError = require('../utils/appError');
const ImageService = require('./imageService');
const User = require('../models/user'); // Assuming User model path for masking
const { uniqueId, replaceOwnerDetailsWithAgentDetails } = require('../utils/helpers');

class PropertyService {
  static async addNewResidentialProperty(propertyDetails, files) {
    propertyDetails.image_urls = await ImageService.processAndSaveImages(files, propertyDetails.agent_id);

    const locationArea = propertyDetails.property_address.location_area;
    const gLocation = locationArea.location;
    const propertyId = uniqueId();

    const propertyDetailsDict = {
      property_id: propertyId,
      agent_id: propertyDetails.agent_id,
      property_type: propertyDetails.property_type,
      property_for: propertyDetails.property_for,
      owner_details: {
        name: propertyDetails.owner_details.name,
        mobile1: propertyDetails.owner_details.mobile1,
        mobile2: propertyDetails.owner_details.mobile2,
        address: propertyDetails.owner_details.address
      },
      location: gLocation,
      property_address: {
        city: propertyDetails.property_address.city,
        main_text: locationArea.main_text,
        formatted_address: locationArea.formatted_address,
        flat_number: propertyDetails.property_address.flat_number,
        building_name: propertyDetails.property_address.building_name,
        landmark_or_street: propertyDetails.property_address.landmark_or_street,
        pin: propertyDetails.property_address.pin
      },
      property_details: {
        house_type: propertyDetails.property_details.house_type,
        bhk_type: propertyDetails.property_details.bhk_type,
        washroom_numbers: propertyDetails.property_details.washroom_numbers,
        furnishing_status: propertyDetails.property_details.furnishing_status,
        parking_type: propertyDetails.property_details.parking_type,
        parking_number: propertyDetails.property_details.parking_number,
        property_age: propertyDetails.property_details.property_age,
        floor_number: propertyDetails.property_details.floor_number,
        total_floor: propertyDetails.property_details.total_floor,
        lift: propertyDetails.property_details.lift,
        property_size: propertyDetails.property_details.property_size
      },
      image_urls: propertyDetails.image_urls,
      create_date_time: new Date(),
      update_date_time: new Date()
    };

    let savedProperty;
    if (propertyDetails.property_for === "Rent") {
      propertyDetailsDict.rent_details = {
        expected_rent: propertyDetails.rent_details.expected_rent,
        expected_deposit: propertyDetails.rent_details.expected_deposit,
        available_from: propertyDetails.rent_details.available_from,
        preferred_tenants: propertyDetails.rent_details.preferred_tenants,
        non_veg_allowed: propertyDetails.rent_details.non_veg_allowed
      };
      savedProperty = await ResidentialPropertyRent.create(propertyDetailsDict);
    } else if (propertyDetails.property_for === "Sell") {
      propertyDetailsDict.sell_details = {
        expected_sell_price: propertyDetails.sell_details.expected_sell_price,
        maintenance_charge: propertyDetails.sell_details.maintenance_charge,
        available_from: propertyDetails.sell_details.available_from,
        negotiable: propertyDetails.sell_details.negotiable
      };
      savedProperty = await ResidentialPropertySell.create(propertyDetailsDict);
    } else {
      throw new AppError('Invalid property purpose for residential property.', 400);
    }

    return savedProperty.toObject();
  }

  static async addNewCommercialProperty(propertyDetails, files) {
    propertyDetails.image_urls = await ImageService.processAndSaveImages(files, propertyDetails.agent_id);

    const locationArea = propertyDetails.property_address.location_area;
    const gLocation = locationArea.location;
    const propertyId = uniqueId();

    const propertyDetailsDict = {
      property_id: propertyId,
      agent_id: propertyDetails.agent_id,
      property_type: propertyDetails.property_type,
      property_for: propertyDetails.property_for,
      owner_details: {
        name: propertyDetails.owner_details.name,
        mobile1: propertyDetails.owner_details.mobile1,
        mobile2: propertyDetails.owner_details.mobile2,
        address: propertyDetails.owner_details.address
      },
      location: gLocation,
      property_address: {
        city: propertyDetails.property_address.city,
        main_text: locationArea.main_text,
        formatted_address: locationArea.formatted_address,
        flat_number: propertyDetails.property_address.flat_number,
        building_name: propertyDetails.property_address.building_name,
        landmark_or_street: propertyDetails.property_address.landmark_or_street,
        pin: propertyDetails.property_address.pin
      },
      property_details: {
        property_used_for: propertyDetails.property_details.property_used_for,
        building_type: propertyDetails.property_details.building_type,
        ideal_for: propertyDetails.property_details.ideal_for,
        parking_type: propertyDetails.property_details.parking_type,
        property_age: propertyDetails.property_details.property_age,
        power_backup: propertyDetails.property_details.power_backup,
        property_size: propertyDetails.property_details.property_size
      },
      image_urls: propertyDetails.image_urls,
      create_date_time: new Date(),
      update_date_time: new Date()
    };

    let savedProperty;
    if (propertyDetails.property_for === "Rent") {
      propertyDetailsDict.rent_details = {
        expected_rent: propertyDetails.rent_details.expected_rent,
        expected_deposit: propertyDetails.rent_details.expected_deposit,
        available_from: propertyDetails.rent_details.available_from
      };
      savedProperty = await CommercialPropertyRent.create(propertyDetailsDict);
    } else if (propertyDetails.property_for === "Sell") {
      propertyDetailsDict.sell_details = {
        expected_sell_price: propertyDetails.sell_details.expected_sell_price,
        maintenance_charge: propertyDetails.sell_details.maintenance_charge,
        available_from: propertyDetails.sell_details.available_from,
        negotiable: propertyDetails.sell_details.negotiable
      };
      savedProperty = await CommercialPropertySell.create(propertyDetailsDict);
    } else {
      throw new AppError('Invalid property purpose for commercial property.', 400);
    }

    return savedProperty.toObject();
  }

  static async getCommercialPropertyListings(agentId, reqUserId) {
    let allProperties = [];
    if (reqUserId === agentId) {
      const commercialPropertyRentData = await CommercialPropertyRent.find({ agent_id: agentId }).lean().exec();
      const commercialPropertySellData = await CommercialPropertySell.find({ agent_id: agentId }).lean().exec();
      allProperties = [...commercialPropertyRentData, ...commercialPropertySellData];
    } else {
      const empObj = await User.findOne({ id: reqUserId }).lean().exec();
      if (!empObj) {
        throw new AppError('Employee not found.', 404);
      }
      const commercialPropertyRentIds = empObj.assigned_commercial_rent_properties || [];
      const commercialPropertySellIds = empObj.assigned_commercial_sell_properties || [];
      const commercialPropertyRentData = await CommercialPropertyRent.find({ property_id: { $in: commercialPropertyRentIds } }).lean().exec();
      const commercialPropertySellData = await CommercialPropertySell.find({ property_id: { $in: commercialPropertySellIds } }).lean().exec();
      allProperties = [...commercialPropertyRentData, ...commercialPropertySellData];
    }
    allProperties.sort((a, b) => new Date(b.update_date_time) - new Date(a.update_date_time));
    return allProperties;
  }

  static async getResidentialPropertyListings(agentId, reqUserId) {
    let allProperties = [];
    if (reqUserId === agentId) {
      const residentialPropertyRentData = await ResidentialPropertyRent.find({ agent_id: agentId }).lean().exec();
      const residentialPropertySellData = await ResidentialPropertySell.find({ agent_id: agentId }).lean().exec();
      allProperties = [...residentialPropertyRentData, ...residentialPropertySellData];
    } else {
      const empObj = await User.findOne({ id: reqUserId }).lean().exec();
      if (!empObj) {
        throw new AppError('Employee not found.', 404);
      }
      const residentialPropertyRentIds = empObj.assigned_residential_rent_properties || [];
      const residentialPropertySellIds = empObj.assigned_residential_sell_properties || [];
      const residentialPropertyRentData = await ResidentialPropertyRent.find({ property_id: { $in: residentialPropertyRentIds } }).lean().exec();
      const residentialPropertySellData = await ResidentialPropertySell.find({ property_id: { $in: residentialPropertySellIds } }).lean().exec();
      allProperties = [...residentialPropertyRentData, ...residentialPropertySellData];
    }
    allProperties.sort((a, b) => new Date(b.update_date_time) - new Date(a.update_date_time));
    return allProperties;
  }

  static async getPropertyListingForMeeting(agentId, propertyType, customerId, customerAgentId, reqUserId, propertyFor) {
    let PropertyModel;
    let MatchModel;

    if (propertyType === "Residential") {
      propertyFor = (propertyFor === "Buy") ? "Sell" : propertyFor; // Normalize for property_for
      if (propertyFor === "Rent") {
        PropertyModel = ResidentialPropertyRent;
        MatchModel = require('../models/match/residentialRentCustomerMatch');
      } else if (propertyFor === "Sell") {
        PropertyModel = ResidentialPropertySell;
        MatchModel = require('../models/match/residentialBuyCustomerMatch');
      } else {
        throw new AppError('Invalid property purpose for residential property.', 400);
      }
    } else if (propertyType === "Commercial") {
      propertyFor = (propertyFor === "Buy") ? "Sell" : propertyFor; // Normalize for property_for
      if (propertyFor === "Rent") {
        PropertyModel = CommercialPropertyRent;
        MatchModel = require('../models/match/commercialRentCustomerMatch');
      } else if (propertyFor === "Sell") {
        PropertyModel = CommercialPropertySell;
        MatchModel = require('../models/match/commercialBuyCustomerMatch');
      } else {
        throw new AppError('Invalid property purpose for commercial property.', 400);
      }
    } else {
      throw new AppError('Invalid property type.', 400);
    }

    const myPropertyRentListX = await PropertyModel.find({ agent_id: agentId, property_type: propertyType, property_for: propertyFor }).lean().exec();
    const matchedData = await MatchModel.findOne({ customer_id: customerId }).lean().exec();

    let myMatchedPropertyList = [];
    let otherPropertyListAfterMasking = [];

    if (matchedData) {
      if (reqUserId === customerAgentId) {
        const myMatchedPropertyDictList = matchedData.matched_property_id_mine;
        const myMatchedPropertyIdList = myMatchedPropertyDictList.map(item => item.property_id);
        const myMatchedPropertyMap = {};
        myMatchedPropertyDictList.forEach(item => myMatchedPropertyMap[item.property_id] = item.matched_percentage);

        myMatchedPropertyList = await PropertyModel.find({ property_id: { $in: myMatchedPropertyIdList } }).lean().exec();
        myMatchedPropertyList.forEach(property => property.matched_percentage = myMatchedPropertyMap[property.property_id]);
      }

      if (reqUserId === customerAgentId) { // Only show other agent's properties if the requesting user is the customer's agent
        const otherAgentPropertyDictList = matchedData.matched_property_id_other;
        const otherAgentPropertyList = otherAgentPropertyDictList.map(item => item.property_id);
        const otherMatchedPropertyMap = {};
        otherAgentPropertyDictList.forEach(item => otherMatchedPropertyMap[item.property_id] = item.matched_percentage);

        const otherPropertyList = await PropertyModel.find({ property_id: { $in: otherAgentPropertyList } }).lean().exec();
        for (let otherProperty of otherPropertyList) {
          otherProperty.matched_percentage = otherMatchedPropertyMap[otherProperty.property_id];
        }
        otherPropertyListAfterMasking = await replaceOwnerDetailsWithAgentDetails(otherPropertyList, reqUserId);
      }
    }

    // Merge my own properties (excluding duplicates found in myMatchedPropertyList) and all matched properties
    const finalData = [...new Set([...myMatchedPropertyList, ...myPropertyRentListX, ...otherPropertyListAfterMasking])];
    return finalData;
  }

  static async getPropertyDetailsByIdToShare(propertyObj) {
    let propQuery = null;
    if (propertyObj.property_type.toLowerCase() === "residential") {
      if (propertyObj.property_for.toLowerCase() === "rent") {
        propQuery = ResidentialPropertyRent.findOne({ property_id: propertyObj.property_id }).lean().exec();
      } else if (propertyObj.property_for.toLowerCase() === "sell") {
        propQuery = ResidentialPropertySell.findOne({ property_id: propertyObj.property_id }).lean().exec();
      }
    } else if (propertyObj.property_type.toLowerCase() === "commercial") {
      // Assuming commercial properties are stored in either CommercialPropertyRent or CommercialPropertySell
      // based on 'property_for'. Your original code used 'commercialProperty' model here, which might be a generic model.
      // Adjust this based on your actual schema design.
      if (propertyObj.property_for.toLowerCase() === "rent") {
        propQuery = CommercialPropertyRent.findOne({ property_id: propertyObj.property_id }).lean().exec();
      } else if (propertyObj.property_for.toLowerCase() === "sell") {
        propQuery = CommercialPropertySell.findOne({ property_id: propertyObj.property_id }).lean().exec();
      }
    } else {
      throw new AppError('Invalid property type for sharing.', 400);
    }

    if (!propQuery) {
      throw new AppError('Property not found or invalid property type/purpose.', 404);
    }

    const [propertyDetail, agentDetails] = await Promise.all([
      propQuery,
      User.findOne({ id: propertyObj.agent_id }).exec()
    ]);

    if (!propertyDetail || !agentDetails) {
      throw new AppError('Property or Agent details not found.', 404);
    }

    propertyDetail.owner_details = {
      name: agentDetails.name,
      mobile1: agentDetails.mobile,
      address: agentDetails.address,
    };
    return propertyDetail;
  }
}

module.exports = PropertyService;