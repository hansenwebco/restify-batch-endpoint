var async = require('async');
var restify = require('restify');

// defaults
var options = {};
var server;
var client;


// settings
function configureEndPoint(s, o) {
    options.maxRequests = (o && o.maxRequests !== null && !isNaN(o.maxRequests)) ? o.maxRequests : 9;
    server = s;
    console.log("restify-batch-endpoint configured");

}
exports.configureEndPoint = configureEndPoint;


// restify requests
function batchProcess(req, res, next) {

    var startRequest = new Date();

    if (typeof server !== 'object') {
        return next(new restify.PreconditionRequiredError("You must call configureEndPoint before executing batch requests."));
    }

    // initialize response
    var response = {};

    // configure client
    client = restify.createJsonClient({
        url: server.url
    });

    var batch = JSON.parse(req.params.batch);
    if (!batch || batch === null)
      return next(new restify.PreconditionRequiredError("Unable to parse your batch request check your JSON"));

    var requests = batch.requests;
    if (!requests || requests === null || requests.length === 0 )
        return next(new restify.PreconditionRequiredError("No requests were found in your 'batch' parameter, please check your JSON formatting."));

    var requestCount = 0;
    var requestFail = 0;

    async.eachOfLimit(
        requests,
        options.maxRequests,
        function executeQuery(request, key, callback) {
            client.get(request.endpoint, function(err, req, res, obj) {
                if (err) {
                    response[request.reference] = err;
                    requestFail++;
                    callback();
                } else {
                    response[request.reference] = obj;
                    requestCount++;
                    callback();
                }
            });
        },
        function renderResult() {
            // this is called after all the async requests complete
            response.requestsCount = requestCount;
            response.requestsFailed = requestFail;
            response.requestTimeMillis = new Date() - startRequest;
            res.send(response);
            next();
        });

}
exports.batchProcess = batchProcess;
