var express = require("express");
var router = express.Router();
var { percentageConvert } = require("../function/helper");
const formRegisDB = require("../model/formRegisComp");
const dataHarianDB = require("../model/dataDaySensor");
const dataHourlySensorDB = require("../model/dataHourlySensor");
const dataMonthSensorDB = require("../model/dataMonthSensor");
const dataSensorDB = require("../model/dataSensor");
const covidFormDB = require("../model/Covid");
const compDB = require("../model/Company");
const loggerDB = require("../model/Logger");
const condRepDB = require("../model/condReport");
const provDB = require("../model/Province");
const kabkotDB = require("../model/Kabkot");
const taskCronDB = require("../model/taskcronjob");
const moment = require("moment");
const { post_bulanan, get_bulanan } = require("../services/simplepost");
const request = require("request-promise");
const requestPromise = require("request-promise");
require("dotenv").config();

router.get("/list-pendaftaran", async (req, res) => {
  if (req.query.key !== "klasjhfiuUYBjBDLN341kj1jkkaj1aq")
    return res.status(400).send("Key Error!");
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

      if (comp) {
        const logger = await loggerDB.findOne({
          compID: comp._id,
        });
        formList[i].umum.loggerID = logger._id;
      }
    }
  }
  res.send(formList);
});

router.get("/daftar-pendaftaran", async (req, res) => {
  const { key, id_pendaftaran } = req.query;
  let dataSimple;
  let covidTahap;
  let id_pendaftaranCovid = null;
  // BARU VARIBALE //
  let pendaftaran;
  if (key !== "klasjhfiuUYBjBDLN341kj1jkkaj1aq")
    return res.status(400).send("Key Error!");

  try {
    pendaftaran = await formRegisDB.findById(id_pendaftaran);

    // code new
    if (pendaftaran) {
      const prov = await provDB.findOne({
        _id: pendaftaran.umum.compProvince,
      });
      const kabkot = await kabkotDB.findOne({
        _id: pendaftaran.umum.compCity,
      });
      const timestamp = pendaftaran._id.toString().substring(0, 8);
      pendaftaran.umum.createdAt = parseInt(timestamp, 16);
      pendaftaran.umum.compProvinceName = prov.provName;
      pendaftaran.umum.compCityName = kabkot.kabkotName;

      if (pendaftaran.validated === true) {
        const comp = await compDB.findOne({
          compName: pendaftaran.umum.compName,
        });
        const logger = await loggerDB.findOne({
          compID: comp._id,
        });
        pendaftaran.umum.loggerID = logger._id;

        let sensorCount = 0;
        let dataBML = [];

        for (let i = 0; i < pendaftaran.sensor.length; i++) {
          // console.log(formList.sensor[i].active)
          if (pendaftaran.sensor[i].active == true) {
            dataBML.push({
              name: pendaftaran.sensor[i].name,
              bml_min: pendaftaran.sensor[i].min,
              bml_max: pendaftaran.sensor[i].max,
              rangePengukuranMin: pendaftaran.sensor[i].minMeasure,
              rangePengukuranMax: pendaftaran.sensor[i].maxMeasure,
              brosurFile: pendaftaran.sensor[i].brosurFile.path,
            });

            sensorCount++;
          } else {
            dataBML.push({
              name: pendaftaran.sensor[i].name,
              bml_min: null,
              bml_max: null,
              rangePengukuranMin: null,
              rangePengukuranMax: null,
              brosurFile: null,
            });
          }
        }

        const covidForm = await covidFormDB.findOne({
          "detail.compName": new RegExp(pendaftaran.umum.compName, "i"),
        });
        // const covidForm = await covidFormDB.findOne({ 'detail.compName': pendaftaran.compName });
        if (covidForm == null) {
          covidTahap = "Tidak Ada Pelaporan Terkendala Pandemi Covid-19";
        } else {
          covidTahap = covidForm.detail.tahap;
          id_pendaftaranCovid = covidForm._id;
        }

        dataSimple = {
          id_perusahaan: comp._id,
          id_pendaftaran: id_pendaftaran,
          id_pelaporan_covid19: id_pendaftaranCovid,
          id_logger: logger._id,
          nama_perusahaan: pendaftaran.umum.compName,
          no_izin_lingkungan: pendaftaran.teknis.permitNumber,
          nama_titik_penaatan: pendaftaran.teknis.spotList[0].spotName,
          hasil_uji_kalibrasi: pendaftaran.validitas.kalibrasiRutinFile.path,
          hasil_uji_kinerja: pendaftaran.validitas.kinerjaFile.path,
          jumlah_parameter: sensorCount,
          parameter_sensor: dataBML,
          tahap_covid_19: covidTahap,
          // status_pendaftaran_sparing: formList.
        };
      } else {
        return res
          .status(400)
          .send(
            "Perusahaan belum di validasi oleh team sparing. Silahkan hubungi tim sparing"
          );
      }
    }
    // PENDAFTARAN COVID
    else {
      let id_perusahanCovid = null;
      let id_loggerCovid = null;
      let id_pendaftaranForm = null;
      pendaftaran = await covidFormDB.findById(id_pendaftaran);
      cek_comp_pendaftaranform = await formRegisDB.findOne({
        "umum.compName": new RegExp(pendaftaran.detail.compName, "i"),
      });
      const compCovid = await compDB.findOne({
        compName: new RegExp(pendaftaran.detail.compName, "i"),
      });
      if (compCovid) {
        const loggerCovid = await loggerDB.findOne({
          compID: compCovid._id,
        });
        id_perusahanCovid = compCovid._id;
        id_loggerCovid = loggerCovid.compID;
      }

      if (cek_comp_pendaftaranform) {
        id_pendaftaranForm = cek_comp_pendaftaranform._id;
      }

      if (pendaftaran) {
        // const prov = await provDB.findOne({ _id: pendaftaran.umum.compProvince });
        // const kabkot = await kabkotDB.findOne({ _id: pendaftaran.umum.compCity });
        // const timestamp = pendaftaran._id.toString().substring(0, 8);
        // pendaftaran.umum.createdAt = parseInt(timestamp, 16);
        // pendaftaran.umum.compProvinceName = prov.provName;
        // pendaftaran.umum.compCityName = kabkot.kabkotName;

        dataSimple = {
          id_pelaporan_covid19: id_pendaftaran,
          id_pendaftaran: id_pendaftaranForm,
          id_perusahaan: id_perusahanCovid,
          id_logger: id_loggerCovid,
          nama_perusahaan: pendaftaran.detail.compName,
          no_izin_lingkungan: null,
          nama_titik_penaatan: null,
          hasil_uji_kalibrasi: null,
          hasil_uji_kinerja: null,
          jumlah_parameter: null,
          tahap_covid_19: pendaftaran.detail.tahap,
          // status_pendaftaran_sparing: formList.
        };
      } else {
        return res
          .status(400)
          .send(
            "Id Pendaftaran Dan Id Pelaporan Terkendala Pandemi Covid-19 Tidak Ditemukan"
          );
      }
    }
    // end new
  } catch (error) {
    res.send("terjadi kesalahan mohon kontak admin");
  }
  res.send(dataSimple);
});

