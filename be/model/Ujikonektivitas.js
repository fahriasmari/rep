var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  umum: {
    type: Object,
    required: true,
  },
  uid:{
    type: Number,
    required:false,
  },
  logger: {
    type: Array,
    required: true,
  },
  sensor: {
    type: Object,
    required: false,
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
  keterangan: {
    type: Object,
    required: false,
  },
  validated: {
    type: Boolean,
    required: true,
  },
  validitas: {
    type: Array,
    required: false,
  }
});

module.exports = mongoose.model("Ujikonektivitas", userSchema);
