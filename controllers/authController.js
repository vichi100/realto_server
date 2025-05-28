// controllers/authController.js
const OtpService = require('../services/otpService');
const UserService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.generateOTP = catchAsync(async (req, res, next) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return next(new AppError('Mobile number and OTP are required.', 400));
  }

  const success = await OtpService.generateOtp(mobile, otp);

  if (success) {
    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully!'
    });
  } else {
    return next(new AppError('Failed to generate OTP.', 500));
  }
});

exports.getUserDetails = catchAsync(async (req, res, next) => {
  const { mobile, country, country_code } = req.body;

  if (!mobile) {
    return next(new AppError('Mobile number is required.', 400));
  }

  const user = await UserService.findOrCreateUser(mobile, country, country_code);
  // JSON.stringify(user)
  res.send(JSON.stringify(user));
  // res.status(200).json({
  //   user
    
  // });
});

exports.checkLoginRole = catchAsync(async (req, res, next) => {
  const { user_mobile } = req.body;

  if (!user_mobile) {
    return next(new AppError('Mobile number is required.', 400));
  }

  const userDetails = await UserService.checkLoginRole(user_mobile);
  res.status(200).json({
    status: 'success',
    user_details: userDetails
  });
});

exports.insertNewAgent = catchAsync(async (req, res, next) => {
  const { mobileNumber, userType, accessRights } = req.body;

  if (!mobileNumber || !userType || !accessRights) {
    return next(new AppError('Missing required fields for new agent.', 400));
  }

  const userDetails = await UserService.insertNewAgent(mobileNumber, userType, accessRights);
  res.status(201).json({
    status: 'success',
    user_details: userDetails
  });
});

exports.updateUserProfile = catchAsync(async (req, res, next) => {
  const profileDetails = req.body;
  const { user_id } = profileDetails;

  if (!user_id) {
    return next(new AppError('User ID is required for profile update.', 400));
  }

  await UserService.updateUserProfile(user_id, profileDetails);
  res.status(200).json({
    status: 'success',
    message: 'User profile updated successfully.'
  });
});

exports.deleteAgentAccount = catchAsync(async (req, res, next) => {
  const { agent_id, req_user_id } = req.body;
  if (!agent_id || !req_user_id) {
    return next(new AppError('Agent ID and requesting user ID are required.', 400));
  }
  await UserService.deleteAgentAccount(agent_id, req_user_id);
  res.status(200).json({
    status: 'success',
    message: 'Agent account deleted successfully.'
  });
});

exports.reactivateAccount = catchAsync(async (req, res, next) => {
  const { agent_id } = req.body;
  if (!agent_id) {
    return next(new AppError('Agent ID is required.', 400));
  }
  await UserService.reactivateAccount(agent_id);
  res.status(200).json({
    status: 'success',
    message: 'Agent account reactivated successfully.'
  });
});