var express = require("express");
var router = express.Router();
const loggerDB = require("../model/Logger");
const dataSensorDB = require("../model/dataSensor");
const dataHourlySensorDB = require("../model/dataHourlySensor");
const errCapDB = require("../model/errorRecap");
const userDB = require("../model/User");
const errorSensorDB = require("../model/errorSensor");
const moment = require("moment");
const { request } = require("http");

/* GET home page. */
router.get("/list/:id", async function (req, res, next) {
  const user = await userDB.findOne({ _id: req.params.id });
  let dataError, listLogger;
  let query = {};
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
      { timestamp: { $gte: Number(req.query.start) } },
      { timestamp: { $lte: Number(req.query.end) } },
    ];
  }
  switch (user.userRole.role) {
    case "admin":
      dataError = await errorSensorDB.aggregate([
        { $limit: 2500 },
        {
          $addFields: { logID: { $toObjectId: "$loggerID" } },
        },
        {
          $lookup: {
            from: "loggers",
            localField: "logID",
            foreignField: "_id",
            as: "loggerDetails",
          },
        },
        { $unwind: "$loggerDetails" },
        {
          $project: {
            logID: 0,
          },
        },
        {
          $addFields: { provID: { $toObjectId: "$loggerDetails.provID" } },
        },
        {
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetails",
          },
        },
        { $unwind: "$provDetails" },
        {
          $project: {
            provID: 0,
          },
        },
        {
          $addFields: { kabkotID: { $toObjectId: "$loggerDetails.kabkotID" } },
        },
        {
          $lookup: {
            from: "kabkotdbs",
            localField: "kabkotID",
            foreignField: "_id",
            as: "kabkotDetails",
          },
        },
        { $unwind: "$kabkotDetails" },
        {
          $project: {
            kabkotID: 0,
          },
        },
        {
          $addFields: { compID: { $toObjectId: "$loggerDetails.compID" } },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        { $unwind: "$compDetails" },
        {
          $project: {
            compID: 0,
          },
        },
        {
          $addFields: { dataSensorID: { $toObjectId: "$dataSensorID" } },
        },
        {
          $lookup: {
            from: "datasensors",
            localField: "dataSensorID",
            foreignField: "_id",
            as: "dataSensor",
          },
        },
        { $unwind: "$dataSensor" },
        {
          $project: {
            dataSensorID: 0,
          },
        },
        { $match: query },
        {
          $project: {
            errorMsg: "$errorMsg",
            compName: "$compDetails.compName",
            compType: "$compDetails.compType",
            timestamp: "$dataSensor.timestamp",
            provName: "$provDetails.provName",
            kabkotName: "$kabkotDetails.kabkotName",
          },
        },
      ]);
      break;
    case "prov":
      listLogger = await loggerDB.distinct("_id", {
        provID: user.userRole.provID,
      });
      for (let i = 0; i < listLogger.length; i++) {
        listLogger[i] = String(listLogger[i]);
      }
      dataError = await errorSensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
        { $limit: 2500 },
        {
          $addFields: { logID: { $toObjectId: "$loggerID" } },
        },
        {
          $lookup: {
            from: "loggers",
            localField: "logID",
            foreignField: "_id",
            as: "loggerDetails",
          },
        },
        { $unwind: "$loggerDetails" },
        {
          $project: {
            logID: 0,
          },
        },
        {
          $addFields: { provID: { $toObjectId: "$loggerDetails.provID" } },
        },
        {
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetails",
          },
        },
        { $unwind: "$provDetails" },
        {
          $project: {
            provID: 0,
          },
        },
        {
          $addFields: { kabkotID: { $toObjectId: "$loggerDetails.kabkotID" } },
        },
        {
          $lookup: {
            from: "kabkotdbs",
            localField: "kabkotID",
            foreignField: "_id",
            as: "kabkotDetails",
          },
        },
        { $unwind: "$kabkotDetails" },
        {
          $project: {
            kabkotID: 0,
          },
        },
        {
          $addFields: { compID: { $toObjectId: "$loggerDetails.compID" } },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        { $unwind: "$compDetails" },
        {
          $project: {
            compID: 0,
          },
        },
        {
          $addFields: { dataSensorID: { $toObjectId: "$dataSensorID" } },
        },
        {
          $lookup: {
            from: "datasensors",
            localField: "dataSensorID",
            foreignField: "_id",
            as: "dataSensor",
          },
        },
        { $unwind: "$dataSensor" },
        {
          $project: {
            dataSensorID: 0,
          },
        },
        { $match: query },
        {
          $project: {
            errorMsg: "$errorMsg",
            compName: "$compDetails.compName",
            compType: "$compDetails.compType",
            timestamp: "$dataSensor.timestamp",
            provName: "$provDetails.provName",
            kabkotName: "$kabkotDetails.kabkotName",
          },
        },
      ]);
      break;
    case "kabkot":
      listLogger = await loggerDB.distinct("_id", {
        kabkotID: user.userRole.kabkotID,
      });
      for (let i = 0; i < listLogger.length; i++) {
        listLogger[i] = String(listLogger[i]);
      }
      dataError = await errorSensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
        { $limit: 2500 },
        {
          $addFields: { logID: { $toObjectId: "$loggerID" } },
        },
        {
          $lookup: {
            from: "loggers",
            localField: "logID",
            foreignField: "_id",
            as: "loggerDetails",
          },
        },
        { $unwind: "$loggerDetails" },
        {
          $project: {
            logID: 0,
          },
        },
        {
          $addFields: { provID: { $toObjectId: "$loggerDetails.provID" } },
        },
        {
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetails",
          },
        },
        { $unwind: "$provDetails" },
        {
          $project: {
            provID: 0,
          },
        },
        {
          $addFields: { kabkotID: { $toObjectId: "$loggerDetails.kabkotID" } },
        },
        {
          $lookup: {
            from: "kabkotdbs",
            localField: "kabkotID",
            foreignField: "_id",
            as: "kabkotDetails",
          },
        },
        { $unwind: "$kabkotDetails" },
        {
          $project: {
            kabkotID: 0,
          },
        },
        {
          $addFields: { compID: { $toObjectId: "$loggerDetails.compID" } },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        { $unwind: "$compDetails" },
        {
          $project: {
            compID: 0,
          },
        },
        {
          $addFields: { dataSensorID: { $toObjectId: "$dataSensorID" } },
        },
        {
          $lookup: {
            from: "datasensors",
            localField: "dataSensorID",
            foreignField: "_id",
            as: "dataSensor",
          },
        },
        { $unwind: "$dataSensor" },
        {
          $project: {
            dataSensorID: 0,
          },
        },
        { $match: query },
        {
          $project: {
            errorMsg: "$errorMsg",
            compName: "$compDetails.compName",
            compType: "$compDetails.compType",
            timestamp: "$dataSensor.timestamp",
            provName: "$provDetails.provName",
            kabkotName: "$kabkotDetails.kabkotName",
          },
        },
      ]);
      break;
    case "comp":
      listLogger = await loggerDB.findOne({
        compID: user.userRole.compID,
      });

      dataError = await errorSensorDB.aggregate([
        { $match: { loggerID: String(listLogger._id) } },
        { $limit: 2500 },
        {
          $addFields: { logID: { $toObjectId: "$loggerID" } },
        },
        {
          $lookup: {
            from: "loggers",
            localField: "logID",
            foreignField: "_id",
            as: "loggerDetails",
          },
        },
        { $unwind: "$loggerDetails" },
        {
          $project: {
            logID: 0,
          },
        },
        {
          $addFields: { provID: { $toObjectId: "$loggerDetails.provID" } },
        },
        {
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetails",
          },
        },
        { $unwind: "$provDetails" },
        {
          $project: {
            provID: 0,
          },
        },
        {
          $addFields: { kabkotID: { $toObjectId: "$loggerDetails.kabkotID" } },
        },
        {
          $lookup: {
            from: "kabkotdbs",
            localField: "kabkotID",
            foreignField: "_id",
            as: "kabkotDetails",
          },
        },
        { $unwind: "$kabkotDetails" },
        {
          $project: {
            kabkotID: 0,
          },
        },
        {
          $addFields: { compID: { $toObjectId: "$loggerDetails.compID" } },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        { $unwind: "$compDetails" },
        {
          $project: {
            compID: 0,
          },
        },
        {
          $addFields: { dataSensorID: { $toObjectId: "$dataSensorID" } },
        },
        {
          $lookup: {
            from: "datasensors",
            localField: "dataSensorID",
            foreignField: "_id",
            as: "dataSensor",
          },
        },
        { $unwind: "$dataSensor" },
        {
          $project: {
            dataSensorID: 0,
          },
        },
        { $match: query },
        {
          $project: {
            errorMsg: "$errorMsg",
            compName: "$compDetails.compName",
            compType: "$compDetails.compType",
            timestamp: "$dataSensor.timestamp",
            provName: "$provDetails.provName",
            kabkotName: "$kabkotDetails.kabkotName",
          },
        },
      ]);
      break;

    default:
      break;
  }
  res.send(dataError);
});

