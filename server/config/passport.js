// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/users');
// var mongoose = require('mongoose');
// var User = mongoose.model('User', UserSchema);

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
      var name = user.username || user.name;
      var data = {id: user._id, name: name}
      done(null, data);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
      console.log("username: " + req.body.username + ", fname: " + req.body.fname + ", lname: " + req.body.lname + ", email: " + email + ", password: " + password)
      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
          // if there are any errors, return the error
          if (err){
            console.log(err)
            return done(err);
          }

          // check to see if theres already a user with that email
          if (user) {
            console.log("User found with given email address!")
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          } else {
            console.log("No user found!")
            // if there is no user with that email
            // create the user
            var newUser = new User();

            // set the user's local credentials
            newUser.local.username = req.body.username;
            newUser.local.first_name = req.body.fname;
            newUser.local.last_name = req.body.lname;
            newUser.local.email = email;
            newUser.local.password = password;

            // save the user
            newUser.save(function(err) {
              if (err){
                console.log("error occurred: ", err)
                throw err;
              }
              console.log(newUser)
              return done(null, newUser);
            });
          }
        });
      });
  }));
};
