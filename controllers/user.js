module.exports = (express, passport) => {
	const router		= express.Router();
	const multer		= require('multer');
	const fs			= require('fs');
	
	const uploadPath = 'upload/profiles';
	const profileUpload	= multer({ dest: uploadPath });
	
	const mUser = require('../models/user');

	const validation	= require('./user.validation');
	
	router.use((req, res, next) => {
	    res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, nekotnipriah");
	    next();
	});

	router.all('/', (req, res) => {
	    return res.jsonp({
	        name: 'hair.pin user service API',
	        version: '1.0.0',
	    });
	});
	
	router.use(validation(['/signup', '/modify', '/login']));


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
			const ret = {
				token: user.token,
				_id:user.user._id,
				nickname:user.user.nickname,
				email:user.user.email,
				signhash:user.user.signhash,
				designsize: 0, //user.user.designsize.length
				followersize: user.user.follower.length,
				followingsize: user.user.following.length,
			}
			return res.jsonp({ code: 220, service: 'user', function: 'login', message: 'success', ...ret});

		})(req, res, next);
	}).all((req, res) => res.jsonp({ code: 229, service: 'user', function: 'login', message: 'unauthorized_method'}));
	
	router.route('/follow').post((req, res) => {
		let {signhash} = req.body;
		let myhash = req.decoded.signhash;
		if (!signhash) {
			return res.jsonp({ code: 236, service: 'user', function: 'follow', message: 'unsatisfied_param'});
		}
		mUser.findOne({signhash}, ['_id', 'nickname', 'follower'], (error, destuser) => {
			if(error) {
				return res.jsonp({ code: 238, service: 'user', function: 'follow', message: 'error', error });
			}
			if(!destuser) {
				return res.jsonp({ code: 237, service: 'user', function: 'follow', message: info.message });
			}
			if (!destuser.follower.includes(myhash)){
				destuser.follower.push(myhash);
				destuser.save().then(() => {
					mUser.findOne({signhash: myhash}, ['_id', 'nickname', 'following'], (error, srcuser) => {
						if(error) return res.jsonp({ code: 238, service: 'user', function: 'follow', message: 'error', error });
						if (!srcuser.following.includes(signhash)){
							srcuser.following.push(signhash);
							srcuser.save().then(() => {
								return res.jsonp({ code: 230, service: 'user', function: 'follow', message: 'success', target: destuser.nickname });
							}).catch((error)=> {
								return res.jsonp({ code: 238, service: 'user', function: 'follow', message: 'error', error});
							});
						} else {
							return res.jsonp({ code: 231, service: 'user', function: 'follow', message: 'following', target: srcuser.nickname });
						}
					});
				}).catch((error)=> res.jsonp({ code: 238, service: 'user', function: 'follow', message: 'error', error}));
			} else {
				return res.jsonp({ code: 231, service: 'user', function: 'follow', message: 'following', target: destuser.nickname });
			}
		});

	}).all((req, res) => res.jsonp({ code: 239, service: 'user', function: 'follow', message: 'unauthorized_method' }));

	router.route('/unfollow').post((req, res) => {
		let {signhash} = req.body;
		let myhash = req.decoded.signhash;
		if (!signhash) {
			return res.jsonp({ code: 236, service: 'user', function: 'unfollow', message: 'unsatisfied_param'});
		}
		mUser.findOne({signhash}, ['_id', 'nickname', 'follower'], (error, destuser) => {
			if(error) return res.jsonp({ code: 248, service: 'user', function: 'unfollow', message: 'error', pos: 'dest', error });
			if(!destuser) return res.jsonp({ code: 247, service: 'user', function: 'unfollow', message: 'nouser', pos: 'dest' });
			let uidx = destuser.follower.indexOf(myhash);
			if (uidx !== -1){
				destuser.follower.splice(uidx, 1);
				destuser.save().then(() => {
					mUser.findOne({signhash: myhash}, ['_id', 'nickname', 'following'], (error, srcuser) => {
						if(error) return res.jsonp({ code: 248, service: 'user', function: 'unfollow', message: 'error', error });
						let uidx = srcuser.following.indexOf(signhash);
						if (uidx !== -1){
							srcuser.following.splice(uidx, 1);
							srcuser.save().then(() => res.jsonp({ code: 240, service: 'user', function: 'unfollow', message: 'success', target: destuser.nickname }))
								.catch((error) => res.jsonp({ code: 248, service: 'user', function: 'unfollow', message: 'error', error }));
						} else {
							return res.jsonp({ code: 241, service: 'user', function: 'unfollow', message: 'unfollowing', target: srcuser.nickname });
						}
					});
				}).catch((error)=> res.jsonp({ code: 248, service: 'user', function: 'unfollow', message: 'error', error }));
			} else {
				return res.jsonp({ code: 241, service: 'user', function: 'unfollow', message: 'unfollowing', target: user.nickname });
			}
		});

	}).all((req, res) => res.jsonp({ code: 249, service: 'user', function: 'unfollow', message: 'unauthorized_method' }));
	
	router.route('/vuser/:signhash').get((req, res) => {
		let {signhash} = req.params;
		let myhash = req.decoded.signhash;
		if (!signhash || !myhash) return res.jsonp({ code: 256, service: 'user', function: 'viewuser', message: 'unsatisfied_param'});
		mUser.findOne({signhash},['_id', 'signhash', 'email', 'nickname', 'follower', 'following'],(error, user) => {
			if(error) return res.jsonp({ code: 258, service: 'user', function: 'viewuser', message: 'error', error });
			const ret = {
				_id: user._id,
				signhash: user.signhash,
				email: user.email,
				nickname: user.nickname,
				follower: user.follower,
				following: user.following,
				designsize: 0, //user.user.designsize.length
				followersize: user.follower.length,
				followingsize: user.following.length,
				amIfollowing: user.follower.includes(myhash)
			}
			return res.jsonp({ code: 250, service: 'user', function: 'viewuser', message: 'success', ...ret});
		})
	}).all((req, res) => res.jsonp({ code: 259, service: 'user', function: 'viewuser', message: 'unauthorized_method' }));

	router.route('/userstat').get((req, res) => {
		let signhash = req.decoded.signhash;
		if (!signhash) return res.jsonp({ code: 266, service: 'user', function: 'userstat', message: 'unsatisfied_param'});
		mUser.findOne({signhash},['follower', 'following'],(error, user) => {
			if(error) return res.jsonp({ code: 268, service: 'user', function: 'userstat', message: 'error', error });
			const ret = {
				designs: [],
				follower: user.follower,
				following: user.following,
				designsize: 0, //user.designsize.length
				followersize: user.follower.length,
				followingsize: user.following.length,
			}
			return res.jsonp({ code: 260, service: 'user', function: 'userstat', message: 'success', ...ret});
		})
	}).all((req, res) => res.jsonp({ code: 269, service: 'user', function: 'userstat', message: 'unauthorized_method' }));

	router.route(['/searchuser/:param', '/searchuser/']).get((req, res) => {
		let {param} = req.params;
		let signhash = req.decoded.signhash || 'nosignhash';
		const query = (!param || param === '') ? {} : {$or: [{nickname: {$regex: '.*' + param +'.*'}}, {email: {$regex: '.*' + param +'.*'}}]};
		mUser.find(query,['_id', 'signhash', 'nickname', 'email'],(error, user) => {
			if(error) return res.jsonp({ code: 278, service: 'user', function: 'userstat', message: 'error', error });
			return res.jsonp({ code: 270, service: 'user', function: 'userstat', message: 'success', user: user.filter((e) => e.signhash != signhash)});
		})
	}).all((req, res) => res.jsonp({ code: 279, service: 'user', function: 'userstat', message: 'unauthorized_method' }));

	router.route(['/searchtag/:param', '/searchtag/']).get((req, res) => {
		let {param} = req.params;
		let query = [{$group: {_id: "$nickname",count: { $sum: 1 },  signhash : {"$push" : "$signhash"}}}]
		if (param && param !== '') query.push({$or: [{nickname: {$regex: '.*' + param +'.*'}}, {email: {$regex: '.*' + param +'.*'}}]});
		mUser.aggregate(query).exec((error, tags) => {
			if(error) return res.jsonp({ code: 278, service: 'searchtag', function: 'userstat', message: 'error', error });
			return res.jsonp({ code: 270, service: 'searchtag', function: 'userstat', message: 'success', tags: tags.map((tag) => {return {_id: tag._id, signhash: tag.signhash[0], count: tag.count}})});
		})


	}).all((req, res) => res.jsonp({ code: 279, service: 'searchtag', function: 'userstat', message: 'unauthorized_method' }));

	return router;
};
