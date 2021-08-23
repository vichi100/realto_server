const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();

app.use(
  fileUpload()
);


app.post("/residentialPropertyListings", (req, res) => {
  console.log("residentialPropertyListings");
  return res.send([]);
})

app.post("/addNewResidentialRentProperty", (req, res) => {
  console.log("a", JSON.parse(JSON.stringify(req.body)));
  const p = JSON.parse(JSON.stringify(req.body));
  const s = JSON.parse(p.propertyFinalDetails)
  console.log(s.agent_id)
  if (!req.files) {
    console.log("no file");
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.vichi;
  console.log(file);
  console.log('__dirname: ', __dirname);
  const path = __dirname + "/files/" + file.name + ".jpeg";

  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    console.log("success");
    return res.send({ status: "success", path: path });
  });
});

var server = app.listen(7000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Server Started " + port + "/");
});