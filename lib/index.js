var async = require('async');
var restify = require('restify');


// defaults
var options = {};
var server;
var client = restify.createJsonClient({
  url: 'http://localhost:3000'
});


// settings
function configureEndPoint(s, o) {
    options.maxPages = (o && o.maxPages !== null && !isNaN(o.maxPages)) ? o.maxPages : 9;
    server = s;
    console.log("restify-batch-endpoint configured");
}
exports.configureEndPoint = configureEndPoint;


// restify requests
function batchProcess(req, res, next) {

    var response = {};

    if (typeof server !== 'object') {
        return next(new restify.PreconditionRequiredError("You must call configureEndPoint before executing batch requests."));
    }

    var batch = JSON.parse(req.params.batch);
    var requests = batch.requests;

    async.eachOfLimit(
        requests,
        9,
        function executeQuery(request,key, callback) {
            client.get(request.endpoint, function(err, req, res, obj) {
                  response[request.reference] = obj;
                  callback();
            });
        },
        function renderResult() {
            res.send(response);
            next();
        });

    // TODO: Handle what is going on here?
    //res.send(response);
}
exports.batchProcess = batchProcess;
