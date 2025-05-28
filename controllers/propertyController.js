// controllers/propertyController.js
const PropertyService = require('../services/propertyService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.addNewResidentialProperty = catchAsync(async (req, res, next) => {
  const propertyDetails = JSON.parse(req.body.propertyFinalDetails);
  const files = req.files; // Access files via req.files from express-fileupload

  const savedProperty = await PropertyService.addNewResidentialProperty(propertyDetails, files);
  res.status(201).json({
    status: 'success',
    data: savedProperty
  });
});

exports.addNewCommercialProperty = catchAsync(async (req, res, next) => {
  const propertyDetails = JSON.parse(req.body.propertyFinalDetails);
  const files = req.files; // Access files via req.files from express-fileupload

  const savedProperty = await PropertyService.addNewCommercialProperty(propertyDetails, files);
  res.status(201).json({
    status: 'success',
    data: savedProperty
  });
});

exports.getCommercialPropertyListings = catchAsync(async (req, res, next) => {
  console.log('Received body for commercialPropertyListings:', req.body); // <-- Add this
  const { agent_id, req_user_id } = req.body;
  if (!agent_id || !req_user_id) {
    return next(new AppError('Agent ID and requesting user ID are required.', 400));
  }
  const properties = await PropertyService.getCommercialPropertyListings(agent_id, req_user_id);
  res.status(200).json({
    status: 'success',
    data: properties
  });
});

exports.getResidentialPropertyListings = catchAsync(async (req, res, next) => {
  const { agent_id, req_user_id } = req.body;
  if (!agent_id || !req_user_id) {
    return next(new AppError('Agent ID and requesting user ID are required.', 400));
  }
  const properties = await PropertyService.getResidentialPropertyListings(agent_id, req_user_id);
  res.status(200).json({
    status: 'success',
    data: properties
  });
});

exports.getPropertyListingForMeeting = catchAsync(async (req, res, next) => {
  const { agent_id, property_type, customer_id, agent_id_of_client, req_user_id, property_for } = req.body;
  if (!agent_id || !property_type || !customer_id || !agent_id_of_client || !req_user_id || !property_for) {
    return next(new AppError('Missing required fields for property listing for meeting.', 400));
  }
  const properties = await PropertyService.getPropertyListingForMeeting(agent_id, property_type, customer_id, agent_id_of_client, req_user_id, property_for);
  res.status(200).json({
    status: 'success',
    data: properties
  });
});

exports.getPropertyDetailsByIdToShare = catchAsync(async (req, res, next) => {
  const propObj = req.body;
  if (!propObj.property_id || !propObj.property_type || !propObj.property_for || !propObj.agent_id) {
    return next(new AppError('Missing required property details for sharing.', 400));
  }
  const propertyDetail = await PropertyService.getPropertyDetailsByIdToShare(propObj);
  res.status(200).json({
    status: 'success',
    data: propertyDetail
  });
});