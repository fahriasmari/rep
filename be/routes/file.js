var express = require("express");
var router = express.Router();
var multer = require("multer");

let response, status;
const whitelist = [
  "image/png",
  "image/jpeg",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/storage");
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.slice(
      (Math.max(0, file.originalname.lastIndexOf(".")) || Infinity) + 1
    );
    const filename = file.originalname.split(".").slice(0, -1).join(".");
    const title =
      new Date().getTime() +
      filename.replace(/[^0-9a-zA-Z]+/g, "_") +
      "." +
      extension;
    cb(null, title);
    // cb(null, new Date().toISOString() + file.originalname);
  },
});
var upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      cb(null, false);
      status = 400;
      response = "format tidak sesuai (.pdf, .jpg, .png, .xlsx, .csv)";
    } else {
      cb(null, true);
    }
  },
});

router.post("/", upload.single("picture"), async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(status).send({ message: response });
  }

  res.send({ path: file.path.slice(6) });
});

module.exports = router;
