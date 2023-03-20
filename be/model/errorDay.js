var mongoose = require("mongoose");

var errorDayScheme = new mongoose.Schema({
    loggerID: {
        type: String,
        required: true,
    },
    errSUM: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("errorDay", errorDayScheme);
