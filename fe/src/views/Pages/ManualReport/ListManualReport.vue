<template>
  <div>
    <div>
      <div
        class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1">
        <h1 class="display-3 font-weight-light text-white m-0">Laporan Manual Data Satu Minggu</h1>
      </div>
      <base-header style="height:250px" type="primary"></base-header>
      <div class="container-fluid" style="margin-top:-230px">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="row mb-4">
              <div class="col-12 mb-4">
                <div class="d-flex justify-content-end">
                  <base-button v-if="authLevel > 2" class="bg-secondary" @click="showAddModal = true">
                    Buat laporan baru
                  </base-button>
                </div>
              </div>
            </div>
            <div id="manual-report" class="card">
              <div class="d-flex justify-content-between m-4">
                <div class=" col-4">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="search"><i class="fas fa-search"></i></span>
                    </div>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Cari..."
                      aria-label="Search"
                      aria-describedby="search"
                      @input="search"
                      v-model="keyword" />
                  </div>
                </div>
                <div class="col-lg-3 input-group mb-3">
                  <select v-model="status" class="form-control" @change="filterStatus">
                    <option value="" disabled selected>Filter Status</option>
                    <option value="">Semua</option>
                    <option value="accepted">Diterima</option>
                    <option value="rejected">Ditolak</option>
                    <option value="waiting">Menunggu Validasi</option>
                  </select>
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
                  <el-table-column label="Industri" prop="compName" min-width sortable />
                  <el-table-column label="Tanggal Kejadian" prop="tanggalKejadian" sortable >
                    <template v-slot="{ row }">
                      <div class="cell">{{ formatDate(row.tanggalKejadian) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Minggu ke-" prop="week" min-width sortable />
                  <el-table-column label="File SHU" min-width>
                    <template v-slot="{ row }">
                      <button class="btn btn-sm btn-primary mt-1" @click="viewAttachment(row.fileSHU)">Download</button>
                    </template>
                  </el-table-column>
                  <el-table-column label="Status" min-width>
                    <template v-slot="{ row }">
                      <div
                        v-if="row.status === 'waiting'"
                        class="border border-warning rounded-lg px-2 py-1 text-warning w-fit">
                        Menunggu Validasi
                      </div>
                      <div
                        v-if="row.status === 'accepted'"
                        class="border border-success rounded-lg px-2 py-1 text-success w-fit">
                        Diterima
                      </div>
                      <div
                        v-if="row.status === 'rejected'"
                        class="border border-danger rounded-lg px-2 py-1 text-danger w-fit">
                        Ditolak
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Aksi">
                  <template v-slot="{ row }">
                    <button class="btn btn-sm btn-info mt-1" @click="view(row)">View</button>
                    <button
                      v-if="authLevel > 2 && row.status !== 'accepted'"
                      class="btn btn-sm btn-warning mt-1"
                      @click="edit(row)">
                      Edit
                    </button>
                    <button
                      v-if="authLevel > 2 && row.status === 'waiting'"
                      class="btn btn-sm btn-danger mt-1"
                      @click="remove(row._id)">
                      Delete
                    </button>
                    <button
                      v-if="authLevel < 1 && row.status !== 'accepted'"
                      class="btn btn-sm btn-dark mt-1"
                      @click="validateReport(row)">
                      Validasi
                    </button>
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
      <FormManualReport v-if="showAddModal" :show-add-modal="showAddModal" @close="closeModal" />
      <EditManualReport v-if="showEditModal" :show-edit-modal="showEditModal" :data="viewData" @close="closeModal" />
      <DetailManualReport v-if="showDetailModal" :show-detail-modal="showDetailModal" :data="viewData" @close="closeModal"/>
      <ValidateRequest
        v-if="showValidateModal"
        :show-validate-modal="showValidateModal"
        :data="validatationHistory"
        @close="closeModal" />
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
import FormManualReport from "./FormManualReport.vue";
import EditManualReport from "./EditManualReport.vue";
import DetailManualReport from "./DetailManualReport.vue";
import ValidateRequest from "./ValidateRequest.vue";

export default {
  mixins: [clientPaginationMixin],
  components: {
    BasePagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Modal,
    FormManualReport,
    EditManualReport,
    DetailManualReport,
    ValidateRequest,
  },
  data() {
    return {
      authLevel: this.$store.state.auth.level,
      status: "",
      keyword: null,
      auth: JSON.parse(localStorage.getItem("auth-data")),
      provinces: [],
      cities: [],
      companies: [],
      showDetailModal: false,
      showAddModal: false,
      showEditModal: false,
      showValidateModal: false,
      viewData: {},
      validatationHistory: [],
      reportId: null,
      companyData: {},
      selectedRows: [],
      tableData: [],
      originalData: [],
      isLoading: true,
      loader: null,
    };
  },
  methods: {
    async getFilterData() {
      const { data } = await axios.get(`${defaults.baseURL}/report/list/5f340d5e328182315c11ee98`);
      this.provinces = data.provList;
      this.cities = data.kabkotList;
      this.companies = data.compList;
    },
    async getTableData() {
      this.loader = this.$loading.show({ loader: "dots" });
      const { data } = await axios.get(`${defaults.baseURL}/laporanMingguan/getform/${this.auth._id}`);
      if (data.length) {
        const newData = data.sort((a, b) => b.createdAt - a.createdAt).map((item) => {
          const compName = this.companies.find(({ compID }) => compID === item.compID);
          return {
            ...item,
            compName: compName ? compName.name : 'Company ID tidak valid',
          }
        });

        this.tableData = newData;
        this.originalData = newData;
      } else {
        this.tableData = data;
        this.originalData = data;
      }
      
      this.isLoading = false;
      this.loader.hide();
    },
    search() {
      this.tableData = this.originalData.filter((item) => {
        return item.compName.toLowerCase().includes(this.keyword.toLowerCase())
      });
    },
    filterStatus() {
      this.tableData = this.originalData.filter(({ status }) => !this.status || status === this.status);
    },
    view(data) {
      this.showDetailModal = true;
      this.viewData = data;
    },
    edit(data) {
      this.showEditModal = true;
      this.viewData = data;
    },
    remove(id) {
      Swal.fire({
        title: 'Apakah anda yakin akan menghapus data ini?',
        confirmButtonText: 'Hapus',
        showCancelButton: true,
        cancelButtonText: 'Batal',
        icon: 'question',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const body = { formId: id};
          const response = await axios.post(`${defaults.baseURL}/laporanMingguan/delete`, body);
          if (response.status === 200) {
            Swal.fire({
              title: 'Data berhasil dihapus',
              icon: 'success',
            });
            await this.getTableData();
          } else {
            Swal.fire({
              title: 'Data gagal dihapus',
              icon: 'error',
            });
          }
        }
      })
    },
    viewAttachment(path) {
      window.open(`${defaults.baseURL}${path}`, "_blank");
    },
    validateReport(data) {
      this.validatationHistory = data;
      this.showValidateModal = true;
    },
    formatDate(date) {
      return moment.unix(date).format("DD/MM/YYYY");
    },
    async closeModal() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.showDetailModal = false;
      this.showValidateModal = false;
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
#manual-report {
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