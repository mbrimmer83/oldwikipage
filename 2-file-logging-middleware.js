var fs = require('fs');
var express = require('express');
var app = express();
var logFile = 'requests.txt';

/*
This middleware logs requests to a log file.
*/
app.use(function(request, response, next) {
  fs.appendFile(logFile, request.method + ' ' + request.url + '\n');
  next();
});

app.get('/', function(request, response) {
  response.send('Hello world');
});

app.get('/about', function(request, response) {
  response.send('All about me.');
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
