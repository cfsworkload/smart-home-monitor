# Workload - Smart Home Monitor

## Learn how to use IoT data to provide helpful use cases and predictive analytics
The Smart Home Monitor app shows how you can use the **IoT Foundation**, **IoT Real-Time Insights**, and **dashDB** services to grab simulated energy use data from an in-home appliance and extract meaningful data in real time.

## Introduction
The Smart Home Monitor app has been created so that you can deploy it into your personal DevOps space after signing up for Bluemix and DevOps Services. When you deploy to Bluemix, the **Internet of Things Foundation**, **IoT Real-Time Insights**, and **dashDB** services are created in addition to a front-end web app and back-end **Node-RED** app. The deployment pipeline also trains the services.

Once deployed, you can see the real-time IoT data from the appliance in the Internet of Things Foundation service, query the data in dashDB for a list of insurance-approved electricians in the device's area,
and score customer retention based on energy usage costs. The likelihood of customer churn is decided by scoring IoT data against the decision tree model built in dashDB. Historical data is assessed and returns how likely the customer is to remain with the insurance provider.

Additionally, when high power usage is detected
on the appliance, an alert is triggered in the IoT Real-Time Insights service that sends an email to a specified recipient.

## Create accounts and log in

Sign up for Bluemix at https://console.ng.bluemix.net and DevOps Services at https://hub.jazz.net.
When you sign up, you'll create an IBM ID, create an alias, and register with Bluemix.

## Deploy to Bluemix

