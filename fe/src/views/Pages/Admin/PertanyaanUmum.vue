<template>
  <div>
    <div>
      <div
        class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1">
        <h1 class="display-3 font-weight-light text-white m-0">Admin</h1>
        <h2 class="text-white mx-4 my-0">-</h2>
        <h4 class="text-default m-0">Pertanyaan Umum</h4>
      </div>
      <base-header style="height:200px" class="pb-8" type="primary"></base-header>
      <div class="container-fluid mt--9">
        <div class="row justify-content-center mb--4">
          <div class="col-lg-12">           
            <div class="card">
              <div class="col-lg-12 my-4">
                <base-button class="bg-primary float-right" @click="showAddFaqModal = true">
                  <i class="fa fa-plus" aria-hidden="true"></i>
                  Tambah Pertanyaan Baru
                </base-button>
            </div>
              <el-table
                :data="queriedData"
                row-key="_id"
                header-row-class-name="thead-light"
                @sort-change="sortChange"
                @selection-change="selectionChange">
                <el-table-column label="No" type="index" width="100" />
                <el-table-column label="Pertanyaan" prop="pertanyaan" min-width align="left" sortable>
                  <template slot-scope="ask">
                    <p v-html="ask.row.pertanyaan"></p>
                  </template>
                </el-table-column>
                <el-table-column label="Jawaban" prop="jawaban" min-width align="left" sortable>
                  <template slot-scope="answer">
                    <p v-html="answer.row.jawaban"></p>
                  </template>
                </el-table-column>
                <el-table-column label="Kategori" prop="categoryFaq" min-width align="left" sortable>
                  <template slot-scope="cat">
                    <p>{{ getCategoryName(cat.row.categoryFaq) }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="Aksi" width="270">
                  <template slot-scope="action">
                    <base-button type="warning" @click="editFaq(action.row)">
                      <i class="fas fa-pen"></i>
                      Edit
                    </base-button>
                    <base-button type="danger" @click="deleteFaq(action.row)">
                      <i class="fas fa-trash"></i>
                      Delete
                    </base-button>
                  </template>
                </el-table-column>
              </el-table>
              <div
                slot="footer"
                class="col-12 my-2 d-flex justify-content-center justify-content-sm-between flex-wrap">
                <div class="d-flex align-items-center">
                  <p class="card-category mb-0 mr-2">Show</p>
                  <div style="width: 80px">
                    <el-select
                      class="select-primary pagination-select"
                      v-model="pagination.perPage"
                      placeholder="Per page"
                      size="mini">
                      <el-option
                        class="select-primary"
                        v-for="item in pagination.perPageOptions"
                        :key="item"
                        :label="item"
                        :value="item" />
                    </el-select>
                  </div>
                  <p v-if="filter_data.status == false" class="card-category m-0 ml-2">
                    Showing {{ from + 1 }} to {{ to }} of {{ total }} entries
                    <span v-if="selectedRows.length">
                      {{ selectedRows.length }} rows
                      selected
                    </span>
                  </p>
                  <p v-else class="card-category m-0 ml-2">
                    Showing {{ from + 1 }} to {{ to }} of {{ filter_data.count }} entries
                    <span v-if="selectedRows.length">
                      {{ selectedRows.length }} rows
                      selected
                    </span>
                  </p>
                </div>
                <base-pagination
                  v-if="filter_data.status == false"
                  class="pagination-no-border"
                  v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total="total" />
                <base-pagination
                  v-else
                  class="pagination-no-border"
                  v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total="filter_data.count" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal
      :show="showAddFaqModal"
      modalContentClasses="mdl-content"
      modalClasses="modal-dialog-scrollable"
      headerClasses="pb-0"
      @close="showAddFaqModal = false"
      size="lg">
      <template v-slot:header>
        <div class="modal-title">
          <p class="mdl-title">Tambah Pertanyaan Umum</p>
        </div>
      </template>
      <div class="px-4 border-top pt-4">
        <div class="form-group row px-3">
          <label class="col-form-label form-control-label">Category Pertanyaan</label>
            <el-select v-model="selectCategory ">
              <el-option v-for="list in listCategoryFaq" :key="list._id"
                :label="list.name"
                :value="list._id" />
            </el-select>
        </div>
        <div class="form-group row">
          <label class="col-form-label form-control-label px-3">Pertanyaan</label>
          <div class="col-12">
            <html-editor v-model="add.pertanyaan"></html-editor>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-form-label form-control-label px-3">Jawaban</label>
          <div class="col-12">
            <html-editor v-model="add.jawaban"></html-editor>
          </div>
        </div>
        <div class="form-group row px-3 float-right pb-4">
          <button class="btn btn-primary" @click="addNewFaq">Simpan</button>
        </div>
      </div>
    </Modal>

    <!-- EDIT -->
    <Modal
      :show="showEditFaqModal"
      modalContentClasses="mdl-content"
      modalClasses="modal-dialog-scrollable"
      headerClasses="pb-0"
      @close="showEditFaqModal = false"
      size="lg">
      <template v-slot:header>
        <div class="modal-title">
          <p class="mdl-title">Edit Pertanyaan Umum</p>
        </div>
      </template>
      <div class="px-4 border-top pt-4">
        <div class="form-group row px-3">
          <label class="col-form-label form-control-label">Category Pertanyaan</label>
            <select class="form-control" v-model="selectCategoryEdit ">
              <option v-for="list in listCategoryFaq" :key="list._id" :value="list._id">
                {{ list.name }}
              </option>
            </select>
        </div>
        <div class="form-group row">
          <label class="col-form-label form-control-label px-3">Pertanyaan</label>
          <div class="col-12">
            <html-editor v-model="edit.pertanyaan"></html-editor>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-form-label form-control-label px-3">Jawaban</label>
          <div class="col-12">
            <html-editor v-model="edit.jawaban"></html-editor>
          </div>
        </div>
        <div class="form-group row px-3 float-right pb-4">
          <button class="btn btn-primary" @click="updateFaq">Simpan</button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { BasePagination, BaseInput } from "@/components";
import clientPaginationMixin from "@/components/clientPaginationMixin";
import flatPicker from "vue-flatpickr-component";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.css";
import "sweetalert2/dist/sweetalert2.css";
import axios from "axios";
import defaults from "@/util/defaults";
import HtmlEditor from "@/components/Inputs/HtmlEditor";
import Modal from "@/components/Modal.vue";

export default {
  mixins: [clientPaginationMixin],
  components: {
    BasePagination,
    BaseInput,
    HtmlEditor,
    flatPicker,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Modal,
  },
  data() {
    return {
      auth: JSON.parse(localStorage.getItem("auth-data")),
      showAddFaqModal: false,
      showEditFaqModal: false,
      searchQuery: "",
      add: {
        // id: null,
        pertanyaan: null,
        jawaban: null,
      },
      edit: {
        id: null,
        pertanyaan: null,
        jawaban: null,
      },
      selectedRows: [],
      selectCategory:null,
      selectCategoryEdit:null,
      filter_data : {
        count:0,
        status : false
      },
      tableData: [],
      listCategoryFaq:[]
    };
  },
  methods: {
    async getFaqList() {
        const { data } = await axios.get(`${defaults.baseURL}/api/v1/faq/list`);
        this.tableData = data.data;
    },
    async getFaqCategoryList() {
      const { data } = await axios.get(`${defaults.baseURL}/api/v1/faq/category`);
      this.listCategoryFaq = data
      
    },
    async addNewFaq() {
      try {
        const data = this.add;
        if(!data.jawaban || !data.pertanyaan || !this.selectCategory){
          this.$notify({
              message: "Data tidak Boleh Kosong",
              timeout: 5000,
              icon: "ni ni-bell-55",
              type: "error",
          });
          return;
        }
        const post  = {
          "form":{
           "categoryFaq":this.selectCategory,
           "jawaban":data.jawaban,
           "pertanyaan":data.pertanyaan
          }
        }
        let postData = await axios.post(`${defaults.baseURL}/api/v1/faq/create`,post)
        if(postData.status == 200 || postData.status =="success"){
          this.$notify({
              message: "Data berhasil di simpan",
              timeout: 5000,
              icon: "ni ni-bell-55",
              type: "success",
            });
            this.getFaqList()
        }
        else if(postData.status == 400 || postData.data.status =="failed"){
            this.$notify({
              message: postData.data.message,
              timeout: 5000,
              icon: "ni ni-bell-55",
              type: "success",
            });
        }
        
      } catch(err) {
        this.$notify({
          message: "Data gagal disimpan",
          timeout: 5000,
          icon: "ni ni-bell-55",
          type: "warning",
        });
      }
      this.selectCategory = null;
      this.add.pertanyaan = null;
      this.add.jawaban = null;
      this.showAddFaqModal = false;
    },
    editFaq(data) {
      this.showEditFaqModal = true;
      this.selectCategoryEdit = data.categoryFaq, // TODO
      this.edit.pertanyaan = data.pertanyaan, // TODO
      this.edit.jawaban = data.jawaban; // TODO
      this.edit.id = data._id;
    },
    async updateFaq() {
      try {
        const data = this.edit;
        if(!data.jawaban || !data.pertanyaan){
          this.$notify({
              message: "Data Tidak Boleh Kosong",
              timeout: 5000,
              icon: "ni ni-bell-55",
              type: "error",
          });
          return;
        }
        const post  = {
          "form":{
           _id:data.id,
           "categoryFaq":this.selectCategoryEdit,
           "jawaban":data.jawaban,
           "pertanyaan":data.pertanyaan
          }
        }
      
        let postData = await axios.put(`${defaults.baseURL}/api/v1/faq/update`, post)
        if(postData.status == 200 || postData.status =="success"){
          this.$notify({
              message: "Data berhasil di update" ,
              timeout: 5000,
              icon: "ni ni-bell-55",
              type: "success",
            });
            this.getFaqList()
        }
        else if(postData.status == 400 || postData.data.status =="failed"){
            this.$notify({
              message: postData.data.message,
              timeout: 5000,
              icon: "ni ni-bell-55",
              type: "success",
            });
        }
        
      } catch(err) {
        this.$notify({
          message: "Data gagal diupdate",
          timeout: 5000,
          icon: "ni ni-bell-55",
          type: "warning",
        });
      }
      this.showEditFaqModal = false;
    },
    async deleteFaq(data) {
     
      let ids = data._id;
      const swal = await Swal.fire({
        title: "Apakah anda yakin?",
        text: `Apakah anda yakin akan menghapus pertanyaan ini?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus!",
      });
      if (swal.isConfirmed) {
        try {
          await axios.delete(`${defaults.baseURL}/api/v1/faq/delete/${ids}`);
          Swal.fire("Dihapus!", "Pertanyaan telah dihapus", "success");
        } catch {
          Swal.fire("Gagal!", "Pertanyaan gagal dihapus, silahkan coba kembali.", "error");
        }
        this.getFaqList();
      }
    },
    getCategoryName(id){
      let category = this.listCategoryFaq.filter((item) => item._id == id);
      return category.length ? category[0].name : "";
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
  },
  created() {
    this.getFaqList();
    this.getFaqCategoryList();
  },
};
</script>
<style scoped>
.mdl-title {
  font-size: 18px;
  font-weight: 600;
  color: #6C757D;
}
</style>
