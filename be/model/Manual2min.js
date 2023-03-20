var mongoose = require("mongoose");

var condReportScheme = new mongoose.Schema({
  compID: {
    type: String,
    required: true,
  },
  provID: {
    type: String,
    required: true,
  },
  kabkotID: {
    type: String,
    required: true,
  },
  tanggalKejadian: {
    type: Number,
    required: true,
  },
  endTanggalKejadian: {
    type: Number,
    required: true,
  },
  fileLaporanPath: {
    type: String,
    required: true,
  },
  filePendukungPath: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("manual2min", condReportScheme);
