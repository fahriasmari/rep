<template>
  <div>
    <div id="listed-report">
      <div
        class="
          d-flex
          align-items-center
          overflow-hidden
          position-absolute
          w-100
        "
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1"
      >
        <h1 class="display-3 font-weight-light text-white m-0">Laporan</h1>
        <h2 class="text-white mx-4 my-0">-</h2>
        <h4 class="text-default m-0">Data Perjam</h4>
      </div>
      <base-header class="pb-8" type="primary"></base-header>

      <div class="container-fluid mt--7">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="card">
              <!-- Filter -->
              <div class="p-3 w-100">
                <!-- Level: Nasional -->
                <div class="row">
                  <div class="col-12">
                    <base-input
                      v-model="token"
                      class="w-100"
                      size="md"
                      type="primary"
                      placeholder="TOKEN KEMNAKER"
                    ></base-input>
                  </div>
                  <div class="col-2">
                    <div class="row col-2"></div>
                    <base-input class="w-100" size="md" type="primary">
                      <el-select
                        :placeholder="selectedLink.name"
                        @change="getPageInfo(selectedLink.link)"
                        v-model="selectedLink"
                        value-key="link"
                      >
                        <el-option
                          v-for="item in optionLink"
                          :key="item.label"
                          :value="item.value"
                          :label="item.label"
                        >
                        </el-option>
                      </el-select>
                    </base-input>
                    <p>
                      {{ selectedLink.name }} - Total Page {{ pageLength }} -
                      Estimate Total Data {{ pageLength * 50 }}
                    </p>
                  </div>
                  <div class="col-2">
                    <base-button
                      class="w-100"
                      size="md"
                      type="primary"
                      @click="loopGetDataTrainee(pageLength)"
                      >Get Data Trainee</base-button
                    >
                  </div>
                  <div class="col-2">
                    <base-button
                      class="w-100"
                      size="md"
                      type="primary"
                      @click="loopGetDataVoucher(pageLength)"
                      >Get Data Voucher</base-button
                    >
                  </div>
                  <div class="col-2">
                    <base-input
                      class="w-100"
                      placeholder="Nama CSV"
                      size="md"
                      type="primary"
                      v-model="csvName"
                    ></base-input>
                  </div>
                  <div class="col-2">
                    <base-button
                      class="w-100"
                      size="md"
                      type="primary"
                      @click="downloadData(tableData, csvName)"
                      >Download</base-button
                    >
                  </div>
                </div>
              </div>
              <!-- Table -->
              <el-table
                :data="queriedData"
                row-key="id"
                header-row-class-name="thead-light"
                @sort-change="sortChange"
                @selection-change="selectionChange"
              >
                <el-table-column
                  label="Nama User"
                  prop="nama_user"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  label="Email User"
                  prop="email_user"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  label="Phone User"
                  prop="phone_user"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  label="Status User"
                  prop="status_user"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  label="Rating User"
                  prop="rating_user"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  label="Review User"
                  prop="reveiew_user"
                  min-width
                  sortable
                ></el-table-column>
              </el-table>
              <div
                slot="footer"
                class="
                  col-12
                  my-2
                  d-flex
                  justify-content-center justify-content-sm-between
                  flex-wrap
                "
              >
                <div class="d-flex align-items-center">
                  <p class="card-category mb-0 mr-2">Show</p>
                  <div style="width: 80px">
                    <el-select
                      class="select-primary pagination-select"
                      v-model="pagination.perPage"
                      placeholder="Per page"
                      size="mini"
                    >
                      <el-option
                        class="select-primary"
                        v-for="item in pagination.perPageOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </div>
                  <p class="card-category m-0 ml-2">
                    Showing {{ from + 1 }} to {{ to }} of {{ total }} entries
                    <span v-if="selectedRows.length"
                      >&nbsp; &nbsp; {{ selectedRows.length }} rows
                      selected</span
                    >
                  </p>
                </div>
                <base-pagination
                  class="pagination-no-border"
                  v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total="total"
                ></base-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { BasePagination, BaseInput } from "@/components";
import clientPaginationMixin from "@/components/clientPaginationMixin";
import moment from "moment";
import flatPicker from "vue-flatpickr-component";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.css";
import "sweetalert2/dist/sweetalert2.css";
import Loading from "vue-loading-overlay";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import defaults from "@/util/defaults";

