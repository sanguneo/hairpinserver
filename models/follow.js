const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const sFollow = mongoose.Schema({
	fid			: {type: ObjectId, required: false, unique: true},
	signhash	: {type: String, required: true, unique: true},
});

sFollow.index({fid:1, signhash:1});

module.exports = {sFollow,mFollow: mongoose.model('mFollow', sFollow)};
