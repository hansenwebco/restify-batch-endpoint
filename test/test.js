var server = require("./server.js");
var expect = require("chai").expect;
var should = require("chai").should;
var request = require('supertest')('http://localhost:3000/');

describe('Mocha Test Suite', function() {

    describe('Starting up Restify Server', function() {
        before('Server Starting', function(done) {
            server.start(function() {
                console.log("");
                done();
            });
        });

        describe('Validate Testing End Points', function() {
            it('API Route1 Should return a 200', function(done) {
                request.get('/route1')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end(function(err, res) {
                        done(err);
                    });
            });

            it('API Route2 Should return a 200', function(done) {
                request.get('/route2')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end(function(err, res) {
                        done(err);
                    });
            });
        });

        var batch = {
            "requests": [{
                "endpoint": "/route1",
                "reference": "route1"
            }, {
                "endpoint": "/badroute",
                "reference": "badroute"
            }, {
                "endpoint": "/route2",
                "reference": "route2"
            }]
        };
        describe('Validate Happy Path Batch Endpoint Call', function() {
            it('Should combine both API EndPoints', function(done) {
                request.post('batch')
                    .send(batch)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) throw err;
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("route1").to.have.property("user");
                        expect(res.body).to.have.property("route2").to.have.property("beers");
                        expect(res.body).to.have.property("requestsCount").to.equal(3);
                        expect(res.body).to.have.property("requestsFailed").to.equal(1);
                        expect(res.body).to.have.property("requestTimeMillis").to.be.at.least(0);
                        done();
                    });
            });
        });

        after('Cleanup', function(done) {
            console.log("");
            server.stop();
            done();
        });
    });
});
