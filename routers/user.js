var DEBUG = false; 
module.exports = (express, passport) => {
	var router      = express.Router();
	router.use((req, res, next) => {
		if (DEBUG) console.log("You have hit the /user", req.method, req.url);
	    res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	    next();
	});
	router.get('/', (req, res) => {
		if (DEBUG) console.log(routes);
	    res.jsonp({
	        name: 'hair.pin user API',
	        version: '1.0',
	    });
	});
	router.post('/signup', (req, res, next ) => {
		passport.authenticate('signup', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) { return res.jsonp( { service: 'signup', success: false, message: info.message }) }
			return res.jsonp({service: 'signup', success: true,signhash:user.signhash});
		})(req, res, next)
	});
	router.post('/login', (req, res, next ) => {
		passport.authenticate('login', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) { return res.jsonp( { service: 'login', success: false, message: info.message }) }
			return res.jsonp({service: 'login', success: true,signhash:user.signhash});
		})(req, res, next);
	});

	return router;
};
