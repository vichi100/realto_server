// services/employeeService.js
const User = require('../models/user');
const ResidentialPropertyRent = require("../models/residentialPropertyRent");
const ResidentialPropertySell = require('../models/residentialPropertySell');
const CommercialPropertyRent = require("../models/commercialPropertyRent");
const CommercialPropertySell = require("../models/commercialPropertySell");
const ResidentialPropertyCustomerRent = require("../models/residentialPropertyCustomerRent");
const ResidentialPropertyCustomerBuy = require("../models/residentialPropertyCustomerBuy");
const CommercialPropertyCustomerRent = require("../models/commercialPropertyCustomerRent");
const CommercialPropertyCustomerBuy = require("../models/commercialPropertyCustomerBuy");
const AppError = require('../utils/appError');
const { uniqueId } = require('../utils/helpers');

class EmployeeService {
  static async getEmployeeList(reqUserId) {
    const empList = await User.find({ works_for: reqUserId, user_type: "employee" }).sort({ user_id: -1 }).lean().exec();
    return empList;
  }

  static async addEmployee(employeeDetails) {
    let mobileNumber = employeeDetails.emp_mobile;
    if (!mobileNumber.startsWith("+91")) {
      mobileNumber = "+91" + mobileNumber;
    }

    const existingEmp = await User.findOne({ mobile: mobileNumber }).lean().exec();
    if (existingEmp) {
      throw new AppError("This mobile number is already registered.", 409);
    }

    const newUserId = uniqueId();
    const empObj = {
      user_type: "employee",
      id: newUserId,
      expo_token: null,
      name: employeeDetails.emp_name,
      company_name: employeeDetails.company_name,
      mobile: mobileNumber,
      address: employeeDetails.address,
      city: employeeDetails.city,
      access_rights: employeeDetails.access_rights,
      employee_ids: [], // This field seems redundant if `employees` array in agent's doc is used
      works_for: employeeDetails.agent_id,
      user_status: "active",
      create_date_time: new Date(),
      update_date_time: new Date()
    };
    const result = await User.create(empObj);

    // Also add the employee to the agent's employee list
    await User.updateOne(
      { id: employeeDetails.agent_id },
      { $addToSet: { employees: newUserId } }
    );

    return result.toObject();
  }

