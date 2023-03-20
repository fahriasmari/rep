<template>
<div>
  <div id="dashboard">
    <div
      class="d-flex align-items-center overflow-hidden position-absolute w-100"
      style="height: 66px; padding: 0 30px; top: 0; z-index: 1"
    >
      <div>
        <h1 class="display-3 font-weight-light text-white m-0">
          Data Sparing
        </h1>
      </div>
    </div>
    <base-header class="pb-8" type="primary"></base-header>
    <div class="container-fluid mt--7">
      <div class="d-flex justify-content-end mb-4">
        <base-input v-if="authLevel < 1" class="m-0 mr-4">
          <el-select
            v-model="filter.province"
            filterable
            @change="onFilterChange('prov')"
            placeholder="Provinsi"
          >
            <el-option value="">Semua</el-option>
            <el-option
              v-for="province in provinces"
              :key="province._id"
              :label="province.name"
              :value="province._id"
            ></el-option>
          </el-select>
        </base-input>
        <base-input v-if="authLevel < 2" class="m-0 mr-4">
          <el-select
            v-model="filter.city"
            filterable
            @change="onFilterChange('kabkot')"
            placeholder="Kab/Kota"
          >
            <el-option value="">Semua</el-option>
            <el-option
              v-for="city in cities"
              :key="city._id"
              :label="city.name"
              :value="city._id"
            ></el-option>
          </el-select>
        </base-input>
        <base-input v-if="authLevel < 3" class="m-0">
          <el-select
            v-model="filter.company"
            filterable
            @change="onFilterChange('comp')"
            placeholder="Nama Industri"
          >
            <el-option value="">Semua</el-option>
            <el-option
              v-for="company in companies"
              :key="company.compID"
              :label="company.name"
              :value="company.compID"
            ></el-option>
          </el-select>
        </base-input>
      </div>
      <div class="row mb--4">
        <div v-for="(item, index) in chartData.datasets" :key="item.id" class="col-xl-6 col-lg-12">
          <div class="card">
            <div class="container my-3">
              <div class="header-desc">
                <div>{{ item.label }}</div>
                <div v-if="item.label == 'pH'" class="bmal">
                  BMAL: {{ item.range.min }}-{{ item.range.max }}
                </div>
                <div v-else class="bmal">BMAL: {{ item.range.max || "-" }}</div>
              </div>
              <div class="header-desc">
                <div class="bmal">Menampilkan grafik dari {{ date  }}</div>
                <div class="bmal">Hasil Pengukuran: {{ item.data[0] }}</div>
              </div>
            </div>
            <hr class="m-0" />
            <div class="container">
              <div class="row">
                <div class="col py-3">
                  <DataSparingChart
                    :style="{ height: '16rem' }"
                    :data="{
                      labels: chartData.labels,
                      datasets: [chartData.datasets[index]],
                    }"
                  ></DataSparingChart>
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
import DataSparingChart from "@/components/Charts/DataSparingChart.vue"
import Loading from "vue-loading-overlay";
import moment from "moment";
import axios from "axios";
import uniqid from "uniqid";
import defaults from "@/util/defaults";

