var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  // compID: {
  //   type: String,
  //   required: true,
  // },
  pendaftaranID: {
    type: String,
    required: true,
  },
  detail_dokumen: {
    type: Array,
    required: true,
  },
  created_time: {
    type: Number,
    required: false,
  },
  updated_time: {
    type: Number,
    required: false,
  },
  validated_time: {
    type: Number,
    required: false,
  },
  validated: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("History_doc", userSchema);
