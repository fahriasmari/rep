var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  provCode: {
    type: Number,
    required: true,
  },
  provName: {
    type: String,
    required: true,
  },
  latlong: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("provdbs", userSchema);
