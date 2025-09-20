const apiKey = "409995aeeace71de38f3e09c3f909179"; // your working key

// Auto-load user location city
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showErrorLocation);
  } else {
    addCityBlock("Lahore");
  }
};

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWeatherByCoords(lat, lon);
}

function showErrorLocation(error) {
  console.warn("Location access denied or unavailable:", error.message);
  addCityBlock("Lahore"); // fallback
}

// Add city weather block
function addCityBlock(city) {
  const container = document.getElementById("cities-container");
  const blockId = "city-" + city.toLowerCase().replace(/\s/g, "");

  // prevent duplicate cards
  if (document.getElementById(blockId)) {
    showError(`Weather for ${city} is already shown.`);
    return;
  }

  // create new card
  const cityBlock = document.createElement("div");
  cityBlock.className = "city-block";
  cityBlock.id = blockId;
  cityBlock.innerHTML = `
    <div class="city-header">
      <h2>${city}</h2>
      <button class="remove-btn" onclick="removeCity('${blockId}')">X</button>
    </div>
    <div class="weather"></div>
    <h3>3-Day Forecast</h3>
    <div class="forecast"></div>
  `;
  container.appendChild(cityBlock);

  getWeather(city, blockId);
}

// Remove city card
function removeCity(blockId) {
  const block = document.getElementById(blockId);
  if (block) block.remove();
}

// Search handler
function searchWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return showError("Please enter a city name");
  addCityBlock(city);
  document.getElementById("cityInput").value = "";
}

// Fetch weather by city
async function getWeather(city, blockId) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      showError(data.message);
      document.getElementById(blockId).remove();
      return;
    }

    displayWeather(data, blockId);
    getForecast(city, blockId);

  } catch (err) {
    showError("Unable to fetch weather data");
  }
}

// Fetch weather by coords (auto-location)
async function getWeatherByCoords(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      showError(data.message);
      return;
    }

    addCityBlock(data.name);

  } catch (err) {
    showError("Unable to fetch weather data by location");
  }
}

// Display weather
function displayWeather(data, blockId) {
  const block = document.getElementById(blockId);
  const weatherDiv = block.querySelector(".weather");

  weatherDiv.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
    <p><strong>${data.main.temp}°C</strong> — ${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s</p>
  `;
}

// Fetch forecast
async function getForecast(city, blockId) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== "200") {
      showError(data.message);
      return;
    }

    displayForecast(data, blockId);

  } catch (err) {
    showError("Unable to fetch forecast data");
  }
}

// Display forecast
function displayForecast(data, blockId) {
  const block = document.getElementById(blockId);
  const forecastDiv = block.querySelector(".forecast");
  forecastDiv.innerHTML = "";

  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

  daily.forEach(day => {
    const date = new Date(day.dt_txt);
    forecastDiv.innerHTML += `
      <div class="forecast-day">
        <h4>${date.toLocaleDateString("en-US", { weekday: "short" })}</h4>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="">
        <p>${day.main.temp}°C</p>
        <p>${day.weather[0].main}</p>
      </div>
    `;
  });
}

function showError(msg) {
  document.getElementById("error").textContent = msg;
}
