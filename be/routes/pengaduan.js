
let express = require("express")
let router = express.Router()
module.exports = router

let pengaduanDB = require("../model/Pengaduan")
let userDB = require("../model/User")
let companyDB = require("../model/Company")
let provinsiDB = require("../model/Province")
let kabkotDB = require("../model/Kabkot")


// creates a new pengaduan
// ex:
// PUT http://localhost:3000/pengaduan
// Content-Type: application/json

// {
//     "provID" : "5deda6ffb267f9c9e60d2936",
//     "kabkotID" : "5dededfcb267f9c9e60e50a8",
//     "compID" : "5f4e1ca9167c90338b8fe174",
//     "judul": "Pengaduan Sparing A",
//     "detail": "Lorem Ipsum",
//     "penulis": "Bagas Antiko R",
//     "kontak": "111122223333"
// }
//
router.put('/', async (req, res) => {
    let a = req.body
    let f = !a.compID
        || !a.kabkotID
        || !a.provID
        || !a.judul
        || !a.detail
        || !a.penulis
    if (f) {
        res.status(400).send('Some dequired data are empty')
        return
    }

    try {
        let r = new pengaduanDB(a)
        r.waktu = Date.now()
        res.send(await r.save())
    } catch(e) {
        res.status(400).send(e)
    }
})

// adds a new tanggapan
// ex:
// PUT http://localhost:3000/pengaduan/tanggapan/62d7b97fce01050be8a5e156
// Content-Type: application/json
//
// {
//     "userEmail": "admin",
//     "tanggapan": "Lorem Ipsum 2"
// }
//
router.put('/tanggapan/:pengaduanID', async (req, res) => {
    let pengaduanID = req.params.pengaduanID
    if (!pengaduanID) {
        res.status(400).send('ID is empty')
        return
    }

    let r = await pengaduanDB.findOne({ _id:pengaduanID })
    if (!r) {
        res.status(400).send('Unable to find record')
        return
    }

    try {
        r.tanggapan.push({
            waktu: Date.now(),
            userEmail: req.body.userEmail,
            tanggapan: req.body.tanggapan,
        })

        await pengaduanDB.findByIdAndUpdate(
            pengaduanID,
            r)
        res.send(r)
    } catch(e) {
        res.status(400).send(e)
    }
})

// gets all pengaduan
// ex:
// GET http://localhost:3000/pengaduan/5f340d5e328182315c11ee98
//
router.get('/list/:userId', async (req, res) => {
    try {
        let usr = await userDB.findOne({
            _id: req.params.userId
        })

        let role = usr.userRole.role
        let filt = role === 'admin' ? [] :
            role === 'prov' ? [{ $match: { provID:usr.userRole.provID } }] :
            role === 'kabkot' ? [{ $match: { kabkotID:usr.userRole.kabkotID } }] :
            role === 'comp' ? [{ $match: { compID:usr.userRole.compID } }] :
            []

        let rs = await pengaduanDB.aggregate([
            ...filt,

            { $addFields: {
                CompID: { $toObjectId: '$compID' },
                ProvID: { $toObjectId: '$provID' },
                KabKotID: { $toObjectId: '$kabkotID' },
            }},
            { $lookup: {
                from: 'companies',
                localField: 'CompID',
                foreignField: '_id',
                as: 'company'
            }},
            { $unwind: "$company" },

            { $lookup: {
                from: 'provdbs',
                localField: 'ProvID',
                foreignField: '_id',
                as: 'provinsi'
            }},
            { $unwind: "$provinsi" },

            { $lookup: {
                from: 'kabkotdbs',
                localField: 'KabKotID',
                foreignField: '_id',
                as: 'kabkot'
            }},
            { $unwind: "$kabkot" },
            { $project: {
                CompID: 0,
                ProvID: 0,
                KabKotID: 0,
                tanggapan: 0,
            }},

            { $match: {} },
            { $sort: { _id: -1 } }
        ])

        res.send(rs)
    } catch(e) {
        res.status(400).send(e)
    }
})

// get pengaduan
// ex:
// GET http://localhost:3000/pengaduan/62d7b97fce01050be8a5e156
//
router.get('/:pengaduanID', async (req, res) => {
    let r = await pengaduanDB.findOne({
        _id: req.params.pengaduanID
    })
    if (!r) {
        res.status(400).send('Record not valid')
    }

    r.company = await companyDB.findOne({ _id:r.compID })
    r.provinsi = await provinsiDB.findOne({ _id:r.provID })
    r.kabkot = await kabkotDB.findOne({ _id:r.kabkotID })
    res.send(r)
})

// delete pengaduan
// ex:
// DELETE http://localhost:3000/pengaduan/62d7b97fce01050be8a5e156
//
router.delete('/:pengaduanID', async (req, res) => {
    if (req.params.pengaduanID === null) {
        res.status(400).send("Id not found!")
    }

    try {
        let r = await pengaduanDB.deleteOne({
            _id: req.params.pengaduanID
        })
        res.send(r)
    } catch (e) {
        res.status(400).send(e)
    }
})
