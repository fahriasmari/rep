<template>
  <div>
    <div id="pengumuman">
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
        <h1 class="display-3 font-weight-light text-white m-0">Pengumuman</h1>
        <h2 class="d-none text-white mx-4 my-0">-</h2>
        <h4 class="d-none text-default m-0">Listed Data</h4>
      </div>
      <base-header class="pb-8" type="primary"></base-header>

      <div class="container-fluid mt--7" v-if="$route.params.render == 'list'">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="card">
              <!-- Filter -->
              <div class="p-3 w-100">
                <div class="row justify-content-between">
                  <div class="col-10 pr-0">
                    <h3>Daftar Pengumuman</h3>
                  </div>
                  <base-button
                    v-if="this.$store.state.auth.level == 0"
                    @click="toForm"
                    class="col-1 bg-primary mr-4"
                    >Tambah</base-button
                  >
                </div>
              </div>
              <!-- Table -->
              <el-table
                :data="queriedData"
                row-key="id"
                header-row-class-name="thead-light"
                @sort-change="sortChange"
              >
                <el-table-column label="No" min-width="20"
                  ><template v-slot="{ $index }">
                    <span>{{ $index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Tanggal"
                  min-width="20"
                  align="center"
                  sortable
                >
                  <template v-slot="{ row }">
                    <div class="cell">{{ unixTS2DMY(row.datePengumuman) }}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Pengumuman"
                  min-width
                  align="justify"
                  sortable
                  ><template v-slot="{ row }">
                    <span v-html="row.isiPengumuman"></span> </template
                ></el-table-column>
                <el-table-column
                  label="Detail"
                  min-width="20"
                  align="right"
                  sortable
                  ><template v-slot="{ row }">
                    <base-button
                      class="btn-sm bg-secondary"
                      @click="toDetail(row)"
                      >Detail</base-button
                    >
                    <!-- <base-button
                      class="btn-sm bg-primary"
                      @click="toDownload(row.filePengumuman.path)"
                    >
                      Download
                    </base-button> -->
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
                    <span v-if="selectedRows.length">
                      &nbsp; &nbsp; {{ selectedRows.length }} rows selected
                    </span>
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

      <div class="container-fluid mt--7" v-if="$route.params.render == 'form'">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="card">
              <!-- Filter -->
              <div class="card-header p-3 w-100">
                <div class="row justify-content-between">
                  <div class="col-10 pr-0">
                    <h3>Tambah Pengumuman</h3>
                  </div>
                  <base-button
                    v-if="this.$store.state.auth.level == 0"
                    @click="$router.push('list')"
                    class="col-1 bg-primary mr-4"
                    >Kembali</base-button
                  >
                </div>
              </div>
              <div class="card-body">
                <form>
                  <div class="col-lg-12">
                    <base-input label="Tanggal" class="form-group">
                      <flat-picker
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          allowInput: true,
                          dateFormat: 'U',
                          altFormat: 'd/m/Y',
                          altInput: true,
                        }"
                        :placeholder="formPengumuman.datePengumuman"
                        class="form-control datepicker"
                        v-model="formPengumuman.datePengumuman"
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <h5>Isi Pengumuman</h5>
                    <html-editor
                      v-model="formPengumuman.isiPengumuman"
                    ></html-editor>
                  </div>
                  <div class="col-lg-12">
                    <base-input>
                      <file-input
                        ref="pengumumanFile"
                        @change="uploadFile('pengumumanFile')"
                      ></file-input>
                      <base-progress
                        v-if="formPengumuman.filePengumuman.progress >= 1"
                        class="mb-0"
                        :type="
                          formPengumuman.filePengumuman.progress >= 100
                            ? 'green'
                            : 'orange'
                        "
                        :value="formPengumuman.filePengumuman.progress"
                      ></base-progress>
                      <hour-glass
                        v-if="
                          formPengumuman.filePengumuman.progress > 1 &&
                          formPengumuman.filePengumuman.progress != 100
                        "
                        class="file-upload-animation"
                        size="24px"
                      ></hour-glass>
                      <span
                        v-if="formPengumuman.filePengumuman.progress == 100"
                      >
                        <i
                          class="ni ni-check-bold text-primary file-upload-done"
                        ></i>
                      </span>
                    </base-input>
                  </div>
                </form>
              </div>

              <div slot="card-footer">
                <div class="row justify-content-end p-3">
                  <base-button
                    v-if="!isUpdate"
                    class="col-1 mr-4"
                    @click="submitForm"
                    >Simpan</base-button
                  >
                  <base-button
                    v-if="isUpdate"
                    class="col-1 mr-4"
                    @click="submitUpdateForm"
                    >Update</base-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="container-fluid mt--7"
        v-if="$route.params.render == 'detail'"
      >
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="card">
              <!-- Filter -->
              <div class="p-3 w-100">
                <div class="row justify-content-between">
                  <div class="col-8 pr-0">
                    <h3>Detail Pengumuman</h3>
                  </div>
                  <base-button
                    @click="$router.push('list')"
                    class="col-1 bg-primary mr-4"
                    >Kembali</base-button
                  >
                  <base-button
                    v-if="this.$store.state.auth.level == 0"
                    @click="toUpdateForm"
                    class="col-1 bg-primary mr-4"
                    >Ubah</base-button
                  >
                  <base-button
                    v-if="this.$store.state.auth.level == 0"
                    @click="deleteForm"
                    class="col-1 bg-danger mr-4"
                    >Hapus</base-button
                  >
                </div>
              </div>
              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Tanggal</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ unixTS2DMY(tempRow.datePengumuman) }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Pengumuman</strong>
                  </div>
                  <div class="col-lg-10">
                    <span v-html="tempRow.isiPengumuman"></span>
                  </div>
                </div>
              </div>

              <div slot="card-footer">
                <div class="row justify-content-center p-3">
                  <base-button
                    class="col-2 p-2"
                    @click="toDownload(tempRow.filePengumuman.path)"
                    >Download</base-button
                  >
                </div>
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
import swal from "sweetalert2";
import "flatpickr/dist/flatpickr.css";
import "sweetalert2/dist/sweetalert2.css";
import Loading from "vue-loading-overlay";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import pengumumanDummy from "./pengumumanDummy.js";
import HtmlEditor from "@/components/Inputs/HtmlEditor";
import { HourGlass } from "vue-loading-spinner";
import FileInput from "@/components/Inputs/FileInput";
import defaults from "@/util/defaults";

