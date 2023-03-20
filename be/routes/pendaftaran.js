// initial pendaftaran

let express = require("express");
let router = express.Router();
module.exports = router;

let moment = require("moment");
let pendaftaranDB = require("../model/formRegisComp");
let userDB = require("../model/User");
let compDB = require("../model/Company");
let provDB = require("../model/Province");
let kabkotDB = require("../model/Kabkot");
let loggerDB = require("../model/Logger");
let validitasDB = require("../model/History_pendaftaran");
let historyPerubahanDB = require("../model/History_perubahan_data");
let ujikonekDB = require("../model/Ujikonektivitas");
let documentsDB = require("../model/History_doc");
let { makeid } = require("../services/helper");
let xl = require("excel4node");

let addValidasi = async ({ pendaftaranId, keterangan, action, user_id }) => {
  let validitas = await validitasDB.findOne({
    formregiscomps_id: pendaftaranId,
  });
  let validity = {
    _id: makeid(24),
    keterangan: keterangan,
    status: validitas ? "Pengajuan Ulang" : "Pengajuan Baru",
    act: action,
    user_id: user_id,
    created_time: moment().unix(),
  };
  if (validitas) {
    validitas.histori_pendaftaran.push(validity);
    await validitas.save();
    return validitas;
  } else {
    let r = new validitasDB({
      formregiscomps_id: pendaftaranId,
      histori_pendaftaran: [validity],
    });
    await r.save();
    return r;
  }
};

// put a validation for a pendaftaran
//
router.put("/validasi/:pendaftaranID", async (req, res) => {
  let id = req.params.pendaftaranID;
  let compID;
  let pendaftaran = await pendaftaranDB.findOne({
    _id: id,
  });
  if (!pendaftaran) {
    return res.status(400).send("Unable to find pendaftaran");
  }

  let rejected = req.body.action === "rejected";
  let add_pendaftaran = await pendaftaranDB.updateOne(
    {
      _id: id,
    },
    {
      validated: !rejected,
      rejected,
    }
  );

  let add_validasi = await addValidasi({
    pendaftaranId: id,
    keterangan: req.body.keterangan,
    action: req.body.action,
    user_id: req.body.user_id,
  });

  // IF rejected true just update status formregiscomps and add validasi content
  if (rejected) {
    res.send({
      add_pendaftaran,
      add_validasi,
    });
    return;
  }

  // let validitas = await validitasDB.findOne({
  //     formregiscomps_id: id
  // })
  // let validity  = {
  //     "_id": makeid(24),
  //     "keterangan": req.body.keterangan,
  //     "status": validitas ? 'Pengajuan Baru' : 'Pengajuan Ulang',
  //     "act": req.body.action,
  //     "user_id": req.body.user_id,
  //     "created_time": moment().unix(),
  // }
  // if (validitas) {
  //     validitas.histori_pendaftaran.push(validity)
  //     await validitas.save()
  // } else {
  //     let r = new validitasDB({
  //         formregiscomps_id: id,
  //         histori_pendaftaran: [validity],
  //     })
  //     await r.save()
  // }

  if (pendaftaran.validated === true) {
    return res.status(400).send("Data has been Validated");
  }

  let companyID = await compDB.findOne({
    compName: pendaftaran.umum.compName,
  });
  // JIKA DAFTAR PROSES PRODUKSI AIR LIMBAH

  if (pendaftaran.prosesProduksi) {
    if (pendaftaran.prosesProduksi.debitPenggunaan.value != null) {
      if (!companyID) {
        let compNew = new compDB({
          compName: pendaftaran.umum.compName,
          compAddress: pendaftaran.umum.compAddress,
          compTlp: pendaftaran.umum.compPhone,
          compType: pendaftaran.umum.compType,
          compPermit: pendaftaran.teknis.permitFile.path || "-",
          compWasteSource: pendaftaran.teknis.wasteSource || "-",
          compInstance: pendaftaran.teknis.permitPerson || "-",
          compPermitDate: pendaftaran.teknis.permitNumber || "-",
          compTech: pendaftaran.teknis.processingTechnique || "-",
          compPermohonanKoneksi: pendaftaran.umum.permohonanKoneksi || "-",
        });
        let compSave = await compNew.save();

        let userNew = new userDB({
          userEmail: pendaftaran.akun.personMail,
          userPassword: pendaftaran.akun.personPassword,
          userRole: {
            role: "comp",
            kabkotID: pendaftaran.umum.compCity,
            provID: pendaftaran.umum.compProvince,
            compID: String(compSave._id),
            profileID: String(pendaftaran._id),
          },
        });
        let userSave = await userNew.save();
      }

      res.send("data berhasil di approve");
      return;
    }
  }

  // CHECK COMPANY SUDAH ADA ATAU BELUM DI COLLECTION COMPANY JIKA TRUE BERARTI DATA EXISITING DAN SUDAH MEMPUNYAI USER DAN LOGGER

  if (!companyID) {
    let compNew = new compDB({
      compName: pendaftaran.umum.compName,
      compAddress: pendaftaran.umum.compAddress,
      compTlp: pendaftaran.umum.compPhone,
      compType: pendaftaran.umum.compType,
      compPermit: pendaftaran.teknis.permitFile.path || "-",
      compWasteSource: pendaftaran.teknis.wasteSource || "-",
      compInstance: pendaftaran.teknis.permitPerson || "-",
      compPermitDate: pendaftaran.teknis.permitNumber || "-",
      compTech: pendaftaran.teknis.processingTechnique || "-",
      compPermohonanKoneksi: pendaftaran.umum.permohonanKoneksi || "-",
    });
    let compSave = await compNew.save();

    let userNew = new userDB({
      userEmail: pendaftaran.akun.personMail,
      userPassword: pendaftaran.akun.personPassword,
      userRole: {
        role: "comp",
        kabkotID: pendaftaran.umum.compCity,
        provID: pendaftaran.umum.compProvince,
        compID: String(compSave._id),
        profileID: String(pendaftaran._id),
      },
    });
    let userSave = await userNew.save();
    // const time = moment().unix() * 1000;
    let sensors = pendaftaran.sensor;
    let nextTimeph = sensors[0].active
      ? parseInt(sensors[0].tanggalKalibrasi)
      : null;
    if (nextTimeph !== null) {
      // while (true) {
      nextTimeph = moment(nextTimeph * 1000)
        .add(parseInt(sensors[0].jadwalKalibrasi) + 2, "M")
        .unix();
      //   if (time < nextTimeph) {
      //     break;
      //   }
      // }
    }
    let nextTimecod = sensors[1].active
      ? parseInt(sensors[1].tanggalKalibrasi)
      : null;
    if (nextTimecod !== null) {
      // while (true) {
      nextTimecod = moment(nextTimecod * 1000)
        .add(parseInt(sensors[1].jadwalKalibrasi) + 2, "M")
        .unix();
      //   if (time < nextTimecod) {
      //     break;
      //   }
      // }
    }
    let nextTimetss = sensors[2].active
      ? parseInt(sensors[2].tanggalKalibrasi)
      : null;
    if (nextTimetss !== null) {
      // while (true) {
      nextTimetss = moment(nextTimetss * 1000)
        .add(parseInt(sensors[2].jadwalKalibrasi) + 2, "M")
        .unix();
      //   if (time < nextTimetss) {
      //     break;
      //   }
      // }
    }
    let nextTimenh3n = sensors[3].active
      ? parseInt(sensors[3].tanggalKalibrasi)
      : null;
    if (nextTimenh3n !== null) {
      // while (true) {
      nextTimenh3n = moment(nextTimenh3n * 1000)
        .add(parseInt(sensors[3].jadwalKalibrasi) + 2, "M")
        .unix();
      //   if (time < nextTimenh3n) {
      //     break;
      //   }
      // }
    }
    let nextTimedebit = sensors[4].active
      ? parseInt(sensors[4].tanggalKalibrasi)
      : null;
    if (nextTimedebit !== null) {
      // while (true) {
      nextTimedebit = moment(nextTimedebit * 1000)
        .add(parseInt(sensors[4].jadwalKalibrasi) + 2, "M")
        .unix();
      //   if (time < nextTimedebit) {
      //     break;
      //   }
      // }
    }
    // value.nextKalibrasi = nextTime;
    let loggerNew = new loggerDB({
      compID: compSave._id,
      kabkotID: pendaftaran.umum.compCity,
      provID: pendaftaran.umum.compProvince,
      logDataRange: [
        {
          name: "pH",
          min: sensors[0].active ? Number(sensors[0].min) : null,
          max: sensors[0].active ? Number(sensors[0].max) : null,
          jadwalKalibrasi: sensors[0].active
            ? parseInt(sensors[0].jadwalKalibrasi)
            : null,
          tanggalKalibrasi: sensors[0].active
            ? sensors[0].tanggalKalibrasi
            : null,
          nextKalibrasi: sensors[0].active ? nextTimeph : null,
        },
        {
          name: "COD",
          min: sensors[1].active ? Number(sensors[1].min) : null,
          max: sensors[1].active ? Number(sensors[1].max) : null,
          jadwalKalibrasi: sensors[1].active
            ? parseInt(sensors[1].jadwalKalibrasi)
            : null,
          tanggalKalibrasi: sensors[1].active
            ? sensors[1].tanggalKalibrasi
            : null,
          nextKalibrasi: sensors[1].active ? nextTimecod : null,
        },
        {
          name: "TSS",
          min: sensors[2].active ? Number(sensors[2].min) : null,
          max: sensors[2].active ? Number(sensors[2].max) : null,
          jadwalKalibrasi: sensors[2].active
            ? parseInt(sensors[2].jadwalKalibrasi)
            : null,
          tanggalKalibrasi: sensors[2].active
            ? sensors[2].tanggalKalibrasi
            : null,
          nextKalibrasi: sensors[2].active ? nextTimetss : null,
        },
        {
          name: "NH3N",
          min: sensors[3].active ? Number(sensors[3].min) : null,
          max: sensors[3].active ? Number(sensors[3].max) : null,
          jadwalKalibrasi: sensors[3].active
            ? parseInt(sensors[3].jadwalKalibrasi)
            : null,
          tanggalKalibrasi: sensors[3].active
            ? sensors[3].tanggalKalibrasi
            : null,
          nextKalibrasi: sensors[3].active ? nextTimenh3n : null,
        },
        {
          name: "Debit",
          min: sensors[4].active ? Number(sensors[4].min) : null,
          max: sensors[4].active ? Number(sensors[4].max) : null,
          jadwalKalibrasi: sensors[4].active
            ? parseInt(sensors[4].jadwalKalibrasi)
            : null,
          tanggalKalibrasi: sensors[4].active
            ? sensors[4].tanggalKalibrasi
            : null,
          nextKalibrasi: sensors[4].active ? nextTimedebit : null,
        },
      ],
      latlong: {
        lat: Number(
          ((((pendaftaran.teknis || {}).spotList || [])[0] || {}).spotLoc ||
            [])[0]
        ),
        lng: Number(
          ((((pendaftaran.teknis || {}).spotList || [])[0] || {}).spotLoc ||
            [])[1]
        ),
        // lat: Number(pendaftaran.teknis.spotList[0].spotLoc[0]),
        // lng: Number(pendaftaran.teknis.spotList[0].spotLoc[1]),
      },
      errCounter: 0,
      satuanDebit: pendaftaran.teknis.satuanDebit,
      activationStatus: true,
    });
    let loggerSave = await loggerNew.save();
  } else {
    let sensors = pendaftaran.sensor;
    let loggerNew = {
      compID: companyID._id,
      kabkotID: pendaftaran.umum.compCity,
      provID: pendaftaran.umum.compProvince,
      logDataRange: [
        {
          name: "pH",
          min: sensors[0].active ? Number(sensors[0].min) : null,
          max: sensors[0].active ? Number(sensors[0].max) : null,
          jadwalKalibrasi: sensors[0].active
            ? parseInt(sensors[0].jadwalKalibrasi)
            : null,
          tanggalKalibrasi: sensors[0].active
            ? sensors[0].tanggalKalibrasi
            : null,
          nextKalibrasi: sensors[0].active
            ? moment(sensors[0].tanggalKalibrasi * 1000)
                .add(parseInt(sensors[0].jadwalKalibrasi) + 2, "M")
                .unix()
            : null,
        },
        {
          name: "COD",
          min: sensors[1].active ? Number(sensors[1].min) : null,
          max: sensors[1].active ? Number(sensors[1].max) : null,
          jadwalKalibrasi: sensors[1].active
            ? parseInt(sensors[1].jadwalKalibrasi)
            : null,
          tanggalKalibrasi: sensors[1].active
            ? sensors[1].tanggalKalibrasi
            : null,
          nextKalibrasi: sensors[1].active
            ? moment(sensors[1].tanggalKalibrasi * 1000)
                .add(parseInt(sensors[1].jadwalKalibrasi) + 2, "M")
                .unix()
            : null,
        },
        {
          name: "TSS",
          min: sensors[2].active ? Number(sensors[2].min) : null,
          max: sensors[2].active ? Number(sensors[2].max) : null,
          jadwalKalibrasi: sensors[2].active
            ? parseInt(sensors[2].jadwalKalibrasi)
            : null,
          tanggalKalibrasi: sensors[2].active
            ? sensors[2].tanggalKalibrasi
            : null,
          nextKalibrasi: sensors[2].active
            ? moment(sensors[2].tanggalKalibrasi * 1000)
                .add(parseInt(sensors[2].jadwalKalibrasi) + 2, "M")
                .unix()
            : null,
        },
        {
          name: "NH3N",
          min: sensors[3].active ? Number(sensors[3].min) : null,
          max: sensors[3].active ? Number(sensors[3].max) : null,
          jadwalKalibrasi: sensors[3].active
            ? parseInt(sensors[3].jadwalKalibrasi)
            : null,
          tanggalKalibrasi: sensors[3].active
            ? sensors[3].tanggalKalibrasi
            : null,
          nextKalibrasi: sensors[3].active
            ? moment(sensors[3].tanggalKalibrasi * 1000)
                .add(parseInt(sensors[3].jadwalKalibrasi) + 2, "M")
                .unix()
            : null,
        },
        {
          name: "Debit",
          min: sensors[4].active ? Number(sensors[4].min) : null,
          max: sensors[4].active ? Number(sensors[4].max) : null,
          jadwalKalibrasi: sensors[4].active
            ? parseInt(sensors[4].jadwalKalibrasi)
            : null,
          tanggalKalibrasi: sensors[4].active
            ? sensors[4].tanggalKalibrasi
            : null,
          nextKalibrasi: sensors[4].active
            ? moment(sensors[4].tanggalKalibrasi * 1000)
                .add(parseInt(sensors[4].jadwalKalibrasi) + 2, "M")
                .unix()
            : null,
        },
      ],
      latlong: {
        lat: Number(
          ((((pendaftaran.teknis || {}).spotList || [])[0] || {}).spotLoc ||
            [])[0]
        ),
        lng: Number(
          ((((pendaftaran.teknis || {}).spotList || [])[0] || {}).spotLoc ||
            [])[1]
        ),
        // lat: Number(pendaftaran.teknis.spotList[0].spotLoc[0]),
        // lng: Number(pendaftaran.teknis.spotList[0].spotLoc[1]),
      },
      errCounter: 0,
      satuanDebit: pendaftaran.teknis.satuanDebit,
      activationStatus: true,
    };

    await loggerDB.updateOne(
      {
        compID: companyID._id,
      },
      {
        $set: loggerNew,
      }
    );
  }

  // END PENGECEKAN COMPANY

  res.send("Data berhasil di approve");
  // res.send({
  //   userSave,
  //   compSave,
  //   loggerSave,
  // });
});

