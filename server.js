require('dotenv').config()
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var morgan = require('morgan');
var cookieSession = require('cookie-session');
//var cors = require('cors');
var Router = require('./routes/router');

app.use(function(req,res,next){
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, X-Auth-Token');
	if (req.method === "OPTIONS") {
		return res.send(204);
	}
	next();
  })


//======================================
// ENV VARIABLES
//======================================
var port = process.env.PORT || CONFIG.port;
var MLAB_USER = process.env.MLAB_USER;
var MLAB_PW = process.env.MLAB_PW;
var PASSPORT_SECRET = process.env.PASSPORT_SECRET;
var COOKIE_KEY = process.env.COOKIE_KEY;
var CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

require('./auth/passport');


//======================================
// DB CONNECTION
//======================================
mongoose.connect('mongodb://' + MLAB_USER + ':' + MLAB_PW + '@ds019970.mlab.com:19970/mongotest', function(err) {
	if (err) {
		console.log('connection error', err);
	} else {
		console.log('connection successful');
	}
});

//app.use(cors());
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//======================================
// APP / PASSPORT SETUP
//======================================
// app.use(require('express-session')({
// 	secret: PASSPORT_SECRET,
// 	resave: false,
// 	saveUninitialized: false
// }));
app.use(cookieSession({
	maxAge: 7 * 24 * 60 * 60 * 1000,
	keys: [COOKIE_KEY]
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/', Router);

app.listen(port, function() {	
	console.log('server started');
});
