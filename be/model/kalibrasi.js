var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  loggerID: {
    type: String,
    required: true,
  },
  parameter: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  min: {
    type: String,
    required: true,
  },
  max: {
    type: String,
    required: true,
  },
  tanggalKalibrasi: {
    type: Number,
    required: true,
  },
  akurasi: {
    type: String,
    required: true,
  },
  fileKalibrasi: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("kalibrasi", userSchema);
