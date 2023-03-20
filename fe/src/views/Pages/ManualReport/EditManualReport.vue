<template>
  <div v-if="this.$store.state.auth.level > 2">
    <Modal
      :show="showEditModal"
      modalClasses="modal-dialog-scrollable"
      headerClasses="pb-0"
      @close="closeModal"
      size="lg">
      <template v-slot:header>
        <div class="modal-title">
          <h2>Edit Laporan Manual</h2>
        </div>
      </template>
      <div class="border-top pt-4">
        <validation-observer ref="formValidator" class="w-100">
          <form class="col-12">
            <div class="form-group row">
              <label class="col-lg-12 col-form-label form-control-label">File SHU</label>
              <a
                :href="`${baseURL}${form.fileSHU}`"
                target="_blank"
                class="rounded bg-primary px-2 py-1 ml-3 my-2 text-white">
                Lihat file yang telah tersimpan
              </a>
              <div class="col-lg-12">
                <base-input name="File SHU">
                  <file-input
                    :disabled="uploading"
                    ref="shuFile"
                    @change="uploadFile()" />
                  <base-progress
                    v-if="file.upload >= 1"
                    class="mb-0"
                    :type="file.progress >= 100 ? 'green' : 'orange'"
                    :value="file.progress" />
                </base-input>
                <small class="d-block mt--3 text-justify">Abaikan inputan ini jika tidak ingin mengganti file SHU</small>
                <small
                  v-if="file.upload == 2"
                  class="d-block mt-3 text-justify">
                  <a :href="`${baseURL}${form.file}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                </small>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-lg-12 col-form-label form-control-label">Tanggal Kejadian</label>
              <div class="col-lg-12">
                <base-input name="Tanggal" rules="required">
                  <flat-picker
                    :config="flatpickerOption"
                    class="form-control datepicker"
                    @on-change="getWeekOfMonth"
                    v-model="startDate" />
                </base-input>
              </div>
            </div>
            <div class="row col-12 font-weight-bolder">Isi Nilai Parameter</div>
            <div class="form-group row mb-1">
              <label class="col-lg-2 col-form-label form-control-label">pH</label>
              <label class="col-lg-2 col-form-label form-control-label">COD</label>
              <label class="col-lg-2 col-form-label form-control-label">TSS</label>
              <label class="col-lg-2 col-form-label form-control-label">NH3N</label>
              <label class="col-lg-2 col-form-label form-control-label">Debit</label>
            </div>
            <div class="form-group row mb-2">
              <base-input name="pH" :rules="isPhActive ? 'required' : ''" v-model="form.dataParam[0].value" class="col-2" :disabled="!isPhActive" />
              <base-input name="COD" :rules="isCodActive ? 'required' : ''" v-model="form.dataParam[1].value" class="col-2" :disabled="!isCodActive" />
              <base-input name="TSS" :rules="isTssActive ? 'required' : ''" v-model="form.dataParam[2].value" class="col-2" :disabled="!isTssActive" />
              <base-input name="NH3N" :rules="isNh3nActive ? 'required' : ''" v-model="form.dataParam[3].value" class="col-2" :disabled="!isNh3nActive" />
              <base-input name="Debit" :rules="isDebitActive ? 'required' : ''" v-model="form.dataParam[4].value" class="col-2" :disabled="!isDebitActive" />
            </div>             
            <div class="form-group row">
              <div class="col-lg-12">
                <div class="float-right">
                  <button class="btn btn-warning" @click="closeModal">Batal</button>
                  <button class="btn btn-primary" @click="save">Simpan</button>
                </div>
              </div>
            </div>
          </form>
        </validation-observer>
      </div>
    </Modal>
  </div>
