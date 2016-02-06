# Workload - Insurance IOT

## Learn how to use IOT data to simulate insurance use cases
The Insurance IOT app shows how you can use the **IoT Real-Time Insights**, **IoT Real-Time Insights**, and **dashDB** services to simulate grabbing IOT data from a broker and using it to provide meaniful real time data simulating Insurance company use.

## Introduction
This Insurance IOT app has been created so you can deploy it into your personal DevOps space after signing up for Bluemix and DevOps Services. When you deploy the pipeline to Bluemix, the **Internet of Things Foundation**, **IoT Real-Time Insights**, and **dashDB** services will be created, 
a front end web application, a back end **Node-red** application, and trains the services.

## Create accounts and log in

Sign up for Bluemix at https://console.ng.bluemix.net and DevOps Services at https://hub.jazz.net.
When you sign up, you'll create an IBM ID, create an alias, and register with Bluemix.

## Deploy to Bluemix

1. Select the **Deploy to Bluemix** button below to fork a copy of the project code and create the services.

  [![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://hub.jazz.net/git/cfsworkload/insuranceIOT-build)

2.  Once you fill in the necessary fields, click **DEPLOY** to start the deployment of the Watson Conversation app and static services used.

## Monitor deployment

After the pipeline has been configured, you can monitor the deployment in DevOps Services.

1. In DevOps Services, click **MY PROJECTS** and select your newly created project.
2. Click **BUILD & DEPLOY**.
3. Select **View logs and history** to monitor the deployment stages.

Once the deployment finishes, you will have an instance of the Watson Conversation app in your Bluemix Dashboard.

## Add email to IoT Real-Time Insights service notifications

The **IoT Real-Time Insights** service has been created and connected to the data from the simulated IOT device hosted in the **IoT Real-Time Insights** service.
We need to add an email address to recieve the alert messages when the high energy threshold is reached. 

1. asdad
2.
3.

Now when a threshold is broken, an email notification will be sent to the specified email alerting about the high energy use. 

## Import tables into dashDB

We now need to import all of our sample data into dashDB.

1. Navigate to your Jazz Hub project and download the two .csv files in the root directory.
2. Navigate to your dashDB instance through the Bluemix console and launch the console.
3. Go to the **Tables** view in the left sidebar and click **Add Table**.
4. Change the DDL statement to `create table SERVICE_PROVIDERS(PROVIDER_ID INT, PROVIDER_NAME VARCHAR(30), PROVIDER_LOCATION DB2GSE.ST_POINT) organize by row;`, and click **Run DDL**.
5. Navigate to the **Run SQL** view in the left sidebar.
6. Replace the SQL with `INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (1,'Provider 1',DB2GSE.ST_POINT(37.3251750001,-122.0215519999,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (2,'Provider 2',DB2GSE.ST_POINT(37.3004120003,-122.0283650002,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (3,'Provider 3',DB2GSE.ST_POINT(37.2995239998,-122.0095680004,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (4,'Provider 4',DB2GSE.ST_POINT(37.2857990000,-121.9658370000,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (5,'Provider 5',DB2GSE.ST_POINT(37.3357700004,-121.9958780004,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (6,'Provider 6',DB2GSE.ST_POINT(37.3247139996,-121.9909000001,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (7,'Provider 7',DB2GSE.ST_POINT(37.3496910002,-121.9773389998,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (8,'Provider 8',DB2GSE.ST_POINT(37.3507820002,-121.9914149996,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (9,'Provider 9',DB2GSE.ST_POINT(37.3505090002,-121.9194890003,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (10,'Provider 10',DB2GSE.ST_POINT(37.3507820002,-121.9210339996,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (11,'Provider 11',DB2GSE.ST_POINT(37.3951189997,-121.9208619998,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (12,'Provider 12',DB2GSE.ST_POINT(37.3956639997,-121.9821450002,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (13,'Provider 13',DB2GSE.ST_POINT(37.4263429998,-121.9071220002,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (14,'Provider 14',DB2GSE.ST_POINT(37.4352030001,-121.8997480001,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (15,'Provider 15',DB2GSE.ST_POINT(37.4658660004,-121.9165709998,1005)); INSERT INTO "SERVICE_PROVIDERS" (PROVIDER_ID,PROVIDER_NAME,PROVIDER_LOCATION) VALUES (16,'Provider 16',DB2GSE.ST_POINT(37.4773100003,-121.9610309996,1005));`, and click **Run**.
7. Go to the **Load > Load from Desktop** view in the left sidebar.
8. Click **Browse files** and select **MINING_IN.csv**.
9. Leave the default settings for the column names, code page, separator character, and date/time the same.
10. Click **Preview** and **Next**.
11. Select **Create a new table and load** and click **Next**, and then click **Finish**.
12. Edit the DDL statement. For **SERVICE_PROVIDERS.csv**, use `create table SERVICE_PROVIDERS(PROVIDER_ID INT, PROVIDER_NAME VARCHAR(30), PROVIDER_LOCATION DB2GSE.ST_POINT) organize by row;` For **MINING_IN.csv**, use `create table MINING_IN(CUSTOMER_ID INT, HOUSEHOLD_SIZE INT, MONTHLY_ENERGY_COST INT, DEVICE_ENERGY_RATING INT, NO_CUSTSERV_CALLS INT, CHURNED VARCHAR(10));`


## Create dashDB decision tree and add Bluemix credentials to Node-RED 

The back end Node-RED applicaton has been provisoned with the need flows. The only thing missing is the credentials to **dashDB** and **IoT Real-Time Insights** and creating the decision 
tree in dashDB for our predictive analytics.

1. Naviate to {App-name}-back-end's dashboard.
2. Click **Show Credentials** for the **dashDB** service.
3. Copy the **username** and **password**.
4. Click **Show Credentials** for the **Internet of Things Foundation** service.
5. Copy the **apiKey** and **apiToken**.
6. Navigate to the Node-RED flow by clicking on the URL at the top of the page and clicking on the **Go to your Node-RED flow editor** button.
7. Double-click on the **DashDBRestCallToExecuteStoring** node.
8. Check the **Use basic authentication?** box and paste the dashDB username and password and click **Ok**.
9. Repeat steps 5 and 6 for the **DashDBRestCallToExecuteRScript** node and click **Deploy** at the top right
10. Click the inject button next to the **Create dashDB tree** node to send the request to have the decision tree created
10. To connect live data drag an  **IBM IoT** node from the left side bar menu to **Flow 1** and then double click on it to bring up the configuration menu.
11. Click the **edit** button next to the **API Key** field to add a new instance.
12. Name it, Paste the **Internet of Things Foundation**  **apiKey** and **apiToken** into those fields, click **Add**
13. In the **Device Id** text box type **insurance-01** and then click **Ok** at the bottom
13. Connect the **IBM IoT** to the **convertPayload** and **extract location** nodes
13. Click **Deploy** in the top right of the page to save your changes.


## How the app works

1. Go to your Bluemix dashboard and select the {App-name}-front-end newly created CF application
2. Click the route at the top of the screen see the real time data being passed through

In the front end web application you will see simulated IOT data being pass through. This is done by the front end server subscribing to a public broker and fowarding to data to the browser via websocket in the node.js source code found in /front-end/app.js. The data is also foward to the **IoT Real-Time Insights** at the same time.
Also there is a google map that shows local providers approved by the Inusrance company in the area of the IOT
device in case of needed electric maitenance. This map is simulated by recieving the Longitude and Latitude of the device from **IoT Real-Time Insights** via **Node-red**. It is then used to query pre-defined provider information hosted in **dashDB**. **Node-red** also uses the data it recieves
from **IoT Real-Time Insights** to create a decision tree in **dashDB** for our preditive analytics. The IOT data is fed into this decision tree to determine if the current electric use levels show a probability that the device owner with churn from the company, shown in the 
**Current probability that client will churn** section of the front end. 
