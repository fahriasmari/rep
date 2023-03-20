let express = require("express")
let router = express.Router()
module.exports = router

let moment = require("moment");
let userDB = require("../model/User")
let beritaAcaraDB = require("../model/beritaAcara")


let beritaAcaraQL = [
    { $addFields: {
        compID: { $toObjectId: "$compID" },
        kabkotID: { $toObjectId: "$kabkotID" },
        provID: { $toObjectId: "$provID" }
    }},

    { $lookup: {
        from: "companies",
        localField: "compID",
        foreignField: "_id",
        as: "companyDetails",
    }},
    {$unwind: {
        path: "$companyDetails",
        preserveNullAndEmptyArrays: true
    }},

    { $lookup: {
        from: "kabkotdbs",
        localField: "kabkotID",
        foreignField: "_id",
        as: "kabkotDetails",
    }},
    { $unwind: "$kabkotDetails" },

    { $lookup: {
        from: "provdbs",
        localField: "provID",
        foreignField: "_id",
        as: "provDetils",
    }},
    { $unwind: "$provDetils" },

    { $project: {
        kabkotName: "$kabkotDetails.kabkotName",
        provName: "$provDetils.provName",
        compName: "$companyDetails.compName",
        compID: "$companyDetails._id",
        kabkotID: "$kabkotDetails._id",
        provID: "$provDetils._id",
        detailOtherComp: "$detailOtherComp",
        tanggalBeritaAcara: "$tanggalBeritaAcara",
        tanggalKunjungan: "$tanggalKunjungan",
        lampiranBeritaAcara: "$lampiranBeritaAcara"
    }}
]

const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

// retrieves berita-acara based on role (from userId)
//
router.get("/:userId", async function (req, res) {
    try {
        let user = await userDB.findOne({
            _id: req.params.userId
        })

        if (!user) {
            res.status(400).send("Unable to find user")
            return
        }

        let rs
        switch (user.userRole.role) {
        case "admin":
            rs = await beritaAcaraDB.aggregate([
                ...beritaAcaraQL
            ])
            break
        case "prov":
            rs = await beritaAcaraDB.aggregate([
                { $match: {
                    provID: user.userRole.provID
                }},
                ...beritaAcaraQL
            ])
            break
        case "kabkot":
            rs = await beritaAcaraDB.aggregate([
                { $match: {
                kabkotID: user.userRole.kabkotID
                }},
                ...beritaAcaraQL
            ])
            break
        case "comp":
            rs = await beritaAcaraDB.aggregate([
                { $match: {
                compID: user.userRole.compID
                }},
                ...beritaAcaraQL
            ])
            break
        default:
            break
        }

        let data = rs.map(a => ({
            'id': a._id,
            'provName': a.provName,
            'kabkotName': a.kabkotName,
            'compName': a.detailOtherComp.compName || a.compName,
            'compID': a.compID,
            'provID': a.provID,
            'kabkotID': a.kabkotID,
            'lampiranBeritaAcara': a.lampiranBeritaAcara.path,
            'tanggalBeritaAcara': a.tanggalBeritaAcara, // moment.unix(a.tanggalBeritaAcara).format('DD/MM/YY HH:mm:ss'),
            'tanggalKunjungan': a.tanggalKunjungan, // moment.unix(a.tanggalKunjungan).format('DD/MM/YY HH:mm:ss')
        }))

        res.send(data)
    } catch(err) {
        res.status(400).send(err)
    }
})


// creates a new berita-acara
//
router.post("/", async function (req, res, next) {
    let compID = req.body.compID
    if ( req.body.kabkotID === null
        || req.body.provID === null
        || req.body.lampiranBeritaAcara === null
    ) {
        res.status(400).send("Data cannot be null!")
    }

    try {
        req.body.compID = (!compID || String(compID).length!==24)
            ? '000000000000000000000000'
            : req.body.compID

        let formNew = new beritaAcaraDB(req.body);
        formNew.validated = false;
        let formSave = await formNew.save();
        res.send(formSave);
    } catch (error) {
        res.status(400).send(error);
    }
})


// updates a berita-acara
//
router.put("/:beritaAcaraId", async function (req, res, next) {
    let compID = req.body.compID
    if ( req.body.kabkotID === null
        || req.body.provID === null
        || req.body.lampiranBeritaAcara === null
    ) {
        res.status(400).send("Data cannot be null!")
    }

    try {
        req.body.compID = (!compID || String(compID).length!==24)
            ? '000000000000000000000000'
            : req.body.compID

        let formSave = await beritaAcaraDB.updateOne({
            _id: req.params.beritaAcaraId
        }, req.body);
        res.send(formSave);
    } catch (error) {
        res.status(400).send(error);
    }
})


// deletes a berita-acara
//
router.delete("/:beritaAcaraId", async function (req, res, next) {
    if (req.params.beritaAcaraId === null) {
        res.status(400).send("Id not found!")
    }

    try {
        let deleteBeritaAcara = await beritaAcaraDB.deleteOne({
            _id: req.params.beritaAcaraId
        })
        res.send(deleteBeritaAcara)
    } catch (error) {
        res.status(400).send(error)
    }
})

