var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var www = require('./bin/www');
var mosca = require('mosca');
var fs = require('fs');
var routes = require('./routes/index');
var users = require('./routes/users');
var iotf = require("ibmiotf");
var app = express();

var services = JSON.parse(process.env.VCAP_SERVICES); 
var port = (process.env.VCAP_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || '0.0.0.0');

var db;
var cloudant;
var dbCredentials = {
	dbName : 'my_sample_db'
};

//setup cloudant db
function initDBConnection() {
	
	if(process.env.VCAP_SERVICES) {
		var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
		if(vcapServices.cloudantNoSQLDB) {
			dbCredentials.host = vcapServices.cloudantNoSQLDB[0].credentials.host;
			dbCredentials.port = vcapServices.cloudantNoSQLDB[0].credentials.port;
			dbCredentials.user = vcapServices.cloudantNoSQLDB[0].credentials.username;
			dbCredentials.password = vcapServices.cloudantNoSQLDB[0].credentials.password;
			dbCredentials.url = vcapServices.cloudantNoSQLDB[0].credentials.url;
		}
		console.log('VCAP Services: '+JSON.stringify(process.env.VCAP_SERVICES));
	}
    else{
            dbCredentials.host = "ffe37731-0505-4683-96a8-87d02a33e03e-bluemix.cloudant.com";
			dbCredentials.port = 443;
			dbCredentials.user = "ffe37731-0505-4683-96a8-87d02a33e03e-bluemix";
			dbCredentials.password = "c7003d0b156d9c4ce856c4e6b4427f3b576c7ea6229235f0369ada1ed47b159c";
			dbCredentials.url = "https://ffe37731-0505-4683-96a8-87d02a33e03e-bluemix:c7003d0b156d9c4ce856c4e6b4427f3b576c7ea6229235f0369ada1ed47b159c@ffe37731-0505-4683-96a8-87d02a33e03e-bluemix.cloudant.com";
        
    }

	cloudant = require('cloudant')(dbCredentials.url);
	
	//check if DB exists if not create
	cloudant.db.create(dbCredentials.dbName, function (err, res) {
		if (err) { console.log('could not create db ', err); }
    });
	db = cloudant.use(dbCredentials.dbName);
}

initDBConnection();


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

app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
});



var mqttServe = new mosca.Server({});

mqttServe.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

mqttServe.on('published', function(packet, client){

	console.log('Message: ', packet.payload.toString("utf8"));
	
	fs.appendFile("../logs/mqtt.log", packet.topic + ": " + packet.payload.toString("utf8") + "\n", function(err) {
	    if(err) {
	        return console.log(err);
	    }	
	}); 
	
	db.insert({"Topic": packet.topic, "Message": packet.payload.toString("utf8")}, function(err, body) {
 		if (!err)
    		console.log(body);
		});

});


var appClientConfig = {
	"org": services['iotf-service'][0]['credentials'].org,
	"id": services['iotf-service'][0]['credentials'].iotCredentialsIdentifier,
	"auth-key": services['iotf-service'][0]['credentials'].apiKey,
	"auth-token": services['iotf-service'][0]['credentials'].apiToken
};
console.log("The value in org is before guts = " + services['iotf-service'][0]['credentials'].org)
var appClient = new iotf.IotfApplication(appClientConfig);

//setting the log level to trace. By default its 'warn'
appClient.log.setLevel('info');

var type = "sensor";
var desc = "house humidty sensor"
var metadata = {"customField1": "customValue3", "customField2": "customValue4"}
var deviceInfo = {"serialNumber": "001", "manufacturer": "Blueberry", "model": "e2", "deviceClass": "A", "descriptiveLocation" : "Bangalore", "fwVersion" : "1.0.1", "hwVersion" : "12.01"}

