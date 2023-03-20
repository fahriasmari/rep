<template>
<div v-if="this.$store.state.auth.level > 2">
  <Modal
    :show="showAddModal"
    modalClasses="modal-dialog-scrollable"
    headerClasses="pb-0"
    @close="closeModal"
    size="xl">
    <template v-slot:header>
      <div class="modal-title border-bottom pb-4 w-100">
        <h2 class="ml-3">Tambah Uji Kalibrasi</h2>
      </div>
    </template>
    <validation-observer ref="formValidator" class="w-100">
      <form class="col-12">
        <div class="form-group row mb-0">
          <label class="col-lg-2 col-form-label form-control-label">Nama Industri</label>
          <div class="col-lg-10 col-form-label font-weight-bold">
            {{ companyName }}
          </div>
        </div>
        <div class="form-group row mb-0">
          <label class="col-lg-2 col-form-label form-control-label">Jenis Industri</label>
          <div class="col-lg-10 col-form-label font-weight-bold">
            {{ companyType }}
          </div>
        </div>
        <div class="form-group row mb-0">
          <label class="col-lg-2 col-form-label form-control-label">Provinsi</label>
          <div class="col-lg-10 col-form-label font-weight-bold">
            {{ province }}
          </div>
        </div>
        <div class="form-group row mb-0">
          <label class="col-lg-2 col-form-label form-control-label">Kab/Kota</label>
          <div class="col-lg-10 col-form-label font-weight-bold">
            {{ city }}
          </div>
        </div>
        <div class="form-group row mb-0">
          <label class="col-lg-2 col-form-label form-control-label">Tanggal</label>
          <div class="col-lg-10 col-form-label font-weight-bold">
            {{ date }}
          </div>
        </div>
        <div class="form-group row">
          <label class="col-lg-2 col-form-label form-control-label">Periode</label>
          <div class="col-lg-10 col-form-label font-weight-bold">
            Q{{ period }}
          </div>
        </div>
        <div class="mb-4">
          <label class="form-control-label">Pilih sensor yang telah dikalibrasi</label>
          <div v-for="(sensor, index) in sensors" :key="`select-${sensor.name}`" class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              :value="index"
              :id="sensor.name"
              v-model="checkedSensor"
              :disabled="!sensor.isActive">
            <label class="form-check-label" :for="sensor.name">
              {{ sensor.name }}
            </label>
          </div>
        </div>
        <div v-if="checkedSensor.length" class="font-weight-bolder mb-2">Sensor</div>
        <div v-for="(sensor, index) in sensors" :key="sensor.name">
          <details v-if="checkedSensor.includes(index)" open>
            <summary>Sensor {{ sensor.name }}</summary>
            <div class="form-group row">
              <label class="col-lg-2 col-form-label form-control-label">Brand</label>
              <div class="col-lg-10">
                <base-input
                :name="`Sensor ${sensor.name} Brand`"
                :rules="sensor.isActive ? 'required' : ''"
                v-model="form.dataKalibrasi[index].brand"
                :disabled="!sensor.isActive" />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-lg-2 col-form-label form-control-label">Tipe</label>
              <div class="col-lg-10">
                <base-input
                :name="`Sensor ${sensor.name} Tipe`"
                :rules="sensor.isActive ? 'required' : ''"
                v-model="form.dataKalibrasi[index].type"
                :disabled="!sensor.isActive" />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-lg-2 col-form-label form-control-label mt-4">Range</label>
              <div class="col-lg-10 row">
                <div class="col-6">
                  <span>Min</span>
                  <base-input
                    :name="`Sensor ${sensor.name} Min Range`"
                    :rules="sensor.isActive ? 'required' : ''"
                    v-model="form.dataKalibrasi[index].min"
                    :disabled="!sensor.isActive" />
                </div>
                <div class="col-6">
                  <span>Max</span>
                  <base-input
                    :name="`Sensor ${sensor.name} Max Range`"
                    :rules="sensor.isActive ? 'required' : ''"
                    v-model="form.dataKalibrasi[index].max"
                    :disabled="!sensor.isActive" />
                </div>
              </div>
            </div>
            <!-- <div class="form-group row">
              <label class="col-lg-2 col-form-label form-control-label">Kalibrasi ke-</label>
              <div class="col-lg-10">
                <base-input
                  :name="`Kalibrasi Sensor ${sensor.name} ke-`"
                  :rules="sensor.isActive ? 'required' : ''"
                  v-model="form.dataKalibrasi[index].totalKalibrasi"
                  :disabled="!sensor.isActive" />
                <small class="d-block mt--3 text-justify">
                  Kalibrasi dalam satu tahun
                </small>
              </div>
            </div> -->
            <div class="form-group row">
              <label class="col-lg-2 col-form-label form-control-label">Tanggal Kalibrasi</label>
              <div class="col-lg-10">
                <base-input :name="`Tanggal Kalibrasi Sensor ${sensor.name}`" :rules="sensor.isActive ? 'required' : ''">
                  <flat-picker
                    :config="flatpickerOption"
                    class="form-control datepicker"
                    v-model="form.dataKalibrasi[index].tanggalKalibrasi"
                    :disabled="!sensor.isActive" />
                </base-input>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-lg-2 col-form-label form-control-label">Akurasi</label>
              <div class="col-lg-10">
                <base-input
                  :name="`Akurasi Sensor ${sensor.name}`"
                  :rules="sensor.isActive ? 'required' : ''"
                  v-model="form.dataKalibrasi[index].akurasi"
                  :disabled="!sensor.isActive" />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-lg-2 col-form-label form-control-label">File</label>
              <div class="col-lg-10">
                <base-input :name="`File Lampiran Sensor ${sensor.name}`" :rules="sensor.isActive ? 'required' : ''">
                  <file-input
                    :disabled="uploading"
                    accept="application/pdf"
                    :ref="`file-${index}`"
                    @change="uploadFile(index)" />
                  <base-progress
                    v-if="file[index].upload >= 1"
                    class="mb-0"
                    :type="file[index].progress >= 100 ? 'green' : 'orange'"
                    :value="file[index].progress" />
                </base-input>
                <small
                  v-if="file[index].upload == 2 || form.dataKalibrasi[index].fileKalibrasi"
                  class="d-block mt--2 text-justify">
                  <a :href="`${baseURL}${form.dataKalibrasi[index].fileKalibrasi}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                </small>
              </div>
            </div>
          </details>
        </div>
        <div class="form-group row">
          <div class="col-lg-12">
            <div class="float-right">
              <button class="btn btn-warning" @click="closeModal">Batal</button>
              <button class="btn btn-primary" @click="save" :disabled="!checkedSensor.length">Simpan</button>
            </div>
          </div>
        </div>
      </form>
    </validation-observer>
  </Modal>
