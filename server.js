const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const cluster = require('cluster');

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

	// Models
	const User = require('./app/models/UsersModel');
	const Location = require('./app/models/LocationsModel');
	const Visit = require('./app/models/VisitsModel');

	// Routes
	app.route('/')
		.get((req, res) => {
			res.send(404).end();
		});

	require('./app/routes/UsersRoutes')(app);
	require('./app/routes/LocationsRoutes')(app);
	require('./app/routes/VisitsRoutes')(app);

	// Listen
	app.listen(PORT, HOST);

	console.log(`Running on http://${HOST}:${PORT}`);
}