// services/userService.js
const User = require('../models/user');
const AppError = require('../utils/appError');
const { uniqueId } = require('../utils/helpers');

class UserService {
  static async findOrCreateUser(mobile, country, countryCode) {
    let user = await User.findOne({ mobile }).lean().exec();

    if (user) {
      return user;
    } else {
      const newUserId = uniqueId();
      const userObj = {
        id: newUserId,
        expo_token: '',
        user_type: "agent",
        works_for: newUserId, // For agents, they work for themselves
        name: null,
        country: country,
        country_code: countryCode,
        mobile: mobile,
        create_date_time: new Date(),
        update_date_time: new Date()
      };
      try {
        const newUser = await User.create(userObj);
        console.log('New User Created', newUser);
        return newUser; // Return a plain JavaScript object
      } catch (error) {
        throw new AppError(`Failed to create new user: ${error.message}`, 500);
      }
    }
  }

  static async checkLoginRole(mobileNumber) {
    const user = await User.findOne({ mobile: mobileNumber }).lean().exec();

    if (!user) {
      // Mobile number not present, create a new user as an agent
      const newUserId = uniqueId();
      const newUserObj = {
        user_type: "agent",
        id: newUserId,
        expo_token: null,
        name: null,
        company_name: null,
        mobile: mobileNumber,
        address: null,
        city: null,
        access_rights: "all",
        employees: [],
        works_for: newUserId,
        user_status: "active",
        create_date_time: new Date(),
        update_date_time: new Date()
      };
      const createdUser = await User.create(newUserObj);
      return {
        user_type: createdUser.user_type,
        id: createdUser.id,
        expo_token: createdUser.expo_token,
        name: createdUser.name,
        company_name: createdUser.company_name,
        mobile: createdUser.mobile,
        address: createdUser.address,
        city: createdUser.city,
        access_rights: createdUser.access_rights,
        works_for: createdUser.works_for,
        user_status: createdUser.user_status
      };
    }

    if (user.user_type === "agent") {
      return {
        user_type: user.user_type,
        id: user.id,
        expo_token: user.expo_token,
        name: user.name,
        company_name: user.company_name,
        mobile: user.mobile,
        address: user.address,
        city: user.city,
        access_rights: user.access_rights,
        works_for: user.id, // self user_id
        user_status: user.user_status
      };
    } else {
      throw new AppError('This user is an employee. Please use employee login flow.', 403);
    }
  }

  static async updateUserProfile(userId, profileDetails) {
    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      {
        $set: {
          name: profileDetails.name,
          company_name: profileDetails.company,
          city: profileDetails.city,
          email: profileDetails.email,
          update_date_time: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new AppError('User not found.', 404);
    }
    return updatedUser.toObject();
  }

  static async insertNewAgent(mobileNumber, userType, accessRights) {
    const userId = uniqueId();
    const userObj = {
      user_type: userType,
      id: userId,
      expo_token: null,
      name: null,
      company_name: null,
      mobile: mobileNumber,
      address: null,
      city: null,
      access_rights: accessRights,
      employees: [],
      works_for: userId,
      create_date_time: new Date(),
      update_date_time: new Date()
    };
    const newUser = await User.create(userObj);
    return {
      user_type: newUser.user_type,
      id: newUser.id,
      expo_token: newUser.expo_token,
      name: newUser.name,
      company_name: newUser.company_name,
      mobile: newUser.mobile,
      address: newUser.address,
      city: newUser.city,
      access_rights: newUser.access_rights,
      works_for: newUser.works_for
    };
  }

  static async deleteAgentAccount(agentId, reqUserId) {
    if (reqUserId !== agentId) {
      throw new AppError("Unauthorized to delete this agent's account.", 403);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Remove properties
      await CommercialPropertyRent.deleteMany({ agent_id: agentId }).session(session);
      await CommercialPropertySell.deleteMany({ agent_id: agentId }).session(session);
      await ResidentialPropertyRent.deleteMany({ agent_id: agentId }).session(session);
      await ResidentialPropertySell.deleteMany({ agent_id: agentId }).session(session);

      // Remove customers
      await CommercialPropertyCustomerRent.deleteMany({ agent_id: agentId }).session(session);
      await CommercialPropertyCustomerBuy.deleteMany({ agent_id: agentId }).session(session);
      await ResidentialPropertyCustomerRent.deleteMany({ agent_id: agentId }).session(session);
      await ResidentialPropertyCustomerBuy.deleteMany({ agent_id: agentId }).session(session);

      // Remove reminders
      await Reminder.deleteMany({ agent_id_of_client: agentId }).session(session);
      await Reminder.deleteMany({ meeting_creator_id: agentId }).session(session);

      // Remove employees
      const employees = await User.find({ works_for: agentId, user_type: "employee" }).session(session).lean().exec();
      for (const employee of employees) {
        await User.deleteOne({ id: employee.id }).session(session);
      }

      // Finally remove the agent account
      await User.deleteOne({ id: agentId }).session(session);

      await session.commitTransaction();
      session.endSession();
      return "success";
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error deleting agent account:", error);
      throw new AppError("Failed to delete agent account.", 500);
    }
  }

  static async reactivateAccount(agentId) {
    const result = await User.updateOne({ id: agentId }, { $set: { user_status: "active", update_date_time: new Date() } });
    if (result.matchedCount === 0) {
      throw new AppError('Agent account not found.', 404);
    }
    return "success";
  }
}

module.exports = UserService;