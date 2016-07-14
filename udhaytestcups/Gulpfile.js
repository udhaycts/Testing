var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var istanbul = require('gulp-istanbul');
var karma = require('karma').server;


//Task to run DB unit test cases. Thsi will test the CRUD operations in the database
gulp.task('test_DB', function () {

    return gulp.src('./server/tests/DBTest.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'spec'}));
});

//Sub task which initiates the istanbul for code coverage
gulp.task('pre-test_server', function () {
    return gulp.src(['./server/**/*.js'])
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

//Task to start the server tests and runs the subtask pre-test_server for code coverage
gulp.task('test_server', ['pre-test_server'], function () {
    return gulp.src(['./server/tests/Server_test.js'])
        .pipe(mocha())
        // Creating the reports after tests ran
        .pipe(istanbul.writeReports({dir: './server/tests/results/coverage'}));

});

//Task to run the jshint for all the js source files
gulp.task('jshint', function () {
    return gulp
        .src(['*.js', 'server/**/*.js','client/**/*.js'])
        .pipe(jshint())
        //Set the option as node source files
        .pipe( jshint( { "node": true , "jquery":true, "mocha":true,"esversion" : 6 } ) )
        //Setting the report type
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

//Task to run the UI Test cases using karma
gulp.task('test_UI', function(done) {
    return karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function() {
        done();
    });
});
