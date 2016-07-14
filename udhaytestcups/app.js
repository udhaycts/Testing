"use strict";
/*globals logger*/
var logModule = require("./server/controllers/LogHandler");
/*  Initialise Logging */
global.logger = logModule.initLogModule();
// Add Dependent modules.
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// initializes routes
var httpRouter = require('./server/routes');
var port = process.env.PORT || 1884;

//To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express
app.use(express.static('./client'));

// enables our Express application to parse incoming JSON post bodies
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended': 'true'}));

// Attach the routers for their respective paths
app.use('/api/todos/', httpRouter);

// If no route is matched by now, it must be a 404
app.use(function (req, res) {
    res.status(404);
    res.send({error: 'Page Not found'});
    return;
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(500).json({
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(500).json({
        message: err.message,
        error: err
    });
});
// Uncaught exception handler
process.on('uncaughtException', function (err) {
    logger.log("error", err.stack);
});

// START THE SERVER
app.listen(port);
logger.log("info", "App listening on port " + port);
module.exports = app;