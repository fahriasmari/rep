const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user");
const loggerRouter = require("./routes/logger");
const pjRouter = require("./routes/projectSites");
const compRouter = require("./routes/company");
const provRouter = require("./routes/provinsi");
const kabkotRouter = require("./routes/kabkot");
const reportRouter = require("./routes/report");
const dashRouter = require("./routes/dashboard");
const analyticsRouter = require("./routes/analytics");
const errorRouter = require("./routes/error");
const fileRouter = require("./routes/file");
const formRouter = require("./routes/form");
const annRouter = require("./routes/announce");
const simpelRouter = require("./routes/simpelv1");
const getapiRouter = require("./routes/getapi");
const insertSensorDay = require("./routes/insertSensorDay");
const recronjob = require("./routes/recronjob");
const laporanMingguan = require("./routes/laporanMingguan");
const kalibrasiRouter = require("./routes/kalibrasi");
const filterRouter = require("./routes/filter");
const api_ppa = require("./routes/api-ppa");

// UPDATE
const ujikonek = require("./routes/ujikonek");
const faq = require("./routes/faq");
const publikasi = require("./routes/publikasi");
const dashboardAdmin = require("./routes/dashboardAdmin");

const app = express();
const dotenv = require("dotenv");
const database = require("./services/database");
const cron = require("./middleware/cron");
const bodyParser = require("body-parser");
global.__basedir = __dirname;
dotenv.config();
database();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "http://sparing-klhk.com");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   next();
// });

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
// app.use(express.json({limit: '50mb', extended: true,parameterLimit:50000}));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/logger", loggerRouter);
app.use("/pj", pjRouter);
app.use("/comp", compRouter);
app.use("/prov", provRouter);
app.use("/kabkot", kabkotRouter);
app.use("/report", reportRouter);
app.use("/dash", dashRouter);
app.use("/analytics", analyticsRouter);
app.use("/error", errorRouter);
app.use("/file", fileRouter);
app.use("/form", formRouter);
app.use("/ann", annRouter);
app.use("/simpel", simpelRouter);
app.use("/ppa-api", api_ppa);
app.use("/api/getapi", getapiRouter);
app.use("/insertSensorDay", insertSensorDay);
app.use("/recronjob", recronjob);
app.use("/laporanMingguan", laporanMingguan);
app.use("/kalibrasi", kalibrasiRouter);
app.use("/filter", filterRouter);
app.use("/validasi", require("./routes/validasi"));
app.use("/pengaduan", require("./routes/pengaduan"));
app.use("/beritaacara", require("./routes/beritaacara"));
app.use("/condreport", require("./routes/condreport"));
app.use("/covid", require("./routes/covid"));
app.use("/pendaftaran", require("./routes/pendaftaran"));

// UPDATE ROUTES
app.use("/api/v1/ujikonek", ujikonek);
app.use("/api/v1/faq", faq);
app.use("/api/v1/publikasi", publikasi);
app.use("/api/v1/dashboardadmin", dashboardAdmin);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
