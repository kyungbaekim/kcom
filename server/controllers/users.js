var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {
  index: function(req, res) {
    User.find({}, function(err, users){
      if(err){
        console.log(err);
      }
      else{
        res.json(users);
      }
    })
  },

  getUser: function(req, res){
    console.log("session data from getUser:", req.session)
    User.findById(req.session.passport.user, function(err, user) {
      if(err) {
        console.log(err);  // handle errors
        res.json(err);
      } else {
        res.json(user);
      }
    });
  },

  login: function(req, res) {
    console.log("Session data from login: ", req.session)
    res.json(req.session)
	}
}
