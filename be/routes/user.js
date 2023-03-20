var express = require("express");
var router = express.Router();
const userDB = require("../model/User");
const compDB = require("../model/Company");
const kabkotDB = require("../model/Kabkot");
const provDB = require("../model/Province");
const formRegisDB = require("../model/formRegisComp");
const loggerDB = require("../model/Logger");
let xl = require("excel4node");
/*
router.get("/generate-userprov", async (req, res) => {
  const prov = await provDB.find();

  for (let i = 0; i < prov.length; i++) {
    const name = prov[i].provName;
    const nameToLC = name.toLowerCase();
    const nameClearWhite = nameToLC.replace(/\s/g, "");
    const userNew = new userDB({
      userEmail: `${nameClearWhite}@menlhk.go.id`,
      userPassword: "sparing170845!A",
      userRole: {
        role: "prov",
        // kabkotID: formReg.umum.compCity,
        provID: String(prov[i]._id),
        // compID: String(compSave._id),
        // profileID: String(formReg._id),
      },
    });
    const a = await userNew.save();
    console.log(a);
  }

  res.send("Done");
});

router.get("/generate-userkabkot", async (req, res) => {
  const prov = await kabkotDB.find();
  console.log(prov);
  for (let i = 0; i < prov.length; i++) {
    const name = prov[i].kabkotName;
    const nameToLC = name.toLowerCase();
    const nameClearWhite = nameToLC.replace(/\s/g, "");
    const userNew = new userDB({
      userEmail: `${nameClearWhite}@menlhk.go.id`,
      userPassword: "sparing170845!A",
      userRole: {
        role: "kabkot",
        kabkotID: String(prov[i]._id),
        provID: prov[i].provID,
        // compID: String(compSave._id),
        // profileID: String(formReg._id),
      },
    });
    const a = await userNew.save();
    console.log(a);
  }

  res.send("Done");
});
*/

router.post("/", async function (req, res, next) {
  const data = req.body;
  const user = await userDB.findOne({ userEmail: data.userEmail });
  if (user) return res.status(400).send("Email already existed!");
  const userNew = new userDB(data);
  try {
    const userSaved = await userNew.save();
    res.send(userSaved);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  let user;
  user = await userDB.findOne({ userEmail: req.body.userEmail });
  const formRegis = await formRegisDB.findOne({
    "akun.personMail": req.body.userEmail,
  });
  if (!user && formRegis)
    return res.status(400).send("Your data is being reviewed!");
  if (!user && !formRegis) return res.status(400).send("User not found!");
  if (req.body.userPassword !== user.userPassword)
    return res.status(400).send("Password is Invalid!");
  console.log(user.userRole.role);
  if (user.userRole.role === "comp") {
    const comp = await compDB.findOne({ _id: user.userRole.compID });
    user.userName = comp.compName;
  } else if (user.userRole.role === "kabkot") {
    const kabkot = await kabkotDB.findOne({ _id: user.userRole.kabkotID });
    user.userName = kabkot.kabkotName;
  } else if (user.userRole.role === "prov") {
    const prov = await provDB.findOne({ _id: user.userRole.provID });
    user.userName = prov.provName;
  } else if (user.userRole.role === "admin") {
    console.log("haloo");
    user.userName = "Admin";
  }
  const dataKirim = {
    token: "",
    _id: user._id,
    userRole: user.userRole,
    name: user.userName,
  };

  res.send(dataKirim);
});

router.put("/:id", async (req, res) => {
  try {
    console.log(req.body);
    const updateUser = await userDB.updateOne({ _id: req.params.id }, req.body);
    console.log(updateUser);
    res.send(updateUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/list", async (req, res) => {
  let user = await userDB.findOne();
  if (user.userRole.role !== "admin") return res.status(400).send("Error");
  user = await userDB.aggregate([
    { $match: { "userRole.role": "comp" } },
    { $addFields: { id: { $toObjectId: "$userRole.compID" } } },
    {
      $lookup: {
        from: "companies",
        localField: "id",
        foreignField: "_id",
        as: "companyDetails",
      },
    },
    { $unwind: "$companyDetails" },
    {
      $project: {
        id: 0,
      },
    },
    { $addFields: { id: { $toObjectId: "$userRole.kabkotID" } } },
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
    { $addFields: { id: { $toObjectId: "$userRole.provID" } } },
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
        id: 0,
      },
    },
  ]);
  res.send(user);
});

router.get("/list-export", async (req, res) => {
  let user = await userDB.findOne();
  if (user.userRole.role !== "admin") return res.status(400).send("Error");
  user = await userDB.aggregate([
    {
      $match: {
        "userRole.role": "comp",
      },
    },
    {
      $addFields: {
        id: {
          $toObjectId: "$userRole.compID",
        },
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "id",
        foreignField: "_id",
        as: "companyDetails",
      },
    },
    {
      $unwind: "$companyDetails",
    },
    {
      $project: {
        id: 0,
      },
    },
    {
      $addFields: {
        id: {
          $toObjectId: "$userRole.kabkotID",
        },
      },
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
      $unwind: "$kabkotDetails",
    },
    {
      $project: {
        id: 0,
      },
    },
    {
      $addFields: {
        id: {
          $toObjectId: "$userRole.provID",
        },
      },
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
      $unwind: "$provDetails",
    },
    {
      $project: {
        id: 0,
      },
    },
  ]);

  var wb = new xl.Workbook();
  var ws = wb.addWorksheet("User");

  let col = 1;
  ws.cell(col, 1).string("Email");
  ws.cell(col, 2).string("Nama Industri");
  ws.cell(col, 3).string("Jenis Industri");
  ws.cell(col, 4).string("Kab/Kot");
  ws.cell(col, 5).string("Provinsi");
  ws.cell(col, 6).string("Alamat");

  for (let i = 0; i < user.length; i++) {
    col++;
    ws.cell(col, 1).string(user[i].userEmail);
    ws.cell(col, 2).string(user[i].companyDetails.compName);
    ws.cell(col, 3).string(user[i].companyDetails.compType);
    ws.cell(col, 4).string(user[i].kabkotDetails.kabkotName);
    ws.cell(col, 5).string(user[i].provDetails.provName);
    ws.cell(col, 6).string(user[i].companyDetails.compAddress);
  }

  wb.write(`List User.xlsx`, res);
});

router.get("/cekRegis/:id", async (req, res) => {
  const user = await userDB.findOne({ "userRole.profileID": req.params.id });
  if (!user) {
    return res.status(400).send({
      message: "User tidak ditemukan, silahkan daftar kembali",
    });
  }
  const comp = await compDB.findOne({ _id: user.userRole.compID });
  if (!comp) {
    return res.status(400).send({
      message: "Company tidak ditemukan, silahkan daftar kembali",
    });
  }
  const logger = await loggerDB.findOne({ compID: user.userRole.compID });
  if (!logger) {
    return res.status(400).send({
      message: "Logger tidak ditemukan, silahkan lakukan uji koneksi",
    });
  }

  res.send({
    userName: user.userEmail,
    userPassword: user.userPassword,
    compName: comp.compName,
    compAddress: comp.compAddress,
    regNo: req.params.id,
    uid: String(logger._id),
  });
});

module.exports = router;
