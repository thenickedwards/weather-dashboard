// GET WEATHER https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// GET LAT & LON http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
console.log("Hello World!");

// Variables for current weather elements
var currentCity = document.querySelector('#current-city');
var currentTemp = document.querySelector('#current-temp');
var currentWind = document.querySelector('#current-wind');
var currentHumid = document.querySelector('#current-humid');
var currentUV = document.querySelector('#current-uv');

var apiKey = 'cbde0d8d9d4e39b8534085ba8c5c2490';

var latitude = "";
var longitude = "";

// API request to fetch for geo data, i.e. latitude & longitude
function getLatLon() {
    var urlLatLon = 'http://api.openweathermap.org/geo/1.0/direct?q=Seattle&limit=5&appid=' + apiKey;

    fetch(urlLatLon)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("data from getLatLon is:");
            console.log(data);
            latitude = data[0].lat;
            longitude = data[0].lon;
            console.log("latitude is " + latitude);
            console.log("longitude is " + longitude);
        })
        getWeather();
}

getLatLon();

// API request to bring latitude & longitude into fetch for weather
function getWeather() {
    var urlWeather = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey;

    fetch(urlWeather)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("data from getWeather is:");
            console.log(data);
        })
    // displayWeather();
}

// Render fetched weather data to page
// function displayWeather() {
//     console.log("This console log is from the displayWeather function");
//     console.log(data);
// }



// city is Seattle
// latitude is 47.6062
// longitude is -122.3321
