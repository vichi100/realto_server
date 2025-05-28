// services/customerService.js
const ResidentialPropertyCustomerRent = require("../models/residentialPropertyCustomerRent");
const ResidentialPropertyCustomerBuy = require("../models/residentialPropertyCustomerBuy");
const CommercialPropertyCustomerRent = require("../models/commercialPropertyCustomerRent");
const CommercialPropertyCustomerBuy = require("../models/commercialPropertyCustomerBuy");
const ResidentialCustomerRentLocation = require("../models/residentialCustomerRentLocation");
const ResidentialCustomerBuyLocation = require("../models/residentialCustomerBuyLocation");
const CommercialCustomerRentLocation = require("../models/commercialCustomerRentLocation");
const CommercialCustomerBuyLocation = require("../models/commercialCustomerBuyLocation");
const AppError = require('../utils/appError');
const User = require('../models/user'); // Assuming User model path for masking
const { uniqueId, replaceCustomerDetailsWithAgentDetails } = require('../utils/helpers');

class CustomerService {
  static async addNewResidentialCustomer(customerDetails) {
    const customerId = uniqueId();
    const locations = customerDetails.customer_locality.location_area.map((location) => ({
      ...location,
    }));

    const customerDetailsDict = {
      customer_id: customerId,
      agent_id: customerDetails.agent_id,
      customer_details: {
        name: customerDetails.customer_details.name,
        mobile1: customerDetails.customer_details.mobile1,
        address: customerDetails.customer_details.address
      },
      customer_locality: {
        city: customerDetails.customer_locality.city,
        location_area: customerDetails.customer_locality.location_area,
        property_type: customerDetails.customer_locality.property_type,
        property_for: customerDetails.customer_locality.property_for,
        preferred_tenants: customerDetails.customer_locality.preferred_tenants
      },
      customer_property_details: {
        house_type: customerDetails.customer_property_details.house_type,
        bhk_type: customerDetails.customer_property_details.bhk_type,
        furnishing_status: customerDetails.customer_property_details.furnishing_status,
        parking_type: customerDetails.customer_property_details.parking_type,
        lift: customerDetails.customer_property_details.lift
      },
      image_urls: ["vichi1"], // Consider if customers will have images
      create_date_time: new Date(),
      update_date_time: new Date()
    };

    if (customerDetails.customer_locality.property_for === "Rent") {
      customerDetailsDict.customer_rent_details = {
        expected_rent: customerDetails.customer_rent_details.expected_rent,
        expected_deposit: customerDetails.customer_rent_details.expected_deposit,
        available_from: customerDetails.customer_rent_details.available_from,
      };
      const residentialCustomerRentLocationDictArray = locations.map(location => ({
        customer_id: customerId,
        location: location.location,
        agent_id: customerDetails.agent_id,
        customer_property_details: customerDetailsDict.customer_property_details,
        customer_rent_details: customerDetailsDict.customer_rent_details,
      }));
      await ResidentialPropertyCustomerRent.create(customerDetailsDict);
      await ResidentialCustomerRentLocation.create(residentialCustomerRentLocationDictArray);
    } else if (customerDetails.customer_locality.property_for === "Buy") {
      customerDetailsDict.customer_buy_details = {
        expected_buy_price: customerDetails.customer_buy_details.expected_buy_price,
        available_from: customerDetails.customer_buy_details.available_from,
        negotiable: customerDetails.customer_buy_details.negotiable
      };
      const residentialCustomerBuyLocationDictArray = locations.map(location => ({
        customer_id: customerId,
        location: location.location,
        agent_id: customerDetails.agent_id,
        customer_property_details: customerDetailsDict.customer_property_details,
        customer_buy_details: customerDetailsDict.customer_buy_details,
      }));
      await ResidentialPropertyCustomerBuy.create(customerDetailsDict);
      await ResidentialCustomerBuyLocation.create(residentialCustomerBuyLocationDictArray);
    } else {
      throw new AppError('Invalid property purpose for residential customer.', 400);
    }
    return customerDetailsDict;
  }

