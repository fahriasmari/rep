<template>
  <div>
    <div id="listed-report">
      <div
        class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1">
        <h1 class="display-3 font-weight-light text-white m-0">
          Berita Acara Verifikasi Lapangan
        </h1>
        <h2 class="text-white mx-4 my-0">-</h2>
        <h4 class="text-default m-0">List Berita Acara</h4>
      </div>
      <base-header class="pb-8" type="primary" style="height:210px"></base-header>
      <div class="container-fluid" style="margin-top: -12rem;">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="row continer mb-3 float-right">
              <div class="col-12">
                <base-button
                  v-if="this.$store.state.auth.level < 1"
                  size="md"
                  type="secondary"
                  @click="showAddModal = true">
                  Tambah Data
                </base-button>
              </div>
            </div>
            <!-- Filter -->
            <div class="row col-12 mb-4">
              <div v-if="this.$store.state.auth.level < 1" class="col-lg-3 ml--3">
                <span class="text-white">Provinsi</span>
                <el-select class="w-100" @change="filterProvince" v-model="filter.provID" filterable >
                  <el-option label="Semua" value="" />
                  <el-option v-for="province in provinces" :key="province._id" :label="province.name" :value="province._id" />
                </el-select>
              </div>
              <div v-if="this.$store.state.auth.level < 2" class="col-lg-3">
                <span class="text-white">KabKot</span>
                <el-select class="w-100" @change="filterCity" v-model="filter.kabkotID" filterable >
                <el-option label="Semua" value="" />
                  <el-option v-for="city in cities"  :key="city._id" :label="city.name" :value="city._id" />
                </el-select>
              </div>
              <div v-if="this.$store.state.auth.level < 3" class="col-lg-3">
                <span class="text-white">Industri</span>
                <input type="text" class="form-control h-auto" v-model="filter.companyName" @input="filterIndustry">
              </div>
              <div v-if="this.$store.state.auth.level < 3" class="col-lg-3">
                <span class="text-white">Status</span>
                <el-select class="w-100" @change="filterStatus" v-model="filter.isRegistered" >
                <el-option label="Semua" :value="null" />
                  <el-option label="Tidak Terdaftar" :value="false" />
                  <el-option label="Terdaftar" :value="true" />
                </el-select>
              </div>
            </div>
            <!-- Table -->
            <div class="card">
              <el-table
                :data="queriedData"
                row-key="_id"
                header-row-class-name="thead-light"
                @sort-change="sortChange"
                @selection-change="selectionChange">
                <el-table-column label="Tanggal Berita Acara" prop="tanggalBeritaAcara" sortable >
                  <template v-slot="{ row }">
                    <div class="cell">
                      {{ formatDate(row.tanggalBeritaAcara) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column v-if="this.$store.state.auth.level < 1" label="Provinsi" prop="provName" min-width sortable />
                <el-table-column v-if="this.$store.state.auth.level < 2" label="Kabkot" prop="kabkotName" min-width sortable />
                <el-table-column v-if="this.$store.state.auth.level < 3" label="Nama Industri" prop="compName" min-width sortable />
                <el-table-column v-if="this.$store.state.auth.level < 3" label="Status">
                  <template v-slot="{ row }">
                    <div class="cell">
                      {{ row.compID ? "Terdaftar" : "Tidak Terdaftar" }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Tanggal Kunjungan" prop="tanggalKunjungan" sortable >
                  <template v-slot="{ row }">
                    <div class="cell">
                      {{ formatDate(row.tanggalKunjungan) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="File Lampiran" min-width>
                  <template v-slot="{ row }">
                    <base-button type="primary" class="btn-sm" @click="downloadFile(row)">
                      Download
                    </base-button>
                  </template>
                </el-table-column>
                <el-table-column v-if="this.$store.state.auth.level < 1" label="Aksi">
                  <template v-slot="{ row }">
                    <base-button type="warning" class="btn-sm mb-1" @click="onEdit(row)">
                      Edit
                    </base-button>
                    <base-button type="danger" class="btn-sm" @click="onDelete(row)">
                      Delete
                    </base-button>
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
    <FormBeritaAcara v-if="showAddModal" :data="modalData" :show-modal="showAddModal" @close="onCloseModal" />
    <UpdateBeritaAcara v-if="showEditModal" :data="editData" :show-modal="showEditModal" @close="onCloseModal" />
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { BasePagination } from "@/components";
import clientPaginationMixin from "@/components/clientPaginationMixin";
import moment from "moment";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import axios from "axios";
import defaults from "@/util/defaults";
import FormBeritaAcara from "./FormBeritaAcara.vue";
import UpdateBeritaAcara from "./UpdateBeritaAcara.vue";

const flatpickerOption = {
  dateFormat: "U",
  allowInput: true,
  altInput: true,
  altFormat: "d/m/Y",
};

export default {
  mixins: [clientPaginationMixin],
  components: {
    BasePagination,
    FormBeritaAcara,
    UpdateBeritaAcara,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      auth: {},
      showAddModal: false,
      showEditModal: false,
      uploading: false,
      provinces: [],
      cities: [],
      companies: [],
      flatpickerOption,
      baseURL: defaults.baseURL,
      modalData: {},
      editData: {},
      filter: {
        isRegistered: "",
        companyName: null,
        provID: null,
        kabkotID: null,
      },
      selectedRows: [],
      tableData: [],
      tempData: [],
    };
  },
  methods: {
    async getData() {
      const { data } = await axios.get(`${defaults.baseURL}/beritaacara/${this.auth._id}`);
      this.tableData = data;
      this.tempData = data;
    },
    async getRegion() {
      const { data } = await axios.get(`${defaults.baseURL}/report/list/5f340d5e328182315c11ee98`);
      this.provinces = data.provList;
      this.cities = data.kabkotList;
      this.companies = data.compList;
      this.modalData = data;
    },
    onEdit(data) {
      this.showEditModal = true;
      this.editData = data;
    },
    onDelete(data) {
      Swal.fire({
        title: "Apakah anda yakin?",
        text: `Apakah anda yakin ingin menghapus berita acara ${data.compName}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Batal",
        confirmButtonText: "Hapus",
        reverseButtons: true,
      }).then( async (result) => {
        if (result.isConfirmed) {
            const response = await axios.delete(`${defaults.baseURL}/beritaacara/${data.id}`);
           if (response.status === 200) {
            Swal.fire("Delete Success", "Data berhasil dihapus", "success");
            this.getData();
          } else {
            Swal.fire("gagal menghapus", "Data gagal dihapus, silahkan coba kembali", "error");
          }
        }
      });
    },
    onCloseModal() {
      this.getData();
      this.showAddModal = false;
      this.showEditModal = false;
    },
    filterProvince() {
      if (this.filter.provID) {
         this.tableData = this.tempData.filter((data) => data.provID === this.filter.provID);
      } else {
        this.tableData = this.tempData
      }
      this.filter.isRegistered = "";
      this.filter.companyName = null;
      this.filter.kabkotID = null;
    },
    filterCity() {
      if (this.filter.kabkotID) {
        this.tableData = this.tempData.filter((data) => data.kabkotID === this.filter.kabkotID);
      } else {
        this.tableData = this.tempData
      }
      this.filter.isRegistered = "";
      this.filter.companyName = null;
      this.filter.provID = null;
    },
    filterIndustry() {
      if (this.filter.companyName) {
        this.tableData = this.tempData.filter((data) => data.compName.toLowerCase().includes(this.filter.companyName.toLowerCase()));
      } else {
        this.tableData = this.tempData
      }
      this.filter.isRegistered = "";
      this.filter.provID = null;
      this.filter.kabkotID = null;
    },
    filterStatus() {
      if (typeof this.filter.isRegistered === 'boolean') {
        this.tableData = this.tempData.filter((data) => !!data.compID === this.filter.isRegistered);
      } else {
        this.tableData = this.tempData
      }
      this.filter.companyName = null;
      this.filter.provID = null;
      this.filter.kabkotID = null;
    },
    formatDate(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY");
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    downloadFile(row) {
      window.open(`${defaults.baseURL}${row.lampiranBeritaAcara}`, "_blank");
    },
  },
  created() {
    this.auth = JSON.parse(localStorage.getItem("auth-data"));
    this.getData();
    this.getRegion();
  },
};
</script>
<style lang="scss">
#listed-report {
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