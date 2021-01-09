projectData = {};

const express = require("express");
const app = express();

const bodyPraser = require("body-parser");
app.use(bodyPraser.urlencoded({ extended: false }));
app.use(bodyPraser.json());

const cors = require("cors");

app.use(cors());

app.use(express.static("website"));

const port = 4500;

const server = app.listen(port, listening);

function listening() {
  console.log("server is running!");
  console.log(`running on localhost:${port}`);
}

// GET route
app.get("/weather-data", sendData);
function sendData(request, response) {
  console.log("function");
  response.send(projectData);
}

//POST route
app.post("/weather-data", updateData);
function updateData(request, response) {
  projectData = request.body;
  response.send(projectData);
}
