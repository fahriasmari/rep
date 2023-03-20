var mongoose = require("mongoose");

var loglaporanMingguanScheme = new mongoose.Schema({
  formMingguanID: {
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
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("logFormMingguan", loglaporanMingguanScheme);
