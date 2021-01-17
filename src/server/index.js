const dotenv = require("dotenv");
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const moment = require("moment");

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
    // - first get departure date to determine which weatherbit endpoint to query.
    const departureDate = request.body.departure;

    // - to determine which endpoint from weatherbit to use, use moment to see if departure date is within a week.
    const today = moment();
    const weekFromToday = moment().add(1, "w"); // moment objects are mutable! use new moment objects when manipulating dates.
    const isDepartureWithinWeek = moment(departureDate).isBetween(
      today,
      weekFromToday
    );
    const countdownToDeparture = moment(departureDate).diff(today, "days");

    // if TRUE, call weatherbit/current, else call weatherbit/forecast
    let weatherbit_results = null;
    let tripWeather = {};

    if (isDepartureWithinWeek) {
      // get current weather
      const weatherbit_raw = await fetch(
        `http://api.weatherbit.io/v2.0/current?key=${process.env.WEATHERBIT_IO_API_KEY}&lat=${lat}&lon=${lng}&units=I`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      weatherbit_results = await weatherbit_raw.json();
      tripWeather = {
        weatherbit_type: "current",
        temp: weatherbit_results.data[0].temp,
        desc: weatherbit_results.data[0].weather.description,
        countdownToDeparture,
      };
    } else {
      // get forecast weather.
      const weatherbit_raw = await fetch(
        `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_IO_API_KEY}&lat=${lat}&lon=${lng}&days=1&units=I`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      weatherbit_results = await weatherbit_raw.json();
      tripWeather = {
        weatherbit_type: "forecast",
        high: weatherbit_results.data[0].high_temp,
        low: weatherbit_results.data[0].low_temp,
        desc: weatherbit_results.data[0].weather.description,
        countdownToDeparture,
      };
    }

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
    const { totalHits, hits: cityHits } = pixabay_results;
    let pixabay_image_result = null;

    // EXTENDED PROJECT: If no images come back on pixabay query for "city" user search, redo query on countryName from geonames lookup.
    // TEST CASE: Oymyakon, Russia. (remote city in Russia Siberia)
    if (totalHits === 0) {
      try {
        const pixabay_raw_countryName = await fetch(
          `${process.env.PIXABAY_API_URL}?q=${countryName}&image_type=photo&editors_choice=true&key=${process.env.PIXABAY_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const pixabay_results_countryName = await pixabay_raw_countryName.json();
        const { hits: countryHits } = pixabay_results_countryName;
        pixabay_image_result = countryHits[1];
      } catch (error) {
        // response.send({ msg: "error on pixabay get" });
      }
    } else {
      pixabay_image_result = cityHits[0];
    }

    // 4. send custom response object back to user.
    const custom_response_object = {
      toponymName,
      countryName,
      tripImage: pixabay_image_result.webformatURL,
      tripWeather,
    };

    response.send(custom_response_object);
  } catch (err) {
    console.log("err", err);
    response.send({ msg: "server error", err });
  }
}

// Geonames Api
// https://www.geonames.org/export/JSON-webservices.html#citiesJSON

// Weatherbit.io Api
// Current Weather
// http://api.weatherbit.io/v2.0/current

//Weatherbit.io Api
//Forecast Weather
//http://api.weatherbit.io/v2.0/forecast/daily

// Pixabay API
// https://pixabay.com/api/docs/#api_search_images
