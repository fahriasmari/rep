var express = require("express");
var router = express.Router();
var { percentageConvert } = require("../function/helper");
const dataHourlySensorDB = require("../model/dataHourlySensor");
const dataDaySensorDB = require("../model/dataDaySensor");
const dataMonthSensorDB = require("../model/dataMonthSensor");
const dataSensorDB = require("../model/dataSensor");
const userDB = require("../model/User");
const regiscompDB = require("../model/formRegisComp");
const regiscovidDB = require("../model/Covid");
const provDB = require("../model/Province");
const kabkotDB = require("../model/Kabkot");
const companyDB = require("../model/Company");
const loggerDB = require("../model/Logger");
const { laporanExportService } = require("../services/export");
const moment = require("moment");
let xl = require("excel4node");
const formRegisDB = require("../model/formRegisComp");
const covidDB = require("../model/Covid");

/* GET home page. */
router.get("/list-new/:id", async (req, res) => {
  const user = await userDB.findOne({ _id: req.params.id });
  let list;
  if (req.query.type) {
    switch (req.query.type) {
      case "kabkot":
        const prov = await provDB.findOne({ provName: req.query.name });
        if (!prov) return res.status(400).send("Filter Error");
        list = await kabkotDB.aggregate([
          { $match: { provID: String(prov._id) } },
          {
            $project: {
              name: "$kabkotName",
              value: "$kabkotName",
              provID: "$provID",
            },
          },
        ]);
        break;
      case "comp":
        const kabkot = await kabkotDB.findOne({ kabkotName: req.query.name });
        if (!kabkot) return res.status(400).send("Filter Error");
        list = await loggerDB.aggregate([
          { $match: { kabkotID: String(kabkot._id) } },
          {
            $project: {
              provID: "$provID",
              kabkotID: "$kabkotID",
              compID: { $toObjectId: "$compID" },
            },
          },
          {
            $lookup: {
              from: "companies",
              localField: "compID",
              foreignField: "_id",
              as: "companyDetails",
            },
          },
          { $unwind: "$companyDetails" },
          {
            $project: {
              provID: "$provID",
              kabkotID: "$kabkotID",
              compID: "$companyDetails._id",
              name: "$companyDetails.compName",
              value: "$companyDetails.compName",
            },
          },
        ]);
        break;

      default:
        break;
    }
    return res.send(list);
  }

  switch (user.userRole.role) {
    case "admin":
      list = await provDB.aggregate([
        {
          $project: {
            name: "$provName",
            value: "$provName",
          },
        },
      ]);
      // kabkotList = await kabkotDB.aggregate([
      //   {
      //     $project: {
      //       name: "$kabkotName",
      //       value: "$kabkotName",
      //       provID: "$provID",
      //     },
      //   },
      // ]);
      // compList = await loggerDB.aggregate([
      //   {
      //     $project: {
      //       provID: "$provID",
      //       kabkotID: "$kabkotID",
      //       compID: { $toObjectId: "$compID" },
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "companies",
      //       localField: "compID",
      //       foreignField: "_id",
      //       as: "companyDetails",
      //     },
      //   },
      //   { $unwind: "$companyDetails" },
      //   {
      //     $project: {
      //       provID: "$provID",
      //       kabkotID: "$kabkotID",
      //       compID: "$companyDetails._id",
      //       name: "$companyDetails.compName",
      //       value: "$companyDetails.compName",
      //     },
      //   },
      // ]);
      break;
    case "prov":
      // provList = [];
      list = await kabkotDB.aggregate([
        { $match: { provID: user.userRole.provID } },
        {
          $project: {
            name: "$kabkotName",
            value: "$kabkotName",
            provID: "$provID",
          },
        },
      ]);
      // compList = await loggerDB.aggregate([
      //   { $match: { provID: user.userRole.provID } },
      //   {
      //     $project: {
      //       provID: "$provID",
      //       kabkotID: "$kabkotID",
      //       compID: { $toObjectId: "$compID" },
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "companies",
      //       localField: "compID",
      //       foreignField: "_id",
      //       as: "companyDetails",
      //     },
      //   },
      //   { $unwind: "$companyDetails" },
      //   {
      //     $project: {
      //       provID: "$provID",
      //       kabkotID: "$kabkotID",
      //       compID: "$companyDetails._id",
      //       name: "$companyDetails.compName",
      //       value: "$companyDetails.compName",
      //     },
      //   },
      // ]);
      break;
    case "kabkot":
      // provList = [];
      // kabkotList = [];
      list = await loggerDB.aggregate([
        { $match: { kabkotID: user.userRole.kabkotID } },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: { $toObjectId: "$compID" },
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "companyDetails",
          },
        },
        { $unwind: "$companyDetails" },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: "$companyDetails._id",
            name: "$companyDetails.compName",
            value: "$companyDetails.compName",
          },
        },
      ]);
      break;
    case "comp":
      provList = [];
      kabkotList = [];
      compList = [];
      break;
    default:
      break;
  }
  res.send(list);
});

router.get("/list/:id", async (req, res) => {
  const user = await userDB.findOne({ _id: req.params.id });
  let provList, kabkotList, compList;
  switch (user.userRole.role) {
    case "admin":
      provList = await provDB.aggregate([
        {
          $project: {
            name: "$provName",
            value: "$provName",
          },
        },
      ]);
      kabkotList = await kabkotDB.aggregate([
        {
          $project: {
            name: "$kabkotName",
            value: "$kabkotName",
            provID: "$provID",
          },
        },
      ]);
      compList = await loggerDB.aggregate([
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: { $toObjectId: "$compID" },
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "companyDetails",
          },
        },
        { $unwind: "$companyDetails" },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: "$companyDetails._id",
            name: "$companyDetails.compName",
            value: "$companyDetails.compName",
          },
        },
      ]);
      break;
    case "prov":
      provList = [];
      kabkotList = await kabkotDB.aggregate([
        { $match: { provID: user.userRole.provID } },
        {
          $project: {
            name: "$kabkotName",
            value: "$kabkotName",
            provID: "$provID",
          },
        },
      ]);
      compList = await loggerDB.aggregate([
        { $match: { provID: user.userRole.provID } },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: { $toObjectId: "$compID" },
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "companyDetails",
          },
        },
        { $unwind: "$companyDetails" },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: "$companyDetails._id",
            name: "$companyDetails.compName",
            value: "$companyDetails.compName",
          },
        },
      ]);
      break;
    case "kabkot":
      provList = [];
      kabkotList = [];
      compList = await loggerDB.aggregate([
        { $match: { kabkotID: user.userRole.kabkotID } },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: { $toObjectId: "$compID" },
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "companyDetails",
          },
        },
        { $unwind: "$companyDetails" },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: "$companyDetails._id",
            name: "$companyDetails.compName",
            value: "$companyDetails.compName",
          },
        },
      ]);
      break;
    case "comp":
      provList = [];
      kabkotList = [];
      compList = [];
      break;
    default:
      break;
  }
  res.send({ provList, kabkotList, compList });
});

router.get("/list-regiscomp/:id", async (req, res) => {
  const user = await userDB.findOne({ _id: req.params.id });
  let provList, kabkotList, compList;
  switch (user.userRole.role) {
    case "admin":
      provList = await provDB.aggregate([
        {
          $project: {
            name: "$provName",
            value: "$provName",
          },
        },
      ]);
      kabkotList = await kabkotDB.aggregate([
        {
          $project: {
            name: "$kabkotName",
            value: "$kabkotName",
            provID: "$provID",
          },
        },
      ]);
      compList = await loggerDB.aggregate([
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: { $toObjectId: "$compID" },
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "companyDetails",
          },
        },
        { $unwind: "$companyDetails" },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: "$companyDetails._id",
            name: "$companyDetails.compName",
            value: "$companyDetails.compName",
          },
        },
      ]);
      break;
    case "prov":
      provList = [];
      kabkotList = await kabkotDB.aggregate([
        { $match: { provID: user.userRole.provID } },
        {
          $project: {
            name: "$kabkotName",
            value: "$kabkotName",
            provID: "$provID",
          },
        },
      ]);
      compList = await loggerDB.aggregate([
        { $match: { provID: user.userRole.provID } },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: { $toObjectId: "$compID" },
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "companyDetails",
          },
        },
        { $unwind: "$companyDetails" },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: "$companyDetails._id",
            name: "$companyDetails.compName",
            value: "$companyDetails.compName",
          },
        },
      ]);
      break;
    case "kabkot":
      provList = [];
      kabkotList = [];
      compList = await loggerDB.aggregate([
        { $match: { kabkotID: user.userRole.kabkotID } },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: { $toObjectId: "$compID" },
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "companyDetails",
          },
        },
        { $unwind: "$companyDetails" },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: "$companyDetails._id",
            name: "$companyDetails.compName",
            value: "$companyDetails.compName",
          },
        },
      ]);
      break;
    case "comp":
      provList = [];
      kabkotList = [];
      compList = [];
      break;
    default:
      break;
  }
  // const regisComp = await regiscompDB.findOne({},{"umum.compName":1});
  const regisComp = await regiscompDB.find({}, { "umum.compName": 1 });

  res.send({ provList, kabkotList, compList, regiscomp: regisComp });
});

router.get("/list-regiscovid/:id", async (req, res) => {
  const user = await userDB.findOne({ _id: req.params.id });
  let provList, kabkotList, compList;
  switch (user.userRole.role) {
    case "admin":
      provList = await provDB.aggregate([
        {
          $project: {
            name: "$provName",
            value: "$provName",
          },
        },
      ]);
      kabkotList = await kabkotDB.aggregate([
        {
          $project: {
            name: "$kabkotName",
            value: "$kabkotName",
            provID: "$provID",
          },
        },
      ]);
      compList = await loggerDB.aggregate([
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: { $toObjectId: "$compID" },
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "companyDetails",
          },
        },
        { $unwind: "$companyDetails" },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: "$companyDetails._id",
            name: "$companyDetails.compName",
            value: "$companyDetails.compName",
          },
        },
      ]);
      break;
    case "prov":
      provList = [];
      kabkotList = await kabkotDB.aggregate([
        { $match: { provID: user.userRole.provID } },
        {
          $project: {
            name: "$kabkotName",
            value: "$kabkotName",
            provID: "$provID",
          },
        },
      ]);
      compList = await loggerDB.aggregate([
        { $match: { provID: user.userRole.provID } },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: { $toObjectId: "$compID" },
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "companyDetails",
          },
        },
        { $unwind: "$companyDetails" },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: "$companyDetails._id",
            name: "$companyDetails.compName",
            value: "$companyDetails.compName",
          },
        },
      ]);
      break;
    case "kabkot":
      provList = [];
      kabkotList = [];
      compList = await loggerDB.aggregate([
        { $match: { kabkotID: user.userRole.kabkotID } },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: { $toObjectId: "$compID" },
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "compID",
            foreignField: "_id",
            as: "companyDetails",
          },
        },
        { $unwind: "$companyDetails" },
        {
          $project: {
            provID: "$provID",
            kabkotID: "$kabkotID",
            compID: "$companyDetails._id",
            name: "$companyDetails.compName",
            value: "$companyDetails.compName",
          },
        },
      ]);
      break;
    case "comp":
      provList = [];
      kabkotList = [];
      compList = [];
      break;
    default:
      break;
  }
  // const regisCovid = await regiscovidDB.find({},{"detail.compName":1});
  const regisCovid = await regiscovidDB.aggregate([
    { $group: { _id: "$detail.compName" } },
  ]);

  res.send({ provList, kabkotList, compList, regisCovid: regisCovid });
});

