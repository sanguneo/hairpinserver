module.exports = (express) => {
	const router		= express.Router();

	const mNotice = require('../models/notice');

	router.use((req, res, next) => {
	    res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	    next();
	});

	router.all('/', (req, res) => {
	    return res.jsonp({
	        name: 'hair.pin notice service API',
	        version: '1.0.0',
		date: new Date(Date.now()).getHours()
	    });
	});

	router.route('/write').get((req, res) => {
		let {noticeType, content} = req.query;
		if (!content) {
			return res.jsonp({ code: 316, service: 'notice', function: 'write', message: 'unsatisfied_param'});
		}
		let newnotice = new mNotice({ content });
		if (noticeType !== '' && typeof noticeType === 'number') {
			newnotice.noticeType = noticeType;
		}
		newnotice.save((err) => {
			if (err) throw err;
			res.jsonp({ code: 316, service: 'notice', function: 'write', message: 'success', ...req.query});
		});

	}).all((req, res) => res.jsonp({ code: 339, service: 'user', function: 'write', message: 'unauthorized_method' }));

	router.route('/list').get((req, res) => {
		mNotice.find({},['regDate', 'noticeType', 'content'],{sort: {regDate: -1}},(error, notice) => {
			if(error) {
				return res.jsonp({ code: 338, service: 'notice', function: 'listup', message: 'error', error });
			}
			if(!notice) {
				return res.jsonp({ code: 337, service: 'notice', function: 'listup', message: 'no notice' });
			}
			return res.jsonp({ code: 330, service: 'notice', function: 'listup', message: 'success', notice });
		})
	}).all((req, res) => res.jsonp({ code: 339, service: 'notice', function: 'listup', message: 'unauthorized_method' }));

	router.route('/plain').get((req, res) => {
		mNotice.find({$or: [{noticeType: {$exists: false}},{noticeType: 0}]},
			['regDate', 'noticeType', 'content'],{sort: {regDate: -1}},(error, notice) => {
			if(error) {
				return res.jsonp({ code: 338, service: 'notice', function: 'listup', message: 'error', error });
			}
			if(!notice) {
				return res.jsonp({ code: 337, service: 'notice', function: 'listup', message: 'no notice' });
			}
			return res.jsonp({ code: 330, service: 'notice', function: 'listup', message: 'success', notice });
		})
	}).all((req, res) => res.jsonp({ code: 339, service: 'notice', function: 'listup', message: 'unauthorized_method' }));

	router.route('/popup').get((req, res) => {
		mNotice.find({noticeType: 1},['regDate', 'noticeType', 'content'],{sort: {regDate: -1}},(error, notice) => {
			if(error) {
				return res.jsonp({ code: 338, service: 'notice', function: 'listup', message: 'error', error });
			}
			if(!notice) {
				return res.jsonp({ code: 337, service: 'notice', function: 'listup', message: 'no notice' });
			}
			return res.jsonp({ code: 330, service: 'notice', function: 'listup', message: 'success', notice });
		})
	}).all((req, res) => res.jsonp({ code: 339, service: 'notice', function: 'listup', message: 'unauthorized_method' }));

	return router;
};
