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
  serverTimestamp: {
    type: Number,
    required: true,
  },
  isCount: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("dataSensor", userSchema);