router.get("/list-recent/:id", async function (req, res, next) {
  const user = await userDB.findOne({ _id: req.params.id });
  let dataError, listLogger;
  let query = {};
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
      { timestamp: { $gte: Number(req.query.start) } },
      { timestamp: { $lte: Number(req.query.end) } },
    ];
  }
  switch (user.userRole.role) {
    case "admin":
      dataError = await errorSensorDB.aggregate([
        {
          $addFields: { logID: { $toObjectId: "$loggerID" } },
        },
        {
          $lookup: {
            from: "loggers",
            localField: "logID",
            foreignField: "_id",
            as: "loggerDetails",
          },
        },
        { $unwind: "$loggerDetails" },
        {
          $project: {
            logID: 0,
          },
        },
        {
          $addFields: { provID: { $toObjectId: "$loggerDetails.provID" } },
        },
        {
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetails",
          },
        },
        { $unwind: "$provDetails" },
        {
          $project: {
            provID: 0,
          },
        },
        {
          $addFields: { kabkotID: { $toObjectId: "$loggerDetails.kabkotID" } },
        },
        {
          $lookup: {
            from: "kabkotdbs",
            localField: "kabkotID",
            foreignField: "_id",
            as: "kabkotDetails",
          },
        },
        { $unwind: "$kabkotDetails" },
        {
          $project: {
            kabkotID: 0,
          },
        },
        {
          $addFields: { compID: { $toObjectId: "$loggerDetails.compID" } },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        { $unwind: "$compDetails" },
        {
          $project: {
            compID: 0,
          },
        },
        {
          $addFields: { dataSensorID: { $toObjectId: "$dataSensorID" } },
        },
        {
          $lookup: {
            from: "datasensors",
            localField: "dataSensorID",
            foreignField: "_id",
            as: "dataSensor",
          },
        },
        { $unwind: "$dataSensor" },
        {
          $project: {
            dataSensorID: 0,
          },
        },
        { $match: query },
        {
          $project: {
            errorMsg: "$errorMsg",
            compName: "$compDetails.compName",
            compType: "$compDetails.compType",
            timestamp: "$dataSensor.timestamp",
            provName: "$provDetails.provName",
            kabkotName: "$kabkotDetails.kabkotName",
          },
        },
        { $limit: 25 },
      ]);
      break;
    case "prov":
      listLogger = await loggerDB.distinct("_id", {
        provID: user.userRole.provID,
      });
      for (let i = 0; i < listLogger.length; i++) {
        listLogger[i] = String(listLogger[i]);
      }
      dataError = await errorSensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
        {
          $addFields: { logID: { $toObjectId: "$loggerID" } },
        },
        {
          $lookup: {
            from: "loggers",
            localField: "logID",
            foreignField: "_id",
            as: "loggerDetails",
          },
        },
        { $unwind: "$loggerDetails" },
        {
          $project: {
            logID: 0,
          },
        },
        {
          $addFields: { provID: { $toObjectId: "$loggerDetails.provID" } },
        },
        {
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetails",
          },
        },
        { $unwind: "$provDetails" },
        {
          $project: {
            provID: 0,
          },
        },
        {
          $addFields: { kabkotID: { $toObjectId: "$loggerDetails.kabkotID" } },
        },
        {
          $lookup: {
            from: "kabkotdbs",
            localField: "kabkotID",
            foreignField: "_id",
            as: "kabkotDetails",
          },
        },
        { $unwind: "$kabkotDetails" },
        {
          $project: {
            kabkotID: 0,
          },
        },
        {
          $addFields: { compID: { $toObjectId: "$loggerDetails.compID" } },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        { $unwind: "$compDetails" },
        {
          $project: {
            compID: 0,
          },
        },
        {
          $addFields: { dataSensorID: { $toObjectId: "$dataSensorID" } },
        },
        {
          $lookup: {
            from: "datasensors",
            localField: "dataSensorID",
            foreignField: "_id",
            as: "dataSensor",
          },
        },
        { $unwind: "$dataSensor" },
        {
          $project: {
            dataSensorID: 0,
          },
        },
        { $match: query },
        {
          $project: {
            errorMsg: "$errorMsg",
            compName: "$compDetails.compName",
            compType: "$compDetails.compType",
            timestamp: "$dataSensor.timestamp",
            provName: "$provDetails.provName",
            kabkotName: "$kabkotDetails.kabkotName",
          },
        },
        { $limit: 25 },
      ]);
      break;
    case "kabkot":
      listLogger = await loggerDB.distinct("_id", {
        kabkotID: user.userRole.kabkotID,
      });
      for (let i = 0; i < listLogger.length; i++) {
        listLogger[i] = String(listLogger[i]);
      }
      dataError = await errorSensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
        {
          $addFields: { logID: { $toObjectId: "$loggerID" } },
        },
        {
          $lookup: {
            from: "loggers",
            localField: "logID",
            foreignField: "_id",
            as: "loggerDetails",
          },
        },
        { $unwind: "$loggerDetails" },
        {
          $project: {
            logID: 0,
          },
        },
        {
          $addFields: { provID: { $toObjectId: "$loggerDetails.provID" } },
        },
        {
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetails",
          },
        },
        { $unwind: "$provDetails" },
        {
          $project: {
            provID: 0,
          },
        },
        {
          $addFields: { kabkotID: { $toObjectId: "$loggerDetails.kabkotID" } },
        },
        {
          $lookup: {
            from: "kabkotdbs",
            localField: "kabkotID",
            foreignField: "_id",
            as: "kabkotDetails",
          },
        },
        { $unwind: "$kabkotDetails" },
        {
          $project: {
            kabkotID: 0,
          },
        },
        {
          $addFields: { compID: { $toObjectId: "$loggerDetails.compID" } },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        { $unwind: "$compDetails" },
        {
          $project: {
            compID: 0,
          },
        },
        {
          $addFields: { dataSensorID: { $toObjectId: "$dataSensorID" } },
        },
        {
          $lookup: {
            from: "datasensors",
            localField: "dataSensorID",
            foreignField: "_id",
            as: "dataSensor",
          },
        },
        { $unwind: "$dataSensor" },
        {
          $project: {
            dataSensorID: 0,
          },
        },
        { $match: query },
        {
          $project: {
            errorMsg: "$errorMsg",
            compName: "$compDetails.compName",
            compType: "$compDetails.compType",
            timestamp: "$dataSensor.timestamp",
            provName: "$provDetails.provName",
            kabkotName: "$kabkotDetails.kabkotName",
          },
        },
        { $limit: 25 },
      ]);
      break;
    case "comp":
      listLogger = await loggerDB.findOne({
        compID: user.userRole.compID,
      });

      dataError = await errorSensorDB.aggregate([
        { $match: { loggerID: String(listLogger._id) } },
        {
          $addFields: { logID: { $toObjectId: "$loggerID" } },
        },
        {
          $lookup: {
            from: "loggers",
            localField: "logID",
            foreignField: "_id",
            as: "loggerDetails",
          },
        },
        { $unwind: "$loggerDetails" },
        {
          $project: {
            logID: 0,
          },
        },
        {
          $addFields: { provID: { $toObjectId: "$loggerDetails.provID" } },
        },
        {
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetails",
          },
        },
        { $unwind: "$provDetails" },
        {
          $project: {
            provID: 0,
          },
        },
        {
          $addFields: { kabkotID: { $toObjectId: "$loggerDetails.kabkotID" } },
        },
        {
          $lookup: {
            from: "kabkotdbs",
            localField: "kabkotID",
            foreignField: "_id",
            as: "kabkotDetails",
          },
        },
        { $unwind: "$kabkotDetails" },
        {
          $project: {
            kabkotID: 0,
          },
        },
        {
          $addFields: { compID: { $toObjectId: "$loggerDetails.compID" } },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        { $unwind: "$compDetails" },
        {
          $project: {
            compID: 0,
          },
        },
        {
          $addFields: { dataSensorID: { $toObjectId: "$dataSensorID" } },
        },
        {
          $lookup: {
            from: "datasensors",
            localField: "dataSensorID",
            foreignField: "_id",
            as: "dataSensor",
          },
        },
        { $unwind: "$dataSensor" },
        {
          $project: {
            dataSensorID: 0,
          },
        },
        { $match: query },
        {
          $project: {
            errorMsg: "$errorMsg",
            compName: "$compDetails.compName",
            compType: "$compDetails.compType",
            timestamp: "$dataSensor.timestamp",
            provName: "$provDetails.provName",
            kabkotName: "$kabkotDetails.kabkotName",
          },
        },
        { $limit: 25 },
      ]);
      break;

    default:
      break;
  }
  res.send(dataError);
});

