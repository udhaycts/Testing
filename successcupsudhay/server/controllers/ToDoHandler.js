"use strict";

//Module dependencies.
/*globals logger*/
var ToDoDbHandler = require('./DBHandler');
var ToDoModel = require('../models/model');

/**
 * connect to mongo db
 * @param callBack - callback function to proceed to the route’s handler
 */

ToDoDbHandler.initDb(function()
{
    logger.log("info","Succesfully connected to DB ...");
});



/**
 * Response Handler
 * @param response - Object through which response is sent
 * @param status - Boolean status of the process
 * @param data - contains the error or data information to be returned
 * The response handler will send the data in json format according to the status.
 */
function responseHandler(response,status,data){

    var errorCode;
    var responseObject;
    if(status){
        logger.log("info","Response sent successfully :"+data);
        //status is set as 200 since the result is success
        errorCode=200;
        responseObject={
            status: "Success",
            data: data
        };

    }
    else
    {
        logger.log("error","Server error has occurred :"+data);
        //status is set as 500 since error has occurred. The error information is sent as response.
        errorCode=500;
        responseObject={
            status: "Error",
            data: data
        };

    }
    response.status(errorCode).json(responseObject);
}



/**
 * Create a new toDo record
 * @param request
 * @param response
 * The Data to be inserted is passed in the request body
 */
function create(request,response){
    //construct a todomodel variable from the post request obtained
    var toDo = new ToDoModel(request.body);
    //Check if task_name is empty or not given
    if(toDo.task_name === undefined || toDo.task_name === "")
    {
        return responseHandler(response,false,"Task name must not be empty");
    }
    //Call the DBHandler function to insert the data
    ToDoDbHandler.save(toDo,function(err,data)
    {
        //If some error has occurred send error response
        if(err)
        {
            return responseHandler(response,false,err);
        }
        else
        {
            return responseHandler(response,true,data);
        }
    });
}


/**
 * Update a toDo record
 * @param request
 * @param response
 * The Data to be modified is passed in the request body and _id of object to be modified is passed as path param
 */
function update(request, response) {

    //find the existing to do from the database, with the _id value sent in the request param
    ToDoDbHandler.findById(ToDoModel,request.params._id, function (error, toDo) {
        //If any error has occurred, it means the task id is not present in the database
        if (error || !toDo) {
            return responseHandler(response,false,"Task ID is not valid");
        }
        //Assign the new value from the request body to the object obtained from database
        toDo.task_name = request.body.task_name;
        //Check if task_name is empty or not given
        if (toDo.task_name === undefined || toDo.task_name === "") {
            return responseHandler(response,false,"Task name must not be empty");

        }
        //Update the to do object in the database
        ToDoDbHandler.save(toDo,function (error, toDoObject) {

            //If any error has occurred, it will be stored in error variable
            if (error) {
                return responseHandler(response,false,error);
            }
            //If no error has occurred send the updated data as part of response
            else {
                return responseHandler(response,true,toDoObject);

            }
        });
    });
}

/**
 * Delete a to do record
 * @param request
 * @param response
 * The _id of object to be deleted is passed as path param
 */
function remove(request, response) {

    //Search the todo object from the database for the given _id
    ToDoDbHandler.findById(ToDoModel,request.params._id,function (error, toDo) {
        //If any error has occurred, the object is not present in the database, hence send error response
        if (error || !toDo) {
            return responseHandler(response,false,"Task ID is not valid");
        }
        //Delete the to do data from database
        ToDoDbHandler.remove(toDo,function (error) {
            //If any error has occurred, it will be stored in error variable
            if (error) {
                return responseHandler(response,false,error);
            }
            //If no error has occurred send the success message as response
            else {
                return responseHandler(response,true,"Deleted Successfully");
            }

        });
    });
}

/**
 * Create a new to do record
 * @param request
 * @param response
 * All the records present in the database is returned
 */
function all(request, response) {
    logger.log("info","GET request received ");

    //The DBHandler function will retrieve all the todos from the database
    ToDoDbHandler.findAll(ToDoModel,function (error, todos) {
        // if there is an error retrieving, send the error. nothing after response.send(error) will execute
        if (error) {
            return responseHandler(response,false,error);
        }
        // return all todos in the response
        else
        {
            return responseHandler(response,true,todos);
        }
    });

}

//Export all functions in order to call from the route.js
exports.create = create;
exports.all = all;
exports.update = update;
exports.remove = remove;