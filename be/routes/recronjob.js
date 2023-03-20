var express = require("express");
var router = express.Router();
const loggerDB = require("../model/Logger");
const dataSensorDB = require("../model/dataSensor");
const userDB = require("../model/User");
const errDayDB = require("../model/errorDay");
const dataHourlySensorDB = require("../model/dataHourlySensor");
const errCapDB = require("../model/errorRecap");
const dataDaySensorDB = require("../model/dataDaySensor");
const errKalibrasi = require("../model/errorKalibrasi");
const moment = require("moment");
let dataSensor = require("../model/dataSensor");
const { daily, hourly, monthly } = require("../services/recron_sensor");

router.post("/", async function (req, res, next) {
  const { date, loggerID } = req.body;
  var a = moment(date).startOf("day");
  var b = moment(date).endOf("day");
  let result_data = [];
  for (var m = moment(a); m.diff(b, "hours") <= 0; m.add(1, "hours")) {
    // const time = m.format('DD-MM-YYYY HH:mm:ss');

    const time_now = m.unix();
    let time_ago = time_now - 3600;
    let start_ago = moment.unix(time_ago).startOf("hours").unix();
    let end_ago = moment.unix(time_ago).endOf("hours").unix();
    // const logger = await loggerDB.find();
    const logger = await loggerDB.find({ _id: loggerID });

    let datetime_before = 0; //dummy
    if (logger) {
      for (let i = 0; i < logger.length; i++) {
        dataSensor = await dataSensorDB.aggregate([
          {
            $match: {
              $and: [
                // { loggerID: "5f6322617c5fc71255fca135" },
                { loggerID: String(logger[i]._id) },
                {
                  timestamp: {
                    $gte: start_ago,
                    $lte: end_ago,
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
          let sensor_length = 0;
          for (let j = 0; j < dataSensor.length; j++) {
            if (dataSensor[j].timestamp != datetime_before) {
              datetime_before = dataSensor[j].timestamp;
              totalPh += dataSensor[j].dataParam[0].value;
              totalcod += dataSensor[j].dataParam[1].value;
              totaltss += dataSensor[j].dataParam[2].value;
              totalnh3n += dataSensor[j].dataParam[3].value;
              totaldebit += dataSensor[j].dataParam[4].value;
              sensor_length++;
            } else {
              totalPh += 0;
              totalcod += 0;
              totaltss += 0;
              totalnh3n += 0;
              totaldebit += 0;
            }
            // console.log(dataSensor[j].dataParam)
          }
          let avgPh = totalPh / sensor_length;
          let avgcod = totalcod / sensor_length;
          let avgtss = totaltss / sensor_length;
          let avgnh3n = totalnh3n / sensor_length;
          // let avgdebit = (totaldebit * 30) / dataSensor.length;
          // let avgdebit = (totaldebit / dataSensor.length) * 60;
          let avgdebit = totaldebit * 2;

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

          const saveHourly = new dataHourlySensorDB({
            loggerID: logger[i]._id,
            dataParam: newdataParam,
            timestamp: time_now,
          });

          // DELETE HOURLY DATA OLD
          try {
            const deleteHour = await dataHourlySensorDB.deleteMany({
              loggerID: saveHourly.loggerID,
              timestamp: {
                $gte: moment.unix(time_now).startOf("hours").unix(),
                $lte: moment.unix(time_now).endOf("hours").unix(),
              },
            });
            const deleteHourErr = await errCapDB.deleteMany({
              loggerID: saveHourly.loggerID,
              timestamp: {
                $gte: moment.unix(time_now).startOf("hours").unix(),
                $lte: moment.unix(time_now).endOf("hours").unix(),
              },
            });
          } catch (e) {
            console.log(e);
          }

          // END DELETE HOURLY DATA OLD
          const saveHour = await saveHourly.save();
          const loggerErr = await loggerDB.findOne({
            _id: saveHourly.loggerID,
          });

          for (let i = 0; i < saveHour.dataParam.length; i++) {
            for (let a = 0; a < loggerErr.logDataRange.length; a++) {
              if (
                saveHour.dataParam[i].name === loggerErr.logDataRange[a].name
              ) {
                if (
                  saveHour.dataParam[i].value > loggerErr.logDataRange[a].max
                  // saveHour.dataParam[i].value < loggerErr.logDataRange[a].min
                ) {
                  const msg = `Parameter ${saveHour.dataParam[i].name} tidak sesuai ambang batas!`;

                  var errCap = new errCapDB({
                    loggerID: saveHour.loggerID,
                    timestamp: time_now,
                    errSUM: msg,
                  });
                  await errCap.save();
                }
              }
            }
          }
          result_data.push(saveHour);
        }
      }
    }
  }
  return res.send(result_data);
});

router.post("/all", async function (req, res, next) {
  const { type, date } = req.body;
  let result_data = [];

  // RECRONJOB HOURLY SENSOR
  let hourly_recron = await hourly(date, type);
  // let hourly_recron = "";
  // END RECRONJOB HOURLY SENSOR

  // RECRONJOB DAILY SENSOR
  let daily_recron = await daily(date);

  // END RECRONJOB DAILY SENSOR
  res.status(200).send({ hourly: hourly_recron, daily: daily_recron });
});

router.post("/daily", async function (req, res, next) {
  const { type, date, loggerid } = req.body;

  let result_data = [];

  let daily_recron = await daily(date, loggerid);

  res.status(200).send({ daily: daily_recron });
});

router.post("/monthly", async function (req, res, next) {
  const { type, periode, tahun, loggerid } = req.body;
  let result_data = [];
  let mergetime = periode + "-" + tahun;
  let times = moment(mergetime, "MM-YYYY")
    .startOf("month")
    .format("YYYY-MM-DD");
  // RECRONJOB DAILY SENSOR
  let monthly_recron = await monthly(times, loggerid);
  res.status(200).send({ monthly: monthly_recron });
  // END RECRONJOB DAILY SENSOR
});

router.post("/test/hourly", async (req, res) => {
  const { date, isDelete } = req.body;
  let time = moment(date).unix();
  if (isDelete) {
    console.log(`delete cron ${date}`);
    let deletes = await dataHourlySensorDB.deleteMany({ timestamp: time });
    return res.send({ message: "delete sucess" });
  }
  console.log("recronjob all company 1 hours");
  time = moment(date).unix() - 3600;
  let start_ago = moment.unix(time).startOf("hours").unix();
  let end_ago = moment.unix(time).endOf("hours").unix();
  const logger = await loggerDB.aggregate([
    { $addFields: { compObjId: { $toObjectId: "$compID" } } },
    {
      $lookup: {
        from: "companies",
        localField: "compObjId",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $lookup: {
        from: "formregiscomps",
        localField: "company.compName",
        foreignField: "umum.compName",
        as: "formregis",
      },
    },
  ]);
  let datetime_before = 0;
  let result_data = [];

  for (let i = 0; i < logger.length; i++) {
    const dataSensor = await dataSensorDB.aggregate([
      {
        $match: {
          $and: [
            // { loggerID: "5f6322617c5fc71255fca135" },
            {
              loggerID: String(logger[i]._id),
            },
            {
              timestamp: {
                $gte: start_ago,
                $lte: end_ago,
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
      let sensor_length = 0;
      for (let j = 0; j < dataSensor.length; j++) {
        // let currentTimestamp = moment(dataSensor[j].timestamp * 1000)
        //   .startOf("minutes")
        //   .unix();
        // let lastTimestamp;
        // if (j > 0) {
        //   lastTimestamp = moment(dataSensor[j - 1].timestamp * 1000)
        //     .startOf("minutes")
        //     .unix();
        // }
        // if (j > 30) {
        //   await dataSensorDB.findOneAndUpdate(
        //     { _id: dataSensor[j - 1]._id },
        //     {
        //       isCount: false,
        //     }
        //   );
        //   continue;
        // }
        // if (j > 0) {
        //   if (currentTimestamp == lastTimestamp) {
        //     await dataSensorDB.findOneAndUpdate(
        //       { _id: dataSensor[j - 1]._id },
        //       {
        //         isCount: false,
        //       }
        //     );
        //     fixedDataSensor.splice(j - 1, 1);
        //   }
        // }
        if (dataSensor[j].timestamp != datetime_before) {
          datetime_before = dataSensor[j].timestamp;
          totalPh += dataSensor[j].dataParam[0].value;
          totalcod += dataSensor[j].dataParam[1].value;
          totaltss += dataSensor[j].dataParam[2].value;
          totalnh3n += dataSensor[j].dataParam[3].value;
          totaldebit += dataSensor[j].dataParam[4].value;
          sensor_length++;
        } else {
          totalPh += 0;
          totalcod += 0;
          totaltss += 0;
          totalnh3n += 0;
          totaldebit += 0;
        }
      }
      let avgPh = totalPh / sensor_length;
      let avgcod = totalcod / sensor_length;
      let avgtss = totaltss / sensor_length;
      let avgnh3n = totalnh3n / sensor_length;
      // let avgdebit = (totaldebit * 30) / dataSensor.length;
      // let avgdebit = (totaldebit / dataSensor.length) * 60;
      let avgdebit = totaldebit * 2;

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

      const saveHourly = new dataHourlySensorDB({
        loggerID: logger[i]._id,
        dataParam: newdataParam,
        timestamp: moment(date).unix(),
      });

      const saveHour = await saveHourly.save();
      const loggerErr = await loggerDB.findOne({
        _id: saveHourly.loggerID,
      });

      for (let ii = 0; ii < saveHour.dataParam.length; ii++) {
        for (let a = 0; a < loggerErr.logDataRange.length; a++) {
          if (saveHour.dataParam[ii].name === loggerErr.logDataRange[a].name) {
            if (
              saveHour.dataParam[ii].value > loggerErr.logDataRange[a].max
              // saveHour.dataParam[ii].value < loggerErr.logDataRange[a].min
            ) {
              const msg = `Parameter ${saveHour.dataParam[ii].name} tidak sesuai ambang batas!`;

              var errCap = new errCapDB({
                loggerID: saveHour.loggerID,
                timestamp: time + 3600,
                errSUM: msg,
              });

              if (logger[i].formregis) {
                if (
                  typeof logger[i].formregis[0].teknis.satuanDebit !=
                  "undefined"
                ) {
                  if (
                    logger[i].formregis[0].teknis.satuanDebit == "m3/detik" ||
                    logger[i].formregis[0].teknis.satuanDebit == "m3/menit" ||
                    logger[i].formregis[0].teknis.satuanDebit == "m3/jam"
                  ) {
                    await errCap.save();
                  }
                } else {
                  await errCap.save();
                }
              }
            }
          }
        }
      }
    }
  }
  return res.send(result_data);
});

router.post("/test/daily", async (req, res) => {
  const { date, isDelete } = req.body;
  let time = moment(date).unix();
  if (isDelete) {
    console.log(`delete cron ${date}`);
    let deletes = await dataDaySensorDB.deleteMany({ timestamp: time });
    return res.send({ message: "delete sucess" });
  }
  var a = moment(date).startOf("day").unix();
  var b = moment(date).endOf("day").unix();

  // If you want an inclusive end date (fully-closed interval)
  // const logger = await loggerDB.find();
  const logger = await loggerDB.aggregate([
    { $addFields: { compObjId: { $toObjectId: "$compID" } } },
    {
      $lookup: {
        from: "companies",
        localField: "compObjId",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $lookup: {
        from: "formregiscomps",
        localField: "company.compName",
        foreignField: "umum.compName",
        as: "formregis",
      },
    },
  ]);
  // const time = m.unix();
  for (let i = 0; i < logger.length; i++) {
    const dataSensor = await dataHourlySensorDB.aggregate([
      {
        $match: {
          $and: [
            // { loggerID: "5f619c497c5fc71255fa376b" },
            {
              loggerID: String(logger[i]._id),
            },
            {
              timestamp: {
                $gte: a,
                $lte: b,
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
      // let avgdebit = (totaldebit / dataSensor.length) * 24;
      let avgdebit = totaldebit;

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
        timestamp: b,
      });
      const saveDays = await saveDay.save();
      const loggerErr = await loggerDB.findOne({
        _id: saveDay.loggerID,
      });

      for (let ii = 0; ii < saveDays.dataParam.length; ii++) {
        for (let a = 0; a < loggerErr.logDataRange.length; a++) {
          if (saveDays.dataParam[ii].name === loggerErr.logDataRange[a].name) {
            if (
              saveDays.dataParam[ii].value > loggerErr.logDataRange[a].max
              // saveDays.dataParam[ii].value < loggerErr.logDataRange[a].min
            ) {
              const msg = `Parameter ${saveDays.dataParam[ii].name} tidak sesuai ambang batas!`;

              var errDay = new errDayDB({
                loggerID: saveDays.loggerID,
                timestamp: b,
                errSUM: msg,
              });

              if (logger[i].formregis) {
                if (
                  typeof logger[i].formregis[0].teknis.satuanDebit !=
                  "undefined"
                ) {
                  if (logger[i].formregis[0].teknis.satuanDebit == "m3/hari") {
                    await errDay.save();
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  console.log("recronjob all company 1 daily");
  return res.send("recron daily success");
  // let recron1jam = await recron1hours();
  // console.log(recron1jam);
  // let recronjob1day = await recrondaily();
  // console.log(recronjob1day);
});

router.get("/test/kalibrasi", async (req, res) => {
  const time = moment().unix();
  const data = await loggerDB.aggregate([
    {
      $addFields: {
        ph: {
          $function: {
            body: function (logData) {
              let data = logData[0].nextKalibrasi;
              return data;
            },
            args: ["$logDataRange"],
            lang: "js",
          },
        },
      },
    },
    {
      $addFields: {
        cod: {
          $function: {
            body: function (logData) {
              let data = logData[1].nextKalibrasi;
              return data;
            },
            args: ["$logDataRange"],
            lang: "js",
          },
        },
      },
    },
    {
      $addFields: {
        tss: {
          $function: {
            body: function (logData) {
              let data = logData[2].nextKalibrasi;
              return data;
            },
            args: ["$logDataRange"],
            lang: "js",
          },
        },
      },
    },
    {
      $addFields: {
        nh3n: {
          $function: {
            body: function (logData) {
              let data = logData[3].nextKalibrasi;
              return data;
            },
            args: ["$logDataRange"],
            lang: "js",
          },
        },
      },
    },
    {
      $addFields: {
        debit: {
          $function: {
            body: function (logData) {
              let data = logData[4].nextKalibrasi;
              return data;
            },
            args: ["$logDataRange"],
            lang: "js",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        compID: 1,
        ph: 1,
        cod: 1,
        tss: 1,
        nh3n: 1,
        debit: 1,
      },
    },
  ]);
  data.forEach(async (value) => {
    let id = value._id.toString();
    if (time >= value.ph) {
      if (value.ph != null) {
        let checkErrKalibrasi = await errKalibrasi.aggregate([
          {
            $match: {
              $and: [
                { loggerID: id },
                { errorMsg: "Silahkan kalibrasi sensor pH" },
                { status: false },
              ],
            },
          },
          {
            $sort: {
              timestamp: -1,
            },
          },
        ]);
        if (checkErrKalibrasi.length == 0) {
          let saveErrKalibrasi = new errKalibrasi({
            loggerID: value._id,
            errorMsg: "Silahkan kalibrasi sensor pH",
            timestamp: time,
            status: 0,
          });
          await saveErrKalibrasi.save();
        }
      }
    }
    if (time >= value.cod) {
      if (value.cod != null) {
        let checkErrKalibrasi = await errKalibrasi.aggregate([
          {
            $match: {
              $and: [
                { loggerID: id },
                { errorMsg: "Silahkan kalibrasi sensor COD" },
                { status: false },
              ],
            },
          },
          {
            $sort: {
              timestamp: -1,
            },
          },
        ]);
        if (checkErrKalibrasi.length == 0) {
          let saveErrKalibrasi = new errKalibrasi({
            loggerID: value._id,
            errorMsg: "Silahkan kalibrasi sensor COD",
            timestamp: time,
            status: 0,
          });
          await saveErrKalibrasi.save();
        }
      }
    }
    if (time >= value.tss) {
      if (value.tss != null) {
        let checkErrKalibrasi = await errKalibrasi.aggregate([
          {
            $match: {
              $and: [
                { loggerID: id },
                { errorMsg: "Silahkan kalibrasi sensor TSS" },
                { status: false },
              ],
            },
          },
          {
            $sort: {
              timestamp: -1,
            },
          },
        ]);
        if (checkErrKalibrasi.length == 0) {
          let saveErrKalibrasi = new errKalibrasi({
            loggerID: value._id,
            errorMsg: "Silahkan kalibrasi sensor TSS",
            timestamp: time,
            status: 0,
          });
          await saveErrKalibrasi.save();
        }
      }
    }
    if (time >= value.nh3n) {
      if (value.nh3n != null) {
        let checkErrKalibrasi = await errKalibrasi.aggregate([
          {
            $match: {
              $and: [
                { loggerID: id },
                { errorMsg: "Silahkan kalibrasi sensor NH3N" },
                { status: false },
              ],
            },
          },
          {
            $sort: {
              timestamp: -1,
            },
          },
        ]);
        if (checkErrKalibrasi.length == 0) {
          let saveErrKalibrasi = new errKalibrasi({
            loggerID: value._id,
            errorMsg: "Silahkan kalibrasi sensor NH3N",
            timestamp: time,
            status: 0,
          });
          await saveErrKalibrasi.save();
        }
      }
    }
    if (time >= value.debit) {
      if (value.debit != null) {
        let checkErrKalibrasi = await errKalibrasi.aggregate([
          {
            $match: {
              $and: [
                { loggerID: id },
                { errorMsg: "Silahkan kalibrasi sensor debit" },
                { status: false },
              ],
            },
          },
          {
            $sort: {
              timestamp: -1,
            },
          },
        ]);
        if (checkErrKalibrasi.length == 0) {
          let saveErrKalibrasi = new errKalibrasi({
            loggerID: value._id,
            errorMsg: "Silahkan kalibrasi sensor debit",
            timestamp: time,
            status: 0,
          });
          await saveErrKalibrasi.save();
        }
      }
    }
  });
  return res.send("Success");
});

module.exports = router;
