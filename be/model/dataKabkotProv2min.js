var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  provkabkotID: {
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
});

module.exports = mongoose.model("dataKabkotProv2min", userSchema);
