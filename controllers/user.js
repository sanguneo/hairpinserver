module.exports = (express, passport) => {
	const router		= express.Router();
	const multer		= require('multer');
	const fs			= require('fs');
	
	const uploadPath = 'upload/profiles';
	const profileUpload	= multer({ dest: uploadPath });
	
	const mUser = require('../models/user');
	const { mFollow } = require('../models/follow');
	
	const validation	= require('./user.validation');
	
	router.use((req, res, next) => {
	    res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	    next();
	});

	router.all('/', (req, res) => {
	    return res.jsonp({
	        name: 'hair.pin user service API',
	        version: '1.0.0',
	    });
	});
	
	router.use(validation(['/signup', '/modify', '/login', '/vuser']));


	router.route('/signup').post(profileUpload.single('profile'), (req, res, next ) => {
		let {nickname, email, password} = req.body;
		if (!nickname || !email || !password) {
			return res.jsonp({ code: 206, service: 'user', function: 'signup', message: 'unsatisfied_param'});
		}
		passport.authenticate('signup', (error, user, info) => {
			if (error) { return res.jsonp( { code: 208, service: 'user', function: 'signup', message: 'error', error }) }
			if (info) { return res.jsonp( { code: 207, service: 'user', function: 'signup', message: info.message}); }
			if (req.file && req.file.path) {
				fs.copyFile(req.file.path, uploadPath + '/' + user.signhash, () => {
					fs.unlinkSync(req.file.path);
				});
			}
			return res.jsonp({ code: 200, service: 'user', function: 'signup', message: 'success', signhash:user.signhash});
		})(req, res, next)
	}).all((req, res) => res.jsonp({code: 209, function: 'signup', message: 'unauthorized_method'}));


	router.route('/modify').post(profileUpload.single('profile'), (req, res, next ) => {
		let {email, password} = req.body;
		if (!email || !password) {
			return res.jsonp({ code: 216, service: 'user', function: 'modify', message: 'unsatisfied_param'});
		}
		passport.authenticate('modify', (error, user, info) =>{
			if (error) { return res.jsonp( { code: 218, service: 'user', function: 'modify', message: 'error', error });}
			if (info) { return res.jsonp( { code: 217, service: 'user', function: 'modify', message: info.message }); }
			if (req.file && req.file.path) {
				fs.unlink(uploadPath + '/' + user.signhash, (err) => {
					if(err) console.log('"' + uploadPath + '/' + user.signhash+'" file are not exist.' );
					fs.copyFile(req.file.path, uploadPath + '/' + user.signhash, () => {
						fs.unlinkSync(req.file.path);
					});
				});
			}
			return res.jsonp({ code: 210, service: 'user', function: 'modify', message: 'success', signhash:user.signhash });
		})(req, res, next)
	}).all((req, res) => res.jsonp({ code: 219, service: 'user', function: 'modify', message: 'unauthorized_method'}));


	router.route('/login').post((req, res, next ) => {
		let {email, password} = req.body;
		if (!email || !password) {
			return res.jsonp({ code: 226, service: 'user', function: 'login', message: 'unsatisfied_param'});
		}
		passport.authenticate('login', (error, user, info) => {
			if (error) { return res.jsonp( { code: 228, service: 'user', function: 'login', message: 'error', error }); }
			if (info) { return res.jsonp( { code: 227, service: 'user', function: 'login', message: info.message }); }
			return res.jsonp({ code: 220, service: 'user', function: 'login', message: 'success', token: user.token,
				_id:user.user._id, nickname:user.user.nickname, email:user.user.email, signhash:user.user.signhash });

		})(req, res, next);
	}).all((req, res) => res.jsonp({ code: 229, service: 'user', function: 'login', message: 'unauthorized_method'}));
	
	router.route('/follow').post((req, res) => {
		let {signhash} = req.body;
		let myhash = req.decoded.signhash;
		if (!signhash) {
			return res.jsonp({ code: 236, service: 'user', function: 'follow', message: 'unsatisfied_param'});
		}
		mUser.findOne({signhash},(error, user) => {
			if(error) {
				return res.jsonp({ code: 238, service: 'user', function: 'follow', message: 'error', error });
			}
			if(!user) {
				return res.jsonp({ code: 237, service: 'user', function: 'follow', message: info.message });
			}
			if (!user.follower.find((e)=> e.signhash === myhash)){
				user.follower.push(new mFollow({
					signhash : myhash
				}));
				user.save().then(() => {
					return res.jsonp({ code: 230, service: 'user', function: 'follow', message: 'success', target: user.nickname });
				}).catch((error)=> {
					return res.jsonp({ code: 238, service: 'user', function: 'follow', message: 'error', error});
				});
			} else {
				return res.jsonp({ code: 231, service: 'user', function: 'follow', message: 'following', target: user.nickname });
			}
		})
	}).all((req, res) => res.jsonp({ code: 239, service: 'user', function: 'follow', message: 'unauthorized_method' }));

	router.route('/unfollow').post((req, res) => {
		let {signhash} = req.body;
		let myhash = req.decoded.signhash;
		if (!signhash) {
			return res.jsonp({ code: 236, service: 'user', function: 'unfollow', message: 'unsatisfied_param'});
		}
		mUser.findOne({signhash},(error, user) => {
			if(error) {
				return res.jsonp({ code: 248, service: 'user', function: 'unfollow', message: 'error', error });
			}
			if(!user) {
				return res.jsonp({ code: 247, service: 'user', function: 'unfollow', message: 'nouser' });
			}
			if (user.follower.find((e)=> e.signhash === myhash)){
				user.follower = user.follower.filter((follower) => follower.signhash !== myhash);
				user.save().then(() => {
					return res.jsonp({ code: 240, service: 'user', function: 'unfollow', message: 'success', target: user.nickname });
				}).catch((error)=> {
					return res.jsonp({ code: 248, service: 'user', function: 'unfollow', message: 'error', error });
				});
			} else {
				return res.jsonp({ code: 241, service: 'user', function: 'unfollow', message: 'unfollowing', target: user.nickname });
			}
		})
	}).all((req, res) => res.jsonp({ code: 249, service: 'user', function: 'unfollow', message: 'unauthorized_method' }));
	
	router.route('/vuser/:signhash').get((req, res) => {
		let {signhash} = req.params;
		if (!signhash) {
			return res.jsonp({ code: 256, service: 'user', function: 'viewuser', message: 'unsatisfied_param'});
		}
		mUser.findOne({signhash},['_id', 'signhash', 'email', 'nickname', 'follower', 'following'],(error, user) => {
			if(error) {
				return res.jsonp({ code: 258, service: 'user', function: 'viewuser', message: 'error', error });
			}
			if(!user) {
				return res.jsonp({ code: 237, service: 'user', function: 'viewuser', message: info.message });
			}
			return res.jsonp({ code: 250, service: 'user', function: 'viewuser', message: 'success', ...user, fwcount: user.follower.length, ficount: user.following.length});
		})
	}).all((req, res) => res.jsonp({ code: 259, service: 'user', function: 'viewuser', message: 'unauthorized_method' }));

	return router;
};
