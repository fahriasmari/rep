var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  datePengumuman: {
    type: Number,
    required: true,
  },
  isiPengumuman: {
    type: String,
    required: false,
  },
  filePengumuman: {
    type: Object,
    required: false,
  },
});

module.exports = mongoose.model("announcement", userSchema);
