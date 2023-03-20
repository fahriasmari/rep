const express = require("express");
const router = express.Router();
const moment = require("moment");
const loggerDB = require("../model/Logger");
const dataSensorDB = require("../model/dataSensor");
const dataCheckerDB = require("../model/dataChecker");
const dataHourlySensorDB = require("../model/dataHourlySensor");
const userDB = require("../model/User");
const errorSensorDB = require("../model/errorSensor");
const manual2minDB = require("../model/Manual2min");
const logmanual2minDB = require("../model/logManual2min");
const datamanual2minDB = require("../model/dataManual2min");
const excelToJson = require("convert-excel-to-json");
const {
  daily,
  hourlyWithLogger,
  monthly,
} = require("../services/recron_sensor");
let xl = require("excel4node");

/* GET home page. */
router.get("/list", async (req, res) => {
  // let user = await userDB.findOne();
  // if (user.userRole.role !== "admin") return res.status(400).send("Error");
  const logger = await loggerDB.aggregate([
    { $addFields: { id: { $toObjectId: "$compID" } } },
    {
      $lookup: {
        from: "companies",
        localField: "id",
        foreignField: "_id",
        as: "companyDetails",
      },
    },
    { $unwind: "$companyDetails" },
    {
      $project: {
        id: 0,
      },
    },
    { $addFields: { id: { $toObjectId: "$kabkotID" } } },
    {
      $lookup: {
        from: "kabkotdbs",
        localField: "id",
        foreignField: "_id",
        as: "kabkotDetails",
      },
    },
    { $unwind: "$kabkotDetails" },
    {
      $project: {
        id: 0,
      },
    },
    { $addFields: { id: { $toObjectId: "$provID" } } },
    {
      $lookup: {
        from: "provdbs",
        localField: "id",
        foreignField: "_id",
        as: "provDetails",
      },
    },
    { $unwind: "$provDetails" },
    {
      $project: {
        id: 0,
      },
    },
  ]);
  res.send(logger);
});

router.get("/list-export", async (req, res) => {
  // let user = await userDB.findOne();
  // if (user.userRole.role !== "admin") return res.status(400).send("Error");
  const logger = await loggerDB.aggregate([
    {
      $addFields: {
        id: {
          $toObjectId: "$compID",
        },
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "id",
        foreignField: "_id",
        as: "companyDetails",
      },
    },
    {
      $unwind: "$companyDetails",
    },
    {
      $project: {
        id: 0,
      },
    },
    {
      $addFields: {
        id: {
          $toObjectId: "$kabkotID",
        },
      },
    },
    {
      $lookup: {
        from: "kabkotdbs",
        localField: "id",
        foreignField: "_id",
        as: "kabkotDetails",
      },
    },
    {
      $unwind: "$kabkotDetails",
    },
    {
      $project: {
        id: 0,
      },
    },
    {
      $addFields: {
        id: {
          $toObjectId: "$provID",
        },
      },
    },
    {
      $lookup: {
        from: "provdbs",
        localField: "id",
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
      },
    },
  ]);

  var wb = new xl.Workbook();
  var ws = wb.addWorksheet("Logger");

  let col = 1;
  //Akun
  ws.cell(col, 1).string("Logger ID");
  ws.cell(col, 2).string("Nama Industri");
  ws.cell(col, 3).string("Jenis Industri");
  ws.cell(col, 4).string("Kab/Kot");
  ws.cell(col, 5).string("Provinsi");
  ws.cell(col, 6).string("Alamat");
  ws.cell(col, 7).string("Phone");
  ws.cell(col, 8).string("Waste Source");
  ws.cell(col, 9).string("WTP Tech");

  for (let i = 0; i < logger.length; i++) {
    col++;
    ws.cell(col, 1).string(logger[i]._id.toString());
    ws.cell(col, 2).string(logger[i].companyDetails.compName);
    ws.cell(col, 3).string(logger[i].companyDetails.compType);
    ws.cell(col, 4).string(logger[i].kabkotDetails.kabkotName);
    ws.cell(col, 5).string(logger[i].provDetails.provName);
    ws.cell(col, 6).string(logger[i].companyDetails.compAddress);
    ws.cell(col, 7).string(logger[i].companyDetails.compTlp);
    ws.cell(col, 8).string(logger[i].companyDetails.compWasteSource);
    ws.cell(col, 9).string(logger[i].companyDetails.compTech);
  }

  wb.write(`List Database.xlsx`, res);
});

