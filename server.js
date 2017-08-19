'use strict';

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

// Express
const express = require('express');
const app = express();

// Mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/travels', { useMongoClient: true });

// Body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Another
const fs = require('fs');

let optionsFile = fs.readFileSync('/tmp/data/options.txt', 'utf-8');

let options = optionsFile.split("\n");

global.NOW = options[0] * 1000;
global.MODE = options[1];

// Models
const User = require('./app/models/UsersModel');
const Location = require('./app/models/LocationsModel');
const Visit = require('./app/models/VisitsModel');

// Routes
require('./app/routes/UsersRoutes')(app);
require('./app/routes/LocationsRoutes')(app);
require('./app/routes/VisitsRoutes')(app);

// Expose
app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);

module.exports = app;