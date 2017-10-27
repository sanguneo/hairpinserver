/**
 * Created by sknah on 2017. 10. 4..
 */
const jwt = require('jsonwebtoken');

const passRoute = [];

module.exports = passRouteMore => (req, res, next) => {
	if ([...passRoute, ...passRouteMore].includes(req.path)) {
		next();
		return;
	}
	let secret = req.app.get('secretnipriah');
	const token = req.headers['nekotnipriah'] || req.query.nekotnipriah;
	if (!token) {
		return res.jsonp({
			code: 294,
			service: 'user',
			function: 'common',
			message: 'Authorization header key undefined.',
			token
		});
	}
	const authPromise = new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, decoded) => {
			if (err) reject(err);
			resolve(decoded);
		});
	});
	authPromise
		.then(decoded => {
			req.decoded = decoded;
			next();
		})
		.catch(error =>
			res.jsonp({
				code: 295,
				service: 'user',
				function: 'common',
				message: `(${error.name})${error.message}`
			})
		);
};
