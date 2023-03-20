<template>
<div class="container pt-8 mb-4">
  <div class="row">
    <div class="col-12">
      <div class="card bg-white border-0 d-flex flex-row justify-content-between align-items-center p-4">
        <div class="text-uppercase font-weight-bold text-dark">pendaftaran uji Konektifitas untuk industri</div>
        <div class="">
          <base-button class="bg-primary w-100 d-flex flex-row align-items-center" @click="downloadSOP">
            <i class="ni ni-cloud-download-95 mr-2"></i>
            Unduh Dokumen SOP
          </base-button>
        </div>
      </div>
    </div>
  </div>
  <CheckStatus v-if="showButtonCard" />
  <div v-if="showButtonCard" class="card bg-white border-0">
    <div class="row justify-content-between p-4">
      <div class="col-4">
        <base-button class="bg-secondary w-100" @click="onShowExtendCard">Perpanjangan</base-button>
      </div>
      <div class="col-4">
        <base-button class="bg-secondary w-100" @click="onShowChangeCard">Perubahan Data</base-button>
      </div>
      <div class="col-4">
        <base-button class="bg-primary w-100" @click="onShowRegisterCard">Pendaftaran Baru</base-button>
      </div>
    </div>
  </div>
  <div v-if="!showButtonCard" class="card bg-white border-0">
    <div class="p-4">
      <div class="form-group row mb-0">
        <div class="col-12">
          <div class="col-2 float-right">
            <base-button class="w-100" size="md" type="primary" @click="back">
              Kembali
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <RegisterForm v-if="showRegisterCard" />
  <div v-if="showIdCheck" class="card bg-white border-0">
    <div class="p-4">
      <div class="form-group row">
        <label class="col-lg-2 col-form-label form-control-label">ID Pendaftaran Uji</label>
        <div class="col-8">
          <base-input
            name="ID Pendaftaran Uji"
            v-model="testingId"></base-input>
          <small v-if="emptyID" class="d-block mt--3 text-justify text-danger">ID tidak boleh kosong</small>
          <small class="d-block mt-4 text-justify">
            Untuk melakukan perubahan data atau perpanjangan, silakan isi field di atas
            dengan ID yang anda dapatkan setelah proses pendaftaran uji kenektifitas,
            atau hubungi ADMIN untuk mendapatkan ID Pendfataran Uji Konektifitas anda.
          </small>
          <h3 class="d-block mt-4 text-danger" v-html="extendMessage"></h3>
        </div>
        <div class="col-2">
          <base-button class="w-100" size="md" type="primary" @click="getData">
            Cari
          </base-button>
        </div>
      </div>
    </div>
  </div>
  <RegisterForm v-if="showExtendCard" :data="companyData" :id="data._id" />
  <RegisterForm v-if="showChangeCard" :data="companyData" :id="data._id" />
</div>
</template>

<script>
import { BaseInput } from "@/components";
import RegisterForm from "./RegisterForm.vue";
import CheckStatus from "./CheckStatus.vue";
import axios from "axios";
import defaults from "@/util/defaults";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

export default {
  components: {
    BaseInput,
    RegisterForm,
    CheckStatus,
  },
  data() {
    return {
      showRegisterCard: false,
      showExtendCard: false,
      showChangeCard: false,
      showButtonCard: true,
      showIdCheck: false,
      showForm: null,
      testingId: null,
      emptyID: false,
      extendMessage: "",
      data: {},
      companyData: {},
      loading: false,
    }
  },
  methods: {
    onShowRegisterCard() {
      this.showRegisterCard = true;
      this.showButtonCard = false;
    },
    onShowExtendCard() {
      this.showIdCheck = true;
      this.showButtonCard = false;
      this.showForm = "extend";
      this.showChangeCard = false;
    },
    onShowChangeCard() {
      this.showIdCheck = true;
      this.showButtonCard = false;
      this.showExtendCard = false
      this.showForm = null;
    },
    downloadSOP() {
      window.open(`${defaults.baseURL}/storage/SOP-Uji-Konektifitas-KLHK-SPARING-2021.pdf`); // TODO: change to real url
    },
    back() {
      this.showButtonCard = true;
      this.showIdCheck = false;
      this.showRegisterCard = false;
      this.showExtendCard = false;
      this.showChangeCard = false;
      this.showForm = null;
      this.extendMessage = "";
      this.testingId = null;
    },
    async getData() {
      if (this.testingId) {
        this.loading = this.$loading.show({ loader: "dots" });
        const { data } = await axios.get(`${defaults.baseURL}/api/v1/ujikonek/list/${this.testingId}`);
        this.data = data;
        this.companyData = data.data;
        const status = this.data.validitas[data.validitas.length - 1].status;
        this.loading.hide();
        if (this.showForm === "extend") {
          if (status !== "accepted") {
              this.extendMessage = `Anda tidak dapat melakukan perpanjangan uji konektifitas<br />Pendaftaran Uji Konektifitas belum di setujui.`;
              this.showExtendCard = false
          } else {
            this.showExtendCard = true;
          }
        } else {
          this.showChangeCard = true;
        }
      } else {
        this.emptyID = true;
      }
    },
  },
}
</script>