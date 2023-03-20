var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  compID: {
    type: String,
    required: true,
  },
  pelaporanDetails: {
    type: String,
    required: true,
  },
  pelaporanSuratPenyampaian: {
    type: String,
    required: true,
  },
  pelaporanSuratKalibrasi: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("dataUser", userSchema);
