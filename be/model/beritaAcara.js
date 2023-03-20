var mongoose = require("mongoose");

var beritaAcaraScheme = new mongoose.Schema({
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

    detailOtherComp: {
        type: Object,
        required: true,
    },

    tanggalBeritaAcara: {
        type: String,
        required: true,
    },
    lampiranBeritaAcara: {
        type: Object,
        required: true,
    },
    tanggalKunjungan: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("formberitaAcara", beritaAcaraScheme);
