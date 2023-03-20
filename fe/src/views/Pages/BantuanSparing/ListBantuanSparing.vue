<template>
  <div>
    <div>
      <div
        class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1">
        <h1 class="display-3 font-weight-light text-white m-0">Bantuan Sparing</h1>
      </div>
      <base-header style="height:250px" type="primary"></base-header>
      <div class="container-fluid" style="margin-top:-230px">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="row mb-4">
              <div class="col-12 mb-4">
                <div class="d-flex justify-content-end">
                  <base-button v-if="this.$store.state.auth.level > 2" class="bg-secondary" @click="showAddModal = true">
                    Buat Pertanyaan baru
                  </base-button>
                </div>
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-lg-3 mt--2">
                <span class="text-white">Judul Pertanyaan</span>
                <div class="form-group">
                  <input type="text" class="form-control mb-0 h-auto" placeholder="Filter Judul Pertanyaan" v-model="filter.title" @input="filterTitle" />
                </div>
              </div>
              <div  v-if="this.$store.state.auth.level < 1" class="col-lg-3  mt--2 mb-3">
                <span class="text-white">Provinsi</span>
                <el-select
                  class="w-100"
                  @change="filterProvince"
                  v-model="filter.province"
                  placeholder="Filter Provinsi"
                  filterable >
                  <el-option label="Semua" value="" />
                  <el-option
                    v-for="province in provinces"
                    :key="province._id"
                    :label="province.name"
                    :value="province._id" />
                </el-select>
              </div>
              <div v-if="this.$store.state.auth.level < 2" class="col-lg-3  mt--2 mb-3">
                <span class="text-white">KabKot</span>
                <el-select
                  class="w-100"
                  @change="filterCity"
                  v-model="filter.city"
                  placeholder="Filter KabKot"
                  filterable >
                  <el-option label="Semua" value="" />
                  <el-option
                    v-for="city in cities"
                    :key="city._id"
                    :label="city.name"
                    :value="city._id" />
                </el-select>
              </div>
              <div v-if="this.$store.state.auth.level < 3" class="col-lg-3  mt--2 mb-3">
                <span class="text-white">Industri</span>
                <el-select
                  class="w-100"
                  @change="filterIndustry"
                  v-model="filter.company"
                  placeholder="Filter Industrii"
                  filterable >
                  <el-option label="Semua" value="" />
                  <el-option
                    v-for="company in companies"
                    :key="company.compID"
                    :label="company.name"
                    :value="company.compID" />
                </el-select>
              </div>
            </div>
            <div id="bantuan-sparing" class="card">
              <div class="table-container">
                <el-table
                  v-if="!isLoading"
                  :data="queriedData"
                  row-key="_id"
                  header-row-class-name="thead-light"
                  @sort-change="sortChange"
                  @selection-change="selectionChange">
                  <el-table-column label="Tanggal" prop="waktu" sortable >
                  <template v-slot="{ row }">
                    <div class="cell">
                      {{ formatDate(row.waktu) }}
                    </div>
                  </template>
                </el-table-column>
                  <el-table-column label="Judul" prop="judul" min-width sortable />
                  <el-table-column label="Pembuat Pertanyaan" prop="penulis" min-width sortable />
                  <el-table-column
                    v-if="this.$store.state.auth.level < 1"
                    label="Provinsi"
                    prop="provinsi.provName"
                    min-width
                    sortable />
                  <el-table-column
                    v-if="this.$store.state.auth.level < 2"
                    label="KabKot"
                    prop="kabkot.kabkotName"
                    min-width
                    sortable />
                  <el-table-column
                    v-if="this.$store.state.auth.level < 3"
                    label="Industri"
                    prop="company.compName"
                    min-width
                    sortable />
                  <el-table-column label="Aksi">
                  <template v-slot="{ row }">
                    <button class="btn btn-sm btn-primary mt-1" @click="view(row)">View</button>
                    <button class="btn btn-sm btn-warning mt-1" @click="remove(row._id)">Delete</button>
                    <button v-if="row.lampiran.path || ''" class="btn btn-sm btn-success mt-1" @click="viewAttachment(row.lampiran.path)">Lampiran</button>
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
      <FormBantuanSparing v-if="showAddModal" :show-add-modal="showAddModal" @close="closeModal" />
      <DetailBantuanSparing v-if="showDetailModal" :show-detail-modal="showDetailModal" :data="viewData" @close="closeModal"/>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { BasePagination } from "@/components";
