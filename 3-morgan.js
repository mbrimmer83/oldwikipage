var fs = require('fs');
var express = require('express');
var app = express();
var morgan = require('morgan');

app.use(morgan('combined'));

app.get('/', function(request, response) {
  response.send('Hello world');
});

app.get('/about', function(request, response) {
  response.send('All about me.');
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