</div>
</template>

<script>
import axios from "axios";
import defaults from "@/util/defaults";
import Swal from "sweetalert2";
import { BaseInput } from "@/components";
import FileInput from "@/components/Inputs/FileInput";
import flatPicker from "vue-flatpickr-component";
import Modal from "@/components/Modal.vue";
import moment from "moment";
import "sweetalert2/dist/sweetalert2.css";
import "flatpickr/dist/flatpickr.css";

const flatpickerOption = {
  dateFormat: "d/m/Y H:i:S",
  allowInput: true,
  altInput: true,
  altFormat: "d/m/Y",
  enableTime: false,
  static: true,
};

const parameterData = {
  brand: null,
  type: null,
  akurasi: null,
  tanggalKalibrasi: null,
  // totalKalibrasi: null,
  min: null,
  max: null,
  fileKalibrasi: null,
};

export default {
  components: {
    BaseInput,
    FileInput,
    Modal,
    flatPicker,
  },
  props: {
    showAddModal: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      uploading: false,
      companyData: [],
      companyName: null,
      companyType: null,
      province: null,
      city: null,
      date: moment().format("DD-MM-YYYY"),
      period: moment().quarter(),
      auth: JSON.parse(localStorage.getItem("auth-data")),
      baseURL: defaults.baseURL,
      flatpickerOption,
      sensors: [
        { name: "pH", isActive: false },
        { name: "COD", isActive: false },
        { name: "TSS", isActive: false },
        { name: "NH3N", isActive: false },
        { name: "Debit", isActive: false },
      ],
      checkedSensor: [],
      form: {
        loggerID: null,
        dataKalibrasi: [
          { parameter: 0, ...parameterData },
          { parameter: 1, ...parameterData },
          { parameter: 2, ...parameterData },
          { parameter: 3, ...parameterData },
          { parameter: 4, ...parameterData },
        ],
      },
      file: [
        { upload: 0, progress: 0 },
        { upload: 0, progress: 0 },
        { upload: 0, progress: 0 },
        { upload: 0, progress: 0 },
        { upload: 0, progress: 0 },
      ]
    }
  },
  methods: {
    async save() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (!tempValidate) {
        Swal.fire({
            icon: "error",
            text: `Data belum lengkap`,
          });
      } else {
        try {
          const newDataKalibrasi = this.form.dataKalibrasi.filter((_, index) => this.checkedSensor.includes(index))
          const newForm = {
            loggerID: this.form.loggerID,
            dataKalibrasi: newDataKalibrasi
          }
          const validasi = {
            loggerID: this.form.loggerID,
            status: "accepted"
          }
          const data = await axios.post(`${defaults.baseURL}/kalibrasi`, newForm);
          const dataValidasi = { ...validasi, timestamp: data.data[0].timestamp}
          await axios.put(`${defaults.baseURL}/kalibrasi/validasi`, dataValidasi);

          if (data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Tersimpan",
              text: "Uji kalibrasi telah tersimpan",
            }).then(() => this.$emit("close"));
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal",
              text: `Silakan Coba Kembali`,
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: error,
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
        this.sensors[0].isActive = data.sensor.find((ph) => ph.name === "pH").active;
        this.sensors[1].isActive = data.sensor.find((ph) => ph.name === "COD").active;
        this.sensors[2].isActive = data.sensor.find((ph) => ph.name === "TSS").active;
        this.sensors[3].isActive = data.sensor.find((ph) => ph.name === "NH3N").active;
        this.sensors[4].isActive = data.sensor.find((ph) => ph.name === "Debit").active;

        this.companyName = data.umum.compName;
        this.companyType = data.umum.compType;
        this.province = data.umum.compProvinceName;
        this.city = data.umum.compCityName;
      }
    },
    uploadFile(index) {
      this.uploading = true;
      this.file[index].upload = 1;
      let formData = new FormData();
      const self = this;
      formData.append("picture", this.$refs[`file-${index}`][0].files[0]);
      axios.post(`${defaults.baseURL}/file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: function (progressEvent) {
          self.file[index].progress = parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        }.bind(this),
      })
        .then((res) => {
          this.file[index].upload = 2;
          this.form.dataKalibrasi[index].fileKalibrasi = res.data.path;
          this.uploading = false;
        })
        .catch(() => {
          this.file[index].upload = 0;
          this.uploading = false;
          Swal.fire({ icon: "error", title: "Gagal", text: `Unggal file gagal, silakan coba kembali.` });
        });
    },
    async getLoggerId() {
      const { data } = await axios.get(`${defaults.baseURL}/laporanMingguan/loggerid?compID=${this.auth.userRole.compID}`);
      this.form.loggerID = data.data.loggerID;
    },
  },
  created() {
    this.getCompanyDetail();
    this.getLoggerId();
  },
}
</script>

<style>
details {
  border: 2px solid rgb(215, 215, 215);
  border-radius: 10px;
  padding: 0.6rem 1.5rem 0.25rem;
  margin-bottom: 1rem;
}
summary {
  font-weight: bold;
  margin: 0 -1.5rem 0.75rem;
  padding: 0.6rem 1.5rem 0.25rem;
  user-select: none;
}
details[open] {
  padding: 0.6rem 1.5rem 0.25rem;
}
details[open] summary {
  border-bottom: 2px solid rgb(215, 215, 215);
  margin-bottom: 1.5rem;
  padding: 0.6rem 1.5rem 1.25rem;
}
.flatpickr-wrapper {
  width: 100%;
}
</style>