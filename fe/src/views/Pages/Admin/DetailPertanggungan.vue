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
        <h4 class="text-default m-0">Form COVID-19</h4>
      </div>
      <base-header class="pb-8" type="primary">
        <div class="row justify-content-end">
          <base-button class="col- mt-3 mb--3 mr-3" @click="toListPendaftaran()"
            >Kembali</base-button
          >
        </div>
      </base-header>

      <div class="container-fluid mt--7">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div id="umum" class="card">
              <div class="card-header d-flex justify-content-between">
                <h3 class="mb-0">Bukti Pemasangan SPARING Terkait COVID-19</h3>
              </div>

              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Nama Perusahaan</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.detail.compName }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Jenis Industri</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.detail.compType }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Alamat Perusahaan</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.detail.compAddress }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Provinsi</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.detail.compProvinceName }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Kabupaten / Kota</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.detail.compCityName }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Telepon Kantor</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.detail.compPhone }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Email Kantor</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.detail.compMail }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Penanggungjawab Sparing</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.detail.compCP }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Handphone Penanggungjawab Sparing</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.detail.personPhone }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Email Penanggungjawab Sparing</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.detail.personMail }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Tahapan Pemasangan SPARING</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.detail.tahap }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Bukti Pengadaan Sparing (Dokumen Tender)</strong>
                  </div>
                  <div class="col-lg-10">
                    <a :href="info.fileTender.path" target="blank">
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>
                        {{
                          info.fileTender.path === "" ||
                          info.fileTender.path === undefined ||
                          info.fileTender.path === null
                            ? " Belum ada File Terupload"
                            : "File Terupload"
                        }}
                      </span>
                    </a>
                  </div>
                </div>
                <div v-if="info.detail.tahap === 'Pemasangan'">
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Pemenang Sparing</strong>
                    </div>
                    <div class="col-lg-10">
                      <a :href="info.fileVendor.path" target="blank">
                        <span>
                          <i class="ni ni-cloud-download-95 text-primary"></i>
                        </span>
                        <span>
                          {{
                            info.fileVendor.path === "" ||
                            info.fileVendor.path === undefined ||
                            info.fileVendor.path === null
                              ? " Belum ada File Terupload"
                              : "File Terupload"
                          }}
                        </span>
                      </a>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Jadwal Pemasangan Sparing</strong>
                    </div>
                    <div class="col-lg-10">
                      <a :href="info.fileJadwal.path" target="blank">
                        <span>
                          <i class="ni ni-cloud-download-95 text-primary"></i>
                        </span>
                        <span>
                          {{
                            info.fileJadwal.path === "" ||
                            info.fileJadwal.path === undefined ||
                            info.fileJadwal.path === null
                              ? " Belum ada File Terupload"
                              : "File Terupload"
                          }}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
                <div v-if="info.detail.tahap === 'Pengoperasian'">
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Foto Instalasi</strong>
                    </div>
                    <div class="col-lg-10">
                      <a :href="info.photoPemasangan.path" target="blank">
                        <span>
                          <i class="ni ni-cloud-download-95 text-primary"></i>
                        </span>
                        <span>
                          {{
                            info.photoPemasangan.path === "" ||
                            info.photoPemasangan.path === undefined ||
                            info.photoPemasangan.path === null
                              ? " Belum ada File Terupload"
                              : "File Terupload"
                          }}
                        </span>
                      </a>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Foto Sparing</strong>
                    </div>
                    <div class="col-lg-10">
                      <a :href="info.photoSPARING.path" target="blank">
                        <span>
                          <i class="ni ni-cloud-download-95 text-primary"></i>
                        </span>
                        <span>
                          {{
                            info.photoSPARING.path === "" ||
                            info.photoSPARING.path === undefined ||
                            info.photoSPARING.path === null
                              ? " Belum ada File Terupload"
                              : "File Terupload"
                          }}
                        </span>
                      </a>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Dokumen Pemasangan</strong>
                    </div>
                    <div class="col-lg-10">
                      <a :href="info.filePemasangan.path" target="blank">
                        <span>
                          <i class="ni ni-cloud-download-95 text-primary"></i>
                        </span>
                        <span>
                          {{
                            info.filePemasangan.path === "" ||
                            info.filePemasangan.path === undefined ||
                            info.filePemasangan.path === null
                              ? " Belum ada File Terupload"
                              : "File Terupload"
                          }}
                        </span>
                      </a>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Perencanaan Masa Uji / Commisioning</strong>
                    </div>
                    <div class="col-lg-10">
                      <a :href="info.fileCommission.path" target="blank">
                        <span>
                          <i class="ni ni-cloud-download-95 text-primary"></i>
                        </span>
                        <span>
                          {{
                            info.fileCommission.path === "" ||
                            info.fileCommission.path === undefined ||
                            info.fileCommission.path === null
                              ? " Belum ada File Terupload"
                              : "File Terupload"
                          }}
                        </span>
                      </a>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Rencana Pengoperasian Sparing</strong>
                    </div>
                    <div class="col-lg-10">
                      <a :href="info.filePengoperasion.path" target="blank">
                        <span>
                          <i class="ni ni-cloud-download-95 text-primary"></i>
                        </span>
                        <span>
                          {{
                            info.filePengoperasion.path === "" ||
                            info.filePengoperasion.path === undefined ||
                            info.filePengoperasion.path === null
                              ? " Belum ada File Terupload"
                              : "File Terupload"
                          }}
                        </span>
                      </a>
                    </div>
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
const axios = require("axios");
import defaults from "@/util/defaults";
import swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

