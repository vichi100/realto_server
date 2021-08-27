const express = require("express");
const bodyParser = require("body-parser");
var busboy = require("connect-busboy");
const mongoose = require("mongoose");
const path = require("path"); //used for file path
var uuid = require("uuid");
const fileUpload = require('express-fileupload');
const { nanoid } = require('nanoid');
const axios = require('axios');
const sharp = require('sharp');
var fs = require('fs');
// const multer = require('multer');

// https://in.pinterest.com/pin/677299231444826508/

// 2 Factor API
const OTP_API = 'd19dd3b7-fc3f-11e7-a328-0200cd936042';

const ResidentialProperty = require("./models/residentialProperty");
const CommercialProperty = require("./models/commercialProperty");
const Reminder = require("./models/reminder");
const Agent = require("./models/agent");
const Employee = require("./models/employee");
const User = require("./models/user");
const ResidentialPropertyCustomer = require("./models/residentialPropertyCustomer");
const CommercialPropertyCustomer = require("./models/commercialPropertyCustomer");
const Message = require("./models/message");
const commercialProperty = require("./models/commercialProperty");
const { json } = require("body-parser");

const IMAGE_PATH_DEV = "/Users/vichirajan/Documents/github/realtoproject/images";
const IMAGE_PATH_PROD = "/Users/vichirajan/Documents/github/realtoproject/images";
const IMAGE_PATH_URL = IMAGE_PATH_DEV;

const app = express();
// app.use(busboy());

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

// start: Connect to DB
mongoose
  .connect(
    // "mongodb+srv://vichi:vichi123@cluster0-1ys3l.gcp.mongodb.net/test?retryWrites=true&w=majority"
    "mongodb+srv://vichi:vichi123@cluster0.dx3cf.mongodb.net/propM?retryWrites=true&w=majority"
  )
  .then(() => {
    // app.listen(6000 ,'0.0.0.0');
    app.listen(7000, "0.0.0.0", () => {
      console.log("server is listening on 7000 port");
    });

    console.log("MongoDB connected...server listening at 7000");
  })
  .catch(err => console.log(err));

// end: Connect to DB





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

app.post("/getReminderList", function (req, res) {
  console.log("getReminderList");
  getReminderList(req, res);
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
  console.log("residential customer Listings");
  getResidentialCustomerList(req, res);
});

app.post("/getPropertyDetailsByIdToShare", function (req, res) {
  console.log("getPropertyDetailsByIdToShare Listings");
  getPropertyDetailsByIdToShare(req, res);
});

app.post("/getCustomerDetailsByIdToShare", function (req, res) {
  console.log("getCustomerDetailsByIdToShare Listings");
  getCustomerDetailsByIdToShare(req, res);
});


app.post("/addNewResidentialCustomer", function (req, res) {
  addNewResidentialCustomer(req, res);
});

app.post("/addNewCommercialCustomer", function (req, res) {
  addNewCommercialCustomer(req, res);
});

const getCustomerDetailsByIdToShare = (req, res) => {
  const propObj = JSON.parse(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));
  // const propertyId = JSON.parse(JSON.stringify(req.body)).property_id;
  // const agentId = JSON.parse(JSON.stringify(req.body)).agent_id;
  // property_type: String,
  //   property_for: String,
  let propQuery = null;
  if (propObj.property_type === "residential") {
    propQuery = ResidentialPropertyCustomer.findOne({ customer_id: propObj.customer_id }).lean().exec();
  } else {
    propQuery = CommercialPropertyCustomer.findOne({ customer_id: propObj.customer_id }).lean().exec();
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
  if (propObj.property_type === "residential") {
    propQuery = ResidentialProperty.findOne({ property_id: propObj.property_id }).exec();
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

const getUserDetails = (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));
  const mobileXX = obj.mobile;
  const idx = nanoid()
  const countryCode = obj.country_code;
  User.findOne({ mobile: obj.mobile })
    .then((result) => {
      if (result) {
        res.send(JSON.stringify(result));
        res.end();
        return;
      } else {
        const userObj = {
          id: idx,
          expo_token: '',
          user_type: "agent",
          works_for: [idx],
          name: null,
          country: obj.country,
          country_code: countryCode,
          mobile: obj.mobile,
          create_date_time: new Date(Date.now()),
          update_date_time: new Date(Date.now())
        };
        User.collection
          .insertOne(userObj)
          .then((result) => {
            console.log('1');

            USER_MOBILE_DICT[mobileXX] = 'y';
            res.send(JSON.stringify(userObj));
            res.end();
            return;

          })
          .catch((err) => {
            console.error(`getUserDetails# Failed to insert documents : ${err}`);
            res.send(JSON.stringify(null));
            res.end();
            return;
          });
      }
    })
    .catch((err) => {
      console.error(`getUserDetails# Failed to fetch documents : ${err}`);
      res.send(JSON.stringify(null));
      res.end();
      return;
    });
};



