var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var wikiLinkify = require('wiki-linkify');
app.set('view engine', 'hbs');
var session = require('express-session');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wiki-db');
var User = require('./signupmodel');
var Page = require('./pagemodel');

app.use(session({
  secret: 'theBirdIsTheWord',
  cookie: {
    maxAge: 60000000000
  }
}));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/login', function(request, response) {
  response.render('login');
});

app.get('/signup', function(request, response) {
    response.render('signup');
});

// User login  verification
app.post('/login-submit', function(request, response) {
  var cred = request.body;
  User.findOne({ _id: cred.username}, function(err, userData){
    if (err) {
      console.log(err.message);
      return;
    }
    if (cred.username === userData._id && cred.password === userData.password) {
      request.session.user = cred.username;
      if (request.session.requestUrl === undefined){
        response.redirect('/HomePage' );
      } else if (request.session.user !== undefined) {
          response.redirect(request.session.requestUrl);
      } else {
      response.redirect('/login');
      }
    }
  });
});

//Create a new user account
app.post('/signup', function(request, response) {
  var userdata = request.body;
  var user = new User({
    _id: userdata.username,
    firstname: userdata.firstname,
    lastname: userdata.lastname,
    password: userdata.password,
    address: userdata.address,
    city: userdata.city,
    state: userdata.state,
    zipcode: userdata.zipcode,
  });
  console.log(user);
  user.save(function(err){
    if (err) {
      console.log(err.message);
      return;
    }
    console.log("New User Added");
  });
  response.redirect('/login');
});

app.get('/', function(request, response) {
  var nameOfUser = request.session.user;
  console.log(nameOfUser);
  response.render('home', {user: nameOfUser});
});

app.get('/AllPages', function(request, response) {
  fs.readdir('pages', function(err, pages) {
    if (err) {
      console.log(err);
      return;
    } else {
      var noExt = pages.map(function(idx) {
       var newIdx =idx.replace(/\.[^/.]+$/, "");
       return newIdx;
      });
      console.log(noExt);
      response.render('AllPages.hbs', {somePages: noExt});
    }
  });
});

app.get('/:pageName', function (request, response) {
  var pageName = request.params.pageName;
  console.log(pageName);
  Page.findOne({ pagename: pageName}, function(err, pageData) {
    if (!pageData) {
      response.render('placeholder', {pageName: request.params.pageName});
    } else {
      var wikiContent = wikiLinkify(pageData.content);
      response.render('show-text.hbs', {
        contents: wikiContent,
        pageName: pageName
      });
    }
  });
});

app.get('/:pageName/edit', authRequired, function(request, response) {
  var pageName = request.params.pageName;
  Page.findOne({ pagename: pageName}, function(err, pageData) {
    if (!pageData) {
      response.render('edit', {
        title: 'Edit ' + pageName,
        pageName: pageName
      });
      return;
    }
    response.render('edit', {
      title: 'Edit ' + pageName,
      pageName: pageName,
      contents: pageData.content
    });
  });
});

app.post('/:pageName/save', authRequired, function(request, response) {
  var data = request.body.contents;
  var pageName = request.params.pageName;
  console.log(pageName);

  Page.update(
    { pagename: pageName},
    { $set: { content: data } },
    { upsert: true},
    function(err, reply) {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log('Upsert succeeded.', reply);
      response.redirect('/' + pageName);
    }
  );
});

function authRequired(request, response, next) {
 request.session.requestUrl = request.url;
 console.log(request.session.user);
  if (!request.session.user) {
    response.redirect('/login');
  } else {
    next();
  }
}

app.listen(8080, function() {
  console.log("listening on 8080");
});
