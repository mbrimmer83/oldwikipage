var express = require('express');
var app = express();

app.get('/', function(request, response) {
  // Client-side returning the cookie
  console.log('Cookies:', request.headers.cookie);

  var id = generateId();
  // Server-side setting a cookie
  response.setHeader('set-cookie', 'eyecolor=' + id);
  response.send('ok');
});

function generateId() {
  return Math.floor(Math.random() * 10000000);
}

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
