var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  dataParam: {
    type: Array,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("dataAdmin2min", userSchema);
