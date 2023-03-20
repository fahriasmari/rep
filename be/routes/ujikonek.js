const express = require("express");
const router = express.Router();
const moment = require("moment");
const ujikonekDB = require("../model/Ujikonektivitas");
const userDB = require("../model/User");
const compDB = require("../model/Company");
const loggerDB = require("../model/Logger");
const provDB = require("../model/Province");
const kabkotDB = require("../model/Kabkot");
let { makeid } = require("../services/helper");
let xl = require("excel4node");

// GET
router.get("/list/:id", async (req, res) => {
  let id = req.params.id;
  let msg = {
    _id: "",
    data: [],
    error: [],
    status: "",
    validated: false,
    code: 0,
  };
  let status = 200;

  try {
    const pendaftaran = await ujikonekDB.findOne({ _id: id });

    const prov = await provDB.findOne({
      _id: pendaftaran.umum.companyProvince,
    });
    const kabkot = await kabkotDB.findOne({
      _id: pendaftaran.umum.companyCity,
    });

    const timestamp = pendaftaran._id.toString().substring(0, 8);
    pendaftaran.umum.createdAt = parseInt(timestamp, 16);
    pendaftaran.umum.compProvinceName = prov.provName;
    pendaftaran.umum.compCityName = kabkot.kabkotName;

    if (pendaftaran.validated === true) {
      const comp = await compDB.findOne({
        compName: pendaftaran.umum.compName,
      });

      if (pendaftaran.umum.loggerID != undefined) {
        const logger = await loggerDB.findOne({
          compID: comp._id,
        });
        pendaftaran.umum.loggerID = logger._id;
      }
      // console.log(pendaftaran[i].loggerInfo);
    }
    if (!pendaftaran) {
      msg._id = id;
      msg.status = "Pendaftaran not found!";
      msg.code = 400;
      return res.status(400).send(msg);
    }
    msg._id = pendaftaran._id;
    msg.data = {
      logger: pendaftaran.logger,
      umum: pendaftaran.umum,
      sensor: pendaftaran.sensor,
      uid: pendaftaran.uid,
    };
    msg.status = "Data ditemukan";
    msg.created_time = pendaftaran.created_time;
    msg.validated = pendaftaran.validated;
    msg.validitas = pendaftaran.validitas;
    msg.code = 200;
    return res.status(200).send(msg);
  } catch (err) {
    msg._id = id;
    msg.error = err;
    msg.status = "Pendaftaran not found!";
    msg.code = 400;
    return res.status(400).send(msg);
  }
});

router.get("/list", async (req, res) => {
  const formList = await ujikonekDB.find({});
  for (let i = 0; i < formList.length; i++) {
    const prov = await provDB.findOne({
      _id: formList[i].umum.companyProvince,
    });
    const kabkot = await kabkotDB.findOne({
      _id: formList[i].umum.companyCity,
    });
    const timestamp = formList[i]._id.toString().substring(0, 8);
    formList[i].umum.createdAt = parseInt(timestamp, 16);
    formList[i].umum.compProvinceName = prov.provName;
    formList[i].umum.compCityName = kabkot.kabkotName;

    if (formList[i].validated === true) {
      const comp = await compDB.findOne({
        compName: formList[i].umum.compName,
      });
      // console.log(formList[i].umum.compName);
      // console.log(comp); return
      if (formList[i].umum.loggerID != undefined) {
        const logger = await loggerDB.findOne({
          compID: comp._id,
        });
        formList[i].umum.loggerID = logger._id;
      }
      // console.log(formList[i].loggerInfo);
    }
  }
  res.send(formList);
});

