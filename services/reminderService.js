// services/reminderService.js
const Reminder = require("../models/reminder");
const User = require('../models/user');
const ResidentialPropertyRent = require("../models/residentialPropertyRent");
const ResidentialPropertySell = require("../models/residentialPropertySell");
const CommercialPropertyRent = require("../models/commercialPropertyRent");
const CommercialPropertySell = require("../models/commercialPropertySell");
const ResidentialPropertyCustomerRent = require("../models/residentialPropertyCustomerRent");
const ResidentialPropertyCustomerBuy = require("../models/residentialPropertyCustomerBuy");
const CommercialPropertyCustomerRent = require("../models/commercialPropertyCustomerRent");
const CommercialPropertyCustomerBuy = require("../models/commercialPropertyCustomerBuy");
const AppError = require('../utils/appError');
const { uniqueId, modifyPropertyOwnerAndAddressDetails, modifyCustomerDetails } = require('../utils/helpers');


class ReminderService {
  static async getReminderList(reqUserId, agentId) {
    let reminderArray;
    if (reqUserId === agentId) {
      reminderArray = await Reminder.find({
        $or: [
          { agent_id_of_client: agentId },
          { meeting_creator_id: reqUserId }
        ]
      }).sort({ create_date_time: -1 }).lean().exec();

      for (let reminder of reminderArray) {
        if (reqUserId !== reminder.agent_id_of_client) {
          const user = await User.findOne({ id: reminder.agent_id_of_client }).lean().exec();
          reminder.client_name = user.name ? user.name : "Agent";
          reminder.client_mobile = user.mobile;
        }
      }
    } else {
      // Employee can only see reminders created by them
      reminderArray = await Reminder.find({
        meeting_creator_id: reqUserId
      }).sort({ create_date_time: -1 }).lean().exec();

      for (let reminder of reminderArray) {
        const reqUserIdDetails = await User.findOne({ id: reqUserId }).lean().exec();
        if (reqUserIdDetails.works_for !== reminder.agent_id_of_client) {
          const user = await User.findOne({ id: reminder.agent_id_of_client }).lean().exec();
          reminder.client_name = user.name ? user.name : "Agent";
          reminder.client_mobile = user.mobile;
        }
      }
    }
    return reminderArray;
  }

  static async getReminderListByCustomerId(reqUserId, customerId, propertyType, propertyFor) {
    let customerDoc;
    if (propertyType.toLowerCase() === "residential") {
      if (propertyFor.toLowerCase() === "rent") {
        customerDoc = await ResidentialPropertyCustomerRent.findOne({ customer_id: customerId }).lean().exec();
      } else if (propertyFor.toLowerCase() === "sell" || propertyFor.toLowerCase() === "buy") {
        customerDoc = await ResidentialPropertyCustomerBuy.findOne({ customer_id: customerId }).lean().exec();
      }
    } else if (propertyType.toLowerCase() === "commercial") {
      if (propertyFor.toLowerCase() === "rent") {
        customerDoc = await CommercialPropertyCustomerRent.findOne({ customer_id: customerId }).lean().exec();
      } else if (propertyFor.toLowerCase() === "buy") {
        customerDoc = await CommercialPropertyCustomerBuy.findOne({ customer_id: customerId }).lean().exec();
      }
    }

    if (!customerDoc) {
      throw new AppError('Customer not found.', 404);
    }

    const reminderArr = customerDoc.reminders || [];
    const reminderDataArr = await Reminder.find({ reminder_id: { $in: reminderArr } }).lean().exec();

    const finalReminderDataArr = [];
    for (let reminder of reminderDataArr) {
      if (reminder.agent_id_of_client === reqUserId) {
        finalReminderDataArr.push(reminder);
      } else if (reminder.meeting_creator_id === reqUserId) {
        const otherCustomerAgentIdDetails = await User.findOne({ id: reminder.agent_id_of_client }).lean().exec();
        if (otherCustomerAgentIdDetails) {
          reminder.client_name = otherCustomerAgentIdDetails.name === null ? "Agent" : `${otherCustomerAgentIdDetails.name}, Agent`;
          reminder.client_mobile = otherCustomerAgentIdDetails.mobile;
        }
        finalReminderDataArr.push(reminder);
      }
    }
    return finalReminderDataArr;
  }