</template>
  
  <script>
  import axios from "axios";
  import defaults from "@/util/defaults";
  import Swal from "sweetalert2";
  import "sweetalert2/dist/sweetalert2.css";
  import { BaseInput } from "@/components";
  import FileInput from "@/components/Inputs/FileInput";
  import { Select, Option } from "element-ui";
  import flatPicker from "vue-flatpickr-component";
  import weekSelect from "flatpickr/dist/plugins/weekSelect/weekSelect"
  import "flatpickr/dist/flatpickr.css";
  import Modal from "@/components/Modal.vue";
  import moment from "moment";
  
  // const flatpickerOption = {
  //   dateFormat: "U",
  //   allowInput: true,
  //   altInput: true,
  //   altFormat: "d/m/Y",
  //   plugins: [ new weekSelect({}) ],
  // };
  const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary",
    cancelButton: "btn btn-secondary"
  },
  buttonsStyling: false
});
  const flatpickerOption = {
  dateFormat: "U",
  allowInput: true,
  altInput: true,
  altFormat: "d/m/Y",
  enableTime: false,
  time_24hr: true,
  defaultHour: 0,
  mode: "range",
  minRange:7,
   onChange: function (selectedDates, dateStr, instance) {
        if (selectedDates.length > 1) {
            var range = instance.formatDate(selectedDates[1], 'U') - instance.formatDate(selectedDates[0], 'U');
            range = range / 86400;

            if(range != 6)
            {
                swalWithBootstrapButtons.fire(
                  "Warning",
                  "Tanggal yang dipilih harus 1 minggu",
                  "warning"
                );
                instance.clear()
            }
            
        }
    },
};
  
  export default {
    components: {
      [Select.name]: Select,
      [Option.name]: Option,
      BaseInput,
      FileInput,
      Modal,
      flatPicker,
    },
    props: {
      showEditModal: {
        type: Boolean,
        required: true,
      },
      data: {
      type: Object,
      required: true,
    }
    },
    data() {
      return {
        uploading: false,
        companyData: [],
        auth: JSON.parse(localStorage.getItem("auth-data")),
        baseURL: defaults.baseURL,
        flatpickerOption,
        isPhActive: false,
        isCodActive: false,
        isTssActive: false,
        isNh3nActive: false,
        isDebitActive: false,
        form: this.data,
        startDate : this.data.tanggalKejadian + " to " +this.data.endTanggalKejadian,
        file: {
          path: "",
          upload: 0,
          progress: 0,
        }
      }
    },
    methods: {
      getWeekOfMonth() {
        const date = moment.unix(this.form.tanggalKejadian).date();
        const day = moment.unix(this.form.tanggalKejadian).day();
        const weekOfMonth = Math.ceil((date - 1 - day) / 7) + 1;
        // this.form.week = weekOfMonth;
      },
      async save() {
        const tempValidate = await this.$refs.formValidator.validate();
        let startkejadian = this.startDate.substr(0,10);
        let endkejadian = this.startDate.substr(-10);
        this.form.tanggalKejadian = startkejadian + " to " + endkejadian
        
     
        if (!tempValidate) {
          Swal.fire({
              icon: "error",
              text: `Data belum lengkap`,
            });
        } else {
          this.form.file = this.form.file || this.form.fileSHU;
          this.form.formId = this.form.id;
          // this.form.month = moment.unix(this.form.tanggalKejadian).format("MM");
          // this.form.year = moment.unix(this.form.tanggalKejadian).format("YYYY");
          const data = await axios.post(`${defaults.baseURL}/laporanMingguan/edit`, this.form);
          if (data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Tersimpan",
              text: "Laporan manual telah tersimpan, silahkan tunggu validasi dari admin",
            }).then(() => this.$emit("close"));
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal",
              text: `Silakan Coba Kembali`,
           });
          }
        }
      },
      closeModal() {
        this.$emit("close");
      },
      async getCompanyDetail() {
        if (this.$store.state.auth.level > 2) {
          const { data } = await axios.get(`${defaults.baseURL}/form/detail-pendaftaran/${this.auth._id}`);
          this.companyData = data;
          this.isPhActive = data.sensor.find((ph) => ph.name === "pH").active;
          this.isCodActive = data.sensor.find((cod) => cod.name === "COD").active;
          this.isTssActive = data.sensor.find((tss) => tss.name === "TSS").active;
          this.isNh3nActive = data.sensor.find((nh3n) => nh3n.name === "NH3N").active;
          this.isDebitActive = data.sensor.find((debit) => debit.name === "Debit").active;
        }
      },
      uploadFile() {
        this.uploading = true;
        this.file.upload = 1;
        let formData = new FormData();
        formData.append("picture", this.$refs["shuFile"].files[0]);
        axios.post(`${defaults.baseURL}/file`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: function (progressEvent) {
            this.file.progress = parseInt(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
          }.bind(this),
        })
          .then((res) => {
            this.file.upload = 2;
            this.form.file = res.data.path;
            this.uploading = false;
          })
          .catch(() => {
            this.file.upload = 0;
            this.uploading = false;
            Swal.fire({ icon: "error", title: "Gagal", text: `Silakan Upload Ulang` });
          });
      },
      async getLoggerId() {
        const { data } = await axios.get(`${defaults.baseURL}/laporanMingguan/loggerid?compID=${this.auth.userRole.compID}`);
        this.form.loggerID = data.data.loggerID;
      },
    },
    created() {
      this.getCompanyDetail();
      this.getLoggerId()
    },
  }
  </script>