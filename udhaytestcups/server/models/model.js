
//Database schema for the ToDo database model is defined in this file

var mongoose = require("mongoose");
var  Schema = mongoose.Schema;

var toDoSchema = new Schema({
    task_name: {
        //The text holding the ToDo information
        type: String,
        //In order to make the text mandatory, the following line is given
        required: true
    }
});

//Export the schema with the name as "ToDO"
module.exports = mongoose.model('ToDo', toDoSchema);
