import * as http from 'http';

import app from 'app';

var port = process.env.PORT || 3000;
var host = process.env.HOST || '0.0.0.0';

http.createServer(app).listen(port, host, () => {
	console.log("Server ready at http://" + host + ":" + port);
});