  static async addNewCommercialCustomer(customerDetails) {
    const customerId = uniqueId();
    const locations = customerDetails.customer_locality.location_area.map((location) => ({
      ...location,
    }));

    const customerDetailsDict = {
      customer_id: customerId,
      agent_id: customerDetails.agent_id,
      customer_details: {
        name: customerDetails.customer_details.name,
        mobile1: customerDetails.customer_details.mobile1,
        address: customerDetails.customer_details.address
      },
      customer_locality: {
        city: customerDetails.customer_locality.city,
        location_area: customerDetails.customer_locality.location_area,
        property_type: customerDetails.customer_locality.property_type,
        property_for: customerDetails.customer_locality.property_for,
      },
      customer_property_details: {
        building_type: customerDetails.customer_property_details.building_type,
        parking_type: customerDetails.customer_property_details.parking_type,
        property_used_for: customerDetails.customer_property_details.property_used_for,
        property_size: customerDetails.customer_property_details.property_size,
      },
      image_urls: ["vichi1"], // Consider if customers will have images
      create_date_time: new Date(),
      update_date_time: new Date()
    };

    if (customerDetails.customer_locality.property_for === "Rent") {
      customerDetailsDict.customer_rent_details = {
        expected_rent: customerDetails.customer_rent_details.expected_rent,
        expected_deposit: customerDetails.customer_rent_details.expected_deposit,
        available_from: customerDetails.customer_rent_details.available_from
      };
      const commercialCustomerRentLocationDictArray = locations.map(location => ({
        customer_id: customerId,
        location: location.location,
        agent_id: customerDetails.agent_id,
        customer_property_details: customerDetailsDict.customer_property_details,
        customer_rent_details: customerDetailsDict.customer_rent_details,
      }));
      await CommercialPropertyCustomerRent.create(customerDetailsDict);
      await CommercialCustomerRentLocation.create(commercialCustomerRentLocationDictArray);
    } else if (customerDetails.customer_locality.property_for === "Buy") {
      customerDetailsDict.customer_buy_details = {
        expected_buy_price: customerDetails.customer_buy_details.expected_buy_price,
        available_from: customerDetails.customer_buy_details.available_from,
        negotiable: customerDetails.customer_buy_details.negotiable
      };
      const commercialCustomerBuyLocationDictArray = locations.map(location => ({
        customer_id: customerId,
        location: location.location,
        agent_id: customerDetails.agent_id,
        customer_property_details: customerDetailsDict.customer_property_details,
        customer_buy_details: customerDetailsDict.customer_buy_details,
      }));
      await CommercialPropertyCustomerBuy.create(customerDetailsDict);
      await CommercialCustomerBuyLocation.create(commercialCustomerBuyLocationDictArray);
    } else {
      throw new AppError('Invalid property purpose for commercial customer.', 400);
    }
    return customerDetailsDict;
  }

  static async getCommercialCustomerListings(agentId, reqUserId) {
    let allCustomers = [];
    if (agentId === reqUserId) {
      const commercialRentCustomers = await CommercialPropertyCustomerRent.find({ agent_id: agentId }).lean().exec();
      const commercialBuyCustomers = await CommercialPropertyCustomerBuy.find({ agent_id: agentId }).lean().exec();
      allCustomers = [...commercialRentCustomers, ...commercialBuyCustomers];
    } else {
      const empObj = await User.findOne({ id: reqUserId }).lean().exec();
      if (!empObj) {
        throw new AppError('Employee not found.', 404);
      }
      const commercialRentCustomerIds = empObj.assigned_commercial_rent_customers || [];
      const commercialBuyCustomerIds = empObj.assigned_commercial_buy_customers || [];
      const commercialRentCustomers = await CommercialPropertyCustomerRent.find({ customer_id: { $in: commercialRentCustomerIds } }).lean().exec();
      const commercialBuyCustomers = await CommercialPropertyCustomerBuy.find({ customer_id: { $in: commercialBuyCustomerIds } }).lean().exec();
      allCustomers = [...commercialRentCustomers, ...commercialBuyCustomers];
    }
    // You might want to sort these as well
    return allCustomers;
  }

  static async getResidentialCustomerListings(agentId, reqUserId) {
    let allCustomers = [];
    if (agentId === reqUserId) {
      const residentialRentCustomers = await ResidentialPropertyCustomerRent.find({ agent_id: agentId }).lean().exec();
      const residentialBuyCustomers = await ResidentialPropertyCustomerBuy.find({ agent_id: agentId }).lean().exec();
      allCustomers = [...residentialRentCustomers, ...residentialBuyCustomers];
    } else {
      const empObj = await User.findOne({ id: reqUserId }).lean().exec();
      if (!empObj) {
        throw new AppError('Employee not found.', 404);
      }
      const residentialRentCustomerIds = empObj.assigned_residential_rent_customers || [];
      const residentialBuyCustomerIds = empObj.assigned_residential_buy_customers || [];
      const residentialRentCustomers = await ResidentialPropertyCustomerRent.find({ customer_id: { $in: residentialRentCustomerIds } }).lean().exec();
      const residentialBuyCustomers = await ResidentialPropertyCustomerBuy.find({ customer_id: { $in: residentialBuyCustomerIds } }).lean().exec();
      allCustomers = [...residentialRentCustomers, ...residentialBuyCustomers];
    }
    // You might want to sort these as well
    return allCustomers;
  }

