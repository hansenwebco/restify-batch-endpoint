var async = require('async');
var restify = require('restify');

// defaults
var options = {};
var server;

// settings
function configureEndPoint(s, o) {
    options.maxPages = (o && o.maxPages !== null && !isNaN(o.maxPages)) ? o.maxPages : 9;
    server = s;
    console.log("restify-batch-endpoint configured");
}
exports.configureEndPoint = configureEndPoint;


// restify requests
function batchProcess(req, res, next) {
    console.log(typeof server);
    if (typeof server !== 'object') {
        return next(new restify.PreconditionRequiredError("You must call configureEndPoint before executing batch requests."));
    }
    res.send('heellooo!!');
    console.log(req.url, options.maxPages);
}
exports.batchProcess = batchProcess;
