<template>
  <div>
    <div
      class="d-flex align-items-center overflow-hidden position-absolute w-100"
      style="height: 66px; padding: 0 30px; top: 0; z-index: 1">
      <h1 class="display-3 font-weight-light text-white m-0">
        Form Laporan Kondisi Tidak Normal
      </h1>
    </div>
    <base-header class="pb-8" type="primary"></base-header>
    <div class="container-fluid mt--7">
      <div class="row justify-content-center mb--4">
        <div class="col">
          <DescKondisiTidakNormal />
          <div class="card">
            <div class="card-header p-3 w-100">
              <div class="row justify-content-between">
                <div class="col-10 pr-0 ml-4">
                  <h3>Tambah Laporan Kondisi Tidak Normal</h3>
                </div>
                <base-button class="col-1 bg-primary mr-4" @click="$router.go(-1)">Kembali</base-button>
              </div>
            </div>
            <div class="card-body">
              <!-- <validation-observer ref="formValidator">
              <form>
                <div class="col-lg-12">
                  <h4>Informasi Umum</h4>
                </div>
                <div class="col-lg-12">
                  <h5>Jenis Industri</h5>
                  <base-input name="Jenis Industri" rules="required">
                    <el-select v-model="form.jenisIndustri">
                      <el-option
                        v-for="industri in jenisIndustri"
                        :key="industri.id"
                        :label="industri.value"
                        :value="industri.value" />
                    </el-select>
                  </base-input>
                </div>
                <div class="col-lg-12">
                  <h5>Pilih Kondisi</h5>
                  <base-input name="Pilih Kondisi" rules="required">
                    <el-select
                      v-model="form.kondisi"
                      @change="thenKondisi(form.kondisi)"
                    >
                      <el-option
                        v-for="option in tempSelectForm.options.kondisi"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-lg-12" v-if="tempState.isTidakNormal">
                  <h5>Kondisi Tidak Normal</h5>
                  <base-input name="Pilih Kondisi" rules="required">
                    <el-select
                      v-model="form.kondisiTidakNormal.status"
                      @change="
                        resetKondisi;
                        thenTidakNormal(
                          form.kondisiTidakNormal.status
                        );
                      "
                    >
                      <el-option
                        v-for="option in tempSelectForm.options.tidakNormal"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-lg-12" v-if="tempState.isDarurat">
                  <h5>Kondisi Darurat</h5>
                  <base-input name="Pilih Kondisi" rules="required">
                    <el-select
                      v-model="form.kondisiDarurat.status"
                      @change="
                        resetKondisi;
                        thenDarurat(
                          form.kondisiDarurat.status
                        );
                      "
                    >
                      <el-option
                        v-for="option in tempSelectForm.options.darurat"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-lg-12" v-if="tempState.tidakAliranLimbah">
                  <h5>
                    Unggah Bukti Logbook Harian Yang Ditanda Tangani Minimal
                    Setara Manager Lingkungan
                  </h5>
                  <base-input>
                    <file-input
                      ref="kondisiTidakAdaAliranLimbah"
                      @change="
                        uploadFileLogbook('kondisiTidakAdaAliranLimbah')
                      "
                    ></file-input>
                    <base-progress
                      v-if="tempProgressLogbook >= 1"
                      class="mb-0"
                      :type="tempProgressLogbook >= 100 ? 'green' : 'orange'"
                      :value="tempProgressLogbook"
                    ></base-progress>
                    <hour-glass
                      v-if="
                        tempProgressLogbook > 1 && tempProgressLogbook != 100
                      "
                      class="file-upload-animation"
                      size="24px"
                    ></hour-glass>
                    <span v-if="tempProgressLogbook >= 100">
                      <i
                        class="ni ni-check-bold text-primary file-upload-done"
                      ></i>
                    </span>
                  </base-input>
                </div>
                <div class="col-lg-12" v-if="tempState.isKondisiLain">
                  <h5>
                    Kondisi Lain yang Menyebabkan SPARING Tidak dapat
                    Digunakan Secara Optimal
                  </h5>
                  <base-input name="Pilih Kondisi" rules="required">
                    <el-select
                      v-model="form.kondisiLain.status"
                      @change="
                        thenKondisiLain(
                          form.kondisiLain.status
                        )
                      "
                    >
                      <el-option
                        v-for="option in tempSelectForm.options.kondisiLain"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-lg-12">
                  <base-input label="Tanggal Kejadian" class="form-group">
                    <flat-picker
                      slot-scope="{ focus, blur }"
                      @on-open="focus"
                      @on-close="blur"
                      :config="{
                        allowInput: true,
                        dateFormat: 'U',
                        altFormat: 'd/m/Y',
                        altInput: true,
                      }"
                      :placeholder="form.tanggalKejadian"
                      class="form-control datepicker"
                      v-model="form.tanggalKejadian"
                    ></flat-picker>
                  </base-input>
                </div>
                <div class="col-lg-12">
                  <base-input
                    label="Lokasi"
                    class="form-group"
                    v-model="form.lokasi"
                  >
                  </base-input>
                </div>

                <div class="col-lg-12">
                  <h4>Fasilitas/Unit</h4>
                </div>
                <div class="col-lg-12">
                  <h5>Pilih Fasilitas/Unit</h5>
                  <base-input name="Pilih Fasilitas/Unit" rules="required">
                    <el-select
                      v-model="form.fasilitas"
                      @change="
                        resetFasilitas;
                        thenFasilitas(form.fasilitas);
                      "
                    >
                      <el-option
                        v-for="option in tempSelectForm.options.fasilitas"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </base-input>
                </div>

                <template v-if="tempState.isAlatSparing">
                  <div class="col-lg-12">
                    <base-input
                      label="Merek Alat Sparing"
                      class="form-group"
                      v-model="form.alatSparing.merek"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input
                      label="Tanggal Instalasi Alat Sparing"
                      class="form-group"
                    >
                      <flat-picker
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          allowInput: true,
                          dateFormat: 'U',
                          altFormat: 'd/m/Y',
                          altInput: true,
                        }"
                        :placeholder="
                          form.alatSparing.tanggalInstalasi
                        "
                        class="form-control datepicker"
                        v-model="
                          form.alatSparing.tanggalInstalasi
                        "
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input
                      label="Tanggal Dioperasikan Alat Sparing"
                      class="form-group"
                    >
                      <flat-picker
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          allowInput: true,
                          dateFormat: 'U',
                          altFormat: 'd/m/Y',
                          altInput: true,
                        }"
                        :placeholder="
                          form.alatSparing.tanggalOperasi
                        "
                        class="form-control datepicker"
                        v-model="
                          form.alatSparing.tanggalOperasi
                        "
                      ></flat-picker>
                    </base-input>
                  </div>
                </template>

                <template v-if="tempState.isAlatIPAL">
                  <div class="col-lg-12">
                    <base-input
                      label="Tanggal Instalasi Alat IPAL"
                      class="form-group"
                    >
                      <flat-picker
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          allowInput: true,
                          dateFormat: 'U',
                          altFormat: 'd/m/Y',
                          altInput: true,
                        }"
                        :placeholder="
                          form.alatIPAL.tanggalPembuatan
                        "
                        class="form-control datepicker"
                        v-model="
                          form.alatIPAL.tanggalPembuatan
                        "
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input
                      label="Tanggal Dioperasikan Alat IPAL"
                      class="form-group"
                    >
                      <flat-picker
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          allowInput: true,
                          dateFormat: 'U',
                          altFormat: 'd/m/Y',
                          altInput: true,
                        }"
                        :placeholder="
                          form.alatIPAL.tanggalOperasi
                        "
                        class="form-control datepicker"
                        v-model="form.alatIPAL.tanggalOperasi"
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input
                      label="Kapasitas Desain dan Operasional Alat IPAL"
                      class="form-group"
                      v-model="form.alatIPAL.kapasitas"
                    >
                    </base-input>
                  </div>
                </template>

                <template v-if="tempState.isAlatSparingIPAL">
                  <div class="col-lg-12">
                    <base-input
                      label="Merek Alat Sparing"
                      class="form-group"
                      v-model="form.alatSparing.merek"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input
                      label="Tanggal Instalasi Alat Sparing"
                      class="form-group"
                    >
                      <flat-picker
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          allowInput: true,
                          dateFormat: 'U',
                          altFormat: 'd/m/Y',
                          altInput: true,
                        }"
                        :placeholder="
                          form.alatSparing.tanggalInstalasi
                        "
                        class="form-control datepicker"
                        v-model="
                          form.alatSparing.tanggalInstalasi
                        "
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input
                      label="Tanggal Dioperasikan Alat Sparing"
                      class="form-group"
                    >
                      <flat-picker
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          allowInput: true,
                          dateFormat: 'U',
                          altFormat: 'd/m/Y',
                          altInput: true,
                        }"
                        :placeholder="
                          form.alatSparing.tanggalOperasi
                        "
                        class="form-control datepicker"
                        v-model="
                          form.alatSparing.tanggalOperasi
                        "
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input
                      label="Tanggal Instalasi Alat IPAL"
                      class="form-group"
                    >
                      <flat-picker
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          allowInput: true,
                          dateFormat: 'U',
                          altFormat: 'd/m/Y',
                          altInput: true,
                        }"
                        :placeholder="
                          form.alatIPAL.tanggalPembuatan
                        "
                        class="form-control datepicker"
                        v-model="
                          form.alatIPAL.tanggalPembuatan
                        "
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input
                      label="Tanggal Dioperasikan Alat IPAL"
                      class="form-group"
                    >
                      <flat-picker
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          allowInput: true,
                          dateFormat: 'U',
                          altFormat: 'd/m/Y',
                          altInput: true,
                        }"
                        :placeholder="
                          form.alatIPAL.tanggalOperasi
                        "
                        class="form-control datepicker"
                        v-model="form.alatIPAL.tanggalOperasi"
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input
                      label="Kapasitas Desain dan Operasional Alat IPAL"
                      class="form-group"
                      v-model="form.alatIPAL.kapasitas"
                    >
                    </base-input>
                  </div>
                </template>

                <template v-if="tempState.isAlatLainnya">
                  <div class="col-lg-12">
                    <base-input
                      label="Isi Terkait Fasilitas/Unit Apa yang Menyebabkan Kondisi Tidak Normal/Kondisi Darurat"
                      class="form-group"
                      v-model="form.alatLainnya"
                    >
                    </base-input>
                  </div>
                </template>

                <div class="col-lg-12">
                  <h5>Apakah Penyebab Kejadian Sudah Diatasi?</h5>
                  <base-input rules="required">
                    <el-select
                      v-model="form.statusKejadian.status"
                    >
                      <el-option
                        v-for="option in tempSelectForm.options.keluhan"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </base-input>
                </div>

                <div
                  class="col-lg-12"
                  v-if="form.statusKejadian.status"
                >
                  <base-input
                    label="Kapan Kejadian Tersebut Teratasi?"
                    class="form-group"
                  >
                    <flat-picker
                      slot-scope="{ focus, blur }"
                      @on-open="focus"
                      @on-close="blur"
                      :config="{
                        allowInput: true,
                        dateFormat: 'U',
                        altFormat: 'd/m/Y',
                        altInput: true,
                      }"
                      :placeholder="
                        form.keluhanMasyarakat.tanggalSelesai
                      "
                      class="form-control datepicker"
                      v-model="
                        form.statusKejadian.tanggalSelesai
                      "
                    ></flat-picker>
                  </base-input>
                </div>

                <div
                  class="col-lg-12"
                  v-if="!form.statusKejadian.status"
                >
                  <base-input
                    label="Rencana Penanggulangan"
                    class="form-group"
                    v-model="
                      form.statusKejadian
                        .rencanaPenanggulangan
                    "
                  >
                  </base-input>
                </div>

                <div class="col-lg-12">
                  <h5>
                    Apakah Ada Keluhan dari Masyarakat Karena Kejadian Ini?
                  </h5>
                  <base-input rules="required">
                    <el-select
                      v-model="form.keluhanMasyarakat.status"
                      @change="
                        handlerKeluhan(
                          form.keluhanMasyarakat.status
                        )
                      "
                    >
                      <el-option
                        v-for="option in tempSelectForm.options.keluhan"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </base-input>
                </div>

                <div class="col-lg-12">
                  <h5>Lampirkan Prosedur Penanganan</h5>
                  <base-input>
                    <file-input
                      ref="fileLampiran"
                      @change="uploadFileLampiran('fileLampiran')"
                    ></file-input>
                    <base-progress
                      v-if="tempProgressLampiran >= 1"
                      class="mb-0"
                      :type="tempProgressLampiran >= 100 ? 'green' : 'orange'"
                      :value="tempProgressLampiran"
                    ></base-progress>
                    <hour-glass
                      v-if="
                        tempProgressLampiran > 1 &&
                        tempProgressLampiran != 100
                      "
                      class="file-upload-animation"
                      size="24px"
                    ></hour-glass>
                    <span v-if="tempProgressLampiran >= 100">
                      <i
                        class="ni ni-check-bold text-primary file-upload-done"
                      ></i>
                    </span>
                  </base-input>
                </div>

                <div class="col-lg-12">
                  <h5>
                    Surat Penyampaian Kondisi Tidak Normal atau Kondisi
                    Darurat
                  </h5>
                  <base-input>
                    <file-input
                      ref="fileSurat"
                      @change="uploadFileSurat('fileSurat')"
                    ></file-input>
                    <base-progress
                      v-if="tempProgressSurat >= 1"
                      class="mb-0"
                      :type="tempProgressSurat >= 100 ? 'green' : 'orange'"
                      :value="tempProgressSurat"
                    ></base-progress>
                    <hour-glass
                      v-if="tempProgressSurat > 1 && tempProgressSurat != 100"
                      class="file-upload-animation"
                      size="24px"
                    ></hour-glass>
                    <span v-if="tempProgressSurat == 100">
                      <i
                        class="ni ni-check-bold text-primary file-upload-done"
                      ></i>
                    </span>
                  </base-input>
                </div>
                <div class="col-lg-12">
                  <h5>
                    Lampiran Bukti Logbook Harian Yang Ditanda Tangani Minimal Setara Manager Lingkungan
                  </h5>
                  <base-input>
                    <file-input
                      ref="fileSuratLogbook"
                      @change="uploadFileLogbook('fileSuratLogbook')"
                    ></file-input>
                    <base-progress
                      v-if="tempProgressLogbook >= 1"
                      class="mb-0"
                      :type="tempProgressLogbook >= 100 ? 'green' : 'orange'"
                      :value="tempProgressLogbook"
                    ></base-progress>
                    <hour-glass
                      v-if="tempProgressLogbook > 1 && tempProgressLogbook != 100"
                      class="file-upload-animation"
                      size="24px"
                    ></hour-glass>
                    <span v-if="tempProgressLogbook == 100">
                      <i
                        class="ni ni-check-bold text-primary file-upload-done"
                      ></i>
                    </span>
                  </base-input>
                </div>
              </form>
              </validation-observer> -->
            </div>

            <div slot="card-footer">
              <div class="row justify-content-end p-3">
                <base-button
                  v-if="!isUpdate"
                  class="col-1 mr-4"
                  @click="submitForm"
                  >Simpan</base-button
                >
                <base-button
                  v-if="isUpdate"
                  class="col-1 mr-4"
                  @click="submitUpdateForm"
                  >Update</base-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import defaults from "@/util/defaults";
