var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');

app.use(session({ secret: 'keyboard cat', cookie: {
  maxAge: 60000
}}));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/login', function(request, response) {
  response.send(`
    <form action="/login-submit" method="POST">
      <input type="text" name="username" placeholder="Username">
      <input type="password" name="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login-submit', function(request, response) {
  var credentials = request.body;
  if (credentials.username === 'Toby' && credentials.password === 'thepassword') {
    request.session.user = credentials.username;
    response.redirect('/');
  } else {
    response.redirect('/login');
  }
});

app.get('/', function(request, response) {
  response.send(
    '<h1>Welcome ' + request.session.user + '!</h1>' +
    '<a href="/login">Log in</a> |' +
    '<a href="/logout">Log out</a>'
  );
});

app.get('/restricted', authRequired, function(request, response) {
  response.send(`
    <h1>This area is restricted</h1>
  `);
});

function authRequired(request, response, next) {
  if (!request.session.user) {
    response.redirect('/login');
  } else {
    next();
  }
}



app.get('/logout', function(request, response) {
  request.session.user = null;
  response.redirect('/');
});



app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