export default {
  components: {},
  data() {
    return {
      info: {
        detail: {
          compName: "",
          compType: "",
          compAddress: "",
          compCP: "",
          tahap: "",
          compProvince: "",
          compCity: "",
          compPhone: "",
          compMail: "",
          personPhone: "",
          personMail: "",
        },
        fileTender: {
          label: "",
          path: "",
          upload: 0,
          progress: 0,
        },
        fileVendor: {
          label: "",
          path: "",
          upload: 0,
          progress: 0,
        },
        fileJadwal: {
          label: "",
          path: "",
          upload: 0,
          progress: 0,
        },
        photoPemasangan: {
          label: "",
          path: "",
          upload: 0,
          progress: 0,
        },
        photoSPARING: {
          label: "",
          path: "",
          upload: 0,
          progress: 0,
        },
        filePemasangan: {
          label: "",
          path: "",
          upload: 0,
          progress: 0,
        },
        fileCommission: {
          label: "",
          path: "",
          upload: 0,
          progress: 0,
        },
        filePengoperasion: {
          label: "",
          path: "",
          upload: 0,
          progress: 0,
        },
      },
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
    };
  },
  computed: {},
  methods: {
    toListPendaftaran() {
      this.$router.push("/admin/list/pertanggungan");
    },
    showTTE() {
      this.$store.commit("setTTE", this.info._id);
      this.$router.push("/tte");
    },
    validasiHandler() {
      swal
        .fire({
          title: "Validasi",
          text: "Konfirmasi untuk memvalidasi",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Validasi",
          cancelButtonText: "Batal",
          reverseButtons: true,
        })
        .then((result) => {
          axios
            .put(
              `${defaults.baseURL}/form/validate-pendaftaran/${this.info._id}`
            )
            .then((res) => {
              swal.fire({
                title: "Berhasil",
                text: "Proses validasi berhasil",
                icon: "success",
              });

              this.$router.push("/admin/list/pendaftar");
            })
            .catch((err) => {
              swal.fire({
                title: "Gagal",
                text: "Proses validasi gagal",
                icon: "error",
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonColor: "#d33",
              });
              this.$router.push("/admin/list/pendaftar");
              console.log(err);
            });
        });
    },
    getInfo() {
      if (this.$store.state.data.admin.covid) {
        this.info = this.$store.state.data.admin.covid;
      } else console.log("ERROR: Failed to load data");
    },
  },
  created() {
    this.getInfo();
    // this.generateData();
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