router.get("/raw/:id", async (req, res, next) => {
  const user = await userDB.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("User not found!");
  let dataSensor,
    listLogger,
    profile = {};
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
    profile = await userDB.aggregate([
      {
        $match: {
          userEmail: user.userEmail,
        },
      },
      { $addFields: { id: { $toObjectId: user.userRole.compID } } },
      {
        $lookup: {
          from: "companies",
          localField: "id",
          foreignField: "_id",
          as: "compDetails",
        },
      },
      {
        $unwind: "$compDetails",
      },
      { $addFields: { id: { $toString: user.userRole.compID } } },
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
        $lookup: {
          from: "formregiscomps",
          localField: "umum.compName",
          foreignField: "compDetails.compName",
          as: "formregis",
        },
      },
      {
        $unwind: "$formregis",
      },
      {
        $project: {
          compName: "$compDetails.compName",
          compAddres: "$compDetails.compAddress",
          latlong: "$loggerDetails.latlong",
          compTlp: "$compDetails.compTlp",
          userEmail: "$userEmail",
          compType: "$compDetails.compType",
          compWasteSource: "$compDetails.compWasteSource",
          compTech: "$compDetails.compTech",
          compPermit: "$formregis.teknis.permitNumber",
          compPermitDate: "$formregis.teknis.permitDatePublish",
          compInstance: "$compDetails.compInstance",
        },
      },
    ]);
    profile = profile[0];
  }
  if (req.query.start) {
    query["$and"] = [
      { timestamp: { $gte: Number(req.query.start) } },
      { timestamp: { $lte: Number(req.query.end) } },
    ];
  }

  switch (user.userRole.role) {
    case "admin":
      listLogger = await loggerDB.distinct("_id");
      for (let i = 0; i < listLogger.length; i++) {
        listLogger[i] = String(listLogger[i]);
      }
      dataSensor = await dataSensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
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
        {
          $limit: 2500,
        },
        {
          $sort: { timestamp: -1 },
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
      dataSensor = await dataSensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
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
        {
          $limit: 2500,
        },
        {
          $sort: { timestamp: -1 },
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
      dataSensor = await dataSensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
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
        {
          $limit: 2500,
        },
        {
          $sort: { timestamp: -1 },
        },
      ]);
      break;
    case "comp":
      profile = await userDB.aggregate([
        {
          $match: {
            userEmail: user.userEmail,
          },
        },
        { $addFields: { id: { $toObjectId: user.userRole.compID } } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        {
          $unwind: "$compDetails",
        },
        { $addFields: { id: { $toString: user.userRole.compID } } },
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
          $lookup: {
            from: "formregiscomps",
            localField: "umum.compName",
            foreignField: "compDetails.compName",
            as: "formregis",
          },
        },
        {
          $unwind: "$formregis",
        },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddres: "$compDetails.compAddress",
            latlong: "$loggerDetails.latlong",
            compTlp: "$compDetails.compTlp",
            userEmail: "$userEmail",
            compType: "$compDetails.compType",
            compWasteSource: "$compDetails.compWasteSource",
            compTech: "$compDetails.compTech",
            compPermit: "$formregis.teknis.permitNumber",
            compPermitDate: "$formregis.teknis.permitDatePublish",
            compInstance: "$compDetails.compInstance",
          },
        },
      ]);
      profile = profile[0];
      listLogger = await loggerDB.distinct("_id", {
        compID: user.userRole.compID,
      });
      for (let i = 0; i < listLogger.length; i++) {
        listLogger[i] = String(listLogger[i]);
      }
      dataSensor = await dataSensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
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
        {
          $limit: 2500,
        },
        {
          $sort: { timestamp: -1 },
        },
      ]);
      break;
    default:
      break;
  }
  res.send({ profile, dataSensor });
});

router.get("/hourly/:id", async (req, res, next) => {
  const user = await userDB.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("User not found!");
  let dataSensor,
    listLogger,
    profile,
    dataPemenuhan = [],
    reportHourlyResponse,
    query;
  let resQuery = await queryReport({ req, user, periode: "hourly" });
  profile = resQuery.profile;
  query = resQuery.query;
  switch (user.userRole.role) {
    case "admin":
      reportHourlyResponse = await reportHourly({
        id: "",
        query,
        type: "admin",
        periode: "hourly",
        output: "data",
      });
      listLogger = reportHourlyResponse.listLogger;
      dataSensor = reportHourlyResponse.dataSensor;
      break;
    case "prov":
      reportHourlyResponse = await reportHourly({
        id: user.userRole.provID,
        query,
        type: "prov",
        periode: "hourly",
        output: "data",
      });
      listLogger = reportHourlyResponse.listLogger;
      dataSensor = reportHourlyResponse.dataSensor;
      break;
    case "kabkot":
      reportHourlyResponse = await reportHourly({
        id: user.userRole.kabkotID,
        query,
        type: "kabkot",
        periode: "hourly",
        output: "data",
      });
      listLogger = reportHourlyResponse.listLogger;
      dataSensor = reportHourlyResponse.dataSensor;
      break;
    case "comp":
      profile = await userDB.aggregate([
        {
          $match: {
            userEmail: user.userEmail,
          },
        },
        { $addFields: { id: { $toObjectId: user.userRole.compID } } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        {
          $unwind: "$compDetails",
        },
        { $addFields: { id: { $toString: user.userRole.compID } } },
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
          $lookup: {
            from: "formregiscomps",
            localField: "umum.compName",
            foreignField: "compDetails.compName",
            as: "formregis",
          },
        },
        {
          $unwind: "$formregis",
        },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddres: "$compDetails.compAddress",
            latlong: "$loggerDetails.latlong",
            compTlp: "$compDetails.compTlp",
            userEmail: "$userEmail",
            compType: "$compDetails.compType",
            compWasteSource: "$compDetails.compWasteSource",
            compTech: "$compDetails.compTech",
            compPermit: "$formregis.teknis.permitNumber",
            compPermitDate: "$formregis.teknis.permitDatePublish",
            compInstance: "$compDetails.compInstance",
          },
        },
      ]);
      profile = profile[0];
      reportHourlyResponse = await reportHourly({
        id: user.userRole.compID,
        query,
        type: "comp",
        periode: "hourly",
        output: "data",
      });
      listLogger = reportHourlyResponse.listLogger;
      dataSensor = reportHourlyResponse.dataSensor;
      const logger = await loggerDB.findOne({ _id: listLogger[0] });
      logger.logDataRange.map((x) => {
        dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
      });
      for (let i = 0; i < dataSensor.length; i++) {
        for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
          // const found = logger.logDataRange.find(
          //   (element) => element.name ===  dataSensor[i].dataParam[a].name
          // );
          if (
            dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
            dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
          ) {
            dataPemenuhan[a].sum++;
          }
        }
      }
      for (let i = 0; i < dataPemenuhan.length; i++) {
        const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
        dataPemenuhan[i].precentage = percentageConvert(hitung);
      }

      break;
    default:
      break;
  }
  if (req.query.comp) {
    const comp = await companyDB.findOne({ compName: req.query.comp });
    // const logger = await loggerDB.findOne({ _id: listLogger[0] });
    const logger = await loggerDB.findOne({ compID: comp._id });

    logger.logDataRange.map((x) => {
      dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
    });
    for (let i = 0; i < dataSensor.length; i++) {
      for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
        // const found = logger.logDataRange.find(
        //   (element) => element.name ===  dataSensor[i].dataParam[a].name
        // );
        if (
          dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
          dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
        ) {
          dataPemenuhan[a].sum++;
        }
      }
    }
    for (let i = 0; i < dataPemenuhan.length; i++) {
      const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
      dataPemenuhan[i].precentage = percentageConvert(hitung);
    }
  }

  // for (let i = 0; i < dataSensor.length; i++) {
  //   const logger = await loggerDB.findOne({ _id: dataSensor[i].loggerID });
  //   for (let z = 0; z < logger.logDataRange.length; z++) {
  //     if (
  //       logger.logDataRange[z].min == null &&
  //       logger.logDataRange[z].max == null
  //     ) {
  //       if (dataSensor[i].dataParam[z].name == logger.logDataRange[z].name) {
  //         dataSensor[i].dataParam[z].name = dataSensor[i].dataParam[z].name;
  //         dataSensor[i].dataParam[z].value = "Tidak Wajib";
  //       }
  //     }
  //   }
  // }

  // for(let i=0; i<dataSensor.length; i++){
  //   const logger = await loggerDB.findOne({ _id: dataSensor[i].loggerID });
  //   logger.logDataRange.map(function(el){
  //     if (el.min == null && el.max == null) {
  //       // return el.name
  //       dataSensor.map(function(dat){
  //         console.log(dat)
  //       })

  //     }
  //   })
  //   // console.log(dataSensor[i].dataParam)
  // }
  res.send({ profile, count: dataSensor.length, dataSensor, dataPemenuhan });
});

