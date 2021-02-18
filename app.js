const express = require("express");
const bodyParser = require("body-parser");
var busboy = require("connect-busboy");
const mongoose = require("mongoose");
const path = require("path"); //used for file path
var uuid = require("uuid");

const ResidentialRentProperty = require("./models/residential/residentialRentProperty");

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

app.post("/addNewProperty", function(req, res) {
  addNewProperty(req, res);
});

app.post("/propertyListings", function(req, res) {
  console.log("propertyListings");
  getPropertyListings(req, res);
});

const getPropertyListings = (req, res) => {
  const agent_id = "1234";
  ResidentialRentProperty.find({ agent_id: agent_id }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    // console.log(JSON.stringify(data));
    res.send(data);
    res.end();
  });
};

const addNewProperty = (req, res) => {
  // console.log("Prop details1: " + JSON.stringify(req.body));
  const propertyDetails = JSON.parse(JSON.stringify(req.body));
  // console.log("Prop details2: " + propertyDetails);
  const propertyId = uuid.v4();
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

    rent_details: {
      expected_rent: propertyDetails.rent_details.expected_rent,
      expected_deposit: propertyDetails.rent_details.expected_deposit,
      available_from: propertyDetails.rent_details.available_from,
      preferred_tenants: propertyDetails.rent_details.preferred_tenants,
      non_veg_allowed: propertyDetails.rent_details.non_veg_allowed
    },
    image_urls: ["vichi1"],
    create_date_time: new Date(Date.now()),
    update_date_time: new Date(Date.now())
  };

  ResidentialProperty.collection.insertOne(propertyDetailsDict, function(
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
