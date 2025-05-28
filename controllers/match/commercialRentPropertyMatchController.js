// controllers/match/commercialRentPropertyMatchController.js
const CommercialRentPropertyMatchService = require('../../services/match/commercialRentPropertyMatchService');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.getMatchedCommercialCustomerRentList = catchAsync(async (req, res, next) => {
  const { property_id, req_user_id } = req.body;
  if (!property_id || !req_user_id) {
    return next(new AppError('Property ID and Requesting User ID are required.', 400));
  }
  const data = await CommercialRentPropertyMatchService.getMatchedCommercialCustomerRentList(property_id, req_user_id);
  res.status(200).json({
    status: 'success',
    data: data
  });
});