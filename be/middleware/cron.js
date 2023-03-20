const cron = require("node-cron");
const moment = require("moment");

const loggerDB = require("../model/Logger");
const dataSensorDB = require("../model/dataSensor");
const dataHourlySensorDB = require("../model/dataHourlySensor");
const dataDaySensorDB = require("../model/dataDaySensor");
const dataMonthSensorDB = require("../model/dataMonthSensor");
const dataAdmin2min = require("../model/dataAdmin2min");
const dataKabkotProv2min = require("../model/dataKabkotProv2min");
const errorDB = require("../model/errorSensor");
const errKalibrasi = require("../model/errorKalibrasi");
const errCapDB = require("../model/errorRecap");
const errDayDB = require("../model/errorDay");
const errMonthDB = require("../model/errorMonth");
const taskCronDB = require("../model/taskcronjob");
const { post_bulanan } = require("../services/simplepost");
const request = require("request-promise");
require("dotenv").config();
// cron.schedule("*/10 * * * * *", async () => {
cron.schedule("0 0 * * * *", async () => {
  console.log("cron job 1 jam");
  const time = moment().unix() - 3600;
  let start_ago = moment.unix(time).startOf("hours").unix();
  let end_ago = moment.unix(time).endOf("hours").unix();
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
  let datetime_before = 0; //dummy
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
        //   let lastTimestamp = moment(dataSensor[j - 1].timestamp * 1000)
        //     .startOf("minutes")
        //     .unix();
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
        timestamp: moment().unix(),
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
});
// cron.schedule("0 0 * * * *", async () => {
//     const time = moment().unix() - 3600;
//     console.log(time)
//     const logger = await loggerDB.find();

//     console.log(time);
//     for (let i = 0; i < logger.length; i++) {
//         const dataSensor = await dataSensorDB.aggregate([
//             {
//                 $match: {
//                     $and: [
//                         { loggerID: String(logger[i]._id) },
//                         {
//                             timestamp: {
//                                 $gte: time,
//                             },
//                         },
//                     ],
//                 },
//             },
//             {
//                 $group: {
//                     _id: null,
//                     pH: { $avg: { $arrayElemAt: ["$dataParam.value", 0] } },
//                     cod: { $avg: { $arrayElemAt: ["$dataParam.value", 1] } },
//                     tss: { $avg: { $arrayElemAt: ["$dataParam.value", 2] } },
//                     nh3n: { $avg: { $arrayElemAt: ["$dataParam.value", 3] } },
//                     debit: { $avg: { $arrayElemAt: ["$dataParam.value", 4] } },
//                 },
//             },
//             {
//                 $project: {
//                     dataParam: [
//                         {
//                             name: "pH",
//                             value: "$pH",
//                         },
//                         {
//                             name: "COD",
//                             value: "$cod",
//                         },
//                         {
//                             name: "TSS",
//                             value: "$tss",
//                         },
//                         {
//                             name: "NH3N",
//                             value: "$nh3n",
//                         },
//                         {
//                             name: "Debit",
//                             value: "$debit",
//                         },
//                     ],
//                 },
//             },
//         ]);

//         if (dataSensor.length > 0) {
//             const saveHourly = new dataHourlySensorDB({
//                 loggerID: logger[i]._id,
//                 dataParam: dataSensor[0].dataParam,
//                 timestamp: moment().unix(),
//             });
//             const saveHour = await saveHourly.save();
//             const loggerErr = await loggerDB.findOne({ _id: saveHourly.loggerID });

//             for (let i = 0; i < saveHour.dataParam.length; i++) {
//                 for (let a = 0; a < loggerErr.logDataRange.length; a++) {
//                     if (saveHour.dataParam[i].name === loggerErr.logDataRange[a].name) {
//                         if (
//                             saveHour.dataParam[i].value > loggerErr.logDataRange[a].max ||
//                             saveHour.dataParam[i].value < loggerErr.logDataRange[a].min
//                         ) {
//                             const msg = `Parameter ${saveHour.dataParam[i].name} tidak sesuai ambang batas!`;

//                             var errCap = new errCapDB({
//                                 loggerID: saveHour.loggerID,
//                                 timestamp: time + 3600,
//                                 errSUM: msg,
//                             });

//                             await errCap.save();
//                         }
//                     }
//                 }
//             }
//         }
//     }
// });

