var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  pendaftaranID: {
    type: String,
    required: true,
  },
  field: {
    type: Array,
    required: true,
  },
  keterangan: {
    type: Array,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("History_perubahan_data", userSchema);
