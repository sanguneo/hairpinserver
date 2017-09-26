const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const sUser = mongoose.Schema({
	signhash	: {type: String, required: true, unique: true},
	
	nickname	: {type: String, required: true},
	email		: {type: String, required: true, unique:true},
	password	: {type: String, required: true},
	
	intro		: {type: String, default: ''},
	profileReg	: {type: Date},

	follower	: [String],
	following	: [String]
});

sUser.index({email:1, signhash:1});

sUser.methods.genPw = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
sUser.methods.validPw = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('mUser', sUser);
