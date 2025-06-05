// utils/helpers.js
const { customAlphabet } = require('nanoid');
const { performance } = require('perf_hooks');
const User = require('../models/user'); // Assuming User model path

const uniqueId = () => {
  const nanoid1 = customAlphabet('1234567890', 5);
  const nanoid2 = customAlphabet('1234567890', 3);
  const nanoid3 = customAlphabet('1234567890', 2);
  const uniqueNumber = Math.floor(performance.now()).toString() + nanoid1() + nanoid2() + nanoid3();
  return uniqueNumber;
};

const getFileName = (agentId, index) => {
  return `${agentId}_${index}_${Date.now()}.jpeg`;
};

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const character = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

const getDirectoryPath = (agentId) => {
  const hashCode = Math.abs(hashString(agentId)).toString();
  const lastFive = hashCode.slice(-5);
  const childOneDir = lastFive.slice(0, 2);
  const childTwoDir = lastFive.slice(2, 4);
  const childThreeDir = lastFive.slice(-1);
  return `/${childOneDir}/${childTwoDir}/${childThreeDir}/`;
};

// This is for Properties of other agents
const replaceOwnerDetailsWithAgentDetails = async (properties, reqUserId) => {
  const finalProperties = [];
  for (const property of properties) {
    const otherPropertyAgentId = property.agent_id;
    if (otherPropertyAgentId === reqUserId) {
      finalProperties.push(property);
      continue;
    }
    const otherPropertyAgentDetails = await User.findOne({ id: otherPropertyAgentId }).lean().exec();
    if (otherPropertyAgentDetails) {
      const maskedProperty = { ...property }; // Create a copy to avoid modifying original
      maskedProperty.property_address = {
        city: property.property_address.city,
        main_text: property.property_address.main_text,
        formatted_address: property.property_address.formatted_address,
        flat_number: '',
        building_name: '',
        landmark_or_street: property.property_address.landmark_or_street,
      };
      maskedProperty.owner_details = {
        name: otherPropertyAgentDetails.name ? otherPropertyAgentDetails.name +' ,Agent': 'Agent',
        mobile1: otherPropertyAgentDetails.mobile,
        address: `Please contact agent and refer to property id: : ${property.property_id?.slice(-6)}`,
      };
      finalProperties.push(maskedProperty);
    }
  }
  return finalProperties;
};

// This is for Customers of other agents
const replaceCustomerDetailsWithAgentDetails = async (customers, reqUserId) => {
  const finalCustomers = [];
  for (const customer of customers) {
    const otherCustomerAgentId = customer.agent_id;
    if (otherCustomerAgentId === reqUserId) {
      finalCustomers.push(customer);
      continue;
    }
    const otherCustomerAgentDetails = await User.findOne({ id: otherCustomerAgentId }).lean().exec();
    if (otherCustomerAgentDetails) {
      const maskedCustomer = { ...customer }; // Create a copy
      maskedCustomer.customer_details = {
        name: otherCustomerAgentDetails.name === null ? 'Agent' : `${otherCustomerAgentDetails.name}, Agent`,
        mobile1: otherCustomerAgentDetails.mobile,
        address: `Please contact agent and refer to customer id: : ${customer.customer_id?.slice(-6)}`,
      };
      finalCustomers.push(maskedCustomer);
    }
  }
  return finalCustomers;
};

// This will remove duplicates from list2 based on propertyName and will return the list2 and list1
function removeDuplicates(list1, list2, propertyName) {
  const propertyValuesFromList1 = new Set(list1.map(item => item[propertyName]));
  const uniqueList2 = list2.filter(item => !propertyValuesFromList1.has(item[propertyName]));
  return [...list1, ...uniqueList2]; // Return combined list
}


module.exports = {
  uniqueId,
  getFileName,
  getDirectoryPath,
  replaceOwnerDetailsWithAgentDetails,
  replaceCustomerDetailsWithAgentDetails,
  removeDuplicates,
  hashString // Export if needed for other modules
};