  static async deleteEmployee(employeeId, agentId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const employeeObj = await User.findOne({ id: employeeId }).session(session).lean().exec();

      if (!employeeObj) {
        throw new AppError("Employee not found.", 404);
      }
      if (employeeObj.works_for !== agentId) {
        throw new AppError("Unauthorized: Employee does not belong to this agent.", 403);
      }

      const {
        assigned_residential_rent_properties = [],
        assigned_residential_sell_properties = [],
        assigned_commercial_rent_properties = [],
        assigned_commercial_sell_properties = [],
        assigned_residential_rent_customers = [],
        assigned_residential_buy_customers = [],
        assigned_commercial_rent_customers = [],
        assigned_commercial_buy_customers = []
      } = employeeObj;

      // Update properties
      await ResidentialPropertyRent.updateMany(
        { property_id: { $in: assigned_residential_rent_properties } },
        { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeObj.name } },
        { session }
      );
      await ResidentialPropertySell.updateMany(
        { property_id: { $in: assigned_residential_sell_properties } },
        { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeObj.name } },
        { session }
      );
      await CommercialPropertyRent.updateMany(
        { property_id: { $in: assigned_commercial_rent_properties } },
        { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeObj.name } },
        { session }
      );
      await CommercialPropertySell.updateMany(
        { property_id: { $in: assigned_commercial_sell_properties } },
        { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeObj.name } },
        { session }
      );

      // Update customers
      await ResidentialPropertyCustomerRent.updateMany(
        { customer_id: { $in: assigned_residential_rent_customers } },
        { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeObj.name } },
        { session }
      );
      await ResidentialPropertyCustomerBuy.updateMany(
        { customer_id: { $in: assigned_residential_buy_customers } },
        { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeObj.name } },
        { session }
      );
      await CommercialPropertyCustomerRent.updateMany(
        { customer_id: { $in: assigned_commercial_rent_customers } },
        { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeObj.name } },
        { session }
      );
      await CommercialPropertyCustomerBuy.updateMany(
        { customer_id: { $in: assigned_commercial_buy_customers } },
        { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeObj.name } },
        { session }
      );

      // Remove employee from agent's employee list
      await User.updateOne(
        { id: agentId },
        { $pull: { employees: employeeId } },
        { session }
      );

      // Delete the employee document
      await User.deleteOne({ id: employeeId }, { session });

      await session.commitTransaction();
      session.endSession();
      return "success";
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error deleting employee:", err);
      throw new AppError("Failed to delete employee: " + err.message, 500);
    }
  }

  static async updatePropertiesForEmployee(reqUserId, employeeId, employeeName, operation, whatToUpdateData) {
    const { isResidential, isCommercial, isForRent, isForSell, isProperty, isCustomer, property_id, customer_id } = whatToUpdateData;
    let fieldToUpdate = null;
    let assetId = null;

    if (isProperty) {
      if (isResidential && isForRent) fieldToUpdate = "assigned_residential_rent_properties";
      else if (isResidential && isForSell) fieldToUpdate = "assigned_residential_sell_properties";
      else if (isCommercial && isForRent) fieldToUpdate = "assigned_commercial_rent_properties";
      else if (isCommercial && isForSell) fieldToUpdate = "assigned_commercial_sell_properties";
      assetId = property_id;
    } else if (isCustomer) {
      if (isResidential && isForRent) fieldToUpdate = "assigned_residential_rent_customers";
      else if (isResidential && isForSell) fieldToUpdate = "assigned_residential_buy_customers";
      else if (isCommercial && isForRent) fieldToUpdate = "assigned_commercial_rent_customers";
      else if (isCommercial && isForSell) fieldToUpdate = "assigned_commercial_buy_customers";
      assetId = customer_id;
    }

    let updatedEmployee = null;
    if (operation === "add") {
      updatedEmployee = await User.findOneAndUpdate(
        { id: employeeId, works_for: reqUserId },
        { $addToSet: { [fieldToUpdate]: assetId }, $set: { update_date_time: new Date() } },
        { new: true, lean: true }
      );
    } else if (operation === "remove") {
      updatedEmployee = await User.findOneAndUpdate(
        { id: employeeId, works_for: reqUserId },
        { $pull: { [fieldToUpdate]: assetId }, $set: { update_date_time: new Date() } },
        { new: true, lean: true }
      );
    }

    if (!updatedEmployee) {
      throw new AppError("Unauthorized or employee not found.", 403);
    }

    if (operation === "add") {
      await this._addEmployeeToPropertyOrCustomer(whatToUpdateData, employeeId, employeeName);
    } else if (operation === "remove") {
      await this._removeEmployeeFromPropertyOrCustomer(whatToUpdateData, employeeId, employeeName);
    }
    return "success";
  }

  static async _addEmployeeToPropertyOrCustomer(whatToUpdateData, employeeId, employeeName) {
    if (whatToUpdateData.isProperty) {
      if (whatToUpdateData.isResidential) {
        if (whatToUpdateData.isForRent) {
          await ResidentialPropertyRent.updateOne(
            { property_id: whatToUpdateData.property_id },
            { $addToSet: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } }
          );
        } else if (whatToUpdateData.isForSell) {
          await ResidentialPropertySell.updateOne(
            { property_id: whatToUpdateData.property_id },
            { $addToSet: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } }
          );
        }
      } else if (whatToUpdateData.isCommercial) {
        if (whatToUpdateData.isForRent) {
          await CommercialPropertyRent.updateOne(
            { property_id: whatToUpdateData.property_id },
            { $addToSet: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } }
          );
        } else if (whatToUpdateData.isForSell) {
          await CommercialPropertySell.updateOne(
            { property_id: whatToUpdateData.property_id },
            { $addToSet: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } }
          );
        }
      }
    } else if (whatToUpdateData.isCustomer) {
      if (whatToUpdateData.isResidential) {
        if (whatToUpdateData.isForRent) {
          await ResidentialPropertyCustomerRent.updateOne(
            { customer_id: whatToUpdateData.customer_id },
            { $addToSet: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } }
          );
        } else if (whatToUpdateData.isForSell) {
          await ResidentialPropertyCustomerBuy.updateOne(
            { customer_id: whatToUpdateData.customer_id },
            { $addToSet: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } }
          );
        }
      } else if (whatToUpdateData.isCommercial) {
        if (whatToUpdateData.isForRent) {
          await CommercialPropertyCustomerRent.updateOne(
            { customer_id: whatToUpdateData.customer_id },
            { $addToSet: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } }
          );
        } else if (whatToUpdateData.isForSell) {
          await CommercialPropertyCustomerBuy.updateOne(
            { customer_id: whatToUpdateData.customer_id },
            { $addToSet: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } }
          );
        }
      }
    }
    return true;
  }

  static async _removeEmployeeFromPropertyOrCustomer(whatToUpdateData, employeeId, employeeName) {
    if (whatToUpdateData.isProperty) {
      if (whatToUpdateData.isResidential) {
        if (whatToUpdateData.isForRent) {
          await ResidentialPropertyRent.updateOne({ property_id: whatToUpdateData.property_id }, { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } });
        } else if (whatToUpdateData.isForSell) {
          await ResidentialPropertySell.updateOne({ property_id: whatToUpdateData.property_id }, { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } });
        }
      } else if (whatToUpdateData.isCommercial) {
        if (whatToUpdateData.isForRent) {
          await CommercialPropertyRent.updateOne({ property_id: whatToUpdateData.property_id }, { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } });
        } else if (whatToUpdateData.isForSell) {
          await CommercialPropertySell.updateOne({ property_id: whatToUpdateData.property_id }, { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } });
        }
      }
    } else if (whatToUpdateData.isCustomer) {
      if (whatToUpdateData.isResidential) {
        if (whatToUpdateData.isForRent) {
          await ResidentialPropertyCustomerRent.updateOne({ customer_id: whatToUpdateData.customer_id }, { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } });
        } else if (whatToUpdateData.isForSell) {
          await ResidentialPropertyCustomerBuy.updateOne({ customer_id: whatToUpdateData.customer_id }, { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } });
        }
      } else if (whatToUpdateData.isCommercial) {
        if (whatToUpdateData.isForRent) {
          await CommercialPropertyCustomerRent.updateOne({ customer_id: whatToUpdateData.customer_id }, { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } });
        } else if (whatToUpdateData.isForSell) {
          await CommercialPropertyCustomerBuy.updateOne({ customer_id: whatToUpdateData.customer_id }, { $pull: { assigned_to_employee: employeeId, assigned_to_employee_name: employeeName } });
        }
      }
    }
    return true;
  }

  static async updateEmployeeEditRights(employeeId, accessRights) {
    const result = await User.updateOne({ id: employeeId }, { $set: { access_rights: accessRights, update_date_time: new Date() } });
    if (result.matchedCount === 0) {
      throw new AppError('Employee not found.', 404);
    }
    return "success";
  }
}

module.exports = EmployeeService;