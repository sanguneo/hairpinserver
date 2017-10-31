module.exports = express => {
	const router = express.Router();

	const mNotice = require('../models/notice');

	router.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept'
		);
		next();
	});

	router.all('/', (req, res) => {
		return res.jsonp({
			name: 'hair.pin notice service API',
			version: '1.0.0'
		});
	});

	router.route('/write').post((req, res) => {
			let {noticeType, content, title} = req.body;
			if (!content || !title) {
				return res.jsonp({
					code: 306,
					service: 'notice',
					function: 'write',
					message: 'unsatisfied_param'
				});
			}
			let newnotice = new mNotice({content, title});
			if (noticeType !== '' && typeof noticeType === 'number') {
				newnotice.noticeType = noticeType;
			}
			newnotice.save(err => {
				if (err) throw err;
				res.jsonp({
					code: 300,
					service: 'notice',
					function: 'write',
					message: 'success',
					notice : {noticeType, content, title}
				});
			});
		}).all((req, res) =>
			res.jsonp({
				code: 309,
				service: 'user',
				function: 'write',
				message: 'unauthorized_method'
			})
		);

	router.route('/list').get((req, res) => {
			let query = {};
			if (req.query.after && req.query.after !== '')
				query.regDate = {$gt: new Date(req.query.after)};
			mNotice.find(
				query,
				['regDate', 'noticeType', 'content', 'title'],
				{sort: {regDate: -1}},
				(error, notice) => {
					if (error) {
						return res.jsonp({
							code: 318,
							service: 'notice',
							function: 'listup',
							message: 'error',
							error
						});
					}
					if (!notice) {
						return res.jsonp({
							code: 317,
							service: 'notice',
							function: 'listup',
							message: 'no notice'
						});
					}
					return res.jsonp({
						code: 310,
						service: 'notice',
						function: 'listup',
						message: 'success',
						notice
					});
				}
			);
		}).all((req, res) =>
			res.jsonp({
				code: 319,
				service: 'notice',
				function: 'listup',
				message: 'unauthorized_method'
			})
		);

	router.route('/plain').get((req, res) => {
			let query = {};
			if (req.query.after && req.query.after !== '')
				query.regDate = {$gt: new Date(req.query.after)};
			mNotice.find(
				{
					$and: [
						{$or: [{noticeType: {$exists: false}}, {noticeType: 0}]},
						query
					]
				},
				['regDate', 'noticeType', 'content', 'title'],
				{sort: {regDate: -1}},
				(error, notice) => {
					if (error) {
						return res.jsonp({
							code: 328,
							service: 'notice',
							function: 'listup',
							message: 'error',
							error
						});
					}
					if (!notice) {
						return res.jsonp({
							code: 327,
							service: 'notice',
							function: 'listup',
							message: 'no notice'
						});
					}
					return res.jsonp({
						code: 320,
						service: 'notice',
						function: 'listup',
						message: 'success',
						notice
					});
				}
			);
		})
		.all((req, res) =>
			res.jsonp({
				code: 329,
				service: 'notice',
				function: 'listup',
				message: 'unauthorized_method'
			})
		);

	router.route('/popup').get((req, res) => {
			let query = {};
			if (req.query.after && req.query.after !== '')
				query.regDate = {$gt: new Date(req.query.after)};
			mNotice.find(
				{$and: [{noticeType: 0}, query]},
				['regDate', 'noticeType', 'content', 'title'],
				{sort: {regDate: -1}},
				(error, notice) => {
					if (error) {
						return res.jsonp({
							code: 338,
							service: 'notice',
							function: 'listup',
							message: 'error',
							error
						});
					}
					if (!notice) {
						return res.jsonp({
							code: 337,
							service: 'notice',
							function: 'listup',
							message: 'no notice'
						});
					}
					return res.jsonp({
						code: 330,
						service: 'notice',
						function: 'listup',
						message: 'success',
						notice
					});
				}
			);
		}).all((req, res) =>
			res.jsonp({
				code: 339,
				service: 'notice',
				function: 'listup',
				message: 'unauthorized_method'
			})
		);

	return router;
};
