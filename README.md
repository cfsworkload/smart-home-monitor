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

## Add Bluemix credentials to Node-red

The back end node red applicaton has been provisoned with the need flows. The only thing missing is the credentials to **dashDB**.

1. Select the **dashDB** service from the newly created {App-name}-back-end's dashboard 
2. 
3.


## Create dashDB decision tree and connect live data

We now need to use Node-red to create a decision tree in **dashDB** that will be used to take our real time IOT data and do predictive analytics on the probability the IOT owner will churn from the company.

1. Select 
2.
3.
4.
5.
6. Select **DEPLOY**

## How the app works

1. Go to your Bluemix dashboard and select the {App-name}-front-end newly created CF application
2. Click the route at the top of the screen see the real time data being passed through



