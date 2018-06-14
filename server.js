var express = require('express');
var app = express();
var jsdom = require("jsdom");
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var port     = process.env.PORT || 8080;
var session = require('express-session');
var morgan = require('morgan');
var _ = require('lodash');
var async = require("async");
var through = require('through');
var map = require('map-stream');

var {
	JSDOM
} = jsdom;
var {
	window
} = new JSDOM();
var {
	document
} = (new JSDOM('')).window;
global.document = document;

var $ = require("jquery")(window);

// connect to database--------------
mongoose.connect('mongodb://localhost/passport'); 
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

app.use(session({
	secret: 'FSDFHDFBSGFdvydsfe32525sdgw3rwfw3',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

// routes------------------------
require('./routes')(app, passport);

// launch ----------------

app.listen(port, function () {
	console.log("listen to port " + port)
});

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
	// application specific logging, throwing an error, or other logic here
  });
