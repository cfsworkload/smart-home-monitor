var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, callback) {
  
  res.render('index', { title: 'Express' });
  var mqtt = require('mqtt');
  var mqttClient = mqtt.connect('mqtt://test.mosquitto.org');
  mqttClient.on('connect', function () {
  mqttClient.publish('wesley-test-999', '{ "temp" : 99, "humidity" : 99, "DeviceID" : "insurance-01", "LocLat" : 37.3382, "LocLong" : -121.8863, "PolicyID" : 6134141 }', function () { console.log("We returned from callback"); });
  });
  callback;

});

module.exports = router;