router.get("/hourly-export/:id", async (req, res, next) => {
  const user = await userDB.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("User not found!");
  let dataSensor,
    listLogger,
    profile,
    dataPemenuhan = [],
    reportHourlyResponse,
    query;
  let resQuery = await queryReport({ req, user, periode: "hourly" });
  profile = resQuery.profile;
  query = resQuery.query;
  switch (user.userRole.role) {
    case "admin":
      reportHourlyResponse = await reportHourly({
        id: "",
        query,
        type: "admin",
        periode: "hourly",
        output: "export",
      });
      listLogger = reportHourlyResponse.listLogger;
      dataSensor = reportHourlyResponse.dataSensor;
      break;
    case "prov":
      reportHourlyResponse = await reportHourly({
        id: user.userRole.provID,
        query,
        type: "prov",
        periode: "hourly",
        output: "export",
      });
      listLogger = reportHourlyResponse.listLogger;
      dataSensor = reportHourlyResponse.dataSensor;
      break;
    case "kabkot":
      reportHourlyResponse = await reportHourly({
        id: user.userRole.kabkotID,
        query,
        type: "kabkot",
        periode: "hourly",
        output: "export",
      });
      listLogger = reportHourlyResponse.listLogger;
      dataSensor = reportHourlyResponse.dataSensor;
      break;
    case "comp":
      profile = await userDB.aggregate([
        {
          $match: {
            userEmail: user.userEmail,
          },
        },
        { $addFields: { id: { $toObjectId: user.userRole.compID } } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        {
          $unwind: "$compDetails",
        },
        { $addFields: { id: { $toString: user.userRole.compID } } },
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
          $lookup: {
            from: "formregiscomps",
            localField: "umum.compName",
            foreignField: "compDetails.compName",
            as: "formregis",
          },
        },
        {
          $unwind: "$formregis",
        },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddres: "$compDetails.compAddress",
            latlong: "$loggerDetails.latlong",
            compTlp: "$compDetails.compTlp",
            userEmail: "$userEmail",
            compType: "$compDetails.compType",
            compWasteSource: "$compDetails.compWasteSource",
            compTech: "$compDetails.compTech",
            compPermit: "$formregis.teknis.permitNumber",
            compPermitDate: "$formregis.teknis.permitDatePublish",
            compInstance: "$compDetails.compInstance",
          },
        },
      ]);
      profile = profile[0];
      reportHourlyResponse = await reportHourly({
        id: user.userRole.compID,
        query,
        type: "comp",
        periode: "hourly",
        output: "export",
      });
      listLogger = reportHourlyResponse.listLogger;
      dataSensor = reportHourlyResponse.dataSensor;
      const logger = await loggerDB.findOne({ _id: listLogger[0] });
      logger.logDataRange.map((x) => {
        dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
      });
      for (let i = 0; i < dataSensor.length; i++) {
        for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
          // const found = logger.logDataRange.find(
          //   (element) => element.name ===  dataSensor[i].dataParam[a].name
          // );
          if (
            dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
            dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
          ) {
            dataPemenuhan[a].sum++;
          }
        }
      }
      for (let i = 0; i < dataPemenuhan.length; i++) {
        const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
        dataPemenuhan[i].precentage = percentageConvert(hitung);
      }

      break;
    default:
      break;
  }
  if (req.query.comp) {
    const comp = await companyDB.findOne({ compName: req.query.comp });
    // const logger = await loggerDB.findOne({ _id: listLogger[0] });
    const logger = await loggerDB.findOne({ compID: comp._id });

    logger.logDataRange.map((x) => {
      dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
    });
    for (let i = 0; i < dataSensor.length; i++) {
      for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
        // const found = logger.logDataRange.find(
        //   (element) => element.name ===  dataSensor[i].dataParam[a].name
        // );
        if (
          dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
          dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
        ) {
          dataPemenuhan[a].sum++;
        }
      }
    }
    for (let i = 0; i < dataPemenuhan.length; i++) {
      const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
      dataPemenuhan[i].precentage = percentageConvert(hitung);
    }
  }
  await laporanExportService({
    dataPemenuhan,
    dataSensor,
    res,
    type: "harian",
    unit: "jam",
  });
});

// DATA DOWNLOAD
router.get("/hourly-download/:id", async (req, res, next) => {
  const user = await userDB.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("User not found!");
  let dataSensor,
    listLogger,
    profile = {},
    dataPemenuhan = [];
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
    req.query.comp = req.query.comp.replace(/%20/g, " ");
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
        $lookup: {
          from: "formregiscomps",
          localField: "umum.compName",
          foreignField: "compName",
          as: "formregis",
        },
      },
      {
        $unwind: "$formregis",
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
          compPermit: "$formregis.teknis.permitNumber",
          compPermitDate: "$formregis.teknis.permitDatePublish",
          compInstance: "$compInstance",
        },
      },
    ]);

    profile = profile[0];
  }
  if (req.query.start) {
    req.query.start = req.query.start;
    req.query.end = req.query.end.substr(0, 10);
    query["$and"] = [
      {
        timestamp: {
          $gte: Number(req.query.start),
          $lte: Number(req.query.end),
        },
      },
    ];
  }
  switch (user.userRole.role) {
    case "admin":
      listLogger = await loggerDB.distinct("_id");
      for (let i = 0; i < listLogger.length; i++) {
        listLogger[i] = String(listLogger[i]);
      }
      dataSensor = await dataHourlySensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },

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
        {
          $sort: { timestamp: -1 },
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
      dataSensor = await dataHourlySensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
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

        {
          $sort: { timestamp: -1 },
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
      dataSensor = await dataHourlySensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
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
        {
          $sort: { timestamp: -1 },
        },
      ]);
      break;
    case "comp":
      profile = await userDB.aggregate([
        {
          $match: {
            userEmail: user.userEmail,
          },
        },
        { $addFields: { id: { $toObjectId: user.userRole.compID } } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        {
          $unwind: "$compDetails",
        },
        { $addFields: { id: { $toString: user.userRole.compID } } },
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
          $lookup: {
            from: "formregiscomps",
            localField: "umum.compName",
            foreignField: "compDetails.compName",
            as: "formregis",
          },
        },
        {
          $unwind: "$formregis",
        },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddres: "$compDetails.compAddress",
            latlong: "$loggerDetails.latlong",
            compTlp: "$compDetails.compTlp",
            userEmail: "$userEmail",
            compType: "$compDetails.compType",
            compWasteSource: "$compDetails.compWasteSource",
            compTech: "$compDetails.compTech",
            compPermit: "$formregis.teknis.permitNumber",
            compPermitDate: "$formregis.teknis.permitDatePublish",
            compInstance: "$compDetails.compInstance",
          },
        },
      ]);
      profile = profile[0];
      listLogger = await loggerDB.distinct("_id", {
        compID: user.userRole.compID,
      });
      for (let i = 0; i < listLogger.length; i++) {
        listLogger[i] = String(listLogger[i]);
      }
      dataSensor = await dataHourlySensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
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
        {
          $sort: { timestamp: -1 },
        },
      ]);
      const logger = await loggerDB.findOne({ _id: listLogger[0] });
      logger.logDataRange.map((x) => {
        dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
      });
      for (let i = 0; i < dataSensor.length; i++) {
        for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
          // const found = logger.logDataRange.find(
          //   (element) => element.name ===  dataSensor[i].dataParam[a].name
          // );
          if (
            dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
            dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
          ) {
            dataPemenuhan[a].sum++;
          }
        }
      }
      for (let i = 0; i < dataPemenuhan.length; i++) {
        const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
        dataPemenuhan[i].precentage = percentageConvert(hitung);
      }

      break;
    default:
      break;
  }

  if (req.query.comp) {
    const comp = await companyDB.findOne({ compName: req.query.comp });
    // const logger = await loggerDB.findOne({ _id: listLogger[0] });
    const logger = await loggerDB.findOne({ compID: comp._id });
    logger.logDataRange.map((x) => {
      dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
    });
    for (let i = 0; i < dataSensor.length; i++) {
      for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
        // const found = logger.logDataRange.find(
        //   (element) => element.name ===  dataSensor[i].dataParam[a].name
        // );
        if (
          dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
          dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
        ) {
          dataPemenuhan[a].sum++;
        }
      }
    }
    for (let i = 0; i < dataPemenuhan.length; i++) {
      const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
      dataPemenuhan[i].precentage = percentageConvert(hitung);
    }
  }

  for (let i = 0; i < dataSensor.length; i++) {
    const logger = await loggerDB.findOne({ _id: dataSensor[i].loggerID });
    for (let z = 0; z < logger.logDataRange.length; z++) {
      if (
        logger.logDataRange[z].min == null &&
        logger.logDataRange[z].max == null
      ) {
        if (dataSensor[i].dataParam[z].name == logger.logDataRange[z].name) {
          dataSensor[i].dataParam[z].name = dataSensor[i].dataParam[z].name;
          dataSensor[i].dataParam[z].value = "Tidak Wajib";
        }
      }
    }
  }

  res.send({ profile, dataSensor, dataPemenuhan });
});
// END DATA DOWNLOAD

