"use strict";
var express = require('express');
/**
 * DB functions which get pass to the route after the path
 * @type {Todo}
 */

var ToDoHandler = require('./controllers/ToDoHandler');
// Create the express router object for ToDo
var ToDoRouter = express.Router();


//Create a single todo
ToDoRouter.post('/', ToDoHandler.create);

//Get all todos
ToDoRouter.get('/', ToDoHandler.all);

/**
 * update a single todo
 */
ToDoRouter.put('/:_id', ToDoHandler.update);

/**
 * delete a single todo
 */
ToDoRouter.delete('/:_id', ToDoHandler.remove);

module.exports = ToDoRouter;
