// services/globalSearchService.js
const ResidentialPropertyRent = require("../models/residentialPropertyRent");
const ResidentialPropertySell = require('../models/residentialPropertySell');
const CommercialPropertyRent = require("../models/commercialPropertyRent");
const CommercialPropertySell = require("../models/commercialPropertySell");
const ResidentialCustomerRentLocation = require("../models/residentialCustomerRentLocation");
const ResidentialCustomerBuyLocation = require("../models/residentialCustomerBuyLocation");
const CommercialCustomerRentLocation = require("../models/commercialCustomerRentLocation");
const CommercialCustomerBuyLocation = require("../models/commercialCustomerBuyLocation");
const ResidentialPropertyCustomerRent = require("../models/residentialPropertyCustomerRent");
const ResidentialPropertyCustomerBuy = require("../models/residentialPropertyCustomerBuy");
const CommercialPropertyCustomerRent = require("../models/commercialPropertyCustomerRent");
const CommercialPropertyCustomerBuy = require("../models/commercialPropertyCustomerBuy");
const ResidentialRentPropertyMatch = require('../models/match/residentialRentPropertyMatch');
const ResidentialBuyPropertyMatch = require('../models/match/residentialBuyPropertyMatch');
const CommercialRentPropertyMatch = require('../models/match/commercialRentPropertyMatch');
const CommercialBuyPropertyMatch = require('../models/match/commercialBuyPropertyMatch');
const ResidentialRentCustomerMatch = require('../models/match/residentialRentCustomerMatch');
const ResidentialBuyCustomerMatch = require('../models/match/residentialBuyCustomerMatch');
const CommercialRentCustomerMatch = require('../models/match/commercialRentCustomerMatch');
const CommercialBuyCustomerMatch = require('../models/match/commercialBuyCustomerMatch');
const User = require('../models/user');
const AppError = require('../utils/appError');
const { replaceOwnerDetailsWithAgentDetails, replaceCustomerDetailsWithAgentDetails } = require('../utils/helpers');

