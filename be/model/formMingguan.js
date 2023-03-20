var mongoose = require("mongoose");

var laporanMingguanScheme = new mongoose.Schema({
  loggerID: {
    type: String,
    required: true,
  },
  fileSHU: {
    type: Object,
    required: true,
  },
  dataParam: {
    type: Array,
    required: true,
  },
  validasi: {
    type: Boolean,
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
  compID: {
    type: String,
    required: true,
  },
  reject: {
    type: Boolean,
    required: true,
  },
  // isDeleteErrorCaps: {
  //   type: Boolean,
  //   required: true,
  // },
  status: {
    type: String,
    required: true,
  },
  tanggalKejadian: {
    type: String,
    required: true,
  },
  endTanggalKejadian: {
    type: String,
    // required: true,
  },
  week: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
    required: false,
  },
  validatedAt: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("formMingguan", laporanMingguanScheme);
