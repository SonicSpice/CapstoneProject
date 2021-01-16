import { spinner_OFF, spinner_ON } from "./handleSpinner";
import { triggerAlert } from "./handleAlert";

const form = document.getElementById("form");
const alert = document.getElementById("alert");
const spinner = document.getElementById("submit-spinner");
const button = document.getElementById("submit-btn");
const city = document.getElementById("city-input");
const departure = document.getElementById("departure-input");

form.addEventListener("submit", onFormSubmit);
function onFormSubmit(event) {
  event.preventDefault();
  handleSubmit(city.value, departure.value);
}

function handleSubmit(cityValue, departureValue) {
  spinner_ON(spinner, button);

  if (true) {
    var requestOptions = {
      method: "POST",
      body: JSON.stringify({
        city: cityValue,
        departure: departureValue,
        currentDate: new Date(),
      }),
      headers: { "Content-Type": "application/json" },
    };

    fetch("http://localhost:5500/trip-info-lookup", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        spinner_OFF(spinner, button);
        const results_card = document.getElementById("results-card");
        results_card.style.display = "flex";

        const tripImage = document.getElementById("trip-image");
        tripImage.setAttribute("src", result.tripImage);

        const destination = document.getElementById("destination");
        destination.innerHTML = `${result.toponymName}, ${result.countryName}`;

        const departing = document.getElementById("departing");
        departing.innerHTML = departureValue;

        const countdown = document.getElementById("countdown");
        countdown.innerHTML =
          "Trip is " + result.tripWeather.countdownToDeparture + " days away.";

        const temps = document.getElementById("weather-temps");
        if (result.tripWeather.weatherbit_type === "current") {
          temps.innerHTML = `Temp: ${result.tripWeather.temp}&#8457`;
        } else {
          temps.innerHTML = `High: ${result.tripWeather.high}&#8457, Low: ${result.tripWeather.low}&#8457`;
        }

        const desc = document.getElementById("weather-desc");
        desc.innerHTML = result.tripWeather.desc;
      })
      .catch((error) => {
        console.log("error", error);
      });
  } else {
    // set an error alert when URL is not valid.
    triggerAlert(
      alert,
      `ERROR: Invalid URL! Valid URLs begin with "http://" or "https://"`
    );
    spinner_OFF(spinner, button);
  }
}

export { handleSubmit, onFormSubmit };
