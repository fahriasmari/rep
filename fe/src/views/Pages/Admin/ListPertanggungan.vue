<template>
  <div>
    <div id="listed-report">
      <div
        class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1"
      >
        <h1 class="display-3 font-weight-light text-white m-0">Admin</h1>
        <h2 class="text-white mx-4 my-0">-</h2>
        <h4 class="text-default m-0">List Pertanggungan COVID-19</h4>
      </div>
      <base-header
        class="pb-8"
        style="height:200px"
        type="primary"
      ></base-header>

      <div class="container-fluid mt--9">
        <div class="row justify-content-center mb--4">
          <div class="col-12">
            <div class="row justify-content-between">
              <div class="col-lg-3 mt--2 mb-3" style="height: 20px">
                <span class="text-white">Jenis Industri</span>
                <el-select
                  class="w-100"
                  @change="flterJenisIndustri"
                  v-model="jenisIndustri"
                  filterable
                  placeholder="Jenis Industri"
                >
                  <el-option
                    v-for="option in tempJenisIndustri"
                    :key="option.id"
                    :label="option.value"
                    :value="option.value"
                  />
                </el-select>
              </div>
              <div class="col-lg-3  mt--2 mb-3" style="height: 20px">
                <span class="text-white">Provinsi</span>
                <el-select
                  class="w-100"
                  @change="flterProvinsi"
                  v-model="provinsi"
                  placeholder="provinsi"
                  filterable
                >
                  <el-option
                    v-for="option in options.provList"
                    :key="option.name"
                    :label="option.name"
                    :value="option.value"
                  />
                </el-select>
              </div>
              <div class="col-lg-3  mt--2 mb-3" style="height: 20px">
                <span class="text-white">Kabkot</span>
                <el-select
                  class="w-100"
                  @change="flterKabKot"
                  v-model="kabkot"
                  placeholder="kabkot"
                  filterable
                >
                  <el-option
                    v-for="option in options.kabkotList"
                    :key="option.name"
                    :label="option.name"
                    :value="option.value"
                  />
                </el-select>
              </div>
              <div class="col-lg-3  mt--2 mb-3" style="height: 20px">
                <span class="text-white">Industri</span>
                <el-select
                  class="w-100"
                  @change="flterIndustri"
                  v-model="industri"
                  placeholder="Industri"
                  filterable
                >
                  <el-option
                    v-for="option in options.regisCovid"
                    :key="option._id"
                    :label="option._id"
                    :value="option._id"
                  />
                </el-select>
              </div>
            </div>
            <div class="row my-5">
              <div class="col-12">
                <!-- <base-button
                  class="float-right"
                  @click="downloadCSV(csvData)">
                  Download
                </base-button> -->
                <base-button class="float-right" @click="exportExcel">
                  Download
                </base-button>
              </div>
            </div>

            <div class="col-12 card">
              <!-- Table -->
              <el-table
                :data="queriedData"
                row-key="_id"
                header-row-class-name="thead-light"
                @sort-change="sortChange"
                @selection-change="selectionChange"
              >
                <el-table-column
                  label="Nama Perusahaan"
                  prop="detail.compName"
                  min-width
                  align="left"
                  sortable
                />
                <el-table-column
                  label="ID Pendaftaran"
                  prop="_id"
                  min-width
                  align="left"
                  sortable
                />
                <el-table-column
                  label="Jenis Industri"
                  prop="detail.compType"
                  min-width
                  align="left"
                  sortable
                />
                <el-table-column
                  label="Provinsi"
                  prop="detail.compProvinceName"
                  min-width
                  align="left"
                  sortable
                />
                <el-table-column
                  label="Kabkot"
                  prop="detail.compCityName"
                  min-width
                  align="left"
                  sortable
                />
                <el-table-column
                  label="Alamat Industri"
                  prop="detail.compAddress"
                  min-width
                  align="left"
                  sortable
                />
                <el-table-column
                  label="Kontak Personal Sparing"
                  prop="detail.compCP"
                  min-width
                  align="left"
                  sortable
                />
                <el-table-column
                  label="Waktu Dibuat/Diubah"
                  :prop="'updatedAt' || 'createdAt'"
                  sortable
                >
                  <template v-slot="{ row }">
                    <div class="cell">
                      {{
                        row.detail.hasOwnProperty("updatedAt")
                          ? unixTS2DMYhm(row.detail.updatedAt)
                          : unixTS2DMYhm(row.detail.createdAt)
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Status"
                  prop="detail.tahap"
                  min-width
                  align="left"
                  sortable
                />
                <el-table-column align="center" label="Action">
                  <template v-slot="{ row }">
                    <base-button
                      size="sm"
                      type="success"
                      @click="openDetail(row)"
                      >View</base-button
                    >
                    <base-button
                      size="sm"
                      type="danger"
                      @click="deleteForm(row._id)"
                      >Delete</base-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div
                v-if="filter_data.status == false"
                slot="footer"
                class="col-12 my-2 d-flex justify-content-center justify-content-sm-between flex-wrap"
              >
                <div class="d-flex align-items-center">
                  <p class="card-category mb-0 mr-2">Show</p>
                  <div style="width: 80px">
                    <el-select
                      class="select-primary pagination-select"
                      v-model="pagination.perPage"
                      placeholder="Per page"
                      size="mini"
                    >
                      <el-option
                        class="select-primary"
                        v-for="item in pagination.perPageOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </div>
                  <p class="card-category m-0 ml-2">
                    Showing {{ from + 1 }} to {{ to }} of {{ total }} entries
                    <span v-if="selectedRows.length"
                      >&nbsp; &nbsp; {{ selectedRows.length }} rows
                      selected</span
                    >
                  </p>
                </div>
                <base-pagination
                  class="pagination-no-border"
                  v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total="total"
                ></base-pagination>
              </div>
              <!-- jika ada filter count total -->
              <div
                v-else
                slot="footer"
                class="
                  col-12
                  my-2
                  d-flex
                  justify-content-center justify-content-sm-between
                  flex-wrap
                "
              >
                <div class="d-flex align-items-center">
                  <p class="card-category mb-0 mr-2">Show</p>
                  <div style="width: 80px">
                    <el-select
                      class="select-primary pagination-select"
                      v-model="pagination.perPage"
                      placeholder="Per page"
                      size="mini"
                    >
                      <el-option
                        class="select-primary"
                        v-for="item in pagination.perPageOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </div>
                  <p class="card-category m-0 ml-2">
                    Showing {{ from + 1 }} to {{ to }} of
                    {{ filter_data.count }} entries
                    <span v-if="selectedRows.length"
                      >&nbsp; &nbsp; {{ selectedRows.length }} rows
                      selected</span
                    >
                  </p>
                </div>
                <base-pagination
                  class="pagination-no-border"
                  v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total="filter_data.count"
                ></base-pagination>
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
import moment from "moment";
import clientPaginationMixin from "@/components/clientPaginationMixin";
import swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import defaults from "@/util/defaults";
import { jenisIndustri as tempJenisIndustri } from "@/data/jenis-industri";

const axios = require("axios");

export default {
  mixins: [clientPaginationMixin],
  components: {
    BasePagination,
    BaseInput,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      options: {
        jenisIndustri: [],
        provList: [],
        kabkotList: [],
        compList: []
      },
      jenisIndustri: "",
      industri: "",
      provinsi: "",
      kabkot: "",
      validasi: "",
      tempJenisIndustri,
      form: {
        tahap: 0,
        bukti: {
          detail: {
            compName: "",
            compType: "",
            compAddress: "",
            compCP: "",
            tahap: ""
          },
          fileTender: {
            label: "",
            path: "",
            upload: 0
          },
          fileVendor: {
            label: "",
            path: "",
            upload: 0
          },
          fileJadwal: {
            label: "",
            path: "",
            upload: 0
          },
          photoPemasangan: {
            label: "",
            path: "",
            upload: 0
          },
          photoSPARING: {
            label: "",
            path: "",
            upload: 0
          },
          filePemasangan: {
            label: "",
            path: "",
            upload: 0
          },
          fileCommission: {
            label: "",
            path: "",
            upload: 0
          },
          filePengoperasion: {
            label: "",
            path: "",
            upload: 0
          }
        }
      },
      selectedRows: [],
      tableData: [],
      tempData: [],
      filter_data: {
        count: 0,
        status: false
      }
    };
  },
  computed: {
    csvData() {
      let formattedData = [];
      let tempData = this.filteredData;
      let z = 1;
      for (let i = 0; i < tempData.length; i++) {
        formattedData.push({
          No: z,
          "ID Pendaftaran": tempData[i]._id,
          "Waktu Pendaftaran": moment
            .unix(tempData[i].detail.createdAt)
            .calendar(),
          "Nama Perusahaan": tempData[i].detail.compName,
          "Jenis Industri": tempData[i].detail.compType,
          "Alamat Perusahaan": tempData[i].detail.compAddress,
          Provinsi: tempData[i].detail.compProvinceName
            ? tempData[i].detail.compProvinceName
            : "",
          "Kabupaten/Kota": tempData[i].detail.compCityName
            ? tempData[i].detail.compCityName
            : "",
          "Telepon Kantor": tempData[i].detail.compPhone,
          "Email Kantor": tempData[i].detail.compMail,
          "Penanggungjawab Sparing": tempData[i].detail.compCP,
          "Handphone Penanggungjawab Sparing": tempData[i].detail.personPhone,
          "Email Penanggungjawab Sparing": tempData[i].detail.personMail
        });
        z++;
      }
      return formattedData;
    }
  },
  methods: {
    flterJenisIndustri() {
      this.provinsi = null;
      this.kabkot = null;
      this.industri = null;
      if (this.jenisIndustri) {
        this.tableData = this.tempData.filter(
          item => item.detail.compType === this.jenisIndustri
        );
      } else {
        this.tableData = this.tempData;
      }
    },
    flterProvinsi() {
      this.jenisIndustri = null;
      this.kabkot = null;
      this.industri = null;
      if (this.provinsi) {
        this.tableData = this.tempData.filter(
          item => item.detail.compProvinceName === this.provinsi
        );
      } else {
        this.tableData = this.tempData;
      }
    },
    flterKabKot() {
      this.jenisIndustri = null;
      this.provinsi = null;
      this.industri = null;
      if (this.kabkot) {
        this.tableData = this.tempData.filter(
          item => item.detail.compCityName === this.kabkot
        );
      } else {
        this.tableData = this.tempData;
      }
    },
    flterIndustri() {
      this.jenisIndustri = null;
      this.provinsi = null;
      this.kabkot = null;
      if (this.industri) {
        this.tableData = this.tempData.filter(
          item => item.detail.compName === this.industri
        );
      } else {
        this.tableData = this.tempData;
      }
    },
    getList() {
      const auth = JSON.parse(localStorage.getItem("auth-data"));
      axios
        .get(`${defaults.baseURL}/report/list-regiscovid/${auth._id}`, {
          headers: { token: this.$store.state.token }
        })
        .then(res => {
          let tempAllListData = res.data;
          tempAllListData.provList.unshift({ name: "Semua", value: "" });
          tempAllListData.kabkotList.unshift({ name: "Semua", value: "" });
          tempAllListData.compList.unshift({ name: "Semua", value: "" });
          localStorage.setItem("allList", JSON.stringify(tempAllListData));
          this.options = tempAllListData;
        })
        .catch(err => {
          console.log(err);
        });
    },
    objectToCsv(data) {
      const csvRows = [];
      // GET THE HEADER
      const headers = Object.keys(data[0]);
      csvRows.push(headers.join(";"));

      // LOOP over the rows

      for (const row of data) {
        const values = headers.map(header => {
          const escaped = ("" + row[header]).replace(/(^\[)|(\]$)/gm, "");
          // const escaped = ("" + row[header]).replace(/"/g, '\\"');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(";"));
      }
      return csvRows.join("\n");
    },
    myDownloadCSV(data) {
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "ListCovid-19.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    downloadCSV(data) {
      // let csvContent = "data:text/csv;charset=utf-8,";
      // csvContent += [
      //   Object.keys(data[0]).join(";"),
      //   ...data.map((item) => Object.values(item).join(";")),
      // ]
      //   .join("\n")
      //   .replace(/(^\[)|(\]$)/gm, "");
      // const tempData = encodeURI(csvContent);
      // const link = document.createElement("a");
      // link.setAttribute("href", tempData);
      // link.setAttribute("download", "ListCovid-19.csv");
      // link.click();
      // swal.fire({
      //   title: "Download Berhasil",
      //   text: "List berhasil terdownload",
      //   icon: "success",
      // });
      const csvData = this.objectToCsv(data);

      // download
      this.myDownloadCSV(csvData);
    },
    unixTS2DMYhm(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY, HH:mm");
    },
    deleteForm(id) {
      swal
        .fire({
          title: "Delete?",
          text: "Apakah Anda yakin untuk mendelete from ini?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Delete!",
          cancelButtonText: "Cancel",
          reverseButtons: true
        })
        .then(result => {
          if (result.isConfirmed) {
            axios
              .delete(`${defaults.baseURL}/covid/${id}`, {
                headers: { token: this.$store.state.token }
              })
              .then(res => {
                this.getListPendaftaran();
                swal.fire({
                  title: "Delete Berhasil",
                  text: "Form berhasil terdelete",
                  icon: "success"
                });
              })

              .catch(err => {
                swal.fire({
                  title: "Error",
                  text: "Delete gagal",
                  icon: "error",
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: "#d33"
                });
                console.log(err);
              });
          }
        });
    },
    openDetail(row) {
      this.$store.commit("setCOVIDData", row);
      this.$router.push("/admin/detail/pertanggungan");
    },
    intRNG(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    getListPendaftaran() {
      axios
        .get(`${defaults.baseURL}/covid/list`, {
          headers: { token: this.$store.state.token }
        })
        .then(res => {
          this.tableData = res.data;
          this.tempData = res.data;
        });
    },
    exportExcel() {
      window.open(`${defaults.baseURL}/covid/export`, "_blank");
    }
  },
  created() {
    this.getListPendaftaran();
    this.getList();
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
    .el-table__row {
      &:hover {
        background: transparent;
        cursor: unset;
      }
    }
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
