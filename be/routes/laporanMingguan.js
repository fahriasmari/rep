const express = require("express");
const router = express.Router();
const moment = require("moment");
const loggerDB = require("../model/Logger");
const userDB = require("../model/User");
const mongoose = require("mongoose");
const formMingguan = require("../model/formMingguan");
const logFormMingguan = require("../model/logFormMingguan");
let xl = require("excel4node");

router.get("/loggerid", async (req, res) => {
  let compID = req.query.compID;
  let data;

  //console.log(req.query.compID);

  try {
    const loggerID = await loggerDB.find(
      {
        compID: compID,
      },
      { loggerID: 1, logDataRange: 1 }
    );

    if (loggerID.length > 0) {
      for (let i = 0; i < loggerID.length; i++) {
        data = {
          loggerID: loggerID[i]._id,
          logDataRange: loggerID[i].logDataRange,
        };
      }
      res.status(200).send({ message: "Data ditemukan", data: data });
    } else {
      res.status(400).send({ message: "Data tidak ditemukan", data: data });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/create", async (req, res) => {
  let dataLoggerID = req.body.loggerID;
  let dataParam = req.body.dataParam;
  let dataFile = req.body.file;
  let dataProvID = req.body.provID;
  let dataKabkotID = req.body.kabkotID;
  let dataCompID = req.body.compID;
  var date = moment(req.body.tanggalKejadian.substr(0, 10) * 1000).format(
    "YYYY-MM-DD"
  );
  var newD = moment(date);
  var week = Math.ceil(newD.date() / 7);
  let dataWeek = week;
  let dataMonth = moment(req.body.tanggalKejadian.substr(0, 10) * 1000).format(
    "M"
  );
  let dataYear = moment(req.body.tanggalKejadian.substr(0, 10) * 1000).format(
    "YYYY"
  );
  let dataTanggalKejadian = req.body.tanggalKejadian.substr(0, 10);
  let dataEndTanggalKejadian = req.body.tanggalKejadian.substr(-10);
  let data = {
    loggerID: dataLoggerID,
    dataParam: dataParam,
    fileSHU: dataFile,
    provID: dataProvID,
    kabkotID: dataKabkotID,
    compID: dataCompID,
    week: dataWeek,
    month: dataMonth,
    year: dataYear,
    tanggalKejadian: dataTanggalKejadian,
    endTanggalKejadian: dataEndTanggalKejadian,
    validasi: false,
    reject: false,
    status: "waiting", //waiting , rejected , accepted
    createdAt: moment().unix(),
  };
  let log;

  try {
    const formNew = new formMingguan(data);
    const formSave = await formNew.save();

    log = {
      formMingguanID: formSave._id,
      keterangan: "Pengajuan Baru",
      createdAt: formSave.createdAt,
      status: "waiting", //waiting , rejected , accepted
      petugas: "-",
    };

    const logNew = new logFormMingguan(log);
    const logSave = await logNew.save();

    res.status(200).send({ message: "Data Berhasil Disimpan", data: formSave });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/edit", async (req, res) => {
  let dataFormID = req.body.formId;
  let dataParam = req.body.dataParam;
  let dataFile = req.body.file;
  var date = moment(req.body.tanggalKejadian.substr(0, 10) * 1000).format(
    "YYYY-MM-DD"
  );
  var newD = moment(date);
  var week = Math.ceil(newD.date() / 7);
  let dataWeek = week;
  let dataMonth = moment(req.body.tanggalKejadian.substr(0, 10) * 1000).format(
    "M"
  );
  let dataYear = moment(req.body.tanggalKejadian.substr(0, 10) * 1000).format(
    "YYYY"
  );
  let dataTanggalKejadian = req.body.tanggalKejadian.substr(0, 10);
  let dataEndTanggalKejadian = req.body.tanggalKejadian.substr(-10);

  let log;

  //let data

  let query = { _id: dataFormID };
  let newvalues;
  if (dataFile) {
    newvalues = {
      $set: {
        dataParam: dataParam,
        week: dataWeek,
        month: dataMonth,
        year: dataYear,
        fileSHU: dataFile,
        tanggalKejadian: dataTanggalKejadian,
        endTanggalKejadian: dataEndTanggalKejadian,
        status: "waiting",
      },
    };
  } else {
    newvalues = {
      $set: {
        dataParam: dataParam,
        week: dataWeek,
        month: dataMonth,
        year: dataYear,
        tanggalKejadian: dataTanggalKejadian,
        endTanggalKejadian: dataEndTanggalKejadian,
        status: "waiting",
      },
    };
  }

  try {
    const check_validated = await formMingguan.findOne({ _id: dataFormID });
    if (check_validated.status == "accepted")
      return res.status(403).send({ message: "Data Tidak Dapat Di Update" });
    if (!check_validated)
      return res.status(400).send({ message: "Data Tidak Di Temukan" });

    const update = await formMingguan.updateOne(query, newvalues);

    log = {
      formMingguanID: dataFormID,
      keterangan: "Update Data",
      createdAt: moment().unix(),
      status: "waiting",
      petugas: "-",
    };

    const logNew = new logFormMingguan(log);
    const logSave = await logNew.save();

    res.status(200).send({ message: "Data Berhasil Di Update", data: update });
  } catch (error) {
    res.status(400).send({ error, message: "Terjadi Kesalahan" });
  }
});

router.post("/delete", async (req, res) => {
  let dataFormID = req.body.formId;

  let queryForm = { _id: dataFormID };
  let queryLog = { formMingguanID: dataFormID };

  try {
    const check_validated = await formMingguan.findOne({ _id: dataFormID });
    if (check_validated.status == "accepted")
      return res.status(403).send({ message: "Data Tidak Dapat Di Hapus" });
    if (!check_validated)
      return res.status(400).send({ message: "Data Tidak Di Temukan" });

    const deleteForm = await formMingguan.deleteOne(queryForm);
    const deleteLogForm = await logFormMingguan.deleteOne(queryLog);

    res.status(200).send({
      message: "Data Berhasil Di Hapus",
      data: [deleteForm, deleteLogForm],
    });
  } catch (error) {
    res.status(400).send({ error, message: "Data Tidak Dapat Di Hapus" });
  }
});

router.post("/validasi", async (req, res) => {
  let dataFormID = req.body.formId;
  let dataStatus = req.body.status;
  let dataKeterangan = req.body.keterangan;
  let dataPetugas = req.body.petugas;

  let query = { _id: dataFormID };
  let newvalues = {
    $set: {
      status: dataStatus,
    },
  };

  try {
    const check_validated = await formMingguan.findOne({ _id: dataFormID });
    if (check_validated.status == "accepted")
      return res.status(403).send({ message: "Data Tidak Dapat Di Update" });
    if (!check_validated)
      return res.status(400).send({ message: "Data Tidak Di Temukan" });

    const update = await formMingguan.updateOne(query, newvalues);

    log = {
      formMingguanID: dataFormID,
      keterangan: dataKeterangan,
      createdAt: moment().unix(),
      petugas: dataPetugas,
      status: dataStatus, //waiting , rejected , accepted
    };

    const logNew = new logFormMingguan(log);
    const logSave = await logNew.save();

    res.status(200).send({ message: "Data Berhasil Di Update", data: update });
  } catch (error) {
    res.status(400).send({ error, message: "Terjadi Kesalahan" });
  }
});

router.get("/getform/:id", async (req, res) => {
  const user = await userDB.findOne({ _id: req.params.id });
  //console.log(user);
  if (!user) return res.status(400).send("User not found!");

  let provID = user.userRole.provID;
  let kabkotID = user.userRole.kabkotID;
  let compID = user.userRole.compID;

  let data;
  let query = {};

  if (req.query.loggerID) {
    query["loggerID"] = req.query.loggerID;
  }
  if (req.query.provID) {
    query["provID"] = req.query.provID;
  }
  if (req.query.kabkotID) {
    query["kabkotID"] = req.query.kabkotID;
  }
  if (req.query.compID) {
    query["compID"] = req.query.compID;
  }

  switch (user.userRole.role) {
    case "admin":
      data = await formMingguan.aggregate([
        { $match: query },
        { $addFields: { id: { $toString: "$_id" } } },
        {
          $lookup: {
            from: "logformmingguans",
            localField: "id",
            foreignField: "formMingguanID",
            as: "logValidasi",
          },
        },
        {
          $unwind: "$logValidasi",
        },
        {
          $sort: { "logValidasi._id": -1 },
        },
      ]);
      break;
    case "prov":
      query["provID"] = provID;

      data = await formMingguan.aggregate([
        { $match: query },
        { $addFields: { id: { $toString: "$_id" } } },
        {
          $lookup: {
            from: "logformmingguans",
            localField: "id",
            foreignField: "formMingguanID",
            as: "logValidasi",
          },
        },
        {
          $unwind: "$logValidasi",
        },
        {
          $sort: { "logValidasi._id": -1 },
        },
      ]);

      break;
    case "kabkot":
      query["provID"] = provID;
      query["kabkotID"] = kabkotID;

      data = await formMingguan.aggregate([
        { $match: query },
        { $addFields: { id: { $toString: "$_id" } } },
        {
          $lookup: {
            from: "logformmingguans",
            localField: "id",
            foreignField: "formMingguanID",
            as: "logValidasi",
          },
        },
        {
          $unwind: "$logValidasi",
        },
        {
          $sort: { "logValidasi._id": -1 },
        },
      ]);

      break;
    case "comp":
      query["provID"] = provID;
      query["kabkotID"] = kabkotID;
      query["compID"] = compID;

      data = await formMingguan.aggregate([
        { $match: query },
        { $addFields: { id: { $toString: "$_id" } } },
        {
          $lookup: {
            from: "logformmingguans",
            localField: "id",
            foreignField: "formMingguanID",
            as: "logValidasi",
          },
        },
        {
          $unwind: "$logValidasi",
        },
        {
          $sort: { "logValidasi._id": -1 },
        },
      ]);

      break;
  }

  //var result = Object.entries(data)

  //const result = [...new Set(data.map(item => item._id))];
  const result = Object.values(
    data.reduce((data, obj) => ({ ...data, [obj.id]: obj }), {})
  );

  res.send(result);
});

router.get("/getvalidasi", async (req, res) => {
  let formID = req.query.formID;

  const ObjectId = mongoose.Types.ObjectId;

  data = await formMingguan.aggregate([
    { $match: { _id: ObjectId(formID) } },
    { $addFields: { id: { $toString: "$_id" } } },
    {
      $lookup: {
        from: "logformmingguans",
        localField: "id",
        foreignField: "formMingguanID",
        as: "logValidasi",
      },
    },
    {
      $unwind: "$logValidasi",
    },
    {
      $project: {
        _id: -1,
        validasiID: "$logValidasi._id",
        createdAt: "$logValidasi.createdAt",
        status: "$logValidasi.status",
        petugas: "$logValidasi.petugas",
        keterangan: "$logValidasi.keterangan",
      },
    },
  ]);

  res.send(data);
});

router.get("/export/:id", async (req, res) => {
  const user = await userDB.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("User not found!");

  let provID = user.userRole.provID;
  let kabkotID = user.userRole.kabkotID;
  let compID = user.userRole.compID;

  let data;
  let query = {};

  let search = {};
  let status;
  if (req.query.search) {
    search["searchCompName"] = {
      $regex: req.query.search.toLowerCase(),
    };
  }
  if (req.query.status) {
    status =
      req.query.status === "diterima"
        ? "accepted"
        : req.query.status === "ditolak"
        ? "rejected"
        : "waiting";
    search["$and"] = [
      {
        status: status,
      },
    ];
  }
  if (req.query.loggerID) {
    query["loggerID"] = req.query.loggerID;
  }
  if (req.query.provID) {
    query["provID"] = req.query.provID;
  }
  if (req.query.kabkotID) {
    query["kabkotID"] = req.query.kabkotID;
  }
  if (req.query.compID) {
    query["compID"] = req.query.compID;
  }

  switch (user.userRole.role) {
    case "admin":
      data = await formMingguan.aggregate([
        { $match: query },
        { $addFields: { id: { $toString: "$_id" } } },
        {
          $lookup: {
            from: "logformmingguans",
            localField: "id",
            foreignField: "formMingguanID",
            as: "logValidasi",
          },
        },
        {
          $unwind: "$logValidasi",
        },
        { $addFields: { compId: { $toObjectId: "$compID" } } },
        {
          $lookup: {
            from: "companies",
            localField: "compId",
            foreignField: "_id",
            as: "comp",
          },
        },
        {
          $unwind: "$comp",
        },
        { $addFields: { compName: "$comp.compName" } },
        {
          $addFields: {
            searchCompName: {
              $toLower: "$compName",
            },
          },
        },
        {
          $match: search,
        },
        {
          $unset: ["compId", "comp"],
        },
        {
          $sort: { "logValidasi._id": 1 },
        },
        {
          $sort: { _id: -1 },
        },
      ]);
      break;
    case "prov":
      query["provID"] = provID;

      data = await formMingguan.aggregate([
        { $match: query },
        { $addFields: { id: { $toString: "$_id" } } },
        {
          $lookup: {
            from: "logformmingguans",
            localField: "id",
            foreignField: "formMingguanID",
            as: "logValidasi",
          },
        },
        {
          $unwind: "$logValidasi",
        },
        { $addFields: { compId: { $toObjectId: "$compID" } } },
        {
          $lookup: {
            from: "companies",
            localField: "compId",
            foreignField: "_id",
            as: "comp",
          },
        },
        {
          $unwind: "$comp",
        },
        { $addFields: { compName: "$comp.compName" } },
        {
          $addFields: {
            searchCompName: {
              $toLower: "$compName",
            },
          },
        },
        {
          $match: search,
        },
        {
          $unset: ["compId", "comp"],
        },
        {
          $sort: { "logValidasi._id": -1 },
        },
      ]);

      break;
    case "kabkot":
      query["provID"] = provID;
      query["kabkotID"] = kabkotID;

      data = await formMingguan.aggregate([
        { $match: query },
        { $addFields: { id: { $toString: "$_id" } } },
        {
          $lookup: {
            from: "logformmingguans",
            localField: "id",
            foreignField: "formMingguanID",
            as: "logValidasi",
          },
        },
        {
          $unwind: "$logValidasi",
        },
        { $addFields: { compId: { $toObjectId: "$compID" } } },
        {
          $lookup: {
            from: "companies",
            localField: "compId",
            foreignField: "_id",
            as: "comp",
          },
        },
        {
          $unwind: "$comp",
        },
        { $addFields: { compName: "$comp.compName" } },
        {
          $addFields: {
            searchCompName: {
              $toLower: "$compName",
            },
          },
        },
        {
          $match: search,
        },
        {
          $unset: ["compId", "comp"],
        },
        {
          $sort: { "logValidasi._id": -1 },
        },
      ]);

      break;
    case "comp":
      query["provID"] = provID;
      query["kabkotID"] = kabkotID;
      query["compID"] = compID;

      data = await formMingguan.aggregate([
        { $match: query },
        { $addFields: { id: { $toString: "$_id" } } },
        {
          $lookup: {
            from: "logformmingguans",
            localField: "id",
            foreignField: "formMingguanID",
            as: "logValidasi",
          },
        },
        {
          $unwind: "$logValidasi",
        },
        { $addFields: { compId: { $toObjectId: "$compID" } } },
        {
          $lookup: {
            from: "companies",
            localField: "compId",
            foreignField: "_id",
            as: "comp",
          },
        },
        {
          $unwind: "$comp",
        },
        { $addFields: { compName: "$comp.compName" } },
        {
          $addFields: {
            searchCompName: {
              $toLower: "$compName",
            },
          },
        },
        {
          $match: search,
        },
        {
          $unset: ["compId", "comp"],
        },
        {
          $sort: { "logValidasi._id": -1 },
        },
      ]);

      break;
  }
  result = data.sort(function (a, b) {
    return a._id - b._id;
  });

  var wb = new xl.Workbook({ logLevel: 1 });
  var ws = wb.addWorksheet("Data Laporan Manual 1 Mingu");
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

  let col = 3;
  ws.cell(1, 1, 1, 14, true)
    .string("Laporan Manual Data Satu Minggu")
    .style(style);
  ws.cell(col - 1, 1, col, 1, true)
    .string("No")
    .style(style);
  ws.cell(col - 1, 2, col, 2, true)
    .string("Industri")
    .style(style);
  ws.cell(col - 1, 3, col, 3, true)
    .string("Tanggal Kejadian")
    .style(style);
  ws.cell(col - 1, 4, col, 4, true)
    .string("Minggu Ke-")
    .style(style);
  ws.cell(col - 1, 5, col, 5, true)
    .string("Status")
    .style(style);
  ws.cell(col - 1, 6, col - 1, 10, true)
    .string("Nilai Parameter")
    .style(style);
  ws.cell(col, 6, col, 6, true).string("pH").style(style);
  ws.cell(col, 7, col, 7, true).string("COD").style(style);
  ws.cell(col, 8, col, 8, true).string("TSS").style(style);
  ws.cell(col, 9, col, 9, true).string("NH3N").style(style);
  ws.cell(col, 10, col, 10, true).string("Debit").style(style);
  ws.cell(col - 1, 11, col - 1, 14, true)
    .string("Riwayat Validasi")
    .style(style);
  ws.cell(col, 11, col, 11, true).string("Tanggal Reject/Approve").style(style);
  ws.cell(col, 12, col, 12, true).string("Petugas Reject/Approve").style(style);
  ws.cell(col, 13, col, 13, true).string("Status").style(style);
  ws.cell(col, 14, col, 14, true).string("Keterangan").style(style);
  let firstCol = 4;
  let lastCol = 0;
  let a = 0;
  for (let i = 0; i < result.length; i++) {
    col++;
    let regex = /(<([^>]+)>)/gi;
    tanggalValidasi =
      result[i].logValidasi != null
        ? moment(moment(Number(result[i].logValidasi.createdAt) * 1000)).format(
            "DD MMMM YYYY, HH:mm"
          )
        : "-";

    if (i > 0) {
      if (result[i]._id.toString() === result[i - 1]._id.toString()) {
        lastCol++;
        if (i + 1 == result.length) {
          tanggalKejadian =
            result[i].tanggalKejadian != null
              ? moment(moment(Number(result[i].tanggalKejadian) * 1000)).format(
                  "DD MMMM YYYY, HH:mm"
                )
              : "-";
          a++;
          ws.cell(firstCol, 1, firstCol + lastCol, 1, true).string(
            a.toString()
          );
          ws.cell(firstCol, 2, firstCol + lastCol, 2, true).string(
            result[i].compName
          );
          ws.cell(firstCol, 3, firstCol + lastCol, 3, true).string(
            tanggalKejadian
          );
          ws.cell(firstCol, 4, firstCol + lastCol, 4, true).string(
            result[i].week != null ? result[i].week : "-"
          );
          ws.cell(firstCol, 5, firstCol + lastCol, 5, true).string(
            result[i].status
          );
          ws.cell(firstCol, 6, firstCol + lastCol, 6, true).string(
            result[i].dataParam != null
              ? result[i].dataParam[0].value != null
                ? result[i].dataParam[0].value
                : "Tidak Wajib"
              : "Tidak Wajib"
          );
          ws.cell(firstCol, 7, firstCol + lastCol, 7, true).string(
            result[i].dataParam != null
              ? result[i].dataParam[1].value != null
                ? result[i].dataParam[1].value
                : "Tidak Wajib"
              : "Tidak Wajib"
          );
          ws.cell(firstCol, 8, firstCol + lastCol, 8, true).string(
            result[i].dataParam != null
              ? result[i].dataParam[2].value != null
                ? result[i].dataParam[2].value
                : "Tidak Wajib"
              : "Tidak Wajib"
          );
          ws.cell(firstCol, 9, firstCol + lastCol, 9, true).string(
            result[i].dataParam != null
              ? result[i].dataParam[3].value != null
                ? result[i].dataParam[3].value
                : "Tidak Wajib"
              : "Tidak Wajib"
          );
          ws.cell(firstCol, 10, firstCol + lastCol, 10, true).string(
            result[i].dataParam != null
              ? result[i].dataParam[4].value != null
                ? result[i].dataParam[4].value
                : "Tidak Wajib"
              : "Tidak Wajib"
          );
        }
      } else {
        tanggalKejadian =
          result[i - 1].tanggalKejadian != null
            ? moment(
                moment(Number(result[i - 1].tanggalKejadian) * 1000)
              ).format("DD MMMM YYYY, HH:mm")
            : "-";
        a++;
        ws.cell(firstCol, 1, lastCol + firstCol, 1, true).string(
          i + 1 == result.length ? (a - 1).toString() : a.toString()
        );
        ws.cell(firstCol, 2, lastCol + firstCol, 2, true).string(
          result[i - 1].compName
        );
        ws.cell(firstCol, 3, lastCol + firstCol, 3, true).string(
          tanggalKejadian
        );
        ws.cell(firstCol, 4, lastCol + firstCol, 4, true).string(
          result[i - 1].week != null ? result[i - 1].week : "-"
        );
        ws.cell(firstCol, 5, lastCol + firstCol, 5, true).string(
          result[i - 1].status
        );
        ws.cell(firstCol, 6, lastCol + firstCol, 6, true).string(
          result[i - 1].dataParam != null
            ? result[i - 1].dataParam[0].value != null
              ? result[i - 1].dataParam[0].value
              : "Tidak Wajib"
            : "Tidak Wajib"
        );
        ws.cell(firstCol, 7, lastCol + firstCol, 7, true).string(
          result[i - 1].dataParam != null
            ? result[i - 1].dataParam[1].value != null
              ? result[i - 1].dataParam[1].value
              : "Tidak Wajib"
            : "Tidak Wajib"
        );
        ws.cell(firstCol, 8, lastCol + firstCol, 8, true).string(
          result[i - 1].dataParam != null
            ? result[i - 1].dataParam[2].value != null
              ? result[i - 1].dataParam[2].value
              : "Tidak Wajib"
            : "Tidak Wajib"
        );
        ws.cell(firstCol, 9, lastCol + firstCol, 9, true).string(
          result[i - 1].dataParam != null
            ? result[i - 1].dataParam[3].value != null
              ? result[i - 1].dataParam[3].value
              : "Tidak Wajib"
            : "Tidak Wajib"
        );
        ws.cell(firstCol, 10, lastCol + firstCol, 10, true).string(
          result[i - 1].dataParam != null
            ? result[i - 1].dataParam[4].value != null
              ? result[i - 1].dataParam[4].value
              : "Tidak Wajib"
            : "Tidak Wajib"
        );
        lastCol = 0;
        firstCol = col;
      }
    }
    ws.cell(col, 11).string(tanggalValidasi);
    ws.cell(col, 12).string(
      result[i].logValidasi.petugas == "-" ||
        typeof result[i].logValidasi.petugas == "undefined"
        ? "Petugas"
        : result[i].logValidasi.petugas
    );
    ws.cell(col, 13).string(result[i].status);
    ws.cell(col, 14).string(
      result[i].logValidasi.keterangan.replace(regex, "")
    );
  }
  wb.write(`List Laporan Manual Data 1 Minggu.xlsx`, res);
});
module.exports = router;
