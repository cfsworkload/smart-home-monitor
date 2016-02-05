/**
	* Copyright 2014 IBM Corp.
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
**/

var path = require("path");
var when = require("when");

var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();

var VCAP_APPLICATION = JSON.parse(process.env.VCAP_APPLICATION);
var VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);

var settings = module.exports = {
    uiPort: process.env.VCAP_APP_PORT || 1880,
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    debugMaxLength: 1000,

    // Add the bluemix-specific nodes in
    nodesDir: path.join(__dirname,"nodes"),

    // Blacklist the non-bluemix friendly nodes
    nodesExcludes:['66-mongodb.js','75-exec.js','35-arduino.js','36-rpi-gpio.js','25-serial.js','28-tail.js','50-file.js','31-tcpin.js','32-udp.js','23-watch.js'],

    // Enable module reinstalls on start-up; this ensures modules installed
    // post-deploy are restored after a restage
    autoInstallModules: true,

    // Move the admin UI
    httpAdminRoot: '/red',

    // You can protect the user interface with a userid and password by using the following property
    // the password must be an md5 hash  eg.. 5f4dcc3b5aa765d61d8327deb882cf99 ('password')
    //httpAdminAuth: {user:"user",pass:"5f4dcc3b5aa765d61d8327deb882cf99"},

    // Serve up the welcome page
    httpStatic: path.join(__dirname,"public"),

    functionGlobalContext: { },

    storageModule: require("./couchstorage"),

    httpNodeCors: {
        origin: "*",
        methods: "GET,PUT,POST,DELETE"
	}
}

if (process.env.NODE_RED_USERNAME && process.env.NODE_RED_PASSWORD) {
    settings.adminAuth = {
        type: "credentials",
        users: function(username) {
            if (process.env.NODE_RED_USERNAME == username) {
                return when.resolve({username:username,permissions:"*"});
				} else {
                return when.resolve(null);
			}
		},
        authenticate: function(username, password) {
            if (process.env.NODE_RED_USERNAME == username &&
			process.env.NODE_RED_PASSWORD == password) {
                return when.resolve({username:username,permissions:"*"});
				} else {
                return when.resolve(null);
			}
		}
	}
}

settings.couchAppname = VCAP_APPLICATION['application_name'];


var storageServiceName = process.env.NODE_RED_STORAGE_NAME || new RegExp("^"+settings.couchAppname+".cloudantNoSQLDB");
var couchService = VCAP_SERVICES.cloudantNoSQLDB[0];

if (!couchService) {
    console.log("Failed to find Cloudant service");
    if (process.env.NODE_RED_STORAGE_NAME) {
        console.log(" - using NODE_RED_STORAGE_NAME environment variable: "+process.env.NODE_RED_STORAGE_NAME);
	}
    throw new Error("No cloudant service found");
}
settings.couchUrl = couchService.credentials.url;



//--DashDB Creation-------------------------------------------------------------

var dashDBcredentials = {};
var db;

function initServiceProviderTable() {
	if(process.env.VCAP_SERVICES) {
		var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
		if(vcapServices.dashDB) {
			dashDBcredentials.dsn = vcapServices.dashDB[0].credentials.dsn;
			console.log("dashDB dsn: " + dashDBcredentials.dsn);
		}
	}
	else {
		console.log("Unable to find dashDB credentials");
	}

	db = require('ibm_db');

	db.open(dashDBcredentials.dsn, function(err,conn) {
		if(err) {
			console.log("Unable to connect to dashDB");
			console.error("Error: ", err);
			return;
		}

		var createTableStatement = 'create table SERVICE_PROVIDERS(PROVIDER_ID INT,PROVIDER_NAME VARCHAR(30),PROVIDER_LOCATION DB2GSE.ST_POINT) organize by row;';

		console.log("attempting to create table...");
		console.log("create table statement: " + createTableStatement);

		conn.prepare(createTableStatement, function (err, stmt) {
			if (err) {
				return conn.closeSync();
			}

			//Bind and Execute the statment asynchronously
			stmt.execute(['something', 42], function (err, result) {
				if(err) console.log(err);

				//Close the connection
				conn.closeSync(function(err) {
					if(err) console.log("Problem disconnecting from dashDB");
					else console.log("Connection closed successfully.");
				});


				var dashDBuser = (vcapServices.dashDB[0].credentials.username).toUpperCase();

				for(var i = 1; i <= 16; i++) {
					var geolocation;

					switch(i) {
						case 1:
							geolocation = '37.3251750001,-122.0215519999,1005';
							break;
						case 2:
							geolocation = '37.3004120003,-122.0283650002,1005';
							break;
						case 3:
							geolocation = '37.2995239998,-122.0095680004,1005';
							break;
						case 4:
							geolocation = '37.2857990000,-121.9658370000,1005';
							break;
						case 5:
							geolocation = '37.3357700004,-121.9958780004,1005';
							break;
						case 6:
							geolocation = '37.3247139996,-121.9909000001,1005';
							break;
						case 7:
							geolocation = '37.3496910002,-121.9773389998,1005';
							break;
						case 8:
							geolocation = '37.3507820002,-121.9914149996,1005';
							break;
						case 9:
							geolocation = '37.3505090002,-121.9194890003,1005';
							break;
						case 10:
							geolocation = '37.3507820002,-121.9210339996,1005';
							break;
						case 11:
							geolocation = '37.3951189997,-121.9208619998,1005';
							break;
						case 12:
							geolocation = '37.3956639997,-121.9821450002,1005';
							break;
						case 13:
							geolocation = '37.4263429998,-121.9071220002,1005';
							break;
						case 14:
							geolocation = '37.4352030001,-121.8997480001,1005';
							break;
						case 15:
							geolocation = '37.4658660004,-121.9165709998,1005';
							break;
						case 16:
							geolocation = '37.4773100003,-121.9610309996,1005';
							break;
						default:
							geolocation = 'invalid index';
					}

					db.open(dashDBcredentials.dsn,function(err,conn) {
						var insertStatement = 'INSERT INTO "' + dashDBuser + '"."SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (' + i + ', \'Provider ' + i + '\', DB2GSE.ST_POINT(' + geolocation + '));';

						console.log("attempting to insert data...");
						console.log("insert statement: " + insertStatement);

						conn.prepare(insertStatement, function (err, stmt) {
							if (err) console.log(err);

							//Bind and Execute the statment asynchronously
							stmt.execute(['something', 42], function (err, result) {
								if(err) console.log(err);

								//Close the connection
								conn.close(function(err) {
									if(err) console.log("Problem disconnecting from dashDB");
									else console.log("Connection closed successfully.");
								});
							});
						});
					});
				}
			});
		});
	});
}

initServiceProviderTable();