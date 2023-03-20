var express = require("express");
var router = express.Router();
const loggerDB = require("../model/Logger");
const dataSensorDB = require("../model/dataSensor");
const userDB = require("../model/User");
const companyDB = require("../model/Company");
const formRegisCompDB = require("../model/formRegisComp");
const dataAdmin2min = require("../model/dataAdmin2min");
const dataKabkotProv2min = require("../model/dataKabkotProv2min");

/* GET home page. */
router.get("/data/:id", async function (req, res, next) {
  const user = await userDB.findOne({ _id: req.params.id });

  let dataSend, data;
  let dataParam = {
    pH: ["", ""],
    cod: ["", ""],
    tss: ["", ""],
    nh3n: ["", ""],
    debit: ["", "", ""],
  };

  if (req.query.filter) {
    switch (req.query.type) {
      case "admin":
        data = await dataSensorDB.findOne();
        dataSend = await dataSensorDB
          .find({ loggerID: data.loggerID })
          .sort({ timestamp: -1 })
          .limit(40);
        break;
      case "prov":
        data = await loggerDB.findOne({ provID: req.query.filter });
        if (data) {
          dataSend = await dataSensorDB
            .find({ loggerID: data._id })
            .sort({ timestamp: -1 })
            .limit(40);
        } else {
          dataSend = [];
        }
        break;
      case "kabkot":
        data = await loggerDB.findOne({ kabkotID: req.query.filter });
        if (data) {
          dataSend = await dataSensorDB
            .find({ loggerID: data._id })
            .sort({ timestamp: -1 })
            .limit(40);
        } else {
          dataSend = [];
        }
        break;
      case "comp":
        const logger = await loggerDB.findOne({ compID: req.query.filter });

        const company = await companyDB.findById(req.query.filter);

        const company_regis = await formRegisCompDB.findOne({
          "umum.compNameID": company.compName,
        });

        if (logger.logDataRange) {
          dataParam.pH[0] = logger.logDataRange[0].min;
          dataParam.pH[1] = logger.logDataRange[0].max;
          dataParam.cod[0] = logger.logDataRange[1].min;
          dataParam.cod[1] = logger.logDataRange[1].max;
          dataParam.tss[0] = logger.logDataRange[2].min;
          dataParam.tss[1] = logger.logDataRange[2].max;
          dataParam.nh3n[0] = logger.logDataRange[3].min;
          dataParam.nh3n[1] = logger.logDataRange[3].max;
          dataParam.debit[0] = logger.logDataRange[4].min;
          dataParam.debit[1] = logger.logDataRange[4].max;
          dataParam.debit[2] = company_regis.sensor.find(
            (val) => val.name == "Debit"
          )["satuanDebit"];
        }

        dataSend = await dataSensorDB
          .find({ loggerID: logger._id })
          .sort({ timestamp: -1 })
          .limit(40);

        // disini tambahan
        for (let i = 0; i < dataSend.length; i++) {
          for (let j = 0; j < dataSend[i].dataParam.length; j++) {
            if (
              logger.logDataRange[j].min == null &&
              logger.logDataRange[j].max == null
            ) {
              if (
                dataSend[i].dataParam[j].name == logger.logDataRange[j].name
              ) {
                dataSend[i].dataParam[j].value = 0;
              }
            }
          }
        }
        break;
      default:
        break;
    }
  } else {
    switch (user.userRole.role) {
      case "admin":
        data = await dataSensorDB.findOne();
        dataSend = await dataSensorDB
          .find({ loggerID: data.loggerID })
          .sort({ timestamp: -1 })
          .limit(40);
        break;
      case "prov":
        data = await loggerDB.findOne({ provID: req.query.filter });
        if (data) {
          dataSend = await dataSensorDB
            .find({ loggerID: data._id })
            .sort({ timestamp: -1 })
            .limit(40);
        } else {
          dataSend = [];
        }
        break;
      case "kabkot":
        data = await loggerDB.findOne({ kabkotID: req.query.filter });
        if (data) {
          dataSend = await dataSensorDB
            .find({ loggerID: data._id })
            .sort({ timestamp: -1 })
            .limit(40);
        } else {
          dataSend = [];
        }
        break;
      case "comp":
        const logger = await loggerDB.findOne({ compID: user.userRole.compID });
        dataSend = await dataSensorDB
          .find({ loggerID: logger._id })
          .sort({ timestamp: -1 })
          .limit(40);
        // disini tambahan
        for (let i = 0; i < dataSend.length; i++) {
          for (let j = 0; j < dataSend[i].dataParam.length; j++) {
            if (
              logger.logDataRange[j].min == null &&
              logger.logDataRange[j].max == null
            ) {
              if (
                dataSend[i].dataParam[j].name == logger.logDataRange[j].name
              ) {
                dataSend[i].dataParam[j].value = 0;
              }
            }
          }
        }

        dataParam.pH[0] = logger.logDataRange[0].min;
        dataParam.pH[1] = logger.logDataRange[0].max;
        dataParam.cod[0] = logger.logDataRange[1].min;
        dataParam.cod[1] = logger.logDataRange[1].max;
        dataParam.tss[0] = logger.logDataRange[2].min;
        dataParam.tss[1] = logger.logDataRange[2].max;
        dataParam.nh3n[0] = logger.logDataRange[3].min;
        dataParam.nh3n[1] = logger.logDataRange[3].max;
        dataParam.debit[0] = logger.logDataRange[4].min;
        dataParam.debit[1] = logger.logDataRange[4].max;

        break;
      default:
        break;
    }
  }
  dataSend = [...dataSend].reverse();
  res.send({ dataSend, dataParam });
});

module.exports = router;
