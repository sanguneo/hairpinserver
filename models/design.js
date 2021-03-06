const mongoose = require('mongoose');

const sDesign = mongoose.Schema({
	signhash: {type: String, required: true},
	designHash: {type: String, required: true, index: true},

	title: {type: String},
	tags: [String],
	recipe: {type: String},
	comment: {type: String},

	regDate: {type: Date, required: true, default: Date.now},
	upDate: {type: Date, required: true, default: Date.now},

	publish: {type: Number, required: true, default: 1}
});

module.exports = mongoose.model('design', sDesign);
