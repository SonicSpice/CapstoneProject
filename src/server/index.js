const dotenv = require("dotenv");
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("dist"));

app.get("/", function (req, res) {
  res.sendFile(path.resolve("dist/index.html"));
});

// designates what port the app will listen to for incoming requests
app.listen(process.env.SERVER_PORT, function () {
  console.log(
    `Shawn's Travel App server is listening on port ${process.env.SERVER_PORT}!`
  );
});

app.post("/trip-info-lookup", getTripInfo);
async function getTripInfo(request, response) {
  try {
    // 1. get coordinate data for user request from geonames
    const geonames_raw = await fetch(
      `${process.env.GEONAMES_API_URL}?q=${request.body.city}&maxRows=1&username=${process.env.GEONAMES_USERID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const geonames_results = await geonames_raw.json();
    const { geonames } = geonames_results;
    const main_result = geonames[0];
    const { countryName, lat, lng, toponymName } = main_result;

    // 2. get weather data by coordinate data from weatherbit

    // 3. get picture for user reqeust from pixabay.
    const pixabay_raw = await fetch(
      `${process.env.PIXABAY_API_URL}?q=${toponymName}&image_type=photo&editors_choice=true&key=${process.env.PIXABAY_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const pixabay_results = await pixabay_raw.json();
    const { hits } = pixabay_results;
    const primary_pixabay_hit = hits[0];

    // 4. send custom response object back to user.
    const custom_response_object = {
      toponymName,
      countryName,
      // forecast,
      cityImageURL: primary_pixabay_hit.webformatURL,
    };

    response.send(custom_response_object);
  } catch (error) {
    response.send({ msg: "server error", error });
  }
}

// Geonames Api
// https://www.geonames.org/export/JSON-webservices.html#citiesJSON

// Pixabay API
// https://pixabay.com/api/docs/#api_search_images
