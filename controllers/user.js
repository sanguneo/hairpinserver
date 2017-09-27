const multer		= require('multer');
const fs			= require('fs');

module.exports = (express, passport, mongoose) => {
	const router      = express.Router();
	const uploadPath = 'upload/profiles';
	const profileUpload	= multer({ dest: uploadPath });
	const mUser = require('../models/user');
	const { mFollow } = require('../models/follow');
	router.use((req, res, next) => {
	    res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	    next();
	});
	router.get('/', (req, res) => {
	    res.jsonp({
	        name: 'hair.pin user API',
	        version: '1.0',
	    });
	});

	router.post('/signup', profileUpload.single('profile'), (req, res, next ) => {
		passport.authenticate('signup', function(error, user, info) {
			if (error) { return next(error) }
			if (!user) { return res.jsonp( { service: 'signup', message: info.message }) }
			fs.unlink(uploadPath + '/' + user.signhash, () => {
				fs.copyFileSync(req.file.path, uploadPath + '/' + user.signhash);
			});
			return res.jsonp({service: 'signup', message: 'success', signhash:user.signhash});
		})(req, res, next)
	});
	router.post('/modify', profileUpload.single('profile'), (req, res, next ) => {
		passport.authenticate('modify', function(error, user, info) {
			if (error) { return next(error) }
			if (!user) { return res.jsonp( { service: 'modify', message: info.message }) }
			fs.unlink(uploadPath + '/' + user.signhash, () => {
				fs.copyFile(req.file.path, uploadPath + '/' + user.signhash, () => {
					fs.unlinkSync(req.file.path);
				});
			});
			return res.jsonp({service: 'modify', message: 'success', signhash:user.signhash});
		})(req, res, next)
	});
	router.post('/login', (req, res, next ) => {
		passport.authenticate('login', function(error, user, info) {
			if (error) { return next(error) }
			if (!user) { return res.jsonp( { service: 'login', message: info.message }) }
			return res.jsonp({service: 'login', message: 'success', signhash:user.signhash});
		})(req, res, next);
	});
	router.post('/follow/:signhash/:myhash/:nickname', (req, res) => {
		let {signhash, myhash, nickname} = req.body;
		mUser.findOne({signhash},function(error, user) {
			if(error) {
				res.jsonp({service: 'follow', message: 'error', error});
				return res.end();
			}
			if(!user) {
				res.jsonp({service: 'follow', message: 'nouser'});
				return res.end();
			}
			if (!user.follower.find((e)=> e.signhash === myhash)){
				user.follower.push(new mFollow({
					signhash : myhash,
					nickname
				}));
				user.save().then(() => {
					res.jsonp({service: 'follow', message: 'success', followTarget: user.nickname});
				}).catch((error)=> {
					res.jsonp({service: 'follow', message: 'error', error});
					return res.end();
				});
			} else {
				res.jsonp({service: 'follow', message: 'following', followTarget: user.nickname});
			}

		})
	});
	router.post('/unfollow/:signhash/:myhash', (req, res) => {
		let {signhash, myhash} = req.body;
		mUser.findOne({signhash},function(error, user) {
			if(error) {
				res.jsonp({service: 'follow', message: 'error', error});
				return res.end();
			}
			if(!user) {
				res.jsonp({service: 'follow', message: 'nouser'});
				return res.end();
			}
			if (user.follower.find((e)=> e.signhash === myhash)){
				user.follower = user.follower.filter((follower) => follower.signhash !== myhash);
				user.save().then(() => {
					res.jsonp({service: 'unfollow', message: 'success', unfollowTarget: user.nickname});
				}).catch((error)=> {
					res.jsonp({service: 'unfollow', message: 'error', error});
					return res.end();
				});
			} else {
				res.jsonp({service: 'unfollow', message: 'unfollowing', unfollowTarget: user.nickname});
			}


		})
	});

	return router;
};
