const mongoose = require('mongoose');

const sDesign = mongoose.Schema({
	signhash	: {type: String, required: true},
	uniqkey		: {type: String, required: true},

	title		: {type: String},
	tags		: [String],
	recipe		: {type: String},
	comment		: {type: String},

	regDate		: {type: Date, required: true, default: Date.now}
});

sDesign.index({signhash:1, uniqkey:1});


module.exports = mongoose.model('design', sDesign);
