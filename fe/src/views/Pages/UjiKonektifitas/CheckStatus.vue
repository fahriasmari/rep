<template>
<div class="row">
  <validation-observer ref="formValidator" class="w-100">
    <form>
      <div class="col-12">
        <div class="card bg-white border-0">
          <div class="card-body p-4">
            <div class="form-group row">
              <label class="col-lg-2 col-form-label form-control-label">ID Pendaftaran Uji Koneksi</label>
              <base-input
                class="col-lg-8"
                name="ID Pendaftaran Uji Koneksi"
                rules="required"
                v-model="pin" />
              <div class="col-lg-2">
                <base-button class="bg-secondary w-100" @click="getData">Cek Status</base-button>
              </div>
              <div class="pl-3">
                <p class="font-weight-bold" :class="validation.class">{{ validation.message }}</p>
                <table v-if="validation.uid && validation.date" class="table table-bordered">
                  <tr>
                    <th>UID</th>
                    <th>Tanggal Uji</th>
                  </tr>
                  <tr>
                    <td>{{ validation.uid }}</td>
                    <td>{{ validation.date }}</td>
                  </tr>
                </table>
              </div>
              <ValidationHistory v-if="showTable" :data="histories" class="px-4 w-100" />
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
import ValidationHistory from "./ValidationHistory.vue";
import moment from "moment";

export default {
  components: { ValidationHistory },
  data() {
    return {
      pin: null,
      message: null,
      histories: [],
      validation: {},
      showTable: false,
    };
  },
  methods: {
    async getData() {
      const { data } = await axios.get(`${defaults.baseURL}/api/v1/ujikonek/list/${this.pin}`);
      if (data.code === 200) {
        if (data.validitas[data.validitas.length - 1].status === "accepted") {
          this.validation.message = "Pendaftaran Uji Konektifitas Sudah diterima.";
          this.validation.uid = data.data.uid;
          this.validation.date = moment.unix(data.validitas[data.validitas.length - 1].tanggal_uji).format("DD/MM/YYYY");
          this.validation.class = "text-success";
        } else if (data.validitas[data.validitas.length - 1].status === "rejected") {
          this.validation.message = "Pendaftaran Uji Konektifitas ditolak, silahkan perbaiki sesuai arahan dari tim validasi.";
          this.validation.class = "text-danger";
        } else {
          this.validation.message = "Pendaftaran Uji Konektifitas masih dalam proses.";
          this.validation.class = "text-warning";
        }
        this.histories = data.validitas.sort((a, b) => b.created_time - a.created_time);
        this.showTable = !!data.validitas.length;
      }
    },
  }
}
</script>