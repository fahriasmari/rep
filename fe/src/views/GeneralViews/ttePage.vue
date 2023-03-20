<template>
  <div>
    <div
      class="cover"
      :style="{ backgroundImage: `url('img/theme/img-background-full.png')` }"
    ></div>
    <!-- Header -->

    <!-- Page content -->

    <div
      class="
        container
        vh-100
        d-flex
        flex-column
        align-items-center
        justify-content-center
      "
    >
      <div v-if="halo" id="printBos" class="card bg-white border-0">
        <div class="card-header px-4">Tanda Terima Elektronik</div>
        <div
          class="
            card-body
            d-flex
            flex-column
            align-items-center
            justify-content-center
            p-4
          "
        >
          <router-link class="mb-4" to="/">
            <img src="img/brand/img-logo-color.png" />
          </router-link>
          <h2>KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN</h2>
          <div class="card bg-white border-0 w-50 m-5 shadow-none">
            <div class="row">
              <div class="col-6">
                <h5>Nama Perusahaan</h5>
              </div>
              <div class="col-6">
                <h5>{{ data.compName }}</h5>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <h5>Nomor Pendaftaran</h5>
              </div>
              <div class="col-6">
                <h5>{{ data.regNo }}</h5>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <h5>Alamat</h5>
              </div>
              <div class="col-6">
                <h5>{{ data.compAddress }}</h5>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <h5>Username</h5>
              </div>
              <div class="col-6">
                <h5>{{ data.userName }}</h5>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <h5>Password</h5>
              </div>
              <div class="col-6">
                <h5>{{ data.userPassword }}</h5>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <h5>UID Logger</h5>
              </div>
              <div class="col-6">
                <h5>{{ data.uid }}</h5>
              </div>
            </div>
          </div>
          <p>
            Dokumen ini sah, diterbitkan secara elektronik melalui SPARING
            Kementerian Lingkungan Hidup dan Kehutanan sehingga tidak memerlukan
            cap dan tanda tangan basah. Terima kasih telah melaksanakan
            pendaftaran SPARING DIREKTORAT PENGENDALIAN PENCEMARAN AIR
            KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN
          </p>
        </div>
      </div>
      <div v-if="!halo" class="card bg-white border-0">
        <div class="card-header px-4">Tanda Terima Elektronik</div>
        <div
          class="
            card-body
            d-flex
            flex-column
            align-items-center
            justify-content-center
            p-4
          "
        >
          <router-link class="mb-4" to="/">
            <img src="img/brand/img-logo-color.png" />
          </router-link>
          <h1>KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN</h1>
          <div class="card bg-white border-0 w-50 m-5 shadow-none">
            <base-input
              v-model="noReg"
              placeholder="Masukkan Nomor Pendaftaran"
            />
            <base-button
              class="w-100"
              size="md"
              type="primary"
              @click="cekHandler"
              >Cek Pendaftaran</base-button
            >
          </div>
        </div>
      </div>
      <div v-if="halo" class="row justify-content-around">
        <base-button class="col" type="danger" @click="toListPendaftaran()"
          >Kembali</base-button
        >
        <base-button class="w-50" size="md" type="primary" @click="print"
          >Download</base-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { BaseInput } from "@/components";
import Axios from "axios";
import html2pdf from "html2pdf.js";
import defaults from "@/util/defaults";

export default {
  components: {
    BaseInput,
  },
  data() {
    return {
      halo: false,
      data: {},
      noReg: null,
    };
  },
  methods: {
    toListPendaftaran() {
      this.$router.push("/admin/list/pendaftar");
    },
    cekHandler() {
      Axios.get(`${defaults.baseURL}/user/cekRegis/${this.noReg}`).then(
        (res) => {
          this.data = res.data;
          this.halo = true;
        }
      );
    },
    print() {
      var element = document.getElementById("printBos");
      var opt = {
        margin: 0.5,
        filename: "myfile.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
      };

      // New Promise-based usage:
      html2pdf().set(opt).from(element).save();
    },
  },
  created() {
    if (this.$store.state.tte !== null) {
      this.noReg = this.$store.state.tte;
      this.cekHandler();
    }
  },
};
</script>

<style lang="scss" scoped>
.cover {
  height: 100vh;
  min-height: 500px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  width: 100%;
  z-index: -1;
}
</style>
