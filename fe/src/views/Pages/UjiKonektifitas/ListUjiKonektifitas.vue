<template>
  <div>
    <div id="list-ujikonek">
      <div
        class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1"
      >
        <h1 class="display-3 font-weight-light text-white m-0">Admin</h1>
        <h2 class="text-white mx-4 my-0">-</h2>
        <h4 class="text-default m-0">Daftar Uji Konektifitas</h4>
      </div>
      <base-header
        style="height:250px"
        class="pb-8"
        type="primary"
      ></base-header>
      <div class="container-fluid" style="margin-top: -12rem;">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="card">
              <div class="row mt-2">
                <div class="col-12">
                  <button
                    class="btn btn-primary float-right mr-36"
                    @click="handleDownload"
                  >
                    Download
                  </button>
                </div>
              </div>
              <div class="search-button">
                <div class="col-4">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="search"
                        ><i class="fas fa-search"></i
                      ></span>
                    </div>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Cari..."
                      aria-label="Search"
                      aria-describedby="search"
                      @input="handleSearch"
                      v-model="keyword"
                    />
                  </div>
                </div>
                <div class="col-lg-3 input-group mb-3">
                  <select
                    v-model="status"
                    class="form-control"
                    @change="filterStatus"
                  >
                    <option value="" disabled selected>Filter Status</option>
                    <option value="all">Semua</option>
                    <option value="accepted">Diterima</option>
                    <option value="rejected">Ditolak</option>
                    <option value="pending">Menunggu Validasi</option>
                  </select>
                </div>
              </div>
              <el-table
                :data="queriedData"
                row-key="_id"
                header-row-class-name="thead-light"
                @sort-change="sortChange"
                @selection-change="selectionChange"
              >
                <el-table-column
                  label="ID Pendaftaran"
                  prop="_id"
                  min-width
                  align="left"
                  sortable
                />
                <el-table-column
                  label="Nama Industri"
                  prop="umum.companyName"
                  min-width
                  align="left"
                  sortable
                />
                <el-table-column
                  label="Nama Penanggung Jawab"
                  prop="umum.responsiblePerson"
                  min-width
                  align="left"
                  sortable
                />
                <el-table-column
                  label="Dibuat pada"
                  prop="created_time"
                  sortable
                >
                  <template v-slot="{ row }">
                    <div class="cell">
                      {{ dateTime(row.created_time, "DD/MM/YYYY HH:mm") }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Diubah pada">
                  <template v-slot="{ row }">
                    <div class="cell">
                      {{
                        getLastCreatedValidity(
                          row,
                          "created_time",
                          "DD/MM/YYYY HH:mm"
                        )
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Tanggal Pengujian">
                  <template v-slot="{ row }">
                    <div class="cell">
                      {{
                        getLastCreatedValidity(row, "tanggal_uji", "DD/MM/YYYY")
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Nomor UID">
                  <template v-slot="{ row }">
                    <div class="cell">
                      {{ row.validated ? row.uid : "-" }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Validasi">
                  <template v-slot="{ row }">
                    <div
                      v-if="getLastStatusValidity(row) === 'pending'"
                      class="border border-warning rounded-lg px-2 py-1 text-warning text-center"
                    >
                      Menunggu<br />Validasi
                    </div>
                    <div
                      v-if="getLastStatusValidity(row) === 'accepted'"
                      class="border border-success rounded-lg px-2 py-1 text-success text-center"
                    >
                      Diterima
                    </div>
                    <div
                      v-if="getLastStatusValidity(row) === 'rejected'"
                      class="border border-danger rounded-lg px-2 py-1 text-danger text-center"
                    >
                      Ditolak
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Aksi" min-width>
                  <template v-slot="{ row }">
                    <base-button
                      type="success"
                      class="btn-sm mt-1"
                      @click="showDetail(row._id)"
                    >
                      View
                    </base-button>
                    <base-button
                      type="danger"
                      class="btn-sm mt-1"
                      @click="remove(row)"
                    >
                      Hapus
                    </base-button>
                  </template>
                </el-table-column>
              </el-table>
              <div
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
                      />
                    </el-select>
                  </div>
                  <p
                    v-if="filter_data.status == false"
                    class="card-category m-0 ml-2"
                  >
                    Showing {{ from + 1 }} to {{ to }} of {{ total }} entries
                    <span v-if="selectedRows.length">
                      {{ selectedRows.length }} rows selected
                    </span>
                  </p>
                  <p v-else class="card-category m-0 ml-2">
                    Showing {{ from + 1 }} to {{ to }} of
                    {{ filter_data.count }} entries
                    <span v-if="selectedRows.length">
                      {{ selectedRows.length }} rows selected
                    </span>
                  </p>
                </div>
                <base-pagination
                  v-if="filter_data.status == false"
                  class="pagination-no-border"
                  v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total="total"
                />
                <base-pagination
                  v-else
                  class="pagination-no-border"
                  v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total="filter_data.count"
                />
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
import "flatpickr/dist/flatpickr.css";
import "sweetalert2/dist/sweetalert2.css";
import axios from "axios";
import defaults from "@/util/defaults";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { isUndef } from "../../../util";

const flatPickerConfig = {
  dateFormat: "U",
  allowInput: true,
  altInput: true,
  altFormat: "d/m/Y",
  mode: "range"
};

const STATUSES = {
  all: "semua",
  accepted: "diterima",
  rejected: "ditolak",
  pending: "menunggu"
};

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
      provinces: [],
      region: [],
      cities: [],
      companies: [],
      flatPickerConfig,
      createdTime: null,
      loadng: null,
      filter: {
        industryType: null,
        province: null,
        city: null,
        industry: null,
        isValid: null
      },
      keyword: null,
      status: "",
      selectedRows: [],
      filter_data: {
        count: 0,
        status: false
      },
      tableData: [],
      dataTemp: []
    };
  },
  computed: {
    isFilterStatusAll() {
      return (this.status && this.status === "all") || isUndef(this.status) || this.status === '';
    }
  },
  methods: {
    async handleDownload() {
      const queryParams = {};
      if (this.keyword) queryParams.search = this.keyword;
      if ((this.status && this.status !== "all") || isUndef(this.status)) {
        queryParams.status = STATUSES[this.status];
      }

      const serialize = new URLSearchParams(queryParams).toString();
      window.open(`${defaults.baseURL}/api/v1/ujikonek/export?${serialize}`, "_blank");
    },
    async getList() {
      this.loading = this.$loading.show({ loader: "dots" });
      const { data } = await axios.get(
        `${defaults.baseURL}/api/v1/ujikonek/list`
      );
      this.tableData = data;
      this.dataTemp = data;
      this.loading.hide();
    },
    handleSearch() {
      const keyword = this.keyword.toLowerCase();

      if (!this.keyword && this.isFilterStatusAll) {
        const filteredData = this.dataTemp.filter(
          item => this.getLastStatusValidity(item) === this.status
        );
        this.tableData = filteredData.length ? filteredData : this.dataTemp;
      } else if ((this.keyword || !this.keyword) && !this.isFilterStatusAll) {
        this.tableData = this.dataTemp
          .filter(item => {
            return (
              item.umum.companyName.toLowerCase().includes(this.keyword) ||
              item._id.toLowerCase().includes(this.keyword) ||
              item.umum.compProvinceName.toLowerCase().includes(this.keyword) ||
              item.umum.compCityName.toLowerCase().includes(this.keyword)
            );
          })
          .filter(item => this.getLastStatusValidity(item) === this.status);
      } else {
        this.tableData = this.tableData.filter(item => {
          return (
            item.umum.companyName.toLowerCase().includes(keyword) ||
            item._id.toLowerCase().includes(keyword) ||
            item.umum.compProvinceName.toLowerCase().includes(keyword) ||
            item.umum.compCityName.toLowerCase().includes(keyword)
          );
        });
      }
    },
    filterStatus() {
      if (!this.keyword && this.isFilterStatusAll) {
        this.tableData = this.dataTemp;
      } else if (this.keyword && this.isFilterStatusAll) {
        this.tableData = this.dataTemp.filter(item => {
          return (
            item.umum.companyName.toLowerCase().includes(this.keyword) ||
            item._id.toLowerCase().includes(this.keyword) ||
            item.umum.compProvinceName.toLowerCase().includes(this.keyword) ||
            item.umum.compCityName.toLowerCase().includes(this.keyword)
          );
        });
      } else if (this.keyword && !this.isFilterStatusAll) {
        this.tableData = this.dataTemp
          .filter(item => {
            return (
              item.umum.companyName.toLowerCase().includes(this.keyword) ||
              item._id.toLowerCase().includes(this.keyword) ||
              item.umum.compProvinceName.toLowerCase().includes(this.keyword) ||
              item.umum.compCityName.toLowerCase().includes(this.keyword)
            );
          })
          .filter(item => this.getLastStatusValidity(item) === this.status);
      } else {
        this.tableData = this.dataTemp.filter(
          item => this.getLastStatusValidity(item) === this.status
        );
      }
    },
    selectedTime() {
      if (this.createdTime) {
        const date = this.createdTime.split(" to ");
        const startDate = +date[0];
        const endDate = +date[1] + 86399; // + 23 hours 59 minutes
        this.tableData = this.dataTemp.filter(
          item => startDate <= item.created_time && item.created_time <= endDate
        );
      } else {
        this.tableData = this.dataTemp;
      }
    },
    async getProvince() {
      const { data } = await axios.get(
        `${defaults.baseURL}/report/list/5f340d5e328182315c11ee98`
      );
      this.provinces = data.provList;
      this.region = data.kabkotList;
      this.companies = data.compList;
    },
    getCity(province) {
      const prov = this.provinces.find(item => item.name === province);
      this.cities = this.region.filter(item => item.provID === prov._id);
    },
    showDetail(id) {
      this.$router.push({
        path: `/admin/ujikonek/detail/${id}`
      });
    },
    async remove(data) {
      const removeData = await Swal.fire({
        title: "Apakah anda yakin?",
        text: `Apakah anda yakin akan menghapus Pendaftaran Uji Konektifitas dari ${data.umum.companyName}`, // TODO
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal"
      });
      if (removeData.isConfirmed) {
        try {
          await axios.delete(`${defaults.baseURL}/api/v1/ujikonek/${data._id}`);
          Swal.fire("Dihapus!", "Uji Konektifitas berhasil dihapus", "success");
        } catch (err) {
          Swal.fire(
            "Gagal!",
            "Uji Konektifitas gagal dihapus, silahkan coba kembali.",
            "error"
          );
        }
        this.getList();
      }
    },
    dateTime(timestamp, format) {
      if (timestamp) {
        return moment.unix(timestamp).format(format);
      } else {
        return "-";
      }
    },
    getLastCreatedValidity(data, field, format) {
      if (data.validitas.length) {
        return this.dateTime(data.validitas.at(-1)[field], format);
      } else {
        return "-";
      }
    },
    getLastStatusValidity(data) {
      if (data.validitas.length) {
        return data.validitas.at(-1).status;
      } else {
        return "pending";
      }
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    }
  },
  created() {
    this.getList();
    this.getProvince();
  }
};
</script>
<style lang="scss">
#list-ujikonek {
  .el-table {
    .el-table__row {
      &:hover {
        background: transparent;
        cursor: unset;
      }
    }
  }
}
</style>
<style scoped>
.search-button {
  display: flex;
  justify-content: space-between;
  margin: 20px;
}

.mr-36 {
  margin-right: 36px;
}
</style>
