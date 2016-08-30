var server;

function start(callback) {

    var restify = require('restify');
    var batchEndPoint = require('../lib/index');

    server = restify.createServer({
        'name': 'tpcapi',
        'Url': 'http://localhost:3000'
    });

    server.use(restify.gzipResponse());
    server.use(restify.bodyParser());
    server.pre(restify.pre.sanitizePath());

    server.get('/route1', function(req, res, next) {
        var response = {
            "user": "John Smith",
            "email": "jsmith@email.com"
        };
        res.send(response);
    });

    server.get('/route2', function(req, res, next) {
        var response = {
            "beers": [{
                "name": "Flat Tire",
                "brewery": "New Belgium Brewery"
            }, {
                "name": "Xingu",
                "brewery": "Cervejaria Kaiser"
            }]
        };
        res.send(response);
    });

    // handle batch requests
    batchEndPoint.configureEndPoint(server, {
        'maxPages': 10
    });
    server.post('/batch', batchEndPoint.batchProcess);

    server.listen(3000, '127.0.0.1', function() {
        console.log('%s listening at %s', server.name, server.url);
        callback();

    });
}
exports.start = start;

function stop(callback) {
    server.close();
    console.log("Server Stopped.");
}
exports.stop = stop;
