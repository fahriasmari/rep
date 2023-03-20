<template>
  <div>
    <div id="dashboard">
      <div
        class="
          d-flex
          align-items-center
          justify-content-between
          overflow-hidden
          position-absolute
          w-100
        "
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1"
      >
        <div>
          <h1 class="display-3 font-weight-light text-white m-0">
            Analisa Perbandingan Hasil
          </h1>
          <h2 class="d-none text-white mx-4 my-0">-</h2>
          <h4 class="d-none text-default m-0">Listed Data</h4>
        </div>
      </div>
      <base-header class="pt-2 pb-8" type="primary">
        <div class="row py-2">
          <div class="col-lg-4">
            <el-select
              class="w-100"
              @change="getListIndustri()"
              v-model="selects.type"
              filterable
              placeholder="Jenis Industri"
            >
              <el-option
                v-for="option in selects.options.type"
                :key="option.name"
                :label="option.name"
                :value="option.value"
              ></el-option>
            </el-select>
          </div>
          <div class="col-lg-4">
            <el-select
              class="w-100"
              @change="getKabkot(selects.prov)"
              filterable
              v-model="selects.prov"
              placeholder="Provinsi"
            >
              <el-option
                v-for="option in selects.options.prov"
                :key="option._id"
                :label="option.name"
                :value="option._id"
              ></el-option>
            </el-select>
          </div>
          <div class="col-lg-4">
            <el-select
              class="w-100"
              @change="getListIndustri()"
              filterable
              v-model="selects.city"
              placeholder="Kab/Kot"
            >
              <el-option
                v-for="option in selects.options.city"
                :key="option._id"
                :label="option.name"
                :value="option._id"
              ></el-option>
            </el-select>
          </div>
          <div class="d-none col-lg-3">
            <base-input class="m-0">
              <flat-picker
                placeholder="Waktu"
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true, enableTime: true, mode: 'range' }"
                class="form-control datepicker"
                v-model="selects.time"
              ></flat-picker>
            </base-input>
          </div>
        </div>
        <div class="row py-2">
          <div class="col-lg-6">
            <el-select
              class="w-100"
              v-model="selects.comp[0]"
              filterable
              placeholder="Industri"
            >
              <el-option
                v-for="option in selects.options.comp"
                :key="option.compID"
                :label="option.name"
                :value="option.value"
              ></el-option>
            </el-select>
          </div>
          <div class="col-lg-6">
            <el-select
              class="w-100"
              v-model="selects.comp[1]"
              filterable
              placeholder="Industri"
            >
              <el-option
                v-for="option in selects.options.comp"
                :key="option.value"
                :label="option.name"
                :value="option.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="row pt-2">
          <div class="col-lg-12">
            <base-button
              class="w-100"
              size="md"
              type="secondary"
              @click="generateData(selects.comp[0], selects.comp[1])"
              >Bandingkan</base-button
            >
          </div>
        </div>
      </base-header>

      <div class="container-fluid mt--7">
        <div class="row justify-content-center mb--4">
          <template v-for="(item, index) in chartArray[0].datasets">
            <div :key="item.id" class="col-12">
              <div class="card">
                <div class="container-fluid">
                  <div class="row align-items-center justify-content-between">
                    <h4
                      class="
                        col-6
                        row
                        align-items-center
                        text-primary
                        font-weight-light
                        m-0
                      "
                      style="height: 3rem"
                    >
                      {{ item.titleLabel }}
                    </h4>
                  </div>
                </div>
                <hr class="m-0" />
                <div class="container-fluid">
                  <div class="row">
                    <div v-if="render.visibleCharts" class="col py-3">
                      <line-chart
                        :style="chartStyle"
                        :chart-data="{
                          labels: chartArray[0].labels,
                          datasets: [
                            chartArray[0].datasets[index],
                            chartArray[1].datasets[index],
                          ],
                        }"
                      ></line-chart>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Select, Option } from "element-ui";
import LineChart from "@/components/Charts/LineChart";
import * as chartConfigs from "@/components/Charts/config";
import flatPicker from "vue-flatpickr-component";
import moment from "moment";
import "flatpickr/dist/flatpickr.css";
import { select } from "d3";
import defaults from "@/util/defaults";

const axios = require("axios");
const uniqid = require("uniqid");

