var express = require("express");
var router = express.Router();
const provDB = require("../model/Province");

router.get("/list", async (req, res) => {
    const listProv = await provDB.find()

    res.send(listProv);
})

module.exports = router;