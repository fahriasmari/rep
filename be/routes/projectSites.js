const express = require("express");
const router = express.Router();
const kabkotDB = require("../model/Kabkot");
const provDB = require("../model/Province");
const loggerDB = require("../model/Logger");
const userDB = require("../model/User");
const regisCompDB = require("../model/formRegisComp");
const dataSensorDB = require("../model/dataSensor");
const dataAdmin2minDB = require("../model/dataAdmin2min");
const dataKabkotProvDB = require("../model/dataKabkotProv2min");
var ObjectId = require('mongodb').ObjectID;
/* GET home page. */
router.get("/map/:id", async function (req, res, next) {
  const id = req.params.id;


  const user = await userDB.findOne({ _id: id });

  if (!user) return res.status(400).send("User not found!");
  let comp, zoom, centerLoc;
  let prov;
  let kabkot;
  switch (user.userRole.role) {
    case "admin":
      zoom = 5;
      centerLoc = { lat: -2.4833826, lng: 117.8902853 };
      // prov = await provDB.find();

      // kabkot = await kabkotDB.find();

      comp = await loggerDB.aggregate([
        { $addFields: { id: { $toObjectId: "$compID" }, kabkotID: { $toObjectId: "$kabkotID" }, provID: { $toObjectId: "$provID" } } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        { $unwind: "$compDetails" },
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
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetils",
          },
        },
        { $unwind: "$provDetils" },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddress: "$compDetails.compAddress",
            latlong: "$latlong",
            kabkotName: "$kabkotDetails.kabkotName",
            provName: "$provDetils.provName",
            parameterLogger: "$logDataRange",
            activationLogger: "$activationStatus"
          },
        },
      ]);



      // OLD
      // comp = await loggerDB.aggregate([
      //   { $addFields: { id: { $toObjectId: "$compID" } } },
      //   {
      //     $lookup: {
      //       from: "companies",
      //       localField: "id",
      //       foreignField: "_id",
      //       as: "compDetails",
      //     },
      //   },
      //   { $unwind: "$compDetails" },
      //   {
      //     $project: {
      //       compName: "$compDetails.compName",
      //       latlong: "$latlong",
      //       kabkotID: "$kabkotID",
      //     },
      //   },
      // ]);
      break;
    case "prov":
      zoom = 9;
      tesprov = await provDB.findOne({ _id: user.userRole.provID });
      centerLoc = { lat: tesprov.latlong.lat, lng: tesprov.latlong.lng };
      prov = [];
      // kabkot = await kabkotDB.find({ provID: user.userRole.provID });
      comp = await loggerDB.aggregate([
        { $match: { provID: user.userRole.provID } },
        { $addFields: { id: { $toObjectId: "$compID" }, kabkotID: { $toObjectId: "$kabkotID" }, provID: { $toObjectId: "$provID" } } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        { $unwind: "$compDetails" },
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
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetils",
          },
        },
        { $unwind: "$provDetils" },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddress: "$compDetails.compAddress",
            latlong: "$latlong",
            kabkotName: "$kabkotDetails.kabkotName",
            provName: "$provDetils.provName",
            parameterLogger: "$logDataRange",
            activationLogger: "$activationStatus"
          },
        },
        // {
        //   $lookup: {
        //     from: "kabkotdbs",
        //     localField: "kabkotID",
        //     foreignField: "_id",
        //     as: "kabkotDetails",
        //   },
        // },
        // { $unwind: "$kabkotDetails" },
        // {
        //   $lookup: {
        //     from: "provdbs",
        //     localField: "provID",
        //     foreignField: "_id",
        //     as: "provDetils",
        //   },
        // },
        // { $unwind: "$provDetils" },
      ]);
      break;
    case "kabkot":
      zoom = 11;
      // prov = [];
      teskabkot = await kabkotDB.findOne({ _id: user.userRole.kabkotID });
      centerLoc = { lat: teskabkot.latlong.lat, lng: teskabkot.latlong.lng };

      comp = await loggerDB.aggregate([
        { $match: { kabkotID: user.userRole.kabkotID } },
        { $addFields: { id: { $toObjectId: "$compID" }, kabkotID: { $toObjectId: "$kabkotID" }, provID: { $toObjectId: "$provID" } } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        { $unwind: "$compDetails" },
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
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetils",
          },
        },
        { $unwind: "$provDetils" },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddress: "$compDetails.compAddress",
            latlong: "$latlong",
            kabkotName: "$kabkotDetails.kabkotName",
            provName: "$provDetils.provName",
            parameterLogger: "$logDataRange",
            activationLogger: "$activationStatus"
          },
        },
      ]);
      break;
    case "comp":
      let compUseridlogin = user.userRole.compID;
      zoom = 13;
      // prov = [];
      // kabkot = [];
      comp = await loggerDB.aggregate([
        { $addFields: { id: { $toObjectId: "$compID" }, kabkotID: { $toObjectId: "$kabkotID" }, provID: { $toObjectId: "$provID" } } },
        { $match: { compID: compUseridlogin } },
        {
          $lookup: {
            from: "companies",
            localField: "id",
            foreignField: "_id",
            as: "compDetails",
          },
        },
        { $unwind: "$compDetails" },
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
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetils",
          },
        },
        { $unwind: "$provDetils" },
        {
          $project: {
            compName: "$compDetails.compName",
            compAddress: "$compDetails.compAddress",
            latlong: "$latlong",
            kabkotName: "$kabkotDetails.kabkotName",
            provName: "$provDetils.provName",
            parameterLogger: "$logDataRange",
            activationLogger: "$activationStatus"
          },
        },
      ]);


      // OLD
      // comp = await loggerDB.aggregate([
      //   { $match: { compID: user.userRole.compID } },
      //   { $addFields: { id: { $toObjectId: "$compID" } } },
      //   {
      //     $lookup: {
      //       from: "companies",
      //       localField: "id",
      //       foreignField: "_id",
      //       as: "compDetails",
      //     },
      //   },
      //   { $unwind: "$compDetails" },
      //   {
      //     $project: {
      //       compName: "$compDetails.compName",
      //       latlong: "$latlong",
      //     },
      //   },
      // ]);
      if (comp.length > 0) {
        centerLoc = { lat: comp[0].latlong.lat, lng: comp[0].latlong.lng };
      }
      break;
    default:
      break;
  }
  // res.send({ zoom, centerLoc, prov, kabkot, comp });
  let newdataComp = [];
  let newparam;
  // let newTitikPenaatan = []
  for (let i = 0; i < comp.length; i++) {
    newdataComp.push({ "_id": comp[i]._id, "compName": comp[i].compName, "compAddress": comp[i].compAddress, "latlong": comp[i].latlong, "kabkotName": comp[i].kabkotName, "provName": comp[i].provName, "activationLogger": comp[i].activationLogger, "parameterLogger": "", "titikPenaatan": "" })
    if (comp[i].activationLogger === true) {
      newdataComp[i].activationLogger = "Terkoneksi"
    }
    else {
      newdataComp[i].activationLogger = "Tidak Terkoneksi"
    }

    // for (let z = 0; z < comp[i].parameterLogger.length; z++) {

    //   if (comp[i].parameterLogger[z].min != null && comp[i].parameterLogger[z].max != null) {
    //     newparam.push({ name: comp[i].parameterLogger[z].name, min: comp[i].parameterLogger[z].min, max: comp[i].parameterLogger[z].max })
    //   }
    // }

    newdataComp[i].parameterLogger = comp[i].parameterLogger.map(function (el) {
      if (el.min != null || el.max != null) {
        return el.name
      }
    }).join(",");


    // newdataComp[i].parameterLogger = comp[i].parameterLogger.map(function (el) { return el.max }).join(",");

    // var filtered = comp[i].parameterLogger.filter(function (el) {
    //   // console.log(el.min)
    //   return el.min != null && el.max != null;
    // });

    // newdataComp[i].parameterLogger = filtered.map(function (el) { return el.name }).join(",");





    // newdataComp[i].parameterLogger = comp[i].parameterLogger.map(function (el) { return el.name }).join(",");


    // let getTitikPenaatan = await regisCompDB.findOne({ "umum.compName": new RegExp(comp[i].compName, "i") })
    // if (getTitikPenaatan != null) {

    //   newTitikPenaatan.push(getTitikPenaatan.teknis.spotList[0].spotName);
    // }

  }
  // for (let i = 0; i < newTitikPenaatan.length; i++) {
  //   newdataComp[i].titikPenaatan = newTitikPenaatan[i]
  // }
  res.send({ zoom, centerLoc, comp: newdataComp });
});

