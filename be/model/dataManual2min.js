var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  condReportID: {
    type: String,
    required: true,
  },
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
  serverTimestamp: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("dataManual2Min", userSchema);
