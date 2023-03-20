var express = require("express");
const Logger = require("../model/Logger");
const moment = require("moment");
const excelToJson = require("convert-excel-to-json");
const User = require("../model/User");
const kalibrasi = require("../model/kalibrasi");
const errorKalibrasi = require("../model/errorKalibrasi");
const formRegisComp = require("../model/formRegisComp");
let xl = require("excel4node");
var router = express.Router();

router.post("/input", async (req, res) => {
  const dataKalibrasi = req.body;
  const checkLogger = await Logger.findOne({
    _id: dataKalibrasi.loggerID,
  });
  if (!checkLogger) {
    return res.send("Logger tidak ditemukan");
  }
  let json = excelToJson({
    sourceFile: __basedir + "/public" + req.body.fileKalibrasi,
    range: "A4:H8",
    header: {
      rows: 3,
    },
    columnToKey: {
      A: "no",
      B: "parameter",
      C: "brand",
      D: "type",
      E: "akurasi",
      F: "tanggalKalibrasi",
      G: "min",
      H: "max",
    },
  });
  let data = [];
  const now = moment().unix();
  json.data.forEach((value) => {
    let d = value.tanggalKalibrasi.substr(0, 2);
    let m = value.tanggalKalibrasi.substr(3, 2);
    let y = value.tanggalKalibrasi.substr(6, 4);
    let fulltime = value.tanggalKalibrasi.substr(-9);
    let time = fulltime.substr(0, 6);
    let newDate = y + "/" + m + "/" + d + time + ":00";
    let temporary = {
      loggerID: req.body.loggerID,
      parameter:
        value.parameter == 0
          ? "pH"
          : value.parameter == 1
          ? "COD"
          : value.parameter == 2
          ? "TSS"
          : value.parameter == 3
          ? "NH3N"
          : "Debit",
      brand: value.brand,
      type: value.type,
      akurasi: value.akurasi,
      min: value.min,
      max: value.max,
      tanggalKalibrasi: moment(new Date(newDate)).unix(),
      fileKalibrasi: req.body.fileKalibrasi,
      timestamp: now,
      status: "waiting",
    };
    data.push(temporary);
  });
  const save = await kalibrasi.insertMany(data);
  res.send(save);
});

router.post("/", async (req, res) => {
  const { loggerID, dataKalibrasi } = req.body;
  const checkLogger = await Logger.findOne({
    _id: loggerID,
  });
  if (!checkLogger) {
    return res.send("Logger tidak ditemukan");
  }
  let data = [];
  const now = moment().unix();
  dataKalibrasi.forEach((value) => {
    let d = value.tanggalKalibrasi.substr(0, 2);
    let m = value.tanggalKalibrasi.substr(3, 2);
    let y = value.tanggalKalibrasi.substr(6, 4);
    let fulltime = value.tanggalKalibrasi.substr(-9);
    let time = fulltime.substr(0, 6);
    let newDate = y + "/" + m + "/" + d + time + ":00";
    let temporary = {
      loggerID,
      parameter:
        value.parameter == 0
          ? "pH"
          : value.parameter == 1
          ? "COD"
          : value.parameter == 2
          ? "TSS"
          : value.parameter == 3
          ? "NH3N"
          : "Debit",
      brand: value.brand,
      type: value.type,
      akurasi: value.akurasi,
      min: value.min,
      max: value.max,
      tanggalKalibrasi: moment(new Date(newDate)).unix(),
      fileKalibrasi: value.fileKalibrasi,
      timestamp: now,
      status: "waiting",
    };
    data.push(temporary);
  });
  const save = await kalibrasi.insertMany(data);
  res.send(save);
});

