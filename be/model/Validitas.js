let mongoose = require("mongoose");

module.exports = mongoose.model("validitas", new mongoose.Schema({
    // it will be server generated
    waktu: {
        type: Number,
        required: true,
    },

    userEmail: {
        type: String,
        required: true,
    },

    condReportsID: {
        type: String,
        required: true,
    },

    // Reject or Accepted
    status: {
        type: String,
        required: true,
    },

    catatan: {
        type: String,
        required: true,
    },
}))
