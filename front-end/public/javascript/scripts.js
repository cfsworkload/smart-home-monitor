$(document).ready(function() {
  window.location.origin = window.location.origin || (window.location.protocol + '//' + window.location.hostname + ':' + window.location.port);
  var socket = io.connect(window.location.origin);
  socket.on('update-msg', function (msg) {
  	//console.log(msg);
    var data = jQuery.parseJSON(msg.data);
    //console.log(data);
    
    // make sure we have some data
    if(data.power) {
      /*var tempStr = data.temp + '\u2103';
      if(data.temp > 90) tempStr += ' Alert! High temperature!';
      $('#temperature').html(tempStr);

      var humidityStr = data.humidity + '%';
      if(data.humidity > 90) humidityStr += ' Alert! High humidity!';
      $('#humidity').html(humidityStr);*/

      var powerStr = data.power + 'W';
      if(data.power >= 5000) powerStr += ' Alert! High power!';
      $('#power').html(powerStr);

      $('#maxpower').html(data.maxPower + 'W');
      
      $('#deviceid').html(data.DeviceID);

      var latitude = data.LocLat;
      if(latitude < 0) latitude = (-1 * latitude) + '\u00B0S';
      else latitude = latitude + '\u00B0N';
      $('#loclat').html(latitude);

      var longitude = data.LocLong;
      if(longitude < 0) longitude = (-1 * longitude) + '\u00B0W';
      else longitude = longitude + '\u00B0E';
      $('#loclong').html(longitude);

      $('#policyid').html(data.PolicyID);
    }
  });
});

var myLatlng = new google.maps.LatLng(37.349691000239545,-121.977338999795);
var mapOptions = {
  zoom: 10,
  center: myLatlng
};
var map;

var socketSP = "ws://insuranceiot-build-22-back-end.mybluemix.net/ServiceProviders";
var message = "....";
$(document).ready(function(){
  $('#output').text = message;
  sock = new WebSocket(socketSP);
  sock.onopen = function(){
    console.log("Connected websocket");
  };
  sock.onerror = function(){ 
    console.log("Websocket error"); 
  };
  sock.onclose = function () {};

  sock.onmessage = function(evt){
    console.log("Websocket message", evt); 
    message = evt.data;
    var jsonData = JSON.parse('{"IMBIOT":' + message + '}');
    // Create table.
    var table = document.createElement('table');
    for (var i = 0; i < jsonData.IMBIOT.length; i++) {
      var counter = jsonData.IMBIOT[i];
      var provider = table.insertRow(i);
      var provider_id = provider.insertCell(0);
      provider_id.innerHTML = counter.PROVIDER_ID;

      var provider_name = provider.insertCell(1);
      provider_name.innerHTML = counter.PROVIDER_NAME;
 
      var latitude = provider.insertCell(2);
      latitude.innerHTML = counter.LATITUDE;

      var longitude = provider.insertCell(3);
      longitude.innerHTML = counter.LONGITUDE;

      var div = document.getElementById('text');
      div.innerHTML=table.innerHTML.replace('tbody','table').replace('tbody','table');

      addMarker(counter.LATITUDE,counter.LONGITUDE);
      document.getElementById('map-canvas').style.visibility='visible';
    }
  };
});

var socketScoring = "ws://insuranceiot-build-22-back-end.mybluemix.net/ws/scoring";
$(document).ready(function(){
  sock = new WebSocket(socketScoring);
  sock.onopen = function(){
    console.log("Connected websocket");
  };
  sock.onerror = function(){ 
    console.log("Websocket error"); 
  };
  sock.onclose = function () {};

  sock.onmessage = function(evt){
    console.log("Websocket message", evt); 
    var boolean = evt.data;
    // Create table.
    $('.boolean').html(boolean);
  };
});

function initializeMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function addMarker(latitude, longitude){
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(latitude, longitude),
    map: map,
    animation: google.maps.Animation.DROP,
	title: 'Service Provider - ' 
  });
}