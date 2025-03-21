const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Reminder = require('../models/reminder');
const ResidentialPropertyCustomerRent = require('../models/residentialPropertyCustomerRent');
const ResidentialPropertyCustomerBuy = require('../models/residentialPropertyCustomerBuy');
const CommercialPropertyCustomerRent = require('../models/commercialPropertyCustomerRent');
const CommercialPropertyCustomerBuy = require('../models/commercialPropertyCustomerBuy');
const { getReminderListByCustomerId } = require('../app'); // Adjust the path as needed

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('getReminderListByCustomerId', () => {
  beforeEach(async () => {
    await Reminder.deleteMany({});
    await ResidentialPropertyCustomerRent.deleteMany({});
    await ResidentialPropertyCustomerBuy.deleteMany({});
    await CommercialPropertyCustomerRent.deleteMany({});
    await CommercialPropertyCustomerBuy.deleteMany({});
  });

  it('should return reminders for a residential rent customer', async () => {
    const customerId = 'customer1';
    const reminderId = 'reminder1';
    await ResidentialPropertyCustomerRent.create({ customer_id: customerId, reminders: [reminderId] });
    await Reminder.create({ reminder_id: reminderId, user_id: 'user1' });

    const req = { body: { customer_id: customerId, property_type: 'Residential', property_for: 'Rent', req_user_id: 'user1' } };
    const res = { send: jest.fn(), end: jest.fn() };

    await getReminderListByCustomerId(req, res);

    expect(res.send).toHaveBeenCalledWith(JSON.stringify([{ reminder_id: reminderId, user_id: 'user1' }]));
    expect(res.end).toHaveBeenCalled();
  });

  it('should return reminders for a residential buy customer', async () => {
    const customerId = 'customer2';
    const reminderId = 'reminder2';
    await ResidentialPropertyCustomerBuy.create({ customer_id: customerId, reminders: [reminderId] });
    await Reminder.create({ reminder_id: reminderId, user_id: 'user2' });

    const req = { body: { customer_id: customerId, property_type: 'Residential', property_for: 'Buy', req_user_id: 'user2' } };
    const res = { send: jest.fn(), end: jest.fn() };

    await getReminderListByCustomerId(req, res);

    expect(res.send).toHaveBeenCalledWith(JSON.stringify([{ reminder_id: reminderId, user_id: 'user2' }]));
    expect(res.end).toHaveBeenCalled();
  });

  it('should return reminders for a commercial rent customer', async () => {
    const customerId = 'customer3';
    const reminderId = 'reminder3';
    await CommercialPropertyCustomerRent.create({ customer_id: customerId, reminders: [reminderId] });
    await Reminder.create({ reminder_id: reminderId, user_id: 'user3' });

    const req = { body: { customer_id: customerId, property_type: 'Commercial', property_for: 'Rent', req_user_id: 'user3' } };
    const res = { send: jest.fn(), end: jest.fn() };

    await getReminderListByCustomerId(req, res);

    expect(res.send).toHaveBeenCalledWith(JSON.stringify([{ reminder_id: reminderId, user_id: 'user3' }]));
    expect(res.end).toHaveBeenCalled();
  });

  it('should return reminders for a commercial buy customer', async () => {
    const customerId = 'customer4';
    const reminderId = 'reminder4';
    await CommercialPropertyCustomerBuy.create({ customer_id: customerId, reminders: [reminderId] });
    await Reminder.create({ reminder_id: reminderId, user_id: 'user4' });

    const req = { body: { customer_id: customerId, property_type: 'Commercial', property_for: 'Buy', req_user_id: 'user4' } };
    const res = { send: jest.fn(), end: jest.fn() };

    await getReminderListByCustomerId(req, res);

    expect(res.send).toHaveBeenCalledWith(JSON.stringify([{ reminder_id: reminderId, user_id: 'user4' }]));
    expect(res.end).toHaveBeenCalled();
  });
});
