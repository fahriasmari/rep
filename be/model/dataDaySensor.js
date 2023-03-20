var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    loggerID: {
        type: String,
        required: true,
    },
    dataParam: {
        type: Array,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
    keterangan: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("dataDaySensor", userSchema);
