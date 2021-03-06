const expect    = require('chai').expect;
const WeatherDarksky = require("../../lib/weather-darksky");
const nock = require('nock');

const fixtures = require('../fixtures/dummy-json');
const fixturesDarksky = fixtures["darksky"];
const fixturesGeocoder = fixtures["geocoder"];

var status = 'OK';

describe('Weather Darksky class test with mocking API', function() {
  beforeEach(function(){
    nock('https://api.darksky.net')
    .get(function() {
      return true;
    })
    .reply(200, fixturesDarksky);

    nock('https://maps.googleapis.com')
    .get(function(url) {
        var location = escape("this location is not available");
        var regex = new RegExp(location);
        if (regex.test(url)) {
            status = "Error";
        }else {
            status = 'OK';
        }
      return true;
    })
    .reply(200, function () {
        return { results: fixturesGeocoder, status: status };
    });
  });

  afterEach(function(){
    nock.cleanAll();
  });

  it('fetchWeatherByLocation for a location fetch weather with mocking', function(done){
    var weather = new WeatherDarksky,
      options = {
        location: "goa"
      };

    weather.fetchWeatherByLocation(options, function(){
      var locationWeather = JSON.parse(this);
      expect(locationWeather.currently).to.be.deep.equal(fixturesDarksky.currently);
      done();
    });
  });

  it('fetchWeatherForCurrentDay for a location fetch current day weather', function(done){
    var weather = new WeatherDarksky,
      options = {
        location: "goa"
      };

    weather.fetchWeatherForCurrentDay(options, function(){
      var locationWeather = JSON.parse(this);
      expect(locationWeather.daily.data).to.deep.equal(fixturesDarksky.daily.data);
      done();
    });
  });

  it('fetchWeatherByDay for a weekday coming in next 7 days with mocking', function(done){
    var weather = new WeatherDarksky,
      options = {
        location: "goa",
        weekday: "saturday"
      };

    weather.fetchWeatherByDay(options, function(){
      var locationWeather = JSON.parse(this);
      expect(locationWeather.daily.data).to.be.deep.equal(fixturesDarksky.daily.data);
      done();
    });
  });

  it('fetchWeatherByLocation should return error with invalid location with mocking', function(done){
    var weather = new WeatherDarksky,
      options = {
        location: "this location is not available"
      };

    weather.fetchWeatherByLocation(options, function(){
      expect(this.error).to.be.equal(true);
      expect(this.message).to.be.equal("Could not find the location from geocoder");
      done();
    });
  });

  it('fetchWeatherByDay should return error with invalid weekday with mocking', function(done){
    var weather = new WeatherDarksky,
      options = {
        location: "goa",
        weekday: "saturdayNotAvailable"
      };

    weather.fetchWeatherByDay(options, function(){
        expect(this.error).to.be.equal(true);
        expect(this.message).to.be.equal("Invalid request");
        done();
    });
  });

})