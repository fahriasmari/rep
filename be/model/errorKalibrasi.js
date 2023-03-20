var mongoose = require("mongoose");

var errorKalibrasiScheme = new mongoose.Schema({
  loggerID: {
    type: String,
    required: true,
  },
  errorMsg: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("errorKalibrasi", errorKalibrasiScheme);
