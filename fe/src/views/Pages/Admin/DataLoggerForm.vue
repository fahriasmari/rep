<template>
  <div>
    <div id="listed-report">
      <div
        class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1;"
      >
        <h1 class="display-3 font-weight-light text-white m-0">Admin</h1>
        <h2 class="text-white mx-4 my-0">-</h2>
        <h4 class="text-default m-0">Form Data Logger</h4>
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
                    <label class="col-md-2 col-form-label form-control-label"
                      >Provinsi</label
                    >
                    <div class="col-md-10">
                      <el-select
                        class="w-100 mb-4"
                        v-model="form.prov"
                        placeholder="Provinsi"
                      >
                        <el-option
                          v-for="option in selects.options.prov"
                          :key="option.label"
                          :label="option.label"
                          :value="option.value"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-md-2 col-form-label form-control-label"
                      >Kab/Kot</label
                    >
                    <div class="col-md-10">
                      <el-select
                        class="w-100 mb-4"
                        v-model="form.city"
                        placeholder="Kab/Kot"
                      >
                        <el-option
                          v-for="option in selects.options.city"
                          :key="option.label"
                          :label="option.label"
                          :value="option.value"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-md-2 col-form-label form-control-label"
                      >Industri</label
                    >
                    <div class="col-md-10">
                      <el-select
                        class="w-100 mb-4"
                        v-model="form.comp"
                        placeholder="Nama Industri"
                      >
                        <el-option
                          v-for="option in selects.options.comp"
                          :key="option.label"
                          :label="option.label"
                          :value="option.value"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                  <!-- <div class="form-group row">
                    <label
                      for="example-number-input"
                      class="col-md-2 col-form-label form-control-label"
                    >Jumlah Parameter</label>
                    <div class="col-md-10">
                      <base-input
                        v-model.number="form.pcnt"
                        type="number"
                        placeholder="1"
                        id="example-number-input"
                        @change="changeParamCount()"
                      />
                    </div>
                  </div>-->
                  <div class="form-group row mt--4">
                    <label class="col-md-2 col-form-label form-control-label"
                      >Parameter</label
                    >
                    <div class="col-10 pr-0">
                      <div class="row pr-0">
                        <!-- <template v-for="count in form.pcnt">
                          <div v-if="form.parm[count - 1]" :key="count" class="col-12 row pr-0">
                            <div class="col-4">
                              <el-select
                                v-model="form.parm[count - 1].name"
                                class="w-100 mb-4"
                                placeholder="Parameter"
                              >
                                <el-option
                                  v-for="option in selects.options.parameter"
                                  :key="option.label"
                                  :label="option.label"
                                  :value="option.value"
                                ></el-option>
                              </el-select>
                            </div>
                            <div class="col-4">
                              <base-input
                                v-model="form.parm[count - 1].min"
                                type="number"
                                placeholder="Min"
                                id="example-number-input"
                              />
                            </div>
                            <div class="col-4">
                              <base-input
                                v-model="form.parm[count - 1].max"
                                type="number"
                                placeholder="Max"
                                id="example-number-input"
                              />
                            </div>
                          </div>
                        </template>-->
                        <div class="col-12 row pr-0">
                          <div class="col-4">
                            <el-select
                              v-model="form.parm[0].name"
                              class="w-100 mb-4"
                              placeholder="Parameter"
                              disabled
                            >
                              <el-option
                                v-for="option in selects.options.parameter"
                                :key="option.label"
                                :label="option.label"
                                :value="option.value"
                              ></el-option>
                            </el-select>
                          </div>
                          <div class="col-4">
                            <base-input
                              v-model="form.parm[0].min"
                              type="number"
                              placeholder="Min"
                            />
                          </div>
                          <div class="col-4">
                            <base-input
                              v-model="form.parm[0].max"
                              type="number"
                              placeholder="Max"
                            />
                          </div>
                        </div>
                        <div class="col-12 row pr-0">
                          <div class="col-4">
                            <el-select
                              v-model="form.parm[1].name"
                              class="w-100 mb-4"
                              placeholder="Parameter"
                              disabled
                            >
                              <el-option
                                v-for="option in selects.options.parameter"
                                :key="option.label"
                                :label="option.label"
                                :value="option.value"
                              ></el-option>
                            </el-select>
                          </div>
                          <div class="col-4">
                            <base-input
                              v-model="form.parm[1].min"
                              type="number"
                              placeholder="Min"
                            />
                          </div>
                          <div class="col-4">
                            <base-input
                              v-model="form.parm[1].max"
                              type="number"
                              placeholder="Max"
                            />
                          </div>
                        </div>
                        <div class="col-12 row pr-0">
                          <div class="col-4">
                            <el-select
                              v-model="form.parm[2].name"
                              class="w-100 mb-4"
                              placeholder="Parameter"
                              disabled
                            >
                              <el-option
                                v-for="option in selects.options.parameter"
                                :key="option.label"
                                :label="option.label"
                                :value="option.value"
                              ></el-option>
                            </el-select>
                          </div>
                          <div class="col-4">
                            <base-input
                              v-model="form.parm[2].min"
                              type="number"
                              placeholder="Min"
                            />
                          </div>
                          <div class="col-4">
                            <base-input
                              v-model="form.parm[2].max"
                              type="number"
                              placeholder="Max"
                            />
                          </div>
                        </div>
                        <div class="col-12 row pr-0">
                          <div class="col-4">
                            <el-select
                              v-model="form.parm[3].name"
                              class="w-100 mb-4"
                              placeholder="Parameter"
                              disabled
                            >
                              <el-option
                                v-for="option in selects.options.parameter"
                                :key="option.label"
                                :label="option.label"
                                :value="option.value"
                              ></el-option>
                            </el-select>
                          </div>
                          <div class="col-4">
                            <base-input
                              v-model="form.parm[3].min"
                              type="number"
                              placeholder="Min"
                            />
                          </div>
                          <div class="col-4">
                            <base-input
                              v-model="form.parm[3].max"
                              type="number"
                              placeholder="Max"
                            />
                          </div>
                        </div>
                        <div class="col-12 row pr-0">
                          <div class="col-4">
                            <el-select
                              v-model="form.parm[4].name"
                              class="w-100 mb-4"
                              placeholder="Parameter"
                              disabled
                            >
                              <el-option
                                v-for="option in selects.options.parameter"
                                :key="option.label"
                                :label="option.label"
                                :value="option.value"
                              ></el-option>
                            </el-select>
                          </div>
                          <div class="col-4">
                            <base-input
                              v-model="form.parm[4].min"
                              type="number"
                              placeholder="Min"
                            />
                          </div>
                          <div class="col-4">
                            <base-input
                              v-model="form.parm[4].max"
                              type="number"
                              placeholder="Max"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div class="card-footer">
                <div class="row">
                  <div class="col-10"></div>
                  <div class="col-2">
                    <base-button class="w-100" size="md" type="primary"
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

