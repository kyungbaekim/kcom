var businesses = require("../controllers/businesses.js");
var categories = require("../controllers/categories.js");
var users = require("../controllers/users.js");

module.exports = function(app) {
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

	app.get('/getUser', function (req, res){
		users.getUser(req, res);
	})

	app.get('/getUser/:id', function (req, res){
		users.getUser(req, res);
	})

	// get user from cookie data
	app.get('/getCookieUser/:id', function (req, res){
		users.getUser(req, res);
	})

	// process the signup form
  app.post('/register', function(req, res) {
		users.create(req, res);
  });

	// process the login form
	app.post('/login', function(req, res) {
		users.login(req, res);
	});

	// facebook -------------------------------
  // process facebook login
	app.post('/FBlogin', function(req, res){
		users.FBlogin(req, res);
	})

	// get session data
	app.get('/getSession', function(req, res){
		res.json(req.session)
	})

	// process logout
	app.get('/logout', function(req, res) {
    users.logout(req, res)
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