export default {
  components: {
    Loading,
    DataSparingChart,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {
      authLevel: this.$store.state.auth.level,
      auth: JSON.parse(localStorage.getItem("auth-data")),
      provinces: [],
      cities: [],
      originalCity: [],
      companies: [],
      originalCompanies: [],
      filter: {
        company: null,
        city: null,
        province: null,
      },
      params: { id: "", type: "" },
      date: null,
      threshold: {},
      data: [],
      interval: null,
      loading: true,
    };
  },
  computed: {
    chartData() {
      if (this.loading) return [];
      let data = {
        labels: [],
        datasets: [
          {
            borderColor: "#29664a",
            data: [],
            range: { min: 0, max: 0 },
            label: "pH",
            id: uniqid(),
          },
          {
            borderColor: "#29664a",
            data: [],
            range: { min: 0, max: 0 },
            label: "COD (mg/l)",
            id: uniqid(),
          },
          {
            borderColor: "#29664a",
            data: [],
            range: { min: 0, max: 0 },
            label: "TSS (mg/l)",
            id: uniqid(),
          },
          {
            borderColor: "#29664a",
            data: [],
            range: { min: 0, max: 0 },
            label: "NH3N (mg/l)",
            id: uniqid(),
          },
          {
            borderColor: "#29664a",
            data: [],
            range: { min: 0, max: 0 },
            label: this.threshold.debit[2] ? `Debit (${this.threshold.debit[2]})` : `Debit`,
            id: uniqid(),
          },
        ],
      };
      data.labels = this.data.map(({ timestamp }) => moment.unix(timestamp).format("HH:mm"));
      data.datasets[0].data = this.getDatasets("pH");
      data.datasets[1].data = this.getDatasets("COD");
      data.datasets[2].data = this.getDatasets("TSS");
      data.datasets[3].data = this.getDatasets("NH3N");
      data.datasets[4].data = this.getDatasets("Debit");

      data.datasets[0].range.min = this.threshold.pH[0];
      data.datasets[0].range.max = this.threshold.pH[1];
      data.datasets[1].range.min = this.threshold.cod[0];
      data.datasets[1].range.max = this.threshold.cod[1];
      data.datasets[2].range.min = this.threshold.tss[0];
      data.datasets[2].range.max = this.threshold.tss[1];
      data.datasets[3].range.min = this.threshold.nh3n[0];
      data.datasets[3].range.max = this.threshold.nh3n[1];
      data.datasets[4].range.min = this.threshold.debit[0];
      data.datasets[4].range.max = this.threshold.debit[1];

      return data;
    },
  },
  methods: {
    getDatasets(parameter) {
      return this.data.map(({ dataParam }) => dataParam.find(({ name }) => name === parameter).value);
    },
    onFilterChange(type) {
      if (type === "prov") {
        this.cities = this.originalCity.filter(({ provID }) =>  !this.filter.province || this.filter.province === provID);
        this.companies = this.originalCompanies.filter(({ provID }) => !this.filter.province || this.filter.province === provID);
        this.params.id = this.filter.province;
    } else if (type === "kabkot") {
        this.companies = this.originalCompanies.filter(({ kabkotID }) => !this.filter.city || this.filter.city === kabkotID);
        this.params.id = this.filter.city;
      } else {
        this.params.id = this.filter.company;
      }
      this.params.type = type;
      this.fetchData();
    },
    fetchData() {
      clearInterval(this.interval);
      this.getData();
      this.interval = setInterval(() => {
        this.getData();
      }, 120000);
    },
    async getFilterData() {
      const { data } = await axios.get(`${defaults.baseURL}/report/list/5f340d5e328182315c11ee98`);
      this.provinces = data.provList;
      this.cities = data.kabkotList;
      this.originalCity = data.kabkotList;
      this.companies = data.compList;
      this.originalCompanies = data.compList;
    },
    async getData() {
      let params = "";
      if (this.params.id && this.params.type) {
        params = `?filter=${this.params.id}&type=${this.params.type}`
      }
      const { data, status } = await axios.get(`${defaults.baseURL}/dash/data/${this.auth._id}${params}`);
      if (status === 200) {
        this.loading = false;
        this.threshold = data.dataParam;
        this.data = data.dataSend;
        const timestamp = data.dataSend.map(({ timestamp }) => timestamp)
        const firstDate = moment.unix(timestamp[0]).format("DD/MM/YYYY")
        const lastDate = moment.unix(timestamp.at(-1)).format("DD/MM/YYYY")
        this.date = firstDate === lastDate ? firstDate : `${firstDate} - ${lastDate}`;
      }
    },
  },
  created() {
    this.fetchData();
    this.getFilterData();
  },
  destroyed() {
    clearInterval(this.interval);
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
.header-desc {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: #29664a;
  font-weight: 600;
}
.bmal {
  font-size: 12px;
}
</style>
