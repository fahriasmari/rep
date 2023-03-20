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
        <h4 class="text-default m-0">List Industri</h4>
      </div>
      <base-header class="pb-8" style="height:200px" type="primary"></base-header>

      <div class="container-fluid mt--9">
        <div class="row justify-content-center mb--4">
          <div class="col-12">

            
            <!-- Searchbox -->
            
            <div class="row ">
              <!-- SEARCBOX COBA -->
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
                        v-for="option in options.regiscomp"
                        :key="option._id"
                        :label="option.umum.compName"
                        :value="option.umum.compName"
                      ></el-option>
                    </el-select>
            </div>
            <div class="col-lg-3  mt-5 mb-3" style="height: 20px">
              <span class="text-white">Validasi</span>
                    <el-select
                      class="w-100"
                       @change="changeFilter($event,'validasi')"
                       v-model="validasi"
                      placeholder="Validasi"
                      
                    >
                    
                      <el-option
                        v-for="option in val_options.validasi"
                        :key="option.name"
                        :label="option.name"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                    <!-- <base-input
                  v-model="searchText"
                  
                  prepend-icon="fas fa-search"
                  placeholder="Silakan Cari ..."
                ></base-input> -->
            </div>
            <!-- END SEARCBOX COBA -->
              <!-- <div class="col-4 mr-4 mt--2 mb-3" style="height: 20px">
                <base-input
                  v-model="searchText"
                  prepend-icon="fas fa-search"
                  placeholder="Silakan Cari ..."
                ></base-input>
              </div> -->
             
            </div>
            <div class="col-lg-12 mb-5 mr-4 mt-7">
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
            <div class="col-12 card">
              <!-- Filter -->
              
              <!-- Table -->

              <el-table
                :data="queriedData"
                row-key="_id"
                header-row-class-name="thead-light"
                @sort-change="sortChange"
                @selection-change="selectionChange"
              >
                <el-table-column label="Nama Penanggungjawab" sortable>
                  <template v-slot="{ row }">
                    <div class="cell">{{ row.akun.personName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="ID Pendaftaran" sortable>
                  <template v-slot="{ row }">
                    <div class="cell">{{ row._id }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="Jenis Industri" sortable>
                  <template v-slot="{ row }">
                    <div class="cell">{{ row.umum.compType }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="Nama Industri" sortable>
                  <template v-slot="{ row }">
                    <div class="cell">{{ row.umum.compName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="Kab/Kot" sortable>
                  <template v-slot="{ row }">
                    <div class="cell">{{ row.umum.compCityName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="Provinsi" sortable>
                  <template v-slot="{ row }">
                    <div class="cell">{{ row.umum.compProvinceName }}</div>
                  </template>
                </el-table-column>
              
                <el-table-column label="Waktu Dibuat/Diubah" prop="umum.updatedAt" sortable >
                  <template v-slot="{ row }">
                    <div class="cell">
                      {{ row.umum.updatedAt ? unixTS2DMYhm(row.umum.updatedAt) : unixTS2DMYhm(row.umum.createdAt) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="Validasi" sortable >
                  <!-- <template v-slot="{ row }">
                    <div class="cell">{{ row.validated }}</div>
                  </template> -->
                  <template v-slot="{ row }">
                    <base-button size="sm" v-if="!row.validated" type="danger"
                      >Menunggu Validasi</base-button
                    >
                    <base-button size="sm" v-if="row.validated" type="primary"
                      >Sudah Tervalidasi</base-button
                    >
                  </template>
                </el-table-column>

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
import moment from "moment";
import clientPaginationMixin from "@/components/clientPaginationMixin";
import swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import Loading from "vue-loading-overlay";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import defaults from "@/util/defaults";

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
      propsToSearch: [["_id"],["akun", "personName"], ["umum", "compName"],["umum", "compType"],["umum", "compCityName"],["umum", "compProvinceName"],['validated']],
      searchQuery: "",
      searchText:"",
      selected: {
        jenisIndustri: null,
        prov: null,
        kabkot: null,
        comp: null,
      },
      val_options: {validasi:[{name:"Semua",value:""},{name:"Validate",value:"true"},{name:"Unvalidate",value:"false"}]},
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
      form: {
        akun: {
          personName: null,
          personPhone: null,
          personMail: null,
          personPassword: null,
          personConfirmPassword: null
        },
        umum: {
          compName: null,
          compType: null,
          compAddress: null,
          compStreet: null,
          compCity: null,
          compProvince: null,
          compPhone: null,
          compMail: null
        },
        teknis: {
          permitFile: {
            path: "",
            upload: 0
          },
          permitPerson: null,
          permitNumber: null,
          permitDatePublish: new Date(),
          permitDateExpire: null,
          wasteSource: null,
          spotCount: null,
          spotName: null,
          spotLocation: [null, null],
          processingTechnique: null,
          wasteType: null,
          debit: null,
          capacityPermit: null,
          capacityActual: null,
          isContinue: false
        },
        validitas: {
          kinerjaFile: {
            path: "",
            upload: 0
          },
          konektifitasFile: {
            path: "",
            upload: 0
          },
          kalibrasiFile: {
            path: "",
            upload: 0
          },
          validitasFile: {
            path: "",
            upload: 0
          }
        },
        frekuensi: {
          jam: null,
          hari: null,
          bulan: null
        },
        logger: [
          {
            brand: null,
            model: null,
            sn: null,
            mac: null
          }
        ],
        sensor: [
          {
            name: "pH",
            label: "pH",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              path: "",
              upload: 0
            },
            min: null,
            max: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            metodeKalibrasi: null
          },
          {
            name: "COD",
            label: "COD",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              path: "",
              upload: 0
            },
            min: null,
            max: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            metodeKalibrasi: null
          },
          {
            name: "TSS",
            label: "TSS",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              path: "",
              upload: 0
            },
            min: null,
            max: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            metodeKalibrasi: null
          },
          {
            name: "NH3N",
            label: "NH3N",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              path: "",
              upload: 0
            },
            min: null,
            max: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            metodeKalibrasi: null
          },
          {
            name: "Debit",
            label: "Debit",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              path: "",
              upload: 0
            },
            min: null,
            max: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            metodeKalibrasi: null
          }
        ],
        sensorDone: false,
        surat: {
          dukunganBrand: {
            path: "",
            upload: 0
          },
          pernyataanVendor: {
            path: "",
            upload: 0
          }
        }
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
          ]
        },
        type: null,
        prov: null,
        city: null,
        comp: null,
        time: null
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
    // update_total_rows(){
    //   this.total_page_filter = true
    // },
    csvData() {
      let formattedData = [];
      let tempData = this.filteredData;
      let z=1;
      let tempSpotName,
        tempSpotLong,
        tempSpotLat = "";
      for (let i = 0; i < tempData.length; i++) {
        tempSpotName = "";
        tempSpotLong = "";
        tempSpotLat = "";
        if (tempData[i].teknis.spotCount != null) {
          tempSpotName = tempData[i].teknis.spotList[0].spotName;
          tempSpotLong = tempData[i].teknis.spotList[0].spotLoc[0];
          tempSpotLat = tempData[i].teknis.spotList[0].spotLoc[1];
        }
        formattedData.push({
          1: z,
          2: tempData[i]._id,
          3: tempData[i].umum.loggerID,
          4: tempData[i].umum.updatedAt,
          5: tempData[i].akun.personName,
          6: tempData[i].akun.personPhone,
          7: tempData[i].akun.personMail,
          8: "",
          9: tempData[i].umum.compName,
          10: tempData[i].umum.compType,
          11: tempData[i].umum.nameSIUP,
          12: tempData[i].umum.compAddress,
          13: tempData[i].umum.compStreet,
          14: tempData[i].umum.compCityName,
          15: tempData[i].umum.compProvinceName,
          16: tempData[i].umum.compPhone,
          17: tempData[i].umum.compMail,
          18: tempData[i].teknis.permitPerson,
          19: tempData[i].teknis.permitNumber,
          20: tempData[i].teknis.permitDatePublish,
          21: tempData[i].teknis.permitDateExpire,
          22: tempData[i].teknis.wasteSource,
          23: tempData[i].teknis.spotCount,
          24: tempSpotName,
          25: tempSpotLong,
          26: tempSpotLat,
          27: tempData[i].teknis.processingTechnique,
          28: tempData[i].teknis.wasteType,
          29: tempData[i].teknis.debit,
          30: tempData[i].teknis.capacityPermit,
          31: tempData[i].teknis.capacityActual,
          32: tempData[i].teknis.frequenceDet,
          33: tempData[i].frekuensi.jam,
          34: tempData[i].frekuensi.hari,
          35: tempData[i].frekuensi.bulan,
          36: tempData[i].validitas.lulusUji,
          37: tempData[i].validitas.namaPenyedia,
          38: tempData[i].logger[0].brand,
          39: tempData[i].logger[0].model,
          40: tempData[i].logger[0].sn,
          41: tempData[i].logger[0].mac,
          42: tempData[i].sensor[0].brand,
          43: tempData[i].sensor[0].probe,
          44: `${defaults.baseURL}/${tempData[i].sensor[0].brosurFile.path}`,
          45: tempData[i].sensor[0].min,
          46: tempData[i].sensor[0].max,
          47: tempData[i].sensor[0].metodePengukuran,
          48: tempData[i].sensor[0].jadwalKalibrasi,
          49: tempData[i].sensor[0].metodeKalibrasi,
          50: tempData[i].sensor[1].brand,
          51: tempData[i].sensor[1].probe,
          52: `${defaults.baseURL}/${tempData[i].sensor[1].brosurFile.path}`,
          53: tempData[i].sensor[1].min,
          54: tempData[i].sensor[1].max,
          55: tempData[i].sensor[1].metodePengukuran,
          56: tempData[i].sensor[1].jadwalKalibrasi,
          57: tempData[i].sensor[1].metodeKalibrasi,
          58: tempData[i].sensor[2].brand,
          59: tempData[i].sensor[2].probe,
          60: `${defaults.baseURL}/${tempData[i].sensor[2].brosurFile.path}`,
          61: tempData[i].sensor[2].min,
          62: tempData[i].sensor[2].max,
          63: tempData[i].sensor[2].metodePengukuran,
          64: tempData[i].sensor[2].jadwalKalibrasi,
          65: tempData[i].sensor[2].metodeKalibrasi,
          66: tempData[i].sensor[3].brand,
          67: tempData[i].sensor[3].probe,
          68: `${defaults.baseURL}/${tempData[i].sensor[3].brosurFile.path}`,
          69: tempData[i].sensor[3].min,
          70: tempData[i].sensor[3].max,
          71: tempData[i].sensor[3].metodePengukuran,
          72: tempData[i].sensor[3].jadwalKalibrasi,
          73: tempData[i].sensor[3].metodeKalibrasi,
          74: tempData[i].sensor[4].brand,
          75: tempData[i].sensor[4].probe,
          76: `${defaults.baseURL}/${tempData[i].sensor[4].brosurFile.path}`,
          77: tempData[i].sensor[4].min,
          78: tempData[i].sensor[4].max,
          79: tempData[i].sensor[4].metodePengukuran,
          80: tempData[i].sensor[4].jadwalKalibrasi,
          81: tempData[i].sensor[4].metodeKalibrasi,
          82: tempData[i].sensor[4].metodeKalibrasi,
          83: tempData[i].validated ? "Sudah Tervalidasi" : "Menunggu Validasi"
        });
        z++;
      }
      return formattedData;
    }
  },
  methods: {
    async changeFilter(event,type){
     
      if(type =="jenis_industri"){
        // this.jenisIndustri = event;
        // this.searchText = event
        this.jenisIndustri = event;
        this.searchText = event;
        this.getListPendaftaran();
        this.industri ="";
        this.provinsi ="";
        this.validasi = "";
        if(event !=""){
          this.tableData = this.tableData.filter(x => x.umum.compType === event)
          this.filter_data.count = this.tableData.length
          this.filter_data.status = true
        }
        else {
          this.getListPendaftaran()
          this.filter_data.count = this.tableData.length
          this.filter_data.status = false
        }
      }
      else if(type == "industri"){
        this.industri = event;
        this.searchText = event;
        this.getListPendaftaran();
        this.jenisIndustri ="";
        this.provinsi =""; 
        this.validasi = "";
        if(event !=""){
          this.tableData = this.tableData.filter(x => x.umum.compName === event)
          this.filter_data.count = this.tableData.length
          this.filter_data.status = true
        }
        else {
          this.getListPendaftaran()
          this.filter_data.count = this.tableData.length
          this.filter_data.status = false
        }
       
      }
      else if(type == "provinsi"){
        this.provinsi = event;
        this.searchText = event;
        this.getListPendaftaran();
        this.jenisIndustri = ""
        this.kabkot = ""
        this.industri = ""
        this.validasi = "";

        if(event !=""){
          this.tableData = this.tableData.filter(x => x.umum.compProvinceName === event)
          this.filter_data.count = this.tableData.length
          this.filter_data.status = true
        }
        else {
          this.getListPendaftaran()
          this.filter_data.count = this.tableData.length
          this.filter_data.status = false
        }
       
      }
      else if(type == "kabkot"){
        this.industri = event;
        this.searchText = event;
        this.getListPendaftaran();
        this.jenisIndustri ="";
        this.industri =""; 
        this.provinsi =""; 
        this.validasi = "";
        if(event !=""){
          this.tableData = this.tableData.filter(x => x.umum.compCityName === event)
          this.filter_data.count = this.tableData.length
          this.filter_data.status = true
        }
        else {
          this.getListPendaftaran()
          this.filter_data.count = this.tableData.length
          this.filter_data.status = false
        }
       
      }
      else if(type == "validasi"){
        this.validasi = event;
        this.searchText = event;
        this.getListPendaftaran();
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
          this.getListPendaftaran()
          this.filter_data.count = this.tableData.length
          this.filter_data.status = false
        }
       
      }
    },
    
    getList() {
      const auth = JSON.parse(localStorage.getItem("auth-data"));
      axios
        .get(`${defaults.baseURL}/report/list-regiscomp/${auth._id}`, {
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
   
    downloadCSV(data) {
     
      let csv;

      // Loop the array of objects
      for (let row = 0; row < data.length; row++) {
        let keysAmount = Object.keys(data[row]).length;
        let keysCounter = 0;

        // If this is the first row, generate the headings
        if (row === 0) {
          // Loop each property of the object
          for (let key in data[row]) {
            // This is to not add a comma at the last cell
            // The '\r\n' adds a new line
            csv += key + (keysCounter + 1 < keysAmount ? "," : "\r\n");
            keysCounter++;
          }
        } else {
          for (let key in data[row]) {
            csv +=
              data[row][key] + (keysCounter + 1 < keysAmount ? "," : "\r\n");
            keysCounter++;
          }
        }

        keysCounter = 0;
      }

      // Once we are done looping, download the .csv by creating a link
      let link = document.createElement("a");
      link.id = "download-csv";
      link.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(csv)
      );
      link.setAttribute("download", "export.csv");
      document.body.appendChild(link);
      document.querySelector("#download-csv").click();

         swal.fire({
        title: "Download Berhasil",
        text: "List berhasil terdownload",
        icon: "success",
      });

      // swalWithBootstrapButtons.fire(
      //   "Export Success",
      //   "Your file has been exported.",
      //   "success"
      // );
    },
    // downloadCSV(data) {
    //   let csvContent = "data:text/csv;charset=utf-8,";
    //   csvContent += [
    //     Object.keys(data[0]).join(";"),
    //     ...data.map((item) => Object.values(item).join(";")),
    //   ]
    //     .join("\n")
    //     .replace(/(^\[)|(\]$)/gm, "");

    //   const tempData = encodeURI(csvContent);
    //   const link = document.createElement("a");
    //   link.setAttribute("href", tempData);
    //   link.setAttribute("download", "ListPendaftaran.csv");
    //   link.click();
    //   swal.fire({
    //     title: "Download Berhasil",
    //     text: "List berhasil terdownload",
    //     icon: "success",
    //   });
    // },
    unixTS2DMYhm(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY, hh:mm");
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
          if(result.isConfirmed){
            axios
            .delete(`${defaults.baseURL}/form/delete-form/${id}`, {
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
                showCancelButton: false,
                showConfirmButton: false,
                cancelButtonColor: "#d33"
              });
              console.log(err);
            });
          }
          else if(result.isDismissed){
            swal.fire({
                title: "Membatalkan",
                text: "Anda Membatalkan Proses Delete Ini",
                icon: "error",
                showCancelButton: false,
                showConfirmButton: false,
                cancelButtonColor: "#d33"
              });
          }
        });
    },
    getTableData() {
      axios
        .get(`${defaults.baseURL}/comp/list`, {
          headers: { token: this.$store.state.token }
        })
        .then(res => {
          this.tableData = res.data;
        });
    },
    openDetail(row) {
      this.$store.commit("setPendaftarData", row);
      this.$router.push("/admin/detail/pendaftar");
    },
    intRNG(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    getListPendaftaran() {
      axios
        .get(`${defaults.baseURL}/form/list-pendaftaran`, {
          headers: { token: this.$store.state.token }
        })
        .then(res => {
          this.tableData = res.data;
        })
        .catch(err => console.log(err));
    },
    exportExcel() {
      window.open(`${defaults.baseURL}/form/list-pendaftaran-export`, "_blank");
    },
  },
  created() {
    // this.getTableData();
    // this.generateData(1234);
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
