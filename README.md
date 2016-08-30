# restify-batch-endpoint
![dependencies](https://david-dm.org/hansenwebco/restify-batch-endpoint.svg)
[![npm version](https://badge.fury.io/js/restify-batch-endpoint.svg)](https://badge.fury.io/js/restify-batch-endpoint)

Restify Batch Endpoint allows Restify users to group several requests into a single response.  Currently the module supports only **GET** Requests against endpoints.  The code as loosly based on "batch-endpoint" which handled the requests and responses in a different manner.

## Installation
```sh
npm install restify-batch-endpoint
npm update
```

## Configuration

To use the module you will want to configure a route on your API that handles a **POST** and routes the request to the restify-batch-endpoint.

### Require the Plugin
```sh
var batchEndpoint = require('restify-batch-endpoint');
```

### Configure the Endpoint
Where **server** is your restify instance.
```sh
batchEndpoint.configureEndPoint(server,{
        "maxRequests": 9
        }
    );
```
### Configure the Route
```sh
server.post('/batch', batchEndpoint.batchProcess);
```

## Using Your New Route
The module will make requests against the same IP and Port in which your Restify server has been created.  To receive a a combined response make a **POST** to the route you configured above ( In this example above ht&#8203;ttp://server:port/batch ).

The format is as follows, where **requests** is list of end points where **endpoint** is the Restify route you wish to call, and **reference** is the associated object that will be returned in the response.

```json
{
  "requests": [
    {
      "endpoint": "/user/1",
      "reference": "user"
    },
    {
      "endpoint": "/state/1",
      "reference": "state"
    }
  ]
}
```

An example response based on the above request may look something like
```json
{
  "user": [
    {
      "UserID": 1,
      "UserLevel": 2,
      "Username": "jsmith"
    }
  ],
  "state": [
    {
      "StateName": "Florida",
      "StateID": 1
    }
  ],
  "requestsCount": 2,
  "requestsFailed": 0,
  "requestTimeMillis": 217
}
```
## Error Handling
Where possible errors are passed back in the response using the Restiy Error objects, and example may look like.
```json
{
  "user": {
    "jse_shortmsg": "",
    "jse_info": {},
    "message": "/users/1/prfile does not exist",
    "statusCode": 404,
    "body": {
      "code": "ResourceNotFound",
      "message": "/users/1/prfile does not exist"
    },
    "restCode": "ResourceNotFound",
    "name": "ResourceNotFoundError"
  },
  "state": [
    {
      "StateName": "Florida",
      "StateID": 1
    }
  ],
  "requestsCount": 2,
  "requestsFailed": 1,
  "requestTimeMillis": 217
}
```

## Testing
Tests are contained in the **test** folder and utilize Mocha, Chai, and Supertest.  You will need to install Mocha globally to run tests:
```sh
npm install -g mocha
```
by simply typing
```sh
mocha
```
in your console within the project folder.