// router.get("/data-harian", async (req, res) => {
//   let { key, loggerID, start_date, end_date } = req.query;
//   let datas = [];
//   // start_date = start_date;
//   // end_date = end_date;
//   start_date = moment(start_date).unix();
//   end_date = moment(end_date).unix();

//   if (req.query.key !== "klasjhfiuUYBjBDLN341kj1jkkaj1aq")
//     return res.status(400).send("Key Error!");
//   // dataHarianDB
//   for (var m = moment(start_date); m.diff(end_date, 'days') <= 0; m.add(1, 'days')) {
//     const logger = await loggerDB.findById(loggerID);
//     const time = m.unix();
//     console.log(time);
//     const dataHourlySensor = await dataHourlySensorDB.aggregate([
//       { $addFields: { timestamp: "$timestamp" } },
//       {
//         $match: {
//           $and: [
//             { loggerID: `${logger._id}` },
//             {
//               timestamp: {
//                 $gte: time,
//               },
//             },
//           ],
//         },
//       },
//       {
//         $group: {
//           _id: { timestamp: "$timestamp" },
//           pH: { $avg: { $arrayElemAt: ["$dataParam.value", 0] } },
//           cod: { $avg: { $arrayElemAt: ["$dataParam.value", 1] } },
//           tss: { $avg: { $arrayElemAt: ["$dataParam.value", 2] } },
//           nh3n: { $avg: { $arrayElemAt: ["$dataParam.value", 3] } },
//           debit: { $avg: { $arrayElemAt: ["$dataParam.value", 4] } },
//         },
//       },
//       {
//         $project: {
//           timestamp: "$datahourlysensors.timestamp",
//           dataParam: [
//             {
//               name: "pH",
//               value: "$pH",
//             },
//             {
//               name: "COD",
//               value: "$cod",
//             },
//             {
//               name: "TSS",
//               value: "$tss",
//             },
//             {
//               name: "NH3N",
//               value: "$nh3n",
//             },
//             {
//               name: "Debit",
//               value: "$debit",
//             },
//           ]

//         },
//       },
//     ]);

//     datas.push(dataHourlySensor)

//   }
//   res.send(datas);

//   // for (let i = 0; i < dataHarianSensor.length; i++) {
//   //   datas.push(
//   //     {
//   //       "datetime": moment.unix(dataHarianSensor[i].timestamp).format("YYYY-MM-DD"),
//   //       "pH": percentageConvert(dataHarianSensor[i].dataParam[0].value),
//   //       "cod": percentageConvert(dataHarianSensor[i].dataParam[1].value),
//   //       "tss": percentageConvert(dataHarianSensor[i].dataParam[2].value),
//   //       "nh3n": percentageConvert(dataHarianSensor[i].dataParam[3].value),
//   //       "debit": percentageConvert(dataHarianSensor[i].dataParam[4].value),
//   //       "status": "SPARING NORMAL"
//   //     }
//   //   )
//   // }

//   // // remove value same date
//   // function getUniqueListBy(datas, key) {
//   //   return [...new Map(datas.map(item => [item[key], item])).values()]
//   // }
//   // const newdatas = getUniqueListBy(datas, 'datetime');
//   // res.send(newdatas);

// })

