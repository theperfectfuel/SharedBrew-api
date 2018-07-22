var express = require('express');
var Router = express.Router();
var path = require('path');
var checkLoggedIn = require('../middleware/checkLoggedIn');
var Recipe = require('../models/Recipe');
var ShoppingList = require('../models/ShoppingList');
var User = require('../models/User');

var passport = require('passport');
const jwtAuth = passport.authenticate('jwt', {session: false});

//======================================
// API RESOURCE ROUTES
//======================================
//======================================
// RECIPES
//======================================

Router.get('/list-recipes', (req, res) => {
	// use mongoose to get all recipes in the database
	Recipe.find((err, recipes) => {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
		    return res.send(err);
		}
		console.log('is authenticated', req.user);
		return res.json(recipes); // return all recipes in JSON format
	});
});

Router.get('/list-recipes/:recipeID', (req, res) => {
	// use mongoose to get one recipe in the database
	Recipe.findById(req.params.recipeID, (err, recipe) => {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
		    return res.send(err);
		} else {
			console.log('sending this over: ', recipe);
			return res.json(recipe); // return one recipe in JSON format
		}
	});
});

Router.post('/new-recipe', jwtAuth, (req, res) => {

	const _user = User.find({username: req.user.username}, (err, _user) => {
		console.log('saving recipe for user: ', _user);
	});

	console.log('req.body from post route ', req.body);

	const recipe = new Recipe({
		beer_name: req.body.beer_name, 
		beer_style: req.body.beer_style, 
		beer_abv: req.body.beer_abv, 
		beer_ibu: req.body.beer_ibu, 
		beer_srm: req.body.beer_srm,
		grains_list: req.body.grains_list, 
		hops_list: req.body.hops_list, 
		yeast_list: req.body.yeast_list, 
		other_list: req.body.other_list,
		orig_grav: req.body.orig_grav, 
		final_grav: req.body.final_grav, 
		brew_difficulty: req.body.brew_difficulty, 
		batch_size: req.body.batch_size, 
		brew_instructions: req.body.brew_instructions
	});
	
	recipe._brewer = _user.id;
	recipe.save((err, recipe) => {
		if (err) {
			res.status(500).send('An error occurred');
			return console.log('error saving ', err);
		} else {
			console.log('Recipe saved successfully');
			//res.status(202).send(recipe);
			res.send('recipe saved successfully');
		}
	});
});

//======================================
// SHOPPING LISTS
//======================================

Router.get('/shopping-lists', jwtAuth, (req, res) => {

	const _user = User.find({username: req.user.username}, (err, _user) => {
		console.log('getting shopping lists for user: ', _user[0]);
		console.log('and _user.id is: ', _user[0]._id);
		console.log('and _user.username is: ', _user[0].username);

	});
	// use mongoose to get user's shopping lists in the database
	ShoppingList.find({_brewer: _user[0]._id}, null, {sort: {createdDate: -1}}, (err, shoppingLists) => {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
		    return res.json(
				{
					"the error we found is: ": err,
					"the user is: ": req.user
				}
			);
		} else if (!shoppingLists) {
			return res.json('no shopping lists for this user');
		} else {
			console.log('inside ShoppingList.find else block _user.username is: ', _user[0].username);
			var brewer;
			brewer = _user[0].username;
			shoppingLists.push({brewer: brewer});
			console.log('shopping lists: ', shoppingLists);
			return res.json(shoppingLists); // return all shopping lists in JSON format
		}
	});
});

Router.get('/shopping-list/:shoppingListID', jwtAuth, checkLoggedIn, (req, res) => {
	// use mongoose to get one shopping list in the database
	ShoppingList.findById(req.params.shoppingListID, (err, shoppingList) => {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
		    return res.send(err);
		} else {
			return res.json(shoppingList); // return one shopping list in JSON format
		}
	});
});

Router.post('/shopping-list/:recipeID', jwtAuth, (req, res) => {
	var shoppingList = new ShoppingList(req.body);

	const _user = User.find({username: req.user.username}, (err, _user) => {
		console.log('user is now: ', _user[0]);
	});

	console.log('i can find user outside of the find method: ', _user[0]);
	console.log('i can find user id outside of the find method: ', _user[0]._id);

	shoppingList._brewer = _user[0]._id;
	shoppingList.save((err, shoppingList) => {
		if (err) {
			res.status(500).send('An error occurred');
			return console.log('error saving ', err);
		} else {
			console.log('List saved successfully');
			res.status(202).send('list saved successfully');
		}
	})
	.catch(err => {
		console.log('error saving shopping list: ', err);
	})
});

//======================================
// CATCH ALL ROUTE
//======================================
Router.get('*', (req, res) => {
	res.send('could not find route');
});

module.exports = Router;