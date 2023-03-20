var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  categoryFaq: {
    type: String,
    required: true,
  },
  pertanyaan: {
    type: String,
    required: true,
  },
  jawaban: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: false,
  },
  created_time: {
    type: Number,
    required: false,
  },
  updated_time: {
    type: Number,
    required: false,
  }
});

module.exports = mongoose.model("Faq", userSchema);
