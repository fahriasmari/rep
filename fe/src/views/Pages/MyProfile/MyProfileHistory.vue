<template>
  <div>
    <el-table
      :data="queriedData"
      row-key="_id"
      header-row-class-name="thead-light"
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <el-table-column
        label="Nama Dokumen"
        prop="nama_dokumen"
        min-width
        align="left"
        sortable
      />
      <el-table-column
        label="Tipe Dokumen"
        prop="tipe_dokumen"
        min-width
        align="left"
        sortable
      />
      <el-table-column label="Tanggal Upload" prop="created_time" sortable>
        <template v-slot="{ row }">
          <div class="cell">
            {{ dateTime(row.created_time) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Tanggal Modifikasi" prop="updated_time" sortable>
        <template v-slot="{ row }">
          <div v-if="row.updated_time" class="cell">
            {{ dateTime(row.updated_time) }}
          </div>
          <p v-else>-</p>
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
        <p v-if="filter_data.status == false" class="card-category m-0 ml-2">
          Showing {{ from + 1 }} to {{ to }} of {{ total }} entries
          <span v-if="selectedRows.length">
            {{ selectedRows.length }} rows selected
          </span>
        </p>
        <p v-else class="card-category m-0 ml-2">
          Showing {{ from + 1 }} to {{ to }} of {{ filter_data.count }} entries
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
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { BasePagination } from "@/components";
import clientPaginationMixin from "@/components/clientPaginationMixin";
import axios from "axios";
import defaults from "@/util/defaults";
import moment from "moment";

export default {
  mixins: [clientPaginationMixin],
  components: {
    BasePagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      searchQuery: "",
      selectedRows: [],
      filter_data: {
        count: 0,
        status: false
      },
      tableData: []
    };
  },
  methods: {
    async getData() {
      const authData = JSON.parse(localStorage.getItem("auth-data"));
      // const { data, status } = await axios.get(`${defaults.baseURL}/form/histori-company/${authData.userRole.compID}`);
      const { data, status } = await axios.get(
        `${defaults.baseURL}/form/histori-company/${authData.userRole.profileID}`
      );
      if (status === 200 && data.hasOwnProperty('detail_dokumen')) {
        this.tableData = data.detail_dokumen;
      }
    },
    dateTime(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY, HH:mm");
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    }
  },
  created() {
    this.getData();
  }
};
</script>
