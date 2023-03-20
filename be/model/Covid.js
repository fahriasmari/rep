var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  detail: {
    type: Object,
    required: true,
  },
  fileTender: {
    type: Object,
    required: false,
  },
  fileVendor: {
    type: Object,
    required: false,
  },
  fileJadwal: {
    type: Object,
    required: false,
  },
  photoPemasangan: {
    type: Object,
    required: false,
  },
  photoSPARING: {
    type: Object,
    required: false,
  },
  filePemasangan: {
    type: Object,
    required: false,
  },
  fileCommission: {
    type: Object,
    required: false,
  },
  filePengoperasion: {
    type: Object,
    required: false,
  },
});

module.exports = mongoose.model("covidForm", userSchema);
