var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 100060000
  }
}));

app.all('/', function(request, response) {
  console.log('Cookies:', request.headers.cookie);
  if (!request.session.numbers) {
    request.session.numbers = [];
  }
  var numbers = request.session.numbers;
  if ('number' in request.body) {
    var newNum = Number(request.body.number);
    numbers.push(newNum);
  }
  var sum = numbers.reduce(function(a, b) {
    return a + b;
  }, 0);
  response.send(`
    The numbers: ${numbers.join(', ')}.<br>
    The current sum is: ${sum}.
    <form action="/" method="POST">
      <input type="number" name="number">
      <button type="submit">Add the number</button>
    </form>
  `);
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
