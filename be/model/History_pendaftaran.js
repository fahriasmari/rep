var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  formregiscomps_id: {
    type: String,
    required: true,
  },
  histori_pendaftaran: {
    type: Array,
    required: true,
  }
});

module.exports = mongoose.model("History_pendaftaran", userSchema);
