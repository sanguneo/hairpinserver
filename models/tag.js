const mongoose = require('mongoose');

const sTag = mongoose.Schema({
	uniqkey: {type: String, required: true},
	tag: {type: String, required: true},
	regDate: {type: Date, required: true, default: Date.now}
});

sTag.index({uniqkey: 1, tag: 1});

module.exports = mongoose.model('tag', sTag);
