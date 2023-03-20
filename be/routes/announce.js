var express = require("express");
var router = express.Router();
var annDB = require("../model/Announcement");

/* GET home page. */
router.get("/", async (req, res) => {
  const listAnn = await annDB.find().sort({
    datePengumuman: -1
  });
  res.send(listAnn);
});

router.post("/", async (req, res) => {
  const newAnn = new annDB(req.body);
  try {
    const saveAnn = await newAnn.save();
    res.send(saveAnn);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updAnn = await annDB.updateOne({ _id: req.params.id }, req.body);
    res.send(updAnn);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const delAnn = await annDB.deleteOne({ _id: req.params.id }, req.body);
    res.send(delAnn);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
