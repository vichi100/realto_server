const express = require("express");
const bodyParser = require("body-parser");
var busboy = require("connect-busboy");
const mongoose = require("mongoose");
const path = require("path"); //used for file path
var uuid = require("uuid");
const { nanoid } = require("nanoid");

// https://in.pinterest.com/pin/677299231444826508/

const ResidentialProperty = require("./models/residentialProperty");
// const CommercialProperty = require("./models/commercialProperty");
// const Reminder = require("./models/reminder");
// const Agent = require("./models/agent");
// const Employee = require("./models/employee");
// const User = require("./models/user");
// const ResidentialPropertyCustomer = require("./models/residentialPropertyCustomer");
// const CommercialPropertyCustomer = require("./models/commercialPropertyCustomer");
// const Message = require("./models/message");

const app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header(
  //   "Access-Control-Allow-Methods",
  //   "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  // );
  // res.header(
  //   //"Access-Control-Allow-Headers",
  //   "Origin, X-Requested-With, Content-Type, Accept"
  // );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested With, Content-Type, Accept"
  );

  next();
});

// start: Connect to DB
mongoose
  .connect(
    // "mongodb+srv://vichi:vichi123@cluster0-1ys3l.gcp.mongodb.net/test?retryWrites=true&w=majority"
    "mongodb+srv://vichi:vichi123@cluster0.dx3cf.mongodb.net/ziggy?retryWrites=true&w=majority"
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

app.post("/addNewRestaurant", function(req, res) {
  console.log("addNewRestaurant");
  addNewRestaurant(req, res);
});

const addNewRestaurant = (req, res) => {
  const restaurantObj = JSON.parse(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));
};
