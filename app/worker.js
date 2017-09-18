const express = require('express'),
	bodyParser = require('body-parser'),
	mongo = require('./mongo');

// API worker
module.exports = function () {
	// Connect mongo & create indexes
	mongo(function (err, db) {
		// Locations
		db.collection('locations')
			.ensureIndex(
				{ id: 1 }, { unique: true }, function () {}
			);

		db.collection('locations')
			.ensureIndex(
				{ country: 1 }, function () {}
			);

		// Users
		db.collection('users')
			.ensureIndex(
				{ id: 1 }, { unique: true }, function () {}
			);

		db.collection('users')
			.ensureIndex(
				{ gender: 1 }, function () {}
			);

		// Visits
		db.collection('visits')
			.ensureIndex(
				{ id: 1 }, { unique: true }, function () {}
			);

		db.collection('visits')
			.ensureIndex(
				{ user: 1 }, function () {}
			);

		db.collection('visits')
			.ensureIndex(
				{ location: 1 }, function () {}
			);

		db.collection('visits')
			.ensureIndex(
				{ user: 1, visited_at: 1 }, function () {}
			);
	});

	// Expose app
	const app = express();

	// Body parser
	app.use(bodyParser.json());

	// Routes
	require('./routes/UsersRoutes')(app);
	require('./routes/LocationsRoutes')(app);
	require('./routes/VisitsRoutes')(app);

	// Default route
	app.use(function (req, res, next) {
		res.status(404).send();
	});

	// Listen
	const worker = app.listen(80, function () {
		const {address, port} = worker.address();
		console.log(`Running on http://${address}:${port}`);
	});
};