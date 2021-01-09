/* api.openweathermap.org/data/2.5/weather?q={city name}&appid-{your api key} */

const weatherApi = {
  key: "f1a425bc5e87d67911cfb228851d6ba7",
  baseUrl: "https://api.openweathermap.org/data/2.5/weather",
};

const searchInputBox = document.getElementById("zip");
const Textareabox = document.getElementById("feelings");
const generatebutton = document.getElementById("generate");
generatebutton.addEventListener("click", generate);
function generate() {
  getWeatherReport(searchInputBox.value);
  document.querySelector(".weather-body").style.display = "block";
}

// Get Weather Report
async function getWeatherReport(zip) {
  const rawData = await fetch(
    `${weatherApi.baseUrl}?q=${zip}&appid=${weatherApi.key}&units=metric`
  );
  const formattedData = await rawData.json();
  await fetch("http://localhost:4500/weather-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      temperature: formattedData.main.temp,
      date: formattedData.dt,
      userResponse: Textareabox.value,
    }),
  });
  const ProjectDataRaw = await fetch("http://localhost:4500/weather-data");
  const ProjectDataFormatted = await ProjectDataRaw.json();
  console.log(ProjectDataFormatted);
  showWeatherReport(ProjectDataFormatted);
}

//Show Weather Report
function showWeatherReport(weather) {
  let temperature = document.getElementById("temp");
  temperature.innerHTML = `${((9 / 5) * weather.temperature + 32).toFixed(
    2
  )}&deg;F`;

  let date = document.getElementById("date");
  var todayDate = new Date(weather.date * 1000);

  date.innerText = dateManage(todayDate);
  let content = document.getElementById("content");
  content.innerText = "USER RESPONSE: " + weather.userResponse;
}

//Date Manage
function dateManage(dateArg) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "Januray",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let year = dateArg.getFullYear();
  let month = months[dateArg.getMonth()];
  let date = dateArg.getDate();
  let day = days[dateArg.getDay()];

  return `${date} ${month} (${day}), ${year}`;
}