// DATA DAILY
router.get("/daily/:id", async (req, res, next) => {
  const user = await userDB.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("User not found!");
  let dataSensor,
    listLogger,
    profile,
    dataPemenuhan = [],
    reportResponse,
    query;
  let resQuery = await queryReport({ req, user, periode: "daily" });
  profile = resQuery.profile;
  query = resQuery.query;

  switch (user.userRole.role) {
    case "admin":
      reportResponse = await reportHourly({
        id: "",
        query,
        type: "admin",
        periode: "daily",
        output: "data",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "prov":
      reportResponse = await reportHourly({
        id: user.userRole.provID,
        query,
        type: "prov",
        periode: "daily",
        output: "data",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "kabkot":
      reportResponse = await reportHourly({
        id: user.userRole.kabkotID,
        query,
        type: "kabkot",
        periode: "daily",
        output: "data",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "comp":
      profile = await userDB.aggregate([
        {
          $match: {
            userEmail: user.userEmail,
          },
        },
        { $addFields: { id: { $toObjectId: user.userRole.compID } } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        {
          $unwind: "$compDetails",
        },
        { $addFields: { id: { $toString: user.userRole.compID } } },
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
          $lookup: {
            from: "formregiscomps",
            localField: "umum.compName",
            foreignField: "compDetails.compName",
            as: "formregis",
          },
        },
        {
          $unwind: "$formregis",
        },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddres: "$compDetails.compAddress",
            latlong: "$loggerDetails.latlong",
            compTlp: "$compDetails.compTlp",
            userEmail: "$userEmail",
            compType: "$compDetails.compType",
            compWasteSource: "$compDetails.compWasteSource",
            compTech: "$compDetails.compTech",
            compPermit: "$formregis.teknis.permitNumber",
            compPermitDate: "$formregis.teknis.permitDatePublish",
            compInstance: "$compDetails.compInstance",
          },
        },
      ]);
      profile = profile[0];
      reportResponse = await reportHourly({
        id: user.userRole.compID,
        query,
        type: "comp",
        periode: "daily",
        output: "data",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      const logger = await loggerDB.findOne({ _id: listLogger[0] });
      logger.logDataRange.map((x) => {
        dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
      });
      for (let i = 0; i < dataSensor.length; i++) {
        for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
          // const found = logger.logDataRange.find(
          //   (element) => element.name ===  dataSensor[i].dataParam[a].name
          // );
          if (
            dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
            dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
          ) {
            dataPemenuhan[a].sum++;
          }
        }
      }
      for (let i = 0; i < dataPemenuhan.length; i++) {
        const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
        dataPemenuhan[i].precentage = percentageConvert(hitung);
      }

      break;
    default:
      break;
  }

  if (req.query.comp) {
    const comp = await companyDB.findOne({ compName: req.query.comp });
    // const logger = await loggerDB.findOne({ _id: listLogger[0] });
    const logger = await loggerDB.findOne({ compID: comp._id });

    logger.logDataRange.map((x) => {
      dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
    });
    for (let i = 0; i < dataSensor.length; i++) {
      for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
        // const found = logger.logDataRange.find(
        //   (element) => element.name ===  dataSensor[i].dataParam[a].name
        // );
        if (
          dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
          dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
        ) {
          dataPemenuhan[a].sum++;
        }
      }
    }
    for (let i = 0; i < dataPemenuhan.length; i++) {
      const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
      dataPemenuhan[i].precentage = percentageConvert(hitung);
    }
  }

  // for (let i = 0; i < dataSensor.length; i++) {
  //   const logger = await loggerDB.findOne({ _id: dataSensor[i].loggerID });
  //   for (let z = 0; z < logger.logDataRange.length; z++) {
  //     if (
  //       logger.logDataRange[z].min == null &&
  //       logger.logDataRange[z].max == null
  //     ) {
  //       if (dataSensor[i].dataParam[z].name == logger.logDataRange[z].name) {
  //         dataSensor[i].dataParam[z].name = dataSensor[i].dataParam[z].name;
  //         dataSensor[i].dataParam[z].value = "Tidak Wajib";
  //       }
  //     }
  //   }
  // }

  // for(let i=0; i<dataSensor.length; i++){
  //   const logger = await loggerDB.findOne({ _id: dataSensor[i].loggerID });
  //   logger.logDataRange.map(function(el){
  //     if (el.min == null && el.max == null) {
  //       // return el.name
  //       dataSensor.map(function(dat){
  //         console.log(dat)
  //       })

  //     }
  //   })
  //   // console.log(dataSensor[i].dataParam)
  // }
  res.send({ profile, dataSensor, dataPemenuhan });
});

router.get("/daily-export/:id", async (req, res, next) => {
  const user = await userDB.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("User not found!");
  let dataSensor,
    listLogger,
    profile,
    dataPemenuhan = [],
    reportResponse,
    query;
  let resQuery = await queryReport({ req, user, periode: "daily" });
  profile = resQuery.profile;
  query = resQuery.query;

  switch (user.userRole.role) {
    case "admin":
      reportResponse = await reportHourly({
        id: "",
        query,
        type: "admin",
        periode: "daily",
        output: "export",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "prov":
      reportResponse = await reportHourly({
        id: user.userRole.provID,
        query,
        type: "prov",
        periode: "daily",
        output: "export",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "kabkot":
      reportResponse = await reportHourly({
        id: user.userRole.kabkotID,
        query,
        type: "kabkot",
        periode: "daily",
        output: "export",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "comp":
      profile = await userDB.aggregate([
        {
          $match: {
            userEmail: user.userEmail,
          },
        },
        { $addFields: { id: { $toObjectId: user.userRole.compID } } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        {
          $unwind: "$compDetails",
        },
        { $addFields: { id: { $toString: user.userRole.compID } } },
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
          $lookup: {
            from: "formregiscomps",
            localField: "umum.compName",
            foreignField: "compDetails.compName",
            as: "formregis",
          },
        },
        {
          $unwind: "$formregis",
        },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddres: "$compDetails.compAddress",
            latlong: "$loggerDetails.latlong",
            compTlp: "$compDetails.compTlp",
            userEmail: "$userEmail",
            compType: "$compDetails.compType",
            compWasteSource: "$compDetails.compWasteSource",
            compTech: "$compDetails.compTech",
            compPermit: "$formregis.teknis.permitNumber",
            compPermitDate: "$formregis.teknis.permitDatePublish",
            compInstance: "$compDetails.compInstance",
          },
        },
      ]);
      profile = profile[0];
      reportResponse = await reportHourly({
        id: user.userRole.compID,
        query,
        type: "comp",
        periode: "daily",
        output: "export",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      const logger = await loggerDB.findOne({ _id: listLogger[0] });
      logger.logDataRange.map((x) => {
        dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
      });
      for (let i = 0; i < dataSensor.length; i++) {
        for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
          // const found = logger.logDataRange.find(
          //   (element) => element.name ===  dataSensor[i].dataParam[a].name
          // );
          if (
            dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
            dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
          ) {
            dataPemenuhan[a].sum++;
          }
        }
      }
      for (let i = 0; i < dataPemenuhan.length; i++) {
        const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
        dataPemenuhan[i].precentage = percentageConvert(hitung);
      }

      break;
    default:
      break;
  }

  if (req.query.comp) {
    const comp = await companyDB.findOne({
      compName: req.query.comp,
    });
    // const logger = await loggerDB.findOne({ _id: listLogger[0] });
    const logger = await loggerDB.findOne({
      compID: comp._id,
    });
    logger.logDataRange.map((x) => {
      dataPemenuhan.push({
        name: x.name,
        sum: 0,
        precentage: 0,
      });
    });
    for (let i = 0; i < dataSensor.length; i++) {
      for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
        // const found = logger.logDataRange.find(
        //   (element) => element.name ===  dataSensor[i].dataParam[a].name
        // );
        if (
          dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
          dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
        ) {
          dataPemenuhan[a].sum++;
        }
      }
    }
    for (let i = 0; i < dataPemenuhan.length; i++) {
      const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
      dataPemenuhan[i].precentage = percentageConvert(hitung);
    }
  }
  await laporanExportService({
    dataPemenuhan,
    dataSensor,
    res,
    type: "harian",
    unit: "hari",
  });
});

// DATA DOWNLOAD
router.get("/daily-download/:id", async (req, res, next) => {
  const user = await userDB.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("User not found!");
  let dataSensor,
    listLogger,
    profile = {},
    dataPemenuhan = [];
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
    req.query.comp = req.query.comp.replace(/%20/g, " ");
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
        $lookup: {
          from: "formregiscomps",
          localField: "umum.compName",
          foreignField: "compName",
          as: "formregis",
        },
      },
      {
        $unwind: "$formregis",
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
          compPermit: "$formregis.teknis.permitNumber",
          compPermitDate: "$formregis.teknis.permitDatePublish",
          compInstance: "$compInstance",
        },
      },
    ]);

    profile = profile[0];
  }
  if (req.query.start) {
    req.query.start = req.query.start;
    req.query.end = req.query.end.substr(0, 10);
    query["$and"] = [
      {
        timestamp: {
          $gte: Number(req.query.start),
          $lte: Number(req.query.end),
        },
      },
    ];
  }
  switch (user.userRole.role) {
    case "admin":
      listLogger = await loggerDB.distinct("_id");
      for (let i = 0; i < listLogger.length; i++) {
        listLogger[i] = String(listLogger[i]);
      }
      dataSensor = await dataDaySensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },

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
        {
          $sort: { timestamp: -1 },
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
      dataSensor = await dataDaySensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
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

        {
          $sort: { timestamp: -1 },
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
      dataSensor = await dataDaySensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
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
        {
          $sort: { timestamp: -1 },
        },
      ]);
      break;
    case "comp":
      profile = await userDB.aggregate([
        {
          $match: {
            userEmail: user.userEmail,
          },
        },
        { $addFields: { id: { $toObjectId: user.userRole.compID } } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        {
          $unwind: "$compDetails",
        },
        { $addFields: { id: { $toString: user.userRole.compID } } },
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
          $lookup: {
            from: "formregiscomps",
            localField: "umum.compName",
            foreignField: "compDetails.compName",
            as: "formregis",
          },
        },
        {
          $unwind: "$formregis",
        },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddres: "$compDetails.compAddress",
            latlong: "$loggerDetails.latlong",
            compTlp: "$compDetails.compTlp",
            userEmail: "$userEmail",
            compType: "$compDetails.compType",
            compWasteSource: "$compDetails.compWasteSource",
            compTech: "$compDetails.compTech",
            compPermit: "$formregis.teknis.permitNumber",
            compPermitDate: "$formregis.teknis.permitDatePublish",
            compInstance: "$compDetails.compInstance",
          },
        },
      ]);
      profile = profile[0];
      listLogger = await loggerDB.distinct("_id", {
        compID: user.userRole.compID,
      });
      for (let i = 0; i < listLogger.length; i++) {
        listLogger[i] = String(listLogger[i]);
      }
      dataSensor = await dataDaySensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
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
        {
          $sort: { timestamp: -1 },
        },
      ]);
      const logger = await loggerDB.findOne({ _id: listLogger[0] });
      logger.logDataRange.map((x) => {
        dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
      });
      for (let i = 0; i < dataSensor.length; i++) {
        for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
          // const found = logger.logDataRange.find(
          //   (element) => element.name ===  dataSensor[i].dataParam[a].name
          // );
          if (
            dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
            dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
          ) {
            dataPemenuhan[a].sum++;
          }
        }
      }
      for (let i = 0; i < dataPemenuhan.length; i++) {
        const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
        dataPemenuhan[i].precentage = percentageConvert(hitung);
      }

      break;
    default:
      break;
  }

  if (req.query.comp) {
    const comp = await companyDB.findOne({ compName: req.query.comp });
    // const logger = await loggerDB.findOne({ _id: listLogger[0] });
    const logger = await loggerDB.findOne({ compID: comp._id });
    logger.logDataRange.map((x) => {
      dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
    });
    for (let i = 0; i < dataSensor.length; i++) {
      for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
        // const found = logger.logDataRange.find(
        //   (element) => element.name ===  dataSensor[i].dataParam[a].name
        // );
        if (
          dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
          dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
        ) {
          dataPemenuhan[a].sum++;
        }
      }
    }
    for (let i = 0; i < dataPemenuhan.length; i++) {
      const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
      dataPemenuhan[i].precentage = percentageConvert(hitung);
    }
  }

  for (let i = 0; i < dataSensor.length; i++) {
    const logger = await loggerDB.findOne({ _id: dataSensor[i].loggerID });
    for (let z = 0; z < logger.logDataRange.length; z++) {
      if (
        logger.logDataRange[z].min == null &&
        logger.logDataRange[z].max == null
      ) {
        if (dataSensor[i].dataParam[z].name == logger.logDataRange[z].name) {
          dataSensor[i].dataParam[z].name = dataSensor[i].dataParam[z].name;
          dataSensor[i].dataParam[z].value = "Tidak Wajib";
        }
      }
    }
  }

  res.send({ profile, dataSensor, dataPemenuhan });
});

