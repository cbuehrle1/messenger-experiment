var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require("connect-flash");
var setupPassport = require('./setup-passport.js');
var path = require('path');
var User = require('./models/user.js');

var app = express();

var db = process.env.MONGODB_URI || "mongodb://localhost:27017/messager";

mongoose.connect(db);

setupPassport();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(flash());

var SECRET = process.env.SECRET || "abaegdadg%!#$!#gadg#$#11134%%%$banan!TfT";

app.use(session({
  secret: SECRET,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.use(express.static('public'));

app.get("/", function(req, res) {
  res.render('index');
});

app.get("/login", function(req, res) {
  res.render('login', { message: req.flash("login") });
});

app.get("/signup", function(req, res) {
  res.render('signup', { message: req.flash("signup") });
});

app.get("/app", ensureAuthenticated, function (req, res) {
  res.render('app');
});

app.post("/login", passport.authenticate("login", {
  successRedirect: "/app",
  failureRedirect: "/login"
}));

app.post('/signup', function (req, res, next) {

  var username = req.body.username;
  var password = req.body.password;
  var displayName = req.body.displayName;

  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }
    if (user) {
      return res.redirect("/login");
    }

    var newUser = new User ({
      username: username,
      password: password,
      displayName: displayName
    });

    newUser.save(next);

    });
  }, passport.authenticate("login", {
    successRedirect: "/app",
    failureRedirect: "/signup",
}));

app.use(require("./api-routes.js")());

app.listen(5000, function() {
  console.log('listening on port 5000.');
});
