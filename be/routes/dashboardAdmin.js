var express = require("express");
var router = express.Router();
const formRegisDB = require("../model/formRegisComp");
const compDB = require("../model/Company");
const provDB = require("../model/Province");
const kabkotDB = require("../model/Kabkot");
const userDB = require("../model/User");
const loggerDB = require("../model/Logger");
const dataSensorDB = require("../model/dataSensor");

router.get("/list", async (req, res) => {
    const formList = await formRegisDB.find();
    for (let i = 0; i < formList.length; i++) {
      const prov = await provDB.findOne({
        _id: formList[i].umum.compProvince
      });
      const kabkot = await kabkotDB.findOne({
        _id: formList[i].umum.compCity
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
            compID: comp._id
          });
          formList[i].umum.loggerID = logger._id;
        }
        // console.log(formList[i].loggerInfo);
      }
      

      
     
    }
    const formListApprove = await formRegisDB.find({"validated":true});
    const formListProcess = await formRegisDB.find({"validated":false});
    res.status(200).send({list:formList,listApprove:formListApprove.length,listProcess:formListProcess.length});
});

module.exports = router;