// DATA MONTHLY

router.get("/monthly/:id", async (req, res, next) => {
  const user = await userDB.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("User not found!");
  let dataSensor,
    listLogger,
    profile,
    dataPemenuhan = [],
    reportResponse,
    query;
  let resQuery = await queryReport({ req, user, periode: "monthly" });
  profile = resQuery.profile;
  query = resQuery.query;

  switch (user.userRole.role) {
    case "admin":
      reportResponse = await reportHourly({
        id: "",
        query,
        type: "admin",
        periode: "monthly",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "prov":
      reportResponse = await reportHourly({
        id: user.userRole.provID,
        query,
        type: "prov",
        periode: "monthly",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "kabkot":
      reportResponse = await reportHourly({
        id: user.userRole.kabkotID,
        query,
        type: "kabkot",
        periode: "monthly",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "comp":
      profile = await userDB.aggregate([
        {
          $match: {
            userEmail: user.userEmail,
          },
        },
        { $addFields: { id: { $toObjectId: user.userRole.compID } } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        {
          $unwind: "$compDetails",
        },
        { $addFields: { id: { $toString: user.userRole.compID } } },
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
          $lookup: {
            from: "formregiscomps",
            localField: "umum.compName",
            foreignField: "compDetails.compName",
            as: "formregis",
          },
        },
        {
          $unwind: "$formregis",
        },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddres: "$compDetails.compAddress",
            latlong: "$loggerDetails.latlong",
            compTlp: "$compDetails.compTlp",
            userEmail: "$userEmail",
            compType: "$compDetails.compType",
            compWasteSource: "$compDetails.compWasteSource",
            compTech: "$compDetails.compTech",
            compPermit: "$formregis.teknis.permitNumber",
            compPermitDate: "$formregis.teknis.permitDatePublish",
            compInstance: "$compDetails.compInstance",
          },
        },
      ]);
      profile = profile[0];
      reportResponse = await reportHourly({
        id: user.userRole.compID,
        query,
        type: "comp",
        periode: "monthly",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      const logger = await loggerDB.findOne({ _id: listLogger[0] });
      logger.logDataRange.map((x) => {
        dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
      });
      for (let i = 0; i < dataSensor.length; i++) {
        for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
          // const found = logger.logDataRange.find(
          //   (element) => element.name ===  dataSensor[i].dataParam[a].name
          // );
          if (
            dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
            dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
          ) {
            dataPemenuhan[a].sum++;
          }
        }
      }
      for (let i = 0; i < dataPemenuhan.length; i++) {
        const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
        dataPemenuhan[i].precentage = percentageConvert(hitung);
      }

      break;
    default:
      break;
  }

  if (req.query.comp) {
    const comp = await companyDB.findOne({ compName: req.query.comp });
    // const logger = await loggerDB.findOne({ _id: listLogger[0] });
    const logger = await loggerDB.findOne({ compID: comp._id });

    logger.logDataRange.map((x) => {
      dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
    });
    for (let i = 0; i < dataSensor.length; i++) {
      for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
        // const found = logger.logDataRange.find(
        //   (element) => element.name ===  dataSensor[i].dataParam[a].name
        // );
        if (
          dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
          dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
        ) {
          dataPemenuhan[a].sum++;
        }
      }
    }
    for (let i = 0; i < dataPemenuhan.length; i++) {
      const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
      dataPemenuhan[i].precentage = percentageConvert(hitung);
    }
  }

  // for (let i = 0; i < dataSensor.length; i++) {
  //   const logger = await loggerDB.findOne({ _id: dataSensor[i].loggerID });
  //   for (let z = 0; z < logger.logDataRange.length; z++) {
  //     if (
  //       logger.logDataRange[z].min == null &&
  //       logger.logDataRange[z].max == null
  //     ) {
  //       if (dataSensor[i].dataParam[z].name == logger.logDataRange[z].name) {
  //         dataSensor[i].dataParam[z].name = dataSensor[i].dataParam[z].name;
  //         dataSensor[i].dataParam[z].value = "Tidak Wajib";
  //       }
  //     }
  //   }
  // }

  // for(let i=0; i<dataSensor.length; i++){
  //   const logger = await loggerDB.findOne({ _id: dataSensor[i].loggerID });
  //   logger.logDataRange.map(function(el){
  //     if (el.min == null && el.max == null) {
  //       // return el.name
  //       dataSensor.map(function(dat){
  //         console.log(dat)
  //       })

  //     }
  //   })
  //   // console.log(dataSensor[i].dataParam)
  // }
  res.send({ profile, dataSensor, dataPemenuhan });
});

router.get("/monthly-export/:id", async (req, res, next) => {
  const user = await userDB.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("User not found!");
  let dataSensor,
    listLogger,
    profile = {},
    dataPemenuhan = [];
  let query = {};

  if (user.userRole.role != "comp" && user.userRole.role != "kabkot") {
    if (
      req.query.type == undefined &&
      req.query.prov == undefined &&
      req.query.kabkot == undefined &&
      req.query.comp == undefined
    ) {
      query["$and"] = [
        {
          timestamp: {
            $gte: moment().startOf("days").unix(),
            $lte: moment().endOf("days").unix(),
          },
        },
      ];
    }
  } else {
    query["$and"] = [
      {
        timestamp: {
          $gte: moment().startOf("months").unix(),
          $lte: moment().endOf("months").unix(),
        },
      },
    ];
  }

  if (req.query.type) {
    query["compDetails.compType"] = req.query.type;
    query["$and"] = [
      {
        timestamp: {
          $gte: Number(moment().subtract(4, "weeks").unix()),
          $lte: Number(moment().unix()),
        },
      },
    ];
  }
  if (req.query.prov) {
    if (!req.query.prov == "undefined") {
      query["provDetails.provName"] = req.query.prov;
    }
    query["$and"] = [
      {
        timestamp: {
          $gte: Number(moment().subtract(2, "weeks").unix()),
          $lte: Number(moment().unix()),
        },
      },
    ];
  }
  if (req.query.kabkot) {
    if (!req.query.kabkot == "undefined") {
      query["kabkotDetails.kabkotName"] = req.query.kabkot;
    }
    query["$and"] = [
      {
        timestamp: {
          $gte: Number(moment().subtract(4, "weeks").unix()),
          $lte: Number(moment().unix()),
        },
      },
    ];
  }
  if (req.query.comp) {
    req.query.comp = req.query.comp.replace(/%20/g, " ");
    query["compDetails.compName"] = req.query.comp;
    query["$and"] = [
      {
        timestamp: {
          $gte: Number(moment().subtract(1, "month").endOf("month").unix()),
          $lte: Number(moment().unix()),
        },
      },
    ];
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
        $lookup: {
          from: "formregiscomps",
          localField: "umum.compName",
          foreignField: "compName",
          as: "formregis",
        },
      },
      {
        $unwind: "$formregis",
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
          compPermit: "$formregis.teknis.permitNumber",
          compPermitDate: "$formregis.teknis.permitDatePublish",
          compInstance: "$compInstance",
        },
      },
    ]);
    profile = profile[0];
  }
  if (req.query.start) {
    req.query.start = req.query.start;
    req.query.end = req.query.end.substr(0, 10);
    query["$and"] = [
      {
        timestamp: {
          $gte: Number(req.query.start),
          $lte: Number(req.query.end),
        },
      },
    ];
  }
  switch (user.userRole.role) {
    case "admin":
      listLogger = await loggerDB.distinct("_id");
      for (let i = 0; i < listLogger.length; i++) {
        listLogger[i] = String(listLogger[i]);
      }
      dataSensor = await dataMonthSensorDB.aggregate([
        {
          $match: {
            loggerID: {
              $in: listLogger,
            },
          },
        },

        {
          $addFields: {
            id: {
              $toObjectId: "$loggerID",
            },
          },
        },
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
        {
          $addFields: {
            id_comp: {
              $toObjectId: "$loggerDetails.compID",
            },
          },
        },
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
          $addFields: {
            id_kabkot: {
              $toObjectId: "$loggerDetails.kabkotID",
            },
          },
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
        {
          $addFields: {
            id_prov: {
              $toObjectId: "$loggerDetails.provID",
            },
          },
        },
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
          $lookup: {
            from: "formregiscomps",
            let: {
              compName: "$compDetails.compName",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$umum.compName", "$$compName"],
                      },
                    ],
                  },
                },
              },
            ],
            as: "formregis",
          },
        },
        { $match: query },
        {
          $limit: 2500,
        },
        {
          $project: {
            _id: 1,
            dataParam: {
              $function: {
                body: function (log, data, formregis) {
                  log.forEach((value, index) => {
                    if (log[index].min === null && log[index].max === null) {
                      data[index].value = "Tidak Wajib";
                    }
                  });
                  return data;
                },
                args: [
                  "$loggerDetails.logDataRange",
                  "$dataParam",
                  "$formregis.teknis",
                ],
                lang: "js",
              },
            },
            loggerID: 1,
            timestamp: 1,
            serverTimestamp: 1,
            __v: 1,
            loggerDetails: 1,
            compDetails: 1,
            kabkotDetails: 1,
            provDetails: 1,
            formregis: 1,
          },
        },
        {
          $project: {
            id: 0,
            id_comp: 0,
            id_kabkot: 0,
            id_prov: 0,
          },
        },
        {
          $sort: {
            timestamp: -1,
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
      dataSensor = await dataMonthSensorDB.aggregate([
        {
          $match: {
            loggerID: {
              $in: listLogger,
            },
          },
        },
        {
          $addFields: {
            id: {
              $toObjectId: "$loggerID",
            },
          },
        },
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
        {
          $addFields: {
            id_comp: {
              $toObjectId: "$loggerDetails.compID",
            },
          },
        },
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
          $addFields: {
            id_kabkot: {
              $toObjectId: "$loggerDetails.kabkotID",
            },
          },
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
        {
          $addFields: {
            id_prov: {
              $toObjectId: "$loggerDetails.provID",
            },
          },
        },
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
          $lookup: {
            from: "formregiscomps",
            let: {
              compName: "$compDetails.compName",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$umum.compName", "$$compName"],
                      },
                    ],
                  },
                },
              },
            ],
            as: "formregis",
          },
        },
        { $match: query },
        {
          $limit: 2500,
        },
        {
          $project: {
            _id: 1,
            dataParam: {
              $function: {
                body: function (log, data, formregis) {
                  log.forEach((value, index) => {
                    if (log[index].min === null && log[index].max === null) {
                      data[index].value = "Tidak Wajib";
                    }
                  });
                  return data;
                },
                args: [
                  "$loggerDetails.logDataRange",
                  "$dataParam",
                  "$formregis.teknis",
                ],
                lang: "js",
              },
            },
            loggerID: 1,
            timestamp: 1,
            serverTimestamp: 1,
            __v: 1,
            loggerDetails: 1,
            compDetails: 1,
            kabkotDetails: 1,
            provDetails: 1,
            formregis: 1,
          },
        },
        {
          $project: {
            id: 0,
            id_comp: 0,
            id_kabkot: 0,
            id_prov: 0,
          },
        },
        {
          $sort: {
            timestamp: -1,
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
      dataSensor = await dataMonthSensorDB.aggregate([
        {
          $match: {
            loggerID: {
              $in: listLogger,
            },
          },
        },
        {
          $addFields: {
            id: {
              $toObjectId: "$loggerID",
            },
          },
        },
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
        {
          $addFields: {
            id_comp: {
              $toObjectId: "$loggerDetails.compID",
            },
          },
        },
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
          $addFields: {
            id_kabkot: {
              $toObjectId: "$loggerDetails.kabkotID",
            },
          },
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
        {
          $addFields: {
            id_prov: {
              $toObjectId: "$loggerDetails.provID",
            },
          },
        },
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
          $lookup: {
            from: "formregiscomps",
            let: {
              compName: "$compDetails.compName",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$umum.compName", "$$compName"],
                      },
                    ],
                  },
                },
              },
            ],
            as: "formregis",
          },
        },
        { $match: query },
        {
          $limit: 2500,
        },
        {
          $project: {
            _id: 1,
            dataParam: {
              $function: {
                body: function (log, data, formregis) {
                  log.forEach((value, index) => {
                    if (log[index].min === null && log[index].max === null) {
                      data[index].value = "Tidak Wajib";
                    }
                  });
                  return data;
                },
                args: [
                  "$loggerDetails.logDataRange",
                  "$dataParam",
                  "$formregis.teknis",
                ],
                lang: "js",
              },
            },
            loggerID: 1,
            timestamp: 1,
            serverTimestamp: 1,
            __v: 1,
            loggerDetails: 1,
            compDetails: 1,
            kabkotDetails: 1,
            provDetails: 1,
            formregis: 1,
          },
        },
        {
          $project: {
            id: 0,
            id_comp: 0,
            id_kabkot: 0,
            id_prov: 0,
          },
        },
        {
          $sort: {
            timestamp: -1,
          },
        },
      ]);
      break;
    case "comp":
      profile = await userDB.aggregate([
        {
          $match: {
            userEmail: user.userEmail,
          },
        },
        {
          $addFields: {
            id: {
              $toObjectId: user.userRole.compID,
            },
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        {
          $unwind: "$compDetails",
        },
        {
          $addFields: {
            id: {
              $toString: user.userRole.compID,
            },
          },
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
          $lookup: {
            from: "formregiscomps",
            localField: "umum.compName",
            foreignField: "compDetails.compName",
            as: "formregis",
          },
        },
        {
          $unwind: "$formregis",
        },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddres: "$compDetails.compAddress",
            latlong: "$loggerDetails.latlong",
            compTlp: "$compDetails.compTlp",
            userEmail: "$userEmail",
            compType: "$compDetails.compType",
            compWasteSource: "$compDetails.compWasteSource",
            compTech: "$compDetails.compTech",
            compPermit: "$formregis.teknis.permitNumber",
            compPermitDate: "$formregis.teknis.permitDatePublish",
            compInstance: "$compDetails.compInstance",
          },
        },
      ]);
      profile = profile[0];
      listLogger = await loggerDB.distinct("_id", {
        compID: user.userRole.compID,
      });
      for (let i = 0; i < listLogger.length; i++) {
        listLogger[i] = String(listLogger[i]);
      }
      dataSensor = await dataMonthSensorDB.aggregate([
        {
          $match: {
            loggerID: {
              $in: listLogger,
            },
          },
        },
        {
          $addFields: {
            id: {
              $toObjectId: "$loggerID",
            },
          },
        },
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
        {
          $addFields: {
            id_comp: {
              $toObjectId: "$loggerDetails.compID",
            },
          },
        },
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
          $addFields: {
            id_kabkot: {
              $toObjectId: "$loggerDetails.kabkotID",
            },
          },
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
        {
          $addFields: {
            id_prov: {
              $toObjectId: "$loggerDetails.provID",
            },
          },
        },
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
          $lookup: {
            from: "formregiscomps",
            let: {
              compName: "$compDetails.compName",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$umum.compName", "$$compName"],
                      },
                    ],
                  },
                },
              },
            ],
            as: "formregis",
          },
        },
        { $match: query },
        {
          $limit: 2500,
        },
        {
          $project: {
            _id: 1,
            dataParam: {
              $function: {
                body: function (log, data, formregis) {
                  log.forEach((value, index) => {
                    if (log[index].min === null && log[index].max === null) {
                      data[index].value = "Tidak Wajib";
                    }
                  });
                  return data;
                },
                args: [
                  "$loggerDetails.logDataRange",
                  "$dataParam",
                  "$formregis.teknis",
                ],
                lang: "js",
              },
            },
            loggerID: 1,
            timestamp: 1,
            serverTimestamp: 1,
            __v: 1,
            loggerDetails: 1,
            compDetails: 1,
            kabkotDetails: 1,
            provDetails: 1,
            formregis: 1,
          },
        },
        {
          $project: {
            id: 0,
            id_comp: 0,
            id_kabkot: 0,
            id_prov: 0,
          },
        },
        {
          $sort: {
            timestamp: -1,
          },
        },
      ]);
      const logger = await loggerDB.findOne({
        _id: listLogger[0],
      });
      logger.logDataRange.map((x) => {
        dataPemenuhan.push({
          name: x.name,
          sum: 0,
          precentage: 0,
        });
      });
      for (let i = 0; i < dataSensor.length; i++) {
        for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
          // const found = logger.logDataRange.find(
          //   (element) => element.name ===  dataSensor[i].dataParam[a].name
          // );
          if (
            dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
            dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
          ) {
            dataPemenuhan[a].sum++;
          }
        }
      }
      for (let i = 0; i < dataPemenuhan.length; i++) {
        const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
        dataPemenuhan[i].precentage = percentageConvert(hitung);
      }

      break;
    default:
      break;
  }

  if (req.query.comp) {
    const comp = await companyDB.findOne({
      compName: req.query.comp,
    });
    // const logger = await loggerDB.findOne({ _id: listLogger[0] });
    const logger = await loggerDB.findOne({
      compID: comp._id,
    });
    logger.logDataRange.map((x) => {
      dataPemenuhan.push({
        name: x.name,
        sum: 0,
        precentage: 0,
      });
    });
    for (let i = 0; i < dataSensor.length; i++) {
      for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
        // const found = logger.logDataRange.find(
        //   (element) => element.name ===  dataSensor[i].dataParam[a].name
        // );
        if (
          dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
          dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
        ) {
          dataPemenuhan[a].sum++;
        }
      }
    }
    for (let i = 0; i < dataPemenuhan.length; i++) {
      const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
      dataPemenuhan[i].precentage = percentageConvert(hitung);
    }
  }
  await laporanExportService({
    dataPemenuhan,
    dataSensor,
    res,
    type: "bulanan",
    unit: "bulan",
  });
});