router.post("/register", async function (req, res, next) {
  const logger = req.body;
  logger.errCounter = 0;
  logger.activationStatus = false;
  const saveLogger = new loggerDB(logger);
  try {
    const savedLogger = await saveLogger.save();
    res.send(savedLogger);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/logger/:id", async function (req, res, next) {
  const compID = req.body.compID,
    kabkotID = req.body.kabkotID,
    provID = req.body.provID,
    logDataRange = req.body.logDataRange,
    latlong = req.body.latlong;

  const updateLogger = {
    compID,
    kabkotID,
    provID,
    logDataRange,
    latlong,
  };
  try {
    const savedLogger = await loggerDB.updateOne(
      { _id: req.params.id },
      updateLogger
    );
    res.send(savedLogger);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/logger-activation/:id", async function (req, res, next) {
  let loggerID = req.params.id;
  try {
    logger = await loggerDB.findById({ _id: loggerID, activationStatus: true });
    if (logger.activationStatus) {
      return res.status(200).send("Logger ID is actived!");
    } else {
      return res.status(400).send("Logger ID is not actived!");
    }
  } catch (error) {
    return res.status(400).send("Logger ID is not found!");
  }
});

router.post("/datarec", async function (req, res, next) {
  const loggerID = req.body.uid,
    dataParam = [
      { name: "pH", value: Number(req.body.pH) },
      { name: "COD", value: Number(req.body.cod) },
      { name: "TSS", value: Number(req.body.tss) },
      { name: "NH3N", value: Number(req.body.nh3n) },
      { name: "Debit", value: Number(req.body.debit) },
    ],
    timestamp = req.body.datetime,
    hours = moment(req.body.datetime * 1000)
      .startOf("hours")
      .unix();
  serverTimestamp = moment().unix();
  let logger,
    errorMsg = [];

  try {
    logger = await loggerDB.findOne({ _id: loggerID, activationStatus: true });
  } catch (error) {
    if (!logger) return res.status(400).send("Logger ID is invalid!");
  }

  const check = await dataCheckerDB.findOne({
    loggerID,
    hours,
  });
  if (!check) {
    const checkSaved = new dataCheckerDB({
      loggerID,
      hours,
      count: 1,
      lastDataTime: timestamp,
    });
    await checkSaved.save();
  } else {
    if (check.count > 30) {
      return res.send("Data lebih dari 30");
    }
    if (check.lastDataTime === timestamp) {
      return res.send("Data sama");
    }
    await dataCheckerDB.findOneAndUpdate(
      { _id: check._id },
      { count: check.count + 1, lastDataTime: timestamp }
    );
  }
  // const start = moment(timestamp * 1000)
  //     .startOf("hours")
  //     .unix(),
  //   end = moment(timestamp * 1000)
  //     .endOf("hours")
  //     .unix();
  // checkCount = await dataSensorDB.find({
  //   loggerID,
  //   timestamp: {
  //     $gte: start,
  //     $lt: end,
  //   },
  // });
  // if (check.length > 0) {
  //   const unique = [...new Set(check.map((item) => item._id))];
  //   await dataSensorDB.deleteMany({ _id: { $in: unique } });
  // }
  // if (checkCount.length <= 30) {
  const dataSensorSave = new dataSensorDB({
    loggerID,
    dataParam,
    timestamp,
    serverTimestamp,
    isCount: true,
  });

  try {
    const savedDataSensor = await dataSensorSave.save();
    let err = 0;
    for (let i = 0; i < logger.logDataRange.length; i++) {
      const dataCompare = savedDataSensor.dataParam.find(
        (el) => el.name === logger.logDataRange[i].name
      );

      if (
        dataCompare.value < logger.logDataRange[i].min ||
        dataCompare.value > logger.logDataRange[i].max
      ) {
        err++;
        const error = new errorSensorDB({
          loggerID,
          dataSensorID: savedDataSensor._id,
          errorMsg: `Nilai ${logger.logDataRange[i].name} tidak sesuai ambang batas!`,
        });
        const saveError = await error.save();
        errorMsg.push(saveError.errorMsg);
      }
    }
    if (err > 0) {
      if (logger.errCounter === undefined) {
        logger.errCounter = 0;
      }

      await loggerDB.updateOne(
        { _id: loggerID },
        { errCounter: logger.errCounter + 1 }
      );
    } else {
      await loggerDB.updateOne({ _id: loggerID }, { errCounter: 0 });
    }

    res.send({ savedDataSensor, errorMsg });
  } catch (error) {
    res.status(400).send(error);
  }
  // } else {
  //   res.send("data lebih dari 30");
  // }
});

router.post("/manual", async function (req, res, next) {
  const logger = await loggerDB.findOne({ compID: req.body.compID });
  if (!logger) {
    return res.send({ success: false, message: "Logger not found" });
  }
  const manual = new manual2minDB({ ...req.body, status: "pending" });
  let json = excelToJson({
    sourceFile: __basedir + "/public" + req.body.fileLaporanPath,
    header: {
      rows: 2,
    },
  });
  json.data.forEach(async (value) => {
    let d = value.G.substr(0, 2);
    let m = value.G.substr(3, 2);
    let y = value.G.substr(6, 4);
    let fulltime = value.G.substr(-9);
    let time = fulltime.substr(0, 6);
    let newDate = y + "/" + m + "/" + d + time + ":00";
    value.G = moment(new Date(newDate)).unix();
  });
  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }
  const data = getUniqueListBy(json.data, "G");
  const manualSaved = await manual.save();
  let i = 0;
  let lastStart = 0;
  const now = moment().unix();
  for (let index = 0; index < data.length; index++) {
    let value = data[index];
    let start = moment(value.H * 1000)
      .startOf("h")
      .unix();
    if (index == 0 || (i < 30 && start == lastStart)) {
      if (index == 0) {
        lastStart = start;
        let dataManual = new datamanual2minDB({
          manual2minID: manualSaved._id,
          loggerID: logger._id,
          dataParam: [
            {
              name: "pH",
              value: value.B,
            },
            {
              name: "COD",
              value: value.C,
            },
            {
              name: "TSS",
              value: value.D,
            },
            {
              name: "NH3N",
              value: value.E,
            },
            {
              name: "Debit",
              value: value.F,
            },
          ],
          timestamp: value.G,
          serverTimestamp: now,
        });
        await dataManual.save();
      } else {
        let dataManual = new datamanual2minDB({
          manual2minID: manualSaved._id,
          loggerID: logger._id,
          dataParam: [
            {
              name: "pH",
              value: value.B,
            },
            {
              name: "COD",
              value: value.C,
            },
            {
              name: "TSS",
              value: value.D,
            },
            {
              name: "NH3N",
              value: value.E,
            },
            {
              name: "Debit",
              value: value.F,
            },
          ],
          timestamp: value.G,
          serverTimestamp: now,
        });
        await dataManual.save();
      }
    } else {
      if (start != lastStart) {
        i = 0;
        lastStart = start;

        let dataManual = new datamanual2minDB({
          manual2minID: manualSaved._id,
          loggerID: logger._id,
          dataParam: [
            {
              name: "pH",
              value: value.B,
            },
            {
              name: "COD",
              value: value.C,
            },
            {
              name: "TSS",
              value: value.D,
            },
            {
              name: "NH3N",
              value: value.E,
            },
            {
              name: "Debit",
              value: value.F,
            },
          ],
          timestamp: value.G,
          serverTimestamp: now,
        });
        await dataManual.save();
      }
    }
    i++;
  }
  const log = new logmanual2minDB({
    manual2minID: manualSaved._id,
    keterangan: "Pengajuan baru",
    petugas: "-",
    status: "Menunggu Validasi",
    createdAt: now,
  });
  await log.save();
  return res.send({ success: true, data: manualSaved });
});

router.put("/validasi-manual/:manualID", async function (req, res, next) {
  const manualID = req.params.manualID;
  const { keterangan, petugas, status } = req.body;
  let manual = await manual2minDB.findOne({ _id: manualID });
  if (!manual) {
    return res.send({ success: false, data: "Data Tidak Ditemukan" });
  }
  if (manual.status == "rejected") {
    return res.send({ success: false, data: "Data telah ditolak" });
  }
  if (manual.status == "accepted") {
    return res.send({ success: false, data: "Data telah diterima" });
  }
  if (status == "accepted") {
    await manual2minDB.findOneAndUpdate({ _id: manualID }, { status: status });
    const dataManual = await datamanual2minDB.aggregate([
      {
        $match: { manual2minID: manualID },
      },
    ]);
    const loggerID = dataManual[0].loggerID;
    const logger = await loggerDB.findOne({ _id: loggerID });
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
  } else {
    await manual2minDB.findOneAndUpdate({ _id: manualID }, { status: status });
  }
  manual = await manual2minDB.findOne({ _id: manualID });
  const now = moment().unix();
  const log = new logmanual2minDB({
    manual2minID: manualID,
    keterangan,
    petugas,
    status: status === "accepted" ? "Diterima" : "Ditolak",
    createdAt: now,
  });
  await log.save();
  return res.send({ success: true, data: manual });
});

router.get("/manual/:compID?", async function (req, res, next) {
  const compID = req.params.compID;
  let manual;
  if (!compID) {
    manual = await manual2minDB.find();
  } else {
    manual = await manual2minDB.find({ compID: compID });
  }
  return res.send({ success: true, data: manual });
});

router.get("/manual-detail/:manualID?", async function (req, res, next) {
  const { manualID } = req.params;
  let manual = await manual2minDB.findOne({ _id: manualID });
  if (!manual) {
    return res.send({ success: false, message: "Data Manual Tidak Ditemukan" });
  }
  let log = await logmanual2minDB.find({ manual2minID: manual._id });
  let parameter = await datamanual2minDB.find({ manual2minID: manual._id });
  return res.send({ success: true, data: manual, parameter, log });
});

router.post("/datarec-hour", async function (req, res, next) {
  const loggerID = req.body.uid,
    dataParam = [
      { name: "pH", value: Number(req.body.pH) },
      { name: "COD", value: Number(req.body.cod) },
      { name: "TSS", value: Number(req.body.tss) },
      { name: "NH3N", value: Number(req.body.nh3n) },
      { name: "Debit", value: Number(req.body.debit) },
    ],
    timestamp = req.body.datetime,
    serverTimestamp = moment().unix();
  const logger = await loggerDB.findOne({ _id: loggerID });
  if (!logger) return res.status(400).send("Logger ID is invalid!");
  const dataSensorSave = new dataHourlySensorDB({
    loggerID,
    dataParam,
    timestamp,
  });
  try {
    const savedDataSensor = await dataSensorSave.save();
    res.send(savedDataSensor);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
