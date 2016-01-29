$(document).ready(function() {
  window.location.origin = window.location.origin || (window.location.protocol + '//' + window.location.hostname + ':' + window.location.port);
  var socket = io.connect(window.location.origin);
  socket.on('update-msg', function (msg) {
    //console.log(msg);
    var data = jQuery.parseJSON(msg.data);
    console.log(data);
    
    // make sure we have some datas
    if(data.temp) {
      $('.output').css('visibility', 'visible');
      $('#temperature').html(data.temp + '\u2103');
      $('#humidity').html(data.humidity + '%');
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
      
      $('#analytics').html($.get('http://insuranceiot-build-back-end.mybluemix.net/MyServiceProviders2'));
    }
  });
});
