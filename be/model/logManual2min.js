var mongoose = require("mongoose");

var logLaporanManual2min = new mongoose.Schema({
  manual2minID: {
    type: String,
    required: true,
  },
  keterangan: {
    type: String,
    required: true,
  },
  petugas: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("logManual2min", logLaporanManual2min);
