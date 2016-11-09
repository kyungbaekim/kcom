var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
// var uniqueValidator = require('mongoose-unique-validator');

// var UserSchema = new mongoose.Schema({
// 	email: {
// 		type: String,
// 		required: true,
// 		unique: true,
// 		validate: {
// 			validator: function(value) {
// 				return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
// 			},
// 			message: "Email failed validation. Improper format."
// 		}
// 	},
// 	username: 	{ type: String, required: true, minlength: 4 },
// 	first_name: { type: String, required: true, minlength: 2 },
// 	last_name: 	{ type: String, required: true, minlength: 2 },
// 	password: 	{ type: String, required: true, minlength: 8 }
// },
// {
// 	timestamps: true
// });

var UserSchema = new mongoose.Schema({
    provider       : String,
    local          : {
			username     : { type: String, minlength: 4 },
			first_name   : { type: String, minlength: 2 },
			last_name    : { type: String, minlength: 2 },
      email        : {type: String,
                      unique: true,
                      validate: {
                  			validator: function(value) {
                  				return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
                  			},
                  			message: "Email failed validation. Improper format."
                  		}
                    },
      password     : { type: String, minlength: 8 }
    },
    facebook       : {
      id           : String,
      email        : String,
      first_name   : String,
      last_name    : String,
      username     : String,
      gender       : String,
      locale       : String,
      link         : String
    },
    twitter        : {
      id           : String,
      displayName  : String,
      username     : String
    },
    google         : {
      id           : String,
      email        : String,
      name         : String
    },
	},
	{
		timestamps: true
});

// UserSchema.pre('save', function (done){
// 	var user = this;
// 	if(user.local.password){
// 		bcrypt.genSalt(10, function (err, salt){
// 			bcrypt.hash(user.local.password, salt, function (err, hash){
// 				user.local.password = hash
// 				done()
// 			});
// 		});
// 	}
// });

// generating a hash
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.passwordCheck = function(loginPassword){
	return bcrypt.compareSync(loginPassword, this.local.password);
};

// UserSchema.plugin(uniqueValidator);
// var User = mongoose.model('User', UserSchema);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);
