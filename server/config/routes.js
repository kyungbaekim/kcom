var businesses = require("../controllers/businesses.js");
var categories = require("../controllers/categories.js");

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

}
