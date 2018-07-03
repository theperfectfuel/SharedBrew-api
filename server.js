require('dotenv').config()
var express = require('express');
var app = express();
var jwt = require('express-jwt');
var Router = require('./routes/router');

var port = process.env.PORT || CONFIG.port;
var AUTH_SECRET = process.env.AUTH_SECRET;
var AUTH_CLIENT = process.env.AUTH_CLIENT;
var MLAB_USER = process.env.MLAB_USER;
var MLAB_PW = process.env.MLAB_PW;

var jwtCheck = jwt({
	secret: new Buffer(AUTH_SECRET, 'base64'),
	aud: AUTH_CLIENT
});

var mongoose = require('mongoose');

var path = require('path');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

mongoose.connect('mongodb://' + MLAB_USER + ':' + MLAB_PW + '@ds019970.mlab.com:19970/mongotest', function(err) {
	if (err) {
		console.log('connection error', err);
	} else {
		console.log('connection successful');
	}
});

app.use(express.static('public'));

app.use('/', Router);

app.use('/new-recipe', jwtCheck);
app.use('/shopping-lists', jwtCheck);
app.use('/shopping-list/:recipeID', jwtCheck);

app.listen(port, function() {	
	console.log('server started');
});
