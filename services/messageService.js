// services/messageService.js
const Message = require('../models/message');
const AppError = require('../utils/appError');
const { uniqueId } = require('../utils/helpers');

class MessageService {
  static async sendMessage(messageDetails) {
    const messageId = uniqueId();
    messageDetails.message_id = messageId;
    messageDetails.create_date_time = new Date();
    messageDetails.update_date_time = new Date();

    const newMessage = await Message.create(messageDetails);
    return { messageId: newMessage.message_id };
  }

  static async getMessagesList(agentId) {
    const messages = await Message.find({ "receiver_details.id": agentId })
      .sort({ create_date_time: -1 })
      .lean()
      .exec();
    return messages;
  }

  static async getSubjectDetails(subjectCategory, subjectType, subjectId) {
    let docModel;
    if (subjectCategory === "property") {
      if (subjectType === "Residential") {
        docModel = require('../models/residentialPropertyRent'); // Or a combined ResidentialProperty if exists
      } else if (subjectType === "Commercial") {
        docModel = require('../models/commercialPropertyRent'); // Or a combined CommercialProperty if exists
      }
      if (!docModel) throw new AppError('Invalid property subject type.', 400);
      const data = await docModel.findOne({ property_id: subjectId }).lean().exec();
      if (!data) throw new AppError('Property subject not found.', 404);
      return data;
    } else if (subjectCategory === "customer") {
      if (subjectType === "Residential") {
        docModel = require('../models/residentialPropertyCustomerRent'); // Or a combined ResidentialPropertyCustomer
      } else if (subjectType === "Commercial") {
        docModel = require('../models/commercialPropertyCustomerRent'); // Or a combined CommercialPropertyCustomer
      }
      if (!docModel) throw new AppError('Invalid customer subject type.', 400);
      const data = await docModel.findOne({ customer_id: subjectId }).lean().exec();
      if (!data) throw new AppError('Customer subject not found.', 404);
      return data;
    } else {
      throw new AppError('Invalid subject category.', 400);
    }
  }
}

module.exports = MessageService;