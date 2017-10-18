const mongoose = require('mongoose');

const sDesign = mongoose.Schema({
	signhash	: {type: String, required: true, index: true},
	uniqkey		: {type: String, required: true},

	title		: {type: String},
	tags		: [String],
	recipe		: {type: String},
	comment		: {type: String},

	regDate		: {type: Date, required: true, default: Date.now}
});


module.exports = mongoose.model('design', sDesign);
