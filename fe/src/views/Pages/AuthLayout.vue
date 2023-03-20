<template>
  <div style="overflow: hidden">
    <div class="marquee">
      <p>{{ announcement }}</p>
    </div>
    <div
      class="cover"
      :style="{ backgroundImage: `url('img/theme/img-background-home.png')` }"
    ></div>
    <notifications></notifications>
    <base-nav
      v-model="showMenu"
      type="light"
      :transparent="true"
      menu-classes="justify-content-start"
      class="navbar-horizontal navbar-main"
      expand="lg"
    >
      <div slot="brand" class="navbar-wrapper d-flex align-items-center mt-4">
        <router-link class="navbar-brand" to="/">
          <img src="img/brand/img-logo-color.png" />
        </router-link>
        <h3 class="d-md-flex d-none flex-column text-white m-0">
          <span>Kementerian</span>
          <span>Lingkungan Hidup dan Kehutanan</span>
          <span>Republik Indonesia</span>
        </h3>
      </div>

      <template>
        <div class="navbar-collapse-header">
          <div class="row">
            <div class="col-6 collapse-brand">
              <router-link to="/">
                <img src="img/brand/img-logo-color.png" />
              </router-link>
            </div>
            <div class="col-6 collapse-close">
              <button
                type="button"
                class="navbar-toggler"
                @click="showMenu = false"
              >
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>

        <ul class="navbar-nav col-11 mr-14" style="justify-content: flex-end">
          <li class="nav-item">
            <router-link to="/entry/ujikonek" class="nav-link">
              <span class="nav-link-inner--text">Pendaftaran Uji Konektivitas</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/entry/sparing" class="nav-link">
              <span class="nav-link-inner--text">Pendaftaran Sparing</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/entry/covid-19" class="nav-link">
              <span class="nav-link-inner--text"
                >Pelaporan Terkendala Pandemi Covid-19</span
              >
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/peraturan" class="nav-link">
              <span class="nav-link-inner--text">Publikasi</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/faq" class="nav-link">
              <span class="nav-link-inner--text">Pertanyaan Umum</span>
            </router-link>
          </li>
        </ul>
        <hr class="d-lg-none" />
        <ul class="navbar-nav align-items-lg-center">
          <li>
            <router-link :to="'/login'" class="nav-link">
              <base-button size="md" type="primary">Masuk</base-button>
              <!-- <router-link
              :to="'this.$store.state.render.AuthLayout.menuButton.path'"
              class="nav-link"
            > -->
              <!-- <base-button size="md" type="primary">{{
                this.$store.state.render.AuthLayout.menuButton.name
              }}</base-button> -->
            </router-link>
          </li>
        </ul>
      </template>
    </base-nav>

    <div class="main-content">
      <zoom-center-transition :duration="pageTransitionDuration" mode="out-in">
        <router-view></router-view>
      </zoom-center-transition>
    </div>
    <div class="row justify-content-center">
      <h4
        class="
          d-flex
          flex-column
          justify-content-center
          text-center text-primary text-footers
        "
      >
        <span>Direktorat Pengendalian Pencemaran Air</span>
        <span
          >Direktorat Jenderal Pengendalian Penemaran dan Kerusakan
          Lingkungan</span
        >
        <span>Kementerian Lingkungan Hidup dan Kehutanan</span>
        <span class="d-md-block d-none"
          >&copy; copyright 2019 - {{ new Date().getFullYear() }}. Hak cipta dilindungi Undang - Undang</span
        >
        <span class="d-md-none">&copy; copyright 2019 - {{ new Date().getFullYear() }}</span>
        <span class="d-md-none">Hak cipta dilindungi Undang - Undang</span>
      </h4>
    </div>
    <!-- <div class="row justify-content-center">
      <h4
        class="d-flex flex-column justify-content-center position-absolute text-center text-primary"
        style="bottom: 0"
      >
        <span>Direktorat Pengendalian Pencemaran Air</span>
        <span
          >Direktorat Jenderal Pengendalian Penemaran dan Kerusakan
          Lingkungan</span
        >
        <span>Kementerian Lingkungan Hidup dan Kehutanan</span>
        <span class="d-md-block d-none"
          >© copyright 2019 - 2021. Hak cipta dilindungi Undang - Undang</span
        >
        <span class="d-md-none">© copyright 2019 - 2021</span>
        <span class="d-md-none">Hak cipta dilindungi Undang - Undang</span>
      </h4>
    </div> -->
    <!-- sampe sni -->

    <!-- <footer class="py-5" id="footer-main">
      <div class="container">
        <div class="row align-items-center justify-content-xl-between">
          <div class="col-xl-6">
            <div class="copyright text-center text-xl-left text-muted">
              © {{year}}
              <a
                href="https://www.creative-tim.com"
                class="font-weight-bold ml-1 text-white"
                target="_blank"
              >IPC</a>
            </div>
          </div>
        </div>
      </div>
    </footer>-->
  </div>
