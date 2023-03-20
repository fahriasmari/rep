<template>
<div class="row">
  <validation-observer ref="formValidator" class="w-100">
    <form>
      <div class="col-12">
        <div class="card bg-white border-0">
          <div class="card-body p-4">
            <div class="form-group row">
              <label class="col-lg-2 col-form-label form-control-label">ID Pendaftaran</label>
              <base-input
                class="col-lg-8"
                name="ID Pendaftaran"
                rules="required"
                v-model="pin" />
              <div class="col-lg-2">
                <base-button class="bg-secondary w-100" @click="checkStatus">Cek Status</base-button>
              </div>
              <p v-if="type === 'ujikonek'" class="pl-2">{{ message }}</p>
              <div v-if="type === 'pendaftaran' && showTable" class="col-12">
              <ValidationHistory :data="histories" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </validation-observer>
</div>
</template>

<script>
import axios from "axios";
import defaults from "@/util/defaults";
import moment from "moment";
import ValidationHistory from "./ValidationHistory.vue";

export default {
  components: { ValidationHistory },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pin: null,
      message: null,
      histories: [],
      showTable: false,
    };
  },
  methods: {
    async checkStatus() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (tempValidate) {
        if(this.type === "pendaftaran") {
          this.checkPendaftaran();
        } else if(this.type === "ujikonek") {
          this.checkUjiKonek();
        }
      }
    },
    async checkPendaftaran() {
      const response = await axios.get(`${defaults.baseURL}/pendaftaran/validasi/${this.pin}`);
      // const response = await axios.get(`${defaults.baseURL}/form/list-histori-pendaftaran/${this.pin}`);
      if (response.status === 200) {
        if (response.data.length) {
          this.histories = response.data[0].histori_pendaftaran.sort((a, b) => b.created_time - a.created_time);
        } else {
          this.histories = [];
        }
        this.showTable = true;
      } else {
        this.message = response.data.message;
      }
    },
    async checkUjiKonek() {
      const { data } = await axios.get(`${defaults.baseURL}/api/v1/ujikonek/status/${this.pin}`);
      if (data.code === 200) {
        this.message = data.validated ? "Pendaftaran Uji Konektifitas Sudah diterima" : "Pendaftaran Uji Konektifitas masih dalam proses";
      }
    },
    dateTime(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY HH:mm");
    },
  }
}
</script>