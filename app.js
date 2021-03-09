const express = require("express");
const bodyParser = require("body-parser");
var busboy = require("connect-busboy");
const mongoose = require("mongoose");
const path = require("path"); //used for file path
var uuid = require("uuid");

// https://in.pinterest.com/pin/677299231444826508/

const ResidentialProperty = require("./models/residentialProperty");
const CommercialProperty = require("./models/commercialProperty");
const Reminder = require("./models/reminder");
const Agent = require("./models/agent");
const Employee = require("./models/employee");
const User = require("./models/user");

const app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    //"Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// start: Connect to DB
mongoose
  .connect(
    // "mongodb+srv://vichi:vichi123@cluster0-1ys3l.gcp.mongodb.net/test?retryWrites=true&w=majority"
    "mongodb+srv://vichi:vichi123@cluster0.dx3cf.mongodb.net/propM?retryWrites=true&w=majority"
  )
  .then(() => {
    // app.listen(6000 ,'0.0.0.0');
    app.listen(3000, "0.0.0.0", () => {
      console.log("server is listening on 3000 port");
    });

    console.log("MongoDB connected...server listening at 3000");
  })
  .catch(err => console.log(err));

// end: Connect to DB

app.post("/checkLoginRole", function(req, res) {
  console.log("checkLoginRole");
  checkLoginRole(req, res);
});

app.post("/insertNewAgent", function(req, res) {
  console.log("insertNewAgent");
  insertNewAgent(req, res);
});

app.post("/addEmployee", function(req, res) {
  console.log("addEmployee");
  addEmployee(req, res);
});

app.post("/getReminderList", function(req, res) {
  console.log("getReminderList");
  getReminderList(req, res);
});

app.post("/addNewReminder", function(req, res) {
  console.log("addNewReminder");
  addNewReminder(req, res);
});

app.post("/addNewResidentialRentProperty", function(req, res) {
  addNewResidentialRentProperty(req, res);
});

app.post("/addNewCommercialProperty", function(req, res) {
  addNewCommercialProperty(req, res);
});

app.post("/commercialPropertyListings", function(req, res) {
  console.log("commercial Property Listings");
  getCommercialPropertyListings(req, res);
});

app.post("/residentialPropertyListings", function(req, res) {
  console.log("residential property Listings");
  getResidentialPropertyListings(req, res);
});

const checkLoginRole = (req, res) => {
  const mobileNumber = JSON.parse(JSON.stringify(req.body)).user_mobile;
  console.log(JSON.stringify(req.body));

  User.findOne({ mobile: mobileNumber }, function(err, data) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify("fail"));
      res.end();
      return;
    }
    console.log("User data: " + data);
    if (data !== null && data.length !== 0) {
      res.send(JSON.stringify(data));
      res.end();
      return;
    } else {
      // mobile number is not present let create a new user
      insertNewUser(res, mobileNumber);
    }
  });
};

const checkLoginRoleX = (req, res) => {
  const mobileNumber = JSON.parse(JSON.stringify(req.body)).user_mobile;
  console.log(JSON.stringify(req.body));
  // const mobileNumber = "12345";
  // check if its refered as employee by some agent
  Employee.findOne({ employee_mobile: mobileNumber }, function(
    err,
    employeeData
  ) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify("fail"));
      res.end();
      return;
    }
    console.log("employeeData: " + employeeData);
    if (employeeData && employeeData.length !== 0) {
      console.log("present as Employee: " + employeeData);
      // check if refered by more then one agent
      const employerDataArray = getEmployerDetails(employeeData.agent_ids);
      console.log("multiple employer for this Employee: " + employerDataArray);
      // might be possible that it is already logged in as Agent so check
      const agentData = checkIfAgent(mobileNumber);
      console.log("present as Employee: " + agentData);
      const sendData = {
        agent_details: agentData,
        employer_details: employerDataArray
      };
      res.send(JSON.stringify(sendData));
      res.end();
      return;
    } else {
      // check if its an agent
      Agent.findOne({ agent_mobile: mobileNumber }, function(err, data) {
        if (err) {
          console.log(err);
          res.send(JSON.stringify("fail"));
          res.end();
          return;
        }
        console.log("Agent data: " + data);
        if (data !== null && data.length !== 0) {
          res.send(JSON.stringify(data));
          res.end();
          return;
        } else {
          // mobile number is not present let create an agent id for him
          insertNewAgent(res, mobileNumber);
        }
      });
    }
  });
};

const getEmployerDetails = agentIdsArray => {
  Agent.find({ agent_id: { $in: agentIdsArray } }, function(err, data) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify("fail"));
      res.end();
      return [];
    }
    console.log("data: " + data);
    if (data.length !== 0) {
      console.log("Agent is present: " + data);

      return data;
    } else {
      // mobile number is not present let create an agent id for him
      insertNewAgent();
    }
  });
};

