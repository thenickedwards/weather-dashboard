// GET WEATHER https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// GET LAT & LON https://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// Seattle used as example for user
// Console logs may be toggled on/off for more info!

console.log("Hello World!");

// For local storage
cityArray = [];
var pastCities = JSON.parse(localStorage.getItem('cities'));

// Variables for current weather elements
var currentCity = document.querySelector('#current-city');
var today = moment().format('l');
var currentIcon = document.querySelector('#current-icon');
var weatherIconUrl = `https://openweathermap.org/img/wn/`
var currentTemp = document.querySelector('#current-temp');
var currentWind = document.querySelector('#current-wind');
var currentHumid = document.querySelector('#current-humid');
var currentUV = document.querySelector('#current-uv');

// Variables and template literal for forecast cards
var forecast = $('#forecast-cards')

var forecastCard = `
<div id="" class="card" style="width: 11rem;">
    <div id="" class="card-header fore-date">12/25/2021</div>
    <ul class="list-group list-group-flush">
        <li id="" class="list-group-item"><img id="" class="fore-symbol" src="" alt=""></li>
        <li id="" class="list-group-item fore-temp">Temp: </li>
        <li id="" class="list-group-item fore-wind">Wind: </li>
        <li id="" class="list-group-item fore-humid">Humidity: </li>
    </ul>
</div>`

// Variables for search elements 
var citySearchForm = document.querySelector('#searchform')
var searchHistory = document.querySelector('#search-history')

// Template literal for display previously searched cities from local storage
var prevCity = `<button type="button" class="btn btn-secondary m-5 col-12"></button>`;

// Example city & API key for fetch requests
var apiKey = 'cbde0d8d9d4e39b8534085ba8c5c2490';
var searchedCity = "Seattle";


// API request to fetch for geo data, i.e. latitude & longitude
function getLatLon() {
    var urlLatLon = `https://api.openweathermap.org/geo/1.0/direct?q=${searchedCity}&limit=5&appid=${apiKey}`;
    var latitude;
    var longitude;

    fetch(urlLatLon)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("data from getLatLon is:");
            console.log(data);
            latitude = data[0].lat;
            longitude = data[0].lon;
            // console.log("latitude is " + latitude);
            // console.log("longitude is " + longitude);
            searchedCity = data[0].name;
            getWeather(latitude, longitude);
        })
}

getLatLon();

// API request to bring latitude & longitude into fetch for weather
function getWeather(latitude, longitude) {
    // console.log("Within getWeather function latitude is " + latitude);
    // console.log("Within getWeather function longitude is " + longitude);

    var urlWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;

    fetch(urlWeather)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("data from getWeather is:");
            console.log(data);

            temperature = data.current.temp
            wind = data.current.wind_speed
            humidity = data.current.humidity
            uvIndex = data.current.uvi
            dailyForecast = data.daily
            weatherIcon = data.current.weather[0].icon

            console.log(`Current weather is temp: ${temperature}, wind: ${wind}, humidity: ${humidity}, UV index: ${uvIndex}`)

            displayWeather(temperature, wind, humidity, uvIndex, weatherIcon, dailyForecast);
        })
}

// Render fetched weather data to page
function displayWeather(temperature, wind, humidity, uvIndex, weatherIcon, dailyForecast) {
    // Render current weather
    currentCity.textContent = `${searchedCity} (${today})`;
    currentIcon.setAttribute('src', weatherIconUrl + weatherIcon + '@2x.png')
    currentTemp.textContent = `Temp: ${temperature}° F`;
    currentWind.textContent = `Wind: ${wind} MPH`;
    currentHumid.textContent = `Humidity: ${humidity}%`;
    currentUV.textContent = `UV Index: ${uvIndex}`;
    
    // Render forecast
    for (i = 0; i < 5; i++) {
        var forecastCardEl = document.createElement('div');
        forecastCardEl.innerHTML = forecastCard;
        document.querySelector('#forecast-cards').appendChild(forecastCardEl);
        document.querySelectorAll('.fore-date')[i].textContent = moment().add(i+1, 'd').format('l');
        document.querySelectorAll('.fore-symbol')[i].setAttribute('src', `${weatherIconUrl}${dailyForecast[i].weather[0].icon}.png`);
        document.querySelectorAll('.fore-temp')[i].textContent = `Temp: ${dailyForecast[i].temp.day}° F`;
        document.querySelectorAll('.fore-wind')[i].textContent = `Wind: ${dailyForecast[i].wind_speed} MPH`;
        document.querySelectorAll('.fore-humid')[i].textContent = `Humidity: ${dailyForecast[i].humidity}%`;
    }
}

// Search verfies input not blank, clears forecast cards before populating next set
citySearchForm.addEventListener('submit', function(event) {
    event.preventDefault();

    searchedCity = document.getElementById('city-searchbar').value.trim();
    if (searchedCity.length == 0) {return}
    else {
    forecast = document.getElementById('forecast-cards');
    forecast.innerHTML = "";

    cityArray.push(searchedCity);    
    localStorage.setItem('cities', JSON.stringify(cityArray));
    console.log("cityArray is " + cityArray);
    
    var prevCityEl = document.createElement('button');
    prevCityEl.innerHTML = prevCity;
    prevCityEl.textContent = searchedCity;
    prevCityEl.addEventListener ('click', searchFromHistory);

    document.querySelector('#search-history').appendChild(prevCityEl);

    getLatLon(searchedCity);
    }
});

// When buttons in search history are clicked, value from button passes to getWeather function
function searchFromHistory(event) {
    event.preventDefault();
    searchedCity = event.target.textContent;
    console.log("Button clicked for " + searchedCity)
    getLatLon(searchedCity);
};

// Display search history from local storage
function displaySearchHistory() {
    var pastCities = JSON.parse(localStorage.getItem('cities'));
    if (pastCities.length == 0) {return}
    else {
        console.log("pastCities include " + pastCities);
        console.log(pastCities);
        for (i = 0; i < pastCities.length; i++) {
            var prevCityEl = document.createElement('button');
        prevCityEl.innerHTML = prevCity;
        prevCityEl.textContent = pastCities[i];
        prevCityEl.addEventListener ('click', searchFromHistory);

        document.querySelector('#search-history').appendChild(prevCityEl);
        }
    }
};

displaySearchHistory();

