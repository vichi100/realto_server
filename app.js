const express = require("express");
const bodyParser = require("body-parser");
var busboy = require("connect-busboy");
const mongoose = require("mongoose");
const path = require("path"); //used for file path
var uuid = require("uuid");
const fileUpload = require('express-fileupload');
const { nanoid, customAlphabet } = require('nanoid');
const axios = require('axios');
const sharp = require('sharp');
var fs = require('fs');
// const multer = require('multer');

// https://in.pinterest.com/pin/677299231444826508/

// 2 Factor API
const OTP_API = 'd19dd3b7-fc3f-11e7-a328-0200cd936042';


const CommercialPropertyRent = require("./models/commercialPropertyRent");
const CommercialPropertySell = require("./models/commercialPropertySell");

const CommercialCustomerBuyLocation = require("./models/commercialCustomerBuyLocation");
const CommercialCustomerRentLocation = require("./models/commercialCustomerRentLocation");

const CommercialBuyPropertyMatch = require('./models/match/commercialBuypropertyMatch');
const CommercialBuyCustomerMatch = require('./models/match/commercialBuyCustomerMatch');

const CommercialRentPropertyMatch = require('./models/match/commercialRentPropertyMatch');
const CommercialRentCustomerMatch = require('./models/match/commercialRentCustomerMatch');

const ResidentialPropertyRent = require("./models/residentialPropertyRent");
const ResidentialPropertySell = require('./models/residentialPropertySell');

const ResidentialCustomerBuyLocation = require("./models/residentialCustomerBuyLocation");
const ResidentialCustomerRentLocation = require("./models/residentialCustomerRentLocation");

const ResidentialRentPropertyMatch = require('./models/match/residentialRentPropertyMatch');
const ResidentialBuyPropertyMatchBuy = require('./models/match/residentialBuyPropertyMatch');
// const ResidentialBuyCustomerMatch = require('./models/match/residentialBuyCustomerMatch');
const ResidentialRentCustomerMatch = require('./models/match/residentialRentCustomerMatch');

const ResidentialBuyPropertyMatch = require('./models/match/residentialBuyPropertyMatch');
const ResidentialBuyCustomerMatch = require('./models/match/residentialBuyCustomerMatch');





const Reminder = require("./models/reminder");
const Agent = require("./models/agent");
const Employee = require("./models/employee");
const User = require("./models/user");
// const ResidentialPropertyCustomer = require("./models/residentialPropertyCustomer");
const ResidentialPropertyCustomerRent = require("./models/residentialPropertyCustomerRent");
const ResidentialPropertyCustomerBuy = require("./models/residentialPropertyCustomerBuy");
const CommercialPropertyCustomerRent = require("./models/commercialPropertyCustomerRent");
const CommercialPropertyCustomerBuy = require("./models/commercialPropertyCustomerBuy");
const Message = require("./models/message");
const commercialProperty = require("./models/commercialProperty");
const { json } = require("body-parser");
const commercialPropertyRent = require("./models/commercialPropertyRent");

const IMAGE_PATH_DEV = "/Users/vichirajan/Documents/github/realtoproject/images";
const IMAGE_PATH_PROD = "/root/realto/images";
const IMAGE_PATH_URL = IMAGE_PATH_DEV;

const matchRoutes = require('./routes/matchRoutes');

const app = express();
// app.use(busboy());
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:8081', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true // Include credentials if needed
}));

// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(IMAGE_PATH_URL));
app.use(fileUpload());

app.use(bodyParser.json());
// app.use(function (req, res, next) {
//   // res.header("Access-Control-Allow-Origin", "*");
//   // // res.header(
//   // //   "Access-Control-Allow-Methods",
//   // //   "GET,PUT,POST,DELETE,PATCH,OPTIONS"
//   // // );
//   // // res.header(
//   // //   //"Access-Control-Allow-Headers",
//   // //   "Origin, X-Requested-With, Content-Type, Accept"
//   // // );
//   // res.header(
//   //   "Access-Control-Allow-Headers",
//   //   "Origin, X-Requested With, Content-Type, Accept"
//   // );

//   // res.header("Access-Control-Allow-Origin", "*");
//   // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");


//   // res.header('Access-Control-Allow-Origin', '*');
//   // res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
//   // res.header(
//   //   'Access-Control-Allow-Headers',
//   //   'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization'
//   // );

//   next();
// });

// start: Connect to DB   mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.8
mongoose
  .connect(
    // "mongodb+srv://vichi:vichi123@cluster0-1ys3l.gcp.mongodb.net/test?retryWrites=true&w=majority"
    // "mongodb+srv://vichi:vichi123@cluster0.dx3cf.mongodb.net/propM?retryWrites=true&w=majority"
    "mongodb://realto:realto123@207.180.239.115:27017/realtodb"

  )
  .then(() => {
    // app.listen(6000 ,'0.0.0.0');
    app.listen(7002, "0.0.0.0", () => {
      console.log("server is listening on 7000 port");
    });

    console.log("MongoDB connected...server listening at 7000");
  })
  .catch(err => console.log(err));

// end: Connect to DB

const uniqueId = () => {
  const nanoid1 = customAlphabet('1234567890', 5); // Generates a 5-digit random number
  const nanoid2 = customAlphabet('1234567890', 3);
  const nanoid3 = customAlphabet('1234567890', 2);
  const uniqueNumber = Date.now().toString() + nanoid1() + nanoid2() + nanoid3();
  console.log(uniqueNumber); // Example: 171051387612387
  return uniqueNumber;
}

// app.post('/matchedResidentialCustomerRentList', matchRoutes);

app.post('/getGlobalSearchResult', function (req, res) {
  console.log('getGlobalSearchResult');
  getGlobalSearchResult(req, res);
});



app.post('/generateOTP', function (req, res) {
  console.log('generateOTP');
  generateOTP(req, res);
});

app.post('/getUserDetails', function (req, res) {
  console.log('getUserDetails');
  getUserDetails(req, res);
});

app.post("/getTotalListingSummary", function (req, res) {
  console.log("getTotalListingSummary");
  getTotalListingSummary(req, res);
});

app.post("/getMessagesList", function (req, res) {
  console.log("getMessagesList");
  getMessagesList(req, res);
});

app.post("/getSubjectDetails", function (req, res) {
  console.log("getSubjectDetails");
  getSubjectDetails(req, res);
});

app.post("/getEmployeeList", function (req, res) {
  console.log("getEmployeeList");
  getEmployeeList(req, res);
});

app.post("/getPropReminderList", function (req, res) {
  console.log("getPropReminderList");
  getPropReminderList(req, res);
});

app.post("/getCustomerReminderList", function (req, res) {
  console.log("getCustomerReminderList");
  getCustomerReminderList(req, res);
});



app.post("/getCustomerAndMeetingDetails", function (req, res) {
  console.log("getCustomerAndMeetingDetails");
  getCustomerAndMeetingDetails(req, res);
});

app.post("/getAllGlobalListingByLocations", function (req, res) {
  console.log("getAllGlobalListingByLocations");
  getAllGlobalListingByLocations(req, res);
});

app.post("/checkLoginRole", function (req, res) {
  console.log("checkLoginRole");
  checkLoginRole(req, res);
});

app.post("/insertNewAgent", function (req, res) {
  console.log("insertNewAgent");
  insertNewAgent(req, res);
});

app.post("/addEmployee", function (req, res) {
  console.log("addEmployee");
  addEmployee(req, res);
});

app.post("/sendMessage", function (req, res) {
  console.log("sendMessage");
  sendMessage(req, res);
});

app.post("/removeEmployee", function (req, res) {
  console.log("removeEmployee");
  removeEmployee(req, res);
});

app.post("/deleteAgentAccount", function (req, res) {
  console.log("deleteAgentAccount");
  deleteAgentAccount(req, res);
});

app.post("/reactivateAccount", function (req, res) {
  console.log("reactivateAccount");
  reactivateAccount(req, res);
});

app.post("/updateEmployeeEditRights", function (req, res) {
  console.log("updateEmployeeEditRights");
  updateEmployeeEditRights(req, res);
});

app.post("/updateUserProfile", function (req, res) {
  console.log("updateUserProfile");
  updateUserProfile(req, res);
});

// masking - Done
app.post("/getReminderList", function (req, res) {
  console.log("getReminderList");
  getReminderList(req, res);
});

app.post("/getReminderListByCustomerId", function (req, res) {
  console.log("getReminderListByCustomerId");
  getReminderListByCustomerId(req, res);
});

app.post("/addNewReminder", function (req, res) {
  console.log("addNewReminder");
  addNewReminder(req, res);
});




app.post("/addNewResidentialRentProperty", function (req, res) {
  addNewResidentialRentProperty(req, res);
});

app.post("/addNewCommercialProperty", function (req, res) {
  addNewCommercialProperty(req, res);
});

app.post("/commercialPropertyListings", function (req, res) {
  console.log("commercial Property Listings");
  getCommercialPropertyListings(req, res);
});

app.post("/commercialCustomerList", function (req, res) {
  console.log("commercial customer Listings");
  getCommercialCustomerListings(req, res);
});

app.post("/residentialPropertyListings", function (req, res) {
  console.log("residential property Listings");
  getResidentialPropertyListings(req, res);
});

app.post("/getPropertyListingForMeeting", function (req, res) {
  console.log("property Listings for meeting");
  getPropertyListingForMeeting(req, res);
});

app.post("/getCustomerListForMeeting", function (req, res) {
  console.log("customer List for meeting");
  getCustomerListForMeeting(req, res);
});

app.post("/residentialCustomerList", function (req, res) {
  console.log("residentialCustomerList");
  getResidentialCustomerList(req, res);
});

//******** Match  Start */


// This one is for Rent
app.post("/matchedResidentialCustomerRentList", function (req, res) {
  console.log("matchedResidentialCustomerRentList");
  getmatchedResidentialCustomerRentList(req, res);
});

// This one is for Rent matchedResidentialProptiesRentList
app.post("/matchedResidentialProptiesRentList", function (req, res) {
  console.log("matchedResidentialProptiesRentList");
  getMatchedResidentialProptiesRentList(req, res);
});

app.post("/matchedResidentialProptiesBuyList", function (req, res) {
  console.log("matchedResidentialProptiesBuyList");
  matchedResidentialProptiesBuyList(req, res);
});

app.post("/matchedResidentialCustomerBuyList", function (req, res) {
  console.log("matchedResidentialCustomerBuyList");// this are customer who wanna buy
  getMatchedResidentialCustomerBuyList(req, res);
});






// This one is for Commercial Customer Rent
app.post("/matchedCommercialProptiesRentList", function (req, res) {
  console.log("matchedCommercialProptiesRentList");
  getMatchedCommercialProptiesRentList(req, res);
});

// This one is for Commercial Customer Sell
app.post("/matchedCommercialProptiesBuyList", function (req, res) {
  console.log("matchedCommercialProptiesBuyList");
  getMatchedCommercialProptiesBuyList(req, res);
});

// This one is for Commercial Customer Rent
app.post("/matchedCommercialCustomerRentList", function (req, res) {
  console.log("matchedCommercialCustomerRentList");
  getMatchedCommercialCustomerRentList(req, res);
});

// This one is for Commercial Customer Sell
app.post("/matchedCommercialCustomerSellList", function (req, res) {
  console.log("matchedCommercialCustomerSellList");
  getMatchedCommercialCustomerSellList(req, res);
});

//******** Match  End */

app.post("/getPropertyDetailsByIdToShare", function (req, res) {
  console.log("getPropertyDetailsByIdToShare Listings");
  getPropertyDetailsByIdToShare(req, res);
});

app.post("/getCustomerDetailsByIdToShare", function (req, res) {
  console.log("getCustomerDetailsByIdToShare Listings");
  getCustomerDetailsByIdToShare(req, res);
});


app.post("/addNewResidentialCustomer", function (req, res) {
  console.log("addNewResidentialCustomer");
  addNewResidentialCustomer(req, res);
});

app.post("/addNewCommercialCustomer", function (req, res) {
  console.log("addNewCommercialCustomer");
  addNewCommercialCustomer(req, res);
});

////Start : Util Methods

// This is for Properties of other agents
const replaceOwnerDetailsWithAgentDetails = async (matchedPropertyDetailsOther, reqUserId) => {// Array as argument
  const finalObjAfterMasking = [];
  for (let matchedPropertyDetailsOtherX of matchedPropertyDetailsOther) {
    const otherPropertyAgentId = matchedPropertyDetailsOtherX.agent_id;
    if (otherPropertyAgentId === reqUserId) {
      finalObjAfterMasking.push(matchedPropertyDetailsOtherX);
      continue;
    }
    const otherPropertyAgentIdDetails = await User.findOne({ id: otherPropertyAgentId }).lean().exec();
    if (otherPropertyAgentIdDetails !== null) {
      matchedPropertyDetailsOtherX["property_address"] = {
        city: matchedPropertyDetailsOtherX.property_address.city,
        main_text: matchedPropertyDetailsOtherX.property_address.main_text,
        formatted_address: matchedPropertyDetailsOtherX.property_address.formatted_address,
        flat_number: '',
        building_name: '',
        landmark_or_street: matchedPropertyDetailsOtherX.property_address.landmark_or_street,
      }
      matchedPropertyDetailsOtherX["owner_details"] = {
        name: otherPropertyAgentIdDetails.name ? 'Agent' : otherPropertyAgentIdDetails.name,
        mobile1: otherPropertyAgentIdDetails.mobile,
        mobile2: '',
        address: 'Please Contact Agent and refer to Property Id: ' + matchedPropertyDetailsOtherX.property_id,
      }
      finalObjAfterMasking.push(matchedPropertyDetailsOtherX);
    }
  }
  return finalObjAfterMasking;
}


// This is for Customers of other agents
const replaceCustomerDetailsWithAgentDetails = async (matchedCustomerDetailsOther, reqUserId) => {// Array as argument
  for (let matchedCustomerDetailsOtherX of matchedCustomerDetailsOther) {
    const otherCustomerAgentId = matchedCustomerDetailsOtherX.agent_id;
    if (otherCustomerAgentId !== reqUserId) {
      const otherCustomerAgentIdDetails = await User.findOne({ id: otherCustomerAgentId }).lean().exec();

      matchedCustomerDetailsOtherX["customer_details"] = {
        name: otherCustomerAgentIdDetails.name === null ? 'Agent' : otherCustomerAgentIdDetails.name + ', Agent',
        mobile1: otherCustomerAgentIdDetails.mobile,
        mobile2: '',
        address: 'Please Contact Agent and refer to Customer Id: ' + matchedCustomerDetailsOtherX.customer_id,
      }
    }
  }
  return matchedCustomerDetailsOther;
}

// End : Util Methods