appClient.
registerDeviceType(type,desc,deviceInfo,metadata).then (function onSuccess (argument) {
    console.log("Success");
    console.log(argument);

	var type = "sensor";
	var deviceId = "insurance-01"
	var authToken = "password"
	var metadata = {"DeviceID": "insurance-01", "PolicyID": "6134141"}
	var deviceInfo = {"serialNumber": "001", "manufacturer": "Blueberry", "model": "e2", "deviceClass": "A", "fwVersion" : "1.0.1", "hwVersion" : "12.01"}
	var location = {"longitude" : "-121.8863", "latitude" : "37.3382", "elevation" : "49", "accuracy" : "0", "measuredDateTime" : "2015-10-28T08:45:11.662Z"}

	appClient.registerDevice(type, deviceId, authToken, deviceInfo, location, metadata).then (function onSuccess (response) {
		console.log("Success");
		console.log(response);
		var config = {
			"org" : services['iotf-service'][0]['credentials'].org.toString(),
			"id" : "insurance-01",
			"type" : "sensor",
			"auth-method" : "token",
			"auth-token" : "password"
		};

		var Client = require("ibmiotf");
		var io = require('socket.io')
		console.log("hey hey hey")
		var mqtt = require('mqtt');
		var mqttClient = mqtt.connect('mqtt://test.mosquitto.org');
		mqttClient.on('connect', function () {
			mqttClient.subscribe('wesley-test-999');
		});
		mqttClient.on('message', function (topic, message) {
			console.log("hey hey hey2")
			console.log(message.toString())
			console.log('{ "d" : ' + message + ' }')
			var deviceClient = new Client.IotfDevice(config);
			deviceClient.connect();
			deviceClient.on("connect", function () {
				console.log('publishing...');
				deviceClient.publish("status","json", '{ "d" : ' + message + '}');
				//www.io.sockets.emit('update-msg', { data: 'this is the data' + message.toString()});
				www.io.sockets.emit('update-msg', { data: message.toString() });
				deviceClient.disconnect();
			});
			deviceClient.on('disconnect', function(){
				console.log('Disconnected from IoTF');
			});
		});


		}, function onError (error) {

		console.log("Fail");
		console.log(error);
		console.log("The value in org in before guts = " + services['iotf-service'][0]['credentials'].org)
		var config = {
			"org" : services['iotf-service'][0]['credentials'].org.toString(),
			"id" : "insurance-01",
			"type" : "sensor",
			"auth-method" : "token",
			"auth-token" : "password"
		};

		var Client = require("ibmiotf");
		var io = require('socket.io')


	    console.log("hey hey hey")
		var mqtt = require('mqtt');
		var mqttClient = mqtt.connect('mqtt://test.mosquitto.org');
		mqttClient.on('connect', function () {
			mqttClient.subscribe('wesley-test-999');
		});
		mqttClient.on('message', function (topic, message) {
			console.log("hey hey hey2")
			console.log(message.toString())
			console.log('{ "d" : ' + message + ' }')
			var deviceClient = new Client.IotfDevice(config);
			deviceClient.connect();
			deviceClient.on("connect", function () {
				console.log('publishing...');

				deviceClient.publish("status","json", '{ "d" : ' + message + '}');
				//www.io.sockets.emit('update-msg', { data: 'this is the data' + message.toString()});
				www.io.sockets.emit('update-msg', { data: message.toString() });
				deviceClient.disconnect();
			});
			deviceClient.on('disconnect', function(){
				console.log('Disconnected from IoTF');
			});
		});
	});
	}, function onError (argument) {

    console.log("Fail");
    console.log(argument);
	var type = "sensor";
	var deviceId = "insurance-01"
	var authToken = "password"
	var metadata = {"DeviceID": "insurance-01", "PolicyID": "6134141"}
	var deviceInfo = {"serialNumber": "001", "manufacturer": "Blueberry", "model": "e2", "deviceClass": "A", "fwVersion" : "1.0.1", "hwVersion" : "12.01"}
	var location = {"longitude" : "96.8103", "latitude" : "32.7906", "elevation" : "2000", "accuracy" : "0", "measuredDateTime" : "2015-10-28T08:45:11.662Z"}

	appClient.registerDevice(type, deviceId, authToken, deviceInfo, location, metadata).then (function onSuccess (response) {
		console.log("Success");
		console.log(response);
		var config = {
			"org" : services['iotf-service'][0]['credentials'].org.toString(),
			"id" : "insurance-01",
			"type" : "sensor",
			"auth-method" : "token",
			"auth-token" : "password"
		};
		console.log("The value in org in before guts = " + services['iotf-service'][0]['credentials'].org)
		var Client = require("ibmiotf");
		var io = require('socket.io')

	    console.log("hey hey hey")
		var mqtt = require('mqtt');
		var mqttClient = mqtt.connect('mqtt://test.mosquitto.org');
		mqttClient.on('connect', function () {
			mqttClient.subscribe('wesley-test-999');
		});
		mqttClient.on('message', function (topic, message) {
			console.log("hey hey hey2")
			console.log(message.toString())
			console.log('{ "d" : ' + message + ' }')
			var deviceClient = new Client.IotfDevice(config);
			deviceClient.connect();
			deviceClient.on("connect", function () {
				console.log('publishing...');
				deviceClient.publish("status","json", '{ "d" : ' + message + '}');
				//www.io.sockets.emit('update-msg', { data: 'this is the data' + message.toString()});
				www.io.sockets.emit('update-msg', { data: message.toString() });
				deviceClient.disconnect();
			});
			deviceClient.on('disconnect', function(){
				console.log('Disconnected from IoTF');
			});
		});

		}, function onError (error) {
		console.log("The value in org in before guts = " + services['iotf-service'][0]['credentials'].org)
		console.log("Fail");
		console.log(error);
		var config = {
			"org" : services['iotf-service'][0]['credentials'].org.toString(),
			"id" : "insurance-01",
			"type" : "sensor",
			"auth-method" : "token",
			"auth-token" : "password"
		};

		var Client = require("ibmiotf");
		var io = require('socket.io')

	    console.log("hey hey hey")
		var mqtt = require('mqtt');
		var mqttClient = mqtt.connect('mqtt://test.mosquitto.org');
		mqttClient.on('connect', function () {
			mqttClient.subscribe('wesley-test-999');
		});
		mqttClient.on('message', function (topic, message) {
			console.log("hey hey hey2")
			console.log(message.toString())
			console.log('{ "d" : ' + message + ' }')
			var deviceClient = new Client.IotfDevice(config);
			deviceClient.connect();
			deviceClient.on("connect", function () {
				console.log('publishing...');
				deviceClient.publish("status","json", '{ "d" : ' + message + '}');
				//www.io.sockets.emit('update-msg', { data: 'this is the data' + message.toString()});
				www.io.sockets.emit('update-msg', { data: message.toString() });
				deviceClient.disconnect();
			});
			deviceClient.on('disconnect', function(){
				console.log('Disconnected from IoTF');
			});
		});
	});
});

module.exports = app;
