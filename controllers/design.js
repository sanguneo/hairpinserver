module.exports = (express) => {
	const router		= express.Router();
	const multer		= require('multer');
	const fs			= require('fs');
	
	const uploadPath = 'upload/designs';
	const profileUpload	= multer({ dest: uploadPath });
	
	const mDesign = require('../models/design');

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

	router.route('/upload').post(profileUpload.array('designimage', 4), (req, res) => {
		const {signhash} = req.decoded;
		const {designHash} = req.body;
		if (!designHash) {
			return res.jsonp({ code: 406, service: 'design', function: 'upload', message: 'unsatisfied_param'});
		}
		req.files.forEach((file) => {
			fs.renameSync(file.destination + '/' + file.filename, file.destination + '/' + file.originalname)
		})
		// mDesign.findOne({email: email}, function(err, design) {
		// 	if(err) {
		// 		return res.jsonp({ code: 400, service: 'design', function: 'upload', message: 'error', error: err});
		// 	}
		// 	if (design) {
		// 	} else {
		// 		let newdesign = new mDesign({
		// 		});
		// 		newdesign.save((err) => { if (err) throw err;});
		// 	}
		// });
		return res.jsonp({ code: 400, service: 'design', function: 'upload', message: 'success', signhash});
	}).all((req, res) => res.jsonp({code: 409, service: 'design', function: 'upload', message: 'unauthorized_method'}));

	return router;
};