// OLD
router.get("/data-harian", async (req, res) => {
  let { key, loggerID, start_date, end_date } = req.query;
  let datas = [];

  start_date = moment(start_date).unix();
  end_date = moment(end_date).unix();
  // return res.send({
  //   start: moment(start_date * 1000).format("DD MMM YYYY, HH:mm"),
  //   end: moment(end_date * 1000).format("DD MMM YYYY, HH:mm"),
  // });
  if (req.query.key !== "klasjhfiuUYBjBDLN341kj1jkkaj1aq")
    return res.status(400).send("Key Error!");
  // dataHarianDB
  const dataHarianSensor = await dataHarianDB.aggregate([
    {
      $match: {
        $and: [
          {
            loggerID: loggerID,
          },
          {
            timestamp: {
              $gte: start_date,
              $lte: end_date,
            },
          },
        ],
      },
    },
    {
      $sort: {
        timestamp: 1,
      },
    },
  ]);
  const logger = await loggerDB.findOne({
    _id: loggerID,
  });

  const conditionRep = await condRepDB.find({
    compID: logger.compID,
  });

  // const index = dataHarianSensor.indexOf(1);
  // dataHarianSensor.splice(1, 1);

  let st = moment(start_date * 1000);
  let en = moment(end_date * 1000);
  let dif = en.diff(st, "days");
  let a = 0;
  for (let i = 0; i < dif; i++) {
    let start = moment(dataHarianSensor[a].timestamp * 1000)
      .startOf("days")
      .unix();
    let end = moment(dataHarianSensor[a].timestamp * 1000)
      .endOf("days")
      .unix();
    let day = moment(start_date * 1000)
      .add(i, "days")
      .startOf("days")
      .unix();
    if (start == day) {
      let countHourly = await dataHourlySensorDB.aggregate([
        {
          $match: {
            $and: [
              {
                loggerID: loggerID,
              },
              {
                timestamp: {
                  $gte: start,
                  $lt: end,
                },
              },
            ],
          },
        },
        {
          $count: "count",
        },
      ]);
      datas.push({
        datetime: moment
          .unix(dataHarianSensor[a].timestamp)
          .format("YYYY-MM-DD"),
        pH: percentageConvert(dataHarianSensor[a].dataParam[0].value),
        cod: percentageConvert(dataHarianSensor[a].dataParam[1].value),
        tss: percentageConvert(dataHarianSensor[a].dataParam[2].value),
        nh3n: percentageConvert(dataHarianSensor[a].dataParam[3].value),
        debit: percentageConvert(dataHarianSensor[a].dataParam[4].value),
        evaluasi: countHourly[0].count < 20 ? "Tidak taat" : "-",
        status: "Tidak Ada Laporan Kondisi",
        pelaporan_kondisi: "-",
        lampiran_prosedur_penanganan: "-",
        lampiran_surat_penyampaian_kondisi: "-",
        lampiran_logbook_harian: "-",
      });
      a++;
    } else {
      datas.push({
        datetime: moment.unix(day).format("YYYY-MM-DD"),
        pH: 0,
        cod: 0,
        tss: 0,
        nh3n: 0,
        debit: 0,
        evaluasi: "Tidak taat",
        status: "Tidak Ada Laporan Kondisi",
        pelaporan_kondisi: "-",
        lampiran_prosedur_penanganan: "-",
        lampiran_surat_penyampaian_kondisi: "-",
        lampiran_logbook_harian: "-",
      });
    }
  }

  if (conditionRep.length > 0) {
    for (let i = 0; i < datas.length; i++) {
      for (let j = 0; j < conditionRep.length; j++) {
        if (conditionRep[j].kondisi) {
          if (
            datas[i].datetime ===
            moment.unix(conditionRep[j].tanggalKejadian).format("YYYY-MM-DD")
          ) {
            datas[i].status = conditionRep[j].kondisi;
            if (conditionRep[j].kondisi == "Kondisi Tidak Normal") {
              datas[i].pelaporan_kondisi = {
                status: conditionRep[j].kondisiTidakNormal.status,
                kondisiLain: conditionRep[j].kondisiLain.status,
              };
            } else if (conditionRep[j].kondisi == "Kondisi Darurat") {
              datas[i].pelaporan_kondisi = conditionRep[j].kondisiDarurat;
            } else if (
              conditionRep[j].kondisi == "Kondisi Tidak Ada Aliran Air Limbah"
            ) {
              if (conditionRep[j].fileSuratLogbookPath) {
                datas[i].pelaporan_kondisi = {
                  lampiran_logbook: conditionRep[j].fileSuratLogbookPath,
                };
              }
            }
            // add file
            datas[i].lampiran_prosedur_penanganan =
              process.env.API_BACKEND + conditionRep[j].fileLampiranPath;
            datas[i].lampiran_surat_penyampaian_kondisi =
              process.env.API_BACKEND + conditionRep[j].fileSuratPath;
            if (conditionRep[j].fileSuratLogbookPath) {
              datas[i].lampiran_logbook_harian =
                process.env.API_BACKEND + conditionRep[j].fileSuratLogbookPath;
            }
          }
        }
      }
    }
    // console.log(datas);
    // return;
  }

  // for (let i = 0; i < conditionRep.length; i++) {
  //   for (let z = 0; z < datas.length; z++) {
  //     if (datas[z].datetime === moment.unix(conditionRep[i].tanggalKejadian).format("YYYY-MM-DD")) {
  //       datas[z].status = conditionRep[i].kondisi
  //     }
  //   }
  // }

  // for (let i = 0; i < dataHarianSensor.length; i++) {
  //   datas.push(
  //     {
  //       "datetime": moment.unix(dataHarianSensor[i].timestamp).format("YYYY-MM-DD"),
  //       "pH": percentageConvert(dataHarianSensor[i].dataParam[0].value),
  //       "cod": percentageConvert(dataHarianSensor[i].dataParam[1].value),
  //       "tss": percentageConvert(dataHarianSensor[i].dataParam[2].value),
  //       "nh3n": percentageConvert(dataHarianSensor[i].dataParam[3].value),
  //       "debit": percentageConvert(dataHarianSensor[i].dataParam[4].value),
  //       "status": "SPARING NORMAL"
  //     }
  //   )
  // }

  // remove value same date
  function getUniqueListBy(datas, key) {
    return [...new Map(datas.map((item) => [item[key], item])).values()];
  }
  const newdatas = getUniqueListBy(datas, "datetime");
  res.send(newdatas);
});

// API 3 BULANAN
// router.get("/data-bulanan", async (req, res) => {
// let {
//   key,
//   loggerID,
//   start_month,
//   end_month
// } = req.query;
// let datas = [];
// start_month = moment(start_month, 'Y-M').startOf('month').unix()
// end_month = moment(end_month, 'Y-M').endOf('month').unix()

// if (req.query.key !== "klasjhfiuUYBjBDLN341kj1jkkaj1aq")
//   return res.status(400).send("Key Error!");
// // dataMonthDB
// const dataMonthSensor = await dataMonthSensorDB.aggregate([{
//     $match: {
//       $and: [{
//           loggerID: loggerID
//         },
//         {
//           timestamp: {
//             $gte: start_month,
//             $lte: end_month,
//           },
//         },
//       ],
//     },
//   },
//   {
//     $sort: {
//       "timestamp": 1
//     }
//   }

// ])

// const logger = await loggerDB.findOne({
//   "_id": loggerID
// });

// const conditionRep = await condRepDB.find({
//   'compID': logger.compID
// })

// for (let i = 0; i < dataMonthSensor.length; i++) {
//   datas.push({
//     "datetime": moment.unix(dataMonthSensor[i].timestamp).format("YYYY-MM"),
//     "pH": percentageConvert(dataMonthSensor[i].dataParam[0].value),
//     "cod": percentageConvert(dataMonthSensor[i].dataParam[1].value),
//     "tss": percentageConvert(dataMonthSensor[i].dataParam[2].value),
//     "nh3n": percentageConvert(dataMonthSensor[i].dataParam[3].value),
//     "debit": percentageConvert(dataMonthSensor[i].dataParam[4].value),

