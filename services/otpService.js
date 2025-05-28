// services/otpService.js
const axios = require('axios');
const config = require('../config');
const AppError = require('../utils/appError');

class OtpService {
  static async generateOtp(mobile, otp) {
    try {
      const response = await axios.get(`https://2factor.in/API/V1/${config.otpApi}/SMS/${mobile}/${otp}/FlickSickOTP1`);
      // You might want to check response.data for success/failure from the OTP API
      if (response.data && response.data.Status === 'Success') {
        return true;
      } else {
        throw new AppError('Failed to send OTP. OTP API response: ' + JSON.stringify(response.data), 500);
      }
    } catch (err) {
      console.error(`OtpService#generateOtp: ${err.message}`);
      throw new AppError('Error generating OTP. Please try again later.', 500);
    }
  }
}

module.exports = OtpService;