import clientPaginationMixin from "@/components/clientPaginationMixin";
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
import defaults from "@/util/defaults";
import Modal from "@/components/Modal.vue";
import FormBantuanSparing from "./FormBantuanSparing.vue";
import DetailBantuanSparing from "./DetailBantuanSparing.vue";

export default {
  mixins: [clientPaginationMixin],
  components: {
    BasePagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Modal,
    FormBantuanSparing,
    DetailBantuanSparing,
  },
  data() {
    return {
      filter: {
        title: null,
        province: null,
        city: null,
        company: null,
      },
      auth: JSON.parse(localStorage.getItem("auth-data")),
      provinces: [],
      cities: [],
      companies: [],
      showDetailModal: false,
      showAddModal: false,
      viewData: {},
      companyData: {},
      selectedRows: [],
      tableData: [],
      originalData: [],
      isLoading: true,
    };
  },
  methods: {
    async getFilterData() {
      const { data } = await axios.get(`${defaults.baseURL}/report/list/${this.auth._id}`);
      this.provinces = data.provList;
      this.cities = data.kabkotList;
      this.companies = data.compList;
    },
    filterTitle() {
      if (this.filter.title) {
        this.tableData = this.originalData.filter((item) => item.judul.toLowerCase().includes(this.filter.title.toLowerCase()));
      } else {
        this.tableData = this.originalData;
      }
      this.filter.province = null;
      this.filter.city = null;
      this.filter.company = null;
    },
    filterProvince() {
      if (this.filter.province) {
        this.tableData = this.originalData.filter((item) => item.provinsi._id === this.filter.province);
      } else {
        this.tableData = this.originalData;
      }
      this.filter.title = null;
      this.filter.city = null;
      this.filter.company = null;
    },
    filterCity() {
      if (this.filter.city) {
        this.tableData = this.originalData.filter((item) => item.kabkot._id === this.filter.city);
      } else {
        this.tableData = this.originalData;
      }
      this.filter.title = null;
      this.filter.province = null;
      this.filter.company = null;
    },
    filterIndustry() {
      if (this.filter.company) {
        this.tableData = this.originalData.filter((item) => item.company._id === this.filter.company);
      } else {
        this.tableData = this.originalData;
      }
      this.filter.title = null;
      this.filter.province = null;
      this.filter.city = null;
    },
    async getTableData() {
      const { data } = await axios.get(`${defaults.baseURL}/pengaduan/list/${this.auth._id}`);
      this.tableData = data;
      this.originalData = data;
      this.isLoading = false;
    },
    view(data) {
      this.showDetailModal = true;
      this.viewData = data;
    },
    remove(id) {
      Swal.fire({
        title: 'Apakah anda yakin akan menghapus pertanyaan ini?',
        confirmButtonText: 'Hapus',
        showCancelButton: true,
        cancelButtonText: 'Batal',
        icon: 'question',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(`${defaults.baseURL}/pengaduan/${id}`);
          if (response.status === 200) {
            Swal.fire({
              title: 'Pertanyaan berhasil dihapus',
              icon: 'success',
            });
            await this.getTableData();
          } else {
            Swal.fire({
              title: 'Pertanyaan gagal dihapus',
              icon: 'error',
            });
          }
        }
      })
    },
    viewAttachment(path) {
      window.open(`${defaults.baseURL}${path}`, "_blank");
    },
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY HH:mm");
      // return moment.unix(timestamp).format("DD/MM/YYYY, HH:mm");
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
  created() {
    this.getFilterData();
    this.getTableData();
  },
};
</script>

<style lang="scss">
#bantuan-sparing {
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