var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var sUser = mongoose.Schema({
	name		: String,
	email		: String,
	password	: String,
	criteria	: String,
	synchash	: String,
	follower	: [String],
	following	: [String]
});
sUser.methods.generatePassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
sUser.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);

};
module.exports = mongoose.model('mUser', sUser);
