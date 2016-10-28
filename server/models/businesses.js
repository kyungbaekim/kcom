var mongoose = require('mongoose');

var BusinessSchema = new mongoose.Schema({
	kor_name: 	{
		type: String,
		required: true
	},
	eng_name: 	{
		type: String,
		required: true
	},
	phone: 		{
		type: Number,
		required: true,
		validate: {
			validator: function(phone) {
				return /\d{10}/.test(phone);
				// return phone && phone>=1000000000 && phone<=9999999999;
			},
			message: "Phone number must be exactly 10 digit numbers."
		}
	},
	email: 		{
		type: String,
		validate: {
			validator: function(value) {
				return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
			},
			message: "Email failed validation. Improper format."
		}
	},
	street: 	{
		type: String,
		required: true
	},
	city: 		{
		type: String,
		required: true
	},
	state: 		{
		type: String,
		required: true,
		validate: {
			validator: function(state) {
				return state && state.length === 2;
			},
			message: "State must be exactly 2 characters."
		}
	},
	zip: 		{
		type: Number,
		required: true,
		validate: {
			validator: function(zip) {
				return zip && zip >= 10000 && zip <= 99999;
			},
			message: "Zip code must be exactly 5 digit numbers."
		}
	},
	lattitude: 	{
		type: Number,
		required: true
	},
	longitude: 	{
		type: Number,
		required: true
	},
	website: 	{
		type: String,
		validate: {
			validator: function(website) {
				return /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(website);
			},
			message: "Entered website url failed validation. Improper format."
		}
	},
	_categories:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
},
{
	timestamps: true
});

var Business = mongoose.model('Business', BusinessSchema);
