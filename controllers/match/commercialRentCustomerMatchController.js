// controllers/match/commercialRentCustomerMatchController.js
const CommercialRentCustomerMatchService = require('../../services/match/commercialRentCustomerMatchService');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.getMatchedCommercialProptiesRentList = catchAsync(async (req, res, next) => {
  const { customer_id, req_user_id } = req.body;
  if (!customer_id || !req_user_id) {
    return next(new AppError('Customer ID and Requesting User ID are required.', 400));
  }
  const data = await CommercialRentCustomerMatchService.getMatchedCommercialProptiesRentList(customer_id, req_user_id);
  res.status(200).json({
    status: 'success',
    data: data
  });
});