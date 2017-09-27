const LocalStrategy = require('passport-local').Strategy;
const mUser = require('../../models/user');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');

module.exports = function(passport) {
	passport.use('signup', new LocalStrategy({
			usernameField : 'email', // id 필드로 email 을 사용한다.
			passwordField : 'password',
			passReqToCallback : true
		},
		function(req, email, password, done) {
			mUser.findOne({ 'email' : email }, function(err, user) {
				if (err) return done(err);
				if (user) {
					return done(null, false, {'message': 'emailexist'});
				} else {
					let newbie = new mUser({
						nickname : req.body.name,
						email,
						password : newbie.genPw(password),
						signhash : uuidv5(email, uuidv4())
					});
					newbie.save(function(err) {
						if (err) throw err;
						return done(null, newbie);
					});
				}
			});
		})
	);
	passport.use('modify', new LocalStrategy({
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
				if (!user.validPw(password)) {
					return done(null, false, {'message': 'invalidpw'});
				} else {
					user.nickname = req.body.name;
					user.password = user.genPw(password);
					if (req.profile) {
						user.profileReg = new Date();
					}
					user.save(function(err) {
						if (err) throw err;
						return done(null, user);
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
				if (!user.validPw(password)) {
					return done(null, false, {'message': 'invalidpw'});
				}
				return done(null, user);
			});
		})
	);
};