router.get("/:idUser", async (req, res) => {
  const id = req.params.idUser;
  const { prov, kabkot, comp, type } = req.query;
  let query = {};
  if (type) {
    query["company.compType"] = type;
  }
  if (prov) {
    query["logger.provID"] = prov;
  }
  if (kabkot) {
    query["logger.kabkotID"] = kabkot;
  }
  if (comp) {
    query["logger.compID"] = comp;
  }
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.send("user tidak ditemukan");
  }
  let logger;
  let dataKalibrasi;
  if (user.userRole.role == "admin") {
    logger = await Logger.find();
    dataKalibrasi = await kalibrasi.aggregate([
      { $addFields: { loggerObjId: { $toObjectId: "$loggerID" } } },
      {
        $lookup: {
          from: "loggers",
          localField: "loggerObjId",
          foreignField: "_id",
          as: "logger",
        },
      },
      {
        $unwind: "$logger",
      },
      { $addFields: { compObjId: { $toObjectId: "$logger.compID" } } },
      {
        $lookup: {
          from: "companies",
          localField: "compObjId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $match: query,
      },
      {
        $unwind: "$company",
      },
      { $addFields: { provObjId: { $toObjectId: "$logger.provID" } } },
      {
        $lookup: {
          from: "provdbs",
          localField: "provObjId",
          foreignField: "_id",
          as: "prov",
        },
      },
      {
        $unwind: "$prov",
      },
      { $addFields: { kabkotObjId: { $toObjectId: "$logger.kabkotID" } } },
      {
        $lookup: {
          from: "kabkotdbs",
          localField: "kabkotObjId",
          foreignField: "_id",
          as: "kabkot",
        },
      },
      {
        $unwind: "$kabkot",
      },
      {
        $addFields: {
          jadwalKalibrasi: {
            $function: {
              body: function (range, parameter) {
                let data;
                range.forEach((value, index) => {
                  if (value.name == parameter) {
                    if (value.jadwalKalibrasi === null) {
                      data = "-";
                    } else {
                      data = value.jadwalKalibrasi.toString() + " bulan sekali";
                    }
                  }
                });
                return data;
              },
              args: ["$logger.logDataRange", "$parameter"],
              lang: "js",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            loggerID: "$loggerID",
            timestamp: "$timestamp",
            compName: "$company.compName",
            compType: "$company.compType",
            provName: "$prov.provName",
            kabkotName: "$kabkot.kabkotName",
          },
          parameter: { $push: "$parameter" },
          brand: { $push: "$brand" },
          type: { $push: "$type" },
          akurasi: { $push: "$akurasi" },
          min: { $push: "$min" },
          max: { $push: "$max" },
          tanggalKalibrasi: { $push: "$tanggalKalibrasi" },
          fileKalibrasi: { $push: "$fileKalibrasi" },
          status: { $push: "$status" },
          jadwalKalibrasi: {
            $push: "$jadwalKalibrasi",
          },
        },
      },
    ]);
  } else if (user.userRole.role == "prov") {
    logger = await Logger.find({ provID: user.userRole.provID });
    dataKalibrasi = await kalibrasi.aggregate([
      { $addFields: { loggerObjId: { $toObjectId: "$loggerID" } } },
      {
        $lookup: {
          from: "loggers",
          localField: "loggerObjId",
          foreignField: "_id",
          as: "logger",
        },
      },
      {
        $unwind: "$logger",
      },
      { $addFields: { compObjId: { $toObjectId: "$logger.compID" } } },
      {
        $lookup: {
          from: "companies",
          localField: "compObjId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: "$company",
      },
      {
        $match: query,
      },
      { $addFields: { provObjId: { $toObjectId: "$logger.provID" } } },
      {
        $lookup: {
          from: "provdbs",
          localField: "provObjId",
          foreignField: "_id",
          as: "prov",
        },
      },
      {
        $unwind: "$prov",
      },
      { $addFields: { kabkotObjId: { $toObjectId: "$logger.kabkotID" } } },
      {
        $lookup: {
          from: "kabkotdbs",
          localField: "kabkotObjId",
          foreignField: "_id",
          as: "kabkot",
        },
      },
      {
        $unwind: "$kabkot",
      },
      {
        $match: {
          "logger.provID": user.userRole.provID,
        },
      },
      {
        $addFields: {
          jadwalKalibrasi: {
            $function: {
              body: function (range, parameter) {
                let data;
                range.forEach((value, index) => {
                  if (value.name == parameter) {
                    if (value.jadwalKalibrasi === null) {
                      data = "-";
                    } else {
                      data = value.jadwalKalibrasi.toString() + " bulan sekali";
                    }
                  }
                });
                return data;
              },
              args: ["$logger.logDataRange", "$parameter"],
              lang: "js",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            loggerID: "$loggerID",
            timestamp: "$timestamp",
            compName: "$company.compName",
            compType: "$company.compType",
            provName: "$prov.provName",
            kabkotName: "$kabkot.kabkotName",
          },
          parameter: { $push: "$parameter" },
          brand: { $push: "$brand" },
          type: { $push: "$type" },
          akurasi: { $push: "$akurasi" },
          min: { $push: "$min" },
          max: { $push: "$max" },
          tanggalKalibrasi: { $push: "$tanggalKalibrasi" },
          fileKalibrasi: { $push: "$fileKalibrasi" },
          status: { $push: "$status" },
          jadwalKalibrasi: {
            $push: "$jadwalKalibrasi",
          },
        },
      },
    ]);
  } else if (user.userRole.role == "kabkot") {
    logger = await Logger.find({ kabkotID: user.userRole.kabkotID });
    dataKalibrasi = await kalibrasi.aggregate([
      { $addFields: { loggerObjId: { $toObjectId: "$loggerID" } } },
      {
        $lookup: {
          from: "loggers",
          localField: "loggerObjId",
          foreignField: "_id",
          as: "logger",
        },
      },
      {
        $unwind: "$logger",
      },
      { $addFields: { compObjId: { $toObjectId: "$logger.compID" } } },
      {
        $lookup: {
          from: "companies",
          localField: "compObjId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: "$company",
      },
      {
        $match: query,
      },
      { $addFields: { provObjId: { $toObjectId: "$logger.provID" } } },
      {
        $lookup: {
          from: "provdbs",
          localField: "provObjId",
          foreignField: "_id",
          as: "prov",
        },
      },
      {
        $unwind: "$prov",
      },
      { $addFields: { kabkotObjId: { $toObjectId: "$logger.kabkotID" } } },
      {
        $lookup: {
          from: "kabkotdbs",
          localField: "kabkotObjId",
          foreignField: "_id",
          as: "kabkot",
        },
      },
      {
        $unwind: "$kabkot",
      },
      {
        $match: {
          "logger.kabkotID": user.userRole.kabkotID,
        },
      },
      {
        $addFields: {
          jadwalKalibrasi: {
            $function: {
              body: function (range, parameter) {
                let data;
                range.forEach((value, index) => {
                  if (value.name == parameter) {
                    if (value.jadwalKalibrasi === null) {
                      data = "-";
                    } else {
                      data = value.jadwalKalibrasi.toString() + " bulan sekali";
                    }
                  }
                });
                return data;
              },
              args: ["$logger.logDataRange", "$parameter"],
              lang: "js",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            loggerID: "$loggerID",
            timestamp: "$timestamp",
            compName: "$company.compName",
            compType: "$company.compType",
            provName: "$prov.provName",
            kabkotName: "$kabkot.kabkotName",
          },
          parameter: { $push: "$parameter" },
          brand: { $push: "$brand" },
          type: { $push: "$type" },
          akurasi: { $push: "$akurasi" },
          min: { $push: "$min" },
          max: { $push: "$max" },
          tanggalKalibrasi: { $push: "$tanggalKalibrasi" },
          fileKalibrasi: { $push: "$fileKalibrasi" },
          status: { $push: "$status" },
          jadwalKalibrasi: {
            $push: "$jadwalKalibrasi",
          },
        },
      },
    ]);
  } else if (user.userRole.role == "comp") {
    logger = await Logger.findOne({ compID: user.userRole.compID });
    dataKalibrasi = await kalibrasi.aggregate([
      {
        $match: { loggerID: logger._id.toString() },
      },
      { $addFields: { loggerObjId: { $toObjectId: "$loggerID" } } },
      {
        $lookup: {
          from: "loggers",
          localField: "loggerObjId",
          foreignField: "_id",
          as: "logger",
        },
      },
      {
        $unwind: "$logger",
      },
      { $addFields: { compObjId: { $toObjectId: "$logger.compID" } } },
      {
        $lookup: {
          from: "companies",
          localField: "compObjId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: "$company",
      },
      {
        $match: query,
      },
      { $addFields: { provObjId: { $toObjectId: "$logger.provID" } } },
      {
        $lookup: {
          from: "provdbs",
          localField: "provObjId",
          foreignField: "_id",
          as: "prov",
        },
      },
      {
        $unwind: "$prov",
      },
      { $addFields: { kabkotObjId: { $toObjectId: "$logger.kabkotID" } } },
      {
        $lookup: {
          from: "kabkotdbs",
          localField: "kabkotObjId",
          foreignField: "_id",
          as: "kabkot",
        },
      },
      {
        $unwind: "$kabkot",
      },
      {
        $addFields: {
          jadwalKalibrasi: {
            $function: {
              body: function (range, parameter) {
                let data;
                range.forEach((value, index) => {
                  if (value.name == parameter) {
                    if (value.jadwalKalibrasi === null) {
                      data = "-";
                    } else {
                      data = value.jadwalKalibrasi.toString() + " bulan sekali";
                    }
                  }
                });
                return data;
              },
              args: ["$logger.logDataRange", "$parameter"],
              lang: "js",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            loggerID: "$loggerID",
            timestamp: "$timestamp",
            compName: "$company.compName",
            compType: "$company.compType",
            provName: "$prov.provName",
            kabkotName: "$kabkot.kabkotName",
          },
          parameter: { $push: "$parameter" },
          brand: { $push: "$brand" },
          type: { $push: "$type" },
          akurasi: { $push: "$akurasi" },
          min: { $push: "$min" },
          max: { $push: "$max" },
          tanggalKalibrasi: { $push: "$tanggalKalibrasi" },
          fileKalibrasi: { $push: "$fileKalibrasi" },
          status: { $push: "$status" },
          jadwalKalibrasi: {
            $push: "$jadwalKalibrasi",
          },
        },
      },
    ]);
  }
  const fulldata = [];
  for (let index = 0; index < dataKalibrasi.length; index++) {
    const val = dataKalibrasi[index];
    const parameter = [];
    for (let i = 0; i < val.parameter.length; i++) {
      const parameterDetail = {
        name: val.parameter[i],
        brand: val.brand[i],
        type: val.type[i],
        akurasi: val.akurasi[i],
        min: val.min[i],
        max: val.max[i],
        tanggalKalibrasi: val.tanggalKalibrasi[i],
        fileKalibrasi: val.fileKalibrasi[i],
        status: val.status[i],
        jadwalKalibrasi: val.jadwalKalibrasi[i],
      };
      parameter.push(parameterDetail);
    }
    const data = {
      ...val._id,
      parameter,
    };
    fulldata.push(data);
  }
  return res.send(fulldata);
});

router.put("/validasi", async (req, res) => {
  const data = req.body;
  const dataKalibrasi = await kalibrasi.find({
    loggerID: data.loggerID,
    timestamp: data.timestamp,
    status: "waiting",
  });
  if (dataKalibrasi.length == 0) {
    return res.send("Data uji kalibrasi tidak ditemukan");
  }
  for (let i = 0; i < dataKalibrasi.length; i++) {
    await kalibrasi.findOneAndUpdate(
      { _id: dataKalibrasi[i] },
      { status: data.status }
    );
    if (data.status == "accepted") {
      let logger = await Logger.aggregate([
        { $addFields: { id: { $toString: "$_id" } } },
        { $match: { id: data.loggerID } },
        { $addFields: { compObjID: { $toObjectId: "$compID" } } },
        {
          $lookup: {
            from: "companies",
            localField: "compObjID",
            foreignField: "_id",
            as: "comp",
          },
        },
        {
          $unwind: "$comp",
        },
        {
          $lookup: {
            from: "formregiscomps",
            localField: "comp.compName",
            foreignField: "umum.compName",
            as: "formregis",
          },
        },
        {
          $unwind: "$formregis",
        },
        {
          $project: {
            _id: 1,
            logDataRange: 1,
            compID: 1,
            kabkotID: 1,
            provID: 1,
            latlong: 1,
            errCounter: 1,
            activationStatus: 1,
            "formregis._id": 1,
          },
        },
      ]);
      logger = logger[0];
      if (dataKalibrasi[i].parameter == "pH") {
        await Logger.findOneAndUpdate(
          { _id: data.loggerID, "logDataRange.name": "pH" },
          {
            "logDataRange.$.tanggalKalibrasi":
              dataKalibrasi[i].tanggalKalibrasi,
            "logDataRange.$.nextKalibrasi": moment(
              dataKalibrasi[i].tanggalKalibrasi * 1000
            )
              .add(parseInt(logger.logDataRange[0].jadwalKalibrasi) + 2, "M")
              .unix(),
          }
        );
        await errorKalibrasi.findOneAndUpdate(
          {
            loggerID: data.loggerID,
            errorMsg: "Silahkan kalibrasi sensor pH",
            status: false,
          },
          {
            status: true,
          }
        );
      } else if (dataKalibrasi[i].parameter == "COD") {
        await Logger.findOneAndUpdate(
          { _id: data.loggerID, "logDataRange.name": "COD" },
          {
            "logDataRange.$.tanggalKalibrasi":
              dataKalibrasi[i].tanggalKalibrasi,
            "logDataRange.$.nextKalibrasi": moment(
              dataKalibrasi[i].tanggalKalibrasi * 1000
            )
              .add(parseInt(logger.logDataRange[1].jadwalKalibrasi) + 2, "M")
              .unix(),
          }
        );
        await errorKalibrasi.findOneAndUpdate(
          {
            loggerID: data.loggerID,
            errorMsg: "Silahkan kalibrasi sensor COD",
            status: false,
          },
          {
            status: true,
          }
        );
      } else if (dataKalibrasi[i].parameter == "TSS") {
        await Logger.findOneAndUpdate(
          { _id: data.loggerID, "logDataRange.name": "TSS" },
          {
            "logDataRange.$.tanggalKalibrasi":
              dataKalibrasi[i].tanggalKalibrasi,
            "logDataRange.$.nextKalibrasi": moment(
              dataKalibrasi[i].tanggalKalibrasi * 1000
            )
              .add(parseInt(logger.logDataRange[2].jadwalKalibrasi) + 2, "M")
              .unix(),
          }
        );
        await errorKalibrasi.findOneAndUpdate(
          {
            loggerID: data.loggerID,
            errorMsg: "Silahkan kalibrasi sensor TSS",
            status: false,
          },
          {
            status: true,
          }
        );
      } else if (dataKalibrasi[i].parameter == "NH3N") {
        await Logger.findOneAndUpdate(
          { _id: data.loggerID, "logDataRange.name": "NH3N" },
          {
            "logDataRange.$.tanggalKalibrasi":
              dataKalibrasi[i].tanggalKalibrasi,
            "logDataRange.$.nextKalibrasi": moment(
              dataKalibrasi[i].tanggalKalibrasi * 1000
            )
              .add(parseInt(logger.logDataRange[3].jadwalKalibrasi) + 2, "M")
              .unix(),
          }
        );
        await errorKalibrasi.findOneAndUpdate(
          {
            loggerID: data.loggerID,
            errorMsg: "Silahkan kalibrasi sensor NH3N",
            status: false,
          },
          {
            status: true,
          }
        );
      } else if (dataKalibrasi[i].parameter == "Debit") {
        await Logger.findOneAndUpdate(
          { _id: data.loggerID, "logDataRange.name": "Debit" },
          {
            "logDataRange.$.tanggalKalibrasi":
              dataKalibrasi[i].tanggalKalibrasi,
            "logDataRange.$.nextKalibrasi": moment(
              dataKalibrasi[i].tanggalKalibrasi * 1000
            )
              .add(parseInt(logger.logDataRange[4].jadwalKalibrasi) + 2, "M")
              .unix(),
          }
        );
        await errorKalibrasi.findOneAndUpdate(
          {
            loggerID: data.loggerID,
            errorMsg: "Silahkan kalibrasi sensor Debit",
            status: false,
          },
          {
            status: true,
          }
        );
      }
    }
  }
  return res.send("Data berhasil di validasi");
});

router.get("/export/:idUser", async (req, res) => {
  const id = req.params.idUser;
  const { prov, kabkot, comp, type } = req.query;
  let query = {};
  if (type) {
    query["company.compType"] = type;
  }
  if (prov) {
    query["logger.provID"] = prov;
  }
  if (kabkot) {
    query["logger.kabkotID"] = kabkot;
  }
  if (comp) {
    query["logger.compID"] = comp;
  }
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.send("user tidak ditemukan");
  }
  let logger;
  let dataKalibrasi;
  if (user.userRole.role == "admin") {
    logger = await Logger.find();
    dataKalibrasi = await kalibrasi.aggregate([
      { $addFields: { loggerObjId: { $toObjectId: "$loggerID" } } },
      {
        $lookup: {
          from: "loggers",
          localField: "loggerObjId",
          foreignField: "_id",
          as: "logger",
        },
      },
      {
        $unwind: "$logger",
      },
      { $addFields: { compObjId: { $toObjectId: "$logger.compID" } } },
      {
        $lookup: {
          from: "companies",
          localField: "compObjId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $match: query,
      },
      {
        $unwind: "$company",
      },
      { $addFields: { provObjId: { $toObjectId: "$logger.provID" } } },
      {
        $lookup: {
          from: "provdbs",
          localField: "provObjId",
          foreignField: "_id",
          as: "prov",
        },
      },
      {
        $unwind: "$prov",
      },
      { $addFields: { kabkotObjId: { $toObjectId: "$logger.kabkotID" } } },
      {
        $lookup: {
          from: "kabkotdbs",
          localField: "kabkotObjId",
          foreignField: "_id",
          as: "kabkot",
        },
      },
      {
        $unwind: "$kabkot",
      },
      {
        $addFields: {
          jadwalKalibrasi: {
            $function: {
              body: function (range, parameter) {
                let data;
                range.forEach((value, index) => {
                  if (value.name == parameter) {
                    if (value.jadwalKalibrasi === null) {
                      data = "-";
                    } else {
                      data = value.jadwalKalibrasi.toString() + " bulan sekali";
                    }
                  }
                });
                return data;
              },
              args: ["$logger.logDataRange", "$parameter"],
              lang: "js",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            loggerID: "$loggerID",
            timestamp: "$timestamp",
            compName: "$company.compName",
            compType: "$company.compType",
            provName: "$prov.provName",
            kabkotName: "$kabkot.kabkotName",
          },
          parameter: { $push: "$parameter" },
          brand: { $push: "$brand" },
          type: { $push: "$type" },
          akurasi: { $push: "$akurasi" },
          min: { $push: "$min" },
          max: { $push: "$max" },
          tanggalKalibrasi: { $push: "$tanggalKalibrasi" },
          fileKalibrasi: { $push: "$fileKalibrasi" },
          status: { $push: "$status" },
          jadwalKalibrasi: {
            $push: "$jadwalKalibrasi",
          },
        },
      },
    ]);
  } else if (user.userRole.role == "prov") {
    logger = await Logger.find({ provID: user.userRole.provID });
    dataKalibrasi = await kalibrasi.aggregate([
      { $addFields: { loggerObjId: { $toObjectId: "$loggerID" } } },
      {
        $lookup: {
          from: "loggers",
          localField: "loggerObjId",
          foreignField: "_id",
          as: "logger",
        },
      },
      {
        $unwind: "$logger",
      },
      { $addFields: { compObjId: { $toObjectId: "$logger.compID" } } },
      {
        $lookup: {
          from: "companies",
          localField: "compObjId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: "$company",
      },
      {
        $match: query,
      },
      { $addFields: { provObjId: { $toObjectId: "$logger.provID" } } },
      {
        $lookup: {
          from: "provdbs",
          localField: "provObjId",
          foreignField: "_id",
          as: "prov",
        },
      },
      {
        $unwind: "$prov",
      },
      { $addFields: { kabkotObjId: { $toObjectId: "$logger.kabkotID" } } },
      {
        $lookup: {
          from: "kabkotdbs",
          localField: "kabkotObjId",
          foreignField: "_id",
          as: "kabkot",
        },
      },
      {
        $unwind: "$kabkot",
      },
      {
        $match: {
          "logger.provID": user.userRole.provID,
        },
      },
      {
        $addFields: {
          jadwalKalibrasi: {
            $function: {
              body: function (range, parameter) {
                let data;
                range.forEach((value, index) => {
                  if (value.name == parameter) {
                    if (value.jadwalKalibrasi === null) {
                      data = "-";
                    } else {
                      data = value.jadwalKalibrasi.toString() + " bulan sekali";
                    }
                  }
                });
                return data;
              },
              args: ["$logger.logDataRange", "$parameter"],
              lang: "js",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            loggerID: "$loggerID",
            timestamp: "$timestamp",
            compName: "$company.compName",
            compType: "$company.compType",
            provName: "$prov.provName",
            kabkotName: "$kabkot.kabkotName",
          },
          parameter: { $push: "$parameter" },
          brand: { $push: "$brand" },
          type: { $push: "$type" },
          akurasi: { $push: "$akurasi" },
          min: { $push: "$min" },
          max: { $push: "$max" },
          tanggalKalibrasi: { $push: "$tanggalKalibrasi" },
          fileKalibrasi: { $push: "$fileKalibrasi" },
          status: { $push: "$status" },
          jadwalKalibrasi: {
            $push: "$jadwalKalibrasi",
          },
        },
      },
    ]);
  } else if (user.userRole.role == "kabkot") {
    logger = await Logger.find({ kabkotID: user.userRole.kabkotID });
    dataKalibrasi = await kalibrasi.aggregate([
      { $addFields: { loggerObjId: { $toObjectId: "$loggerID" } } },
      {
        $lookup: {
          from: "loggers",
          localField: "loggerObjId",
          foreignField: "_id",
          as: "logger",
        },
      },
      {
        $unwind: "$logger",
      },
      { $addFields: { compObjId: { $toObjectId: "$logger.compID" } } },
      {
        $lookup: {
          from: "companies",
          localField: "compObjId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: "$company",
      },
      {
        $match: query,
      },
      { $addFields: { provObjId: { $toObjectId: "$logger.provID" } } },
      {
        $lookup: {
          from: "provdbs",
          localField: "provObjId",
          foreignField: "_id",
          as: "prov",
        },
      },
      {
        $unwind: "$prov",
      },
      { $addFields: { kabkotObjId: { $toObjectId: "$logger.kabkotID" } } },
      {
        $lookup: {
          from: "kabkotdbs",
          localField: "kabkotObjId",
          foreignField: "_id",
          as: "kabkot",
        },
      },
      {
        $unwind: "$kabkot",
      },
      {
        $match: {
          "logger.kabkotID": user.userRole.kabkotID,
        },
      },
      {
        $addFields: {
          jadwalKalibrasi: {
            $function: {
              body: function (range, parameter) {
                let data;
                range.forEach((value, index) => {
                  if (value.name == parameter) {
                    if (value.jadwalKalibrasi === null) {
                      data = "-";
                    } else {
                      data = value.jadwalKalibrasi.toString() + " bulan sekali";
                    }
                  }
                });
                return data;
              },
              args: ["$logger.logDataRange", "$parameter"],
              lang: "js",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            loggerID: "$loggerID",
            timestamp: "$timestamp",
            compName: "$company.compName",
            compType: "$company.compType",
            provName: "$prov.provName",
            kabkotName: "$kabkot.kabkotName",
          },
          parameter: { $push: "$parameter" },
          brand: { $push: "$brand" },
          type: { $push: "$type" },
          akurasi: { $push: "$akurasi" },
          min: { $push: "$min" },
          max: { $push: "$max" },
          tanggalKalibrasi: { $push: "$tanggalKalibrasi" },
          fileKalibrasi: { $push: "$fileKalibrasi" },
          status: { $push: "$status" },
          jadwalKalibrasi: {
            $push: "$jadwalKalibrasi",
          },
        },
      },
    ]);
  } else if (user.userRole.role == "comp") {
    logger = await Logger.findOne({ compID: user.userRole.compID });
    dataKalibrasi = await kalibrasi.aggregate([
      {
        $match: { loggerID: logger._id.toString() },
      },
      { $addFields: { loggerObjId: { $toObjectId: "$loggerID" } } },
      {
        $lookup: {
          from: "loggers",
          localField: "loggerObjId",
          foreignField: "_id",
          as: "logger",
        },
      },
      {
        $unwind: "$logger",
      },
      { $addFields: { compObjId: { $toObjectId: "$logger.compID" } } },
      {
        $lookup: {
          from: "companies",
          localField: "compObjId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: "$company",
      },
      {
        $match: query,
      },
      { $addFields: { provObjId: { $toObjectId: "$logger.provID" } } },
      {
        $lookup: {
          from: "provdbs",
          localField: "provObjId",
          foreignField: "_id",
          as: "prov",
        },
      },
      {
        $unwind: "$prov",
      },
      { $addFields: { kabkotObjId: { $toObjectId: "$logger.kabkotID" } } },
      {
        $lookup: {
          from: "kabkotdbs",
          localField: "kabkotObjId",
          foreignField: "_id",
          as: "kabkot",
        },
      },
      {
        $unwind: "$kabkot",
      },
      {
        $addFields: {
          jadwalKalibrasi: {
            $function: {
              body: function (range, parameter) {
                let data;
                range.forEach((value, index) => {
                  if (value.name == parameter) {
                    if (value.jadwalKalibrasi === null) {
                      data = "-";
                    } else {
                      data = value.jadwalKalibrasi.toString() + " bulan sekali";
                    }
                  }
                });
                return data;
              },
              args: ["$logger.logDataRange", "$parameter"],
              lang: "js",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            loggerID: "$loggerID",
            timestamp: "$timestamp",
            compName: "$company.compName",
            compType: "$company.compType",
            provName: "$prov.provName",
            kabkotName: "$kabkot.kabkotName",
          },
          parameter: { $push: "$parameter" },
          brand: { $push: "$brand" },
          type: { $push: "$type" },
          akurasi: { $push: "$akurasi" },
          min: { $push: "$min" },
          max: { $push: "$max" },
          tanggalKalibrasi: { $push: "$tanggalKalibrasi" },
          fileKalibrasi: { $push: "$fileKalibrasi" },
          status: { $push: "$status" },
          jadwalKalibrasi: {
            $push: "$jadwalKalibrasi",
          },
        },
      },
    ]);
  }
  const fulldata = [];
  for (let index = 0; index < dataKalibrasi.length; index++) {
    const val = dataKalibrasi[index];
    const parameter = [];
    for (let i = 0; i < val.parameter.length; i++) {
      const parameterDetail = {
        name: val.parameter[i],
        brand: val.brand[i],
        type: val.type[i],
        akurasi: val.akurasi[i],
        min: val.min[i],
        max: val.max[i],
        tanggalKalibrasi: val.tanggalKalibrasi[i],
        fileKalibrasi: val.fileKalibrasi[i],
        status: val.status[i],
        jadwalKalibrasi: val.jadwalKalibrasi[i],
      };
      parameter.push(parameterDetail);
    }
    const data = {
      ...val._id,
      parameter,
    };
    fulldata.push(data);
  }
  dataKalibrasi = fulldata;
  var wb = new xl.Workbook();
  var ws = wb.addWorksheet("Data Uji Kalibrasi");
  var style = wb.createStyle({
    font: {
      bold: true,
    },
    alignment: {
      wrapText: true,
      horizontal: "center",
      vertical: "center",
    },
  });
  var valStyle = wb.createStyle({
    alignment: {
      wrapText: true,
      horizontal: "center",
      vertical: "center",
    },
  });
  let col = 1;
  ws.cell(col, 1, col, 13, true).string("Uji Kalibrasi").style(style);
  ws.cell(col + 1, 1, col + 2, 1, true)
    .string("No")
    .style(style);
  ws.cell(col + 1, 2, col + 2, 2, true)
    .string("Nama Industri")
    .style(style);
  ws.cell(col + 1, 3, col + 2, 3, true)
    .string("Jenis Industri")
    .style(style);
  ws.cell(col + 1, 4, col + 2, 4, true)
    .string("Provinsi")
    .style(style);
  ws.cell(col + 1, 5, col + 2, 5, true)
    .string("Kabupaten/Kota")
    .style(style);
  ws.cell(col + 1, 6, col + 2, 6, true)
    .string("Jenis Sensor")
    .style(style);
  ws.cell(col + 1, 7, col + 2, 7, true)
    .string("Brand Sensor")
    .style(style);
  ws.cell(col + 1, 8, col + 2, 8, true)
    .string("Tipe Sensor")
    .style(style);
  ws.cell(col + 1, 9, col + 2, 9, true)
    .string("Akurasi Sensor")
    .style(style);
  ws.cell(col + 1, 10, col + 2, 10, true)
    .string("Waktu Kalibrasi")
    .style(style);
  ws.cell(col + 1, 11, col + 1, 12, true)
    .string("Rentang Ukur")
    .style(style);
  ws.cell(col + 2, 11)
    .string("Min")
    .style(style);
  ws.cell(col + 2, 12)
    .string("Max")
    .style(style);
  ws.cell(col + 1, 13, col + 2, 13, true)
    .string("Jadwal Kalibrasi")
    .style(style);

  for (let i = 0, col = 4; i < dataKalibrasi.length; i++) {
    let value = dataKalibrasi[i];
    let dataLength = value.parameter.length;
    ws.cell(col, 1, col + dataLength - 1, 1, true)
      .string((i + 1).toString())
      .style(valStyle);
    ws.cell(col, 2, col + dataLength - 1, 2, true)
      .string(value.compName)
      .style(valStyle);
    ws.cell(col, 3, col + dataLength - 1, 3, true)
      .string(value.compType)
      .style(valStyle);
    ws.cell(col, 4, col + dataLength - 1, 4, true)
      .string(value.provName)
      .style(valStyle);
    ws.cell(col, 5, col + dataLength - 1, 5, true)
      .string(value.kabkotName)
      .style(valStyle);
    for (let j = 0; j < dataLength; j++) {
      ws.cell(col + j, 6).string(value.parameter[j].name);
      ws.cell(col + j, 7).string(value.parameter[j].brand);
      ws.cell(col + j, 8).string(value.parameter[j].type);
      ws.cell(col + j, 9).string(value.parameter[j].akurasi);
      ws.cell(col + j, 10).string(
        moment(value.parameter[j].tanggalKalibrasi * 1000).format(
          "DD MMM YYYY, HH:mm"
        )
      );
      ws.cell(col + j, 11).string(value.parameter[j].min);
      ws.cell(col + j, 12).string(value.parameter[j].max);
      ws.cell(col + j, 13).string(value.parameter[j].jadwalKalibrasi);
      // if (j + 1 == dataLength) {
      //   col = col + j + 1;
      // }
    }
    col = col + dataLength;
  }
  wb.write(`Laporan Uji Kalibrasi.xlsx`, res);
  // return res.send(dataKalibrasi);
});

module.exports = router;
