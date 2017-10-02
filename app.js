const envs = require('./env.json');
console.log(envs._name + ' ' + envs._version);

const express		= require('express');
const app			= express();
const path			= require('path');
const mongoose		= require('mongoose');
const passport		= require('passport');
// const session		= require('express-session');
const bodyParser	= require('body-parser');
const multer		= require('multer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Support for Crossdomain JSONP
app.set('jsonp callback name', 'callback');

app.set('ca-jwt-key', envs.secretOrKey);

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
	console.log("Connected to mongod server");
});
mongoose.connect(envs.mongoserver + envs.database, {useMongoClient: true});
mongoose.Promise = global.Promise;


require('./controllers/auth.passport')(passport);

app.use(passport.initialize());
// 	secret: envs.secretOrKey,


const apiRouter = require('./controllers/api')(express);
const userRouter = require('./controllers/auth')(express, passport);

app.use('/api', apiRouter);
app.use('/user', userRouter);

// non api route for our views
app.get('/', (req, res) => {
    res.render('index');
});


app.disable('x-powered-by');


module.exports = app;
