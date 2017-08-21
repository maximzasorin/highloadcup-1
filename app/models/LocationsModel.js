var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationsSchema = new Schema({
	  	id: { type: Number, required: true, index: true, unique: true },
	  	place: { type: String, required: true },
	  	country: { type: String, required: true, index: true },
	  	city: { type: String, required: true },
	  	distance: { type: Number, required: true },
	}, {
		toJSON: { 
	       	transform: function(doc, ret) {
	       		delete ret._id;
	       		delete ret.__v;
	       	}
	   }
	});

module.exports = mongoose.model('Locations', LocationsSchema);