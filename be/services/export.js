let xl = require("excel4node");
const dataSensorDB = require("../model/dataSensor");
const dataHourlySensorDB = require("../model/dataHourlySensor");
const dataDaySensorDB = require("../model/dataDaySensor");
const moment = require("moment");

laporanExportService = async ({
  dataPemenuhan,
  dataSensor,
  res,
  type,
  unit,
}) => {
  var wb = new xl.Workbook();
  var ws = wb.addWorksheet(`Data Per${unit}`);
  var style = wb.createStyle({
    font: {
      bold: true,
    },
    alignment: {
      wrapText: true,
      horizontal: "center",
      vertical: "center",
    },
  });
  let col = 1;
  ws.cell(col, 1, col + 2, 1, true)
    .string("No")
    .style(style);
  ws.cell(col, 2, col + 2, 2, true)
    .string("Nama Industri")
    .style(style);
  ws.cell(col, 3, col + 2, 3, true)
    .string("Jenis Industri")
    .style(style);
  ws.cell(col, 4, col + 2, 4, true)
    .string("Provinsi")
    .style(style);
  ws.cell(col, 5, col + 2, 5, true)
    .string("Kab/Kot")
    .style(style);
  ws.cell(col, 6, col + 2, 6, true)
    .string("Tanggal")
    .style(style);
  ws.cell(col, 7, col + 2, 7, true)
    .string("Frekuensi Pembuangan")
    .style(style);
  ws.cell(col, 8, col, 12, true).string("Ketaatan Pelaporan").style(style);
  ws.cell(col + 1, 8, col + 2, 8, true)
    .string(
      `Frekuensi Pembuangan Air Limbah ${
        type.charAt(0).toUpperCase() + type.substring(1)
      } (${unit == "jam" ? "menit" : unit == "hari" ? "jam" : "hari"})`
    )
    .style(style);
  ws.cell(col + 1, 9, col + 1, 13, true)
    .string(
      `Jumlah data lapor dalam 1 ${unit} (${
        unit == "jam" ? "menit" : unit == "hari" ? "jam" : "hari"
      })`
    )
    .style(style);
  ws.cell(col + 2, 9)
    .string("pH")
    .style(style);
  ws.cell(col + 2, 10)
    .string("COD")
    .style(style);
  ws.cell(col + 2, 11)
    .string("TSS")
    .style(style);
  ws.cell(col + 2, 12)
    .string("NH3N")
    .style(style);
  ws.cell(col + 2, 13)
    .string("Debit")
    .style(style);
  ws.cell(col, 14, col, 23, true).string("Ketaatan Baku Mutu").style(style);
  ws.cell(col + 1, 14, col + 1, 15, true)
    .string("pH")
    .style(style);
  ws.cell(col + 2, 14)
    .string(`Data rata-rata ${type}`)
    .style(style);
  ws.cell(col + 2, 15)
    .string("Baku mutu")
    .style(style);
  ws.cell(col + 1, 16, col + 1, 17, true)
    .string("COD (mg/L)")
    .style(style);
  ws.cell(col + 2, 16)
    .string(`Data rata-rata ${type}`)
    .style(style);
  ws.cell(col + 2, 17)
    .string("Baku mutu")
    .style(style);
  ws.cell(col + 1, 18, col + 1, 19, true)
    .string("TSS (mg/L)")
    .style(style);
  ws.cell(col + 2, 18)
    .string(`Data rata-rata ${type}`)
    .style(style);
  ws.cell(col + 2, 19)
    .string("Baku mutu")
    .style(style);
  ws.cell(col + 1, 20, col + 1, 21, true)
    .string("NH3N (mg/L)")
    .style(style);
  ws.cell(col + 2, 20)
    .string(`Data rata-rata ${type}`)
    .style(style);
  ws.cell(col + 2, 21)
    .string("Baku mutu")
    .style(style);
  ws.cell(col + 1, 22, col + 1, 23, true)
    .string(`Debit (m3/${unit.charAt(0).toUpperCase() + unit.substring(1)})`)
    .style(style);
  ws.cell(col + 2, 22)
    .string(`Debit ${type}`)
    .style(style);
  ws.cell(col + 2, 23)
    .string("Baku mutu")
    .style(style);
  ws.cell(col, 24, col + 2, 24, true)
    .string(
      `Beban COD (kg/${unit.charAt(0).toUpperCase() + unit.substring(1)})`
    )
    .style(style);
  ws.cell(col, 25, col + 2, 25, true)
    .string(
      `Beban TSS (kg/${unit.charAt(0).toUpperCase() + unit.substring(1)})`
    )
    .style(style);
  ws.cell(col, 26, col + 2, 26, true)
    .string(
      `Beban NH3N (kg/${unit.charAt(0).toUpperCase() + unit.substring(1)})`
    )
    .style(style);

  col = 3;
  for (let i = 0; i < dataSensor.length; i++) {
    col++;
    let start, end;
    if (unit == "jam") {
      start = dataSensor[i].timestamp;
      end = moment(
        moment(dataSensor[i].timestamp * 1000).subtract(-1, "hours")
      ).unix();
    } else if (unit == "hari") {
      end = moment(moment(dataSensor[i].timestamp * 1000).endOf("days")).unix();
      start = moment(
        moment(dataSensor[i].timestamp * 1000).startOf("days")
      ).unix();
    } else {
      end = moment(
        moment(dataSensor[i].timestamp * 1000).endOf("months")
      ).unix();
      start = moment(
        moment(dataSensor[i].timestamp * 1000).startOf("months")
      ).unix();
    }
    // let count,
    //   countQuery = [
    //     {
    //       $match: {
    //         $and: [
    //           {
    //             timestamp: {
    //               $gte: start,
    //               $lt: end,
    //             },
    //           },
    //           {
    //             loggerID: dataSensor[i].loggerID,
    //           },
    //         ],
    //       },
    //     },
    //     {
    //       $addFields: {
    //         pH: 0,
    //       },
    //     },
    //     {
    //       $addFields: {
    //         COD: 0,
    //       },
    //     },
    //     {
    //       $addFields: {
    //         TSS: 0,
    //       },
    //     },
    //     {
    //       $addFields: {
    //         NH3N: 0,
    //       },
    //     },
    //     {
    //       $addFields: {
    //         Debit: 0,
    //       },
    //     },
    //     {
    //       $project: {
    //         _id: 1,
    //         pH: {
    //           $function: {
    //             body: function (data) {
    //               let count = data[0].value > 0 || data[0] !== null ? 1 : 0;
    //               return count;
    //             },
    //             args: ["$dataParam"],
    //             lang: "js",
    //           },
    //         },
    //         COD: {
    //           $function: {
    //             body: function (data) {
    //               let count = data[1].value > 0 || data[1] !== null ? 1 : 0;
    //               return count;
    //             },
    //             args: ["$dataParam"],
    //             lang: "js",
    //           },
    //         },
    //         TSS: {
    //           $function: {
    //             body: function (data) {
    //               let count = data[2].value > 0 || data[2] !== null ? 1 : 0;
    //               return count;
    //             },
    //             args: ["$dataParam"],
    //             lang: "js",
    //           },
    //         },
    //         NH3N: {
    //           $function: {
    //             body: function (data) {
    //               let count = data[3].value > 0 || data[3] !== null ? 1 : 0;
    //               return count;
    //             },
    //             args: ["$dataParam"],
    //             lang: "js",
    //           },
    //         },
    //         Debit: {
    //           $function: {
    //             body: function (data) {
    //               let count = data[4].value > 0 || data[4] !== null ? 1 : 0;
    //               return count;
    //             },
    //             args: ["$dataParam"],
    //             lang: "js",
    //           },
    //         },
    //       },
    //     },
    //   ];
    // if (unit == "jam") {
    //   count = await dataSensorDB.aggregate(countQuery);
    // } else if (unit == "hari") {
    //   count = await dataHourlySensorDB.aggregate(countQuery);
    // } else {
    //   count = await dataDaySensorDB.aggregate(countQuery);
    // }

    // let pH = count.reduce(function (_this, val) {
    //     return _this + val.pH;
    //   }, 0),
    //   COD = count.reduce(function (_this, val) {
    //     return _this + val.COD;
    //   }, 0),
    //   TSS = count.reduce(function (_this, val) {
    //     return _this + val.TSS;
    //   }, 0),
    //   NH3N = count.reduce(function (_this, val) {
    //     return _this + val.NH3N;
    //   }, 0),
    //   Debit = count.reduce(function (_this, val) {
    //     return _this + val.Debit;
    //   }, 0),

    let pH = dataPemenuhan.find((val) => val.name == "pH")["sum"],
      COD = dataPemenuhan.find((val) => val.name == "COD")["sum"],
      TSS = dataPemenuhan.find((val) => val.name == "TSS")["sum"],
      NH3N = dataPemenuhan.find((val) => val.name == "NH3N")["sum"],
      Debit = dataPemenuhan.find((val) => val.name == "Debit")["sum"];
    // date = dataSensor[i].timestamp * 1000,
    // dt = new Date(date);
    // dt = moment(moment(dt)).format("DD MMMM YYYY, HH:mm");
    ws.cell(col, 1).string((i + 1).toString());
    ws.cell(col, 2).string(dataSensor[i].compDetails.compName);
    ws.cell(col, 3).string(dataSensor[i].compDetails.compType);
    ws.cell(col, 4).string(dataSensor[i].provDetails.provName);
    ws.cell(col, 5).string(dataSensor[i].kabkotDetails.kabkotName);
    // ws.cell(col, 6).string(dt.toString());
    ws.cell(col, 6).string(
      moment
        .unix(dataSensor[i].timestamp)
        .format("DD MMMM YYYY, HH:mm")
        .toString()
    );
    ws.cell(col, 7).string(dataSensor[i].formregis[0].teknis.frequenceDet);
    ws.cell(col, 8).string(
      unit == "jam"
        ? "30"
        : unit == "hari"
        ? dataSensor[i].formregis[0].frekuensi.jam.toString()
        : moment(end * 1000).format("DD")
    );
    ws.cell(col, 9).string(pH.toString());
    ws.cell(col, 10).string(COD.toString());
    ws.cell(col, 11).string(TSS.toString());
    ws.cell(col, 12).string(NH3N.toString());
    ws.cell(col, 13).string(Debit.toString());
    ws.cell(col, 14).string(
      dataSensor[i].loggerDetails.logDataRange[0].max != null
        ? parseFloat(dataSensor[i].dataParam[0].value).toFixed(4).toString()
        : "-"
    );
    ws.cell(col, 15).string(
      dataSensor[i].loggerDetails.logDataRange[0].max != null
        ? dataSensor[i].loggerDetails.logDataRange[0].min != null
          ? dataSensor[i].loggerDetails.logDataRange[0].min.toString() +
            " - " +
            dataSensor[i].loggerDetails.logDataRange[0].max.toString()
          : "0 - " + dataSensor[i].loggerDetails.logDataRange[0].max.toString()
        : "-"
    );
    ws.cell(col, 16).string(
      dataSensor[i].loggerDetails.logDataRange[1].max != null
        ? parseFloat(dataSensor[i].dataParam[1].value).toFixed(4).toString()
        : "-"
    );
    ws.cell(col, 17).string(
      dataSensor[i].loggerDetails.logDataRange[1].max != null
        ? dataSensor[i].loggerDetails.logDataRange[1].min != null
          ? dataSensor[i].loggerDetails.logDataRange[1].min.toString() +
            " - " +
            dataSensor[i].loggerDetails.logDataRange[1].max.toString()
          : "0 - " + dataSensor[i].loggerDetails.logDataRange[1].max.toString()
        : "-"
    );
    ws.cell(col, 18).string(
      dataSensor[i].loggerDetails.logDataRange[2].max != null
        ? parseFloat(dataSensor[i].dataParam[2].value).toFixed(4).toString()
        : "-"
    );
    ws.cell(col, 19).string(
      dataSensor[i].loggerDetails.logDataRange[2].max != null
        ? dataSensor[i].loggerDetails.logDataRange[2].min != null
          ? dataSensor[i].loggerDetails.logDataRange[2].min.toString() +
            " - " +
            dataSensor[i].loggerDetails.logDataRange[2].max.toString()
          : "0 - " + dataSensor[i].loggerDetails.logDataRange[2].max.toString()
        : "-"
    );
    ws.cell(col, 20).string(
      dataSensor[i].loggerDetails.logDataRange[3].max != null
        ? parseFloat(dataSensor[i].dataParam[3].value).toFixed(4).toString()
        : "-"
    );
    ws.cell(col, 21).string(
      dataSensor[i].loggerDetails.logDataRange[3].max != null
        ? dataSensor[i].loggerDetails.logDataRange[3].min != null
          ? dataSensor[i].loggerDetails.logDataRange[3].min.toString() +
            " - " +
            dataSensor[i].loggerDetails.logDataRange[3].max.toString()
          : "0 - " + dataSensor[i].loggerDetails.logDataRange[3].max.toString()
        : "-"
    );
    ws.cell(col, 22).string(
      dataSensor[i].loggerDetails.logDataRange[4].max != null
        ? parseFloat(dataSensor[i].dataParam[4].value).toFixed(4).toString()
        : "-"
    );
    ws.cell(col, 23).string(
      dataSensor[i].loggerDetails.logDataRange[4].max != null
        ? dataSensor[i].loggerDetails.logDataRange[4].min != null
          ? dataSensor[i].loggerDetails.logDataRange[4].min.toString() +
            " - " +
            dataSensor[i].loggerDetails.logDataRange[4].max.toString()
          : "0 - " + dataSensor[i].loggerDetails.logDataRange[4].max.toString()
        : "-"
    );

    // beban

    // COD
    ws.cell(col, 24).string(
      dataSensor[i].loggerDetails.logDataRange[1].max != null
        ? parseFloat(
            dataSensor[i].dataParam[4].value * dataSensor[i].dataParam[1].value
          )
            .toFixed(4)
            .toString()
        : "0"
    );

    // TSS
    ws.cell(col, 25).string(
      dataSensor[i].loggerDetails.logDataRange[2].max != null
        ? parseFloat(
            dataSensor[i].dataParam[4].value * dataSensor[i].dataParam[2].value
          )
            .toFixed(4)
            .toString()
        : "0"
    );

    // TSS
    ws.cell(col, 26).string(
      dataSensor[i].loggerDetails.logDataRange[3].max != null
        ? parseFloat(
            dataSensor[i].dataParam[4].value * dataSensor[i].dataParam[3].value
          )
            .toFixed(4)
            .toString()
        : "0"
    );
  }

  wb.write(`List Laporan Data Per${unit}.xlsx`, res);
};

module.exports = { laporanExportService };
