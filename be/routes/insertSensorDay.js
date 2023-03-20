var express = require("express");
var router = express.Router();
const loggerDB = require("../model/Logger");
const dataHourlySensorDB = require("../model/dataHourlySensor");
const dataDaySensorDB = require("../model/dataDaySensor");
const errDayDB = require("../model/errorDay");
const dataMonthSensorDB = require("../model/dataMonthSensor");
const errMonthDB = require("../model/errorMonth");
const moment = require("moment");
const errorMonth = require("../model/errorMonth");

// router.get("/insert-harian", async (req, res) => {
//     const { start_date, end_date } = req.query;
//     var a = moment(start_date).startOf('day').unix();
//     var b = moment(end_date).endOf('day').unix();

//     // If you want an inclusive end date (fully-closed interval)
//     const logger = await loggerDB.find();
//     const time = b;
//     let datas_day = []

//     for (let i = 0; i < logger.length; i++) {
//         const dataSensor = await dataHourlySensorDB.aggregate([
//             {
//                 $match: {
//                     $and: [
//                         // { loggerID: "5f619c497c5fc71255fa376b" },
//                         { loggerID: String(logger[i]._id) },
//                         {
//                             timestamp: {
//                                 $gte: a,
//                                 $lte: b
//                             },
//                         },
//                     ],
//                 },
//             },
//         ]);
//         if (dataSensor.length > 0) {
//             let totalPh = 0;
//             let totalcod = 0;
//             let totaltss = 0;
//             let totalnh3n = 0;
//             let totaldebit = 0;
//             for (let j = 0; j < dataSensor.length; j++) {
//                 totalPh += dataSensor[j].dataParam[0].value
//                 totalcod += dataSensor[j].dataParam[1].value
//                 totaltss += dataSensor[j].dataParam[2].value
//                 totalnh3n += dataSensor[j].dataParam[3].value
//                 totaldebit += dataSensor[j].dataParam[4].value
//             }
//             let avgPh = totalPh / dataSensor.length;
//             let avgcod = totalcod / dataSensor.length;
//             let avgtss = totaltss / dataSensor.length;
//             let avgnh3n = totalnh3n / dataSensor.length;
//             // let avgdebit = (totaldebit * 30 * 24) / dataSensor.length;
//             let avgdebit = (totaldebit / dataSensor.length) * 24;

//             let newdataParam = [
//                 {
//                     "name": "pH",
//                     "value": avgPh
//                 },
//                 {
//                     "name": "COD",
//                     "value": avgcod
//                 },
//                 {
//                     "name": "TSS",
//                     "value": avgtss
//                 },
//                 {
//                     "name": "NH3N",
//                     "value": avgnh3n
//                 },
//                 {
//                     "name": "Debit",
//                     "value": avgdebit
//                 },
//             ];

//             const saveDay = new dataDaySensorDB({
//                 loggerID: logger[i]._id,
//                 dataParam: newdataParam,
//                 timestamp: time,
//             });
//             datas_day.push(saveDay)
//             const saveDays = await saveDay.save();

//         }
//     }
//     for (let i = 0; i < datas_day.length; i++) {

