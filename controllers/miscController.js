// controllers/miscController.js
const GlobalSearchService = require('../services/globalSearchService');
const MessageService = require('../services/messageService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Ensure all functions are properly defined
const getGlobalSearchResult = catchAsync(async (req, res, next) => {
  const searchCriteria = req.body;
  const result = await GlobalSearchService.getGlobalSearchResult(searchCriteria);
  res.status(200).json({
    status: 'success',
    data: result
  });
});

const getTotalListingSummary = catchAsync(async (req, res, next) => {
  const { req_user_id, agent_id } = req.body;
  if (!req_user_id || !agent_id) {
    return next(new AppError('Requesting user ID and Agent ID are required.', 400));
  }
  const summary = await GlobalSearchService.getTotalListingSummary(req_user_id, agent_id);
  res.status(200).json({
    status: 'success',
    data: summary
  });
});

const sendMessage = catchAsync(async (req, res, next) => {
  const messageDetails = req.body;
  if (!messageDetails.sender_details || !messageDetails.receiver_details || !messageDetails.message_text) {
    return next(new AppError('Missing required message details.', 400));
  }
  const result = await MessageService.sendMessage(messageDetails);
  res.status(201).json({
    status: 'success',
    data: result
  });
});

const getMessagesList = catchAsync(async (req, res, next) => {
  const { agent_id } = req.body;
  if (!agent_id) {
    return next(new AppError('Agent ID is required.', 400));
  }
  const messages = await MessageService.getMessagesList(agent_id);
  res.status(200).json({
    status: 'success',
    data: messages
  });
});

const getSubjectDetails = catchAsync(async (req, res, next) => {
  const { subject_category, subject_type, subject_id } = req.body;
  if (!subject_category || !subject_type || !subject_id) {
    return next(new AppError('Missing required subject details.', 400));
  }
  const details = await MessageService.getSubjectDetails(subject_category, subject_type, subject_id);
  res.status(200).json({
    status: 'success',
    data: details
  });
});

const getAllGlobalListingByLocations = catchAsync(async (req, res, next) => {
  const { locations, propertyType } = req.body;
  if (!locations || !propertyType) {
    return next(new AppError('Locations and Property Type are required.', 400));
  }
  const listings = await GlobalSearchService.getAllGlobalListingByLocations(locations, propertyType);
  res.status(200).json({
    status: 'success',
    data: listings
  });
});

// Export all functions
module.exports = {
  getGlobalSearchResult,
  getTotalListingSummary,
  sendMessage,
  getMessagesList,
  getSubjectDetails,
  getAllGlobalListingByLocations,
};