var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  created_time: {
    type: Number,
    required: false,
  },
  updated_time: {
    type: Number,
    required: false,
  }
});

module.exports = mongoose.model("faqsCategory", userSchema);
