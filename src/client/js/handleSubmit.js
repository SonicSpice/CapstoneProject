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

  console.log("currentDate", new Date());

  if (true) {
    console.log("city", cityValue);
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
