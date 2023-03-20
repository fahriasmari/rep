<template>
  <Modal
    :show="showModal"
    modalClasses="modal-dialog-scrollable"
    headerClasses="pb-0"
    @close="onCloseModal"
    size="lg">
    <template v-slot:header>
      <div class="modal-title pb-4">
        <p class="mdl-title">Validasi Uji Konektifitas {{ data.companyName }}</p>
      </div>
    </template>
    <div class="px-4 border-top">
      <validation-observer ref="formValidator" v-if="!data.isValidated">
        <form>
          <div class="form-group row">
            <label class="col-lg-12 col-form-label form-control-label">Status</label>
            <div class="col-lg-12">
              <base-input name="Status" rules="required">
                <el-select v-model="form.status">
                  <el-option label="Diterima" value="accepted" />
                  <el-option label="Ditolak" value="rejected" />
                </el-select>
              </base-input>
            </div>
          </div>
          <template v-if="form.status === 'accepted'">
            <!-- <div class="form-group row">
              <label class="col-lg-12 col-form-label form-control-label">UID</label>
              <div class="col-lg-12">
                <base-input name="UID"  v-model="form.uid"  class="mb-0" readonly />
                <small class="d-block mt--3">Masukan 13 digit UID</small>
              </div>
            </div> -->
            <div class="form-group row">
                <label class="col-lg-12 col-form-label form-control-label">Tanggal Uji</label>
                <div class="col-lg-12">
                  <base-input name="Tanggal Uji" rules="required">
                    <flat-picker
                      :config="flatpickerOption"
                      class="form-control datepicker"
                      v-model="form.tanggal_uji" />
                  </base-input>
                </div>
            </div>
          </template>
          <div class="form-group row">
            <p class="pl-3 col-form-label form-control-label">Keterangan</p>
            <div class="col-lg-12">
              <html-editor v-model="form.keterangan"></html-editor>
            </div>
          </div>
        </form>
        <div class="form-group row px-3 float-right pb-4">
          <button class="btn btn-primary" @click="onSubmit">Simpan</button>
        </div>
      </validation-observer>
      <div>
        <ValidationHistory :data="data.validitas" />
        <div class="form-group row px-3 float-right pb-4 mt-4">
          <button class="btn btn-warning" @click="onCloseModal">Tutup</button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import axios from "axios";
import defaults from "@/util/defaults";
import Modal from '@/components/Modal.vue';
import HtmlEditor from "@/components/Inputs/HtmlEditor";
import { Select, Option } from "element-ui";
import { BaseInput } from "@/components";
import ValidationHistory from "./ValidationHistory.vue";

const flatpickerOption = {
  dateFormat: "U",
  allowInput: true,
  altInput: true,
  altFormat: "d/m/Y",
};

export default {
  components: {
    Modal,
    HtmlEditor,
    flatPicker,
    BaseInput,
    [Select.name]: Select,
    [Option.name]: Option,
    ValidationHistory,
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
      form: {
        keterangan: null,
        tanggal_uji: null,
        status: null,
        user_id: null,
        uid: null,
        petugas: null,
      },
      flatpickerOption,
    };
  },
  methods: {
    async onSubmit() {
      const auth = JSON.parse(localStorage.getItem("auth-data"));
      this.form.user_id = auth.name;
      const tempValidate = await this.$refs.formValidator.validate();
      if (!tempValidate) {
        Swal.fire({
            icon: 'error',
            text: `Data belum lengkap`,
          });
      } else {
        const data = await axios.post(`${defaults.baseURL}/api/v1/ujikonek/validasi/${this.data.id}`, this.form);
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
    onCloseModal() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped>
.mdl-title {
  font-size: 18px;
  font-weight: 600;
  color: #6C757D;
  width: 100%;
}
</style>