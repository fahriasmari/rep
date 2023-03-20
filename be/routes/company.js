var express = require("express");
var router = express.Router();
const compDB = require("../model/Company");
const userDB = require("../model/User");
const loggerDB = require("../model/Logger");
const dataSensorDB = require("../model/dataSensor");
let xl = require('excel4node');

/* GET home page. */
router.delete("/:id", async (req, res) => {
  const delComp = await compDB.deleteOne({ _id: req.params.id });
  const delUser = await userDB.deleteOne({ "userRole.compID": req.params.id });
  const logger = await loggerDB.findOne({ compID: req.params.id });
  const delSensor = await dataSensorDB.deleteMany({
    loggerID: String(logger._id),
  });
  const delLogger = await loggerDB.deleteOne({ compID: req.params.id });

  res.send({ delComp, delUser, delLogger, delSensor });
});

router.post("/", async function (req, res, next) {
  const comp = req.body;

  const compNew = new compDB(comp);

  try {
    const compSaved = await compNew.save();
    res.send(compSaved);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateComp = await compDB.updateOne({ _id: req.params.id }, req.body);
    res.send(updateComp);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/list", async (req, res) => {
  // let user = await userDB.findOne();
  // if (user.userRole.role !== "admin") return res.status(400).send("Error");
  const comp = await compDB.aggregate([
    { $addFields: { id: { $toString: "$_id" } } },
    {
      $lookup: {
        from: "loggers",
        localField: "id",
        foreignField: "compID",
        as: "loggerDetails",
      },
    },
    { $unwind: "$loggerDetails" },
    {
      $project: {
        id: 0,
      },
    },
    { $addFields: { id: { $toObjectId: "$loggerDetails.kabkotID" } } },
    {
      $lookup: {
        from: "kabkotdbs",
        localField: "id",
        foreignField: "_id",
        as: "kabkotDetails",
      },
    },
    { $unwind: "$kabkotDetails" },
    {
      $project: {
        id: 0,
      },
    },
    { $addFields: { id: { $toObjectId: "$loggerDetails.provID" } } },
    {
      $lookup: {
        from: "provdbs",
        localField: "id",
        foreignField: "_id",
        as: "provDetails",
      },
    },
    { $unwind: "$provDetails" },
    {
      $project: {
        loggerDetails: 0,
        id: 0,
      },
    },
  ]);
  res.send(comp);
});

router.get("/list-export", async (req, res) => {
  // let user = await userDB.findOne();
  // if (user.userRole.role !== "admin") return res.status(400).send("Error");
  const comp = await compDB.aggregate([{
      $addFields: {
        id: {
          $toString: "$_id"
        }
      }
    },
    {
      $lookup: {
        from: "loggers",
        localField: "id",
        foreignField: "compID",
        as: "loggerDetails",
      },
    },
    {
      $unwind: "$loggerDetails"
    },
    {
      $project: {
        id: 0,
      },
    },
    {
      $addFields: {
        id: {
          $toObjectId: "$loggerDetails.kabkotID"
        }
      }
    },
    {
      $lookup: {
        from: "kabkotdbs",
        localField: "id",
        foreignField: "_id",
        as: "kabkotDetails",
      },
    },
    {
      $unwind: "$kabkotDetails"
    },
    {
      $project: {
        id: 0,
      },
    },
    {
      $addFields: {
        id: {
          $toObjectId: "$loggerDetails.provID"
        }
      }
    },
    {
      $lookup: {
        from: "provdbs",
        localField: "id",
        foreignField: "_id",
        as: "provDetails",
      },
    },
    {
      $unwind: "$provDetails"
    },
    {
      $project: {
        loggerDetails: 0,
        id: 0,
      },
    },
  ]);

  var wb = new xl.Workbook();
  var ws = wb.addWorksheet('Industri');

  let col = 1;
  //Akun
  ws.cell(col, 1).string('Nama Industri');
  ws.cell(col, 2).string('Jenis Industri');
  ws.cell(col, 3).string('Kab/Kot');
  ws.cell(col, 4).string('Provinsi');
  ws.cell(col, 5).string('Alamat');
  ws.cell(col, 6).string('Phone');

  for (let i = 0; i < comp.length; i++) {
    col++
    ws.cell(col, 1).string(comp[i].compName);
    ws.cell(col, 2).string(comp[i].compType);
    ws.cell(col, 3).string(comp[i].kabkotDetails.kabkotName);
    ws.cell(col, 4).string(comp[i].provDetails.provName);
    ws.cell(col, 5).string(comp[i].compAddress);
    ws.cell(col, 6).string(comp[i].compTlp);
  }

  wb.write(`List Industri.xlsx`, res);
});

router.get("/listComp", async (req, res) => {
  const comp = await compDB.find()
  res.send(comp);
})

router.get("/listCompID", async (req, res) => {
  const prov = req.query.prov;
  const kabkot = req.query.kabkot;
  let getCompName

  const comp = await loggerDB.aggregate([

    {
      $match: {
        $and: [
          { provID: `${prov}` },
          { kabkotID: `${kabkot}` }
        ],
      },
    },
    {
      "$project": {
        "compID": "$compID",
      }
    },
    { $sort: { "timestamp": 1 } },
  ])

  let data = []
  // console.log(comp)

  if (comp.length > 0) {
    for (let i = 0; i < comp.length; i++) {
      getCompName = await compDB.findById(comp[i].compID)
      data.push({ compName: getCompName.compName, compID: getCompName._id })
    }
  }

  // const comp = await loggerDB.find({ "provID": prov, "kabkotID": kabkot })
  res.send(data);
})

module.exports = router;