const axios = require("axios");
const uniqid = require("uniqid");

export default {
  mixins: [clientPaginationMixin],
  components: {
    HourGlass,
    FileInput,
    HtmlEditor,
    BasePagination,
    Loading,
    BaseInput,
    flatPicker,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      isUpdate: false,
      formPengumuman: {
        datePengumuman: "1601367081",
        isiPengumuman: "",
        filePengumuman: {
          progress: 0,
          upload: 0,
          path: "",
        },
      },
      tempRow: null,
      selectedTime: "",
      queryArray: ["", "", "", "", ""],
      tempSelect: null,
      selectedRows: [],
      tableData: [],
    };
  },
  methods: {
    toUpdateForm() {
      this.formPengumuman = this.tempRow;
      this.formPengumuman.datePengumuman =
        this.formPengumuman.datePengumuman.toString();
      this.isUpdate = true;
      this.$router.push("form");
    },
    submitForm() {
      swal
        .fire({
          title: "Apakah Data Sudah Benar?",
          text: "Apakah Data Sudah Benar?!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Simpan",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            let formData = this.formPengumuman;
            formData.datePengumuman = parseInt(formData.datePengumuman);
            axios
              .post(`${defaults.baseURL}/ann`, formData)
              .then((res) => {
                swal
                  .fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Data Berhasil Tersimpan",
                    showConfirmButton: true,
                  })
                  .then((result) => {
                    this.getTableData();
                    this.$router.push("list");
                  });
              })
              .catch((err) => {
                this.errorSwal("Terjadi kesalahan! " + err);
              });
          }
        });
    },
    submitUpdateForm() {
      swal
        .fire({
          title: "Apakah Data Sudah Benar?",
          text: "Apakah Data Sudah Benar?!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Update",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            let formData = this.formPengumuman;
            formData.datePengumuman = parseInt(formData.datePengumuman);
            axios
              .put(`${defaults.baseURL}/ann/${this.tempRow._id}`, formData)
              .then((res) => {
                swal
                  .fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Data Berhasil Terupdate",
                    showConfirmButton: true,
                  })
                  .then((result) => {
                    this.getTableData();
                    this.$router.push("list");
                  });
              })
              .catch((err) => {
                this.errorSwal("Terjadi kesalahan! " + err);
              });
          }
        });
    },
    deleteForm() {
      swal
        .fire({
          title: "Delete",
          text: "Apakah anda yakin ingin mendelete?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Delete",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            axios
              .delete(`${defaults.baseURL}/ann/${this.tempRow._id}`)
              .then((res) => {
                swal
                  .fire({
                    title: "Berhasil",
                    text: "Form Berhasil Terdelete",
                    icon: "success",
                  })
                  .then((result2) => {
                    if (result2.isConfirmed) {
                      this.getTableData();
                      this.$router.push("list");
                    }
                  });
              });
          }
        });
    },
    uploadFile(field) {
      let formData = new FormData();
      formData.append("picture", this.$refs[field].files[0]);
      axios
        .post(`${defaults.baseURL}/file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: function (progressEvent) {
            this.formPengumuman.filePengumuman.progress = parseInt(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
          }.bind(this),
        })
        .then((res) => {
          this.formPengumuman.filePengumuman.path = res.data.path;
        })
        .catch((err) => {
          this.formPengumuman.filePengumuman.progress = 0;
          this.errorSwal("Silakan Upload Ulang" + err);
          console.log(err);
        });
    },
    errorSwal(message) {
      swal.fire({
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 3000,
      });
    },
    toDownload(link) {
      window.open(`${defaults.baseURL}/${link}`);
    },
    toForm() {
      const originalForm = {
        datePengumuman: "1601367081",
        isiPengumuman: "",
        filePengumuman: {
          progress: 0,
          upload: 0,
          path: "",
        },
      };
      this.formPengumuman = originalForm;
      this.isUpdate = false;
      this.$router.push("form");
    },
    toDetail(row) {
      this.tempRow = row;
      this.$router.push("detail");
    },
    indexMethod(index) {
      return index + 1;
    },
    getTableData() {
      let loader = this.$loading.show({ loader: "dots" });
      axios
        .get(`${defaults.baseURL}/ann/`)
        .then((res) => {
          this.tableData = res.data.sort((a, b) => b.datePengumuman - a.datePengumuman);
          loader.hide();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    unixTS2DMY(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY");
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
</style>

<style lang="scss">
#pengumuman {
  .input-note {
    font-size: 0.75rem;
    margin-top: -1rem;
  }
  .file-upload-animation {
    position: absolute;
    top: 12px;
    right: 100px;
    z-index: 1;
  }
  .file-upload-done {
    position: absolute;
    top: 16px;
    right: 104px;
    z-index: 1;
  }
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
