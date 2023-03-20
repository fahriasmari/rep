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
          Berita Acara Verifikasi Lapangan
        </h1>
        <h2 class="text-white mx-4 my-0">-</h2>
        <h4 class="text-default m-0">List Berita Acara</h4>
      </div>
      <base-header class="pb-8" type="primary"></base-header>

      <div class="container-fluid mt--7">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="continer mb-3">
              <base-button
                size="md"
                type="secondary"
                @click="add()"
                v-if="userRole == 'admin'"
                >Tambah Data</base-button
              >
            </div>
            <div class="card">
              <!-- Table -->
              <el-table
                :data="queriedData"
                row-key="_id"
                header-row-class-name="thead-light"
                @sort-change="sortChange"
                @selection-change="selectionChange"
              >
                <el-table-column
                  label="Tanggal Berita Acara"
                  prop="tanggalBeritaAcara"
                  min-width
                  align="left"
                  sortable
                ></el-table-column>
                <el-table-column
                  label="Nama Provinsi"
                  prop="provName"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  label="Nama Kabkot"
                  prop="kabkotName"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  label="Nama Company"
                  prop="compName"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column label="File Lampiran" min-width sortable>
                  <template slot-scope="test">
                    <base-button
                      type="warning"
                      @click="downloadFile(test.$index, test.row)"
                      >Download File Lampiran</base-button
                    >
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="test" v-if="userRole == 'admin'">
                    <base-button
                      type="primary"
                      @click="edit(test.$index, test.row)"
                      >Edit</base-button
                    >
                    <base-button
                      type="danger"
                      @click="deleteRow(test.$index, test.row)"
                      >Delete</base-button
                    >
                    <!-- <base-button type="danger">Delete</base-button> -->
                  </template>
                </el-table-column>
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
import defaults from "@/util/defaults";
import "flatpickr/dist/flatpickr.css";
import "sweetalert2/dist/sweetalert2.css";
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
    BaseInput,
    flatPicker,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      userRole: "",
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
              mail: "alpha",
              value: 1,
            },
            {
              label: "Bravo",
              mail: "bravo",
              value: 2,
            },
            {
              label: "Charlie",
              mail: "charlie",
              value: 3,
            },
            {
              label: "Delta",
              mail: "delta",
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
  methods: {
    resetPayload() {
      const payload = {
        _id: "",
        provID: "",
        kabkotID: "",
        compID: "",
        tanggalBeritaAcara: "",
        lampiranBeritaAcara: "",
      };
      this.$store.commit("setBeritaAcaraEditData", payload);
    },
    add() {
      this.$router.push("/content/beritaAcara-form");
    },
    edit(id, row) {
      const payload = {
        _id: row.id,
        provID: row.provID,
        kabkotID: row.kabkotID,
        compID: row.compID,
        tanggalBeritaAcara: row.tanggalBeritaAcara,
        lampiranBeritaAcara: row.lampiranBeritaAcara,
      };
      this.$store.commit("setBeritaAcaraEditData", payload);
      this.$router.push("/content/beritaAcara-form");
    },
    deleteRow(id, row) {
      Swal.fire({
        title: "Hapus Data Ini!",
        text: "Apakah anda ingin menghapus data ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Hapus",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${defaults.baseURL}/form/beritaAcara/${row.id}`)
            .then((res) => {
              Swal.fire(
                "Delete Success",
                "Data berhasil di hapus dengan ID Berita Acara: " +
                  res.data._id,
                "success"
              ).then((result) => {
                location.reload();
              });
            })
            .catch((err) => {
              this.errorSwal("Terjadi Error pada data!");
            });
        } else {
          swal.fire({
            icon: "error",
            title: "Berhasil Dibatalkan",
            showConfirmButton: false,
            timer: 3000,
          });
        }
      });
    },
    unixTS2DMY(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY, hh:mm");
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    downloadFile(index, row) {
      window.open(`${defaults.baseURL}/${row.lampiranBeritaAcara}`, "_blank");
    },
  },
  created() {
    this.resetPayload();
    const auth = JSON.parse(localStorage.getItem("auth-data"));
    this.userRole = auth.userRole.role;
    axios
      .get(` ${defaults.baseURL}/form/listBeritaAcara/${auth._id}`, {
        headers: { token: this.$store.state.token },
      })
      .then((res) => {
        this.tableData = res.data;
      });
    //this.generateData();
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