const axios = require("axios");
const uniqid = require("uniqid");
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary",
    cancelButton: "btn btn-secondary"
  },
  buttonsStyling: false
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
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      form: {
        comp: null,
        city: null,
        prov: null,
        pcnt: 1,
        parm: [
          {
            name: "pH",
            min: 0,
            max: 0
          },
          {
            name: "COD",
            min: 0,
            max: 0
          },
          {
            name: "TSS",
            min: 0,
            max: 0
          },
          {
            name: "NH3N",
            min: 0,
            max: 0
          },
          {
            name: "Debit",
            min: 0,
            max: 0
          }
        ],
        loca: [0, 0]
      },
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
              mail: "alpha",
              value: 1
            },
            {
              label: "Bravo",
              mail: "bravo",
              value: 2
            },
            {
              label: "Charlie",
              mail: "charlie",
              value: 3
            },
            {
              label: "Delta",
              mail: "delta",
              value: 4
            }
          ],
          emsg: [
            "Data sensor pH melebihi ambang batas!",
            "Data sensor COD melebihi ambang batas!",
            "Data sensor TSS melebihi ambang batas!",
            "Data sensor NH3N melebihi ambang batas!",
            "Data sensor debit melebihi ambang batas!"
          ],
          parameter: [
            {
              label: "pH",
              value: "pH"
            },
            {
              label: "COD",
              value: "COD"
            },
            {
              label: "TSS",
              value: "TSS"
            },
            {
              label: "NH3N",
              value: "NH3N"
            },
            {
              label: "Debit",
              value: "Debit"
            }
          ]
        },
        type: null,
        prov: null,
        city: null,
        comp: null,
        time: null
      },
      selectedRows: [],
      tableData: []
    };
  },
  computed: {},
  methods: {
    changeParamCount() {
      this.form.parm = [];
      for (let i = 0; i < this.form.pcnt; i++) {
        this.form.parm.push({
          name: null,
          min: 0,
          max: 0
        });
      }
    },
    generateData(type, prov, city, comp) {
      this.tableData = [];
      const length = 1234;
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
        itype = intRNG(1, 4);
        iprov = intRNG(1, 4);
        icity = intRNG(1, 4);
        icomp = intRNG(1, 4);
        array.push({
          id: uniqid(),
          mail:
            "user-" +
            uniqid() +
            "@" +
            this.selects.options.comp[mcomp === 0 ? icomp : mcomp].mail +
            ".com",
          addr:
            "Jl. " +
            this.selects.options.comp[mcomp === 0 ? icomp : mcomp].label +
            " No. " +
            i +
            ", " +
            this.selects.options.city[mcity === 0 ? icity : mcity].label +
            ", " +
            this.selects.options.prov[mprov === 0 ? iprov : mprov].label,
          type: this.selects.options.type[mtype === 0 ? itype : mtype].label,
          prov: this.selects.options.prov[mprov === 0 ? iprov : mprov].label,
          city: this.selects.options.city[mcity === 0 ? icity : mcity].label,
          comp: this.selects.options.comp[mcomp === 0 ? icomp : mcomp].label
        });
      }
      this.tableData = array;
    },
    downloadData(data) {
      swalWithBootstrapButtons
        .fire({
          title: "Download Data",
          text: "Data will be exported to PDF",
          icon: "info",
          buttons: ["CSV", "PDF"],
          showCancelButton: true,
          confirmButtonText: "CSV",
          cancelButtonText: "PDF",
          reverseButtons: true
        })
        .then(result => {
          if (result) {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += [
              Object.keys(data[0]).join(";"),
              ...data.map(item => Object.values(item).join(";"))
            ]
              .join("\n")
              .replace(/(^\[)|(\]$)/gm, "");

            const data = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", data);
            link.setAttribute("download", "export.csv");
            link.click();
            swalWithBootstrapButtons.fire(
              "Export Success",
              "Your file has been exported.",
              "success"
            );
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              "Cancelled",
              "Export was canceled",
              "error"
            );
          }
        });
    },
    unixTS2DMY(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY, hh:mm");
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    }
  },
  created() {
    this.generateData();
    // this.changeParamCount();
  }
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
