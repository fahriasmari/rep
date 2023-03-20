<template>
<div v-if="this.$store.state.auth.level > 2">
  <Modal
      :show="showAddModal"
      modalClasses="modal-dialog-scrollable"
      headerClasses="pb-0"
      @close="closeModal"
      size="lg">
      <template v-slot:header>
        <div class="modal-title">
          <h2>Ajukan Pertanyaan</h2>
        </div>
      </template>
      <div class="border-top pt-4">
        <validation-observer ref="formValidator" class="w-100">
          <form class="col-12">
             <div class="form-group row">
                <label class="col-lg-12 col-form-label form-control-label">Judul Pertanyaan</label>
                <div class="col-lg-12">
                  <base-input
                    name="Judul Pertanyaan"
                    rules="required"
                    v-model="form.judul" />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-form-label form-control-label px-3">Detail Pertanyaan</label>
                <div class="col-12">
                  <base-input name="Detail Pertanyaan" rules="required">
                    <html-editor v-model="form.detail"></html-editor>
                  </base-input>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-lg-12 col-form-label form-control-label">Nama Pembuat Pertanyaan</label>
                <div class="col-lg-12">
                  <base-input
                    name="Nama Pembuat Pertanyaan"
                    rules="required"
                    v-model="form.penulis" />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-lg-12 col-form-label form-control-label">Nomor Telepon</label>
                <div class="col-lg-12">
                  <base-input
                    name="Nomor Telepon"
                    rules="required"
                    v-model="form.kontak" />
                </div>
              </div>
              <!-- NOTE untuk provinsi kabkot industri di ambil dari DB saja -->
              <!-- <div class="form-group row">
                <label class="col-lg-12 col-form-label form-control-label">Provinsi</label>
                <div class="col-lg-12">
                  <base-input name="Provinsi" rules="required">
                    <el-select
                      v-model="form.provinsi"
                      filterable
                      @change="getCity(form.provinsi)">
                      <el-option v-for="option in provinces" :key="option._id" :label="option.name" :value="option._id" />
                    </el-select>
                  </base-input>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-lg-12 col-form-label form-control-label">Kabupaten / Kota</label>
                <div class="col-lg-12">
                  <base-input name="Kabupaten / Kota" rules="required">
                    <el-select v-model="form.city" filterable>
                      <el-option v-for="option in cities" :key="option._id" :label="option.name" :value="option._id" />
                    </el-select>
                  </base-input>
                </div>
              </div> -->
              <div class="form-group row">
                <label class="col-lg-12 col-form-label form-control-label">Industri</label>
                <div class="col-lg-12">
                  <base-input name="Industri" rules="required">
                    <el-select v-model="form.compID" filterable @change="setCompanyData">
                      <el-option v-for="company in companyData" :key="company._id" :label="company.name" :value="company.compID" />
                    </el-select>
                  </base-input>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-lg-12 col-form-label form-control-label">Lampiran</label>
                <div class="col-lg-12">
                  <base-input name="Lampiran">
                    <file-input
                      :disabled="uploading"
                      ref="lampiran"
                      @change="uploadFile('lampiran')" />
                    <base-progress
                      v-if="form.lampiran.upload >= 1"
                      class="mb-0"
                      :type="form.lampiran.progress >= 100 ? 'green' : 'orange'"
                      :value="form.lampiran.progress" />
                  </base-input>
                  <small
                    v-if="form.lampiran.upload == 2"
                    class="d-block mt--3 text-justify">
                    <a :href="`${baseURL}${form.lampiran.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                  </small>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-lg-12">
                  <div class="float-right">
                  <button class="btn btn-warning" @click="closeModal">Batal</button>
                  <button class="btn btn-primary" @click="send">Kirim</button>
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
import HtmlEditor from "@/components/Inputs/HtmlEditor";
import FileInput from "@/components/Inputs/FileInput";
import { Select, Option } from "element-ui";
import Modal from "@/components/Modal.vue";

export default {
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    BaseInput,
    FileInput,
    Modal,
    HtmlEditor,
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
      baseURL: defaults.baseURL,
      form: {
        judul: null,
        detail: null,
        penulis: null,
        kontak: null,
        provID: null,
        kabkotID: null,
        compID: null,
        lampiran: {
          path: "",
          upload: 0,
          progress: 0,
        },
      }
    }
  },
  methods: {
    async send() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (!tempValidate) {
        Swal.fire({
            icon: 'error',
            text: `Data belum lengkap`,
          });
      } else {
        const data = await axios.put(`${defaults.baseURL}/pengaduan`, this.form);
        if (data.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Tersimpan',
            text: `Pertanyaan telah tersimpan, silahkan tunggu konfirmasi dari admin`,
          }).then(() => this.$emit("close"));
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: `Silakan Coba Kembali`,
         });
        }
      }
    },
    closeModal() {
      this.$emit("close");
    },
    async getCompanyData() {
      const { data } = await axios.get(`${defaults.baseURL}/report/list/5f340d5e328182315c11ee98`);
      this.companyData = data.compList;
    },
    setCompanyData() {
      const companyData = this.companyData.find((item) => item.compID === this.form.compID);
      this.form.provID = companyData.provID;
      this.form.kabkotID = companyData.kabkotID;
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
          this.errorSwal("Silakan Upload Ulang");
        });
    },
  },
  created() {
    this.getCompanyData();
  },
}
</script>