var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitsSchema = new Schema({
	  	id: { type: Number, required: true, index: true, unique: true },
	  	location: { type: Number, required: true, index: true },
	  	user: { type: Number, required: true, index: true },
	  	visited_at: { type: Number, required: true },
	  	mark: { type: Number, required: true },
	}, {
		toJSON: { 
	       	transform: function(doc, ret, options) {
	       		delete ret._id;
	       		delete ret.__v;

	       		if (options.exclude) {
	       			for (let prop of options.exclude) {
	       				delete ret[prop];
	       			}
	       		}
	       	}
	   }
	});

// Index for sorting
VisitsSchema.index({ id: 1, visited_at: 1 });

module.exports = mongoose.model('Visits', VisitsSchema);