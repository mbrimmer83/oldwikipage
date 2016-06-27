var express = require('express');
var app = express();
var fs = require('fs');

// the handler functions we've been writing are in fact middlewares
app.get('/', function(request, response, next) {
  console.log('/');
  fs.readFile('wikipage.txt', function(err, data) {
    if (err) {
      next(err);
      return;
    }
    response.render('page.hbs', {
      content: data.toString()
    });
  });
});

/*
An error handle will take an extra err parameter in the beginning - it has to take all 4 parameters.
*/
app.use(function(err, request, response, next) {
  console.log('err: ', err);
  var errorReport = err.message + '\n' + err.stack + '\n\n';
  fs.appendFile('error.log', errorReport);
  response.send('<pre>' + errorReport + '</pre>');
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
