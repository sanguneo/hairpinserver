const mongoose = require('mongoose');

const sNotice = mongoose.Schema({
	noticeType	: {type: Number, default: 0 },
	regDate		: {type: Date, required: true, default: Date.now},
	content		: {type: String, required: true },
	title		: {type: String, required: true }
});


module.exports = mongoose.model('notice', sNotice);
