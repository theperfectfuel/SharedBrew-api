var express = require('express');
var Router = express.Router();

var Recipe = require('../models/Recipe');
var ShoppingList = require('../models/ShoppingList');

Router.get('/list-recipes', function(req, res) {

	// TODO implement paging
	
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

Router.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

module.exports = Router;