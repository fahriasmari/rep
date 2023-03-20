<template>
  <div>
    <div
      class="d-flex align-items-center overflow-hidden position-absolute w-100"
      style="height: 66px; padding: 0 30px; top: 0; z-index: 1">
      <h1 class="display-3 font-weight-light text-white m-0">Isian Laporan Kondisi Tidak Normal</h1>
    </div>
    <base-header class="pb-8" type="primary"></base-header>
    <div class="container-fluid mt--7">
      <div class="row justify-content-center mb--4">
        <div class="col">
          <div id="kondisi-tidak-normal" class="card">
            <!-- Filter -->
            <div class="p-3 w-100">
              <div class="row">
                <div  v-if="this.$store.state.auth.level < 3" class="col-2 pr-0">
                  <el-select
                    class="w-100"
                    v-model="filter.companyType"
                    placeholder="Filter Jenis Industri"
                    filterable
                    @change="filterComanyType">
                    <el-option label="Semua" value="" />
                    <el-option
                      v-for="industri in jenisIndustri"
                      :key="industri.id"
                      :label="industri.value"
                      :value="industri.value" />
                  </el-select>
                </div>
                <div v-if="this.$store.state.auth.level < 1" class="col-2 pr-0">
                  <el-select
                    class="w-100"
                    v-model="filter.province"
                    placeholder="Filter Provinsi"
                    filterable
                    @change="filterProvince">
                    <el-option label="Semua" value="" />
                    <el-option
                      v-for="province in filterData.provList"
                      :key="province._id"
                      :label="province.value"
                      :value="province._id" />
                  </el-select>
                </div>
                <div v-if="this.$store.state.auth.level < 2" class="col-2 pr-0">
                  <el-select
                    class="w-100"
                    v-model="filter.city"
                    placeholder="Filter Kab/Kot"
                    filterable
                    @change="filterCity">
                    <el-option label="Semua" value="" />
                    <el-option
                      v-for="city in filterData.kabkotList"
                      :key="city._id"
                      :label="city.value"
                      :value="city._id" />
                  </el-select>
                </div>
                <div v-if="this.$store.state.auth.level < 3" class="col-2 pr-0">
                  <el-select
                    class="w-100"
                    v-model="filter.company"
                    filterable
                    placeholder="Filter Industri"
                    @change="filterIndustry">
                    <el-option label="Semua" value="" />
                    <el-option
                      v-for="company in filterData.compList"
                      :key="company._id"
                      :label="company.value"
                      :value="company.compID"
                    ></el-option>
                  </el-select>
                </div>
                <div class="col-2 pr-0">
                  <base-input class="m-0">
                    <flat-picker
                      placeholder="Filter Tanggal"
                      :config="flatPickerConfig"
                      class="form-control datepicker"
                      v-model="filter.time"
                      @on-change="filterTime" />
                  </base-input>
                </div>
                <div v-if="this.$store.state.auth.level < 1" class="col-2">
                  <base-button class="w-100" size="md" type="primary" @click="exportExcel">
                    Download
                  </base-button>
                </div>
                <div v-if="this.$store.state.auth.level > 2" class="col-10">
                  <div class="col-3 float-right">
                    <base-button class="w-100" size="md" type="primary" @click="addReport">
                      Tabmah Data
                    </base-button>
                  </div>
                </div>
              </div>
            </div>
            <!-- Table -->
            <el-table
              :data="queriedData"
              row-key="_id"
              header-row-class-name="thead-light"
              @sort-change="sortChange"
              @selection-change="selectionChange">
              <el-table-column
                v-if="this.$store.state.auth.level < 3"
                label="Nama Perusahaan"
                prop="compDetails.compName"
                min-width
                sortable />
              <el-table-column
                v-if="this.$store.state.auth.level < 3"
                label="Jenis Industri"
                prop="compDetails.compType"
                min-width
                sortable />
              <el-table-column
                v-if="this.$store.state.auth.level < 1"
                label="Provinsi"
                prop="provDetails.provName"
                min-width
                sortable />
              <el-table-column
                v-if="this.$store.state.auth.level < 2"
                label="Kab/Kot"
                prop="kabkotDetails.kabkotName"
                min-width
                sortable />
              <el-table-column label="Tanggal" prop="tanggalKejadian" min-width sortable>
                <template v-slot="{ row }">
                  <div class="cell">{{ formatDate(row.tanggalKejadian) }}</div>
                </template>
              </el-table-column>
              <el-table-column label="Kondisi" prop="kondisi" min-width sortable />
              <el-table-column label="Detail" min-width>
                <template v-slot="{ row }">
                  <base-button class="btn-sm bg-secondary" @click="goToDetail(row._id)">Detail</base-button>
                </template>
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
</template>
<script>
import { jenisIndustri } from "@/data/jenis-industri";
import axios from "axios";
import moment from "moment";
import defaults from "@/util/defaults";
import clientPaginationMixin from "@/components/clientPaginationMixin";
import { Table, TableColumn, Select, Option } from "element-ui";
import FlatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

