const mongoose = require('mongoose');

const sNotice = mongoose.Schema({
	noticeType	: {type: Number },
	regDate		: {type: Date, required: true, default: Date.now},
	content		: {type: String, required: true }
});


module.exports = mongoose.model('notice', sNotice);
