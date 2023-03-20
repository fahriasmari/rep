<template>
  <div>
    <div>
      <div
        class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1">
        <h1 class="display-3 font-weight-light text-white m-0">Admin</h1>
        <h2 class="text-white mx-4 my-0">-</h2>
        <h4 class="text-default m-0">Publikasi</h4>
      </div>
      <base-header style="height:200px" class="pb-8" type="primary"></base-header>
      <div class="container-fluid mt--9">
        <div class="row justify-content-center mb--4">
          <div class="col-lg-12">           
            <div class="card">
              <div class="col-lg-12 my-4">
                <base-button class="bg-primary float-right" @click="showAddPublicationModal = true">
                  <i class="fa fa-plus" aria-hidden="true"></i>
                  Tambah Publikasi
                </base-button>
            </div>
              <el-table
                :data="queriedData"
                row-key="_id"
                header-row-class-name="thead-light"
                @sort-change="sortChange"
                @selection-change="selectionChange">
                <el-table-column label="No" type="index" width="100" />
                <el-table-column label="Judul" prop="judul" min-width align="left" sortable />
                <el-table-column label="Aksi" width="410">
                  <template slot-scope="action">
                    <base-button type="primary" @click="downloadFile(action.row)">
                      <i class="fas fa-cloud-download-alt"></i>
                      Download
                    </base-button>
                    <base-button type="warning" @click="editPublication(action.row)">
                      <i class="fas fa-pen"></i>
                      Edit
                    </base-button>
                    <base-button type="danger" @click="deletePublication(action.row)">
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
      :show="showAddPublicationModal"
      modalContentClasses="mdl-content"
      modalClasses="modal-dialog-scrollable"
      headerClasses="pb-0"
      @close="showAddPublicationModal = false"
      size="lg">
      <template v-slot:header>
        <div class="modal-title">
          <p class="mdl-title">Tambah Publikasi</p>
        </div>
      </template>
      <div class="px-4 border-top pt-4">
        <div class="form-group row">
          <label class="col-form-label form-control-label">Judul Publikasi</label>
          <input type="text" class="form-control" v-model="add.judul" />
          <small v-if="validateJudul" class="text-danger">Judul Publikasi harus diisi</small>
        </div>
        <div class="form-group row">
          <label class="col-form-label form-control-label">Lampiran Publikasi</label>
          <div class="w-100">
            <base-input name="Lampiran Publikasi" rules="required" class="w-100">
              <file-input
                :disabled="uploading"
                accept="application/pdf"
                ref="publikasiFile"
                @change="uploadFile('publikasiFile')"
                class="w-100" />
              <base-progress
                v-if="add.publikasiFile.upload >= 1"
                class="mb-0"
                :type="add.publikasiFile.progress >= 100 ? 'green' : 'orange'"
                :value="add.publikasiFile.progress" />
            </base-input>
            <small v-if="validateFile" class="text-danger">Lampiran harus diisi</small>
            <small
              v-if="add.publikasiFile.upload == 2"
              class="d-block mt--3 text-justify">
              <a :href="`${baseURL}/${add.publikasiFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
            </small>
          </div>
        </div>
        <div class="form-group row">
          <button class="btn btn-primary" @click="addNewPublication">Simpan</button>
        </div>
      </div>
    </Modal>

    <!-- EDIT -->
    <Modal
      :show="showEditPublicationModal"
      modalContentClasses="mdl-content"
      modalClasses="modal-dialog-scrollable"
      headerClasses="pb-0"
      @close="showEditPublicationModal = false"
      size="lg">
      <template v-slot:header>
        <div class="modal-title">
          <p class="mdl-title">Edit Publikasi</p>
        </div>
      </template>
      <div class="px-4 border-top pt-4">
        <div class="form-group row">
          <label class="col-form-label form-control-label">Judul Publikasi</label>
          <textarea class="form-control" rows="3" v-model="edit.judul"></textarea>
          <small v-if="validateJudulEdit" class="text-danger">Judul Publikasi harus diisi</small>
        </div>
        <div class="form-group row">
          <label class="col-form-label form-control-label">Lampiran Publikasi</label>
          <div class="w-100">
            <base-input name="Lampiran Publikasi" rules="required" class="w-100">
            <div class="d-block mb-2 text-justify">
              <a :href="`${baseURL}/${edit.publikasiLampiranOld}`" target="_blank">Lihat lampiran yang terupload</a>
            </div>
              <file-input
                :disabled="uploading"
                accept="application/pdf"
                ref="publikasiFileEdit"
                @change="uploadFileEdit('publikasiFileEdit')"
                class="w-100" />
              <base-progress
                v-if="edit.publikasiFileEdit.upload >= 1"
                class="mb-0"
                :type="edit.publikasiFileEdit.progress >= 100 ? 'green' : 'orange'"
                :value="edit.publikasiFileEdit.progress" />
            </base-input>
            <small v-if="validateFileEdit" class="text-danger">Lampiran harus diisi</small>
            <small
              v-if="edit.publikasiFileEdit.upload == 2"
              class="d-block mt-4 text-justify">
              <a :href="`${baseURL}/${edit.publikasiFileEdit.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
            </small>
          </div>
        </div>
        <div class="form-group row">
          <button class="btn btn-primary" @click="updatePublication">Simpan</button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { BasePagination, BaseInput } from "@/components";