function now(back) {
  let time = new Date().getTime() / 1000;
  let delta = back * 1800;
  return moment.unix(time - delta).format("hh:mm");
}
function intRNG(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function floatRNG(min, max) {
  let range = max - min;
  let delta = Math.random() * range;
  return min + delta;
}

export default {
  components: {
    LineChart,
    flatPicker,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {
      table1: [],
      table2: [],
      render: {
        visibleCharts: false,
      },
      selects: {
        options: {
          type: [
            { name: "Semua", value: "" },
            { name: "Industri Rayon", value: "Industri Rayon" },
            { name: "Industri Pulp/Kertas", value: "Industri Pulp/Kertas" },
            {
              name: "Industri Petrokimia Hulu",
              value: "Industri Petrokimia Hulu",
            },
            {
              name: "Industri Oleokimia Dasar",
              value: "Industri Oleokimia Dasar",
            },
            { name: "Industri Minyak Sawit", value: "Industri Minyak Sawit" },
            { name: "Pengolahan Minyak Bumi", value: "Pengolahan Minyak Bumi" },
            {
              name: "Eksplorasi dan Produksi Migas",
              value: "Eksplorasi dan Produksi Migas",
            },
            {
              name: "Pertambangan Emas dan Tembaga",
              value: "Pertambangan Emas dan Tembaga",
            },
            { name: "Pertambangan Batu Bara", value: "Pertambangan Batu Bara" },
            { name: "Industri Tekstil", value: "Industri Tekstil" },
            { name: "Pertambangan Nikel", value: "Pertambangan Nikel" },
            { name: "Kawasan Industri", value: "Kawasan Industri" },
          ],
          prov: [
            {
              label: "Semua",
              value: 0,
            },
            {
              label: "Provinsi Alpha",
              value: 1,
            },
            {
              label: "Provinsi Bravo",
              value: 2,
            },
            {
              label: "Provinsi Charlie",
              value: 3,
            },
            {
              label: "Provinsi Delta",
              value: 4,
            },
          ],
          city: [
            {
              label: "Semua",
              value: 0,
            },
            {
              label: "Kab/Kot Alpha",
              value: 1,
            },
            {
              label: "Kab/Kot Bravo",
              value: 2,
            },
            {
              label: "Kab/Kot Charlie",
              value: 3,
            },
            {
              label: "Kab/Kot Delta",
              value: 4,
            },
          ],
          comp: [],
        },
        type: null,
        prov: null,
        city: null,
        comp: [null, null],
        time: null,
      },
      tableData: [],
      tableDataArray: [],
      tempSelect: [],
    };
  },
  computed: {
    chartArray() {
      const color = ["#29664a", "#3d9973"];
      let table = [this.table1, this.table2];
      let compName = ["Comp 1", "Comp 2"];
      if (this.selects.comp[0] && this.selects.comp[1]) {
        const list = this.tempSelect.compList;
        const comp1 = list.find((l) => l.compID === this.selects.comp[0]);
        const comp2 = list.find((l) => l.compID === this.selects.comp[1]);
        compName = [comp1.name, comp2.name];
      }
      let array = [];
      for (let i = 0; i < color.length; i++) {
        array.push(this.chartData(color[i], table[i], compName[i]));
      }
      return array;
    },
    now(back) {
      let time = new Date().getTime() / 1000;
      let delta = back * 1800;
      return moment.unix(time - delta).format("hh:mm");
    },
    chartStyle() {
      let height = (window.innerHeight - 66 - 24 - 3 * (48 + 30 + 30) - 81) / 3;
      return {
        height: `${height}px`,
      };
    },
  },
  methods: {
    getComp(data) {
      const list = this.tempSelect.compList;
      const filterList = list.filter((l) => l.kabkotID === data);
      this.selects.options.comp = filterList;
    },
    getKabkot(data) {
      this.selects.city = null;
      // this.selects.comp = null;
      const list = this.tempSelect.kabkotList;
      const filterList = list.filter((l) => l.provID === data);
      this.selects.options.city = filterList;
      this.getListIndustri();
    },
    getList(userID) {
      axios
        .get(`${defaults.baseURL}/report/list/${userID}`, {
          headers: { token: this.$store.state.token },
        })
        .then((res) => {
          this.selects.options.prov = res.data.provList;
          this.selects.options.city = res.data.kabkotList;
          // this.selects.options.comp = res.data.compList;
          this.selects.options.prov.unshift({ name: "Semua", value: "" });
          this.selects.options.city.unshift({ name: "Semua", value: "" });
          // this.selects.options.comp.unshift({ name: "Semua", value: "" });
          this.tempSelect = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getListIndustri() {
      this.selects.comp = [null, null];
      let query = "";
      if (this.selects.city) {
        query = query + `kabkot=${this.selects.city}&`;
      }
      if (this.selects.prov) {
        query = query + `prov=${this.selects.prov}&`;
      }
      if (this.selects.type) {
        query = query + `type=${this.selects.type}&`;
      }
      axios
        .get(`${defaults.baseURL}/analytics/list?${query}`)
        .then((res) => {
          this.selects.options.comp = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    compareData() {
      if (this.selects.comp[0] > 0 && this.selects.comp[1] > 0)
        this.render.visibleCharts = true;
      else this.render.visibleCharts = false;
    },
    chartData(color, dataTable, compName) {
      let data = {
        labels: [],
        datasets: [
          {
            borderColor: color,
            data: [],
            id: uniqid(),
            titleLabel: "pH",
            label: compName,
            range: {
              min: 5,
              max: 9,
            },
          },
          {
            borderColor: color,
            data: [],
            id: uniqid(),
            titleLabel: "COD (mg/l)",
            label: compName,
            range: {
              min: 0,
              max: 100,
            },
          },
          {
            borderColor: color,
            data: [],
            id: uniqid(),
            titleLabel: "TSS (mg/l)",
            label: compName,
            range: {
              min: 0,
              max: 100,
            },
          },
          {
            borderColor: color,
            data: [],
            id: uniqid(),
            titleLabel: "NH3N (mg/l)",
            label: compName,
            range: {
              min: 0,
              max: 100,
            },
          },
          {
            borderColor: color,
            data: [],
            id: uniqid(),
            titleLabel: "Debit (m3/h)",
            label: compName,
            range: {
              min: 0,
              max: 100,
            },
          },
        ],
      };

      for (let i = 0; i < dataTable.length; i++) {
        data.labels.push(dataTable[i].time);
        data.datasets[0].data.push(dataTable[i].ph);
        data.datasets[1].data.push(dataTable[i].cod);
        data.datasets[2].data.push(dataTable[i].tss);
        data.datasets[3].data.push(dataTable[i].nh3n);
        data.datasets[4].data.push(dataTable[i].debit);
      }
      return data;
    },
    generateData(id1, id2) {
      axios(`${defaults.baseURL}/analytics/data?idfirst=${id1}&idsecond=${id2}`)
        .then((res) => {
          this.table1 = [];
          this.table2 = [];
          let tempDataA = res.data.dataA;
          let tempDataB = res.data.dataB;
          for (let i = 0; i < tempDataA.length; i++) {
            this.table1.push({
              id: tempDataA[i]._id,
              time: moment.unix(tempDataA[i].timestamp).format("hh:mm"),
              ph: tempDataA[i].dataParam[0].value.toFixed(2),
              cod: tempDataA[i].dataParam[1].value.toFixed(2),
              tss: tempDataA[i].dataParam[2].value.toFixed(2),
              nh3n: tempDataA[i].dataParam[3].value.toFixed(2),
              debit: tempDataA[i].dataParam[4].value.toFixed(2),
            });
            this.table2.push({
              id: tempDataB[i]._id,
              time: moment.unix(tempDataB[i].timestamp).format("hh:mm"),
              ph: tempDataB[i].dataParam[0].value.toFixed(2),
              cod: tempDataB[i].dataParam[1].value.toFixed(2),
              tss: tempDataB[i].dataParam[2].value.toFixed(2),
              nh3n: tempDataB[i].dataParam[3].value.toFixed(2),
              debit: tempDataB[i].dataParam[4].value.toFixed(2),
            });
          }
          this.render.visibleCharts = true;
          // let temppHA = tempDataA.map(data=>{return dataParam[0].value});
          // let tempArrayB = [];
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    const auth = JSON.parse(localStorage.getItem("auth-data"));
    // this.getList(auth._id);
    this.getList("5f340d5e328182315c11ee98");
  },
};
</script>

<style lang="scss">
#dashboard {
  .m-0 {
    .form-group {
      margin: 0;
      .valid-feedback {
        margin: 0;
      }
    }
  }
}
</style>