import { jenisIndustri } from "@/data/jenis-industri";
import { kondisi } from "@/data/kondisi-tidak-normal";
import DescKondisiTidakNormal from './DescKondisiTidakNormal.vue';

const flatPickerConfig = {
  allowInput: true,
  dateFormat: 'U',
  altFormat: 'd/m/Y',
  altInput: true,
};

export default {
  components: {
    DescKondisiTidakNormal,
  },
  data() {
    return {
      flatPickerConfig,
      jenisIndustri,
      kondisi,
      baseURL: defaults.baseURL,
      form: {
        compID: "",
        namaPerusahaan: "",
        jenisIndustri: "",
        provName: "",
        kabkotName: "",
        provID: "",
        kabkotID: "",
        kondisi: "",
        kondisiTidakNormal: {
          status: "",
          penghentianSementara: "-",
          kalibrasiPeralatan: "-",
          kondisiLain: "-",
        },
        kondisiDarurat: {
          status: "",
          bencanaAlam: "-",
          gangguanKeamanan: "-",
        },
        kondisiTidakAdaAliranLimbah: {
          path: "",
        },
        kondisiLain: {
          status: "",
          perbaikanIPAL: "-",
          perbaikanProduksi: "-",
          gangguanListrik: "-",
          curahHujan: "-",
        },
        tanggalKejadian: 0,
        lokasi: "",
        fasilitas: "",
        alatSparing: {
          merek: "-",
          tanggalInstalasi: 0,
          tanggalOperasi: 0,
        },
        alatIPAL: {
          tanggalPembuatan: 0,
          tanggalOperasi: 0,
          kapasistas: "",
        },
        alatLainnya: "-",
        statusKejadian: {
          status: false,
          tanggalSelesai: 0,
          rencanaPenanggulangan: "",
        },
        keluhanMasyarakat: {
          status: false,
          ya: "-",
          tidak: "-",
        },
        fileLampiranPath: "",
        fileSuratPath: "",
        fileSuratLogbookPath: "",
      },
    };
  },
  methods: {
    async getCompanyData() {
      // JSON.parse(localStorage.getItem("auth-data"))
      const user_id = JSON.parse(localStorage.getItem("auth-data"))._id;
      const { data } = axios.get(`${this.baseURL}/report/list/5f340d5e328182315c11ee98`);
      console.log(data)
    },
  },
  created() {
    this.getCompanyData();
  },
}
</script>