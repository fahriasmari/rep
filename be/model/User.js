var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  userRole: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("user", userSchema);