//   })
// }

// // remove value same date
// function getUniqueListBy(datas, key) {
//   return [...new Map(datas.map(item => [item[key], item])).values()]
// }
// const newdatas = getUniqueListBy(datas, 'datetime');
// res.send(newdatas);
// })

router.get("/data-bulanan", async (req, res) => {
  let { key, loggerID, start_month, end_month } = req.query;

  let datas = [];

  start_month1 = moment(start_month, "Y-M").startOf("month");
  end_month1 = moment(end_month, "Y-M").startOf("month");
  if (!moment(end_month1).isSameOrAfter(start_month1, "month"))
    res.status(400).send("Pastikan Start dan End Month");

  start_month = moment(start_month, "Y-M").startOf("month");
  end_month = moment(end_month, "Y-M").subtract(1, "months").endOf("month");

  const logger = await loggerDB.findOne({
    _id: loggerID,
  });

  if (req.query.key !== "klasjhfiuUYBjBDLN341kj1jkkaj1aq")
    return res.status(400).send("Key Error!");

  if (!logger)
    res.status(400).send("perusahaan belum terdaftar sparing dibulan ini");

  let newdataParam = [];

  for (
    var m = moment(start_month);
    m.diff(end_month, "month") <= 0;
    m.add(1, "month")
  ) {
    const time_now = m.format("MM-YYYY");
    // dataMonthDB
    const dataMonthSensor = await dataHarianDB.aggregate([
      {
        $match: {
          $and: [
            {
              loggerID: loggerID,
            },
            {
              timestamp: {
                $gte: moment(time_now, "MM-YYYY").startOf("month").unix(),
                $lte: moment(time_now, "MM-YYYY").endOf("month").unix(),
              },
            },
          ],
        },
      },
      {
        $sort: {
          timestamp: 1,
        },
      },
    ]);

    let totalPh = 0;
    let totalcod = 0;
    let totaltss = 0;
    let totalnh3n = 0;
    let totaldebit = 0;
    let datetime = 0;

    for (let j = 0; j < dataMonthSensor.length; j++) {
      totalPh += dataMonthSensor[j].dataParam[0].value;
      totalcod += dataMonthSensor[j].dataParam[1].value;
      totaltss += dataMonthSensor[j].dataParam[2].value;
      totalnh3n += dataMonthSensor[j].dataParam[3].value;
      totaldebit += dataMonthSensor[j].dataParam[4].value;
      // datetime = moment.unix(dataMonthSensor[j].timestamp).format("YYYY-MM")
    }

    let avgPh = totalPh / dataMonthSensor.length;
    let avgcod = totalcod / dataMonthSensor.length;
    let avgtss = totaltss / dataMonthSensor.length;
    let avgnh3n = totalnh3n / dataMonthSensor.length;
    let avgdebit = totaldebit;

    if (dataMonthSensor.length > 0) {
      newdataParam.push({
        datetime: moment(time_now, "MM-YYYY").endOf("month").format("YYYY-MM"),
        pH: avgPh,
        COD: avgcod,
        TSS: avgtss,
        NH3N: avgnh3n,
        Debit: avgdebit,
      });
    }

    for (let i = 0; i < newdataParam.length; i++) {
      // INI PH
      if (logger.logDataRange[0].name == "pH") {
        if (logger.logDataRange[0].max == null) {
          newdataParam[i].pH = null;
        }
      }
      // INI COD
      if (logger.logDataRange[1].name == "COD") {
        if (logger.logDataRange[1].max == null) {
          newdataParam[i].COD = null;
        }
      }
      // INI TSS
      if (logger.logDataRange[2].name == "TSS") {
        if (logger.logDataRange[2].max == null) {
          newdataParam[i].TSS = null;
        }
      }
      // INI NH3N
      if (logger.logDataRange[3].name == "NH3N") {
        if (logger.logDataRange[3].max == null) {
          newdataParam[i].NH3N = null;
        }
      }
      // INI Debit
      if (logger.logDataRange[4].name == "Debit") {
        if (logger.logDataRange[4].max == null) {
          newdataParam[i].Debit = null;
        }
      }
    }
  }
  res.send(newdataParam);
});

