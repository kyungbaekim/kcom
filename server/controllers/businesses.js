var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var Business = mongoose.model('Business');

module.exports = {
	create: function(req, res) {
		var newBusiness = new Business(req.body);
		newBusiness._categories.push(req.body.category);
		console.log(req.body);
		console.log(newBusiness);
		newBusiness.save(function(err, business){
			if(err) {
				res.status(500).send(err); // in case of server/db error
			} else {
				res.json(business);
			}
		});	
	}
}