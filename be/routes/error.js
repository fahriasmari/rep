var express = require("express");
var router = express.Router();
const loggerDB = require("../model/Logger");
const companyDB = require("../model/Company");
const provDB = require("../model/Province");
const dataSensorDB = require("../model/dataSensor");
const dataHourlySensorDB = require("../model/dataHourlySensor");
const errKalibrasi = require("../model/errorKalibrasi");
const errCapDB = require("../model/errorRecap");
const errDayDB = require("../model/errorDay");
const userDB = require("../model/User");
const errorSensorDB = require("../model/errorSensor");
const moment = require("moment");
const { request } = require("http");
// var {
//   GET_ASYNC,
//   SET_ASYNC,
// } = require('../middleware/redis.js')

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
      if (listLogger) {
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
            $addFields: {
              kabkotID: { $toObjectId: "$loggerDetails.kabkotID" },
            },
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
      }
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
  if (req.params.id == undefined) {
    return;
  }
  const user = await userDB.findOne({ _id: req.params.id });
  let profile = {};
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
    profile = await companyDB.aggregate([
      {
        $match: { compName: req.query.comp },
      },
      { $addFields: { id: { $toString: "$_id" } } },
      {
        $lookup: {
          from: "users",
          localField: "id",
          foreignField: "userRole.compID",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $lookup: {
          from: "loggers",
          localField: "id",
          foreignField: "compID",
          as: "loggerDetails",
        },
      },
      {
        $unwind: "$loggerDetails",
      },
      {
        $project: {
          compName: "$compName",
          compAddres: "$compAddress",
          latlong: "$loggerDetails.latlong",
          compTlp: "$compDetails.compTlp",
          userEmail: "$userDetails.userEmail",
          compType: "$compType",
          compWasteSource: "$compWasteSource",
          compTech: "$compTech",
          compPermit: "$compPermit",
          compPermitDate: "$compPermitDate",
          compInstance: "$compInstance",
        },
      },
    ]);
    profile = profile[0];
  }
  if (req.query.start) {
    query["$and"] = [
      {
        timestamp: {
          $gte: Number(req.query.start),
          $lte: Number(req.query.end),
        },
      },
      // { timestamp: {  } },
    ];
  }

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
          {
            $addFields: {
              convertedProvID: { $toObjectId: "$loggerDetails.provID" },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          { $unwind: "$provDetails" },
          {
            $addFields: {
              convertedKabkotID: { $toObjectId: "$loggerDetails.kabkotID" },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          { $unwind: "$kabkotDetails" },
          { $match: query },
          { $sort: { _id: -1 } },
          { $limit: 1000 },
        ]);

        res.send(errCap);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "prov":
      try {
        // setting redis
        // const getResult = await GET_ASYNC(`hourlyrecap-prov${req.params.id}`);
        // if (getResult) {
        //   console.log('use redis')
        //   return res.send(JSON.parse(getResult));
        // }
        // end redis

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
          {
            $addFields: {
              convertedProvID: { $toObjectId: "$loggerDetails.provID" },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          { $unwind: "$provDetails" },
          {
            $addFields: {
              convertedKabkotID: { $toObjectId: "$loggerDetails.kabkotID" },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          { $unwind: "$kabkotDetails" },
          { $match: query },
          { $sort: { _id: -1 } },
          { $limit: 1000 },
        ]);

        res.send(errCap);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "kabkot":
      try {
        // setting redis
        // const getResult = await GET_ASYNC(`hourlyrecap-kabkot${req.params.id}`);
        // if (getResult) {
        //   console.log('use redis')
        //   return res.send(JSON.parse(getResult));
        // }
        // end redis
        const logger = await loggerDB.find({
          kabkotID: user.userRole.kabkotID,
        });
        let loggerList = [];
        logger.map((x) => loggerList.push(String(x._id)));
        // console.log(loggerList);

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
          {
            $addFields: {
              convertedProvID: { $toObjectId: "$loggerDetails.provID" },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          { $unwind: "$provDetails" },
          {
            $addFields: {
              convertedKabkotID: { $toObjectId: "$loggerDetails.kabkotID" },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          { $unwind: "$kabkotDetails" },
          { $match: query },
          { $sort: { _id: -1 } },
          { $limit: 1000 },
        ]);
        res.send(errCap);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "comp":
      try {
        // setting redis
        // const getResult = await GET_ASYNC(`hourlyrecap-comp${req.params.id}`);
        // if (getResult) {
        //   console.log('use redis')
        //   return res.send(JSON.parse(getResult));
        // }
        // end redis
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
          {
            $addFields: {
              convertedProvID: { $toObjectId: "$loggerDetails.provID" },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          { $unwind: "$provDetails" },
          {
            $addFields: {
              convertedKabkotID: { $toObjectId: "$loggerDetails.kabkotID" },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          { $unwind: "$kabkotDetails" },
          { $match: query },
          { $sort: { _id: -1 } },
          { $limit: 1000 },
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

router.get("/recap-export/:id", async (req, res) => {
  if (req.params.id == undefined) {
    return;
  }
  const user = await userDB.findOne({
    _id: req.params.id,
  });
  let profile = {};
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
    profile = await companyDB.aggregate([
      {
        $match: {
          compName: req.query.comp,
        },
      },
      {
        $addFields: {
          id: {
            $toString: "$_id",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "id",
          foreignField: "userRole.compID",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $lookup: {
          from: "loggers",
          localField: "id",
          foreignField: "compID",
          as: "loggerDetails",
        },
      },
      {
        $unwind: "$loggerDetails",
      },
      {
        $project: {
          compName: "$compName",
          compAddres: "$compAddress",
          latlong: "$loggerDetails.latlong",
          compTlp: "$compDetails.compTlp",
          userEmail: "$userDetails.userEmail",
          compType: "$compType",
          compWasteSource: "$compWasteSource",
          compTech: "$compTech",
          compPermit: "$compPermit",
          compPermitDate: "$compPermitDate",
          compInstance: "$compInstance",
        },
      },
    ]);
    profile = profile[0];
  }
  if (req.query.start) {
    query["$and"] = [
      {
        timestamp: {
          $gte: Number(req.query.start),
          $lte: Number(req.query.end),
        },
      },
      // { timestamp: {  } },
    ];
  }

  let errCap;
  switch (user.userRole.role) {
    case "admin":
      try {
        errCap = await errCapDB.aggregate([
          {
            $addFields: {
              convertedLoggerID: {
                $toObjectId: "$loggerID",
              },
            },
          },

          {
            $lookup: {
              from: "loggers",
              localField: "convertedLoggerID",
              foreignField: "_id",
              as: "loggerDetails",
            },
          },
          {
            $unwind: "$loggerDetails",
          },

          {
            $addFields: {
              convertedCompID: {
                $toObjectId: "$loggerDetails.compID",
              },
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
          {
            $unwind: "$compDetails",
          },
          {
            $addFields: {
              convertedProvID: {
                $toObjectId: "$loggerDetails.provID",
              },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          {
            $unwind: "$provDetails",
          },
          {
            $addFields: {
              convertedKabkotID: {
                $toObjectId: "$loggerDetails.kabkotID",
              },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          {
            $unwind: "$kabkotDetails",
          },
          {
            $match: query,
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $limit: 1000,
          },
        ]);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "prov":
      try {
        // setting redis
        // const getResult = await GET_ASYNC(`hourlyrecap-prov${req.params.id}`);
        // if (getResult) {
        //   console.log('use redis')
        //   return res.send(JSON.parse(getResult));
        // }
        // end redis

        const logger = await loggerDB.find({
          provID: user.userRole.provID,
        });
        let loggerList = [];
        logger.map((x) => loggerList.push(String(x._id)));
        errCap = await errCapDB.aggregate([
          {
            $match: {
              loggerID: {
                $in: loggerList,
              },
            },
          },
          {
            $addFields: {
              convertedLoggerID: {
                $toObjectId: "$loggerID",
              },
            },
          },
          {
            $lookup: {
              from: "loggers",
              localField: "convertedLoggerID",
              foreignField: "_id",
              as: "loggerDetails",
            },
          },
          {
            $unwind: "$loggerDetails",
          },
          {
            $addFields: {
              convertedCompID: {
                $toObjectId: "$loggerDetails.compID",
              },
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
          {
            $unwind: "$compDetails",
          },
          {
            $addFields: {
              convertedProvID: {
                $toObjectId: "$loggerDetails.provID",
              },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          {
            $unwind: "$provDetails",
          },
          {
            $addFields: {
              convertedKabkotID: {
                $toObjectId: "$loggerDetails.kabkotID",
              },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          {
            $unwind: "$kabkotDetails",
          },
          {
            $match: query,
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $limit: 1000,
          },
        ]);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "kabkot":
      try {
        // setting redis
        // const getResult = await GET_ASYNC(`hourlyrecap-kabkot${req.params.id}`);
        // if (getResult) {
        //   console.log('use redis')
        //   return res.send(JSON.parse(getResult));
        // }
        // end redis
        const logger = await loggerDB.find({
          kabkotID: user.userRole.kabkotID,
        });
        let loggerList = [];
        logger.map((x) => loggerList.push(String(x._id)));
        // console.log(loggerList);

        errCap = await errCapDB.aggregate([
          {
            $match: {
              loggerID: {
                $in: loggerList,
              },
            },
          },
          {
            $addFields: {
              convertedLoggerID: {
                $toObjectId: "$loggerID",
              },
            },
          },
          {
            $lookup: {
              from: "loggers",
              localField: "convertedLoggerID",
              foreignField: "_id",
              as: "loggerDetails",
            },
          },
          {
            $unwind: "$loggerDetails",
          },
          {
            $addFields: {
              convertedCompID: {
                $toObjectId: "$loggerDetails.compID",
              },
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
          {
            $unwind: "$compDetails",
          },
          {
            $addFields: {
              convertedProvID: {
                $toObjectId: "$loggerDetails.provID",
              },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          {
            $unwind: "$provDetails",
          },
          {
            $addFields: {
              convertedKabkotID: {
                $toObjectId: "$loggerDetails.kabkotID",
              },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          {
            $unwind: "$kabkotDetails",
          },
          {
            $match: query,
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $limit: 1000,
          },
        ]);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "comp":
      try {
        // setting redis
        // const getResult = await GET_ASYNC(`hourlyrecap-comp${req.params.id}`);
        // if (getResult) {
        //   console.log('use redis')
        //   return res.send(JSON.parse(getResult));
        // }
        // end redis
        const logger = await loggerDB.find({
          compID: user.userRole.compID,
        });
        let loggerList = [];
        logger.map((x) => loggerList.push(String(x._id)));
        errCap = await errCapDB.aggregate([
          {
            $match: {
              loggerID: {
                $in: loggerList,
              },
            },
          },
          {
            $addFields: {
              convertedLoggerID: {
                $toObjectId: "$loggerID",
              },
            },
          },
          {
            $lookup: {
              from: "loggers",
              localField: "convertedLoggerID",
              foreignField: "_id",
              as: "loggerDetails",
            },
          },
          {
            $unwind: "$loggerDetails",
          },
          {
            $addFields: {
              convertedCompID: {
                $toObjectId: "$loggerDetails.compID",
              },
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
          {
            $unwind: "$compDetails",
          },
          {
            $addFields: {
              convertedProvID: {
                $toObjectId: "$loggerDetails.provID",
              },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          {
            $unwind: "$provDetails",
          },
          {
            $addFields: {
              convertedKabkotID: {
                $toObjectId: "$loggerDetails.kabkotID",
              },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          {
            $unwind: "$kabkotDetails",
          },
          {
            $match: query,
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $limit: 1000,
          },
        ]);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    default:
      break;
  }

  var wb = new xl.Workbook();
  var ws = wb.addWorksheet("Early Warning Perjam");

  let col = 1;
  ws.cell(col, 1).string("Nama Industri");
  ws.cell(col, 2).string("Jenis Industri");
  ws.cell(col, 3).string("Provinsi");
  ws.cell(col, 4).string("Kab/Kot");
  ws.cell(col, 5).string("Waktu");
  ws.cell(col, 6).string("Keterangan");

  let dt;
  for (let i = 0; i < errCap.length; i++) {
    col++;
    dt = new Date(errCap[i].timestamp * 1000);
    ws.cell(col, 1).string(errCap[i].compDetails.compName);
    ws.cell(col, 2).string(errCap[i].compDetails.compType);
    ws.cell(col, 3).string(errCap[i].provDetails.provName);
    ws.cell(col, 4).string(errCap[i].kabkotDetails.kabkotName);
    ws.cell(col, 5).string(dt.toString());
    ws.cell(col, 6).string(errCap[i].errSUM);
  }

  wb.write(`List Laporan Data Perjam.xlsx`, res);
});

router.get("/recapDay/:id", async (req, res) => {
  if (req.params.id == undefined) {
    return;
  }
  const user = await userDB.findOne({ _id: req.params.id });
  let profile = {};
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
    profile = await companyDB.aggregate([
      {
        $match: { compName: req.query.comp },
      },
      { $addFields: { id: { $toString: "$_id" } } },
      {
        $lookup: {
          from: "users",
          localField: "id",
          foreignField: "userRole.compID",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $lookup: {
          from: "loggers",
          localField: "id",
          foreignField: "compID",
          as: "loggerDetails",
        },
      },
      {
        $unwind: "$loggerDetails",
      },
      {
        $project: {
          compName: "$compName",
          compAddres: "$compAddress",
          latlong: "$loggerDetails.latlong",
          compTlp: "$compDetails.compTlp",
          userEmail: "$userDetails.userEmail",
          compType: "$compType",
          compWasteSource: "$compWasteSource",
          compTech: "$compTech",
          compPermit: "$compPermit",
          compPermitDate: "$compPermitDate",
          compInstance: "$compInstance",
        },
      },
    ]);
    profile = profile[0];
  }
  if (req.query.start) {
    query["$and"] = [
      {
        timestamp: {
          $gte: Number(req.query.start),
          $lte: Number(req.query.end),
        },
      },
      // { timestamp: {  } },
    ];
  }

  switch (user.userRole.role) {
    case "admin":
      try {
        const errDay = await errDayDB.aggregate([
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
          {
            $addFields: {
              convertedProvID: { $toObjectId: "$loggerDetails.provID" },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          { $unwind: "$provDetails" },
          {
            $addFields: {
              convertedKabkotID: { $toObjectId: "$loggerDetails.kabkotID" },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          { $unwind: "$kabkotDetails" },
          { $match: query },
          { $sort: { _id: -1 } },
          { $limit: 1000 },
        ]);

        res.send(errDay);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "prov":
      try {
        // setting redis
        // const getResult = await GET_ASYNC(`hourlyrecap-prov${req.params.id}`);
        // if (getResult) {
        //   console.log('use redis')
        //   return res.send(JSON.parse(getResult));
        // }
        // end redis

        const logger = await loggerDB.find({ provID: user.userRole.provID });
        let loggerList = [];
        logger.map((x) => loggerList.push(String(x._id)));
        const errDay = await errDayDB.aggregate([
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
          {
            $addFields: {
              convertedProvID: { $toObjectId: "$loggerDetails.provID" },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          { $unwind: "$provDetails" },
          {
            $addFields: {
              convertedKabkotID: { $toObjectId: "$loggerDetails.kabkotID" },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          { $unwind: "$kabkotDetails" },
          { $match: query },
          { $sort: { _id: -1 } },
          { $limit: 1000 },
        ]);

        res.send(errDay);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "kabkot":
      try {
        // setting redis
        // const getResult = await GET_ASYNC(`hourlyrecap-kabkot${req.params.id}`);
        // if (getResult) {
        //   console.log('use redis')
        //   return res.send(JSON.parse(getResult));
        // }
        // end redis
        const logger = await loggerDB.find({
          kabkotID: user.userRole.kabkotID,
        });
        let loggerList = [];
        logger.map((x) => loggerList.push(String(x._id)));
        // console.log(loggerList);

        const errDay = await errDayDB.aggregate([
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
          {
            $addFields: {
              convertedProvID: { $toObjectId: "$loggerDetails.provID" },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          { $unwind: "$provDetails" },
          {
            $addFields: {
              convertedKabkotID: { $toObjectId: "$loggerDetails.kabkotID" },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          { $unwind: "$kabkotDetails" },
          { $match: query },
          { $sort: { _id: -1 } },
          { $limit: 1000 },
        ]);
        res.send(errDay);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "comp":
      try {
        // setting redis
        // const getResult = await GET_ASYNC(`hourlyrecap-comp${req.params.id}`);
        // if (getResult) {
        //   console.log('use redis')
        //   return res.send(JSON.parse(getResult));
        // }
        // end redis
        const logger = await loggerDB.find({
          compID: user.userRole.compID,
        });
        let loggerList = [];
        logger.map((x) => loggerList.push(String(x._id)));
        const errDay = await errDayDB.aggregate([
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
          {
            $addFields: {
              convertedProvID: { $toObjectId: "$loggerDetails.provID" },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          { $unwind: "$provDetails" },
          {
            $addFields: {
              convertedKabkotID: { $toObjectId: "$loggerDetails.kabkotID" },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          { $unwind: "$kabkotDetails" },
          { $match: query },
          { $sort: { _id: -1 } },
          { $limit: 1000 },
        ]);

        res.send(errDay);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    default:
      break;
  }
});

router.get("/recapDay-export/:id", async (req, res) => {
  if (req.params.id == undefined) {
    return;
  }
  const user = await userDB.findOne({
    _id: req.params.id,
  });
  let profile = {};
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
    profile = await companyDB.aggregate([
      {
        $match: {
          compName: req.query.comp,
        },
      },
      {
        $addFields: {
          id: {
            $toString: "$_id",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "id",
          foreignField: "userRole.compID",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $lookup: {
          from: "loggers",
          localField: "id",
          foreignField: "compID",
          as: "loggerDetails",
        },
      },
      {
        $unwind: "$loggerDetails",
      },
      {
        $project: {
          compName: "$compName",
          compAddres: "$compAddress",
          latlong: "$loggerDetails.latlong",
          compTlp: "$compDetails.compTlp",
          userEmail: "$userDetails.userEmail",
          compType: "$compType",
          compWasteSource: "$compWasteSource",
          compTech: "$compTech",
          compPermit: "$compPermit",
          compPermitDate: "$compPermitDate",
          compInstance: "$compInstance",
        },
      },
    ]);
    profile = profile[0];
  }
  if (req.query.start) {
    query["$and"] = [
      {
        timestamp: {
          $gte: Number(req.query.start),
          $lte: Number(req.query.end),
        },
      },
      // { timestamp: {  } },
    ];
  }

  let errDay;

  switch (user.userRole.role) {
    case "admin":
      try {
        errDay = await errDayDB.aggregate([
          {
            $addFields: {
              convertedLoggerID: {
                $toObjectId: "$loggerID",
              },
            },
          },

          {
            $lookup: {
              from: "loggers",
              localField: "convertedLoggerID",
              foreignField: "_id",
              as: "loggerDetails",
            },
          },
          {
            $unwind: "$loggerDetails",
          },

          {
            $addFields: {
              convertedCompID: {
                $toObjectId: "$loggerDetails.compID",
              },
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
          {
            $unwind: "$compDetails",
          },
          {
            $addFields: {
              convertedProvID: {
                $toObjectId: "$loggerDetails.provID",
              },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          {
            $unwind: "$provDetails",
          },
          {
            $addFields: {
              convertedKabkotID: {
                $toObjectId: "$loggerDetails.kabkotID",
              },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          {
            $unwind: "$kabkotDetails",
          },
          {
            $match: query,
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $limit: 1000,
          },
        ]);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "prov":
      try {
        // setting redis
        // const getResult = await GET_ASYNC(`hourlyrecap-prov${req.params.id}`);
        // if (getResult) {
        //   console.log('use redis')
        //   return res.send(JSON.parse(getResult));
        // }
        // end redis

        const logger = await loggerDB.find({
          provID: user.userRole.provID,
        });
        let loggerList = [];
        logger.map((x) => loggerList.push(String(x._id)));
        errDay = await errDayDB.aggregate([
          {
            $match: {
              loggerID: {
                $in: loggerList,
              },
            },
          },
          {
            $addFields: {
              convertedLoggerID: {
                $toObjectId: "$loggerID",
              },
            },
          },
          {
            $lookup: {
              from: "loggers",
              localField: "convertedLoggerID",
              foreignField: "_id",
              as: "loggerDetails",
            },
          },
          {
            $unwind: "$loggerDetails",
          },
          {
            $addFields: {
              convertedCompID: {
                $toObjectId: "$loggerDetails.compID",
              },
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
          {
            $unwind: "$compDetails",
          },
          {
            $addFields: {
              convertedProvID: {
                $toObjectId: "$loggerDetails.provID",
              },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          {
            $unwind: "$provDetails",
          },
          {
            $addFields: {
              convertedKabkotID: {
                $toObjectId: "$loggerDetails.kabkotID",
              },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          {
            $unwind: "$kabkotDetails",
          },
          {
            $match: query,
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $limit: 1000,
          },
        ]);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "kabkot":
      try {
        // setting redis
        // const getResult = await GET_ASYNC(`hourlyrecap-kabkot${req.params.id}`);
        // if (getResult) {
        //   console.log('use redis')
        //   return res.send(JSON.parse(getResult));
        // }
        // end redis
        const logger = await loggerDB.find({
          kabkotID: user.userRole.kabkotID,
        });
        let loggerList = [];
        logger.map((x) => loggerList.push(String(x._id)));
        // console.log(loggerList);

        errDay = await errDayDB.aggregate([
          {
            $match: {
              loggerID: {
                $in: loggerList,
              },
            },
          },
          {
            $addFields: {
              convertedLoggerID: {
                $toObjectId: "$loggerID",
              },
            },
          },
          {
            $lookup: {
              from: "loggers",
              localField: "convertedLoggerID",
              foreignField: "_id",
              as: "loggerDetails",
            },
          },
          {
            $unwind: "$loggerDetails",
          },
          {
            $addFields: {
              convertedCompID: {
                $toObjectId: "$loggerDetails.compID",
              },
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
          {
            $unwind: "$compDetails",
          },
          {
            $addFields: {
              convertedProvID: {
                $toObjectId: "$loggerDetails.provID",
              },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          {
            $unwind: "$provDetails",
          },
          {
            $addFields: {
              convertedKabkotID: {
                $toObjectId: "$loggerDetails.kabkotID",
              },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          {
            $unwind: "$kabkotDetails",
          },
          {
            $match: query,
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $limit: 1000,
          },
        ]);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "comp":
      try {
        // setting redis
        // const getResult = await GET_ASYNC(`hourlyrecap-comp${req.params.id}`);
        // if (getResult) {
        //   console.log('use redis')
        //   return res.send(JSON.parse(getResult));
        // }
        // end redis
        const logger = await loggerDB.find({
          compID: user.userRole.compID,
        });
        let loggerList = [];
        logger.map((x) => loggerList.push(String(x._id)));
        errDay = await errDayDB.aggregate([
          {
            $match: {
              loggerID: {
                $in: loggerList,
              },
            },
          },
          {
            $addFields: {
              convertedLoggerID: {
                $toObjectId: "$loggerID",
              },
            },
          },
          {
            $lookup: {
              from: "loggers",
              localField: "convertedLoggerID",
              foreignField: "_id",
              as: "loggerDetails",
            },
          },
          {
            $unwind: "$loggerDetails",
          },
          {
            $addFields: {
              convertedCompID: {
                $toObjectId: "$loggerDetails.compID",
              },
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
          {
            $unwind: "$compDetails",
          },
          {
            $addFields: {
              convertedProvID: {
                $toObjectId: "$loggerDetails.provID",
              },
            },
          },
          {
            $lookup: {
              from: "provdbs",
              localField: "convertedProvID",
              foreignField: "_id",
              as: "provDetails",
            },
          },
          {
            $unwind: "$provDetails",
          },
          {
            $addFields: {
              convertedKabkotID: {
                $toObjectId: "$loggerDetails.kabkotID",
              },
            },
          },
          {
            $lookup: {
              from: "kabkotdbs",
              localField: "convertedKabkotID",
              foreignField: "_id",
              as: "kabkotDetails",
            },
          },
          {
            $unwind: "$kabkotDetails",
          },
          {
            $match: query,
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $limit: 1000,
          },
        ]);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    default:
      break;
  }

  var wb = new xl.Workbook();
  var ws = wb.addWorksheet("Early Warning Harian");

  let col = 1;
  ws.cell(col, 1).string("Nama Industri");
  ws.cell(col, 2).string("Jenis Industri");
  ws.cell(col, 3).string("Provinsi");
  ws.cell(col, 4).string("Kab/Kot");
  ws.cell(col, 5).string("Waktu");
  ws.cell(col, 6).string("Keterangan");

  let dt;
  for (let i = 0; i < errCap.length; i++) {
    col++;
    dt = new Date(errCap[i].timestamp * 1000);
    ws.cell(col, 1).string(errCap[i].compDetails.compName);
    ws.cell(col, 2).string(errCap[i].compDetails.compType);
    ws.cell(col, 3).string(errCap[i].provDetails.provName);
    ws.cell(col, 4).string(errCap[i].kabkotDetails.kabkotName);
    ws.cell(col, 5).string(dt.toString());
    ws.cell(col, 6).string(errCap[i].errSUM);
  }

  wb.write(`List Laporan Data Harian.xlsx`, res);
});

router.get("/kalibrasi/:id", async (req, res) => {
  const user = await userDB.findOne({ _id: req.params.id });
  if (!user) {
    return res.send({ success: false, message: "User tidak diketahui" });
  }
  if (user.userRole.role != "comp") {
    return res.send({ success: false, message: "Hanya untuk Company" });
  }

  const logger = await loggerDB.findOne({
    compID: user.userRole.compID,
  });
  if (!logger) {
    return res.send({ success: false, message: "Logger tidak diketahui" });
  }
  const kalibrasi = await errKalibrasi.aggregate([
    {
      $match: {
        $and: [{ loggerID: logger._id.toString() }, { status: false }],
      },
    },
  ]);
  return res.send(kalibrasi);
});
// router.get("/recap/:id", async (req, res) => {
//   if (req.params.id == undefined) { return }
//   const user = await userDB.findOne({ _id: req.params.id });

//   switch (user.userRole.role) {
//     case "admin":
//       try {
//         // setting redis
//         // const getResult = await GET_ASYNC(`hourlyrecap-admin${req.params.id}`);
//         // if (getResult) {
//         //   console.log('use redis')
//         //   return res.send(JSON.parse(getResult));
//         // }
//         // end redis
//         const errCap = await errCapDB.aggregate([
//           { $addFields: { convertedLoggerID: { $toObjectId: "$loggerID" } } },

//           {
//             $lookup: {
//               from: "loggers",
//               localField: "convertedLoggerID",
//               foreignField: "_id",
//               as: "loggerDetails",
//             },
//           },
//           { $unwind: "$loggerDetails" },

//           {
//             $addFields: {
//               convertedCompID: { $toObjectId: "$loggerDetails.compID" },
//             },
//           },
//           {
//             $lookup: {
//               from: "companies",
//               localField: "convertedCompID",
//               foreignField: "_id",
//               as: "compDetails",
//             },
//           },
//           { $unwind: "$compDetails" },
//           {
//             $addFields: {
//               convertedProvID: { $toObjectId: "$loggerDetails.provID" },
//             },
//           },
//           {
//             $lookup: {
//               from: "provdbs",
//               localField: "convertedProvID",
//               foreignField: "_id",
//               as: "provDetails",
//             },
//           },
//           { $unwind: "$provDetails" },
//           {
//             $addFields: {
//               convertedKabkotID: { $toObjectId: "$loggerDetails.kabkotID" },
//             },
//           },
//           {
//             $lookup: {
//               from: "kabkotdbs",
//               localField: "convertedKabkotID",
//               foreignField: "_id",
//               as: "kabkotDetails",
//             },
//           },
//           { $unwind: "$kabkotDetails" },
//           { $sort: { _id: -1 } },
//           { $limit: 1000 }
//         ]);
//         // const saveResult = await SET_ASYNC(`hourlyrecap-admin${req.params.id}`, 10, JSON.stringify(
//         //   errCap))

//         res.send(errCap);
//       } catch (error) {
//         res.status(400).send(error);
//       }
//       break;
//     case "prov":
//       try {
//         // setting redis
//         // const getResult = await GET_ASYNC(`hourlyrecap-prov${req.params.id}`);
//         // if (getResult) {
//         //   console.log('use redis')
//         //   return res.send(JSON.parse(getResult));
//         // }
//         // end redis

//         const logger = await loggerDB.find({ provID: user.userRole.provID });
//         let loggerList = [];
//         logger.map((x) => loggerList.push(String(x._id)));
//         const errCap = await errCapDB.aggregate([
//           { $match: { loggerID: { $in: loggerList } } },
//           { $addFields: { convertedLoggerID: { $toObjectId: "$loggerID" } } },
//           {
//             $lookup: {
//               from: "loggers",
//               localField: "convertedLoggerID",
//               foreignField: "_id",
//               as: "loggerDetails",
//             },
//           },
//           { $unwind: "$loggerDetails" },
//           {
//             $addFields: {
//               convertedCompID: { $toObjectId: "$loggerDetails.compID" },
//             },
//           },
//           {
//             $lookup: {
//               from: "companies",
//               localField: "convertedCompID",
//               foreignField: "_id",
//               as: "compDetails",
//             },
//           },
//           { $unwind: "$compDetails" },
//           {
//             $addFields: {
//               convertedProvID: { $toObjectId: "$loggerDetails.provID" },
//             },
//           },
//           {
//             $lookup: {
//               from: "provdbs",
//               localField: "convertedProvID",
//               foreignField: "_id",
//               as: "provDetails",
//             },
//           },
//           { $unwind: "$provDetails" },
//           {
//             $addFields: {
//               convertedKabkotID: { $toObjectId: "$loggerDetails.kabkotID" },
//             },
//           },
//           {
//             $lookup: {
//               from: "kabkotdbs",
//               localField: "convertedKabkotID",
//               foreignField: "_id",
//               as: "kabkotDetails",
//             },
//           },
//           { $unwind: "$kabkotDetails" },
//           { $sort: { _id: -1 } },
//           { $limit: 1000 }
//         ]);
//         // const saveResult = await SET_ASYNC(`hourlyrecap-prov${req.params.id}`, 20, JSON.stringify(
//         //   errCap))

//         res.send(errCap);
//       } catch (error) {
//         res.status(400).send(error);
//       }
//       break;
//     case "kabkot":
//       try {
//         // setting redis
//         // const getResult = await GET_ASYNC(`hourlyrecap-kabkot${req.params.id}`);
//         // if (getResult) {
//         //   console.log('use redis')
//         //   return res.send(JSON.parse(getResult));
//         // }
//         // end redis
//         const logger = await loggerDB.find({
//           kabkotID: user.userRole.kabkotID,
//         });
//         let loggerList = [];
//         logger.map((x) => loggerList.push(String(x._id)));
//         console.log(loggerList);

//         const errCap = await errCapDB.aggregate([
//           { $match: { loggerID: { $in: loggerList } } },
//           { $addFields: { convertedLoggerID: { $toObjectId: "$loggerID" } } },
//           {
//             $lookup: {
//               from: "loggers",
//               localField: "convertedLoggerID",
//               foreignField: "_id",
//               as: "loggerDetails",
//             },
//           },
//           { $unwind: "$loggerDetails" },
//           {
//             $addFields: {
//               convertedCompID: { $toObjectId: "$loggerDetails.compID" },
//             },
//           },
//           {
//             $lookup: {
//               from: "companies",
//               localField: "convertedCompID",
//               foreignField: "_id",
//               as: "compDetails",
//             },
//           },
//           { $unwind: "$compDetails" },
//           {
//             $addFields: {
//               convertedProvID: { $toObjectId: "$loggerDetails.provID" },
//             },
//           },
//           {
//             $lookup: {
//               from: "provdbs",
//               localField: "convertedProvID",
//               foreignField: "_id",
//               as: "provDetails",
//             },
//           },
//           { $unwind: "$provDetails" },
//           {
//             $addFields: {
//               convertedKabkotID: { $toObjectId: "$loggerDetails.kabkotID" },
//             },
//           },
//           {
//             $lookup: {
//               from: "kabkotdbs",
//               localField: "convertedKabkotID",
//               foreignField: "_id",
//               as: "kabkotDetails",
//             },
//           },
//           { $unwind: "$kabkotDetails" },
//           { $sort: { _id: -1 } },
//           { $limit: 1000 }
//         ]);
//         // const saveResult = await SET_ASYNC(`hourlyrecap-kabkot${req.params.id}`, 20, JSON.stringify(
//         //   errCap))
//         res.send(errCap);
//       } catch (error) {
//         res.status(400).send(error);
//       }
//       break;
//     case "comp":
//       try {
//         // setting redis
//         // const getResult = await GET_ASYNC(`hourlyrecap-comp${req.params.id}`);
//         // if (getResult) {
//         //   console.log('use redis')
//         //   return res.send(JSON.parse(getResult));
//         // }
//         // end redis
//         const logger = await loggerDB.find({
//           compID: user.userRole.compID,
//         });
//         let loggerList = [];
//         logger.map((x) => loggerList.push(String(x._id)));
//         const errCap = await errCapDB.aggregate([
//           { $match: { loggerID: { $in: loggerList } } },
//           { $addFields: { convertedLoggerID: { $toObjectId: "$loggerID" } } },
//           {
//             $lookup: {
//               from: "loggers",
//               localField: "convertedLoggerID",
//               foreignField: "_id",
//               as: "loggerDetails",
//             },
//           },
//           { $unwind: "$loggerDetails" },
//           {
//             $addFields: {
//               convertedCompID: { $toObjectId: "$loggerDetails.compID" },
//             },
//           },
//           {
//             $lookup: {
//               from: "companies",
//               localField: "convertedCompID",
//               foreignField: "_id",
//               as: "compDetails",
//             },
//           },
//           { $unwind: "$compDetails" },
//           {
//             $addFields: {
//               convertedProvID: { $toObjectId: "$loggerDetails.provID" },
//             },
//           },
//           {
//             $lookup: {
//               from: "provdbs",
//               localField: "convertedProvID",
//               foreignField: "_id",
//               as: "provDetails",
//             },
//           },
//           { $unwind: "$provDetails" },
//           {
//             $addFields: {
//               convertedKabkotID: { $toObjectId: "$loggerDetails.kabkotID" },
//             },
//           },
//           {
//             $lookup: {
//               from: "kabkotdbs",
//               localField: "convertedKabkotID",
//               foreignField: "_id",
//               as: "kabkotDetails",
//             },
//           },
//           { $unwind: "$kabkotDetails" },
//           { $sort: { _id: -1 } },
//           { $limit: 1000 }
//         ]);
//         // const saveResult = await SET_ASYNC(`hourlyrecap-comp${req.params.id}`, 20, JSON.stringify(
//         //   errCap))
//         res.send(errCap);
//       } catch (error) {
//         res.status(400).send(error);
//       }
//       break;
//     default:
//       break;
//   }
// });

module.exports = router;
