var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: true,
  },
  lampiran: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: false,
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

module.exports = mongoose.model("Publikasi", userSchema);