router.get("/data-bulanan-dev", async (req, res) => {
  let { key, loggerID, start_month, end_month } = req.query;

  let datas = [];

  start_month1 = moment(start_month, "Y-M").startOf("month");
  end_month1 = moment(end_month, "Y-M").startOf("month");
  if (!moment(end_month1).isSameOrAfter(start_month1, "month"))
    res.status(400).send("Pastikan Start dan End Month");

  start_month = moment(start_month, "Y-M").startOf("month");
  end_month = moment(end_month, "Y-M").subtract(1, "months").endOf("month");

  const logger = await loggerDB.findOne({
    _id: loggerID,
  });

  if (req.query.key !== "klasjhfiuUYBjBDLN341kj1jkkaj1aq")
    return res.status(400).send("Key Error!");

  if (!logger)
    res.status(400).send("perusahaan belum terdaftar sparing dibulan ini");

  let newdataParam = [];

  const dataFirstSend = await dataSensorDB.aggregate([
    {
      $match: {
        $and: [
          {
            loggerID: loggerID,
          },
        ],
      },
    },
    { $limit: 1 },
    {
      $sort: {
        timestamp: 1,
      },
    },
  ]);
  let first_send;
  if (dataFirstSend.length > 0) {
    for (let i = 0; i < dataFirstSend.length; i++) {
      first_send = moment.unix(dataFirstSend[i].timestamp).format("YYYY-MM-DD");
    }
  } else {
    first_send = "Belum Melakukan Pengiriman";
  }
  for (
    var m = moment(start_month);
    m.diff(end_month, "month") <= 0;
    m.add(1, "month")
  ) {
    const time_now = m.format("MM-YYYY");
    // dataMonthDB
    const dataMonthSensor = await dataHarianDB.aggregate([
      {
        $match: {
          $and: [
            {
              loggerID: loggerID,
            },
            {
              timestamp: {
                $gte: moment(time_now, "MM-YYYY").startOf("month").unix(),
                $lte: moment(time_now, "MM-YYYY").endOf("month").unix(),
              },
            },
          ],
        },
      },
      {
        $sort: {
          timestamp: 1,
        },
      },
    ]);

    let totalPh = 0;
    let totalcod = 0;
    let totaltss = 0;
    let totalnh3n = 0;
    let totaldebit = 0;
    let datetime = 0;

    for (let j = 0; j < dataMonthSensor.length; j++) {
      totalPh += dataMonthSensor[j].dataParam[0].value;
      totalcod += dataMonthSensor[j].dataParam[1].value;
      totaltss += dataMonthSensor[j].dataParam[2].value;
      totalnh3n += dataMonthSensor[j].dataParam[3].value;
      totaldebit += dataMonthSensor[j].dataParam[4].value;
      // datetime = moment.unix(dataMonthSensor[j].timestamp).format("YYYY-MM")
    }

    let avgPh = totalPh / dataMonthSensor.length;
    let avgcod = totalcod / dataMonthSensor.length;
    let avgtss = totaltss / dataMonthSensor.length;
    let avgnh3n = totalnh3n / dataMonthSensor.length;
    let avgdebit = totaldebit;

    if (dataMonthSensor.length > 0) {
      newdataParam.push({
        datetime: moment(time_now, "MM-YYYY").endOf("month").format("YYYY-MM"),
        pH: avgPh,
        COD: avgcod,
        TSS: avgtss,
        NH3N: avgnh3n,
        Debit: avgdebit,
      });
    }

    for (let i = 0; i < newdataParam.length; i++) {
      // INI PH
      if (logger.logDataRange[0].name == "pH") {
        if (logger.logDataRange[0].max == null) {
          newdataParam[i].pH = null;
        }
      }
      // INI COD
      if (logger.logDataRange[1].name == "COD") {
        if (logger.logDataRange[1].max == null) {
          newdataParam[i].COD = null;
        }
      }
      // INI TSS
      if (logger.logDataRange[2].name == "TSS") {
        if (logger.logDataRange[2].max == null) {
          newdataParam[i].TSS = null;
        }
      }
      // INI NH3N
      if (logger.logDataRange[3].name == "NH3N") {
        if (logger.logDataRange[3].max == null) {
          newdataParam[i].NH3N = null;
        }
      }
      // INI Debit
      if (logger.logDataRange[4].name == "Debit") {
        if (logger.logDataRange[4].max == null) {
          newdataParam[i].Debit = null;
        }
      }
    }
  }
  res.send({ data_awal: first_send, data: newdataParam });
});

router.get("/get-bulanan", async (req, res) => {
  let { key, loggerID, periode, tahun } = req.query;
  let datas = [];

  mergedate = tahun + "-" + periode;

  start_date = moment(mergedate, "YYYY-MM").startOf("month").unix();
  end_date = moment(mergedate, "YYYY-MM").endOf("month").unix();

  let posted = await get_bulanan(loggerID, start_date, end_date);

  res.send(posted);
});
router.get("/post-bulanan", async (req, res) => {
  let loggersID = req.body.loggerID;
  let periode = req.body.periode;

  let start_time = moment(periode, "MM").startOf("month").unix();
  let end_time = moment(periode, "MM").endOf("month").unix();

  let data = [];
  let tempdata = [];
  let logger = await loggerDB.find({
    _id: loggersID,
    activationStatus: true,
  });

  for (let i = 0; i < logger.length; i++) {
    // let posted = await post_bulanan("",start_time, end_time);
    let posted = await post_bulanan(logger[i]._id, start_time, end_time);
    if (posted) {
      // POST SIMPLE REQUEST>
      data.push(posted);
    }
  }

  // PERSIAPAN UNTUK KIRIM KE SIMPLE
  for (let i = 0; i < data.length; i++) {
    var options = {
      method: "POST",
      uri: process.env.API_SIMPLE + "/rest/v1/data_bulanan",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        key: process.env.API_SIMPLE_KEY,
      },
      form: data[i],
    };
    let dd = await request(options)
      .then(async function (response) {
        tempdata.push({
          loggerID: data[i].loggerid,
          status: true,
          message: "Data berhasil dikirim",
        });
        let task_data_deleted = await taskCronDB
          .find({
            loggerID: data[i].loggerid,
            start_time: start_time,
            end_time: end_time,
            status: false,
            type_task: "CRONJOB MONTHLY SIMPLE",
          })
          .remove();

        const task = new taskCronDB({
          loggerID: data[i].loggerid,
          type_task: "CRONJOB MONTHLY SIMPLE",
          start_time: start_time,
          end_time: end_time,
          created_at: moment().unix(),
          status: true,
          message: response,
        });

        let createTask = await task.save();
        // res.send(response)
      })
      .catch(async function (err) {
        let message = err.response.body;
        tempdata.push({
          loggerID: data[i].loggerid,
          status: false,
          message: message,
        });

        let task_data_deleted = await taskCronDB
          .find({
            loggerID: data[i].loggerid,
            start_time: start_time,
            end_time: end_time,
            status: false,
            type_task: "CRONJOB MONTHLY SIMPLE",
          })
          .remove();

        const task = new taskCronDB({
          loggerID: data[i].loggerid,
          type_task: "CRONJOB MONTHLY SIMPLE",
          start_time: start_time,
          end_time: end_time,
          created_at: moment().unix(),
          status: false,
          message: message,
        });

        let createTask = await task.save();
        // res.send(err.response.body)
      });
    // END POST KESIMPLE
  }
  console.log(tempdata);
  res.send(tempdata);
  // console.log(post_bulanan('asdasd'));
});

