var businesses = require("../controllers/businesses.js");
var categories = require("../controllers/categories.js");
var users = require("../controllers/users.js");

module.exports = function(app, passport) {
	/* Businesses */
	// for creating a new business
	app.post('/businesses', function(req, res){
		businesses.create(req, res);
	})

	/* Categories */
	// returns list of categories in JSON
	app.get('/categories', function(req, res){
		categories.index(req, res);
	})
	// for creating a new category
	app.post('/categories', function(req, res){
		categories.create(req, res);
	})

	/* Users */
	// get all users
	app.get('/getAllUsers', function (req, res){
		users.index(req, res);
	})

	app.get('/getUser', isLoggedIn, function (req, res){
		users.getUser(req, res);
	})

	// process the signup form
  app.post('/register', passport.authenticate('local-signup'), function(req, res) {
		users.login(req, res);
  });

	// process the login form
	app.post('/login', passport.authenticate('local-login'), function(req, res) {
		users.login(req, res);
	});

	// facebook -------------------------------
  // send to facebook to do the authentication
  app.get('/auth/facebook', passport.authenticate('facebook'));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', passport.authenticate('facebook'), function(req, res) {
		users.getUser(req, res);
		// res.redirect('/getUser');
  });

	app.get('/getSession', function(req, res){
		if(req.session.passport && req.session.passport.user){
			users.getUser(req, res);
		}
		res.json(req.session);
	})

	// process logout
	app.get('/logout', function(req, res) {
    req.logout();
		res.status(200).json({
	    status: 'Bye!',
	  });
	})
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
