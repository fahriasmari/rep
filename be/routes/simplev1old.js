var express = require("express");
var router = express.Router();
const formRegisDB = require("../model/formRegisComp");
const covidFormDB = require("../model/Covid");
const compDB = require("../model/Company");
const loggerDB = require("../model/Logger");
const provDB = require("../model/Province");
const kabkotDB = require("../model/Kabkot");

router.get("/list-pendaftaran", async (req, res) => {
    if (req.query.key !== "klasjhfiuUYBjBDLN341kj1jkkaj1aq")
        return res.status(400).send("Key Error!");
    const formList = await formRegisDB.find();
    for (let i = 0; i < formList.length; i++) {
        const prov = await provDB.findOne({ _id: formList[i].umum.compProvince });
        const kabkot = await kabkotDB.findOne({ _id: formList[i].umum.compCity });
        const timestamp = formList[i]._id.toString().substring(0, 8);
        formList[i].umum.createdAt = parseInt(timestamp, 16);
        formList[i].umum.compProvinceName = prov.provName;
        formList[i].umum.compCityName = kabkot.kabkotName;
        if (formList[i].validated === true) {
            const comp = await compDB.findOne({
                compName: formList[i].umum.compName,
            });
            const logger = await loggerDB.findOne({ compID: comp._id });
            formList[i].umum.loggerID = logger._id;
            console.log(formList[i].loggerInfo);
        }
    }

    res.send(formList);
});

router.get("/daftar-pendaftaran", async (req, res) => {
    const { key, id_pendaftaran } = req.query;
    let dataSimple;
    let covidTahap;
    if (key !== "klasjhfiuUYBjBDLN341kj1jkkaj1aq")
        return res.status(400).send("Key Error!");
    const formList = await formRegisDB.findById(id_pendaftaran);


    if (!formList)
        return res.status(400).send("Id Pendaftaran Tidak Ditemukan");
    const covidForm = await covidFormDB.findOne({ 'detail.compName': formList.compName });
    if (covidForm == null) {
        covidTahap = "Tidak Ada Pelaporan Terkendala Pandemi Covid-19"
    }
    else {
        covidTahap = covidForm.detail.tahap

    }
    const prov = await provDB.findOne({ _id: formList.umum.compProvince });
    const kabkot = await kabkotDB.findOne({ _id: formList.umum.compCity });
    const timestamp = formList._id.toString().substring(0, 8);
    formList.umum.createdAt = parseInt(timestamp, 16);
    formList.umum.compProvinceName = prov.provName;
    formList.umum.compCityName = kabkot.kabkotName;
    console.log(formList.validated);
    if (formList.validated === true) {
        const comp = await compDB.findOne({
            compName: formList.umum.compName,
        });
        const logger = await loggerDB.findOne({ compID: comp._id });
        formList.umum.loggerID = logger._id;
    }
    else {
        return res.status(400).send("Perusahaan belum di validasi oleh team sparing. Silahkan hubungi tim sparing");
    }
    // count sensor parameter active

    let sensorCount = 0;
    let dataBML = [];


    for (let i = 0; i < formList.sensor.length; i++) {
        // console.log(formList.sensor[i].active)
        if (formList.sensor[i].active == true) {

            dataBML.push({ name: formList.sensor[i].name, bml_min: formList.sensor[i].min, bml_max: formList.sensor[i].max })

            sensorCount++
        }
        else {
            dataBML.push({ name: formList.sensor[i].name, bml_min: null, bml_max: null })
        }

    }


    dataSimple = {
        id_perusahaan: formList.loggerID,
        id_pendaftaran: id_pendaftaran,
        nama_perusahaan: formList.umum.compName,
        no_izin_lingkungan: formList.teknis.permitNumber,
        nama_titik_penaatan: formList.teknis.spotList[0].spotName,
        hasil_uji_kalibrasi: formList.validitas.kalibrasiRutinFile.path,
        hasil_uji_kinerja: formList.validitas.kinerjaFile.path,
        jumlah_parameter: sensorCount,
        parameter_sensor: dataBML,
        tahap_covid_19: covidTahap,
        // status_pendaftaran_sparing: formList.
    }
    res.send(dataSimple);
});

module.exports = router;
