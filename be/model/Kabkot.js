var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  provID: {
    type: String,
    required: true,
  },
  kabkotName: {
    type: String,
    required: true,
  },
  latlong: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("kabkotdb", userSchema);
