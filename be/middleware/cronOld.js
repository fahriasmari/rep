const cron = require("node-cron");
const moment = require("moment");

const loggerDB = require("../model/Logger");
const dataSensorDB = require("../model/dataSensor");
const dataHourlySensorDB = require("../model/dataHourlySensor");
const dataDaySensorDB = require("../model/dataDaySensor");
const dataAdmin2min = require("../model/dataAdmin2min");
const dataKabkotProv2min = require("../model/dataKabkotProv2min");
const errorDB = require("../model/errorSensor");
const errCapDB = require("../model/errorRecap");

// cron.schedule("*/10 * * * * *", async () => {
cron.schedule("0 0 * * * *", async () => {
  const time = moment().unix() - 3600;
  const logger = await loggerDB.find();

  // logger.map(async (x) => {
  //   const errCount = await errorDB.aggregate([
  //     { $match: { loggerID: x._id } },
  //     { $addFields: { convertedDataId: { $toObjectId: "$dataSensorID" } } },
  //     {
  //       $lookup: {
  //         from: "datasensors",
  //         localField: "convertedDataId",
  //         foreignField: "_id",
  //         as: "data",
  //       },
  //     },
  //     {
  //       $unwind: "$data",
  //     },
  //     {
  //       $match: {
  //         "data.timestamp": { $gte: time },
  //       },
  //     },
  //   ]);
  //   const errCap = new errCapDB({
  //     loggerID: x._id,
  //     errSUM: errCount.length,
  //     timestamp: time + 3600,
  //   });
  //   await errCap.save();
  // });

  for (let i = 0; i < logger.length; i++) {
    const dataSensor = await dataSensorDB.aggregate([
      {
        $match: {
          $and: [
            { loggerID: String(logger[i]._id) },
            {
              timestamp: {
                $gte: time,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          pH: { $avg: { $arrayElemAt: ["$dataParam.value", 0] } },
          cod: { $avg: { $arrayElemAt: ["$dataParam.value", 1] } },
          tss: { $avg: { $arrayElemAt: ["$dataParam.value", 2] } },
          nh3n: { $avg: { $arrayElemAt: ["$dataParam.value", 3] } },
          debit: { $avg: { $arrayElemAt: ["$dataParam.value", 4] } },
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
      const saveHourly = new dataHourlySensorDB({
        loggerID: logger[i]._id,
        dataParam: dataSensor[0].dataParam,
        timestamp: moment().unix(),
      });
      const saveHour = await saveHourly.save();
      const loggerErr = await loggerDB.findOne({ _id: saveHourly.loggerID });

      for (let i = 0; i < saveHour.dataParam.length; i++) {
        for (let a = 0; a < loggerErr.logDataRange.length; a++) {
          if (saveHour.dataParam[i].name === loggerErr.logDataRange[a].name) {
            if (
              saveHour.dataParam[i].value > loggerErr.logDataRange[a].max
              // saveHour.dataParam[i].value < loggerErr.logDataRange[a].min
            ) {
              const msg = `Parameter ${saveHour.dataParam[i].name} tidak sesuai ambang batas!`;

              var errCap = new errCapDB({
                loggerID: saveHour.loggerID,
                timestamp: time + 3600,
                errSUM: msg,
              });

              await errCap.save();
            }
          }
        }
      }
    }
  }
});

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
        pH: { $avg: { $arrayElemAt: ["$dataParam.value", 0] } },
        cod: { $avg: { $arrayElemAt: ["$dataParam.value", 1] } },
        tss: { $avg: { $arrayElemAt: ["$dataParam.value", 2] } },
        nh3n: { $avg: { $arrayElemAt: ["$dataParam.value", 3] } },
        debit: { $avg: { $arrayElemAt: ["$dataParam.value", 4] } },
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
            { loggerID: { $in: logger } },
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
          pH: { $avg: { $arrayElemAt: ["$dataParam.value", 0] } },
          cod: { $avg: { $arrayElemAt: ["$dataParam.value", 1] } },
          tss: { $avg: { $arrayElemAt: ["$dataParam.value", 2] } },
          nh3n: { $avg: { $arrayElemAt: ["$dataParam.value", 3] } },
          debit: { $avg: { $arrayElemAt: ["$dataParam.value", 4] } },
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
            { loggerID: { $in: logger } },
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
          pH: { $avg: { $arrayElemAt: ["$dataParam.value", 0] } },
          cod: { $avg: { $arrayElemAt: ["$dataParam.value", 1] } },
          tss: { $avg: { $arrayElemAt: ["$dataParam.value", 2] } },
          nh3n: { $avg: { $arrayElemAt: ["$dataParam.value", 3] } },
          debit: { $avg: { $arrayElemAt: ["$dataParam.value", 4] } },
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
  var a = moment().add(-1, "days");
  var b = moment().add(-1, "days");

  // If you want an inclusive end date (fully-closed interval)
  for (var m = moment(a); m.diff(b, "days") <= 0; m.add(1, "days")) {
    const logger = await loggerDB.find();
    const time = m.unix();
    for (let i = 0; i < logger.length; i++) {
      const dataHourlySensor = await dataHourlySensorDB.aggregate([
        {
          $match: {
            $and: [
              { loggerID: String(logger[i]._id) },
              {
                timestamp: {
                  $lte: time,
                },
              },
            ],
          },
        },
        {
          $group: {
            _id: null,
            pH: { $avg: { $arrayElemAt: ["$dataParam.value", 0] } },
            cod: { $avg: { $arrayElemAt: ["$dataParam.value", 1] } },
            tss: { $avg: { $arrayElemAt: ["$dataParam.value", 2] } },
            nh3n: { $avg: { $arrayElemAt: ["$dataParam.value", 3] } },
            debit: { $avg: { $arrayElemAt: ["$dataParam.value", 4] } },
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
      if (dataHourlySensor.length > 0) {
        const saveDay = new dataDaySensorDB({
          loggerID: logger[i]._id,
          dataParam: dataHourlySensor[0].dataParam,
          timestamp: m.unix(),
        });
        let save_day = await saveDay.save();
      }
    }
  }
  console.log("save dataharian berhasil");
});