import clientPaginationMixin from "@/components/clientPaginationMixin";
import FileInput from "@/components/Inputs/FileInput";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import axios from "axios";
import defaults from "@/util/defaults";

import Modal from "@/components/Modal.vue";

export default {
  mixins: [clientPaginationMixin],
  components: {
    FileInput,
    BasePagination,
    BaseInput,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Modal,
  },
  data() {
    return {
      auth: JSON.parse(localStorage.getItem("auth-data")),
      showAddPublicationModal: false,
      showEditPublicationModal: false,
      searchQuery: "",
      baseURL: defaults.baseURL,
      uploading: false,
      validateJudul: false,
      validateFile: false,
      validateJudulEdit: false,
      validateFileEdit: false,
      add: {
        judul: null,
        publikasiFile: {
          path: "",
          upload: 0,
          progress: 0,
        },
      },
      edit: {
        id: null,
        judul: null,
        publikasiLampiranOld:null,
        publikasiFileEdit: {
          path: "",
          upload: 0,
          progress: 0,
        },
      },
      selectedRows: [],
      filter_data : {
        count:0,
        status : false
      },
      tableData: [],
    };
  },
  methods: {
    async getPublicationList() {
      const { data } = await axios.get(`${defaults.baseURL}/api/v1/publikasi/list`);
      this.tableData = data.data.sort((a, b) => b.created_time - a.created_time)
    },
    downloadFile(data) {
      window.open(`${defaults.baseURL}`+data.lampiran);
    },
    async addNewPublication() {
      this.validateJudul = this.add.judul ? false : true;
      this.validateFile = this.add.publikasiFile.path ? false : true;
      const post  = {
          "form":{
           "judul":this.add.judul,
           "lampiran":this.add.publikasiFile.path,
          }
        }
      if (this.add.judul && this.add.publikasiFile.path) {
        try {
          let postData = await axios.post(`${defaults.baseURL}/api/v1/publikasi/create`,post);

          if(postData.status == 200 || postData.status =="success"){
          this.$notify({
            message: "Data berhasil di simpan",
            timeout: 5000,
            icon: "ni ni-bell-55",
            type: "success",
            });
            this.getPublicationList();
          }
          else if(postData.status == 400 || postData.data.status =="failed"){
              this.$notify({
                message: postData.data.message,
                timeout: 5000,
                icon: "ni ni-bell-55",
                type: "danger",
              });
          }
        } catch {
          this.$notify({
            message: "Data gagal disimpan",
            timeout: 5000,
            icon: "ni ni-bell-55",
            type: "warning",
          });
        }
        this.add.judul = null;
        this.add.publikasiFile.path = null;
        this.getPublicationList();
        this.showAddPublicationModal = false;
      }
    },
    editPublication(data) {
      this.showEditPublicationModal = true;
      this.edit.id = data._id,
      this.edit.judul = data.judul,
      this.edit.publikasiLampiranOld = data.lampiran;
    },
    async updatePublication() {
      let postForm = {
        _id:this.edit.id,
        judul:this.edit.judul,
      }
      if(this.edit.publikasiFileEdit.path ==""){
        postForm.lampiran = this.edit.publikasiLampiranOld;
      }
      else {
        postForm.lampiran = this.edit.publikasiFileEdit.path;
      }
     
      if (this.edit.judul) {
        try {
         let postData = await axios.put(`${defaults.baseURL}/api/v1/publikasi/update`,postForm)
        if(postData.status == 200 || postData.status =="success"){
          this.$notify({
              message: "Data berhasil di update" + this.edit.judul,
              timeout: 5000,
              icon: "ni ni-bell-55",
              type: "success",
            });
            this.getPublicationList()
        }
        else if(postData.status == 400 || postData.data.status =="failed"){
            this.$notify({
              message: postData.data.message,
              timeout: 5000,
              icon: "ni ni-bell-55",
              type: "success",
            });
        }
        } catch {
          this.$notify({
            message: "Data gagal disimpan",
            timeout: 5000,
            icon: "ni ni-bell-55",
            type: "warning",
          });
        }
        this.edit.judul = null;
        this.edit.publikasiFileEdit.path = null;
        // location.reload()
        this.getPublicationList();
        this.showAddPublicationModal = false;
      }
    },
    uploadFile(field) {
      this.uploading = true;
      this.add[field].upload = 1;
      let formData = new FormData();
      formData.append("picture", this.$refs[field].files[0]);

      axios.post(`${defaults.baseURL}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: function (progressEvent) {
          this.add[field].progress = parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        }.bind(this),
      })
        .then((res) => {
          this.add[field].upload = 2;
          this.add[field].path = res.data.path;
          this.uploading = false;
        })
        .catch((err) => {
          this.add[field].upload = 0;
          this.uploading = false;
          this.$notify({
            message: "File gagal disimpan, silahkan upload ulang",
            timeout: 5000,
            icon: "ni ni-bell-55",
            type: "warning",
          });
        });
    },
    uploadFileEdit(field) {
      this.uploading = true;
      this.edit[field].upload = 1;
      let formData = new FormData();
      formData.append("picture", this.$refs[field].files[0]);
      axios.post(`${defaults.baseURL}/file`, formData, {
        headers: {"Content-Type": "multipart/form-data"},
        onUploadProgress: function (progressEvent) {
          this.edit[field].progress = parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        }.bind(this),
      })
        .then((res) => {
          this.edit[field].upload = 2;
          this.edit[field].path = res.data.path;
          this.uploading = false;
        })
        .catch((err) => {
          this.edit[field].upload = 0;
          this.uploading = false;
          this.$notify({
            message: "File gagal disimpan, silahkan upload ulang",
            timeout: 5000,
            icon: "ni ni-bell-55",
            type: "warning",
          });
        });
    },
    async deletePublication(data) {
      let ids =data._id;
      const swal = await Swal.fire({
        title: "Apakah anda yakin?",
        text: `Pertanyaan ${data.judul}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus!",
      });
      if (swal.isConfirmed) {
        try {
          const { data } = await axios.delete(`${defaults.baseURL}/api/v1/publikasi/delete/${ids}`);
          Swal.fire("Dihapus!", "Publikasi telah dihapus", "success");
        } catch (err){
          console.log(err)
          Swal.fire("Deleted!", "Your file has been deleted.", "error");
        }
        this.getPublicationList();
      }
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
  },
  created() {
    this.getPublicationList();
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
