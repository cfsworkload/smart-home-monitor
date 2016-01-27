var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var www = require('./bin/www');

var routes = require('./routes/index');
var users = require('./routes/users');
var iotf = require("ibmiotf");
var app = express();
var services = JSON.parse(process.env.VCAP_SERVICES); 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  next();
});
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

function hostnameFromReq(req) {
    if (req.headers.host === 'localhost:3000') {
        return String(req.protocol) + "://" + req.headers.host;
    } else {
        return 'http://' + req.headers.host;
    }
}

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var appClientConfig = {
  "org": services['iotf-service'][0]['credentials'].org,
  "id": services['iotf-service'][0]['credentials'].iotCredentialsIdentifier,
  "auth-key": services['iotf-service'][0]['credentials'].apiKey,
  "auth-token": services['iotf-service'][0]['credentials'].apiToken
};

var appClient = new iotf.IotfApplication(appClientConfig);

//setting the log level to trace. By default its 'warn'
appClient.log.setLevel('info');

var type = "sensor";
var deviceId = "insurance-01"
var authToken = "password"
var metadata = {"DeviceID": "insurance-01", "PolicyID": "6134141"}
var deviceInfo = {"serialNumber": "001", "manufacturer": "Blueberry", "model": "e2", "deviceClass": "A", "fwVersion" : "1.0.1", "hwVersion" : "12.01"}
var location = {"longitude" : "12.78", "latitude" : "45.90", "elevation" : "2000", "accuracy" : "0", "measuredDateTime" : "2015-10-28T08:45:11.662Z"}

appClient.registerDevice(type, deviceId, authToken, deviceInfo, location, metadata).then (function onSuccess (response) {
            console.log("Success");
            console.log(response);
			
			
}, function onError (error) {

            console.log("Fail");
            console.log(error);
});
    
var config = {
    	"org" : "1s9v1t",
    	"id" : "insurance-01",
    	"type" : "sensor",
    	"auth-method" : "token",
    	"auth-token" : "password"
};

var Client = require("ibmiotf");
var deviceClient = new Client.IotfDevice(config);
var io = require('socket.io')

deviceClient.connect();
console.log("About to connect")
deviceClient.on("connect", function () {
    //publishing event using the default quality of service
    console.log("hey hey hey")
    deviceClient.publish("status","json",'{"d" : { "cpu" : 72, "mem" : 85 }}');

    var mqtt = require('mqtt');
    var mqttClient = mqtt.connect('mqtt://test.mosquitto.org');
	mqttClient.on('connect', function () {
          mqttClient.subscribe('wesley-test-999');
    });
	mqttClient.on('message', function (topic, message) {
        console.log("hey hey hey2")
        console.log(message.toString())
        console.log('{ "d" : ' + message + ' }')
    	deviceClient.publish("status","json", '{ "d" : ' + message + '}');
    	www.io.sockets.emit('update-msg', { data: 'this is the data'});
	});
});

module.exports = app;
