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
	    });
	});

	router.route('/write').get((req, res) => {
		let {noticeType, content} = req.query;
		if (!content) {
			return res.jsonp({ code: 316, service: 'notice', function: 'write', message: 'unsatisfied_param'});
		}
		let newnotice = new mNotice({ noticeType : noticeType || noticeType !== '' ? noticeType : null, content });
		if (noticeType !== '') {
			newnotice.noticeType = noticeType;
		}
		return newnotice.save((err) => {
			if (err) throw err;
			return res.jsonp({ code: 316, service: 'notice', function: 'write', ...req.query});
		});

	}).all((req, res) => res.jsonp({ code: 339, service: 'user', function: 'write', message: 'unauthorized_method' }));

	router.route('/listup').get((req, res) => {
		mNotice.find({},(error, user) => {
			if(error) {
				return res.jsonp({ code: 238, service: 'user', function: 'follow', message: 'error', error });
			}
			if(!user) {
				return res.jsonp({ code: 237, service: 'user', function: 'follow', message: info.message });
			}
			if (!user.follower.find((e)=> e.signhash === myhash)){
				user.follower.push(new mFollow({
					signhash : myhash
				}));
				user.save().then(() => {
					return res.jsonp({ code: 230, service: 'user', function: 'follow', message: 'success', target: user.nickname });
				}).catch((error)=> {
					return res.jsonp({ code: 238, service: 'user', function: 'follow', message: 'error', error});
				});
			} else {
				return res.jsonp({ code: 231, service: 'user', function: 'follow', message: 'following', target: user.nickname });
			}
		})
	}).all((req, res) => res.jsonp({ code: 239, service: 'user', function: 'follow', message: 'unauthorized_method' }));

	return router;
};
