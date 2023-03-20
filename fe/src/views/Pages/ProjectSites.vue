<template>
  <div>
    <div id="project-sites">
      <div
        v-if="isNotification"
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
          <div class="card">
            <div class="card-header" style="background-color: #ff9999">
              <div class="row">
                <div class="col-3">
                  <!-- <base-button
                    @click="get2MinsData"
                    :class="
                      is2Menit ? 'bg-secondary border-0' : 'bg-black border-0'
                    "
                    >2 Menit</base-button
                  > -->
                  <!-- <base-button
                    @click="get1HourData"
                    :class="
                      is2Menit ? 'bg-black border-0' : 'bg-secondary border-0'
                    "
                    >1 Jam</base-button
                  > -->
                </div>
                <div class="col-6">
                  <div class="row justify-content-center">
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
                    <h1 class="text-default mb-0 ml-4">
                      Notifikasi Melebihi Baku Mutu
                    </h1>
                  </div>
                </div>
                <div class="col-3"></div>
              </div>
            </div>
            <div class="card-body" style="background-color: #ff9999">
              <div class="rounded overflow-hidden">
                <el-table
                  v-if="is2Menit"
                  :data="errorData"
                  row-key="id"
                  :default-sort="{ prop: 'timestamp', order: 'descending' }"
                >
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
                      <div class="cell">
                        {{ unixTS2DMY(row.timestamp) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Keterangan"
                    prop="errorMsg"
                    min-width
                    align="left"
                    sortable
                  ></el-table-column>
                </el-table>
                <el-table
                  v-if="!is2Menit"
                  :data="errorDataHourly"
                  row-key="id"
                  :default-sort="{ prop: 'timestamp', order: 'descending' }"
                >
                  <el-table-column
                    v-if="this.$store.state.auth.level < 3"
                    label="Nama Industri"
                    prop="compDetails.compName"
                    min-width
                    sortable
                  ></el-table-column>
                  <el-table-column
                    v-if="this.$store.state.auth.level < 3"
                    label="Jenis Industri"
                    prop="compDetails.compType"
                    min-width
                    sortable
                  ></el-table-column>
                  <el-table-column
                    v-if="this.$store.state.auth.level < 1"
                    label="Provinsi"
                    prop="provDetails.provName"
                    min-width
                    sortable
                  ></el-table-column>
                  <el-table-column
                    v-if="this.$store.state.auth.level < 2"
                    label="Kab/Kot"
                    prop="kabkotDetails.kabkotName"
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
                      <div class="cell">
                        {{ unixTS2DMY(row.timestamp) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Keterangan"
                    prop="errSUM"
                    min-width
                    align="center"
                    sortable
                  ></el-table-column>
                  <el-table-column
                    label="Surat Teguran"
                    min-width
                    align="center"
                    sortable
                  >
                    <template>
                      <div class="cell">
                        <a
                          href="javascript:void()"
                          v-on:click="download_Suratteguran"
                          ><p>Surat Teguran.pdf</p></a
                        >
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="card-footer" style="background-color: #ff9999">
              <div class="row">
                <div class="col text-right">
                  <base-button
                    @click="$router.push('/content/errorlogshourly')"
                    class="bg-white text-primary border-0"
                    >Ke Laporan Early Warning</base-button
                  >

                  <base-button
                    class="bg-primary border-0"
                    @click="isNotification = false"
                    >Tutup</base-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h1
        class="
          display-3
          d-flex
          align-items-center
          font-weight-light
          overflow-hidden
          position-absolute
          text-white
        "
        style="height: 66px; margin: 0 0 0 30px; top: 0; z-index: 1"
      >
        Beranda
      </h1>
      <!-- <base-button class="w-100" size="md" type="danger" @click="resetMap">RESET</base-button> -->
      <base-header class="pb-8" type="primary"></base-header>

      <div class="container-fluid mt--7">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div id="map-custom" class="map-canvas"></div>
            </div>
          </div>
        </div>
        <div class="parameter row flex-row overflow-auto flex-nowrap">
          <div v-for="item in parameter" :key="item.id" class="col-1-5">
            <div class="card m-0">
              <h4 
                class="row align-items-center justify-content-center text-primary font-weight-light m-0"
                style="height: 3rem">
                {{ item.name }}
              </h4>
              <hr class="m-0" />
              <h2
                class="row align-items-center justify-content-center text-primary font-weight-bolder m-0"
                style="height: 5rem">
                <span class="mr-2">{{ item.value ? item.value.toFixed(2) : "" }}</span>
                <span>{{ item.unit }}</span>
              </h2>
            </div>
          </div>
          <div style="min-width: 15px"></div>
        </div>
      </div>
    </div>
    <NotifModal :show-modal="showKalibrasiNotif" :data="kalibrasiNotifData" @close="closeModal" />
  </div>
</template>
<script>

import { Table, TableColumn, Select, Option } from "element-ui";
import { BasePagination, BaseInput } from "@/components";
import axios from "axios";
const uniqid = require("uniqid");
import { API_KEY } from "@/views/Maps/API_KEY";
import GoogleMapsLoader from "google-maps";
import moment from "moment";
import defaults from "@/util/defaults";
import NotifModal from "./UjiKalibrasi/NotifModal.vue";

GoogleMapsLoader.KEY = API_KEY;
function floatRNG(min, max) {
  let range = max - min;
  let delta = Math.random() * range;
  return min + delta;
}

export default {
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    NotifModal
  },
  created() {
    this.getErrorData();
    this.getErrorDataHourly();
    this.getNotifKalibrasi();
    axios
      .get(`${defaults.baseURL}/pj/map/${this.authData._id}`, {
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
    this.insertParam();
    this.isNotification = true;
  },
  watch: {},
  computed: {},
  data() {
    return {
      authData: JSON.parse(localStorage.getItem("auth-data")),
      errorDataHourly: [],
      is2Menit: false,
      errorData: [],
      showKalibrasiNotif: false,
      kalibrasiNotifData: [],
      isNotification: true,
      mapData: {},
      parameter: [
        {
          id: uniqid(),
          name: "pH",
          unit: "",
          value: 0,
        },
        {
          id: uniqid(),
          name: "COD",
          unit: "(mg/l)",
          value: 0,
        },
        {
          id: uniqid(),
          name: "TSS",
          unit: "(mg/l)",
          value: 0,
        },
        {
          id: uniqid(),
          name: "NH3N",
          unit: "(mg/l)",
          value: 0,
        },
        {
          id: uniqid(),
          name: "Debit",
          unit: "(m3/menit)",
          value: 0,
        },
      ],
    };
  },
  methods: {
    async getNotifKalibrasi() {
      const { data } = await axios.get(`${defaults.baseURL}/error/kalibrasi/${this.authData._id}`);
      const isArray = Array.isArray(data)
      if (isArray && data.length) {
        this.showKalibrasiNotif = true;
        this.kalibrasiNotifData = data.map((item) => {
          const parameter = item.errorMsg.split(" ").at(-1);
          return { ...item, parameter }
        });
      }
    },
    closeModal() {
      this.showKalibrasiNotif = false;
    },
    download_Suratteguran() {
      var uri = `${defaults.baseURL}/storage/S.140 (Peringatan data melebihi baku mutu air limbah).pdf`;
      window.open(uri, '_blank');
    },
    get2MinsData() {
      this.is2Menit = true;
      this.getErrorData();
    },
    get1HourData() {
      this.is2Menit = false;
      this.getErrorDataHourly();
    },
    unixTS2DMY(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY, HH:mm");
    },
    getErrorDataHourly() {
      let tempTable;
      axios
        .get(`${defaults.baseURL}/error/recap/${this.authData._id}`)
        .then((res) => {
          this.errorDataHourly = res.data;
        });
    },
    getErrorData() {
      let tempTable;
      axios
        .get(`${defaults.baseURL}/error/list-recent/${this.authData._id}`)
        .then((res) => {
          this.errorData = res.data;
        });
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
    insertParam(idData) {
      axios
        .get(`${defaults.baseURL}/pj/data/${this.authData._id}`, {
          headers: { token: this.$store.state.token },
        })
        .then((res) => {
          let tempParam = res.data[0].dataParam;
          for (let i = 0; i < 5; i++) {
            this.parameter[i].value = tempParam[i].value;
            // console.log(tempParam[i]);
          }
          // console.log(this.parameter);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    insertParamClickMarker(idData, role) {
      axios
        .get(
          `${defaults.baseURL}/pj/data/${this.authData._id}?filter=${idData}&type=${role}`
        )
        .then((res) => {
          // console.log(res.data);
          if (res.data.length > 0) {
            for (let i = 0; i < 5; i++) {
              this.parameter[i].value = res.data[0].dataParam[i].value;
            }
          } else {
            for (let i = 0; i < 5; i++) {
              this.parameter[i].value = 0;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetMap() {
      this.initMap(google, this.mapData.centerLoc);
      this.insertParam();
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
  },
  beforeMount() {},
  mounted() {},
};
</script>

<style lang="scss">
#bodyContent p {
  line-height: 10px !important;
}
#project-sites {
  .bg-red {
    background-color: #ff9999;
  }
  .el-table {
    .cell {
      word-break: break-word;
      min-width: 80px;
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
  #map-custom {
    height: calc(100vh - 66px - 30px - 30px - 129px - 30px - 81px);
  }
  .parameter {
    height: 129px;
    margin-left: -30px;
    margin-right: -30px;
    padding-left: 15px;
    padding-right: 15px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .col-1-5 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 20%;
      flex: 0 0 20%;
      max-width: 20%;
      position: relative;
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
      &:last-child {
        margin-right: 15px;
      }
    }
  }
}
</style>
