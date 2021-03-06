var express  = require('express');
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var root = __dirname;
var port = process.env.PORT || 8000;
var app = express();

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '1mb'}));
app.use(cookieParser());

require('./server/config/passport')(passport); // pass passport for configuration

// required for passport
app.use(session({
	secret: 'ilovek-community!', // session secret
	resave: false,
	saveUninitialized: true,
	httpOnly: true,
	secure: true,
	ephemeral: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Static MW
app.use(express.static(path.join(root, 'client')));
app.use(express.static(path.join(root, 'node_modules')));

require('./server/config/mongoose.js');
require('./server/config/routes.js')(app, passport); // set routes to 'app'

app.listen(port, function() {
	console.log("server running on port " + port);
});
