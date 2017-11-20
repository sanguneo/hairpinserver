const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const sUser = mongoose.Schema({
	signhash: {type: String, required: true, unique: true},

	nickname: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},

	regDate: {type: Date, required: true, default: Date.now},
	intro: {type: String},
	profileReg: {type: Date},

	follower: [sFollow],
	following: [sFollow]
});

sUser.methods.genPw = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
sUser.methods.validPw = function(password) {
	return bcrypt.compareSync(password, this.password);
};

sUser.virtual('followersize').get(function(){
	return this.follower.length;
});
sUser.virtual('followingsize').get(function(){
	return this.following.length;
});

module.exports = mongoose.model('user', sUser);
