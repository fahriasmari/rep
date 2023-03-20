let mongoose = require('mongoose')
let Tanggapan = new mongoose.Schema({
    waktu: {
        type: Number,
        required: true,
    },

    userEmail: {
        type: String,
        required: true,
    },

    tanggapan: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model("pengaduan", new mongoose.Schema({
    // it will be server generated
    waktu: {
        type: Number,
        required: true,
    },
    provID: {
        type: String,
        required: true,
    },
    kabkotID: {
        type: String,
        required: true,
    },
    compID: {
        type: String,
        required: true,
    },

    judul: {
        type: String,
        required: true
    },

    detail: {
        type: String,
        required: true,
    },

    penulis: {
        type: String,
        required: true,
    },

    kontak: {
        type: String,
        required: false,
    },

    lampiran: {
        type: Object,
        required: false,
    },

    tanggapan: {
        type: [Tanggapan],
        required: false,
    },
}))
