var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  compName: {
    type: String,
    required: true,
  },
  compAddress: {
    type: String,
    required: true,
  },
  compTlp: {
    type: String,
    required: true,
  },
  compType: {
    type: String,
    required: true,
  },
  compPermit: {
    type: String,
    required: true,
  },
  compWasteSource: {
    type: String,
    required: true,
  },
  compInstance: {
    type: String,
    required: true,
  },
  compPermitDate: {
    type: String,
    required: true,
  },
  compTech: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("company", userSchema);
