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
// 	password: 	{ type:String, required: true, minlength: 8 }
// },
// {
// 	timestamps: true
// });

var UserSchema = new mongoose.Schema({
    local            : {
			username     : { type: String, required: true, minlength: 4 },
			first_name   : { type: String, required: true, minlength: 2 },
			last_name    : { type: String, required: true, minlength: 2 },
      email        : {
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
      password     : String,
    },
    facebook         : {
      id           : String,
      token        : String,
      email        : String,
      name         : String
    },
    twitter          : {
      id           : String,
      token        : String,
      displayName  : String,
      username     : String
    },
    google           : {
      id           : String,
      token        : String,
      email        : String,
      name         : String
    },
	},
	{
		timestamps: true
});

UserSchema.pre('save', function(next){
	// only perform password encryption if the password is modified (user edit page maybe?) or new
	if (!this.isModified('password')) return next();

	// generate a salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(this.local.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      this.local.password = hash;
      next();
    });
  });
});

UserSchema.methods.passwordCheck = function(loginPassword){
	return bcrypt.compareSync(loginPassword, this.local.password);
};

// UserSchema.plugin(uniqueValidator);
// var User = mongoose.model('User', UserSchema);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);
