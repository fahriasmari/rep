# APIs

## [analytics.js](routes/analytics.js)

1. GET /analytics/list
1. GET /analytics/data


## [announce.js](routes/announce.js)

1. GET /ann/
1. POST /ann/
1. PUT /ann/:id
1. DELETE /ann/:id

## [beritaacara.js](routes/beritaacara.js)

1. GET /beritaacara/:userId
1. POST /beritaacara
1. PUT /beritaacara/:beritaAcaraId
1. DELETE /beritaacara/:beritaAcaraId

## [company.js](routes/company.js)

1. DELETE /comp/:id
1. POST /comp/
1. PUT /comp/:id
1. GET /comp/list
1. GET /comp/list-export
1. GET /comp/listComp
1. GET /comp/listCompID

## [condreport.js](routes/condreport.js)

1. GET /condreport/list/:userID
1. GET /condreport/export
1. POST /condreport/
1. GET /condreport/:condReportsID
1. PUT /condreport/:condReportsID
1. DELETE /condreport/:condReportsID
1. POST /condreport/validasi/:condReportsID
1. GET /condreport/validasi/:condReportsID

## [covid.js](routes/covid.js)

1. GET /covid/list
1. GET /covid/export
1. POST /covid
1. GET /covid/:covidFormID
1. PUT /covid (_id = covidFormID)
1. DELETE /covid/:covidFormID

## [dashboard.js](routes/dashboard.js)

1. GET /dash/data/:id


## [dashboardAdmin.js](routes/dashboardAdmin.js)

1. GET /api/v1/dashboardadmin/list


## [error.js](routes/error.js)

1. GET /error/list/:id
1. GET /error/list-recent/:id
1. GET /error/notif/:id
1. GET /error/recap/:id
1. GET /error/recap-export/:id
1. GET /error/recapDay/:id
1. GET /error/recapDay-export/:id


## [faq.js](routes/fdq.js)

1. GET /faq/list
1. POST /faq/create
1. PUT /faq/update
1. DELETE /faq/delete/:id
1. GET /faq/category


## [file.js](routes/file.js)

1. POST /file


## [form.js](routes/form.js)

1. ~~POST /form/pendaftaran~~ (to be moved to /pendaftaran)
1. ~~GET /form/pendaftaran-get/:id~~ (to be moved to /pendaftaran)
1. ~~PUT /form/pendaftaran-update~~ (to be moved to /pendaftaran)
1. ~~GET /form/covid-get/:id~~ (to be moved to /covid)
1. ~~PUT /form/covid-update~~ (to be moved to /covid)
1. ~~POST /form/covid~~ (to be moved to /covid)
1. ~~GET /form/covid~~ (to be moved to /covid)
1. ~~GET /form/covid-export~~ (to be moved to /covid)
1. ~~DELETE /form/:id~~ (to be moved to /pendaftaran)
1. ~~DELETE /form/delete-form/:id~~ (to be moved to /pendaftaran)
1. ~~GET /form//list-histori-pendaftaran/:id~~ (to be moved to /pendaftaran)
1. ~~GET /form//list-pendaftaran~~ (to be moved to /pendaftaran)
1. ~~GET /form//list-pendaftaran-export~~ (to be moved to /pendaftaran)
1. ~~GET /form//list-validation~~ (to be moved to /pendaftaran)
1. ~~GET /form//detail-pendaftaran/:id~~ (to be moved to /pendaftaran)
1. ~~GET /form//history-company/:id~~ (to be moved to /pendaftaran)
1. ~~PUT /form//validate-pendaftaran/:id~~ (to be moved to /pendaftaran)
1. ~~PUT /form//reject-pendaftaran/:id~~ (to be moved to /pendaftaran)
1. ~~POST /form/cond-report~~ (to be moved to /condreport)
1. ~~GET /form/cond-report/:id~~ (to be moved to /condreport)
1. ~~PUT /form/cond-report/:id~~ (to be moved to /condreport)
1. ~~DELETE /form/cond-report/:id~~ (to be moved to /condreport)
1. ~~GET /form/cond-report-all/:id~~ (to be moved to /condreport)
1. ~~GET /form/cond-report-all-report~~ (to be moved to /condreport)
1. ~~GET /form/listBeritaAcara/:id~~ (to be moved to /beritaacara)
1. ~~POST /form/beritaAcara~~ (to be moved to /beritaacara)
1. ~~PUT /form/beritaAcara/:id~~ (to be moved to /beritaacara)
1. ~~DELETE /form/beritaAcara/:id~~ (to be moved to /beritaacara)


