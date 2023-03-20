<template>
  <div>
    <div class="popup-logo" v-if="isNotification">
      <div class="container bg-logonotif">
        <div class="btn-closes">
          <button @click="closeNotification()"> X </button>
        </div>
        <div
          class="row align-items-center justify-content-center"
          style="margin-top: 100px"
        >
          <img
            class="d-lg-block d-none w-64"
            src="img/theme/img-content-home.png"
            alt="Content Image"
            style="margin-left: 90px"
          />
          <!-- <img
          class="d-lg-none w-65"
          src="img/theme/img-content-home.png"
          alt="Content Image"
        /> -->
        </div>
      </div>
    </div>
    <div class="">
      <div class="row align-items-center justify-content-center">
        <!-- <img
          class="d-lg-block d-none w-75"
          src="img/theme/img-content-home.png"
          alt="Content Image"
        />
        <img
          class="d-lg-none w-100"
          src="img/theme/img-content-home.png"
          alt="Content Image"
        /> -->
        <div class="col-12" style="margin-top: 100px">
          <div class="card">
            <div id="map-custom" class="map-canvas"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="infografis">
      <div class="legend">
        <div class="form-group pr-4">
          <select class="form-control" v-model="showInfografi">
            <option v-for="infografis in infografiOptions" :key="infografis.key" :value="infografis.key">
              {{ infografis.name }}
            </option>
          </select>
        </div>
        <div>
          <template v-if="showInfografi === 1">
          <div v-for="industri in TPColors" :key="`TPColors${industri.id}`" class="legend-content">
            <div class="legend-color" :style="{ 'background-color': industri.color }"></div>
            <div class="legend-desc">{{ industri.name }}</div>
          </div>
          </template>
          <template v-if="showInfografi === 2">
          <div v-for="industri in BIColors" :key="`BIColors${industri.id}`" class="legend-content">
            <div class="legend-color" :style="{ 'background-color': industri.color }"></div>
            <div class="legend-desc">{{ industri.value }}</div>
          </div>
          </template>
        </div>
      </div>
      <template v-if="!isChartLoading">
        <div v-show="showInfografi === 1" class="chart">
            <BasePieChart :title="['Jumlah Perusahaan', 'Pendaftaran']" :data="chartData.terdaftar" />
            <BasePieChart :title="['Jumlah Perusahaan', 'Terkoneksi']" :data="chartData.terkoneksi" />
            <BasePieChart :title="['Jumlah Perusahaan', 'Pelaporan Progress']" :data="chartData.melapor" />
            <BasePieChart :title="['Jumlah Perusahaan Belum', 'Melaporkan Progress']" :data="chartData.belumMelapor" />
        </div>
        <div v-show="showInfografi === 2" class="chart">
            <BasePieChart :title="['Industri', 'Rayon']" :data="chartData.rayon" />
            <BasePieChart :title="['Industri Pulp', '&/atau Paper']" :data="chartData.pulpPaper" />
            <BasePieChart :title="['Industri Petrokimia', 'Hulu']" :data="chartData.petrokimia" />
            <BasePieChart :title="['Industri Oleokimia', 'Dasar']" :data="chartData.oleokimia" />
            <BasePieChart :title="['Industri Minyak', 'Sawit']" :data="chartData.minyakSawit" />
            <BasePieChart :title="['Pengolahan', 'Minyak Bumi']" :data="chartData.minyakBumi" />
            <BasePieChart :title="['Eksplorasi dan', 'Produksi Migas']" :data="chartData.migas" />
            <BasePieChart :title="['Pertambangan', 'Emas dan Tembaga']" :data="chartData.emasTembaga" />
            <BasePieChart :title="['Pertambangan', 'Batu Bara']" :data="chartData.batuBara" />
            <BasePieChart :title="['Industri', 'Tekstil']" :data="chartData.tekstil" />
            <BasePieChart :title="['Pertambangan', 'Nikel']" :data="chartData.nikel" />
            <BasePieChart :title="['Kawasan', 'Industri']" :data="chartData.industri" />
        </div>
      </template>
    </div>
    <Modal
      :show="showAnnoncementModal"
      modalContentClasses="announcement-modal-background"
      modalClasses="modal-dialog-scrollable"
      @close="showAnnoncementModal = false"
      size="xl">
    <template v-slot:header>
      <div class="mdl-header">
        <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        <p>Pengumuman</p>
      </div>
    </template>
    <div>
      <div id="announcement" class="rounded overflow-hidden mdl-content">
        <el-table
          :data="annoncementData"
          :header-cell-style="{ backgroundColor: '#feeedf', textAlign: 'center', padding: '6px 20px' }"
          :row-style="{ background: 'rgba(255, 255, 255, 0.4)', overvlow: 'auto' }"
          :cell-style="{ padding: '10px 20px', overvlow: 'auto' }"
          row-key="id"
          :default-sort="{ prop: 'tanggal', order: 'descending' }">
          <el-table-column label="Tanggal" prop="datePengumuman" width="150" sortable>
            <template v-slot="{ row }">
              <span class="font-weight-bold" style="font-size: 16px">{{ unixTS2DMY(row.datePengumuman) }}</span>
              <div class="mt-4 mb-2">
                <a
                  v-if="row.filePengumuman.path"
                  :href="`${baseURL}${row.filePengumuman.path}`"
                  target="_blank"
                  class="rounded bg-primary p-2 text-white">
                  Lampiran
                </a>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Pengumuman">
            <template v-slot="{ row }">
              <div v-html="row.isiPengumuman"></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mt-4">
      <div class="row">
        <div class="col text-right">
          <base-button
            class="bg-primary border-0"
            @click="showAnnoncementModal = false">
              Tutup
            </base-button>
        </div>
      </div>
    </div>
    </Modal>
  </div>
