var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
	korean: 	{ 
		type: String, 
		required: true 
	},
	english: 	{ 
		type: String, 
		required: true 
	}	
}, 
{
	timestamps: true
});

var Category = mongoose.model('Category', CategorySchema);