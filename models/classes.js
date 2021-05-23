var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	desc: {
		type: String,
		required: true,
	},
	// TODO: ADD PROFILE IMAGE
});

module.exports = mongoose.model("User", UserSchema);