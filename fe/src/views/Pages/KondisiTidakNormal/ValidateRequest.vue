<template>
<div class="">
  <Modal
    :show="showModal"
    modalClasses="modal-dialog-scrollable"
    headerClasses="pb-0"
    @close="closeModal"
    size="xl">
    <template v-slot:header>
      <div class="modal-title">
        <p class="mdl-title">Validasi Laporan Kondisi Tidak Normal</p>
      </div>
    </template>
    <div class="px-4 border-top pt-4">
      <template v-if="auth.userRole.role !== 'comp'">
        <div class="form-group row">
          <p class="pl-3 col-form-label form-control-label">{{ company }}</p>
          <div class="col-lg-12">
            <html-editor v-model="verifyNote"></html-editor>
          </div>
        </div>
        <div class="mdl-btn-wrap mb-6">
          <button class="mdl-btn mdl-btn-reject" @click="reject">Tolak</button>
          <button class="mdl-btn mdl-btn-accept" @click="accept">Setujui</button>
        </div>
      </template>
      <div>
        <p class="font-weight-bold mb-2">Riwayat Validasi</p>
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
            <tr v-for="history in histories" :key="history._id">
              <td>{{ formatDate(history.waktu) }}</td>
              <td>{{ history.userEmail }}</td>
              <td>
                <p v-if="history.status === 'accepted'">Diterima</p>
                <p v-else-if="history.status === 'rejected'">Ditolak</p>
                <p v-else-if="history.status === 'waiting'">Menunggu Validasi</p>
              </td>
              <td class="mdl-content" v-html="history.catatan"></td>
            </tr>
          </tbody>
        </table>
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
import Modal from "@/components/Modal.vue";
import HtmlEditor from "@/components/Inputs/HtmlEditor";

export default {
  components: {
    Modal,
    HtmlEditor,
  },
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      verifyNote: "",
      verifyStatus: null,
      company: "",
      histories: [],
      auth: JSON.parse(localStorage.getItem("auth-data")),
    };
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },
    reject() {
      Swal.fire({
        title: 'Apakah anda yakin akan menolak laporan ini?',
        confirmButtonText: 'Tolak',
        showCancelButton: true,
        cancelButtonText: 'Batal',
        icon: 'question',
      }).then((result) => {
        if (result.isConfirmed) {
          this.verifyStatus = "rejected";
          this.submitData();
        }
      })
    },
    accept() {
      Swal.fire({
        title: 'Apakah anda yakin akan menerima laporan ini?',
        confirmButtonText: 'Terima',
        showCancelButton: true,
        cancelButtonText: 'Batal',
        icon: 'question',
      }).then((result) => {
        if (result.isConfirmed) {
          this.verifyStatus = "accepted";
          this.submitData();
        }
      })
    },
    async submitData() {
      const response = await axios.put(`${defaults.baseURL}/validasi/${this.id}`, {
        userEmail: this.auth.name,
        catatan: this.verifyNote,
        status: this.verifyStatus,
      });
      this.closeModal();
      if (response.status === 200) {
        Swal.fire('Data berhasil disimpan!', '', 'success')
        this.$router.push("/content/pelaporan-kondisi/list")
      } else {
        Swal.fire('Data gagal disimpan!', '', 'error')
      }
    },
    formatDate(date) {
      return moment.unix(date).format("DD/MM/YYYY");
    },
    async getHistory() {
      const { data } = await axios.get(`${defaults.baseURL}/validasi/${this.id}`);
      this.histories = data.validitas.sort((a, b) => b.waktu - a.waktu);
      this.company = data.company.compName;
    },
  },
  mounted() {
    this.getHistory();
  },
}
</script>

<style scoped lang="scss">
.mdl-title {
  font-size: 18px;
  font-weight: 600;
  color: #6C757D;
  width: 100%;
}
.mdl-btn-wrap {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: 10px 0;
}
.mdl-btn {
  border-radius: 4px;
  padding: 6px 12px;
  border: transparent;
  color: #ffffff;
  width: 50%;
  margin-right: 0;
}
.mdl-btn:focus {
  outline: none;
}
.mdl-btn-accept {
  background-color: #3D9973;
}
.mdl-btn-reject {
  background-color: #EB5757;
}
.table td {
  white-space: normal;
  text-align: justify;
}
</style>
