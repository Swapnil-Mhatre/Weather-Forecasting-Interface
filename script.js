const weatherBackground = document.querySelector(".weather-background");
const switchDegreeButton = document.querySelector("#switch-degree");
const locationInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search");
const weatherDataContainer = document.querySelector("#weather-data");
const forecastingPanelContainer = document.querySelector(
  ".forecasting-panel-dets",
);

const uiElements = {
  "Partially cloudy": ['<i class="ri-sun-cloudy-fill"></i>', "--rainy-weather"],
  "Rain, Partially cloudy": [
    '<i class="ri-rainy-fill"></i>',
    "--partially-cloud-weather",
  ],
  "Rain, Overcast": ['<i class="ri-rainy-fill"></i>', "--rainy-weather"],
  Clear: ['<i class="ri-sun-fill"></i>', "--clear-weather"],
  Overcast: ['<i class="ri-cloudy-fill"></i>', "--overcast-weather"],
  Rain: ['<i class="ri-rainy-fill"></i>', "--rainy-weather"],
};

let area = "London";
let degreeSymbol = "celsius";
let unitGroup = "metric";

function getWeatherData(area) {
  const API_KEY = "SLUXEEH3FU6VR7698Z4YU9ZKA";
  const BaseURL =
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

  return fetch(`${BaseURL}${area}?key=${API_KEY}&unitGroup=${unitGroup}`).then(
    (result) => result.json(),
  );
}

function displayLoadingScreen() {
  weatherDataContainer.innerHTML = `
  <p class="loading-screen">Loading Weather Info Please Wait...</p>
  `;
}

function displayWeatherData(data) {
  weatherDataContainer.innerHTML = "";
  let clutter = `
  <div class="weather-dets">
    <div class="top-left">
        <h2 class="temp">${data.currentConditions.temp}°</h2>
        <span>Feels like ${data.currentConditions.feelslike}°</span>
    </div>
    <div class="top-right">
            <div class="icon">${uiElements[data.currentConditions.conditions][0]}</div>
            <div class="info">
                <h3 class="weather-status">${data.currentConditions.conditions}</h3>
                <h2 class="place">${data.address}</h2>
                <p class="region">${data.timezone}</p>
            </div>
        </div>
    </div>
    <div class="other-dets">
        <div>
            <h4>Wind</h4>
            <span>${data.currentConditions.windspeed} ${unitGroup === "metric" ? "km/h" : "m/h"}</span>
        </div>
        <div>
            <h4>Humidity</h4>
            <span>${data.currentConditions.humidity}%</span>
        </div>
        <div>
            <h4>Pressure</h4>
            <span>${data.currentConditions.pressure} hPa</span>
        </div>
        <div>
            <h4>Uv Index</h4>
            <span>${data.currentConditions.uvindex}</span>
        </div>
    </div>
    `;
  weatherDataContainer.innerHTML = clutter;
  weatherBackground.style.background = `var(${uiElements[data.currentConditions.conditions][1]})`;
}

function displayForecastData(data) {
  forecastingPanelContainer.innerHTML = "";
  for (let i = 1; i <= 7; i++) {
    const monthName = getMonth(data[i].datetime.substring(5, 7));
    const date = data[i].datetime.substring(8, 10);

    let card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
    <div>
        <p>${monthName} ${date}</p>
        ${uiElements[data[i].conditions][0]}
    </div>
    <div class="day-temp">
        <span>${Math.floor(data[i].tempmax)}° / ${Math.floor(data[i].tempmin)}°</span> 
        <span>${data[i].conditions}</span>
    </div>
    `;
    forecastingPanelContainer.appendChild(card);
  }
}

function getMonth(month) {
  return new Date(2026, Number(month) - 1, 1).toLocaleString("default", {
    month: "long",
  });
}

function switchDegree() {
  const degreeSymbolObj = {
    celsius: '<i class="ri-celsius-fill"></i>',
    fahrenheit: '<i class="ri-fahrenheit-fill"></i>',
  };

  unitGroup = unitGroup === "metric" ? "us" : "metric";
  degreeSymbol = degreeSymbol === "celsius" ? "fahrenheit" : "celsius";
  switchDegreeButton.innerHTML = degreeSymbolObj[degreeSymbol];

  loadScreen(area);
}

function handleSearchInput() {
  let areaValue = locationInput.value;
  if (areaValue.trim() === "") return;
  loadScreen(areaValue);
  area = areaValue;
  locationInput.value = "";
}

async function loadScreen(locationName) {
  displayLoadingScreen();
  let weatherData = await getWeatherData(locationName);
  displayWeatherData(weatherData);
  displayForecastData(weatherData.days);
}

switchDegreeButton.addEventListener("click", switchDegree);
searchButton.addEventListener("click", handleSearchInput);
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearchInput();
});

loadScreen(area);