router.get("/export", async (req, res, next) => {
  let search = {};
  let status;
  if (req.query.status) {
    status =
      req.query.status === "diterima"
        ? "accepted"
        : req.query.status === "ditolak"
        ? "rejected"
        : "pending";
  }
  if (req.query.search) {
    search["searchCompName"] = {
      $regex: req.query.search.toLowerCase(),
    };
  }
  const form = await ujikonekDB.aggregate([
    {
      $addFields: {
        searchCompName: {
          $toLower: "$umum.companyName",
        },
      },
    },
    {
      $addFields: {
        idProvince: {
          $toObjectId: "$umum.companyProvince",
        },
      },
    },
    {
      $lookup: {
        from: "provdbs",
        localField: "idProvince",
        foreignField: "_id",
        as: "prov",
      },
    },
    {
      $unwind: "$prov",
    },
    {
      $addFields: {
        idCity: {
          $toObjectId: "$umum.companyCity",
        },
      },
    },
    {
      $lookup: {
        from: "kabkotdbs",
        localField: "idCity",
        foreignField: "_id",
        as: "kabkot",
      },
    },
    {
      $unwind: "$kabkot",
    },
    {
      $match: search,
    },
    {
      $addFields: {
        "umum.createdAt": {
          $function: {
            body: function (id) {
              let timestamp = id.substring(0, 8);
              let data = parseInt(timestamp, 16);
              return data;
            },
            args: [{ $toString: "$_id" }],
            lang: "js",
          },
        },
      },
    },
    {
      $addFields: {
        "umum.compProvinceName": "$prov.provName",
      },
    },
    {
      $addFields: {
        "umum.compCityName": "$kabkot.kabkotName",
      },
    },
    {
      $project: {
        _id: 1,
        logger: 1,
        validitas: 1,
        umum: 1,
        sensor: 1,
        created_time: 1,
        validated: 1,
        __v: 1,
        uid: 1,
      },
    },
  ]);
  let formList = [];
  for (let i = 0; i < form.length; i++) {
    if (req.query.status) {
      if (form[i].validitas.length > 0) {
        if (status === form[i].validitas[form[i].validitas.length - 1].status) {
          if (form[i].validated === true) {
            const comp = await compDB.findOne({
              compName: form[i].umum.compName,
            });
            if (comp !== null) {
              if (form[i].umum.loggerID != undefined) {
                const logger = await loggerDB.findOne({
                  compID: comp._id,
                });
                form[i].umum.loggerID = logger._id;
              }
            }
          }
          formList.push(form[i]);
        }
      } else {
        if (status === "pending") {
          if (form[i].validated === true) {
            const comp = await compDB.findOne({
              compName: form[i].umum.compName,
            });
            if (comp !== null) {
              if (form[i].umum.loggerID != undefined) {
                const logger = await loggerDB.findOne({
                  compID: comp._id,
                });
                form[i].umum.loggerID = logger._id;
              }
            }
          }
          formList.push(form[i]);
        }
      }
    } else {
      if (form[i].validated === true) {
        const comp = await compDB.findOne({
          compName: form[i].umum.compName,
        });
        if (comp !== null) {
          if (form[i].umum.loggerID != undefined) {
            const logger = await loggerDB.findOne({
              compID: comp._id,
            });
            form[i].umum.loggerID = logger._id;
          }
        }
      }
      formList.push(form[i]);
    }
  }
  var wb = new xl.Workbook({ logLevel: 1 });
  var ws = wb.addWorksheet("Data Pendaftaran Uji Konektifitas");
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
  ws.cell(col - 2, 1, col, 1, true)
    .string("No")
    .style(style);
  ws.cell(col - 2, 2, col, 2, true)
    .string("ID Pendaftaran")
    .style(style);
  ws.cell(col - 2, 3, col, 3, true)
    .string("Nama Industri")
    .style(style);
  ws.cell(col - 2, 4, col, 4, true)
    .string("Nama Pananggung Jawab")
    .style(style);
  ws.cell(col - 2, 5, col, 5, true)
    .string("Dibuat Pada")
    .style(style);
  ws.cell(col - 2, 6, col, 6, true)
    .string("Diubah Pada")
    .style(style);
  ws.cell(col - 2, 7, col, 7, true)
    .string("Tanggal Pengujian")
    .style(style);
  ws.cell(col - 2, 8, col, 8, true)
    .string("Nomor UID")
    .style(style);
  ws.cell(col - 2, 9, col, 9, true)
    .string("Validasi")
    .style(style);

  let created, updated, tanggalUji;
  let lastRow = 10;
  let firstRow = 10;
  let secCol = 0;
  for (let i = 0; i < formList.length; i++) {
    let row = 10;
    for (let j = 0; j < formList[i].logger.length; j++) {
      if (j + 1 > secCol) {
        secCol++;
        ws.cell(2, row, 2, row + 1, true)
          .string("Logger " + (j + 1))
          .style(style);
        ws.cell(3, row)
          .string("Nama Logger " + (j + 1))
          .style(style);
        ws.cell(3, row + 1)
          .string("Model/Tipe Logger " + (j + 1))
          .style(style);
        if (formList[i].logger.length > 1) {
          ws.cell(col + 2, row).string(formList[i].logger[j].brand);
          ws.cell(col + 2, row + 1).string(formList[i].logger[j].type);
        }
        if (j == 0) {
          ws.cell(col + 1, row).string(formList[i].logger[j].brand);
          ws.cell(col + 1, row + 1).string(formList[i].logger[j].type);
          col--;
        }
      } else {
        ws.cell(3, row)
          .string("Nama Logger " + (j + 1))
          .style(style);
        ws.cell(3, row + 1)
          .string("Model/Tipe Logger " + (j + 1))
          .style(style);
        ws.cell(col + 2, row).string(formList[i].logger[j].brand);
        ws.cell(col + 2, row + 1).string(formList[i].logger[j].type);
      }
      row = row + 2;
      lastRow = row > lastRow ? row : lastRow;
    }
    col++;
    if (i == formList.length - 1) {
      ws.cell(
        1,
        firstRow,
        1,
        formList[i].logger.length != 0 ? lastRow - 1 : lastRow + 3,
        true
      )
        .string("Logger")
        .style(style);
    }
    let createdDate = new Date(formList[i].created_time * 1000);
    created = moment(moment(createdDate)).format("DD MMMM YYYY, HH:mm");
    // created = new Date(formList[i].created_time * 1000);
    let updatedDate =
      formList[i].validitas.length > 0
        ? formList[i].validitas[formList[i].validitas.length - 1]
            .created_time !== null ||
          formList[i].validitas[formList[i].validitas.length - 1]
            .created_time !== ""
          ? new Date(
              formList[i].validitas[formList[i].validitas.length - 1]
                .created_time * 1000
            )
          : "-"
        : "-";
    updated =
      updatedDate !== "-"
        ? moment(moment(updatedDate)).format("DD MMMM YYYY, HH:mm")
        : "-";
    tanggalUjiDate =
      formList[i].validitas.length > 0
        ? formList[i].validitas[formList[i].validitas.length - 1]
            .tanggal_uji !== ""
          ? new Date(
              Number(
                formList[i].validitas[formList[i].validitas.length - 1]
                  .tanggal_uji
              ) * 1000
            )
          : "-"
        : "-";
    tanggalUji =
      tanggalUjiDate !== "-"
        ? moment(moment(tanggalUjiDate)).format("DD MMMM YYYY, HH:mm")
        : "-";
    ws.cell(col + 1, 1).string((i + 1).toString());
    ws.cell(col + 1, 2).string(formList[i]._id.toString());
    ws.cell(col + 1, 3).string(formList[i].umum.companyName);
    ws.cell(col + 1, 4).string(formList[i].umum.responsiblePerson);
    ws.cell(col + 1, 5).string(created.toString());
    ws.cell(col + 1, 6).string(updated.toString());
    ws.cell(col + 1, 7).string(tanggalUji.toString());
    ws.cell(col + 1, 8).string(
      formList[i].uid != null
        ? typeof formList[i].validitas[0] === "undefined"
          ? "-"
          : formList[i].validitas[formList[i].validitas.length - 1].status ===
            "rejected"
          ? "-"
          : formList[i].validitas[formList[i].validitas.length - 1].status ===
            "accepted"
          ? formList[i].uid.toString()
          : "-"
        : "-"
    );
    ws.cell(col + 1, 9).string(
      typeof formList[i].validitas[0] === "undefined"
        ? "Menunggu Validasi"
        : formList[i].validitas[formList[i].validitas.length - 1].status ===
          "rejected"
        ? "Ditolak"
        : formList[i].validitas[formList[i].validitas.length - 1].status ===
          "accepted"
        ? "Diterima"
        : "Menunggu Validasi"
    );
  }
  col = 3;
  let startphrow = lastRow;
  const firstphRow = lastRow;
  secCol = 0;
  for (let i = 0; i < formList.length; i++) {
    let row = startphrow;
    for (let j = 0; j < formList[i].sensor.ph.length; j++) {
      if (j + 1 > secCol) {
        secCol++;
        ws.cell(2, row, 2, row + 3, true)
          .string("Sensor pH " + (j + 1))
          .style(style);
        ws.cell(3, row)
          .string("Nama Sensor pH " + (j + 1))
          .style(style);
        ws.cell(3, row + 1)
          .string("Probe Sensor pH " + (j + 1))
          .style(style);
        ws.cell(3, row + 2)
          .string("Min Sensor pH " + (j + 1))
          .style(style);
        ws.cell(3, row + 3)
          .string("Max Sensor pH " + (j + 1))
          .style(style);

        if (formList[i].sensor.ph.length > 1) {
          ws.cell(col + 2, row).string(formList[i].sensor.ph[j].brand);
          ws.cell(col + 2, row + 1).string(formList[i].sensor.ph[j].probe);
          ws.cell(col + 2, row + 2).string(
            formList[i].sensor.ph[j].minMeasurement
          );
          ws.cell(col + 2, row + 3).string(
            formList[i].sensor.ph[j].maxMeasurement
          );
        }
        if (j == 0) {
          ws.cell(col + 1, row).string(formList[i].sensor.ph[j].brand);
          ws.cell(col + 1, row + 1).string(formList[i].sensor.ph[j].probe);
          ws.cell(col + 1, row + 2).string(
            formList[i].sensor.ph[j].minMeasurement
          );
          ws.cell(col + 1, row + 3).string(
            formList[i].sensor.ph[j].maxMeasurement
          );
          col--;
        }
      } else {
        ws.cell(3, row)
          .string("Nama Sensor pH " + (j + 1))
          .style(style);
        ws.cell(3, row + 1)
          .string("Probe Sensor pH " + (j + 1))
          .style(style);
        ws.cell(3, row + 2)
          .string("Min Sensor pH " + (j + 1))
          .style(style);
        ws.cell(3, row + 3)
          .string("Max Sensor pH " + (j + 1))
          .style(style);
        ws.cell(col + 2, row).string(formList[i].sensor.ph[j].brand);
        ws.cell(col + 2, row + 1).string(formList[i].sensor.ph[j].probe);
        ws.cell(col + 2, row + 2).string(
          formList[i].sensor.ph[j].minMeasurement
        );
        ws.cell(col + 2, row + 3).string(
          formList[i].sensor.ph[j].maxMeasurement
        );
      }
      row = row + 4;
      lastRow = row > lastRow ? row : lastRow;
    }
    if (i == formList.length - 1) {
      ws.cell(
        1,
        firstphRow,
        1,
        formList[i].sensor.ph.length != 0 ? lastRow - 1 : lastRow + 3,
        true
      )
        .string("Sensor pH")
        .style(style);
    }
    col++;
  }
  col = 3;
  let startcodrow = lastRow;
  const firstcodRow = lastRow;
  secCol = 0;
  for (let i = 0; i < formList.length; i++) {
    let row = startcodrow;
    for (let j = 0; j < formList[i].sensor.cod.length; j++) {
      if (j + 1 > secCol) {
        secCol++;
        ws.cell(2, row, 2, row + 3, true)
          .string("Sensor COD " + (j + 1))
          .style(style);
        ws.cell(3, row)
          .string("Nama Sensor COD " + (j + 1))
          .style(style);
        ws.cell(3, row + 1)
          .string("Probe Sensor COD " + (j + 1))
          .style(style);
        ws.cell(3, row + 2)
          .string("Min Sensor COD " + (j + 1))
          .style(style);
        ws.cell(3, row + 3)
          .string("Max Sensor COD " + (j + 1))
          .style(style);
        if (formList[i].sensor.cod.length > 1) {
          ws.cell(col + 2, row).string(formList[i].sensor.cod[j].brand);
          ws.cell(col + 2, row + 1).string(formList[i].sensor.cod[j].probe);
          ws.cell(col + 2, row + 2).string(
            formList[i].sensor.cod[j].minMeasurement
          );
          ws.cell(col + 2, row + 3).string(
            formList[i].sensor.cod[j].maxMeasurement
          );
        }
        if (j == 0) {
          ws.cell(col + 1, row).string(formList[i].sensor.cod[j].brand);
          ws.cell(col + 1, row + 1).string(formList[i].sensor.cod[j].probe);
          ws.cell(col + 1, row + 2).string(
            formList[i].sensor.cod[j].minMeasurement
          );
          ws.cell(col + 1, row + 3).string(
            formList[i].sensor.cod[j].maxMeasurement
          );
          col--;
        }
      } else {
        ws.cell(3, row)
          .string("Nama Sensor COD " + (j + 1))
          .style(style);
        ws.cell(3, row + 1)
          .string("Probe Sensor COD " + (j + 1))
          .style(style);
        ws.cell(3, row + 2)
          .string("Min Sensor COD " + (j + 1))
          .style(style);
        ws.cell(3, row + 3)
          .string("Max Sensor COD " + (j + 1))
          .style(style);
        ws.cell(col + 2, row).string(formList[i].sensor.cod[j].brand);
        ws.cell(col + 2, row + 1).string(formList[i].sensor.cod[j].probe);
        ws.cell(col + 2, row + 2).string(
          formList[i].sensor.cod[j].minMeasurement
        );
        ws.cell(col + 2, row + 3).string(
          formList[i].sensor.cod[j].maxMeasurement
        );
      }
      row = row + 4;
      lastRow = row > lastRow ? row : lastRow;
    }
    if (i == formList.length - 1) {
      ws.cell(
        1,
        firstcodRow,
        1,
        formList[i].sensor.cod.length != 0 ? lastRow - 1 : lastRow + 3,
        true
      )
        .string("Sensor COD")
        .style(style);
    }
    col++;
  }
  col = 3;
  let starttssrow = lastRow;
  const firsttssRow = lastRow;
  secCol = 0;
  for (let i = 0; i < formList.length; i++) {
    let row = starttssrow;
    for (let j = 0; j < formList[i].sensor.tss.length; j++) {
      if (j + 1 > secCol) {
        secCol++;
        ws.cell(2, row, 2, row + 3, true)
          .string("Sensor TSS " + (j + 1))
          .style(style);
        ws.cell(3, row)
          .string("Nama Sensor TSS " + (j + 1))
          .style(style);
        ws.cell(3, row + 1)
          .string("Probe Sensor TSS " + (j + 1))
          .style(style);
        ws.cell(3, row + 2)
          .string("Min Sensor TSS " + (j + 1))
          .style(style);
        ws.cell(3, row + 3)
          .string("Max Sensor TSS " + (j + 1))
          .style(style);

        if (formList[i].sensor.tss.length > 1) {
          ws.cell(col + 2, row).string(formList[i].sensor.tss[j].brand);
          ws.cell(col + 2, row + 1).string(formList[i].sensor.tss[j].probe);
          ws.cell(col + 2, row + 2).string(
            formList[i].sensor.tss[j].minMeasurement
          );
          ws.cell(col + 2, row + 3).string(
            formList[i].sensor.tss[j].maxMeasurement
          );
        }
        if (j == 0) {
          ws.cell(col + 1, row).string(formList[i].sensor.tss[j].brand);
          ws.cell(col + 1, row + 1).string(formList[i].sensor.tss[j].probe);
          ws.cell(col + 1, row + 2).string(
            formList[i].sensor.tss[j].minMeasurement
          );
          ws.cell(col + 1, row + 3).string(
            formList[i].sensor.tss[j].maxMeasurement
          );
          col--;
        }
      } else {
        ws.cell(3, row)
          .string("Nama Sensor TSS " + (j + 1))
          .style(style);
        ws.cell(3, row + 1)
          .string("Probe Sensor TSS " + (j + 1))
          .style(style);
        ws.cell(3, row + 2)
          .string("Min Sensor TSS " + (j + 1))
          .style(style);
        ws.cell(3, row + 3)
          .string("Max Sensor TSS " + (j + 1))
          .style(style);
        ws.cell(col + 2, row).string(formList[i].sensor.tss[j].brand);
        ws.cell(col + 2, row + 1).string(formList[i].sensor.tss[j].probe);
        ws.cell(col + 2, row + 2).string(
          formList[i].sensor.tss[j].minMeasurement
        );
        ws.cell(col + 2, row + 3).string(
          formList[i].sensor.tss[j].maxMeasurement
        );
      }
      row = row + 4;
      lastRow = row > lastRow ? row : lastRow;
    }
    if (i == formList.length - 1) {
      ws.cell(
        1,
        firsttssRow,
        1,
        formList[i].sensor.tss.length != 0 ? lastRow - 1 : lastRow + 3,
        true
      )
        .string("Sensor TSS")
        .style(style);
    }
    col++;
  }
  col = 3;
  let startnh3nrow = lastRow;
  const firstnh3nRow = lastRow;
  secCol = 0;
  for (let i = 0; i < formList.length; i++) {
    let row = startnh3nrow;
    for (let j = 0; j < formList[i].sensor.nh3n.length; j++) {
      if (j + 1 > secCol) {
        secCol++;
        ws.cell(2, row, 2, row + 3, true)
          .string("Sensor NH3N " + (j + 1))
          .style(style);
        ws.cell(3, row)
          .string("Nama Sensor NH3N " + (j + 1))
          .style(style);
        ws.cell(3, row + 1)
          .string("Probe Sensor NH3N " + (j + 1))
          .style(style);
        ws.cell(3, row + 2)
          .string("Min Sensor NH3N " + (j + 1))
          .style(style);
        ws.cell(3, row + 3)
          .string("Max Sensor NH3N " + (j + 1))
          .style(style);
        if (formList[i].sensor.cod.length > 1) {
          ws.cell(col + 2, row).string(formList[i].sensor.nh3n[j].brand);
          ws.cell(col + 2, row + 1).string(formList[i].sensor.nh3n[j].probe);
          ws.cell(col + 2, row + 2).string(
            formList[i].sensor.nh3n[j].minMeasurement
          );
          ws.cell(col + 2, row + 3).string(
            formList[i].sensor.nh3n[j].maxMeasurement
          );
        }
        if (j == 0) {
          ws.cell(col + 1, row).string(formList[i].sensor.nh3n[j].brand);
          ws.cell(col + 1, row + 1).string(formList[i].sensor.nh3n[j].probe);
          ws.cell(col + 1, row + 2).string(
            formList[i].sensor.nh3n[j].minMeasurement
          );
          ws.cell(col + 1, row + 3).string(
            formList[i].sensor.nh3n[j].maxMeasurement
          );
          col--;
        }
      } else {
        ws.cell(3, row)
          .string("Nama Sensor NH3N " + (j + 1))
          .style(style);
        ws.cell(3, row + 1)
          .string("Probe Sensor NH3N " + (j + 1))
          .style(style);
        ws.cell(3, row + 2)
          .string("Min Sensor NH3N " + (j + 1))
          .style(style);
        ws.cell(3, row + 3)
          .string("Max Sensor NH3N " + (j + 1))
          .style(style);
        ws.cell(col + 2, row).string(formList[i].sensor.nh3n[j].brand);
        ws.cell(col + 2, row + 1).string(formList[i].sensor.nh3n[j].probe);
        ws.cell(col + 2, row + 2).string(
          formList[i].sensor.nh3n[j].minMeasurement
        );
        ws.cell(col + 2, row + 3).string(
          formList[i].sensor.nh3n[j].maxMeasurement
        );
      }
      row = row + 4;
      lastRow = row > lastRow ? row : lastRow;
    }
    if (i == formList.length - 1) {
      ws.cell(
        1,
        firstnh3nRow,
        1,
        formList[i].sensor.nh3n.length != 0 ? lastRow - 1 : lastRow + 3,
        true
      )
        .string("Sensor NH3N")
        .style(style);
    }
    col++;
  }
  col = 3;
  let startdebitrow = lastRow;
  const firstdebitRow = lastRow;
  secCol = 0;
  for (let i = 0; i < formList.length; i++) {
    let row = startdebitrow;
    for (let j = 0; j < formList[i].sensor.debit.length; j++) {
      if (j + 1 > secCol) {
        secCol++;
        ws.cell(2, row, 2, row + 3, true)
          .string("Sensor Debit " + (j + 1))
          .style(style);
        ws.cell(3, row)
          .string("Nama Sensor Debit " + (j + 1))
          .style(style);
        ws.cell(3, row + 1)
          .string("Probe Sensor Debit " + (j + 1))
          .style(style);
        ws.cell(3, row + 2)
          .string("Min Sensor Debit " + (j + 1))
          .style(style);
        ws.cell(3, row + 3)
          .string("Max Sensor Debit " + (j + 1))
          .style(style);

        if (formList[i].sensor.cod.length > 1) {
          ws.cell(col + 2, row).string(formList[i].sensor.debit[j].brand);
          ws.cell(col + 2, row + 1).string(formList[i].sensor.debit[j].probe);
          ws.cell(col + 2, row + 2).string(
            formList[i].sensor.debit[j].minMeasurement
          );
          ws.cell(col + 2, row + 3).string(
            formList[i].sensor.debit[j].maxMeasurement
          );
        }
        if (j == 0) {
          ws.cell(col + 1, row).string(formList[i].sensor.debit[j].brand);
          ws.cell(col + 1, row + 1).string(formList[i].sensor.debit[j].probe);
          ws.cell(col + 1, row + 2).string(
            formList[i].sensor.debit[j].minMeasurement
          );
          ws.cell(col + 1, row + 3).string(
            formList[i].sensor.debit[j].maxMeasurement
          );
          col--;
        }
      } else {
        ws.cell(3, row)
          .string("Nama Sensor Debit " + (j + 1))
          .style(style);
        ws.cell(3, row + 1)
          .string("Probe Sensor Debit " + (j + 1))
          .style(style);
        ws.cell(3, row + 2)
          .string("Min Sensor Debit " + (j + 1))
          .style(style);
        ws.cell(3, row + 3)
          .string("Max Sensor Debit " + (j + 1))
          .style(style);
        ws.cell(col + 2, row).string(formList[i].sensor.debit[j].brand);
        ws.cell(col + 2, row + 1).string(formList[i].sensor.debit[j].probe);
        ws.cell(col + 2, row + 2).string(
          formList[i].sensor.debit[j].minMeasurement
        );
        ws.cell(col + 2, row + 3).string(
          formList[i].sensor.debit[j].maxMeasurement
        );
      }
      row = row + 4;
      lastRow = row > lastRow ? row : lastRow;
    }
    if (i == formList.length - 1) {
      ws.cell(
        1,
        firstdebitRow,
        1,
        formList[i].sensor.debit.length != 0 ? lastRow - 1 : lastRow + 3,
        true
      )
        .string("Sensor Debit")
        .style(style);
    }
    col++;
  }

  wb.write(`List Laporan Data Pendaftaran Uji Konektifitas.xlsx`, res);
});

