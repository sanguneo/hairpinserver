/**
 * Created by sknah on 2017. 10. 4..
 */
const jwt			= require('jsonwebtoken');

const authentication = (req, res, next) => {
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
	const authPromise = new Promise(
		(resolve, reject) => {
			jwt.verify(token, secret, (err, deccodedToken) => {
				if(err) reject(err)
				resolve(deccodedToken)
			})
		}
	);
	console.log(req.path);
	authPromise.then((deccodedToken)=>{
		req.deccodedToken = deccodedToken;
		next()
	}).catch((error) => res.jsonp({
		code: 295,
		service: 'user',
		function: 'common',
		error: `(${error.name})${error.message}`,
	}));
}

module.exports = {authentication}