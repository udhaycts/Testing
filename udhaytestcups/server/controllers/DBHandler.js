"use strict";

/**
 * This file contains the database CRUD operations
 */



//Module dependencies.
var mongoose = require("mongoose");
var config = require("../vcap_parser/environment_parser");

/**
 * Connect to the mongo database by getting the mongo server URL from the environment parser
 * @param callBack - callback function to proceed to the ToDoHandler
 */
function initDb(callBack){
    mongoose.connect(config.getEnv().url,callBack);
}

/**
 * Save a record
 * @param model - The model object created using the schema which contains the data to be saved
 * @param callBack - The call-back function to catch the response or error
 * The data which has to be inserted or updated is passed to the function in the model object
 */
function save(model,callBack){
    //insert or update the data into database
    model.save(callBack);
}


/**
 * Find a record
 * @param schema - The mongoose schema of the database.
 * @param _id - The default _id value created by mongodb which is the primary key for any object
 * @param callBack - The call-back function to catch the response or error
 * The data is retrieved from the database with the unique _id as input.
 */
function findById(schema,_id,callBack)
{
    //find the existing record from the database, with the _id value
    schema.findById(_id, callBack);
}


/**
 * Delete a record
 * @param model - The existing model object retrieved from the database which needs to be deleted
 * @param callBack - The call-back function to catch the response or error
 * The object retrieved from the database is deleted.
 */
function remove(model,callBack) {
    model.remove(callBack);
}

/**
 * Retrieve all records
 * @param schema - The mongoose schema of the database.
 * @param callBack - The call-back function to catch the response or error
 * All the records present in the database is returned.
 */
function findAll(schema, callBack) {
    // use mongoose to get all records in the database
    schema.find(callBack);
}

//Export all the functions
exports.initDb = initDb;
exports.findById=findById;
exports.save = save;
exports.findAll = findAll;
exports.remove = remove;