</template>
<script>
import { Tooltip } from "element-ui";
import { Table, TableColumn, Select, Option } from "element-ui";
import axios from "axios";
import moment from "moment";
import { API_KEY } from "@/views/Maps/API_KEY";
import GoogleMapsLoader from "google-maps";
import { jenisIndustri } from "@/data/jenis-industri";
import { tahapanProgressColors as TPColors, byIndustryColors as BIColors } from "@/data/infografis-colors";
import ApexChart from 'vue-apexcharts';
import defaults from "@/util/defaults";
import BasePieChart from "@/components/Charts/BasePieChart.vue";
import Modal from "@/components/Modal.vue";
import BaseTable from "@/components/BaseTable.vue";
GoogleMapsLoader.KEY = API_KEY;

export default {
  name: "home-page",
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    ApexChart,
    BasePieChart,
    Modal,
    BaseTable,
  },
  data() {
    return {
      mapData: {},
      isNotification: true,
      showInfografi: 1,
      showProvince: null,
      showCity: null,
      infografiOptions: [],
      jenisIndustri: jenisIndustri,
      TPColors,
      BIColors,
      chartOptions: {},
      chartData: {},
      isChartLoading: true,
      showAnnoncementModal: true,
      annoncementData: [],
      provinces: [],
      cities: [],
      region: [],
      baseURL: defaults.baseURL,
    };
  },
  created() {
    // const authData = JSON.parse(localStorage.getItem("auth-data"));
    const authData = { _id: "5f340d5e328182315c11ee98" };
    axios
      .get(`${defaults.baseURL}/pj/map/${authData._id}`, {
        headers: { token: this.$store.state.token },
      })
      .then((res) => {
        // console.log(res.data);
        this.mapData = res.data;

        GoogleMapsLoader.load((google) => {
          this.initMap(google, this.mapData.centerLoc);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    this.getAnnoncement();
    this.getProvince();
    this.getChartData();
  },
  beforeMount() {
    this.$store.commit("setAuthLayoutButton", {
      name: "Masuk",
      path: "/login",
    });
  },
  methods: {
    closeNotification() {
      this.isNotification = false;
    },
    goToLogin() {
      return this.$router.push("/login");
    },
    CenterControl(controlDiv, map, state) {
      // Set CSS for the control border.
      var controlUI = document.createElement("div");
      controlUI.style.backgroundColor = "#dd2c00";
      controlUI.style.borderRadius = "3px";
      controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
      controlUI.style.cursor = "pointer";
      controlUI.style.margin = "10px";
      controlUI.style.textAlign = "center";
      controlUI.title = "Click to recenter the map";
      controlDiv.appendChild(controlUI);

      // Set CSS for the control interior.
      var controlText = document.createElement("div");
      controlText.style.color = "#fff";
      controlText.style.fontFamily = "Roboto,Arial,sans-serif";
      controlText.style.fontSize = "16px";
      controlText.style.lineHeight = "40px";
      controlText.style.paddingLeft = "16px";
      controlText.style.paddingRight = "16px";
      controlText.textContent = "Reset Map";
      controlUI.appendChild(controlText);

      // Setup the click event listeners: simply set the map to Chicago.
      controlUI.addEventListener("click", function () {
        state.resetMap();
        // map.setCenter(chicago);
      });
    },
    resetMap() {
      this.initMap(google, this.mapData.centerLoc);
    },
    initMap(google, centerMap) {
      let map,
        lat = centerMap.lat,
        lng = centerMap.lng,
        color = "#5e72e4";
      map = document.getElementById("map-custom");

      let centerLoc = new google.maps.LatLng(lat, lng);
      let mapOptions = {
        zoom: this.mapData.zoom,
        center: centerLoc,
        gestureHandling: "greedy",
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
      };

      map = new google.maps.Map(map, mapOptions);
      let blueIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      let redIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
      let orangeIcon =
        "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
      let greenIcon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";

      var InfoWindows = new google.maps.InfoWindow({});
      //NEW LOGGER MAP
      let markerComp = this.mapData.comp;
      let compMarker = [];
      for (let k = 0; k < markerComp.length; k++) {
        let posComp = new google.maps.LatLng(
          markerComp[k].latlong.lat,
          markerComp[k].latlong.lng
        );
        if (markerComp[k].activationLogger != "Terkoneksi") {
          compMarker[k] = new google.maps.Marker({
            icon: { url: redIcon },
            position: posComp,
            map: map,
            // animation: google.maps.Animation.DROP,
            compID: markerComp[k]._id,
            title: markerComp[k].compName,
          });
        } else {
          compMarker[k] = new google.maps.Marker({
            icon: { url: greenIcon },
            position: posComp,
            map: map,
            // animation: google.maps.Animation.DROP,
            compID: markerComp[k]._id,
            title: markerComp[k].compName,
          });
        }

        // hover content and title setting
        compMarker[k].addListener("click", function () {
          InfoWindows.open(map, this);
          InfoWindows.setContent(
            `<div id="content"><div id="siteNotice"></div><h3 id="firstHeading" class="firstHeading">${markerComp[k].compName}</h3><div id="bodyContent"><p><b>Alamat : </b> ${markerComp[k].compAddress}</p> <p>${markerComp[k].kabkotName} - ${markerComp[k].provName}</p><p><b>Status : </b>${markerComp[k].activationLogger}</p><p><b>Parameter : </b>${markerComp[k].parameterLogger}</p></div></div>`
          );
        });
        // end hover content and title setting

        compMarker[k].addListener("click", () => {
          // console.log(compMarker[k].compID);
          this.insertParamClickMarker(compMarker[k].compID, "comp");
        });
      }

      // CREATE PROV MARKER
      // var centerControlDiv = document.createElement("div");
      // var centerControl = new this.CenterControl(centerControlDiv, map, this);

      // centerControlDiv.index = 1;
      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);

      // var provMarker = [];
      // var kabkotMarker = [];
      // var compMarker = [];

      // if (this.mapData.prov.length > 0) {
      //   for (let i = 0; i < this.mapData.prov.length; i++) {
      //     let pos = new google.maps.LatLng(
      //       this.mapData.prov[i].latlong.lat,
      //       this.mapData.prov[i].latlong.lng
      //     );
      //     provMarker[i] = new google.maps.Marker({
      //       icon: { url: orangeIcon },
      //       position: pos,
      //       map: map,
      //       // animation: google.maps.Animation.DROP,
      //       provID: this.mapData.prov[i]._id,
      //       title: this.mapData.prov[i].provName
      //     });
      //     provMarker[i].addListener("click", () => {
      //       this.insertParamClickMarker(provMarker[i].provID, "prov");
      //       let provCenter = new google.maps.LatLng(
      //         this.mapData.prov[i].latlong.lat,
      //         this.mapData.prov[i].latlong.lng
      //       );
      //       map.setZoom(10);
      //       map.setCenter(provCenter);
      //       removeMarker(provMarker);
      //       let markerKabkot = this.mapData.kabkot.filter(data => {
      //         return data.provID === provMarker[i].provID;
      //       });
      //       for (let j = 0; j < markerKabkot.length; j++) {
      //         let posKabkot = new google.maps.LatLng(
      //           markerKabkot[j].latlong.lat,
      //           markerKabkot[j].latlong.lng
      //         );

      //         kabkotMarker[j] = new google.maps.Marker({
      //           icon: { url: blueIcon },
      //           position: posKabkot,
      //           map: map,
      //           // animation: google.maps.Animation.DROP,
      //           kabkotID: markerKabkot[j]._id,
      //           title: markerKabkot[j].kabkotName
      //         });
      //         kabkotMarker[j].addListener("click", () => {
      //           this.insertParamClickMarker(kabkotMarker[j].kabkotID, "kabkot");
      //           map.setZoom(14);
      //           map.setCenter(posKabkot);
      //           removeMarker(kabkotMarker);
      //           let markerComp = this.mapData.comp.filter(data => {
      //             return data.kabkotID === kabkotMarker[j].kabkotID;
      //           });
      //           for (let k = 0; k < markerComp.length; k++) {
      //             let posComp = new google.maps.LatLng(
      //               markerComp[k].latlong.lat,
      //               markerComp[k].latlong.lng
      //             );
      //             compMarker[k] = new google.maps.Marker({
      //               icon: { url: greenIcon },
      //               position: posComp,
      //               map: map,
      //               // animation: google.maps.Animation.DROP,
      //               compID: markerComp[k]._id,
      //               title: markerComp[k].compName
      //             });
      //             compMarker[k].addListener("click", () => {
      //               this.insertParamClickMarker(compMarker[k].compID, "comp");
      //             });
      //           }
      //         });
      //       }
      //     });
      //   }
      // } else if (this.mapData.kabkot.length > 0) {
      //   for (let j = 0; j < this.mapData.kabkot.length; j++) {
      //     let posKabkot = new google.maps.LatLng(
      //       this.mapData.kabkot[j].latlong.lat,
      //       this.mapData.kabkot[j].latlong.lng
      //     );

      //     kabkotMarker[j] = new google.maps.Marker({
      //       icon: { url: blueIcon },
      //       position: posKabkot,
      //       map: map,
      //       // animation: google.maps.Animation.DROP,
      //       kabkotID: this.mapData.kabkot[j]._id,
      //       title: this.mapData.kabkot[j].kabkotName
      //     });
      //     kabkotMarker[j].addListener("click", () => {
      //       this.insertParamClickMarker(kabkotMarker[j].kabkotID, "kabkot");
      //       map.setZoom(14);
      //       map.setCenter(posKabkot);
      //       removeMarker(kabkotMarker);
      //       let markerComp = this.mapData.comp.filter(data => {
      //         return data.kabkotID === kabkotMarker[j].kabkotID;
      //       });
      //       for (let k = 0; k < markerComp.length; k++) {
      //         let posComp = new google.maps.LatLng(
      //           markerComp[k].latlong.lat,
      //           markerComp[k].latlong.lng
      //         );
      //         compMarker[k] = new google.maps.Marker({
      //           icon: { url: greenIcon },
      //           position: posComp,
      //           map: map,
      //           // animation: google.maps.Animation.DROP,
      //           compID: markerComp[k]._id,
      //           title: markerComp[k].compName
      //         });
      //         compMarker[k].addListener("click", () => {
      //           this.insertParamClickMarker(compMarker[k].compID, "comp");
      //         });
      //       }
      //     });
      //   }
      // } else if (this.mapData.comp.length > 0) {
      //   for (let k = 0; k < this.mapData.comp.length; k++) {
      //     let posComp = new google.maps.LatLng(
      //       this.mapData.comp[k].latlong.lat,
      //       this.mapData.comp[k].latlong.lng
      //     );
      //     compMarker[k] = new google.maps.Marker({
      //       icon: { url: greenIcon },
      //       position: posComp,
      //       map: map,
      //       // animation: google.maps.Animation.DROP,
      //       compID: this.mapData.comp[k]._id,
      //       title: this.mapData.comp[k].compName
      //     });
      //     compMarker[k].addListener("click", () => {
      //       this.insertParamClickMarker(compMarker[k].compID, "comp");
      //     });
      //   }
      // }

      // function insertMarker(markerName) {
      //   for (let i = 0; i < markerName.length; i++) {
      //     markerName[i].setMap(map);
      //   }
      // }

      // function removeMarker(markerName) {
      //   for (let i = 0; i < markerName.length; i++) {
      //     markerName[i].setMap(null);
      //   }
      // }
    },
    async getAnnoncement() {
      try {
        const { data } = await axios.get(`${defaults.baseURL}/ann`);
        this.annoncementData = data.sort((a, b) => b.datePengumuman - a.datePengumuman);
      } catch (error) {
        console.log(error);
      }
    },
    unixTS2DMY(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY");
    },
    async getProvince() {
      try {
        const region = await axios.get(`${defaults.baseURL}/report/list/5f340d5e328182315c11ee98`);
        this.provinces = region.data.provList;
        this.region = region.data.kabkotList;
      } catch (err) {
        console.log(err);
      }
    },
    getCity(province) {
      this.cities = this.region.filter(item => item.provID === province);
    },
    setChartData(data) {
      return {
        labels: data.map((item) => item._id),
        series: data.map((item) => item.count),
        colors: data.map((item) => item.color),
      };
    },
    setByTahapanColor(data) {
      const result = data.map((item) => {
        return {
          ...item,
          color: TPColors.find((color) => color.name === item._id).color,
        };
      });
      return this.setChartData(result);
    },
    setByIndustryColor(data) {
      const result = data.map((item) => {
        return {
          _id: BIColors.find((name) => name.name === item._id).value,
          count: item.count,
          color: BIColors.find((color) => color.name === item._id).color,
        };
      });
      return this.setChartData(result);
    },
    async getChartData() {
      const { data } = await axios.get(`${defaults.baseURL}/report/infografis`);
      this.chartData.terdaftar = this.setByTahapanColor(data.byTahapan.terdaftar);
      this.chartData.terkoneksi = this.setByTahapanColor(data.byTahapan.terkoneksi);
      this.chartData.melapor = this.setByTahapanColor(data.byTahapan.melapor);
      this.chartData.belumMelapor = this.setByTahapanColor(data.byTahapan.belum);

      this.chartData.rayon = this.setByIndustryColor(data.byIndustry["Industri Rayon"]);
      this.chartData.pulpPaper = this.setByIndustryColor(data.byIndustry["Industri Pulp/Kertas"]);
      this.chartData.petrokimia = this.setByIndustryColor(data.byIndustry["Industri Petrokimia Hulu"]);
      this.chartData.oleokimia = this.setByIndustryColor(data.byIndustry["Industri Oleokimia Dasar"]);
      this.chartData.minyakSawit = this.setByIndustryColor(data.byIndustry["Industri Minyak Sawit"]);
      this.chartData.minyakBumi = this.setByIndustryColor(data.byIndustry["Pengolahan Minyak Bumi"]);
      this.chartData.migas = this.setByIndustryColor(data.byIndustry["Eksplorasi dan Produksi Migas"]);
      this.chartData.emasTembaga = this.setByIndustryColor(data.byIndustry["Pertambangan Emas dan Tembaga"]);
      this.chartData.batuBara = this.setByIndustryColor(data.byIndustry["Pertambangan Batu Bara"]);
      this.chartData.tekstil = this.setByIndustryColor(data.byIndustry["Industri Tekstil"]);
      this.chartData.nikel = this.setByIndustryColor(data.byIndustry["Pertambangan Nikel"]);
      this.chartData.industri = this.setByIndustryColor(data.byIndustry["Kawasan Industri"]);
      this.isChartLoading = false;
    },
  },
  beforeMount() {},
  mounted() {
    this.infografiOptions = [
      { key: 1, name: "Berdasarkan Tahapan Progress" },
      { key: 2, name: "Berdasarkan 12 Industri" },
      // { key: 1, name: "Berdasarkan Jenis Industri" },
      // { key: 2, name: "Berdasarkan Wilayah" },
      // { key: 3, name: "Berdasarkan Perusahaan" },
    ];
  },
};
</script>

<style scoped>
#bodyContent p {
  line-height: 10px !important;
}
.btn-closes {
  float: right;
  margin-right: 10px;
  margin-top: 10px;
  position: relative;
  z-index: 9999;
}
.btn-closes button {
  border: none;
  border-radius: 100px;
  font-size: 20px;
  background-color: rgb(248 249 254);
  margin-right: 29px;
}
.popup-logo {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  background-color: transparent;
  z-index: 999;
  padding: 100px;
}
.bg-logonotif {
  background-color: rgb(248 249 254 / 30%);
  width: 55%;
  border-radius: 25px;
}
/* .isNotificationLogo {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 5000px;
} */
.map-canvas {
  height: 700px;
}
@media only screen and (max-width: 768px) {
  .map-canvas {
    height: 470px;
  }
  .popup-logo {
    z-index: -1;
  }
}
.infografis {
  display: flex;
  padding: 0 20px;
  margin-bottom: 10rem;
}
.legend {
  width: 320px;
  min-width: 320px;
  border-right-width: 1px;
  border-right-color: #DFDFDF;
  border-right-style: solid;
}
.legend-content {
  display: flex;
  align-items: center;
  column-gap: 10px;
}
.legend-color {
  width: 16px;
  height: 16px;
}
.legend-desc {
  font-size: 14px;
}
.chart {
  height: min-content;
  display: flex;
  flex-wrap: wrap;
  row-gap: 20px;
  /* margin-bottom: 1rem; */
}
.infografis-legend {
  border-bottom-width: 1px;
  border-bottom-color: #DFDFDF;
  border-bottom-style: solid;
}
.infografis-chart {
  height: 430px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  overflow-y: auto;
}
.mdl-content {
  background: #F9AA61;
  overflow-y: auto;
  max-height: 90%;
}
.mdl-header {
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  column-gap: 1rem;
}
.mdl-header i {
  font-size: 30px;
  color: #00bcd4;
  color: #FFFFFF;
}
.mdl-header p {
  margin-bottom: 0;
  font-size: 28px;
  font-weight: 600;
  text-transform: uppercase;
  color: #000000;
}
.table-header-class {
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
}
</style>

<!-- unscoped this -->
<style>
.announcement-modal-background {
  background: #F9AA61;
}
</style>

<style lang="scss">
#announcement {
  .el-table {
    .el-table__cell {
      vertical-align: top;
    }
    .cell {
      word-break: normal;
      text-align: justify;
    }
  }
}
</style>