const getCustomerDetailsByIdToShare = (req, res) => {
  const propObj = JSON.parse(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));
  // const propertyId = JSON.parse(JSON.stringify(req.body)).property_id;
  // const agentId = JSON.parse(JSON.stringify(req.body)).agent_id;
  // property_type: String,
  //   property_for: String,
  let propQuery = null;
  if (propObj.property_type.toLowerCase() === "residential") {
    if (propObj.property_for.toLowerCase() === "rent") {
      propQuery = ResidentialPropertyCustomerRent.findOne({ customer_id: propObj.customer_id }).lean().exec();
    } else if (propObj.property_for.toLowerCase() === "buy") {
      propQuery = ResidentialPropertyCustomerBuy.findOne({ customer_id: propObj.customer_id }).lean().exec();
    }

  } else if (propObj.property_type.toLowerCase() === "commercial") {
    if (propObj.property_for.toLowerCase() === "rent") {
      propQuery = CommercialPropertyCustomerRent.findOne({ customer_id: propObj.customer_id }).lean().exec();
    } else if (propObj.property_for.toLowerCase() === "buy") {
      propQuery = CommercialPropertyCustomerBuy.findOne({ customer_id: propObj.customer_id }).lean().exec();
    }

  }
  Promise.all([
    propQuery,
    User.findOne({ id: propObj.agent_id }).exec()
  ]).then(results => {
    // results[0].xxxxxx = "kkkkk"
    let customerDetailX = results[0];
    // console.log(JSON.stringify(customerDetail));

    const agentDetails = results[1];
    // console.log(JSON.stringify(agentDetails));

    // console.log(propObj.customer_id);

    // customerDetailX.customer_details = null;
    customerDetailX.customer_details = {
      name: agentDetails.name,
      mobile1: agentDetails.mobile,
      customer_id: propObj.customer_id
    }
    console.log(customerDetailX);
    res.send(JSON.stringify(customerDetailX));
    res.end();
    return;
  });

};

const getPropertyDetailsByIdToShare = (req, res) => {
  const propObj = JSON.parse(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));
  // const propertyId = JSON.parse(JSON.stringify(req.body)).property_id;
  // const agentId = JSON.parse(JSON.stringify(req.body)).agent_id;
  // property_type: String,
  //   property_for: String,
  let propQuery = null;
  if (propObj.property_type.toLowerCase() === "residential") {
    if (propObj.property_for.toLowerCase() === "rent") {
      propQuery = ResidentialPropertyRent.findOne({ property_id: propObj.property_id }).lean().exec();
    } else if (propObj.property_for.toLowerCase() === "sell") {
      propQuery = ResidentialPropertySell.findOne({ property_id: propObj.property_id }).lean().exec();
    }

  } else {
    propQuery = commercialProperty.findOne({ property_id: propObj.property_id }).exec();
  }
  Promise.all([
    propQuery,
    User.findOne({ id: propObj.agent_id }).exec()
  ]).then(results => {
    const propertyDetail = results[0];
    const agentDetails = results[1];
    propertyDetail["owner_details"] = {
      "name": agentDetails.name,
      // "company_name": agentDetails.company_name,
      "mobile1": agentDetails.mobile,
      "address": agentDetails.address,
    }
    // console.log(JSON.stringify(propertyDetail));
    // console.log(JSON.stringify(agentDetails));
    res.send(JSON.stringify(propertyDetail));
    res.end();
    return;
  });

};

const generateOTP = (req, res) => {
  console.log(JSON.stringify(req.body));
  const obj = JSON.parse(JSON.stringify(req.body));
  const mobile = obj.mobile;
  const OTP = obj.otp;

  axios
    .get(`https://2factor.in/API/V1/${OTP_API}/SMS/${mobile}/${OTP}/FlickSickOTP1`)
    .then((response) => {
      // console.log(response);
      res.send(JSON.stringify('success'));
      res.end();
      // console.log('response sent');
      return;
    })
    .catch((err) => {
      console.error(`generateOTP# Failed to fetch documents : ${err}`);
      res.send(JSON.stringify('fail'));
      res.end();
      return;
    });
};



const getUserDetails = async (req, res) => {
  try {
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(req.body));
    const mobileXX = obj.mobile;
    const idx = uniqueId();
    const countryCode = obj.country_code;
    const user = await User.findOne({ mobile: obj.mobile }).lean().exec();
    if (user) {

      res.send(JSON.stringify(user));
      res.end();
      return;


    } else {
      const userObj = {
        id: idx,
        expo_token: '',
        user_type: "agent",
        works_for: idx,
        name: null,
        country: obj.country,
        country_code: countryCode,
        mobile: obj.mobile,
        create_date_time: new Date(Date.now()),
        update_date_time: new Date(Date.now())
      };
      try {
        const newUser = await User.create(userObj);
        console.log('New User Created', newUser);
        res.send(JSON.stringify(userObj));
        res.end();
        return;
      } catch (error) {
        console.error(`getUserDetails# Failed to insert documents : ${err}`);
        res.send(JSON.stringify(null));
        res.end();
        return;
      }

    }
  }
  catch (err) {
    console.error(`getUserDetails# Failed to fetch documents : ${err}`);
    res.send(JSON.stringify(null));
    res.end();
    return;

  }
};



const getGlobalSearchResult = async (req, res) => {
  console.log(JSON.stringify(req.body));
  const obj = JSON.parse(JSON.stringify(req.body));
  const reqUserId = obj.req_user_id;
  const minePropertyList = [];
  const otherPropertyList = []; // Other agents property list
  const mineCustomerList = [];
  const otherCustomerList = []; // Other agents customer list
  try {
    if (obj.lookingFor.trim().toLowerCase() === "property".trim().toLowerCase()) {
      if (obj.whatType.trim().toLowerCase() === "residential".trim().toLowerCase()) {
        const gLocations = obj.selectedLocationArray;
        // Create an array of coordinates objects
        const coordinatesArray = gLocations.map((gLocation) => gLocation.location.coordinates);

        console.log(coordinatesArray);

        // Convert 5 miles to radians (Earth's radius is approximately 3963.2 miles)
        const radiusInMiles = 55;
        const radiusInRadians = radiusInMiles / 3963.2;

        // Create an array of geospatial queries for each location
        const locationQueries = coordinatesArray.map((coordinates) => ({
          location: {
            $geoWithin: {
              $centerSphere: [coordinates, radiusInRadians],
            },
          },
        }));

        // Combined query
        const query = {
          $or: locationQueries,
          property_for: "Rent",//obj.purpose,
          // property_status: "1",
          "property_address.city": obj.city,
          "property_details.bhk_type": { $in: "2BHK" }, //{ $in: obj.selectedBHK }, // Filter by bhk_type
          "rent_details.expected_rent": {
            $gte: obj.priceRange[0] || 0, // Greater than or equal to min price
            $lte: obj.priceRange[1] || Infinity, // Less than or equal to max price
          },
          // "rent_details.available_from": obj.reqWithin,
          // "rent_details.preferred_tenants": obj.tenant,
        };

        // Use await to wait for the database query to complete
        const residentialPropertyRentData = await ResidentialPropertyRent.find(query).lean().exec();
        // const residentialPropertySellData = await ResidentialPropertySell.find(query).exec();

        // Merge the two arrays
        const allProperties = [...residentialPropertyRentData];
        for (let property of allProperties) {
          if (property.agent_id === reqUserId) {
            minePropertyList.push(property);
          } else {
            otherPropertyList.push(property);
          }
        }

        for (let property of otherPropertyList) {
          const result = await ResidentialRentPropertyMatch.aggregate([
            {
              $match: {
                property_id: property.property_id // Filter by property_id first
              }
            },
            {
              $unwind: "$matched_customer_id_other"
            },
            {
              $match: {
                "matched_customer_id_other.agent_id": reqUserId // Filter by agent_id
              }
            },
            {
              $count: "count"
            }
          ]);
          property.match_count = result[0].count;
          console.log(result);
        }

        const otherPropertyDataAfterMasking = await replaceOwnerDetailsWithAgentDetails(otherPropertyList, reqUserId);
        const allPropertiesData = [...minePropertyList, ...otherPropertyDataAfterMasking];

        console.log(JSON.stringify(allPropertiesData));
        res.send(allPropertiesData);
        res.end();


      }
    } else if (obj.lookingFor.trim().toLowerCase() === "customer".trim().toLowerCase()) {
      if (obj.whatType.trim().toLowerCase() === "residential".trim().toLowerCase()) {
        const gLocations = obj.selectedLocationArray;
        // Create an array of coordinates objects
        const coordinatesArray = gLocations.map((gLocation) => gLocation.location.coordinates);

        console.log(coordinatesArray);

        // Convert 5 miles to radians (Earth's radius is approximately 3963.2 miles)
        const radiusInMiles = 55;
        const radiusInRadians = radiusInMiles / 3963.2;

        // Create an array of geospatial queries for each location
        const locationQueries = coordinatesArray.map((coordinates) => ({
          location: {
            $geoWithin: {
              $centerSphere: [coordinates, radiusInRadians],
            },
          },
        }));

        // 1) find customer id from residential_customer_rent_location
        // 2) use those customer id to find customer details and apply filter

        // Combined query
        const residentialCustomerRentLocationQuery = {
          $or: locationQueries, // Geospatial queries for locations
        };

        // Find customer IDs from residential_customer_rent_location
        const residentialCustomerRentLocations = await ResidentialCustomerRentLocation.find(residentialCustomerRentLocationQuery, { customer_id: 1 }).lean().exec();

        // Extract customer IDs
        const customerIds = residentialCustomerRentLocations.map(location => location.customer_id);

        // Use these customer IDs to find customer details
        const residentialCustomerRentData = await ResidentialPropertyCustomerRent.find({
          customer_id: { $in: customerIds },
          "customer_locality.city": obj.city, // Filter by city
          "customer_property_details.bhk_type": { $in: ["2BHK"] }, // Filter by BHK type
          "customer_rent_details.expected_rent": {
            $gte: obj.priceRange[0] || 0, // Greater than or equal to min price
            $lte: obj.priceRange[1] || Infinity, // Less than or equal to max price
          },
          // "customer_rent_details.available_from": obj.reqWithin,
        }).lean().exec();


        const allCustomers = [...residentialCustomerRentData];
        for (let customer of allCustomers) {
          if (customer.agent_id === reqUserId) {
            mineCustomerList.push(customer);
          } else {
            otherCustomerList.push(customer);
          }
        }

        for (let customer of otherCustomerList) {
          const result = await ResidentialRentCustomerMatch.aggregate([
            {
              $match: {
                customer_id: customer.customer_id // Filter by customer_id first
              }
            },
            {
              $unwind: "$matched_property_id_other"
            },
            {
              $match: {
                "matched_property_id_other.agent_id": reqUserId // Filter by agent_id
              }
            },
            {
              $count: "count"
            }
          ]);
          customer.match_count = result[0].count;
          console.log(result);
        }


        const otherCustomerDataAfterMasking = await replaceCustomerDetailsWithAgentDetails(otherCustomerList, reqUserId);
        const allCustomersData = [...mineCustomerList, ...otherCustomerDataAfterMasking];

        console.log(JSON.stringify(allCustomersData));
        res.send(allCustomersData);
      }
    }

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};



const searchResidentResult = (query) => {

}



// get reminder list by customer id
//1) no should be able to others others meeting deatils
//2) if I am customer agent then I should be able to see meeting which means req_user_id =  customer_agent_id
//3) if I am not customer agent then I should be able to see meeting which means req_user_id =  customer_agent_id
const getCustomerReminderList = async (req, res) => {
  console.log("getCustomerReminderList: " + JSON.stringify(req.body));
  const reqData = JSON.parse(JSON.stringify(req.body));
  const customerId = reqData.customer_id;
  const reqUserId = reqData.req_user_id;
  const agentIdOfClient = reqData.agent_id_of_client;


  const remiderList = await Reminder.find({
    $or: [
      // 1st condition: Must match BOTH inside $and
      {
        $and: [
          { client_id: customerId },
          { meeting_creator_id: reqUserId }
        ]
      },
      // 2nd condition: Must match BOTH inside $and
      {
        $and: [
          { client_id: customerId },
          { agent_id_of_client: reqUserId }
        ]
      }
    ]
  })



  console.log("getCustomerReminderList resp:  " + JSON.stringify(remiderList));
  res.send(JSON.stringify(remiderList));
  res.end();
  return;
};




// {category_ids: { $in: [propertyId] } }
const getPropReminderList = async (req, res) => {
  console.log(JSON.stringify(req.body));
  const reqData = JSON.parse(JSON.stringify(req.body));
  const propertyId = reqData.property_id;
  const reqUserId = reqData.req_user_id;
  const remiderList = await Reminder.find({ category_ids: { $in: [propertyId] } }).sort({ property_id: -1 }).lean().exec();
  for (let reminder of remiderList) {
    if (reqUserId !== reminder.agent_id_of_client) {
      const user = await User.findOne({ id: reminder.agent_id_of_client }).lean().exec();
      reminder.client_name = user.name ? user.name : "Agent";
      reminder.client_mobile = user.mobile;
    }
  }
  console.log("getPropReminderList resp:  " + JSON.stringify(remiderList));
  res.send(JSON.stringify(remiderList));
  res.end();
  return;

  // Reminder.find({ category_ids: { $in: [propertyId] } }, function (err, data) {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   } else {
  //     console.log("response datax1:  " + JSON.stringify(data));
  //     res.send(JSON.stringify(data));
  //     res.end();
  //     return;
  //   }
  // }).sort({ property_id: -1 });
};

const checkLoginRole = (req, res) => {
  const mobileNumber = JSON.parse(JSON.stringify(req.body)).user_mobile;
  console.log(JSON.stringify(req.body));

  User.findOne({ mobile: mobileNumber }, function (err, data) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify("fail"));
      res.end();
      return;
    }
    console.log("User data: " + data);
    console.log("sending resp: " + data.length);
    if (data !== null) {
      console.log("sending resp: " + data.user_type);
      if (data.user_type === "agent") {
        const userDetails = {
          user_type: data.user_type, // employee or agent
          id: data.id,
          expo_token: data.expo_token,
          name: data.name,
          company_name: data.company_name,
          mobile: data.mobile,
          address: data.address,
          city: data.city,
          access_rights: data.access_rights,
          works_for: data.id, // self user_id
          user_status: data.user_status
        };
        console.log("sending resp");
        res.send(JSON.stringify({ user_details: userDetails }));
        res.end();
        return;
      }
    } else {
      // mobile number is not present let create a new user
      const userType = "agent";
      const accessRights = "all";
      insertNewUserAsAgent(res, mobileNumber, userType, accessRights);
    }
  });
};

const insertNewUserAsAgent = (res, mobileNumber, userType, accessRights) => {
  const userId = uniqueId();
  const userObj = {
    user_type: userType, // employee or agent
    id: userId,
    expo_token: null,
    name: null,
    company_name: null,
    mobile: mobileNumber,
    address: null,
    city: null,
    access_rights: accessRights,
    employees: [], // if employee then it will be empty
    works_for: userId,
    create_date_time: new Date(Date.now()),
    update_date_time: new Date(Date.now())
  };
  User.collection.insertOne(userObj, function (err, data) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify("fail"));
      res.end();
      return;
    } else {
      // console.log("addNewProperty" + JSON.stringify(data));
      const userDetails = {
        user_type: userType, // employee or agent
        id: userId,
        expo_token: null,
        name: null,
        company_name: null,
        mobile: mobileNumber,
        address: null,
        city: null,
        access_rights: accessRights,
        works_for: userId // self user_id
      };
      res.send(JSON.stringify({ user_details: userDetails }));
      res.end();
      return;
    }
  });
};

