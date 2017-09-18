const cluster = require('cluster'),
    worker = require('./worker'),
    util = require('./util');

// Parse Highloadcup options
let optionsFile = require('fs').readFileSync('/tmp/data/options.txt', 'utf-8');
let options = optionsFile.split("\n");

global.NOW = options[0] * 1000;
global.MODE = options[1];

// Initialize util data
util.init();

// Run processes
if (cluster.isMaster) {
    let cpuCount = require('os').cpus().length;

    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }
} else {
    worker();
}