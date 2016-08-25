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
    if (typeof server !== 'object') {
        return next(new restify.PreconditionRequiredError("You must call configureEndPoint before executing batch requests."));
    }

    var batch = JSON.parse(req.params.batch);
    var requests = batch.requests;

    async.eachLimit(
        requests,
        9,
        function executeQuery(request, callback) {
            console.log(request.endpoint);
            callback();
        });

    var response = {};

    res.send(response);
}
exports.batchProcess = batchProcess;
