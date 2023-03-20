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
            Data Sparing
          </h1>
        </div>
        <div class="d-flex">
          <base-input v-if="auth < 1" class="m-0 mr-4">
            <el-select
              v-model="form.userRole.provID"
              filterable
              @change="getKabkot(form.userRole.provID)"
              placeholder="Provinsi"
            >
              <el-option
                v-for="option in selects.options.prov"
                :key="option._id"
                :label="option.name"
                :value="option._id"
              ></el-option>
            </el-select>
          </base-input>
          <base-input v-if="auth < 2" class="m-0 mr-4">
            <el-select
              v-model="form.userRole.kabkotID"
              filterable
              @change="getComp(form.userRole.kabkotID)"
              placeholder="Kab/Kot"
            >
              <el-option
                v-for="option in selects.options.city"
                :key="option._id"
                :label="option.name"
                :value="option._id"
              ></el-option>
            </el-select>
          </base-input>
          <base-input v-if="auth < 3" class="m-0">
            <el-select
              v-model="form.userRole.compID"
              filterable
              @change="getData(form.userRole.compID)"
              placeholder="Nama Industri"
            >
              <el-option
                v-for="option in selects.options.comp"
                :key="option.compID"
                :label="option.name"
                :value="option.compID"
              ></el-option>
            </el-select>
          </base-input>
        </div>
      </div>
      <base-header class="pb-8" type="primary"></base-header>

      <div class="container-fluid mt--7">
        <div class="row justify-content-center mb--4">
          <div v-for="(item, index) in chartData.datasets" :key="item.id" class="col-lg-6 col-md-12">
            <div class="card">
              <div class="container">
                <div class="row align-items-center justify-content-between">
                  <h4
                    class="
                      col-1
                      row
                      align-items-center
                      text-primary
                      font-weight-light
                      m-0
                    "
                    style="height: 3rem"
                  >
                    {{ item.label }}
                  </h4>
                  <h4
                    class="
                      col-11
                      row
                      align-items-center
                      justify-content-start
                      text-primary
                      m-0
                    "
                    style="height: 3rem"
                  >
                    <span class="font-weight-bold mr-2">
                      {{ "Hasil Pengukuran : " + item.data[0] }}
                    </span>
                    <span
                      class="font-weight-bold"
                      style="position: absolute; right: 0; margin-right: 25px"
                      v-if="item.label == 'pH'"
                    >
                      {{ "BMAL : " + item.range.min + "-" + item.range.max }}
                    </span>
                    <span
                      class="font-weight-bold"
                      style="position: absolute; right: 0; margin-right: 25px"
                      v-else-if="item.label != 'pH'"
                    >
                      <div v-if="item.range.max">
                        {{ "BMAL : " + item.range.max }}
                      </div>
                      <div v-else-if="item.range.max == ''">
                        {{ "BMAL : " + "-" }}
                      </div>
                    </span>
                  </h4>
                </div>
              </div>
              <hr class="m-0" />
              <div class="container">
                <div class="row">
                  <div class="col py-3">
                    <line-chart
                      :style="chartStyle"
                      :chart-data="{
                        labels: chartData.labels,
                        datasets: [chartData.datasets[index]],
                      }"
                    ></line-chart>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Select, Option } from "element-ui";
import LineChart from "@/components/Charts/LineChart";
import * as chartConfigs from "@/components/Charts/config";
import Loading from "vue-loading-overlay";
import moment from "moment";
import defaults from "@/util/defaults";
const authData = JSON.parse(localStorage.getItem("auth-data"));

const axios = require("axios");
const uniqid = require("uniqid");

