/**
 * Created by sknah on 2017. 10. 4..
 */


const authentication = (req, res, next) => {
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
			// jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
			// 	if(err) reject(err)
			// 	resolve(decoded)
			// })
			if(token.indexOf('omg')>=0) {
				resolve({'isomg' : 'omgggg'});
			}else {
				reject({token, error: 'fucked'})
			}
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
		reqapp: req.app,
		...error,
	}));
}

module.exports = {authentication}