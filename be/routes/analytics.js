var express = require("express");
var router = express.Router();
const loggerDB = require("../model/Logger");
const dataHourlySensorDB = require("../model/dataHourlySensor");
const compDB = require("../model/Company");

router.get("/list", async (req, res) => {
  let query = {};
  console.log(req.query.type);
  if (req.query.type) {
    query["compType"] = req.query.type;
  }
  if (req.query.prov) {
    query["loggerDetails.provID"] = req.query.prov;
  }
  if (req.query.kabkot) {
    query["loggerDetails.kabkotID"] = req.query.kabkot;
  }
  try {
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
      {
        $unwind: "$loggerDetails",
      },
      { $match: query },
      { $project: { name: "$compName", value: "$_id", _id: 0 } },
    ]);
    res.send(comp);
  } catch (error) {
    res.status(400).send(error);
  }
});

/* GET home page. */
router.get("/data", async function (req, res, next) {
  const compA = await compDB.findOne({ _id: req.query.idfirst });
  const compB = await compDB.findOne({ _id: req.query.idsecond });
  const loggerA = await loggerDB.findOne({ compID: compA._id });
  const loggerB = await loggerDB.findOne({ compID: compB._id });
  const dataA = await dataHourlySensorDB
    .find({ loggerID: loggerA._id })
    .sort({ timestamp: -1 })
    .limit(40);
  const dataB = await dataHourlySensorDB
    .find({ loggerID: loggerB._id })
    .sort({ timestamp: -1 })
    .limit(40);

  res.send({ dataA, dataB });
});

module.exports = router;