function now(back) {
  let time = new Date().getTime() / 1000;
  let delta = back * 1800;
  return moment.unix(time - delta).format("HH:mm");
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
    Loading,
    LineChart,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {
      dataParams: {},
      auth: null,
      queryArray: [],
      form: {
        userEmail: null,
        userPassword: null,
        userRole: {
          role: null,
          compID: null,
          kabkotID: null,
          provID: null,
        },
      },
      tempSelect: null,
      selects: {
        options: {
          type: [
            {
              label: "Semua",
              value: 0,
            },
            {
              label: "Industri Alpha",
              value: 1,
            },
            {
              label: "Industri Bravo",
              value: 2,
            },
            {
              label: "Industri Charlie",
              value: 3,
            },
            {
              label: "Industri Delta",
              value: 4,
            },
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
          comp: [
            {
              label: "Semua",
              value: 0,
            },
            {
              label: "Industri Alpha",
              value: 1,
            },
            {
              label: "Industri Bravo",
              value: 2,
            },
            {
              label: "Industri Charlie",
              value: 3,
            },
            {
              label: "Industri Delta",
              value: 4,
            },
          ],
        },
        type: null,
        prov: null,
        city: null,
        comp: null,
        time: null,
      },
      tableData: [],
      interval: null,
    };
  },
  computed: {
    chartData() {
      let data = {
        labels: [],
        datasets: [
          {
            borderColor: "#29664a",
            data: [],
            id: uniqid(),
            label: "pH",
            range: {
              min: 5,
              max: 9,
            },
          },
          {
            borderColor: "#29664a",
            data: [],
            id: uniqid(),
            label: "COD (mg/l)",
            range: {
              min: 0,
              max: 100,
            },
          },
          {
            borderColor: "#29664a",
            data: [],
            id: uniqid(),
            label: "TSS (mg/l)",
            range: {
              min: 0,
              max: 100,
            },
          },
          {
            borderColor: "#29664a",
            data: [],
            id: uniqid(),
            label: "NH3N (mg/l)",
            range: {
              min: 0,
              max: 100,
            },
          },
          {
            borderColor: "#29664a",
            data: [],
            id: uniqid(),
            label: "Debit (m3/menit)",
            range: {
              min: 0,
              max: 100,
            },
          },
        ],
      };
      for (let i = 0; i < this.tableData.length; i++) {
        data.labels.push(this.tableData[i].time);
        data.datasets[0].data.push(this.tableData[i].ph);
        data.datasets[1].data.push(this.tableData[i].cod);
        data.datasets[2].data.push(this.tableData[i].tss);
        data.datasets[3].data.push(this.tableData[i].nh3n);
        data.datasets[4].data.push(this.tableData[i].debit);
      }
      return data;
    },
    now(back) {
      let time = new Date().getTime() / 1000;
      let delta = back * 1800;
      return moment.unix(time - delta).format("HH:mm");
    },
    chartStyle() {
      let height = (window.innerHeight - 66 - 24 - 3 * (48 + 30 + 30) - 81) / 3;
      return {
        height: `${height}px`,
      };
    },
  },
  methods: {
    stripHolder(value) {
      if (value) {
        return "-";
      }
      return "";
    },
    getData(data) {
      clearInterval(this.interval);
      this.generateData(data, "comp");
      this.interval = setInterval(() => {
        this.generateData(data, "comp");
      }, 120000);
    },
    getComp(data) {
      this.form.userRole.compID = null;
      clearInterval(this.interval);
      this.generateData(data, "kabkot");
      this.interval = setInterval(() => {
        this.generateData(data, "kabkot");
      }, 120000);
      const list = this.tempSelect.compList;
      const filterList = list.filter((l) => l.kabkotID === data);
      this.selects.options.comp = filterList;
      // this.form.userRole.kabkotID = null;
    },
    getKabkot(data) {
      this.form.userRole.kabkotID = null;
      this.form.userRole.compID = null;
      clearInterval(this.interval);
      this.generateData(data, "prov");
      this.interval = setInterval(() => {
        this.generateData(data, "prov");
      }, 120000);
      this.generateData(data, "prov");
      const list = this.tempSelect.kabkotList;
      const filterList = list.filter((l) => l.provID === data);
      this.selects.options.city = filterList;
    },
    getList(userID) {
      axios
        .get(`${defaults.baseURL}/report/list/${userID}`, {
          headers: { token: this.$store.state.token },
        })
        .then((res) => {
          this.selects.options.prov = res.data.provList;
          this.selects.options.city = res.data.kabkotList;
          this.selects.options.comp = res.data.compList;

          this.selects.options.prov.unshift({ name: "Semua", value: "" });
          this.selects.options.city.unshift({ name: "Semua", value: "" });
          this.selects.options.comp.unshift({ name: "Semua", value: "" });
          this.tempSelect = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    generateData(userID, type) {
      let lastTime;
      let query = "";
      if (this.tableData[39]) {
        lastTime = this.tableData[39].timestamp;
      }
      if (userID) {
        query = `?filter=${userID}&type=${type}`;
      }

      axios
        .get(`${defaults.baseURL}/dash/data/${authData._id}${query}`, {
          headers: { token: this.$store.state.token },
        })
        .then((res) => {
          this.dataParams = res.data.dataParam;
          let tempData = res.data.dataSend;
          let tempArray = [];
          if (res.data.length === 0) {
            this.tableData = [];
            return;
          }

          if (tempData[0].timestamp !== lastTime) {
            for (let i = 0; i < tempData.length; i++) {
              tempArray.push({
                id: tempData[i]._id,
                time: moment.unix(tempData[i].timestamp).format("DD-MM-YYYY HH:mm"),
                timestamp: tempData[i].timestamp,
                ph: tempData[i].dataParam[0].value.toFixed(4),
                cod: tempData[i].dataParam[1].value.toFixed(4),
                tss: tempData[i].dataParam[2].value.toFixed(4),
                nh3n: tempData[i].dataParam[3].value.toFixed(4),
                debit: tempData[i].dataParam[4].value.toFixed(4),
              });
            }
            this.tableData = tempArray;
          }
        })
        .catch((err) => console.log(err));
    },
    // generateData() {
    //   this.tableData = [];
    //   const length = 50;
    //   let array = [];
    //   for (let i = 0; i < length; i++) {
    //     array.push({
    //       id: uniqid(),
    //       time: now(i),
    //       type: this.selects.options.type[intRNG(1, 4)].label,
    //       prov: this.selects.options.prov[intRNG(1, 4)].label,
    //       city: this.selects.options.city[intRNG(1, 4)].label,
    //       comp: this.selects.options.comp[intRNG(1, 4)].label,
    //       ph: floatRNG(5, 9),
    //       cod: floatRNG(0, 100),
    //       tss: floatRNG(0, 100),
    //       nh3n: floatRNG(0, 100),
    //       debit: floatRNG(0, 100),
    //     });
    //   }
    //   this.tableData = array;
    // },
  },
  created() {
    this.generateData();
    this.interval = setInterval(() => {
      this.generateData();
    }, 120000);

    if (authData.userRole.role === "admin") {
      this.auth = 0;
    } else if (authData.userRole.role === "prov") {
      this.auth = 1;
    } else if (authData.userRole.role === "kabkot") {
      this.auth = 2;
    } else if (authData.userRole.role === "comp") {
      this.auth = 3;
    }

    this.getList(authData._id);
  },
  destroyed() {
    clearInterval(this.interval);
  },
  watch: {
    queryArray() {
      let tempArray = this.queryArray;
      axios.get(`${defaults.baseURL}/${tempArray}`, {
        headers: { token: this.$store.state.token },
      });
    },
    dataParams() {
      let data = this.chartData;

      this.dataParams.pH[0] != null || undefined
        ? (data.datasets[0].range.min = this.dataParams.pH[0])
        : (data.datasets[0].range.min = "");
      this.dataParams.pH[1] != null || undefined
        ? (data.datasets[0].range.max = this.dataParams.pH[1])
        : (data.datasets[0].range.max = "");
      this.dataParams.cod[0] != null || undefined
        ? (data.datasets[1].range.min = this.dataParams.cod[0])
        : (data.datasets[1].range.min = "");
      this.dataParams.cod[1] != null || undefined
        ? (data.datasets[1].range.max = this.dataParams.cod[1])
        : (data.datasets[1].range.max = "");
      this.dataParams.tss[0] != null || undefined
        ? (data.datasets[2].range.min = this.dataParams.tss[0])
        : (data.datasets[2].range.min = "");
      this.dataParams.tss[1] != null || undefined
        ? (data.datasets[2].range.max = this.dataParams.tss[1])
        : (data.datasets[2].range.max = "");
      this.dataParams.nh3n[0] != null || undefined
        ? (data.datasets[3].range.min = this.dataParams.nh3n[0])
        : (data.datasets[3].range.min = "");
      this.dataParams.nh3n[1] != null || undefined
        ? (data.datasets[3].range.max = this.dataParams.nh3n[1])
        : (data.datasets[3].range.max = "");
      this.dataParams.debit[0] != null || undefined
        ? (data.datasets[4].range.min = this.dataParams.debit[0])
        : (data.datasets[4].range.min = "");
      this.dataParams.debit[1] != null || undefined
        ? (data.datasets[4].range.max = this.dataParams.debit[1])
        : (data.datasets[4].range.max = "");
      this.chartData = data;
    },
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
