<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot-scope="props" slot="links">
        <hr class="sidebar-separator" />
        <sidebar-item
          :link="{
            name: name,
            icon: 'ni ni-circle-08 text-primary'
          }"
        >
          <!-- <sidebar-item
            v-if="isComp"
            :link="{ name: 'Informasi', path: '/informasi' }"
          ></sidebar-item> -->
          <sidebar-item
            :link="{ name: 'Logout', path: '/logout' }"
          ></sidebar-item>
        </sidebar-item>

        <hr class="sidebar-separator" />

        <sidebar-item
          :link="{
            name: 'Pengumuman',
            icon: 'ni ni-notification-70 text-primary',
            path: '/content/pengumuman/list'
          }"
        ></sidebar-item>

        <sidebar-item
          :link="{
            name: 'Beranda',
            icon: 'ni ni-square-pin text-primary',
            path: '/content/projectsites'
          }"
        ></sidebar-item>
        <sidebar-item
          v-if="isComp"
          :link="{
            name: 'Profil Perusahaan',
            icon: 'fas fa-building text-primary',
            path: '/content/profil-perusahaan'
          }"
        />
        <sidebar-item
          v-if="!isComp"
          :link="{
            name: 'Dashboard',
            icon: 'fas fa-th-large text-primary',
            path: '/content/dashboard-admin'
          }"
        />

        <!-- <sidebar-item
          :link="{
            name: 'Data Sparing',
            icon: 'ni ni-chart-bar-32 text-primary',
            path: '/content/dashboard'
          }"
        ></sidebar-item> -->

        <sidebar-item
          :link="{
            name: 'Data Sparing',
            icon: 'ni ni-chart-bar-32 text-primary',
            path: '/content/dashboard-new'
          }"
        ></sidebar-item>

        <sidebar-item
          :link="{ name: 'Laporan', icon: 'ni ni-books text-primary' }"
        >
          <!-- <sidebar-item :link="{ name: 'Data Perjam', path: '/reports/listeddata'}" /> -->
          <sidebar-item
            :link="{ name: 'Data Perjam', path: '/reports/hourly-report' }"
          />
          <sidebar-item
            :link="{ name: 'Data Perhari', path: '/reports/daily-report' }"
          />
          <sidebar-item
            :link="{ name: 'Data Perbulan', path: '/reports/monthly-report' }"
          />
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Status Pengiriman',
            icon: 'ni ni-books text-primary',
            path: '/reports/statusPengiriman'
          }"
        ></sidebar-item>
        <sidebar-item
          v-if="!isComp"
          :link="{
            name: 'Analisa Perbandingan Hasil',
            icon: 'ni ni-atom text-primary',
            path: '/content/analytics'
          }"
        ></sidebar-item>
        <!-- <sidebar-item
          :link="{
            name: 'Berita Acara Verifikasi Lapangan',
            icon: 'ni ni-atom text-primary',
            path: '/content/berita-acara/list',
          }"
        ></sidebar-item> -->
        <sidebar-item
          :link="{
            name: 'Berita Acara Verifikasi Lapangan',
            icon: 'ni ni-atom text-primary',
            path: '/content/list-berita-acara'
          }"
        ></sidebar-item>
        <sidebar-item
          :link="{
            name: 'Laporan Early Warning',
            icon: 'ni ni-bullet-list-67 text-primary'
          }"
        >
          <!-- <sidebar-item
            :link="{
              name: 'Per 2 Menit',
              icon: 'ni ni-bullet-list-67 text-primary',
              path: '/content/errorlogs',
            }"
          ></sidebar-item> -->
          <sidebar-item
            :link="{
              name: 'Per 1 Jam',
              icon: 'ni ni-bullet-list-67 text-primary',
              path: '/content/errorlogshourly'
            }"
          ></sidebar-item>
          <sidebar-item
            :link="{
              name: 'Per 1 Hari',
              icon: 'ni ni-bullet-list-67 text-primary',
              path: '/content/errorlogsday'
            }"
          ></sidebar-item>
          <sidebar-item
            :link="{
              name: 'Per 1 Bulan',
              icon: 'ni ni-bullet-list-67 text-primary',
              path: '/content/error-logs-one-month'
            }"
          />
          <!-- <sidebar-item
            :link="{
              name: 'Per 2 Bulan',
              icon: 'ni ni-bullet-list-67 text-primary',
              path: '/content/error-logs-two-month'
            }"
          /> -->
          <sidebar-item
            :link="{
              name: 'Uji Kalibrasi',
              icon: 'ni ni-bullet-list-67 text-primary',
              path: '/content/uji-kalibrasi'
            }"
          />
        </sidebar-item>
        <sidebar-item
          v-if="isAdmin"
          :link="{
            name: 'Admin',
            icon: 'ni ni-single-02 text-primary'
          }"
        >
          <sidebar-item
            :link="{
              name: 'Pendaftaran Uji Konek',
              path: '/admin/list/ujikonek'
            }"
          ></sidebar-item>
          <!-- <sidebar-item
            :link="{ name: 'List Industri', path: '/admin/list/pendaftar' }"
          ></sidebar-item> -->
          <sidebar-item
            :link="{
              name: 'Validasi Pendaftaran',
              path: '/admin/validasi-pendaftaran'
            }"
          />
          <sidebar-item
            :link="{ name: 'Form COVID-19', path: '/admin/list/pertanggungan' }"
          ></sidebar-item>
          <sidebar-item
            :link="{ name: 'User', path: '/admin/user' }"
          ></sidebar-item>
          <sidebar-item
            :link="{ name: 'Industri', path: '/admin/industri' }"
          ></sidebar-item>
          <sidebar-item
            :link="{
              name: 'Database',
              path: '/admin/datalogger'
            }"
          ></sidebar-item>
          <sidebar-item
            :link="{
              name: 'Publikasi',
              path: '/admin/publikasi'
            }"
          ></sidebar-item>
          <sidebar-item
            :link="{
              name: 'Pertanyaan Umum',
              path: '/admin/faq'
            }"
          ></sidebar-item>
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Isian Laporan Kondisi Tidak Normal',
            icon: 'ni ni-collection text-primary',
            path: '/content/pelaporan-kondisi/list'
          }"
        ></sidebar-item>
        <!-- <sidebar-item
          :link="{
            name: 'Laporan Kondisi Tidak Normal',
            icon: 'ni ni-collection text-primary',
            path: '/content/pelaporan-kondisi-tidak-normal',
          }"
        ></sidebar-item> -->
        <sidebar-item
          :link="{
            name: 'Lap Manual Data Satu Minggu',
            icon: 'ni ni-collection text-primary',
            path: '/content/weekly-manual-report'
          }"
        />

        <button
          id="btn-notification"
          class="
            bg-transparent
            border-0
            shadow-none
            text-nowrap
            overflow-hidden
            d-flex
            justify-content-left
            px-0
            py-3
            mr-2
          "
          @click="$store.commit('tooglePanduan')"
        >
          <i
            class="ni ni-support-16 text-primary"
            style="margin-left: 24px; margin-right: 16px"
          ></i>
          <span style="color: #000000e6; font-size: 14px; font-weight: 500"
            >Panduan Sparing</span
          >
        </button>
        <sidebar-item
          :link="{
            name: 'Bantuan Sparing',
            icon: 'ni ni-collection text-primary',
            path: '/content/bantuan-sparing'
          }"
        />
      </template>
    </side-bar>
    <div class="main-content">
      <div
        v-if="this.$store.state.render.DashboardLayout.notification.popped"
        id="bubble-notification"
        class="position-fixed w-100 vh-100 d-flex align-items-center"
      >
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="card bg-danger">
                <div class="card-header bg-danger">
                  <div class="row align-items-center justify-content-center">
                    <span
                      class="
                        icon
                        bg-white
                        rounded-circle
                        d-flex
                        flex-column
                        align-items-center
                        justify-content-center
                      "
                    >
                      <span
                        class="part-1 bg-danger rounded d-inline-block"
                      ></span>
                      <span
                        class="part-2 bg-danger rounded d-inline-block"
                      ></span>
                    </span>
                    <h1 class="text-default mb-0 ml-4">Recent Error Logs</h1>
                  </div>
                </div>
                <div class="card-body">
                  <div class="rounded overflow-hidden">
                    <el-table :data="errorData" row-key="id">
                      <el-table-column
                        v-if="this.$store.state.auth.level < 3"
                        label="Nama Industri"
                        prop="compName"
                        min-width
                        sortable
                      ></el-table-column>
                      <el-table-column
                        v-if="this.$store.state.auth.level < 3"
                        label="Jenis Industri"
                        prop="compType"
                        min-width
                        sortable
                      ></el-table-column>
                      <el-table-column
                        v-if="this.$store.state.auth.level < 1"
                        label="Provinsi"
                        prop="provName"
                        min-width
                        sortable
                      ></el-table-column>
                      <el-table-column
                        v-if="this.$store.state.auth.level < 2"
                        label="Kab/Kot"
                        prop="kabkotName"
                        min-width
                        sortable
                      ></el-table-column>
                      <el-table-column
                        label="Waktu"
                        prop="timestamp"
                        min-width
                        align="center"
                        sortable
                      >
                        <template v-slot="{ row }">
                          <div class="cell">{{ unixTS2DMY(row.time) }}</div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="Error"
                        prop="errorMsg"
                        min-width
                        align="left"
                        sortable
                      ></el-table-column>
                    </el-table>
                  </div>
                </div>
                <div class="card-footer bg-danger">
                  <div class="row">
                    <div class="col-lg-8"></div>
                    <div class="col-lg-4">
                      <div class="row">
                        <div class="col-6">
                          <base-button
                            @click="goToErrorPage"
                            class="bg-white text-primary border-0 w-100"
                            >Error Logs</base-button
                          >
                        </div>
                        <div class="col-6">
                          <base-button
                            class="bg-primary border-0 w-100"
                            @click="toggleNotificationBubble"
                            >Close</base-button
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <fade-transition :duration="200" origin="center top" mode="out-in">
        <div
          v-if="this.$store.state.render.panduanSparing"
          class="
            notification-container
            position-absolute
            w-100
            vh-100
            d-flex
            align-items-center
          "
        >
          <div class="container">
            <div class="row">
              <div class="col-2"></div>
              <div class="col-8">
                <div class="card shadow-sm border border-primary">
                  <div class="card-header bg-primary">
                    <div class="row align-items-center justify-content-center">
                      <i
                        class="ni ni-support-16 text-default"
                        style="margin-left: 24px; margin-right: 16px"
                      ></i>
                      <h1 class="text-white mb-0 ml-4">Panduan Sparing</h1>
                      <i
                        class="ni ni-support-16 text-default"
                        style="margin-left: 24px; margin-right: 16px"
                      ></i>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="rounded overflow-hidden">
                      <p>
                        Untuk mendownload buku Panduan Sparing silakan klik
                        <a
                          :href="
                            `${defaults.baseURL}/storage/2020-11-09T15:54:48.679ZManual%20SPARING.pdf`
                          "
                          target="_blank"
                          ><b><u>link ini</u></b></a
                        >
                      </p>
                      <p>
                        Tim SPARING Direktorat Pengendalian Pencemaran air JL.DI
                        Panjaitan Kav. 24 Kebon Nanas Jakarta Timur Gedung B
                        lantai 5 Email: sparing.menlhk@gmail.com Fathia Rizki
                        0813 10837646 ( hanya melayani via pesan WA/SMS, jam
                        pelayanan hari kerja 08.00-15.00 WIB)
                      </p>
                    </div>
                  </div>
                  <div class="card-footer">
                    <div class="d-flex flex-row-reverse">
                      <base-button
                        class="bg-primary border-0 w-100 col-3"
                        @click="$store.commit('tooglePanduan')"
                        >Tutup</base-button
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-2"></div>
            </div>
          </div>
        </div>
      </fade-transition>
      <dashboard-navbar :type="$route.meta.navbarType"></dashboard-navbar>

      <div @click="$sidebar.displaySidebar(false)">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-new */
