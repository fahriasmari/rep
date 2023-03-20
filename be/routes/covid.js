let express = require("express")
let router = express.Router()
module.exports = router

let moment = require("moment")
let provDB = require("../model/Province")
let kabkotDB = require("../model/Kabkot")
let covidDB = require("../model/Covid")
let xl = require('excel4node')

// get list of covid
//
router.get("/list", async (req, res) => {
    try {
        let rs = await covidDB.find()
        for (let r of rs) {
            let ts = r._id.toString().substring(0, 8)
            r.detail.createdAt = parseInt(ts, 16)

            if (r.detail.compProvince) {
                const prov = await provDB.findOne({
                    _id: r.detail.compProvince,
                })

                r.detail.compProvinceName = prov.provName
                const kabkot = await kabkotDB.findOne({
                    _id: r.detail.compCity,
                })
                r.detail.compCityName = kabkot.kabkotName
            }
        }

        res.send(rs)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

// export
//
router.get("/export", async (req, res) => {
    try {
        var wb = new xl.Workbook()
        var ws = wb.addWorksheet('Covid')

        let col = 1
        //Akun
        ws.cell(col, 1).string('Nama Perusahaan')
        ws.cell(col, 2).string('Jenis Industri')
        ws.cell(col, 3).string('Alamat Perusahaan')
        ws.cell(col, 4).string('Provinsi')
        ws.cell(col, 5).string('Kabupaten / Kota')
        ws.cell(col, 6).string('Telepon Kantor')
        ws.cell(col, 7).string('Email Kantor')
        ws.cell(col, 8).string('Penanggungjawab Sparing')
        ws.cell(col, 9).string('Handphone Penanggungjawab Sparing')
        ws.cell(col, 10).string('Email Penanggungjawab Sparing')
        ws.cell(col, 11).string('Tahapan Pemasangan SPARING')
        ws.cell(col, 12).string('Bukti Pengadaan Sparing (Dokumen Tender)')
        ws.cell(col, 13).string('Foto Instalasi')
        ws.cell(col, 14).string('Foto Sparing')
        ws.cell(col, 15).string('Dokumen Pemasangan')
        ws.cell(col, 16).string('Perencanaan Masa Uji / Commisioning')
        ws.cell(col, 17).string('Rencana Pengoperasian Sparing')

        const rs = await covidDB.find({});
        for (let r of rs) {
            let ts = r._id.toString().substring(0, 8)
            r.detail.createdAt = parseInt(ts, 16)
            if (r.detail.compProvince) {
                const prov = await provDB.findOne({
                    _id: r.detail.compProvince,
                })
                r.detail.compProvinceName = prov.provName

                const kabkot = await kabkotDB.findOne({
                    _id: r.detail.compCity,
                })
                r.detail.compCityName = kabkot.kabkotName
            }

            col++
            ws.cell(col, 1).string(r.detail.compName)
            ws.cell(col, 2).string(r.detail.compType)
            ws.cell(col, 3).string(r.detail.compAddress)
            ws.cell(col, 4).string(r.detail.compProvinceName)
            ws.cell(col, 5).string(r.detail.compCityName)
            ws.cell(col, 6).string(r.detail.compPhone)
            ws.cell(col, 7).string(r.detail.compMail)
            ws.cell(col, 8).string(r.detail.compCP)
            ws.cell(col, 9).string(r.detail.personPhone)
            ws.cell(col, 10).string(r.detail.personMail)
            ws.cell(col, 11).string(r.detail.tahap)
            ws.cell(col, 12).string((r.fileTender.hasOwnProperty('path') && r.fileTender.path != '') ? 'File Terupload' : 'File tidak tersedia')
            ws.cell(col, 13).string((r.photoPemasangan.hasOwnProperty('path') && r.photoPemasangan.path != '') ? 'File Terupload' : 'File tidak tersedia')
            ws.cell(col, 14).string((r.photoSPARING.hasOwnProperty('path') && r.photoSPARING.path != '') ? 'File Terupload' : 'File tidak tersedia')
            ws.cell(col, 15).string((r.filePemasangan.hasOwnProperty('path') && r.filePemasangan.path != '') ? 'File Terupload' : 'File tidak tersedia')
            ws.cell(col, 16).string((r.fileCommission.hasOwnProperty('path') && r.fileCommission.path != '') ? 'File Terupload' : 'File tidak tersedia')
            ws.cell(col, 17).string((r.filePengoperasion.hasOwnProperty('path') && r.filePengoperasion.path != '') ? 'File Terupload' : 'File tidak tersedia')
        }
        wb.write(`List Pertanggungan Covid.xlsx`, res)
    } catch (error) {
        res.status(400).send(error)
    }
})



// creates a new covid-form
//
router.post("/", async function (req, res, next) {
    const a = new covidDB(req.body)
    const r = await a.save()
    res.send(r)
})

// get a covid-form
//
router.get("/:covidFormID", async function (req, res, next) {
    let r = await covidDB.findOne({
        _id: req.params.covidFormID
    })
    res.send(r)
})


// update a covid-form
// covidFormID is in _id
//
router.put("/", async (req, res) => {
    try {
        req.body.detail.updatedAt = moment().unix()
        let dataUpdate = await covidDB.updateOne({
            _id: req.body._id
        }, req.body)
        res.send(dataUpdate)
    } catch (error) {
      res.status(400).send("Update Error")
    }
})


// delete a covid-form
//
router.delete("/:covidFormID", async (req, res) => {
    try {
        const covidDel = await covidDB.deleteOne({
            _id: req.params.covidFormID
        })
        res.send(covidDel)
    } catch (error) {
        res.status(400).send(error)
    }
})


