var express = require('express');
var Router = express.Router();
var path = require('path');
var passport = require('passport');
var checkLoggedIn = require('../middleware/checkLoggedIn');

var Recipe = require('../models/Recipe');
var ShoppingList = require('../models/ShoppingList');
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
Router.get('/auth/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));

Router.get(
	'/auth/google/callback', 
	passport.authenticate('google'),
	(req, res) => {
		res.redirect('/list-recipes');
	}
);


//======================================
// LOCAL STRATEGY
//======================================
//======================================
// register
//======================================
// Router.get('/register', (req, res) => {
// 	res.sendFile(path.resolve('public/views/register.html'));
// });

// Router.post('/register', (req, res) => {
// 	console.log(req.body.userName, req.body.email, req.body.password);
// 	User.register(new User(
// 		{username: req.body.username, email: req.body.email}), 
// 		req.body.password, 
// 		(err, user) => {
// 			if(err) {
// 				console.log(err);
// 				return res.render('register');
// 			}
// 			passport.authenticate('local')(req, res, () => {
// 				console.log(user);
// 				res.redirect('/list-recipes');
// 			})
// 		});
// })


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
	console.log('hello');
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
		console.log('is authenticated', req.isAuthenticated());
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
			return res.json(recipe); // return one recipe in JSON format
		}
	});
});

Router.post('/new-recipe', checkLoggedIn, (req, res) => {

	if (req.user.id) {
		console.log('you made it here ', req.user.id);
	}

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
	
	recipe._brewer = req.user.id;
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

Router.get('/shopping-lists', (req, res) => {
	//var user_id = req.user.sub;
	// use mongoose to get user's shopping lists in the database
	console.log('req.user.id is : ', req.user.id)
	ShoppingList.find({_brewer: req.user.id}, null, {sort: {createdDate: -1}}, (err, shoppingLists) => {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
		    return res.json(
				{
					"the error we found is: ": err,
					"the user is: ": req.user.id
				}
			);
		} else {
			var brewer;
			User.findById(req.user.id, (err, user) => {
				if (err) {
					return res.send(err);
				}
				brewer = user.username;
				shoppingLists.push({brewer: brewer});
				console.log('is authenticated', req.isAuthenticated());
				console.log('shopping lists: ', shoppingLists);
				return res.json(shoppingLists); // return all shopping lists in JSON format
			});
		}
	});
});

Router.get('/shopping-list/:shoppingListID', checkLoggedIn, (req, res) => {
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

Router.post('/shopping-list/:recipeID', checkLoggedIn, (req, res) => {
	var shoppingList = new ShoppingList(req.body);
	shoppingList._brewer = req.user.id;
	shoppingList.save((err, shoppingList) => {
		if (err) {
			res.status(500).send('An error occurred');
			return console.log('error saving ', err);
		} else {
			console.log('List saved successfully');
			res.status(202).send('list saved successfully');
		}
	});
});

//======================================
// CATCH ALL ROUTE
//======================================
Router.get('*', (req, res) => {
	res.sendFile(path.resolve('public/views/home.html'));
});

module.exports = Router;