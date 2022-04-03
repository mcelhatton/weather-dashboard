// openweathermap.org/ apiKey -  see site for api documentation
const apiKey = 'c3cbe84d45eaa63cacdc46b1a5933fb1';

// loads current date into html
var timeNow = moment().format('MMMM Do YYYY');
$('#date').replaceWith(timeNow);

// HTML variables
var city = '';
var tempEl = $('#temp');
var windEl = $('#wind');
var humidityEl = $('#humidity');
var uvEl = $('#uv');
var searchCity = $('#citySearch').val();

var cityFormEl = document.querySelector('#cityForm');
var cityInputEl = document.querySelector('#city');
var citySearchDisplayEl = document.querySelector('#citySearch');

$('#curentWeatherDiv').hide();
$('#5dayForecastDiv').hide();

// sumit button handler code
var formSubmitHandler = function(event) {
  event.preventDefault();
  city = cityInputEl.value.trim();
  $('#curentWeatherDiv').show();
  $('#5dayForecastDiv').show();
  
  if (city) {
    getCityLatLong(city);
    //$('#citySearch').replaceWith(city);
    localStorage.setItem('city', city);
    $(`#searchDiv`).append(`<div><button id="${city}" onclick="getID(this)" class="btn searchInput">${city}</button></div>`);
    cityInputEl.value = '';
  } else {
    alert('Please enter a city');
  }
}

// takes users city input and calls to get the cities lat and long then calls getWeatherData function
var getCityLatLong = function(city) {
  
  var getGeoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city},USA&limit=1&appid=${apiKey}`;
  console.log(getGeoURL);

  fetch(getGeoURL).then(function(response) {
    response.json().then(function(data) {
      var lat = data[0].lat;
      var long = data[0].lon;
      console.log(data);
      console.log(lat, long);
      getWeatherData(lat, long);
    });
  });
  
}

// openweathermap api call to get weather data gets lat and long from getCityLatLong function
var getWeatherData = function(lat, long) {
  var getWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;

  fetch(getWeatherURL).then(function(response) {
    response.json().then(function(data) {
      console.log(data);
      loadWeatherData(data);
    });
  });
  console.log(getWeatherURL);
}

// get weather data into the UI
function loadWeatherData(data) {

  var weatherIconID = data.current.weather[0].icon;
  var currentWeatherIconUrl = `http://openweathermap.org/img/wn/${weatherIconID}@2x.png`;
  var uvIndex = data.current.uvi;

  temp.textContent = '';
  windEl.textContent = '';
  humidityEl.textContent = '';
  uvEl.textContent = '';

  //$('#citySearch').attr('textContent', city);
  citySearchDisplayEl.textContent = city;
  $('#currentIcon').attr('src', currentWeatherIconUrl);
  temp.textContent = data.current.temp
  wind.textContent = data.current.wind_speed;
  humidity.textContent = data.current.humidity;
  uv.textContent = data.current.uvi;

  // color codes the UV index
  if (uvIndex < 3) {
    $('#uv').css({'background-color': '#6DD400', 'color': 'black'});
  } else if (uvIndex < 6) {
    $('#uv').css({'background-color': '#F3FF00', 'color': 'black'});
  } else if (uvIndex < 8) {
    $('#uv').css({'background-color': '#F7B500', 'color': 'black'});
  } else {
    $('#uv').css({'background-color': '#E02020', 'color': 'black'});
  }

  // clears out weather data
  for (var i = 1; i < 6; i++) {
    $(`#list${i}`).children('li').remove();
  }

  // load data into cards 5 day forecast
  for (var i = 1; i < 6; i++) {

    var temp5day = data.daily[i].temp.day;
    var wind5day = data.daily[i].wind_speed;
    var humidity5day = data.daily[i].humidity;
    var uv5day = data.daily[i].uvi;
    var forecastDate = moment().add(i, 'day').format('MMMM Do');
    var weatherIconID5day = data.daily[i].weather[0].icon;
    var weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIconID5day}@2x.png`;

    $(`#card${i}Image`).attr('src', weatherIconUrl);
    $(`#header${i}`).replaceWith(forecastDate);
    $(`#list${i}`).append(`<li>High Temp: ${temp5day}</li>`);
    $(`#list${i}`).append(`<li>Wind Speed: ${wind5day}</li>`);
    $(`#list${i}`).append(`<li>Humidity: ${humidity5day}</li>`);
    $(`#list${i}`).addClass("badge badge-primary badge-pill").append(`<li>UV Index: ${uv5day}</li>`);
    
  }
 
}

cityFormEl.addEventListener('submit', formSubmitHandler);

// loads historical search items 
function getID(btn) {
  var pastCity = btn.id;
  city = pastCity;
  citySearchDisplayEl.textContent = pastCity;
  getCityLatLong(city);
}

