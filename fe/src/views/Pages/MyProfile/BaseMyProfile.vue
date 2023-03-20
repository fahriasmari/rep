<template>
  <div>
    <div>
      <div
        class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1">
        <h1 class="display-3 font-weight-light text-white m-0">Profil Perusahaan</h1>
      </div>
      <base-header style="height:200px" class="pb-8" type="primary"></base-header>
      <div class="container-fluid mt--9">
        <div class="row justify-content-center mb--4">
          <div class="col-lg-12">           
            <div class="card">
              <div class="col-lg-12 my-4">
                <div class="d-flex">
                  <div
                    class="tab-button rounded-left"
                    :class="{ 'tab-button-active': !isTabHistoryActive}"
                    @click="isTabHistoryActive = false">
                    Data Perusahaan
                  </div>
                  <div
                    class="tab-button rounded-right"
                      :class="{ 'tab-button-active': isTabHistoryActive}"
                      @click="isTabHistoryActive = true">
                      Riwayat Perubahan Dokumen
                    </div>
                </div>
              </div>
              <MyProfileHistory v-show="isTabHistoryActive"/>
              <MyProfileData v-show="!isTabHistoryActive" />
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
import FileInput from "@/components/Inputs/FileInput";
import defaults from "@/util/defaults";
import Modal from "@/components/Modal.vue";
import MyProfileData from "./MyProfileData.vue";
import MyProfileHistory from "./MyProfileHistory.vue";

export default {
  mixins: [clientPaginationMixin],
  components: {
    // HourGlass,
    FileInput,
    BasePagination,
    BaseInput,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Modal,
    MyProfileData,
    MyProfileHistory,
  },
  data() {
    return {
      isTabHistoryActive: false,
      baseURL: defaults.baseURL,
    };
  },
};
</script>
<style scoped>
.tab-button {
  padding: 6px 12px;
  background: #91A3A0;
  color: #ffffff;
  cursor: pointer;
  user-select: none;
}
.tab-button-active {
  background-color: #29664A;
}
.mdl-title {
  font-size: 18px;
  font-weight: 600;
  color: #6C757D;
}
</style>
