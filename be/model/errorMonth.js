var mongoose = require("mongoose");

var errorMonthScheme = new mongoose.Schema({
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

module.exports = mongoose.model("errorMonth", errorMonthScheme);