const checkIfAgent = () => {
  Agent.findOne({ agent_mobile: mobileNumber }, function(err, data) {
    if (err) {
      console.log(err);
      // res.send(JSON.stringify("fail"));
      // res.end();
      return [];
    }
    console.log("data: " + data);
    if (data.length !== 0) {
      console.log("Agent is present: " + data);
      // res.send(JSON.stringify(data));
      // res.end();
      return data;
    }
  });
};

const insertNewUser = (res, mobile) => {
  const userId = uuid.v4();
  const userObj = {
    user_type: "employee", // employee or agent
    agent_ids: [], // size will be one only then insert
    id: userId,
    expo_token: null,
    name: null,
    mobile: mobile,
    company_name: null,
    city: null,
    access_rights: "read", // read , edit
    create_date_time: new Date(Date.now()),
    update_date_time: new Date(Date.now())
  };
  User.collection.insertOne(userObj, function(err, data) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify("fail"));
      res.end();
      return;
    } else {
      // console.log("addNewProperty" + JSON.stringify(data));
      const userDetails = {
        user_id: userId,
        user_type: "employee", // agent, employee
        expo_token: null,
        user_name: null,
        company_name: null,
        user_mobile: mobile,
        user_city: null,
        works_for: "agentId" // agent_id
      };
      res.send(JSON.stringify({ user_details: userDetails }));
      res.end();
      return;
    }
  });
};

const insertNewEmployee = (res, mobile) => {
  const employeeId = uuid.v4();
  const employeeObj = {
    user_type: "employee", // employee or agent
    agent_ids: [], // size will be one only then insert
    employee_id: employeeId,
    expo_token: null,
    employee_name: null,
    employee_mobile: mobile,
    company_name: null,
    employee_city: null,
    access_rights: "read", // read , edit
    create_date_time: new Date(Date.now()),
    update_date_time: new Date(Date.now())
  };
  Employee.collection.insertOne(employeeObj, function(err, data) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify("fail"));
      res.end();
      return;
    } else {
      // console.log("addNewProperty" + JSON.stringify(data));
      const userDetails = {
        user_id: employeeId,
        user_type: "employee", // agent, employee
        expo_token: null,
        user_name: null,
        company_name: null,
        user_mobile: mobile,
        user_city: null,
        works_for: "agentId" // agent_id
      };
      res.send(JSON.stringify({ user_details: userDetails }));
      res.end();
      return;
    }
  });
};

const insertNewAgent = (res, mobile) => {
  // const agentMobileDict = JSON.parse(JSON.stringify(req.body));
  const agentId = uuid.v4();
  const agentObj = {
    user_type: "agent",
    id: agentId,
    expo_token: null,
    name: null,
    access_rights: "all",
    company_name: null,
    mobile: mobile,
    address: null,
    city: null,
    employees: [],
    create_date_time: new Date(Date.now()),
    update_date_time: new Date(Date.now())
  };
  Agent.collection.insertOne(agentObj, function(err, data) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify("fail"));
      res.end();
      return;
    } else {
      // console.log("addNewProperty" + JSON.stringify(data));
      const userDetails = {
        user_id: agentId,
        user_type: "agent", // agent, employee
        expo_token: null,
        user_name: null,
        company_name: null,
        user_mobile: mobile,
        user_city: null,
        works_for: agentId // agent_id
      };
      res.send(JSON.stringify({ user_details: userDetails }));
      res.end();
      return;
    }
  });
};
const addEmployee = (req, res) => {
  const employeeDetails = JSON.parse(JSON.stringify(req.body));
  Agent.updateOne(
    { agent_id: employeeDetails.agent_id },
    { $addToSet: { employees: employeeDetails.employee } },
    function(err, data) {
      if (err) {
        console.log(err);
        res.send(JSON.stringify("fail"));
        res.end();
        return;
      } else {
        res.send(JSON.stringify({ agent_id: agent_id }));
        res.end();
        return;
      }
    }
  );
};

const getReminderList = (req, res) => {
  const agentIdDict = JSON.parse(JSON.stringify(req.body));
  Reminder.find({ agent_id: agentIdDict.agent_id }, function(err, data) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("response datax:  " + JSON.stringify(data));
      res.send(JSON.stringify(data));
      res.end();
      return;
    }
  }).sort({ agent_id: -1 });
};

