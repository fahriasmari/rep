var express = require("express");
var router = express.Router();
var { percentageConvert } = require('../function/helper');
const dataSensorDB = require("../model/dataSensor");
const compDB = require("../model/Company");
const loggerDB = require("../model/Logger");
const provDB = require("../model/Province");
const kabkotDB = require("../model/Kabkot");
const dataHourlySensorDB = require("../model/dataHourlySensor");
const moment = require("moment");

router.get("/get-raw", async (req, res) => {
    let query = {};
    if (req.query.key !== "klasjhfiuUYBjBDLN341kj1jkkaj1aqq")
        return res.status(400).send("Key Error!");
    const loggerID = await loggerDB.distinct("_id");
    for (let i = 0; i < loggerID.length; i++) {
        loggerID[i] = String(loggerID[i]);
    }

    // let time = moment().unix();
    let start_time = moment().startOf('minute').unix()
    let end_time = moment().endOf('minute').unix()

    query["$and"] = [
        { timestamp: { $gte: Number(start_time) } },
        { timestamp: { $lte: Number(end_time) } },
    ];

    dataSensor = await dataSensorDB.aggregate([
        { $match: { loggerID: { $in: loggerID } } },
        { $addFields: { id: { $toObjectId: "$loggerID" } } },
        {
            $lookup: {
                from: "loggers",
                localField: "id",
                foreignField: "_id",
                as: "loggerDetails",
            },
        },
        {
            $unwind: "$loggerDetails",
        },
        { $addFields: { id_comp: { $toObjectId: "$loggerDetails.compID" } } },
        {
            $lookup: {
                from: "companies",
                localField: "id_comp",
                foreignField: "_id",
                as: "compDetails",
            },
        },
        {
            $unwind: "$compDetails",
        },
        {
            $addFields: { id_kabkot: { $toObjectId: "$loggerDetails.kabkotID" } },
        },
        {
            $lookup: {
                from: "kabkotdbs",
                localField: "id_kabkot",
                foreignField: "_id",
                as: "kabkotDetails",
            },
        },
        {
            $unwind: "$kabkotDetails",
        },
        { $addFields: { id_prov: { $toObjectId: "$loggerDetails.provID" } } },
        {
            $lookup: {
                from: "provdbs",
                localField: "id_prov",
                foreignField: "_id",
                as: "provDetails",
            },
        },
        {
            $unwind: "$provDetails",
        },
        {
            $project: {
                id: 0,
                loggerDetails: 0,
                id_comp: 0,
                id_kabkot: 0,
                id_prov: 0,
            },
        },
        { $match: query },
        // {
        //     $limit: 1000,
        // },
        {
            $sort: { timestamp: -1 },
        },
    ]);

    res.send(dataSensor);
})


router.get("/kalku", async (req, res) => {
    // let start_time = moment(req.query.start_time, 'YYYY-MM-DD h:m').unix() - 3600;
    let start_time = moment(req.query.start_time, 'YYYY-MM-DD h:m').startOf('hour').unix()
    let end_time = moment(req.query.start_time, 'YYYY-MM-DD h:m').endOf('hour').unix()
    const dataSensor = await dataSensorDB.aggregate([
        {
            $match: {
                $and: [
                    { loggerID: "60af13315173d010f43103f9" },
                    // { loggerID: String(logger[i]._id) },
                    {
                        timestamp: {
                            $gte: start_time,
                            $lte: end_time
                        },
                    },
                ],
            },
        },
    ]);
    if (dataSensor.length > 0) {
        let totalPh = 0;
        let totalcod = 0;
        let totaltss = 0;
        let totalnh3n = 0;
        let totaldebit = 0;
        for (let j = 0; j < dataSensor.length; j++) {
            totalPh += dataSensor[j].dataParam[0].value
            totalcod += dataSensor[j].dataParam[1].value
            totaltss += dataSensor[j].dataParam[2].value
            totalnh3n += dataSensor[j].dataParam[3].value
            totaldebit += dataSensor[j].dataParam[4].value
            // console.log(dataSensor[j].dataParam)
        }
        let avgPh = totalPh / dataSensor.length;
        let avgcod = totalcod / dataSensor.length;
        let avgtss = totaltss / dataSensor.length;
        let avgnh3n = totalnh3n / dataSensor.length;
        // let avgdebit = (totaldebit * 30) / dataSensor.length;
        let avgdebit = (totaldebit / dataSensor.length) * 60;

        let newdataParam = [
            {
                "name": "pH",
                "value": avgPh
            },
            {
                "name": "COD",
                "value": avgcod
            },
            {
                "name": "TSS",
                "value": avgtss
            },
            {
                "name": "NH3N",
                "value": avgnh3n
            },
            {
                "name": "Debit",
                "value": avgdebit
            },
        ];

        const saveHourly = new dataHourlySensorDB({
            loggerID: "60af13315173d010f43103f9",
            dataParam: newdataParam,
            timestamp: moment().unix(),
        });

        res.send(saveHourly);
    }
})
module.exports = router;