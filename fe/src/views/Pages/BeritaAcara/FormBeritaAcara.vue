<template>
  <Modal
    :show="showModal"
    modalClasses="modal-dialog-scrollable"
    headerClasses="pb-0"
    @close="closeModal"
    size="lg">
    <template v-slot:header>
      <strong>Tambah Data Berita Acara Verifikasi Lapangan</strong>
    </template>
    <validation-observer ref="formValidator" class="w-100">
      <form class="col-12 px-4 border-top pt-4">
        <div class="form-group row">
          <label class="col-lg-2 col-form-label form-control-label">Tanggal Berita Acara</label>
          <div class="col-lg-10">
            <base-input name="Tanggal Berita Acara" rules="required">
              <flat-picker
                :config="flatpickerOption"
                class="form-control datepicker"
                v-model="form.tanggalBeritaAcara" />
            </base-input>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-lg-2 col-form-label form-control-label">Status Perusahaan</label>
          <div class="col-lg-10">
            <base-input name="Status Perusahaan" rules="required">
              <el-select v-model="form.isRegistered" @change="statusChanged">
                <el-option
                  label="Tidak Terdaftar"
                  :value="false" />
                <el-option
                  label="Terdaftar"
                  :value="true" />
              </el-select>
            </base-input>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-lg-2 col-form-label form-control-label">Nama Perusahaan</label>
          <div class="col-lg-10">
            <base-input v-if="form.isRegistered" name="Nama Perusahaan" rules="required">
              <el-select v-model="form.compID" filterable @change="getCompanyData">
                <el-option
                  v-for="company in data.compList"
                  :key="company._id"
                  :label="company.name"
                  :value="company.compID" />
              </el-select>
            </base-input>
            <base-input  v-else name="Nama Perusahaan" rules="required" v-model="form.detailOtherComp.compName" />
          </div>
        </div>
        <template v-if="!form.isRegistered">
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Provinsi</label>
            <div class="col-lg-10">
              <base-input name="Provinsi" rules="required">
                <el-select v-model="form.provID" filterable @change="getCity">
                  <el-option
                    v-for="province in data.provList"
                    :key="province._id"
                    :label="province.name"
                    :value="province._id" />
                </el-select>
              </base-input>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Kabupaten/Kota</label>
            <div class="col-lg-10">
              <base-input name="Kabupaten/Kota" rules="required">
                <el-select v-model="form.kabkotID" filterable>
                  <el-option
                    v-for="city in cities"
                    :key="city._id"
                    :label="city.name"
                    :value="city._id" />
                </el-select>
              </base-input>
            </div>
          </div>
        </template>
        <div class="form-group row">
          <label class="col-lg-2 col-form-label form-control-label">Tanggal Kunjungan</label>
          <div class="col-lg-10">
            <base-input name="Tanggal Kunjungan" rules="required">
              <flat-picker
                :config="flatpickerOption"
                class="form-control datepicker"
                v-model="form.tanggalKunjungan" />
            </base-input>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-lg-2 col-form-label form-control-label">File Lampiran</label>
          <div class="col-lg-10">
            <base-input name="File Lampiran" rules="required">
              <file-input
                :disabled="uploading"
                accept="application/pdf"
                ref="lampiranBeritaAcara"
                @change="uploadFile('lampiranBeritaAcara')" />
              <base-progress
                v-if="form.lampiranBeritaAcara.upload >= 1"
                class="mb-0"
                :type="form.lampiranBeritaAcara.progress >= 100 ? 'green' : 'orange'"
                :value="form.lampiranBeritaAcara.progress" />
            </base-input>
            <small
              v-if="form.lampiranBeritaAcara.upload == 2"
              class="d-block mt-1 text-justify">
              <a :href="`${baseURL}${form.lampiranBeritaAcara.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
            </small>
          </div>
        </div>
        <div class="form-group row px-3 float-right pb-4">
          <button class="btn btn-warning" @click="closeModal">Batal</button>
          <button class="btn btn-primary" @click="onSubmit">Simpan</button>
        </div>
      </form>
    </validation-observer>
  </Modal>
</template>
<script>
import { Select, Option } from "element-ui";
import { BaseInput } from "@/components";
import FileInput from "@/components/Inputs/FileInput";
import flatPicker from "vue-flatpickr-component";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.css";
import "sweetalert2/dist/sweetalert2.css";
import axios from "axios";
import defaults from "@/util/defaults";
import Modal from "@/components/Modal.vue";

const flatpickerOption = {
  dateFormat: "U",
  allowInput: true,
  altInput: true,
  altFormat: "d/m/Y",
};

export default {
  components: {
    BaseInput,
    FileInput,
    flatPicker,
    Modal,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      uploading: false,
      flatpickerOption,
      baseURL: defaults.baseURL,
      cities: this.data.kabkotList,
      form: {
        tanggalBeritaAcara: null,
        tanggalKunjungan: null,
        isRegistered: false,
        compID: null,
        detailOtherComp: {
          compName: null,
        },
        provID: null,
        kabkotID: null,
        lampiranBeritaAcara: {
          path: null,
          upload: 0,
          progress: 0,
        },
      },
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    uploadFile(field) {
      this.uploading = true;
      this.form[field].upload = 1;
      let formData = new FormData();
      formData.append("picture", this.$refs[field].files[0]);

      axios.post(`${defaults.baseURL}/file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: function (progressEvent) {
          this.form[field].progress = parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        }.bind(this),
      })
        .then((res) => {
          this.form[field].upload = 2;
          this.form[field].path = res.data.path;
          this.uploading = false;
        })
        .catch((err) => {
          this.form[field].upload = 0;
          this.uploading = false;
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: `Silakan Upload Ulang`,
          });
        });
    },
    getCompanyData() {
      const company = this.data.compList.find((company) => company.compID === this.form.compID);
      this.form.provID = company.provID;
      this.form.kabkotID = company.kabkotID;
    },
    getCity() {
      this.cities = this.data.kabkotList.filter((city) => city.provID === this.form.provID);
    },
    statusChanged() {
      if (!this.form.isRegistered) {
        this.form.provID = null;
        this.form.kabkotID = null;
      } else {
        this.form.detailOtherComp.compName = null;
      }
    },
    async onSubmit() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (!tempValidate) {
        Swal.fire({
            icon: 'error',
            text: `Data belum lengkap`,
          });
      } else {
        const data = await axios.post(`${defaults.baseURL}/beritaacara`, this.form);
        if (data.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Tersimpan',
            text: `Data telah tersimpan`,
          }).then(() => {
            this.$emit("close");
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: `Silakan Coba Kembali`,
         });
        }
      }
    },
  },
};
</script>
