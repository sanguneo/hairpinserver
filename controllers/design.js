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
/* { fieldname: 'designimage',
    originalname: 'f8a3aff8-8b2e-5a07-8717-327fa422dbf6_11511121918111514111410171_THUMB.scalb',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: 'upload/designs',
    filename: 'e5b5a3ba61b052508d5e0e3cdd90966c',
    path: 'upload/designs/e5b5a3ba61b052508d5e0e3cdd90966c',
    size: 8507 }
* */
	router.route('/upload').post(profileUpload.array('designimage', 4), (req, res) => {
		console.log(req.files.length, '=>', req.files);

		const {signhash} = req.decoded;
		const {designHash} = req.body;
		if (!designHash) {
			return res.jsonp({ code: 406, service: 'design', function: 'upload', message: 'unsatisfied_param'});
		}
		req.files.forEach((file) => {
			// console.log(file.destination + '/' + file.filename, file.destination + '/' + file.originalname)
			fs.renameSync(file.destination + '/' + file.filename, file.destination + '/' + file.originalname)
		})
		return res.jsonp({ code: 400, service: 'design', function: 'upload', message: 'success', signhash});
	}).all((req, res) => res.jsonp({code: 409, service: 'design', function: 'upload', message: 'unauthorized_method'}));

	return router;
};
