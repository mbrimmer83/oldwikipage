var express = require('express');
var app = express();

/*
Logging middle example. This middleware function will
execute for any requests that come in. Note that it
takes the 3rd argument: next.
*/

app.use(function(request, response, next) {
  console.log('first in the chain');
  console.log(request.method + ' ' + request.url);
  // calling next will pass it on to other middlewares
  // that match the request
  next();
});

// the handler functions we've been writing are in fact middlewares
app.get('/', function(request, response, next) {
  console.log('second in the chain');
  response.send('Hello world');
  next();
});

app.get('/', function(request, response) {
  console.log('third in the chain');
});

app.get('/about', function(request, response) {
  response.send('All about me.');
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