  static async addNewReminder(reminderDetails) {
    const reminderId = uniqueId();
    reminderDetails.reminder_id = reminderId;
    reminderDetails.create_date_time = new Date();
    reminderDetails.update_date_time = new Date();

    await Reminder.create(reminderDetails);

    // Update property and customer documents with reminderId
    const propertyId = reminderDetails.category_ids[0]; // Assuming only one property per reminder for this logic
    const customerId = reminderDetails.client_id;

    if (reminderDetails.category_type === "Residential") {
      if (reminderDetails.category_for === "Rent") {
        await ResidentialPropertyRent.updateOne({ property_id: propertyId }, { $addToSet: { reminders: reminderId } }).exec();
        await ResidentialPropertyCustomerRent.updateOne({ customer_id: customerId }, { $addToSet: { reminders: reminderId } }).exec();
      } else if (reminderDetails.category_for === "Buy" || reminderDetails.category_for === "Sell") {
        await ResidentialPropertySell.updateOne({ property_id: propertyId }, { $addToSet: { reminders: reminderId } }).exec();
        await ResidentialPropertyCustomerBuy.updateOne({ customer_id: customerId }, { $addToSet: { reminders: reminderId } }).exec();
      }
    } else if (reminderDetails.category_type === "Commercial") {
      if (reminderDetails.category_for === "Rent") {
        await CommercialPropertyRent.updateOne({ property_id: propertyId }, { $addToSet: { reminders: reminderId } }).exec();
        await CommercialPropertyCustomerRent.updateOne({ customer_id: customerId }, { $addToSet: { reminders: reminderId } }).exec();
      } else if (reminderDetails.category_for === "Sell" || reminderDetails.category_for === "Buy") {
        await CommercialPropertySell.updateOne({ property_id: propertyId }, { $addToSet: { reminders: reminderId } }).exec();
        await CommercialPropertyCustomerBuy.updateOne({ customer_id: customerId }, { $addToSet: { reminders: reminderId } }).exec();
      }
    }

    return { reminderId };
  }

  static async getPropReminderList(propertyId, reqUserId, agentId) {
    let reminderList;

    if (reqUserId === agentId) {
      // Agent can see all reminders for the property, including those created by employees or for their clients
      reminderList = await Reminder.find({
        category_ids: { $in: [propertyId] },
        $or: [
          { meeting_creator_id: reqUserId },
          { agent_id_of_client: reqUserId }
        ]
      }).sort({ create_date_time: -1 }).lean().exec();
    } else {
      // Employee can only see reminders created by them for this property
      reminderList = await Reminder.find({
        category_ids: { $in: [propertyId] },
        meeting_creator_id: reqUserId
      }).sort({ create_date_time: -1 }).lean().exec();
    }

    // Mask client details for other agents' properties/customers
    for (let reminder of reminderList) {
      const clientAgentId = reminder.agent_id_of_client;
      if (reqUserId !== clientAgentId) {
        const clientAgentDetails = await User.findOne({ id: clientAgentId }).lean().exec();
        if (clientAgentDetails) {
          reminder.client_name = clientAgentDetails.name ? clientAgentDetails.name : "Agent";
          reminder.client_mobile = clientAgentDetails.mobile;
        } else {
          // Fallback if client agent details not found (e.g., agent account deleted)
          reminder.client_name = "Unknown Agent";
          reminder.client_mobile = "N/A";
        }
      }
    }
    return reminderList;
  }

