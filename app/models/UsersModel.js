var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	  	id: { type: Number, required: true },
	  	email: { type: String, required: true },
	  	first_name: { type: String, required: true },
	  	last_name: { type: String, required: true },
	  	gender: { type: String, required: true },
	  	birth_date: { type: Number, required: true },
	}, {
		toJSON: { 
	       	transform: function(doc, ret) {
	       		delete ret._id;
	       		delete ret.__v;
	       	}
	   }
	});

module.exports = mongoose.model('Users', UserSchema);