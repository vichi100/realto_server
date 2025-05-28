// controllers/employeeController.js
const EmployeeService = require('../services/employeeService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getEmployeeList = catchAsync(async (req, res, next) => {
  const { req_user_id } = req.body;
  if (!req_user_id) {
    return next(new AppError('Requesting user ID is required.', 400));
  }
  const empList = await EmployeeService.getEmployeeList(req_user_id);
  res.status(200).json({
    status: 'success',
    data: empList
  });
});

exports.addEmployee = catchAsync(async (req, res, next) => {
  const employeeDetails = req.body;
  const result = await EmployeeService.addEmployee(employeeDetails);
  res.status(201).json({
    status: 'success',
    data: result
  });
});

exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const { employee_id, agent_id } = req.body;
  if (!employee_id || !agent_id) {
    return next(new AppError('Employee ID and Agent ID are required.', 400));
  }
  await EmployeeService.deleteEmployee(employee_id, agent_id);
  res.status(200).json({
    status: 'success',
    message: 'Employee deleted successfully.'
  });
});

exports.updatePropertiesForEmployee = catchAsync(async (req, res, next) => {
  const { req_user_id, employee_id, employee_name, operation, what_to_update_data } = req.body;

  if (!req_user_id || !employee_id || !employee_name || !operation || !what_to_update_data) {
    return next(new AppError('Missing required fields for updating employee properties.', 400));
  }
  await EmployeeService.updatePropertiesForEmployee(req_user_id, employee_id, employee_name, operation, what_to_update_data);
  res.status(200).json({
    status: 'success',
    message: 'Employee properties/customers updated successfully.'
  });
});

exports.updateEmployeeEditRights = catchAsync(async (req, res, next) => {
  const { employee_id, access_rights } = req.body;
  if (!employee_id || !access_rights) {
    return next(new AppError('Employee ID and access rights are required.', 400));
  }
  await EmployeeService.updateEmployeeEditRights(employee_id, access_rights);
  res.status(200).json({
    status: 'success',
    message: 'Employee edit rights updated successfully.'
  });
});