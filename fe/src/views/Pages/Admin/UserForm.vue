<template>
  <div>
    <div id="listed-report">
      <div
        class="
          d-flex
          align-items-center
          overflow-hidden
          position-absolute
          w-100
        "
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1"
      >
        <h1 class="display-3 font-weight-light text-white m-0">Admin</h1>
        <h2 class="text-white mx-4 my-0">-</h2>
        <h4 class="text-default m-0">Form User</h4>
      </div>
      <base-header class="pb-8" type="primary"></base-header>

      <div class="container-fluid mt--7">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="card">
              <div class="card-header">
                <h3 class="mb-0">Form Industri</h3>
              </div>
              <!-- Card body -->
              <div class="card-body">
                <form>
                  <div class="form-group row">
                    <label
                      for="example-email-input"
                      class="col-md-2 col-form-label form-control-label"
                      >Email</label
                    >
                    <div class="col-md-10">
                      <base-input
                        v-model="form.userEmail"
                        type="email"
                        autocomplete="username email"
                        placeholder="sparing@industri.com"
                        id="example-email-input"
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label
                      for="example-password-input"
                      class="col-md-2 col-form-label form-control-label"
                      >Password</label
                    >
                    <div class="col-md-10">
                      <base-input
                        v-model="form.userPassword"
                        type="password"
                        autocomplete="current-password"
                        placeholder="password"
                        id="example-password-input"
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-md-2 col-form-label form-control-label"
                      >Peran</label
                    >
                    <div class="col-md-10">
                      <el-select
                        class="w-100 mb-4"
                        v-model="form.userRole.role"
                        placeholder="Peran"
                      >
                        <el-option
                          v-for="option in selects.options.role"
                          :key="option.label"
                          :label="option.label"
                          :value="option.value"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div
                    v-if="
                      form.userRole.role === 'prov' ||
                      form.userRole.role === 'kabkot' ||
                      form.userRole.role === 'comp'
                    "
                    class="form-group row"
                  >
                    <label class="col-md-2 col-form-label form-control-label"
                      >Provinsi</label
                    >
                    <div class="col-md-10">
                      <el-select
                        class="w-100 mb-4"
                        v-model="form.userRole.provID"
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
                    </div>
                  </div>
                  <div
                    v-if="
                      form.userRole.role === 'kabkot' ||
                      form.userRole.role === 'comp'
                    "
                    class="form-group row"
                  >
                    <label class="col-md-2 col-form-label form-control-label"
                      >Kab/Kot</label
                    >
                    <div class="col-md-10">
                      <el-select
                        class="w-100 mb-4"
                        v-model="form.userRole.kabkotID"
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
                    </div>
                  </div>
                  <div
                    v-if="form.userRole.role === 'comp'"
                    class="form-group row"
                  >
                    <label class="col-md-2 col-form-label form-control-label"
                      >Industri</label
                    >
                    <div class="col-md-10">
                      <el-select
                        class="w-100 mb-4"
                        v-model="form.userRole.compID"
                        placeholder="Nama Industri"
                      >
                        <el-option
                          v-for="option in selects.options.comp"
                          :key="option._id"
                          :label="option.name"
                          :value="option.compID"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                </form>
              </div>
              <div class="card-footer">
                <div class="row">
                  <div class="col-10"></div>
                  <div class="col-2">
                    <base-button
                      class="w-100"
                      size="md"
                      @click="updateHandler"
                      type="primary"
                      >Simpan</base-button
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
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { BasePagination, BaseInput } from "@/components";
import clientPaginationMixin from "@/components/clientPaginationMixin";
import moment from "moment";
import flatPicker from "vue-flatpickr-component";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.css";
import "sweetalert2/dist/sweetalert2.css";
import defaults from "@/util/defaults";

const axios = require("axios");
const uniqid = require("uniqid");
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary",
    cancelButton: "btn btn-secondary",
  },
  buttonsStyling: false,
});

function intRNG(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function floatRNG(min, max) {
  let range = max - min;
  let delta = Math.random() * range;
  return min + delta;
}
function now(back) {
  let time = new Date().getTime() / 1000;
  let delta = back * 1800;
  return time - delta;
}

export default {
  mixins: [clientPaginationMixin],
  components: {
    BasePagination,
    BaseInput,
    flatPicker,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      tempSelect: {},
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
      selects: {
        options: {
          role: [
            {
              label: "Pusat",
              value: "admin",
            },
            {
              label: "Provinsi",
              value: "prov",
            },
            {
              label: "Kabupaten/Kota",
              value: "kabkot",
            },
            {
              label: "Industri",
              value: "comp",
            },
          ],
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
              label: "Alpha",
              mail: "alpha",
              value: 1,
            },
            {
              label: "Bravo",
              mail: "bravo",
              value: 2,
            },
            {
              label: "Charlie",
              mail: "charlie",
              value: 3,
            },
            {
              label: "Delta",
              mail: "delta",
              value: 4,
            },
          ],
          emsg: [
            "Data sensor pH melebihi ambang batas!",
            "Data sensor COD melebihi ambang batas!",
            "Data sensor TSS melebihi ambang batas!",
            "Data sensor NH3N melebihi ambang batas!",
            "Data sensor debit melebihi ambang batas!",
          ],
        },
        type: null,
        prov: null,
        city: null,
        comp: null,
        time: null,
      },
      selectedRows: [],
      tableData: [],
    };
  },
  computed: {},
  methods: {
    updateHandler() {
      axios
        .put(
          `${defaults.baseURL}/user/${this.$store.state.userEditData._id}`,
          this.form,
          { headers: { token: this.$store.state.token } }
        )
        .then((res) => {
          this.$router.push("/admin/user");
        });
    },
    getComp(data) {
      const list = this.tempSelect.compList;
      const filterList = list.filter((l) => l.kabkotID === data);
      this.selects.options.comp = filterList;
      this.form.userRole.compID = null;
    },
    getKabkot(data) {
      const list = this.tempSelect.kabkotList;
      const filterList = list.filter((l) => l.provID === data);
      this.selects.options.city = filterList;
      this.form.userRole.kabkotID = null;
      this.form.userRole.compID = null;
    },
    getList() {
      axios
        .get(`${defaults.baseURL}/report/list/5f340d5e328182315c11ee98`, {
          headers: { token: this.$store.state.token },
        })
        .then((res) => {
          this.selects.options.prov = res.data.provList;
          this.selects.options.city = res.data.kabkotList;
          this.selects.options.comp = res.data.compList;
          this.tempSelect = res.data;
        });
    },
    unixTS2DMY(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY, hh:mm");
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
  },
  created() {
    this.getList();
    if (this.$store.state.userEditData._id) {
      this.form = this.$store.state.userEditData;
    }
    // this.generateData();
  },
};
</script>
<style scoped>
.no-border-card .card-footer {
  border-top: 0;
}
.pagin {
  box-shadow: none;
  margin: 0 10px 0 10px;
  border-color: #b4cce1;
  border-radius: 10%;
  width: 66px;
  text-align: center;
  height: 30px;
}
</style>

<style lang="scss">
#listed-report {
  .m-0 {
    .form-group {
      margin: 0;
    }
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
  .el-select--mini {
    .el-input--mini {
      input {
        height: 28px;
      }
    }
  }
}
</style>
