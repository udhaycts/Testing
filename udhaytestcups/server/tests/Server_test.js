var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app.js');
var should = chai.should();
chai.use(chaiHttp);

var todoID;

/**
 * Test Suites
 */
describe('<Unit Test>', function () {
    // Start the server before the test case with delay of 1second to instantiate the routers
    before(function (done) {
        this.request = chai.request(server);
        setTimeout(function () {
            done();
        }, 1000);
    });
    describe('Method Get', function () {
        it('should be able to GET all ToDos without any problem', function (done) {
            this.request.get('/api/todos')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('status', 'Success');
                    res.body.should.have.property('data');
                    done();
                });
        });
    });

    describe('Method POST', function () {
        it('should not be able to POST empty tasks', function (done) {
            this.request.post('/api/todos')
                .send({'task_name': ''})
                .end(function (err, res) {
                    res.should.have.status(500);
                    res.body.should.have.property('status', 'Error');
                    res.body.should.have.property('data', 'Task name must not be empty');
                    done();
                });
        });
    });

    describe('Method POST', function () {
        it('should be able to POST task without problems', function (done) {
            this.request.post('/api/todos')
                .send({'task_name': 'Task1'})
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('status', 'Success');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('_id');
                    todoID = res.body.data._id;
                    done();
                });
        });
    });

    describe('Method PUT', function () {
        it('should be able to PUT task without problems', function (done) {
            this.request.put('/api/todos/' + todoID)
                .send({'task_name': 'Task2'})
                .end(function (error, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('status', 'Success');
                    res.body.should.have.property('data');
                    done();
                });
        });
    });

    describe('Method PUT', function () {
        it('should not be able to PUT empty tasks', function (done) {
            this.request.put('/api/todos/' + todoID)
                .send({'task_name': ''})
                .end(function (err, res) {
                    res.should.have.status(500);
                    res.body.should.have.property('status', 'Error');
                    res.body.should.have.property('data', 'Task name must not be empty');
                    done();
                });
        });
    });


    describe('Method PUT', function () {
        it('should not be able to PUT task with wrong toDo ID', function (done) {
            this.request.put('/api/todos/' + 0)
                .send({'task_name': 'Task 2'})
                .end(function (error, res) {
                    res.should.have.status(500);
                    res.body.should.have.property('status', 'Error');
                    res.body.should.have.property('data', 'Task ID is not valid');
                    done();
                });
        });
    });



    describe('Method DELETE', function () {
        it('should be able to DELETE task without problems', function (done) {
            this.request.delete('/api/todos/' + todoID)
                .end(function (error, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('status', 'Success');
                    res.body.should.have.property('data', 'Deleted Successfully');
                    done();
                });
        });
    });

    describe('Method DELETE', function () {
        it('should not be able to DELETE task with wrong toDo ID', function (done) {
            this.request.delete('/api/todos/' + 0)
                .end(function (err, res) {
                    res.should.have.status(500);
                    res.body.should.have.property('status', 'Error');
                    res.body.should.have.property('data', 'Task ID is not valid');
                    done();
                });
        });
    });
});

