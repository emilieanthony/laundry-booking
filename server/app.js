var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors');
var history = require('connect-history-api-fallback');
var jwt = require('jsonwebtoken'); // json web token library

var registerUserRoutes = require('./controllers/users');
var bookingRoutes = require('./controllers/bookings');
var auth = require('./controllers/auth');
var noteRoutes = require('./controllers/notes');
var notificationRoute = require('./controllers/notifications');

// Variables
var tokenSecret = 'a-secret-that-should-not-be-shared'; // TODO: use better secret
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laundryDB';
var port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(
    mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err) {
        if (err) {
            console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
            console.error(err.stack);
            process.exit(1);
        }
        console.log(`Connected to MongoDB with URI: ${mongoURI}`);
    }
);

// Create Express app
var app = express();
// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// HTTP request logger
app.use(morgan('dev'));
// Enable cross-origin resource sharing for frontend must be registered before api
app.options('*', cors());
app.use(cors());
var api = express.Router();
app.use('/api', api);
auth(api, tokenSecret); // allows unauthorized requests to register and login endpoints
api.get('/', function(req, res) {
    res.json({'message': 'Welcome to your DIT341 backend ExpressJS project!'});
});

// checks if token in authorization header is valid
api.use(function (req, res, next) {
    const headerValue = req.header('authorization');
    if(!headerValue || headerValue === 'undefined') {
        return res.status(401).send();
    }
    const splitValue = headerValue.split('Bearer');
    if(!splitValue.length) {
        return res.status(401).json({'message': 'invalid token format'});
    }
    const token = splitValue[1].trim();
    jwt.verify(token, tokenSecret, function(err) {
        if(err) {
            return res.status(403).send();
        }
        next();
    });
});

// Import routes
bookingRoutes(api);
registerUserRoutes(api);
noteRoutes(api);
notificationRoute(api);
// Catch all non-error handler for api (i.e., 404 Not Found)
api.use('/*', function (req, res) {
    res.status(404).json({ 'message': 'Not Found' });
});

// Configuration for serving frontend in production mode
// Support Vuejs HTML 5 history mode
app.use(history());
// Serve static assets
var root = path.normalize(__dirname + '/..');
var client = path.join(root, 'client', 'dist');
app.use(express.static(client));

// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get('env');
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    console.error(err.stack);
    var err_res = {
        message: err.message,
        error: {},
    };
    if (env === 'development') {
        // Return sensitive stack trace only in dev mode
        err_res['error'] = err.stack;
    }
    res.status(err.status || 500);
    res.json(err_res);
});

app.listen(port, function (err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}, in ${env} mode`);
    console.log(`Backend: http://localhost:${port}/api/`);
    console.log(`Frontend (production): http://localhost:${port}/`);
});

module.exports = app;
