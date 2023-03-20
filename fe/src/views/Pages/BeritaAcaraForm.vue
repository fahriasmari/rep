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
        <h4 class="text-default m-0">Form Berita Acara Verifikasi Lapangan</h4>
      </div>
      <base-header class="pb-8" type="primary"></base-header>

      <div class="container-fluid mt--7">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="card">
              <div class="card-header">
                <h3 class="mb-0">Form Berita Acara Verifikasi Lapangan</h3>
              </div>
              <!-- Card body -->
              <div class="card-body">
                <validation-observer ref="formValidator">
                  <form>
                    <div class="form-group row">
                      <label
                        for="tgl_berita_acara"
                        class="col-md-2 col-form-label form-control-label"
                        >Tanggal Berita Acara</label
                      >
                      <div class="col-md-10">
                        <base-input class="m-0">
                          <flat-picker
                            placeholder="Tanggal Berita Acara"
                            slot-scope="{ focus, blur }"
                            @on-open="focus"
                            @on-close="blur"
                            :config="{
                              dateFormat: 'U',
                              allowInput: true,
                              enableTime: true,
                              altFormat: 'd/m/Y H:i',
                              altInput: true,
                              time_24hr: true,
                              mode: 'single',
                            }"
                            class="form-control datepicker"
                            id="tgl_berita_acara"
                            v-model="selectedTime"
                          ></flat-picker>
                        </base-input>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label
                        for="tgl_berita_acara"
                        class="col-md-2 col-form-label form-control-label"
                        >Pilih Provinsi</label
                      >
                      <div class="col-md-10">
                        <el-select
                          class="w-100"
                          v-model="selected.prov"
                          filterable
                          clearable
                          @change="getKabkot()"
                          placeholder="Pilih Provinsi"
                        >
                          <el-option
                            v-for="option in provList"
                            :key="option._id"
                            :label="option.provName"
                            :value="option._id"
                          ></el-option>
                        </el-select>
                      </div>
                    </div>
                    <!-- end prov -->
                    <div class="form-group row">
                      <label
                        for="tgl_berita_acara"
                        class="col-md-2 col-form-label form-control-label"
                        >Pilih Kabupaten Kota</label
                      >
                      <div class="col-md-10">
                        <el-select
                          class="w-100"
                          v-model="selected.kabkot"
                          filterable
                          clearable
                          @change="getListComp()"
                          placeholder="Pilih Kabupaten Kota"
                        >
                          <el-option
                            v-for="option in kabkotList"
                            :key="option._id"
                            :label="option.kabkotName"
                            :value="option._id"
                          ></el-option>
                        </el-select>
                      </div>
                    </div>
                    <!-- end kab/kot -->
                    <div class="form-group row">
                      <label
                        for="tgl_berita_acara"
                        class="col-md-2 col-form-label form-control-label"
                        >Pilih Company</label
                      >
                      <div class="col-md-10">
                        <el-select
                          class="w-100"
                          v-model="selected.comp"
                          filterable
                          clearable
                          placeholder="Pilih Company"
                          v-on:change="myComp()"
                        >
                          <el-option
                            v-for="option in compList"
                            :key="option.compID"
                            :label="option.compName"
                            :value="option.compID"
                          ></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div v-if="otherComp">
                      <div class="form-group row">
                        <label
                          for="tgl_berita_acara"
                          class="col-md-2 col-form-label form-control-label"
                          >Nama Perusahaan</label
                        >
                        <div class="col-md-10">
                          <base-input
                            class="m-0"
                            placeholder="Other Company"
                            v-model="selected.other"
                          >
                          </base-input>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label
                          for="tgl_berita_acara"
                          class="col-md-2 col-form-label form-control-label"
                          >Nomor Telpon Perusahaan</label
                        >
                        <div class="col-md-10">
                          <base-input
                            class="m-0"
                            placeholder="Nomor Telpon Perusahaan"
                            v-model="selected.otherTlp"
                          >
                          </base-input>
                        </div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label
                        for="tgl_berita_acara"
                        class="col-md-2 col-form-label form-control-label"
                        >Lampiran Dokumen Berita Acara</label
                      >
                      <div class="col-md-10">
                        <base-input>
                          <file-input
                            :disabled="uploading"
                            accept="application/pdf"
                            ref="beritaAcaraFile"
                            @change="uploadFile('beritaAcaraFile')"
                          ></file-input>
                          <base-progress
                            v-if="lampiranBeritaAcara.upload >= 1"
                            class="mb-0"
                            :type="
                              lampiranBeritaAcara.progress >= 100
                                ? 'green'
                                : 'orange'
                            "
                            :value="lampiranBeritaAcara.progress"
                          ></base-progress>
                          <hour-glass
                            v-if="lampiranBeritaAcara.upload == 1"
                            class="file-upload-animation"
                            size="24px"
                          ></hour-glass>
                          <span v-if="lampiranBeritaAcara.upload == 2">
                            <i
                              class="
                                ni ni-check-bold
                                text-primary
                                file-upload-done
                              "
                            ></i>
                          </span>
                        </base-input>
                      </div>
                    </div>
                  </form>
                </validation-observer>
              </div>
              <div class="card-footer">
                <div class="row">
                  <div class="col-10"></div>
                  <div class="col-2">
                    <base-button
                      class="w-100"
                      size="md"
                      type="primary"
                      v-if="this.$store.state.beritaAcaraEditData._id === ''"
                      @click="handleSubmit('save')"
                      >Simpan</base-button
                    >
                    <base-button
                      class="w-100"
                      size="md"
                      type="primary"
                      v-else-if="this.$store.state.beritaAcaraEditData._id"
                      @click="handleSubmit('edit')"
                      >Update</base-button
                    >
                  </div>
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
import Axios from "axios";
import moment from "moment";
import FileInput from "@/components/Inputs/FileInput";
import { HourGlass } from "vue-loading-spinner";
import flatPicker from "vue-flatpickr-component";
import swal from "sweetalert2";
import defaults from "@/util/defaults";
import "flatpickr/dist/flatpickr.css";
import "sweetalert2/dist/sweetalert2.css";
const axios = require("axios");
const uniqid = require("uniqid");
const swalWithBootstrapButtons = swal.mixin({
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
    FileInput,
    HourGlass,
  },
  data() {
    return {
      isInsertData: false,
      isEditData: false,
      uploading: false,
      selectedTime: null,
      selects: {
        configs: {
          flatpickr: {
            allowInput: true,
            altFormat: "d/m/Y",
            altInput: false,
            dateFormat: "d/m/Y",
            mode: "single",
          },
        },
      },
      options: {
        compList: [],
        provList: [],
      },
      provList: [],
      kabkotList: [],
      compList: [],
      otherComp: false,
      selected: {
        comp: null,
        prov: null,
        kabkot: null,
        other: null,
        otherTlp: null,
      },
      arrayBody: [],
      allListData: {},
      lampiranBeritaAcara: {
        path: "",
        upload: 0,
        progress: 0,
      },
    };
  },
  created() {
    // this.getList();
    this.getProvList();
    if (this.$store.state.beritaAcaraEditData._id) {
      let dataPayload = this.$store.state.beritaAcaraEditData;
      this.selectedTime = moment(
        dataPayload.tanggalBeritaAcara,
        "D/M/YYYY H:mm"
      ).valueOf();
      // this.selectedTime = moment(
      //   dataPayload.tanggalBeritaAcara,
      //   "D/M/YYYY H:mm"
      // ).unix();
      this.selected.prov = dataPayload.provID;
      this.getKabkot();
      this.selected.kabkot = dataPayload.kabkotID;
      this.selected.comp = dataPayload.compID;
      this.lampiranBeritaAcara.path = dataPayload.lampiranBeritaAcara;
    }
  },
  methods: {
    myComp() {
      let val = this.selected.comp;
      if (val == "60d38fbc99e26a552983f180") {
        this.otherComp = true;
      }
    },
    getList() {
      const auth = JSON.parse(localStorage.getItem("auth-data"));
      axios
        // .get("http://203.166.207.51/report/list/" + auth._id, {
        .get(`${defaults.baseURL}/report/list/${auth._id}`, {
          headers: { token: this.$store.state.token },
        })
        .then((res) => {
          // let tempAllListData = res.data;
          // tempAllListData.compList.unshift({ name: "Semua", value: "" });
          // localStorage.setItem("allList", JSON.stringify(tempAllListData));
          // this.options = tempAllListData;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getProvList() {
      const auth = JSON.parse(localStorage.getItem("auth-data"));
      this.selected.comp = "";
      this.selected.kabkot = "";
      axios
        // .get("http://203.166.207.51/prov/list/", {
        .get(`${defaults.baseURL}/prov/list/`, {
          headers: { token: this.$store.state.token },
        })
        .then((res) => {
          let tempAllListData = res.data;
          this.provList = tempAllListData;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getKabkot() {
      const idProv = this.selected.prov;
      const auth = JSON.parse(localStorage.getItem("auth-data"));
      this.selected.comp = "";
      this.selected.kabkot = "";
      axios
        // .get("http://203.166.207.51/kabkot/list/" + idProv, {
        .get(`${defaults.baseURL}/kabkot/list/${idProv}`, {
          headers: { token: this.$store.state.token },
        })
        .then((res) => {
          let tempAllListData = res.data;
          this.kabkotList = tempAllListData;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getListComp() {
      const auth = JSON.parse(localStorage.getItem("auth-data"));
      const prov = this.selected.prov;
      const kabkot = this.selected.kabkot;
      this.selected.comp = "";
      axios
        .get(
          // `http://203.166.207.51/comp/listCompID?prov=${prov}&kabkot=${kabkot}`,
          `${defaults.baseURL}/comp/listCompID?prov=${prov}&kabkot=${kabkot}`,
          {
            headers: { token: this.$store.state.token },
          }
        )
        .then((res) => {
          if (res.data.length > 0) {
            let tempAllListData = res.data;
            this.compList = tempAllListData;
            this.compList.push({
              compID: "60d38fbc99e26a552983f180",
              compName: "Other",
            });
          } else {
            let custumeOption = [
              { compID: "60d38fbc99e26a552983f180", compName: "Other" },
            ];
            this.compList = custumeOption;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploadFile(field) {
      this.uploading = true;
      this.lampiranBeritaAcara.upload = 1;
      let formData = new FormData();
      formData.append("picture", this.$refs[field].files[0]);
      // Axios.post("http://203.166.207.51/file", formData, {
      Axios.post(`${defaults.baseURL}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: function (progressEvent) {
          this.lampiranBeritaAcara.progress = parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        }.bind(this),
      })
        .then((res) => {
          this.lampiranBeritaAcara.upload = 2;
          this.lampiranBeritaAcara.path = res.data.path;
          this.uploading = false;
        })
        .catch((err) => {
          this.lampiranBeritaAcara.upload = 0;
          this.uploading = false;
          this.errorSwal("Silakan Upload Ulang");
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
    handleSubmit(action) {
      if (action == "save") {
        this.isInsertData = true;
        this.isEditData = false;
      }
      if (action == "edit") {
        this.isEditData = true;
        this.isInsertData = false;
      }
      if (!this.selectedTime) {
        this.errorSwal("Silakan Isi Tanggal Berita Acara!");
        return;
      }
      if (!this.selected.comp) {
        this.errorSwal("Silahkan Isi Company!");
        return;
      }
      if (!this.lampiranBeritaAcara.path) {
        this.errorSwal("Silahkan Masukan Lampiran Berita Acara!");
        return;
      }
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
            if (this.isInsertData) {
              this.registerHandler();
              this.$router.push("/content/berita-acara/list");
            } else if (this.isEditData) {
              this.updateHandler();
              this.$router.push("/content/berita-acara/list");
            }
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
    registerHandler() {
      let data = {
        tanggalBeritaAcara: this.selectedTime,
        provID: this.selected.prov,
        kabkotID: this.selected.kabkot,
        compID: this.selected.comp,
        detailOtherComp: {
          compName: this.selected.other,
          compTlp: this.selected.otherTlp,
        },
        lampiranBeritaAcara: this.lampiranBeritaAcara,
      };
      // Axios.post("http://203.166.207.51/form/beritaAcara", data)
      Axios.post(`${defaults.baseURL}/form/beritaAcara`, data)
        .then((res) => {
          swal.fire(
            "Tersimpan",
            "Data anda telah terregister dengan ID Berita Acara: " +
              res.data._id,
            "success"
          );
        })
        .catch((err) => {
          this.errorSwal("Terjadi Error pada data!");
        });
    },
    updateHandler() {
      // CONVERT DATE TO TIMESTAMP
      let dateConvert;
      if (this.selectedTime.toString().length > 10) {
        dateConvert = moment.unix(this.selectedTime / 1000).unix();
      } else {
        dateConvert = this.selectedTime;
      }
      // END CONVERT
      let data = {
        tanggalBeritaAcara: this.selectedTime,
        provID: this.selected.prov,
        kabkotID: this.selected.kabkot,
        compID: this.selected.comp,
        detailOtherComp: {
          compName: this.selected.other,
          compTlp: this.selected.otherTlp,
        },
        lampiranBeritaAcara: this.lampiranBeritaAcara,
      };
      // Axios.put(
      //   "http://203.166.207.51/form/beritaAcara/" +
      //     this.$store.state.beritaAcaraEditData._id,
      //   data
      // )
      Axios.put(`${defaults.baseURL}/form/beritaAcara/${this.$store.state.beritaAcaraEditData._id}`, data)
        .then((res) => {
          swal.fire(
            "Update Success",
            "Data berhasil di update dengan ID Berita Acara: " + res.data._id,
            "success"
          );
        })
        .catch((err) => {
          this.errorSwal("Terjadi Error pada data!");
        });
    },
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