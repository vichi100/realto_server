// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/generateOTP', authController.generateOTP);
router.post('/getUserDetails', authController.getUserDetails);
router.post('/checkLoginRole', authController.checkLoginRole);
router.post('/insertNewAgent', authController.insertNewAgent);
router.post('/updateUserProfile', authController.updateUserProfile);
router.post('/deleteAgentAccount', authController.deleteAgentAccount);
router.post('/reactivateAccount', authController.reactivateAccount);

module.exports = router;