module.exports = (express, passport) => {
	const router		= express.Router();
	const multer		= require('multer');
	const fs			= require('fs');
	
	const uploadPath = 'upload/designs';
	const profileUpload	= multer({ dest: uploadPath });
	
	const mUser = require('../models/design');

	const validation	= require('./user.validation');
	
	router.use((req, res, next) => {
	    res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, nekotnipriah");
	    next();
	});

	router.all('/', (req, res) => {
	    return res.jsonp({
	        name: 'hair.pin design service API',
	        version: '1.0.0',
	    });
	});
	
	router.use(validation([]));

	const fsSettings = (file, filename)=> {
		(file && file.path) && fs.copyFile(file.path, uploadPath + '/' + filename, ()=>fs.unlinkSync(file.path));
	}

	router.route('/upload').post(profileUpload.single('design'), (req, res) => {
		let {nickname, email, password} = req.body;
		if (!nickname || !email || !password) {
			return res.jsonp({ code: 406, service: 'design', function: 'signup', message: 'unsatisfied_param'});
		}
		fsSettings(req.file, user.signhash);
		return res.jsonp({ code: 400, service: 'design', function: 'signup', message: 'success', signhash:user.signhash});
	}).all((req, res) => res.jsonp({code: 409, service: 'design', function: 'signup', message: 'unauthorized_method'}));

	return router;
};
