var express = require('express');
var app = express();
var basicAuth = require('basic-auth');

app.use(function(request, response, next) {
  var credentials = basicAuth(request);
  if (!credentials) {
    reject(response);
    return;
  }
  if (credentials.name === 'Toby' && credentials.pass === 'thepassword') {
    request.user = credentials.name;
    next();
  } else {
    reject(response);
  }
});

function reject(response) {
  response.statusCode = 401;
  response.setHeader('WWW-Authenticate', 'Basic realm="stop-you-must"');
  response.end('Access denied')
}

app.get('/', function(request, response) {
  response.send('Hello, ' + request.user + '!');
});

app.get('/about', function(request, response) {
  response.send('All about it!');
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
