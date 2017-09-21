const LocalStrategy = require('passport-local').Strategy;
const User = require('../conndb/models/user');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	passport.use('signup', new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true
		},
		function(req, email, password, done) {
			User.findOne({ 'email' : email }, function(err, user) {
				if (err) return done(err);
				if (user) {
					return done(null, false, {'message': 'emailexist'});
				} else {
					var newUser = new User();
					newUser.name = req.body.name;
					newUser.email = email;
					newUser.password = newUser.generateHash(password);
					newUser.criteria = uuidv5(email, uuidv4());
					newUser.save(function(err) {
						if (err) throw err;
						return done(null, newUser);
					});
				}
			});
		})
	);
	passport.use('login', new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true
		},
		function(req, email, password, done) {
			User.findOne({ 'email' : email }, function(err, user) {
				if (err) return done(err);
				if (!user) {
					return done(null, false, {'message': 'noaccount'});
				}
				if (!user.validPassword(password)) {
					return done(null, false, {'message': 'invalidpw'});
				}
				return done(null, user);
			});
		})
	);
};