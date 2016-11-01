var businesses = require("../controllers/businesses.js");
var categories = require("../controllers/categories.js");

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
	// process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/users/new', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

	app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
