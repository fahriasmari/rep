let express = require("express");
let router = express.Router();
module.exports = router;

let validitasDB = require("../model/Validitas");
let condReportsDB = require("../model/condReport");
let dataCondReportDB = require("../model/dataCondReport");
const datamanual2minDB = require("../model/dataManual2min");
let companiesDB = require("../model/Company");
const condReport = require("../model/condReport");
const dataSensorDB = require("../model/dataSensor");
const formMingguan = require("../model/formMingguan");
const dataHourly = require("../model/dataHourlySensor");
const dataDaily = require("../model/dataDaySensor");
const errorRecap = require("../model/errorRecap");
const errorDay = require("../model/errorDay");
const mongoose = require("mongoose");
const loggerDB = require("../model/Logger");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");

// creates a new validatas record
// body is to have userEmail, condReportsID, status, catatan
// ex:
// PUT http://localhost:3000/validasi/6018a83d111e6c2310d8247e
// Content-Type: application/json
//
// {
//     "userEmail": "admin@menlhk.com",
//     "status": "Rejected",
//     "catatan": "Lorem Ipsum"
// }
//
router.put("/:condReportsID", async (req, res) => {
  let condReportsID = req.params.condReportsID;
  if (!condReportsID) {
    res.status(400).send("Id is empty!");
    return;
  }
  const condreport = await condReport.findOne({
    _id: condReportsID,
  });
  if (!condreport) {
    return res.send({
      success: false,
      message: "Laporan kondisi tidak normal tidak ditemukan",
    });
  }
  // const dataCondReport = await datamanual2minDB.aggregate([
  //   {
  //     $match: {
  //       condReportID: condreport._id.toString(),
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       dataParam: 1,
  //       loggerID: 1,
  //       timestamp: 1,
  //     },
  //   },
  // ]);
  // if (!dataCondReport || dataCondReport.length < 1) {
  //   return res.send({
  //     success: false,
  //     message: "Data kondisi tidak normal tidak ditemukan",
  //   });
  // }
  let validitas = new validitasDB({
    condReportsID,
    waktu: moment().unix(),
    ...req.body,
  });
  await validitas.save();
  if (req.body.status != "accepted") {
    return res.send(validitas);
  }
  if (condreport.kondisi === "Kondisi Terkendala Internet") {
    const dataManual = await datamanual2minDB.aggregate([
      {
        $match: {
          condReportID: condreport._id.toString(),
        },
      },
    ]);
    const loggerID = dataManual[0].loggerID;
    // const first = moment(condreport.tanggalKejadian * 1000).unix();
    // const last = moment(
    //   moment(condreport.endTanggalKejadian * 1000).add(1, "days")
    // ).unix();
    let newDataManual = [];
    let a = 0;
    dataManual.forEach((value, index) => {
      value.start = moment(value.timestamp * 1000)
        .startOf("hours")
        .unix();
      value.end = moment(value.timestamp * 1000)
        .endOf("hours")
        .unix();
      value.startOfDays = moment(value.timestamp * 1000)
        .startOf("days")
        .unix();

      let val = {
        dataParam: value.dataParam,
        loggerID: value.loggerID,
        timestamp: value.timestamp,
        serverTimestamp: moment().unix(),
        isCount: true,
      };

      if (a < 30) {
        if (index != 0) {
          if (dataManual[index].start != dataManual[index - 1].start) {
            a = 0;
          } else {
            newDataManual.push(val);
            a++;
          }
        } else {
          newDataManual.push(val);
          a++;
        }
      } else {
        if (dataManual[index].start != dataManual[index - 1].start) {
          a = 0;
        } else {
          a++;
        }
      }
    });
    function getUniqueListBy(arr, key) {
      return [...new Map(arr.map((item) => [item[key], item])).values()];
    }
    const data = getUniqueListBy(dataManual, "start");
    const start = data[0].start;
    const end = data[data.length - 1].end;
    const dataSensor = await dataSensorDB.aggregate([
      {
        $match: {
          $and: [
            { timestamp: { $gte: start } },
            { timestamp: { $lte: end } },
            { loggerID: loggerID },
          ],
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    const unique = [...new Set(dataSensor.map((item) => item._id))];
    if (dataSensor.length > 0) {
      await dataSensorDB.deleteMany({ _id: { $in: unique } });
    }
    await dataSensorDB.insertMany(newDataManual);

    const cron = getUniqueListBy(dataManual, "startOfDays");
    for (let i = 0; i < cron.length; i++) {
      let val = cron[i];
      await hourlyWithLogger(val.startOfDays * 1000, val.loggerID);
      await daily(
        moment(val.startOfDays * 1000).format("YYYY-MM-DD"),
        val.loggerID
      );
      let today = moment().unix();
      if (
        today >
        moment(val.startOfDays * 1000)
          .endOf("months")
          .unix()
      ) {
        await monthly(
          moment(val.startOfDays * 1000)
            .startOf("months")
            .format("YYYY-MM-DD"),
          val.loggerID
        );
      }
    }
  }
  return res.send(validitas);
});

// retrieves history on a condition-reports-id
// ex:
// GET http://localhost:3000/validasi/6018a83d111e6c2310d8247e
//
router.get("/:condReportsID", async (req, res) => {
  let condReportsID = req.params.condReportsID;
  if (!condReportsID) {
    res.status(400).send("Id is empty!");
    return;
  }

  try {
    let condReport = await condReportsDB.findOne({ _id: condReportsID });
    if (!condReportsID) {
      res.status(404).send("Id not found!");
      return;
    }

    let company = await companiesDB.findOne({ _id: condReport.compID });
    if (!company) {
      res.status(400).send("No company found!");
      return;
    }

    let validitas = await validitasDB.find({ condReportsID });
    res.send({
      condReport,
      company,
      validitas,
    });
  } catch (error) {
    res.status(404).send(error);
  }
});
