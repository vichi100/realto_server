# How to login mongo db

sudo service mongod stop
sudo service mongod start
sudo service mongod status




admin@vmi2390151:~$ mongosh
Current Mongosh Log ID:	67b1076c4264af247b544ca6
Connecting to:		mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.8
Using MongoDB:		8.0.4
Using Mongosh:		2.3.8
mongosh 2.3.9 is available for download: https://www.mongodb.com/try/download/shell

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

test> use realtodb
switched to db realtodb
realtodb> db.auth("realto", "realto123")
{ ok: 1 }
realtodb> show collections
commercial_customers
commercial_properties
commercialpropertycustomers
customers
reminders
residential_customers
residential_properties
users
realtodb> 

sudo systemctl start mongod

sudo service mongod stop

sudo service mongod [start|stop|restart|status]

sudo tail -n 100 /var/log/mongodb/mongod.log


### Delete data from one collection

db.your_collection_name.deleteMany({});

### Delete all data from all collections

const collections = db.getCollectionNames();

collections.forEach(collection => {
    db[collection].deleteMany({}); // Delete all documents in the collection
   // Optionally, drop the collection itself:
    // db[collection].drop();
});

### delete remiders from all Collections ######

show collections


const collections = db.getCollectionNames();

collections.forEach(collection => {
 db[collection].updateMany(
  { reminders: { $exists: true } }, // Match documents where 'reminders' exists
  { $set: { reminders: [] } }     
)   
});

db.reminders.deleteMany({})

### delete remiders from specific Collection ######

db.residential_property_rents.updateMany(
  {}, // Empty filter means "update all documents"
  { $set: { reminders: [] } } // Set reminders to [] for all matched docs
)

### How to kill Process which is using a port ###

vichirajan@192 ~ % sudo lsof -i 7002       
Password: <your mac password>

vichirajan@192 ~ % sudo lsof -i :7002
COMMAND   PID       USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    68127 vichirajan   19u  IPv4 0xdc4c52e5d1247be6      0t0  TCP 192.168.1.9:afs3-prserver->192.168.1.6:60121 (ESTABLISHED)
node    68127 vichirajan   27u  IPv4 0x22b34ca9b1fbd644      0t0  TCP *:afs3-prserver (LISTEN)
node    68127 vichirajan   29u  IPv4 0xa75a392e36e53a95      0t0  TCP 192.168.1.9:afs3-prserver->192.168.1.6:60114 (ESTABLISHED)
vichirajan@192 ~ % kill 68127
vichirajan@192 ~ % sudo lsof -i :7002
vichirajan@192 ~ % 






# TODO
1) DB functinality to delete property and customer
2) meeting categorization past and future on reminder screen and customer details screen - Done
3) Global search
4) diffrent collor coding on bottom bar - Done
5) meeting reschedule functionality
6) Modify code to store the location where customer wants property. for both type of customer Residential and Commercial
7) create a form so that agent will sent link on whats up to fill that with details
8) create a button on global search right top to check recenly matched property or cutomer  this will have below sections
   1) matched witin hour
   2) today
   3) older
9) liked property
10) display how many percent property or customer match to eachother
11) create location model for residential and commercial property too like customer to provide sugestion at time when some one posting .. that how many possible match this post have
12) add a flag when any add/update/edit opration happen so that if you go to that data page you can refetch the data
   example: you create a meeting then make set newMeetingadded flag to true so if you go on reminder page, you will refech the meeting data

13) create below tables for matching cutomer to property, create seprate table for buy and rent
   1) property -> customer array for residential : residentialRentPropertyMatch, residentialBuyPropertyMatch
   2) property -> customer array for commercial: commercialRentPropertyMatch, commercialBuyPropertyMatch
   3) cusomer -> properties array for residential: residentialRentCustomerMatch, residentialBuyCustomerMatch
   4) cusomer -> properties array for commercial: commercialRentCustomerMatch, commercialBuyCustomerMatch

   There will be schduled job will run after 1 hour from last run

   const PropertySchema = new mongoose.Schema({
      id: { type: String, required: true },
      location: { type: String, required: true },
      price: { type: Number, required: true },
      interestedCustomers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }] // Many-to-Many Reference
   });

   const Property = mongoose.model('Property', PropertySchema);
   module.exports = Property;


   const CustomerSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      interestedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }] // Many-to-Many Reference
   });

   const Customer = mongoose.model('Customer', CustomerSchema);
   module.exports = Customer;


   ✅ 6️⃣ Example: Schedule a Database Cleanup Every Sunday
      const cron = require('node-cron');
      const mongoose = require('mongoose');
      const User = require('./models/User'); // Example Mongoose model

      // Connect to MongoDB
      mongoose.connect('mongodb://localhost:27017/mydb');

      cron.schedule('0 0 * * 0', async () => {
      console.log('Running database cleanup...');
      await User.deleteMany({ inactive: true }); // Delete inactive users
      console.log('Cleanup done!');
      });

* * * * *  
↓ ↓ ↓ ↓ ↓  
| | | | └── Day of the Week (0-7) (Sunday = 0 or 7)  
| | | └──── Month (1-12)  
| | └────── Day of the Month (1-31)  
| └──────── Hour (0-23)  
└────────── Minute (0-59)


### Approaches to Modify Existing Documents

Update Documents Individually
You can update existing documents to match your new schema using update operations:

// Example: Adding a new field with a default value
db.yourCollection.updateMany(
  { newField: { $exists: false } }, // Find documents missing the field
  { $set: { newField: "defaultValue" } } // Add the field
);

db.residential_property_rents.updateMany(
  { assigned_to_employee: { $exists: false } }, // Find documents missing the field
  { $set: { assigned_to_employee: [] } } // Add the field
);

db.residential_property_sells.updateMany(
  { assigned_to_employee: { $exists: false } }, // Find documents missing the field
  { $set: { assigned_to_employee: [] } } // Add the field
);

db.commercial_customer_buys.updateMany(
  { assigned_to_employee: { $exists: false } }, // Find documents missing the field
  { $set: { assigned_to_employee: [] } } // Add the field
);

db.users.updateMany(
  { 
    assigned_residential_rent_properties: { $exists: false } // Ensure the field doesn't already exist
  },
  { 
    $set: { 
      assigned_residential_rent_properties: [],
      assigned_residential_sell_properties: [],
      assigned_commercial_rent_properties: [],
      assigned_commercial_sell_properties: [],
      assigned_residential_rent_customers: [],
      assigned_residential_buy_customers: [],
      assigned_commercial_rent_customers: [],
      assigned_commercial_buy_customers: []
    } 
  }
);


db.commercial_customer_buys.updateMany(
  { assigned_to_employee: { $exists: true } }, // Find documents missing the field
  { $set: { assigned_to_employee: [] } } // Add the field
);


### Employee issue
1) after deleting Ramu it is still in comercial customer BUY


### deleting employee is not delting from customers
### how employee who created meeting will able to see his meeting .... meeting creator id .. verify this logic - MUST CHECK ITS NOT WORKING........0.

