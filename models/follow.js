const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const sFollow = mongoose.Schema({
	fid: {type: ObjectId},
	signhash: {type: String}
});

module.exports = {sFollow, mFollow: mongoose.model('mFollow', sFollow)};
