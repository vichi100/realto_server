// controllers/customerController.js
const CustomerService = require('../services/customerService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.addNewResidentialCustomer = catchAsync(async (req, res, next) => {
  const customerDetails = req.body;
  const savedCustomer = await CustomerService.addNewResidentialCustomer(customerDetails);
  res.status(201).json({
    status: 'success',
    data: savedCustomer
  });
});

exports.addNewCommercialCustomer = catchAsync(async (req, res, next) => {
  const customerDetails = req.body;
  const savedCustomer = await CustomerService.addNewCommercialCustomer(customerDetails);
  res.status(201).json({
    status: 'success',
    data: savedCustomer
  });
});

exports.getCommercialCustomerListings = catchAsync(async (req, res, next) => {
  const { agent_id, req_user_id } = req.body;
  if (!agent_id || !req_user_id) {
    return next(new AppError('Agent ID and requesting user ID are required.', 400));
  }
  const customers = await CustomerService.getCommercialCustomerListings(agent_id, req_user_id);
  res.status(200).json({
    status: 'success',
    data: customers
  });
});

exports.getResidentialCustomerListings = catchAsync(async (req, res, next) => {
  const { agent_id, req_user_id } = req.body;
  if (!agent_id || !req_user_id) {
    return next(new AppError('Agent ID and requesting user ID are required.', 400));
  }
  const customers = await CustomerService.getResidentialCustomerListings(agent_id, req_user_id);
  res.status(200).json({
    status: 'success',
    data: customers
  });
});

exports.getCustomerDetailsByIdToShare = catchAsync(async (req, res, next) => {
  const propObj = req.body;
  if (!propObj.customer_id || !propObj.property_type || !propObj.property_for || !propObj.agent_id) {
    return next(new AppError('Missing required customer details for sharing.', 400));
  }
  const customerDetail = await CustomerService.getCustomerDetailsByIdToShare(propObj);
  res.status(200).json({
    status: 'success',
    data: customerDetail
  });
});

exports.getCustomerListForMeeting = catchAsync(async (req, res, next) => {
  const queryObj = req.body;
  if (!queryObj.req_user_id || !queryObj.agent_id || !queryObj.property_type || !queryObj.property_id || !queryObj.property_agent_id || !queryObj.property_for) {
    return next(new AppError('Missing required fields for customer list for meeting.', 400));
  }
  const customers = await CustomerService.getCustomerListForMeeting(queryObj);
  res.status(200).json({
    status: 'success',
    data: customers
  });
});