var express = require("express");
var router = express.Router();
const kabkotDB = require("../model/Kabkot");

router.get("/list/:id", async (req, res) => {
    const listKabkot = await kabkotDB.find({ "provID": req.params.id })
    console.log(listKabkot)
    res.send(listKabkot);
})

module.exports = router;