  static async getCustomerReminderList(customerId, reqUserId) {
    const remiderList = await Reminder.find({
      $or: [
        { $and: [{ client_id: customerId }, { meeting_creator_id: reqUserId }] },
        { $and: [{ client_id: customerId }, { agent_id_of_client: reqUserId }] }
      ]
    }).sort({ create_date_time: -1 }).lean().exec(); // Sort for consistent order

    // If the reminder was created by another agent (but visible to this reqUserId because it's their customer's reminder)
    for (let reminder of remiderList) {
      if (reminder.meeting_creator_id !== reqUserId && reminder.agent_id_of_client === reqUserId) {
        const creatorDetails = await User.findOne({ id: reminder.meeting_creator_id }).lean().exec();
        if (creatorDetails) {
          reminder.meeting_creator_name = creatorDetails.name ? creatorDetails.name : "Employee";
          reminder.meeting_creator_mobile = creatorDetails.mobile;
        }
      }
    }

    return remiderList;
  }

  static async getCustomerAndMeetingDetails(queryObj) {
    const { req_user_id, category_type, category_for, category_ids, client_id } = queryObj;
    let propertyDetail = [];
    let customerDetails = null;
    let PropertyModel;
    let CustomerModel;
    let MatchModel;

    if (category_type === "Residential") {
      if (category_for === "Rent") {
        PropertyModel = ResidentialPropertyRent;
        CustomerModel = ResidentialPropertyCustomerRent;
        MatchModel = require('../models/match/residentialRentCustomerMatch');
      } else if (category_for === "Sell" || category_for === "Buy") {
        PropertyModel = ResidentialPropertySell;
        CustomerModel = ResidentialPropertyCustomerBuy;
        MatchModel = require('../models/match/residentialBuyCustomerMatch');
      } else {
        throw new AppError('Invalid category purpose for residential.', 400);
      }
    } else if (category_type === "Commercial") {
      if (category_for === "Rent") {
        PropertyModel = CommercialPropertyRent;
        CustomerModel = CommercialPropertyCustomerRent;
        MatchModel = require('../models/match/commercialRentCustomerMatch');
      } else if (category_for === "Sell" || category_for === "Buy") {
        PropertyModel = CommercialPropertySell;
        CustomerModel = CommercialPropertyCustomerBuy;
        MatchModel = require('../models/match/commercialBuyCustomerMatch');
      } else {
        throw new AppError('Invalid category purpose for commercial.', 400);
      }
    } else {
      throw new AppError('Invalid category type.', 400);
    }

    propertyDetail = await PropertyModel.find({ property_id: { $in: category_ids } }).lean().exec();
    customerDetails = await CustomerModel.findOne({ customer_id: client_id }).lean().exec();

    if (!customerDetails) {
      throw new AppError('Customer details not found for the meeting.', 404);
    }

    // Apply matched percentage to properties if applicable
    const matchPropertiesForCustomer = await MatchModel.findOne({ customer_id: customerDetails.customer_id }).lean().exec();
    if (matchPropertiesForCustomer) {
      const mineMatchedPropertyMap = new Map(matchPropertiesForCustomer.matched_property_id_mine.map(p => [p.property_id, p.matched_percentage]));
      const otherMatchedPropertyMap = new Map(matchPropertiesForCustomer.matched_property_id_other.map(p => [p.property_id, p.matched_percentage]));

      for (let property of propertyDetail) {
        property.matched_percentage = mineMatchedPropertyMap.get(property.property_id) || otherMatchedPropertyMap.get(property.property_id) || 0;
      }
    }

    // Mask details if necessary
    const modifiedPropertyDetail = await modifyPropertyOwnerAndAddressDetails(req_user_id, propertyDetail);
    const modifiedCustomerDetail = await modifyCustomerDetails(req_user_id, customerDetails);

    return {
      property_details: modifiedPropertyDetail,
      customer_details: modifiedCustomerDetail
    };
  }
}

module.exports = ReminderService;