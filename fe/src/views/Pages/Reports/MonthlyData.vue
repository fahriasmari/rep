<template>
  <div>
    <div id="monthly-report">
      <div
        class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1"
      >
        <h1 class="display-3 font-weight-light text-white m-0">Laporan</h1>
        <h2 class="text-white mx-4 my-0">-</h2>
        <h4 class="text-default m-0">Data Perbulan</h4>
      </div>
      <base-header class="pb-8" type="primary"></base-header>
      <div class="container-fluid mt--7">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="card">
              <!-- Filter -->
              <div class="p-3 w-100">
                <div class="row mb-3">
                  <div class="w-100">
                    <div class="float-right col-2">
                      <base-button
                        class="w-100"
                        size="md"
                        type="primary"
                        @click="downloadData"
                      >
                        Download
                      </base-button>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div
                    v-if="this.$store.state.auth.level < 2"
                    class="col-2 pr-0"
                  >
                    <el-select
                      class="w-100"
                      v-model="filter.companyType"
                      placeholder="Filter Jenis Industri"
                      filterable
                    >
                      <el-option label="Semua" value="" />
                      <el-option
                        v-for="industri in jenisIndustri"
                        :key="industri.id"
                        :label="industri.value"
                        :value="industri.value"
                      />
                    </el-select>
                  </div>
                  <div
                    v-if="this.$store.state.auth.level < 1"
                    class="col-2 pr-0"
                  >
                    <el-select
                      class="w-100"
                      v-model="filter.province"
                      placeholder="Filter Provinsi"
                      @change="
                        () => {
                          getKabkot();
                          getCompList();
                        }
                      "
                      filterable
                    >
                      <el-option label="Semua" value="" />
                      <el-option
                        v-for="province in options.provinceList"
                        :key="province._id"
                        :label="province.name"
                        :value="province"
                      />
                    </el-select>
                  </div>
                  <div
                    v-if="this.$store.state.auth.level < 2"
                    class="col-2 pr-0"
                  >
                    <el-select
                      class="w-100"
                      v-model="filter.city"
                      placeholder="Filter Kab/Kot"
                      @change="getCompList"
                      filterable
                    >
                      <el-option label="Semua" value="" />
                      <el-option
                        v-for="city in options.kabkotList"
                        :key="city._id"
                        :label="city.name"
                        :value="city"
                      />
                    </el-select>
                  </div>
                  <div
                    v-if="this.$store.state.auth.level < 3"
                    class="col-2 pr-0"
                  >
                    <el-select
                      class="w-100"
                      v-model="filter.company"
                      placeholder="Filter Industri"
                      filterable
                    >
                      <el-option
                        v-if="options.compList.length"
                        label="Semua"
                        value=""
                      />
                      <el-option
                        v-for="company in options.compList"
                        :key="company._id"
                        :label="company.name"
                        :value="company"
                      />
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <base-input class="m-0">
                      <flat-picker
                        placeholder="Filter Tanggal"
                        :config="flatPickerConfig"
                        class="form-control datepicker"
                        v-model="filter.date"
                      />
                    </base-input>
                  </div>
                  <div class="col-2">
                    <base-button
                      class="w-100"
                      size="md"
                      type="secondary"
                      @click="getData"
                    >
                      Tampilkan
                    </base-button>
                  </div>
                </div>
              </div>
              <!-- Table -->
              <el-table
                v-if="!isLoading"
                :data="queriedData"
                row-key="_id"
                header-row-class-name="thead-light"
                @sort-change="sortChange"
                @selection-change="selectionChange"
              >
                <el-table-column
                  v-if="this.$store.state.auth.level < 3"
                  label="Nama Industri"
                  prop="compDetails.compName"
                  sortable
                />
                <el-table-column
                  v-if="this.$store.state.auth.level < 3"
                  label="Jenis Industri"
                  prop="compDetails.compType"
                  sortable
                />
                <el-table-column
                  v-if="this.$store.state.auth.level < 1"
                  label="Provinsi"
                  prop="provDetails.provName"
                  sortable
                />
                <el-table-column
                  v-if="this.$store.state.auth.level < 2"
                  label="Kab/Kot"
                  prop="kabkotDetails.kabkotName"
                  sortable
                />
                <el-table-column label="Tanggal" prop="timestamp" sortable>
                  <template v-slot="{ row }">
                    {{ formatDate(row.timestamp) }}
                  </template>
                </el-table-column>
                <el-table-column label="pH">
                  <template v-slot="{ row }">
                    {{ setBmal(row.dataParam[0].value) }}
                  </template>
                </el-table-column>
                <el-table-column label="COD (mg/l)">
                  <template v-slot="{ row }">
                    {{ setBmal(row.dataParam[1].value) }}
                  </template>
                </el-table-column>
                <el-table-column label="TSS (mg/l)">
                  <template v-slot="{ row }">
                    {{ setBmal(row.dataParam[2].value) }}
                  </template>
                </el-table-column>
                <el-table-column label="NH3N">
                  <template v-slot="{ row }">
                    {{ setBmal(row.dataParam[3].value) }}
                  </template>
                </el-table-column>
                <el-table-column label="Debit (m3/bulan)">
                  <template v-slot="{ row }">
                    {{ setBmal(row.dataParam[4].value) }}
                  </template>
                </el-table-column>
                <el-table-column label="Beban COD (kg/bulan)">
                  <template v-slot="{ row }">
                    {{
                      setBebanBmal(
                        row.dataParam[1].value,
                        row.dataParam[4].value
                      )
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="Beban TSS (kg/bulan)">
                  <template v-slot="{ row }">
                    {{
                      setBebanBmal(
                        row.dataParam[2].value,
                        row.dataParam[4].value
                      )
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="Beban NH3N (kg/bulan)">
                  <template v-slot="{ row }">
                    {{
                      setBebanBmal(
                        row.dataParam[3].value,
                        row.dataParam[4].value
                      )
                    }}
                  </template>
                </el-table-column>
              </el-table>
              <div
                slot="footer"
                class="col-12 my-2 d-flex justify-content-center justify-content-sm-between flex-wrap"
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
                      />
                    </el-select>
                  </div>
                  <p class="card-category m-0 ml-2">
                    Showing {{ from + 1 }} to {{ to }} of {{ total }} entries
                    <span v-if="selectedRows.length">
                      {{ selectedRows.length }} rows selected
                    </span>
                  </p>
                </div>
                <base-pagination
                  class="pagination-no-border"
                  v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total="total"
                />
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
import "flatpickr/dist/flatpickr.css";
import axios from "axios";
import defaults from "@/util/defaults";
import Swal from "sweetalert2";
import { exportToPdf } from "@/util/report-pdf";
import { jenisIndustri } from "@/data/jenis-industri";

const flatPickerConfig = {
  dateFormat: "U",
  allowInput: true,
  altInput: true,
  altFormat: "d-m-Y H:i",
  enableTime: true,
  time_24hr: true,
  defaultHour: 0,
  mode: "range"
};

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary",
    cancelButton: "btn btn-secondary"
  },
  buttonsStyling: false
});

export default {
  mixins: [clientPaginationMixin],
  components: {
    BasePagination,
    BaseInput,
    flatPicker,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      jenisIndustri,
      flatPickerConfig,
      loading: null,
      isLoading: true,
      auth: JSON.parse(localStorage.getItem("auth-data")),
      filter: {
        companyType: null,
        province: {},
        city: {},
        company: null,
        date: null
      },
      options: {
        compList: [],
        provinceList: [],
        kabkotList: []
      },
      tableData: [],
      pdfData: [],
      originalData: [],
      filterData: {},
      cityData: [],
      selectedRows: []
    };
  },
  computed: {
    apiParams() {
      return {
        ...(this.filter.companyType && { type: this.filter.companyType }),
        ...(this.filter.province && { prov: this.filter.province.name }),
        ...(this.filter.city && { kabkot: this.filter.city.name }),
        ...(this.filter.company && {
          // comp: encodeURIComponent(this.filter.company.name)
          comp: this.filter.company.name
        }),
        ...(this.filter.date && { start: this.filter.date.split(" to ")[0] }),
        ...(this.filter.date && {
          end: +this.filter.date.split(" to ")[1] + 86399
        })
      };
    }
  },
  methods: {
    async getData() {
      this.loading = this.$loading.show({ loader: "dots" });
      const axiosConfig = {
        url: `/report/monthly/${this.auth._id}`,
        methods: "get",
        baseURL: defaults.baseURL,
        params: this.apiParams
      };
      const { data } = await axios(axiosConfig);
      this.pdfData = data;
      this.tableData = data.dataSensor;
      this.originalData = data.dataSensor;
      this.loading.hide();
      this.isLoading = false;
    },
    async getFilterData() {
      await Promise.allSettled([
        this.getCompList(),
        this.getProvince(),
        this.getKabkot()
      ]);
    },
    async getCompList() {
      try {
        const params = {};
        if (Object.keys(this.filter.province).length) {
          params.provinsi = this.filter.province._id;
        }
        if (Object.keys(this.filter.city).length) {
          params.kabkot = this.filter.city._id;
        }
        const {
          data: { compList }
        } = await axios.get(
          `${defaults.baseURL}/filter/company/${this.auth._id}`,
          { params }
        );
        this.options.compList = compList;
      } catch (err) {
        console.log("err", err);
      }
    },
    async getProvince() {
      const {
        data: { provList }
      } = await axios.get(
        `${defaults.baseURL}/filter/provinsi/${this.auth._id}`
      );
      this.options.provinceList = provList;
    },
    async getKabkot() {
      const params = {};
      if (Object.keys(this.filter.province).length) {
        params.provinsi = this.filter.province._id;
      }

      const {
        data: { kabkotList }
      } = await axios.get(
        `${defaults.baseURL}/filter/kabkot/${this.auth._id}`,
        { params }
      );
      this.options.kabkotList = kabkotList;
    },
    async downloadData() {
      swalWithBootstrapButtons
        .fire({
          title: "Download Data",
          text: "Please choose what type of file do you want",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "CSV",
          cancelButtonText: "PDF",
          reverseButtons: true
        })
        .then(async result => {
          if (result.value) {
            // let csvContent = "data:text/csv;charset=utf-8,";
            // let params = this.arrayBody;
            // let loader = this.$loading.show({ loader: "dots" });
            // const auth = JSON.parse(localStorage.getItem("auth-data"));

            let removeKeys = Object.fromEntries(
              Object.entries(this.apiParams).filter(([_, v]) => v != null)
            );
            const params = new URLSearchParams(removeKeys).toString();

            window.open(
              `${defaults.baseURL}/report/monthly-export/${this.auth._id}?${params}`,
              "_blank"
            );
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            let loader = this.$loading.show({ loader: "dots" });
            await exportToPdf({
              data: this.pdfData,
              type: "bulan",
              level: this.$store.state.auth.level,
            });
            loader.hide();
          }
        });
    },
    setBmal(value) {
      if (isNaN(+value)) return "Tidak Wajib";
      return +value % 1 !== 0 ? +value.toFixed(4) : value
    },
    setBebanBmal(value, debit) {
      if (isNaN(+value) || isNaN(+debit)) return "Tidak Wajib";
      return (value * debit * 0.001).toFixed(4);
    },
    formatDate(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY, HH:mm");
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    }
  },
  created() {
    this.getData();
    this.getFilterData();
  }
};
</script>
<style lang="scss">
#monthly-report {
  .el-table {
    .el-table__row {
      &:hover {
        background: transparent;
        cursor: unset;
      }
    }
  }
}
</style>