class GlobalSearchService {
  static async getGlobalSearchResult(searchCriteria) {
    const { req_user_id, lookingFor, whatType, purpose, selectedLocationArray, city } = searchCriteria;
    const mineList = [];
    const otherList = [];
    const radiusInMiles = 55; // Your fixed radius
    const radiusInRadians = radiusInMiles / 3963.2;

    const coordinatesArray = selectedLocationArray.map(loc => loc.location.coordinates);
    const locationQueries = coordinatesArray.map(coordinates => ({
      location: { $geoWithin: { $centerSphere: [coordinates, radiusInRadians] } },
    }));

    if (lookingFor.toLowerCase() === "property") {
      let propertyModel;
      let matchDocumentModel;
      let priceField;

      if (whatType.toLowerCase() === "residential") {
        if (purpose.toLowerCase() === "rent") {
          propertyModel = ResidentialPropertyRent;
          matchDocumentModel = ResidentialRentPropertyMatch;
          priceField = "rent_details.expected_rent";
        } else if (purpose.toLowerCase() === "buy") {
          propertyModel = ResidentialPropertySell;
          matchDocumentModel = ResidentialBuyPropertyMatch;
          priceField = "sell_details.expected_sell_price";
        } else {
          throw new AppError('Invalid purpose for residential property search.', 400);
        }

        const query = {
          $or: locationQueries,
          property_for: purpose === "Buy" ? "Sell" : purpose, // Adjust purpose for sell/rent
          "property_address.city": city,
          "property_details.bhk_type": { $in: searchCriteria.selectedBHK },
          [priceField]: { $gte: searchCriteria.priceRange[0] || 0, $lte: searchCriteria.priceRange[1] || Infinity },
        };
        const properties = await propertyModel.find(query).lean().exec();

        for (const prop of properties) {
          if (prop.agent_id === req_user_id) {
            mineList.push(prop);
          } else {
            otherList.push(prop);
          }
        }

        for (const prop of otherList) {
          const result = await matchDocumentModel.aggregate([
            { $match: { property_id: prop.property_id } },
            { $unwind: "$matched_customer_id_other" },
            { $match: { "matched_customer_id_other.agent_id": req_user_id } },
            { $count: "count" }
          ]);
          prop.match_count = result.length > 0 ? result[0].count : 0;
        }

      } else if (whatType.toLowerCase() === "commercial") {
        if (purpose.toLowerCase() === "rent") {
          propertyModel = CommercialPropertyRent;
          matchDocumentModel = CommercialRentPropertyMatch;
          priceField = "rent_details.expected_rent";
        } else if (purpose.toLowerCase() === "buy") {
          propertyModel = CommercialPropertySell;
          matchDocumentModel = CommercialBuyPropertyMatch;
          priceField = "sell_details.expected_sell_price";
        } else {
          throw new AppError('Invalid purpose for commercial property search.', 400);
        }

        const query = {
          $or: locationQueries,
          property_for: purpose === "Buy" ? "Sell" : purpose,
          "property_address.city": city,
          "property_details.property_used_for": { $in: searchCriteria.selectedRequiredFor },
          "property_details.building_type": { $in: searchCriteria.selectedBuildingType },
          [priceField]: { $gte: searchCriteria.priceRange[0] || 0, $lte: searchCriteria.priceRange[1] || Infinity },
        };
        const properties = await propertyModel.find(query).lean().exec();

        for (const prop of properties) {
          if (prop.agent_id === req_user_id) {
            mineList.push(prop);
          } else {
            otherList.push(prop);
          }
        }

        for (const prop of otherList) {
          const result = await matchDocumentModel.aggregate([
            { $match: { property_id: prop.property_id } },
            { $unwind: "$matched_customer_id_other" },
            { $match: { "matched_customer_id_other.agent_id": req_user_id } },
            { $count: "count" }
          ]);
          prop.match_count = result.length > 0 ? result[0].count : 0;
        }
      } else {
        throw new AppError('Invalid property type.', 400);
      }
      const otherPropertyDataAfterMasking = await replaceOwnerDetailsWithAgentDetails(otherList, req_user_id);
      return [...mineList, ...otherPropertyDataAfterMasking];

    } else if (lookingFor.toLowerCase() === "customer") {
      let customerLocationModel;
      let customerDetailsModel;
      let matchDocumentModel;
      let customerPropertyDetailsField;
      let customerPriceField;

      const customerLocationQuery = { $or: locationQueries };

      if (whatType.toLowerCase() === "residential") {
        if (purpose.toLowerCase() === "rent") {
          customerLocationModel = ResidentialCustomerRentLocation;
          customerDetailsModel = ResidentialPropertyCustomerRent;
          matchDocumentModel = ResidentialRentCustomerMatch;
          customerPropertyDetailsField = "customer_property_details.bhk_type";
          customerPriceField = "customer_rent_details.expected_rent";
        } else if (purpose.toLowerCase() === "buy") {
          customerLocationModel = ResidentialCustomerBuyLocation;
          customerDetailsModel = ResidentialPropertyCustomerBuy;
          matchDocumentModel = ResidentialBuyCustomerMatch;
          customerPropertyDetailsField = "customer_property_details.bhk_type";
          customerPriceField = "customer_buy_details.expected_buy_price";
        } else {
          throw new AppError('Invalid purpose for residential customer search.', 400);
        }

        const residentialCustomerLocations = await customerLocationModel.find(customerLocationQuery, { customer_id: 1 }).lean().exec();
        const customerIds = residentialCustomerLocations.map(location => location.customer_id);

        const query = {
          customer_id: { $in: customerIds },
          "customer_locality.city": city,
          [customerPropertyDetailsField]: { $in: searchCriteria.selectedBHK }, // Assuming selectedBHK applies to customers too
          [customerPriceField]: { $gte: searchCriteria.priceRange[0] || 0, $lte: searchCriteria.priceRange[1] || Infinity },
        };
        const customers = await customerDetailsModel.find(query).lean().exec();

        for (const cust of customers) {
          if (cust.agent_id === req_user_id) {
            mineList.push(cust);
          } else {
            otherList.push(cust);
          }
        }

        for (const cust of otherList) {
          const result = await matchDocumentModel.aggregate([
            { $match: { customer_id: cust.customer_id } },
            { $unwind: "$matched_property_id_other" },
            { $match: { "matched_property_id_other.agent_id": req_user_id } },
            { $count: "count" }
          ]);
          cust.match_count = result.length > 0 ? result[0].count : 0;
        }

      } else if (whatType.toLowerCase() === "commercial") {
        if (purpose.toLowerCase() === "rent") {
          customerLocationModel = CommercialCustomerRentLocation;
          customerDetailsModel = CommercialPropertyCustomerRent;
          matchDocumentModel = CommercialRentCustomerMatch;
          customerPropertyDetailsField = "customer_property_details.property_used_for"; // Assuming property_used_for for commercial customers
          customerPriceField = "customer_rent_details.expected_rent";
        } else if (purpose.toLowerCase() === "buy") {
          customerLocationModel = CommercialCustomerBuyLocation;
          customerDetailsModel = CommercialPropertyCustomerBuy;
          matchDocumentModel = CommercialBuyCustomerMatch;
          customerPropertyDetailsField = "customer_property_details.property_used_for";
          customerPriceField = "customer_buy_details.expected_buy_price";
        } else {
          throw new AppError('Invalid purpose for commercial customer search.', 400);
        }

        const commercialCustomerLocations = await customerLocationModel.find(customerLocationQuery, { customer_id: 1 }).lean().exec();
        const customerIds = commercialCustomerLocations.map(location => location.customer_id);

        const query = {
          customer_id: { $in: customerIds },
          "customer_locality.city": city,
          [customerPropertyDetailsField]: { $in: searchCriteria.selectedRequiredFor }, // Assuming selectedRequiredFor for commercial customers
          "customer_property_details.building_type": { $in: searchCriteria.selectedBuildingType },
          [customerPriceField]: { $gte: searchCriteria.priceRange[0] || 0, $lte: searchCriteria.priceRange[1] || Infinity },
        };
        const customers = await customerDetailsModel.find(query).lean().exec();

        for (const cust of customers) {
          if (cust.agent_id === req_user_id) {
            mineList.push(cust);
          } else {
            otherList.push(cust);
          }
        }

        for (const cust of otherList) {
          const result = await matchDocumentModel.aggregate([
            { $match: { customer_id: cust.customer_id } },
            { $unwind: "$matched_property_id_other" },
            { $match: { "matched_property_id_other.agent_id": req_user_id } },
            { $count: "count" }
          ]);
          cust.match_count = result.length > 0 ? result[0].count : 0;
        }
      } else {
        throw new AppError('Invalid customer type.', 400);
      }
      const otherCustomerDataAfterMasking = await replaceCustomerDetailsWithAgentDetails(otherList, req_user_id);
      return [...mineList, ...otherCustomerDataAfterMasking];
    } else {
      throw new AppError('Invalid search type. Must be "property" or "customer".', 400);
    }
  }