const addNewReminder = (req, res) => {
  const reminderDetails = JSON.parse(JSON.stringify(req.body));
  const reminderId = uuid.v4();
  reminderDetails["reminder_id"] = reminderId;
  console.log("reminderDetails: " + JSON.stringify(reminderDetails));
  Reminder.collection.insertOne(reminderDetails, function(err, data) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify("fail"));
      res.end();
      return;
    } else {
      // console.log("addNewProperty" + JSON.stringify(data));
      if (reminderDetails.property_type === "Residential") {
        ResidentialProperty.updateOne(
          { property_id: reminderDetails.property_id },
          { $addToSet: { reminders: reminderId } },
          function(err, data) {
            if (err) {
              console.log(err);
              res.send(JSON.stringify("fail"));
              res.end();
              return;
            } else {
              res.send(JSON.stringify({ reminderId: reminderId }));
              res.end();
              return;
            }
          }
        );
      } else if (reminderDetails.property_type === "Commercial") {
        CommercialProperty.updateOne(
          { property_id: reminderDetails.property_id },
          { $addToSet: { reminders: reminderId } },
          function(err, data) {
            if (err) {
              console.log(err);
              res.send(JSON.stringify("fail"));
              res.end();
              return;
            } else {
              res.send(JSON.stringify({ reminderId: reminderId }));
              res.end();
              return;
            }
          }
        );
      }
    }
  });
};

const getCommercialPropertyListings = (req, res) => {
  const agentDetails = JSON.parse(JSON.stringify(req.body));
  const agent_id = agentDetails.agent_id;
  CommercialProperty.find({ agent_id: agent_id }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    // console.log(JSON.stringify(data));
    res.send(data);
    res.end();
  });
};

const getResidentialPropertyListings = (req, res) => {
  const agentDetails = JSON.parse(JSON.stringify(req.body));
  const agent_id = agentDetails.agent_id;
  ResidentialProperty.find({ agent_id: agent_id }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    // console.log(JSON.stringify(data));
    res.send(data);
    res.end();
  });
};

const addNewCommercialProperty = (req, res) => {
  // console.log("Prop details1: " + JSON.stringify(req.body));
  const propertyDetails = JSON.parse(JSON.stringify(req.body));
  // console.log("Prop details2: " + propertyDetails);
  const propertyId = uuid.v4();
  let x;

  const propertyDetailsDict = {
    property_id: propertyId,
    agent_id: "1234",
    property_type: propertyDetails.property_type,
    property_for: propertyDetails.property_for,
    owner_details: {
      name: propertyDetails.owner_details.name,
      mobile1: propertyDetails.owner_details.mobile1,
      mobile2: propertyDetails.owner_details.mobile2,
      address: propertyDetails.owner_details.address
    },
    property_address: {
      city: propertyDetails.property_address.city,
      location_area: propertyDetails.property_address.location_area,
      flat_number: propertyDetails.property_address.flat_number,
      building_name: propertyDetails.property_address.building_name,
      landmark_or_street: propertyDetails.property_address.landmark_or_street,
      pin: propertyDetails.property_address.pin
    },

    property_details: {
      property_used_for: propertyDetails.property_details.property_used_for,
      building_type: propertyDetails.property_details.building_type,
      ideal_for: propertyDetails.property_details.ideal_for,
      parking_type: propertyDetails.property_details.parking_type,
      property_age: propertyDetails.property_details.property_age,
      power_backup: propertyDetails.property_details.power_backup,
      property_size: propertyDetails.property_details.property_size
    },

    image_urls: ["vichi1"],
    create_date_time: new Date(Date.now()),
    update_date_time: new Date(Date.now())
  };

  if (propertyDetails.property_type === "Commercial") {
    if (propertyDetails.property_for === "Rent") {
      propertyDetailsDict["rent_details"] = {
        expected_rent: propertyDetails.rent_details.expected_rent,
        expected_deposit: propertyDetails.rent_details.expected_deposit,
        available_from: propertyDetails.rent_details.available_from
      };
    } else if (propertyDetails.property_for === "Sell") {
      propertyDetailsDict["sell_details"] = {
        expected_sell_price: propertyDetails.sell_details.expected_sell_price,
        maintenance_charge: propertyDetails.sell_details.maintenance_charge,
        available_from: propertyDetails.sell_details.available_from,
        negotiable: propertyDetails.sell_details.negotiable
      };
    }
  }

  CommercialProperty.collection.insertOne(propertyDetailsDict, function(
    err,
    data
  ) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify("fail"));
      res.end();
      return;
    } else {
      // console.log("addNewProperty" + JSON.stringify(data));
      res.send(JSON.stringify({ propertyId: propertyId }));
      res.end();
      return;
    }
  });
};