cron.schedule("*/2 * * * *", async () => {
  let loggerProv = await loggerDB.distinct("provID");
  let loggerKabkot = await loggerDB.distinct("kabkotID");

  const dataSensor = await dataSensorDB.aggregate([
    {
      $match: {
        $and: [
          {
            timestamp: {
              $gte: moment().unix() - 120,
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: null,
        pH: {
          $avg: {
            $arrayElemAt: ["$dataParam.value", 0],
          },
        },
        cod: {
          $avg: {
            $arrayElemAt: ["$dataParam.value", 1],
          },
        },
        tss: {
          $avg: {
            $arrayElemAt: ["$dataParam.value", 2],
          },
        },
        nh3n: {
          $avg: {
            $arrayElemAt: ["$dataParam.value", 3],
          },
        },
        debit: {
          $avg: {
            $arrayElemAt: ["$dataParam.value", 4],
          },
        },
      },
    },
    {
      $project: {
        dataParam: [
          {
            name: "pH",
            value: "$pH",
          },
          {
            name: "COD",
            value: "$cod",
          },
          {
            name: "TSS",
            value: "$tss",
          },
          {
            name: "NH3N",
            value: "$nh3n",
          },
          {
            name: "Debit",
            value: "$debit",
          },
        ],
      },
    },
  ]);
  if (dataSensor.length > 0) {
    const saveAdminData = new dataAdmin2min({
      dataParam: dataSensor[0].dataParam,
      timestamp: moment().unix(),
    });
    await saveAdminData.save();
  }
  for (let i = 0; i < loggerProv.length; i++) {
    const logger = await loggerDB.distinct("_id", {
      provID: loggerProv[i],
    });
    for (let a = 0; a < logger.length; a++) {
      logger[a] = String(logger[a]);
    }
    const dataSensor = await dataSensorDB.aggregate([
      {
        $match: {
          $and: [
            {
              loggerID: {
                $in: logger,
              },
            },
            {
              timestamp: {
                $gte: moment().unix() - 120,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          pH: {
            $avg: {
              $arrayElemAt: ["$dataParam.value", 0],
            },
          },
          cod: {
            $avg: {
              $arrayElemAt: ["$dataParam.value", 1],
            },
          },
          tss: {
            $avg: {
              $arrayElemAt: ["$dataParam.value", 2],
            },
          },
          nh3n: {
            $avg: {
              $arrayElemAt: ["$dataParam.value", 3],
            },
          },
          debit: {
            $avg: {
              $arrayElemAt: ["$dataParam.value", 4],
            },
          },
        },
      },
      {
        $project: {
          dataParam: [
            {
              name: "pH",
              value: "$pH",
            },
            {
              name: "COD",
              value: "$cod",
            },
            {
              name: "TSS",
              value: "$tss",
            },
            {
              name: "NH3N",
              value: "$nh3n",
            },
            {
              name: "Debit",
              value: "$debit",
            },
          ],
        },
      },
    ]);

    if (dataSensor.length > 0) {
      const saveKabkotProvData = new dataKabkotProv2min({
        provkabkotID: String(loggerProv[i]),
        dataParam: dataSensor[0].dataParam,
        timestamp: moment().unix(),
      });
      await saveKabkotProvData.save();
    }
  }
  for (let i = 0; i < loggerKabkot.length; i++) {
    const logger = await loggerDB.distinct("_id", {
      kabkotID: loggerKabkot[i],
    });
    for (let a = 0; a < logger.length; a++) {
      logger[a] = String(logger[a]);
    }
    const dataSensor = await dataSensorDB.aggregate([
      {
        $match: {
          $and: [
            {
              loggerID: {
                $in: logger,
              },
            },
            {
              timestamp: {
                $gte: moment().unix() - 120,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          pH: {
            $avg: {
              $arrayElemAt: ["$dataParam.value", 0],
            },
          },
          cod: {
            $avg: {
              $arrayElemAt: ["$dataParam.value", 1],
            },
          },
          tss: {
            $avg: {
              $arrayElemAt: ["$dataParam.value", 2],
            },
          },
          nh3n: {
            $avg: {
              $arrayElemAt: ["$dataParam.value", 3],
            },
          },
          debit: {
            $avg: {
              $arrayElemAt: ["$dataParam.value", 4],
            },
          },
        },
      },
      {
        $project: {
          dataParam: [
            {
              name: "pH",
              value: "$pH",
            },
            {
              name: "COD",
              value: "$cod",
            },
            {
              name: "TSS",
              value: "$tss",
            },
            {
              name: "NH3N",
              value: "$nh3n",
            },
            {
              name: "Debit",
              value: "$debit",
            },
          ],
        },
      },
    ]);

    if (dataSensor.length > 0) {
      const saveKabkotProvData = new dataKabkotProv2min({
        provkabkotID: String(loggerKabkot[i]),
        dataParam: dataSensor[0].dataParam,
        timestamp: moment().unix(),
      });
      await saveKabkotProvData.save();
    }
  }
});

// CRONJOB MIDNIGHT FOR SAVEDATAPERDAY
cron.schedule("0 0 0 * * *", async () => {
  var a = moment().add(-1, "days").startOf("day").unix();
  var b = moment().add(-1, "days").endOf("day").unix();

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
  console.log("save dataharian berhasil");
  let recron1jam = await recron1hours();
  console.log(recron1jam);
  let recronjob1day = await recrondaily();
  console.log(recronjob1day);
});

// CRON JOB 1 BULAN
// cron.schedule("*/10 * * * * *", async () => {
cron.schedule("0 0 1 * *", async () => {
  // let time = moment().subtract(1, 'months').unix();

  let start_time = moment().subtract(1, "month").startOf("month").unix();
  let end_time = moment().subtract(1, "month").endOf("month").unix();

  let bulan = moment().format("YYYY-MM");

  const logger = await loggerDB.find();
  let data = [];
  let tempdata = [];

  // console.log(moment(bulan, "YYYY-MM").daysInMonth()); return
  for (let i = 0; i < logger.length; i++) {
    const dataSensor = await dataDaySensorDB.aggregate([
      {
        $match: {
          $and: [
            // { loggerID: "5f619c497c5fc71255fa376b" },
            {
              loggerID: String(logger[i]._id),
            },
            {
              timestamp: {
                $gte: start_time,
                $lte: end_time,
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
      // let avgdebit = (totaldebit / dataSensor.length) * moment(bulan, "YYYY-MM").daysInMonth();
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

      const saveMonth = new dataMonthSensorDB({
        loggerID: logger[i]._id,
        dataParam: newdataParam,
        timestamp: end_time,
      });

      const savesMonth = await saveMonth.save();
      const loggerErr = await loggerDB.findOne({
        _id: saveMonth.loggerID,
      });

      for (let ii = 0; ii < saveMonth.dataParam.length; ii++) {
        for (let a = 0; a < loggerErr.logDataRange.length; a++) {
          if (saveMonth.dataParam[ii].name === loggerErr.logDataRange[a].name) {
            if (
              saveMonth.dataParam[ii].value > loggerErr.logDataRange[a].max
              // saveMonth.dataParam[ii].value < loggerErr.logDataRange[a].min
            ) {
              const msg = `Parameter ${saveMonth.dataParam[ii].name} tidak sesuai ambang batas!`;

              var errMonth = new errMonthDB({
                loggerID: saveMonth.loggerID,
                timestamp: end_time,
                errSUM: msg,
              });

              if (logger[i].formregis) {
                if (
                  typeof logger[i].formregis[0].teknis.satuanDebit !=
                  "undefined"
                ) {
                  if (logger[i].formregis[0].teknis.satuanDebit == "m3/bulan") {
                    await errMonth.save();
                  }
                }
              }
            }
          }
        }
      }
    }

    // POST TO SIMPLE
    // let posted = await post_bulanan("", start_time, end_time);
    let posted = await post_bulanan(logger[i]._id, start_time, end_time);
    if (posted) {
      // POST SIMPLE REQUEST>
      data.push(posted);
    }
  }
  // PERSIAPAN UNTUK KIRIM KE SIMPLE
  for (let i = 0; i < data.length; i++) {
    var options = {
      method: "POST",
      uri: process.env.API_SIMPLE + "/rest/v1/data_bulanan",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // 'key': '4k4wk808k0o4gs0oo4kc488kgo84k8g4cskoo084'
        key: process.env.API_SIMPLE_KEY,
      },
      form: data[i],
    };
    let dd = await request(options)
      .then(async function (response) {
        tempdata.push({
          loggerID: data[i].loggerID,
          status: true,
        });
        const task = new taskCronDB({
          loggerID: data[i].loggerid,
          type_task: "CRONJOB MONTHLY SIMPLE",
          start_time: start_time,
          end_time: end_time,
          created_at: end_time,
          status: true,
          message: response,
        });

        let createTask = await task.save();
        // res.send(response)
      })
      .catch(async function (err) {
        let message = err.response.body;
        tempdata.push({
          loggerID: data[i].loggerid,
          status: false,
        });
        const task = new taskCronDB({
          loggerID: data[i].loggerid,
          type_task: "CRONJOB MONTHLY SIMPLE",
          start_time: start_time,
          end_time: end_time,
          created_at: end_time,
          status: false,
          message: message,
        });

        let createTask = await task.save();
        // res.send(err.response.body)
      });
  }
  let sendMonthSimple = await resendMonthly();
  console.log("save databulanan berhasil");
  // cron.schedule("0 0 0 * * *", async () => {
  //     var a = moment().add(-1, 'days');
  //     var b = moment().add(-1, 'days');

  //     // If you want an inclusive end date (fully-closed interval)
  //     for (var m = moment(a); m.diff(b, 'days') <= 0; m.add(1, 'days')) {
  //         const logger = await loggerDB.find();
  //         const time = m.unix();
  //         for (let i = 0; i < logger.length; i++) {
  //             const dataHourlySensor = await dataHourlySensorDB.aggregate([
  //                 {
  //                     $match: {
  //                         $and: [
  //                             { loggerID: String(logger[i]._id) },
  //                             {
  //                                 timestamp: {
  //                                     $lte: time,
  //                                 },
  //                             },
  //                         ],
  //                     },
  //                 },
  //                 {
  //                     $group: {
  //                         _id: null,
  //                         pH: { $avg: { $arrayElemAt: ["$dataParam.value", 0] } },
  //                         cod: { $avg: { $arrayElemAt: ["$dataParam.value", 1] } },
  //                         tss: { $avg: { $arrayElemAt: ["$dataParam.value", 2] } },
  //                         nh3n: { $avg: { $arrayElemAt: ["$dataParam.value", 3] } },
  //                         debit: { $avg: { $arrayElemAt: ["$dataParam.value", 4] } },
  //                     },
  //                 },
  //                 {
  //                     $project: {
  //                         dataParam: [
  //                             {
  //                                 name: "pH",
  //                                 value: "$pH",
  //                             },
  //                             {
  //                                 name: "COD",
  //                                 value: "$cod",
  //                             },
  //                             {
  //                                 name: "TSS",
  //                                 value: "$tss",
  //                             },
  //                             {
  //                                 name: "NH3N",
  //                                 value: "$nh3n",
  //                             },
  //                             {
  //                                 name: "Debit",
  //                                 value: "$debit",
  //                             },
  //                         ],
  //                     },
  //                 },
  //             ]);
  //             if (dataHourlySensor.length > 0) {
  //                 const saveDay = new dataDaySensorDB({
  //                     loggerID: logger[i]._id,
  //                     dataParam: dataHourlySensor[0].dataParam,
  //                     timestamp: m.unix(),
  //                 });
  //                 let save_day = await saveDay.save();
  //             }
  //         }

  //     }
});

// CRONJOB error kalibrasi 1 hari
cron.schedule("0 0 * * *", async () => {
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
  console.log("save error kalibrasi berhasil");
});

// recronjob data 1 jam
async function recron1hours() {
  var a = moment().subtract(2, "day").startOf("day");
  var b = moment().subtract(2, "day").endOf("day");
  console.log(a, b);
  let result_data = [];
  for (var m = moment(a); m.diff(b, "hours") <= 0; m.add(1, "hours")) {
    // const time = m.format('DD-MM-YYYY HH:mm:ss');

    const time_now = m.unix();
    let time_ago = time_now - 3600;
    let start_ago = moment.unix(time_ago).startOf("hours").unix();
    let end_ago = moment.unix(time_ago).endOf("hours").unix();
    let datetime_before = 0; //dummy

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
    // DELETE HOURLY DATA OLD
    try {
      const deleteHour = await dataHourlySensorDB.deleteMany({
        timestamp: {
          $gte: moment.unix(time_now).startOf("hours").unix(),
          $lte: moment.unix(time_now).endOf("hours").unix(),
        },
      });
      const deleteHourErr = await errCapDB.deleteMany({
        timestamp: {
          $gte: moment.unix(time_now).startOf("hours").unix(),
          $lte: moment.unix(time_now).endOf("hours").unix(),
        },
      });
    } catch (e) {
      console.log(e);
    }

    // END DELETE HOURLY DATA OLD

    if (logger) {
      for (let i = 0; i < logger.length; i++) {
        dataSensor = await dataSensorDB.aggregate([
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
            timestamp: time_now,
          });

          const saveHour = await saveHourly.save();
          const loggerErr = await loggerDB.findOne({
            _id: saveHourly.loggerID,
          });

          for (let ii = 0; ii < saveHour.dataParam.length; ii++) {
            for (let a = 0; a < loggerErr.logDataRange.length; a++) {
              if (
                saveHour.dataParam[ii].name === loggerErr.logDataRange[a].name
              ) {
                if (
                  saveHour.dataParam[ii].value > loggerErr.logDataRange[a].max
                  // saveHour.dataParam[ii].value < loggerErr.logDataRange[a].min
                ) {
                  const msg = `Parameter ${saveHour.dataParam[ii].name} tidak sesuai ambang batas!`;

                  var errCap = new errCapDB({
                    loggerID: saveHour.loggerID,
                    timestamp: time_now,
                    errSUM: msg,
                  });
                  if (logger[i].formregis) {
                    if (
                      typeof logger[i].formregis[0].teknis.satuanDebit !=
                      "undefined"
                    ) {
                      if (
                        logger[i].formregis[0].teknis.satuanDebit ==
                          "m3/detik" ||
                        logger[i].formregis[0].teknis.satuanDebit ==
                          "m3/menit" ||
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
          result_data.push(saveHour);
        }
      }
    }
  }
  return "recronjob data hourly yesterday";
}

async function recrondaily() {
  //recrond job data 1 hari
  var a = moment().subtract(2, "day").startOf("day");
  var b = moment().subtract(2, "day").endOf("day");
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
  // DELETE Daily DATA OLD
  try {
    const deleteDaily = await dataDaySensorDB.deleteMany({
      timestamp: {
        $gte: moment(a).unix(),
        $lte: moment(b).unix(),
      },
    });
    const deleteDailyErr = await errDayDB.deleteMany({
      timestamp: {
        $gte: moment(a).unix(),
        $lte: moment(b).unix(),
      },
    });
  } catch (e) {
    console.log(e);
  }

  // END DELETE Daily DATA OLD

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
                $gte: moment(a).unix(),
                $lte: moment(b).unix(),
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
        timestamp: moment(b).unix(),
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
                timestamp: moment(b).unix(),
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
  return "recronjob data daily yesterday";
}

// a month ago
async function resendMonthly() {
  var start_time = moment().subtract(2, "month").startOf("month").unix();
  var end_time = moment().subtract(2, "month").endOf("month").unix();
  var last_month = moment().subtract(1, "month").endOf("month").unix();
  let data = [];
  let tempdata = [];

  let task_data = await taskCronDB.find(
    {
      start_time: start_time,
      end_time: end_time,
      status: false,
      type_task: "CRONJOB MONTHLY SIMPLE",
    },
    { loggerID: 1, start_time: 2, end_time: 3 }
  );

  if (task_data.length > 0) {
    for (let i = 0; i < task_data.length; i++) {
      let posted = await post_bulanan(
        task_data[i].loggerID,
        start_time,
        end_time,
        (type = "resend")
      );
      if (posted) {
        // POST SIMPLE REQUEST>
        data.push(posted);
      }
    }
    // PERSIAPAN UNTUK KIRIM KE SIMPLE
    for (let i = 0; i < data.length; i++) {
      var options = {
        method: "POST",
        uri: process.env.API_SIMPLE + "/rest/v1/data_bulanan",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          key: process.env.API_SIMPLE_KEY,
        },
        form: data[i],
      };
      let dd = await request(options)
        .then(async function (response) {
          tempdata.push({
            loggerID: data[i].loggerid,
            status: true,
          });

          let task_data_deleted = await taskCronDB
            .find({
              loggerID: data[i].loggerid,
              start_time: start_time,
              end_time: end_time,
              status: false,
              type_task: "CRONJOB MONTHLY SIMPLE",
            })
            .remove();

          const task = new taskCronDB({
            loggerID: data[i].loggerid,
            type_task: "CRONJOB MONTHLY SIMPLE",
            start_time: start_time,
            end_time: end_time,
            created_at: last_month,
            status: true,
            message: response,
          });

          let createTask = await task.save();
          // res.send(response)
        })
        .catch(async function (err) {
          let message = err.response.body;
          tempdata.push({
            loggerID: data[i].loggerid,
            status: false,
          });

          let task_data_deleted = await taskCronDB
            .find({
              loggerID: data[i].loggerid,
              start_time: start_time,
              end_time: end_time,
              status: false,
              type_task: "CRONJOB MONTHLY SIMPLE",
            })
            .remove();

          const task = new taskCronDB({
            _id: data[i]._id,
            loggerID: data[i].loggerid,
            type_task: "CRONJOB MONTHLY SIMPLE",
            start_time: start_time,
            end_time: end_time,
            created_at: last_month,
            status: false,
            message: message,
          });

          let createTask = await task.save();
          // res.send(err.response.body)
        });
      // END POST KESIMPLE
    }
    console.log("Simple Post Resend a MONTH AGO");
    // return "Simple Post Resend a MONTH AGO"
  }
}
