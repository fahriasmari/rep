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
        <h1 class="display-3 font-weight-light text-white m-0">
          Laporan Early Warning
        </h1>
        <h2 class="d-none text-white mx-4 my-0">-</h2>
        <h4 class="d-none text-default m-0">Listed Data</h4>
      </div>
      <base-header class="pb-8" type="primary"></base-header>

      <div class="container-fluid mt--7">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="card">
              <!-- Filter -->
              <div class="p-3 w-100">
                <!-- Level: Nasional -->
                <div class="row" v-if="this.$store.state.auth.level < 1">
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selects.type"
                      placeholder="Jenis Industri"
                      @change="getProv(selects.type)"
                    >
                      <el-option
                        v-for="option in selects.options.type"
                        :key="option.name"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selects.prov"
                      placeholder="Provinsi"
                      @change="getKabkot(selects.prov)"
                    >
                      <el-option
                        v-for="option in selects.options.prov"
                        :key="option.name"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selects.city"
                      placeholder="Kab/Kot"
                      @change="getComp(selects.city)"
                    >
                      <el-option
                        v-for="option in selects.options.city"
                        :key="option.name"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selects.comp"
                      placeholder="Industri"
                      @change="getCompData(selects.comp)"
                    >
                      <el-option
                        v-for="option in selects.options.comp"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <base-input class="m-0">
                      <flat-picker
                        placeholder="Waktu"
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          dateFormat: 'U',
                          allowInput: true,
                          enableTime: true,
                          altFormat: 'd/m/Y',
                          altInput: true,
                          time_24hr: true,
                          mode: 'range',
                        }"
                        class="form-control datepicker"
                        v-model="selectedTime"
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-2">
                    <base-button
                      class="w-100"
                      size="md"
                      type="primary"
                      @click="downloadData(csvData)"
                      >Download</base-button
                    >
                  </div>
                </div>
                <!-- Level: Provinsi -->
                <div class="row" v-if="this.$store.state.auth.level == 1">
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selects.type"
                      placeholder="Jenis Industri"
                      @change="getProv(selects.type)"
                    >
                      <el-option
                        v-for="option in selects.options.type"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selects.city"
                      placeholder="Kab/Kot"
                      @change="getComp(selects.city)"
                    >
                      <el-option
                        v-for="option in selects.options.city"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selects.comp"
                      placeholder="Industri"
                      @change="getCompData(selects.comp)"
                    >
                      <el-option
                        v-for="option in selects.options.comp"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-4 pr-0">
                    <base-input class="m-0">
                      <flat-picker
                        placeholder="Waktu"
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          dateFormat: 'U',
                          allowInput: true,
                          enableTime: true,
                          altFormat: 'd/m/Y',
                          altInput: true,
                          time_24hr: true,
                          mode: 'range',
                        }"
                        class="form-control datepicker"
                        v-model="selectedTime"
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-2">
                    <base-button
                      class="w-100"
                      size="md"
                      type="primary"
                      @click="downloadData(csvData)"
                      >Download</base-button
                    >
                  </div>
                </div>
                <!-- Level: Kab/Kot -->
                <div class="row" v-if="this.$store.state.auth.level == 2">
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selects.type"
                      placeholder="Jenis Industri"
                      @change="getProv(selects.type)"
                    >
                      <el-option
                        v-for="option in selects.options.type"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selects.comp"
                      placeholder="Industri"
                      @change="getCompData(selects.comp)"
                    >
                      <el-option
                        v-for="option in selects.options.comp"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-6 pr-0">
                    <base-input class="m-0">
                      <flat-picker
                        placeholder="Waktu"
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          dateFormat: 'U',
                          allowInput: true,
                          enableTime: true,
                          altFormat: 'd/m/Y',
                          altInput: true,
                          time_24hr: true,
                          mode: 'range',
                        }"
                        class="form-control datepicker"
                        v-model="selectedTime"
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-2">
                    <base-button
                      class="w-100"
                      size="md"
                      type="primary"
                      @click="downloadData(csvData)"
                      >Download</base-button
                    >
                  </div>
                </div>
                <!-- Level: Industri -->
                <div class="row" v-if="this.$store.state.auth.level > 2">
                  <div class="col-10 pr-0">
                    <base-input class="m-0">
                      <flat-picker
                        placeholder="Waktu"
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          dateFormat: 'U',
                          allowInput: true,
                          enableTime: true,
                          altFormat: 'd/m/Y',
                          altInput: true,
                          time_24hr: true,
                          mode: 'range',
                        }"
                        class="form-control datepicker"
                        v-model="selectedTime"
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-2">
                    <base-button
                      class="w-100"
                      size="md"
                      type="primary"
                      @click="downloadData(csvData)"
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
                :default-sort="{ prop: 'timestamp', order: 'descending' }"
              >
                <el-table-column
                  v-if="this.$store.state.auth.level < 3"
                  label="Nama Industri"
                  prop="compName"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  v-if="this.$store.state.auth.level < 3"
                  label="Jenis Industri"
                  prop="compType"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  v-if="this.$store.state.auth.level < 1"
                  label="Provinsi"
                  prop="provName"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  v-if="this.$store.state.auth.level < 2"
                  label="Kab/Kot"
                  prop="kabkotName"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  label="Waktu"
                  prop="time"
                  min-width
                  align="center"
                  sortable
                >
                  <template v-slot="{ row }">
                    <div class="cell">{{ unixTS2DMY(row.timestamp) }}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="KETERANGAN"
                  prop="errorMsg"
                  min-width
                  align="left"
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
                    <span v-if="selectedRows.length">
                      &nbsp; &nbsp; {{ selectedRows.length }} rows selected
                    </span>
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

