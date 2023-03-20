var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  loggerID: {
    type: String,
    required: true,
  },
  lastDataTime: {
    type: Number,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("dataChecker", userSchema);
