module.exports = function(config){

    config.set({
        frameworks: ["jasmine"],
        files: [
            './node_modules/angular/angular.js',
            './node_modules/angular-mocks/angular-mocks.js',
            './client/controllers/toDo.js',
            './client/services/toDo.js',
            './client/assets/css/toDo.css',
            './client/index.html',
            './client/tests/test.js'
        ],

        exclude: [
            './client/lib/angular/angular-loader.js',
            './client/lib/angular/*.min.js',
            './client/lib/angular/angular-scenario.js'
        ],


        browsers: ["PhantomJS"],
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-coverage',
            'karma-spec-reporter'
        ],

        reporters: ["spec","coverage"],
        preprocessors: { 'client/!(lib)/**/*.js': ['coverage'] },
        // optionally, configure the reporter
        coverageReporter: {
            type : 'html',
            dir : 'client/tests/results/coverage'
        }

    });

};