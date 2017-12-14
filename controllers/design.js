module.exports = (express) => {
	const router		= express.Router();
	const multer		= require('multer');
	const fs			= require('fs');
	
	const uploadPath = 'upload/designs';
	const profileUpload	= multer({ dest: uploadPath });

	const mUser = require('../models/user');
	const mDesign = require('../models/design');

	const validation	= require('./user.validation');
	
	router.use((req, res, next) => {
	    res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, nekotnipriah");
	    next();
	});

	router.all('/', (req, res) => {
	    res.jsonp({
	        name: 'hair.pin design service API',
	        version: '1.0.0',
	    });
	});
	
	router.use(validation([]));

	router.route('/upload').post(profileUpload.array('designimage', 4), (req, res) => {
		const {signhash} = req.decoded;
		const {designHash, designRegdate, designTitle, designTag, designRecipe, designComment, uploadedType} = req.body;
		if (!designHash) res.jsonp({ code: 406, service: 'design', function: 'upload', message: 'unsatisfied_param'});
		mDesign.findOne({signhash, designHash}, function(err, design) {
			if(err) res.jsonp({ code: 408, service: 'design', function: 'upload', message: 'error', error: err});
			const upDate = Date.now();
			req.files.forEach((file) => {
				fs.rename(file.destination + '/' + file.filename, file.destination + '/' + file.originalname, ()=>{});
			});
			if (design) {
				designTitle && (design.title = designTitle);
				designTag && (design.tags = JSON.parse(designTag));
				designRecipe && (design.recipe = designRecipe);
				designComment && (design.comment = designComment);
				design.upDate = upDate;
				uploadedType && (design.publish = uploadedType);

				design.save(function(e){
					if(e) throw e;
				}).then(()=> {
					res.jsonp({ code: 400, service: 'design', function: 'upload', message: 'success', upDate: upDate});
				});
			} else {
				const newdesign = new mDesign({
					signhash,
					designHash,
					title : designTitle,
					tags: JSON.parse(designTag),
					recipe: designRecipe,
					comment: designComment,
					regDate: designRegdate,
					upDate,
					publish: uploadedType
				});

				newdesign.save(function(e){
					if(e) throw e;
				}).then(()=> {
					res.jsonp({ code: 400, service: 'design', function: 'upload', message: 'success', upDate: upDate});
				});
			}
		});
	}).all((req, res) => res.jsonp({code: 409, service: 'design', function: 'upload', message: 'unauthorized_method'}));

	router.route(['/tags', '/tags/:permission']).get((req, res) => {
		const {permission} = req.params;
		let query = !permission ? {$or: [{publish: 7}]} : {$or: [{publish: permission}, {publish: 7}]};
		const myhash = req.decoded.signhash;
		query.$or.push({signhash: myhash});
		mDesign.find(query,['signhash', 'tags', 'publish'], function(err, designs) {
			if(err) res.jsonp({ code: 408, service: 'design', function: 'tags', message: 'error', error: err});
			const tagList = {};
			designs.forEach(({signhash, tags, publish}) => {
				if(signhash === myhash || publish === 7) tags.forEach((tag) => tagList[tag] = (tagList[tag] ? tagList[tag] + 1 : 1));
				else if (publish === 3) mUser.findOne({signhash},['following'],(error, {following}) => {
					following.includes(myhash) && tags.forEach((tag) => tagList[tag] = (tagList[tag] ? tagList[tag] + 1 : 1))});
			});
			setTimeout(()=> res.jsonp({ code: 400, service: 'design', function: 'tags', message: 'success', tags: tagList, signhash: myhash}),500);
		});
	}).all((req, res) => res.jsonp({code: 409, service: 'design', function: 'tags', message: 'unauthorized_method'}));

	router.route(['/designs', '/designs/:permission']).get((req, res) => {
		const {permission} = req.params;
		let query = !permission ? {$or: [{publish: 7}]} : {$or: [{publish: permission}, {publish: 7}]};
		var myhash;
		if (req.decoded) {
			myhash = req.decoded.signhash;
			query.$or.push({signhash: myhash});
		}
		mDesign.find(query,['signhash', 'designHash', 'title', 'regDate', 'publish'], function(err, designs) {
			if(err) res.jsonp({ code: 418, service: 'design', function: 'designs', message: 'error', error: err});
			const designList = [];
			designs.forEach(({signhash, designHash, title, regDate, publish}) => {
				mUser.findOne({signhash},['nickname', 'following'],(error, {nickname, following}) => {
					if(signhash === myhash || publish === 7) designList.push({nickname, signhash, designHash, title, regDate, publish})
					else if (publish === 3) following.includes(myhash) && designList.push({nickname, signhash, designHash, title, regDate, publish});
				});
			});
			setTimeout(()=> res.jsonp({ code: 410, service: 'design', function: 'designs', message: 'success', designs: designList, signhash: myhash}),500);
		});
	}).all((req, res) => res.jsonp({code: 419, service: 'design', function: 'designs', message: 'unauthorized_method'}));

	router.route(['/getdesign']).post((req, res) => {
		const {designHash, signhash} = req.body;

		if (req.decoded.signhash || !designHash) return res.jsonp({code: 426, service: 'user', function: 'signup', message: 'unsatisfied_param'});

		mDesign.findOne({signhash, designHash}, function(err, design) {
			if (err) return res.jsonp({code: 428, service: 'design', function: 'getdesign', message: 'error', error: err});
			if (design) return res.jsonp({ code: 420, service: 'design', function: 'getdesign', message: 'success', design});
			else return res.jsonp({ code: 427, service: 'design', function: 'getdesign', message: 'design_notexist'});
		});
	}).all((req, res) => res.jsonp({code: 429, service: 'design', function: 'getdesign', message: 'unauthorized_method'}));

	return router;
};
