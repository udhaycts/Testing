/*global describe */
/*global beforeEach*/
/*global it */

/*
 This file contains the test cases in order to test the working of CRUD operations in To do database
 */

'use strict';


// Module dependencies.


var mongoose = require("mongoose");
var config = require("../vcap_parser/environment_parser");
console.log('Connecting to DB '+config.getEnv().url);
mongoose.connect(config.getEnv().url);
var expect = require('expect.js'),
    ToDo = require('../models/model');


/**
 * Globals
 */

var todo;

/**
 * Test Suites
 */
describe('<Unit Test>', function () {
    describe('Model todo:', function () {
        //The following code is executed before each test case
        beforeEach(function (done) {
            //The timeout limit is set for each test case to be executed
            this.timeout(10000);

            done();
        });
        describe('Method Insert', function () {

            it('should be able to save without problems', function (done) {
                this.timeout(10000);
                //Initialising a todo variable to be used in each test case
                todo = new ToDo({
                    task_name: 'ToDo number one'
                });
                return todo.save(function (error, data) {
                    expect(error).to.be(null);
                    //Check if the inserted data is null
                    expect(data.task_name).to.equal('ToDo number one');
                    done();
                });

            });

            it('should be able to show an error when try to save without task_name', function (done) {
                this.timeout(10000);
                todo.task_name = '';

                return todo.save(function (error) {
                    expect(error).to.not.be(null);
                    done();
                });
            });



        });
        describe('Method Get All', function () {

            it('should be able to retrieve all ToDos without any problem', function (done) {
                this.timeout(10000);
                return ToDo.find(function (error, todos) {
                    expect(error).to.be(null);
                    //Since a previous insert has been done, there should be atleast one todo in the database
                    expect(todos.length).to.be.above(0);
                    //Check if the list of datas has the data which we have inserted.
                    var isDataExists = 0;
                    for (var i = todos.length - 1; i > -1; i--) {
                        if (todos[i].task_name === "ToDo number one"){
                            isDataExists = 1;
                        }
                    }
                    expect(isDataExists).to.be(1);
                    done();
                });

            });

        });
        describe('Method Update', function () {

            it('should be able to update without problems', function (done) {
                this.timeout(10000);
                todo.task_name="ToDo number two";
                return todo.save({
                    _id : todo.id
                }, function (error,toDoObject) {
                    expect(error).to.be(null);
                    //Check if the updated value is reflected
                    expect(toDoObject.task_name).to.equal('ToDo number two');
                    done();
                });

            });

        });
        describe('Method Delete', function () {

            it('should be able to delete without problems', function (done) {
                this.timeout(10000);

                return ToDo.remove({
                    _id : todo.id
                }, function (error) {
                    expect(error).to.be(null);
                    done();
                });

            });

        });

    });
});
