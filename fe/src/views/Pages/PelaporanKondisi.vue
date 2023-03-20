<template>
  <div>
    <div id="pelaporan-kondisi">
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
        <h1 class="display-3 font-weight-light text-white m-0">
          Isian Laporan Kondisi Tidak Normal
        </h1>
        <h2 class="d-none text-white mx-4 my-0">-</h2>
        <h4 class="d-none text-default m-0">Listed Data</h4>
      </div>
      <base-header class="pb-8" type="primary"></base-header>

      <div v-if="$route.params.render == 'list'" class="container-fluid mt--7">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="card">
              <!-- Filter -->
              <div class="p-3 w-100">
                <!-- Level: Nasional -->
                <template  v-if="this.$store.state.auth.level < 1">
                  <div class="row">
                    <div class="col-12">
                      <div class="col-2 float-right mb-4">
                        <base-button class="w-100" size="md" type="primary" @click="exportExcel">
                          Download
                        </base-button>
                        <!-- <base-button
                          class="w-100"
                          size="md"
                          type="primary"
                          @click="downloadCSV(csvData)"
                          >Download</base-button
                        > -->
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2 pr-0">
                      <el-select
                        class="w-100"
                        v-model="selects.type"
                        placeholder="Jenis Industri"
                        filterable
                        @change="filterComanyType()"
                      >
                        <el-option
                          v-for="option in selects.options.type"
                          :key="option.name"
                          :label="option.name"
                          :value="option.value"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="col-2 pr-0">
                      <el-select
                        class="w-100"
                        v-model="selects.prov"
                        placeholder="Provinsi"
                        filterable
                        @change="filterProvince()"
                      >
                        <el-option
                          v-for="option in selects.options.prov"
                          :key="option._id"
                          :label="option.name"
                          :value="option._id"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="col-2 pr-0">
                      <el-select
                        class="w-100"
                        v-model="selects.city"
                        placeholder="Kab/Kot"
                        filterable
                        @change="filterCity()"
                      >
                        <el-option
                          v-for="option in selects.options.city"
                          :key="option._id"
                          :label="option.name"
                          :value="option._id"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="col-2 pr-0">
                      <el-select
                        class="w-100"
                        v-model="selects.comp"
                        filterable
                        placeholder="Industri"
                        @change="filterIndustry()"
                      >
                        <el-option
                          v-for="option in selects.options.comp"
                          :key="option._id"
                          :label="option.value"
                          :value="option.compID"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="col-2 pr-0">
                      <base-input class="m-0">
                        <flat-picker
                          placeholder="Waktu"
                          slot-scope="{ focus, blur }"
                          @on-open="focus"
                          @on-close="blur"
                          :config="{
                            dateFormat: 'U',
                            allowInput: true,
                            enableTime: false,
                            altFormat: 'd/m/Y',
                            altInput: true,
                            time_24hr: true,
                            mode: 'range',
                          }"
                          class="form-control datepicker"
                          v-model="selectedTime"
                        ></flat-picker>
                      </base-input>
                    </div>
                    <div class="col-2">
                      <el-select class="w-100" v-model="selects.status" placeholder="Status" @change="filterStatus()">
                        <el-option label="Semua" value="" />
                        <el-option label="Diterima" value="accepted" />
                        <el-option label="Ditolak" value="rejected" />
                        <el-option label="Menunggu validasi" value="waiting" />
                      </el-select>
                    </div>
                  </div>
                </template>
                <!-- Level: Provinsi -->
                <div class="row" v-if="this.$store.state.auth.level == 1">
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selects.type"
                      filterable
                      placeholder="Jenis Industri"
                      @change="filterComanyType()"
                    >
                      <el-option
                        v-for="option in selects.options.type"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selects.city"
                      placeholder="Kab/Kot"
                      filterable
                      @change="filterCity()"
                    >
                      <el-option
                        v-for="option in selects.options.city"
                        :key="option._id"
                        :label="option.label"
                        :value="option._id"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      filterable
                      v-model="selects.comp"
                      placeholder="Industri"
                      @change="filterIndustry()"
                    >
                      <el-option
                        v-for="option in selects.options.comp"
                        :key="option._id"
                        :label="option.value"
                        :value="option.compID"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <base-input class="m-0">
                      <flat-picker
                        placeholder="Waktu"
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          dateFormat: 'U',
                          allowInput: true,
                          enableTime: false,
                          altFormat: 'd/m/Y',
                          altInput: true,
                          time_24hr: true,
                          mode: 'range',
                        }"
                        class="form-control datepicker"
                        v-model="selectedTime"
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-2">
                    <el-select class="w-100" v-model="selects.status" placeholder="Status" @change="filterStatus()">
                      <el-option label="Semua" value="" />
                      <el-option label="Diterima" value="accepted" />
                      <el-option label="Ditolak" value="rejected" />
                      <el-option label="Menunggu validasi" value="waiting" />
                    </el-select>
                  </div>
                </div>
                <!-- Level: Kab/Kot -->
                <div class="row" v-if="this.$store.state.auth.level == 2">
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selects.type"
                      filterable
                      placeholder="Jenis Industri"
                      @change="filterComanyType()"
                    >
                      <el-option
                        v-for="option in selects.options.type"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <el-select
                      class="w-100"
                      v-model="selects.comp"
                      filterable
                      placeholder="Industri"
                      @change="filterIndustry()"
                    >
                      <el-option
                        v-for="option in selects.options.comp"
                        :key="option._id"
                        :label="option.value"
                        :value="option.compID"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="col-2 pr-0">
                    <base-input class="m-0">
                      <flat-picker
                        placeholder="Waktu"
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          dateFormat: 'U',
                          allowInput: true,
                          enableTime: false,
                          altFormat: 'd/m/Y',
                          altInput: true,
                          time_24hr: true,
                          mode: 'range',
                        }"
                        class="form-control datepicker"
                        v-model="selectedTime"
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-2">
                    <el-select class="w-100" v-model="selects.status" placeholder="Status" @change="filterStatus()">
                      <el-option label="Semua" value="" />
                      <el-option label="Diterima" value="accepted" />
                      <el-option label="Ditolak" value="rejected" />
                      <el-option label="Menunggu validasi" value="waiting" />
                    </el-select>
                  </div>
                </div>
                <!-- Level: Industri -->
                <div class="row" v-if="this.$store.state.auth.level > 2">
                  <div class="col-2 pr-0">
                    <base-input class="m-0">
                      <flat-picker
                        placeholder="Waktu"
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{
                          dateFormat: 'U',
                          allowInput: true,
                          enableTime: false,
                          altFormat: 'd/m/Y',
                          altInput: true,
                          time_24hr: true,
                          mode: 'range',
                        }"
                        class="form-control datepicker"
                        v-model="selectedTime"
                      ></flat-picker>
                    </base-input>
                  </div>
                  <div class="col-2">
                    <el-select class="w-100" v-model="selects.status" placeholder="Status" @change="filterStatus()">
                      <el-option label="Semua" value="" />
                      <el-option label="Diterima" value="accepted" />
                      <el-option label="Ditolak" value="rejected" />
                      <el-option label="Menunggu validasi" value="waiting" />
                    </el-select>
                  </div>
                  <div class="col-2">
                    <base-button
                      class="w-100"
                      size="md"
                      type="primary"
                      @click="toForm"
                      >Tambah</base-button
                    >
                  </div>
                </div>
              </div>
              <!-- Table -->
              <el-table
                :data="queriedData"
                row-key="id"
                header-row-class-name="thead-light"
                @sort-change="sortChange"
                @selection-change="selectionChange"
              >
                <el-table-column
                  v-if="this.$store.state.auth.level < 3"
                  label="Nama Perusahaan"
                  prop="compDetails.compName"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  v-if="this.$store.state.auth.level < 3"
                  label="Jenis Industri"
                  prop="compDetails.compType"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  v-if="this.$store.state.auth.level < 1"
                  label="Provinsi"
                  prop="provDetails.provName"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  v-if="this.$store.state.auth.level < 2"
                  label="Kab/Kot"
                  prop="kabkotDetails.kabkotName"
                  min-width
                  sortable
                ></el-table-column>
                <el-table-column
                  label="Waktu"
                  prop="time"
                  min-width
                  align="center"
                  sortable
                >
                  <template v-slot="{ row }">
                    <div class="cell">
                      {{ unixTS2DMY(row.tanggalKejadian) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Kondisi"
                  prop="kondisi"
                  min-width
                  align="left"
                  sortable
                ></el-table-column>
                <el-table-column label="Status" min-width>
                  <template v-slot="{ row }">
                    <template v-if="row.validitas">
                      <span v-if="row.validitas.status === 'rejected'">Ditolak</span>
                      <span v-else-if="row.validitas.status === 'accepted'">Disetujui</span>
                      <span v-else-if="row.validitas.status === 'waiting'">Menunggu Validasi</span>
                    </template>
                    <span v-else>Menunggu Validasi</span>
                  </template>
                </el-table-column>
                <el-table-column label="Detail" min-width align="right" sortable
                  ><template v-slot="{ row }">
                    <base-button
                      class="btn-sm bg-secondary"
                      @click="toDetail(row)"
                      >Detail</base-button
                    >
                    <!-- <base-button
                      class="btn-sm bg-primary"
                      @click="downloadCSV(csvData)"
                    >
                      Download
                    </base-button> -->
                  </template>
                </el-table-column>
              </el-table>
              <div
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
                    <span v-if="selectedRows.length">
                      &nbsp; &nbsp; {{ selectedRows.length }} rows selected
                    </span>
                  </p>
                </div>
                <base-pagination
                  class="pagination-no-border"
                  v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total="total"
                ></base-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid mt--7" v-if="$route.params.render == 'form'">
        <div v-if="this.$store.state.auth.level > 2" class="row justify-content-center mb--4">
          <div class="col">
            <div class="card bg-white border-0">
              <div class="p-4">
                <h2 class="text-justify">
                  LAPORAN KONDISI TIDAK NORMAL ATAU KONDISI DARURAT
                </h2>
                <p class="mb-2 text-justify">
                  Fitur ini bertujuan melaporkan secara cepat KONDISI TIDAK
                  NORMAL dan KONDISI DARURAT peralatan SPARING. Penanggung jawab
                  usaha dan/atau kegiatan mendokumentasikan dan melaporkan
                  kondisi tidak normal dalam jangka waktu 3x24 jam setelah
                  terjadinya kondisi tidak normal kepada Bupati/Walikota dengan
                  tembusan DLH Provinsi dan KLHK. Kriteria kondisi tidak normal
                  dan kondisi darurat yaitu:
                </p>
                <ol type="A">
                  <li>
                    KONDISI TIDAK NORMAL
                    <ol>
                      <li>
                        Sesuai Pasal 8 ayat (3) PermenLHK No.93/2018 menyatakan
                        bahwa kondisi tidak normal meliputi:
                      </li>
                      <ol type="a">
                        <li>
                          Penghentian sementara dan penyalaan kembali operasi
                          produksi
                        </li>
                        <li>Kalibrasi peralatan</li>
                        <li>
                          Kondisi lain yang menyebabkan SPARING tidak dapat
                          digunakan secara optimal.
                        </li>
                      </ol>
                      <li>
                        Sementara itu kondisi lain yang menyebabkan peralatan
                        SPARING tidak dapat digunakan secara optimal
                        diantaranya:
                      </li>
                      <ol type="a">
                        <li>
                          Perbaikan IPAL (Perlu diperhatikan bahwa pada saat
                          startup dan shutdown IPAL akan ber-pengaruh terhadap
                          nilai kadar/kualitas air limbah)
                        </li>
                        <li>Perbaikan produksi</li>
                        <li>Gangguan supply listrik</li>
                        <li>
                          Khusus industri tambang pada saat curah hujan di atas
                          rata-rata tahunan
                        </li>
                      </ol>
                    </ol>
                  </li>
                  <li>
                    KONDISI DARURAT<br />
                    Kondisi darurat berupa:
                    <ol>
                      <li>
                        Bencana alam dapat berupa banjir, gempa bumi, gunung
                        meletus, gangguan binatang, dan lain sebagainya
                      </li>
                      <li>
                        Gangguan keamanan, dapat berupa pencurian, perusakan,
                        dan lain sebagainya.
                      </li>
                    </ol>
                  </li>
                </ol>
              </div>
            </div>
            <div class="card">
              <!-- Filter -->
              <div class="card-header p-3 w-100">
                <div class="row justify-content-between">
                  <div class="col-10 pr-0 ml-4">
                    <h3>Tambah Laporan Kondisi</h3>
                  </div>
                  <base-button
                    @click="$router.push('list')"
                    class="col-1 bg-primary mr-4"
                    >Kembali</base-button
                  >
                </div>
              </div>
              <div class="card-body">
                <validation-observer ref="formValidator">
                  <form>
                    <div class="col-lg-12 text-center">
                      <h3>
                        {{ formPelaporanKondisi.namaPerusahaan }}
                      </h3>
                    </div>
                    <div class="col-lg-12">
                      <h4>Informasi Umum</h4>
                    </div>
                    <div class="col-lg-12">
                      <h5>Jenis Industri</h5>
                      <base-input name="Jenis Industri" rules="required">
                        <el-select v-model="formPelaporanKondisi.jenisIndustri">
                          <el-option
                            v-for="option in opsiJenisIndustri"
                            :key="option.label"
                            :label="option.label"
                            :value="option.value"
                          ></el-option>
                        </el-select>
                      </base-input>
                    </div>
                    <div class="col-lg-12">
                      <h5>Pilih Kondisi</h5>
                      <base-input name="Pilih Kondisi" rules="required">
                        <el-select
                          v-model="formPelaporanKondisi.kondisi"
                          @change="thenKondisi(formPelaporanKondisi.kondisi)"
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
                          v-model="formPelaporanKondisi.kondisiTidakNormal.status"
                          @change="
                            // resetKondisi();
                            thenTidakNormal(
                              formPelaporanKondisi.kondisiTidakNormal.status
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
                          v-model="formPelaporanKondisi.kondisiDarurat.status"
                          @change="
                            // resetKondisi();
                            thenDarurat(
                              formPelaporanKondisi.kondisiDarurat.status
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
                      <base-input name="Bukti Logbook Harian" :rules="isUpdate ? '' : 'required'">
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
                      <small
                        v-if="formPelaporanKondisi.fileSuratLogbookPath"
                        class="d-block mt-2 mb-4 text-justify">
                        <a :href="`${baseURL}${formPelaporanKondisi.fileSuratLogbookPath}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                      </small>
                    </div>
                    <div class="col-lg-12" v-if="tempState.isKondisiLain">
                      <h5>
                        Kondisi Lain yang Menyebabkan SPARING Tidak dapat
                        Digunakan Secara Optimal
                      </h5>
                      <base-input name="Kondisi" rules="required">
                        <el-select
                          v-model="formPelaporanKondisi.kondisiLain.status"
                          @change="
                            thenKondisiLain(
                              formPelaporanKondisi.kondisiLain.status
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
                      <base-input label="Tanggal Kejadian" name="Tanggal Kejadian" class="form-group" rules="required">
                        <flat-picker
                          :config="flatpickerConfig"
                          class="form-control datepicker"
                          v-model="formPelaporanKondisi.tanggalKejadian" />
                      </base-input>
                    </div>

                    <div class="col-lg-12">
                      <base-input label="End Tanggal Kejadian" name="End Tanggal Kejadian" class="form-group" rules="required">
                        <flat-picker
                          :config="flatpickerConfig"
                          class="form-control datepicker"
                          v-model="formPelaporanKondisi.endTanggalKejadian" />
                      </base-input>
                    </div>
                    <div class="col-lg-12">
                      <base-input
                        label="Lokasi"
                        class="form-group"
                        name="Lokasi"
                        rules="required"
                        v-model="formPelaporanKondisi.lokasi"
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
                          v-model="formPelaporanKondisi.fasilitas"
                          @change="
                            resetFasilitas;
                            thenFasilitas(formPelaporanKondisi.fasilitas);
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
                          v-model="formPelaporanKondisi.alatSparing.merek"
                          name="Merek Alat Sparing"
                          rules="required"
                        >
                        </base-input>
                      </div>
                      <div class="col-lg-12">
                        <base-input
                          label="Tanggal Instalasi Alat Sparing"
                          class="form-group"
                          rules="required"
                          name="Tanggal Instalasi Alat Sparing"
                        >
                          <flat-picker
                            slot-scope="{ focus, blur }"
                            @on-open="focus"
                            @on-close="blur"
                            :config="flatpickerConfig"
                            class="form-control datepicker"
                            v-model="formPelaporanKondisi.alatSparing.tanggalInstalasi" />
                        </base-input>
                      </div>
                      <div class="col-lg-12">
                        <base-input
                          label="Tanggal Dioperasikan Alat Sparing"
                          class="form-group"
                          rules="required"
                          name="Tanggal Dioperasikan Alat Sparing"
                        >
                          <flat-picker
                            slot-scope="{ focus, blur }"
                            @on-open="focus"
                            @on-close="blur"
                            :config="flatpickerConfig"
                            class="form-control datepicker"
                            v-model="formPelaporanKondisi.alatSparing.tanggalOperasi" />
                        </base-input>
                      </div>
                    </template>

                    <template v-if="tempState.isAlatIPAL">
                      <div class="col-lg-12">
                        <base-input
                          label="Tanggal Instalasi Alat IPAL"
                          class="form-group"
                          rules="required"
                          name="Tanggal Instalasi Alat IPAL"
                        >
                          <flat-picker
                            slot-scope="{ focus, blur }"
                            @on-open="focus"
                            @on-close="blur"
                            :config="flatpickerConfig"
                            class="form-control datepicker"
                            v-model="formPelaporanKondisi.alatIPAL.tanggalPembuatan" />
                        </base-input>
                      </div>
                      <div class="col-lg-12">
                        <base-input
                          label="Tanggal Dioperasikan Alat IPAL"
                          class="form-group"
                          rules="required"
                          name="Tanggal Dioperasikan Alat IPAL"
                        >
                          <flat-picker
                            slot-scope="{ focus, blur }"
                            @on-open="focus"
                            @on-close="blur"
                            :config="flatpickerConfig"
                            class="form-control datepicker"
                            v-model="formPelaporanKondisi.alatIPAL.tanggalOperasi" />
                        </base-input>
                      </div>
                      <div class="col-lg-12">
                        <base-input
                          label="Kapasitas Desain dan Operasional Alat IPAL"
                          class="form-group"
                          rules="required"
                          name="Kapasitas Desain dan Operasional Alat IPAL"
                          v-model="formPelaporanKondisi.alatIPAL.kapasitas"
                        >
                        </base-input>
                      </div>
                    </template>

                    <template v-if="tempState.isAlatSparingIPAL">
                      <div class="col-lg-12">
                        <base-input
                          label="Merek Alat Sparing"
                          class="form-group"
                          rules="required"
                          name="Merek Alat Sparing"
                          v-model="formPelaporanKondisi.alatSparing.merek"
                        >
                        </base-input>
                      </div>
                      <div class="col-lg-12">
                        <base-input
                          label="Tanggal Instalasi Alat Sparing"
                          class="form-group"
                          rules="required"
                          name="Tanggal Instalasi Alat Sparing"
                        >
                          <flat-picker
                            slot-scope="{ focus, blur }"
                            @on-open="focus"
                            @on-close="blur"
                            :config="flatpickerConfig"
                            class="form-control datepicker"
                            v-model="formPelaporanKondisi.alatSparing.tanggalInstalasi" />
                        </base-input>
                      </div>
                      <div class="col-lg-12">
                        <base-input
                          label="Tanggal Dioperasikan Alat Sparing"
                          class="form-group"
                          rules="required"
                          name="Tanggal Dioperasikan Alat Sparing"
                        >
                          <flat-picker
                            slot-scope="{ focus, blur }"
                            @on-open="focus"
                            @on-close="blur"
                            :config="flatpickerConfig"
                            class="form-control datepicker"
                            v-model="formPelaporanKondisi.alatSparing.tanggalOperasi" />
                        </base-input>
                      </div>
                      <div class="col-lg-12">
                        <base-input
                          label="Tanggal Instalasi Alat IPAL"
                          class="form-group"
                          rules="required"
                          name="Tanggal Instalasi Alat IPAL"
                        >
                          <flat-picker
                            slot-scope="{ focus, blur }"
                            @on-open="focus"
                            @on-close="blur"
                            :config="flatpickerConfig"
                            class="form-control datepicker"
                            v-model="formPelaporanKondisi.alatIPAL.tanggalPembuatan" />
                        </base-input>
                      </div>
                      <div class="col-lg-12">
                        <base-input
                          label="Tanggal Dioperasikan Alat IPAL"
                          class="form-group"
                          rules="required"
                          name="Tanggal Dioperasikan Alat IPAL"
                        >
                          <flat-picker
                            slot-scope="{ focus, blur }"
                            @on-open="focus"
                            @on-close="blur"
                            :config="flatpickerConfig"
                            class="form-control datepicker"
                            v-model="formPelaporanKondisi.alatIPAL.tanggalOperasi" />
                        </base-input>
                      </div>
                      <div class="col-lg-12">
                        <base-input
                          label="Kapasitas Desain dan Operasional Alat IPAL"
                          class="form-group"
                          rules="required"
                          name="Kapasitas Desain dan Operasional Alat IPAL"
                          v-model="formPelaporanKondisi.alatIPAL.kapasitas"
                        >
                        </base-input>
                      </div>
                    </template>

                    <template v-if="tempState.isAlatLainnya">
                      <div class="col-lg-12">
                        <base-input
                          label="Isi Terkait Fasilitas/Unit Apa yang Menyebabkan Kondisi Tidak Normal/Kondisi Darurat"
                          class="form-group"
                          rules="required"
                          name="Penyebab"
                          v-model="formPelaporanKondisi.alatLainnya"
                        >
                        </base-input>
                      </div>
                    </template>

                    <div class="col-lg-12">
                      <h5>Apakah Penyebab Kejadian Sudah Diatasi?</h5>
                      <base-input rules="required" name="Kejadian Sudah Diatasi">
                        <el-select
                          v-model="formPelaporanKondisi.statusKejadian.status"
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
                      v-if="formPelaporanKondisi.statusKejadian.status"
                    >
                      <base-input
                        label="Kapan Kejadian Tersebut Teratasi?"
                        class="form-group"
                        rules="required"
                        name="Kapan Kejadian Tersebut Teratasi"
                      >
                        <flat-picker
                          slot-scope="{ focus, blur }"
                          @on-open="focus"
                          @on-close="blur"
                          :config="flatpickerConfig"
                          class="form-control datepicker"
                          v-model="formPelaporanKondisi.statusKejadian.tanggalSelesai" />
                      </base-input>
                    </div>

                    <div
                      class="col-lg-12"
                      v-if="!formPelaporanKondisi.statusKejadian.status"
                    >
                      <base-input
                        label="Rencana Penanggulangan"
                        class="form-group"
                        rules="required"
                        name="Rencana Penanggulangan"
                        v-model="
                          formPelaporanKondisi.statusKejadian
                            .rencanaPenanggulangan
                        "
                      >
                      </base-input>
                    </div>

                    <div class="col-lg-12">
                      <h5>
                        Apakah Ada Keluhan dari Masyarakat Karena Kejadian Ini?
                      </h5>
                      <base-input rules="required" name="Keluhan dari Masyarakat">
                        <el-select
                          v-model="formPelaporanKondisi.keluhanMasyarakat.status"
                          @change="
                            handlerKeluhan(
                              formPelaporanKondisi.keluhanMasyarakat.status
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
                      <base-input :rules="isUpdate ? '' : 'required'" name="Prosedur Penanganan" v-model="formPelaporanKondisi.fileLampiranPath">
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
                        <small
                          v-if="formPelaporanKondisi.fileLampiranPath"
                          class="d-block mt-2 mb-4 text-justify">
                          <a :href="`${baseURL}${formPelaporanKondisi.fileLampiranPath}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </base-input>
                    </div>

                    <div class="col-lg-12">
                      <h5>
                        Surat Penyampaian Kondisi Tidak Normal atau Kondisi
                        Darurat
                      </h5>
                      <base-input :rules="isUpdate ? '' : 'required'" name="Surat Penyampaian">
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
                        <small
                          v-if="formPelaporanKondisi.fileSuratPath"
                          class="d-block mt-2 mb-4 text-justify">
                          <a :href="`${baseURL}${formPelaporanKondisi.fileSuratPath}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </base-input>
                    </div>
                    <div class="col-lg-12">
                      <h5>
                      Lampiran Bukti Logbook Harian Yang Ditanda Tangani Minimal Setara Manager Lingkungan
                      </h5>
                      <base-input :rules="isUpdate ? '' : 'required'" name="Bukti Logbook Harian">
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
                        <small
                          v-if="formPelaporanKondisi.fileSuratLogbookPath"
                          class="d-block mt-2 mb-4 text-justify">
                          <a :href="`${baseURL}${formPelaporanKondisi.fileSuratLogbookPath}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </base-input>
                    </div>

                    <div class="col-lg-12">
                      <h5>
                        Pelaporan Tidak Normal
                      </h5>
                      <base-input :rules="isUpdate ? '' : 'required'" name="Pelaporan Tidak Normal">
                        <file-input
                          ref="pelaporanTidakNormal"
                          @change="uploadFilePelaporanTidakNormal('pelaporanTidakNormal')"
                        ></file-input>
                        <base-progress
                          v-if="tempProgressPelaporanTidakNormal >= 1"
                          class="mb-0"
                          :type="tempProgressPelaporanTidakNormal >= 100 ? 'green' : 'orange'"
                          :value="tempProgressPelaporanTidakNormal"
                        ></base-progress>
                        <hour-glass
                          v-if="tempProgressPelaporanTidakNormal > 1 && tempProgressPelaporanTidakNormal != 100"
                          class="file-upload-animation"
                          size="24px"
                        ></hour-glass>
                        <span v-if="tempProgressPelaporanTidakNormal == 100">
                          <i
                            class="ni ni-check-bold text-primary file-upload-done"
                          ></i>
                        </span>
                        <small
                          v-if="formPelaporanKondisi.fileLaporanPath"
                          class="d-block mt-2 mb-4 text-justify">
                          <a :href="`${baseURL}${formPelaporanKondisi.fileLaporanPath}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </base-input>
                    </div>
                  </form>
                </validation-observer>
              </div>

              <div slot="card-footer">
                <div class="row justify-content-end p-3">
                  <base-button
                    v-if="!isUpdate"
                    class="col-1 mr-4"
                    @click="submitForm"
                    :disabled="disabled"
                    >Simpan</base-button
                  >
                  <base-button
                    v-if="isUpdate"
                    class="col-1 mr-4"
                    @click="submitUpdateForm"
                    :disabled="disabled"
                    >Update</base-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="container-fluid mt--7"
        v-if="$route.params.render == 'detail'"
      >
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div class="card">
              <!-- Filter -->
              <div class="p-3 w-100">
                <div class="row justify-content-between">
                  <div class="col-8 pr-0">
                    <h3>Detail Pengumuman</h3>
                  </div>
                  <base-button
                    @click="$router.push('list')"
                    class="col-1 bg-primary mr-4"
                    >Kembali</base-button
                  >
                  <template v-if="('validitas' in tempRow && tempRow.validitas.status !== 'accepted')">
                    <base-button
                      v-if="this.$store.state.auth.level > 2"
                      @click="toUpdateForm"
                      class="col-1 bg-primary mr-4"
                      >Ubah</base-button
                    >
                    <base-button
                      v-if="this.$store.state.auth.level > 2"
                      @click="deleteForm"
                      class="col-1 bg-danger mr-4"
                      >Hapus</base-button
                    >
                </template>
                </div>
              </div>
              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Nama Perusahaan</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ tempRow.compDetails.compName }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Jenis Industri</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ tempRow.compDetails.compType }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Provinsi</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ tempRow.provDetails.provName }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Kabupaten/Kota</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ tempRow.kabkotDetails.kabkotName }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Kondisi</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ tempRow.kondisi }}</span>
                  </div>
                </div>
                <div
                  class="row mb-4"
                  v-if="tempRow.kondisi == 'Kondisi Tidak Normal'"
                >
                  <div class="col-lg-2">
                    <strong>Kondisi Tidak Normal</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ tempRow.kondisiTidakNormal.status }}</span>
                  </div>
                </div>
                <div
                  class="row mb-4"
                  v-if="tempRow.kondisi == 'Kondisi Darurat'"
                >
                  <div class="col-lg-2">
                    <strong>Kondisi Darurat</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ tempRow.kondisiDarurat.status }}</span>
                  </div>
                </div>
                <div
                  class="row mb-4"
                  v-if="tempRow.kondisiTidakNormal.kondisiLain == 'Ya'"
                >
                  <div class="col-lg-2">
                    <strong>Kondisi Lainnya</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ tempRow.kondisiLain.status }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Tanggal Kejadian</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ unixTS2DMY(tempRow.tanggalKejadian) }}</span>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>End Tanggal Kejadian</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ unixTS2DMY(tempRow.endTanggalKejadian) }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Lokasi</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ tempRow.lokasi }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Fasilitas/Unit</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ tempRow.fasilitas }}</span>
                  </div>
                </div>

                <template
                  v-if="
                    tempRow.fasilitas == 'Alat Sparing' ||
                    tempRow.fasilitas == 'Alat Sparing & IPAL'
                  "
                >
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Merek Alat Sparing</strong>
                    </div>
                    <div class="col-lg-10">
                      <span>{{ tempRow.alatSparing.merek }}</span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Tanggal Instalasi Alat Sparing</strong>
                    </div>
                    <div class="col-lg-10">
                      <span>{{
                        unixTS2DMY(tempRow.alatSparing.tanggalInstalasi)
                      }}</span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Tanggal Dioperasikannya Alat Sparing</strong>
                    </div>
                    <div class="col-lg-10">
                      <span>{{
                        unixTS2DMY(tempRow.alatSparing.tanggalOperasi)
                      }}</span>
                    </div>
                  </div>
                </template>

                <template
                  v-if="
                    tempRow.fasilitas == 'Alat IPAL' ||
                    tempRow.fasilitas == 'Alat Sparing & IPAL'
                  "
                >
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Tanggal Pembuatan Alat IPAL</strong>
                    </div>
                    <div class="col-lg-10">
                      <span>{{
                        unixTS2DMY(tempRow.alatIPAL.tanggalPembuatan)
                      }}</span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Tanggal Dioperasikannya Alat IPAL</strong>
                    </div>
                    <div class="col-lg-10">
                      <span>{{
                        unixTS2DMY(tempRow.alatIPAL.tanggalOperasi)
                      }}</span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong
                        >Kapasitas Desain dan Operasional Alat IPAL</strong
                      >
                    </div>
                    <div class="col-lg-10">
                      <span>{{ tempRow.alatIPAL.kapasitas }}</span>
                    </div>
                  </div>
                </template>

                <div
                  class="row mb-4"
                  v-if="tempRow.fasilitas == 'Alat Lainnya'"
                >
                  <div class="col-lg-2">
                    <strong>Penyebab Kondisi Tidak Normal/Darurat</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ tempRow.alatLainnya }}</span>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Apakah Penyebab Kejadian Sudah Diatasi?</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{
                      tempRow.statusKejadian.status ? "Ya" : "Tidak"
                    }}</span>
                  </div>
                </div>

                <div
                  class="row mb-4"
                  v-if="tempRow.statusKejadian.status == true"
                >
                  <div class="col-lg-2">
                    <strong>Tanggal Kejadian Sudah Teratasi</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ unixTS2DMY(tempRow.statusKejadian.tanggalSelesai) }}</span>
                  </div>
                </div>
                <div
                  class="row mb-4"
                  v-if="tempRow.statusKejadian.status == false"
                >
                  <div class="col-lg-2">
                    <strong>Rencana Penanggulangan</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{
                      tempRow.statusKejadian.rencanaPenanggulangan
                    }}</span>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong
                      >Apakah Ada Keluhan dari Masyarakat Karena Kejadian
                      Ini?</strong
                    >
                  </div>
                  <div class="col-lg-10">
                    <span>{{
                      tempRow.keluhanMasyarakat.status ? "Ya" : "Tidak"
                    }}</span>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Lampiran Prosedur Penanganan</strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="
                        tempRow.fileLampiranPath
                          ? `${baseURL}/${tempRow.fileLampiranPath}`
                          : ''
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        tempRow.fileLampiranPath === ""
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong
                      >Surat Penyampaian Kondisi Tidak Normal Atau Kondisi
                      Darurat</strong
                    >
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="
                        tempRow.fileSuratPath
                          ? `${baseURL}/${tempRow.fileSuratPath}`
                          : ''
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        tempRow.fileSuratPath === ""
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong
                      >Lampiran Bukti Logbook Harian Yang Ditanda Tangani
                      Minimal Setara Manager Lingkungan</strong
                    >
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="
                        tempRow.fileSuratLogbookPath
                          ? `${baseURL}/${tempRow.fileSuratLogbookPath}`
                          : ''
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        tempRow.fileSuratLogbookPath.path === "" || tempRow.fileSuratLogbookPath === ""
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-2">Pelaporan Tidak Normal</div>
                  <div class="col-lg-10">
                    <a
                      :href="
                        tempRow.fileLaporanPath
                          ? `${baseURL}/${tempRow.fileLaporanPath}`
                          : ''
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        (tempRow.fileLaporanPath && tempRow.fileLaporanPath.path === "") || tempRow.fileLaporanPath === ""
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>
              </div>

              <!-- <div slot="card-footer">
                <div class="row justify-content-center p-3">
                  <base-button
                    class="col-2 p-2"
                    @click="toDownload(tempRow.filePengumuman.path)"
                    >Download</base-button
                  >
                </div>
              </div> -->
            </div>
          </div>
          <div class="row justify-content-end position-fixed right-0" style="top:50%">
            <base-button
              @click="showValidate = true"
              class="mx-3 mb-4 "
              type="danger">
              <p
                v-if="(this.$store.state.auth.level > 2) || ('validitas' in tempRow && tempRow.validitas.status === 'accepted')"
                class="mb-0">
                Riwayat Validasi
              </p>
              <p v-else class="mb-0">Validasi</p>
            </base-button>
          </div>
        </div>
        <ValidateRequest v-if="showValidate" :id="tempRow._id" :showModal="showValidate" @close-modal="showValidate = false" />
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
import swal from "sweetalert2";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.css";
import "sweetalert2/dist/sweetalert2.css";
import Loading from "vue-loading-overlay";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import HtmlEditor from "@/components/Inputs/HtmlEditor";
import { HourGlass } from "vue-loading-spinner";
import FileInput from "@/components/Inputs/FileInput";
import pelaporanKondisiDummy from "./pelaporanKondisiDummy.js";
import defaults from "@/util/defaults";
import ValidateRequest from "./KondisiTidakNormal/ValidateRequest.vue";

