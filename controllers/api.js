var DEBUG = false;
module.exports = express => {
	var router = express.Router();

	router.use((req, res, next) => {
		if (DEBUG) console.log('You have hit the /api', req.method, req.url);
		res.header('Access-Control-Allow-Origin', '*');
		res.header(
			'Access-Control-Allow-Headers',
			'X-Requested-With, Content-Type, Accept'
		);
		next();
	});
	router.get('/', (req, res) => {
		if (DEBUG) console.log(routes);

		res.jsonp({
			name: 'hair.pin server API',
			version: '1.0'
		});
	});

	router.get('/test', (req, res) => {
		res.jsonp({
			test: 'osp'
		});
	});

	// POST - Create
	// GET - Read
	// PUT - Update/Replace - AKA you pass all the data to the update
	// PATCH - Update/Modify - AKA you just pass the changes to the update
	// DELETE - Delete

	// COLLECTION ROUTES
	router
		.route('/panoramas')
		.post((req, res) => {
			var data = req.body; // maybe more carefully assemble this data
			if (DEBUG) console.log(data);
			/*var query = connection.query('INSERT INTO panos SET ?', [data], (err, result) => {
	            if(err){
	                console.error(err);
	                res.sendStatus(404);
	            }else{
	                res.status(201);
	                res.location('/api/panoramas/' + result.insertId);
	                res.end();
	            }
	        });*/
			res.status(201);
			res.location('/api/panoramas/99' /* + result.insertId*/);
			res.end();
		})
		.get((req, res) => {
			/*var query = connection.query('SELECT * FROM panos', (err, rows, fields) => {
	            if (err) console.error(err);

	            res.jsonp(rows);
	        });*/
			res.jsonp({omg: 12});
		})
		//We do NOT do these to the collection
		.put((req, res) => {
			//res.status(404).send("Not Found").end();
			res.sendStatus(404);
		})
		.patch((req, res) => {
			res.sendStatus(404);
		})
		.delete((req, res) => {
			// LET's TRUNCATE TABLE..... NOT!!!!!
			res.sendStatus(404);
		});
	//end route

	// SPECIFIC ITEM ROUTES
	router
		.route('/panoramas/:id')
		.post((req, res) => {
			//specific item should not be posted to (either 404 not found or 409 conflict?)
			res.sendStatus(404);
		})
		.get((req, res) => {
			res.jsonp({req: req.params.id});
			/*var query = connection.query('SELECT * FROM panos WHERE id=?', [req.params.id], (err, rows, fields) => {
	            if (err) {
	                //INVALID
	                console.error(err);
	                res.sendStatus(404);
	            }else{
	                if(rows.length){
	                    res.jsonp(rows);
	                }else{
	                    //ID NOT FOUND
	                    res.sendStatus(404);
	                }
	            }
	        });*/
		})
		.put((req, res) => {
			var data = req.body;
			res.sendStatus(201);
		})
		.patch((req, res) => {
			// Need to decide how much this should differ from .put
			//in theory (hmm) this should require all the fields to be present to do the update?
		})
		.delete((req, res) => {
			//LIMIT is somewhat redundant, but I use it for extra sanity, and so if I bungle something I only can break one row.
			/*var query = connection.query('DELETE FROM panos WHERE id=? LIMIT 1', [req.params.id], (err, result) => {
	            if(err){
	                console.log(err);
	                res.sendStatus(404);
	            }else{
	                res.status(200).jsonp({affectedRows:result.affectedRows}).end();
	            }
	        });*/
			res.sendStatus(201);
		});
	//end route

	return router;
};
