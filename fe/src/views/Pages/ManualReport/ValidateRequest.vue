<template>
  <Modal
    :show="showValidateModal"
    modalClasses="modal-dialog-scrollable"
    headerClasses="pb-0"
    @close="closeModal"
    size="lg">
    <template v-slot:header>
      <div class="modal-title">
        <p class="mdl-title">Validasi Laporan Manual Data Satu Minggu</p>
      </div>
    </template>
    <div class="px-4 border-top pt-4">
      <div class="form-group row">
        <p class="pl-3 col-form-label form-control-label">{{ data.compName }}</p>
        <div class="col-lg-12">
          <html-editor v-model="verifyNote"></html-editor>
        </div>
      </div>
      <div class="mdl-btn-wrap">
        <button class="mdl-btn mdl-btn-reject" @click="reject">Tolak</button>
        <button class="mdl-btn mdl-btn-accept" @click="accept">Setujui</button>
      </div>
      <ValidationManualReport :data="histories" />
      <div class="form-group row mt-4">
        <div class="col-lg-12">
          <div class="float-right">
            <button class="btn btn-primary" @click="closeModal">Tutup</button>
          </div>
        </div>
      </div>
    </div>

  </Modal>
</template>

  <script>
  import axios from "axios";
  import moment from "moment";
  import defaults from "@/util/defaults";
  import Swal from "sweetalert2";
  import Modal from "@/components/Modal.vue";
  import HtmlEditor from "@/components/Inputs/HtmlEditor";
  import ValidationManualReport from "./ValidationManualReport.vue";
  
  export default {
    components: {
      Modal,
      HtmlEditor,
      ValidationManualReport,
    },
    props: {
      showValidateModal: {
        type: Boolean,
        required: true,
      },
      data: {
        type: Array,
        required: true,
      }
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
        this.$emit("close");
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
        const response = await axios.post(`${defaults.baseURL}/laporanMingguan/validasi`, {
          petugas: this.auth.name,
          keterangan: this.verifyNote,
          status: this.verifyStatus,
          formId: this.data.id,
        });
        this.closeModal();
        if (response.status === 200) {
          Swal.fire('Data berhasil disimpan!', '', 'success')
          this.getTableData();
        } else {
          Swal.fire('Data gagal disimpan!', '', 'error')
        }
      },
      formatDate(date) {
        return moment(date).format("DD/MM/YYYY");
      },
      async getHistory() {
        const { data } = await axios.get(`${defaults.baseURL}/laporanMingguan/getvalidasi?formID=${this.data.id}`);
        this.histories = data //.sort((a, b) => b.waktu - a.waktu);
        console.log(data)
        // this.company = data.company.compName;
      },
    },
    mounted() {
      this.getHistory();
    },
  }
  </script>
  
  <style scoped>
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
  </style>