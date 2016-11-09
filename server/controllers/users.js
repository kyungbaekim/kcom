var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var sanitize = require('mongo-sanitize');
var jwt = require('jsonwebtoken');
var consts = require('../config/constant.js');
var secret = consts.jwtTokenSecret;
var token;
var User = mongoose.model('User');

module.exports = {
  index: function(req, res) {
    User.find({}, function(err, users){
      if(err){
        console.log(err);
      }
      else{
        res.json(users);
      }
    })
  },

  getUser: function(req, res){
    if(req.params.id){
      User.findById(req.params.id, function(err, user) {
        if(err) {
          console.log(err);  // handle errors
          res.json(err);
        } else {
          res.json(user);
        }
      });
    }
    else {
      console.log("session data from getUser:", req.session)
      User.findById(req.session.info.id, function(err, user) {
        if(err) {
          console.log(err);  // handle errors
          res.json(err);
        } else {
          res.json(user);
        }
      });
    }
  },

  getCookieUser: function(req, res){
    console.log("Cookie user :", req.params._id)
    User.findById(req.params._id, function(err, user) {
      if(err) {
        console.log(err);  // handle errors
        res.json(err);
      } else {
        res.json(user);
      }
    });
  },

  create: function(req, res) {
    console.log('req.body', req.body)
		var fname = sanitize(req.body.fname);
		var lname = sanitize(req.body.lname);
		var email = sanitize(req.body.email);
		var password = sanitize(req.body.password);
		var cpassword = sanitize(req.body.cpassword);
		User.findOne({ 'local.email': email }, function (err, user){
			//if user email exist, return false
			if(user){
        res.json({status: false, dup_email: "Entered email address already exists!" })
      }
			else {
				if(password.length > 7 && password == cpassword){
					//save user info
					var newUser = new User();
          newUser.provider = 'local';
					newUser.local.fname = fname;
					newUser.local.lname = lname;
					newUser.local.email = email;
					newUser.local.password= newUser.generateHash(password);
					newUser.save(function(err){
						//save user, if errors push them to errors array
						if(err){
							res.json({status: false, errors: err})
						}else{
							//user saved successfully, set web token
							token = jwt.sign({
								user: newUser
							}, secret, { expiresIn: 60 * 60 * 12 });

							//user saved successfully, set session info
              req.session.info = {
                id: newUser._id,
                token: token
              }
              req.session.loggedIn = true;
              var hour = 3600000 * 12 // 12 hours
              req.session.cookie.expires = new Date(Date.now() + hour)
              req.session.cookie.maxAge = hour

							res.json({status: true, loggedIn: true, user: user._id})
						}//end of user save
					})
				} //end of password validation
			}
		})
	},

  login: function(req, res) {
    console.log('login in server', req.body)
		var email = sanitize(req.body.email);
		var password = sanitize(req.body.password);
		if(email && password){
			User.findOne({ 'local.email': email}, function (err, user){
				if(user){ // if user found
					if(user.passwordCheck(password)){
						// password matched, set web token
						token = jwt.sign({
							user: user
						}, secret, { expiresIn: 60 * 60 * 12 });

            // create session data
            req.session.info = {
              id: user._id,
              token: token
            }
            req.session.loggedIn = true;
            var hour = 3600000 * 12 // 12 hours
            req.session.cookie.expires = new Date(Date.now() + hour)
            req.session.cookie.maxAge = hour

						res.json({status: true, loggedIn: true, user: user._id})
					} else {
						// password does not match
						// req.session.error = 'Authentication failed, please check your entered email address and password';
						res.json({status: false, error: "Invalid Email address and/or Password"})
					}
				}
				else { // user not found
					// req.session.error = 'Authentication failed, please check your entered email address and password';
					res.json({status: false, error: "Invalid Email address and/or Password"})
				}
			})
		} else { // email or password is empty
			// req.session.error = 'Authentication failed, please check your entered email address and password';
			res.json({status: false, error: "Invalid Email address and/or Password"})
		}
	},

  FBlogin: function(req, res){
    console.log("Data: ", req.body)
    var email = sanitize(req.body.email);
		var id = sanitize(req.body.id);
    var first_name = sanitize(req.body.first_name);
    var last_name = sanitize(req.body.last_name);
    var name = sanitize(req.body.name);
    var gender = sanitize(req.body.gender);
    var locale = sanitize(req.body.locale);
    var link = sanitize(req.body.link);

		if(name && id){
      console.log("name: " + name + ", id: " + id + ", email: " + email)
			User.findOne({ 'facebook.email': email}, function (err, user){
				if(user){ // if user found, set web token and session
					token = jwt.sign({
						usr: user
					}, secret, { expiresIn: 60 * 60 * 12 });

          // create session data
          req.session.info = {
            id: user._id,
            token: token
          }
          req.session.loggedIn = true;
          var hour = 3600000 * 12 // 12 hours
          req.session.cookie.expires = new Date(Date.now() + hour)
          req.session.cookie.maxAge = hour

					res.json({status: true, loggedIn: true, user: user._id})
				}
				else { // if user not found, create user with facebook response
          // save to db
          var newUser = new User();
          newUser.provider = "facebook";
					newUser.facebook.id = id;
					newUser.facebook.first_name = first_name;
          newUser.facebook.last_name = last_name;
          newUser.facebook.username = name;
					newUser.facebook.email = email;
          newUser.facebook.gender = gender;
          newUser.facebook.locale = locale;
          newUser.facebook.link = link;
					newUser.save(function(err){
						//save user, if errors push them to errors array
						if(err){
							res.json({status: false, errors: err})
						}
            else{
							//user saved successfully, set web token
							token = jwt.sign({
								user: newUser
							}, secret, { expiresIn: 60 * 60 * 12 });

							//user saved successfully, set session info
              req.session.info = {
                id: newUser._id,
                token: token
              }
              req.session.loggedIn = true;
              var hour = 3600000 * 12 // 12 hours
              req.session.cookie.expires = new Date(Date.now() + hour)
              req.session.cookie.maxAge = hour

							res.json({status: true, loggedIn: true, user: user._id})
						}//end of user save
				  })
        }
			})
		} else { // email or username is empty
      console.log("Either email or username is empty")
			req.session.error = 'Authentication failed, please check your entered email address and password';
			res.json({status: false, errors: ["Invalid facebook token!"]})
		}
  },

  logout: function(req, res){
    req.session.destroy(function(err){
		  //cannot access session here
			if(!err){
				res.json({status: true, loggedIn: false, message: "Successfully logged out."})
			}
      else{
        res.json({status: false, error: err});
      }
		})
  }
}