const flatPickerConfig = {
  dateFormat: "U",
  allowInput: true,
  altFormat: "d/m/Y",
  altInput: true,
  mode: "range",
};
export default {
  mixins: [clientPaginationMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    FlatPicker,
  },
  data() {
    return {
      jenisIndustri,
      flatPickerConfig,
      tableData: [],
      originalData: [],
      auth: JSON.parse(localStorage.getItem("auth-data")),
      filterData: {},
      filter: {
        companyType: null,
        province: null,
        city: null,
        company: null,
        time: null,
      },
      selectedRows: [],
    }
  },
  methods: {
    async getData() {
      const { data } = await axios.get(`${defaults.baseURL}/form/cond-report-all/${this.auth._id}`);
      this.originalData = data;
      this.tableData = data;
    },
    async getFilterData() {
      const { data } = await axios.get(`${defaults.baseURL}/report/list/${this.auth._id}`);
      this.filterData = data;
    },
    filterComanyType() {
      if (this.filter.companyType) {
        this.tableData = this.originalData.filter((item) => item.compDetails.compType === this.filter.companyType);
      } else {
        this.tableData = this.originalData;
      }
      this.filter.province = null;
      this.filter.city = null;
      this.filter.company = null;
      this.filter.time = null;
    },
    filterProvince() {
      if (this.filter.province) {
        this.tableData = this.originalData.filter((item) => item.provID === this.filter.province);
      } else {
        this.tableData = this.originalData;
      }
      this.filter.companyType = null;
      this.filter.city = null;
      this.filter.company = null;
      this.filter.time = null;
    },
    filterCity() {
      if (this.filter.city) {
        this.tableData = this.originalData.filter((item) => item.kabkotID === this.filter.city);
      } else {
        this.tableData = this.originalData;
      }
      this.filter.companyType = null;
      this.filter.province = null;
      this.filter.company = null;
      this.filter.time = null;
    },
    filterIndustry() {
      if (this.filter.company) {
        this.tableData = this.originalData.filter((item) => item.compID === this.filter.company);
      } else {
        this.tableData = this.originalData;
      }
      this.filter.companyType = null;
      this.filter.province = null;
      this.filter.city = null;
      this.filter.time = null;
    },
    filterTime() {
      if (this.filter.time) {
        const date = this.filter.time.split(" to ");
        const startDate = +date[0];
        const endDate = +date[1] + 86399; // + 23 hours 59 minutes
        this.tableData = this.originalData.filter((item) => startDate <= item.tanggalKejadian && item.tanggalKejadian <= endDate);
      } else {
        this.tableData = this.originalData;
      }
    },
    exportExcel() {
      window.open(`${defaults.baseURL}/form/cond-report-all-export`, "_blank");
    },
    goToDetail(id) {
      this.$router.push(`/content/detail-kondisi-tidak-normal/${id}`);
    },
    addReport() {
      this.$router.push("/content/tambah-kondisi-tidak-normal");
    },
    formatDate(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY");
    },
    selectionChange(selection) {
      this.selectedRows = selection;
    },
  },
  created() {
    this.getData();
    this.getFilterData();
  },
}
</script>

<style lang="scss">
#kondisi-tidak-normal {
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