router.get("/data/:id", async (req, res) => {
  let data;

  if (req.query.filter) {
    console.log(req.query.type)
    switch (req.query.type) {
      case "admin":
        data = await dataAdmin2minDB.find().sort({ timestamp: -1 }).limit(1);
        break;
      case "prov":
        data = await dataKabkotProvDB
          .find({ provkabkotID: req.query.filter })
          .sort({ timestamp: -1 })
          .limit(1);
        break;
      case "kabkot":
        data = await dataKabkotProvDB
          .find({ provkabkotID: req.query.filter })
          .sort({ timestamp: -1 })
          .limit(1);
        break;
      case "comp":
        // const compLogger = await loggerDB.findOne({
        //   compID: req.query.filter,
        // });
        console.log(req.query.filter)
        data = await dataSensorDB
          .find({ loggerID: req.query.filter })
          .sort({ timestamp: -1 })
          .limit(1);
        break;
      default:
        break;
    }
  } else {
    const user = await userDB.findOne({ _id: req.params.id });

    switch (user.userRole.role) {
      case "admin":
        data = await dataAdmin2minDB.find().sort({ timestamp: -1 }).limit(1);
        break;
      case "prov":
        data = await dataKabkotProvDB
          .find({ provkabkotID: user.userRole.provID })
          .sort({ timestamp: -1 })
          .limit(1);
        break;
      case "kabkot":
        data = await dataKabkotProvDB
          .find({ provkabkotID: user.userRole.kabkotID })
          .sort({ timestamp: -1 })
          .limit(1);
        break;
      case "comp":
        const compLogger = await loggerDB.findOne({
          compID: user.userRole.compID,
        });

        if (compLogger) {
          data = await dataSensorDB
            .find({ loggerID: compLogger._id })
            .sort({ timestamp: -1 })
            .limit(1);
        }
        break;
      default:
        break;
    }
  }

  res.send(data);
});

module.exports = router;
