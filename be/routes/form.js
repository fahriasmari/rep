var express = require("express");
var router = express.Router();
const moment = require("moment");
const formRegisDB = require("../model/formRegisComp");
const userDB = require("../model/User");
const compDB = require("../model/Company");
const loggerDB = require("../model/Logger");
const provDB = require("../model/Province");
const kabkotDB = require("../model/Kabkot");
const condRepDB = require("../model/condReport");
const dataCondReportDB = require("../model/dataCondReport");
const beritaAcaraDB = require("../model/beritaAcara");
const datamanual2minDB = require("../model/dataManual2min");
const bcrypt = require("bcryptjs");
const covidDB = require("../model/Covid");
const HistoridocDB = require("../model/History_doc");
const HistoriRegDB = require("../model/History_pendaftaran");
let validitasDB = require("../model/Validitas");
const excelToJson = require("convert-excel-to-json");
const { makeid } = require("../services/helper");
const { timeStamp } = require("console");
let xl = require("excel4node");

router.post("/pendaftaran", async function (req, res, next) {
  const formRegisCheck = await formRegisDB
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

  if (formRegisCheck.length > 0) {
    res
      .status(208)
      .send("Email Penanggung jawab atau nama perusahaan sudah terdaftar.");
    return;
  }
  if (req.body.umum.compProvince === null || req.body.umum.compCity === null) {
    res.status(400).send("Province and Kabkot cannot be null!");
    return;
  }

  const formNew = new formRegisDB(req.body);
  formNew.validated = false;
  // const salt = await bcrypt.genSalt(10);
  // const hashPass = await bcrypt.hash(formNew.akun.personPassword, salt);
  // formNew.akun.personPassword = hashPass;
  try {
    const formSave = await formNew.save();
    res.send(formSave);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/pendaftaran-get/:id", async function (req, res, next) {
  const data = await formRegisDB.findOne({
    _id: req.params.id,
  });
  res.send(data);
});

router.get("/covid-get/:id", async function (req, res, next) {
  const data = await covidDB.findOne({
    _id: req.params.id,
  });
  res.send(data);
});

router.put("/pendaftaran-update/", async (req, res) => {
  try {
    let companyID = "";
    const companyNameID = req.body.umum.compNameID;
    const findCompany = await compDB.findOne({
      compName: companyNameID,
    });
    let message = [];
    let check_validated = await formRegisDB.findOne({
      _id: req.body._id,
    });
    if (check_validated.validated) {
      if (findCompany != null) {
        companyID = findCompany._id;
        // UPDATE COMPANY COLLECTION
        const compNew = {
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

        // UPDATE LOGGER BML
        // cek sensor yang aktif
        if (!req.body.sensor[0].active) {
          ph_min = null;
          ph_max = null;
        } else {
          ph_min = Number(req.body.sensor[0].min);
          ph_max = Number(req.body.sensor[0].max);
        }
        if (!req.body.sensor[1].active) {
          cod_min = null;
          cod_max = null;
        } else {
          cod_min = Number(req.body.sensor[1].min);
          cod_max = Number(req.body.sensor[1].max);
        }
        if (!req.body.sensor[2].active) {
          tss_min = null;
          tss_max = null;
        } else {
          tss_min = Number(req.body.sensor[2].min);
          tss_max = Number(req.body.sensor[2].max);
        }
        if (!req.body.sensor[3].active) {
          nh3n_min = null;
          nh3n_max = null;
        } else {
          nh3n_min = Number(req.body.sensor[3].min);
          nh3n_max = Number(req.body.sensor[3].max);
        }
        if (!req.body.sensor[4].active) {
          debit_min = null;
          debit_max = null;
        } else {
          debit_min = Number(req.body.sensor[4].min);
          debit_max = Number(req.body.sensor[4].max);
        }
        const loggerNew = {
          logDataRange: [
            {
              name: "pH",
              min: ph_min,
              max: ph_max,
            },
            {
              name: "COD",
              min: cod_min,
              max: cod_max,
            },
            {
              name: "TSS",
              min: tss_min,
              max: tss_max,
            },
            {
              name: "NH3N",
              min: nh3n_min,
              max: nh3n_max,
            },
            {
              name: "Debit",
              min: debit_min,
              max: debit_max,
            },
          ],
          latlong: {
            lat: Number(req.body.teknis.spotList[0].spotLoc[0]),
            lng: Number(req.body.teknis.spotList[0].spotLoc[1]),
          },
        };

        // UPDATE FORM REGIS COMP
        req.body.umum.createdAt = req.body.umum.createdAt;
        req.body.umum.updatedAt = moment().unix();
        const dataUpdateLogger = await loggerDB.updateOne(
          {
            compID: companyID,
          },
          loggerNew
        );
        const dataUpdateComp = await compDB.findOneAndUpdate(
          {
            _id: companyID,
          },
          compNew,
          {
            new: true,
          }
        );
        const dataUpdate = await formRegisDB.updateOne(
          {
            _id: req.body._id,
          },
          req.body
        );

        // UPDATE USERS
        if (req.body.akun.personMail === req.body.akun.personMailID) {
          const findUser = await userDB.findOne({
            userEmail: req.body.akun.personMailID,
          });
          if (findUser != null) {
            const userNewU = {
              userEmail: req.body.akun.personMail,
              userPassword: req.body.akun.personPassword,
              userRole: {
                role: "comp",
                kabkotID: req.body.umum.compCity,
                provID: req.body.umum.compProvince,
                compID: String(dataUpdateComp._id),
                profileID: String(req.body._id),
              },
            };
            const dataUpdateUsers = await userDB.updateOne(
              {
                _id: findUser._id,
              },
              userNewU
            );
          }
        } else {
          const userDeleteI = await userDB
            .findOne({
              userEmail: req.body.akun.personMailID,
            })
            .remove()
            .exec();
          const userNew = new userDB({
            userEmail: req.body.akun.personMail,
            userPassword: req.body.akun.personPassword,
            userRole: {
              role: "comp",
              kabkotID: req.body.umum.compCity,
              provID: req.body.umum.compProvince,
              compID: String(dataUpdateComp._id),
              profileID: String(req.body._id),
            },
          });
          const userSave = await userNew.save();
        }

        message.push({
          msg: "Berhasil merubah data ini.",
          status: 200,
          data: dataUpdate,
        });
        res.status(200).send(message);
      } else {
        message.push({
          msg: "terjadi kesalahan tolong hubungi admin terimakasih.",
          status: 400,
          data: null,
        });
        res.status(200).send(message);
      }
    } else {
      const dataUpdate = await formRegisDB.updateOne(
        {
          _id: req.body._id,
        },
        req.body
      );
      message.push({
        msg: "Berhasil merubah data ini.",
        status: 200,
        data: dataUpdate,
      });
      res.status(200).send(message);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Update Error");
  }
});

router.put("/covid-update/", async (req, res) => {
  try {
    req.body.detail.updatedAt = moment().unix();
    const dataUpdate = await covidDB.updateOne(
      {
        _id: req.body._id,
      },
      req.body
    );
    res.send(dataUpdate);
  } catch (error) {
    res.status(400).send("Update Error");
  }
});

router.post("/covid", async function (req, res, next) {
  const covidFormNew = new covidDB(req.body);
  const covidFormSave = await covidFormNew.save();
  res.send(covidFormSave);
});

router.get("/covid", async (req, res) => {
  try {
    const covid = await covidDB.find({});
    for (let i = 0; i < covid.length; i++) {
      const timestamp = covid[i]._id.toString().substring(0, 8);
      covid[i].detail.createdAt = parseInt(timestamp, 16);
      if (covid[i].detail.compProvince) {
        const prov = await provDB.findOne({
          _id: covid[i].detail.compProvince,
        });
        covid[i].detail.compProvinceName = prov.provName;
        const kabkot = await kabkotDB.findOne({
          _id: covid[i].detail.compCity,
        });
        covid[i].detail.compCityName = kabkot.kabkotName;
      }
    }
    res.send(covid);
  } catch (error) {
    res.send(error);
  }
});

router.get("/covid-export", async (req, res) => {
  try {
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet("Covid");

    let col = 1;
    //Akun
    ws.cell(col, 1).string("Nama Perusahaan");
    ws.cell(col, 2).string("Jenis Industri");
    ws.cell(col, 3).string("Alamat Perusahaan");
    ws.cell(col, 4).string("Provinsi");
    ws.cell(col, 5).string("Kabupaten / Kota");
    ws.cell(col, 6).string("Telepon Kantor");
    ws.cell(col, 7).string("Email Kantor");
    ws.cell(col, 8).string("Penanggungjawab Sparing");
    ws.cell(col, 9).string("Handphone Penanggungjawab Sparing");
    ws.cell(col, 10).string("Email Penanggungjawab Sparing");
    ws.cell(col, 11).string("Tahapan Pemasangan SPARING");
    ws.cell(col, 12).string("Bukti Pengadaan Sparing (Dokumen Tender)");
    ws.cell(col, 13).string("Foto Instalasi");
    ws.cell(col, 14).string("Foto Sparing");
    ws.cell(col, 15).string("Dokumen Pemasangan");
    ws.cell(col, 16).string("Perencanaan Masa Uji / Commisioning");
    ws.cell(col, 17).string("Rencana Pengoperasian Sparing");

    const covid = await covidDB.find({});
    for (let i = 0; i < covid.length; i++) {
      const timestamp = covid[i]._id.toString().substring(0, 8);
      covid[i].detail.createdAt = parseInt(timestamp, 16);
      if (covid[i].detail.compProvince) {
        const prov = await provDB.findOne({
          _id: covid[i].detail.compProvince,
        });
        covid[i].detail.compProvinceName = prov.provName;
        const kabkot = await kabkotDB.findOne({
          _id: covid[i].detail.compCity,
        });
        covid[i].detail.compCityName = kabkot.kabkotName;
      }

      col++;
      ws.cell(col, 1).string(covid[i].detail.compName);
      ws.cell(col, 2).string(covid[i].detail.compType);
      ws.cell(col, 3).string(covid[i].detail.compAddress);
      ws.cell(col, 4).string(covid[i].detail.compProvinceName);
      ws.cell(col, 5).string(covid[i].detail.compCityName);
      ws.cell(col, 6).string(covid[i].detail.compPhone);
      ws.cell(col, 7).string(covid[i].detail.compMail);
      ws.cell(col, 8).string(covid[i].detail.compCP);
      ws.cell(col, 9).string(covid[i].detail.personPhone);
      ws.cell(col, 10).string(covid[i].detail.personMail);
      ws.cell(col, 11).string(covid[i].detail.tahap);
      ws.cell(col, 12).string(
        covid[i].fileTender.hasOwnProperty("path") &&
          covid[i].fileTender.path != ""
          ? "File Terupload"
          : "File tidak tersedia"
      );
      ws.cell(col, 13).string(
        covid[i].photoPemasangan.hasOwnProperty("path") &&
          covid[i].photoPemasangan.path != ""
          ? "File Terupload"
          : "File tidak tersedia"
      );
      ws.cell(col, 14).string(
        covid[i].photoSPARING.hasOwnProperty("path") &&
          covid[i].photoSPARING.path != ""
          ? "File Terupload"
          : "File tidak tersedia"
      );
      ws.cell(col, 15).string(
        covid[i].filePemasangan.hasOwnProperty("path") &&
          covid[i].filePemasangan.path != ""
          ? "File Terupload"
          : "File tidak tersedia"
      );
      ws.cell(col, 16).string(
        covid[i].fileCommission.hasOwnProperty("path") &&
          covid[i].fileCommission.path != ""
          ? "File Terupload"
          : "File tidak tersedia"
      );
      ws.cell(col, 17).string(
        covid[i].filePengoperasion.hasOwnProperty("path") &&
          covid[i].filePengoperasion.path != ""
          ? "File Terupload"
          : "File tidak tersedia"
      );
    }
    wb.write(`List Pertanggungan Covid.xlsx`, res);
  } catch (error) {
    res.send(error);
  }
});

router.delete("/covid/:id", async (req, res) => {
  try {
    const covidDel = await covidDB.deleteOne({
      _id: req.params.id,
    });
    res.send(covidDel);
  } catch (error) {
    res.send(error);
  }
});

router.delete("/delete-form/:id", async (req, res) => {
  try {
    const formRegisDel = await formRegisDB.deleteOne({
      _id: req.params.id,
    });
    res.send(formRegisDel);
  } catch (error) {
    res.send(error);
  }
});

router.get("/list-histori-pendaftaran/:id", async (req, res) => {
  let id = req.params.id;
  const findHistori = await HistoriRegDB.findOne({
    formregiscomps_id: id,
  });
  // let datas = {_id:findHistori._id,formregiscomps_id:findHistori.formregiscomps_id}
  // let asd= [];
  // const count = findHistori.histori_pendaftaran.filter(async function(item){
  //   const findCompany = await userDB.findOne({
  //     _id:item.user_id
  //   },'name');
  //   console.log(findCompany.name);
  //   asd.histori_pendaftaran ={
  //     _id: findHistori.histori_pendaftaran._id,
  // 		keterangan: findHistori.histori_pendaftaran.keterangan,
  // 		status: findHistori.histori_pendaftaran.status,
  // 		act: findHistori.histori_pendaftaran.act,
  // 		user_id: findCompany.name,
  // 		created_time: findHistori.histori_pendaftaran.created_time
  //   }
  // });

  // console.log(asd)

  // ini gk
  // for (let i=0;i<findHistori.histori_pendaftaran.length;i++) {
  // console.log(findHistori[i].histori_pendaftaran)
  // const findCompany = await userDB.findOne({
  //   _id:histori.user_id
  // },'name');
  // datas.push({_id:histori._id,histori_pendaftaran:[{
  //   _id:histori.histori_pendaftaran._id
  // }]})
  // }
  // const findHistori = await HistoriRegDB.findOne({
  //   formregiscomps_id: id
  // });

  // res.send(findHistori);
  res.send(count);
});

router.get("/list-pendaftaran", async (req, res) => {
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

    // if (formList[i].prosesProduksi === undefined) {

    //   formList[i].push({
    // prosesProduksi: {
    //   debitLimbahTotal: {
    //     keterangan: null, value: null
    //   },
    //   debitOlahIPAL: {
    //     keterangan: null, value: null
    //   },
    //   debitPenggunaan: {
    //     keterangan: null, value: null
    //   },
    //   debitRecovery: {
    //     keterangan: null, value: null
    //   },
    //   debitRecycle: {
    //     keterangan: null, value: null
    //   },
    //   debitReuse: {
    //     keterangan: null, value: null
    //   },
    //   fileNeracaAirLimbah: {
    //     path: null, progress: null, upload: null
    //   },
    // }
    //   })
    // }
  }

  res.send(formList);
});

router.get("/list-pendaftaran-export", async function (req, res, next) {
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

router.get("/list-validation", async (req, res) => {
  const formList = await formRegisDB.find({
    validated: false,
  });

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
  }
  res.send(formList);
});

router.get("/detail-pendaftaran/:id", async (req, res) => {
  const user = await userDB.findOne({
    _id: req.params.id,
  });
  const formList = await formRegisDB.findOne({
    _id: user.userRole.profileID,
  });
  if (!formList) {
    return res.send({ success: false, message: "Bukan akun perusahaan" });
  }
  const logger = await loggerDB.findOne({
    compID: user.userRole.compID,
  });
  const prov = await provDB.findOne({
    _id: formList.umum.compProvince,
  });
  const kabkot = await kabkotDB.findOne({
    _id: formList.umum.compCity,
  });
  formList.umum.compProvinceName = prov.provName;
  formList.umum.compCityName = kabkot.kabkotName;
  if (formList.logger[0].id) {
    formList.logger[0].id = logger._id;
  }
  if (formList.prosesProduksi === undefined || formList.prosesProduksi === "") {
    formList.prosesProduksi = {
      debitLimbahTotal: {
        keterangan: "",
        value: "",
      },
      debitOlahIPAL: {
        keterangan: "",
        value: "",
      },
      debitPenggunaan: {
        keterangan: "",
        value: "",
      },
      debitRecovery: {
        keterangan: "",
        value: "",
      },
      debitRecycle: {
        keterangan: "",
        value: "",
      },
      debitReuse: {
        keterangan: "",
        value: "",
      },
      fileNeracaAirLimbah: {
        path: "",
        progress: "",
        upload: "",
      },
    };
  }
  res.send(formList);
});

router.get("/histori-company/:id", async (req, res) => {
  let id = req.params.id;
  //    let data = {
  //     "compID" : "5f4e1ca9167c90338b8fe174",
  //     "detail_dokumen" : [
  //         {
  //             "_id": "62c84466e6a5111554dded39",
  //             "nama_dokumen" : "dokumen_kalibrasi.pdf",
  //             "tipe_dokumen" : "dokumen kalibrasi",
  //             "path" : "http://klhk.intusi.com/storage/dokument_kalibrasi.pdf",
  //             "created_time":1657291878,
  //             "updated_time" : null,
  //             "validated_time": null,
  //             "validated":true,
  //             "use" : true,
  //             "status" : "new"
  //         }
  //     ],
  //     "created_time" : 1657291878,
  //     "validated" : true,
  //     "__v" : 0
  // }
  let msg = {
    err: "",
    status: false,
  };
  try {
    let find = await HistoridocDB.find({
      pendaftaranID: id,
    });
    if (!find) {
      msg.err = "Data not found";
      msg.status = false;
      return res.status(400).send(msg);
    }

    for (let i = 0; i < find.length; i++) {
      msg = find[i];
    }

    return res.status(200).send(msg);
  } catch (err) {
    msg.err = err;
    msg.status = false;
    return res.status(400).send(msg);
  }
});

router.put("/validate-pendaftaran/:id", async (req, res) => {
  const formReg = await formRegisDB.findOne({
    _id: req.params.id,
  });
  let ph_min,
    ph_max,
    cod_min,
    cod_max,
    tss_min,
    tss_max,
    nh3n_min,
    nh3n_max,
    debit_min,
    debit_max;

  if (formReg.validated === true) {
    return res.status(400).send("Data has been Validated");
  }

  // cek sensor yang aktif
  if (!formReg.sensor[0].active) {
    ph_min = null;
    ph_max = null;
  } else {
    ph_min = Number(formReg.sensor[0].min);
    ph_max = Number(formReg.sensor[0].max);
  }
  if (!formReg.sensor[1].active) {
    cod_min = null;
    cod_max = null;
  } else {
    cod_min = Number(formReg.sensor[1].min);
    cod_max = Number(formReg.sensor[1].max);
  }
  if (!formReg.sensor[2].active) {
    tss_min = null;
    tss_max = null;
  } else {
    tss_min = Number(formReg.sensor[2].min);
    tss_max = Number(formReg.sensor[2].max);
  }
  if (!formReg.sensor[3].active) {
    nh3n_min = null;
    nh3n_max = null;
  } else {
    nh3n_min = Number(formReg.sensor[3].min);
    nh3n_max = Number(formReg.sensor[3].max);
  }
  if (!formReg.sensor[4].active) {
    debit_min = null;
    debit_max = null;
  } else {
    debit_min = Number(formReg.sensor[4].min);
    debit_max = Number(formReg.sensor[4].max);
  }

  if (formReg.prosesProduksi != undefined) {
    // JIKA DAFTAR PROSES PRODUKSI AIR LIMBAH
    if (formReg.prosesProduksi.debitPenggunaan.value != null) {
      const compNew = new compDB({
        compName: formReg.umum.compName,
        compAddress: formReg.umum.compAddress,
        compTlp: formReg.umum.compPhone,
        compType: formReg.umum.compType,
        compPermit: "-",
        compWasteSource: "-",
        compInstance: "-",
        compPermitDate: "-",
        compTech: "-",
      });
      const compSave = await compNew.save();
      const userNew = new userDB({
        userEmail: formReg.akun.personMail,
        userPassword: formReg.akun.personPassword,
        userRole: {
          role: "comp",
          kabkotID: formReg.umum.compCity,
          provID: formReg.umum.compProvince,
          compID: String(compSave._id),
          profileID: String(formReg._id),
        },
      });
      const userSave = await userNew.save();
      const updateVal = await formRegisDB.updateOne(
        {
          _id: req.params.id,
        },
        {
          validated: true,
        }
      );
      res.send({
        userSave,
        compSave,
      });
    }
  }

  const compNew = new compDB({
    compName: formReg.umum.compName,
    compAddress: formReg.umum.compAddress,
    compTlp: formReg.umum.compPhone,
    compType: formReg.umum.compType,
    compPermit: formReg.teknis.permitFile.path,
    compWasteSource: formReg.teknis.wasteSource,
    compInstance: formReg.teknis.permitPerson,
    compPermitDate: formReg.teknis.permitNumber,
    compTech: formReg.teknis.processingTechnique,
  });
  const compSave = await compNew.save();
  const userNew = new userDB({
    userEmail: formReg.akun.personMail,
    userPassword: formReg.akun.personPassword,
    userRole: {
      role: "comp",
      kabkotID: formReg.umum.compCity,
      provID: formReg.umum.compProvince,
      compID: String(compSave._id),
      profileID: String(formReg._id),
    },
  });
  const userSave = await userNew.save();
  const loggerNew = new loggerDB({
    compID: compSave._id,
    kabkotID: formReg.umum.compCity,
    provID: formReg.umum.compProvince,
    logDataRange: [
      {
        name: "pH",
        min: ph_min,
        max: ph_max,
      },
      {
        name: "COD",
        min: cod_min,
        max: cod_max,
      },
      {
        name: "TSS",
        min: tss_min,
        max: tss_max,
      },
      {
        name: "NH3N",
        min: nh3n_min,
        max: nh3n_max,
      },
      {
        name: "Debit",
        min: debit_min,
        max: debit_max,
      },
    ],
    latlong: {
      lat: Number(formReg.teknis.spotList[0].spotLoc[0]),
      lng: Number(formReg.teknis.spotList[0].spotLoc[1]),
    },
    errCounter: 0,
    satuanDebit: formReg.teknis.satuanDebit,
    activationStatus: true,
  });

  const loggerSave = await loggerNew.save();
  const updateVal = await formRegisDB.updateOne(
    {
      _id: req.params.id,
    },
    {
      validated: true,
    }
  );
  res.send({
    userSave,
    compSave,
    loggerSave,
  });
});

router.put("/reject-pendaftaran/:id", async (req, res) => {
  let id = req.params.id;
  let keterangan = req.body.keterangan;
  let status = "Pengajuan Baru";
  let user_id = req.body.user_id;
  const findRegis = await formRegisDB.findOne({
    _id: id,
  });
  const findHistori = await HistoriRegDB.findOne({
    formregiscomps_id: id,
  });
  let act;
  if (findHistori != null) {
    status = "Pengajuan Ulang";
  }
  let data = {
    formregiscomps_id: id,
    histori_pendaftaran: [
      {
        _id: makeid(24),
        keterangan: keterangan,
        status: status,
        act: "rejected",
        user_id: user_id,
        created_time: moment().unix(),
      },
    ],
  };

  if (findHistori == null) {
    const updateVal = await formRegisDB.updateOne(
      {
        _id: req.params.id,
      },
      {
        validated: false,
        rejected: true,
      }
    );

    const histori = new HistoriRegDB(data);
    act = await histori.save();
  } else {
    //update jika sudah ada di histori
    const updateVal = await formRegisDB.updateOne(
      {
        _id: req.params.id,
      },
      {
        validated: false,
        rejected: true,
      }
    );

    let data_update = {
      _id: makeid(24),
      keterangan: keterangan,
      status: status,
      act: "rejected",
      user_id: user_id,
      created_time: moment().unix(),
    };
    findHistori.histori_pendaftaran.push(data_update);

    const histori = new HistoriRegDB(findHistori);
    act = await histori.save();
  }

  res.status(200).send(act);
});

router.post("/cond-report", async (req, res) => {
  // const lapming = await formMingguan.findOne({
  //   _id: req.body.formmingguanID,
  // });
  const cond = new condRepDB(req.body);
  // console.log(
  //   moment(req.body.tanggalKejadian * 1000).format("DD MMM YYYY, HH:mm")
  // );
  // console.log(
  //   moment(req.body.endTanggalKejadian * 1000).format("DD MMM YYYY, HH:mm")
  // );
  let message;
  try {
    const logger = await loggerDB.findOne({ compID: req.body.compID });
    if (!logger) {
      return res.send({ success: false, message: "Logger not found" });
    }
    const condSaved = await cond.save();
    if (req.body.kondisi === "Kondisi Terkendala Internet") {
      let json = excelToJson({
        sourceFile: __basedir + "/public" + req.body.fileLaporanPath,
        header: {
          rows: 2,
        },
      });
      if (typeof json.data === "undefined") {
        return res.status(400).send({
          success: false,
          message: "format anda salah",
        });
      }
      if (json.data.length < 0) {
        return res.status(400).send({
          success: false,
          message: "File kosong",
        });
      }
      let checkJson = excelToJson({
        sourceFile: __basedir + "/public" + req.body.fileLaporanPath,
        header: {
          rows: 1,
        },
      });
      if (checkJson.data[0].B != "pH") {
        return res.status(400).send({
          success: false,
          message: "format anda salah",
        });
      }
      json.data.forEach(async (value) => {
        let d = value.G.substr(0, 2);
        let m = value.G.substr(3, 2);
        let y = value.G.substr(6, 4);
        let fulltime = value.G.substr(-9);
        let time = fulltime.substr(0, 6);
        let newDate = y + "/" + m + "/" + d + time + ":00";
        value.G = moment(new Date(newDate)).unix();
      });
      function getUniqueListBy(arr, key) {
        return [...new Map(arr.map((item) => [item[key], item])).values()];
      }
      const data = getUniqueListBy(json.data, "G");
      let i = 0;
      let lastStart = 0;
      const now = moment().unix();
      for (let index = 0; index < data.length; index++) {
        let value = data[index];
        let start = moment(value.H * 1000)
          .startOf("h")
          .unix();
        if (index == 0 || (i < 30 && start == lastStart)) {
          if (index == 0) {
            lastStart = start;
            let dataManual = new datamanual2minDB({
              condReportID: condSaved._id,
              loggerID: logger._id,
              dataParam: [
                {
                  name: "pH",
                  value: value.B,
                },
                {
                  name: "COD",
                  value: value.C,
                },
                {
                  name: "TSS",
                  value: value.D,
                },
                {
                  name: "NH3N",
                  value: value.E,
                },
                {
                  name: "Debit",
                  value: value.F,
                },
              ],
              timestamp: value.G,
              serverTimestamp: now,
            });
            await dataManual.save();
          } else {
            let dataManual = new datamanual2minDB({
              condReportID: condSaved._id,
              loggerID: logger._id,
              dataParam: [
                {
                  name: "pH",
                  value: value.B,
                },
                {
                  name: "COD",
                  value: value.C,
                },
                {
                  name: "TSS",
                  value: value.D,
                },
                {
                  name: "NH3N",
                  value: value.E,
                },
                {
                  name: "Debit",
                  value: value.F,
                },
              ],
              timestamp: value.G,
              serverTimestamp: now,
            });
            await dataManual.save();
          }
        } else {
          if (start != lastStart) {
            i = 0;
            lastStart = start;

            let dataManual = new datamanual2minDB({
              condReportID: condSaved._id,
              loggerID: logger._id,
              dataParam: [
                {
                  name: "pH",
                  value: value.B,
                },
                {
                  name: "COD",
                  value: value.C,
                },
                {
                  name: "TSS",
                  value: value.D,
                },
                {
                  name: "NH3N",
                  value: value.E,
                },
                {
                  name: "Debit",
                  value: value.F,
                },
              ],
              timestamp: value.G,
              serverTimestamp: now,
            });
            await dataManual.save();
          }
        }
        i++;
      }
    }
    return res.send(condSaved);
  } catch (error) {
    if (message) {
      return res.status(400).send(message);
    }
    console.log(error);
    res.status(400).send(error);
  }
});
const mongoose = require("mongoose");
const { readSync } = require("fs");
const formMingguan = require("../model/formMingguan");
const errorRecap = require("../model/errorRecap");
const ObjectId = mongoose.Types.ObjectId;

router.get("/cond-report/:id", async (req, res) => {
  try {
    const cond = await condRepDB.aggregate([
      {
        $match: {
          _id: ObjectId(req.params.id),
        },
      },

      {
        $addFields: {
          convertedCompID: { $toObjectId: "$compID" },
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
          convertedProvID: { $toObjectId: "$provID" },
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
          convertedKabkotID: { $toObjectId: "$kabkotID" },
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
    ]);

    let r = cond[0];
    if (r) {
      r.validitas = r ? await getLastValiditas(r._id + "", true) : [];
    }

    res.send(cond);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/cond-report/:id", async (req, res) => {
  try {
    const cond = await condRepDB.updateOne(
      {
        _id: req.params.id,
      },
      req.body
    );

    res.send(cond);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/cond-report/:id", async (req, res) => {
  try {
    const cond = await condRepDB.deleteOne({
      _id: req.params.id,
    });
    res.send(cond);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/cond-report-all/:id", async (req, res) => {
  const user = await userDB.findOne({
    _id: req.params.id,
  });
  if (!user) return res.status(400).send("User not found!");
  let query = {};
  let cond;
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
      {
        tanggalKejadian: {
          $gte: Number(req.query.start),
        },
      },
      {
        tanggalKejadian: {
          $lte: Number(req.query.end),
        },
      },
    ];
  }
  try {
    let fieldsQL = [
      {
        $addFields: {
          convertedCompID: { $toObjectId: "$compID" },
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
          convertedProvID: { $toObjectId: "$provID" },
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
          convertedKabkotID: { $toObjectId: "$kabkotID" },
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
    ];

    switch (user.userRole.role) {
      case "admin":
        cond = await condRepDB.aggregate([...fieldsQL]);
        break;
      case "kabkot":
        cond = await condRepDB.aggregate([
          {
            $match: {
              kabkotID: user.userRole.kabkotID,
            },
          },
          ...fieldsQL,
        ]);
        break;
      case "prov":
        cond = await condRepDB.aggregate([
          {
            $match: {
              provID: user.userRole.provID,
            },
          },
          ...fieldsQL,
        ]);
        break;
      case "comp":
        cond = await condRepDB.aggregate([
          {
            $match: {
              compID: user.userRole.compID,
            },
          },
          ...fieldsQL,
        ]);
        break;
      default:
        break;
    }
    for (let r of cond) {
      r.validitas = await getLastValiditas(r._id + "");
    }

    res.send(cond);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// for now
let getLastValiditas = async (id, isAll = false) => {
  let rs = await validitasDB.aggregate([
    { $match: { condReportsID: id } },
    { $sort: { waktu: -1 } },
  ]);

  console.log("---->>>", id, rs);

  if (isAll) return rs;

  return rs ? rs[0] : {};
};

// BERITA ACARA

router.get("/cond-report-all-export", async (req, res) => {
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
      {
        tanggalKejadian: {
          $gte: Number(req.query.start),
        },
      },
      {
        tanggalKejadian: {
          $lte: Number(req.query.end),
        },
      },
    ];
  }

  try {
    const cond = await condRepDB.aggregate([
      {
        $addFields: {
          convertedCompID: { $toObjectId: "$compID" },
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
          convertedProvID: { $toObjectId: "$provID" },
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
          convertedKabkotID: { $toObjectId: "$kabkotID" },
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
    ]);

    var wb = new xl.Workbook();
    var ws = wb.addWorksheet("Kondisi Tidak Normal");

    var col = 1;
    //Akun
    ws.cell(col, 1).string("Nama Industri");
    ws.cell(col, 2).string("Jenis Industri");
    ws.cell(col, 3).string("Kab/Kot");
    ws.cell(col, 4).string("Provinsi");
    ws.cell(col, 5).string("Waktu");
    ws.cell(col, 6).string("Status");
    ws.cell(col, 7).string("Detail");

    let dt;
    for (let i = 0; i < cond.length; i++) {
      col++;
      let dt = new Date(cond[i].tanggalKejadian * 1000);
      let val = await getLastValiditas(cond[i]._id + "");
      ws.cell(col, 1).string(cond[i].compDetails.compName);
      ws.cell(col, 2).string(cond[i].compDetails.compType);
      ws.cell(col, 3).string(cond[i].kabkotDetails.kabkotName);
      ws.cell(col, 4).string(cond[i].provDetails.provName);
      ws.cell(col, 5).string(dt.toString());
      ws.cell(col, 6).string(val ? val.status : "");
      ws.cell(col, 7).string(cond[i].kondisiTidakNormal.status);
    }

    wb.write(`List Laporan Kondisi Tidak Normal.xlsx`, res);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/listBeritaAcara/:id", async function (req, res) {
  const user = await userDB.findOne({
    _id: req.params.id,
  });
  let provList, kabkotList, compList;

  switch (user.userRole.role) {
    case "admin":
      compList = await beritaAcaraDB.aggregate([
        {
          $addFields: {
            compID: {
              $toObjectId: "$compID",
            },
            kabkotID: {
              $toObjectId: "$kabkotID",
            },
            provID: {
              $toObjectId: "$provID",
            },
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
        {
          $unwind: {
            path: "$companyDetails",
            preserveNullAndEmptyArrays: true,
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
        {
          $unwind: "$kabkotDetails",
        },
        {
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetils",
          },
        },
        {
          $unwind: "$provDetils",
        },

        {
          $project: {
            kabkotName: "$kabkotDetails.kabkotName",
            provName: "$provDetils.provName",
            compName: "$companyDetails.compName",
            compID: "$companyDetails._id",
            kabkotID: "$kabkotDetails._id",
            provID: "$provDetils._id",
            detailOtherComp: "$detailOtherComp",
            tanggalBeritaAcara: "$tanggalBeritaAcara",
            lampiranBeritaAcara: "$lampiranBeritaAcara",
          },
        },
      ]);
      break;
    case "prov":
      compList = await beritaAcaraDB.aggregate([
        {
          $match: {
            provID: user.userRole.provID,
          },
        },
        // { $addFields: { compID: { $toObjectId: "$compID" } } },
        // {
        //   $lookup: {
        //     from: "companies",
        //     localField: "compID",
        //     foreignField: "_id",
        //     as: "companyDetails",
        //   },
        // },
        // { $unwind: "$companyDetails" },
        // {
        //   $project: {

        //     name: "$companyDetails.compName",
        //     tanggalBeritaAcara: "$tanggalBeritaAcara",
        //     lampiranBeritaAcara: "$lampiranBeritaAcara"
        //   },
        // },
        {
          $addFields: {
            compID: {
              $toObjectId: "$compID",
            },
            kabkotID: {
              $toObjectId: "$kabkotID",
            },
            provID: {
              $toObjectId: "$provID",
            },
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
        {
          $unwind: {
            path: "$companyDetails",
            preserveNullAndEmptyArrays: true,
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
        {
          $unwind: "$kabkotDetails",
        },
        {
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetils",
          },
        },
        {
          $unwind: "$provDetils",
        },

        {
          $project: {
            kabkotName: "$kabkotDetails.kabkotName",
            provName: "$provDetils.provName",
            compName: "$companyDetails.compName",
            compID: "$companyDetails._id",
            kabkotID: "$kabkotDetails._id",
            provID: "$provDetils._id",
            detailOtherComp: "$detailOtherComp",
            tanggalBeritaAcara: "$tanggalBeritaAcara",
            lampiranBeritaAcara: "$lampiranBeritaAcara",
          },
        },
      ]);
      break;
    case "kabkot":
      compList = await beritaAcaraDB.aggregate([
        {
          $match: {
            kabkotID: user.userRole.kabkotID,
          },
        },
        // { $addFields: { compID: { $toObjectId: "$compID" } } },
        // {
        //   $lookup: {
        //     from: "companies",
        //     localField: "compID",
        //     foreignField: "_id",
        //     as: "companyDetails",
        //   },
        // },
        // { $unwind: "$companyDetails" },
        // {
        //   $project: {

        //     name: "$companyDetails.compName",
        //     tanggalBeritaAcara: "$tanggalBeritaAcara",
        //     lampiranBeritaAcara: "$lampiranBeritaAcara"
        //   },
        // },
        {
          $addFields: {
            compID: {
              $toObjectId: "$compID",
            },
            kabkotID: {
              $toObjectId: "$kabkotID",
            },
            provID: {
              $toObjectId: "$provID",
            },
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
        {
          $unwind: {
            path: "$companyDetails",
            preserveNullAndEmptyArrays: true,
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
        {
          $unwind: "$kabkotDetails",
        },
        {
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetils",
          },
        },
        {
          $unwind: "$provDetils",
        },

        {
          $project: {
            kabkotName: "$kabkotDetails.kabkotName",
            provName: "$provDetils.provName",
            compName: "$companyDetails.compName",
            compID: "$companyDetails._id",
            kabkotID: "$kabkotDetails._id",
            provID: "$provDetils._id",
            detailOtherComp: "$detailOtherComp",
            tanggalBeritaAcara: "$tanggalBeritaAcara",
            lampiranBeritaAcara: "$lampiranBeritaAcara",
          },
        },
      ]);
      break;
    case "comp":
      compList = await beritaAcaraDB.aggregate([
        {
          $match: {
            compID: user.userRole.compID,
          },
        },
        // { $addFields: { compID: { $toObjectId: "$compID" } } },
        // {
        //   $lookup: {
        //     from: "companies",
        //     localField: "compID",
        //     foreignField: "_id",
        //     as: "companyDetails",
        //   },
        // },
        // { $unwind: "$companyDetails" },
        // {
        //   $project: {

        //     name: "$companyDetails.compName",
        //     tanggalBeritaAcara: "$tanggalBeritaAcara",
        //     lampiranBeritaAcara: "$lampiranBeritaAcara"
        //   },
        // },
        {
          $addFields: {
            compID: {
              $toObjectId: "$compID",
            },
            kabkotID: {
              $toObjectId: "$kabkotID",
            },
            provID: {
              $toObjectId: "$provID",
            },
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
        {
          $unwind: "$companyDetails",
        },
        {
          $lookup: {
            from: "kabkotdbs",
            localField: "kabkotID",
            foreignField: "_id",
            as: "kabkotDetails",
          },
        },
        {
          $unwind: "$kabkotDetails",
        },
        {
          $lookup: {
            from: "provdbs",
            localField: "provID",
            foreignField: "_id",
            as: "provDetils",
          },
        },
        {
          $unwind: "$provDetils",
        },

        {
          $project: {
            kabkotName: "$kabkotDetails.kabkotName",
            provName: "$provDetils.provName",
            compName: "$companyDetails.compName",
            compID: "$companyDetails._id",
            kabkotID: "$kabkotDetails._id",
            provID: "$provDetils._id",
            detailOtherComp: "$detailOtherComp",
            tanggalBeritaAcara: "$tanggalBeritaAcara",
            lampiranBeritaAcara: "$lampiranBeritaAcara",
          },
        },
      ]);
      break;
    default:
      break;
  }

  let datas = [];
  for (let i = 0; i < compList.length; i++) {
    if (compList[i].detailOtherComp.compName == null) {
      datas.push({
        id: compList[i]._id,
        provName: compList[i].provName,
        kabkotName: compList[i].kabkotName,
        compName: compList[i].compName,
        compID: compList[i].compID,
        provID: compList[i].provID,
        kabkotID: compList[i].kabkotID,
        lampiranBeritaAcara: compList[i].lampiranBeritaAcara.path,
        tanggalBeritaAcara: moment
          .unix(compList[i].tanggalBeritaAcara)
          .format("DD/MM/YY HH:mm:ss"),
      });
    } else {
      datas.push({
        id: compList[i]._id,
        provName: compList[i].provName,
        kabkotName: compList[i].kabkotName,
        compName: compList[i].detailOtherComp.compName,
        compID: compList[i].compID,
        provID: compList[i].provID,
        kabkotID: compList[i].kabkotID,
        lampiranBeritaAcara: compList[i].lampiranBeritaAcara.path,
        tanggalBeritaAcara: moment
          .unix(compList[i].tanggalBeritaAcara)
          .format("DD/MM/YY HH:mm:ss"),
      });
    }
  }
  console.log(datas);
  res.send(datas);
});

router.post("/beritaAcara", async function (req, res, next) {
  if (
    req.body.compID === null ||
    req.body.kabkotID === null ||
    req.body.provID === null ||
    req.body.lampiranBeritaAcara === null ||
    req.body.tgl_beritaAcara === null
  )
    res.status(400).send("Data cannot be null!");
  const formNew = new beritaAcaraDB(req.body);
  formNew.validated = false;

  try {
    const formSave = await formNew.save();
    res.send(formSave);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/beritaAcara/:id", async function (req, res, next) {
  if (
    req.body.compID === null ||
    req.body.kabkotID === null ||
    req.body.provID === null ||
    req.body.lampiranBeritaAcara === null ||
    req.body.tgl_beritaAcara === null
  )
    res.status(400).send("Data cannot be null!");
  try {
    const formSave = await beritaAcaraDB.updateOne(
      {
        _id: req.params.id,
      },
      req.body
    );
    res.send(formSave);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/beritaAcara/:id", async function (req, res, next) {
  if (req.params.id === null) res.status(400).send("Id not found!");
  try {
    const deleteBeritaAcara = await beritaAcaraDB.deleteOne({
      _id: req.params.id,
    });
    res.send(deleteBeritaAcara);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
