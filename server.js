var http = require('http');
var app = require('./app');
var port = process.env.PORT || 4337;
var host = process.env.HOST || '0.0.0.0';

http.createServer(app).listen(port, host, () => {
	console.log("Server ready at http://" + host + ":" + port);
});