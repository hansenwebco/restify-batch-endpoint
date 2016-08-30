var server = require("./server.js");
var expect = require("chai").expect;
var should = require("chai").should;
var supertest = require("supertest");
var api = supertest("http://localhost:3000");

describe('Mocha Test Suite', function() {

    describe('Starting up Restify Server', function() {
        before('Server Starting', function(done) {
            server.start(function() {
                console.log("");
                done();
            });
        });

        describe('Validate Testing End Points', function() {
            it('API Route1 Should return a 200', function() {
                //supertest(server).
                api.get("/route1")
                    .set('Accept', 'application/json')
                    .expect(function(res) {
                      res.body.use = 'John Smith';
                    });

            });
            it('API Route2 Should return a 200', function() {
                api.get("/route2")
                    .set('Accept', 'application/json')
                    .expect(200);
            });
        });

        after('Cleanup', function() {
            server.stop();
        });
    });
});


// describe('hooks', function() {
//
//     before(function() {
//         console.log("Server Starting");
//         // server.start(function() {
//         //     console.log("Server Started");
//         //     done();
//         //});
//     });

// after(function() {
//     it('Should return a 200', function(done) {
//         api.get("/route1")
//             .set('Accept', 'application/json')
//             .expect(200, done);
//     });
//});

//});
