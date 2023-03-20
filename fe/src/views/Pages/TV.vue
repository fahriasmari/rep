<template>
  <div>
    <!-- Page content -->
    <div id="daftar" class="container pt-8 mb-4">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              Upload Bukti Pemasangan SPARING Terkait COVID-19
            </div>
            <div class="card-body">
              <validation-observer ref="formValidator">
                <form class="needs-validation">
                  <div class="form-group row">
                    <label class="col-lg-2 col-form-label form-control-label"
                      >Nama Perusahaan</label
                    >
                    <div class="col-lg-10">
                      <base-input
                        name="Nama Perusahaan"
                        rules="required"
                        v-model="form.bukti.detail.compName"
                      ></base-input>
                      <base-input
                        v-if="isDataCorrect"
                        rules="required"
                        name="Nama_Perusahaan"
                        v-model="form.bukti.detail.compType"
                      ></base-input>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-10"></div>
                    <div class="col-2">
                      <base-button type="primary" @click="testValidation2"
                        >Submit form</base-button
                      >
                    </div>
                  </div>
                </form>
              </validation-observer>
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
import { HourGlass } from "vue-loading-spinner";
import FileInput from "@/components/Inputs/FileInput";
import flatPicker from "vue-flatpickr-component";
import Axios from "axios";
import Moment from "moment";
import "flatpickr/dist/flatpickr.css";
import swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import defaults from "@/util/defaults";

