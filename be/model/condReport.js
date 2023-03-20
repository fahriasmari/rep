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
  kondisi: {
    type: String,
    required: true,
  },
  kondisiTidakNormal: {
    type: Object,
    required: true,
  },
  kondisiDarurat: {
    type: Object,
    required: true,
  },
  kondisiTidakAdaAliranLimbah: {
    type: Object,
    required: true,
  },
  kondisiLain: {
    type: Object,
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
  lokasi: {
    type: String,
    required: true,
  },
  fasilitas: {
    type: String,
    required: true,
  },
  alatSparing: {
    type: Object,
    required: true,
  },
  alatIPAL: {
    type: Object,
    required: true,
  },
  alatLainnya: {
    type: String,
    required: true,
  },
  statusKejadian: {
    type: Object,
    required: true,
  },
  keluhanMasyarakat: {
    type: Object,
    required: true,
  },
  fileLampiranPath: {
    type: String,
    required: true,
  },
  fileSuratPath: {
    type: String,
    required: true,
  },
  fileSuratLogbookPath: {
    type: String,
    required: true,
  },
  fileLaporanPath: {
    type: String,
  },
});

module.exports = mongoose.model("condReport", condReportScheme);
