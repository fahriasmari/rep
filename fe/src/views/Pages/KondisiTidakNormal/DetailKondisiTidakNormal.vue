<template>
  <div>
    <div
      class="d-flex align-items-center overflow-hidden position-absolute w-100"
      style="height: 66px; padding: 0 30px; top: 0; z-index: 1">
      <h1 class="display-3 font-weight-light text-white m-0">
        Detail Laporan Kondisi Tidak Normal
      </h1>
    </div>
    <base-header class="pb-8" type="primary"></base-header>
    <div class="container-fluid mt--7">
      <div class="row justify-content-center mb--4">
        <div class="col">
          <div class="card">
            <div class="p-3 w-100">
              <div class="row justify-content-between">
                <div class="col-8 pr-0">
                  <h3>Detail Pengumuman</h3>
                </div>
                <base-button class="col-1 bg-primary mr-4" @click="$router.go(-1)">Kembali</base-button>
                  <base-button
                    v-if="this.$store.state.auth.level > 2"
                    class="col-1 bg-primary mr-4"
                    click="toUpdateForm">
                    Ubah
                  </base-button>
                  <base-button
                    v-if="this.$store.state.auth.level > 2"
                    class="col-1 bg-danger mr-4"
                    click="deleteForm">
                    Hapus
                  </base-button>
                </div>
              </div>
              <div v-if="!isLoading" class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Nama Perusahaan</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ detail.compDetails.compName }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Jenis Industri</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ detail.compDetails.compType }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Provinsi</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ detail.provDetails.provName }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Kabupaten/Kota</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ detail.kabkotDetails.kabkotName }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Kondisi</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ detail.kondisi }}</span>
                  </div>
                </div>
                <div v-if="detail.kondisi == 'Kondisi Tidak Normal'" class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Kondisi Tidak Normal</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ detail.kondisiTidakNormal.status }}</span>
                  </div>
                </div>
                <div v-if="detail.kondisi == 'Kondisi Darurat'" class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Kondisi Darurat</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ detail.kondisiDarurat.status }}</span>
                  </div>
                </div>
                <div  v-if="detail.kondisiTidakNormal.kondisiLain == 'Ya'" class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Kondisi Lainnya</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ detail.kondisiLain.status }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Tanggal Kejadian</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ formatDate(detail.tanggalKejadian) }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Lokasi</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ detail.lokasi }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Fasilitas/Unit</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ detail.fasilitas }}</span>
                  </div>
                </div>

                <template v-if="detail.fasilitas == 'Alat Sparing' || detail.fasilitas == 'Alat Sparing & IPAL'">
                  <div class="row mb-4">
                    <div class="col-lg-3">
                      <strong>Merek Alat Sparing</strong>
                    </div>
                    <div class="col-lg-9">
                      <span>{{ detail.alatSparing.merek }}</span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-3">
                      <strong>Tanggal Instalasi Alat Sparing</strong>
                    </div>
                    <div class="col-lg-9">
                      <span>{{ formatDate(detail.alatSparing.tanggalInstalasi) }}</span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-3">
                      <strong>Tanggal Dioperasikannya Alat Sparing</strong>
                    </div>
                    <div class="col-lg-9">
                      <span>{{ formatDate(detail.alatSparing.tanggalOperasi) }}</span>
                    </div>
                  </div>
                </template>

                <template v-if="detail.fasilitas == 'Alat IPAL' || detail.fasilitas == 'Alat Sparing & IPAL'">
                  <div class="row mb-4">
                    <div class="col-lg-3">
                      <strong>Tanggal Pembuatan Alat IPAL</strong>
                    </div>
                    <div class="col-lg-9">
                      <span>{{ formatDate(detail.alatIPAL.tanggalPembuatan) }}</span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-3">
                      <strong>Tanggal Dioperasikannya Alat IPAL</strong>
                    </div>
                    <div class="col-lg-9">
                      <span>{{ formatDate(detail.alatIPAL.tanggalOperasi) }}</span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-3">
                      <strong>Kapasitas Desain dan Operasional Alat IPAL</strong>
                    </div>
                    <div class="col-lg-9">
                      <span>{{ detail.alatIPAL.kapasitas }}</span>
                    </div>
                  </div>
                </template>

                <div v-if="detail.fasilitas == 'Alat Lainnya'" class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Penyebab Kondisi Tidak Normal/Darurat</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ detail.alatLainnya }}</span>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Apakah Penyebab Kejadian Sudah Diatasi?</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ detail.statusKejadian.status ? "Ya" : "Tidak" }}</span>
                  </div>
                </div>

                <div v-if="detail.statusKejadian.status" class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Tanggal Kejadian Sudah Teratasi</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ formatDate(detail.statusKejadian.tanggalSelesai) }}</span>
                  </div>
                </div>
                <div v-if="!detail.statusKejadian.status" class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Rencana Penanggulangan</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ detail.statusKejadian.rencanaPenanggulangan }}</span>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Apakah Ada Keluhan dari Masyarakat Karena Kejadian Ini?</strong>
                  </div>
                  <div class="col-lg-9">
                    <span>{{ detail.keluhanMasyarakat.status ? "Ya" : "Tidak" }}</span>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Lampiran Prosedur Penanganan</strong>
                  </div>
                  <div class="col-lg-9">
                    <a
                      :href="detail.fileLampiranPath ? `${baseURL}${detail.fileLampiranPath}`: ''"
                      target="blank">
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{ !detail.fileLampiranPath ? " Belum ada  File Terupload" : " File Terupload" }}</span>
                    </a>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <strong>Surat Penyampaian Kondisi Tidak Normal Atau Kondisi Darurat</strong>
                  </div>
                  <div class="col-lg-9">
                    <a
                      :href="detail.fileSuratPath ? `${baseURL}${detail.fileSuratPath}` : ''"
                      target="blank">
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{ !detail.fileSuratPath ? " Belum ada  File Terupload" : " File Terupload" }}</span>
                    </a>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <strong>
                      Lampiran Bukti Logbook Harian Yang Ditanda Tangani Minimal Setara Manager Lingkungan
                    </strong>
                  </div>
                  <div class="col-lg-9">
                    <a
                      :href="detail.fileSuratLogbookPath? `${baseURL}${detail.fileSuratLogbookPath}`: ''"
                      target="blank">
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>
                        {{ !detail.fileSuratLogbookPath || !detail.fileSuratLogbookPath.path ? " Belum ada  File Terupload" : " File Terupload" }}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row justify-content-end position-fixed right-0" style="top:50%">
            <base-button
              v-if="this.$store.state.auth.level < 1"
              @click="showValidate = true"
              class="mx-3 mb-4 "
              type="danger">
              VALIDATE
            </base-button>
          </div>
        </div>
      </div>
      </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import defaults from "@/util/defaults";

export default {
  data() {
    return {
      showValidate: false,
      detail: {},
      baseURL: defaults.baseURL,
      isLoading: true,
    }
  },
  methods: {
    async getData() {
      const id = this.$route.params.id;
      const { data } = await axios.get(`${defaults.baseURL}/form/cond-report/${id}`);
      this.detail = data[0];
      this.isLoading = false;
    },
    formatDate(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY");
    },
  },
  created() {
    this.getData();
  },
}
</script>