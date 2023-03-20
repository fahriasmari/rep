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
          <h2>Detail Laporan Manual</h2>
        </div>
      </template>
      <div class="border-top pt-4">
        <div class="form-group row">
          <p class="col-3 col-form-label form-control-label pt-0">Nama Industri</p>
          <p class="col-9">{{ data.compName }}</p>
        </div>
        <div class="form-group row">
          <p class="col-3 col-form-label form-control-label pt-0">Logger ID</p>
          <p class="col-9">{{ data.loggerID }}</p>
        </div>
        <div class="form-group row">
          <p class="col-3 col-form-label form-control-label pt-0">File SHU</p>
          <div class="col-9">
            <a :href="`${baseURL}${data.fileSHU}`" target="_blank" class="rounded bg-primary px-2 py-1 text-white">Download</a>
          </div>
        </div>
        <div class="form-group row">
          <p class="col-3 col-form-label form-control-label pt-0">Tanggal Kejadian</p>
          <p class="col-9">{{ formatDate(data.tanggalKejadian) }} - {{ formatDate(data.endTanggalKejadian) }} </p>
        </div>
        <div class="form-group row">
          <p class="col-3 col-form-label form-control-label pt-0">Minggu ke-</p>
          <p class="col-9">{{ data.week }}</p>
        </div>
        <div class="form-group row">
          <p class="col-3 col-form-label form-control-label pt-0">Status</p>
          <div class="col-9">
            <span
              v-if="data.status === 'waiting'"
              class="border border-warning rounded-lg px-2 py-1 text-warning">
              Menunggu Validasi
            </span>
            <span
              v-if="data.status === 'accepted'"
              class="border border-success rounded-lg px-2 py-1 text-success">
              Diterima
            </span>
            <span
              v-if="data.status === 'rejected'"
              class="border border-danger rounded-lg px-2 py-1 text-danger">
              Ditolak
            </span>
          </div>
        </div>
        <hr />
        <p class="font-weight-bold mt-4 mb-2">Nilai Parameter</p>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">pH</th>
                <th scope="col">COD</th>
                <th scope="col">TSS</th>
                <th scope="col">NH3N</th>
                <th scope="col">Debit</th>
              </tr>
            </thead>
            <tbody>
              <tr> 
                <td>{{ getParam("pH") }}</td>
                <td>{{ getParam("COD") }}</td>
                <td>{{ getParam("TSS") }}</td>
                <td>{{ getParam("NH3N") }}</td>
                <td>{{ getParam("Debit") }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ValidationManualReport :data="validationHistory" />
        <div class="form-group row mt-4">
          <div class="col-lg-12">
            <div class="float-right">
              <button class="btn btn-primary" @click="closeModal">Tutup</button>
            </div>
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
import Modal from "@/components/Modal.vue";
import ValidationManualReport from "./ValidationManualReport.vue";

export default {
  components: {
    Modal,
    ValidationManualReport,
  },
  props: {
    showDetailModal: {
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
      baseURL: defaults.baseURL,
      validationHistory: [],
    }
  },
  methods: {
    async getValidationHistory() {
      const { data } = await axios.get(`${defaults.baseURL}/laporanMingguan/getvalidasi?formID=${this.data.id}`);
      this.validationHistory = data;
    },
    getParam(parameter) {
      return this.data.dataParam.find(({ name }) => name === parameter).value || "Tidak Wajib";
    },
    closeModal() {
      this.$emit("close");
    },
    formatDate(date) {
      return moment.unix(date).format("DD/MM/YYYY");
    },
  },
  mounted() {
    this.getValidationHistory();
  },
}
</script>