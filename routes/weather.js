var express = require('express');
var router = express.Router();

var Weather = require('../lib/weather');
var WeatherDarksky = require('../lib/weather-darksky');

/* GET weather information by location. */
router.get('/:location/', function(req, res, next) {
  var weather = new Weather({ client: WeatherDarksky }),
    location = req.params.location,
    locationWeather;

  weather.fetchWeatherByLocation({ location: location }, function(){
    if(this.error){
      return next(this);
    }else{
      locationWeather = JSON.parse(this);
      res.format({
        html: function(){
          res.render('weather/location', {
            locaitonWeather: locationWeather.currently,
            location: location
          });
        },
        json: function(){
          // rendering everything we got from API
          res.send(locationWeather);
        }
      });
    }
  });

});

/* GET weather information for current day. */
router.get('/:location/today/', function(req, res, next) {
  var weather = new Weather({ client: WeatherDarksky }),
    location = req.params.location,
    locationWeather;

  weather.fetchWeatherForCurrentDay({ location: location }, function(){
    if(this.error){
      return next(this);
    }else{
      locationWeather = JSON.parse(this);
      res.format({
        html: function(){
          // first daily data record is current date weather
          res.render('weather/today', {
            locaitonWeather: locationWeather.daily.data[0],
            location: location
          });
        },
        json: function(){
          // rendering everything we got from API
          res.send(locationWeather);
        }
      });
    }
  });

});

/* GET weather information for upto a weekday max for next 7 days. */
router.get('/:location/:weekday/', function(req, res, next) {
  var weather = new Weather({ client: WeatherDarksky }),
    location = req.params.location,
    weekday = req.params.weekday,
    locaitonWeatherData;

  weather.fetchWeatherByDay({
    location: location,
    weekday: weekday }, function(days){
    if(this.error){
      return next(this);
    }else{
      locaitonWeatherData = JSON.parse(this);
      res.format({
        html: function(){
          res.render('weather/weekday', {
            locaitonWeatherData: locaitonWeatherData.daily.data,
            days: days,
            location: location
          });
        },
        json: function(){
          // rendering everything we got from API
          res.send(locaitonWeatherData);
        }
      });
    }

  });

});

module.exports = router;