const axios = require("axios");
const uniqid = require("uniqid");
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary",
    cancelButton: "btn btn-secondary",
  },
  buttonsStyling: false,
});

function intRNG(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function floatRNG(min, max) {
  let range = max - min;
  let delta = Math.random() * range;
  return min + delta;
}
function now(back) {
  let time = new Date().getTime() / 1000;
  let delta = back * 1800;
  return time - delta;
}

export default {
  mixins: [clientPaginationMixin],
  components: {
    BasePagination,
    Loading,
    BaseInput,
    flatPicker,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      selectedTime: "",
      queryArray: ["", "", "", "", ""],
      tempSelect: null,
      selects: {
        options: {
          type: [
            { name: "Semua", value: "" },
            { name: "Industri Rayon", value: "Industri Rayon" },
            { name: "Industri Pulp/Kertas", value: "Industri Pulp/Kertas" },
            {
              name: "Industri Petrokimia Hulu",
              value: "Industri Petrokimia Hulu",
            },
            {
              name: "Industri Oleokimia Dasar",
              value: "Industri Oleokimia Dasar",
            },
            { name: "Industri Minyak Sawit", value: "Industri Minyak Sawit" },
            { name: "Pengolahan Minyak Bumi", value: "Pengolahan Minyak Bumi" },
            {
              name: "Eksplorasi dan Produksi Migas",
              value: "Eksplorasi dan Produksi Migas",
            },
            {
              name: "Pertambangan Emas dan Tembaga",
              value: "Pertambangan Emas dan Tembaga",
            },
            { name: "Pertambangan Batu Bara", value: "Pertambangan Batu Bara" },
            { name: "Industri Tekstil", value: "Industri Tekstil" },
            { name: "Pertambangan Nikel", value: "Pertambangan Nikel" },
            { name: "Kawasan Industri", value: "Kawasan Industri" },
          ],
          prov: [
            {
              label: "Semua",
              value: 0,
            },
            {
              label: "Provinsi Alpha",
              value: 1,
            },
            {
              label: "Provinsi Bravo",
              value: 2,
            },
            {
              label: "Provinsi Charlie",
              value: 3,
            },
            {
              label: "Provinsi Delta",
              value: 4,
            },
          ],
          city: [
            {
              label: "Semua",
              value: 0,
            },
            {
              label: "Kab/Kot Alpha",
              value: 1,
            },
            {
              label: "Kab/Kot Bravo",
              value: 2,
            },
            {
              label: "Kab/Kot Charlie",
              value: 3,
            },
            {
              label: "Kab/Kot Delta",
              value: 4,
            },
          ],
          comp: [
            {
              label: "Semua",
              value: 0,
            },
            {
              label: "Alpha",
              value: 1,
            },
            {
              label: "Bravo",
              value: 2,
            },
            {
              label: "Charlie",
              value: 3,
            },
            {
              label: "Delta",
              value: 4,
            },
          ],
          emsg: [
            "Data sensor pH melebihi ambang batas!",
            "Data sensor COD melebihi ambang batas!",
            "Data sensor TSS melebihi ambang batas!",
            "Data sensor NH3N melebihi ambang batas!",
            "Data sensor debit melebihi ambang batas!",
          ],
        },
        type: null,
        prov: null,
        city: null,
        comp: null,
        time: null,
      },
      selectedRows: [],
      tableData: [],
    };
  },
  computed: {
    csvData() {
      let csvTable = [];
      let tempTable = this.tableData;
      let tableLength = tempTable.length;
      if (this.$store.state.auth.level === 0) {
        for (let i = 0; i < tableLength; i++) {
          csvTable.push({
            "NAMA INDUSTRI": tempTable[i].compName,
            "JENIS INDUSTRI": tempTable[i].compType,
            PROVINSI: tempTable[i].provName,
            "KAB/KOT": tempTable[i].kabkotName,

            WAKTU: moment
              .unix(tempTable[i].timestamp)
              .format("DD/MM/YYYY|HH:mm"),
            ERROR: tempTable[i].errorMsg,
          });
        }
      }
      if (this.$store.state.auth.level === 1) {
        for (let i = 0; i < tableLength; i++) {
          csvTable.push({
            "NAMA INDUSTRI": tempTable[i].compName,
            "JENIS INDUSTRI": tempTable[i].compType,
            "KAB/KOT": tempTable[i].kabkotName,

            WAKTU: moment
              .unix(tempTable[i].timestamp)
              .format("DD/MM/YYYY|HH:mm"),
            ERROR: tempTable[i].errorMsg,
          });
        }
      }
      if (this.$store.state.auth.level === 2) {
        for (let i = 0; i < tableLength; i++) {
          csvTable.push({
            "NAMA INDUSTRI": tempTable[i].compName,
            "JENIS INDUSTRI": tempTable[i].compType,
            WAKTU: moment
              .unix(tempTable[i].timestamp)
              .format("DD/MM/YYYY|HH:mm"),
            ERROR: tempTable[i].errorMsg,
          });
        }
      }
      if (this.$store.state.auth.level === 3) {
        for (let i = 0; i < tableLength; i++) {
          csvTable.push({
            "NAMA INDUSTRI": tempTable[i].compName,
            WAKTU: moment
              .unix(tempTable[i].timestamp)
              .format("DD/MM/YYYY|HH:mm"),
            ERROR: tempTable[i].errorMsg,
          });
        }
      }
      return csvTable;
    },
  },
  watch: {
    selectedTime() {
      let tempTime = this.selectedTime;
      let tempStart = tempTime.slice(0, 10);
      let tempEnd = "";

      if (tempTime.length > 10) {
        tempEnd = tempTime.slice(14, 24);
      }
      this.queryArray[3] = "start=" + tempStart;
      this.queryArray[4] = "end=" + tempEnd;
      this.generateData();
    },
  },
  methods: {
    getTime() {},
    getProv(data) {
      this.queryArray[0] = data;
      this.generateData();
    },
    getComp(data) {
      const list = this.tempSelect.compList;
      const kabkotID = this.tempSelect.kabkotList.find((a) => {
        return a.name === data;
      });
      const filterList = list.filter((l) => {
        return l.kabkotID === kabkotID._id;
      });
      this.selects.options.comp = filterList;
      this.selects.comp = null;
      this.queryArray[2] = data;
      this.generateData();
    },
    getKabkot(data) {
      const list = this.tempSelect.kabkotList;
      const provID = this.tempSelect.provList.find((a) => {
        return a.name === data;
      });
      const filterList = list.filter((l) => {
        return l.provID === provID._id;
      });
      this.selects.options.city = filterList;
      this.selects.city = null;
      this.selects.comp = null;
      this.queryArray[1] = data;
      this.generateData();
    },
    getCompData(data) {
      this.queryArray[3] = data;
      this.generateData();
    },
    getList(userID) {
      axios
        .get(`${defaults.baseURL}/report/list/${userID}`, {
          headers: { token: this.$store.state.token },
        })
        .then((res) => {
          this.selects.options.prov = res.data.provList;
          this.selects.options.city = res.data.kabkotList;
          this.selects.options.comp = res.data.compList;

          this.selects.options.prov.unshift({ name: "Semua", value: "" });
          this.selects.options.city.unshift({ name: "Semua", value: "" });
          this.selects.options.comp.unshift({ name: "Semua", value: "" });
          this.tempSelect = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    generateData() {
      let loader = this.$loading.show({ loader: "dots" });
      const tempArray = this.queryArray;
      const auth = JSON.parse(localStorage.getItem("auth-data"));
      axios
        .get(
          `${defaults.baseURL}/error/list/${auth._id}?type=${tempArray[0]}&prov=${tempArray[1]}&kabkot=${tempArray[2]}&comp=${tempArray[3]}`,
          { headers: { token: this.$store.state.token } })
        .then((res) => {
          console.log(res.data);
          this.tableData = res.data;
          loader.hide();
        })
        .catch((err) => console.log(err));
    },
    // generateData1(type, prov, city, comp) {
    //   this.tableData = [];
    //   const length = 1234;
    //   let array = [];
    //   let mtype = 0;
    //   let mprov = 0;
    //   let mcity = 0;
    //   let mcomp = 0;
    //   let itype = 0;
    //   let iprov = 0;
    //   let icity = 0;
    //   let icomp = 0;
    //   if (type != null) mtype = type;
    //   if (prov != null) mprov = prov;
    //   if (city != null) mcity = city;
    //   if (comp != null) mcomp = comp;
    //   for (let i = 0; i < length; i++) {
    //     array.push({
    //       id: uniqid(),
    //       time: now(i),
    //       type: this.selects.options.type[mtype === 0 ? intRNG(1, 4) : mtype]
    //         .label,
    //       prov: this.selects.options.prov[mprov === 0 ? intRNG(1, 4) : mprov]
    //         .label,
    //       city: this.selects.options.city[mcity === 0 ? intRNG(1, 4) : mcity]
    //         .label,
    //       comp: this.selects.options.comp[mcomp === 0 ? intRNG(1, 4) : mcomp]
    //         .label,
    //       emsg: this.selects.options.emsg[intRNG(0, 4)],
    //     });
    //   }
    //   this.tableData = array;
    // },
    downloadData(data) {
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
            link.setAttribute("download", "export.csv");
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
            if (this.$store.state.auth.level === 0) {
              headerPDF = [
                "No",
                "NAMA INDUSTRI",
                "JENIS INDUSTRI",
                "PROVINSI",
                "KAB/KOT",
                "WAKTU",
                "KETERANGAN",
              ];
              for (let i = 0; i < data.length; i++) {
                var arrayTemp = [
                  [i],
                  data[i]["NAMA INDUSTRI"],
                  data[i]["JENIS INDUSTRI"],
                  data[i]["PROVINSI"],
                  data[i]["KAB/KOT"],
                  data[i]["WAKTU"],
                  data[i]["KETERANGAN"],
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
                "KETERANGAN",
              ];
              for (let i = 0; i < data.length; i++) {
                var arrayTemp = [
                  [i],
                  data[i]["NAMA INDUSTRI"],
                  data[i]["JENIS INDUSTRI"],
                  data[i]["KAB/KOT"],
                  data[i]["WAKTU"],
                  data[i]["KETERANGAN"],
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
                "KETERANGAN",
              ];
              for (let i = 0; i < data.length; i++) {
                var arrayTemp = [
                  [i],
                  data[i]["NAMA INDUSTRI"],
                  data[i]["JENIS INDUSTRI"],
                  data[i]["WAKTU"],
                  data[i]["KETERANGAN"],
                ];
                tempTablePDF.push(arrayTemp);
              }
            }
            if (this.$store.state.auth.level === 3) {
              headerPDF = ["No", "WAKTU", "KETERANGAN"];
              for (let i = 0; i < data.length; i++) {
                var arrayTemp = [[i], data[i]["WAKTU"], data[i]["KETERANGAN"]];
                tempTablePDF.push(arrayTemp);
              }
            }
            let titleText =
              "Laporan Early Warning (2 Menit) - " +
              this.$store.state.auth.name;
            doc.text(titleText, 15, 10);
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
  created() {
    const auth = JSON.parse(localStorage.getItem("auth-data"));
    this.getList(auth._id);
    this.generateData();
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
      min-width: 80px;
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
