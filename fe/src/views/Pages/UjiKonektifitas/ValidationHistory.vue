<template>
  <div>
    <p class="font-weight-bold mt-6 mb-2">Riwayat Validasi</p>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Tanggal<br/>Reject/Approve</th>
            <th scope="col">Petugas<br/>Reject/Approve</th>
            <th scope="col">Status</th>
            <th scope="col">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="history in data" :key="history._id"> 
            <td>{{ formatDate(history.created_time, "DD/MM/YYYY HH:mm") }}</td>
            <td>{{ history.user_id }}</td>
            <td>
              <div
                v-if="history.status === 'pending'"
                class="border border-warning rounded-lg px-2 py-1 text-warning text-center">
                Menunggu<br />Validasi
              </div>
              <div
                v-if="history.status === 'accepted'"
                class="border border-success rounded-lg px-2 py-1 text-success text-center">
                Diterima
              </div>
              <div
                v-if="history.status === 'rejected'"
                class="border border-danger rounded-lg px-2 py-1 text-danger text-center">
                Ditolak
              </div>
            </td>
            <td v-html="history.keterangan"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import moment from "moment";

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatDate(timestamp, format) {
      return moment.unix(timestamp).format(format);
    },
  },
};
</script>
