module.exports = (express) => {
	const router		= express.Router();
	const multer		= require('multer');
	const fs			= require('fs');
	
	const uploadPath = 'upload/designs';
	const profileUpload	= multer({ dest: uploadPath });
	
	const sDesign = require('../models/design');

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
		(file && file.path) && fs.copyFile(file.path, uploadPath + '/' + filename, ()=> fs.unlinkSync(file.path));
	}

	router.route('/upload').post(profileUpload.single('design'), (req, res) => {
		const {signhash} = req.decoded;
		const {designhash} = req.body;
		if (!designhash) {
			return res.jsonp({ code: 406, service: 'design', function: 'upload', message: 'unsatisfied_param'});
		}
		['SRC_LEFT', 'SRC_RIGHT','ORG','THUMB'].forEach((item) => {
			// fsSettings(req[item], signhash + '_' + designhash + '_' + item);
			console.log(Object.keys(req.body));
		});
		return res.jsonp({ code: 400, service: 'design', function: 'upload', message: 'success', signhash});
	}).all((req, res) => res.jsonp({code: 409, service: 'design', function: 'upload', message: 'unauthorized_method'}));

	return router;
};
