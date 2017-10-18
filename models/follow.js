const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const sFollow = mongoose.Schema({
	fid			: {type: ObjectId, required: false, unique: true},
	signhash	: {type: String, required: true, unique: true},
});

module.exports = {sFollow,mFollow: mongoose.model('mFollow', sFollow)};