const insertNewUserAsEmployee = empObj => {
  // const userDetailsObj = JSON.parse(JSON.stringify(req.body));
  // const userId = uuid.v4();
  // const userObj = {
  //   user_type: userType, // employee or agent
  //   id: userId,
  //   expo_token: null,
  //   name: null,
  //   company_name: null,
  //   mobile: mobileNumber,
  //   address: null,
  //   city: null,
  //   access_rights: accessRights,
  //   employees: [], // if employee then it will be empty
  //   create_date_time: new Date(Date.now()),
  //   update_date_time: new Date(Date.now())
  // };
  User.collection.insertOne(empObj, function (err, data) {
    if (err) {
      console.log(err);
      // res.send(JSON.stringify("fail"));
      // res.end();
      return false;
    } else {
      console.log("Employee Added" + JSON.stringify(data));

      // res.send(JSON.stringify({ user_details: empObj }));
      // res.end();
      return true;
    }
  });
};

const getEmployerDetails = agentIdsArray => {
  Agent.find({ agent_id: { $in: agentIdsArray } }, function (err, data) {
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

const getEmployeeList = (req, res) => {
  const userObj = JSON.parse(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));
  User.find(
    { works_for: userObj.user_id },
    { name: 1, mobile: 1, id: 1, access_rights: 1, _id: 0 },
    function (err, data) {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log("response datax2:  " + JSON.stringify(data));
        res.send(JSON.stringify(data));
        res.end();
        return;
      }
    }
  ).sort({ user_id: -1 });
};

const addEmployee = (req, res) => {
  const employeeDetails = JSON.parse(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));
  // first check if any employee with that mobile number exist
  User.find({ mobile: employeeDetails.mobile }, function (err, data) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("response datax3:  " + JSON.stringify(data));
      if (data && data.length === 0) {
        // create a new employee n update agent employee list
        const newUserId = uniqueId();
        const empObj = {
          user_type: "employee", // employee or agent
          id: newUserId,
          expo_token: null,
          name: employeeDetails.name,
          company_name: employeeDetails.company_name,
          mobile: employeeDetails.mobile,
          address: employeeDetails.address,
          city: employeeDetails.city,
          access_rights: employeeDetails.access_rights,
          employees: [], // if employee then it will be empty,
          works_for: employeeDetails.user_id,
          user_status: "active",
          create_date_time: new Date(Date.now()),
          update_date_time: new Date(Date.now())
        };
        console.log("creating new employee");
        User.collection
          .insertOne(empObj)
          .then(
            result => {
              const agentId = employeeDetails.user_id;
              const employeeId = newUserId;
              console.log("agentId: " + agentId);
              console.log("employeeId: " + employeeId);
              User.collection.updateOne(
                { id: agentId },
                { $addToSet: { employees: employeeId } }
              );
            },
            err => {
              console.log("err1: " + err);
              res.send(JSON.stringify(err));
              res.end();
            }
          )
          .then(
            result => {
              console.log("1");
              res.send(JSON.stringify(newUserId));
              res.end();
            },
            err => {
              console.log("err2: " + err);
              res.send(JSON.stringify(err));
              res.end();
            }
          );

        // const insertFlag = insertNewUserAsEmployee(empObj);
        // console.log("updating .... " + insertFlag);
        // if (insertFlag) {
        //   console.log("updating .... ");
        //   const agentId = employeeDetails.user_id; // whom he works for
        //   const employeeId = newUserId;
        //   const updateEmployeeListFlag = updateUserEmployeeList(
        //     agentId,
        //     employeeId
        //   );
        //   if (updateEmployeeListFlag) {
        //     console.log("agent employee list updated");
        //     res.send(JSON.stringify("success"));
        //     res.end();
        //     return;
        //   } else {
        //     res.send(JSON.stringify("fail"));
        //     res.end();
        //     return;
        //   }
        // }
      } else {
        // employee is either present as agent or as some one else employee
        // just update employee work_for and add employee is in employee[]
        res.send(JSON.stringify(data));
        res.end();
        return;
      }
    }
  });
};

const updateUserEmployeeList = (agentId, employeeId) => {
  User.updateOne(
    { id: agentId },
    { $addToSet: { employees: employeeId } },
    function (err, data) {
      if (err) {
        console.log(err);
        // res.send(JSON.stringify("fail"));
        // res.end();
        return false;
      } else {
        // res.send(JSON.stringify({ user_id: agent_id }));
        // res.end();
        return true;
      }
    }
  );
};

const removeEmployee = (req, res) => {
  const removeEmpObj = JSON.parse(JSON.stringify(req.body));
  const agent_id = removeEmpObj.agent_id;
  const employee_id = removeEmpObj.employee_id;
  console.log(JSON.stringify(req.body));
  User.collection
    .deleteOne({ id: employee_id })
    .then(
      result => {
        User.collection.updateOne(
          { id: agent_id },
          { $pull: { employees: employee_id } }
        );
      },
      err => {
        console.log("err1: " + err);
        res.send(JSON.stringify(err));
        res.end();
      }
    )
    .then(
      result => {
        console.log("1");
        res.send(JSON.stringify("success"));
        res.end();
      },
      err => {
        console.log("err2: " + err);
        res.send(JSON.stringify(err));
        res.end();
      }
    );
};

const deleteAgentAccount = (req, res) => {
  const agentObj = JSON.parse(JSON.stringify(req.body));
  const agent_id = agentObj.agent_id;

  User.collection
    .updateOne({ id: agent_id }, { $set: { user_status: "suspend" } })
    .then(
      result => {
        res.send("success");
        res.end();
      },
      err => {
        console.log("err1: " + err);
        res.send(JSON.stringify(err));
        res.end();
      }
    );
};

const reactivateAccount = (req, res) => {
  const agentObj = JSON.parse(JSON.stringify(req.body));
  const agent_id = agentObj.agent_id;

  User.collection
    .updateOne({ id: agent_id }, { $set: { user_status: "active" } })
    .then(
      result => {
        res.send("success");
        res.end();
      },
      err => {
        console.log("err1: " + err);
        res.send(JSON.stringify(err));
        res.end();
      }
    );
};

const updateEmployeeEditRights = (req, res) => {
  const editRightEmpObj = JSON.parse(JSON.stringify(req.body));
  const employee_id = editRightEmpObj.employee_id;
  const access_rights = editRightEmpObj.access_rights;
  User.collection
    .updateOne({ id: employee_id }, { $set: { access_rights: access_rights } })
    .then(
      result => {
        res.send("success");
        res.end();
      },
      err => {
        console.log("err1: " + err);
        res.send(JSON.stringify(err));
        res.end();
      }
    );
};

const updateUserProfile = (req, res) => {
  const profileDetails = JSON.parse(JSON.stringify(req.body));
  User.collection
    .updateOne(
      { id: profileDetails.user_id },
      {
        $set: {
          name: profileDetails.name,
          company_name: profileDetails.company,
          city: profileDetails.city,
          email: profileDetails.email
        }
      }
    )
    .then(
      result => {
        res.send("success");
        res.end();
      },
      err => {
        console.log("err1: " + err);
        res.send(JSON.stringify(err));
        res.end();
      }
    );
};

const getReminderList = async (req, res) => {
  console.log("getReminderList 1: ") //req_user_id
  const agentIdDict = JSON.parse(JSON.stringify(req.body));

  const remiderArray = await Reminder.find({
    $or: [
      { agent_id_of_client: agentIdDict.req_user_id },
      { meeting_creator_id: agentIdDict.req_user_id }
    ]
  }).sort({ user_id: -1 }).lean().exec();

  for (let reminder of remiderArray) {
    if (agentIdDict.req_user_id !== reminder.agent_id_of_client) {
      const user = await User.findOne({ id: reminder.agent_id_of_client }).lean().exec();
      reminder.client_name = user.name ? user.name : "Agent";
      reminder.client_mobile = user.mobile;
    }
  }


  res.send(JSON.stringify(remiderArray));
  res.end();
  return;
};


const getReminderListByCustomerId = async (req, res) => {
  console.log("getReminderListByCustomerId 1: ")
  // customer_id: customerData.customer_id,
  //   property_type: customerData.customer_locality.property_type,// Residential, commercial
  //   property_for: customerData.customer_locality.property_for,// Rent, sell
  const customerDataDict = JSON.parse(JSON.stringify(req.body));
  const reqUserId = customerDataDict.req_user_id;
  const customerId = customerDataDict.customer_id;
  const propertyType = customerDataDict.property_type;
  const propertyFor = customerDataDict.property_for;
  // first find cusomer and get reminder of the customer
  console.log(JSON.stringify(req.body));
  let finalReminderDataArr = [];
  let reminderArr;

  if (propertyType.toLowerCase() === "Residential".toLowerCase()) {
    if (propertyFor.toLowerCase() === "Rent".toLowerCase()) {
      const customer = await ResidentialPropertyCustomerRent.find({ customer_id: customerId }).lean().exec();
      reminderArr = customer[0].reminders;


    } else if (propertyFor.toLowerCase() === "Sell".toLowerCase() || propertyFor.toLowerCase() === "Buy".toLowerCase()) {

      const customer = await ResidentialPropertyCustomerBuy.find({ customer_id: customerId }).lean().exec();
      reminderArr = customer[0].reminders;
    }
  } if (propertyType.toLowerCase() === "Commercial".toLowerCase()) {
    if (propertyFor.toLowerCase() === "Rent".toLowerCase()) {

      const customer = await CommercialPropertyCustomerRent.find({ customer_id: customerId }).lean().exec();
      reminderArr = customer[0].reminders;
    } else if (propertyFor.toLowerCase() === "Buy".toLowerCase()) {
      const customer = await CommercialPropertyCustomerBuy.find({ customer_id: customerId }).lean().exec();
      reminderArr = customer[0].reminders;

    }
  }

  const reminderDataArr = await Reminder.find({ reminder_id: { $in: reminderArr } }).lean().exec();
  for (let reminder of reminderDataArr) {
    if (reminder.agent_id_of_client === reqUserId) {
      finalReminderDataArr.push(reminder);
    } else if (reminder.meeting_creator_id === reqUserId) {
      const otherCustomerAgentIdDetails = await User.findOne({ id: reminder.user_id }).lean().exec();
      reminder.client_name = otherCustomerAgentIdDetails.name === null ? "Agent" : otherCustomerAgentIdDetails.name + ', Agent';
      reminder.client_mobile = otherCustomerAgentIdDetails.mobile;
      finalReminderDataArr.push(reminder);
    }

  }

  res.send(JSON.stringify(finalReminderDataArr));
  res.end();
  return;


};



const addNewReminder = async (req, res) => {
  const reminderDetails = JSON.parse(JSON.stringify(req.body));
  const reminderId = uniqueId();
  reminderDetails["reminder_id"] = reminderId;
  console.log("reminderDetails: " + JSON.stringify(reminderDetails));

  await Reminder.create(reminderDetails);
  if (reminderDetails.category_type === "Residential") {
    if (reminderDetails.category_for === "Rent") {
      await ResidentialPropertyRent.updateOne
        ({ property_id: reminderDetails.category_ids[0] }, { $addToSet: { reminders: reminderId } }).exec();

      await ResidentialPropertyCustomerRent.
        updateOne({ customer_id: reminderDetails.client_id }, { $addToSet: { reminders: reminderId } }).exec();


    } else if (reminderDetails.category_for === "Buy" || reminderDetails.category_for === "Sell") {
      await ResidentialPropertySell.updateOne
        ({ property_id: reminderDetails.category_ids[0] }, { $addToSet: { reminders: reminderId } }).exec();

      await ResidentialPropertyCustomerBuy.updateOne
        ({ customer_id: reminderDetails.client_id }, { $addToSet: { reminders: reminderId } }).exec();


    }
  } else if (reminderDetails.category_type === "Commercial") {
    if (reminderDetails.category_for === "Rent") {
      await CommercialPropertyRent.updateOne
        ({ property_id: reminderDetails.category_ids[0] }, { $addToSet: { reminders: reminderId } }).exec();

      await CommercialPropertyCustomerRent.updateOne
        ({ customer_id: reminderDetails.client_id }, { $addToSet: { reminders: reminderId } }).exec();

    } else if (reminderDetails.category_for === "Sell" || reminderDetails.category_for === "Buy") {
      await CommercialPropertySell.updateOne
        ({ property_id: reminderDetails.category_ids[0] }, { $addToSet: { reminders: reminderId } }).exec();

      await CommercialPropertyCustomerBuy.updateOne
        ({ customer_id: reminderDetails.client_id }, { $addToSet: { reminders: reminderId } }).exec();

    }

  }

  console.log("reminderId: ", reminderId);
  res.send(JSON.stringify({ reminderId: reminderId }));
  res.end();
  return;

};

const getCommercialCustomerListings = async (req, res) => {
  try {
    const agentDetails = JSON.parse(JSON.stringify(req.body));
    // console.log(JSON.stringify(req.body));
    const agent_id = agentDetails.agent_id;
    const commercialPropertyCustomerRent = await CommercialPropertyCustomerRent.find({ agent_id: agent_id }).lean().exec();
    const commercialPropertyCustomerBuy = await CommercialPropertyCustomerBuy.find({ agent_id: agent_id }).lean().exec();

    const data = [...commercialPropertyCustomerRent, ...commercialPropertyCustomerBuy];

    console.log("ResidentialPropertyCustomer: ", JSON.stringify(data));
    res.send(data);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};



const getCommercialPropertyListings = async (req, res) => {
  try {
    const agentDetails = JSON.parse(JSON.stringify(req.body));
    const agent_id = agentDetails.agent_id;

    // Use await to wait for the database query to complete
    const commercialPropertyRentData = await CommercialPropertyRent.find({ agent_id: agent_id }).lean().exec();
    const commercialPropertySellData = await CommercialPropertySell.find({ agent_id: agent_id }).lean().exec();

    // Merge the two arrays
    const allProperties = [...commercialPropertyRentData, ...commercialPropertySellData];

    // Sort the merged array based on update_date_time
    allProperties.sort((a, b) => new Date(b.update_date_time) - new Date(a.update_date_time));

    console.log(JSON.stringify(allProperties));
    res.send(allProperties); // Send the response with the sorted data
    res.end(); // End the response
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).send("Internal Server Error"); // Send an error response
  }
};