## [getapi.js](routes/getapi.js)

1. GET /api/getapi/get-raw
1. GET /api/getapi/kalku


## [insertSensorDay.js](routes/insertSensorDay.js)

1. GET /insertSensorDay/insert-harian
1. GET /insertSensorDay/insert-month


## [kabkot.js](routes/kabkot.js)

1. GET /kabkot/list


## [logger.js](routes/logger.js)

1. GET /logger/list
1. GET /logger/list-export
1. POST /logger/register
1. PUT /logger/logger/:id
1. GET /logger/logger-activation/:id
1. POST /logger/datarec
1. POST /logger/datarec-hour

## [pendaftaran.js](routes/pendaftaran.js)

1. POST /pendaftaran/validasi/:pendaftaranID
1. GET /pendaftaran/validasi/:pendaftaranID
1. GET /pendaftaran/documents/:companyID
1. GET /pendaftaran/list/:invalid? (if true, returns validated:false only)
1. POST /pendaftaran
1. GET /pendaftaran/:pendaftaranID
1. DELETE /pendaftaran/:pendaftaranID
1. PUT /pendaftaran


## [pengaduan.js](routes/pengaduan.js)

1. GET /pengaduan/list/:userID
1. GET /pengaduan/:pengaduanID
1. PUT /pengaduan
1. PUT /pengaduan/tanggapan/:pengaduanID
1. DELETE /pengaduan/:pengaduanID

## [projectSites.js](routes/projectSites.js)

1. GET /pj/map/:id
1. GET /pj/data/:id


## [provinsi.js](routes/provinsi.js)

1. GET /prov/list


## [publikasi.js](routes/publikasi.js)

1. GET /api/v1/publikasi/list
1. POST /api/v1/publikasi/create
1. PUT /api/v1/publikasi/update
1. DELETE /api/v1/publikasi/delete/:id


## [recronjob.js](routes/recronjob.js)

1. POST /recronjob
1. POST /recronjob/all


## [report.js](routes/report.js)

1. GET /report/list-new/:id
1. GET /report/list/:id
1. GET /report/list-regiscomp/:id
1. GET /report/raw/:id
1. GET /report/hourly/:id
1. GET /report/hourly-export/:id
1. GET /report/hourly-download/:id
1. GET /report/listpengiriman/:id
1. GET /report/listpengiriman-download/:id
1. GET /report/infografis


## [simpelv1.js](routes/simpelv1.js.js)

1. GET /simpel/list-pendaftaran
1. GET /simpel/daftar-pendaftaran
1. GET /simpel/data-harian
1. GET /simpel/data-bulanan


## [ujikonek.js](routes/ujikonek.js)

1. GET /api/v1/ujikonek/list/:id
1. GET /api/v1/ujikonek/list
1. POST /api/v1/ujikonek/create
1. GET /api/v1/ujikonek/status/:id
1. POST /api/v1/ujikonek/validasi/:ujikonekID
1. DELETE /api/v1/ujikonek/validasi/:ujikonekID/:validasiID

## [user.js](routes/user.js)

1. POST /user/
1. POST /user/login
1. PUT /user/:id
1. GET /user/list
1. GET /user/list-export
1. GET /user/cekRegis/:id

## [validasi.js](routes/validasi.js)

1. ~~PUT /validasi/:condReportsID~~ (to be moved to /condreport)
1. ~~GET /validasi/:condReportsID~~ (to be moved to /condreport)
