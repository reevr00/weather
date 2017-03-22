process.env.NODE_ENV = 'test';
process.env.PORT = 8080;

var expect    = require('chai').expect;
var request = require('request');
var assert = require('assert');
// var app = require("../../app");
var WeatherDarksky = require("../../lib/weather-darksky");


describe('Weather Darksky class test', function() {

  it('fetchWeatherByLocation for a location fetch weather', function(done){
    var weather = new WeatherDarksky,
      options = {
        location: "goa"
      };

    weather.fetchWeatherByLocation(options, function(){
      locationWeather = JSON.parse(this);
      expect(locationWeather.currently).to.not.equal(undefined);
      done();
    });
  });

  it('fetchWeatherForCurrentDay for a location fetch current day weather', function(done){
    var weather = new WeatherDarksky,
      options = {
        location: "goa"
      };

    weather.fetchWeatherForCurrentDay(options, function(){
      locationWeather = JSON.parse(this);
      expect(locationWeather.daily.data).to.have.length(1);
      done();
    });
  });

  it('fetchWeatherByDay for a weekday comming in next 7 days', function(done){
    var weather = new WeatherDarksky,
      options = {
        location: "goa",
        weekday: "saturday"
      };

    weather.fetchWeatherByDay(options, function(){
      locationWeather = JSON.parse(this);
      expect(locationWeather.daily.data.length).to.be.greaterThan(1);
      done();
    });
  });

  it('fetchWeatherByLocation should return error with invalid location', function(done){
    var weather = new WeatherDarksky,
      options = {
        location: "this location is not avaialble"
      };

    weather.fetchWeatherByLocation(options, function(){
      expect(this.error).to.be.equal(true);
      done();
    });
  });

  it('fetchWeatherByDay should return error with invalid weekday', function(done){
    var weather = new WeatherDarksky,
      options = {
        location: "goa",
        weekday: "saturdayNotAvailable"
      };

    weather.fetchWeatherByDay(options, function(){
      expect(this.error).to.be.equal(true);
      done();
    });
  });

})