// const token =
//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJjbGllbnQiOiI5YTQyYmQxYy1jZWYyLTQ0MjctYjk1OC01MGJkODQ3NmU5YWMiLCJ1c2VyIjoiYTgxMzdkYTQtMTljMi00NDg2LTlhZTktNDNhZjVhN2NlZTIwIiwidHRsIjoyMTYwMCwic3ViIjoiN2MxZWYwYTItMjM4ZC00MDViLWFjM2ItMzg0ZjQ3ZDA4MmU3IiwiYXVkIjoiOWE0MmJkMWMtY2VmMi00NDI3LWI5NTgtNTBiZDg0NzZlOWFjIiwiZmluZ2VycHJpbnQiOiI2ZjJmNDYwNjI2NWQ4OTk5NTY3NTBiZDI3MDVjZTc1Y2YzNWY3ZTM0In0.kNcgypfj0iVD2ND2RRtKW_zjOa6aU2m2AodJzFi2AoLKfNFuAiQVKjUpHFkfktqQUYkjFfjE3fetUQTkBrlMzv4Ubl3pY_RDuOwSyvv2DY_iVgYRJqiXQOjuJypBtiAlzT4z5ZC8HRzlfHnuBO4DTJx4twVYNl2UT8FiVW4lLwEErTcdzEEN_niJvI4sK9CsEfnql1Eo4oLgCxdT5N0tivP0KM_M0TSdmHzi4z2p9g4-koOP8Bm4YCmSWZFlbpvjDxfQBTcpp1APFycn9Lh5bHcA0cx_q4iyXcqdFsS22U0mLcjk9zXTOwm82mbzQHvBY7fskBYS4d8thcO0NSp4-BDFghsTh9qf0TQMkjytbHZ58uyGyFadY7T2iOMmKAqe5xIYVHQnDxRVU8bv1qyQsdzj-wrbIoGgYtsfQcfQHil1jARpNYEvvIV86IynpaBJtrYZKy-R22FsAenBNS52ekYCZA3avBhhYeV8mnQBjD75aCNllhMC49Z0Ii_cSIYXfM-nq2zCzGhUjR-hJsnkBLQrRJZHUmkm0RlCfCE1ulkcOAj7z_pz0oBZznDhnYhhl4vaWsW6CeWqHMgXoCWVUMpFewX4Hn0GEPFxo8gRkrUe4otL-k3nsgN2Tl8dVOVDfJX1Ddr6urK6kztBZjlkrBKDmKAAUOZUpwSnTCRt1JI";
const linkTrainee = {
  GD: "https://pelatihan-api.kemnaker.go.id/v1/trainings/6a8f2215-679b-49e0-b412-f320d0dacf3a/trainees?page=",
  CW: "https://pelatihan-api.kemnaker.go.id/v1/trainings/ab52e2b2-9216-4cb2-8fa7-4893fd74be7a/trainees?page=",
  YCC: "https://pelatihan-api.kemnaker.go.id/v1/trainings/8085f6e3-7a7a-40d4-aaab-20c1411a97b7/trainees?page=",
};
const linkVoucher = {
  GD: "https://pelatihan-api.kemnaker.go.id/v1/trainings/6a8f2215-679b-49e0-b412-f320d0dacf3a/vouchers?page=",
  CW: "https://pelatihan-api.kemnaker.go.id/v1/trainings/ab52e2b2-9216-4cb2-8fa7-4893fd74be7a/vouchers?page=",
  YCC: "https://pelatihan-api.kemnaker.go.id/v1/trainings/8085f6e3-7a7a-40d4-aaab-20c1411a97b7/vouchers?page=",
};
// console.log(linkTrainee.CW);
// const config = {
//   headers: {
//     Authorization: `Bearer ${token}`
//   }
// };

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary",
    cancelButton: "btn btn-secondary",
  },
  buttonsStyling: false,
});

