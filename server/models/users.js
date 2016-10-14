var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: function(value) {
				return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
			},
			message: "Email failed validation. Improper format."
		}
	},
	username: 	{ type: String, required: true, minlength: 4 },
	first_name: { type: String, required: true, minlength: 2 },
	last_name: 	{ type: String, required: true, minlength: 2 },
	password: 	{ type:String, required: true, minlength: 8 }
}, 
{
	timestamps: true
});

UserSchema.pre('save', function(done){
	// only perform password encryption is the password is modified (user edit page maybe?) or new
	if (this.isModified('password')){
		this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
	}
	done();
});

UserSchema.methods.passwordCheck = function( loginPassword ){
	return bcrypt.compareSync(loginPassword, this.password);
};

UserSchema.plugin(uniqueValidator);

var User = mongoose.model('User', UserSchema);