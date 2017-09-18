const MongoClient = require('mongodb').MongoClient;

let database = null;

module.exports = function (callback) {
	if (!database) {
		MongoClient.connect('mongodb://localhost/travels', function (err, db) {
			database = db;

			callback(null, database);
		});

	} else {
		callback(null, database);
	}
};