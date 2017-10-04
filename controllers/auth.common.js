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
			function: 'basic',
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
			// if(token.indexOf('omg')>=0) {
			// 	resolve({secret,'isomg' : 'omgggg'});
			// }else {
			// 	reject({token, error: 'fucked'})
			// }
		}
	);
	
	authPromise.then((deccodedToken)=>{
		req.deccodedToken = deccodedToken;
		next()
	}).catch((error) => res.jsonp({
		code: 295,
		service: 'user',
		function: 'basic',
		message: 'Authorization failed.',
		secret,
		...error,
	}));
}

module.exports = {authentication}