  static async getCustomerDetailsByIdToShare(propObj) {
    let CustomerModel;
    if (propObj.property_type.toLowerCase() === "residential") {
      if (propObj.property_for.toLowerCase() === "rent") {
        CustomerModel = ResidentialPropertyCustomerRent;
      } else if (propObj.property_for.toLowerCase() === "buy") {
        CustomerModel = ResidentialPropertyCustomerBuy;
      }
    } else if (propObj.property_type.toLowerCase() === "commercial") {
      if (propObj.property_for.toLowerCase() === "rent") {
        CustomerModel = CommercialPropertyCustomerRent;
      } else if (propObj.property_for.toLowerCase() === "buy") {
        CustomerModel = CommercialPropertyCustomerBuy;
      }
    } else {
      throw new AppError('Invalid property type for customer sharing.', 400);
    }

    if (!CustomerModel) {
      throw new AppError('Customer details not found or invalid type/purpose.', 404);
    }

    const [customerDetail, agentDetails] = await Promise.all([
      CustomerModel.findOne({ customer_id: propObj.customer_id }).lean().exec(),
      User.findOne({ id: propObj.agent_id }).exec()
    ]);

    if (!customerDetail || !agentDetails) {
      throw new AppError('Customer or Agent details not found.', 404);
    }

    customerDetail.customer_details = {
      name: agentDetails.name,
      mobile1: agentDetails.mobile,
      customer_id: propObj.customer_id
    };
    return customerDetail;
  }

  static async getCustomerListForMeeting(queryObj) {
    const { req_user_id, agent_id, property_type, property_id, property_agent_id } = queryObj;
    let property_for = queryObj.property_for;

    let CustomerModel;
    let MatchModel;

    if (property_type === "Residential") {
      property_for = (property_for === "Sell") ? "Buy" : property_for; // Normalize for customer_for
      if (property_for.toLowerCase() === "rent") {
        CustomerModel = ResidentialPropertyCustomerRent;
        MatchModel = require('../models/match/residentialRentPropertyMatch');
      } else if (property_for.toLowerCase() === "buy") {
        CustomerModel = ResidentialPropertyCustomerBuy;
        MatchModel = require('../models/match/residentialBuyPropertyMatch');
      } else {
        throw new AppError('Invalid property purpose for residential customer.', 400);
      }
    } else if (property_type === "Commercial") {
      property_for = (property_for === "Sell") ? "Buy" : property_for; // Normalize for customer_for
      if (property_for.toLowerCase() === "rent") {
        CustomerModel = CommercialPropertyCustomerRent;
        MatchModel = require('../models/match/commercialRentPropertyMatch');
      } else if (property_for.toLowerCase() === "buy") {
        CustomerModel = CommercialPropertyCustomerBuy;
        MatchModel = require('../models/match/commercialBuyPropertyMatch');
      } else {
        throw new AppError('Invalid property purpose for commercial customer.', 400);
      }
    } else {
      throw new AppError('Invalid property type.', 400);
    }

    // Get all customers of the requesting agent (my customers)
    const myCustomerListX = await CustomerModel.find({
      agent_id: agent_id,
      "customer_locality.property_type": property_type,
      "customer_locality.property_for": property_for
    }).lean().exec();

    // Find other agent's customers which are matched with this property
    const matchedData = await MatchModel.findOne({ property_id: property_id }).lean().exec();

    let myMatchedCustomerList = [];
    let otherCustomerList = [];

    if (matchedData) {
      // My matched customers
      const myMatchedCustomerDictList = matchedData.matched_customer_id_mine;
      const myMatchedCustomerIdList = myMatchedCustomerDictList.map(item => item.customer_id);
      const myMatchedCustomerMap = {};
      myMatchedCustomerDictList.forEach(item => myMatchedCustomerMap[item.customer_id] = item.matched_percentage);

      myMatchedCustomerList = await CustomerModel.find({ customer_id: { $in: myMatchedCustomerIdList } }).lean().exec();
      myMatchedCustomerList.forEach(customer => customer.matched_percentage = myMatchedCustomerMap[customer.customer_id]);

      // Other agent's matched customers
      if (req_user_id === property_agent_id) { // Only show other agent's customers if the requesting user is the property's agent
        const otherAgentCustomerDictList = matchedData.matched_customer_id_other;
        const otherAgentCustomerIds = otherAgentCustomerDictList.map(item => item.customer_id);
        const otherMatchedCustomerMap = {};
        otherAgentCustomerDictList.forEach(item => otherMatchedCustomerMap[item.customer_id] = item.matched_percentage);

        const fetchedOtherCustomers = await CustomerModel.find({ customer_id: { $in: otherAgentCustomerIds } }).lean().exec();
        for (let otherCustomer of fetchedOtherCustomers) {
          const otherAgent = await User.findOne({ id: otherCustomer.agent_id }).lean().exec();
          if (otherAgent) {
            otherCustomer.customer_details.name = otherAgent.name ? otherAgent.name : "Agent";
            otherCustomer.customer_details.mobile1 = otherAgent.mobile;
            otherCustomer.matched_percentage = otherMatchedCustomerMap[otherCustomer.customer_id];
            otherCustomerList.push(otherCustomer);
          }
        }
      }
    }

    // Merge my own customers (excluding duplicates found in myMatchedCustomerList) and all matched customers
    const finalData = [...new Set([...myMatchedCustomerList, ...myCustomerListX, ...otherCustomerList])];
    return finalData;
  }
}

module.exports = CustomerService;