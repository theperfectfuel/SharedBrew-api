var express = require('express');
var Router = express.Router();
var path = require('path');
var passport = require('passport');
var bodyParser = require('body-parser');
var cors = require('cors');
var checkLoggedIn = require('../middleware/checkLoggedIn');

var Recipe = require('../models/Recipe');
var ShoppingList = require('../models/ShoppingList');
var User = require('../models/User');

//var CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

// Router.use(function(req,res,next){
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Credentials', true);
// 	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
// 	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, X-Auth-Token');
// 	next();
//   })

// Router.use(cors({origin: "*"}));
// Router.options('*', cors());

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
Router.get('/list-recipes', function(req, res) {
	// use mongoose to get all recipes in the database
	Recipe.find(function(err, recipes) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
		    return res.send(err);
		}
		console.log('is authenticated', req.isAuthenticated());
		return res.json(recipes); // return all recipes in JSON format
	});
});

Router.get('/list-recipes/:recipeID', function(req, res) {
	// use mongoose to get one recipe in the database
	Recipe.findById(req.params.recipeID, function(err, recipe) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
		    return res.send(err);
		} else {
			return res.json(recipe); // return one recipe in JSON format
		}
	});
});

Router.get('/shopping-lists', function(req, res) {
	//var user_id = req.user.sub;
	// use mongoose to get user's shopping lists in the database

	ShoppingList.where('brewer', '5b3c21555db7cf270ac37e47').find(function(err, shoppingLists) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
		    return res.send(err);
		} else {
			var brewer;
			User.findById('5b3c21555db7cf270ac37e47', (err, user) => {
				if (err) {
					return res.send(err);
				}
				brewer = user.username;
				shoppingLists.push({brewer: brewer});
				console.log('is authenticated', req.isAuthenticated());
				console.log('shopping lists: ', shoppingLists);
				return res.json(shoppingLists); // return all recipes in JSON format
			});
		}
	});
});

Router.post('/new-recipe', checkLoggedIn, function(req, res) {
	console.log('you made it here', req.user.id);
	// const {beer_name, beer_style, beer_abv, grains_list, hops_list, yeast_list, other_list,
	// 	orig_grav, final_grav, brew_difficulty, batch_size, brew_instructions} = req.body;

	// const recipe = new Recipe({
	// 	beer_name, beer_style, beer_abv, grains_list, hops_list, yeast_list, other_list,
	// 	orig_grav, final_grav, brew_difficulty, batch_size, brew_instructions
	// });
	console.log(req.body);

	const recipe = new Recipe({
		beer_name: req.body.beer_name, 
		beer_style: req.body.beer_style, 
		beer_abv: req.body.beer_abv, 
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
	recipe.save(function(err, recipe) {
		if (err) {
			res.status(500).send('An error occurred');
			return console.log('error saving ', err);
		} else {
			console.log('Recipe saved successfully');
			//res.status(202).send(recipe);
			res.redirect('http://localhost:3000/list-recipes');
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