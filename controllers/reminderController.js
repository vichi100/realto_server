// controllers/reminderController.js
const ReminderService = require('../services/reminderService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getReminderList = catchAsync(async (req, res, next) => {
  const { req_user_id, agent_id } = req.body;
  if (!req_user_id || !agent_id) {
    return next(new AppError('Requesting user ID and Agent ID are required.', 400));
  }
  const reminders = await ReminderService.getReminderList(req_user_id, agent_id);
  res.status(200).json({
    status: 'success',
    data: reminders
  });
});

exports.getReminderListByCustomerId = catchAsync(async (req, res, next) => {
  const { customer_id, property_type, property_for, req_user_id } = req.body;
  if (!customer_id || !property_type || !property_for || !req_user_id) {
    return next(new AppError('Missing required fields for getting reminders by customer.', 400));
  }
  const reminders = await ReminderService.getReminderListByCustomerId(req_user_id, customer_id, property_type, property_for);
  res.status(200).json({
    status: 'success',
    data: reminders
  });
});

exports.addNewReminder = catchAsync(async (req, res, next) => {
  const reminderDetails = req.body;
  if (!reminderDetails.category_ids || reminderDetails.category_ids.length === 0 || !reminderDetails.client_id || !reminderDetails.category_type || !reminderDetails.category_for) {
    return next(new AppError('Missing required fields for adding a new reminder.', 400));
  }
  const result = await ReminderService.addNewReminder(reminderDetails);
  res.status(201).json({
    status: 'success',
    data: result
  });
});

exports.getPropReminderList = catchAsync(async (req, res, next) => {
  const { property_id, req_user_id, agent_id } = req.body;
  if (!property_id || !req_user_id || !agent_id) {
    return next(new AppError('Property ID, requesting user ID, and Agent ID are required.', 400));
  }
  const reminders = await ReminderService.getPropReminderList(property_id, req_user_id, agent_id);
  res.status(200).json({
    status: 'success',
    data: reminders
  });
});

exports.getCustomerReminderList = catchAsync(async (req, res, next) => {
  const { customer_id, req_user_id } = req.body;
  if (!customer_id || !req_user_id) {
    return next(new AppError('Customer ID and requesting user ID are required.', 400));
  }
  const reminders = await ReminderService.getCustomerReminderList(customer_id, req_user_id);
  res.status(200).json({
    status: 'success',
    data: reminders
  });
});

exports.getCustomerAndMeetingDetails = catchAsync(async (req, res, next) => {
  const queryObj = req.body;
  if (!queryObj.req_user_id || !queryObj.category_type || !queryObj.category_for || !queryObj.category_ids || !queryObj.client_id) {
    return next(new AppError('Missing required fields for getting customer and meeting details.', 400));
  }
  const details = await ReminderService.getCustomerAndMeetingDetails(queryObj);
  res.status(200).json({
    status: 'success',
    data: details
  });
});