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
                <div class="row" v-if="this.$store.state.auth.level < 1">
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selected.jenisIndustri"
                      filterable
                      placeholder="Jenis Industri"
                      @change="changeJenisIndustri(selected.jenisIndustri)"
                    >
                      <el-option
                        v-for="option in tempJenisIndustri"
                        :key="option.name"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selected.prov"
                      placeholder="Provinsi"
                      filterable
                      @change="changeListProv(selected.prov)"
                    >
                      <el-option
                        v-for="option in options.provList"
                        :key="option.name"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selected.kabkot"
                      placeholder="Kab/Kot"
                      filterable
                      @change="changeListKabkot(selected.kabkot)"
                    >
                      <el-option
                        v-for="option in options.kabkotList"
                        :key="option.name"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selected.comp"
                      placeholder="Industri"
                      filterable
                      @change="changeListComp(selected.comp)"
                    >
                      <el-option
                        v-for="option in options.compList"
                        :key="option._id"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <base-input class="m-0">
                      <flat-picker
                        placeholder="Waktu"
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
                    <!-- <base-button class="w-100" size="md" type="primary" @click="exportExcel">
                      Download
                    </base-button> -->
                    <base-button
                      class="w-100"
                      size="md"
                      type="primary"
                      @click="downloadData()"
                      >Download</base-button
                    >
                  </div>
                </div>
                <!-- Level: Provinsi -->
                <div class="row" v-if="this.$store.state.auth.level == 1">
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selected.jenisIndustri"
                      placeholder="Jenis Industri"
                      filterable
                      @change="changeJenisIndustri(selected.jenisIndustri)"
                    >
                      <el-option
                        v-for="option in tempJenisIndustri"
                        :key="option.name"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selected.kabkot"
                      placeholder="Kab/Kot"
                      filterable
                      @change="changeListKabkot(selected.kabkot)"
                    >
                      <el-option
                        v-for="option in options.kabkotList"
                        :key="option.name"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selected.comp"
                      placeholder="Industri"
                      filterable
                      @change="changeListComp(selected.comp)"
                    >
                      <el-option
                        v-for="option in options.compList"
                        :key="option.name"
                        :label="option.name"
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
                      @click="downloadData()"
                      >Download</base-button
                    >
                    <!-- <base-button class="w-100" size="md" type="primary" @click="exportExcel">
                      Download
                    </base-button> -->
                  </div>
                </div>
                <!-- Level: Kab/Kot -->
                <div class="row" v-if="this.$store.state.auth.level == 2">
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selected.jenisIndustri"
                      placeholder="Jenis Industri"
                      filterable
                      @change="changeJenisIndustri(selected.jenisIndustri)"
                    >
                      <el-option
                        v-for="option in tempJenisIndustri"
                        :key="option.name"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selected.comp"
                      placeholder="Industri"
                      filterable
                      @change="changeListComp(selected.comp)"
                    >
                      <el-option
                        v-for="option in options.compList"
                        :key="option.name"
                        :label="option.name"
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
                      @click="downloadData()"
                      >Download</base-button
                    >
                    <!-- <base-button class="w-100" size="md" type="primary" @click="exportExcel">
                      Download
                    </base-button> -->
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
                      @click="downloadData()"
                      >Download</base-button
                    >
                    <!-- <base-button class="w-100" size="md" type="primary" @click="exportExcel">
                      Download
                    </base-button> -->
                  </div>
                </div>
              </div>
              <div class="table-container">
                <!-- Table -->
                <el-table
                  :data="queriedData"
                  row-key="id"
                  header-row-class-name="thead-light"
                  @sort-change="sortChange"
                  @selection-change="selectionChange"
                >
                  <el-table-column
                    v-if="this.$store.state.auth.level < 3"
                    label="Nama Industri"
                    prop="compDetails.compName"
                    sortable
                  ></el-table-column>
                  <el-table-column
                    v-if="this.$store.state.auth.level < 3"
                    label="Jenis Industri"
                    prop="compDetails.compType"
                    sortable
                  ></el-table-column>
                  <el-table-column
                    v-if="this.$store.state.auth.level < 1"
                    label="Provinsi"
                    prop="provDetails.provName"
                    sortable
                  ></el-table-column>
                  <el-table-column
                    v-if="this.$store.state.auth.level < 2"
                    label="Kab/Kot"
                    prop="kabkotDetails.kabkotName"
                    sortable
                  ></el-table-column>
                  <el-table-column
                    label="Waktu"
                    prop="timestamp"
                    sortable
                  >
                    <template v-slot="{ row }">
                      <div class="cell">{{ unixTS2DMY(row.timestamp) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="pH">
                    <template v-slot="{ row }">
                      <div
                        class="cell"
                        v-if="row.dataParam[0].value == 'Tidak Wajib'"
                      >
                        {{ row.dataParam[0].value }}
                      </div>
                      <div class="cell" v-else>
                        {{ floatNumber(row.dataParam[0].value) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="COD (mg/l)">
                    <template v-slot="{ row }">
                      <div
                        class="cell"
                        v-if="row.dataParam[1].value == 'Tidak Wajib'"
                      >
                        {{ row.dataParam[1].value }}
                      </div>
                      <div class="cell" v-else>
                        {{ floatNumber(row.dataParam[1].value) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="TSS (mg/l)">
                    <template v-slot="{ row }">
                      <div
                        class="cell"
                        v-if="row.dataParam[2].value == 'Tidak Wajib'"
                      >
                        {{ row.dataParam[2].value }}
                      </div>
                      <div class="cell" v-else>
                        {{ floatNumber(row.dataParam[2].value) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="NH3N (mg/l)">
                    <template v-slot="{ row }">
                      <div
                        class="cell"
                        v-if="row.dataParam[3].value == 'Tidak Wajib'"
                      >
                        {{ row.dataParam[3].value }}
                      </div>
                      <div class="cell" v-else>
                        {{ floatNumber(row.dataParam[3].value) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Debit (m3/jam)">
                    <template v-slot="{ row }">
                      <div
                        class="cell"
                        v-if="row.dataParam[4].value == 'Tidak Wajib'"
                      >
                        {{ row.dataParam[4].value }}
                      </div>
                      <div class="cell" v-else>
                        {{ floatNumber(row.dataParam[4].value) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Beban COD (kg/jam)">
                    <template v-slot="{ row }">
                      <div
                        class="cell"
                        v-if="
                          row.dataParam[1].value == 'Tidak Wajib' ||
                          row.dataParam[4].value == 'Tidak Wajib'
                        "
                      >
                        {{ row.dataParam[1].value }}
                      </div>
                      <div class="cell" v-else>
                        {{ floatNumber(row.dataParam[1].value * row.dataParam[4].value * 0.001) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Beban TSS (kg/jam)">
                    <template v-slot="{ row }">
                      <div
                        class="cell"
                        v-if="
                          row.dataParam[2].value == 'Tidak Wajib' ||
                          row.dataParam[4].value == 'Tidak Wajib'
                        "
                      >
                        {{ row.dataParam[2].value }}
                      </div>
                      <div class="cell" v-else>
                        {{ floatNumber(row.dataParam[2].value * row.dataParam[4].value * 0.001) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Beban NH3N (kg/jam)">
                    <template v-slot="{ row }">
                      <div
                        class="cell"
                        v-if="
                          row.dataParam[3].value == 'Tidak Wajib' ||
                          row.dataParam[4].value == 'Tidak Wajib'
                        "
                      >
                        {{ row.dataParam[3].value }}
                      </div>
                      <div class="cell" v-else>
                        {{ floatNumber(row.dataParam[3].value * row.dataParam[4].value * 0.001) }}
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
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
      dataPemenuhan: [],
      companyData: {},
      arrayBody: [],
      dataPemenuhanDownload: [],
      companyDataDownload: {},
      arrayBodyDownload: [],
      allListData: {},
      tempJenisIndustri: [
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
      options: {
        jenisIndustri: [],
        provList: [],
        kabkotList: [],
        compList: [],
      },
      selectedTime: null,
      selected: {
        jenisIndustri: null,
        prov: null,
        kabkot: null,
        comp: null,
      },
      selects: {
        options: {
          type: [
            {
              label: "Semua",
              value: 0,
            },
            {
              label: "Industri Alpha",
              value: 1,
            },
            {
              label: "Industri Bravo",
              value: 2,
            },
            {
              label: "Industri Charlie",
              value: 3,
            },
            {
              label: "Industri Delta",
              value: 4,
            },
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
        },
        type: null,
        prov: null,
        city: null,
        comp: null,
        time: null,
      },
      selectedRows: [],
      tableData: [],
      tableDataDownload: [],
    };
  },
  computed: {
    csvData() {
      let csvTable = [];
      let tempTable = this.filteredData;
      let tableLength = tempTable.length;
      let ph;
      let cod;
      let tss;
      let nh3n;
      let debit;

      let beban_cod;
      let beban_tss;
      let beban_nh3n;

      if (this.$store.state.auth.level === 0) {
        for (let i = 0; i < tableLength; i++) {
          if (tempTable[i].dataParam[0].value != "Tidak Wajib") {
            ph = this.floatNumber(tempTable[i].dataParam[0].value);
          } else {
            ph = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[1].value != "Tidak Wajib") {
            cod = this.floatNumber(tempTable[i].dataParam[1].value);
          } else {
            cod = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[2].value != "Tidak Wajib") {
            tss = this.floatNumber(tempTable[i].dataParam[2].value);
          } else {
            tss = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[3].value != "Tidak Wajib") {
            nh3n = this.floatNumber(tempTable[i].dataParam[3].value)
          } else {
            nh3n = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[4].value != "Tidak Wajib") {
            debit = this.floatNumber(tempTable[i].dataParam[4].value);
          } else {
            debit = "Tidak Wajib";
          }

          if (
            tempTable[i].dataParam[1].value != "Tidak Wajib" &&
            tempTable[i].dataParam[4].value != "Tidak Wajib"
          ) {
            beban_cod = cod * debit;
          } else {
            beban_cod = "Tidak Wajib";
          }
          if (
            tempTable[i].dataParam[2].value != "Tidak Wajib" &&
            tempTable[i].dataParam[4].value != "Tidak Wajib"
          ) {
            beban_tss = tss * debit;
          } else {
            beban_tss = "Tidak Wajib";
          }

          if (
            tempTable[i].dataParam[3].value != "Tidak Wajib" &&
            tempTable[i].dataParam[4].value != "Tidak Wajib"
          ) {
            beban_nh3n = nh3n * debit;
          } else {
            beban_nh3n = "Tidak Wajib";
          }

          csvTable.push({
            "NAMA INDUSTRI": tempTable[i].compDetails.compName,
            "JENIS INDUSTRI": tempTable[i].compDetails.compType,
            PROVINSI: tempTable[i].provDetails.provName,
            "KAB/KOT": tempTable[i].kabkotDetails.kabkotName,

            WAKTU: moment
              .unix(tempTable[i].timestamp)
              .format("DD/MM/YYYY|HH:mm"),
            pH: ph,
            "COD (mg/l)": cod,
            "TSS (mg/l)": tss,
            "NH3N (mg/l)": nh3n,
            "Debit (m3/jam)": debit,
            // pH: tempTable[i].dataParam[0].value.toFixed(4),
            // "COD (mg/l)": tempTable[i].dataParam[1].value.toFixed(4),
            // "TSS (mg/l)": tempTable[i].dataParam[2].value.toFixed(4),
            // "NH3N (mg/l)": tempTable[i].dataParam[3].value.toFixed(4),
            // "Debit (m3/jam)": tempTable[i].dataParam[4].value.toFixed(4),

            "Beban COD (kg/jam)": beban_cod,

            "Beban TSS (kg/jam)": beban_tss,

            "Beban NH3N (kg/jam)": beban_nh3n,
          });
        }
      }
      if (this.$store.state.auth.level === 1) {
        for (let i = 0; i < tableLength; i++) {
          if (tempTable[i].dataParam[0].value != "Tidak Wajib") {
            ph = this.floatNumber(tempTable[i].dataParam[0].value);
          } else {
            ph = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[1].value != "Tidak Wajib") {
            cod = this.floatNumber(tempTable[i].dataParam[1].value);
          } else {
            cod = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[2].value != "Tidak Wajib") {
            tss = this.floatNumber(tempTable[i].dataParam[2].value);
          } else {
            tss = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[3].value != "Tidak Wajib") {
            nh3n = this.floatNumber(tempTable[i].dataParam[3].value);
          } else {
            nh3n = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[4].value != "Tidak Wajib") {
            debit = this.floatNumber(tempTable[i].dataParam[4].value);
          } else {
            debit = "Tidak Wajib";
          }

          if (
            tempTable[i].dataParam[1].value != "Tidak Wajib" &&
            tempTable[i].dataParam[4].value != "Tidak Wajib"
          ) {
            beban_cod = cod * debit;
          } else {
            beban_cod = "Tidak Wajib";
          }
          if (
            tempTable[i].dataParam[2].value != "Tidak Wajib" &&
            tempTable[i].dataParam[4].value != "Tidak Wajib"
          ) {
            beban_tss = tss * debit;
          } else {
            beban_tss = "Tidak Wajib";
          }

          if (
            tempTable[i].dataParam[3].value != "Tidak Wajib" &&
            tempTable[i].dataParam[4].value != "Tidak Wajib"
          ) {
            beban_nh3n = nh3n * debit;
          } else {
            beban_nh3n = "Tidak Wajib";
          }

          csvTable.push({
            "NAMA INDUSTRI": tempTable[i].compDetails.compName,
            "JENIS INDUSTRI": tempTable[i].compDetails.compType,
            "KAB/KOT": tempTable[i].kabkotDetails.kabkotName,

            WAKTU: moment
              .unix(tempTable[i].timestamp)
              .format("DD/MM/YYYY|HH:mm"),
            pH: ph,
            "COD (mg/l)": cod,
            "TSS (mg/l)": tss,
            "NH3N (mg/l)": nh3n,
            "Debit (m3/jam)": debit,
            "Beban COD (kg/jam)": beban_cod,

            "Beban TSS (kg/jam)": beban_tss,

            "Beban NH3N (kg/jam)": beban_nh3n,
            // pH: tempTable[i].dataParam[0].value.toFixed(4),
            // "COD (mg/l)": tempTable[i].dataParam[1].value.toFixed(4),
            // "TSS (mg/l)": tempTable[i].dataParam[2].value.toFixed(4),
            // "NH3N (mg/l)": tempTable[i].dataParam[3].value.toFixed(4),
            // "Debit (m3/jam)": tempTable[i].dataParam[4].value.toFixed(4),

            // "Beban COD (kg/jam)": (
            //   tempTable[i].dataParam[1].value * tempTable[i].dataParam[4].value
            // ).toFixed(4),

            // "Beban TSS (kg/jam)": (
            //   tempTable[i].dataParam[2].value * tempTable[i].dataParam[4].value
            // ).toFixed(4),

            // "Beban NH3N (kg/jam)": (
            //   tempTable[i].dataParam[3].value * tempTable[i].dataParam[4].value
            // ).toFixed(4),
          });
        }
      }
      if (this.$store.state.auth.level === 2) {
        for (let i = 0; i < tableLength; i++) {
          if (tempTable[i].dataParam[0].value != "Tidak Wajib") {
            ph = this.floatNumber(tempTable[i].dataParam[0].value);
          } else {
            ph = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[1].value != "Tidak Wajib") {
            cod = this.floatNumber(tempTable[i].dataParam[1].value);
          } else {
            cod = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[2].value != "Tidak Wajib") {
            tss = this.floatNumber(tempTable[i].dataParam[2].value);
          } else {
            tss = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[3].value != "Tidak Wajib") {
            nh3n = this.floatNumber(tempTable[i].dataParam[3].value);
          } else {
            nh3n = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[4].value != "Tidak Wajib") {
            debit = this.floatNumber(tempTable[i].dataParam[4].value);
          } else {
            debit = "Tidak Wajib";
          }

          if (
            tempTable[i].dataParam[1].value != "Tidak Wajib" &&
            tempTable[i].dataParam[4].value != "Tidak Wajib"
          ) {
            beban_cod = cod * debit;
          } else {
            beban_cod = "Tidak Wajib";
          }
          if (
            tempTable[i].dataParam[2].value != "Tidak Wajib" &&
            tempTable[i].dataParam[4].value != "Tidak Wajib"
          ) {
            beban_tss = tss * debit;
          } else {
            beban_tss = "Tidak Wajib";
          }

          if (
            tempTable[i].dataParam[3].value != "Tidak Wajib" &&
            tempTable[i].dataParam[4].value != "Tidak Wajib"
          ) {
            beban_nh3n = nh3n * debit;
          } else {
            beban_nh3n = "Tidak Wajib";
          }
          csvTable.push({
            "NAMA INDUSTRI": tempTable[i].compDetails.compName,
            "JENIS INDUSTRI": tempTable[i].compDetails.compType,

            WAKTU: moment
              .unix(tempTable[i].timestamp)
              .format("DD/MM/YYYY|HH:mm"),
            pH: ph,
            "COD (mg/l)": cod,
            "TSS (mg/l)": tss,
            "NH3N (mg/l)": nh3n,
            "Debit (m3/jam)": debit,
            "Beban COD (kg/jam)": beban_cod,

            "Beban TSS (kg/jam)": beban_tss,

            "Beban NH3N (kg/jam)": beban_nh3n,
            // pH: tempTable[i].dataParam[0].value.toFixed(4),
            // "COD (mg/l)": tempTable[i].dataParam[1].value.toFixed(4),
            // "TSS (mg/l)": tempTable[i].dataParam[2].value.toFixed(4),
            // "NH3N (mg/l)": tempTable[i].dataParam[3].value.toFixed(4),
            // "Debit (m3/jam)": tempTable[i].dataParam[4].value.toFixed(4),

            // "Beban COD (kg/jam)": (
            //   tempTable[i].dataParam[1].value * tempTable[i].dataParam[4].value
            // ).toFixed(4),

            // "Beban TSS (kg/jam)": (
            //   tempTable[i].dataParam[2].value * tempTable[i].dataParam[4].value
            // ).toFixed(4),

            // "Beban NH3N (kg/jam)": (
            //   tempTable[i].dataParam[3].value * tempTable[i].dataParam[4].value
            // ).toFixed(4),
          });
        }
      }
      if (this.$store.state.auth.level === 3) {
        for (let i = 0; i < tableLength; i++) {
          if (tempTable[i].dataParam[0].value != "Tidak Wajib") {
            ph = this.floatNumber(tempTable[i].dataParam[0].value);
          } else {
            ph = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[1].value != "Tidak Wajib") {
            cod = this.floatNumber(tempTable[i].dataParam[1].value);
          } else {
            cod = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[2].value != "Tidak Wajib") {
            tss = this.floatNumber(tempTable[i].dataParam[2].value);
          } else {
            tss = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[3].value != "Tidak Wajib") {
            nh3n = this.floatNumber(tempTable[i].dataParam[3].value);
          } else {
            nh3n = "Tidak Wajib";
          }
          if (tempTable[i].dataParam[4].value != "Tidak Wajib") {
            debit = this.floatNumber(tempTable[i].dataParam[4].value);
          } else {
            debit = "Tidak Wajib";
          }

          if (
            tempTable[i].dataParam[1].value != "Tidak Wajib" &&
            tempTable[i].dataParam[4].value != "Tidak Wajib"
          ) {
            beban_cod = cod * debit;
          } else {
            beban_cod = "Tidak Wajib";
          }
          if (
            tempTable[i].dataParam[2].value != "Tidak Wajib" &&
            tempTable[i].dataParam[4].value != "Tidak Wajib"
          ) {
            beban_tss = tss * debit;
          } else {
            beban_tss = "Tidak Wajib";
          }

          if (
            tempTable[i].dataParam[3].value != "Tidak Wajib" &&
            tempTable[i].dataParam[4].value != "Tidak Wajib"
          ) {
            beban_nh3n = nh3n * debit;
          } else {
            beban_nh3n = "Tidak Wajib";
          }
          csvTable.push({
            WAKTU: moment
              .unix(tempTable[i].timestamp)
              .format("DD/MM/YYYY|HH:mm"),
            pH: ph,
            "COD (mg/l)": cod,
            "TSS (mg/l)": tss,
            "NH3N (mg/l)": nh3n,
            "Debit (m3/jam)": debit,
            "Beban COD (kg/jam)": beban_cod,

            "Beban TSS (kg/jam)": beban_tss,

            "Beban NH3N (kg/jam)": beban_nh3n,
            // pH: tempTable[i].dataParam[0].value.toFixed(4),
            // "COD (mg/l)": tempTable[i].dataParam[1].value.toFixed(4),
            // "TSS (mg/l)": tempTable[i].dataParam[2].value.toFixed(4),
            // "NH3N (mg/l)": tempTable[i].dataParam[3].value.toFixed(4),
            // "Debit (m3/jam)": tempTable[i].dataParam[4].value.toFixed(4),

            // "Beban COD (kg/jam)": (
            //   tempTable[i].dataParam[1].value * tempTable[i].dataParam[4].value
            // ).toFixed(4),

            // "Beban TSS (kg/jam)": (
            //   tempTable[i].dataParam[2].value * tempTable[i].dataParam[4].value
            // ).toFixed(4),

            // "Beban NH3N (kg/jam)": (
            //   tempTable[i].dataParam[3].value * tempTable[i].dataParam[4].value
            // ).toFixed(4),
          });
        }
      }
      return csvTable;
    },
  },
  methods: {
    getTime(time) {},
    test() {
      this.selected.kabkot = "";
    },
    changeJenisIndustri(jenisIndustri) {
      const allData = JSON.parse(localStorage.getItem("allList"));
      if (jenisIndustri === "" || jenisIndustri === null) {
        this.arrayBody[0] = "";
        this.arrayBodyDownload[0] = "";
        this.getTableData(this.arrayBody);
        this.getDownloadParam(this.arrayBodyDownload);
        return;
      }
      this.arrayBody[0] = "type=" + jenisIndustri;
      this.arrayBodyDownload[0] = "type=" + jenisIndustri;
      this.getTableData(this.arrayBody);
      this.getDownloadParam(this.arrayBodyDownload);
    },
    changeListProv(prov) {
      const allData = JSON.parse(localStorage.getItem("allList"));
      if (prov == "" || prov == null) {
        this.arrayBody[1] = "";
        this.arrayBody[2] = "";
        this.arrayBodyDownload[1] = "";
        this.arrayBodyDownload[2] = "";
        this.selected.kabkot = null;
        this.selected.comp = null;
        this.options = allData;
        this.getTableData([this.arrayBody[0], "prov="]);
        this.getDownloadParam([this.arrayBodyDownload[0], "prov="]);
        return;
      }
      const foundProv = allData.provList.find((data) => data.name === prov);

      const tempKabkotList = allData.kabkotList.filter(
        (data) => data.provID === foundProv._id
      );
      tempKabkotList.unshift({ name: "Semua", value: "" });
      const tempCompList = allData.compList.filter(
        (data) => data.provID === foundProv._id
      );
      this.options.kabkotList = tempKabkotList;
      this.options.compList = tempCompList;
      this.arrayBody[1] = "prov=" + prov;
      this.arrayBodyDownload[1] = "prov=" + prov;
      this.getTableData(this.arrayBody);
      this.getDownloadParam(this.arrayBodyDownload);
    },
    changeListKabkot(kabkot) {
      const allData = JSON.parse(localStorage.getItem("allList"));
      if (kabkot === "" || kabkot === null) {
        this.arrayBody[2] = "";
        this.arrayBody[3] = "";
        this.arrayBodyDownload[2] = "";
        this.arrayBodyDownload[3] = "";
        this.selected.comp = null;
        this.options.compList = allData.compList;
        this.getTableData(this.arrayBody);
        this.getDownloadParam(this.arrayBodyDownload);
        return;
      }
      let foundKabkot = allData.kabkotList.find((data) => data.name === kabkot);
      this.options.compList = allData.compList.filter(
        (data) => data.kabkotID === foundKabkot._id
      );

      this.options.compList.unshift({ name: "Semua", value: "" });
      this.arrayBody[2] = "kabkot=" + kabkot;
      this.arrayBodyDownload[2] = "kabkot=" + kabkot;
      this.getTableData(this.arrayBody);
      this.getDownloadParam(this.arrayBodyDownload);
    },
    changeListComp(comp) {
      const allData = JSON.parse(localStorage.getItem("allList"));
      if (comp === "" || comp === null) {
        this.arrayBody[3] = "";
        this.arrayBodyDownload[3] = "";
        this.getTableData(this.arrayBody);
        this.getDownloadParam(this.arrayBodyDownload);
        return;
      }
      let foundComp = allData.compList.find((data) => data.name === comp);
      this.arrayBody[3] = "comp=" + comp;
      this.arrayBodyDownload[3] = "comp=" + comp;
      this.getTableData(this.arrayBody);
      this.getDownloadParam(this.arrayBodyDownload);
    },
    getList() {
      const auth = JSON.parse(localStorage.getItem("auth-data"));
      axios
        .get(`${defaults.baseURL}/report/list/${auth._id}`, {
          headers: { token: this.$store.state.token },
        })
        .then((res) => {
          let tempAllListData = res.data;
          tempAllListData.provList.unshift({ name: "Semua", value: "" });
          tempAllListData.kabkotList.unshift({ name: "Semua", value: "" });
          tempAllListData.compList.unshift({ name: "Semua", value: "" });
          localStorage.setItem("allList", JSON.stringify(tempAllListData));
          this.options = tempAllListData;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getTableData(params) {
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
    exportExcel() {
      const auth = JSON.parse(localStorage.getItem("auth-data"));
      window.open(`${defaults.baseURL}/report/hourly-export/${auth._id}?${this.arrayBody.join("&")}`, "_blank");
    },
    floatNumber(num) {
      if (+num % 1 !== 0) {
        return num.toFixed(4);
      } else {
        return num;
      }
    },

    getDownloadParam(param) {
      return this.arrayBody;
    },
    getDataDownload() {
      let params = this.arrayBody;
      let loader = this.$loading.show({ loader: "dots" });
      const auth = JSON.parse(localStorage.getItem("auth-data"));

      axios
        .get(`${defaults.baseURL}/report/hourly-download/${auth._id}?${params.join("&")}`,
          { headers: { token: this.$store.state.token } }
        )
        .then((res) => {
          this.companyDataDownload = res.data.profile;
          this.tableDataDownload = res.data.dataSensor;
          this.dataPemenuhanDownload = res.data.dataPemenuhan;
          loader.hide();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    downloadData(data) {
      swalWithBootstrapButtons
        .fire({
          title: "Download Data",
          text: "Please choose what type of file do you want",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "EXCEL",
          cancelButtonText: "PDF",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.value) {
            this.exportExcel();
            // let csvContent = "data:text/csv;charset=utf-8,";
            // let params = this.arrayBody;
            // let loader = this.$loading.show({ loader: "dots" });
            // const auth = JSON.parse(localStorage.getItem("auth-data"));

            // axios
            //   .get(`${defaults.baseURL}/report/hourly-download/${auth._id}?${params.join("&")}`,
            //     { headers: { token: this.$store.state.token } }
            //   )
            //   .then((res) => {
            //     this.companyDataDownload = res.data.profile;
            //     this.tableDataDownload = res.data.dataSensor;
            //     this.dataPemenuhanDownload = res.data.dataPemenuhan;
            //     data = res.data.dataSensor;
            //     let datas = [];
            //     let ph, cod, tss, nh3n, debit, beban_cod, beban_tss, beban_nh3n;
            //     loader.hide();
            //     // new array data
            //     if (this.$store.state.auth.level === 0) {
            //       //role admin
            //       for (let i = 0; i < data.length; i++) {
            //         if (data[i].dataParam[0].value != "Tidak Wajib") {
            //           ph = data[i].dataParam[0].value.toFixed(4);
            //         } else {
            //           ph = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[1].value != "Tidak Wajib") {
            //           cod = data[i].dataParam[1].value.toFixed(4);
            //         } else {
            //           cod = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[2].value != "Tidak Wajib") {
            //           tss = data[i].dataParam[2].value.toFixed(4);
            //         } else {
            //           tss = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[3].value != "Tidak Wajib") {
            //           nh3n = data[i].dataParam[3].value.toFixed(4);
            //         } else {
            //           nh3n = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[4].value != "Tidak Wajib") {
            //           debit = data[i].dataParam[4].value.toFixed(4);
            //         } else {
            //           debit = "Tidak Wajib";
            //         }

            //         if (
            //           data[i].dataParam[1].value != "Tidak Wajib" &&
            //           data[i].dataParam[4].value != "Tidak Wajib"
            //         ) {
            //           beban_cod = cod * 0.001 * debit;
            //         } else {
            //           beban_cod = "Tidak Wajib";
            //         }
            //         if (
            //           data[i].dataParam[2].value != "Tidak Wajib" &&
            //           data[i].dataParam[4].value != "Tidak Wajib"
            //         ) {
            //           beban_tss = tss * 0.001 * debit;
            //         } else {
            //           beban_tss = "Tidak Wajib";
            //         }

            //         if (
            //           data[i].dataParam[3].value != "Tidak Wajib" &&
            //           data[i].dataParam[4].value != "Tidak Wajib"
            //         ) {
            //           beban_nh3n = nh3n * 0.001 * debit;
            //         } else {
            //           beban_nh3n = "Tidak Wajib";
            //         }
            //         datas.push({
            //           "NAMA INDUSTRI": data[i].compDetails.compName,
            //           "JENIS INDUSTRI": data[i].compDetails.compType,
            //           PROVINSI: data[i].provDetails.provName,
            //           "KAB/KOT": data[i].kabkotDetails.kabkotName,
            //           WAKTU: this.unixTS2DMY(data[i].timestamp),
            //           PH: data[i].dataParam[0].value,
            //           "COD(MG/L)": cod,
            //           "TSS(MG/L)": tss,
            //           NH3N: nh3n,
            //           DEBIT: debit,
            //           "BEBAN COD(KG/jam)": beban_cod,
            //           "BEBAN TSS(KG/jam)": beban_tss,
            //           "BEBAN NH3N(KG/jam)": beban_nh3n,
            //         });
            //       }
            //     } else if (this.$store.state.auth.level === 1) {
            //       // kabkot
            //       for (let i = 0; i < data.length; i++) {
            //         if (data[i].dataParam[0].value != "Tidak Wajib") {
            //           ph = data[i].dataParam[0].value.toFixed(4);
            //         } else {
            //           ph = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[1].value != "Tidak Wajib") {
            //           cod = data[i].dataParam[1].value.toFixed(4);
            //         } else {
            //           cod = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[2].value != "Tidak Wajib") {
            //           tss = data[i].dataParam[2].value.toFixed(4);
            //         } else {
            //           tss = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[3].value != "Tidak Wajib") {
            //           nh3n = data[i].dataParam[3].value.toFixed(4);
            //         } else {
            //           nh3n = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[4].value != "Tidak Wajib") {
            //           debit = data[i].dataParam[4].value.toFixed(4);
            //         } else {
            //           debit = "Tidak Wajib";
            //         }

            //         if (
            //           data[i].dataParam[1].value != "Tidak Wajib" &&
            //           data[i].dataParam[4].value != "Tidak Wajib"
            //         ) {
            //           beban_cod = cod * 0.001 * debit;
            //         } else {
            //           beban_cod = "Tidak Wajib";
            //         }
            //         if (
            //           data[i].dataParam[2].value != "Tidak Wajib" &&
            //           data[i].dataParam[4].value != "Tidak Wajib"
            //         ) {
            //           beban_tss = tss * 0.001 * debit;
            //         } else {
            //           beban_tss = "Tidak Wajib";
            //         }

            //         if (
            //           data[i].dataParam[3].value != "Tidak Wajib" &&
            //           data[i].dataParam[4].value != "Tidak Wajib"
            //         ) {
            //           beban_nh3n = nh3n * 0.001 * debit;
            //         } else {
            //           beban_nh3n = "Tidak Wajib";
            //         }
            //         datas.push({
            //           "NAMA INDUSTRI": data[i].compDetails.compName,
            //           "JENIS INDUSTRI": data[i].compDetails.compType,
            //           "KAB/KOT": data[i].kabkotDetails.kabkotName,
            //           WAKTU: this.unixTS2DMY(data[i].timestamp),
            //           PH: data[i].dataParam[0].value,
            //           "COD(MG/L)": cod,
            //           "TSS(MG/L)": tss,
            //           NH3N: nh3n,
            //           DEBIT: debit,
            //           "BEBAN COD(KG/jam)": beban_cod,
            //           "BEBAN TSS(KG/jam)": beban_tss,
            //           "BEBAN NH3N(KG/jam)": beban_nh3n,
            //         });
            //       }
            //     } else if (this.$store.state.auth.level === 2) {
            //       // prov
            //       for (let i = 0; i < data.length; i++) {
            //         if (data[i].dataParam[0].value != "Tidak Wajib") {
            //           ph = data[i].dataParam[0].value.toFixed(4);
            //         } else {
            //           ph = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[1].value != "Tidak Wajib") {
            //           cod = data[i].dataParam[1].value.toFixed(4);
            //         } else {
            //           cod = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[2].value != "Tidak Wajib") {
            //           tss = data[i].dataParam[2].value.toFixed(4);
            //         } else {
            //           tss = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[3].value != "Tidak Wajib") {
            //           nh3n = data[i].dataParam[3].value.toFixed(4);
            //         } else {
            //           nh3n = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[4].value != "Tidak Wajib") {
            //           debit = data[i].dataParam[4].value.toFixed(4);
            //         } else {
            //           debit = "Tidak Wajib";
            //         }

            //         if (
            //           data[i].dataParam[1].value != "Tidak Wajib" &&
            //           data[i].dataParam[4].value != "Tidak Wajib"
            //         ) {
            //           beban_cod = cod * 0.001 * debit;
            //         } else {
            //           beban_cod = "Tidak Wajib";
            //         }
            //         if (
            //           data[i].dataParam[2].value != "Tidak Wajib" &&
            //           data[i].dataParam[4].value != "Tidak Wajib"
            //         ) {
            //           beban_tss = tss * 0.001 * debit;
            //         } else {
            //           beban_tss = "Tidak Wajib";
            //         }

            //         if (
            //           data[i].dataParam[3].value != "Tidak Wajib" &&
            //           data[i].dataParam[4].value != "Tidak Wajib"
            //         ) {
            //           beban_nh3n = nh3n * 0.001 * debit;
            //         } else {
            //           beban_nh3n = "Tidak Wajib";
            //         }
            //         datas.push({
            //           "NAMA INDUSTRI": data[i].compDetails.compName,
            //           "JENIS INDUSTRI": data[i].compDetails.compType,
            //           PROVINSI: data[i].provDetails.provName,
            //           "KAB/KOT": data[i].kabkotDetails.kabkotName,
            //           WAKTU: this.unixTS2DMY(data[i].timestamp),
            //           PH: data[i].dataParam[0].value,
            //           "COD(MG/L)": cod,
            //           "TSS(MG/L)": tss,
            //           NH3N: nh3n,
            //           DEBIT: debit,
            //           "BEBAN COD(KG/jam)": beban_cod,
            //           "BEBAN TSS(KG/jam)": beban_tss,
            //           "BEBAN NH3N(KG/jam)": beban_nh3n,
            //         });
            //       }
            //     } else if (this.$store.state.auth.level === 3) {
            //       // comp
            //       for (let i = 0; i < data.length; i++) {
            //         if (data[i].dataParam[0].value != "Tidak Wajib") {
            //           ph = data[i].dataParam[0].value.toFixed(4);
            //         } else {
            //           ph = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[1].value != "Tidak Wajib") {
            //           cod = data[i].dataParam[1].value.toFixed(4);
            //         } else {
            //           cod = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[2].value != "Tidak Wajib") {
            //           tss = data[i].dataParam[2].value.toFixed(4);
            //         } else {
            //           tss = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[3].value != "Tidak Wajib") {
            //           nh3n = data[i].dataParam[3].value.toFixed(4);
            //         } else {
            //           nh3n = "Tidak Wajib";
            //         }
            //         if (data[i].dataParam[4].value != "Tidak Wajib") {
            //           debit = data[i].dataParam[4].value.toFixed(4);
            //         } else {
            //           debit = "Tidak Wajib";
            //         }

            //         if (
            //           data[i].dataParam[1].value != "Tidak Wajib" &&
            //           data[i].dataParam[4].value != "Tidak Wajib"
            //         ) {
            //           beban_cod = cod * 0.001 * debit;
            //         } else {
            //           beban_cod = "Tidak Wajib";
            //         }
            //         if (
            //           data[i].dataParam[2].value != "Tidak Wajib" &&
            //           data[i].dataParam[4].value != "Tidak Wajib"
            //         ) {
            //           beban_tss = tss * 0.001 * debit;
            //         } else {
            //           beban_tss = "Tidak Wajib";
            //         }

            //         if (
            //           data[i].dataParam[3].value != "Tidak Wajib" &&
            //           data[i].dataParam[4].value != "Tidak Wajib"
            //         ) {
            //           beban_nh3n = nh3n * 0.001 * debit;
            //         } else {
            //           beban_nh3n = "Tidak Wajib";
            //         }
            //         datas.push({
            //           WAKTU: this.unixTS2DMY(data[i].timestamp),
            //           PH: data[i].dataParam[0].value,
            //           "COD(MG/L)": cod,
            //           "TSS(MG/L)": tss,
            //           NH3N: nh3n,
            //           DEBIT: debit,
            //           "BEBAN COD(KG/jam)": beban_cod,
            //           "BEBAN TSS(KG/jam)": beban_tss,
            //           "BEBAN NH3N(KG/jam)": beban_nh3n,
            //         });
            //       }
            //     }
            //     // end new array data
            //     csvContent += [
            //       Object.keys(datas[0]).join(";"),
            //       ...datas.map((item) => Object.values(item).join(";")),
            //     ]
            //       .join("\n")
            //       .replace(/(^\[)|(\]$)/gm, "");

            //     const tempData = encodeURI(csvContent);
            //     const link = document.createElement("a");
            //     link.setAttribute("href", tempData);
            //     link.setAttribute("download", "export.csv");
            //     link.click();
            //     swalWithBootstrapButtons.fire(
            //       "Export Success",
            //       "Your file has been exported.",
            //       "success"
            //     );
            //   });
          } else if (
            // DOWNLOAD PDF INI
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            let params = this.arrayBody;
            let loader = this.$loading.show({ loader: "dots" });
            let headerPDF = [];
            let tempTablePDF = [];
            var doc = new jsPDF("l", "mm", "a4");
            let dataPemenuhanDownload;
            let data;
            let ph;
            let cod;
            let tss;
            let nh3n;
            let debit;

            let beban_cod;
            let beban_tss;
            let beban_nh3n;

            let titleText = "Laporan - " + this.$store.state.auth.name;
            const auth = JSON.parse(localStorage.getItem("auth-data"));

            axios
              .get(`${defaults.baseURL}/report/hourly-download/${auth._id}?${params.join("&")}`,
                { headers: { token: this.$store.state.token } }
              )
              .then((res) => {
                this.companyDataDownload = res.data.profile;
                this.tableDataDownload = res.data.dataSensor;
                this.dataPemenuhanDownload = res.data.dataPemenuhan;
                data = res.data.dataSensor;
                dataPemenuhanDownload = res.data.dataPemenuhan;
                loader.hide();
                doc.text(titleText, 15, 10);
                let no = 1;
                if (this.$store.state.auth.level === 0) {
                  for (let i = 0; i < data.length; i++) {
                    if (data[i].dataParam[0].value != "Tidak Wajib") {
                      ph = this.floatNumber(data[i].dataParam[0].value);
                    } else {
                      ph = "Tidak Wajib";
                    }
                    if (data[i].dataParam[1].value != "Tidak Wajib") {
                      cod = this.floatNumber(data[i].dataParam[1].value);
                    } else {
                      cod = "Tidak Wajib";
                    }
                    if (data[i].dataParam[2].value != "Tidak Wajib") {
                      tss = this.floatNumber(data[i].dataParam[2].value);
                    } else {
                      tss = "Tidak Wajib";
                    }
                    if (data[i].dataParam[3].value != "Tidak Wajib") {
                      nh3n = this.floatNumber(data[i].dataParam[3].value);
                    } else {
                      nh3n = "Tidak Wajib";
                    }
                    if (data[i].dataParam[4].value != "Tidak Wajib") {
                      debit = this.floatNumber(data[i].dataParam[4].value);
                    } else {
                      debit = "Tidak Wajib";
                    }

                    if (
                      data[i].dataParam[1].value != "Tidak Wajib" &&
                      data[i].dataParam[4].value != "Tidak Wajib"
                    ) {
                      beban_cod = cod * 0.001 * debit;
                    } else {
                      beban_cod = "Tidak Wajib";
                    }
                    if (
                      data[i].dataParam[2].value != "Tidak Wajib" &&
                      data[i].dataParam[4].value != "Tidak Wajib"
                    ) {
                      beban_tss = tss * 0.001 * debit;
                    } else {
                      beban_tss = "Tidak Wajib";
                    }

                    if (
                      data[i].dataParam[3].value != "Tidak Wajib" &&
                      data[i].dataParam[4].value != "Tidak Wajib"
                    ) {
                      beban_nh3n = nh3n * 0.001 * debit;
                    } else {
                      beban_nh3n = "Tidak Wajib";
                    }
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
                      "Debit (m3/jam)",
                      "Beban COD (kg/jam)",
                      "Beban TSS (kg/jam)",
                      "Beban NH3N (kg/jam)",
                    ];

                    var arrayTemp = [
                      [no++],
                      data[i].compDetails.compName,
                      data[i].compDetails.compType,
                      data[i].provDetails.provName,
                      data[i].kabkotDetails.kabkotName,
                      this.unixTS2DMY(data[i].timestamp),
                      ph,
                      cod,
                      tss,
                      nh3n,
                      debit,
                      beban_cod,
                      beban_tss,
                      beban_nh3n,
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
                    "Debit (m3/jam)",
                    "Beban COD (kg/jam)",
                    "Beban TSS (kg/jam)",
                    "Beban NH3N (kg/jam)",
                  ];
                  for (let i = 0; i < data.length; i++) {
                    if (data[i].dataParam[0].value != "Tidak Wajib") {
                      ph = this.floatNumber(data[i].dataParam[0].value);
                    } else {
                      ph = "Tidak Wajib";
                    }
                    if (data[i].dataParam[1].value != "Tidak Wajib") {
                      cod = this.floatNumber(data[i].dataParam[1].value);
                    } else {
                      cod = "Tidak Wajib";
                    }
                    if (data[i].dataParam[2].value != "Tidak Wajib") {
                      tss = this.floatNumber(data[i].dataParam[2].value);
                    } else {
                      tss = "Tidak Wajib";
                    }
                    if (data[i].dataParam[3].value != "Tidak Wajib") {
                      nh3n = this.floatNumber(data[i].dataParam[3].value);
                    } else {
                      nh3n = "Tidak Wajib";
                    }
                    if (data[i].dataParam[4].value != "Tidak Wajib") {
                      debit = this.floatNumber(data[i].dataParam[4].value);
                    } else {
                      debit = "Tidak Wajib";
                    }

                    if (
                      data[i].dataParam[1].value != "Tidak Wajib" &&
                      data[i].dataParam[4].value != "Tidak Wajib"
                    ) {
                      beban_cod = cod * 0.001 * debit;
                    } else {
                      beban_cod = "Tidak Wajib";
                    }
                    if (
                      data[i].dataParam[2].value != "Tidak Wajib" &&
                      data[i].dataParam[4].value != "Tidak Wajib"
                    ) {
                      beban_tss = tss * 0.001 * debit;
                    } else {
                      beban_tss = "Tidak Wajib";
                    }

                    if (
                      data[i].dataParam[3].value != "Tidak Wajib" &&
                      data[i].dataParam[4].value != "Tidak Wajib"
                    ) {
                      beban_nh3n = nh3n * 0.001 * debit;
                    } else {
                      beban_nh3n = "Tidak Wajib";
                    }
                    var arrayTemp = [
                      [no++],
                      data[i].compDetails.compName,
                      data[i].compDetails.compType,
                      data[i].kabkotDetails.kabkotName,
                      this.unixTS2DMY(data[i].timestamp),
                      ph,
                      cod,
                      tss,
                      nh3n,
                      debit,
                      beban_cod,
                      beban_tss,
                      beban_nh3n,
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
                    "Debit (m3/jam)",
                    "Beban COD (kg/jam)",
                    "Beban TSS (kg/jam)",
                    "Beban NH3N (kg/jam)",
                  ];
                  for (let i = 0; i < data.length; i++) {
                    if (data[i].dataParam[0].value != "Tidak Wajib") {
                      ph = this.floatNumber(data[i].dataParam[0].value);
                    } else {
                      ph = "Tidak Wajib";
                    }
                    if (data[i].dataParam[1].value != "Tidak Wajib") {
                      cod = this.floatNumber(data[i].dataParam[1].value);
                    } else {
                      cod = "Tidak Wajib";
                    }
                    if (data[i].dataParam[2].value != "Tidak Wajib") {
                      tss = this.floatNumber(data[i].dataParam[2].value);
                    } else {
                      tss = "Tidak Wajib";
                    }
                    if (data[i].dataParam[3].value != "Tidak Wajib") {
                      nh3n = this.floatNumber(data[i].dataParam[3].value);
                    } else {
                      nh3n = "Tidak Wajib";
                    }
                    if (data[i].dataParam[4].value != "Tidak Wajib") {
                      debit = this.floatNumber(data[i].dataParam[4].value);
                    } else {
                      debit = "Tidak Wajib";
                    }

                    if (
                      data[i].dataParam[1].value != "Tidak Wajib" &&
                      data[i].dataParam[4].value != "Tidak Wajib"
                    ) {
                      beban_cod = cod * 0.001 * debit;
                    } else {
                      beban_cod = "Tidak Wajib";
                    }
                    if (
                      data[i].dataParam[2].value != "Tidak Wajib" &&
                      data[i].dataParam[4].value != "Tidak Wajib"
                    ) {
                      beban_tss = tss * 0.001 * debit;
                    } else {
                      beban_tss = "Tidak Wajib";
                    }

                    if (
                      data[i].dataParam[3].value != "Tidak Wajib" &&
                      data[i].dataParam[4].value != "Tidak Wajib"
                    ) {
                      beban_nh3n = nh3n * 0.001 * debit;
                    } else {
                      beban_nh3n = "Tidak Wajib";
                    }
                    var arrayTemp = [
                      [no++],
                      data[i].compDetails.compName,
                      data[i].compDetails.compType,
                      this.unixTS2DMY(data[i].timestamp),
                      ph,
                      cod,
                      tss,
                      nh3n,
                      debit,
                      beban_cod,
                      beban_tss,
                      beban_nh3n,
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
                    "Debit (m3/jam)",
                    "Beban COD (kg/jam)",
                    "Beban TSS (kg/jam)",
                    "Beban NH3N (kg/jam)",
                  ];
                  for (let i = 0; i < data.length; i++) {
                    if (data[i].dataParam[0].value != "Tidak Wajib") {
                      ph = this.floatNumber(data[i].dataParam[0].value);
                    } else {
                      ph = "Tidak Wajib";
                    }
                    if (data[i].dataParam[1].value != "Tidak Wajib") {
                      cod = this.floatNumber(data[i].dataParam[1].value);
                    } else {
                      cod = "Tidak Wajib";
                    }
                    if (data[i].dataParam[2].value != "Tidak Wajib") {
                      tss = this.floatNumber(data[i].dataParam[2].value);
                    } else {
                      tss = "Tidak Wajib";
                    }
                    if (data[i].dataParam[3].value != "Tidak Wajib") {
                      nh3n = this.floatNumber(data[i].dataParam[3].value);
                    } else {
                      nh3n = "Tidak Wajib";
                    }
                    if (data[i].dataParam[4].value != "Tidak Wajib") {
                      debit = this.floatNumber(data[i].dataParam[4].value);
                    } else {
                      debit = "Tidak Wajib";
                    }

                    if (
                      data[i].dataParam[1].value != "Tidak Wajib" &&
                      data[i].dataParam[4].value != "Tidak Wajib"
                    ) {
                      beban_cod = cod * 0.001 * debit;
                    } else {
                      beban_cod = "Tidak Wajib";
                    }
                    if (
                      data[i].dataParam[2].value != "Tidak Wajib" &&
                      data[i].dataParam[4].value != "Tidak Wajib"
                    ) {
                      beban_tss = tss * 0.001 * debit;
                    } else {
                      beban_tss = "Tidak Wajib";
                    }

                    if (
                      data[i].dataParam[3].value != "Tidak Wajib" &&
                      data[i].dataParam[4].value != "Tidak Wajib"
                    ) {
                      beban_nh3n = nh3n * 0.001 * debit;
                    } else {
                      beban_nh3n = "Tidak Wajib";
                    }
                    var arrayTemp = [
                      [no++],
                      this.unixTS2DMY(data[i].timestamp),
                      ph,
                      cod,
                      tss,
                      nh3n,
                      debit,
                      beban_cod,
                      beban_tss,
                      beban_nh3n,
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
                  let tempProfie = this.companyDataDownload;
                  let bodyProfile = [
                    ["NAMA INDUSTRI", tempProfie.compName],
                    ["ALAMAT", tempProfie.compAddres],
                    ["LATITUDE", tempProfie.latlong.lat],
                    ["LONGITUDE", tempProfie.latlong.lng],
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

                  let tempPemenuhan = dataPemenuhanDownload;

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

                doc.save(`${titleText}.pdf`);
                doc = new jsPDF("l", "mm", "a4");

                swalWithBootstrapButtons.fire(
                  "Congratulations",
                  "PDF will be downloaded shortly",
                  "success"
                );
              })
              .catch((err) => {
                console.log(err);
              });
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
    this.getTableData(this.arrayBody);
    this.getDownloadParam(this.arrayBodyDownload);
    this.getList();
  },
  watch: {
    selectedTime() {
      let tempTime = this.selectedTime;
      let tempStart = tempTime.slice(0, 10);
      let tempEnd = "";

      if (tempTime.length > 10) {
        tempEnd = tempTime.slice(14, 24);
      }
      this.arrayBody[5] = "start=" + tempStart;
      this.arrayBody[6] = "end=" + tempEnd;
      this.getTableData(this.arrayBody);
      this.getDownloadParam(this.arrayBodyDownload);
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
  .table-container {
    overflow: auto !important;
  }
  .el-table__body-wrapper {
    overflow-x: scroll !important;
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