// DATA DOWNLOAD
router.get("/monthly-download/:id", async (req, res, next) => {
  const user = await userDB.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("User not found!");
  let dataSensor,
    listLogger,
    profile = {},
    dataPemenuhan = [];
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
    req.query.comp = req.query.comp.replace(/%20/g, " ");
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
        $lookup: {
          from: "formregiscomps",
          localField: "umum.compName",
          foreignField: "compName",
          as: "formregis",
        },
      },
      {
        $unwind: "$formregis",
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
          compPermit: "$formregis.teknis.permitNumber",
          compPermitDate: "$formregis.teknis.permitDatePublish",
          compInstance: "$compInstance",
        },
      },
    ]);

    profile = profile[0];
  }
  if (req.query.start) {
    req.query.start = req.query.start;
    req.query.end = req.query.end.substr(0, 10);
    query["$and"] = [
      {
        timestamp: {
          $gte: Number(req.query.start),
          $lte: Number(req.query.end),
        },
      },
    ];
  }
  switch (user.userRole.role) {
    case "admin":
      listLogger = await loggerDB.distinct("_id");
      for (let i = 0; i < listLogger.length; i++) {
        listLogger[i] = String(listLogger[i]);
      }
      dataSensor = await dataMonthSensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },

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
        {
          $sort: { timestamp: -1 },
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
      dataSensor = await dataMonthSensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
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

        {
          $sort: { timestamp: -1 },
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
      dataSensor = await dataMonthSensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
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
        {
          $sort: { timestamp: -1 },
        },
      ]);
      break;
    case "comp":
      profile = await userDB.aggregate([
        {
          $match: {
            userEmail: user.userEmail,
          },
        },
        { $addFields: { id: { $toObjectId: user.userRole.compID } } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        {
          $unwind: "$compDetails",
        },
        { $addFields: { id: { $toString: user.userRole.compID } } },
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
          $lookup: {
            from: "formregiscomps",
            localField: "umum.compName",
            foreignField: "compDetails.compName",
            as: "formregis",
          },
        },
        {
          $unwind: "$formregis",
        },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddres: "$compDetails.compAddress",
            latlong: "$loggerDetails.latlong",
            compTlp: "$compDetails.compTlp",
            userEmail: "$userEmail",
            compType: "$compDetails.compType",
            compWasteSource: "$compDetails.compWasteSource",
            compTech: "$compDetails.compTech",
            compPermit: "$formregis.teknis.permitNumber",
            compPermitDate: "$formregis.teknis.permitDatePublish",
            compInstance: "$compDetails.compInstance",
          },
        },
      ]);
      profile = profile[0];
      listLogger = await loggerDB.distinct("_id", {
        compID: user.userRole.compID,
      });
      for (let i = 0; i < listLogger.length; i++) {
        listLogger[i] = String(listLogger[i]);
      }
      dataSensor = await dataMonthSensorDB.aggregate([
        { $match: { loggerID: { $in: listLogger } } },
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
        {
          $sort: { timestamp: -1 },
        },
      ]);
      const logger = await loggerDB.findOne({ _id: listLogger[0] });
      logger.logDataRange.map((x) => {
        dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
      });
      for (let i = 0; i < dataSensor.length; i++) {
        for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
          // const found = logger.logDataRange.find(
          //   (element) => element.name ===  dataSensor[i].dataParam[a].name
          // );
          if (
            dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
            dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
          ) {
            dataPemenuhan[a].sum++;
          }
        }
      }
      for (let i = 0; i < dataPemenuhan.length; i++) {
        const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
        dataPemenuhan[i].precentage = percentageConvert(hitung);
      }

      break;
    default:
      break;
  }

  if (req.query.comp) {
    const comp = await companyDB.findOne({ compName: req.query.comp });
    // const logger = await loggerDB.findOne({ _id: listLogger[0] });
    const logger = await loggerDB.findOne({ compID: comp._id });
    logger.logDataRange.map((x) => {
      dataPemenuhan.push({ name: x.name, sum: 0, precentage: 0 });
    });
    for (let i = 0; i < dataSensor.length; i++) {
      for (let a = 0; a < dataSensor[i].dataParam.length; a++) {
        // const found = logger.logDataRange.find(
        //   (element) => element.name ===  dataSensor[i].dataParam[a].name
        // );
        if (
          dataSensor[i].dataParam[a].value > logger.logDataRange[a].min &&
          dataSensor[i].dataParam[a].value < logger.logDataRange[a].max
        ) {
          dataPemenuhan[a].sum++;
        }
      }
    }
    for (let i = 0; i < dataPemenuhan.length; i++) {
      const hitung = (dataPemenuhan[i].sum / dataSensor.length) * 100;
      dataPemenuhan[i].precentage = percentageConvert(hitung);
    }
  }

  for (let i = 0; i < dataSensor.length; i++) {
    const logger = await loggerDB.findOne({ _id: dataSensor[i].loggerID });
    for (let z = 0; z < logger.logDataRange.length; z++) {
      if (
        logger.logDataRange[z].min == null &&
        logger.logDataRange[z].max == null
      ) {
        if (dataSensor[i].dataParam[z].name == logger.logDataRange[z].name) {
          dataSensor[i].dataParam[z].name = dataSensor[i].dataParam[z].name;
          dataSensor[i].dataParam[z].value = "Tidak Wajib";
        }
      }
    }
  }

  res.send({ profile, dataSensor, dataPemenuhan });
});
// END DATA MONTHLY

