const express = require("express");
const router = express.Router();
const moment = require("moment");
const faqDB = require("../model/Faq");
const fCategoryDB = require("../model/faqsCategory");



router.get("/list", async (req, res) => {
    let msg = {data:[],error:[],message:"",status:"",code:0};
    let status = 200;
    try{
      const faq = await faqDB.find({});
      if (!faq){
        msg.status = "failed";
        msg.code = 400;
        msg.message = "Data tidak boleh kosong";
        return res.status(400).send(msg);
      } 
      msg.data = faq;
      msg.message = "Data ditemukan";
    //   msg.created_time  = faq.created_time;
      msg.code = 200;
      return res.status(200).send(msg);
    }
    catch(err){
      msg.error = err;
      msg.message = "Error";
      msg.status = "error";
      msg.code = 400;
      return res.status(400).send(msg);
    }
    
  })

// POST
router.post("/create", async (req, res) => {
    
    let pertanyaan = req.body.form.pertanyaan;
    let jawaban = req.body.form.jawaban;
    let categoryFaq = req.body.form.categoryFaq;
    let data = req.body.form;
    data.created_time = moment().unix();
    data.status = true;
    
    let msg = {data:[],error:[],message:"",status:"",code:0};
    let status = 200;

    
    const faqCreate = new faqDB(data);
   
    try {
        if(!pertanyaan || !jawaban){
            msg.status = "failed";
            msg.code = 400;
            msg.message = "Data tidak boleh kosong";
            return res.status(400).send(msg);
        }

        const saveFaq = await faqCreate.save();
       
        msg.data = saveFaq
        msg.status = "success";
        msg.message = "Data berhasil di tambahkan !";
        msg.code = 200;
        return res.send(msg);
      } catch (error) {
        msg.error.push({form:"system",msg:error});
        msg.status = "failed";
        msg.code = 400;
        return res.status(400).send(msg);
      }
    
})
// PUT
router.put("/update", async (req, res) => {
    
    let id = req.body.form._id;
    let categoryFaq = req.body.form.categoryFaq;
    let pertanyaan = req.body.form.pertanyaan;
    let jawaban = req.body.form.jawaban;
    let data = req.body.form;
    data.updated_time = moment().unix();
    data.status = true;
    
    let msg = {data:[],error:[],message:"",status:"",code:0};
    let status = 200;

    
   
    try {

        // CHEECK ID
        const cekID = await faqDB.findOne({_id:id});
        if(!cekID){
            msg.status = "failed";
            msg.code = 400;
            msg.message = "ID tidak ditemukan";
            return res.status(400).send(msg);
        }
        if(!pertanyaan || !jawaban){
            msg.status = "failed";
            msg.code = 400;
            msg.message = "Data tidak boleh kosong";
            return res.status(400).send(msg);
        }

        const updateFaq = await faqDB.updateOne({
            _id: id
          },
          data);
       
        msg.data = updateFaq
        msg.status = "success";
        msg.message = "Data berhasil di ubah !";
        msg.code = 200;
        return res.send(msg);
      } catch (error) {
        console.log(error);
        msg.error.push({form:"system",msg:error});
        msg.status = "failed";
        msg.code = 400;
        return res.status(400).send(msg);
      }
    
})
// DELETE
router.delete("/delete/:id", async (req, res) => {
    
    
    let id = req.params.id;
    let msg = {data:[],error:[],message:"",status:"",code:0};
    let status = 200;

    
    try {

        // CHEECK ID
        const cekID = await faqDB.findOne({_id:id});
        if(!cekID){
            msg.status = "failed";
            msg.code = 400;
            msg.message = "ID tidak ditemukan";
            return res.status(400).send(msg);
        }
        const deleteFaq = await faqDB.deleteOne({
            _id: id
          });
       
        msg.data = deleteFaq
        msg.status = "success";
        msg.message = "Data berhasil di ubah !";
        msg.code = 200;
        return res.send(msg);
      } catch (error) {
        console.log(error);
        msg.error.push({form:"system",msg:error});
        msg.status = "failed";
        msg.code = 400;
        return res.status(400).send(msg);
      }
    
})


// CATEGORI FAQ



router.get("/category", async (req, res) => {
    let msg = {data:[],error:[],message:"",status:"",code:0};
    let status = 200;
    const saveFaq = await fCategoryDB.find({});
  //   {
  //     "_id" : ObjectId("62c71d563a4938737ccc3c91"),
  //     "name" : " A. Jenis Industri Wajib SPARING",
  //     "status" : "true",
  //     "created_time" : 1657214498,
  //     "updated_time" : null,
  //     "__v" : 0
  // }
    res.status(200).send(saveFaq)
  })




module.exports = router;