// RESEND DATA POST BULANAN A MONTH AGO
router.get("/test", async (req, res) => {
  var start_time = moment().subtract(2, "month").startOf("month").unix();
  var end_time = moment().subtract(2, "month").endOf("month").unix();
  let data = [];
  let tempdata = [];

  let task_data = await taskCronDB.find(
    {
      start_time: start_time,
      end_time: end_time,
      status: false,
      type_task: "CRONJOB MONTHLY SIMPLE",
    },
    {
      loggerID: 1,
      start_time: 2,
      end_time: 3,
    }
  );

  if (task_data.length > 0) {
    for (let i = 0; i < task_data.length; i++) {
      let posted = await post_bulanan(
        task_data[i].loggerID,
        start_time,
        end_time,
        (type = "resend")
      );
      if (posted) {
        // POST SIMPLE REQUEST>
        data.push(posted);
      }
    }
    // PERSIAPAN UNTUK KIRIM KE SIMPLE
    for (let i = 0; i < data.length; i++) {
      var options = {
        method: "POST",
        uri: process.env.API_SIMPLE + "/rest/v1/data_bulanan",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          key: process.env.API_SIMPLE_KEY,
        },
        form: data[i],
      };
      let dd = await request(options)
        .then(async function (response) {
          tempdata.push({
            loggerID: data[i].loggerid,
            status: true,
          });

          let task_data_deleted = await taskCronDB
            .find({
              loggerID: data[i].loggerid,
              start_time: start_time,
              end_time: end_time,
              status: false,
              type_task: "CRONJOB MONTHLY SIMPLE",
            })
            .remove();

          const task = new taskCronDB({
            loggerID: data[i].loggerid,
            type_task: "CRONJOB MONTHLY SIMPLE",
            start_time: start_time,
            end_time: end_time,
            created_at: moment().unix(),
            status: true,
            message: response,
          });

          let createTask = await task.save();
          // res.send(response)
        })
        .catch(async function (err) {
          let message = err.response.body;
          tempdata.push({
            loggerID: data[i].loggerid,
            status: false,
          });

          let task_data_deleted = await taskCronDB
            .find({
              loggerID: data[i].loggerid,
              start_time: start_time,
              end_time: end_time,
              status: false,
              type_task: "CRONJOB MONTHLY SIMPLE",
            })
            .remove();

          const task = new taskCronDB({
            _id: data[i]._id,
            loggerID: data[i].loggerid,
            type_task: "CRONJOB MONTHLY SIMPLE",
            start_time: start_time,
            end_time: end_time,
            created_at: moment().unix(),
            status: false,
            message: message,
          });

          let createTask = await task.save();
          // res.send(err.response.body)
        });
      // END POST KESIMPLE
    }
    res.send(data);
  }
});

// RETYA AND HENRY