export default {
  components: {
    HourGlass,
    FileInput,
    BaseInput,
    flatPicker,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {
      validated: false,
      isDataCorrect: false,
      res: { comp: null, user: null, logger: null },
      temptSelect: null,
      form: {
        tahap: 0,
        bukti: {
          detail: {
            compName: "",
            compType: "",
            compAddress: "",
            compCP: "",
            tahap: "",
          },
          fileTender: {
            label: "",
            path: "",
            upload: 0,
            progress: 0,
          },
          fileVendor: {
            label: "",
            path: "",
            upload: 0,
            progress: 0,
          },
          fileJadwal: {
            label: "",
            path: "",
            upload: 0,
            progress: 0,
          },
          photoPemasangan: {
            label: "",
            path: "",
            upload: 0,
            progress: 0,
          },
          photoSPARING: {
            label: "",
            path: "",
            upload: 0,
            progress: 0,
          },
          filePemasangan: {
            label: "",
            path: "",
            upload: 0,
            progress: 0,
          },
          fileCommission: {
            label: "",
            path: "",
            upload: 0,
            progress: 0,
          },
          filePengoperasion: {
            label: "",
            path: "",
            upload: 0,
            progress: 0,
          },
        },
      },
      selects: {
        configs: {
          flatpickr: {
            allowInput: true,
            dateFormat: "d/m/Y",
            mode: "single",
          },
        },
        options: {
          tahap: [
            {
              label: "Tender",
              value: "Tender",
            },
            {
              label: "Pemasangan",
              value: "Pemasangan",
            },
            {
              label: "Pengoperasian",
              value: "Pengoperasian",
            },
          ],
          role: [
            {
              label: "Pusat",
              value: "admin",
            },
            {
              label: "Provinsi",
              value: "prov",
            },
            {
              label: "Kab/Kot",
              value: "kabkot",
            },
            {
              label: "Industri",
              value: "comp",
            },
          ],
          type: [
            { name: "Semua", value: "" },
            { name: "Industri Rayon", value: "Industri Rayon" },
            { name: "Industri Pulp/Kertas", value: "Industri Pulp/Kertas" },
            {
              name: "Industri Petrokimia Hulu",
              value: "Industri Petrokimia Hulu",
            },
            {
              name: "Industri Oleokimia Dasar",
              value: "Industri Oleokimia Dasar",
            },
            { name: "Industri Minyak Sawit", value: "Industri Minyak Sawit" },
            { name: "Pengolahan Minyak Bumi", value: "Pengolahan Minyak Bumi" },
            {
              name: "Eksplorasi dan Produksi Migas",
              value: "Eksplorasi dan Produksi Migas",
            },
            {
              name: "Pertambangan Emas dan Tembaga",
              value: "Pertambangan Emas dan Tembaga",
            },
            { name: "Pertambangan Batu Bara", value: "Pertambangan Batu Bara" },
            { name: "Industri Tekstil", value: "Industri Tekstil" },
            { name: "Pertambangan Nikel", value: "Pertambangan Nikel" },
            { name: "Kawasan Industri", value: "Kawasan Industri" },
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
          parameter: [
            {
              label: "pH",
              value: "ph",
            },
            {
              label: "COD",
              value: "cod",
            },
            {
              label: "TSS",
              value: "tss",
            },
            {
              label: "NH3N",
              value: "nh3n",
            },
            {
              label: "Debit",
              value: "debit",
            },
          ],
        },
        type: null,
        prov: null,
        city: null,
        comp: null,
        time: null,
      },
    };
  },
  computed: {
    frequencyText() {
      if (this.form.teknis.isContinue) return "Terus Menerus / Kontinyu";
      else return "Tidak Rutin / Intermiten";
    },
    sensorStatus(index) {
      if (this.form.sensor[index]) return "Digunakan";
      else return "Tidak digunakan";
    },
  },
  methods: {
    async testValidation2() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (!tempValidate) {
        console.log("blm isi");
      } else {
        console.log("isi");
      }
    },
    async testValidation() {
      console.log("JANCOK");
    },
    uploadFile(category, field) {
      this.form[category][field].upload = 1;
      let formData = new FormData();
      formData.append("picture", this.$refs[field].files[0]);
      Axios.post("http://45.127.133.75:3000/api/iems/img", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: function (progressEvent) {
          this.form[category][field].progress = parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        }.bind(this),
      })
        .then((res) => {
          this.form[category][field].upload = 2;
          this.form[category][field].path =
            "http://45.127.133.75:3000" + res.data.path;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploadSensorFile(index) {
      this.form.sensor[index].brosurFile.upload = 1;
      let formData = new FormData();
      formData.append("picture", this.$refs.brosurFile[index].files[0]);
      Axios.post("http://45.127.133.75:3000/api/iems/img", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          this.form.sensor[index].brosurFile.upload = 2;
          this.form.sensor[index].brosurFile.path =
            "http://45.127.133.75:3000" + res.data.path;
        })
        .catch((err) => {
          console.log(err);
          this.form.sensor[index].brosurFile.upload = 3;
        });
    },
    changeSensorFile(index, files) {
      this.form.sensor[index].brosur = files;
    },
    changeTeknisPermitFile(files) {},
    errorSwal() {
      swal.fire({
        icon: "error",
        title: "Terjadi Error pada data!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    confirmSwal() {
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
          this.registerHandler();
        });
    },
    registerHandler() {
      Axios.post(`${defaults.baseURL}/covid`, this.form.bukti)
        .then((res) => {
          swal.fire("Tersimpan", "Data anda telah tersimpan", "success");
        })
        .catch((err) => {
          this.errorSwal();
        });
    },

    changeUmumPermitFile(files) {
      this.form.umum.permitFile = files;
    },
    changeValiditasKinerja(files) {
      this.form.validitas.kinerja = files;
    },
    changeValiditasKonektifitas(files) {
      this.form.validitas.konektifitas = files;
    },
    changeValiditasKalibrasi(files) {
      this.form.validitas.kalibrasi = files;
    },
    changeValiditas(files) {
      this.form.validitas.validitas = files;
    },
    getKabkot(data) {
      const list = this.tempSelect.kabkotList;
      const filterList = list.filter((l) => l.provID === data);
      this.selects.options.city = filterList;
      this.form.user.userRole.kabkotID = null;
      this.form.user.userRole.compID = null;
    },
    getList() {
      Axios.get(
        `${defaults.baseURL}/report/list/5f340d5e328182315c11ee98`
      ).then((res) => {
        this.selects.options.prov = res.data.provList;
        this.selects.options.city = res.data.kabkotList;
        this.selects.options.comp = res.data.compList;
        this.tempSelect = res.data;
      });
    },
    changeParamCount() {
      this.form.parm = [];
      for (let i = 0; i < this.form.pcnt; i++) {
        this.form.parm.push({
          name: null,
          min: 0,
          max: 0,
        });
      }
    },
    unixTS2DMY(timestamp) {
      return Moment.unix(timestamp).format("DD/MM/YYYY");
    },
    login() {
      Axios.post(this.$store.getters.getAPI.url + "/user/login", this.model)
        .then((res) => {
          var auth = JSON.stringify(res.data);
          localStorage.setItem("auth-data", auth);
          this.$store.commit("setData", res.data);
          this.$notify({
            message: "Welcome to <b>IPC IEMS Platform</b>",
            timeout: 5000,
            icon: "ni ni-bell-55",
            type: "success",
          });
          // return this.$router.push("/ISPU/ISPUDashboard").catch(() => {});
        })
        .catch((err) => {
          this.$notify({
            message: "Invalid Email or Password",
            timeout: 5000,
            icon: "ni ni-bell-55",
            type: "warning",
          });
        });

      // this will be called only after form is valid. You can do api call here to login
    },
  },
  // mounted() {
  //   this.$refs.formValidator.validate();
  // },
  beforeMount() {
    this.$store.commit("setAuthLayoutButton", {
      name: "Kembali",
      path: "/home",
    });
  },
  created() {
    this.getList();
    // this.generateData();
  },
};
</script>

<style lang="scss">
#daftar {
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
}
</style>
