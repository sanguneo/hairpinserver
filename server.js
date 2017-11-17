const fs = require('fs');
const http = require('http');
const https = require('https');
const app = require('./app');
const port = process.env.PORT || 4337;
const portssl = process.env.PORTSSL || 4443;
const host = process.env.HOST || '0.0.0.0';

const options = {
	key: fs.readFileSync('./cert/privkey.pem'),
	cert: fs.readFileSync('./cert/cert.pem')
};

http.createServer(app).listen(port, host, () => {
	console.log('Server ready at http://' + host + ':' + port);
});
https.createServer(options, app).listen(portssl, host, () => {
	console.log('Server ready at https://' + host + ':' + portssl);
});