// GET DATA SENSOR 2 MENIT UNTUK LIST PENGIRIMAN
router.get("/listpengiriman/:id", async (req, res, next) => {
  const user = await userDB.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("User not found!");
  let dataSensor,
    listLogger,
    profile,
    dataPemenuhan = [],
    reportResponse,
    query;
  let resQuery = await queryReport({ req, user, periode: "minutely" });
  profile = resQuery.profile;
  query = resQuery.query;
  query["$expr"] = {
    $lte: ["$timestamp", "$serverTimestamp"],
  };
  switch (user.userRole.role) {
    case "admin":
      reportResponse = await reportHourly({
        id: "",
        query,
        type: "admin",
        periode: "minutely",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "prov":
      reportResponse = await reportHourly({
        id: user.userRole.provID,
        query,
        type: "prov",
        periode: "minutely",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "kabkot":
      reportResponse = await reportHourly({
        id: user.userRole.kabkotID,
        query,
        type: "kabkot",
        periode: "minutely",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "comp":
      profile = await userDB.aggregate([
        {
          $match: {
            userEmail: user.userEmail,
          },
        },
        { $addFields: { id: { $toObjectId: user.userRole.compID } } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        {
          $unwind: "$compDetails",
        },
        { $addFields: { id: { $toString: user.userRole.compID } } },
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
          $lookup: {
            from: "formregiscomps",
            localField: "umum.compName",
            foreignField: "compDetails.compName",
            as: "formregis",
          },
        },
        {
          $unwind: "$formregis",
        },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddres: "$compDetails.compAddress",
            latlong: "$loggerDetails.latlong",
            compTlp: "$compDetails.compTlp",
            userEmail: "$userEmail",
            compType: "$compDetails.compType",
            compWasteSource: "$compDetails.compWasteSource",
            compTech: "$compDetails.compTech",
            compPermit: "$formregis.teknis.permitNumber",
            compPermitDate: "$formregis.teknis.permitDatePublish",
            compInstance: "$compDetails.compInstance",
          },
        },
      ]);
      profile = profile[0];
      reportResponse = await reportHourly({
        id: user.userRole.compID,
        query,
        type: "comp",
        periode: "minutely",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    default:
      break;
  }

  // for (let i = 0; i < dataSensor.length; i++) {
  //   const logger = await loggerDB.findOne({ _id: dataSensor[i].loggerID });
  //   for (let z = 0; z < logger.logDataRange.length; z++) {
  //     if (
  //       logger.logDataRange[z].min == null &&
  //       logger.logDataRange[z].max == null
  //     ) {
  //       if (dataSensor[i].dataParam[z].name == logger.logDataRange[z].name) {
  //         dataSensor[i].dataParam[z].name = dataSensor[i].dataParam[z].name;
  //         dataSensor[i].dataParam[z].value = "Tidak Wajib";
  //       }
  //     }
  //   }
  // }
  res.send({ profile, dataSensor, dataPemenuhan });
});

router.get("/listpengiriman-download/:id", async (req, res, next) => {
  const user = await userDB.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("User not found!");
  let dataSensor,
    listLogger,
    profile,
    dataPemenuhan = [],
    reportResponse,
    query;
  let resQuery = await queryReport({ req, user, periode: "minutely" });
  profile = resQuery.profile;
  query = resQuery.query;
  query["$expr"] = {
    $lte: ["$timestamp", "$serverTimestamp"],
  };

  switch (user.userRole.role) {
    case "admin":
      reportResponse = await reportHourly({
        id: "",
        query,
        type: "admin",
        periode: "minutely",
        output: "export",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "prov":
      reportResponse = await reportHourly({
        id: user.userRole.provID,
        query,
        type: "prov",
        periode: "minutely",
        output: "export",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "kabkot":
      reportResponse = await reportHourly({
        id: user.userRole.kabkotID,
        query,
        type: "kabkot",
        periode: "minutely",
        output: "export",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    case "comp":
      profile = await userDB.aggregate([
        {
          $match: {
            userEmail: user.userEmail,
          },
        },
        { $addFields: { id: { $toObjectId: user.userRole.compID } } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        {
          $unwind: "$compDetails",
        },
        { $addFields: { id: { $toString: user.userRole.compID } } },
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
          $lookup: {
            from: "formregiscomps",
            localField: "umum.compName",
            foreignField: "compDetails.compName",
            as: "formregis",
          },
        },
        {
          $unwind: "$formregis",
        },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddres: "$compDetails.compAddress",
            latlong: "$loggerDetails.latlong",
            compTlp: "$compDetails.compTlp",
            userEmail: "$userEmail",
            compType: "$compDetails.compType",
            compWasteSource: "$compDetails.compWasteSource",
            compTech: "$compDetails.compTech",
            compPermit: "$formregis.teknis.permitNumber",
            compPermitDate: "$formregis.teknis.permitDatePublish",
            compInstance: "$compDetails.compInstance",
          },
        },
      ]);
      profile = profile[0];
      reportResponse = await reportHourly({
        id: user.userRole.compID,
        query,
        type: "comp",
        periode: "minutely",
        output: "export",
      });
      listLogger = reportResponse.listLogger;
      dataSensor = reportResponse.dataSensor;
      break;
    default:
      break;
  }
  res.send({ profile, dataSensor, dataPemenuhan });
});

// returns industries, byIndustry, byTahapan for charting purpose
// ex:
// GET http://localhost:3000/report/infografis
//
router.get("/infografis", async (req, res) => {
  let terdaftar = await formRegisDB.aggregate([
    {
      $facet: {
        nDocs: [
          {
            $count: "nDocs",
          },
        ],
        groupValues: [
          {
            $group: {
              _id: "$umum.compType",
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        nDocs: {
          $arrayElemAt: ["$nDocs", 0],
        },
      },
    },
    {
      $unwind: "$groupValues",
    },
    {
      $project: {
        _id: "$groupValues._id",
        count: "$groupValues.count",
        percentage: {
          $multiply: [
            {
              $divide: ["$groupValues.count", "$nDocs.nDocs"],
            },
            100,
          ],
        },
      },
    },
  ]);

  let belum = await formRegisDB.aggregate([
    { $match: { validated: false } },
    {
      $facet: {
        nDocs: [
          {
            $count: "nDocs",
          },
        ],
        groupValues: [
          {
            $group: {
              _id: "$umum.compType",
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        nDocs: {
          $arrayElemAt: ["$nDocs", 0],
        },
      },
    },
    {
      $unwind: "$groupValues",
    },
    {
      $project: {
        _id: "$groupValues._id",
        count: "$groupValues.count",
        percentage: {
          $multiply: [
            {
              $divide: ["$groupValues.count", "$nDocs.nDocs"],
            },
            100,
          ],
        },
      },
    },
  ]);

  let terkoneksi = await formRegisDB.aggregate([
    { $match: { validated: true } },
    {
      $facet: {
        nDocs: [
          {
            $count: "nDocs",
          },
        ],
        groupValues: [
          {
            $group: {
              _id: "$umum.compType",
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        nDocs: {
          $arrayElemAt: ["$nDocs", 0],
        },
      },
    },
    {
      $unwind: "$groupValues",
    },
    {
      $project: {
        _id: "$groupValues._id",
        count: "$groupValues.count",
        percentage: {
          $multiply: [
            {
              $divide: ["$groupValues.count", "$nDocs.nDocs"],
            },
            100,
          ],
        },
      },
    },
  ]);

  let melapor = await covidDB.aggregate([
    {
      $addFields: {
        compName: {
          $function: {
            body: function (compName) {
              let data = compName.toLowerCase();
              data = data.replace(/[^a-zA-Z]+/g, "");
              return data;
            },
            args: ["$detail.compName"],
            lang: "js",
          },
        },
      },
    },
    {
      $addFields: {
        compType: "$detail.compType",
      },
    },
    {
      $group: {
        _id: { name: "$compName", type: "$detail.compType" },
      },
    },
    {
      $facet: {
        nDocs: [
          {
            $count: "nDocs",
          },
        ],
        groupValues: [
          {
            $group: {
              _id: "$_id.type",
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        nDocs: {
          $arrayElemAt: ["$nDocs", 0],
        },
      },
    },
    {
      $unwind: "$groupValues",
    },
    {
      $project: {
        _id: "$groupValues._id",
        count: "$groupValues.count",
        percentage: {
          $multiply: [
            {
              $divide: ["$groupValues.count", "$nDocs.nDocs"],
            },
            100,
          ],
        },
      },
    },
  ]);
  let byIndustry = {};
  let fill = (name, { _id, count }) => {
    let me = byIndustry;
    me[_id] = me[_id] || {};
    me[_id][name] = count;
  };

  let byCount = (a, b) => b.count - a.count;
  belum.sort(byCount).forEach(fill.bind(null, "belum"));
  terdaftar.sort(byCount).forEach(fill.bind(null, "terdaftar"));
  terkoneksi.sort(byCount).forEach(fill.bind(null, "terkoneksi"));
  melapor.sort(byCount).forEach(fill.bind(null, "melapor"));

  Object.entries(byIndustry).forEach(([key, value]) => {
    byIndustry[key] = [
      { _id: "belum", count: value.belum || 0 },
      { _id: "terdaftar", count: value.terdaftar || 0 },
      { _id: "terkoneksi", count: value.terkoneksi || 0 },
      { _id: "melapor", count: value.melapor || 0 },
    ];
  });

  res.send({
    industries: Object.keys(byIndustry).sort(),
    byIndustry,
    byTahapan: {
      terdaftar,
      belum,
      terkoneksi,
      melapor,
    },
  });
});

let queryReport = async ({ req, user, periode }) => {
  let profile = {},
    query = {};
  if (
    req.query.type == undefined &&
    req.query.prov == undefined &&
    req.query.kabkot == undefined &&
    req.query.comp == undefined
  ) {
    if (periode == "hourly") {
      query["$and"] = [
        {
          timestamp: {
            $gte: moment().startOf("days").unix(),
            $lte: moment().endOf("days").unix(),
          },
        },
      ];
    } else if (periode == "daily") {
      query["$and"] = [
        {
          timestamp: {
            $gte: moment().startOf("months").unix(),
            $lte: moment().endOf("months").unix(),
          },
        },
      ];
    } else if (periode == "monthly") {
      query["$and"] = [
        {
          timestamp: {
            $gte: moment().startOf("months").add(-1, "months").unix(),
            $lte: moment().endOf("months").add(-1, "months").unix(),
          },
        },
      ];
    } else if (periode == "minutely") {
      if (user.userRole.role === "comp") {
        query["$and"] = [
          {
            timestamp: {
              $gte: Number(moment().startOf("day").unix()),
              $lte: Number(moment().unix()),
            },
          },
        ];
      } else {
        query["$and"] = [
          {
            timestamp: {
              $gte: Number(moment().subtract(2, "minutes").unix()),
              $lte: Number(moment().unix()),
            },
          },
        ];
      }
    }
  }
  if (req.query.type) {
    query["compDetails.compType"] = req.query.type;
    if (periode == "minutely") {
      query["$and"] = [
        {
          timestamp: {
            $gte: Number(moment().subtract(1, "hours").unix()),
            $lte: Number(moment().unix()),
          },
        },
      ];
    } else {
      query["$and"] = [
        {
          timestamp: {
            $gte: Number(moment().subtract(4, "weeks").unix()),
            $lte: Number(moment().unix()),
          },
        },
      ];
    }
  }
  if (req.query.prov) {
    if (!req.query.prov == "undefined") {
      query["provDetails.provName"] = req.query.prov;
    }
    if (periode == "minutely") {
      query["$and"] = [
        {
          timestamp: {
            $gte: Number(moment().subtract(1, "hours").unix()),
            $lte: Number(moment().unix()),
          },
        },
      ];
    } else {
      query["$and"] = [
        {
          timestamp: {
            $gte: Number(moment().subtract(2, "weeks").unix()),
            $lte: Number(moment().unix()),
          },
        },
      ];
    }
  }
  if (req.query.kabkot) {
    if (!req.query.kabkot == "undefined") {
      query["kabkotDetails.kabkotName"] = req.query.kabkot;
    }
    if (periode == "minutely") {
      query["$and"] = [
        {
          timestamp: {
            $gte: Number(moment().subtract(1, "hours").unix()),
            $lte: Number(moment().unix()),
          },
        },
      ];
    } else {
      query["$and"] = [
        {
          timestamp: {
            $gte: Number(moment().subtract(4, "weeks").unix()),
            $lte: Number(moment().unix()),
          },
        },
      ];
    }
  }
  if (req.query.comp) {
    req.query.comp = req.query.comp.replace(/%20/g, " ");
    query["compDetails.compName"] = req.query.comp;
    if (periode == "minutely") {
      query["$and"] = [
        {
          timestamp: {
            $gte: Number(moment().subtract(12, "hours").unix()),
            $lte: Number(moment().unix()),
          },
        },
      ];
    } else {
      query["$and"] = [
        {
          timestamp: {
            $gte: Number(moment().subtract(1, "month").endOf("month").unix()),
            $lte: Number(moment().unix()),
          },
        },
      ];
    }
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
        $lookup: {
          from: "formregiscomps",
          localField: "umum.compName",
          foreignField: "compName",
          as: "formregis",
        },
      },
      {
        $unwind: "$formregis",
      },
      {
        $project: {
          compName: "$compName",
          compAddres: "$compAddress",
          latlong: "$loggerDetails.latlong",
          compTlp: "$compTlp",
          userEmail: "$userDetails.userEmail",
          compType: "$compType",
          compWasteSource: "$compWasteSource",
          compTech: "$compTech",
          compPermit: "$formregis.teknis.permitNumber",
          compPermitDate: "$formregis.teknis.permitDatePublish",
          compInstance: "$compInstance",
        },
      },
    ]);
    profile = profile[0];
  }
  if (req.query.start) {
    req.query.start = req.query.start;
    req.query.end = req.query.end.substr(0, 10);
    query["$and"] = [
      {
        timestamp: {
          $gte: Number(req.query.start),
          $lte: Number(req.query.end),
        },
      },
    ];
  }

  return { profile, query };
};

let reportHourly = async ({ id, query, type, periode, output }) => {
  let loggerQuery =
      type == "prov"
        ? {
            provID: id,
          }
        : type == "kabkot"
        ? {
            kabkotID: id,
          }
        : type == "comp"
        ? {
            compID: id,
          }
        : "",
    listLogger,
    db =
      periode == "hourly"
        ? dataHourlySensorDB
        : periode == "daily"
        ? dataDaySensorDB
        : periode == "minutely"
        ? dataSensorDB
        : dataMonthSensorDB,
    project =
      output == "export"
        ? {
            _id: 1,
            dataParam: {
              $function: {
                body: function (log, data, formregis) {
                  log.forEach((value, index) => {
                    if (log[index].min === null && log[index].max === null) {
                      data[index].value = "Tidak Wajib";
                    }
                  });
                  return data;
                },
                args: [
                  "$loggerDetails.logDataRange",
                  "$dataParam",
                  "$formregis.teknis",
                ],
                lang: "js",
              },
            },
            loggerID: 1,
            timestamp: 1,
            serverTimestamp: 1,
            __v: 1,
            loggerDetails: 1,
            compDetails: 1,
            kabkotDetails: 1,
            provDetails: 1,
            "formregis.frekuensi": 1,
            "formregis.teknis": 1,
          }
        : {
            _id: 1,
            dataParam: {
              $function: {
                body: function (log, data, formregis) {
                  log.forEach((value, index) => {
                    if (log[index].min === null && log[index].max === null) {
                      data[index].value = "Tidak Wajib";
                    }
                    // if (
                    //   (formregis[0].satuanDebit === "m3/hari" ||
                    //     formregis[0].satuanDebit === "m3/bulan") &&
                    //   data[index].name === "Debit"
                    // ) {
                    //   data[index].value = "Tidak Dianalisa";
                    // }
                  });
                  return data;
                },
                args: [
                  "$loggerDetails.logDataRange",
                  "$dataParam",
                  "$formregis.teknis",
                ],
                lang: "js",
              },
            },
            // loggerID: 1,
            timestamp: 1,
            serverTimestamp: 1,
            __v: 1,
            // loggerDetails: 1,
            "compDetails.compName": 1,
            "compDetails.compType": 1,
            "kabkotDetails.kabkotName": 1,
            "provDetails.provName": 1,
          },
    limit =
      output != "export"
        ? [
            {
              $project: {
                id: 0,
                id_comp: 0,
                id_kabkot: 0,
                id_prov: 0,
              },
            },
            {
              $sort: {
                timestamp: -1,
              },
            },
          ]
        : [
            {
              $project: {
                id: 0,
                id_comp: 0,
                id_kabkot: 0,
                id_prov: 0,
              },
            },
          ];
  if (type == "admin") {
    listLogger = await loggerDB.distinct("_id");
  } else {
    listLogger = await loggerDB.distinct("_id", loggerQuery);
  }
  for (let i = 0; i < listLogger.length; i++) {
    listLogger[i] = String(listLogger[i]);
  }
  let dataSensor;
  if (output == "export" && periode == "minutely") {
    let aggregateQuery = [
      { $match: { loggerID: { $in: listLogger } } },
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
        $addFields: {
          id_kabkot: { $toObjectId: "$loggerDetails.kabkotID" },
        },
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
        $lookup: {
          from: "formregiscomps",
          let: {
            compName: "$compDetails.compName",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$umum.compName", "$$compName"],
                    },
                  ],
                },
              },
            },
          ],
          as: "formregis",
        },
      },
      { $match: query },
      { $limit: 2500 },
      {
        $project: project,
      },
    ];
    aggregateQuery = aggregateQuery.concat(limit);
    let batchDataSensor = await db.aggregate(aggregateQuery);
    dataSensor = batchDataSensor;
  } else {
    let countDataSensor = await db.aggregate([
      { $match: { loggerID: { $in: listLogger } } },
      { $match: query },
      { $group: { _id: null, total: { $sum: 1 } } },
      { $project: { _id: 0 } },
    ]);
    countDataSensor = countDataSensor.length > 0 ? countDataSensor[0].total : 0;
    loopingData = parseInt(countDataSensor / 2500);
    dataSensor = [];
    for (let index = 0; index < loopingData + 1; index++) {
      let aggregateQuery = [
        { $match: { loggerID: { $in: listLogger } } },
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
          $addFields: {
            id_kabkot: { $toObjectId: "$loggerDetails.kabkotID" },
          },
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
          $lookup: {
            from: "formregiscomps",
            let: {
              compName: "$compDetails.compName",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$umum.compName", "$$compName"],
                      },
                    ],
                  },
                },
              },
            ],
            as: "formregis",
          },
        },
        { $match: query },
        { $skip: index * 2500 },
        { $limit: 2500 },
        {
          $project: project,
        },
      ];
      aggregateQuery = aggregateQuery.concat(limit);
      let batchDataSensor = await db.aggregate(aggregateQuery);
      dataSensor = batchDataSensor.concat(dataSensor);
    }
  }
  return { listLogger, dataSensor };
};

module.exports = router;
