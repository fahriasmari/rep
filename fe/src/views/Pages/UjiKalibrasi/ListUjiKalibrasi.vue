<template>
  <div>
    <div>
      <div
        class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1">
        <h1 class="display-3 font-weight-light text-white m-0">Uji Kalibrasi</h1>
      </div>
      <base-header style="height:250px" type="primary"></base-header>
      <div class="container-fluid" style="margin-top:-230px">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div id="uji-kalibrasi" class="card">
              <div class="row my-4 mr-4">
                <div class="col-12">
                  <div class="d-flex justify-content-end">
                    <base-button class="bg-secondary" @click="exportExcel">
                      Download
                    </base-button>
                    <base-button v-if="authLevel > 2" class="bg-secondary" @click="showAddModal = true">
                      Tambah Uji Kalibrasi
                    </base-button>
                  </div>
                </div>
              </div>
              <div class="row col-12 mb-4">
                <div v-if="authLevel < 3" class="col-3 pr-0">
                  <el-select class="w-100" v-model="filter.type" filterable placeholder="Jenis Industri" @change="getTableData">
                    <el-option value="">Semua</el-option>
                    <el-option
                      v-for="industri in jenisIndustri"
                      :key="industri.value"
                      :label="industri.value"
                      :value="industri.value" />
                  </el-select>
                </div>
                <div v-if="authLevel < 1" class="col-3 pr-0">
                  <el-select class="w-100" v-model="filter.prov" filterable placeholder="Provinsi" @change="filterCity">
                    <el-option value="">Semua</el-option>
                    <el-option
                      v-for="province in provinces"
                      :key="province._id"
                      :label="province.value"
                      :value="province._id" />
                  </el-select>
                </div>
                <div v-if="authLevel < 2" class="col-3 pr-0">
                  <el-select class="w-100" v-model="filter.kabkot" filterable placeholder="Kab/Kota" @change="getTableData">
                    <el-option value="">Semua</el-option>
                    <el-option
                      v-for="city in cities"
                      :key="city._id"
                      :label="city.value"
                      :value="city._id" />
                  </el-select>
                </div>
                <div v-if="authLevel < 3" class="col-3 pr-0">
                  <el-select class="w-100" v-model="filter.comp" filterable placeholder="Industri" @change="getTableData">
                    <el-option value="">Semua</el-option>
                    <el-option
                      v-for="company in companies"
                      :key="company._id"
                      :label="company.value"
                      :value="company.compID" />
                  </el-select>
                </div>
              </div>
              <div class="table-container">
                <el-table
                  v-if="!isLoading"
                  :data="queriedData"
                  row-key="_id"
                  header-row-class-name="thead-light"
                  @sort-change="sortChange"
                  @selection-change="selectionChange">
                  <el-table-column v-if="authLevel < 3" label="Nama Industri" prop="compName" sortable />
                  <el-table-column v-if="authLevel < 3" label="Jenis Industri" prop="compType" sortable />
                  <el-table-column v-if="authLevel < 1" label="Provinsi" prop="provName" sortable />
                  <el-table-column v-if="authLevel < 2" label="Kab/Kota" prop="kabkotName" sortable />
                  <el-table-column label="Tanggal" sortable>
                    <template v-slot="{ row }">
                      <div class="cell">{{ formatDate(row.timestamp) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Periode" sortable>
                    <template v-slot="{ row }">
                      <div class="cell">{{ getPeriod(row.timestamp) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Aksi">
                  <template v-slot="{ row }">
                    <button class="btn btn-sm btn-info mt-1" @click="view(row)">Detail</button>
                  </template>
                </el-table-column>
                </el-table>
              </div>
              <div slot="footer" class="col-12 my-2 d-flex justify-content-center justify-content-sm-between flex-wrap">
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
    <AddUjiKalibrasi
      v-if="showAddModal"
      :show-add-modal="showAddModal"
      @close="closeModal" />
    <DetailUjiKalibrasi
      v-if="showDetailModal"
      :show-detail-modal="showDetailModal"
      :data="detailData"
      @close="closeModal" />
  </div>
</template>

<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { BasePagination } from "@/components";
import clientPaginationMixin from "@/components/clientPaginationMixin";
import moment from "moment";
import axios from "axios";
import defaults from "@/util/defaults";
import Modal from "@/components/Modal.vue";
import AddUjiKalibrasi from "./AddUjiKalibrasi.vue"
import DetailUjiKalibrasi from "./DetailUjiKalibrasi.vue";
import { jenisIndustri } from "../../../data/jenis-industri";

export default {
  mixins: [clientPaginationMixin],
  components: {
    BasePagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Modal,
    AddUjiKalibrasi,
    DetailUjiKalibrasi,
  },
  data() {
    return {
      authLevel: this.$store.state.auth.level,
      jenisIndustri,
      auth: JSON.parse(localStorage.getItem("auth-data")),
      provinces: [],
      cities: [],
      originalCity: [],
      companies: [],
      showDetailModal: false,
      showAddModal: false,
      detailData: {},
      selectedRows: [],
      tableData: [],
      isLoading: true,
      loader: null,
      filter: {
        type: "",
        prov: "",
        kabkot: "",
        comp: "",
      },
    };
  },
  methods: {
    async getFilterData() {
      const { data } = await axios.get(`${defaults.baseURL}/report/list/5f340d5e328182315c11ee98`);
      this.provinces = data.provList;
      this.cities = data.kabkotList;
      this.originalCity = data.kabkotList;
      this.companies = data.compList;
    },
    async getTableData() {
      const params = new URLSearchParams(this.filter).toString();
      this.loader = this.$loading.show({ loader: "dots" });
      const { data } = await axios.get(`${defaults.baseURL}/kalibrasi/${this.auth._id}?${params}`);
      data.sort((a, b) => b.timestamp - a.timestamp)
      this.tableData = data;
      this.isLoading = false;
      this.loader.hide();
    },
    filterCity() {
      this.cities = this.originalCity.filter(({ provID }) => !this.filter.prov || provID === this.filter.prov)
      this.getTableData()
    },
    view(data) {
      this.showDetailModal = true;
      this.detailData = data;
    },
    exportExcel() {
      const params = new URLSearchParams(this.filter).toString();
      window.open(`${defaults.baseURL}/kalibrasi/export/${this.auth._id}?${params}`, "_blank");
    },
    formatDate(date) {
      return moment.unix(date).format("DD/MM/YYYY");
    },
    getPeriod(date) {
      const period = moment.unix(date).quarter();
      return `Q${period}`;
    },
    async closeModal() {
      this.showAddModal = false;
      this.showDetailModal = false;
      await this.getTableData();
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
  },
  async created() {
    await this.getFilterData();
    await this.getTableData();
  },
};
</script>

<style lang="scss">
#uji-kalibrasi {
  .el-table {
    .el-table__row {
      &:hover {
        background: transparent;
        cursor: unset;
      }
    }
  }
}
.w-fit {
  width: fit-content;
}
</style>