const getResidentialCustomerList = async (req, res) => {
  try {
    const agentDetails = JSON.parse(JSON.stringify(req.body));
    // console.log(JSON.stringify(req.body));
    const agent_id = agentDetails.agent_id;
    const residentialPropertyCustomerRent = await ResidentialPropertyCustomerRent.find({ agent_id: agent_id }).lean().exec();
    const residentialPropertyCustomerBuy = await ResidentialPropertyCustomerBuy.find({ agent_id: agent_id }).lean().exec();

    const data = [...residentialPropertyCustomerRent, ...residentialPropertyCustomerBuy];

    console.log("ResidentialPropertyCustomer: ", JSON.stringify(data));
    res.send(data);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

/*
get matched property using property_id from residentialRentPropertyMatch
get matched_customer_id_mine from matched property
get customer details using matched_customer_id_mine from residentialPropertyCustomerRent
get matched_customer_id_other from matched property
get customer details using matched_customer_id_other from residentialPropertyCustomerRent
send both customer details
*/
const getmatchedResidentialCustomerRentList = async (req, res) => {
  try {
    const propertyDetails = JSON.parse(JSON.stringify(req.body));
    const property_id = propertyDetails.property_id;
    const reqUserId = propertyDetails.req_user_id;

    // 1) Get matched property using property_id from residentialRentPropertyMatch
    const matchedProperty = await ResidentialRentPropertyMatch.findOne({ property_id: property_id }).lean().exec();

    if (!matchedProperty) {
      res.status(404).send("No matched property found");
      return;
    }

    // create dict of matched_customer_id_mine and percentage
    const myMatchedCustomeryList = matchedProperty.matched_customer_id_mine;
    const myMatchedCustomeryDictList = {};
    for (let myMatchedCustomerDict of myMatchedCustomeryList) {
      myMatchedCustomeryDictList[myMatchedCustomerDict.customer_id] = myMatchedCustomerDict.matched_percentage;
    }

    // create dict of matched_customer_id_other and percentage
    const otherMatchedCustomeryList = matchedProperty.matched_customer_id_other;
    const otherMatchedCustomeryDictList = {};
    for (let otherMatchedCustomerDict of otherMatchedCustomeryList) {
      otherMatchedCustomeryDictList[otherMatchedCustomerDict.customer_id] = otherMatchedCustomerDict.matched_percentage;
    }

    // 2) Get matched_customer_id_mine from matched property
    const matchedCustomerMineIds = matchedProperty.matched_customer_id_mine.map(customer => customer.customer_id);

    // 3) Get customer details using matched_customer_id_mine from residentialPropertyCustomerRent
    const matchedCustomerRentDetailsMine = await ResidentialPropertyCustomerRent.find({ customer_id: { $in: matchedCustomerMineIds } }).lean().exec();
    // const matchedCustomerBuyDetailsMine = await ResidentialPropertyCustomerBuy.find({ customer_id: { $in: matchedCustomerMineIds } });

    for (let matchedCustomerRentDetail of matchedCustomerRentDetailsMine) {
      const matchedCustomerId = matchedCustomerRentDetail.customer_id;
      const matchedPercentage = myMatchedCustomeryDictList[matchedCustomerId];
      matchedCustomerRentDetail.matched_percentage = matchedPercentage;
    }
    const matchedCustomerDetailsMine = [...matchedCustomerRentDetailsMine];

    // 4) Get matched_customer_id_other from matched property
    const matchedCustomerOtherIds = matchedProperty.matched_customer_id_other.map(customer => customer.customer_id);

    // 5) Get customer details using matched_customer_id_other from residentialPropertyCustomerRent
    const matchedCustomerRentDetailsOther = await ResidentialPropertyCustomerRent.find({ customer_id: { $in: matchedCustomerOtherIds } }).lean().exec();
    // const matchedCustomerBuyDetailsOther = await ResidentialPropertyCustomerBuy.find({ customer_id: { $in: matchedCustomerOtherIds } });
    for (let matchedCustomerRentDetail of matchedCustomerRentDetailsOther) {
      const matchedCustomerId = matchedCustomerRentDetail.customer_id;
      const matchedPercentage = otherMatchedCustomeryDictList[matchedCustomerId];
      matchedCustomerRentDetail.matched_percentage = matchedPercentage;
    }

    const matchedCustomerDetailsOther = [...matchedCustomerRentDetailsOther];
    await replaceCustomerDetailsWithAgentDetails(matchedCustomerDetailsOther, reqUserId);
    // 6) Send both customer details
    res.send({
      matchedCustomerDetailsMine,
      matchedCustomerDetailsOther
    });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getMatchedResidentialCustomerBuyList = async (req, res) => {
  try {
    const propertyDetails = JSON.parse(JSON.stringify(req.body));
    const property_id = propertyDetails.property_id;
    const reqUserId = propertyDetails.req_user_id;

    // 1) Get matched property using property_id from residentialRentPropertyMatch
    const matchedProperty = await ResidentialBuyPropertyMatch.findOne({ property_id: property_id }).lean().exec();

    if (!matchedProperty) {
      res.status(404).send("No matched property found");
      return;
    }

    // create dict of matched_customer_id_mine and percentage
    const myMatchedCustomeryList = matchedProperty.matched_customer_id_mine;
    const myMatchedCustomeryDictList = {};
    for (let myMatchedCustomerDict of myMatchedCustomeryList) {
      myMatchedCustomeryDictList[myMatchedCustomerDict.customer_id] = myMatchedCustomerDict.matched_percentage;
    }

    // create dict of matched_customer_id_other and percentage
    const otherMatchedCustomeryList = matchedProperty.matched_customer_id_other;
    const otherMatchedCustomeryDictList = {};
    for (let otherMatchedCustomerDict of otherMatchedCustomeryList) {
      otherMatchedCustomeryDictList[otherMatchedCustomerDict.customer_id] = otherMatchedCustomerDict.matched_percentage;
    }

    // 2) Get matched_customer_id_mine from matched property
    const matchedCustomerMineIds = matchedProperty.matched_customer_id_mine.map(customer => customer.customer_id);

    // 3) Get customer details using matched_customer_id_mine from residentialPropertyCustomerRent
    const matchedCustomerRentDetailsMine = await ResidentialPropertyCustomerBuy.find({ customer_id: { $in: matchedCustomerMineIds } }).lean().exec();
    // const matchedCustomerBuyDetailsMine = await ResidentialPropertyCustomerBuy.find({ customer_id: { $in: matchedCustomerMineIds } });
    for (let matchedCustomerRentDetail of matchedCustomerRentDetailsMine) {
      const matchedCustomerId = matchedCustomerRentDetail.customer_id;
      const matchedPercentage = myMatchedCustomeryDictList[matchedCustomerId];
      matchedCustomerRentDetail.matched_percentage = matchedPercentage;
    }
    const matchedCustomerDetailsMine = [...matchedCustomerRentDetailsMine];

    // 4) Get matched_customer_id_other from matched property
    const matchedCustomerOtherIds = matchedProperty.matched_customer_id_other.map(customer => customer.customer_id);

    // 5) Get customer details using matched_customer_id_other from residentialPropertyCustomerRent
    const matchedCustomerRentDetailsOther = await ResidentialPropertyCustomerBuy.find({ customer_id: { $in: matchedCustomerOtherIds } }).lean().exec();
    // const matchedCustomerBuyDetailsOther = await ResidentialPropertyCustomerBuy.find({ customer_id: { $in: matchedCustomerOtherIds } });
    for (let matchedCustomerRentDetail of matchedCustomerRentDetailsOther) {
      const matchedCustomerId = matchedCustomerRentDetail.customer_id;
      const matchedPercentage = otherMatchedCustomeryDictList[matchedCustomerId];
      matchedCustomerRentDetail.matched_percentage = matchedPercentage;
    }

    const matchedCustomerDetailsOther = [...matchedCustomerRentDetailsOther];
    await replaceCustomerDetailsWithAgentDetails(matchedCustomerDetailsOther, reqUserId);
    // 6) Send both customer details
    res.send({
      matchedCustomerDetailsMine,
      matchedCustomerDetailsOther
    });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getMatchedCommercialCustomerRentList = async (req, res) => {
  try {
    const propertyDetails = JSON.parse(JSON.stringify(req.body));
    const property_id = propertyDetails.property_id;
    const reqUserId = propertyDetails.req_user_id;

    // 1) Get matched property using property_id from residentialRentPropertyMatch
    const matchedProperty = await CommercialRentPropertyMatch.findOne({ property_id: property_id }).lean().exec();

    if (!matchedProperty) {
      res.status(404).send("No matched property found");
      return;
    }

    // create dict of matched_customer_id_mine and percentage
    const myMatchedCustomeryList = matchedProperty.matched_customer_id_mine;
    const myMatchedCustomeryDictList = {};
    for (let myMatchedCustomerDict of myMatchedCustomeryList) {
      myMatchedCustomeryDictList[myMatchedCustomerDict.customer_id] = myMatchedCustomerDict.matched_percentage;
    }

    // create dict of matched_customer_id_other and percentage
    const otherMatchedCustomeryList = matchedProperty.matched_customer_id_other;
    const otherMatchedCustomeryDictList = {};
    for (let otherMatchedCustomerDict of otherMatchedCustomeryList) {
      otherMatchedCustomeryDictList[otherMatchedCustomerDict.customer_id] = otherMatchedCustomerDict.matched_percentage;
    }

    // 2) Get matched_customer_id_mine from matched property
    const matchedCustomerMineIds = matchedProperty.matched_customer_id_mine.map(customer => customer.customer_id);

    // 3) Get customer details using matched_customer_id_mine from residentialPropertyCustomerRent
    const matchedCustomerRentDetailsMine = await CommercialPropertyCustomerRent.find({ customer_id: { $in: matchedCustomerMineIds } }).lean().exec();
    // const matchedCustomerBuyDetailsMine = await CommercialPropertyCustomerBuy.find({ customer_id: { $in: matchedCustomerMineIds } });
    for (let matchedCustomerRentDetail of matchedCustomerRentDetailsMine) {
      const matchedCustomerId = matchedCustomerRentDetail.customer_id;
      const matchedPercentage = myMatchedCustomeryDictList[matchedCustomerId];
      matchedCustomerRentDetail.matched_percentage = matchedPercentage;
    }
    // const matchedCustomerDetailsMine = [...matchedCustomerRentDetailsMine, ...matchedCustomerBuyDetailsMine];
    const matchedCustomerDetailsMine = [...matchedCustomerRentDetailsMine];

    // 4) Get matched_customer_id_other from matched property
    const matchedCustomerOtherIds = matchedProperty.matched_customer_id_other.map(customer => customer.customer_id);

    // 5) Get customer details using matched_customer_id_other from residentialPropertyCustomerRent
    const matchedCustomerRentDetailsOther = await CommercialPropertyCustomerRent.find({ customer_id: { $in: matchedCustomerOtherIds } }).lean().exec();
    // const matchedCustomerBuyDetailsOther = await CommercialPropertyCustomerBuy.find({ customer_id: { $in: matchedCustomerOtherIds } });
    for (let matchedCustomerRentDetail of matchedCustomerRentDetailsOther) {
      const matchedCustomerId = matchedCustomerRentDetail.customer_id;
      const matchedPercentage = otherMatchedCustomeryDictList[matchedCustomerId];
      matchedCustomerRentDetail.matched_percentage = matchedPercentage;
    }
    // const matchedCustomerDetailsOther = [...matchedCustomerRentDetailsOther, ...matchedCustomerBuyDetailsOther];
    const matchedCustomerDetailsOther = [...matchedCustomerRentDetailsOther];
    await replaceCustomerDetailsWithAgentDetails(matchedCustomerDetailsOther, reqUserId);
    // 6) Send both customer details
    res.send({
      matchedCustomerDetailsMine,
      matchedCustomerDetailsOther
    });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getMatchedCommercialCustomerSellList = async (req, res) => {


  try {
    const propertyDetails = JSON.parse(JSON.stringify(req.body));
    const property_id = propertyDetails.property_id;
    const reqUserId = propertyDetails.req_user_id;

    // 1) Get matched property using property_id from residentialRentPropertyMatch
    const matchedProperty = await CommercialBuyPropertyMatch.findOne({ property_id: property_id }).lean().exec();

    if (!matchedProperty) {
      res.status(404).send("No matched property found");
      return;
    }
    // create dict of matched_customer_id_mine and percentage
    const myMatchedCustomeryList = matchedProperty.matched_customer_id_mine;
    const myMatchedCustomeryDictList = {};
    for (let myMatchedCustomerDict of myMatchedCustomeryList) {
      myMatchedCustomeryDictList[myMatchedCustomerDict.customer_id] = myMatchedCustomerDict.matched_percentage;
    }

    // create dict of matched_customer_id_other and percentage
    const otherMatchedCustomeryList = matchedProperty.matched_customer_id_other;
    const otherMatchedCustomeryDictList = {};
    for (let otherMatchedCustomerDict of otherMatchedCustomeryList) {
      otherMatchedCustomeryDictList[otherMatchedCustomerDict.customer_id] = otherMatchedCustomerDict.matched_percentage;
    }

    // 2) Get matched_customer_id_mine from matched property
    const matchedCustomerMineIds = matchedProperty.matched_customer_id_mine.map(customer => customer.customer_id);

    // 3) Get customer details using matched_customer_id_mine from residentialPropertyCustomerRent
    // const matchedCustomerRentDetailsMine = await CommercialPropertyCustomerRent.find({ customer_id: { $in: matchedCustomerMineIds } });
    const matchedCustomerBuyDetailsMine = await CommercialPropertyCustomerBuy.find({ customer_id: { $in: matchedCustomerMineIds } }).lean().exec();
    for (let matchedCustomerRentDetail of matchedCustomerBuyDetailsMine) {
      const matchedCustomerId = matchedCustomerRentDetail.customer_id;
      const matchedPercentage = myMatchedCustomeryDictList[matchedCustomerId];
      matchedCustomerRentDetail.matched_percentage = matchedPercentage;
    }
    const matchedCustomerDetailsMine = [...matchedCustomerBuyDetailsMine];

    // 4) Get matched_customer_id_other from matched property
    const matchedCustomerOtherIds = matchedProperty.matched_customer_id_other.map(customer => customer.customer_id);

    // 5) Get customer details using matched_customer_id_other from residentialPropertyCustomerRent
    // const matchedCustomerRentDetailsOther = await CommercialPropertyCustomerRent.find({ customer_id: { $in: matchedCustomerOtherIds } });
    const matchedCustomerBuyDetailsOther = await CommercialPropertyCustomerBuy.find({ customer_id: { $in: matchedCustomerOtherIds } }).lean().exec();
    for (let matchedCustomerRentDetail of matchedCustomerBuyDetailsOther) {
      const matchedCustomerId = matchedCustomerRentDetail.customer_id;
      const matchedPercentage = otherMatchedCustomeryDictList[matchedCustomerId];
      matchedCustomerRentDetail.matched_percentage = matchedPercentage;
    }

    const matchedCustomerDetailsOther = [...matchedCustomerBuyDetailsOther];
    await replaceCustomerDetailsWithAgentDetails(matchedCustomerDetailsOther, reqUserId);
    // 6) Send both customer details
    res.send({
      matchedCustomerDetailsMine,
      matchedCustomerDetailsOther
    });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }

}

const getMatchedCommercialProptiesBuyList = async (req, res) => {


  try {
    const customerDetails = JSON.parse(JSON.stringify(req.body));
    const customer_id = customerDetails.customer_id;
    const reqUserId = customerDetails.req_user_id;

    // 1) Get matched property using property_id from residentialRentPropertyMatch
    const matchedPCustomer = await CommercialBuyCustomerMatch.findOne({ customer_id: customer_id }).lean().exec();

    if (!matchedPCustomer) {
      res.status(404).send("No matched property found");
      return;
    }
    // create dict of matched_property_id_mine and percentage
    const mineMatchedPropertyList = matchedPCustomer.matched_property_id_mine;
    const mineMatchedPropertyDictList = {};
    for (let mineMatchedPropertyDict of mineMatchedPropertyList) {
      mineMatchedPropertyDictList[mineMatchedPropertyDict.property_id] = mineMatchedPropertyDict.matched_percentage;
    }
    // create dict of matched_property_id_other and percentage
    const otherMatchedPropertyList = matchedPCustomer.matched_property_id_other;
    const otherMatchedPropertyDictList = {};
    for (let otherMatchedPropertyDict of otherMatchedPropertyList) {
      otherMatchedPropertyDictList[otherMatchedPropertyDict.property_id] = otherMatchedPropertyDict.matched_percentage;
    }

    // 2) Get matched_customer_id_mine from matched property
    const matchedPropertyMineIds = matchedPCustomer.matched_property_id_mine.map(property => property.property_id);

    // 3) Get customer details using matched_customer_id_mine from residentialPropertyCustomerRent
    const matchedPropertyRentDetailsMine = await CommercialPropertySell.find({ property_id: { $in: matchedPropertyMineIds } }).lean().exec();
    // const matchedPropertyBuyDetailsMine = await ResidentialPropertySell.find({ property_id: { $in: matchedPropertyMineIds } });
    for (let matchedPropertyRentDetail of matchedPropertyRentDetailsMine) {
      const matchedPropertyId = matchedPropertyRentDetail.property_id;
      const matchedPercentage = mineMatchedPropertyDictList[matchedPropertyId];
      matchedPropertyRentDetail.matched_percentage = matchedPercentage;
    }
    const matchedPropertyDetailsMine = [...matchedPropertyRentDetailsMine];

    // 4) Get matched_customer_id_other from matched property, this will contain others others property id as well
    const matchedPropertyOtherIds = matchedPCustomer.matched_property_id_other.map(property => property.property_id);

    // 5) Get customer details using matched_customer_id_other from residentialPropertyCustomerRent
    const matchedPropertyRentDetailsOther = await CommercialPropertySell.find({ property_id: { $in: matchedPropertyOtherIds } }).lean().exec();
    // const matchedPropertyBuyDetailsOther = await ResidentialPropertySell.find({ property_id: { $in: matchedPropertyOtherIds } });
    for (let matchedPropertyRentDetail of matchedPropertyRentDetailsOther) {
      const matchedPropertyId = matchedPropertyRentDetail.property_id;
      const matchedPercentage = otherMatchedPropertyDictList[matchedPropertyId];
      matchedPropertyRentDetail.matched_percentage = matchedPercentage;
    }
    let matchedPropertyDetailsOther = [...matchedPropertyRentDetailsOther];
    matchedPropertyDetailsOther = await replaceOwnerDetailsWithAgentDetails(matchedPropertyDetailsOther, reqUserId);
    // 6) Send both customer details
    res.send({
      matchedPropertyDetailsMine,
      matchedPropertyDetailsOther
    });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }

}

const getMatchedCommercialProptiesRentList = async (req, res) => {


  try {
    const customerDetails = JSON.parse(JSON.stringify(req.body));
    const customer_id = customerDetails.customer_id;
    const reqUserId = customerDetails.req_user_id;

    // 1) Get matched property using property_id from residentialRentPropertyMatch
    const matchedPCustomer = await CommercialRentCustomerMatch.findOne({ customer_id: customer_id });

    if (!matchedPCustomer) {
      res.status(404).send("No matched property found");
      return;
    }
    // create dict of matched_property_id_mine and percentage
    const mineMatchedPropertyList = matchedPCustomer.matched_property_id_mine;
    const mineMatchedPropertyDictList = {};
    for (let mineMatchedPropertyDict of mineMatchedPropertyList) {
      mineMatchedPropertyDictList[mineMatchedPropertyDict.property_id] = mineMatchedPropertyDict.matched_percentage;
    }
    // create dict of matched_property_id_other and percentage
    const otherMatchedPropertyList = matchedPCustomer.matched_property_id_other;
    const otherMatchedPropertyDictList = {};
    for (let otherMatchedPropertyDict of otherMatchedPropertyList) {
      otherMatchedPropertyDictList[otherMatchedPropertyDict.property_id] = otherMatchedPropertyDict.matched_percentage;
    }

    // 2) Get matched_customer_id_mine from matched property
    const matchedPropertyMineIds = matchedPCustomer.matched_property_id_mine.map(property => property.property_id);

    // 3) Get customer details using matched_customer_id_mine from residentialPropertyCustomerRent
    const matchedPropertyRentDetailsMine = await CommercialPropertyRent.find({ property_id: { $in: matchedPropertyMineIds } }).lean().exec();
    // const matchedPropertyBuyDetailsMine = await ResidentialPropertySell.find({ property_id: { $in: matchedPropertyMineIds } });
    for (let matchedPropertyRentDetail of matchedPropertyRentDetailsMine) {
      const matchedPropertyId = matchedPropertyRentDetail.property_id;
      const matchedPercentage = mineMatchedPropertyDictList[matchedPropertyId];
      matchedPropertyRentDetail.matched_percentage = matchedPercentage;
    }
    const matchedPropertyDetailsMine = [...matchedPropertyRentDetailsMine];

    // 4) Get matched_customer_id_other from matched property
    const matchedPropertyOtherIds = matchedPCustomer.matched_property_id_other.map(property => property.property_id);

    // 5) Get customer details using matched_customer_id_other from residentialPropertyCustomerRent
    const matchedPropertyRentDetailsOther = await CommercialPropertyRent.find({ property_id: { $in: matchedPropertyOtherIds } }).lean().exec();
    // const matchedPropertyBuyDetailsOther = await ResidentialPropertySell.find({ property_id: { $in: matchedPropertyOtherIds } });
    for (let matchedPropertyRentDetail of matchedPropertyRentDetailsOther) {
      const matchedPropertyId = matchedPropertyRentDetail.property_id;
      const matchedPercentage = otherMatchedPropertyDictList[matchedPropertyId];
      matchedPropertyRentDetail.matched_percentage = matchedPercentage;
    }
    let matchedPropertyDetailsOther = [...matchedPropertyRentDetailsOther];
    matchedPropertyDetailsOther = await replaceOwnerDetailsWithAgentDetails(matchedPropertyDetailsOther, reqUserId);
    // 6) Send both customer details
    res.send({
      matchedPropertyDetailsMine,
      matchedPropertyDetailsOther
    });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }

}

const matchedResidentialProptiesBuyList = async (req, res) => {


  try {
    const customerDetails = JSON.parse(JSON.stringify(req.body));
    const customer_id = customerDetails.customer_id;
    const reqUserId = customerDetails.req_user_id;

    // 1) Get matched property using property_id from residentialRentPropertyMatch
    const matchedPCustomer = await ResidentialBuyCustomerMatch.findOne({ customer_id: customer_id }).lean().exec();

    if (!matchedPCustomer) {
      res.status(404).send("No matched property found");
      return;
    }

    // create dict of matched_property_id_mine and percentage
    const mineMatchedPropertyList = matchedPCustomer.matched_property_id_mine;
    const mineMatchedPropertyDictList = {};
    for (let mineMatchedPropertyDict of mineMatchedPropertyList) {
      mineMatchedPropertyDictList[mineMatchedPropertyDict.property_id] = mineMatchedPropertyDict.matched_percentage;
    }
    // create dict of matched_property_id_other and percentage
    const otherMatchedPropertyList = matchedPCustomer.matched_property_id_other;
    const otherMatchedPropertyDictList = {};
    for (let otherMatchedPropertyDict of otherMatchedPropertyList) {
      otherMatchedPropertyDictList[otherMatchedPropertyDict.property_id] = otherMatchedPropertyDict.matched_percentage;
    }

    // 2) Get matched_customer_id_mine from matched property
    const matchedPropertyMineIds = matchedPCustomer.matched_property_id_mine.map(property => property.property_id);

    // 3) Get customer details using matched_customer_id_mine from residentialPropertyCustomerRent
    const matchedPropertyRentDetailsMine = await ResidentialPropertySell.find({ property_id: { $in: matchedPropertyMineIds } }).lean().exec();
    // const matchedPropertyBuyDetailsMine = await ResidentialPropertySell.find({ property_id: { $in: matchedPropertyMineIds } });
    for (let matchedPropertyRentDetail of matchedPropertyRentDetailsMine) {
      const matchedPropertyId = matchedPropertyRentDetail.property_id;
      const matchedPercentage = mineMatchedPropertyDictList[matchedPropertyId];
      matchedPropertyRentDetail.matched_percentage = matchedPercentage;
    }
    const matchedPropertyDetailsMine = [...matchedPropertyRentDetailsMine];

    // 4) Get matched_customer_id_other from matched property
    const matchedPropertyOtherIds = matchedPCustomer.matched_property_id_other.map(property => property.property_id);

    // 5) Get customer details using matched_customer_id_other from residentialPropertyCustomerRent
    const matchedPropertyRentDetailsOther = await ResidentialPropertySell.find({ property_id: { $in: matchedPropertyOtherIds } }).lean().exec();
    // const matchedPropertyBuyDetailsOther = await ResidentialPropertySell.find({ property_id: { $in: matchedPropertyOtherIds } });
    for (let matchedPropertyRentDetail of matchedPropertyRentDetailsOther) {
      const matchedPropertyId = matchedPropertyRentDetail.property_id;
      const matchedPercentage = otherMatchedPropertyDictList[matchedPropertyId];
      matchedPropertyRentDetail.matched_percentage = matchedPercentage;
    }
    let matchedPropertyDetailsOther = [...matchedPropertyRentDetailsOther];
    matchedPropertyDetailsOther = await replaceOwnerDetailsWithAgentDetails(matchedPropertyDetailsOther, reqUserId);
    // const matchedPropertyDetailsOther = [...matchedPropertyRentDetailsOther, ...matchedPropertyBuyDetailsOther];
    // 6) Send both customer details
    res.send({
      matchedPropertyDetailsMine,
      matchedPropertyDetailsOther
    });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }

}

const getMatchedResidentialProptiesRentList = async (req, res) => {


  try {
    const customerDetails = JSON.parse(JSON.stringify(req.body));
    const customer_id = customerDetails.customer_id;
    const reqUserId = customerDetails.req_user_id;

    // 1) Get matched property using property_id from residentialRentPropertyMatch
    const matchedPCustomer = await ResidentialRentCustomerMatch.findOne({ customer_id: customer_id }).lean().exec();

    if (!matchedPCustomer) {
      res.status(404).send("No matched property found");
      return;
    }

    // create dict of matched_property_id_mine and percentage
    const mineMatchedPropertyList = matchedPCustomer.matched_property_id_mine;
    const mineMatchedPropertyDictList = {};
    for (let mineMatchedPropertyDict of mineMatchedPropertyList) {
      mineMatchedPropertyDictList[mineMatchedPropertyDict.property_id] = mineMatchedPropertyDict.matched_percentage;
    }
    // create dict of matched_property_id_other and percentage
    const otherMatchedPropertyList = matchedPCustomer.matched_property_id_other;
    const otherMatchedPropertyDictList = {};
    for (let otherMatchedPropertyDict of otherMatchedPropertyList) {
      otherMatchedPropertyDictList[otherMatchedPropertyDict.property_id] = otherMatchedPropertyDict.matched_percentage;
    }

    // 2) Get matched_customer_id_mine from matched property
    const matchedPropertyMineIds = matchedPCustomer.matched_property_id_mine.map(property => property.property_id);

    // 3) Get customer details using matched_customer_id_mine from residentialPropertyCustomerRent
    const matchedPropertyRentDetailsMine = await ResidentialPropertyRent.find({ property_id: { $in: matchedPropertyMineIds } }).lean().exec();
    // const matchedPropertyBuyDetailsMine = await ResidentialPropertySell.find({ property_id: { $in: matchedPropertyMineIds } });
    for (let matchedPropertyRentDetail of matchedPropertyRentDetailsMine) {
      const matchedPropertyId = matchedPropertyRentDetail.property_id;
      const matchedPercentage = mineMatchedPropertyDictList[matchedPropertyId];
      matchedPropertyRentDetail.matched_percentage = matchedPercentage;
    }
    const matchedPropertyDetailsMine = [...matchedPropertyRentDetailsMine];

    // 4) Get matched_customer_id_other from matched property
    const matchedPropertyOtherIds = matchedPCustomer.matched_property_id_other.map(property => property.property_id);

    // 5) Get customer details using matched_customer_id_other from residentialPropertyCustomerRent
    const matchedPropertyRentDetailsOther = await ResidentialPropertyRent.find({ property_id: { $in: matchedPropertyOtherIds } }).lean().exec();
    // const matchedPropertyBuyDetailsOther = await ResidentialPropertySell.find({ property_id: { $in: matchedPropertyOtherIds } });
    for (let matchedPropertyRentDetail of matchedPropertyRentDetailsOther) {
      const matchedPropertyId = matchedPropertyRentDetail.property_id;
      const matchedPercentage = otherMatchedPropertyDictList[matchedPropertyId];
      matchedPropertyRentDetail.matched_percentage = matchedPercentage;
    }
    let matchedPropertyDetailsOther = [...matchedPropertyRentDetailsOther];
    // if we are sending property deatils of other agents then we need to reppace owner deatils with agent deatils
    matchedPropertyDetailsOther = await replaceOwnerDetailsWithAgentDetails(matchedPropertyDetailsOther, reqUserId);

    // const matchedPropertyDetailsOther = [...matchedPropertyRentDetailsOther, ...matchedPropertyBuyDetailsOther];
    // 6) Send both customer details
    res.send({
      matchedPropertyDetailsMine,
      matchedPropertyDetailsOther
    });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }

}

const getMatchedCommercialProptiesList = async (req, res) => {


  try {
    const customerDetails = JSON.parse(JSON.stringify(req.body));
    const customer_id = customerDetails.customer_id;

    // 1) Get matched property using property_id from residentialRentPropertyMatch
    const matchedPCustomer = await CommercialRentCustomerMatch.findOne({ customer_id: customer_id });

    if (!matchedPCustomer) {
      res.status(404).send("No matched property found");
      return;
    }

    // 2) Get matched_customer_id_mine from matched property
    const matchedPropertyMineIds = matchedPCustomer.matched_property_id_mine.map(property => property.property_id);

    // 3) Get customer details using matched_customer_id_mine from residentialPropertyCustomerRent
    const matchedPropertyRentDetailsMine = await CommercialPropertyRent.find({ property_id: { $in: matchedPropertyMineIds } });
    const matchedPropertyBuyDetailsMine = await CommercialPropertySell.find({ property_id: { $in: matchedPropertyMineIds } });

    const matchedPropertyDetailsMine = [...matchedPropertyRentDetailsMine, ...matchedPropertyBuyDetailsMine];

    // 4) Get matched_customer_id_other from matched property
    const matchedPropertyOtherIds = matchedPCustomer.matched_property_id_other.map(property => property.property_id);

    // 5) Get customer details using matched_customer_id_other from residentialPropertyCustomerRent
    const matchedPropertyRentDetailsOther = await CommercialPropertyRent.find({ property_id: { $in: matchedPropertyOtherIds } });
    const matchedPropertyBuyDetailsOther = await CommercialPropertySell.find({ property_id: { $in: matchedPropertyOtherIds } });

    const matchedPropertyDetailsOther = [...matchedPropertyRentDetailsOther, ...matchedPropertyBuyDetailsOther];
    // 6) Send both customer details
    res.send({
      matchedPropertyDetailsMine,
      matchedPropertyDetailsOther
    });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }

}




//1) if property agaent id and req_user_id is diffrent then show customer list only of req_user_id

const getCustomerListForMeeting = async (req, res) => {
  const queryObj = JSON.parse(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));
  const reqUserId = queryObj.req_user_id;
  const agent_id = queryObj.agent_id;
  const property_type = queryObj.property_type;
  const propertyId = queryObj.property_id;
  const propertyAgentId = queryObj.property_agent_id;
  let property_for = queryObj.property_for;
  console.log("xxx", property_type);
  let CustomerModel;
  let MatchModel;

  if (property_type === "Residential") {
    if (property_for === "Sell") {
      property_for = "Buy";
    }
    if (property_for.toLowerCase() === "rent") {
      CustomerModel = ResidentialPropertyCustomerRent;
      MatchModel = ResidentialRentPropertyMatch;
    } else if (property_for.toLowerCase() === "buy") {
      CustomerModel = ResidentialPropertyCustomerBuy;
      MatchModel = ResidentialBuyPropertyMatch;
    }
  } else if (property_type === "Commercial") {
    if (property_for === "Sell") {
      property_for = "Buy";
    }
    if (property_for.toLowerCase() === "rent") {
      CustomerModel = CommercialPropertyCustomerRent;
      MatchModel = CommercialRentPropertyMatch;
    } else if (property_for.toLowerCase() === "buy") {
      CustomerModel = CommercialPropertyCustomerBuy;
      MatchModel = CommercialBuyPropertyMatch;
    }
  }

  const myCustomerListX = await CustomerModel.find({
    agent_id: agent_id,
    "customer_locality.property_type": property_type,
    "customer_locality.property_for": property_for
  }).lean().exec();
  // find other agent customers which are matched with this property
  const matchedData = await MatchModel.findOne({ property_id: propertyId, }).lean().exec();
  // create a dict each for my matched and other matched this dict will contain customer_id and matched percentage
  const myMatchedCustomerDictList = matchedData.matched_customer_id_mine;
  const myMatchedCustomerMap = {};
  const myMatchedCustomerIdList = [];
  for (let myMatchedCustomerDict of myMatchedCustomerDictList) {
    myMatchedCustomerIdList.push(myMatchedCustomerDict.customer_id);
    myMatchedCustomerMap[myMatchedCustomerDict.customer_id.toString()] = myMatchedCustomerDict.matched_percentage.toString();
  }

  // get my matched customer details
  const myMatchedCustomerList = await CustomerModel.find({ customer_id: { $in: myMatchedCustomerIdList } }).lean().exec();
  for (let myMatchedCustomer of myMatchedCustomerList) {
    myMatchedCustomer.matched_percentage = myMatchedCustomerMap[myMatchedCustomer.customer_id.toString()];
  }

  const otherMatchedCustomerDictList = matchedData.matched_customer_id_other;
  const otherMatchedCustomerMap = {};
  // const otherMatchedCustomerIdList = [];
  for (let otherMatchedCustomerDict of otherMatchedCustomerDictList) {
    // otherMatchedCustomerIdList.push(otherMatchedCustomerDict.customer_id);
    otherMatchedCustomerMap[otherMatchedCustomerDict.customer_id.toString()] = otherMatchedCustomerDict.matched_percentage.toString();
  }
  let otherCustomerList = []
  if (matchedData) {
    const otherAgentCustomerDictList = matchedData.matched_customer_id_other;
    const otherAgentCustomerList = [];
    for (let otherAgentCustomerDict of otherAgentCustomerDictList) {
      otherAgentCustomerList.push(otherAgentCustomerDict.customer_id);
    }

    if (reqUserId === propertyAgentId) {// why this condition is needed ?
      otherCustomerList = await CustomerModel.find({ customer_id: { $in: otherAgentCustomerList } }).lean().exec();
      for (let otherCustomer of otherCustomerList) {
        const otherAgent = await User.findOne({ id: otherCustomer.agent_id }).lean().exec();
        otherCustomer.customer_details.name = otherAgent.name ? otherAgent.name : "Agent";
        otherCustomer.customer_details.mobile1 = otherAgent.mobile;
        otherCustomer.matched_percentage = otherMatchedCustomerMap[otherCustomer.customer_id.toString()];
      }
    }
  }

  const myCustomerList = removeDuplicates(myMatchedCustomerList, myCustomerListX, "customer_id");
  const finalData = [...myCustomerList, ...myMatchedCustomerList, ...otherCustomerList];
  console.log(JSON.stringify(finalData));
  res.send(finalData);
  res.end();

};

// merge to lists but remove duplicate based on id
const mergeDedupe = (arr1, arr2, prop) => {
  const map = new Map();

  // Add all items from first array
  arr1.forEach(item => map.set(item[prop], item));

  // Add items from second array only if not already present
  arr2.forEach(item => {
    if (!map.has(item[prop])) {
      map.set(item[prop], item);
    }
  });

  return Array.from(map.values());
}


//  show my all properties + others matched property
// show my matched properties + others matched property

const getPropertyListingForMeeting = async (req, res) => {
  const agentDetails = JSON.parse(JSON.stringify(req.body));
  console.log("getPropertyListingForMeeting: " + JSON.stringify(req.body));
  const agent_id = agentDetails.agent_id;
  const property_type = agentDetails.property_type;
  const customerId = agentDetails.customer_id;
  const customerAgentId = agentDetails.agent_id_of_client;
  const reqUserId = agentDetails.req_user_id;
  let property_for = agentDetails.property_for;

  let PropertyModel;
  let MatchModel;

  if (property_type === "Residential") {
    if (property_for === "Buy") {
      property_for = "Sell";
    }
    if (property_for === "Rent") {
      PropertyModel = ResidentialPropertyRent;
      MatchModel = ResidentialRentCustomerMatch;
    } else if (property_for === "Sell") {
      PropertyModel = ResidentialPropertySell;
      MatchModel = ResidentialBuyCustomerMatch;
    }
  } else if (property_type === "Commercial") {
    if (property_for === "Buy") {
      property_for = "Sell";
    }
    if (property_for === "Rent") {
      PropertyModel = CommercialPropertyRent;
      MatchModel = CommercialRentCustomerMatch;
    } else if (property_for === "Sell") {
      PropertyModel = CommercialPropertySell;
      MatchModel = CommercialBuyCustomerMatch;
    }
  }

  const myPropertyRentListX = await PropertyModel.find({ agent_id: agent_id, property_type: property_type, property_for: property_for }).lean().exec();
  // find the list of properties which are matched with this customer but from other agents
  // There is possiblity that matched job is not run yet then we need to give users those properties which are matched with this customer from his own list
  const matchedData = await MatchModel.findOne({ customer_id: customerId }).lean().exec();

  const otherPropertyListAfterMasking = [];
  let myMatchedPropertyList = []

  if (matchedData) {
    // to find out mine
    const myMatchedPropertyDictList = matchedData.matched_property_id_mine;
    const myMatchedPropertyIdList = [];
    const myMatchedPropertyMap = {};
    if (reqUserId === customerAgentId) {
      for (let myMatchedPropertyDict of myMatchedPropertyDictList) {
        myMatchedPropertyIdList.push(myMatchedPropertyDict.property_id);
        myMatchedPropertyMap[myMatchedPropertyDict.property_id.toString()] = myMatchedPropertyDict.matched_percentage.toString();
      }
      myMatchedPropertyList = await PropertyModel.find({ property_id: { $in: myMatchedPropertyIdList } }).lean().exec();
      // update myMatchedPropertyList with matched percentage
      for (let myMatchedProperty of myMatchedPropertyList) {
        myMatchedProperty["matched_percentage"] = myMatchedPropertyMap[myMatchedProperty.property_id.toString()]
      }
    }


    // to find out others
    const otherAgentPropertyDictList = matchedData.matched_property_id_other;
    const otherAgentPropertyList = [];
    const otherMatchedPropertyMap = {};
    for (let otherAgentPropertyDict of otherAgentPropertyDictList) {
      otherAgentPropertyList.push(otherAgentPropertyDict.property_id);
      otherMatchedPropertyMap[otherAgentPropertyDict.property_id.toString()] = otherAgentPropertyDict.matched_percentage.toString();
    }
    if (reqUserId === customerAgentId) {
      const otherPropertyList = await PropertyModel.find({ property_id: { $in: otherAgentPropertyList } }).lean().exec();
      for (let otherProperty of otherPropertyList) {
        otherProperty["matched_percentage"] = otherMatchedPropertyMap[otherProperty.property_id.toString()];
        const otherAgent = await User.findOne({ id: otherProperty.agent_id }).lean().exec();
        // remove those agent properties which are deleted.
        if (otherAgent) {
          otherProperty.property_address = {
            city: otherProperty.property_address.city,
            main_text: otherProperty.property_address.main_text,
            formatted_address: otherProperty.property_address.formatted_address,
            flat_number: "",
            building_name: "",
            landmark_or_street: otherProperty.property_address.landmark_or_street,
          }
          otherProperty.owner_details = {
            name: otherAgent.name ? otherAgent.name : "Agent",
            mobile1: otherAgent.mobile,
            mobile2: otherAgent.mobile,
            address: "Please contact agent and refer property id " + otherProperty.property_id
          }
          otherPropertyListAfterMasking.push(otherProperty);
        }

      }
    }

  }
  // the aregument order sud be first matched data list then all data list so matched data will be added in final merge list
  // const myPropertyRentList = mergeDedupe(myMatchedPropertyList, myPropertyRentListX, "property_id");
  const myPropertyRentList = removeDuplicates(myMatchedPropertyList, myPropertyRentListX, "property_id");
  const finalData = [...myPropertyRentList, ...myMatchedPropertyList, ...otherPropertyListAfterMasking];
  res.send(JSON.stringify(finalData));
  res.end();


};

// this will remove duplicates from list2 based on propertyName
// and will return the list2
function removeDuplicates(list1, list2, propertyName) {
  // Create a Set to store the values of the specified property from the first list
  const propertyValuesFromList1 = new Set(list1.map(item => item[propertyName]));

  // Filter the second list, keeping only items whose specified property value is NOT in the Set
  const uniqueList2 = list2.filter(item => !propertyValuesFromList1.has(item[propertyName]));

  return uniqueList2;
}

const getResidentialPropertyListings = async (req, res) => {
  try {
    const agentDetails = JSON.parse(JSON.stringify(req.body));
    const agent_id = agentDetails.agent_id;

    // Use await to wait for the database query to complete
    const residentialPropertyRentData = await ResidentialPropertyRent.find({ agent_id: agent_id }).exec();
    const residentialPropertySellData = await ResidentialPropertySell.find({ agent_id: agent_id }).exec();

    // Merge the two arrays
    const allProperties = [...residentialPropertyRentData, ...residentialPropertySellData];

    // Sort the merged array based on update_date_time
    allProperties.sort((a, b) => new Date(b.update_date_time) - new Date(a.update_date_time));

    console.log(JSON.stringify(allProperties));
    res.send(allProperties); // Send the response with the sorted data
    res.end(); // End the response
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).send("Internal Server Error"); // Send an error response
  }
};

const addNewCommercialProperty = async (req, res) => {
  console.log("Prop details1: " + JSON.stringify(req.body));
  const obj = JSON.parse(JSON.stringify(req.body));
  const propertyDetails = JSON.parse(obj.propertyFinalDetails)

  const dir = getDirectoryPath(propertyDetails.agent_id);
  const createDirPath = IMAGE_PATH_URL + dir;


  if (!fs.existsSync(createDirPath)) {
    fs.mkdirSync(createDirPath, { recursive: true });
  }

  // storing files- START
  propertyDetails.image_urls = [];

  Object.keys(req.files).map((item, index) => {
    console.log("item", item);
    const file = req.files[item];

    const fileName = getFileName(propertyDetails.agent_id, index);
    // propertyDetails.agent_id + "_"+index+ "_"+ new Date(Date.now()).getTime() + ".jpeg";
    const path = createDirPath + fileName
    propertyDetails.image_urls.push({ url: dir + fileName });

    sharp(file.data)
      // .resize(320, 240)
      .toFile(path, (err, info) => {
        if (err) {
          console.log('sharp>>>', err);
        }
        else {
          console.log('resize ok !');
        }
      });

  })
  // storing files- END

  // console.log("Prop details2: " + propertyDetails);
  const propertyId = uniqueId();
  const locationArea = propertyDetails.property_address.location_area
  const gLocation = locationArea.location;

  const propertyDetailsDict = {
    property_id: propertyId,
    agent_id: propertyDetails.agent_id,
    property_type: propertyDetails.property_type,
    property_for: propertyDetails.property_for,
    owner_details: {
      name: propertyDetails.owner_details.name,
      mobile1: propertyDetails.owner_details.mobile1,
      mobile2: propertyDetails.owner_details.mobile2,
      address: propertyDetails.owner_details.address
    },
    location: gLocation,
    property_address: {
      city: propertyDetails.property_address.city,
      main_text: locationArea.main_text,
      formatted_address: locationArea.formatted_address,
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

    image_urls: propertyDetails.image_urls, //["vichi1"],
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

      const savedProperty = await CommercialPropertyRent.create(propertyDetailsDict);
      console.log("Property saved with create, and default:", savedProperty);

    } else if (propertyDetails.property_for === "Sell") {
      propertyDetailsDict["sell_details"] = {
        expected_sell_price: propertyDetails.sell_details.expected_sell_price,
        maintenance_charge: propertyDetails.sell_details.maintenance_charge,
        available_from: propertyDetails.sell_details.available_from,
        negotiable: propertyDetails.sell_details.negotiable
      };

      const savedProperty = await CommercialPropertySell.create(propertyDetailsDict);
      console.log("Property saved with create, and default:", savedProperty);
    }

    res.send(JSON.stringify(propertyDetailsDict));
    res.end();
    return;
  }


};

const addNewResidentialRentProperty = async (req, res) => {

  const obj = JSON.parse(JSON.stringify(req.body));
  console.log("propertyFinalDetails: ", JSON.parse(obj.propertyFinalDetails))
  const propertyDetails = JSON.parse(obj.propertyFinalDetails)

  const dir = getDirectoryPath(propertyDetails.agent_id);
  const createDirPath = IMAGE_PATH_URL + dir;

  console.log("createDirPath: ", createDirPath)
  if (!fs.existsSync(createDirPath)) {
    fs.mkdirSync(createDirPath, { recursive: true });
  }

  // storing files- START
  propertyDetails.image_urls = [];
  Object.keys(req.files).map((item, index) => {
    console.log("item", item);
    const file = req.files[item];
    const fileName = getFileName(propertyDetails.agent_id, index);
    // propertyDetails.agent_id + "_"+index+ "_"+ new Date(Date.now()).getTime() + ".jpeg";
    const path = createDirPath + fileName
    propertyDetails.image_urls.push({ url: dir + fileName });
    sharp(file.data)
      // .resize(320, 240)
      .toFile(path, (err, info) => {
        if (err) {
          console.log('sharp>>>', err);
        }
        else {
          console.log('resize ok !');
        }
      });

  })
  // storing files- END
  const locationArea = propertyDetails.property_address.location_area
  const gLocation = locationArea.location;
  const propertyId = uniqueId();

  const propertyDetailsDict = {
    property_id: propertyId,
    agent_id: propertyDetails.agent_id,
    property_type: propertyDetails.property_type,
    property_for: propertyDetails.property_for,
    owner_details: {
      name: propertyDetails.owner_details.name,
      mobile1: propertyDetails.owner_details.mobile1,
      mobile2: propertyDetails.owner_details.mobile2,
      address: propertyDetails.owner_details.address
    },
    location: gLocation,
    property_address: {
      city: propertyDetails.property_address.city,
      main_text: locationArea.main_text,
      formatted_address: locationArea.formatted_address,
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

    image_urls: propertyDetails.image_urls,//["vichi1"],
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

      const savedProperty = await ResidentialPropertyRent.create(propertyDetailsDict);
      console.log("Property saved with create, and default:", savedProperty);

    } else if (propertyDetails.property_for === "Sell") {
      propertyDetailsDict["sell_details"] = {
        expected_sell_price: propertyDetails.sell_details.expected_sell_price,
        maintenance_charge: propertyDetails.sell_details.maintenance_charge,
        available_from: propertyDetails.sell_details.available_from,
        negotiable: propertyDetails.sell_details.negotiable
      };

      const savedProperty = await ResidentialPropertySell.create(propertyDetailsDict);
      console.log("Property saved with create, and default:", savedProperty);

    }
    res.send(JSON.stringify(propertyDetailsDict));
    res.end();
    return;
  }


};

const getFileName = (agent_id, index) => {
  return agent_id + "_" + index + "_" + new Date(Date.now()).getTime() + ".jpeg";
}

const getDirectoryPath = (agent_id) => {
  const hashCode = Math.abs(hash(agent_id)).toString();
  console.log("propertyDetails: ", agent_id)
  console.log("hashCode: ", hashCode);

  const lastFive = hashCode.slice(- 5);
  const childOneDir = lastFive.slice(0, 2)
  const childTwoDir = lastFive.slice(2, 4)
  const childThreeDir = lastFive.slice(-1)
  console.log("lastFive: ", lastFive);
  console.log("childOneDir: ", childOneDir);
  console.log("childTwoDir: ", childTwoDir);
  console.log("childThreeDir: ", childThreeDir);
  const dir = "/" + childOneDir + "/" + childTwoDir + "/" + childThreeDir + "/";
  return dir;

}



const getTotalListingSummary = (req, res) => {
  console.log("Prop details1: " + JSON.stringify(req.body));
  const agentObj = JSON.parse(JSON.stringify(req.body));
  // calculate last 4 months starting time
  const today = new Date(Date.now());
  const todayDate = today.getDate();
  console.log(todayDate);
  console.log(32 - todayDate);
  const daysToMinus = 120 - (31 - todayDate);
  var dateOffset = 24 * 60 * 60 * 1000 * 92;
  const x = new Date(Date.now()) - dateOffset;
  console.log(new Date(x).getMonth());
  var startDate = new Date(
    new Date(x).getFullYear(),
    new Date(x).getMonth(),
    1
  );
  console.log(startDate.getDate());
  console.log(startDate.getMonth());
  const month = startDate.toLocaleString("default", { month: "long" });
  console.log(month);

  Promise.all([
    ResidentialProperty.aggregate([
      {
        $match: {
          agent_id: agentObj.agent_id,
          create_date_time: { $gt: startDate }
        }
      },
      {
        $group: {
          _id: {
            property_for: "$property_for",
            year: { $year: { date: "$create_date_time" } },
            month: { $month: { date: "$create_date_time" } }
          },
          count: { $sum: 1 }
        }
      }
    ]).exec(),
    CommercialProperty.aggregate([
      {
        $match: {
          agent_id: agentObj.agent_id,
          create_date_time: { $gt: startDate }
        }
      },
      {
        $group: {
          _id: {
            property_for: "$property_for",
            year: { $year: { date: "$create_date_time" } },
            month: { $month: { date: "$create_date_time" } }
          },
          count: { $sum: 1 }
        }
      }
    ]).exec()
  ]).then(results => {
    const residentialPropsObjArray = results[0];
    const commercialPropObjArray = results[1];
    residentialPropsObj = {};
    commercialPropObj = {};
    residentialPropsObjArray.map(item => {
      if (item._id === "Sell") {
        residentialPropsObj["sell"] = item.count;
      }
      if (item._id === "Rent") {
        residentialPropsObj["rent"] = item.count;
      }
    });

    commercialPropObjArray.map(item => {
      if (item._id === "Sell") {
        commercialPropObj["sell"] = item.count;
      }
      if (item._id === "Rent") {
        commercialPropObj["rent"] = item.count;
      }
    });
    // const sum = results[2]
    console.log(JSON.stringify({ residentialPropsObjArray }));
    console.log(JSON.stringify({ commercialPropObjArray }));
    console.log(JSON.stringify({ residentialPropsObj, commercialPropObj }));
    // res.status(200).json({ list, count, sum });
  });
};



const addNewResidentialCustomer = async (req, res) => {
  console.log("Prop details1: " + JSON.stringify(req.body));
  const customerDetails = JSON.parse(JSON.stringify(req.body));
  // console.log("Prop details2: " + propertyDetails);
  const customerId = uniqueId();
  let residentialCustomerRentLocationDictArray = [];
  let residentialCustomerBuyLocationDictArray = [];
  // get location from location_area
  const locations = customerDetails.customer_locality.location_area.map((location) => ({
    ...location,
    // customer_id: customerId, // Reference the customer
    // agent_id: customerDetails.agent_id,
  }));

  const customerDetailsDict = {
    customer_id: customerId,
    agent_id: customerDetails.agent_id,

    customer_details: {
      name: customerDetails.customer_details.name,
      mobile1: customerDetails.customer_details.mobile1,
      address: customerDetails.customer_details.address
    },
    customer_locality: {
      city: customerDetails.customer_locality.city,
      location_area: customerDetails.customer_locality.location_area,
      property_type: customerDetails.customer_locality.property_type,
      property_for: customerDetails.customer_locality.property_for,
      preferred_tenants: customerDetails.customer_locality.preferred_tenants
    },

    customer_property_details: {
      house_type: customerDetails.customer_property_details.house_type,
      bhk_type: customerDetails.customer_property_details.bhk_type,
      furnishing_status:
        customerDetails.customer_property_details.furnishing_status,
      parking_type: customerDetails.customer_property_details.parking_type,
      lift: customerDetails.customer_property_details.lift
    },

    image_urls: ["vichi1"],
    create_date_time: new Date(Date.now()),
    update_date_time: new Date(Date.now())
  };

  if (customerDetails.customer_locality.property_type === "Residential") {
    if (customerDetails.customer_locality.property_for === "Rent") {
      customerDetailsDict["customer_rent_details"] = {
        expected_rent: customerDetails.customer_rent_details.expected_rent,
        expected_deposit:
          customerDetails.customer_rent_details.expected_deposit,
        available_from: customerDetails.customer_rent_details.available_from,

      };

      for (let location of locations) {
        const residentialCustomerRentLocationDict = {
          customer_id: customerId,
          location: location.location,
          agent_id: customerDetails.agent_id,
          customer_property_details: {
            house_type: customerDetails.customer_property_details.house_type,
            bhk_type: customerDetails.customer_property_details.bhk_type,
            furnishing_status:
              customerDetails.customer_property_details.furnishing_status,
            parking_type: customerDetails.customer_property_details.parking_type,
          },

          customer_rent_details: {
            expected_rent: customerDetails.customer_rent_details.expected_rent,
            expected_deposit:
              customerDetails.customer_rent_details.expected_deposit,
            available_from: customerDetails.customer_rent_details.available_from,
            preferred_tenants: customerDetails.customer_locality.preferred_tenants
          },
        }
        residentialCustomerRentLocationDictArray.push(residentialCustomerRentLocationDict);
      }
      // for each loaction there will be one entry

    } else if (customerDetails.customer_locality.property_for === "Buy") {
      customerDetailsDict["customer_buy_details"] = {
        expected_buy_price:
          customerDetails.customer_buy_details.expected_buy_price,
        available_from: customerDetails.customer_buy_details.available_from,
        negotiable: customerDetails.customer_buy_details.negotiable
      };
      for (let location of locations) {
        const residentialCustomerBuyLocationDict = {
          customer_id: customerId,
          location: location.location,
          agent_id: customerDetails.agent_id,
          customer_property_details: {
            house_type: customerDetails.customer_property_details.house_type,
            bhk_type: customerDetails.customer_property_details.bhk_type,
            furnishing_status:
              customerDetails.customer_property_details.furnishing_status,
            parking_type: customerDetails.customer_property_details.parking_type,
          },
          customer_buy_details: {
            expected_buy_price:
              customerDetails.customer_buy_details.expected_buy_price,
            available_from: customerDetails.customer_buy_details.available_from,
            negotiable: customerDetails.customer_buy_details.negotiable
          },

        }

        residentialCustomerBuyLocationDictArray.push(residentialCustomerBuyLocationDict);

      }

    }
  }



  if (customerDetails.customer_locality.property_for.toLowerCase() === 'rent') {

    const savedProperty = await ResidentialPropertyCustomerRent.create(customerDetailsDict);
    const createdDocuments = await ResidentialCustomerRentLocation.create(residentialCustomerRentLocationDictArray);
    console.log("ResidentialPropertyCustomerRent created successfully:", createdDocuments);

  } else if (customerDetails.customer_locality.property_for.toLowerCase() === 'buy') {

    const savedProperty = await ResidentialPropertyCustomerBuy.create(customerDetailsDict);
    const createdDocuments = await ResidentialCustomerBuyLocation.create(residentialCustomerBuyLocationDictArray);

  }
  res.send(JSON.stringify(customerDetailsDict));
  res.end();
  return;

};

const addNewCommercialCustomer = async (req, res) => {
  console.log("Prop details1: " + JSON.stringify(req.body));
  const customerDetails = JSON.parse(JSON.stringify(req.body));
  // console.log("Prop details2: " + propertyDetails);
  const customerId = uniqueId();
  // get location from location_area
  // const locationArray = [];
  // customerDetails.customer_locality.location_area.forEach((locationData, i) => {
  //   console.log(locationData.location);
  //   locationArray.push(locationData.location);
  // });

  // const locationArray = customerDetails.customer_locality.location_area.map(locationData => ({
  //   type: "Point",
  //   coordinates: locationData.location.coordinates,
  // }));

  let commercialCustomerRentLocationDictArray = [];
  let commercialCustomerBuyLocationDictArray = [];

  const locations = customerDetails.customer_locality.location_area.map((location) => ({
    ...location,
    // customer_id: customerId, // Reference the customer
    // agent_id: customerDetails.agent_id,
  }));

  const customerDetailsDict = {
    customer_id: customerId,
    agent_id: customerDetails.agent_id,

    customer_details: {
      name: customerDetails.customer_details.name,
      mobile1: customerDetails.customer_details.mobile1,
      // mobile2: customerDetails.customer_details.mobile2,
      address: customerDetails.customer_details.address
    },
    customer_locality: {
      city: customerDetails.customer_locality.city,
      location_area: customerDetails.customer_locality.location_area,
      property_type: customerDetails.customer_locality.property_type,
      property_for: customerDetails.customer_locality.property_for,
      // pin: customerDetails.customer_locality.pin
    },

    customer_property_details: {
      building_type: customerDetails.customer_property_details.building_type,
      parking_type: customerDetails.customer_property_details.parking_type,
      property_used_for:
        customerDetails.customer_property_details.property_used_for,
      property_size: customerDetails.customer_property_details.property_size,
    },

    image_urls: ["vichi1"],
    create_date_time: new Date(Date.now()),
    update_date_time: new Date(Date.now())
  };

  if (customerDetails.customer_locality.property_type === "Commercial") {
    if (customerDetails.customer_locality.property_for === "Rent") {
      customerDetailsDict["customer_rent_details"] = {
        expected_rent: customerDetails.customer_rent_details.expected_rent,
        expected_deposit:
          customerDetails.customer_rent_details.expected_deposit,
        available_from: customerDetails.customer_rent_details.available_from
      };
      for (let location of locations) {
        const commercialCustomerRentLocationDict = {
          customer_id: customerId,
          location: location.location,
          agent_id: customerDetails.agent_id,

          customer_property_details: {
            building_type: customerDetails.customer_property_details.building_type,
            parking_type: customerDetails.customer_property_details.parking_type,
            property_used_for:
              customerDetails.customer_property_details.property_used_for,
            property_size: customerDetails.customer_property_details.property_size,
          },
          customer_rent_details: {
            expected_rent: customerDetails.customer_rent_details.expected_rent,
            expected_deposit:
              customerDetails.customer_rent_details.expected_deposit,
            available_from: customerDetails.customer_rent_details.available_from
          }


        }
        commercialCustomerRentLocationDictArray.push(commercialCustomerRentLocationDict);
      }
    } else if (customerDetails.customer_locality.property_for === "Buy") {
      customerDetailsDict["customer_buy_details"] = {
        expected_buy_price:
          customerDetails.customer_buy_details.expected_buy_price,
        available_from: customerDetails.customer_buy_details.available_from,
        negotiable: customerDetails.customer_buy_details.negotiable
      };

      for (let location of locations) {
        const commercialCustomerBuyLocationDict = {
          customer_id: customerId,
          location: location.location,
          agent_id: customerDetails.agent_id,

          customer_property_details: {
            building_type: customerDetails.customer_property_details.building_type,
            parking_type: customerDetails.customer_property_details.parking_type,
            property_used_for:
              customerDetails.customer_property_details.property_used_for,
            property_size: customerDetails.customer_property_details.property_size,
          },
          customer_buy_details: {
            expected_buy_price:
              customerDetails.customer_buy_details.expected_buy_price,
            available_from: customerDetails.customer_buy_details.available_from,
            negotiable: customerDetails.customer_buy_details.negotiable
          }


        }
        commercialCustomerBuyLocationDictArray.push(commercialCustomerBuyLocationDict);
      }
    }
  }

  if (customerDetails.customer_locality.property_for.toLowerCase() === 'rent') {

    const savedProperty = await CommercialPropertyCustomerRent.create(customerDetailsDict);
    const createdDocuments = await CommercialCustomerRentLocation.create(commercialCustomerRentLocationDictArray);

  } else if (customerDetails.customer_locality.property_for.toLowerCase() === 'buy') {
    const savedProperty = await CommercialPropertyCustomerBuy.create(customerDetailsDict);
    const createdDocuments = await CommercialCustomerBuyLocation.create(commercialCustomerBuyLocationDictArray);

  }

  res.send(JSON.stringify(customerDetailsDict));
  res.end();
  return;
};

// modify property adress and owner deatils with agent details
const modifyPropertyOwnerAndAddressDetails = async (reqUserId, propertyDetail) => {
  if (Array.isArray(propertyDetail)) {
    for (let i = 0; i < propertyDetail.length; i++) {
      if (reqUserId !== propertyDetail[i].agent_id) {
        const otherPropertyAgentIdDetails = await User.findOne({ id: propertyDetail[i].agent_id }).lean().exec();
        propertyDetail[i]["owner_details"] = {
          name: otherPropertyAgentIdDetails.name ? otherPropertyAgentIdDetails.name : 'Agent',
          mobile1: otherPropertyAgentIdDetails.mobile,
          mobile2: otherPropertyAgentIdDetails.mobile,
          address: 'Please contact agent for more details with property id: ' + propertyDetail[i].property_id
        }
        propertyDetail[i]["property_address"] = {
          city: propertyDetail[i].property_address.city,
          main_text: propertyDetail[i].property_address.main_text,
          formatted_address: propertyDetail[i].property_address.formatted_address,
          flat_number: '',
          building_name: '',
          landmark_or_street: propertyDetail[i].property_address.landmark_or_street,
        }
      }
    }
  } else {
    if (reqUserId !== propertyDetail.agent_id) {
      propertyDetail["property_address"] = {
        city: propertyDetail.property_address.city,
        main_text: propertyDetail.property_address.main_text,
        formatted_address: propertyDetail.property_address.formatted_address,
        flat_number: '',
        building_name: '',
        landmark_or_street: propertyDetail.property_address.landmark_or_street,
      }
      const otherPropertyAgentIdDetails = await User.findOne({ id: otherPropertyAgentId }).lean().exec();
      propertyDetail["owner_details"] = {
        name: otherPropertyAgentIdDetails.name ? otherPropertyAgentIdDetails.name : 'Agent',
        mobile1: otherPropertyAgentIdDetails.mobile,
        mobile2: otherPropertyAgentIdDetails.mobile,
        address: 'Please contact agent for more details with property id: ' + propertyDetail.property_id
      }
    }
  }
}

// modifyCustomerDetails with agent details
const modifyCustomerDetails = async (reqUserId, customerDetails) => {
  if (reqUserId !== customerDetails.agent_id) {
    const otherCustomerAgentIdDetails = await User.findOne({ id: customerDetails.agent_id }).lean().exec();
    customerDetails["customer_details"] = {
      name: otherCustomerAgentIdDetails.name ? otherCustomerAgentIdDetails.name : 'Agent',
      mobile1: otherCustomerAgentIdDetails.mobile,
      address: 'Please contact agent for more details with Reference customer id: ' + customerDetails.customer_id
    }
  }

}




const getCustomerAndMeetingDetailsX = async (req, res) => {
  console.log("getCustomerAndMeetingDetails: " + JSON.stringify(req.body));
  const queryObj = JSON.parse(JSON.stringify(req.body));
  const reqUserId = queryObj.req_user_id;

  if (queryObj.category_type === "Residential") {
    if (queryObj.category_for === "Rent") {
      const propertyDetail = await ResidentialPropertyRent.find({ property_id: { $in: queryObj.category_ids } }).lean().exec();
      const customerDetails = await ResidentialPropertyCustomerRent.findOne({ customer_id: queryObj.client_id }).lean().exec();
      //1) we have customer id so I ll find matched_property_id_mine and matched_property_id_other
      //2) create map so we dont have itrate multiple time
      //3) itrate thriugh propertyDetail and where match asign matched_percentage
      const matchPropertiesForCustomer = await ResidentialRentCustomerMatch.findOne({ customer_id: customerDetails.customer_id }).lean().exec();
      const mineMatchedPropertyList = matchPropertiesForCustomer.matched_property_id_mine;
      const otherMatchedPropertyList = matchPropertiesForCustomer.matched_property_id_other;
      const mineMatchedPropertyMap = {};
      for (let mineMatchedProperty of mineMatchedPropertyList) {
        mineMatchedPropertyMap[mineMatchedProperty.property_id.toString()] = mineMatchedProperty.matched_percentage.toString();
      }

      const otherMatchedPropertyMap = {};
      for (let otherMatchedProperty of otherMatchedPropertyList) {
        otherMatchedPropertyMap[otherMatchedProperty.property_id.toString()] = otherMatchedProperty.matched_percentage.toString();
      }
      for (let property of propertyDetail) {
        property.matched_percentage = mineMatchedPropertyMap[property.property_id.toString()]
          ? mineMatchedPropertyMap[property.property_id.toString()] : 0;
        if (property.matched_percentage === 0) {
          property.matched_percentage = otherMatchedPropertyMap[property.property_id.toString()]
            ? otherMatchedPropertyMap[property.property_id.toString()] : 0;
        }

      }

      await modifyPropertyOwnerAndAddressDetails(reqUserId, propertyDetail);
      await modifyCustomerDetails(reqUserId, customerDetails);
      const resObj = {
        property_details: propertyDetail,
        customer_details: customerDetails
      };
      res.send(resObj);
      res.end();
      return;


    } else if (queryObj.category_for === "Sell" || queryObj.category_for === "Buy") {

      const propertyDetail = await ResidentialPropertySell.find({
        property_id: { $in: queryObj.category_ids }
      }).lean().exec();
      const customerDetails = await ResidentialPropertyCustomerBuy.findOne({
        customer_id: queryObj.client_id
      }).lean().exec();

      await modifyPropertyOwnerAndAddressDetails(reqUserId, propertyDetail);
      await modifyCustomerDetails(reqUserId, customerDetails);
      const resObj = {
        property_details: propertyDetail,
        customer_details: customerDetails
      };
      res.send(resObj);
      res.end();
      return;
    }

  } else if (queryObj.category_type === "Commercial") {
    if (queryObj.category_for === "Rent") {

      const propertyDetail = await CommercialPropertyRent.find({
        property_id: { $in: queryObj.category_ids }
      }).lean().exec();

      const customerDetails = await CommercialPropertyCustomerRent.findOne({
        customer_id: queryObj.client_id
      }).lean().exec();

      await modifyPropertyOwnerAndAddressDetails(reqUserId, propertyDetail);
      await modifyCustomerDetails(reqUserId, customerDetails);
      const resObj = {
        property_details: propertyDetail,
        customer_details: customerDetails
      };
      res.send(resObj);
      res.end();
      return;

    } else if (queryObj.category_for === "Sell" || queryObj.category_for === "Buy") {

      const propertyDetail = await CommercialPropertySell.find({
        property_id: { $in: queryObj.category_ids }
      }).lean().exec();

      const customerDetails = await CommercialPropertyCustomerBuy.findOne({
        customer_id: queryObj.client_id
      }).lean().exec();

      await modifyPropertyOwnerAndAddressDetails(reqUserId, propertyDetail);
      await modifyCustomerDetails(reqUserId, customerDetails);
      const resObj = {
        property_details: propertyDetail,
        customer_details: customerDetails
      };
      res.send(resObj);
      res.end();
      return;
    }

  }
};


const getCustomerAndMeetingDetails = async (req, res) => {
  console.log("getCustomerAndMeetingDetails: " + JSON.stringify(req.body));
  const queryObj = JSON.parse(JSON.stringify(req.body));
  const reqUserId = queryObj.req_user_id;

  let propertyDetail = [];
  let customerDetails = [];
  let matchModel;
  if (queryObj.category_type === "Residential") {
    if (queryObj.category_for === "Rent") {
      propertyDetail = await ResidentialPropertyRent.find({ property_id: { $in: queryObj.category_ids } }).lean().exec();
      customerDetails = await ResidentialPropertyCustomerRent.findOne({ customer_id: queryObj.client_id }).lean().exec();
      matchModel = ResidentialRentCustomerMatch;


    } else if (queryObj.category_for === "Sell" || queryObj.category_for === "Buy") {

      propertyDetail = await ResidentialPropertySell.find({
        property_id: { $in: queryObj.category_ids }
      }).lean().exec();
      customerDetails = await ResidentialPropertyCustomerBuy.findOne({
        customer_id: queryObj.client_id
      }).lean().exec();

      matchModel = ResidentialBuyCustomerMatch;

    }

  } else if (queryObj.category_type === "Commercial") {
    if (queryObj.category_for === "Rent") {

      propertyDetail = await CommercialPropertyRent.find({
        property_id: { $in: queryObj.category_ids }
      }).lean().exec();

      customerDetails = await CommercialPropertyCustomerRent.findOne({
        customer_id: queryObj.client_id
      }).lean().exec();

      matchModel = CommercialRentCustomerMatch;



    } else if (queryObj.category_for === "Sell" || queryObj.category_for === "Buy") {

      propertyDetail = await CommercialPropertySell.find({
        property_id: { $in: queryObj.category_ids }
      }).lean().exec();

      customerDetails = await CommercialPropertyCustomerBuy.findOne({
        customer_id: queryObj.client_id
      }).lean().exec();

      matchModel = CommercialBuyCustomerMatch;

    }

  }

  //1) we have customer id so I ll find matched_property_id_mine and matched_property_id_other
  //2) create map so we dont have itrate multiple time
  //3) itrate thriugh propertyDetail and where match asign matched_percentage
  const matchPropertiesForCustomer = await matchModel.findOne({ customer_id: customerDetails.customer_id }).lean().exec();
  const mineMatchedPropertyList = matchPropertiesForCustomer.matched_property_id_mine;
  const otherMatchedPropertyList = matchPropertiesForCustomer.matched_property_id_other;
  const mineMatchedPropertyMap = {};
  for (let mineMatchedProperty of mineMatchedPropertyList) {
    mineMatchedPropertyMap[mineMatchedProperty.property_id.toString()] = mineMatchedProperty.matched_percentage.toString();
  }

  const otherMatchedPropertyMap = {};
  for (let otherMatchedProperty of otherMatchedPropertyList) {
    otherMatchedPropertyMap[otherMatchedProperty.property_id.toString()] = otherMatchedProperty.matched_percentage.toString();
  }
  for (let property of propertyDetail) {
    property.matched_percentage = mineMatchedPropertyMap[property.property_id.toString()]
      ? mineMatchedPropertyMap[property.property_id.toString()] : 0;
    if (property.matched_percentage === 0) {
      property.matched_percentage = otherMatchedPropertyMap[property.property_id.toString()]
        ? otherMatchedPropertyMap[property.property_id.toString()] : 0;
    }

  }

  await modifyPropertyOwnerAndAddressDetails(reqUserId, propertyDetail);
  await modifyCustomerDetails(reqUserId, customerDetails);
  const resObj = {
    property_details: propertyDetail,
    customer_details: customerDetails
  };
  res.send(resObj);
  res.end();
  return;
};

const getAllGlobalListingByLocations = (req, res) => {
  console.log("getAllGlobalListingByLocations: " + JSON.stringify(req.body));
  const queryObj = JSON.parse(JSON.stringify(req.body));
  const selectedTab = queryObj.selectedTab; // property=0, customer=1
  const propertyTypeIndex = queryObj.propertyTypeIndex; // Residential=0, Commercial=1
  // first get all location of this agent's listings including property and customer
  let queryDoc;
  let condition;
  if (selectedTab === 0) {
    condition = {
      "property_address.location_area": { $in: ["Andheri west", "Malad"] }
    };
    if (propertyTypeIndex === 0) {
      queryDoc = ResidentialProperty;
    } else if (propertyTypeIndex === 1) {
      queryDoc = CommercialProperty;
    }
  } else if (selectedTab === 1) {
    condition = {
      "customer_locality.location_area": {
        $in: ["Bandra", "And hero west", "Jogeshwari", "Powai"]
      }
    };
    if (propertyTypeIndex === 0) {
      queryDoc = ResidentialPropertyCustomer;
    } else if (propertyTypeIndex === 1) {
      queryDoc = CommercialPropertyCustomer;
    }
  }
  // queryDoc.find(condition, function(err, data) {
  queryDoc.find(function (err, data) {
    if (err) {
      console.log(err);
      return;
    } else {
      // console.log("response datax1:  " + JSON.stringify(data));
      res.send(JSON.stringify(data));
      res.end();
      return;
    }
  });
};

const sendMessage = (req, res) => {
  const messageDetails = JSON.parse(JSON.stringify(req.body));
  const messageId = uniqueId();
  const create_date_time = new Date(Date.now());
  const update_date_time = new Date(Date.now());
  messageDetails["message_id"] = messageId;
  messageDetails["create_date_time"] = create_date_time;
  messageDetails["update_date_time"] = update_date_time;
  console.log("messageDetails: " + JSON.stringify(messageDetails));

  Message.collection.insertOne(messageDetails, function (err, data) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify("fail"));
      res.end();
      return;
    } else {
      console.log("message Added" + JSON.stringify(data));
      res.send(JSON.stringify({ messageId: messageId }));
      res.end();
      return;
    }
  });
};

const getMessagesList = (req, res) => {
  const userObj = JSON.parse(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));
  Message.find(
    { "receiver_details.id": userObj.agent_id },

    function (err, data) {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log("response datax2:  " + JSON.stringify(data));
        res.send(JSON.stringify(data));
        res.end();
        return;
      }
    }
  ).sort({ create_date_time: -1 });
};

const getSubjectDetails = (req, res) => {
  const subObj = JSON.parse(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));
  let docName;
  if (subObj.subject_category === "property") {
    if (subObj.subject_type === "Residential") {
      docName = ResidentialProperty;
    } else if (subObj.subject_type === "Commercial") {
      docName = CommercialProperty;
    }
    docName.findOne({ property_id: subObj.subject_id }, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(JSON.stringify(data));
      res.send(data);
      res.end();
    });
  } else if (subObj.subject_category === "customer") {
    if (subObj.subject_type === "Residential") {
      docName = ResidentialPropertyCustomer;
    } else if (subObj.subject_type === "Commercial") {
      docName = CommercialPropertyCustomer;
    }

    docName.findOne({ customer_id: subObj.subject_id }, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(JSON.stringify(data));
      res.send(data);
      res.end();
    });
  }
};

const hash = (str) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var character = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

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

// http://localhost:3001/property-details
// http://192.168.0.101:3001/property-details

// https://ayushcare.in/products/zandopa-powder-200gm?currency=INR&variant=38006456844478&utm_campaign=gs-2020-03-02&utm_source=google&utm_medium=smart_campaign&gclid=CjwKCAjwr_uCBhAFEiwAX8YJgeONlJnX2s8MiYYvH45nJtOmk9SDGfZtTkKiTq4im8NEQd4V6PNDuRoCT6YQAvD_BwE

// https://github.com/Gapur/google-place-autocomplete
// https://betterprogramming.pub/the-best-practice-with-google-place-autocomplete-api-on-react-939211e8b4ce


// realto/prop/<days 1 to 30>/<days name>/