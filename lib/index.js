var async = require('async');

// settings
function batchEndpoint(server, options) {
    if (!options)
        options = {};
}
exports.batchEndpoint = batchEndpoint;

// restify requests
function batchProcess(req, res, next) {
    console.log(req.url);
}
exports.batchProcess = batchProcess;