// POST
router.post("/create", async (req, res) => {
  let umum = req.body.form.umum;
  let logger = req.body.form.logger;
  let sensor = req.body.form.sensor;
  let data = req.body.form;
  data.created_time = moment().unix();
  data.validated = false;
  data.validitas = [
    {
      _id: makeid(24),
      user_id: "",
      keterangan: "Menunggu Validasi",
      status: "pending",
      tanggal_uji: "",
      created_time: moment().unix(),
    },
  ];

  let msg = { data: [], error: [], status: "", code: 0 };
  let status = 200;

  const savePendaftaran = new ujikonekDB(data);
  try {
    const savedPendaftaran = await savePendaftaran.save();
    msg.data = savedPendaftaran;
    msg.status = "success";
    msg.code = 200;
    res.send(msg);
  } catch (error) {
    msg.error.push({ form: "system", msg: error });
    msg.status = "failed";
    msg.code = 400;
    res.status(400).send(msg);
  }
});

// GET STATUS
router.get("/status/:id", async (req, res) => {
  let id = req.params.id;
  let msg = { _id: "", error: [], status: "", validated: false, code: 0 };
  let status = 200;
  try {
    const pendaftaran = await ujikonekDB.findOne({ _id: id });
    if (!pendaftaran) {
      msg._id = id;
      msg.status = "Pendaftaran not found!";
      msg.code = 400;
      return res.status(400).send(msg);
    }
    msg._id = id;
    msg.status = "Data ditemukan";
    // msg.validated = true;
    msg.code = 200;
    return res.status(200).send(msg);
  } catch (err) {
    msg._id = id;
    msg.error = err;
    msg.status = "Pendaftaran not found!";
    msg.code = 400;
    return res.status(400).send(msg);
  }
});

