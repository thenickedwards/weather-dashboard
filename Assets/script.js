// GET WEATHER https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// GET LAT & LON http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
console.log("Hello World!");

// Variables for current weather elements
var currentCity = document.querySelector('#current-city');
var today = moment().format('l');
var currentIcon = document.querySelector('#current-icon');
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

var apiKey = 'cbde0d8d9d4e39b8534085ba8c5c2490';
var weatherIconUrl = `http://openweathermap.org/img/wn/`

var citySearchForm = document.querySelector('#searchform')
var searchedCity = "Seattle";

// API request to fetch for geo data, i.e. latitude & longitude
function getLatLon() {
    var urlLatLon = `http://api.openweathermap.org/geo/1.0/direct?q=${searchedCity}&limit=5&appid=${apiKey}`;
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
    console.log("This console log is from the displayWeather function");
    console.log(`Current weather is temp: ${temperature}, wind: ${wind}, humidity: ${humidity}, UV index: ${uvIndex}`);
    // Render current weather
    currentCity.textContent = `${searchedCity} (${today})`;
    currentIcon.setAttribute('src', weatherIconUrl + weatherIcon + '@2x.png')
    currentTemp.textContent = `Temp: ${temperature}° F`;
    currentWind.textContent = `Wind: ${wind} MPH`;
    currentHumid.textContent = `Humidity: ${humidity}%`;
    currentUV.textContent = `UV Index: ${uvIndex}`;
    
    // Render forecast
    for (i = 0; i < 5; i++) {
        var forecastCardEl = document.createElement("div");
        forecastCardEl.innerHTML = forecastCard;
        document.querySelector('#forecast-cards').appendChild(forecastCardEl);
        document.querySelectorAll('.fore-date')[i].textContent = moment().add(i+1, 'd').format('l');
        document.querySelectorAll('.fore-symbol')[i].setAttribute('src', `${weatherIconUrl}${dailyForecast[i].weather[0].icon}.png`);
        document.querySelectorAll('.fore-temp')[i].textContent = `Temp: ${dailyForecast[i].temp.day}° F`;
        document.querySelectorAll('.fore-wind')[i].textContent = `Wind: ${dailyForecast[i].wind_speed} MPH`;
        document.querySelectorAll('.fore-humid')[i].textContent = `Humidity: ${dailyForecast[i].humidity}%`;
    }
}

// User searches city
// add eventlistenr to button, grab valuye, set searchedCity value
// Creates/appends button
// Adds value to local storage array
// value from button passes to getWeather function

citySearchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    forecast = document.getElementById('forecast-cards');
    forecast.innerHTML = "";
    searchedCity = document.getElementById('city-searchbar').value;
    console.log("searchedCity from button click is " + searchedCity);
    getLatLon(searchedCity);
}

);


// city is Seattle
// latitude is 47.6062
// longitude is -122.3321