router.get("/notif/:id", async (req, res) => {
  const user = await userDB.findOne({
    _id: req.params.id,
  });
  let logger, notif;

  switch (user.userRole.role) {
    case "admin":
      logger = await loggerDB.find({ errCounter: { $gte: 10 } });

      if (logger.length > 0) {
        notif = true;
      } else {
        notif = false;
      }
      break;
    case "prov":
      logger = await loggerDB.find({
        provID: user.userRole.provID,
        errCounter: { $gte: 10 },
      });
      if (logger.length > 0) {
        notif = true;
      } else {
        notif = false;
      }
      break;
    case "kabkot":
      logger = await loggerDB.find({
        kabkotID: user.userRole.kabkotID,
        errCounter: { $gte: 10 },
      });
      if (logger.length > 0) {
        notif = true;
      } else {
        notif = false;
      }
      break;
    case "comp":
      logger = await loggerDB.find({
        compID: user.userRole.compID,
        errCounter: { $gte: 10 },
      });
      if (logger.length > 0) {
        notif = true;
      } else {
        notif = false;
      }
      break;
    default:
      break;
  }

  res.send({ notif });
});

router.get("/recap/:id", async (req, res) => {
  const user = await userDB.findOne({ _id: req.params.id });
  console.log(user);
  switch (user.userRole.role) {
    case "admin":
      try {
        const errCap = await errCapDB.aggregate([
          { $addFields: { convertedLoggerID: { $toObjectId: "$loggerID" } } },
          {
            $lookup: {
              from: "loggers",
              localField: "convertedLoggerID",
              foreignField: "_id",
              as: "loggerDetails",
            },
          },
          { $unwind: "$loggerDetails" },
          {
            $addFields: {
              convertedCompID: { $toObjectId: "$loggerDetails.compID" },
            },
          },
          {
            $lookup: {
              from: "companies",
              localField: "convertedCompID",
              foreignField: "_id",
              as: "compDetails",
            },
          },
          { $unwind: "$compDetails" },
          { $sort: { _id: -1 } },
        ]);
        res.send(errCap);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "prov":
      try {
        const logger = await loggerDB.find({ provID: user.userRole.provID });
        let loggerList = [];
        logger.map((x) => loggerList.push(String(x._id)));
        const errCap = await errCapDB.aggregate([
          { $match: { loggerID: { $in: loggerList } } },
          { $addFields: { convertedLoggerID: { $toObjectId: "$loggerID" } } },
          {
            $lookup: {
              from: "loggers",
              localField: "convertedLoggerID",
              foreignField: "_id",
              as: "loggerDetails",
            },
          },
          { $unwind: "$loggerDetails" },
          {
            $addFields: {
              convertedCompID: { $toObjectId: "$loggerDetails.compID" },
            },
          },
          {
            $lookup: {
              from: "companies",
              localField: "convertedCompID",
              foreignField: "_id",
              as: "compDetails",
            },
          },
          { $unwind: "$compDetails" },
          { $sort: { _id: -1 } },
        ]);

        res.send(errCap);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "kabkot":
      try {
        const logger = await loggerDB.find({
          kabkotID: user.userRole.kabkotID,
        });
        let loggerList = [];
        logger.map((x) => loggerList.push(String(x._id)));
        console.log(loggerList);

   
        const errCap = await errCapDB.aggregate([
          { $match: { loggerID: {$in:loggerList} } },
          { $addFields: { convertedLoggerID: { $toObjectId: "$loggerID" } } },
          {
            $lookup: {
              from: "loggers",
              localField: "convertedLoggerID",
              foreignField: "_id",
              as: "loggerDetails",
            },
          },
          { $unwind: "$loggerDetails" },
          {
            $addFields: {
              convertedCompID: { $toObjectId: "$loggerDetails.compID" },
            },
          },
          {
            $lookup: {
              from: "companies",
              localField: "convertedCompID",
              foreignField: "_id",
              as: "compDetails",
            },
          },
          { $unwind: "$compDetails" },
          { $sort: { _id: -1 } },
        ]);
        console.log(errCap)
        res.send(errCap);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "comp":
      try {
        const logger = await loggerDB.find({
          compID: user.userRole.compID,
        });
        let loggerList = [];
        logger.map((x) => loggerList.push(String(x._id)));
        const errCap = await errCapDB.aggregate([
          { $match: { loggerID: { $in: loggerList } } },
          { $addFields: { convertedLoggerID: { $toObjectId: "$loggerID" } } },
          {
            $lookup: {
              from: "loggers",
              localField: "convertedLoggerID",
              foreignField: "_id",
              as: "loggerDetails",
            },
          },
          { $unwind: "$loggerDetails" },
          {
            $addFields: {
              convertedCompID: { $toObjectId: "$loggerDetails.compID" },
            },
          },
          {
            $lookup: {
              from: "companies",
              localField: "convertedCompID",
              foreignField: "_id",
              as: "compDetails",
            },
          },
          { $unwind: "$compDetails" },
          { $sort: { _id: -1 } },
        ]);

        res.send(errCap);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    default:
      break;
  }
});

module.exports = router;
