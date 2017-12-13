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
		const {designHash, designRegdate, designTitle, designTag, designRecipe, designComment, uploadedType} = req.body;
		if (!designHash) return res.jsonp({ code: 406, service: 'design', function: 'upload', message: 'unsatisfied_param'});
		mDesign.findOne({signhash, designHash}, function(err, design) {
			if(err) res.jsonp({ code: 408, service: 'design', function: 'upload', message: 'error', error: err});
			const upDate = Date.now();
			req.files.forEach((file) => {
				fs.rename(file.destination + '/' + file.filename, file.destination + '/' + file.originalname, ()=>{});
			});
			if (design) {
				designTitle && (design.title = designTitle);
				designTag && (design.tags = designTag);
				designRecipe && (design.recipe = designRecipe);
				designComment && (design.comment = designComment);
				design.upDate = upDate;
				uploadedType && (design.publish = uploadedType);

				design.save(function(e){
					if(e) throw e;
				}).then(()=> {
					return res.jsonp({ code: 400, service: 'design', function: 'upload', message: 'success', upDate: upDate});
				});
			} else {
				const newdesign = new mDesign({
					signhash,
					designHash,
					title : designTitle,
					tags: designTag,
					recipe: designRecipe,
					comment: designComment,
					regDate: designRegdate,
					upDate,
					publish: uploadedType
				});

				newdesign.save(function(e){
					if(e) throw e;
				}).then(()=> {
					return res.jsonp({ code: 400, service: 'design', function: 'upload', message: 'success', upDate: upDate});
				});
			}
		});
		// return res.jsonp({ code: 408, service: 'design', function: 'upload', message: 'error'});
	}).all((req, res) => res.jsonp({code: 409, service: 'design', function: 'upload', message: 'unauthorized_method'}));

	return router;
};
