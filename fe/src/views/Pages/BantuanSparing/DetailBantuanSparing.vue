<template>
<div>
  <Modal
    :show="showDetailModal"
    modalClasses="modal-dialog-scrollable"
    headerClasses="pb-0"
    @close="closeModal"
    size="lg">
    <template v-slot:header>
      <div class="modal-title">
        <h2>Detail Pertanyaan</h2>
      </div>
    </template>
    <div class="px-4 border-top pt-4">
      <div class="form-group row">
        <p class="col-3 col-form-label form-control-label pt-0">Tanggal</p>
        <p class="col-9">{{ formatDate(data.waktu )}}</p>
      </div>
      <div class="form-group row">
        <p class="col-3 col-form-label form-control-label pt-0">Judul Pertanyaan</p>
        <p class="col-9">{{ data.judul }}</p>
      </div>
      <div class="form-group row">
        <p class="col-3 col-form-label form-control-label pt-0">Detail Pertanyaan</p>
        <p class="col-9" v-html="data.detail"></p>
      </div>
      <div class="form-group row">
        <p class="col-3 col-form-label form-control-label pt-0">Pembuat Pertanyaan</p>
        <p class="col-9">{{ data.penulis }}</p>
      </div>
      <div class="form-group row">
        <p class="col-3 col-form-label form-control-label pt-0">Nomor Telepon</p>
        <p class="col-9">{{ data.kontak }}</p>
      </div>
      <div class="form-group row">
        <p class="col-3 col-form-label form-control-label pt-0">Provinsi</p>
        <p class="col-9">{{ data.provinsi.provName }}</p>
      </div>
      <div class="form-group row">
        <p class="col-3 col-form-label form-control-label pt-0">Kabupaten / Kota</p>
        <p class="col-9">{{ data.kabkot.kabkotName }}</p>
      </div>
      <div class="form-group row">
        <p class="col-3 col-form-label form-control-label pt-0">Industri</p>
        <p class="col-9">{{ data.company.compName }}</p>
      </div>
      <div class="form-group row">
        <p class="col-3 col-form-label form-control-label pt-0">Lampiran</p>
        <p class="col-9">
          <a
            v-if="data.lampiran.path"
            :href="`${baseURL}${data.lampiran.path}`"
            target="_blank"
            class="rounded bg-primary p-2 text-white">Lihat file</a>
          <span v-else>Tidak ada lampiran</span>
        </p>
      </div>
      <div class="mt-4 border-top">
        <validation-observer ref="formValidator">
          <form>
            <h3 class="my-4">Tanggapan</h3>
            <div class="form-group row mb-0">
              <div class="col-12">
                <base-input name="Tanggapan" rules="required">
                  <html-editor v-model="response"></html-editor>
                </base-input>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-lg-12">
                <div class="float-right">
                <button class="btn btn-primary" @click="sendResponse">Kirim</button>
                </div>
              </div>
            </div>
        </form>
        </validation-observer>
      </div>
      <div class="mt-4 border-top">
        <h3 class="my-4">Riwayat Tanggapan</h3>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Tanggal</th>
                <th scope="col">Nama</th>
                <th scope="col">Pesan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="history in histories" :key="history._id">
                <th scope="row">{{ formatDate(history.waktu) }}</th> 
                <td>{{ history.userEmail }}</td>
                <td v-html="history.tanggapan"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="mt-4 form-group row">
      <div class="col-lg-12">
        <div class="float-right">
        <button class="btn btn-warning" @click="closeModal">Tutup</button>
        </div>
      </div>
    </div>
  </Modal>
</div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import defaults from "@/util/defaults";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import HtmlEditor from "@/components/Inputs/HtmlEditor";
import Modal from "@/components/Modal.vue";

export default {
  components: {
    Modal,
    HtmlEditor,
  },
  props: {
    showDetailModal: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      baseURL: defaults.baseURL,
      response: null,
      histories: [],
      auth: JSON.parse(localStorage.getItem("auth-data")),
    }
  },
  methods: {
    async sendResponse() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (!tempValidate) {
        Swal.fire({
            icon: 'error',
            text: `Tanggapan tidak boleh kosong`,
          });
      } else {
        const formData = {
          tanggapan: this.response,
          userEmail: this.auth.name,
        };
        const data = await axios.put(`${defaults.baseURL}/pengaduan/tanggapan/${this.data._id}`, formData);
        if (data.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Tersimpan',
            text: `Tanggapan telah tersimpan`,
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
    async getResponse() {
      const { data } = await axios.get(`${defaults.baseURL}/pengaduan/${this.data._id}`);
      this.histories = data.tanggapan.sort((a, b) => b.waktu - a.waktu);
    },
    closeModal() {
      this.$emit("close");
    },
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY HH:mm");
    },
  },
  mounted() {
    this.getResponse();
  },
}
</script>