const getCustomerReminderList = (req, res) => {
  console.log(JSON.stringify(req.body));
  const customer_id = JSON.parse(JSON.stringify(req.body)).customer_id;
  console.log(customer_id);
  Reminder.find({ client_id: customer_id }, function (err, data) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("response datax22:  " + JSON.stringify(data));
      res.send(JSON.stringify(data));
      res.end();
      return;
    }
  }).sort({ property_id: -1 });
};


// {category_ids: { $in: [propertyId] } }
const getPropReminderList = (req, res) => {
  console.log(JSON.stringify(req.body));
  const propertyId = JSON.parse(JSON.stringify(req.body)).property_id;
  Reminder.find({ category_ids: { $in: [propertyId] } }, function (err, data) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("response datax1:  " + JSON.stringify(data));
      res.send(JSON.stringify(data));
      res.end();
      return;
    }
  }).sort({ property_id: -1 });
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
          works_for: [data.id], // self user_id
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
  const userId = nanoid();
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
    works_for: [userId],
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
        works_for: [userId] // self user_id
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
        const newUserId = nanoid();
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
          works_for: [employeeDetails.user_id],
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

const getReminderList = (req, res) => {
  console.log("getReminderList 1: ")
  const agentIdDict = JSON.parse(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));

  Reminder.find({ user_id: agentIdDict.agent_id }, function (err, data) {
    if (err) {
      console.log(err);
      return;
    } else {
      // console.log("response datax4:  " + JSON.stringify(data));
      res.send(JSON.stringify(data));
      res.end();
      return;
    }
  }).sort({ user_id: -1 });
};

const addNewReminder = (req, res) => {
  const reminderDetails = JSON.parse(JSON.stringify(req.body));
  const reminderId = nanoid();
  reminderDetails["reminder_id"] = reminderId;
  console.log("reminderDetails: " + JSON.stringify(reminderDetails));
  Reminder.collection.insertOne(reminderDetails, function (err, data) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify("fail"));
      res.end();
      return;
    } else {
      // console.log("addNewProperty" + JSON.stringify(data));
      if (reminderDetails.category_type === "Residential") {
        ResidentialProperty.updateOne(
          { category_id: reminderDetails.property_id },
          { $addToSet: { reminders: reminderId } },
          function (err, data) {
            if (err) {
              console.log(err);
              res.send(JSON.stringify("fail"));
              res.end();
              return;
            } else {
              console.log("reminderId: ", reminderId);
              res.send(JSON.stringify({ reminderId: reminderId }));
              res.end();
              return;
            }
          }
        );
      } else if (reminderDetails.category_type === "Commercial") {
        CommercialProperty.updateOne(
          { category_id: reminderDetails.property_id },
          { $addToSet: { reminders: reminderId } },
          function (err, data) {
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

const getCommercialCustomerListings = (req, res) => {
  const agentDetails = JSON.parse(JSON.stringify(req.body));
  const agent_id = agentDetails.agent_id;
  CommercialPropertyCustomer.find({ agent_id: agent_id }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(JSON.stringify(data));
    res.send(data);
    res.end();
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

const getResidentialCustomerList = (req, res) => {
  const agentDetails = JSON.parse(JSON.stringify(req.body));
  // console.log(JSON.stringify(req.body));
  const agent_id = agentDetails.agent_id;
  ResidentialPropertyCustomer.find({ agent_id: agent_id }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("ResidentialPropertyCustomer: ", JSON.stringify(data));
    res.send(data);
    res.end();
  });
};

const getCustomerListForMeeting = (req, res) => {
  const queryObj = JSON.parse(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));
  const agent_id = queryObj.agent_id;
  const property_type = queryObj.property_type;
  let property_for = queryObj.property_for;
  console.log("xxx", property_type);
  if (property_type === "Residential") {
    console.log("1", JSON.stringify(queryObj.property_type));
    if (property_for === "Sell") {
      property_for = "Buy";
      console.log(property_for);
    }
    ResidentialPropertyCustomer.find(
      {
        agent_id: agent_id,
        "customer_locality.property_type": property_type,
        "customer_locality.property_for": property_for
        // : {
        //   city: "Mumbai"
        //   // property_type: property_type,
        //   // property_for: property_for
        // }
      },
      (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(JSON.stringify(data));
        res.send(data);
        res.end();
      }
    );
  } else if (property_type === "Commercial") {
    console.log("3", property_type);
    if (property_for === "Sell") {
      property_for = "Buy";
    }
    CommercialPropertyCustomer.find(
      {
        agent_id: agent_id,
        "customer_locality.property_type": property_type,
        "customer_locality.property_for": property_for
      },
      (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(JSON.stringify(data));
        res.send(data);
        res.end();
      }
    );
  }
};

const getPropertyListingForMeeting = (req, res) => {
  const agentDetails = JSON.parse(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));
  const agent_id = agentDetails.agent_id;
  const property_type = agentDetails.property_type;
  let property_for = agentDetails.property_for;

  if (property_type === "Residential") {
    if (property_for === "Buy") {
      property_for = "Sell";
    }
    ResidentialProperty.find(
      {
        agent_id: agent_id,
        property_type: property_type,
        property_for: property_for
      },
      (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        // console.log(JSON.stringify(data));
        res.send(data);
        res.end();
      }
    );
  } else if (property_type === "Commercial") {
    if (property_for === "Buy") {
      property_for = "Sell";
    }
    CommercialProperty.find(
      {
        agent_id: agent_id,
        property_type: property_type,
        property_for: property_for
      },
      (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        // console.log(JSON.stringify(data));
        res.send(data);
        res.end();
      }
    );
  }
};

const getResidentialPropertyListings = (req, res) => {
  const agentDetails = JSON.parse(JSON.stringify(req.body));
  // console.log(JSON.stringify(req.body));
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
  const propertyId = nanoid();
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
    } else if (propertyDetails.property_for === "Sell") {
      propertyDetailsDict["sell_details"] = {
        expected_sell_price: propertyDetails.sell_details.expected_sell_price,
        maintenance_charge: propertyDetails.sell_details.maintenance_charge,
        available_from: propertyDetails.sell_details.available_from,
        negotiable: propertyDetails.sell_details.negotiable
      };
    }
  }

  CommercialProperty.collection.insertOne(propertyDetailsDict, function (
    err,
    data
  ) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify(null));
      res.end();
      return;
    } else {
      // console.log("addNewProperty" + JSON.stringify(data));
      res.send(JSON.stringify(propertyDetailsDict));
      res.end();
      return;
    }
  });
};