</template>
<script>
import axios from "axios";
import defaults from "@/util/defaults";
import { BaseNav } from "@/components";
import { ZoomCenterTransition } from "vue2-transitions";

export default {
  components: {
    BaseNav,
    ZoomCenterTransition,
  },
  props: {
    backgroundColor: {
      type: String,
      default: "black",
    },
  },
  data() {
    return {
      showMenu: false,
      menuTransitionDuration: 250,
      pageTransitionDuration: 200,
      year: new Date().getFullYear(),
      pageClass: "login-page",
      announcement: "Pengumuman",
    };
  },
  computed: {
    title() {
      return `${this.$route.name} Page`;
    },
  },
  methods: {
    toggleNavbar() {
      document.body.classList.toggle("nav-open");
      this.showMenu = !this.showMenu;
    },
    closeMenu() {
      document.body.classList.remove("nav-open");
      this.showMenu = false;
    },
    setBackgroundColor() {
      document.body.classList.add("bg-default");
    },
    removeBackgroundColor() {
      document.body.classList.remove("bg-default");
    },
    updateBackground() {
      if (!this.$route.meta.noBodyBackground) {
        this.setBackgroundColor();
      } else {
        this.removeBackgroundColor();
      }
    },
    async getAnnouncement() {
      const { data } = await axios.get(`${defaults.baseURL}/ann`);
      data.sort((a, b) => b.datePengumuman - a.datePengumuman);
      const sort = data[0].isiPengumuman;
      const clearString = sort.replace(/<[^>]*>?/gm, " ");
      const replaceSpace = clearString.replace(/&nbsp;/g, " ");
      this.announcement = replaceSpace;
    },
  },
  mounted() {
    this.getAnnouncement();
  },
  beforeDestroy() {
    this.removeBackgroundColor();
  },
  beforeRouteUpdate(to, from, next) {
    // Close the mobile menu first then transition to next page
    if (this.showMenu) {
      this.closeMenu();
      setTimeout(() => {
        next();
      }, this.menuTransitionDuration);
    } else {
      next();
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function () {
        this.updateBackground();
      },
    },
  },
};
</script>
<style lang="scss">
$scaleSize: 0.8;
@keyframes zoomIn8 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  100% {
    opacity: 1;
  }
}

.main-content .zoomIn {
  animation-name: zoomIn8;
}

@keyframes zoomOut8 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.main-content .zoomOut {
  animation-name: zoomOut8;
}
</style>

<style lang="scss" scoped>
.cover {
  height: 100vh;
  min-height: 500px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  width: 100%;
  z-index: -1;
}
</style>

<style scoped>
.text-footers {
  /* position: fixed;
  bottom: 0;
  left: 0;
  right: 0; */
  margin-bottom: 50px;
}
.marquee {
	background-color: #FFC107;
	color: #000000;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
}
.marquee p {
  font-size: 14px;
  font-weight: 700;
  height: 10px;
  padding-left: 100%;
  animation: marquee 70s linear infinite;
}
@keyframes marquee {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(-100%, 0); }
}
</style>