const axios = require("axios");
const tempAllData = {};
export default {
  mixins: [clientPaginationMixin],
  components: {
    linkTrainee,
    linkVoucher,
    tempAllData,
    Loading,
    BasePagination,
    BaseInput,
    flatPicker,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      selectedLink: {},
      optionLink: [
        {
          label: "Copywriter Trainee",
          value: { link: linkTrainee.CW, name: "Copywriter_Trainee" },
        },
        {
          label: "Copywriter Voucher",
          value: { link: linkVoucher.CW, name: "Copywriter_Voucher" },
        },
        {
          label: "Graphic Designer Trainee",
          value: { link: linkTrainee.GD, name: "Graphic Designer_Trainee" },
        },
        {
          label: "Graphic Designer Voucher",
          value: { link: linkVoucher.GD, name: "Graphic Designer_Voucher" },
        },
        {
          label: "Youtube Trainee",
          value: { link: linkTrainee.YCC, name: "Youtube Trainee" },
        },
        {
          label: "Youtube Voucher",
          value: { link: linkVoucher.YCC, name: "Youtube Voucher" },
        },
      ],
      csvName: "",
      token: "",
      linkTrainee,
      linkVoucher,
      pageLength: 1,
      arrayUserDB: [],
      dataPemenuhan: [],
      companyData: {},
      arrayBody: [],
      allListData: {},
      selectedRows: [],
      tableData: [],
    };
  },
  computed: {
    config() {
      let dataToken = {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      return dataToken;
    },
    csvData() {
      let csvTable = [];
      let tempTable = this.filteredData;
      let tableLength = tempTable.length;

      for (let i = 0; i < tableLength; i++) {
        csvTable.push({
          "NAMA INDUSTRI": tempTable[i].compDetails.compName,
          "JENIS INDUSTRI": tempTable[i].compDetails.compType,
          PROVINSI: tempTable[i].provDetails.provName,
          "KAB/KOT": tempTable[i].kabkotDetails.kabkotName,
        });
      }

      return csvTable;
    },
  },
  methods: {
    loopGetDataTrainee(length) {
      this.arrayUserDB = [];
      this.tableData = [];
      for (let i = 1; i <= length; i++) {
        this.getDataKemnakerTrainee(this.selectedLink.link, i);
      }
      this.tableData = this.arrayUserDB;
    },
    loopGetDataVoucher(length) {
      this.arrayUserDB = [];
      this.tableData = [];
      for (let i = 1; i <= length; i++) {
        this.getDataKemnakerVoucher(this.selectedLink.link, i);
      }
      this.tableData = this.arrayUserDB;
    },
    getPageInfo(link) {
      axios.get(link, this.config).then((res) => {
        this.pageLength = res.data.meta.pagination.last_page;
        console.log(this.pageLength);
        this.csvName = this.selectedLink.name + moment().format("_DD-MM-YYYY");
      });
    },
    getDataKemnakerTrainee(link, page) {
      axios
        .get(link + page, this.config)
        .then((res) => {
          let tempData = res.data.data;
          tempData.forEach((data) => {
            this.arrayUserDB.push({
              nama_user: data.trainee ? data.trainee.user.name : "",
              email_user: data.trainee ? data.trainee.user.email : "",
              phone_user: data.trainee.user.profile
                ? data.trainee.user.profile.phone
                : "",
              status_user:
                data.graduated == null ? "Belum lulus" : "Sudah lulus",
              rating_user: data.rating == 0 ? "Belum rating" : "Sudah rating",
              reveiew_user:
                data.review == null ? "Belum review" : "Sudah review",
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDataKemnakerVoucher(link, page) {
      axios
        .get(link + page, this.config)
        .then((res) => {
          // console.log(res.data.data);
          let tempData = res.data.data;
          tempData.forEach((data) => {
            // console.log(data);
            this.arrayUserDB.push({
              career_track: this.selectedLink.name,
              code_voucher: data.code,
              status_voucher: data.used ? "Terpakai" : "Belum",
              nama_user:
                data.used && data.training_trainee != null
                  ? data.training_trainee.trainee.user.name
                  : "",
              email_user:
                data.used && data.training_trainee != null
                  ? data.training_trainee.trainee.user.email
                  : "",

              // status_user: data.graduated,
              // rating_user: data.rating,
              // reveiew_user: data.review
              status_user:
                data.used &&
                data.training_trainee != null &&
                data.training_trainee.graduated == null
                  ? "Belum lulus"
                  : "Sudah lulus",
              rating_user:
                data.used &&
                data.training_trainee != null &&
                data.training_trainee.rating == 0
                  ? "Belum rating"
                  : "Sudah rating",
              reveiew_user:
                data.used &&
                data.training_trainee != null &&
                data.training_trainee.review == null
                  ? "Belum review"
                  : "Sudah review",
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getTime(time) {},
    test() {
      this.selected.kabkot = "";
    },
    changeJenisIndustri(jenisIndustri) {
      const allData = JSON.parse(localStorage.getItem("allList"));
      if (jenisIndustri === "" || jenisIndustri === null) {
        this.arrayBody[0] = "";
        this.getTableData();
        return;
      }
      this.arrayBody[0] = "type=" + jenisIndustri;
      this.getTableData();
    },
    changeListProv(prov) {
      const allData = JSON.parse(localStorage.getItem("allList"));
      if (prov === "" || prov === null) {
        this.arrayBody[1] = "";
        this.arrayBody[2] = "";
        this.selected.kabkot = null;
        this.selected.comp = null;
        this.options = allData;
        this.getTableData();
        return;
      }
      const foundProv = allData.provList.find((data) => data.name === prov);

      const tempKabkotList = allData.kabkotList.filter(
        (data) => data.provID === foundProv._id
      );
      const tempCompList = allData.compList.filter(
        (data) => data.provID === foundProv._id
      );
      this.options.kabkotList = tempKabkotList;
      this.options.compList = tempCompList;
      this.arrayBody[0] = "prov=" + prov;
      this.getTableData();
    },
    changeListKabkot(kabkot) {
      const allData = JSON.parse(localStorage.getItem("allList"));
      if (kabkot === "" || kabkot === null) {
        this.arrayBody[1] = "";
        this.arrayBody[2] = "";
        this.selected.comp = null;
        this.options.compList = allData.compList;
        this.getTableData();
        return;
      }
      let foundKabkot = allData.kabkotList.find((data) => data.name === kabkot);
      this.options.compList = allData.compList.filter(
        (data) => data.kabkotID === foundKabkot._id
      );
      this.arrayBody[1] = "kabkot=" + kabkot;
      this.getTableData();
    },
    changeListComp(comp) {
      const allData = JSON.parse(localStorage.getItem("allList"));
      if (comp === "" || comp === null) {
        this.arrayBody[2] = "";
        this.getTableData();
        return;
      }
      let foundComp = allData.compList.find((data) => data.name === comp);
      this.arrayBody[2] = "comp=" + comp;
      this.getTableData();
    },
    getList() {
      const auth = JSON.parse(localStorage.getItem("auth-data"));
      axios
        .get(`${defaults.baseURL}/report/list/${auth._id}`, {
          headers: { token: this.$store.state.token },
        })
        .then((res) => {
          let tempAllListData = res.data;
          tempAllListData.provList.unshift({ name: "All", value: "" });
          tempAllListData.kabkotList.unshift({ name: "All", value: "" });
          tempAllListData.compList.unshift({ name: "All", value: "" });
          localStorage.setItem("allList", JSON.stringify(tempAllListData));
          this.options = tempAllListData;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getTableData() {
      let loader = this.$loading.show({ loader: "dots" });
      const auth = JSON.parse(localStorage.getItem("auth-data"));

      axios
        .get(`${defaults.baseURL}/report/hourly/${auth._id}?${params.join("&")}`,
          { headers: { token: this.$store.state.token } }
        )
        .then((res) => {
          this.companyData = res.data.profile;
          this.tableData = res.data.dataSensor;
          this.dataPemenuhan = res.data.dataPemenuhan;
          loader.hide();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    downloadData(data, name) {
      swalWithBootstrapButtons
        .fire({
          title: "Download Data",
          text: "Please choose what type of file do you want",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "CSV",
          cancelButtonText: "PDF",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.value) {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += [
              Object.keys(data[0]).join(";"),
              ...data.map((item) => Object.values(item).join(";")),
            ]
              .join("\n")
              .replace(/(^\[)|(\]$)/gm, "");

            const tempData = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", tempData);
            link.setAttribute("download", name + ".csv");
            link.click();
            swalWithBootstrapButtons.fire(
              "Export Success",
              "Your file has been exported.",
              "success"
            );
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            let headerPDF = [];
            let tempTablePDF = [];
            let pdfName = "exportKLHK";
            var doc = new jsPDF("l", "mm", "a4");

            let titleText = "Laporan - " + this.$store.state.auth.name;
            doc.text(titleText, 15, 10);
            if (this.$store.state.auth.level === 0) {
              headerPDF = [
                "No",
                "NAMA INDUSTRI",
                "JENIS INDUSTRI",
                "PROVINSI",
                "KAB/KOT",
                "WAKTU",
                "pH",
                "COD (mg/l)",
                "TSS (mg/l)",
                "NH3N (mg/l)",
                "Debit (m3/h)",
                "Beban COD (kg/h)",
                "Bebas TSS (kg/h)",
              ];
              for (let i = 0; i < data.length; i++) {
                var arrayTemp = [
                  [i],
                  data[i]["NAMA INDUSTRI"],
                  data[i]["JENIS INDUSTRI"],
                  data[i]["PROVINSI"],
                  data[i]["KAB/KOT"],
                  data[i]["WAKTU"],
                  data[i]["pH"],
                  data[i]["COD (mg/l)"],
                  data[i]["TSS (mg/l)"],
                  data[i]["NH3N (mg/l)"],
                  data[i]["Debit (m3/h)"],
                  data[i]["Beban COD (kg/h)"],
                  data[i]["Bebas TSS (kg/h)"],
                ];
                tempTablePDF.push(arrayTemp);
              }
            }
            if (this.$store.state.auth.level === 1) {
              headerPDF = [
                "No",
                "NAMA INDUSTRI",
                "JENIS INDUSTRI",
                "KAB/KOT",
                "WAKTU",
                "pH",
                "COD (mg/l)",
                "TSS (mg/l)",
                "NH3N (mg/l)",
                "Debit (m3/h)",
                "Beban COD (kg/h)",
                "Bebas TSS (kg/h)",
              ];
              for (let i = 0; i < data.length; i++) {
                var arrayTemp = [
                  [i],
                  data[i]["NAMA INDUSTRI"],
                  data[i]["JENIS INDUSTRI"],
                  data[i]["KAB/KOT"],
                  data[i]["WAKTU"],
                  data[i]["pH"],
                  data[i]["COD (mg/l)"],
                  data[i]["TSS (mg/l)"],
                  data[i]["NH3N (mg/l)"],
                  data[i]["Debit (m3/h)"],
                  data[i]["Beban COD (kg/h)"],
                  data[i]["Bebas TSS (kg/h)"],
                ];
                tempTablePDF.push(arrayTemp);
              }
            }
            if (this.$store.state.auth.level === 2) {
              headerPDF = [
                "No",
                "NAMA INDUSTRI",
                "JENIS INDUSTRI",
                "WAKTU",
                "pH",
                "COD (mg/l)",
                "TSS (mg/l)",
                "NH3N (mg/l)",
                "Debit (m3/h)",
                "Beban COD (kg/h)",
                "Bebas TSS (kg/h)",
              ];
              for (let i = 0; i < data.length; i++) {
                var arrayTemp = [
                  [i],
                  data[i]["NAMA INDUSTRI"],
                  data[i]["JENIS INDUSTRI"],
                  data[i]["WAKTU"],
                  data[i]["pH"],
                  data[i]["COD (mg/l)"],
                  data[i]["TSS (mg/l)"],
                  data[i]["NH3N (mg/l)"],
                  data[i]["Debit (m3/h)"],
                  data[i]["Beban COD (kg/h)"],
                  data[i]["Bebas TSS (kg/h)"],
                ];
                tempTablePDF.push(arrayTemp);
              }
            }
            if (this.$store.state.auth.level === 3) {
              headerPDF = [
                "No",
                "WAKTU",
                "pH",
                "COD (mg/l)",
                "TSS (mg/l)",
                "NH3N (mg/l)",
                "Debit (m3/h)",
                "Beban COD (kg/h)",
                "Bebas TSS (kg/h)",
              ];
              for (let i = 0; i < data.length; i++) {
                var arrayTemp = [
                  [i],
                  data[i]["WAKTU"],
                  data[i]["pH"],
                  data[i]["COD (mg/l)"],
                  data[i]["TSS (mg/l)"],
                  data[i]["NH3N (mg/l)"],
                  data[i]["Debit (m3/h)"],
                  data[i]["Beban COD (kg/h)"],
                  data[i]["Bebas TSS (kg/h)"],
                ];
                tempTablePDF.push(arrayTemp);
              }
            }
            if (
              (this.selected.comp !== "" &&
                this.selected.comp !== "All" &&
                this.selected.comp !== null &&
                this.selected.comp !== undefined) ||
              this.$store.state.auth.level === 3
            ) {
              let headerProfile = ["", ""];
              let tempProfie = this.companyData;
              let bodyProfile = [
                ["NAMA INDUSTRI", tempProfie.compName],
                ["ALAMAT", tempProfie.compAddres],
                ["LATITUDE", tempProfie.latlong.lat],
                ["LONGITUDE", tempProfie.latlong.long],
                ["NOMOR TELEPON", tempProfie.compTlp],
                ["EMAIL", tempProfie.userEmail],
                ["JENIS USAHA", tempProfie.compType],
                ["SUMBER LIMBAH", tempProfie.compWasteSource],
                ["TEKNOLOGI PENGOLAHAN LIMBAH", tempProfie.compTech],
                ["NO. IZIN", tempProfie.compPermit],
                ["INSTANSI PENERBIT", tempProfie.compInstance],
                ["TANGGAL TERBIT IZIN", tempProfie.compPermitDate],
              ];
              doc.autoTable({
                theme: "plain",
                body: bodyProfile,
                columnStyles: {
                  0: {
                    fontStyle: "bold",
                    halign: "right",
                    cellWidth: 100,
                    fillColor: [246, 249, 252],
                  },
                  1: { cellWidth: 165 },
                },
                styles: {
                  cellPadding: 2,
                  textColor: [41, 102, 75],
                  // font: "times",
                  lineWidth: 0.1,
                  lineColor: [240, 240, 240],
                  halign: "left",
                },
              });
            }

            doc.autoTable({
              head: [headerPDF],
              theme: "striped",
              body: tempTablePDF,
              headStyles: {
                fillColor: [41, 102, 75],
              },
              styles: {
                lineWidth: 0.2,
                halign: "center",
              },
            });

            if (
              (this.selected.comp !== "" &&
                this.selected.comp !== "All" &&
                this.selected.comp !== null &&
                this.selected.comp !== undefined) ||
              this.$store.state.auth.level === 3
            ) {
              let tempCompID = "";
              if (this.$store.state.auth.level == 3) {
                tempCompID = this.$store.state.userData._id;
              } else {
                tempCompID = this.selected.comp;
              }

              let tempPemenuhan = this.dataPemenuhan;

              let headerPemenuhan = [];
              let pemenuhanTable = [];
              headerPemenuhan = [
                "No",
                "Pemantauan terus menerus dalam jaringan",
                "Jumlah Data yang Memenuhi Baku Mutu Air Limbah",
                "Presentase Pemenuhan Baku Mutu Air Limbah",
              ];
              for (let i = 0; i < tempPemenuhan.length; i++) {
                var arrayPemenuhan = [
                  [i + 1],
                  tempPemenuhan[i]["name"],
                  tempPemenuhan[i]["sum"],
                  tempPemenuhan[i]["precentage"],
                ];
                pemenuhanTable.push(arrayPemenuhan);
              }
              doc.autoTable({
                head: [headerPemenuhan],
                theme: "striped",
                body: pemenuhanTable,
                headStyles: {
                  fillColor: [41, 102, 75],
                },
                styles: {
                  lineWidth: 0.2,
                  halign: "center",
                },
              });
            }

            doc.save("exportKLHK.pdf");
            doc = new jsPDF("l", "mm", "a4");

            swalWithBootstrapButtons.fire(
              "Congratulations",
              "PDF will be downloaded shortly",
              "success"
            );
          }
        });
    },
    unixTS2DMY(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY, HH:mm");
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
  },
  created() {},
  watch: {
    selectedTime() {
      let tempTime = this.selectedTime;
      let tempStart = tempTime.slice(0, 10);
      let tempEnd = "";

      if (tempTime.length > 10) {
        tempEnd = tempTime.slice(14, 24);
      }
      this.arrayBody[3] = "start=" + tempStart;
      this.arrayBody[4] = "end=" + tempEnd;
      this.getTableData();
    },
    tableData() {},
    allListData() {},
  },
};
</script>
<style scoped>
.no-border-card .card-footer {
  border-top: 0;
}
.pagin {
  box-shadow: none;
  margin: 0 10px 0 10px;
  border-color: #b4cce1;
  border-radius: 10%;
  width: 66px;
  text-align: center;
  height: 30px;
}
</style>

<style lang="scss">
#listed-report {
  .m-0 {
    .form-group {
      margin: 0;
    }
  }
  .el-table {
    .cell {
      word-break: break-word;
    }
    th.is-right {
      .cell {
        display: flex;
        flex-flow: row;
        justify-content: flex-end;
      }
    }
    th.is-center {
      .cell {
        display: flex;
        flex-flow: row;
        justify-content: center;
      }
    }
  }
  .el-select--mini {
    .el-input--mini {
      input {
        height: 28px;
      }
    }
  }
}
</style>
