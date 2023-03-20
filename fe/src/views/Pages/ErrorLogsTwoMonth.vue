<template>
  <div>
    <div id="monthly-report">
      <div
        class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1">
        <h1 class="display-3 font-weight-light text-white m-0">Laporan Early Warning</h1>
        <h2 class="text-white mx-4 my-0">-</h2>
        <h4 class="text-default m-0">Per Dua Bulan</h4>
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
                      <base-button class="w-100" size="md" type="primary" @click="exportExcel">
                        Download
                      </base-button>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div v-if="this.$store.state.auth.level < 2" class="col-2 pr-0">
                    <el-select class="w-100" v-model="filter.companyType" placeholder="Filter Jenis Industri" filterable>
                      <el-option label="Semua" value="" />
                      <el-option v-for="industri in jenisIndustri" :key="industri.id" :label="industri.value" :value="industri.value" />
                    </el-select>
                  </div>
                  <div v-if="this.$store.state.auth.level < 1" class="col-2 pr-0">
                    <el-select class="w-100" v-model="filter.province" placeholder="Filter Provinsi" @change="getCity" filterable>
                      <el-option label="Semua" value="" />
                      <el-option v-for="province in filterData.provList" :key="province._id" :label="province.name" :value="province.name" />
                    </el-select>
                  </div>
                  <div v-if="this.$store.state.auth.level < 2" class="col-2 pr-0">
                    <el-select class="w-100"  v-model="filter.city" placeholder="Filter Kab/Kot" filterable>
                      <el-option label="Semua" value="" />
                      <el-option v-for="city in cityData" :key="city._id" :label="city.name" :value="city.name" />
                    </el-select>
                  </div>
                  <div v-if="this.$store.state.auth.level < 3" class="col-2 pr-0">
                    <el-select class="w-100" v-model="filter.company" placeholder="Filter Industri" filterable>
                      <el-option label="Semua" value="" />
                      <el-option v-for="company in filterData.compList" :key="company._id" :label="company.name" :value="company.name" />
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <base-input class="m-0">
                      <flat-picker placeholder="Filter Bulan" :config="flatPickerConfig" class="form-control datepicker" v-model="filter.date" />
                    </base-input>
                  </div>
                  <div class="col-2">
                    <base-button class="w-100" size="md" type="secondary" @click="getData">
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
                @selection-change="selectionChange">
                <el-table-column v-if="this.$store.state.auth.level < 3" label="Nama Industri" prop="compDetails.compName" sortable />
                <el-table-column v-if="this.$store.state.auth.level < 3" label="Jenis Industri" prop="compDetails.compType" sortable />
                <el-table-column v-if="this.$store.state.auth.level < 1" label="Provinsi" prop="provDetails.provName" sortable />
                <el-table-column v-if="this.$store.state.auth.level < 2" label="Kab/Kot" prop="kabkotDetails.kabkotName" sortable />
                <el-table-column label="Bulan" prop="timestamp" sortable>
                  <template v-slot="{ row }">
                    {{ formatDate(row.timestamp) }}
                  </template>
                </el-table-column>
                <el-table-column label="Keterangan" prop="errSUM" />
                <el-table-column label="Surat Teguran">
                  <button class="btn btn-sm btn-primary mt-1" @click="downloadReprimandLetter">Download</button>
                </el-table-column>
              </el-table>
              <div
                slot="footer"
                class="col-12 my-2 d-flex justify-content-center justify-content-sm-between flex-wrap">
                <div class="d-flex align-items-center">
                  <p class="card-category mb-0 mr-2">Show</p>
                  <div style="width: 80px">
                    <el-select
                      class="select-primary pagination-select"
                      v-model="pagination.perPage"
                      placeholder="Per page"
                      size="mini">
                      <el-option
                        class="select-primary"
                        v-for="item in pagination.perPageOptions"
                        :key="item"
                        :label="item"
                        :value="item" />
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
                  :total="total" />
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
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'
import 'flatpickr/dist/plugins/monthSelect/style.css'
import "flatpickr/dist/flatpickr.css";
import axios from "axios";
import defaults from "@/util/defaults";
import { jenisIndustri } from '@/data/jenis-industri';

const flatPickerConfig = {
  allowInput: true,
  altInput: true,
  mode: "range",
  plugins: [
    new monthSelectPlugin({
      shorthand: true,
      dateFormat: "U",
      altFormat: "m/Y",
    })
  ]
};

export default {
  mixins: [clientPaginationMixin],
  components: {
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
      jenisIndustri,
      flatPickerConfig,
      loading: null,
      isLoading: true,
      auth: JSON.parse(localStorage.getItem("auth-data")),
      filter: {
        companyType: null,
        province: null,
        city: null,
        company: null,
        date: null,
      },
      tableData: [],
      originalData: [],
      filterData: {},
      cityData: [],
      selectedRows: [],
    };
  },
  methods: {
    apiParams() {
      return {
        type: this.filter.companyType || "",
        prov: this.filter.province || "",
        kabkot: this.filter.city || "",
        comp: this.filter.company || "",
        start: this.filter.date ? this.filter.date.split(" to ")[0] : "",
        end: this.filter.date ? moment.unix(+this.filter.date.split(" to ")[1]).endOf("month").format("X") : "",
      };
    },
    async getData() {
      this.loading = this.$loading.show({ loader: "dots" });
      const axiosConfig = {
        url: `/error/recapDay/${this.auth._id}`, // TODO CHANGE TO THE REAL URL
        methods: "get",
        baseURL: defaults.baseURL,
        params: this.apiParams(),
      }
      const { data } = await axios(axiosConfig);
      this.tableData = data;
      this.originalData = data;
      this.loading.hide();
      this.isLoading = false;
    },
    async getFilterData() {
      const { data } = await axios.get(`${defaults.baseURL}/report/list/${this.auth._id}`);
      this.filterData = data;
      this.cityData = data.kabkotList;
    },
    getCity() {
      if (this.filter.province) {
        this.cityData = this.filterData.kabkotList.filter((item) => item.provID === this.filter.province)
      } else {
        this.cityData = this.filterData.kabkotList;
      }
    },
    exportExcel() {
      const params = new URLSearchParams(this.apiParams()).toString();
      window.open(`${defaults.baseURL}/error/recapDay-export/${this.auth._id}?${params}`, "_blank"); // TODO CHANGE TO THE REAL URL
    },
    downloadReprimandLetter() {
      const url = `${defaults.baseURL}/storage/S.140 (Peringatan data melebihi baku mutu air limbah).pdf`;
      window.open(url, '_blank');
    },
    formatDate(timestamp) {
      return moment.unix(timestamp).format("MM/YYYY");
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
  },
  created() {
    this.getData();
    this.getFilterData();
  },
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
