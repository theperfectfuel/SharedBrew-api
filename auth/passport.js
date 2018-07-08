var passport = require('passport');
//var LocalStrategy = require('passport-local');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../models/User');

//======================================
// ENV VARIABLES
//======================================
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Take User model instance and grab ID number from it to pass to done()
passport.serializeUser((user, done) => {
	done(null, user.id);
});
// Take ID number and grab User model from that
passport.deserializeUser((id, done) => {
	User.findById(id)
		.then(user => {
			done(null, user);
		})
});

//passport.use(new LocalStrategy(User.authenticate()));
passport.use(new GoogleStrategy({
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: '/auth/google/callback'}, 
		(accessToken, refreshToken, profile, done) => {

		console.log('profile: ', profile);
		User.findOne({ googleId: profile.id })
			.then((existingUser) => {
				if(existingUser) {
					console.log('user exists already');
					done(null, existingUser);
				} else {
					new User({googleId: profile.id})
						.save()
						.then(user => done(null, user));
				}
			});
		}
	)
);