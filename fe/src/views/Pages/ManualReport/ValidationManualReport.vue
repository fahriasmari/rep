<template>
  <div>
    <p class="font-weight-bold mt-4 mb-2">Riwayat Validasi</p>
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
            <td>{{ formatDate(history.createdAt, "DD/MM/YYYY HH:mm") }}</td>
            <td>{{ history.petugas }}</td>
            <td>{{ history.status }}</td>
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