1. Select the **Deploy to Bluemix** button below to fork a copy of the project code and create the services.

  [![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://hub.jazz.net/git/cfsworkload/insuranceIOT-build)

2. Once you fill in the necessary fields, click **DEPLOY** to start the deployment of the Smart Home Monitor app and static services used.

## Monitor deployment

After the pipeline has been configured, you can monitor the deployment in DevOps Services.

1. In DevOps Services, click **MY PROJECTS** and select your newly created project.
2. Click **BUILD & DEPLOY**.
3. Select **View logs and history** to monitor the deployment stages.

Once the deployment finishes, you will have an instance of the Smart Home Monitor app in your Bluemix Dashboard.

## Add email address to notifications

IoT Real-Time Insights connects to the data of the simulated IoT device and is hosted in the IoT Foundation service. The creation of the message source, message schema, message route, action, and rule is done in the **deploy back-end** tile of the DevOps pipeline using the service's REST API.

You can add an email address to receive alert messages when the high energy threshold is reached.

1. Navigate to the application dashboard of the back-end app.
2. Select **IoT Real-Time Insights** and click **Launch IoT Real-Time Insights Dashboard**.
3. Select the **Analytics** tab at the top right.
4. Click the gear icon on the **highPower** rule and select **Edit rule** in the drop-down.
4. Click into the **email action** field.
5. Click the pencil icon.
6. Add an email address in the **To** field and enter a **Subject**.
7. Check the **Prepend with "IoT Real-Time Insights alert"** box.
8. Click the **OK** boxes.
9. Click **SAVE** at top right, then **OK**.

The email alerts are now set. You can also see the alerts on the Insights Dashboard for the insurance-01 device.

To stop email notifications, you can delete the email rule in the service.

## Import tables into dashDB

You'll now create and fill tables in **dashDB**. One table will search insurance-approved electricians. The other table will query historical data on customer retention for an insurance company, based on energy use.

1. Navigate to your DevOps Service project and download the two `.csv` files from the root directory.
2. Navigate to **dashDB** in the application dashboard of the back-end app.
3. Go to the **Tables** view in the left sidebar and click **Add Table**.
4. Change the DDL statement to `create table SERVICE_PROVIDERS(PROVIDER_ID INT, PROVIDER_NAME VARCHAR(30), PROVIDER_LOCATION DB2GSE.ST_POINT) organize by row;`, then click **Run DDL**.
5. Repeat step 3 and Change the DDL statement to `create table MINING_IN(CUSTOMER_ID INT, HOUSEHOLD_SIZE INT, MONTHLY_ENERGY_COST INT, DEVICE_ENERGY_RATING INT, NO_CUSTSERV_CALLS INT, CHURNED VARCHAR(10));`, then click **Run DDL**.
5. Navigate to the **Run SQL** view in the left sidebar.
6. Replace the SQL with the following:

 `INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (1,'Provider 1',DB2GSE.ST_POINT(37.3251750001,-122.0215519999,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (2,'Provider 2',DB2GSE.ST_POINT(37.3004120003,-122.0283650002,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (3,'Provider 3',DB2GSE.ST_POINT(37.2995239998,-122.0095680004,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (4,'Provider 4',DB2GSE.ST_POINT(37.2857990000,-121.9658370000,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (5,'Provider 5',DB2GSE.ST_POINT(37.3357700004,-121.9958780004,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (6,'Provider 6',DB2GSE.ST_POINT(37.3247139996,-121.9909000001,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (7,'Provider 7',DB2GSE.ST_POINT(37.3496910002,-121.9773389998,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (8,'Provider 8',DB2GSE.ST_POINT(37.3507820002,-121.9914149996,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (9,'Provider 9',DB2GSE.ST_POINT(37.3505090002,-121.9194890003,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (10,'Provider 10',DB2GSE.ST_POINT(37.3507820002,-121.9210339996,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (11,'Provider 11',DB2GSE.ST_POINT(37.3951189997,-121.9208619998,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (12,'Provider 12',DB2GSE.ST_POINT(37.3956639997,-121.9821450002,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (13,'Provider 13',DB2GSE.ST_POINT(37.4263429998,-121.9071220002,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (14,'Provider 14',DB2GSE.ST_POINT(37.4352030001,-121.8997480001,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (15,'Provider 15',DB2GSE.ST_POINT(37.4658660004,-121.9165709998,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (16,'Provider 16',DB2GSE.ST_POINT(37.4773100003,-121.9610309996,1005));`

7. Click **Run**.
7. Go to the **Load > Load from Desktop** view in the left sidebar.
8. Click **Browse files** and select the `MINING_INPUT.csv` file.
9. Leave the default settings for the column names, code page, separator character, and date/time.
10. Click **Preview** and **Next**.
11. Select **Load into an existing table**, then click **Next**.
12. Select the `MINING_IN` table, then click **Finish**.

The `MINING_IN` table is now ready to be called by Node-RED to create a customer churn decision tree. The `SERVICE_PROVIDERS` table is ready to be queried by Node-RED to return a list of providers based on longitude and latitude.

## Create decision tree and add credentials

The back-end Node-RED app has been provisioned with the needed flows. It has three independent lanes:
* The first lane starts the **converyPayload** node that connects to the real-time data in the IoT Foundation service, then sends the data to dashDB for scoring against the decision tree model. The results are sent to a websocket that is connected to the front end.
* The next lane starts with the **extract location** node after connecting to IoT data. It queries dashDB for providers in the area based on the longitude and latitude of the IoT device and forwards it to another websocket connected to the front end.
* The last lane starts with the **Create dashDB tree** node. It runs once at the beginning of the process to create the decision tree by sending an R script through a REST API. The script is run against the historical data in the `MINING_INPUT` table and used in the top Node-RED lane.

To create the decision tree:

1. Navigate to the application dashboard of the back-end app.
2. Click **Show Credentials** for the dashDB service.
3. Copy the `username`, `https_url`, and the `password`.
4. Click **Show Credentials** for the Internet of Things Foundation service.
5. Copy the `apiKey` and `apiToken`.
6. Navigate to the Node-RED flow by clicking on the URL at the top of the page, then click **Go to your Node-RED flow editor**.
7. Double-click the **DashDBQuery** node. In the **Service** drop-down, select the dashDB service attached to the back-end and click **OK**.
8. Double-click on the **DashDBRestCallToExecuteStoring** node.
9. Check the **Use basic authentication?** box and paste the dashDB `username` and `password`.
10. Paste the `https_url`/dashdb-api/rscript into the **url** field and click **OK**.
11. Repeat steps 5 and 6 for the **DashDBRestCallToExecuteRScript** node and click **Deploy** at the top right.
12. Click the inject button next to the **Create dashDB tree** node to create the decision tree.
13. To connect live data, drag an **IBM IoT** node from the left sidebar to **Flow 1**, then double click on it to load the configuration menu.
14. In the **Authentication** drop-down, select **API Key**.
15. Click **edit** next to the **API Key** field to add a new instance.
16. Name the instance, paste the Internet of Things Foundation  `apiKey` and `apiToken`, then click **Add**.
17. In the **Device Id** text box type `insurance-01`, then click **OK**.
18. Connect the **IBM IoT** node to the **convertPayload** and **extract location** nodes.
19. Grab a output websocket from the left sidebar and drag it onto **Flow 1**.
20. Double-click on the websocket and click **edit** on the **Path** drop-down.
21. For the path, enter `/ServiceProviders`.
22. Press **Update** and **OK**.
23. Connect the node to the output of the **DashDBQuery** node.
24. Grab another output websocket from the left sidebar.
25. In the **Path** drop-down, select **Add new websocket-listener**.
26. Select **edit** and in the path and enter `/ws/scoring`.
27. Connect the node to the output of **ExtractScoringResults**.
25. Click **Deploy** in the top right of the page to save your changes.

The dashDB decision tree has been created. The top two lanes are now connected to the IoT Foundation service and live data and results are forwarding to the websockets connected to the front end.


## How the app works

1. Go to your Bluemix Dashboard.
2. Select the app dashboard for the front-end of your new CF app.
3. Click the route at the top of the page to see real-time data passing through.

In the front-end web app, you can see simulated IoT data. To achieve this the front-end server subscribes to a public broker and forwards to data to the browser via websocket. You can view the implementation source code in the Node.js file at `/front-end/app.js`. The data is also forwarded to IoT Real-Time Insights. The Google map shows providers approved by the insurance company that are close to the IoT device, in the event that maintenance is needed. The likelihood of customer churn is returned from the dashDB decision tree query and displayed.

### IoT Foundations

IoT Foundations acts as the broker for Node-RED and the IoT Real-Time Insights service. It receives data from the web app via its API. The front end receives MQTT messages from the public broker it is subscribed to on a unique topic. This simulates connecting to a public third IoT broker and integrating it into your own flow. IoT Foundations connects to IoT Real-Time Insights in the deployment pipeline using the service's REST API. Node-RED uses the service's API key and token in the **ibmiot**
node to listen for the IoT data.

For more information on the IoT Foundations, see https://www.ng.bluemix.net/docs/#services/IoT/index.html.

### IoT Real-Time Insights

IoT Real-Time Insights is trained in the deployment pipeline. When it receives an energy user power rating of more than 5000, it triggers an alert that sends an email to the specified recipient. You can click on the service in the application dashboard of the back-end app to see alerts and information about the device.

For more information on IoT Real-Time Insights, see https://www.ng.bluemix.net/docs/services/iotrtinsights/index.html.

### dashDB

The dashDB service is used as a warehouse for electrician information and the data used to create the decision tree. It also provides the functionality to take our R script to create and host the tree.

For more information on dashDB, see https://www.ng.bluemix.net/docs/#services/dashDB/index.html#dashDB.