// returns list of validations for a pendaftaran
//
router.get("/validasi/:pendaftaranID", async (req, res) => {
  let rs = await validitasDB.aggregate([
    {
      $match: {
        formregiscomps_id: req.params.pendaftaranID,
      },
    },
    { $addFields: { objectFormId: { $toObjectId: "$formregiscomps_id" } } },
    {
      $lookup: {
        from: "formregiscomps",
        localField: "objectFormId",
        foreignField: "_id",
        as: "formRegis",
      },
    },
    {
      $unwind: "$formRegis",
    },
    { $addFields: { compName: "$formRegis.umum.compNameID" } },
    {
      $project: {
        histori_pendaftaran: 1,
        _id: 1,
        formregiscomps_id: 1,
        compName: 1,
      },
    },
  ]);
  res.send(rs);
});

// returns list of document history of a company
//
router.get("/documents/:pendaftaranID", async function (req, res, next) {
  let rs = await documentsDB.find({
    pendaftaranID: req.params.pendaftaranID,
  });
  res.send(
    rs
      .map((r) => r.detail_dokumen)
      .flat()
      .sort((a, b) => b.updated_time - a.updated_time)
  );
});

// returns list of pendaftaran
// if invalid, only validated:false
//
router.get("/list/:invalid?", async (req, res) => {
  let query = req.params.invalid
    ? {
        validated: false,
      }
    : {};
  let formList = await pendaftaranDB.find(query);

  // let formList = await pendaftaranDB.aggregate([
  //   {
  //     $match: query,
  //   },
  //   { $addFields: { objectCompCity: { $toObjectId: "$umum.compCity" } } },
  //   {
  //     $lookup: {
  //       from: "kabkotdbs",
  //       localField: "objectCompCity",
  //       foreignField: "_id",
  //       as: "kabkot",
  //     },
  //   },
  //   {
  //     $unwind: "$kabkot",
  //   },
  //   {
  //     $addFields: { objectCompProvince: { $toObjectId: "$umum.compProvince" } },
  //   },
  //   {
  //     $lookup: {
  //       from: "provdbs",
  //       localField: "objectCompProvince",
  //       foreignField: "_id",
  //       as: "prov",
  //     },
  //   },
  //   {
  //     $unwind: "$prov",
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       umum: {
  //         compName: 1,
  //         compNameID: 1,
  //         compType: 1,
  //         compAddress: 1,
  //         compStreet: 1,
  //         compCity: "$kabkot.kabkotName",
  //         compProvince: "$prov.provName",
  //         compPhone: 1,
  //         compMail: 1,
  //         nameSIUP: 1,
  //         ifTambang: 1,
  //         rencanaFile: 1,
  //         siupFile: 1,
  //         updatedAt: 1,
  //         createdAt: 1,
  //       },
  //       logger: 1,
  //       sensor: 1,
  //       akun: 1,
  //       prosesProduksi: 1,
  //       teknis: 1,
  //       validitas: 1,
  //       frekuensi: 1,
  //       surat: 1,
  //       validated: 1,
  //       rejected: 1,
  //       timestamp: 1,
  //     },
  //   },
  //   {
  //     $sort: {
  //       _id: -1,
  //     },
  //   },
  // ]);
  for (let i = 0; i < formList.length; i++) {
    const prov = await provDB.findOne({
      _id: formList[i].umum.compProvince,
    });
    const kabkot = await kabkotDB.findOne({
      _id: formList[i].umum.compCity,
    });

    const timestamp = formList[i]._id.toString().substring(0, 8);
    formList[i].umum.createdAt = parseInt(timestamp, 16);
    formList[i].umum.compProvinceName = prov.provName;
    formList[i].umum.compCityName = kabkot.kabkotName;

    if (!formList[i].validated === true) {
      continue;
    }

    const comp = await compDB.findOne({
      compName: formList[i].umum.compName,
    });

    if (formList[i].umum.loggerID != undefined) {
      const logger = await loggerDB.findOne({
        compID: comp._id,
      });
      formList[i].umum.loggerID = logger._id;
    }
  }

  res.send(formList);
});

// exports pendaftaran to excel
//
router.get("/export", async function (req, res, next) {
  var wb = new xl.Workbook();
  var ws = wb.addWorksheet("Sparing");

  let col = 1;
  //Akun
  ws.cell(col, 1).string("Nama Kontak Person");
  ws.cell(col, 2).string("Nomor Handphone");
  ws.cell(col, 3).string("Email Kontak Person");
  ws.cell(col, 4).string("Password Akun");
  ws.cell(col, 5).string("Nama Perusahaan");
  ws.cell(col, 6).string("Jenis Industri");
  ws.cell(col, 7).string("Nama Penanggung Jawab SIUP");
  ws.cell(col, 8).string("Lampiran SIUP");
  ws.cell(col, 9).string("Alamat Perusahaan");
  ws.cell(col, 10).string("Jalan");
  ws.cell(col, 11).string("Kabupaten / Kota");
  ws.cell(col, 12).string("Provinsi");
  ws.cell(col, 13).string("Telepon Kantor");
  ws.cell(col, 14).string("Email Kantor");
  ws.cell(col, 15).string("Frekuensi Pembuangan Air Limbah");
  ws.cell(col, 16).string("Per hari");
  ws.cell(col, 17).string("Per minggu");
  ws.cell(col, 18).string("Per tahun");
  ws.cell(col, 19).string("Nama Penyedia Barang dan Jasa");
  ws.cell(col, 20).string("Kontrak Kerjasama");
  ws.cell(col, 21).string("Lulus Uji Konektivitas");
  ws.cell(col, 22).string("Hasil Kalibrasi Saat Awal Pemasangan Alat");
  ws.cell(col, 23).string("Hasil Kalibrasi Alat Rutin");
  ws.cell(col, 24).string(
    "Hasil Uji Kinerja Dari Laboratorium Yang Ditunjuk Oleh KLHK"
  );
  ws.cell(col, 25).string("Surat Dukungan Dari Brand Sensor");
  ws.cell(col, 26).string("Surat Pernyataan");

  const formList = await formRegisDB.find();
  for (let i = 0; i < formList.length; i++) {
    const prov = await provDB.findOne({
      _id: formList[i].umum.compProvince,
    });

    const kabkot = await kabkotDB.findOne({
      _id: formList[i].umum.compCity,
    });

    const timestamp = formList[i]._id.toString().substring(0, 8);

    formList[i].umum.createdAt = parseInt(timestamp, 16);
    formList[i].umum.compProvinceName = prov.provName;
    formList[i].umum.compCityName = kabkot.kabkotName;

    if (formList[i].validated === true) {
      const comp = await compDB.findOne({
        compName: formList[i].umum.compName,
      });

      if (formList[i].umum.loggerID != undefined) {
        const logger = await loggerDB.findOne({
          compID: comp._id,
        });
        formList[i].umum.loggerID = logger._id;
      }
    }

    col++;
    ws.cell(col, 1).string(formList[i].akun.personName);
    ws.cell(col, 2).string(formList[i].akun.personPhone);
    ws.cell(col, 3).string(formList[i].akun.personMail);
    ws.cell(col, 4).string(formList[i].akun.personPassword);
    ws.cell(col, 5).string(formList[i].umum.compName);
    ws.cell(col, 6).string(formList[i].umum.compType);
    ws.cell(col, 7).string(formList[i].umum.nameSIUP);
    ws.cell(col, 8).string(formList[i].umum.personPassword);
    ws.cell(col, 9).string(formList[i].umum.compAddress);
    ws.cell(col, 10).string(formList[i].umum.compStreet);
    ws.cell(col, 11).string(formList[i].umum.compCityName);
    ws.cell(col, 12).string(formList[i].umum.compProvinceName);
    ws.cell(col, 13).string(formList[i].umum.compPhone);
    ws.cell(col, 14).string(formList[i].umum.compMail);
    ws.cell(col, 15).string("Terus Menerus/Kontinyu");
    ws.cell(col, 16).string(formList[i].frekuensi.jam + " Jam");
    ws.cell(col, 17).string(formList[i].frekuensi.hari + " Hari");
    ws.cell(col, 18).string(formList[i].frekuensi.bulan + " Bulan");
    ws.cell(col, 19).string(formList[i].validitas.namaPenyedia);
    ws.cell(col, 20).string(
      formList[i].validitas.kontrak.hasOwnProperty("path") &&
        formList[i].validitas.kontrak.path != ""
        ? "File Terupload"
        : "File tidak tersedia"
    );
    ws.cell(col, 21).string(
      formList[i].validitas.konektifitasFile.hasOwnProperty("path") &&
        formList[i].validitas.konektifitasFile.path != ""
        ? "File Terupload"
        : "File tidak tersedia"
    );
    ws.cell(col, 22).string(
      formList[i].validitas.kalibrasiFile.hasOwnProperty("path") &&
        formList[i].validitas.kalibrasiFile.path != ""
        ? "File Terupload"
        : "File tidak tersedia"
    );
    ws.cell(col, 23).string(
      formList[i].validitas.kalibrasiRutinFile.hasOwnProperty("path") &&
        formList[i].validitas.kalibrasiRutinFile.path != ""
        ? "File Terupload"
        : "File tidak tersedia"
    );
    ws.cell(col, 24).string(
      formList[i].validitas.validitasFile.hasOwnProperty("path") &&
        formList[i].validitas.validitasFile.path != ""
        ? "File Terupload"
        : "File tidak tersedia"
    );
    ws.cell(col, 25).string(
      formList[i].surat.dukunganBrand.hasOwnProperty("path") &&
        formList[i].surat.dukunganBrand.path != ""
        ? "File Terupload"
        : "File tidak tersedia"
    );
    ws.cell(col, 26).string(
      formList[i].surat.pernyataanVendor.hasOwnProperty("path") &&
        formList[i].surat.pernyataanVendor.path != ""
        ? "File Terupload"
        : "File tidak tersedia"
    );
  }

  wb.write(`List Pendaftaran Sparing.xlsx`, res);
});

router.get("/export-pendaftaran", async function (req, res, next) {
  let status = req.query.status,
    query = {};
  if (status === "Disetujui") {
    query["validated"] = true;
  } else if (status === "Ditolak") {
    query["rejected"] = true;
  } else if (status === "Menunggu Validasi") {
    query["$and"] = [{ validated: false }, { rejected: false }];
  }
  var wb = new xl.Workbook();
  var ws = wb.addWorksheet("Sparing");
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

  let col = 1;
  ws.cell(col, 1).string("No").style(style);
  ws.cell(col, 2).string("ID Pendaftaran").style(style);
  ws.cell(col, 3).string("UID Logger").style(style);
  ws.cell(col, 4).string("Nama Kontak Person").style(style);
  ws.cell(col, 5).string("Nomor Handphone").style(style);
  ws.cell(col, 6).string("Email Kontak Person").style(style);
  ws.cell(col, 7).string("Password Akun").style(style);
  ws.cell(col, 8).string("Nama Perusahaan").style(style);
  ws.cell(col, 9).string("Jenis Perusahaan").style(style);
  ws.cell(col, 10).string("Alamat Perusahaan").style(style);
  ws.cell(col, 11).string("Jalan").style(style);
  ws.cell(col, 12).string("Kabupaten/Kota").style(style);
  ws.cell(col, 13).string("Provinsi").style(style);
  ws.cell(col, 14).string("Telepon Kantor").style(style);
  ws.cell(col, 15).string("Email Kantor").style(style);
  ws.cell(col, 16).string("Sumber Air Limbah").style(style);
  ws.cell(col, 17).string("Nama Titik Penataan 1").style(style);
  ws.cell(col, 18).string("Lintang Titik Penataan 1").style(style);
  ws.cell(col, 19).string("Bujur Titik Penataan 1").style(style);
  ws.cell(col, 20).string("Nama Badan Air Penerima Air Limbah").style(style);
  ws.cell(col, 21).string("DAS").style(style);
  ws.cell(col, 22).string("Frekuensi Pembuangan Air").style(style);
  ws.cell(col, 23).string("Per Hari").style(style);
  ws.cell(col, 24).string("Per Minggu").style(style);
  ws.cell(col, 25).string("Per Tahun").style(style);
  ws.cell(col, 26).string("Lulus Uji Konektivitas").style(style);
  ws.cell(col, 27).string("Nama Penyedia Barang dan/atau Jasa").style(style);
  ws.cell(col, 28).string("Waktu Dibuat").style(style);
  ws.cell(col, 29).string("Waktu Diubah").style(style);
  ws.cell(col, 30).string("Tanggal Tervalidasi").style(style);
  ws.cell(col, 31).string("Status Validasi").style(style);

  // const formList = await pendaftaranDB.find();
  const formList = await pendaftaranDB.aggregate([
    { $match: query },
    {
      $addFields: {
        idProvince: {
          $toObjectId: "$umum.compProvince",
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
          $toObjectId: "$umum.compCity",
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
    { $unset: ["idProvince", "prov", "idCity", "kabkot"] },
  ]);
  for (let i = 0; i < formList.length; i++) {
    let loggerId = "-";
    if (formList[i].validated === true) {
      const comp = await compDB.findOne({
        compName: formList[i].umum.compName,
      });
      if (comp !== null) {
        const logger = await loggerDB.findOne({
          compID: comp._id,
        });
        if (logger !== null) {
          if (typeof logger !== "undefined") {
            if (logger._id !== null) {
              loggerId = logger._id;
            }
          }
        }
      }
    }
    let created =
      formList[i].umum.createdAt !== null || formList[i].umum.createdAt !== ""
        ? moment(moment(new Date(formList[i].umum.createdAt * 1000))).format(
            "DD MMMM YYYY, HH:mm"
          )
        : "-";
    let updated =
      formList[i].umum.updatedAt !== null || formList[i].umum.updatedAt !== ""
        ? moment(moment(new Date(formList[i].umum.updatedAt * 1000))).format(
            "DD MMMM YYYY, HH:mm"
          )
        : "-";
    col++;
    ws.cell(col, 1).string((i + 1).toString());
    ws.cell(col, 2).string(formList[i]._id.toString());
    ws.cell(col, 3).string(loggerId.toString());
    ws.cell(col, 4).string(formList[i].akun.personName);
    ws.cell(col, 5).string(formList[i].akun.personPhone);
    ws.cell(col, 6).string(formList[i].akun.personMail);
    ws.cell(col, 7).string(formList[i].akun.personPassword);
    ws.cell(col, 8).string(formList[i].umum.compName);
    ws.cell(col, 9).string(formList[i].umum.compType);
    ws.cell(col, 10).string(formList[i].umum.compAddress);
    ws.cell(col, 11).string(formList[i].umum.compStreet);
    ws.cell(col, 12).string(formList[i].umum.compCityName);
    ws.cell(col, 13).string(formList[i].umum.compProvinceName);
    ws.cell(col, 14).string(formList[i].umum.compPhone);
    ws.cell(col, 15).string(formList[i].umum.compMail);
    ws.cell(col, 16).string(
      formList[i].teknis.wasteSource != null
        ? formList[i].teknis.wasteSource
        : "-"
    );
    ws.cell(col, 17).string(
      formList[i].teknis.spotList.length > 0
        ? formList[i].teknis.spotList[0].spotName
        : "-"
    );
    ws.cell(col, 18).string(
      formList[i].teknis.spotList.length > 0
        ? formList[i].teknis.spotList[0].spotLoc[0]
        : "-"
    );
    ws.cell(col, 19).string(
      formList[i].teknis.spotList.length > 0
        ? formList[i].teknis.spotList[0].spotLoc[1]
        : "-"
    );
    ws.cell(col, 20).string(
      formList[i].teknis.spotList.length > 0
        ? typeof formList[i].teknis.spotList[0].penerimaAirLimbah != "undefined"
          ? formList[i].teknis.spotList[0].penerimaAirLimbah
          : "-"
        : "-"
    );
    ws.cell(col, 21).string(
      formList[i].teknis.spotList.length > 0
        ? typeof formList[i].teknis.spotList[0].das != "undefined"
          ? formList[i].teknis.spotList[0].das
          : "-"
        : "-"
    );
    ws.cell(col, 22).string(formList[i].teknis.frequenceDet);
    ws.cell(col, 23).string(
      formList[i].frekuensi.jam === null
        ? "-"
        : formList[i].frekuensi.jam + " Jam"
    );
    ws.cell(col, 24).string(
      formList[i].frekuensi.hari === null
        ? "-"
        : formList[i].frekuensi.hari + " Hari"
    );
    ws.cell(col, 25).string(
      formList[i].frekuensi.bulan === null
        ? "-"
        : formList[i].frekuensi.bulan + " Bulan"
    );
    ws.cell(col, 26).string(
      formList[i].validitas.lulusUji != null
        ? formList[i].validitas.lulusUji
        : "-"
    );
    ws.cell(col, 27).string(
      formList[i].validitas.namaPenyedia != null
        ? formList[i].validitas.namaPenyedia
        : "-"
    );
    ws.cell(col, 28).string(created.toString());
    ws.cell(col, 29).string(updated.toString());
    ws.cell(col, 30).string(updated.toString());
    ws.cell(col, 31).string(
      formList[i].validated === true
        ? "Disetujui"
        : formList[i].rejected === true
        ? "Ditolak"
        : "Menunggu Validasi"
    );
  }

  ws.row(1).filter();
  wb.write(`List Pendaftaran Sparing.xlsx`, res);
});
// creates a new pendaftaran
//
router.post("/", async function (req, res, next) {
  let exist = await pendaftaranDB
    .find({
      $or: [
        {
          "umum.compName": req.body.umum.compName,
        },
        {
          "akun.personMail": req.body.akun.personMail,
        },
      ],
    })
    .collation({
      locale: "en",
      strength: 2,
    });

  if (exist.length > 0) {
    res
      .status(208)
      .send("Email Penanggung jawab atau nama perusahaan sudah terdaftar.");
    return;
  }

  if (req.body.umum.compProvince === null || req.body.umum.compCity === null) {
    res.status(400).send("Province and Kabkot cannot be null!");
    return;
  }
  for (let i = 0; i < req.body.sensor.length; i++) {
    let value = req.body.sensor[i];
    let d = value.tanggalKalibrasi.substr(0, 2);
    let m = value.tanggalKalibrasi.substr(3, 2);
    let y = value.tanggalKalibrasi.substr(6, 4);
    let newDate = y + "/" + m + "/" + d + " 00:00:00";
    value.tanggalKalibrasi = moment(new Date(newDate)).unix();
  }
  try {
    let p = new pendaftaranDB(req.body);
    p.validated = false;

    let r = await p.save();

    await addValidasi({
      pendaftaranId: p._id,
      keterangan: "Menunggu Validasi",
      user_id: "",
      action: "",
    });

    res.send(r);
  } catch (error) {
    res.status(400).send(error);
  }
});

// returns a pendaftaran
//
router.get("/:pendaftaranID", async function (req, res, next) {
  let data = await pendaftaranDB.findOne({
    _id: req.params.pendaftaranID,
  });
  res.send(data);
});

// delete a pendaftaran
// to-do?
// remove associated companies, logger, user, history_doc, history_pendaftaran too?
//
router.delete("/:pendaftaranID", async (req, res) => {
  try {
    let r = await pendaftaranDB.deleteOne({
      _id: req.params.pendaftaranID,
    });
    res.send(r);
  } catch (error) {
    res.send(error);
  }
});

// update pendaftaran (performed from font-page)
// if will update
//
router.put("/", async (req, res) => {
  try {
    let pendaftaranID = req.body._id;
    let pendaftaran = await pendaftaranDB.findOne({
      _id: pendaftaranID,
    });
    for (let i = 0; i < req.body.sensor.length; i++) {
      let value = req.body.sensor[i];
      if (value.active) {
        if (value.tanggalKalibrasi === "Invalid date") {
          return res.status(403).send("Mohon isi tanggal kalibrasi");
        }
        // let d = value.tanggalKalibrasi.substr(0, 2);
        // let m = value.tanggalKalibrasi.substr(3, 2);
        // let y = value.tanggalKalibrasi.substr(6, 4);
        // let newDate = y + "/" + m + "/" + d + " 00:00:00";
        // value.tanggalKalibrasi = moment(new Date(newDate)).unix();
      }
    }
    let updatePendaftaran = req.body;
    const note = updatePendaftaran.note;
    delete updatePendaftaran.note;
    if (!pendaftaran) {
      res.status(400).send("Unable to find pendaftaran");
      return;
    }
    const wordlist = (val) => {
      const oldName = [
        "logger",
        "logger.brand",
        "logger.model",
        "logger.sn",
        "logger.mac",
        "sensor.name",
        "sensor.label",
        "sensor.active",
        "sensor.brand",
        "sensor.probe",
        "sensor.brosurFile.path",
        "sensor.min",
        "sensor.max",
        "sensor.minMeasure",
        "sensor.maxMeasure",
        "sensor.metodePengukuran",
        "sensor.jadwalKalibrasi",
        "sensor.tanggalKalibrasi",
        "sensor.metodeKalibrasi",
        "akun.personName",
        "akun.personMailID",
        "akun.personPhone",
        "akun.personMail",
        "akun.personPassword",
        "akun.personConfirmPassword",
        "umum.compName",
        "umum.compNameID",
        "umum.compType",
        "umum.compAddress",
        "umum.compStreet",
        "umum.compCity",
        "umum.compProvince",
        "umum.compPhone",
        "umum.compMail",
        "umum.nameSIUP",
        "umum.ifTambang.status",
        "umum.ifTambang.jenKegiatan",
        "umum.ifTambang.kondisiInternet",
        "umum.rencanaFile.path",
        "umum.siupFile.path",
        "umum.permohonanKoneksi.path",
        "prosesProduksi.debitPenggunaan.value",
        "prosesProduksi.debitPenggunaan.keterangan",
        "prosesProduksi.debitLimbahTotal.value",
        "prosesProduksi.debitLimbahTotal.keterangan",
        "prosesProduksi.debitReuse.value",
        "prosesProduksi.debitReuse.keterangan",
        "prosesProduksi.debitRecycle.value",
        "prosesProduksi.debitRecycle.keterangan",
        "prosesProduksi.debitRecovery.value",
        "prosesProduksi.debitRecovery.keterangan",
        "prosesProduksi.debitOlahIPAL.value",
        "prosesProduksi.debitOlahIPAL.keterangan",
        "prosesProduksi.fileNeracaAirLimbah.path",
        "teknis.permitFile.path",
        "teknis.permitPerson",
        "teknis.permitNumber",
        "teknis.permitDatePublish",
        "teknis.permitDateExpire",
        "teknis.wasteSource",
        "teknis.spotCount",
        "teknis.spotList",
        "teknis.spotList.spotName",
        "teknis.spotList.spotLoc",
        "teknis.spotList.penerimaAirLimbah",
        "teknis.spotList.das",
        "teknis.processingTechnique",
        "teknis.wasteType",
        "teknis.debit",
        "teknis.capacityPermit",
        "teknis.capacityActual",
        "teknis.frequenceDet",
        "teknis.satuanDebit",
        "validitas.infoAlat",
        "validitas.lulusUji",
        "validitas.namaPenyedia",
        "validitas.noSurat",
        "validitas.kontrak.path",
        "validitas.kinerjaFile.path",
        "validitas.konektifitasFile.path",
        "validitas.kalibrasiFile.path",
        "validitas.kalibrasiRutinFile.path",
        "validitas.validitasFile.path",
        "frekuensi.latarBelakang",
        "frekuensi.detEngIPAL",
        "frekuensi.fotoIPAL.path",
        "frekuensi.jam",
        "frekuensi.hari",
        "frekuensi.bulan",
        "frekuensi.metUkurDebit",
        "frekuensi.logBook.path",
        "surat.dukunganBrand",
        "surat.pernyataanVendor",
      ];
      const newName = [
        "Data logger",
        "Brand Logger",
        "Model Logger",
        "Serial Number Logger",
        "Mac Address Logger",
        "Nama Sensor",
        "Nama Label Sensor",
        "Sensor",
        "Nama Brand Sensor",
        "Nama Probe Sensor",
        "Brosur Sensor",
        "Nilai Minimum Sensor",
        "Nilai Maximum Sensor",
        "Nilai Minimum BMAL Sensor",
        "Nilai Maximum BMAL Sensor",
        "Metode Pengukuran Sensor",
        "Jadwal Kalibrasi Sensor",
        "Tanggal Kalibrasi Sensor",
        "Metode Kalibrasi Sensor",
        "Nama Kontak Person",
        "Nama Kontak Person",
        "Nomor Handphone",
        "Email Kontak Person",
        "Password",
        "Password",
        "Nama Perusahaan",
        "Nama Perusahaan",
        "Jenis Industri",
        "Alamat Perusahaan",
        "Jalan Perusahaan",
        "Kabupaten / Kota",
        "Provinsi",
        "Telepon Kantor",
        "Email Kantor",
        "Nama Penanggung Jawab SIUP",
        "Status Tambang",
        "Jenis Kegiatan",
        "Kondisi Jaringan Internet",
        "Rencana Penetapan Titik Penataan",
        "Lampiran SIUP",
        "Surat permohonan pendaftaran koneksi sparing",
        "Nilai Debit Penggunaan Air",
        "Keterangan Debit Penggunaan Air",
        "Nilai Debit Air Limbah Total",
        "Keterangan Debit Air Limbah Total",
        "Nilai Debit Air Reuse",
        "Keterangan Debit Air Reuse",
        "Nilai Debit Air Recycle",
        "Keterangan Debit Air Recycle",
        "Nilai Debit Air Recovery",
        "Keterangan Debit Air Recovery",
        "Nilai Debit Air Limbah Diolah IPAL",
        "Keterangan Debit Air Limbah Diolah IPAL",
        "Berkas Neraca Air Dan Air Limbah ",
        "Berkas Izin Pembuangan Air Limbah ke Media Air",
        "Pejabat Penerbit Izin",
        "Nomor Izin Pembuangan Air Limbah (Definitif)",
        "Tanggal Izin Terbit",
        "Tanggal Berlaku",
        "Sumber Air Limbah",
        "Jumlah Titik Penataan",
        "Titik Penataan",
        "Nama Titik Penataan",
        "Titik Penataan",
        "Nama Badan Air Penerima Air Limbah",
        "DAS",
        "Jenis Teknologi Pengolahan Air Limbah",
        "Jenis Air Limbah",
        "Debit",
        "Kapasitas Produksi Sesuai Izin",
        "Kapasitas Produksi Senyatanya",
        "Frekuensi Pembuangan Air Limbah",
        "Satuan Debit",
        "Info Alat",
        "Lulus Uji Konektifitas",
        "Nama Penyedia Barang dan Jasa",
        "Nomor Surat Lulus Uji Konektivitas",
        "Kontrak Kerjasama",
        "Hasil Uji Kinerja Dari Laboratorium Yang Ditunjuk Oleh KLHK",
        "Surat Keterangan Lulus Uji Konektivitas",
        "Hasil Kalibrasi Saat Awal Pemasangan Alat",
        "Hasil Kalibrasi Alat Rutin",
        "Surat Pernyataan",
        "Latar Belakang IPAL",
        "Detail Engineering IPAL",
        "Foto IPAL",
        "Frekuensi Per Hari",
        "Frekuensi Per Minggu",
        "Frekuensi Per Tahun",
        "Metode Pengukuran Debit",
        "Logbook Pembuangan Air Limbah",
        "Surat Dukungan Dari Brand Sensor",
        "Surat Pernyataan",
      ];
      let index = oldName.indexOf(val);
      return newName[index];
    };
    let diff = [];
    let keteranganDiff = [];
    const getDifference = (a, b) =>
      Object.fromEntries(
        Object.entries(b).filter(([key, val]) => {
          if (typeof val === "object") {
            Object.entries(val).filter(([key1, val1]) => {
              if (typeof val1 === "object") {
                if (val1 !== null) {
                  Object.entries(val1).filter(([key2, val2]) => {
                    if (typeof val2 === "object") {
                      if (val2 !== null) {
                        Object.entries(val2).filter(([key3, val3]) => {
                          if (typeof val3 === "object") {
                            if (val3 !== null) {
                              Object.entries(val3).filter(([key4, val4]) => {
                                if (typeof a[key][key1][key2] === "undefined") {
                                  let title =
                                    "field " +
                                    wordlist("" + key + "." + key1) +
                                    " " +
                                    (parseInt(key2) + 1) +
                                    " ditambahkan";
                                  diff.push(title);
                                  let keterangan =
                                    "menambahkan " +
                                    wordlist("" + key + "." + key1);
                                  keteranganDiff.push(keterangan);
                                } else if (
                                  typeof a[key][key1][key2][key3] ===
                                  "undefined"
                                ) {
                                  let title =
                                    "field " +
                                    wordlist(
                                      "" +
                                        key +
                                        "." +
                                        key1 +
                                        "." +
                                        key2 +
                                        "." +
                                        key3
                                    ) +
                                    " ditambahkan";
                                  diff.push(title);
                                  let keterangan =
                                    "menambahkan " +
                                    wordlist(
                                      "" +
                                        key +
                                        "." +
                                        key1 +
                                        "." +
                                        key2 +
                                        "." +
                                        key3
                                    );
                                  keteranganDiff.push(keterangan);
                                } else if (
                                  val4 !== a[key][key1][key2][key3][key4]
                                ) {
                                  let position =
                                    key4 == 0 ? "Lintang " : "Bujur ";
                                  let title =
                                    "field Letak " +
                                    position +
                                    wordlist(
                                      "" + key + "." + key1 + "." + key3
                                    ) +
                                    " diubah: " +
                                    a[key][key1][key2][key3][key4] +
                                    " menjadi " +
                                    val4;
                                  diff.push(title);
                                  let keterangan =
                                    "merubah Letak " +
                                    position +
                                    wordlist(
                                      "" + key + "." + key1 + "." + key3
                                    );
                                  keteranganDiff.push(keterangan);
                                }
                              });
                            }
                          } else {
                            if (typeof a[key][key1][key2] === "undefined") {
                              if (key1 === "spotList") {
                                let title =
                                  "field " +
                                  wordlist("" + key + "." + key1) +
                                  " " +
                                  (parseInt(key2) + 1) +
                                  " ditambahkan";
                                diff.push(title);
                                let keterangan =
                                  "menambahkan " +
                                  wordlist("" + key + "." + key1);
                                keteranganDiff.push(keterangan);
                              } else {
                                let title =
                                  "field " +
                                  wordlist("" + key + "." + key1 + "." + key2) +
                                  " ditambahkan";
                                diff.push(title);
                                let keterangan =
                                  "menambahkan " +
                                  wordlist("" + key + "." + key1 + "." + key2);
                                keteranganDiff.push(keterangan);
                              }
                            } else if (val3 !== a[key][key1][key2][key3]) {
                              if (key1 === "spotList") {
                                let title =
                                  "field " +
                                  wordlist("" + key + "." + key1 + "." + key3) +
                                  " diubah: " +
                                  a[key][key1][key2][key3] +
                                  " menjadi " +
                                  val3;
                                diff.push(title);
                                let keterangan =
                                  "merubah " +
                                  wordlist("" + key + "." + key1 + "." + key3);
                                keteranganDiff.push(keterangan);
                              } else {
                                let title =
                                  "field " +
                                  wordlist(
                                    "" +
                                      key +
                                      "." +
                                      key1 +
                                      "." +
                                      key2 +
                                      "." +
                                      key3
                                  ) +
                                  " diubah: " +
                                  a[key][key1][key2][key3] +
                                  " menjadi " +
                                  val3;
                                diff.push(title);
                                let keterangan =
                                  "merubah " +
                                  wordlist(
                                    "" +
                                      key +
                                      "." +
                                      key1 +
                                      "." +
                                      key2 +
                                      "." +
                                      key3
                                  );
                                keteranganDiff.push(keterangan);
                              }
                            }
                          }
                        });
                      }
                    } else {
                      if (typeof a[key][key1] === "undefined") {
                        let title =
                          "field " +
                          wordlist("" + key) +
                          " " +
                          (parseInt(key1) + 1) +
                          " ditambahkan";
                        diff.push(title);
                        let keterangan = "menambahkan " + wordlist("" + key);
                        keteranganDiff.push(keterangan);
                      } else if (val2 !== a[key][key1][key2]) {
                        if (
                          key1 == 0 ||
                          key1 == 1 ||
                          key1 == 2 ||
                          key1 == 3 ||
                          key1 == 4
                        ) {
                          if (key === "sensor") {
                            let params =
                              key1 == 0
                                ? "pH"
                                : key1 == 1
                                ? "COD"
                                : key1 == 2
                                ? "TSS"
                                : key1 == 3
                                ? "NH3N"
                                : "Debit";
                            let title =
                              "field " +
                              wordlist("" + key + "." + key2) +
                              " " +
                              params +
                              " diubah: " +
                              a[key][key1][key2] +
                              " menjadi " +
                              val2;
                            diff.push(title);
                            let keterangan =
                              "merubah " +
                              wordlist("" + key + "." + key2) +
                              " " +
                              params;
                            keteranganDiff.push(keterangan);
                          } else {
                            let title =
                              "field " +
                              wordlist("" + key + "." + key2) +
                              " diubah: " +
                              a[key][key1][key2] +
                              " menjadi " +
                              val2;
                            diff.push(title);
                            let keterangan =
                              "merubah " + wordlist("" + key + "." + key2);
                            keteranganDiff.push(keterangan);
                          }
                        } else {
                          let title =
                            "field " +
                            wordlist("" + key + "." + key1 + "." + key2) +
                            " diubah: " +
                            a[key][key1][key2] +
                            " menjadi " +
                            val2;
                          diff.push(title);
                          let keterangan =
                            "merubah " +
                            wordlist("" + key + "." + key1 + "." + key2);
                          keteranganDiff.push(keterangan);
                        }
                      }
                    }
                  });
                }
              } else {
                if (typeof a[key] === "undefined") {
                  let title = "field " + wordlist(key) + " ditambahkan";
                  diff.push(title);
                  let keterangan = "menambahkan " + wordlist(key);
                  keteranganDiff.push(keterangan);
                } else if (val1 !== a[key][key1] && key1 !== "updatedAt") {
                  if (key1 != "personMailID") {
                    if (key1 != "compNameID") {
                      let title =
                        "field " +
                        wordlist("" + key + "." + key1) +
                        " diubah: " +
                        a[key][key1] +
                        " menjadi " +
                        val1;

                      diff.push(title);
                      let keterangan =
                        "merubah " + wordlist("" + key + "." + key1);
                      keteranganDiff.push(keterangan);
                    }
                  }
                }
              }
            });
          } else {
            if (val !== a[key] && key !== "_id") {
              if (key !== "sensorDone") {
                if (key !== "resubmision") {
                  if (key !== "validated") {
                    let title =
                      "field " +
                      wordlist(key) +
                      " diubah: " +
                      a[key] +
                      " menjadi " +
                      val;
                    diff.push(title);
                    let keterangan = "merubah " + wordlist(key);
                    keteranganDiff.push(keterangan);
                  }
                }
              }
            }
          }
        })
      );
    getDifference(pendaftaran, updatePendaftaran);
    const getdiff = diff.filter((item, i, ar) => ar.indexOf(item) === i);
    const getketerangan = keteranganDiff.filter(
      (item, i, ar) => ar.indexOf(item) === i
    );
    req.body.validated = false;
    let company = await compDB.findOne({
      compName: req.body.umum.compNameID,
    });
    // IF STATUS COMPANY OR LOGGER ID NOT FOUND ( PENDAFTARAN BARU BELUM TERVALIDASI)
    if (company == null) {
      req.body.umum.createdAt = req.body.umum.createdAt;
      req.body.umum.updatedAt = moment().unix();
      await pendaftaranDB.updateOne(
        {
          _id: pendaftaranID,
        },
        req.body
      );
      let updatedFiles = getUpdatedFiles(req, pendaftaran);

      let findCompanyDoc = await documentsDB.find({
        pendaftaranID: req.body._id,
      });
      let idDocHistori;
      if (findCompanyDoc.length > 0) {
        findCompanyDoc.map((item) => {
          return (idDocHistori = item._id);
        });
        if (updatedFiles.length > 0) {
          updatedFiles.map((item) => {
            return findCompanyDoc[0].detail_dokumen.push(item);
          });
          let updateDoc = await documentsDB.updateOne(
            {
              _id: idDocHistori,
            },
            findCompanyDoc[0]
          );
        }
      } else {
        if (updatedFiles.length > 0) {
          await documentsDB.create({
            pendaftaranID: req.body._id,
            detail_dokumen: updatedFiles,
            created_time: moment().unix(),
            validated: false,
          });
        }
      }
      await addValidasi({
        pendaftaranId: pendaftaranID,
        keterangan: note,
        user_id: "",
        action: "resubmision",
      });
      if (getdiff.length > 0) {
        let historyBody = {
          pendaftaranID: req.body._id,
          field: getdiff,
          keterangan: getketerangan,
          note: note == null ? "-" : note,
          timestamp: moment().unix(),
        };
        let h = new historyPerubahanDB(historyBody);
        await h.save();
      }
      res.status(200).send("Berhasil merubah data ini");
      return;
    }
    //  END IF STATUS COMPANY OR LOGGER ID NOT FOUND ( PENDAFTARAN BARU BELUM TERVALIDASI)

    // UPDATE DATA FROM PROSES PEMBUANGAN AIR LIMBAH
    if (pendaftaran.prosesProduksi) {
      req.body.umum.createdAt = req.body.umum.createdAt;
      req.body.umum.updatedAt = moment().unix();

      if (pendaftaran.prosesProduksi.debitPenggunaan.value != null) {
        // record changed files in each submission
        // see /documents/:companyID
        //

        let updatedFiles = getUpdatedFiles(req, pendaftaran);

        let findCompanyDoc = await documentsDB.find({
          pendaftaranID: req.body._id,
        });
        let idDocHistori;
        if (findCompanyDoc.length > 0) {
          findCompanyDoc.map((item) => {
            return (idDocHistori = item._id);
          });
          if (updatedFiles.length > 0) {
            updatedFiles.map((item) => {
              return findCompanyDoc[0].detail_dokumen.push(item);
            });
            let updateDoc = await documentsDB.updateOne(
              {
                _id: idDocHistori,
              },
              findCompanyDoc[0]
            );
          }
        } else {
          if (updatedFiles.length > 0) {
            await documentsDB.create({
              pendaftaranID: req.body._id,
              detail_dokumen: updatedFiles,
              created_time: moment().unix(),
              validated: false,
            });
          }
        }
        await addValidasi({
          pendaftaranId: pendaftaranID,
          keterangan: note,
          user_id: "",
          action: "resubmision",
        });
        if (getdiff.length > 0) {
          let historyBody = {
            pendaftaranID: req.body._id,
            field: getdiff,
            keterangan: getketerangan,
            note: note == null ? "-" : note,
            timestamp: moment().unix(),
          };
          let h = new historyPerubahanDB(historyBody);
          await h.save();
        }
        let pendaftaranUpdate = await pendaftaranDB.updateOne(
          {
            _id: pendaftaranID,
          },
          req.body
        );
        res.send({ pendaftaranUpdate });
      }
    }
    // END UPDATE DATA FROM PROSES PEMBUANGAN AIR LIMBAH
    if (!company) {
      res
        .status(400)
        .send("terjadi kesalahan tolong hubungi admin terimakasih.");
    }

    let companyID = company._id;

    if (!pendaftaran.validated) {
      req.body.umum.createdAt = req.body.umum.createdAt;
      req.body.umum.updatedAt = moment().unix();

      // history docs lama
      // let updatedFiles = getUpdatedFiles(req, pendaftaran);
      // let findCompanyDoc = await documentsDB.find({
      //   compID: companyID,
      // });
      // let idDocHistori;
      // if (findCompanyDoc.length > 0) {
      //   findCompanyDoc.map((item) => {
      //     return (idDocHistori = item._id);
      //   });
      //   if (updatedFiles.length > 0) {
      //     updatedFiles.map((item) => {
      //       return findCompanyDoc[0].detail_dokumen.push(item);
      //     });
      //     let updateDoc = await documentsDB.updateOne(
      //       {
      //         _id: idDocHistori,
      //       },
      //       findCompanyDoc[0]
      //     );
      //   }
      // }
      // else {
      //   if (updatedFiles.length > 0) {
      //     await documentsDB.create({
      //       compID: companyID,
      //       detail_dokumen: updatedFiles,
      //       created_time: moment().unix(),
      //       validated: false,
      //     });
      //   }
      // }

      let updatedFiles = getUpdatedFiles(req, pendaftaran);

      let findCompanyDoc = await documentsDB.find({
        pendaftaranID: req.body._id,
      });
      let idDocHistori;
      if (findCompanyDoc.length > 0) {
        findCompanyDoc.map((item) => {
          return (idDocHistori = item._id);
        });
        if (updatedFiles.length > 0) {
          updatedFiles.map((item) => {
            return findCompanyDoc[0].detail_dokumen.push(item);
          });
          let updateDoc = await documentsDB.updateOne(
            {
              _id: idDocHistori,
            },
            findCompanyDoc[0]
          );
        }
      } else {
        if (updatedFiles.length > 0) {
          await documentsDB.create({
            pendaftaranID: req.body._id,
            detail_dokumen: updatedFiles,
            created_time: moment().unix(),
            validated: false,
          });
        }
      }
      await addValidasi({
        pendaftaranId: pendaftaranID,
        keterangan: "Menunggu Validasi",
        user_id: "",
        action: "resubmision",
      });
      if (getdiff.length > 0) {
        let historyBody = {
          pendaftaranID: req.body._id,
          field: getdiff,
          keterangan: getketerangan,
          note: note == null ? "-" : note,
          timestamp: moment().unix(),
        };
        let h = new historyPerubahanDB(historyBody);
        await h.save();
      }
      await pendaftaranDB.updateOne(
        {
          _id: pendaftaranID,
        },
        req.body
      );

      await addValidasi({
        pendaftaranId: pendaftaranID,
        keterangan: note,
        user_id: "",
        action: "resubmision",
      });

      res.status(200).send("Berhasil merubah data ini");
      return;
    }

    // pendaftaran.validated == true
    // enable/update other collections
    //
    let sensors = pendaftaran.sensor;
    let loggerNew = {
      logDataRange: [
        {
          name: "pH",
          min: sensors[0].active ? Number(sensors[0].min) : null,
          max: sensors[0].active ? Number(sensors[0].max) : null,
        },
        {
          name: "COD",
          min: sensors[1].active ? Number(sensors[1].min) : null,
          max: sensors[1].active ? Number(sensors[1].max) : null,
        },
        {
          name: "TSS",
          min: sensors[2].active ? Number(sensors[2].min) : null,
          max: sensors[2].active ? Number(sensors[2].max) : null,
        },
        {
          name: "NH3N",
          min: sensors[3].active ? Number(sensors[3].min) : null,
          max: sensors[3].active ? Number(sensors[3].max) : null,
        },
        {
          name: "Debit",
          min: sensors[4].active ? Number(sensors[4].min) : null,
          max: sensors[4].active ? Number(sensors[4].max) : null,
        },
      ],
      latlong: {
        lat: Number(pendaftaran.teknis.spotList[0].spotLoc[0]),
        lng: Number(pendaftaran.teknis.spotList[0].spotLoc[1]),
      },
    };

    // FIXED HERE USE WITH SET FOR VALUE SPESCIFIC
    // await loggerDB.updateOne({
    //   compID: companyID,
    // }, {
    //   $set:loggerNew
    // });

    let compNew = {
      compName: req.body.umum.compName,
      compAddress: req.body.umum.compAddress,
      compTlp: req.body.umum.compPhone,
      compType: req.body.umum.compType,
      compPermit: req.body.teknis.permitFile.path,
      compWasteSource: req.body.teknis.wasteSource,
      compInstance: req.body.teknis.permitPerson,
      compPermitDate: req.body.teknis.permitNumber,
      compTech: req.body.teknis.processingTechnique,
    };
    let dataUpdateComp = await compDB.findOneAndUpdate(
      {
        _id: companyID,
      },
      compNew,
      {
        new: true,
      }
    );

    req.body.umum.createdAt = req.body.umum.createdAt;
    req.body.umum.updatedAt = moment().unix();

    let updatedFiles = getUpdatedFiles(req, pendaftaran);

    let findCompanyDoc = await documentsDB.find({
      pendaftaranID: req.body._id,
    });
    let idDocHistori;
    if (findCompanyDoc.length > 0) {
      findCompanyDoc.map((item) => {
        return (idDocHistori = item._id);
      });
      if (updatedFiles.length > 0) {
        updatedFiles.map((item) => {
          return findCompanyDoc[0].detail_dokumen.push(item);
        });
        let updateDoc = await documentsDB.updateOne(
          {
            _id: idDocHistori,
          },
          findCompanyDoc[0]
        );
      }
    } else {
      if (updatedFiles.length > 0) {
        await documentsDB.create({
          pendaftaranID: req.body._id,
          detail_dokumen: updatedFiles,
          created_time: moment().unix(),
          validated: false,
        });
      }
    }
    // await addValidasi({
    //   pendaftaranId: pendaftaranID,
    //   keterangan: note,
    //   user_id: "",
    //   action: "resubmision",
    // });
    // if (getdiff.length > 0) {
    //   let historyBody = {
    //     pendaftaranID: req.body._id,
    //     field: getdiff,
    //     keterangan: getketerangan,
    //     note: note == null ? "-" : note,
    //     timestamp: moment().unix(),
    //   };
    //   let h = new historyPerubahanDB(historyBody);
    //   await h.save();
    // }

    await pendaftaranDB.updateOne(
      {
        _id: pendaftaranID,
      },
      req.body
    );

    let userInfo = {
      userEmail: req.body.akun.personMail,
      userPassword: req.body.akun.personPassword,
      userRole: {
        role: "comp",
        kabkotID: req.body.umum.compCity,
        provID: req.body.umum.compProvince,
        compID: String(dataUpdateComp._id),
        profileID: String(pendaftaranID),
      },
    };
    var user_id;
    if (req.body.akun.personMail === req.body.akun.personMailID) {
      let findUser = await userDB.findOne({
        userEmail: req.body.akun.personMailID,
      });
      if (findUser) {
        let r = await userDB.updateOne(
          {
            _id: findUser._id,
          },
          userInfo
        );
        user_id = r._id;
      }
    } else {
      await userDB
        .findOne({
          userEmail: req.body.akun.personMailID,
        })
        .remove()
        .exec();
      let r = new userDB(userInfo);
      await r.save();
      user_id = r._id;
    }
    await addValidasi({
      pendaftaranId: pendaftaranID,
      keterangan: note,
      user_id: user_id,
      action: "resubmision",
    });
    if (getdiff.length > 0) {
      let historyBody = {
        pendaftaranID: req.body._id,
        field: getdiff,
        keterangan: getketerangan,
        note: note == null ? "-" : note,
        timestamp: moment().unix(),
      };
      let h = new historyPerubahanDB(historyBody);
      await h.save();
    }
    res.status(200).send("Berhasil merubah data ini.");
  } catch (error) {
    console.log(error);
    res.status(400).send("Update error");
  }
});

router.get("/updateHistory/:pendaftaranID", async function (req, res, next) {
  const pendaftaranID = req.params.pendaftaranID;
  let history = await historyPerubahanDB.aggregate([
    {
      $match: {
        pendaftaranID: pendaftaranID,
      },
    },
    { $addFields: { objectPendaftaranID: { $toObjectId: "$pendaftaranID" } } },
    {
      $lookup: {
        from: "formregiscomps",
        localField: "objectPendaftaranID",
        foreignField: "_id",
        as: "formregiscomp",
      },
    },
    {
      $unwind: "$formregiscomp",
    },
    {
      $project: {
        _id: 1,
        timestamp: -1,
        field: 1,
        keterangan: 1,
        note: 1,
        pendaftaranID: 1,
        formregiscomp: "$formregiscomp.umum",
      },
    },
  ]);
  res.send(history);
});

router.put("/update/kalibrasi/:compID", async (req, res) => {
  const compID = req.params.compID;
  const body = req.body;
  const time = moment().unix();
  const company = await compDB.findOne({ _id: compID });
  if (!company) {
    return res.status(400).send("Industri tidak ditemukan");
  }
  const logger = await loggerDB.findOne({ compID: compID });
  if (!logger) {
    return res.status(400).send("Logger tidak ditemukan");
  }
  const formregis = await pendaftaranDB.findOne({
    "umum.compName": company.compName,
  });
  logger.logDataRange.forEach((value, index) => {
    if (typeof value.tanggalKalibrasi == "undefined" && value.max != 0) {
      if (value.max != null) {
        let nextTime = body.jadwalKalibrasi[index].tanggalKalibrasi;
        if (nextTime === null) {
          return res.status(400).send("tanggal kalibrasi kosong");
        }
        nextTime = moment(nextTime * 1000)
          .add(body.jadwalKalibrasi[index].jadwalKalibrasi + 2, "M")
          .unix();
        // while (true) {
        //   nextTime = moment(nextTime * 1000)
        //     .add(body[index].jadwalKalibrasi + 2, "M")
        //     .unix();
        //   if (time < nextTime) {
        //     break;
        //   }
        // }
        value.jadwalKalibrasi = body.jadwalKalibrasi[index].jadwalKalibrasi;
        value.tanggalKalibrasi = body.jadwalKalibrasi[index].tanggalKalibrasi;
        value.nextKalibrasi = nextTime;
        formregis.sensor[index].jadwalKalibrasi =
          "" + body.jadwalKalibrasi[index].jadwalKalibrasi + " bulan";
        formregis.sensor[index].tanggalKalibrasi =
          body.jadwalKalibrasi[index].tanggalKalibrasi;
        if (index == 4) {
          formregis.sensor[index].satuanDebit = body.satuanDebit;
        }
      }
    }
  });
  if (!body.satuanDebit) {
    return res.status(400).send("Satuan debit kosong");
  }
  formregis.teknis.satuanDebit = body.satuanDebit;
  if (typeof body.compPermohonanKoneksi.path === "undefined") {
    return res.status(400).send("File permohonan koneksi kosong");
  }
  formregis.umum.compPermohonanKoneksi = body.compPermohonanKoneksi;
  await loggerDB.updateOne(
    {
      _id: logger._id,
    },
    logger
  );
  await pendaftaranDB.updateOne(
    {
      _id: formregis._id,
    },
    formregis
  );
  return res.send("Tanggal Kalibrasi telah ditambahkan");
});

router.get("/cek-kalibrasi/:compID", async (req, res) => {
  const compID = req.params.compID;
  const time = moment().unix();
  const company = await compDB.findOne({ _id: compID });
  if (!company) {
    return res.send("Industri tidak ditemukan");
  }
  const logger = await loggerDB.findOne({ compID: compID });
  if (!logger) {
    return res.send("Logger tidak ditemukan");
  }
  const formregis = await pendaftaranDB.findOne({
    "umum.compName": company.compName,
  });
  let status;
  let message;
  formregis.sensor.forEach((value) => {
    if (value.active == true) {
      if (typeof value.tanggalKalibrasi == "undefined") {
        status = true;
        message = "Tanggal kalibrasi belum dimasukkan";
      } else {
        if (status == true) {
          status = true;
        } else {
          status = false;
        }
      }
    }
  });
  if (typeof formregis.umum.compPermohonanKoneksi == "undefined") {
    status = true;
    message = "Surat permohonan koneksi belum dimasukkan";
  }
  if (typeof formregis.teknis.satuanDebit == "undefined") {
    status = true;
    message = "Satuan Debit belum dimasukkan";
  }
  return res.send({
    message: message,
    show: status,
    sensor: formregis.sensor,
    data: formregis,
  });
});
// get updated files between record and submissions
//
let getUpdatedFiles = (req, rec) => {
  let fileStub = (rec, path) => ({
    _id: makeid(24),
    nama_dokumen: path.replace("storage", "").replace(/\\|\//g, ""),
    path,
    updated_time: moment().unix(),
    validated_time: null,
    validated: true,
    use: false,
    status: "old",
    created_time: rec.umum.createdAt ? rec.umum.createdAt : rec.umum.updatedAt,
  });
  // let fileStub = (rec, path) => ({
  //   _id: makeid(24),
  //   nama_dokumen: path.split('/')[2].replace('store', '').replace(/\\|\//g, ''),
  //   path,
  //   updated_time: moment().unix(),
  //   validated_time: null,
  //   validated: true,
  //   use: false,
  //   status: 'old',
  //   created_time: rec.umum.createdAt ? rec.umum.createdAt : rec.umum.updatedAt,
  // });

  return [
    (req, rec) => {
      let p1 = rec.umum.siupFile.path;
      let p2 = req.body.umum.siupFile.path;
      let tipe_dokumen = "dokumen siup";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      let p1 = rec.teknis.permitFile.path;
      let p2 = req.body.teknis.permitFile.path;
      let tipe_dokumen = "dokumen izin pembuangan air limbah";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      let p1 = rec.umum.rencanaFile.path;
      let p2 = req.body.umum.rencanaFile.path;
      let tipe_dokumen = "dokumen rencanaFile";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      // Bagian disini untuk tipe pendaftaran khusus yang menfaatkan airlimbah produksi harus dicek jika ada rec.prosesProduksi berarti data pendaftaran proses produksi. jika undifined berarti pendaftaran normal.
      if (rec.prosesProduksi) {
        let p1 = rec.prosesProduksi.fileNeracaAirLimbah.path;
        let p2 = req.body.prosesProduksi.fileNeracaAirLimbah.path;
        let tipe_dokumen = "dokumen proses produksi fileNeracaAirLimbah";
        return p1 == p2
          ? null
          : Object.assign(fileStub(rec, p1), {
              tipe_dokumen,
            });
      }
    },

    (req, rec) => {
      let p1 = rec.validitas.kontrak.path;
      let p2 = req.body.validitas.kontrak.path;
      let tipe_dokumen = "dokumen validitas kontrak";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      let p1 = rec.validitas.kinerjaFile.path;
      let p2 = req.body.validitas.kinerjaFile.path;
      let tipe_dokumen = "dokumen validitas kinerjaFile";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      let p1 = rec.validitas.konektifitasFile.path;
      let p2 = req.body.validitas.konektifitasFile.path;
      let tipe_dokumen = "dokumen validitas konektifitasFile";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      let p1 = rec.validitas.kalibrasiFile.path;
      let p2 = req.body.validitas.kalibrasiFile.path;
      let tipe_dokumen = "dokumen validitas kalibrasiFile";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      let p1 = rec.validitas.kalibrasiRutinFile.path;
      let p2 = req.body.validitas.kalibrasiRutinFile.path;
      let tipe_dokumen = "dokumen validitas kalibrasiRutinFile";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      let p1 = rec.validitas.validitasFile.path;
      let p2 = req.body.validitas.validitasFile.path;
      let tipe_dokumen = "dokumen validitas validitasFile";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      let p1 = rec.frekuensi.fotoIPAL.path;
      let p2 = req.body.frekuensi.fotoIPAL.path;
      let tipe_dokumen = "dokumen frekuensi fotoIPAL";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      let p1 = rec.frekuensi.logBook.path;
      let p2 = req.body.frekuensi.logBook.path;
      let tipe_dokumen = "dokumen frekuensi logBook";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      if (!req.body.sensor[0].active) return;

      let p1 = rec.sensor[0].brosurFile.path;
      let p2 = req.body.sensor[0].brosurFile.path;
      let tipe_dokumen = "dokumen sensor pH";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      if (!req.body.sensor[1].active) return;

      let p1 = rec.sensor[1].brosurFile.path;
      let p2 = req.body.sensor[1].brosurFile.path;
      let tipe_dokumen = "dokumen sensor COD";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      if (!req.body.sensor[2].active) return;

      let p1 = rec.sensor[2].brosurFile.path;
      let p2 = req.body.sensor[2].brosurFile.path;
      let tipe_dokumen = "dokumen sensor TSS";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      if (!req.body.sensor[3].active) return;

      let p1 = rec.sensor[3].brosurFile.path;
      let p2 = req.body.sensor[3].brosurFile.path;
      let tipe_dokumen = "dokumen sensor NH3N";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      if (!req.body.sensor[4].active) return;

      let p1 = rec.sensor[4].brosurFile.path;
      let p2 = req.body.sensor[4].brosurFile.path;
      let tipe_dokumen = "dokumen sensor Debit";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      let p1 = rec.surat.dukunganBrand.path;
      let p2 = req.body.surat.dukunganBrand.path;
      let tipe_dokumen = "dokumen Dukungan Brand";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },

    (req, rec) => {
      let p1 = rec.surat.pernyataanVendor.path;
      let p2 = req.body.surat.pernyataanVendor.path;
      let tipe_dokumen = "dokumen Dukungan pernyataan Vendor";
      return p1 == p2
        ? null
        : Object.assign(fileStub(rec, p1), {
            tipe_dokumen,
          });
    },
  ]
    .filter(Boolean)
    .map((f) => f(req, rec))
    .filter(Boolean);
};
