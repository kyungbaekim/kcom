var express  = require('express');
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var root = __dirname;
var port = process.env.PORT || 8000;
var app = express();

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '1mb'}));
app.use(cookieParser());

// Static MW
app.use( express.static( path.join( root, 'client' )));
app.use( express.static( path.join( root, 'node_modules' )));

require('./server/config/mongoose.js');
require('./server/config/routes.js')(app); // set routes to 'app'

app.listen( port, function() {
	console.log("server running on port ${ port }");
});
