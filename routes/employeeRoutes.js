// routes/employeeRoutes.js
const express = require('express');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

router.post('/employeeList', employeeController.getEmployeeList);
router.post('/addEmployee', employeeController.addEmployee);
router.post('/deleteEmployee', employeeController.deleteEmployee);
router.post('/updatePropertiesForEmployee', employeeController.updatePropertiesForEmployee);
router.post('/updateEmployeeEditRights', employeeController.updateEmployeeEditRights);

module.exports = router;
