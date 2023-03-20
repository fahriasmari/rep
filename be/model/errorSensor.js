var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  loggerID: {
    type: String,
    required: true,
  },
  dataSensorID: {
    type: String,
    required: true,
  },
  errorMsg: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("errorSensor", userSchema);
