const errDayDB = require("../model/errorDay");
const loggerDB = require("../model/Logger");
const dataDaySensorDB = require("../model/dataDaySensor");
const dataSensorDB = require("../model/dataSensor");
const dataHourlySensorDB = require("../model/dataHourlySensor");
const errCapDB = require("../model/errorRecap");
const dataMonthSensorDB = require("../model/dataMonthSensor");
const errMonthDB = require("../model/errorMonth");
const moment = require("moment");

hourly = async (date = "", type = "") => {
  if (type == "full") {
    var a = moment(date).startOf("day");
    var b = moment(date).endOf("day");
  } else if (type == "now") {
    let now = moment().unix() - 3600;
    var a = moment(date).startOf("day");
    var b = moment.unix(now).endOf("hours");
  }
  for (var m = moment(a); m.diff(b, "hours") <= 0; m.add(1, "hours")) {
    // const time = m.format('DD-MM-YYYY HH:mm:ss');

    const time_now = m.unix();
    let time_ago = time_now - 3600;
    let start_ago = moment.unix(time_ago).startOf("hours").unix();
    let end_ago = moment.unix(time_ago).endOf("hours").unix();
    let datetime_before = 0; //dummy
    const logger = await loggerDB.find();
    // DELETE HOURLY DATA OLD

    // END DELETE HOURLY DATA OLD

    if (logger) {
      for (let i = 0; i < logger.length; i++) {
        dataSensor = await dataSensorDB.aggregate([
          {
            $match: {
              $and: [
                // { loggerID: "5f6322617c5fc71255fca135" },
                { loggerID: String(logger[i]._id) },
                {
                  timestamp: {
                    $gte: start_ago,
                    $lte: end_ago,
                  },
                },
              ],
            },
          },
        ]);

        if (dataSensor.length > 0) {
          let totalPh = 0;
          let totalcod = 0;
          let totaltss = 0;
          let totalnh3n = 0;
          let totaldebit = 0;
          let sensor_length = 0;
          for (let j = 0; j < dataSensor.length; j++) {
            if (dataSensor[j].timestamp != datetime_before) {
              datetime_before = dataSensor[j].timestamp;
              totalPh += dataSensor[j].dataParam[0].value;
              totalcod += dataSensor[j].dataParam[1].value;
              totaltss += dataSensor[j].dataParam[2].value;
              totalnh3n += dataSensor[j].dataParam[3].value;
              totaldebit += dataSensor[j].dataParam[4].value;
              sensor_length++;
            } else {
              totalPh += 0;
              totalcod += 0;
              totaltss += 0;
              totalnh3n += 0;
              totaldebit += 0;
            }
          }
          let avgPh = totalPh / sensor_length;
          let avgcod = totalcod / sensor_length;
          let avgtss = totaltss / sensor_length;
          let avgnh3n = totalnh3n / sensor_length;
          // let avgdebit = (totaldebit * 30) / dataSensor.length;
          // let avgdebit = (totaldebit / dataSensor.length) * 60;
          let avgdebit = totaldebit * 2;

          let newdataParam = [
            {
              name: "pH",
              value: avgPh,
            },
            {
              name: "COD",
              value: avgcod,
            },
            {
              name: "TSS",
              value: avgtss,
            },
            {
              name: "NH3N",
              value: avgnh3n,
            },
            {
              name: "Debit",
              value: avgdebit,
            },
          ];

          const saveHourly = new dataHourlySensorDB({
            loggerID: logger[i]._id,
            dataParam: newdataParam,
            timestamp: time_now,
          });

          try {
            // const deleteHour = await dataHourlySensorDB.deleteMany({timestamp:{$gte:moment.unix(time_now).startOf('hours').unix(),$lte:moment.unix(time_now).endOf('hours').unix()}})
            // const deleteHourErr = await errCapDB.deleteMany({timestamp:{$gte:moment.unix(time_now).startOf('hours').unix(),$lte:moment.unix(time_now).endOf('hours').unix()}})
            const deleteHour = await dataHourlySensorDB.deleteMany({
              loggerID: saveHourly.loggerID,
              timestamp: {
                $gte: moment.unix(time_now).startOf("hours").unix(),
                $lte: moment.unix(time_now).endOf("hours").unix(),
              },
            });
            const deleteHourErr = await errCapDB.deleteMany({
              loggerID: saveHourly.loggerID,
              timestamp: {
                $gte: moment.unix(time_now).startOf("hours").unix(),
                $lte: moment.unix(time_now).endOf("hours").unix(),
              },
            });
          } catch (e) {
            console.log(e);
          }

          const saveHour = await saveHourly.save();
          const loggerErr = await loggerDB.findOne({
            _id: saveHourly.loggerID,
          });

          for (let ii = 0; ii < saveHour.dataParam.length; ii++) {
            for (let a = 0; a < loggerErr.logDataRange.length; a++) {
              if (
                saveHour.dataParam[ii].name === loggerErr.logDataRange[a].name
              ) {
                if (
                  saveHour.dataParam[ii].value > loggerErr.logDataRange[a].max
                  // saveHour.dataParam[ii].value < loggerErr.logDataRange[a].min
                ) {
                  const msg = `Parameter ${saveHour.dataParam[ii].name} tidak sesuai ambang batas!`;

                  var errCap = new errCapDB({
                    loggerID: saveHour.loggerID,
                    timestamp: time_now,
                    errSUM: msg,
                  });
                  if (logger[i].formregis) {
                    if (typeof logger[i].formregis[0] != "undefined") {
                      if (typeof logger[i].formregis[0].teknis != "undefined") {
                        if (
                          typeof logger[i].formregis[0].teknis.satuanDebit !=
                          "undefined"
                        ) {
                          if (
                            logger[i].formregis[0].teknis.satuanDebit ==
                              "m3/detik" ||
                            logger[i].formregis[0].teknis.satuanDebit ==
                              "m3/menit" ||
                            logger[i].formregis[0].teknis.satuanDebit ==
                              "m3/jam"
                          ) {
                            await errCap.save();
                          }
                        } else {
                          await errCap.save();
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return `recronjob data hourly ${date} successfully`;
};
daily = async (date = "", loggerid = "") => {
  var a = moment(date).startOf("day");
  var b = moment(date).endOf("day");
  let logger;
  let deleteDaily;
  let deleteDailyErr;

  // If you want an inclusive end date (fully-closed interval)
  if (loggerid) {
    // logger = await loggerDB.find({ _id: loggerid });
    logger = await loggerDB.aggregate([
      { $addFields: { id: { $toString: "$_id" } } },
      {
        $match: {
          id: loggerid,
        },
      },
      { $addFields: { compObjId: { $toObjectId: "$compID" } } },
      {
        $lookup: {
          from: "companies",
          localField: "compObjId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $lookup: {
          from: "formregiscomps",
          localField: "company.compName",
          foreignField: "umum.compName",
          as: "formregis",
        },
      },
    ]);
    //console.log(logger);
    try {
      deleteDaily = await dataDaySensorDB.deleteMany({
        loggerID: loggerid,
        timestamp: { $gte: moment(a).unix(), $lte: moment(b).unix() },
      });
      deleteDailyErr = await errDayDB.deleteMany({
        loggerID: loggerid,
        timestamp: { $gte: moment(a).unix(), $lte: moment(b).unix() },
      });
    } catch (e) {
      console.log(e);
    }
  } else {
    // logger = await loggerDB.find();
    logger = await loggerDB.aggregate([
      { $addFields: { compObjId: { $toObjectId: "$compID" } } },
      {
        $lookup: {
          from: "companies",
          localField: "compObjId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $lookup: {
          from: "formregiscomps",
          localField: "company.compName",
          foreignField: "umum.compName",
          as: "formregis",
        },
      },
    ]);
    try {
      deleteDaily = await dataDaySensorDB.deleteMany({
        timestamp: { $gte: moment(a).unix(), $lte: moment(b).unix() },
      });
      deleteDailyErr = await errDayDB.deleteMany({
        timestamp: { $gte: moment(a).unix(), $lte: moment(b).unix() },
      });
    } catch (e) {
      console.log(e);
    }
  }

  //console.log(logger.length);
  //return

  // const time = m.unix();
  // DELETE Daily DATA OLD
  try {
    if (loggerid) {
      deleteDaily = await dataDaySensorDB.deleteMany({
        loggerID: loggerid,
        timestamp: { $gte: moment(a).unix(), $lte: moment(b).unix() },
      });
      deleteDailyErr = await errDayDB.deleteMany({
        loggerID: loggerid,
        timestamp: { $gte: moment(a).unix(), $lte: moment(b).unix() },
      });
    } else {
      deleteDaily = await dataDaySensorDB.deleteMany({
        timestamp: { $gte: moment(a).unix(), $lte: moment(b).unix() },
      });
      deleteDailyErr = await errDayDB.deleteMany({
        timestamp: { $gte: moment(a).unix(), $lte: moment(b).unix() },
      });
    }
  } catch (e) {
    console.log(e);
  }

  // END DELETE Daily DATA OLD
  for (let i = 0; i < logger.length; i++) {
    const dataSensor = await dataHourlySensorDB.aggregate([
      {
        $match: {
          $and: [
            // { loggerID: "5f619c497c5fc71255fa376b" },
            { loggerID: String(logger[i]._id) },
            {
              timestamp: {
                $gte: moment(a).unix(),
                $lte: moment(b).unix(),
              },
            },
          ],
        },
      },
    ]);
    if (dataSensor.length > 0) {
      let totalPh = 0;
      let totalcod = 0;
      let totaltss = 0;
      let totalnh3n = 0;
      let totaldebit = 0;
      for (let j = 0; j < dataSensor.length; j++) {
        totalPh += dataSensor[j].dataParam[0].value;
        totalcod += dataSensor[j].dataParam[1].value;
        totaltss += dataSensor[j].dataParam[2].value;
        totalnh3n += dataSensor[j].dataParam[3].value;
        totaldebit += dataSensor[j].dataParam[4].value;
      }
      let avgPh = totalPh / dataSensor.length;
      let avgcod = totalcod / dataSensor.length;
      let avgtss = totaltss / dataSensor.length;
      let avgnh3n = totalnh3n / dataSensor.length;
      let avgdebit = totaldebit;

      let newdataParam = [
        {
          name: "pH",
          value: avgPh,
        },
        {
          name: "COD",
          value: avgcod,
        },
        {
          name: "TSS",
          value: avgtss,
        },
        {
          name: "NH3N",
          value: avgnh3n,
        },
        {
          name: "Debit",
          value: avgdebit,
        },
      ];

      const saveDay = new dataDaySensorDB({
        loggerID: logger[i]._id,
        dataParam: newdataParam,
        timestamp: moment(b).unix(),
      });
      const saveDays = await saveDay.save();
      const loggerErr = await loggerDB.findOne({ _id: saveDay.loggerID });

      for (let ii = 0; ii < saveDays.dataParam.length; ii++) {
        for (let a = 0; a < loggerErr.logDataRange.length; a++) {
          if (saveDays.dataParam[ii].name === loggerErr.logDataRange[a].name) {
            if (
              saveDays.dataParam[ii].value > loggerErr.logDataRange[a].max
              // saveDays.dataParam[ii].value < loggerErr.logDataRange[a].min
            ) {
              const msg = `Parameter ${saveDays.dataParam[ii].name} tidak sesuai ambang batas!`;

              var errDay = new errDayDB({
                loggerID: saveDays.loggerID,
                timestamp: moment(b).unix(),
                errSUM: msg,
              });

              if (logger[i].formregis) {
                if (typeof logger[i].formregis[0] != "undefined") {
                  if (typeof logger[i].formregis[0].teknis != "undefined") {
                    if (
                      typeof logger[i].formregis[0].teknis.satuanDebit !=
                      "undefined"
                    ) {
                      if (
                        logger[i].formregis[0].teknis.satuanDebit == "m3/hari"
                      ) {
                        await errDay.save();
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return `recronjob data daily ${date} successfully`;
};
monthly = async (date = "", loggerid = "") => {
  var a = moment(date).startOf("month");
  var b = moment(date).endOf("month");
  let logger;
  let deleteMonthlyErr;
  let deleteMonthly;

  // If you want an inclusive end date (fully-closed interval)
  if (loggerid) {
    // logger = await loggerDB.find({ _id: loggerid });
    logger = await loggerDB.aggregate([
      { $addFields: { id: { $toString: "$_id" } } },
      {
        $match: {
          id: loggerid,
        },
      },
      { $addFields: { compObjId: { $toObjectId: "$compID" } } },
      {
        $lookup: {
          from: "companies",
          localField: "compObjId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $lookup: {
          from: "formregiscomps",
          localField: "company.compName",
          foreignField: "umum.compName",
          as: "formregis",
        },
      },
    ]);
    try {
      deleteMonthly = await dataMonthSensorDB.deleteMany({
        loggerID: loggerid,
        timestamp: { $gte: moment(a).unix(), $lte: moment(b).unix() },
      });
      deleteMonthlyErr = await errMonthDB.deleteMany({
        loggerID: loggerid,
        timestamp: { $gte: moment(a).unix(), $lte: moment(b).unix() },
      });
    } catch (e) {
      console.log(e);
    }
  } else {
    // logger = await loggerDB.find();
    logger = await loggerDB.aggregate([
      { $addFields: { compObjId: { $toObjectId: "$compID" } } },
      {
        $lookup: {
          from: "companies",
          localField: "compObjId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $lookup: {
          from: "formregiscomps",
          localField: "company.compName",
          foreignField: "umum.compName",
          as: "formregis",
        },
      },
    ]);
    try {
      deleteMonthly = await dataMonthSensorDB.deleteMany({
        timestamp: { $gte: moment(a).unix(), $lte: moment(b).unix() },
      });
      deleteMonthlyErr = await errMonthDB.deleteMany({
        timestamp: { $gte: moment(a).unix(), $lte: moment(b).unix() },
      });
    } catch (e) {
      console.log(e);
    }
  }

  // const time = m.unix();
  // DELETE Monthly DATA OLD

  // END DELETE Monthly DATA OLD
  for (let i = 0; i < logger.length; i++) {
    const dataSensor = await dataDaySensorDB.aggregate([
      {
        $match: {
          $and: [
            // { loggerID: "5f619c497c5fc71255fa376b" },
            { loggerID: String(logger[i]._id) },
            {
              timestamp: {
                $gte: moment(a).unix(),
                $lte: moment(b).unix(),
              },
            },
          ],
        },
      },
    ]);

    if (dataSensor.length > 0) {
      let totalPh = 0;
      let totalcod = 0;
      let totaltss = 0;
      let totalnh3n = 0;
      let totaldebit = 0;
      for (let j = 0; j < dataSensor.length; j++) {
        totalPh += dataSensor[j].dataParam[0].value;
        totalcod += dataSensor[j].dataParam[1].value;
        totaltss += dataSensor[j].dataParam[2].value;
        totalnh3n += dataSensor[j].dataParam[3].value;
        totaldebit += dataSensor[j].dataParam[4].value;
      }
      let avgPh = totalPh / dataSensor.length;
      let avgcod = totalcod / dataSensor.length;
      let avgtss = totaltss / dataSensor.length;
      let avgnh3n = totalnh3n / dataSensor.length;
      let avgdebit = totaldebit;

      let newdataParam = [
        {
          name: "pH",
          value: avgPh,
        },
        {
          name: "COD",
          value: avgcod,
        },
        {
          name: "TSS",
          value: avgtss,
        },
        {
          name: "NH3N",
          value: avgnh3n,
        },
        {
          name: "Debit",
          value: avgdebit,
        },
      ];

      const saveMonth = new dataMonthSensorDB({
        loggerID: logger[i]._id,
        dataParam: newdataParam,
        timestamp: moment(b).unix(),
      });
      const saveMonths = await saveMonth.save();
      const loggerErr = await loggerDB.findOne({ _id: saveMonth.loggerID });

      for (let ii = 0; ii < saveMonths.dataParam.length; ii++) {
        for (let a = 0; a < loggerErr.logDataRange.length; a++) {
          if (
            saveMonths.dataParam[ii].name === loggerErr.logDataRange[a].name
          ) {
            if (
              saveMonths.dataParam[ii].value > loggerErr.logDataRange[a].max
              // saveMonths.dataParam[ii].value < loggerErr.logDataRange[a].min
            ) {
              const msg = `Parameter ${saveMonths.dataParam[ii].name} tidak sesuai ambang batas!`;

              var errMonth = new errMonthDB({
                loggerID: saveMonths.loggerID,
                timestamp: moment(b).unix(),
                errSUM: msg,
              });

              if (logger[i].formregis) {
                if (typeof logger[i].formregis[0] != "undefined") {
                  if (typeof logger[i].formregis[0].teknis != "undefined") {
                    if (
                      typeof logger[i].formregis[0].teknis.satuanDebit !=
                      "undefined"
                    ) {
                      if (
                        logger[i].formregis[0].teknis.satuanDebit == "m3/bulan"
                      ) {
                        await errMonth.save();
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return `recronjob data monthly ${date} successfully`;
};
hourlyWithLogger = async (date = "", loggerID = "") => {
  var a = moment(date).startOf("day");
  var b = moment(date).endOf("day");
  let result_data = [];
  for (var m = moment(a); m.diff(b, "hours") <= 0; m.add(1, "hours")) {
    // const time = m.format('DD-MM-YYYY HH:mm:ss');

    const time_now = m.unix();
    let time_ago = time_now - 3600;
    let start_ago = moment.unix(time_ago).startOf("hours").unix();
    let end_ago = moment.unix(time_ago).endOf("hours").unix();
    // const logger = await loggerDB.find();
    const logger = await loggerDB.aggregate([
      { $addFields: { id: { $toString: "$_id" } } },
      {
        $match: {
          id: loggerID,
        },
      },
      { $addFields: { compObjId: { $toObjectId: "$compID" } } },
      {
        $lookup: {
          from: "companies",
          localField: "compObjId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $lookup: {
          from: "formregiscomps",
          localField: "company.compName",
          foreignField: "umum.compName",
          as: "formregis",
        },
      },
    ]);
    let datetime_before = 0; //dummy
    if (logger) {
      for (let i = 0; i < logger.length; i++) {
        dataSensor = await dataSensorDB.aggregate([
          {
            $match: {
              $and: [
                // { loggerID: "5f6322617c5fc71255fca135" },
                { loggerID: String(logger[i]._id) },
                {
                  timestamp: {
                    $gte: start_ago,
                    $lte: end_ago,
                  },
                },
              ],
            },
          },
        ]);

        if (dataSensor.length > 0) {
          let totalPh = 0;
          let totalcod = 0;
          let totaltss = 0;
          let totalnh3n = 0;
          let totaldebit = 0;
          let sensor_length = 0;
          for (let j = 0; j < dataSensor.length; j++) {
            if (dataSensor[j].timestamp != datetime_before) {
              datetime_before = dataSensor[j].timestamp;
              totalPh += dataSensor[j].dataParam[0].value;
              totalcod += dataSensor[j].dataParam[1].value;
              totaltss += dataSensor[j].dataParam[2].value;
              totalnh3n += dataSensor[j].dataParam[3].value;
              totaldebit += dataSensor[j].dataParam[4].value;
              sensor_length++;
            } else {
              totalPh += 0;
              totalcod += 0;
              totaltss += 0;
              totalnh3n += 0;
              totaldebit += 0;
            }
            // console.log(dataSensor[j].dataParam)
          }
          let avgPh = totalPh / sensor_length;
          let avgcod = totalcod / sensor_length;
          let avgtss = totaltss / sensor_length;
          let avgnh3n = totalnh3n / sensor_length;
          // let avgdebit = (totaldebit * 30) / dataSensor.length;
          // let avgdebit = (totaldebit / dataSensor.length) * 60;
          let avgdebit = totaldebit * 2;

          let newdataParam = [
            {
              name: "pH",
              value: avgPh,
            },
            {
              name: "COD",
              value: avgcod,
            },
            {
              name: "TSS",
              value: avgtss,
            },
            {
              name: "NH3N",
              value: avgnh3n,
            },
            {
              name: "Debit",
              value: avgdebit,
            },
          ];

          const saveHourly = new dataHourlySensorDB({
            loggerID: logger[i]._id,
            dataParam: newdataParam,
            timestamp: time_now,
          });

          // DELETE HOURLY DATA OLD
          try {
            const deleteHour = await dataHourlySensorDB.deleteMany({
              loggerID: saveHourly.loggerID,
              timestamp: {
                $gte: moment.unix(time_now).startOf("hours").unix(),
                $lte: moment.unix(time_now).endOf("hours").unix(),
              },
            });
            const deleteHourErr = await errCapDB.deleteMany({
              loggerID: saveHourly.loggerID,
              timestamp: {
                $gte: moment.unix(time_now).startOf("hours").unix(),
                $lte: moment.unix(time_now).endOf("hours").unix(),
              },
            });
          } catch (e) {
            console.log(e);
          }

          // END DELETE HOURLY DATA OLD
          const saveHour = await saveHourly.save();
          const loggerErr = await loggerDB.findOne({
            _id: saveHourly.loggerID,
          });

          for (let ii = 0; ii < saveHour.dataParam.length; ii++) {
            for (let a = 0; a < loggerErr.logDataRange.length; a++) {
              if (
                saveHour.dataParam[ii].name === loggerErr.logDataRange[a].name
              ) {
                if (
                  saveHour.dataParam[ii].value > loggerErr.logDataRange[a].max
                  // saveHour.dataParam[ii].value < loggerErr.logDataRange[a].min
                ) {
                  const msg = `Parameter ${saveHour.dataParam[ii].name} tidak sesuai ambang batas!`;

                  var errCap = new errCapDB({
                    loggerID: saveHour.loggerID,
                    timestamp: time_now,
                    errSUM: msg,
                  });
                  if (logger[i].formregis) {
                    if (typeof logger[i].formregis[0] != "undefined") {
                      if (typeof logger[i].formregis[0].teknis != "undefined") {
                        if (
                          typeof logger[i].formregis[0].teknis.satuanDebit !=
                          "undefined"
                        ) {
                          if (
                            logger[i].formregis[0].teknis.satuanDebit ==
                              "m3/detik" ||
                            logger[i].formregis[0].teknis.satuanDebit ==
                              "m3/menit" ||
                            logger[i].formregis[0].teknis.satuanDebit ==
                              "m3/jam"
                          ) {
                            await errCap.save();
                          }
                        } else {
                          await errCap.save();
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          result_data.push(saveHour);
        }
      }
    }
  }

  return `recronjob data hourly ${moment(date * 1000).format(
    "DD MMM YYYY, HH:mm"
  )} successfully`;
};

module.exports = { daily, hourly, monthly, hourlyWithLogger };