const addNewResidentialRentProperty = (req, res) => {
  // console.log("Prop details1: " + JSON.stringify(req.body));
  const propertyDetails = JSON.parse(JSON.stringify(req.body));
  // console.log("Prop details2: " + propertyDetails);
  const propertyId = uuid.v4();
  let x;

  const propertyDetailsDict = {
    property_id: propertyId,
    agent_id: "1234",
    property_type: propertyDetails.property_type,
    property_for: propertyDetails.property_for,
    owner_details: {
      name: propertyDetails.owner_details.name,
      mobile1: propertyDetails.owner_details.mobile1,
      mobile2: propertyDetails.owner_details.mobile2,
      address: propertyDetails.owner_details.address
    },
    property_address: {
      city: propertyDetails.property_address.city,
      location_area: propertyDetails.property_address.location_area,
      flat_number: propertyDetails.property_address.flat_number,
      building_name: propertyDetails.property_address.building_name,
      landmark_or_street: propertyDetails.property_address.landmark_or_street,
      pin: propertyDetails.property_address.pin
    },

    property_details: {
      house_type: propertyDetails.property_details.house_type,
      bhk_type: propertyDetails.property_details.bhk_type,
      washroom_numbers: propertyDetails.property_details.washroom_numbers,
      furnishing_status: propertyDetails.property_details.furnishing_status,
      parking_type: propertyDetails.property_details.parking_type,
      parking_number: propertyDetails.property_details.parking_number,
      property_age: propertyDetails.property_details.property_age,
      floor_number: propertyDetails.property_details.floor_number,
      total_floor: propertyDetails.property_details.total_floor,
      lift: propertyDetails.property_details.lift,
      property_size: propertyDetails.property_details.property_size
    },

    // rent_details: {
    //   expected_rent: propertyDetails.rent_details.expected_rent,
    //   expected_deposit: propertyDetails.rent_details.expected_deposit,
    //   available_from: propertyDetails.rent_details.available_from,
    //   preferred_tenants: propertyDetails.rent_details.preferred_tenants,
    //   non_veg_allowed: propertyDetails.rent_details.non_veg_allowed
    // },

    image_urls: ["vichi1"],
    create_date_time: new Date(Date.now()),
    update_date_time: new Date(Date.now())
  };

  if (propertyDetails.property_type === "Residential") {
    if (propertyDetails.property_for === "Rent") {
      propertyDetailsDict["rent_details"] = {
        expected_rent: propertyDetails.rent_details.expected_rent,
        expected_deposit: propertyDetails.rent_details.expected_deposit,
        available_from: propertyDetails.rent_details.available_from,
        preferred_tenants: propertyDetails.rent_details.preferred_tenants,
        non_veg_allowed: propertyDetails.rent_details.non_veg_allowed
      };
    } else if (propertyDetails.property_for === "Sell") {
      propertyDetailsDict["sell_details"] = {
        expected_sell_price: propertyDetails.sell_details.expected_sell_price,
        maintenance_charge: propertyDetails.sell_details.maintenance_charge,
        available_from: propertyDetails.sell_details.available_from,
        negotiable: propertyDetails.sell_details.negotiable
      };
    }
  }

  ResidentialProperty.collection.insertOne(propertyDetailsDict, function(
    err,
    data
  ) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ property_id: null }));
      res.end();
      return;
    } else {
      // console.log("addNewProperty" + JSON.stringify(data));
      res.send(JSON.stringify({ property_id: propertyId }));
      res.end();
      return;
    }
  });
};

// Prop details: { "property_type": "Residential", "property_for": "Rent",
// XXXX "owner_details": { "name": "C", "mobile1": "c", "mobile2": "c", "address": "C" },
// XXXX "property_address": { "city": "C", "location_area": "C", "flat_number": "C", "building_name": "C",
// "landmark_or_street": "C", "pin": "123" },
// XXX "property_details": { "house_type": "Apartment", "bhk_type": "1BHK", "washroom_numbers": "3",
// "furnishing_status": "Semi", "parking_type": "Car", "parking_number": "4", "property_age": "11-15",
// "floor_number": "2", "total_floor": "34", "lift": "Yes", "property_size": "900" },
// XXX "rent_details": { "expected_rent": "900", "expected_deposit": "9000", "available_from": "Mon Feb 08 2021",
// "preferred_tenants": "Bachelors", "non_veg_allowed": "Yes" },
// XXX "image_urls": ["file:///Users/vichi/Library/Developer/CoreSimulator/Devices/7C0C81F7-DF53-4304-9A77-4A1F2D659F4A/data/Containers/Data/Application/9947131E-2C68-4D8A-B9F4-1188B9DA6F8B/Library/Caches/ExponentExperienceData/%2540vichi%252FpropM/ImagePicker/CA553CF1-DBF0-4625-BC72-A25BDC554C48.jpg"] }
