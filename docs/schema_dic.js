/**
 * User 테이블 스키마
 */
const sUser = mongoose.Schema({
	signhash	: {type: String, required: true, unique: true},
	
	nickname		: {type: String, required: true},
	email		: {type: String, required: true, unique:true},
	password	: {type: String, required: true},
	
	intro		: {type: String, default: ''},
	profileReg	: {type: Date},

	follower	: [String],
	following	: [String]
}