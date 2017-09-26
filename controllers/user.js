
module.exports = (express, passport, multer) => {
	const router      = express.Router();
	const uploadPath = 'upload/profiles';
	const profileUpload	= multer({ dest: uploadPath });
	const fs = require('fs');
	/*
	var fs = require('fs');
	fs.copyFileSync =(s,d) => {
		return fs.createReadStream(s).pipe(fs.createWriteStream(d));
	}
	*/
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
		passport.authenticate('signup', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) { return res.jsonp( { service: 'signup', message: info.message }) }
			fs.unlink(uploadPath + '/' + user.signhash, () => {
				fs.copyFileSync(req.file.path, uploadPath + '/' + user.signhash);
			});
			return res.jsonp({service: 'signup', message: 'success', signhash:user.signhash});
		})(req, res, next)
	});
	router.post('/modify', profileUpload.single('profile'), (req, res, next ) => {
		passport.authenticate('modify', function(err, user, info) {
			if (err) { return next(err) }
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
		passport.authenticate('login', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) { return res.jsonp( { service: 'login', message: info.message }) }
			return res.jsonp({service: 'login', message: 'success', signhash:user.signhash});
		})(req, res, next);
	});

	return router;
};