// GET DATA 1 JAM DALAM 1 HARI ALL LOGGER DENGAN REQUEST TANGGAL YYYY-MM-DD
router.get("/simple-daydata", async (req, res) => {
  let datee = req.query.date;
  let now = moment(datee, "YYYY-MM-DD").startOf("days").unix();
  let startTs = now;
  let endTs = moment.unix(now).endOf("days").unix();

  let rs = await dataSensorDB.aggregate([
    // CHANGE ME!!
    //
    {
      $match: {
        // loggerID:"5fa4be1c111e6c2310b18230",
        timestamp: {
          $gte: startTs - 3600,
          $lte: endTs - 3600,
        },
      },
    },
    // extract data-sensors
    //
    {
      $project: {
        loggerID: 1,
        timestamp: 1,
        var0: { $arrayElemAt: ["$dataParam", 0] },
        var1: { $arrayElemAt: ["$dataParam", 1] },
        var2: { $arrayElemAt: ["$dataParam", 2] },
        var3: { $arrayElemAt: ["$dataParam", 3] },
        var4: { $arrayElemAt: ["$dataParam", 4] },
      },
    },
    {
      $addFields: {
        ph: "$var0.value",
        cod: "$var1.value",
        tss: "$var2.value",
        nh3n: "$var3.value",
        debit: "$var4.value",
      },
    },
    { $unset: ["var0", "var1", "var2", "var3", "var4"] },
    {
      $group: {
        _id: {
          loggerID: "$loggerID",
          timestamp: {
            $toDate: {
              $multiply: [
                1000, // timestamp was in second
                {
                  $subtract: [
                    { $toLong: "$timestamp" },
                    {
                      $mod: [
                        { $toLong: "$timestamp" },
                        3600, // 120 every 2 minutes interval, 3600 for hourly, 86400 for daily
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
        avgph: { $avg: "$ph" },
        avgcod: { $avg: "$cod" },
        avgtss: { $avg: "$tss" },
        avgnh3n: { $avg: "$nh3n" },
        avgdebit: { $sum: { $multiply: ["$debit", 2.0] } },
      },
    },

    // get logger record
    // unknown loggerID will be excluded
    //
    { $addFields: { loggerIdObj: { $toObjectId: "$_id.loggerID" } } },
    {
      $lookup: {
        from: "loggers",
        localField: "loggerIdObj",
        foreignField: "_id",
        as: "logger",
      },
    },
    { $unwind: "$logger" },
    {
      $project: {
        avgph: 1,
        avgcod: 1,
        avgtss: 1,
        avgnh3n: 1,
        avgdebit: 1,
        compID: "$logger.compID",
        var0: { $arrayElemAt: ["$logger.logDataRange", 0] },
        var1: { $arrayElemAt: ["$logger.logDataRange", 1] },
        var2: { $arrayElemAt: ["$logger.logDataRange", 2] },
        var3: { $arrayElemAt: ["$logger.logDataRange", 3] },
        var4: { $arrayElemAt: ["$logger.logDataRange", 4] },
      },
    },
    {
      $addFields: {
        loggerId: "$_id.loggerID",
        compID: "$compID",
        timestamp: { $divide: [{ $toLong: "$_id.timestamp" }, 1000] },
      },
    },

    // // COMPANY GET
    // { $addFields: { companiesIdObj: { $toObjectId: "$compID" }}},
    //   { $lookup: {
    //       from: 'companies',
    //       localField: 'companiesIdObj',
    //       foreignField: '_id',
    //       as: 'companies',
    //   }},
    //   { $unwind: '$companies'},
    //   { $project: {
    //       compName: "$companies.compName",
    //       avgph: 1, avgcod: 1, avgtss: 1, avgnh3n: 1, avgdebit: 1,
    //       compID: "$logger.compID",
    //       var0: { $arrayElemAt: ['$logger.logDataRange', 0 ] },
    //       var1: { $arrayElemAt: ['$logger.logDataRange', 1 ] },
    //       var2: { $arrayElemAt: ['$logger.logDataRange', 2 ] },
    //       var3: { $arrayElemAt: ['$logger.logDataRange', 3 ] },
    //       var4: { $arrayElemAt: ['$logger.logDataRange', 4 ] },
    //   }},
    //   { $addFields: {
    //     loggerId: '$_id.loggerID',
    //     timestamp: { $divide:[{ $toLong:'$_id.timestamp' }, 1000] },
    //   }},
    // Condition reports
    // { $addFields: { condIdObj: "$compID"}},
    //   { $lookup: {
    //       from: 'condreports',
    //       localField: 'condIdObj',
    //       foreignField: 'compID',
    //       as: 'condreports',
    //   }},
    //   { $unwind: '$condreports'},
    //   {
    //     $match:{
    //       compID:"5fa4be1c111e6c2310b1822e"
    //     }
    //   },

    // { $project: {
    //     avgph: 1, avgcod: 1, avgtss: 1, avgnh3n: 1, avgdebit: 1,
    //     var0: { $arrayElemAt: ['$logger.logDataRange', 0 ] },
    //     var1: { $arrayElemAt: ['$logger.logDataRange', 1 ] },
    //     var2: { $arrayElemAt: ['$logger.logDataRange', 2 ] },
    //     var3: { $arrayElemAt: ['$logger.logDataRange', 3 ] },
    //     var4: { $arrayElemAt: ['$logger.logDataRange', 4 ] },
    // }},
    // { $addFields: {
    //   loggerId: '$_id.loggerID',
    //   timestamp: { $divide:[{ $toLong:'$_id.timestamp' }, 1000] },
    // }},

    // { $unset: ['var0', 'var1', 'var2', 'var3', 'var4' ]},

    // UNTUK BUAT FIEELD NULL JIKA TIDAK DIPAKAI PARAMTER

    {
      $addFields: {
        timestamp1: {
          $dateToString: {
            format: "%Y-%m-%d %H:%m",
            timezone: "Asia/Jakarta",
            date: {
              $add: [new Date(0), { $multiply: [1000, "$timestamp"] }],
            },
          },
        },
        pH: {
          $cond: {
            if: { $eq: ["$var0.max", null] },
            then: null,
            else: "$avgph",
          },
        },
        COD: {
          $cond: {
            if: { $eq: ["$var1.max", null] },
            then: null,
            else: "$avgcod",
          },
        },
        TSS: {
          $cond: {
            if: { $eq: ["$var2.max", null] },
            then: null,
            else: "$avgtss",
          },
        },
        NH3N: {
          $cond: {
            if: { $eq: ["$var3.max", null] },
            then: null,
            else: "$avgnh3n",
          },
        },
        Debit: {
          $cond: {
            if: { $eq: ["$var4.max", null] },
            then: null,
            else: "$avgdebit",
          },
        },
      },
    },
    // cleanup if needed
    {
      $unset: [
        "_id",
        "var0",
        "var1",
        "var2",
        "var3",
        "var4",
        "minph",
        "maxph",
        "mincod",
        "maxcod",
        "mintss",
        "maxtss",
        "minnh3n",
        "maxnh3n",
        "mindebit",
        "maxdebit",
        "avgph",
        "avgcod",
        "avgtss",
        "avgnh3n",
        "avgdebit",
      ],
    },
    { $sort: { timestamp: 1 } },
  ]);
  // for(let i=0; i<rs.length; i++){
  //   console.log(moment.unix(rs[i].timestamp).add(1,'hours').format("YYYY-MM-DD HH:mm"));
  // }
  res.send(rs);
});

router.get("/getCondition-report", async (req, res) => {
  let date = req.body.date;
  let compID = req.body.compID;
  let data = await condRepDB.find(
    {
      compID: compID,
      tanggalKejadian: {
        $gte: moment(date, "YYYY-MM-DD").startOf("day").unix(),
        $lte: moment(date, "YYYY-MM-DD").endOf("day").unix(),
      },
    },
    { _id: 0 }
  );
  let datas = [];
  if (data.length > 0) {
    // datas = data[0]
    for (let i = 0; i < data.length; i++) {
      if (
        data[i].kondisi == "Kondisi Tidak Normal" &&
        data[i].kondisiLain.status
      ) {
        datas.push({
          kondisi: data[i].kondisi,
          pelaporan_kondisi: data[i].kondisiLain,
          fileLampiranPath: data[i].fileLampiranPath,
          fileSuratPath: data[i].fileSuratPath,
          fileSuratLogbookPath: data[i].fileSuratLogbookPath,
        });
      } else if (
        data[i].kondisi == "Kondisi Tidak Normal" &&
        !data[i].kondisiLain.status
      ) {
        datas.push({
          kondisi: data[i].kondisi,
          pelaporan_kondisi: data[i].kondisiTidakNormal,
          fileLampiranPath: data[i].fileLampiranPath,
          fileSuratPath: data[i].fileSuratPath,
          fileSuratLogbookPath: data[i].fileSuratLogbookPath,
        });
      } else if (data[i].kondisi == "Kondisi Darurat") {
        datas.push({
          kondisi: data[i].kondisi,
          pelaporan_kondisi: data[i].kondisiDarurat,
          fileLampiranPath: data[i].fileLampiranPath,
          fileSuratPath: data[i].fileSuratPath,
          fileSuratLogbookPath: data[i].fileSuratLogbookPath,
        });
      } else if (data[i].kondisi == "Kondisi Tidak Ada Aliran Air Limbah") {
        datas.push({
          kondisi: data[i].kondisi,
          pelaporan_kondisi: data[i].kondisiTidakAdaAliranLimbah,
          fileLampiranPath: data[i].fileLampiranPath,
          fileSuratPath: data[i].fileSuratPath,
          fileSuratLogbookPath: data[i].fileSuratLogbookPath,
        });
      } else {
        datas.push({
          kondisi: "Tidak Ada Pelaporan Kondisi",
          pelaporan_kondisi: {
            status: "-",
            penghentianSementara: "-",
            kalibrasiPeralatan: "-",
            kondisiLain: "-",
          },
          fileLampiranPath: "-",
          fileSuratPath: "-",
          fileSuratLogbookPath: "-",
        });
      }
    }
  } else {
    datas.push({
      kondisi: "Tidak Ada Pelaporan Kondisi",
      pelaporan_kondisi: {
        status: "-",
        penghentianSementara: "-",
        kalibrasiPeralatan: "-",
        kondisiLain: "-",
      },
      fileLampiranPath: "-",
      fileSuratPath: "-",
      fileSuratLogbookPath: "-",
    });
  }
  res.send({ data: datas, response: 200, message: "Data ditemukan" });
});

// GET DATA 1 BULAN DALAM 1 HARI ALL LOGGER DENGAN REQUEST TANGGAL YYYY-MM-DD
router.get("/simple-monthdata", async (req, res) => {
  let datee = req.query.date;
  let now = moment(datee, "YYYY-MM-DD").startOf("month").unix();
  let startTs = now;
  let endTs = moment.unix(now).endOf("month").unix();

  let rs = await dataHarianDB.aggregate([
    // CHANGE ME!!
    //
    {
      $match: {
        // loggerID:"5fa4be1c111e6c2310b18230",
        timestamp: {
          $gte: startTs,
          $lte: endTs,
        },
      },
    },
    // extract data-sensors
    //
    {
      $project: {
        loggerID: 1,
        timestamp: 1,
        var0: { $arrayElemAt: ["$dataParam", 0] },
        var1: { $arrayElemAt: ["$dataParam", 1] },
        var2: { $arrayElemAt: ["$dataParam", 2] },
        var3: { $arrayElemAt: ["$dataParam", 3] },
        var4: { $arrayElemAt: ["$dataParam", 4] },
      },
    },
    {
      $addFields: {
        ph: "$var0.value",
        cod: "$var1.value",
        tss: "$var2.value",
        nh3n: "$var3.value",
        debit: "$var4.value",
      },
    },
    { $unset: ["var0", "var1", "var2", "var3", "var4"] },
    {
      $group: {
        _id: {
          loggerID: "$loggerID",
          timestamp: {
            $toDate: {
              $multiply: [
                1000, // timestamp was in second
                {
                  $subtract: [
                    { $toLong: "$timestamp" },
                    {
                      $mod: [
                        { $toLong: "$timestamp" },
                        86400, // 120 every 2 minutes interval, 3600 for hourly, 86400 for daily
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
        avgph: { $avg: "$ph" },
        avgcod: { $avg: "$cod" },
        avgtss: { $avg: "$tss" },
        avgnh3n: { $avg: "$nh3n" },
        avgdebit: { $sum: "$debit" },
      },
    },

    // get logger record
    // unknown loggerID will be excluded
    //
    { $addFields: { loggerIdObj: { $toObjectId: "$_id.loggerID" } } },
    {
      $lookup: {
        from: "loggers",
        localField: "loggerIdObj",
        foreignField: "_id",
        as: "logger",
      },
    },
    { $unwind: "$logger" },
    {
      $project: {
        avgph: 1,
        avgcod: 1,
        avgtss: 1,
        avgnh3n: 1,
        avgdebit: 1,
        compID: "$logger.compID",
        var0: { $arrayElemAt: ["$logger.logDataRange", 0] },
        var1: { $arrayElemAt: ["$logger.logDataRange", 1] },
        var2: { $arrayElemAt: ["$logger.logDataRange", 2] },
        var3: { $arrayElemAt: ["$logger.logDataRange", 3] },
        var4: { $arrayElemAt: ["$logger.logDataRange", 4] },
      },
    },
    {
      $addFields: {
        loggerId: "$_id.loggerID",
        compID: "$compID",
        timestamp: { $divide: [{ $toLong: "$_id.timestamp" }, 1000] },
      },
    },

    // UNTUK BUAT FIEELD NULL JIKA TIDAK DIPAKAI PARAMTER

    {
      $addFields: {
        timestamp1: {
          $dateToString: {
            format: "%Y-%m-%d %H:%m",
            timezone: "Asia/Jakarta",
            date: {
              $add: [new Date(0), { $multiply: [1000, "$timestamp"] }],
            },
          },
        },
        pH: {
          $cond: {
            if: { $eq: ["$var0.max", null] },
            then: null,
            else: "$avgph",
          },
        },
        COD: {
          $cond: {
            if: { $eq: ["$var1.max", null] },
            then: null,
            else: "$avgcod",
          },
        },
        TSS: {
          $cond: {
            if: { $eq: ["$var2.max", null] },
            then: null,
            else: "$avgtss",
          },
        },
        NH3N: {
          $cond: {
            if: { $eq: ["$var3.max", null] },
            then: null,
            else: "$avgnh3n",
          },
        },
        Debit: {
          $cond: {
            if: { $eq: ["$var4.max", null] },
            then: null,
            else: "$avgdebit",
          },
        },
      },
    },
    // cleanup if needed
    {
      $unset: [
        "_id",
        "var0",
        "var1",
        "var2",
        "var3",
        "var4",
        "minph",
        "maxph",
        "mincod",
        "maxcod",
        "mintss",
        "maxtss",
        "minnh3n",
        "maxnh3n",
        "mindebit",
        "maxdebit",
        "avgph",
        "avgcod",
        "avgtss",
        "avgnh3n",
        "avgdebit",
      ],
    },
    { $sort: { timestamp: 1 } },
  ]);
  // for(let i=0; i<rs.length; i++){
  //   console.log(moment.unix(rs[i].timestamp).add(1,'hours').format("YYYY-MM-DD HH:mm"));
  // }
  res.send(rs);
});

module.exports = router;
