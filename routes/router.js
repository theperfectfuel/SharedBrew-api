var express = require('express');
var Router = express.Router();
var path = require('path');
var passport = require('passport');

var Recipe = require('../models/Recipe');
var ShoppingList = require('../models/ShoppingList');
var User = require('../models/User');

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

//======================================
// AUTH ROUTES
//======================================
//======================================
// register
//======================================
Router.get('/register', (req, res) => {
	res.sendFile(path.resolve('public/views/register.html'));
});

Router.post('/register', (req, res) => {
	console.log(req.body.userName, req.body.email, req.body.password);
	User.register(new User(
		{username: req.body.username, email: req.body.email}), 
		req.body.password, 
		(err, user) => {
			if(err) {
				console.log(err);
				return res.render('register');
			}
			passport.authenticate('local')(req, res, () => {
				console.log(user);
				res.redirect('/list-recipes');
			})
		});
})


//======================================
// login / logout
//======================================

Router.get('/login', (req, res) => {
	res.sendFile(path.resolve('public/views/login.html'));
});

Router.post('/login', passport.authenticate('local', {
	successRedirect: '/list-recipes',
	failureRedirect: '/login'
}) ,(req, res) => {
});

Router.get('/logout', (req, res) => {
	console.log('is authenticated', req.isAuthenticated());
	req.logout();
	res.redirect('/');
})

//======================================
// API RESOURCE ROUTES
//======================================
Router.get('/list-recipes', isLoggedIn, function(req, res) {
	console.log('is authenticated', req.isAuthenticated());
	// use mongoose to get all recipes in the database
	Recipe.find(function(err, recipes) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
		    return res.send(err);

		return res.json(recipes); // return all recipes in JSON format
	});
});

Router.get('/list-recipes/:recipeID', function(req, res) {
	// use mongoose to get one recipe in the database
	Recipe.findOne({_id: req.query.recipeID}, function(err, recipe) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
		    return res.send(err);
		} else {
			return res.json(recipe); // return one recipe in JSON format
		}
	});
});

Router.get('/shopping-lists', function(req, res) {
	var user_id = req.user.sub;
	// use mongoose to get user's shopping lists in the database
	ShoppingList.where('brewer', user_id).find(function(err, shoppingLists) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
		    return res.send(err);
		} else {
			return res.json(shoppingLists); // return all recipes in JSON format
		}
	});
});

Router.post('/new-recipe', function(req, res) {
	var recipe = new Recipe(req.body);
	recipe.brewer = req.user.sub;
	recipe.save(function(err, recipe) {
		if (err) {
			res.status(500).send('An error occurred');
			return console.log('error saving ', err);
		} else {
			console.log('Recipe saved successfully');
			res.status(202).send(recipe);
		}
	});
});

Router.post('/shopping-list/:recipeID', function(req, res) {
	var shoppingList = new ShoppingList(req.body);
	shoppingList.brewer = req.user.sub;
	shoppingList.save(function(err, shoppingList) {
		if (err) {
			res.status(500).send('An error occurred');
			return console.log('error saving ', err);
		} else {
			console.log('List saved successfully');
			res.status(202).send(shoppingList);
		}
	});
});

//======================================
// CATCH ALL ROUTE
//======================================
Router.get('*', function(req, res) {
	res.sendFile(path.resolve('public/views/home.html'));
});

module.exports = Router;