router.post("/validasi/:ujikonekID", async (req, res) => {
  // debug req body yang dikirim Front end
  // console.log(req.body)
  // return;
  try {
    let i = 1;
    let rand, newUid;
    while (true) {
      rand = i < 10 ? "0" + i : i;
      newUid = "20000" + moment().format("YYYYMM") + rand;
      let check = await ujikonekDB.findOne({
        uid: newUid,
      });
      if (check) {
        let isExist = await ujikonekDB.findOne({
          _id: req.params.ujikonekID,
          uid: newUid,
        });
        if (isExist) {
          newUid = isExist.uid;
          break;
        } else {
          i++;
        }
      } else {
        break;
      }
    }
    let rec = await ujikonekDB.findOne({ _id: req.params.ujikonekID });
    let uid = req.body.uid;
    if (!rec) {
      res.status(400).send("Pendaftaran uji-konek not found");
      return;
    }
    let validity = {
      _id: makeid(24),
      user_id: req.body.user_id,
      keterangan: req.body.keterangan,
      status: req.body.status,
      tanggal_uji: req.body.tanggal_uji,
      created_time: moment().unix(),
    };
    rec.validitas = (rec.validitas || []).concat(validity);
    rec.validated = validity.status === "accepted";
    rec.uid = newUid;

    await rec.save();
    res.send(rec);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/validasi/:ujikonekID/:validitasID", async (req, res) => {
  try {
    let rec = await ujikonekDB.findOne({ _id: req.params.ujikonekID });
    if (!rec) {
      res.status(400).send("Pendaftaran uji-konek not found");
      return;
    }

    rec.validitas = rec.validitas || [];
    let n = rec.validitas.findIndex((a) => a._id === req.params.validitasID);
    if (n < 0) {
      res.status(400).send("Validitas uji-konek not found");
      return;
    }

    rec.validitas.splice(n, 1);
    await rec.save();
    res.send(rec);
  } catch (err) {
    res.status(400).send(err);
  }
});

// delete uji konek
router.delete("/:ujikonekID", async (req, res) => {
  let id = req.params.ujikonekID;
  let msg = { _id: "", error: [], status: "", code: 0 };
  let status = 200;
  try {
    const pendaftaran = await ujikonekDB.findOne({ _id: id });
    if (!pendaftaran) {
      msg._id = id;
      msg.status = "Pendaftaran not found!";
      msg.code = 400;
      return res.status(400).send(msg);
    }
    await ujikonekDB.deleteOne({ _id: id });
    msg._id = id;
    msg.status = "Pendaftaran deleted";
    msg.code = 200;
    return res.status(200).send(msg);
  } catch (err) {
    msg._id = id;
    msg.error = err;
    msg.status = "Pendaftaran not found!";
    msg.code = 400;
    return res.status(400).send(msg);
  }
});

// update uji konek
router.put("/:ujikonekID", async (req, res) => {
  let id = req.params.ujikonekID;
  let msg = { _id: "", error: [], status: "", code: 0 };
  let status = 200;
  try {
    const pendaftaran = await ujikonekDB.findOne({ _id: id });
    pendaftaran.validitas = pendaftaran.validitas || [];
    let validity = {
      _id: makeid(24),
      user_id: "",
      keterangan: "Menunggu Validasi",
      status: "pending",
      tanggal_uji: "",
      created_time: moment().unix(),
    };
    pendaftaran.validitas.push(validity);

    if (!pendaftaran) {
      msg._id = id;
      msg.status = "Pendaftaran not found!";
      msg.code = 400;
      return res.status(400).send(msg);
    }
    pendaftaran.umum = req.body.umum;
    pendaftaran.logger = req.body.logger;
    pendaftaran.sensor = req.body.sensor;
    pendaftaran.validated = false;
    pendaftaran.created_time = moment().unix();
    await pendaftaran.save();
    msg._id = id;
    msg.status = "Pendaftaran updated";
    msg.code = 200;
    return res.status(200).send(msg);
  } catch (err) {
    msg._id = id;
    msg.error = err;
    msg.status = "Pendaftaran not found!";
    msg.code = 400;
    return res.status(400).send(msg);
  }
});

module.exports = router;
