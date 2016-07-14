"use strict";
// To get GMT format timestamp
function timestamp() {
    var dateObj = new Date();
    var day = dateObj.getDate();
    var month = dateObj.getMonth() + 1;
    var year = dateObj.getFullYear();
    var hours = dateObj.getHours();
    var minutes = dateObj.getMinutes();
    var seconds = dateObj.getSeconds();
    var milliseconds = dateObj.getMilliseconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;
    milliseconds = (milliseconds < 10 ? "0" : "") + milliseconds;
    return (month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":" + seconds + ":" + milliseconds);
}
/* This function initialises the Log Module */
function initLogModule() {
    return {
        log: function (logLevel, text) {
            console[logLevel](timestamp(), '- ' + logLevel + ': ', text);
        }
    };
}
/* Make the Log modules available to others too */
exports.initLogModule = initLogModule;




