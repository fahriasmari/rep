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
        <h4 class="text-default m-0">List User</h4>
      </div>
      <base-header style="height:200px" class="pb-8" type="primary"></base-header>

      <div class="container-fluid mt--9">
        <div class="row justify-content-center mb--4">
          
          <div class="col-12">
            <div class="row justify-content-between">
              <!-- <div class="col-4 mr-4 mt--2 mb-3" style="height: 20px">
                <base-input
                  v-model="searchText"
                  prepend-icon="fas fa-search"
                  placeholder="Silakan Cari ..."
                ></base-input>
              </div> -->
              <div class="col-lg-3 mt--2 mb-3" style="height: 20px">
              <span class="text-white">Jenis Industri</span>
                   <el-select
                      class="w-100"
                      @change="changeFilter($event,'jenis_industri')"
                      v-model="jenisIndustri"
                      filterable
                      placeholder="Jenis Industri"
                    >
                      <el-option
                        v-for="option in tempJenisIndustri"
                        :key="option.name"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
            </div>
            <div class="col-lg-3  mt--2 mb-3" style="height: 20px">
              <span class="text-white">Provinsi</span>
                    <el-select
                      class="w-100"
                       @change="changeFilter($event,'provinsi')"
                       v-model="provinsi"
                      placeholder="provinsi"
                      filterable
                    >
                     <el-option
                        v-for="option in options.provList"
                        :key="option.name"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
            </div>
            <div class="col-lg-3  mt--2 mb-3" style="height: 20px">
              <span class="text-white">Kabkot</span>
                    <el-select
                      class="w-100"
                       @change="changeFilter($event,'kabkot')"
                       v-model="kabkot"
                      placeholder="kabkot"
                      filterable
                    >
                     <el-option
                        v-for="option in options.kabkotList"
                        :key="option.name"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
            </div>
            <div class="col-lg-3  mt--2 mb-3" style="height: 20px">
              <span class="text-white">Industri</span>
                    <el-select
                      class="w-100"
                       @change="changeFilter($event,'industri')"
                       v-model="industri"
                      placeholder="Industri"
                      filterable
                    >
                      <el-option
                        v-for="option in options.compList"
                        :key="option.name"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
            </div>
            <div class="col-lg-12 mb-5 mr-4 mt-5">
              <base-button
                style="float:right;margin-bottom:30px;"
                @click="exportExcel">
                Download
              </base-button>
              <!-- <base-button
                style="float:right;margin-bottom:30px;"
                @click="downloadCSV(csvData)"
              >
                Download
              </base-button> -->
            </div>
            </div>
            
            
            <div class="card">
              <!-- Filter -->

              <!-- Table -->
              <el-table
                :data="queriedData"
                row-key="_id"
                header-row-class-name="thead-light"
                @sort-change="sortChange"
                @selection-change="selectionChange"
              >
                <el-table-column
                  label="Email"
                  prop="userEmail"
                  min-width
                  align="left"
                  sortable
                ></el-table-column>
                <el-table-column
                  label="Nama Industri"
                  prop="companyDetails.compName"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  label="Jenis Industri"
                  prop="companyDetails.compType"
                  min-width
                  sortable
                ></el-table-column>

                <el-table-column
                  label="Kab/Kot"
                  prop="kabkotDetails.kabkotName"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  label="Provinsi"
                  prop="provDetails.provName"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  label="Alamat"
                  prop="companyDetails.compAddress"
                  min-width
                  align="left"
                  sortable
                ></el-table-column>
                <el-table-column>
                  <template slot-scope="test">
                    <base-button
                      type="primary"
                      @click="edit(test.$index, test.row)"
                      >Edit</base-button
                    >
                    <!-- <base-button type="danger">Delete</base-button> -->
                  </template>
                </el-table-column>
              </el-table>
              <div
                v-if="filter_data.status == false"
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
                    Showing {{ from + 1 }} to {{ to }} of {{ filter_data.count }} entries
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
      propsToSearch: [["_id"], ["userEmail"],["companyDetails", "compName"],["companyDetails", "compType"],["provDetails", "provName"],["kabkotDetails", "kabkotName"]],
      searchQuery: "",
      selected: {
        jenisIndustri: null,
        prov: null,
        kabkot: null,
        comp: null,
      },
      val_options: {validasi:[{name:"Semua",value:""},{name:"true",value:"true"},{name:"false",value:"false"}]},
       options: {
        jenisIndustri: [],
        provList: [],
        kabkotList: [],
        compList: [],
       
      },
      jenisIndustri :"",
      industri :"",
      provinsi :"",
      kabkot :"",
      validasi :"",
      tempJenisIndustri: [
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
      filter_data : {
        count:0,
        status : false
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
          "Email": tempData[i].userEmail,
          // "Waktu Pendaftaran": moment
          //   .unix(tempData[i].detail.createdAt)
          //   .calendar(),
          "Nama Industri": tempData[i].companyDetails.compName,
          "Jenis Industri": tempData[i].companyDetails.compType,
          "Alamat Perusahaan": tempData[i].companyDetails.compAddress,
          Provinsi: tempData[i].provDetails.provName
            ? tempData[i].provDetails.provName
            : "",
          "Kabupaten/Kota": tempData[i].kabkotDetails.kabkotName
            ? tempData[i].kabkotDetails.kabkotName
            : ""
        });
        z++
      }
      return formattedData;
    },
  },
  methods: {
    async changeFilter(event,type){
     
      if(type =="jenis_industri"){
        // this.jenisIndustri = event;
        // this.searchText = event
        this.jenisIndustri = event;
        this.searchText = event;
        this.getListUsers();
        this.industri ="";
        this.provinsi ="";
        this.validasi = "";
        if(event !=""){
          this.tableData = this.tableData.filter(x => x.companyDetails.compType === event)
          this.filter_data.count = this.tableData.length
          this.filter_data.status = true
        }
        else {
          this.getListUsers()
          this.filter_data.count = this.tableData.length
          this.filter_data.status = false
        }
      }
      else if(type == "industri"){
        this.industri = event;
        this.searchText = event;
        this.getListUsers();
        this.jenisIndustri ="";
        this.provinsi =""; 
        this.validasi = "";
        if(event !=""){
          this.tableData = this.tableData.filter(x => x.companyDetails.compName === event)
          this.filter_data.count = this.tableData.length
          this.filter_data.status = true
        }
        else {
          this.getListUsers()
          this.filter_data.count = this.tableData.length
          this.filter_data.status = false
        }
       
      }
      else if(type == "provinsi"){
        this.provinsi = event;
        this.searchText = event;
        this.getListUsers();
        this.jenisIndustri = ""
        this.kabkot = ""
        this.industri = ""
        this.validasi = "";

        if(event !=""){
          this.tableData = this.tableData.filter(x => x.companyDetails.compProvinceName === event)
          this.filter_data.count = this.tableData.length
          this.filter_data.status = true
        }
        else {
          this.getListUsers()
          this.filter_data.count = this.tableData.length
          this.filter_data.status = false
        }
       
      }
      else if(type == "kabkot"){
        this.industri = event;
        this.searchText = event;
        this.getListUsers();
        this.jenisIndustri ="";
        this.industri =""; 
        this.provinsi =""; 
        this.validasi = "";
        if(event !=""){
          this.tableData = this.tableData.filter(x => x.companyDetails.compCityName === event)
          this.filter_data.count = this.tableData.length
          this.filter_data.status = true
        }
        else {
          this.getListUsers()
          this.filter_data.count = this.tableData.length
          this.filter_data.status = false
        }
       
      }
      else if(type == "validasi"){
        this.validasi = event;
        this.searchText = event;
        this.getListUsers();
        this.jenisIndustri ="";
        this.industri =""; 
        this.provinsi =""; 
        this.kabkot =""; 
        if(event !=""){
          this.tableData = this.tableData.filter(x => x.validated.toString() === event)
          this.filter_data.count = this.tableData.length
          this.filter_data.status = true
        }
        else {
          this.getListUsers()
          this.filter_data.count = this.tableData.length
          this.filter_data.status = false
        }
       
      }
    },
    getList() {
      const auth = JSON.parse(localStorage.getItem("auth-data"));
      axios
        .get(`${defaults.baseURL}/report/list/${auth._id}`, {
          headers: { token: this.$store.state.token },
        })
        .then((res) => {
          let tempAllListData = res.data;
          tempAllListData.provList.unshift({ name: "Semua", value: "" });
          tempAllListData.kabkotList.unshift({ name: "Semua", value: "" });
          tempAllListData.compList.unshift({ name: "Semua", value: "" });
          localStorage.setItem("allList", JSON.stringify(tempAllListData));
          this.options = tempAllListData;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    edit(id, row) {
      const payload = {
        _id: row._id,
        userEmail: row.userEmail,
        userPassword: row.userPassword,
        userRole: row.userRole,
      };
      this.$store.commit("setUserEditData", payload);
      this.$router.push("/admin/userform");
    },
    objectToCsv(data) {
      const csvRows = [];
      // GET THE HEADER
      const headers = Object.keys(data[0]);
      csvRows.push(headers.join(";"));

      // LOOP over the rows

      for (const row of data) {
        const values = headers.map((header) => {
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
      a.setAttribute("download", "ListUsers.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    downloadCSV(data) {
      const csvData = this.objectToCsv(data);

      // download
      this.myDownloadCSV(csvData);
    },

    unixTS2DMY(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY, hh:mm");
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    getListUsers(){
      axios
      .get(`${defaults.baseURL}/user/list`, {
        headers: { token: this.$store.state.token },
      })
      .then((res) => {
        this.tableData = res.data;
      });
    },
    exportExcel() {
      window.open(`${defaults.baseURL}/user/list-export`, "_blank");
    },
  },
  created() {
    
      this.getListUsers();
      this.getList();
    //this.generateData();
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
