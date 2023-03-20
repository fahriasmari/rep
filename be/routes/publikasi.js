const express = require("express");
const router = express.Router();
const moment = require("moment");
const publikasiDB = require("../model/Publikasi");

router.get("/list", async (req, res) => {
  let msg = { data: [], error: [], message: "", status: "", code: 0 };
  let status = 200;
  try {
    const publikasi = await publikasiDB.find({}).sort({
      created_time: -1,
    });
    if (!publikasi) {
      msg.status = "failed";
      msg.code = 400;
      msg.message = "Data tidak boleh kosong";
      return res.status(400).send(msg);
    }
    msg.data = publikasi;
    msg.message = "Data ditemukan";
    //   msg.created_time  = faq.created_time;
    msg.code = 200;
    return res.status(200).send(msg);
  } catch (err) {
    msg.error = err;
    msg.message = "Error";
    msg.status = "error";
    msg.code = 400;
    return res.status(400).send(msg);
  }
});

router.post("/create", async (req, res) => {
  let judul = req.body.form.judul;
  let lampiiran = req.body.form.lampiran;
  let data = req.body.form;
  data.created_time = moment().unix();
  data.status = true;

  let msg = { data: [], error: [], message: "", status: "", code: 0 };
  let status = 200;

  const publikasiCreate = new publikasiDB(data);

  try {
    if (!judul || !lampiiran) {
      msg.status = "failed";
      msg.code = 400;
      msg.message = "Data tidak boleh kosong";
      return res.status(400).send(msg);
    }

    const savePublikasi = await publikasiCreate.save();

    msg.data = savePublikasi;
    msg.status = "success";
    msg.message = "Data berhasil di tambahkan !";
    msg.code = 200;
    return res.send(msg);
  } catch (error) {
    console.log(error);
    msg.error.push({ form: "system", msg: error });
    msg.status = "failed";
    msg.code = 400;
    return res.status(400).send(msg);
  }
});

// PUT
router.put("/update", async (req, res) => {
  let id = req.body._id;
  let judul = req.body.judul;
  let lampiran = req.body.lampiran;
  let data = req.body;

  data.updated_time = moment().unix();
  data.status = true;

  let msg = { data: [], error: [], message: "", status: "", code: 0 };
  let status = 200;

  try {
    // CHEECK ID
    const cekID = await publikasiDB.findOne({ _id: id });
    if (!cekID) {
      msg.status = "failed";
      msg.code = 400;
      msg.message = "ID tidak ditemukan";
      return res.status(400).send(msg);
    }
    if (!judul || !lampiran) {
      msg.status = "failed";
      msg.code = 400;
      msg.message = "Data tidak boleh kosong";
      return res.status(400).send(msg);
    }

    const updatePublikasi = await publikasiDB.updateOne(
      {
        _id: id,
      },
      data
    );

    msg.data = updatePublikasi;
    msg.status = "success";
    msg.message = "Data berhasil di ubah !";
    msg.code = 200;
    return res.send(msg);
  } catch (error) {
    console.log(error);
    msg.error.push({ form: "system", msg: error });
    msg.status = "failed";
    msg.code = 400;
    return res.status(400).send(msg);
  }
});

router.delete("/delete/:id", async (req, res) => {
  let id = req.params.id;
  let msg = { data: [], error: [], message: "", status: "", code: 0 };
  let status = 200;

  try {
    // CHEECK ID
    const cekID = await publikasiDB.findOne({ _id: id });

    if (!cekID) {
      msg.status = "failed";
      msg.code = 400;
      msg.message = "ID tidak ditemukan";
      return res.status(400).send(msg);
    }
    const deletePublikasi = await publikasiDB.deleteOne({
      _id: id,
    });

    msg.data = deletePublikasi;
    msg.status = "success";
    msg.message = "Data berhasil di ubah !";
    msg.code = 200;
    return res.send(msg);
  } catch (error) {
    console.log(error);
    msg.error.push({ form: "system", msg: error });
    msg.status = "failed";
    msg.code = 400;
    return res.status(400).send(msg);
  }
});

module.exports = router;
