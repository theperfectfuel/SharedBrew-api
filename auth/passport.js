var passport = require('passport');
var LocalStrategy = require('passport-local');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../models/User');

//======================================
// ENV VARIABLES
//======================================
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new LocalStrategy(User.authenticate()));
passport.use(new GoogleStrategy({
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: '/auth/google/callback'
	}, (accessToken, refreshToken, profile, done) => {
		console.log('access token: ', accessToken);
		console.log('refresh token: ', refreshToken);
		console.log('profile: ', profile);
	})
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());