var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  compID: {
    type: String,
    required: true,
  },
  kabkotID: {
    type: String,
    required: true,
  },
  provID: {
    type: String,
    required: true,
  },
  logDataRange: {
    type: Array,
    required: true,
  },
  latlong: {
    type: Object,
    required: true,
  },
  errCounter: {
    type: Number,
    required: false,
  },
  activationStatus: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("logger", userSchema);