  static async getTotalListingSummary(reqUserId, agentId) {
    let residentialPropertyRentCount = 0;
    let residentialPropertySellCount = 0;
    let commercialPropertyRentCount = 0;
    let commercialPropertySellCount = 0;
    let residentialPropertyCustomerRentCount = 0;
    let residentialPropertyCustomerBuyCount = 0;
    let commercialPropertyCustomerRentCount = 0;
    let commercialPropertyCustomerBuyCount = 0;

    if (reqUserId === agentId) {
      // Agent
      residentialPropertyRentCount = await ResidentialPropertyRent.countDocuments({ agent_id: agentId }).lean().exec();
      residentialPropertySellCount = await ResidentialPropertySell.countDocuments({ agent_id: agentId }).lean().exec();
      commercialPropertyRentCount = await CommercialPropertyRent.countDocuments({ agent_id: agentId }).lean().exec();
      commercialPropertySellCount = await CommercialPropertySell.countDocuments({ agent_id: agentId }).lean().exec();
      residentialPropertyCustomerRentCount = await ResidentialPropertyCustomerRent.countDocuments({ agent_id: agentId }).lean().exec();
      residentialPropertyCustomerBuyCount = await ResidentialPropertyCustomerBuy.countDocuments({ agent_id: agentId }).lean().exec();
      commercialPropertyCustomerRentCount = await CommercialPropertyCustomerRent.countDocuments({ agent_id: agentId }).lean().exec();
      commercialPropertyCustomerBuyCount = await CommercialPropertyCustomerBuy.countDocuments({ agent_id: agentId }).lean().exec();
    } else {
      // Employee
      const employeeObj = await User.findOne({ id: reqUserId }).lean().exec();
      if (!employeeObj) {
        throw new AppError('Employee not found for summary.', 404);
      }
      residentialPropertyRentCount = employeeObj.assigned_residential_rent_properties?.length || 0;
      residentialPropertySellCount = employeeObj.assigned_residential_sell_properties?.length || 0;
      commercialPropertyRentCount = employeeObj.assigned_commercial_rent_properties?.length || 0;
      commercialPropertySellCount = employeeObj.assigned_commercial_sell_properties?.length || 0;
      residentialPropertyCustomerRentCount = employeeObj.assigned_residential_rent_customers?.length || 0;
      residentialPropertyCustomerBuyCount = employeeObj.assigned_residential_buy_customers?.length || 0;
      commercialPropertyCustomerRentCount = employeeObj.assigned_commercial_rent_customers?.length || 0;
      commercialPropertyCustomerBuyCount = employeeObj.assigned_commercial_buy_customers?.length || 0;
    }

    return {
      residentialPropertyRentCount,
      residentialPropertySellCount,
      commercialPropertyRentCount,
      commercialPropertySellCount,
      residentialPropertyCustomerRentCount,
      residentialPropertyCustomerBuyCount,
      commercialPropertyCustomerRentCount,
      commercialPropertyCustomerBuyCount
    };
  }
}

module.exports = GlobalSearchService;