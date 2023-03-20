import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable'
import moment from "moment";

const setBmal = (value) => {
  if (isNaN(+value)) return "Tidak Wajib";
  return +value % 1 !== 0 ? +value.toFixed(4) : value
};

const setBebanBmal = (value, debit) => {
  if (isNaN(+value) || isNaN(+debit)) return "Tidak Wajib";
  return (value * debit * 0.001).toFixed(4);
};

const tableHeader = (type, level, multiple) => {
  return [
    "No",
    ...(level < 3 && multiple ? ["NAMA INDUSTRI"] : []),
    ...(level < 3 && multiple ? ["JENIS INDUSTRI"] : []),
    ...(level < 1 && multiple ? ["PROVINSI"] : []),
    ...(level < 2 && multiple ? ["KAB/KOT"] : []),
    "WAKTU",
    "pH",
    "COD (mg/l)",
    "TSS (mg/l)",
    "NH3N (mg/l)",
    `Debit (m3/${type})`,
    `Beban COD (kg/${type})`,
    `Beban TSS (kg/${type})`,
    `Beban NH3N (kg/${type})`
  ];
};

const tableBody = (data, level, multiple) => {
 return data.map((item, index) => {
    return [
      index + 1,
      ...(level < 3 && multiple ? [item.compDetails.compName] : []),
      ...(level < 3 && multiple ? [item.compDetails.compType] : []),
      ...(level < 1 && multiple ? [item.provDetails.provName] : []),
      ...(level < 2 && multiple ? [item.kabkotDetails.kabkotName] : []),
      moment.unix(item.timestamp).format("DD/MM/YYYY HH:mm"),
      setBmal(item.dataParam[0].value),
      setBmal(item.dataParam[1].value),
      setBmal(item.dataParam[2].value),
      setBmal(item.dataParam[3].value),
      setBmal(item.dataParam[4].value),
      setBebanBmal(item.dataParam[1].value, item.dataParam[4].value),
      setBebanBmal(item.dataParam[2].value, item.dataParam[4].value),
      setBebanBmal(item.dataParam[3].value, item.dataParam[4].value),
    ];
  });
};

const companyDetail = (data) => (
  [
    ["NAMA INDUSTRI", data.compName],
    ["PROVINSI", data.provName],
    ["KAB/KOT", data.kabkotName],
    ["ALAMAT", data.compAddres],
    ["LATITUDE", data.latlong.lat],
    ["LONGITUDE", data.latlong.lng],
    ["NOMOR TELEPON", data.compTlp],
    ["EMAIL", data.userEmail],
    ["JENIS INDUSTRI", data.compType],
    ["SUMBER LIMBAH", data.compWasteSource],
    ["TEKNOLOGI PENGOLAHAN LIMBAH", data.compTech],
    ["NO. IZIN", data.compPermit],
    ["INSTANSI PENERBIT", data.compInstance],
    ["TANGGAL TERBIT IZIN", data.compPermitDate]
  ]
);

const precentageData = (data) => {
  const precentHeader = [
    "No",
    "Pemantauan terus menerus dalam jaringan",
    "Jumlah Data yang Memenuhi Baku Mutu Air Limbah",
    "Presentase Pemenuhan Baku Mutu Air Limbah"
  ];

  const precentBody = data.map((item, index) => ([
    index + 1,
    item.name,
    item.sum,
    `${+item.precentage.split(".")[0]}%`
  ]));

  return { precentHeader, precentBody }
};

export const exportToPdf = async ({ data, type, level }) => {
  const { dataSensor, dataPemenuhan, profile } = data;
  const multiple = Object.keys(profile).length === 0;

  const pdf = new jsPDF("l", "mm", "a4");
  const companyName = !multiple ? ` - ${profile.compName}` : "";
  const pdfTitle = `Laporan Data Per${type}${companyName}`;
  pdf.text(pdfTitle, 15, 10);

  if (!multiple) {
    const companyData = {
      ...profile,
      provName: dataSensor[0].kabkotDetails.kabkotName,
      kabkotName: dataSensor[0].provDetails.provName,
    };

    await autoTable(pdf, {
      theme: "plain",
      body: companyDetail(companyData),
      columnStyles: {
        0: {
          fontStyle: "bold",
          halign: "right",
          cellWidth: 100,
          fillColor: [246, 249, 252]
        },
        1: { cellWidth: 165 }
      },
      styles: {
        cellPadding: 2,
        textColor: [41, 102, 75],
        lineWidth: 0.1,
        lineColor: [240, 240, 240],
        halign: "left"
      }
    });
  }

  await autoTable(pdf, {
    head: [tableHeader(type, level,multiple)],
    theme: "striped",
    body: tableBody(dataSensor, level, multiple),
    headStyles: { fillColor: [41, 102, 75], halign: "center", valign: "middle" },
    styles: { lineWidth: 0.2, halign: "center" },
  });

  if (!multiple) {
    const { precentHeader, precentBody } = precentageData(dataPemenuhan);

    await autoTable(pdf, {
      theme: "striped",
      head: [precentHeader],
      body: precentBody,
      headStyles: { fillColor: [41, 102, 75] },
      styles: { lineWidth: 0.2, halign: "center" }
    });
  }

  await pdf.save(pdfTitle);
};
