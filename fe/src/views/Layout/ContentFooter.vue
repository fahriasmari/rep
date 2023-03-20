<template>
  <footer class="footer px-4 mx-2">
    <div class="row align-items-center justify-content-lg-between">
      <div class="col-lg-6">
        <div class="copyright text-center text-lg-left text-muted">
          &copy; {{ year }}
          <a
            href="https://www.creative-tim.com"
            class="font-weight-bold ml-1"
            target="_blank"
            >Kementerian Lingkungan Hidup dan Kehutanan</a
          >
        </div>
      </div>
      <div class="col-lg-6">
        <ul
          class="nav nav-footer justify-content-center justify-content-lg-end"
        >
          <li class="nav-item">
            <router-link to="/entry/sparing" class="nav-link py-0">
              <span class="nav-link-inner--text">Pendaftaran</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/entry/covid-19" class="nav-link py-0">
              <span class="nav-link-inner--text text-nowrap"
                >Pelaporan Terkendala Pandemi Covid-19</span
              >
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/peraturan" class="nav-link py-0">
              <span class="nav-link-inner--text">Publikasi</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/faq" class="nav-link py-0">
              <span class="nav-link-inner--text">Pertanyaan Umum</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      year: "",
      // year: new Date().getFullYear(),
    };
  },
  created() {
    this.update_yaers();
  },
  methods: {
    update_yaers() {
      this.year = moment().format("y");
    },
  },
};
</script>
<style></style>
