var express = require("express");
var router = express.Router();
const dataHarianDB = require("../model/dataDaySensor");
const loggerDB = require("../model/Logger");
const formRegisDB = require("../model/formRegisComp");
require("dotenv").config();
const moment = require("moment");

router.get("/list-pendaftaran", async (req, res) => {
    if (req.query.key !== "klasjhfiuUYBjBDLN341kj2jkkaj2az")
    return res.status(400).send("Key Error!");

    comp = await loggerDB.aggregate([
        { $match: { activationStatus: true } },
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
            compType: "$compDetails.compType",
            latlong: "$latlong",
            kabkotName: "$kabkotDetails.kabkotName",
            provName: "$provDetils.provName",
            parameterLogger: "$logDataRange",
            activationLogger: "$activationStatus"
          },
        },
      ]);

      res.send(comp);
})

router.get("/data-harian", async (req, res) => {
  
  let datee = req.query.date;
  let now = moment(datee, "YYYY-MM-DD").startOf("days").unix();
  let startTs = now;
  let endTs = moment.unix(now).endOf("days").unix();
  let query = {};
  

  if (req.query.key !== "klasjhfiuUYBjBDLN341kj2jkkaj2az")
    return res.status(400).send("Key Error!");
  if(datee){
    query["$and"] = [
      { timestamp: { $gte: Number(startTs) } },
      { timestamp: { $lte: Number(endTs) } },
    ];
  }
  let dataHarian = await dataHarianDB.aggregate([
    { $addFields: { id: { $toObjectId: "$loggerID"}} },
    {
      $lookup: {
        from: "loggers",
        localField: "id",
        foreignField: "_id",
        as: "loggerDetails",
      },
    },
    { $unwind: "$loggerDetails" },
    { $addFields: { compID: { $toObjectId: "$loggerDetails.compID"}} },
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
      $match: query,
    },
    {
      $addFields: {
        beban: {
          $function: {
            body: function (range) {
              let data =[];
              range.forEach((value, index) => {
                if(index != 4 && index != 0){
                  let temp = {
                    name:value.name,
                    value:(value.value*range[4].value)*0.001
                  };
                  data.push(temp);
                }
                // if (value.name == parameter) {
                  // data[value.name] = value.value;
                // }
              });
              
              return data;
            },
            args: ["$dataParam"],
            lang: "js",
          },
        },
      },
    },
    {
      $project: {
        loggerID: "$loggerDetails.loggerID",
        compName: "$compDetails.compName",
        dataParam: "$dataParam",
        bebanSensor: "$beban",
        timestamp: "$timestamp",
      },
    },
  ]);
  return res.send(dataHarian);
});

module.exports = router;