const axios = require("axios");
const uniqid = require("uniqid");
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary",
    cancelButton: "btn btn-secondary",
  },
  buttonsStyling: false,
});

function intRNG(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function floatRNG(min, max) {
  let range = max - min;
  let delta = Math.random() * range;
  return min + delta;
}
function now(back) {
  let time = new Date().getTime() / 1000;
  let delta = back * 1800;
  return time - delta;
}

const flatpickerConfig = {
  allowInput: true,
  dateFormat: 'U',
  altFormat: 'd/m/Y',
  altInput: true,
  maxDate: "today",
};

const form = {
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
  tanggalKejadian: null,
  endTanggalKejadian: null,
  lokasi: "",
  fasilitas: "",
  alatSparing: {
    merek: "-",
    tanggalInstalasi: null,
    tanggalOperasi: null,
  },
  alatIPAL: {
    tanggalPembuatan: null,
    tanggalOperasi: null,
    kapasistas: "",
  },
  alatLainnya: "-",
  statusKejadian: {
    status: false,
    tanggalSelesai: null,
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
  fileLaporanPath: "",
}

export default {
  mixins: [clientPaginationMixin],
  components: {
    HourGlass,
    FileInput,
    HtmlEditor,
    BasePagination,
    Loading,
    BaseInput,
    flatPicker,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    ValidateRequest,
  },
  data() {
    return {
      baseURL: defaults.baseURL,
      tempProgressLampiran: 0,
      tempProgressSurat: 0,
      tempProgressLogbook: 0,
      tempProgressPelaporanTidakNormal: 0,
      showValidate: false,
      validateData: {},
      tempState: {
        isTidakNormal: false,
        isDarurat: false,
        isKondisiLain: false,
        isAlatSparing: false,
        isAlatIPAL: false,
        isAlatSparingIPAL: false,
        isAlatLainnya: false,
      },
      tempSelectForm: {
        selected: {
          kondisi: "",
          tidakNormal: "",
          darurat: "",
          tidakAliranLimbah: "",
          kondisiLain: "",
          fasilitas: "",
        },
        options: {
          kondisi: [
            { label: "Kondisi Terkendala Internet", value: "Kondisi Terkendala Internet" },
            { label: "Kondisi Tidak Normal", value: "Kondisi Tidak Normal" },
            { label: "Kondisi Darurat", value: "Kondisi Darurat" },
            {
              label: "Kondisi Tidak Ada Aliran Air Limbah",
              value: "Kondisi Tidak Ada Aliran Air Limbah",
            },
          ],
          tidakNormal: [
            {
              label:
                "Penghentian Sementara dan Penyalaan Kembali Operasi Produksi",
              value:
                "Penghentian Sementara dan Penyalaan Kembali Operasi Produksi",
            },
            { label: "Kalibrasi Peralatan", value: "Kalibrasi Peralatan" },
            {
              label:
                "Kondisi Lain yang Menyebabkan SPARING Tidak dapat Digunakan Secara Optimal",
              value:
                "Kondisi Lain yang Menyebabkan SPARING Tidak dapat Digunakan Secara Optimal",
            },
          ],
          darurat: [
            {
              label:
                "Bencana Alam, Dapat Berupa Pencurian, Perusakan, dan Lain Sebagainya",
              value:
                "Bencana Alam dapat Berupa Pencurian, Perusakan, dan Lain Sebagainya",
            },
            {
              label:
                "Gangguan Keamanan, Dapat Berupa Pencurian, Perusakan, dan Lain Sebagainya",
              value:
                "Gangguan Keamanan, Dapat Berupa Pencurian, Perusakan, dan Lain Sebagainya",
            },
          ],
          tidakAliranLimbah: [
            {
              label: "Kondisi Tidak Ada Aliran Air Limbah",
              value: "Kondisi Tidak Ada Aliran Air Limbah",
            },
          ],
          kondisiLain: [
            {
              label:
                "Perbaikan IPAL (Perlu Diperhatikan Bahwa pada Saat Startup dan Shutdown IPAL akan ber-pengaruh Terhadap Nilai Kadar/Kualitas Air Limbah)",
              value:
                "Perbaikan IPAL (Perlu Diperhatikan Bahwa pada Saat Startup dan Shutdown IPAL akan ber-pengaruh Terhadap Nilai Kadar/Kualitas Air Limbah)",
            },
            { label: "Perbaikan Produksi", value: "Perbaikan Produksi" },
            {
              label: "Gangguan Supply Listrik",
              value: "Gangguan Supply Listrik",
            },
            {
              label:
                "Khusus Industri Tambang pada Saat Curah Hujan diatas Rata-Rata Tahunan",
              value:
                "Khusus Industri Tambang pada Saat Curah Hujan diatas Rata-Rata Tahunan",
            },
          ],
          fasilitas: [
            { label: "Alat Sparing", value: "Alat Sparing" },
            { label: "Alat IPAL", value: "Alat IPAL" },
            { label: "Alat Sparing & IPAL", value: "Alat Sparing & IPAL" },
            { label: "Lainnya", value: "Lainnya" },
          ],
          keluhan: [
            { label: "Ya", value: true },
            { label: "Tidak", value: false },
          ],
        },
      },
      opsiJenisIndustri: [
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
      formPelaporanKondisi: form,
      isUpdate: false,
      formPengumuman: {
        datePengumuman: "1601367081",
        isiPengumuman: "",
        filePengumuman: {
          progress: 0,
          upload: 0,
          path: "",
        },
      },
      selectedTime: "",
      queryArray: ["", "", "", "", ""],
      tempSelect: null,
      selects: {
        options: {
          type: [
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
              value: 1,
            },
            {
              label: "Bravo",
              value: 2,
            },
            {
              label: "Charlie",
              value: 3,
            },
            {
              label: "Delta",
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
        status: null,
      },
      selectedRows: [],
      tableData: [],
      originalData: [],
      tempRow: {},
      disabled: false,
      auth: JSON.parse(localStorage.getItem("auth-data")),
      flatpickerConfig,
    };
  },
  computed: {
    csvData() {
      let csvTable = [];
      let tempTable = this.tableData;
      let tableLength = tempTable.length;
      if (this.$store.state.auth.level === 0) {
        for (let i = 0; i < tableLength; i++) {
          csvTable.push({
            1: [i],
            2: this.getTimestamp(tempTable[i]._id),
            3: tempTable[i].compDetails.compName,
            4: tempTable[i].compDetails.compType,
            5: tempTable[i].provDetails.provName,
            6: tempTable[i].kabkotDetails.kabkotName,
            7: tempTable[i].kondisiTidakNormal.penghentianSementara,
            8: tempTable[i].kondisiTidakNormal.kalibrasiPeralatan,
            9: tempTable[i].kondisiTidakNormal.kondisiLain,
            10: tempTable[i].kondisiDarurat.bencanaAlam,
            11: tempTable[i].kondisiDarurat.gangguanKeamanan,
            12: tempTable[i].kondisiLain.perbaikanIPAL,
            13: tempTable[i].kondisiLain.perbaikanProduksi,
            14: tempTable[i].kondisiLain.gangguanListrik,
            15: tempTable[i].kondisiLain.curahHujan,
            16: this.stringToDate(tempTable[i].tanggalKejadian),
            17: this.stringToDate(tempTable[i].endTanggalKejadian),
            18: tempTable[i].lokasi,
            19: tempTable[i].alatSparing.merek,
            20: this.stringToDate(tempTable[i].alatSparing.tanggalInstalasi),
            21: this.stringToDate(tempTable[i].alatSparing.tanggalOperasi),
            22: this.stringToDate(tempTable[i].alatIPAL.tanggalPembuatan),
            23: this.stringToDate(tempTable[i].alatIPAL.tanggalOperasi),
            24: tempTable[i].alatIPAL.kapasistas,
            25: tempTable[i].alatSparing.merek,
            26: this.stringToDate(tempTable[i].alatSparing.tanggalInstalasi),
            27: this.stringToDate(tempTable[i].alatSparing.tanggalOperasi),
            28: this.stringToDate(tempTable[i].alatIPAL.tanggalPembuatan),
            29: this.stringToDate(tempTable[i].alatIPAL.tanggalOperasi),
            30: tempTable[i].alatIPAL.kapasistas,
            31: tempTable[i].alatLainnya,
            32: tempTable[i].statusKejadian.tanggalSelesai,
            33: tempTable[i].statusKejadian.rencanaPenanggulangan,
            34: tempTable[i].keluhanMasyarakat.ya,
            35: tempTable[i].keluhanMasyarakat.tidak,
            36: tempTable[i].fileLampiranPath,
            37: tempTable[i].fileSuratPath,
          });
        }
      }
      return csvTable;
    },
  },
  watch: {
    selectedTime() {
      this.filterTime()
    },
  },
  methods: {
    getTimestamp(testID) {
      let timestamp = testID.toString().substring(0, 8);
      let date = new Date(parseInt(timestamp, 16) * 1000);
      return date;
    },
    stringToDate(value) {
      if (value == "0") {
        return 0;
      }
      let time = parseInt(value);
      return moment.unix(time).format("L");
    },
    intToString(value) {
      return value.toString();
    },
    handlerKeluhan(value) {
      this.formPelaporanKondisi.keluhanMasyarakat = {
        status: value,
        ya: "-",
        tidak: "-",
      };
      if (value) {
        this.formPelaporanKondisi.keluhanMasyarakat.ya = "Ya";
      } else {
        this.formPelaporanKondisi.keluhanMasyarakat.tidak = "Ya";
      }
    },
    resetFasilitas() {
      this.formPelaporanKondisi.alatSparing = {
        merek: "",
        tanggalInstalasi: 0,
        tanggalOperasi: 0,
      };
      this.formPelaporanKondisi.alatIPAL = {
        tanggalPembuatan: 0,
        tanggalOperasi: 0,
        kapasistas: "",
      };
      this.formPelaporanKondisi.alatLainnya = "-";
    },
    thenFasilitas(value) {
      if (value == "Alat Sparing") {
        this.tempState.isAlatSparing = true;
        this.tempState.isAlatIPAL = false;
        this.tempState.isAlatSparingIPAL = false;
        this.tempState.isAlatLainnya = false;
      }
      if (value == "Alat IPAL") {
        this.tempState.isAlatSparing = false;
        this.tempState.isAlatIPAL = true;
        this.tempState.isAlatSparingIPAL = false;
        this.tempState.isAlatLainnya = false;
      }
      if (value == "Alat Sparing & IPAL") {
        this.tempState.isAlatSparing = false;
        this.tempState.isAlatIPAL = false;
        this.tempState.isAlatSparingIPAL = true;
        this.tempState.isAlatLainnya = false;
      }
      if (value == "Lainnya") {
        this.tempState.isAlatSparing = false;
        this.tempState.isAlatIPAL = false;
        this.tempState.isAlatSparingIPAL = false;
        this.tempState.isAlatLainnya = true;
      }
    },
    resetKondisi() {
      this.formPelaporanKondisi.kondisiTidakNormal = {
        status: "",
        penghentianSementara: "-",
        kalibrasiPeralatan: "-",
        kondisiLain: "-",
      };
      this.formPelaporanKondisi.kondisiDarurat = {
        status: "",
        bencanaAlam: "-",
        gangguanKeamanan: "-",
      };
      this.formPelaporanKondisi.kondisiLain = {
        status: "",
        perbaikanIPAL: "-",
        perbaikanProduksi: "-",
        gangguanListrik: "-",
        curahHujan: "-",
      };
    },
    thenKondisi(value) {
      this.formPelaporanKondisi.kondisi = value;
      if (value == "Kondisi Tidak Normal") {
        this.tempState.isTidakNormal = true;
        this.tempState.isDarurat = false;
        this.tempState.tidakAliranLimbah = false;
      }
      if (value == "Kondisi Darurat") {
        this.tempState.isDarurat = true;
        this.tempState.isTidakNormal = false;
        this.tempState.isKondisiLain = false;
        this.tempState.tidakAliranLimbah = false;
      }
      if (value == "Kondisi Tidak Ada Aliran Air Limbah") {
        this.tempState.isDarurat = false;
        this.tempState.isTidakNormal = false;
        this.tempState.isKondisiLain = false;
        this.tempState.tidakAliranLimbah = true;
      }
    },
    thenTidakNormal(value) {
      this.formPelaporanKondisi.kondisiTidakNormal.status = value;
      if (
        value == "Penghentian Sementara dan Penyalaan Kembali Operasi Produksi"
      ) {
        this.tempState.isKondisiLain = false;
        this.formPelaporanKondisi.kondisiTidakNormal.penghentianSementara =
          "Ya";
      }
      if (value == "Kalibrasi Peralatan") {
        this.tempState.isKondisiLain = false;
        this.formPelaporanKondisi.kondisiTidakNormal.kalibrasiPeralatan = "Ya";
      }
      if (
        value ==
        "Kondisi Lain yang Menyebabkan SPARING Tidak dapat Digunakan Secara Optimal"
      ) {
        this.tempState.isKondisiLain = true;
        this.formPelaporanKondisi.kondisiTidakNormal.kondisiLain = "Ya";
      }
    },
    thenDarurat(value) {
      this.formPelaporanKondisi.kondisiDarurat.status = value;
      if (
        value ==
        "Bencana Alam, Dapat Berupa Pencurian, Perusakan, dan Lain Sebagainya"
      ) {
        this.formPelaporanKondisi.kondisiDarurat.bencanaAlam = "Ya";
      }
      if (
        value ==
        "Gangguan Keamanan, Dapat Berupa Pencurian, Perusakan, dan Lain Sebagainya"
      ) {
        this.formPelaporanKondisi.kondisiDarurat.gangguanKeamanan = "Ya";
      }
    },
    thenKondisiLain(value) {
      this.formPelaporanKondisi.kondisiLain = {
        status: "-",
        perbaikanIPAL: "-",
        perbaikanProduksi: "-",
        gangguanListrik: "-",
        curahHujan: "-",
      };
      this.formPelaporanKondisi.kondisiLain.status = value;
      if (
        value ==
        "Perbaikan IPAL (Perlu Diperhatikan Bahwa pada Saat Startup dan Shutdown IPAL akan ber-pengaruh Terhadap Nilai Kadar/Kualitas Air Limbah)"
      ) {
        this.formPelaporanKondisi.kondisiLain.perbaikanIPAL = "Ya";
      }
      if (value == "Perbaikan Produksi") {
        this.formPelaporanKondisi.kondisiLain.perbaikanProduksi = "Ya";
      }
      if (value == "Gangguan Supply Listrik") {
        this.formPelaporanKondisi.kondisiLain.gangguanListrik = "Ya";
      }
      if (
        value ==
        "Khusus Industri Tambang pada Saat Curah Hujan diatas Rata-Rata Tahunan"
      ) {
        this.formPelaporanKondisi.kondisiLain.curahHujan = "Ya";
      }
    },
    swalChose(message) {
      swal.fire({
        icon: "warning",
        title: "Peringantan!",
        text: message,
      });
    },
    getInformasiUmum() {
      let tempUser = this.$store.state.userData;
      this.formPelaporanKondisi.compID = tempUser.userRole.compID;
      this.formPelaporanKondisi.namaPerusahaan = this.$store.state.auth.name;
      this.formPelaporanKondisi.provID = tempUser.userRole.provID;
      this.formPelaporanKondisi.kabkotID = tempUser.userRole.kabkotID;
    },
    toUpdateForm() {
      this.formPelaporanKondisi = this.tempRow;
      this.formPelaporanKondisi.tanggalKejadian = this.tempRow.tanggalKejadian.toString();
      this.formPelaporanKondisi.endTanggalKejadian = this.tempRow.endTanggalKejadian.toString();
      this.formPelaporanKondisi.jenisIndustri =
        this.formPelaporanKondisi.compDetails.compType;
      this.getInformasiUmum();
      this.thenKondisi(this.tempRow.kondisi);
      if (this.tempRow.kondisi == "Kondisi Tidak Normal") {
        this.thenTidakNormal(this.tempRow.kondisiTidakNormal.status);
        if (this.tempRow.kondisiTidakNormal.kondisiLain == "Ya") {
          this.thenKondisiLain(this.tempRow.kondisiLain.status);
        }
      }
      if (this.tempRow.kondisi == "Kondisi Darurat") {
        this.thenDarurat(this.tempRow.kondisiDarurat.status);
      }

      this.thenFasilitas(this.tempRow.fasilitas);
      this.isUpdate = true;
      this.$router.push("form");
    },
    async submitForm() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (!tempValidate) {
        swal.fire({ icon: 'error', text: `Data belum lengkap` });
      } else {
        this.disabled = true;
        let formData = this.formPelaporanKondisi;
        formData.fileLampiranPath ? formData.fileLampiranPath : "";
        formData.fileSuratPath ? formData.fileSuratPath : "";
        formData.fileSuratLogbookPath ? formData.fileSuratLogbookPath : "";
        // formData.fileLaporanPath ? formData.fileLaporanPath : "";
        if (formData.fileLaporanPath) {
          formData.fileLaporanPath = formData.fileLaporanPath
        }
        const data = await axios.post(`${defaults.baseURL}/form/cond-report`, formData);
        if (data.status === 200) {
          await swal.fire({ icon: 'success', title: 'Tersimpan', text: `Data Berhasil Tersimpan` });
          this.disabled = false;
          this.getList(this.auth._id);
          this.$router.push("list");
        } else {
          this.disabled = false;
          swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: `Silakan Coba Kembali`,
         });
        }
      }
    },
    async submitUpdateForm() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (!tempValidate) {
        swal.fire({ icon: 'error', text: `Data belum lengkap` });
      } else {
        this.disabled = true;
        let formData = this.formPelaporanKondisi;
        if (formData.kondisi != "Kondisi Tidak Ada Aliran Air Limbah") {
          formData.kondisiTidakAdaAliranLimbah.path = "";
        }
        const data = await axios.put(`${defaults.baseURL}/form/cond-report/${this.tempRow._id}`, formData);
        await axios.put(`${defaults.baseURL}/validasi/${this.tempRow._id}`, {
        userEmail: this.auth.name,
        catatan: "-",
        status: "waiting",
      });
        if (data.status === 200) {
          await swal.fire({ icon: 'success', title: 'Tersimpan', text: `Data Berhasil Tersimpan` });
          this.disabled = false;
          this.getList(this.auth._id);
          this.$router.push("list");
        } else {
          this.disabled = false;
          swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: `Silakan Coba Kembali`,
         });
        }
      }
    },
    deleteForm() {
      swal
        .fire({
          title: "Delete",
          text: "Apakah anda yakin ingin mendelete?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Delete",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            axios
              .delete(
                `${defaults.baseURL}/form/cond-report/${this.tempRow._id}`
              )
              .then((res) => {
                swal
                  .fire({
                    title: "Berhasil",
                    text: "Form Berhasil Terdelete",
                    icon: "success",
                  })
                  .then((result2) => {
                    if (result2.isConfirmed) {
                      this.$router.push("list");
                      location.reload();
                    }
                  });
              });
          }
        });
    },
    uploadFileLampiran(field) {
      let formData = new FormData();
      formData.append("picture", this.$refs[field].files[0]);
      axios
        .post(`${defaults.baseURL}/file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: function (progressEvent) {
            this.tempProgressLampiran = parseInt(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
          }.bind(this),
        })
        .then((res) => {
          if(res.data.path !=""){
            this.formPelaporanKondisi.fileLampiranPath = res.data.path;
            this.successSwal("Berhasil upload file");
          }
          else {
            this.tempProgressLampiran = 0;
            this.errorSwal("Silakan Upload Ulang lagi");
          }
         
        })
        .catch((err) => {
          this.tempProgressLampiran = 0;
          this.errorSwal("Silakan Upload Ulang" + err);
        });
    },
    uploadFileSurat(field) {
      let formData = new FormData();
      formData.append("picture", this.$refs[field].files[0]);
      axios
        .post(`${defaults.baseURL}/file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: function (progressEvent) {
            this.tempProgressSurat = parseInt(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
          }.bind(this),
        })
        .then((res) => {
          if(res.data.path !=""){
            this.formPelaporanKondisi.fileSuratPath = res.data.path;
            this.successSwal("Berhasil upload file");
          }
          else {
            this.tempProgressSurat = 0;
            this.errorSwal("Silakan Upload Ulang lagi");
          }
          
        })
        .catch((err) => {
          this.tempProgressSurat = 0;
          this.errorSwal("Silakan Upload Ulang" + err);
        });
    },
    uploadFileLogbook(field) {
      let formData = new FormData();
      formData.append("picture", this.$refs[field].files[0]);
      axios
        .post(`${defaults.baseURL}/file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: function (progressEvent) {
            this.tempProgressLogbook = parseInt(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
          }.bind(this),
        })
        .then((res) => {
          if(res.data.path !=""){
            this.formPelaporanKondisi.fileSuratLogbookPath = res.data.path;
            this.successSwal("Berhasil upload file");
          }
          else {
            this.tempProgressLogbook = 0;
            this.errorSwal("Silakan Upload Ulang lagi");
          }
        })
        .catch((err) => {
          this.tempProgressLogbook = 0;
          this.errorSwal("Silakan Upload Ulang" + err);
        });
    },
    uploadFilePelaporanTidakNormal(field) {
      let formData = new FormData();
      formData.append("picture", this.$refs[field].files[0]);
      axios
        .post(`${defaults.baseURL}/file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: function (progressEvent) {
            this.tempProgressPelaporanTidakNormal = parseInt(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
          }.bind(this),
        })
        .then((res) => {
          if(res.data.path !=""){
            this.formPelaporanKondisi.fileLaporanPath = res.data.path;
            this.successSwal("Berhasil upload file");
          }
          else {
            this.tempProgressPelaporanTidakNormal = 0;
            this.errorSwal("Silakan Upload Ulang lagi");
          }
        })
        .catch((err) => {
          this.tempProgressPelaporanTidakNormal = 0;
          this.errorSwal("Silakan Upload Ulang" + err);
        });
    },
    errorSwal(message) {
      swal.fire({
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
    },
    successSwal(message) {
      swal.fire({
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
    },
    toDownload(link) {
      window.open(`${defaults.baseURL}/${link}`);
    },
    toForm() {
      this.formPelaporanKondisi = form;
      this.isUpdate = false;
      this.$router.push("form");
    },
    toDetail(row) {
      this.tempRow = row;
     
      if(!this.tempRow.fileSuratLogbookPath){
        this.tempRow.fileSuratLogbookPath = "";
      }
      
     
      let newrow = [];
      if (this.tempRow.kondisiTidakAdaAliranLimbah) {
        this.$router.push("detail");
      } else {
        newrow = {
          alatIPAL: this.tempRow.alatIPAL,
          alatLainnya: this.tempRow.alatLainnya,
          alatSparing: this.tempRow.alatSparing,
          compDetails: this.tempRow.compDetails,
          compID: this.tempRow.compID,
          convertedCompID: this.tempRow.convertedCompID,
          convertedKabkotID: this.tempRow.convertedKabkotID,
          convertedProvID: this.tempRow.convertedProvID,
          fasilitas: this.tempRow.fasilitas,
          fileLampiranPath: this.tempRow.fileLampiranPath,
          fileSuratPath: this.tempRow.fileSuratPath,
          fileSuratLogbookPath: this.tempRow.fileSuratLogbookPath,
          fileLaporanPath: this.tempRow.fileLaporanPath,
          kabkotDetails: this.tempRow.kabkotDetails,
          kabkotID: this.tempRow.kabkotID,
          keluhanMasyarakat: this.tempRow.keluhanMasyarakat,
          kondisi: this.tempRow.kondisi,
          kondisiDarurat: this.tempRow.kondisiDarurat,
          kondisiLain: this.tempRow.kondisiLain,
          kondisiTidakAdaAliranLimbah: { path: null },
          kondisiTidakNormal: this.tempRow.kondisiTidakNormal,
          lokasi: this.tempRow.lokasi,
          provDetails: this.tempRow.provDetails,
          provID: this.tempRow.provID,
          statusKejadian: this.tempRow.statusKejadian,
          tanggalKejadian: this.tempRow.tanggalKejadian,
          endTanggalKejadian: this.tempRow.endTanggalKejadian,
        };
        this.tempRow = newrow;
        this.$router.push("detail");
      }
    },
    indexMethod(index) {
      return index + 1;
    },
    filterComanyType() {
      if (this.selects.type) {
        this.tableData = this.originalData.filter((item) => item.compDetails.compType === this.selects.type);
      } else {
        this.tableData = this.originalData;
      }
      this.selects.prov = null;
      this.selects.city = null;
      this.selects.comp = null;
      this.selects.time = null;
      this.selects.status = null;
    },
    filterProvince() {
      if (this.selects.prov) {
        this.tableData = this.originalData.filter((item) => item.provID === this.selects.prov);
      } else {
        this.tableData = this.originalData;
      }
      this.selects.type = null;
      this.selects.city = null;
      this.selects.comp = null;
      this.selects.time = null;
      this.selects.status = null;
    },
    filterCity() {
      if (this.selects.city) {
        this.tableData = this.originalData.filter((item) => item.kabkotID === this.selects.city);
      } else {
        this.tableData = this.originalData;
      }
      this.selects.type = null;
      this.selects.prov = null;
      this.selects.comp = null;
      this.selects.time = null;
      this.selects.status = null;
    },
    filterIndustry() {
      if (this.selects.comp) {
        this.tableData = this.originalData.filter((item) => item.compID === this.selects.comp);
      } else {
        this.tableData = this.originalData;
      }
      this.selects.type = null;
      this.selects.prov = null;
      this.selects.city = null;
      this.selects.time = null;
      this.selects.status = null;
    },
    filterTime() {
      if (this.selectedTime) {
        const date = this.selectedTime.split(" to ");
        const startDate = +date[0];
        const endDate = +date[1] + 86399; // + 23 hours 59 minutes
        this.tableData = this.originalData.filter((item) => startDate <= item.tanggalKejadian && item.tanggalKejadian <= endDate);
      } else {
        this.tableData = this.originalData;
      }
      this.selects.type = null;
      this.selects.prov = null;
      this.selects.city = null;
      this.selects.comp = null;
      this.selects.status = null;
    },
    filterStatus() {
      if (this.selects.status) {
        this.tableData = this.originalData.filter((item) => {
          if (item.validitas) {
            return item.validitas.status === this.selects.status;
          } else if (this.selects.status === "waiting") {
            return !item.validitas;
          }
        });
      } else {
        this.tableData = this.originalData;
      }
      this.selects.type = null;
      this.selects.prov = null;
      this.selects.city = null;
      this.selects.comp = null;
      this.selects.time = null;
    },
    getList(userID) {
      axios
        .get(`${defaults.baseURL}/report/list/${userID}`, {
          headers: { token: this.$store.state.token },
        })
        .then((res) => {
          this.selects.options.prov = res.data.provList;
          this.selects.options.city = res.data.kabkotList;
          this.selects.options.comp = res.data.compList;

          this.selects.options.prov.unshift({ name: "Semua", value: "" });
          this.selects.options.city.unshift({ name: "Semua", value: "" });
          this.selects.options.comp.unshift({ value: "Semua", compID: "" });
          this.tempSelect = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getTableData() {
      axios
        .get(`${defaults.baseURL}/form/cond-report-all`, {
          headers: { token: this.$store.state.token },
        })
        .then((res) => {
          this.tableData = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    generateData() {
      let loader = this.$loading.show({ loader: "dots" });
      const tempArray = this.queryArray;
      const auth = JSON.parse(localStorage.getItem("auth-data"));
      const params = `type=${tempArray[0]}&prov=${tempArray[1]}&kabkot=${tempArray[2]}&comp=${tempArray[3]}&start=${tempArray[4]}`;
      axios
        .get(`${defaults.baseURL}/form/cond-report-all/${auth._id}?${params}`,
          { headers: { token: this.$store.state.token } }
        )
        .then((res) => {
          this.tableData = res.data;
          this.originalData = res.data;
          loader.hide();
        })
        .catch((err) => console.log(err));
    },
     exportExcel() {
      const tempArray = this.queryArray;
      const params = `type=${tempArray[0]}&prov=${tempArray[1]}&kabkot=${tempArray[2]}&comp=${tempArray[3]}&start=${tempArray[4]}`; 
      window.open(`${defaults.baseURL}/form/cond-report-all-export?${params}`, "_blank");
    },
    downloadCSV(data) {
      let csv

// Loop the array of objects
for(let row = 0; row < data.length; row++){
    let keysAmount = Object.keys(data[row]).length
    let keysCounter = 0

    // If this is the first row, generate the headings
    if(row === 0){

       // Loop each property of the object
       for(let key in data[row]){

                           // This is to not add a comma at the last cell
                           // The '\r\n' adds a new line
           csv += key + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
           keysCounter++
       }
    }else{
       for(let key in data[row]){
           csv += data[row][key] + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
           keysCounter++
       }
    }

    keysCounter = 0
}

// Once we are done looping, download the .csv by creating a link
let link = document.createElement('a')
link.id = 'download-csv'
link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
link.setAttribute('download', 'export.csv');
document.body.appendChild(link)
document.querySelector('#download-csv').click()


      // OLD
      // let csvContent = "data:text/csv;charset=utf-8,";
      // csvContent += [
      //   Object.keys(data[0]).join(";"),
      //   ...data.map((item) => Object.values(item).join(";")),
      // ]
      //   .join("\n")
      //   .replace(/(^\[)|(\]$)/gm, "");

      // const tempData = encodeURI(csvContent);
      // const link = document.createElement("a");
      // link.setAttribute("href", tempData);
      // link.setAttribute("download", "export.csv");
      // link.click();
      swalWithBootstrapButtons.fire(
        "Export Success",
        "Your file has been exported.",
        "success"
      );
    },
    downloadData(data) {
      swalWithBootstrapButtons
        .fire({
          title: "Download Data",
          text: "Please choose what type of file do you want",
          icon: "question",
          showCancelButton: false,
          confirmButtonText: "CSV",
          cancelButtonText: "PDF",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.value) {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += [
              Object.keys(data[0]).join(";"),
              ...data.map((item) => Object.values(item).join(";")),
            ]
              .join("\n")
              .replace(/(^\[)|(\]$)/gm, "");

            const tempData = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", tempData);
            link.setAttribute("download", "export.csv");
            link.click();
            swalWithBootstrapButtons.fire(
              "Export Success",
              "Your file has been exported.",
              "success"
            );
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            let headerPDF = [];
            let tempTablePDF = [];
            let pdfName = "exportKLHK";
            var doc = new jsPDF("l", "mm", "a4");
            if (this.$store.state.auth.level === 0) {
              headerPDF = [
                "No",
                "NAMA INDUSTRI",
                "JENIS INDUSTRI",
                "PROVINSI",
                "KAB/KOT",
                "WAKTU",
                "ERROR",
              ];
              for (let i = 0; i < data.length; i++) {
                var arrayTemp = [
                  [i],
                  data[i]["NAMA INDUSTRI"],
                  data[i]["JENIS INDUSTRI"],
                  data[i]["PROVINSI"],
                  data[i]["KAB/KOT"],
                  data[i]["WAKTU"],
                  data[i]["ERROR"],
                ];
                tempTablePDF.push(arrayTemp);
              }
            }
            if (this.$store.state.auth.level === 1) {
              headerPDF = [
                "No",
                "NAMA INDUSTRI",
                "JENIS INDUSTRI",
                "KAB/KOT",
                "WAKTU",
                "ERROR",
              ];
              for (let i = 0; i < data.length; i++) {
                var arrayTemp = [
                  [i],
                  data[i]["NAMA INDUSTRI"],
                  data[i]["JENIS INDUSTRI"],
                  data[i]["KAB/KOT"],
                  data[i]["WAKTU"],
                  data[i]["ERROR"],
                ];
                tempTablePDF.push(arrayTemp);
              }
            }
            if (this.$store.state.auth.level === 2) {
              headerPDF = [
                "No",
                "NAMA INDUSTRI",
                "JENIS INDUSTRI",
                "WAKTU",
                "ERROR",
              ];
              for (let i = 0; i < data.length; i++) {
                var arrayTemp = [
                  [i],
                  data[i]["NAMA INDUSTRI"],
                  data[i]["JENIS INDUSTRI"],
                  data[i]["WAKTU"],
                  data[i]["ERROR"],
                ];
                tempTablePDF.push(arrayTemp);
              }
            }
            if (this.$store.state.auth.level === 3) {
              headerPDF = ["No", "WAKTU", "ERROR"];
              for (let i = 0; i < data.length; i++) {
                var arrayTemp = [[i], data[i]["WAKTU"], data[i]["ERROR"]];
                tempTablePDF.push(arrayTemp);
              }
            }

            doc.autoTable({
              head: [headerPDF],
              theme: "striped",
              body: tempTablePDF,
              headStyles: {
                fillColor: [41, 102, 75],
              },
              styles: {
                lineWidth: 0.2,
                halign: "center",
              },
            });
            doc.save("exportKLHK.pdf");
            doc = new jsPDF("l", "mm", "a4");

            swalWithBootstrapButtons.fire(
              "Congratulations",
              "PDF will be downloaded shortly",
              "success"
            );
          }
        });
    },
    unixTS2DMY(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY");
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    sortChange(colum) {
      console.log(colum);
    },
  },
  created() {
    this.getList(this.auth._id);
    if (this.$store.state.auth.level == 3) {
      this.queryArray[3] = this.$store.state.auth.name;
    }
    // this.getTableData();
    this.generateData();
    this.getInformasiUmum();
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
#pelaporan-kondisi {
  .file-upload-animation {
    position: absolute;
    top: 40px;
    right: 100px;
    z-index: 1000;
  }
  .file-upload-done {
    position: absolute;
    top: 45px;
    right: 104px;
    z-index: 1000;
  }
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
    .el-table__row {
      &:hover {
        background: transparent;
        cursor: unset;
      }
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
