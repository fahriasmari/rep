<template>
  <div>
    <div>
      <div
        class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1">
        <h1 class="display-3 font-weight-light text-white m-0">Validasi Pendaftaran</h1>
      </div>
      <base-header class="pb-8" type="primary"></base-header>
      <div class="container-fluid mt--7">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="card">
              <div class="row mt-2">
                <div class="col-12">
                  <button class="btn btn-primary float-right mr-36" @click="exportExcel">Download</button>
                </div>
              </div>
              <div class="search-button">
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
                    <option value="all">Semua</option>
                    <option value="accepted">Tervalidasi</option>
                    <option value="rejected">Ditolak</option>
                    <option value="waiting">Menunggu Validasi</option>
                    <!-- <option value="resubmission-waiting">Menunggu Validasi Perubahan Data</option> -->
                  </select>
                </div>
              </div>
              <div class="table-container" id="table">
                <el-table
                  :data="queriedData"
                  row-key="id"
                  header-row-class-name="thead-light"
                  @sort-change="sortChange"
                  @selection-change="selectionChange">
                  <el-table-column label="ID Pendaftaran" prop="_id" min-width sortable />
                  <el-table-column label="Nama Industri" prop="umum.compName" min-width sortable />
                  <el-table-column label="Jenis Industri" prop="umum.compType" min-width sortable /> 
                  <el-table-column label="Provinsi" prop="umum.compProvinceName" min-width sortable />
                  <el-table-column label="No Telpon Industri" prop="umum.compPhone" min-width sortable />
                  <el-table-column label="Email" prop="umum.compMail" min-width sortable />
                  <el-table-column label="Nama Penanggung Jawab" prop="umum.nameSIUP" min-width sortable />
                  <el-table-column label="Waktu Dibuat" prop="umum.createdAt" sortable >
                    <template v-slot="{ row }">
                      {{ dateTime(row.umum.createdAt) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="Waktu Diubah" prop="umum.updatedAt" sortable >
                    <template v-slot="{ row }">
                      {{ row.umum.updatedAt ? dateTime(row.umum.updatedAt) : "-" }}
                    </template>
                  </el-table-column>
                  <el-table-column label="Status">
                  <template v-slot="{ row }">
                    <!-- 
                      INI MASIH BINGUNG MAS BRO
                      validated isinya boolean, sedangkan di sini isinya yg belum validasi doang, gimana dong

                      yaudah mas keluarin aja yang yang bukan di setujui kan ini menu validasi bukan list pendaftaran :)


                      aturan status

                       - jika reject true = berarti data reject

                       - jika validated false dan rejected false dan resubmision false = berarti data pendaftaran baru diajukan

                       - jika  validated false dan rejected true dann resubmision true = data yang pernah ditolak lalu mengajukan ulang kembali

                       - jika validated false dan rejected false dan resubmission true = data yang sebelum nya tervalidasi melakukan perubahaan data dan melakukan validasi ulang

                      
                    -->

                    <!-- <p v-if="row.rejected" class="status status-rejected">Ditolak</p> -->
                    
                    <!-- PENGAJUAN BARU TRUE INI UNTUK DATA BARU DIAJUKAN -->
                   <!-- <p v-else-if="!row.validated && !row.rejected && !row.resubmission && !row.perubahan_data" class="status status-waiting">
                    <span v-if="row.existing">Menunggu Validasi Perubahan Data</span>
                    <span v-else>Menunggu Validasi</span>
                  </p>
                  <p v-else-if="row.validated" class="status status-accepted">Tervalidasi</p> -->

                     <!-- perubahan_data TRUE INI UNTUK DATA YANG SUDAH TERVALIDASI SEBELUM NYA DAN MELAKUKAN PERUBAHAN DATA-->
                    <!-- <p v-else-if ="status.row.perubahan_data == true && status.row.rejected != true " class="status status-waiting">Perubahan Data</p> -->

                     <!-- resubmission TRUE INI UNTUK DATA YANG BARU DI REJECT DAN DIAJUKAN ULANG-->

                    <!-- <p v-else-if="status.row.pengajuan_baru == true && status.row.resubmission == true " class="status status-waiting">Pengajuan Revisi</p> -->

                    <!-- <p v-else-if="status.row.validated == false && status.row.rejected == true && status.row.resubmission == true " class="status status-waiting">Perubahan Data</p>
                    <p v-else-if="status.row.validated == false && status.row.rejected == false && status.row.resubmission == true " class="status status-waiting">Pengajuan Revisi</p> -->
                    <!-- <p class="status status-accepted">Pernah Disetujui</p> -->
                    <p v-if="row.validated" class="status status-accepted">Tervalidasi</p>
                    <template v-else>
                      <p v-if="row.rejected" class="status status-rejected">Ditolak</p>
                      <p v-else-if="!row.rejected || row.resubmission" class="status status-waiting">Menunggu Validasi</p>
                    </template>
                  </template>
                </el-table-column>
                  <el-table-column label="Aksi">
                  <template v-slot="{ row }">
                    <button class="action-btn action-btn-view" @click="view(row)">View</button>
                    <button class="action-btn action-btn-deactive" @click="remove(row._id, row.umum.compName)">Hapus</button>
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

  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { BasePagination } from "@/components";
import clientPaginationMixin from "@/components/clientPaginationMixin";
import moment from "moment";
import HtmlEditor from "@/components/Inputs/HtmlEditor";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import axios from "axios";
import defaults from "@/util/defaults";
import Modal from "@/components/Modal.vue";

export default {
  mixins: [clientPaginationMixin],
  components: {
    BasePagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Modal,
    HtmlEditor,
  },
  data() {
    return {
      showVerifyModal: false,
      verifyNote: "",
      verifyId: null,
      verifyCompany: null,
      verifyStatus: null,
      selectedRows: [],
      tableData: [],
      tempData: [],
      histories: [],
      keyword: null,
      status: "",
      loading: false,
    };
  },
  computed: {
  },
  methods: {
    async getTableData() {
      this.loading = this.$loading.show({ loader: "dots" });
      const { data } = await axios.get(`${defaults.baseURL}/pendaftaran/list`);
      this.tableData = data;
      this.tempData = data;
      this.loading.hide();
    },
    view(data) {
      this.$store.commit("setPendaftarData", data);
      this.$router.push("/admin/detail/validasi");
    },
    remove(id, company) {
      Swal.fire({
        title: "Hapus?",
        text: `Apakah Anda yakin alan menghapus ${company}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
      })
      .then(result => {
        if(result.isConfirmed){
          axios.delete(`${defaults.baseURL}/pendaftaran/${id}`)
          .then(() => {
            Swal.fire({
              title: "Berhasil",
              text: `${company} berhasil dihapus`,
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            this.getTableData();
          })
          .catch(() => {
            Swal.fire({
              title: "Gagal",
              text: `${company} gagal dihapus, silahkan coba kembali`,
              icon: "error",
              showConfirmButton: false,
              timer: 1500,
            });
          });
        }
      });
    },
    reject() {
      Swal.fire({
        title: 'Apakah anda yakin akan menolak pendaftaran?',
        confirmButtonText: 'Tolak',
        showCancelButton: true,
        cancelButtonText: 'Batal',
        icon: 'question',
      }).then((result) => {
        if (result.isConfirmed) {
          this.verifyStatus = "rejected";
          this.submitData();
        }
      })
    },
    accept() {
      Swal.fire({
        title: 'Apakah anda yakin akan menerima pendaftaran?',
        confirmButtonText: 'Terima',
        showCancelButton: true,
        cancelButtonText: 'Batal',
        icon: 'question',
      }).then((result) => {
        if (result.isConfirmed) {
          this.verifyStatus = "validated";
          this.submitData();
        }
      })
    },
    async submitData() {
      const payload = {
        keterangan: this.verifyNote,
        user_id: JSON.parse(localStorage.getItem("auth-data")).name,
        action: this.verifyStatus
      };
      const response = await axios.put(`${defaults.baseURL}/pendaftaran/validasi/${this.verifyId}`, payload);
      if (response.status === 200) {
        Swal.fire('Data berhasil disimpan!', '', 'success')
        this.getTableData();
      } else {
        Swal.fire('Data gagal disimpan!', '', 'error')
      }
      this.showVerifyModal = false;
    },
    search() {
      this.tableData = this.tempData.filter((item) => {
        return item.umum.compName.toLowerCase().includes(this.keyword.toLowerCase()) ||
          item._id.toLowerCase().includes(this.keyword.toLowerCase()) ||
          item.umum.compProvinceName.toLowerCase().includes(this.keyword.toLowerCase()) ||
          item.umum.compType.toLowerCase().includes(this.keyword.toLowerCase());
      });
    },
    filterStatus() {
      if (this.status === "all") {
        this.tableData = this.tempData;
      } else if(this.status === "accepted") {
        this.tableData = this.tempData.filter((item) => item.validated);
      } else if(this.status === "rejected") {
        this.tableData = this.tempData.filter((item) => item.rejected);
      } else if (this.status === "waiting") {
        this.tableData = this.tempData.filter((item) => !item.validated && !item.rejected);
      }
    },
    dateTime(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY, HH:mm");
    },
    exportExcel() {
      // window.open(`${defaults.baseURL}/pendaftaran/export`, "_blank");
      // window.open(`${defaults.baseURL}/form/list-pendaftaran-export`, "_blank");
      let status = ''

      if (this.status === 'all') {
        status = ''
      } else if (this.status === 'accepted') {
        status = 'Disetujui'
      } else if (this.status === 'rejected') {
        status = 'Ditolak'
      } else if (this.status === 'waiting') {
        status = 'Menunggu Validasi'
      }

      window.open(`${defaults.baseURL}/pendaftaran/export-pendaftaran?status=${status} `, "_blank");
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
  },
  created() {
    this.getTableData();
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

/* added */
.status {
  border-radius: 10px;
  padding: 5px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0;
}
.status-waiting {
  border: 1.5px solid #F2994A;
  color: #F2994A;
}
.status-rejected {
  border: 1.5px solid #EB5757;
  color: #EB5757;
}
.status-accepted {
  border: 1.5px solid #3D9973;
  color: #3D9973;
}
.search-button {
  display: flex;
  justify-content: space-between;
  margin: 20px;
}
.action-btn {
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 400;
  border: transparent;
  color: #ffffff;
  margin-right: 10px;
  margin-bottom: 10px;
}
.action-btn:focus {
  outline: none;
}
.action-btn-view {
  background-color: #007BFF;
}
.action-btn-edit {
  background-color: #E08315;
}
.action-btn-deactive {
  background-color: #EB5757;
}
.action-btn-verify {
  background-color: #495057;
}
.mdl-title {
  font-size: 18px;
  font-weight: 600;
  color: #6C757D;
  width: 100%;
}
.mdl-btn-wrap {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: 10px 0;
}
.mdl-btn {
  border-radius: 4px;
  padding: 6px 12px;
  border: transparent;
  color: #ffffff;
  width: 50%;
  margin-right: 0;
}
.mdl-btn:focus {
  outline: none;
}
.mdl-btn-accept {
  background-color: #3D9973;
  
}
.mdl-btn-reject {
  background-color: #EB5757;
}
.mr-36 {
  margin-right: 36px;
}
</style>
<style lang="scss">
#table {
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
