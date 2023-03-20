var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  akun: {
    type: Object,
    required: true,
  },
  umum: {
    type: Object,
    required: true,
  },
  prosesProduksi: {
    type: Object,
    required: true,
  },
  teknis: {
    type: Object,
    required: true,
  },
  validitas: {
    type: Object,
    required: true,
  },
  frekuensi: {
    type: Object,
    required: true,
  },
  surat: {
    type: Object,
    required: true,
  },
  logger: {
    type: Array,
    required: true,
  },
  sensor: {
    type: Array,
    required: true,
  },
  validated: {
    type: Boolean,
    required: true,
  },
  rejected: {
    type: Boolean,
    required: false,
  },
  existing: {
    type: Boolean,
    required: false,
  },
  // resubmission: {
  //   type: Boolean,
  //   required: false,
  // },
  // perubahan_data: {
  //   type: Boolean,
  //   required: false,
  // },
  // pengajuan_baru: {
  //   type: Boolean,
  //   required: false,
  // },
});

module.exports = mongoose.model("formRegisComp", userSchema);
