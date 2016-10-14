var businesses = require("../controllers/businesses.js"),
	categories = require("../controllers/categories.js");

module.exports = function(app) {

	/* Businesses */
	app.post('/businesses', businesses.create); // for creating a new business


	/* Categories */
	app.get('/categories', categories.index); // returns list of categories in JSON
	app.post('/categories', categories.create);	// for creating a new category

	/* Users */

}