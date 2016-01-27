$(document).ready(function() {
  var socket = io.connect('http://localhost:3000');
  socket.on('update-msg', function (msg) {
    console.log(msg);
    $('#mydiv').html(msg.data)
  });
});
