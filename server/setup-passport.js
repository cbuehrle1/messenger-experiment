var passport = require("passport");
var User = require("./models/user");
var LocalStrategy = require("passport-local").Strategy;
var flash = require("connect-flash");
var mongoose = require("mongoose");

module.exports = function() {

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use("login", new LocalStrategy({

    username: 'username',
    password: 'password',
    passReqToCallback : true

  }, function(req, username, password, done) {
      console.log(username)
      User.findOne({ username: username}, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done (null, false, req.flash('login', 'No User Found'));
        }
        user.checkPassword(password, function(err, isMatch) {
          if (err) { return done(err); }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, req.flash('login', 'Invalid Email or Password'));
          }
        });
      });
    }));

}
