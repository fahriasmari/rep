let express = require("express")
let router = express.Router()
module.exports = router

let userDB = require("../model/User")
let condRepDB = require("../model/condReport")
let validitasDB = require("../model/Validitas")
let condReportsDB = require('../model/condReport')
let companiesDB = require('../model/Company')
let xl = require('excel4node')

const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

// commond fields query
//
let fieldsQL = [
    { $addFields: {
        convertedCompID: { $toObjectId: "$compID"}
    }},
    { $lookup: {
        from: "companies",
        localField: "convertedCompID",
        foreignField: "_id",
        as: "compDetails",
    }},
    { $unwind: "$compDetails" },

    { $addFields: {
        convertedProvID: { $toObjectId: "$provID" }
    }},
    { $lookup: {
        from: "provdbs",
        localField: "convertedProvID",
        foreignField: "_id",
        as: "provDetails",
    }},
    { $unwind: "$provDetails" },

    { $addFields: {
        convertedKabkotID: { $toObjectId: "$kabkotID" }
    }},
    { $lookup: {
        from: "kabkotdbs",
        localField: "convertedKabkotID",
        foreignField: "_id",
        as: "kabkotDetails",
    }},
    { $unwind: "$kabkotDetails" }
]


// get Query from request
//
let getQuery = (req) => {
    let query = {}
    if (req.query.type) {
        query["compDetails.compType"] = req.query.type;
    }
    if (req.query.prov) {
        query["provDetails.provName"] = req.query.prov;
    }
    if (req.query.kabkot) {
        query["kabkotDetails.kabkotName"] = req.query.kabkot;
    }
    if (req.query.comp) {
        query["compDetails.compName"] = req.query.comp;
    }
    if (req.query.start) {
        query["$and"] = [
            { tanggalKejadian: { $gte: Number(req.query.start) } },
            { tanggalKejadian: { $lte: Number(req.query.end) } },
        ]
    }
    return query
}


// list cond-reports based on userID
//
router.get("/list/:userID", async (req, res) => {
    const user = await userDB.findOne({
      _id: req.params.userID
    })
    if (!user) return res.status(400).send("User not found!")

    let query = getQuery(req)

    try {

        let cond
        switch (user.userRole.role) {
        case "admin":
            cond = await condRepDB.aggregate([
                ...fieldsQL,
                { $match: query},
                { $sort: { _id: -1}}
            ])
            break;
        case "kabkot":
            cond = await condRepDB.aggregate([
                { $match: {
                    kabkotID: user.userRole.kabkotID
                }},
                ...fieldsQL,
                { $match: query},
                { $sort: { _id: -1}}
            ]);
            break;
        case "prov":
            cond = await condRepDB.aggregate([
                { $match: {
                    provID: user.userRole.provID
                }},
                ...fieldsQL,
                { $match: query},
                { $sort: { _id: -1}}
            ])
            break;
        case "comp":
            cond = await condRepDB.aggregate([
                { $match: {
                    compID: user.userRole.compID
                }},
                ...fieldsQL,
                { $match: query},
                { $sort: { _id: -1}}
            ])
            break
        default:
            break
        }
        for (let r of cond) {
            r.validitas = await getLastValiditas(r._id+'')
        }

        res.send(cond)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})


// exports data
// (should userID be added too?)
//
router.get("/export", async (req, res) => {
    let query = getQuery(req)

    try {
        let cond = await condRepDB.aggregate([
            ...fieldsQL,
            { $match: query},
            { $sort: { _id: -1}}
        ])

        var wb = new xl.Workbook();
        var ws = wb.addWorksheet('Kondisi Tidak Normal');

        var col = 1;
        //Akun
        ws.cell(col, 1).string('Nama Industri');
        ws.cell(col, 2).string('Jenis Industri');
        ws.cell(col, 3).string('Kab/Kot');
        ws.cell(col, 4).string('Provinsi');
        ws.cell(col, 5).string('Waktu');
        ws.cell(col, 6).string('Status');
        ws.cell(col, 7).string('Detail');

        let dt;
        for (let i = 0; i < cond.length; i++) {
            col++
            let dt = new Date(cond[i].tanggalKejadian * 1000);
            let val = await getLastValiditas(cond[i]._id + '')
            ws.cell(col, 1).string(cond[i].compDetails.compName);
            ws.cell(col, 2).string(cond[i].compDetails.compType);
            ws.cell(col, 3).string(cond[i].kabkotDetails.kabkotName);
            ws.cell(col, 4).string(cond[i].provDetails.provName);
            ws.cell(col, 5).string(dt.toString());
            ws.cell(col, 6).string(val ? val.status : '');
            ws.cell(col, 7).string(cond[i].kondisiTidakNormal.status);
        }

        wb.write(`List Laporan Kondisi Tidak Normal.xlsx`, res)

    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})


// for now mongo 4 seems yet left-outer-join
//
let getLastValiditas = async (id, isAll=false) => {

    let rs = await validitasDB.aggregate([
        {$match: { condReportsID: id } },
        {$sort: { waktu:-1 }}
    ])

    if (isAll) return rs
    return rs ? rs[0] : {}
}


// creates a new validatas record
//
router.put("/validasi/:condReportsID", async (req, res) => {
    let condReportsID = req.params.condReportsID
    if (!condReportsID) {
        res.status(400).send("Id is empty!")
        return
    }

    try {
        let r = new validitasDB({
            condReportsID,
            waktu: Date.now(),
            ...(req.body),
        })
        await r.save()
        res.send(r)
    } catch(error) {
        res.status(400).send(error)
    }
})


// retrieves history on a condition-reports-id
//
router.get("/validasi/:condReportsID", async (req, res) => {

    let condReportsID = req.params.condReportsID
    if (!condReportsID) {
        res.status(400).send("Id is empty!")
        return
    }

    try {
        let condReport = await condReportsDB.findOne({ _id:condReportsID })
        if (!condReportsID) {
            res.status(404).send("Id not found!")
            return
        }

        let company = await companiesDB.findOne({ _id:condReport.compID })
        if (!company) {
            res.status(400).send("No company found!")
            return
        }

        let validitas = await validitasDB.find({ condReportsID })
        res.send ({
            condReport,
            company,
            validitas,
        })
    } catch(error) {
        res.status(404).send(error)
    }
})

// get a cond-report
//
router.get("/:condReportsID", async (req, res) => {
    try {
        const cond = await condRepDB.aggregate([
            { $match: {
                _id: ObjectId(req.params.condReportsID)
            }},
            ...fieldsQL
        ])

        let r = cond[0]
        if (r) {
            r.validitas = await getLastValiditas(r._id + '', true)
        }

        res.send(cond)
    } catch (error) {
        res.status(400).send(error)
    }
})


// updates a cond-report
//
router.put("/:condReportsID", async (req, res) => {
    try {
        const cond = await condRepDB.updateOne({
            _id: req.params.condReportsID
        }, req.body)

        res.send(cond)
    } catch (error) {
        res.status(400).send(error)
    }
})


// deletes a cond-report
//
router.delete("/:condReportsID", async (req, res) => {
    try {
      const cond = await condRepDB.deleteOne({
            _id: req.params.condReportsID
      })
      res.send(cond)
    } catch (error) {
      res.status(400).send(error)
    }
})

// crateas a new cond-report
//
router.post("/", async (req, res) => {
    try {
        let cond = new condRepDB(req.body)
        let r = await cond.save()
        res.send(r)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})
