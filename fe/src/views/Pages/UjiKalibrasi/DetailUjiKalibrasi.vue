<template>
<div>
  <Modal
    :show="showDetailModal"
    modalClasses="modal-dialog-scrollable"
    headerClasses="pb-0"
    @close="closeModal"
    size="xl">
    <template v-slot:header>
      <div class="modal-title border-bottom pb-4 w-100">
        <h2 class="ml-3">Detail Uji Kalibrasi</h2>
      </div>
    </template>
    <div class="w-100 col-12">
      <div class="form-group row mb-0">
        <label class="col-lg-2 col-form-label form-control-label">Nama Industri</label>
        <div class="col-lg-10 col-form-label font-weight-bold">
          {{ data.compName }}
        </div>
      </div>
      <div class="form-group row mb-0">
        <label class="col-lg-2 col-form-label form-control-label">Jenis Industri</label>
        <div class="col-lg-10 col-form-label font-weight-bold">
          {{ data.compType }}
        </div>
      </div>
      <div class="form-group row mb-0">
        <label class="col-lg-2 col-form-label form-control-label">Provinsi</label>
        <div class="col-lg-10 col-form-label font-weight-bold">
          {{ data.provName }}
        </div>
      </div>
      <div class="form-group row mb-0">
        <label class="col-lg-2 col-form-label form-control-label">Kab/Kota</label>
        <div class="col-lg-10 col-form-label font-weight-bold">
          {{ data.kabkotName }}
        </div>
      </div>
      <div class="form-group row mb-0">
        <label class="col-lg-2 col-form-label form-control-label">Tanggal</label>
        <div class="col-lg-10 col-form-label font-weight-bold">
          {{ dateFormat(data.timestamp) }}
        </div>
      </div>
      <div class="form-group row">
        <label class="col-lg-2 col-form-label form-control-label">Periode</label>
        <div class="col-lg-10 col-form-label font-weight-bold">
          {{ datePeriod(data.timestamp) }}
        </div>
      </div>
      <div class="font-weight-bolder mb-2">Sensor</div>
      <details v-for="sensor in data.parameter" :key="sensor.name" open>
        <summary>Sensor {{ sensor.name }}</summary>
        <div class="form-group row mb-0">
          <label class="col-lg-2 col-form-label form-control-label">Brand</label>
          <div class="col-lg-10 col-form-label font-weight-bold">
            {{ sensor.brand }}
          </div>
        </div>
        <div class="form-group row mb-0">
          <label class="col-lg-2 col-form-label form-control-label">Tipe</label>
          <div class="col-lg-10 col-form-label font-weight-bold">
            {{ sensor.type }}
          </div>
        </div>
        <div class="form-group row mb-0">
          <label class="col-lg-2 col-form-label form-control-label">Range</label>
          <div class="col-lg-10 col-form-label font-weight-bold">
            {{ sensor.min }} - {{ sensor.max }}
          </div>
        </div>
        <!-- <div class="form-group row mb-0">
          <label class="col-lg-2 col-form-label form-control-label">Kalibrasi ke-</label>
          <div class="col-lg-10 col-form-label font-weight-bold">
            {{ sensor.totalKalibrasi }}
          </div>
        </div> -->
        <div class="form-group row mb-0">
          <label class="col-lg-2 col-form-label form-control-label">Periode kalibrasi</label>
          <div class="col-lg-10 col-form-label font-weight-bold">
            {{ sensor.jadwalKalibrasi }}
          </div>
        </div>
        <div class="form-group row mb-0">
          <label class="col-lg-2 col-form-label form-control-label">Tanggal kalibrasi</label>
          <div class="col-lg-10 col-form-label font-weight-bold">
            {{ dateFormat(sensor.tanggalKalibrasi) }}
          </div>
        </div>
        <div class="form-group row mb-0">
          <label class="col-lg-2 col-form-label form-control-label">Akurasi</label>
          <div class="col-lg-10 col-form-label font-weight-bold">
            {{ sensor.akurasi }}
          </div>
        </div>
        <div class="form-group row">
          <label class="col-lg-2 col-form-label form-control-label">File</label>
          <div class="col-lg-10 col-form-label font-weight-bold">
            <a
              v-if="sensor.fileKalibrasi"
              :href="`${baseURL}${sensor.fileKalibrasi}`"
              target="_blank"
              class="rounded bg-primary p-2 text-white">
              Lihat file
            </a>
            <div v-else>File belum diupload</div>
          </div>
        </div>
      </details>
      <div class="form-group row">
        <div class="col-lg-12">
          <div class="float-right">
            <button class="btn btn-warning" @click="closeModal">Tutup</button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</div>
</template>
  
<script>
import defaults from "@/util/defaults";
import Modal from "@/components/Modal.vue";
import moment from "moment";

export default {
  components: {
    Modal,
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
    }
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    dateFormat(date) {
      return moment.unix(date).format("DD-MM-YYYY");
    },
    datePeriod(date) {
      const period = moment.unix(date).quarter();
      return `Q${period}`;
    },
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
</style>