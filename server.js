const http = require('http'),
	express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	cluster = require('cluster'),
	apicache = require('apicache');

// apicache.options({ debug: true });

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

// Parse options
let optionsFile = fs.readFileSync('/tmp/data/options.txt', 'utf-8');
let options = optionsFile.split("\n");

global.NOW = options[0] * 1000;
global.MODE = options[1];

if (cluster.isMaster) {
    let cpuCount = require('os').cpus().length;

    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
} else {
	// Expose server

	// Express
	const app = express();

	// Mongoose
	mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://localhost/travels', { useMongoClient: true });

	// Body parser
	app.use(bodyParser.json());

	// Cache
	app.use(apicache.middleware());

	app.use(function (req, res, next) {
		apicache.clear();
		next();
	});

	// Models
	const User = require('./app/models/UsersModel');
	const Location = require('./app/models/LocationsModel');
	const Visit = require('./app/models/VisitsModel');

	// Routes
	require('./app/routes/UsersRoutes')(app);
	require('./app/routes/LocationsRoutes')(app);
	require('./app/routes/VisitsRoutes')(app);

	// Default route
	app.use(function (req, res, next) {
		res.status(404).send();
	});

	// Listen
	app.listen(PORT, HOST);

	console.log(`Running on http://${HOST}:${PORT}`);
}