// routes/reminderRoutes.js
const express = require('express');
const reminderController = require('../controllers/reminderController');

const router = express.Router();

router.post("/getPropReminderList", reminderController.getPropReminderList);
router.post("/getCustomerReminderList", reminderController.getCustomerReminderList);
router.post("/getCustomerAndMeetingDetails", reminderController.getCustomerAndMeetingDetails);
router.post("/getReminderList", reminderController.getReminderList);
router.post("/getReminderListByCustomerId", reminderController.getReminderListByCustomerId);
router.post("/addNewReminder", reminderController.addNewReminder);

module.exports = router;