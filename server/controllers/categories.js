var mongoose = require('mongoose');
var Category = mongoose.model('Category');

/* categories not stored in db. return "hard" list of topics */
module.exports = {
	index: function(req, res) {
		Category.find({}, function(err, categories){
			if(err) {
				res.status(500).send(err); // in case of server/db error
			} else {
				res.json(categories);
			}
		});
	},
	create: function(req, res) {
		var newCategory = new Category(req.body);
		newCategory.save(function(err, category){
			if(err) {
				res.status(500).send(err); // in case of server/db error
			} else {
				res.json(category);
			}
		});	
	}
}