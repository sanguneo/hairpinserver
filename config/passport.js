const LocalStrategy = require('passport-local').Strategy;
const mUser = require('../conndb/models/user');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		mUser.findById(id, function(err, user) {
			done(err, user);
		});
	});
	passport.use('signup', new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true
		},
		function(req, email, password, done) {
			mUser.findOne({ 'email' : email }, function(err, user) {
				if (err) return done(err);
				if (user) {
					return done(null, false, {'message': 'emailexist'});
				} else {
					var newUser = new mUser();
					var uuid = uuidv4();
					newUser.name = req.body.name;
					newUser.email = email;
					newUser.password = newUser.generatePassword(password);
					newUser.criteria = uuid;
					newUser.synchash = uuidv5(email, uuid);
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
			mUser.findOne({ 'email' : email }, function(err, user) {
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