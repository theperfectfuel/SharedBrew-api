var express = require('express');
var Router = express.Router();
var passport = require('passport');
var checkLoggedIn = require('../middleware/checkLoggedIn');
var User = require('../models/User');

//var CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

//======================================
// AUTH ROUTES
//======================================

//======================================
// GOOGLE STRATEGY
//======================================
//======================================
// register
//======================================
// Router.get('/auth/google', passport.authenticate('google', {
// 	scope: ['profile', 'email']
// }));

// Router.get(
// 	'/auth/google/callback', 
// 	passport.authenticate('google'),
// 	(req, res) => {
// 		res.redirect('https://agile-retreat-41726.herokuapp.com/list-recipes');
// 	}
// );


//======================================
// LOCAL STRATEGY
//======================================
//======================================
// register
//======================================
// THE FOLLOWING SHOULD HAPPEN ON THE FRONT END NOW
// Router.get('/register', (req, res, next) => {
// 	res.sendFile(path.resolve('public/views/register.html'));
// });

Router.post('/register', (req, res, next) => {
	console.log(req.body.username, req.body.email, req.body.password);
	User.register(new User(
		{username: req.body.username, email: req.body.email}), 
		req.body.password, 
		(err, user) => {
			if(err) {
				console.log(err);
				return res.send('error: ', err);
			}
			passport.authenticate('local')(req, res, () => {
				console.log(user);
				res.redirect('http://localhost:3000/list-recipes');
			})
		});
})


//======================================
// login / logout
//======================================

// Router.get('/login', (req, res) => {
// 	res.sendFile(path.resolve('public/views/login.html'));
// });

Router.post('/login', passport.authenticate('local', {
	successRedirect: 'http://localhost:3000/list-recipes',
	failureRedirect: 'http://localhost:3000/login'
}) ,(req, res, next) => {
	console.log('logged in and user is: ', req.user)
});

Router.get('/logout', (req, res) => {
	console.log('is authenticated', req.isAuthenticated());
	req.logout();
	res.redirect('/');
})

Router.get('/check-user', (req, res) => {
	console.log('user: ', req.user);
	res.json(req.user);
})

module.exports = Router;