import { Table, TableColumn } from "element-ui";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import defaults from "@/util/defaults";

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

function intRNG(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function now(back) {
  let time = new Date().getTime() / 1000;
  let delta = back * 1800;
  return time - delta;
}

import DashboardNavbar from "./DashboardNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import { FadeTransition } from "vue2-transitions";
import moment from "moment";
import Axios from "axios";

const uniqid = require("uniqid");

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    DashboardContent,
    FadeTransition,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      selects: {
        options: {
          type: [
            {
              label: "Semua",
              value: 0
            },
            {
              label: "Industri Alpha",
              value: 1
            },
            {
              label: "Industri Bravo",
              value: 2
            },
            {
              label: "Industri Charlie",
              value: 3
            },
            {
              label: "Industri Delta",
              value: 4
            }
          ],
          prov: [
            {
              label: "Semua",
              value: 0
            },
            {
              label: "Provinsi Alpha",
              value: 1
            },
            {
              label: "Provinsi Bravo",
              value: 2
            },
            {
              label: "Provinsi Charlie",
              value: 3
            },
            {
              label: "Provinsi Delta",
              value: 4
            }
          ],
          city: [
            {
              label: "Semua",
              value: 0
            },
            {
              label: "Kab/Kot Alpha",
              value: 1
            },
            {
              label: "Kab/Kot Bravo",
              value: 2
            },
            {
              label: "Kab/Kot Charlie",
              value: 3
            },
            {
              label: "Kab/Kot Delta",
              value: 4
            }
          ],
          comp: [
            {
              label: "Semua",
              value: 0
            },
            {
              label: "Alpha",
              value: 1
            },
            {
              label: "Bravo",
              value: 2
            },
            {
              label: "Charlie",
              value: 3
            },
            {
              label: "Delta",
              value: 4
            }
          ],
          emsg: [
            "Data sensor pH melebihi ambang batas!",
            "Data sensor COD melebihi ambang batas!",
            "Data sensor TSS melebihi ambang batas!",
            "Data sensor NH3N melebihi ambang batas!",
            "Data sensor debit melebihi ambang batas!"
          ]
        },
        type: null,
        prov: null,
        city: null,
        comp: null,
        time: null
      },
      selectedRows: [],
      errorData: [],
      name: "",
      interval: null,
      notifColor: "ni ni-bell-55 text-primary",
      auth: JSON.parse(localStorage.getItem("auth-data")),
      defaults
    };
  },
  computed: {
    isComp() {
      if (this.auth.userRole.role === "comp") return true;
      else return false;
    },
    isAdmin() {
      this.$store.commit("setUserData", this.auth);
      this.$store.commit("setAuthLevel", this.auth.userRole.role);
      return this.$store.state.auth.level === 0;
      // if (this.$store.state.auth.level == 0) return true;
      // else return false;
    }
  },
  methods: {
    testFun() {
      console.log("bisa");
    },
    getNotificationClass() {
      Axios.get(`${defaults.baseURL}/error/notif/${this.auth._id}`)
        .then(res => {
          if (res.data.notif === true)
            return (this.notifColor = "ni ni-bell-55 text-danger");
          else return (this.notifColor = "ni ni-bell-55 text-primary");
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAuthName() {
      this.name = this.auth.name;
    },
    toggleNotificationBubble() {
      Axios.get(`${defaults.baseURL}/error/list-recent/${this.auth._id}`).then(
        res => {
          this.errorData = res.data;
        }
      );
      this.$store.commit("toggleNotificationBubble");
    },
    goToErrorPage() {
      this.toggleNotificationBubble();
      this.$router.push("/content/errorlogs");
    },
    generateData(type, prov, city, comp) {
      this.errorData = [];
      const length = 10;
      let array = [];
      let mtype = 0;
      let mprov = 0;
      let mcity = 0;
      let mcomp = 0;
      let itype = 0;
      let iprov = 0;
      let icity = 0;
      let icomp = 0;
      if (type != null) mtype = type;
      if (prov != null) mprov = prov;
      if (city != null) mcity = city;
      if (comp != null) mcomp = comp;
      for (let i = 0; i < length; i++) {
        array.push({
          id: uniqid(),
          time: now(i),
          type: this.selects.options.type[mtype === 0 ? intRNG(1, 4) : mtype]
            .label,
          prov: this.selects.options.prov[mprov === 0 ? intRNG(1, 4) : mprov]
            .label,
          city: this.selects.options.city[mcity === 0 ? intRNG(1, 4) : mcity]
            .label,
          comp: this.selects.options.comp[mcomp === 0 ? intRNG(1, 4) : mcomp]
            .label,
          emsg: this.selects.options.emsg[intRNG(0, 4)]
        });
      }
      this.errorData = array;
    },
    unixTS2DMY(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY, hh:mm");
    },
    getLogout() {},
    initScrollbar() {
      let isWindows = navigator.platform.startsWith("Win");
      if (isWindows) {
        initScrollbar("sidenav");
      }
    }
  },
  created() {
    this.getAuthName();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  mounted() {
    this.initScrollbar();
  }
};
</script>
<style lang="scss">
.sidebar-separator {
  margin: 0.5rem 1rem;
}
.notification-container {
  top: 0;
  z-index: 10;
  .icon {
    height: 48px;
    width: 48px;
    .part-1 {
      height: 24px;
      width: 10px;
      margin-bottom: 4px;
    }
    .part-2 {
      height: 10px;
      width: 10px;
    }
  }
  .el-table {
    thead {
      tr {
        background-color: #ffffff99;
        th {
          background-color: #ffffff00;
          color: black;
        }
        th.is-right {
          .cell {
            display: flex;
            flex-flow: row;
            justify-content: flex-end;
          }
        }
        th.is-center {
          .cell {
            display: flex;
            flex-flow: row;
            justify-content: center;
          }
        }
      }
    }
    .el-table__body-wrapper {
      height: 36vh;
      overflow: scroll;
    }
    tbody {
      tr {
        background-color: #ffffff66;
        td {
          color: black;
        }
      }
    }
  }
}
</style>

<style>
#btn-notification:focus {
  outline: none;
}
/* width */
#bubble-notification ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/* Track */
#bubble-notification ::-webkit-scrollbar-track {
  background-color: hsla(0, 0%, 100%, 0.6);
  border: 0;
}

/* Handle */
#bubble-notification ::-webkit-scrollbar-thumb {
  background: hsla(0, 0%, 100%, 0.8);
  border-radius: 4px;
}

/* Handle on hover */
#bubble-notification ::-webkit-scrollbar-thumb:hover {
  background: hsla(0, 0%, 100%, 1);
}
</style>
