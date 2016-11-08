// config/passport.js

// load the auth variables
var configAuth = require('./auth');

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User = require('../models/users');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    var name = user.local.username;
    console.log("User from serialize:", user);
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log("User from deserialize:",user);
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
    // console.log("username: " + req.body.username + ", fname: " + req.body.fname + ", lname: " + req.body.lname + ", email: " + email + ", password: " + password)
    // asynchronous
    // User.findOne won't fire unless data is sent back
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
          error = {dup_email: "User found with given email address!"}
          // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          return done(null, error)
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
          newUser.local.password = newUser.generateHash(password);;

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

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) { // callback with email and password from our form

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'local.email' :  email }, function(err, user) {
      // if there are any errors, return the error before anything else
      if (err) {
        console.log(err);
        return done(err);
      }

      // if no user is found or password is wrong, return the message
      if (!user || !user.passwordCheck(password)){
        req.loginError = 'Invalid email and/or password.';
        console.log(req.loginError)
        return done(null, false)
        // return done(null, false, req.flash('loginError', 'Invalid email and/or password.')); // req.flash is the way to set flashdata using connect-flash
      }

      // all is well, return successful user
      return done(null, user);
    });
  }));

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(new FacebookStrategy({
    display: "popup",
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  // asynchronous
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      console.log("Profile: ", profile)
      User.findOne({ 'facebook.id': profile.id }, function(err, user) {
        if(err) {
          console.log(err);  // handle errors!
          return done(err);
        }
        if (!err && user !== null) {
          console.log("User found...")
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.name = profile.displayName;
          newUser.facebook.email = profile.emails[0].value;
          newUser.facebook.picture = profile.photos[0].value;
          newUser.save(function(err) {
            if(err) {
              console.log(err);  // handle errors!
              return done(err);
            } else {
              console.log("saving user ...");
              return done(null, user);
            }
          });
        }
      });
    })
  }));

//   passport.use(new FacebookStrategy({
//     // pull in our app id and secret from our auth.js file
//     clientID        : configAuth.facebookAuth.clientID,
//     clientSecret    : configAuth.facebookAuth.clientSecret,
//     callbackURL     : configAuth.facebookAuth.callbackURL,
//     passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
//   },
//
//   // facebook will send back the token and profile
//   function(req, token, refreshToken, profile, done) {
//     // asynchronous
//     process.nextTick(function() {
//
//       // check if the user is already logged in
//       if (!req.user) {
//
//         // find the user in the database based on their facebook id
//         User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
//
//           // if there is an error, stop everything and return that
//           // ie an error connecting to the database
//           if (err)
//             return done(err);
//
//           // if the user is found, then log them in
//           if (user) {
//             return done(null, user); // user found, return that user
//           } else {
//             // if there is no user found with that facebook id, create them
//             var newUser = new User();
//             console.log("Profile:", profile)
//             console.log("Token:", token)
//
//             // set all of the facebook information in our user model
//             newUser.facebook.id    = profile.id; // set the users facebook id
//             // newUser.facebook.token = token; // we will save the token that facebook provides to the user
//             newUser.facebook.name  = profile.displayName; // look at the passport user profile to see how names are returned
//             // newUser.facebook.email = profile.email.value; // facebook can return multiple emails so we'll take the first
//
//             // save our user to the database
//             newUser.save(function(err) {
//               if (err)
//                 throw err;
//
//               // if successful, return the new user
//               return done(null, newUser);
//             });
//           }
//         });
//       } else {
//         // user already exists and is logged in, we have to link accounts
//         var user = req.user; // pull the user out of the session
//
//         // update the current users facebook credentials
//         user.facebook.id    = profile.id;
//         // user.facebook.token = token;
//         user.facebook.name  = profile.displayName;
//         // user.facebook.email = profile.emails[0].value;
//
//         // save the user
//         user.save(function(err) {
//           if (err)
//             throw err;
//           return done(null, user);
//         });
//       }
//     });
//   }));
};
