var express = require("express");
var router = express.Router();
var { percentageConvert } = require('../function/helper');
const formRegisDB = require("../model/formRegisComp");
const dataHarianDB = require("../model/dataDaySensor");
const dataHourlySensorDB = require("../model/dataHourlySensor");
const dataMonthSensorDB = require("../model/dataMonthSensor");
const covidFormDB = require("../model/Covid");
const compDB = require("../model/Company");
const loggerDB = require("../model/Logger");
const condRepDB = require("../model/condReport");
const provDB = require("../model/Province");
const kabkotDB = require("../model/Kabkot");
const moment = require("moment");

router.get("/list-pendaftaran", async (req, res) => {
  if (req.query.key !== "klasjhfiuUYBjBDLN341kj1jkkaj1aq")
    return res.status(400).send("Key Error!");
  const formList = await formRegisDB.find();
  for (let i = 0; i < formList.length; i++) {
    const prov = await provDB.findOne({ _id: formList[i].umum.compProvince });
    const kabkot = await kabkotDB.findOne({ _id: formList[i].umum.compCity });
    const timestamp = formList[i]._id.toString().substring(0, 8);
    formList[i].umum.createdAt = parseInt(timestamp, 16);
    formList[i].umum.compProvinceName = prov.provName;
    formList[i].umum.compCityName = kabkot.kabkotName;
    if (formList[i].validated === true) {
      const comp = await compDB.findOne({
        compName: formList[i].umum.compName,
      });

      if(comp){
        const logger = await loggerDB.findOne({ compID: comp._id });
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
    const prov = await provDB.findOne({ _id: pendaftaran.umum.compProvince });
    const kabkot = await kabkotDB.findOne({ _id: pendaftaran.umum.compCity });
    const timestamp = pendaftaran._id.toString().substring(0, 8);
    pendaftaran.umum.createdAt = parseInt(timestamp, 16);
    pendaftaran.umum.compProvinceName = prov.provName;
    pendaftaran.umum.compCityName = kabkot.kabkotName;

    if (pendaftaran.validated === true) {
      const comp = await compDB.findOne({
        compName: pendaftaran.umum.compName,
      });
      const logger = await loggerDB.findOne({ compID: comp._id });
      pendaftaran.umum.loggerID = logger._id;

      let sensorCount = 0;
      let dataBML = [];



      for (let i = 0; i < pendaftaran.sensor.length; i++) {
        // console.log(formList.sensor[i].active)
        if (pendaftaran.sensor[i].active == true) {

          dataBML.push({ name: pendaftaran.sensor[i].name, bml_min: pendaftaran.sensor[i].min, bml_max: pendaftaran.sensor[i].max, rangePengukuranMin: pendaftaran.sensor[i].minMeasure, rangePengukuranMax: pendaftaran.sensor[i].maxMeasure, brosurFile: pendaftaran.sensor[i].brosurFile.path })

          sensorCount++
        }
        else {
          dataBML.push({ name: pendaftaran.sensor[i].name, bml_min: null, bml_max: null, rangePengukuranMin: null, rangePengukuranMax: null, brosurFile: null })
        }

      }

      const covidForm = await covidFormDB.findOne({ 'detail.compName': new RegExp(pendaftaran.umum.compName, 'i') });
      // const covidForm = await covidFormDB.findOne({ 'detail.compName': pendaftaran.compName });
      if (covidForm == null) {
        covidTahap = "Tidak Ada Pelaporan Terkendala Pandemi Covid-19"
      }
      else {
        covidTahap = covidForm.detail.tahap
        id_pendaftaranCovid = covidForm._id
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
      }

    }
    else {
      return res.status(400).send("Perusahaan belum di validasi oleh team sparing. Silahkan hubungi tim sparing");
    }


  }
  // PENDAFTARAN COVID
  else {
    let id_perusahanCovid = null;
    let id_loggerCovid = null;
    let id_pendaftaranForm = null;
    pendaftaran = await covidFormDB.findById(id_pendaftaran);
    cek_comp_pendaftaranform = await formRegisDB.findOne({ "umum.compName": new RegExp(pendaftaran.detail.compName, 'i') });
    const compCovid = await compDB.findOne({
      compName: new RegExp(pendaftaran.detail.compName, 'i')
    });
    if (compCovid) {
      const loggerCovid = await loggerDB.findOne({ compID: compCovid._id });
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
      }
    }
    else {
      return res.status(400).send("Id Pendaftaran Dan Id Pelaporan Terkendala Pandemi Covid-19 Tidak Ditemukan");
    }
  }
  // end new
  }catch (error) {
    res.send("terjadi kesalahan mohon kontak admin")

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

  if (req.query.key !== "klasjhfiuUYBjBDLN341kj1jkkaj1aq")
    return res.status(400).send("Key Error!");
  // dataHarianDB
  const dataHarianSensor = await dataHarianDB.aggregate([
    {
      $match: {
        $and: [
          { loggerID: loggerID },
          {
            timestamp: {
              $gte: start_date,
              $lte: end_date,
            },
          },
        ],
      },
    },
    { $sort: { "timestamp": 1 } }

  ])
  const logger = await loggerDB.findOne({ "_id": loggerID });

  const conditionRep = await condRepDB.find({ 'compID': logger.compID })

  for (let i = 0; i < dataHarianSensor.length; i++) {
    datas.push(
      {
        "datetime": moment.unix(dataHarianSensor[i].timestamp).format("YYYY-MM-DD"),
        "pH": percentageConvert(dataHarianSensor[i].dataParam[0].value),
        "cod": percentageConvert(dataHarianSensor[i].dataParam[1].value),
        "tss": percentageConvert(dataHarianSensor[i].dataParam[2].value),
        "nh3n": percentageConvert(dataHarianSensor[i].dataParam[3].value),
        "debit": percentageConvert(dataHarianSensor[i].dataParam[4].value),
        "status": "Tidak Ada Laporan Kondisi"
      }
    )
  }

  if (conditionRep.length > 0) {

    for (let i = 0; i < datas.length; i++) {
      for (let j = 0; j < conditionRep.length; j++) {
        if (conditionRep[j].kondisi) {
          if (datas[i].datetime === moment.unix(conditionRep[j].tanggalKejadian).format("YYYY-MM-DD")) {
            datas[i].status = conditionRep[j].kondisi
          }
        }
      }
    }
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
    return [...new Map(datas.map(item => [item[key], item])).values()]
  }
  const newdatas = getUniqueListBy(datas, 'datetime');
  res.send(newdatas);

})

// API 3 BULANAN
router.get("/data-bulanan", async (req, res) => {
  let { key, loggerID, start_month, end_month } = req.query;
  let datas = [];
  start_month = moment(start_month, 'Y-M').startOf('month').unix()
  end_month = moment(end_month, 'Y-M').endOf('month').unix()

  if (req.query.key !== "klasjhfiuUYBjBDLN341kj1jkkaj1aq")
    return res.status(400).send("Key Error!");
  // dataMonthDB
  const dataMonthSensor = await dataMonthSensorDB.aggregate([
    {
      $match: {
        $and: [
          { loggerID: loggerID },
          {
            timestamp: {
              $gte: start_month,
              $lte: end_month,
            },
          },
        ],
      },
    },
    { $sort: { "timestamp": 1 } }

  ])

  const logger = await loggerDB.findOne({ "_id": loggerID });

  const conditionRep = await condRepDB.find({ 'compID': logger.compID })

  for (let i = 0; i < dataMonthSensor.length; i++) {
    datas.push(
      {
        "datetime": moment.unix(dataMonthSensor[i].timestamp).format("YYYY-MM"),
        "pH": percentageConvert(dataMonthSensor[i].dataParam[0].value),
        "cod": percentageConvert(dataMonthSensor[i].dataParam[1].value),
        "tss": percentageConvert(dataMonthSensor[i].dataParam[2].value),
        "nh3n": percentageConvert(dataMonthSensor[i].dataParam[3].value),
        "debit": percentageConvert(dataMonthSensor[i].dataParam[4].value),

      }
    )
  }

  // remove value same date
  function getUniqueListBy(datas, key) {
    return [...new Map(datas.map(item => [item[key], item])).values()]
  }
  const newdatas = getUniqueListBy(datas, 'datetime');
  res.send(newdatas);
})



module.exports = router;