const addNewResidentialRentProperty = (req, res) => {

  const obj = JSON.parse(JSON.stringify(req.body));
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
  const propertyId = nanoid();

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
    } else if (propertyDetails.property_for === "Sell") {
      propertyDetailsDict["sell_details"] = {
        expected_sell_price: propertyDetails.sell_details.expected_sell_price,
        maintenance_charge: propertyDetails.sell_details.maintenance_charge,
        available_from: propertyDetails.sell_details.available_from,
        negotiable: propertyDetails.sell_details.negotiable
      };
    }
  }

  ResidentialProperty.collection.insertOne(propertyDetailsDict, function (
    err,
    data
  ) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify(null));
      res.end();
      return;
    } else {
      // console.log("addNewProperty" + JSON.stringify(data));
      res.send(JSON.stringify(propertyDetailsDict));
      res.end();
      return;
    }
  });
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

const getTotalListingSummaryX = (req, res) => {
  console.log("Prop details1: " + JSON.stringify(req.body));
  const agentObj = JSON.parse(JSON.stringify(req.body));

  Promise.all([
    ResidentialProperty.aggregate([
      { $match: { agent_id: agentObj.agent_id } },
      { $group: { _id: "$property_for", count: { $sum: 1 } } }
    ]).exec(),
    CommercialProperty.aggregate([
      { $match: { agent_id: agentObj.agent_id } },
      { $group: { _id: "$property_for", count: { $sum: 1 } } }
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

const addNewResidentialCustomer = (req, res) => {
  console.log("Prop details1: " + JSON.stringify(req.body));
  const customerDetails = JSON.parse(JSON.stringify(req.body));
  // console.log("Prop details2: " + propertyDetails);
  const customerId = nanoid();

  const customerDetailsDict = {
    customer_id: customerId,
    agent_id: customerDetails.agent_id,

    customer_details: {
      name: customerDetails.customer_details.name,
      mobile1: customerDetails.customer_details.mobile1,
      mobile2: customerDetails.customer_details.mobile2,
      address: customerDetails.customer_details.address
    },
    customer_locality: {
      city: customerDetails.customer_locality.city,
      location_area: customerDetails.customer_locality.location_area,
      property_type: customerDetails.customer_locality.property_type,
      property_for: customerDetails.customer_locality.property_for,
      pin: customerDetails.customer_locality.pin
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
        preferred_tenants:
          customerDetails.customer_rent_details.preferred_tenants,
        non_veg_allowed: customerDetails.customer_rent_details.non_veg_allowed
      };
    } else if (customerDetails.customer_locality.property_for === "Buy") {
      customerDetailsDict["customer_buy_details"] = {
        expected_buy_price:
          customerDetails.customer_buy_details.expected_buy_price,
        available_from: customerDetails.customer_buy_details.available_from,
        negotiable: customerDetails.customer_buy_details.negotiable
      };
    }
  }

  ResidentialPropertyCustomer.collection.insertOne(
    customerDetailsDict,
    function (err, data) {
      if (err) {
        console.log(err);
        res.send(JSON.stringify(null));
        res.end();
        return;
      } else {
        // console.log("addNewProperty" + JSON.stringify(data));
        res.send(JSON.stringify(customerDetailsDict));
        res.end();
        return;
      }
    }
  );
};

const addNewCommercialCustomer = (req, res) => {
  console.log("Prop details1: " + JSON.stringify(req.body));
  const customerDetails = JSON.parse(JSON.stringify(req.body));
  // console.log("Prop details2: " + propertyDetails);
  const customerId = nanoid();

  const customerDetailsDict = {
    customer_id: customerId,
    agent_id: customerDetails.agent_id,

    customer_details: {
      name: customerDetails.customer_details.name,
      mobile1: customerDetails.customer_details.mobile1,
      mobile2: customerDetails.customer_details.mobile2,
      address: customerDetails.customer_details.address
    },
    customer_locality: {
      city: customerDetails.customer_locality.city,
      location_area: customerDetails.customer_locality.location_area,
      property_type: customerDetails.customer_locality.property_type,
      property_for: customerDetails.customer_locality.property_for,
      pin: customerDetails.customer_locality.pin
    },

    customer_property_details: {
      building_type: customerDetails.customer_property_details.building_type,
      parking_type: customerDetails.customer_property_details.parking_type,
      property_used_for:
        customerDetails.customer_property_details.property_used_for
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
    } else if (customerDetails.customer_locality.property_for === "Buy") {
      customerDetailsDict["customer_buy_details"] = {
        expected_buy_price:
          customerDetails.customer_buy_details.expected_buy_price,
        available_from: customerDetails.customer_buy_details.available_from,
        negotiable: customerDetails.customer_buy_details.negotiable
      };
    }
  }

  CommercialPropertyCustomer.collection.insertOne(customerDetailsDict, function (
    err,
    data
  ) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify(null));
      res.end();
      return;
    } else {
      // console.log("addNewProperty" + JSON.stringify(data));
      res.send(JSON.stringify(customerDetailsDict));
      res.end();
      return;
    }
  });
};

const getCustomerAndMeetingDetails = (req, res) => {
  console.log("getCustomerAndMeetingDetails: " + JSON.stringify(req.body));
  const queryObj = JSON.parse(JSON.stringify(req.body));
  // client_id: reminderObj.client_id,
  //   category_ids: reminderObj.category_ids,
  //     category: reminderObj.category,
  //       category_type: reminderObj.category_type,
  //         category_for: reminderObj.category_for

  // Agent.find({ agent_id: { $in: agentIdsArray } }, function(err, data) {

  if (queryObj.category_type === "Residential") {
    Promise.all([
      ResidentialProperty.find({
        property_id: { $in: queryObj.category_ids }
      }).exec(),
      ResidentialPropertyCustomer.findOne({
        customer_id: queryObj.client_id
      }).exec()
    ]).then(results => {
      const propertyDetail = results[0];
      const customerDetails = results[1];
      console.log("propertyDetail:  ", JSON.stringify(propertyDetail));
      console.log("customerDetails:  ", JSON.stringify(customerDetails));
      const resObj = {
        property_details: propertyDetail,
        customer_details: customerDetails
      };
      res.send(resObj);
      res.end();
      return;
    });
  } else if (queryObj.category_type === "Commercial") {
    Promise.all([
      CommercialProperty.find({
        property_id: { $in: queryObj.category_ids }
      }).exec(),
      CommercialPropertyCustomer.findOne({
        customer_id: queryObj.client_id
      }).exec()
    ]).then(results => {
      const propertyDetail = results[0];
      const customerDetails = results[1];
      console.log("propertyDetail:  ", JSON.stringify(propertyDetail));
      console.log("customerDetails:  ", JSON.stringify(customerDetails));
      const resObj = {
        property_details: propertyDetail,
        customer_details: customerDetails
      };
      res.send(resObj);
      res.end();
      return;
    });
  }
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
  const messageId = nanoid();
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