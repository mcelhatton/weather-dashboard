const apiKey = 'c3cbe84d45eaa63cacdc46b1a5933fb1'

var cityFormEl = document.querySelector('#cityForm');
var cityInputEl = document.querySelector('#city');

var formSubmitHandler = function(event) {
  event.preventDefault();
  var city = cityInputEl.value.trim();
  console.log(city);

  if (city) {
    getCityLatLong(city);
    cityInputEl.value = '';
  } else {
    alert('Please enter a city');
  }
}

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

var getWeatherData = function(lat, long) {
  var getWeatherURL = `http://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${long}&cnt=5&appid=${apiKey}`;

  fetch(getWeatherURL).then(function(response) {
    response.json().then(function(data) {
      console.log(data);
    });
  });
  console.log(getWeatherURL);
}

cityFormEl.addEventListener('submit', formSubmitHandler);
