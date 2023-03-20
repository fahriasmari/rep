<template>
  <div id="validation-history">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <p v-if="tab === 0" class="font-weight-bold mb-2">
        Riwayat Pengajuan dan Validasi
      </p>
      <p v-if="tab === 1" class="font-weight-bold mb-2">
        History Perubahan Data
      </p>
      <p v-if="tab === 2" class="font-weight-bold mb-2">
        History Perubahan Dokumen
      </p>

      <div>
        <template v-if="this.$route.path === '/admin/detail/validasi'">
          <button
            :class="[
              'btn btn-primary mr-0 border-right-0',
              { 'tab-inactive-color': tab !== 0 }
            ]"
            @click="
              tab = 0;
              $emit('on-change-tab', 'validasi');
            "
          >
            Riwayat Pengajuan dan Validasi
          </button>
          <button
            :class="[
              'btn btn-primary mr-0 border-right-0 border-left-0',
              { 'tab-inactive-color': tab !== 1 }
            ]"
            @click="
              tab = 1;
              $emit('on-change-tab', 'perubahanData');
            "
          >
            History Perubahan Data
          </button>
          <button
            :class="[
              'btn btn-primary mr-0 border-left-0',
              { 'tab-inactive-color': tab !== 2 }
            ]"
            @click="
              tab = 2;
              $emit('on-change-tab', 'perubahanDokumen');
            "
          >
            History Perubahan Dokumen
          </button>
        </template>
      </div>
    </div>

    <div v-if="isLoadingData" class="text-center">loading...</div>

    <div v-if="data.length && !isLoadingData">
      <el-table
        v-if="tab === 0"
        :data="data"
        row-key="_id"
        header-row-class-name="thead-light"
        lazy
      >
        <el-table-column label="No" width="50" type="index" />
        <el-table-column label="Daftar Pengajuan" style="padding-left: 10px;">
          <el-table-column prop="companyName" label="Nama"  width="100" />
          <el-table-column label="Tanggal" width="90">
            <template v-slot="{ row }">
              {{ formatDate(row.created_time, "DD-MM-YYYY") }}
            </template>
          </el-table-column>
          <el-table-column prop="keterangan" label="Keterangan">
            <template v-slot="{ row }">
              <div v-html="row.keterangan"></div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Status Validasi">
          <el-table-column prop="user_id" label="Nama"  width="100" />
          <el-table-column label="Tanggal"  width="90">
            <template v-slot="{ row }">
              {{ formatDate(row.created_time, "DD-MM-YYYY") }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status"  width="90"/>
          <!-- <el-table-column label="Column"></el-table-column> -->
        </el-table-column>
      </el-table>

      <el-table v-if="tab === 1" :data="data" lazy>
        <!-- <el-table-column prop="no" label="No" width="50"></el-table-column> -->
        <el-table-column prop="name" label="Nama" width="200"></el-table-column>
        <el-table-column prop="updatedAt" label="Tanggal Modifikasi" width="100">
          <template v-slot="{ row }">
            {{ formatDate(row.updatedAt, "DD-MM-YYYY") }}
          </template>
        </el-table-column>
        <el-table-column label="Keterangan Perubahan">
          <template v-slot="{ row }">
            <div v-for="(f, index) in row.changes" :key="index">
              <p>{{ f }}</p>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-if="tab === 2" :data="data" lazy>
        <!-- <el-table-column prop="no" label="No" width="50"></el-table-column> -->
        <el-table-column prop="documentType" label="Diubah Pada" width="100">
          <template v-slot="{ row }">
            {{ formatDate(row.updatedAt, "DD-MM-YYYY") }}
          </template>
        </el-table-column>
        <el-table-column prop="documentName" label="Nama Dokumen"></el-table-column>
        <el-table-column prop="documentType" label="Tipe Dokumen" width="200" />
        <el-table-column label="Unduh Dokumen Lama">
          <template v-slot="{ row }">
            <button
              :class="[
                'btn btn-primary',
              ]"
              @click="downloadDoc(row.documentName)"
            >
              {{ row.documentName }}
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="!data.length && !isLoadingData" class="text-center">Belum ada riwayat validasi</div>
  </div>
</template>
<script>
import moment from "moment";
import { Table, TableColumn, Select, Option } from "element-ui";
import { BasePagination } from "@/components";
import clientPaginationMixin from "@/components/clientPaginationMixin";
import defaults from "@/util/defaults";

export default {
  name: "ValidationHistory",
  mixins: [clientPaginationMixin],
  components: {
    BasePagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  props: {
    isLoadingData: [Boolean],
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      tab: 0,
      baseURL: defaults.baseURL,
      sortDate: false,
      tableData: [],
      selectedRows: []
    };
  },
  methods: {
    downloadDoc(path) {
      window.open(`${baseURL}/${path}`, '_blank')
    },
    formatDate(timestamp, format) {
      return moment.unix(timestamp).format(format);
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    }
  },
  created() {
    this.tableData = this.data;
  },
  watch: {
    // prevent data not update to tableData
    data: function(value) {
      this.tableData = value;
    }
  }
};
</script>
<style lang="scss">
#validation-history {
  .el-table {
    th {
      padding: 0 10px;
    }
    td {
      padding: 0 10px;
      vertical-align: top;
    }
    .el-table__row {
      &:hover {
        background: transparent;
        cursor: unset;
      }
    }
    .cell {
      word-break: normal;
      text-align: justify;
    }
  }
}

.border-left-0 {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.border-right-0 {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.border-0 {
  border-radius: 0;
}

.tab-inactive-color {
  background-color: #91a3a0;
  border-color: #91a3a0;
}
</style>