//         const loggerErr = await loggerDB.findOne({ _id: datas_day[i].loggerID });
//         for (let z = 0; z < loggerErr.logDataRange.length; z++) {
//             if (datas_day[i].dataParam[z].name === loggerErr.logDataRange[z].name) {
//                 if (loggerErr.logDataRange[z].min != null && loggerErr.logDataRange[z].max) {
//                     if (
//                         datas_day[i].dataParam[z].value > loggerErr.logDataRange[z].max ||
//                         datas_day[i].dataParam[z].value < loggerErr.logDataRange[z].min
//                     ) {
//                         const msg = `Parameter ${datas_day[i].dataParam[z].name} tidak sesuai ambang batas!`;
//                         var errDay = new errDayDB({
//                             loggerID: datas_day[i].loggerID,
//                             timestamp: time,
//                             errSUM: msg,
//                         });
//                         await errDay.save();
//                     }
//                 }
//             }
//         }
//     }
//     res.send('data sukses ditambahkan')
// })
router.get("/insert-harian", async (req, res) => {
  const { start_date, end_date } = req.query;
  var a = moment(start_date);
  var b = moment(end_date);
  // If you want an inclusive end date (fully-closed interval)
  for (var m = moment(a); m.diff(b, "days") <= 0; m.add(1, "days")) {
    const logger = await loggerDB.find();
    const time = m.unix();
    let start = time;
    let end = moment(m).endOf("day").unix();
    for (let i = 0; i < logger.length; i++) {
      const dataSensor = await dataHourlySensorDB.aggregate([
        {
          $match: {
            $and: [
              // { loggerID: "5f619c497c5fc71255fa376b" },
              { loggerID: String(logger[i]._id) },
              {
                timestamp: {
                  $gte: start,
                  $lte: end,
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
          totalPh += dataSensor[j].dataParam[0].value;
          totalcod += dataSensor[j].dataParam[1].value;
          totaltss += dataSensor[j].dataParam[2].value;
          totalnh3n += dataSensor[j].dataParam[3].value;
          totaldebit += dataSensor[j].dataParam[4].value;
        }
        let avgPh = totalPh / dataSensor.length;
        let avgcod = totalcod / dataSensor.length;
        let avgtss = totaltss / dataSensor.length;
        let avgnh3n = totalnh3n / dataSensor.length;
        // let avgdebit = (totaldebit * 30 * 24) / dataSensor.length;
        let avgdebit = (totaldebit / dataSensor.length) * 24;

        let newdataParam = [
          {
            name: "pH",
            value: avgPh,
          },
          {
            name: "COD",
            value: avgcod,
          },
          {
            name: "TSS",
            value: avgtss,
          },
          {
            name: "NH3N",
            value: avgnh3n,
          },
          {
            name: "Debit",
            value: avgdebit,
          },
        ];

        const saveDay = new dataDaySensorDB({
          loggerID: logger[i]._id,
          dataParam: newdataParam,
          timestamp: end,
        });
        const saveDays = await saveDay.save();
        const loggerErr = await loggerDB.findOne({ _id: saveDay.loggerID });

        for (let i = 0; i < saveDays.dataParam.length; i++) {
          for (let a = 0; a < loggerErr.logDataRange.length; a++) {
            if (saveDays.dataParam[i].name === loggerErr.logDataRange[a].name) {
              if (
                saveDays.dataParam[i].value > loggerErr.logDataRange[a].max
                // saveDays.dataParam[i].value < loggerErr.logDataRange[a].min
              ) {
                const msg = `Parameter ${saveDays.dataParam[i].name} tidak sesuai ambang batas!`;

                var errDay = new errDayDB({
                  loggerID: saveDays.loggerID,
                  timestamp: end,
                  errSUM: msg,
                });
                await errDay.save();
              }
            }
          }
        }
      }
    }
  }
  res.send("data sukses ditambahkan");
});

router.get("/insert-month", async (req, res) => {
  const { start_date, end_date } = req.query;
  var a = moment(start_date);
  var b = moment(end_date);
  // If you want an inclusive end date (fully-closed interval)
  for (var m = moment(a); m.diff(b, "months") <= 0; m.add(1, "months")) {
    const logger = await loggerDB.find();
    const time = m.unix();
    let start = time;
    let end = moment(m).endOf("month").unix();

    for (let i = 0; i < logger.length; i++) {
      const dataSensor = await dataDaySensorDB.aggregate([
        {
          $match: {
            $and: [
              // { loggerID: "5f619c497c5fc71255fa376b" },
              { loggerID: String(logger[i]._id) },
              {
                timestamp: {
                  $gte: start,
                  $lte: end,
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
          totalPh += dataSensor[j].dataParam[0].value;
          totalcod += dataSensor[j].dataParam[1].value;
          totaltss += dataSensor[j].dataParam[2].value;
          totalnh3n += dataSensor[j].dataParam[3].value;
          totaldebit += dataSensor[j].dataParam[4].value;
        }
        let avgPh = totalPh / dataSensor.length;
        let avgcod = totalcod / dataSensor.length;
        let avgtss = totaltss / dataSensor.length;
        let avgnh3n = totalnh3n / dataSensor.length;
        // let avgdebit = (totaldebit * 30 * 24) / dataSensor.length;
        let avgdebit =
          (totaldebit / dataSensor.length) * moment(m, "YYYY-MM").daysInMonth();

        let newdataParam = [
          {
            name: "pH",
            value: avgPh,
          },
          {
            name: "COD",
            value: avgcod,
          },
          {
            name: "TSS",
            value: avgtss,
          },
          {
            name: "NH3N",
            value: avgnh3n,
          },
          {
            name: "Debit",
            value: avgdebit,
          },
        ];

        const saveMonth = new dataMonthSensorDB({
          loggerID: logger[i]._id,
          dataParam: newdataParam,
          timestamp: end,
        });
        const saveMonths = await saveMonth.save();
        const loggerErr = await loggerDB.findOne({ _id: saveMonth.loggerID });

        for (let i = 0; i < saveMonths.dataParam.length; i++) {
          for (let a = 0; a < loggerErr.logDataRange.length; a++) {
            if (
              saveMonths.dataParam[i].name === loggerErr.logDataRange[a].name
            ) {
              if (
                saveMonths.dataParam[i].value > loggerErr.logDataRange[a].max
                // saveMonths.dataParam[i].value < loggerErr.logDataRange[a].min
              ) {
                const msg = `Parameter ${saveMonths.dataParam[i].name} tidak sesuai ambang batas!`;

                var errMonth = new errMonthDB({
                  loggerID: saveMonths.loggerID,
                  timestamp: end,
                  errSUM: msg,
                });
                await errMonth.save();
              }
            }
          }
        }
      }
    }
  }
  res.send("data bulanan berhasil di insert");
});

module.exports = router;
