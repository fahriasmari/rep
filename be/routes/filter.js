var express = require("express");
const moment = require("moment");
let xl = require("excel4node");
const User = require("../model/User");
const Province = require("../model/Province");
const Kabkot = require("../model/Kabkot");
const Logger = require("../model/Logger");
var router = express.Router();

router.get("/provinsi/:idUser", async (req, res) => {
  const user = await User.findOne({ _id: req.params.idUser });
  let provList;
  switch (user.userRole.role) {
    case "admin":
      provList = await Province.aggregate([
        {
          $project: {
            name: "$provName",
            value: "$provName",
          },
        },
        {
          $sort: {
            name: 1,
          },
        },
      ]);
      break;
    default:
      break;
  }
  res.send({ provList });
});

router.get("/kabkot/:idUser", async (req, res) => {
  const provID = req.query.provinsi;
  const user = await User.findOne({ _id: req.params.idUser });
  let kabkotList;
  switch (user.userRole.role) {
    case "admin":
      if (provID) {
        kabkotList = await Kabkot.aggregate([
          {
            $match: {
              provID: provID,
            },
          },
          {
            $project: {
              name: "$kabkotName",
              value: "$kabkotName",
              provID: "$provID",
            },
          },
          {
            $sort: {
              name: 1,
            },
          },
        ]);
      } else {
        kabkotList = await Kabkot.aggregate([
          {
            $project: {
              name: "$kabkotName",
              value: "$kabkotName",
              provID: "$provID",
            },
          },
          {
            $sort: {
              name: 1,
            },
          },
        ]);
      }
      break;
    case "prov":
      provList = [];
      kabkotList = await Kabkot.aggregate([
        { $match: { provID: user.userRole.provID } },
        {
          $project: {
            name: "$kabkotName",
            value: "$kabkotName",
            provID: "$provID",
          },
        },
        {
          $sort: {
            name: 1,
          },
        },
      ]);
      break;
    default:
      break;
  }
  res.send({ kabkotList });
});

router.get("/company/:idUser", async (req, res) => {
  const provID = req.query.provinsi;
  const kabkotID = req.query.kabkot;
  const user = await User.findOne({ _id: req.params.idUser });
  let compList;
  switch (user.userRole.role) {
    case "admin":
      if (kabkotID) {
        compList = await Logger.aggregate([
          { $match: { kabkotID: kabkotID } },
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
          {
            $sort: {
              name: 1,
            },
          },
        ]);
      } else if (provID) {
        compList = await Logger.aggregate([
          { $match: { provID: provID } },
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
          {
            $sort: {
              name: 1,
            },
          },
        ]);
      } else {
        compList = await Logger.aggregate([
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
          {
            $sort: {
              name: 1,
            },
          },
        ]);
      }
      break;
    case "prov":
      if (kabkotID) {
        compList = await Logger.aggregate([
          { $match: { kabkotID: kabkotID } },
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
          {
            $sort: {
              name: 1,
            },
          },
        ]);
      } else {
        compList = await Logger.aggregate([
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
          {
            $sort: {
              name: 1,
            },
          },
        ]);
      }
      break;
    case "kabkot":
      compList = await Logger.aggregate([
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
        {
          $sort: {
            name: 1,
          },
        },
      ]);
      break;
    default:
      break;
  }
  res.send({ compList });
});

module.exports = router;
