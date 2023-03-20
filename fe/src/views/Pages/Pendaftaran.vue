<template>
  <div>
    <!-- Page content -->
    <div id="daftar" class="container pt-8 mb-4">
      <div class="row">
        <div class="col-12">
          <div class="card bg-white border-0">
            <div class="p-4">
              <h2 class="text-justify">
                PENDAFTARAN SISTEM PEMANTAUAN KUALITAS AIR LIMBAH SECARA TERUS
                MENERUS DAN DALAM JARINGAN (SPARING) BAGI PENANGGUNG JAWAB USAHA
                DAN/ATAU KEGIATAN
              </h2>
              <p class="mb-2 text-justify">
                Pendaftaran adalah fasilitas untuk pencatatan secara ONLINE dan validasi bagi
                penanggung jawab usaha dan/atau kegiatan yang bertujuan untuk
                mendapatkan USER NAME, PASSWORD, UID (User Identification).
                <br />Mekanisme pendaftaran yaitu:
              </p>
              <ol>
                <li>
                  Pendaftaran WAJIB dilakukan oleh penanggung jawab usaha
                  dan/atau kegiatan (industri), tidak diperbolehkan bagi
                  penyedia peralatan & jasa alat sensor pemantauan online.
                </li>
                <li>
                  Penanggung jawab usaha dan/atau kegiatan WAJIB melaksanakan
                  pendaftaran dan mengisi semua form serta bukti.
                </li>
                <li>
                  Pengisian form pendaftaran dan bukti yaitu:
                  <ol type="a">
                    <li>Pengisian umum</li>
                    <li>
                      Pengisian dan penyampaian bukti persyaratan identifikasi
                      sumber pencemar
                    </li>
                    <li>Pengisian dan penyampaian bukti persyaratan teknis</li>
                  </ol>
                </li>
                <li>
                  Hasil jawaban dari permohonan pendaftaran SPARING melalui
                  fitur pendaftaran paling lambat dikirim 14 hari kerja setelah
                  dikirimkan oleh penanggung jawab usaha dan/atau kegiatan.
                </li>
                <li>
                  USER NAME, PASSWORD, UID (User Identification) berupa TANDA
                  TERIMA ELEKTRONIK akan dikirimkan ke alamat email yang
                  didaftarkan pada form pendaftaran melalui email
                  sparing.menlhk@gmail.com jika seluruh isian lengkap dan
                  dinyatakan valid oleh Admin SPARING KLHK.
                </li>
                <li>
                  Bukti dan data dinyatakan valid melalui bukti persyaratan
                  identifikasi sumber pencemar dan persyaratan teknis SPARING
                  sesuai dengan Peraturan Menteri Lingkungan Hidup Nomor
                  P.93/MENLHK/SETJEN/KUM.1/8/2018 tentang Pemantauan Kualitas
                  Air Limbah Secara Terus Menerus Dan Dalam Jaringan Bagi Usaha
                  Dan/Atau Kegiatan jo Peraturan Menteri Lingkungan Hidup Nomor
                  P.80/MENLHK/SETJEN/KUM.1/10/2019.
                </li>
                <li>
                  Jika isian tidak lengkap dan terdapat bukti yang tidak valid
                  maka Admin SPARING KLHK akan menyampaikan melalui email yang
                  terdaftar. Penanggung jawab usaha dan/atau kegiatan WAJIB
                  melengkapi sesuai dengan hasil evaluasi.
                </li>
                <li>
                  Kebijakan pengunduran waktu pemasangan dan pengoperasian
                  SPARING sesuai Surat Edaran Menteri Lingkungan Hidup dan Kehutanan
                  Nomor SE.5/Menlhk/Setjen/KUM.1/6/2020 tidak berlaku lagi.
                </li>
              </ol>
              <br />
              <span>
                Tim SPARING<br />
                Direktorat Pengendalian Pencemaran air<br />
                JL. DI Panjaitan Kav. 24 Kebon Nanas Jakarta Timur<br />
                Gedung B lantai 5<br />
                Email: sparing.menlhk@gmail.com<br />
                Fathia Rizqi 0813 10837646 <br/>
                Fadhila 0813 2664 8260<br/>
                Aditya 0896 5258 3055<br/>
                <span class="text-danger">(hanya melayani via pesan WA/SMS,
                jam pelayanan hari kerja 08.00-15.00 WIB)</span><br />
              </span>
            </div>
          </div>
          <CheckStatus type="pendaftaran" />
          <template v-if="isEditData == 0">
            <div class="card bg-white border-0">
              <div class="row justify-content-between p-4">
                <div class="col-6">
                  <base-button
                    class="bg-secondary w-100"
                    @click="isEditData = 2"
                    >Perubahan Data</base-button
                  >
                </div>
                <div class="col-6">
                  <base-button class="bg-primary w-100" @click="isEditData = 1"
                    >Pendaftaran Baru</base-button
                  >
                </div>
              </div>
            </div>
          </template>
          <template v-if="isEditData == 2">
            <div class="card bg-white border-0">
              <div class="p-4">
                <div class="form-group row">
                  <label class="col-lg-2 col-form-label form-control-label"
                    >ID Pendaftaran</label
                  >
                  <div class="col-8">
                    <base-input
                      name="ID Pendaftaran"
                      rules
                      v-model="editID"
                    ></base-input>
                    <small class="d-block mt--3 text-justify"
                      >Untuk melakukan perubahan data, silakan isi field di atas
                      dengan ID yang anda dapatkan setelah proses pendaftaran,
                      atau hubungi ADMIN untuk mendapatkan ID Pendfataran anda.
                      Untuk melakukan pendaftaran silakan hiraukan field
                      ini.</small
                    >
                  </div>
                  <div class="col-2">
                    <base-button
                      class="w-100"
                      size="md"
                      type="primary"
                      @click="getDatatoEdit"
                      >Cari</base-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-if="isEditData >= 1">
            <validation-observer ref="formValidator">
              <form>
                <div class="card bg-white border-0">
                  <div class="card-header px-4">Akun</div>
                  <div class="card-body p-4">
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Nama Kontak Person</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Nama Kontak Person"
                          rules="required"
                          v-model="form.akun.personName"
                        ></base-input>
                        <small class="d-block mt--3 text-justify">
                          Personil yang menangani pengolahan air limbah dan
                          terkait data SPARING
                        </small>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Nomor Handphone</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Nomor Handphone"
                          rules="required"
                          v-model="form.akun.personPhone"
                          type="tel"
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Email Kontak Person</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Email Kontak Person"
                          rules="required"
                          v-model="form.akun.personMail"
                          type="email"
                          autocomplete="username email"
                        />
                        <base-input
                          name="Email Kontak Person ID"
                          type="hidden"
                          v-model="form.akun.personMailID"
                        ></base-input>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Password</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Password"
                          rules="required"
                          v-model="form.akun.personPassword"
                          type="password"
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Confirm Password</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Confirm Password"
                          rules="required"
                          v-model="form.akun.personConfirmPassword"
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card bg-white border-0">
                  <div class="card-header px-4">Umum</div>
                  <div class="card-body p-4">
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Nama Perusahaan</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Nama Perusahaan"
                          rules="required"
                          v-model="form.umum.compName"
                        ></base-input>
                        <base-input
                          name="Nama Perusahaan ID"
                          type="hidden"
                          v-model="form.umum.compNameID"
                        ></base-input>
                        <small class="d-block mt--3 text-justify">
                          Kata dan tanda baca wajib sama dengan Nama Perusahaan pada SIMPEL PPA
                        </small>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Jenis Industri</label
                      >
                      <div class="col-lg-10">
                        <base-input name="Jenis Industri" rules="required">
                          <el-select v-model="form.umum.compType">
                            <el-option
                              v-for="option in selects.options.type"
                              :key="option.label"
                              :label="option.label"
                              :value="option.value"
                            ></el-option>
                          </el-select>
                        </base-input>
                      </div>
                    </div>
                    <div
                      v-if="
                        form.umum.compType ===
                          'Pertambangan Emas dan Tembaga' ||
                        form.umum.compType === 'Pertambangan Batu Bara' ||
                        form.umum.compType === 'Pertambangan Nikel'
                      "
                      class="card bg-white border-0"
                    >
                      <div class="card-header px-4">
                        Detail {{ form.umum.compType }}
                      </div>
                      <div class="card-body p-4">
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                            >Status Tambang</label
                          >
                          <div class="col-lg-10">
                            <base-input name="Status Tambang" rules="required">
                              <el-select v-model="form.umum.ifTambang.status">
                                <el-option
                                  label="Aktif"
                                  value="Aktif"
                                ></el-option>
                                <el-option
                                  label="Reklamasi"
                                  value="Reklamasi"
                                ></el-option>
                                <el-option
                                  label="Pasca Tambang"
                                  value="Pasca Tambang"
                                ></el-option>
                              </el-select>
                            </base-input>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                            >Jenis Kegiatan</label
                          >
                          <div class="col-lg-10">
                            <base-input name="Jenis Kegiatan" rules="required">
                              <el-select
                                v-model="form.umum.ifTambang.jenKegiatan"
                              >
                                <el-option
                                  label="Pengolahan"
                                  value="Pengolahan"
                                ></el-option>
                                <el-option
                                  label="Penambangan"
                                  value="Penambangan"
                                ></el-option>
                                <el-option
                                  label="Pengolahan & Penambangan"
                                  value="Pengolahan & Penambangan"
                                ></el-option>
                              </el-select>
                            </base-input>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                          >
                            Rencana penetapan titik penaatan
                            <i>(complience point)</i> sampai dengan 5 tahun
                            kedepan (dokumen berupa tabel perencanaan)
                          </label>
                          <div class="col-lg-10">
                            <base-input rules="required" name="Rencana penetapan titik penaatan">
                              <file-input
                                :disabled="uploading"
                                accept="application/pdf"
                                ref="rencanaFile"
                                @change="uploadFile('umum', 'rencanaFile')"
                              ></file-input>
                              <base-progress
                                v-if="form.umum.rencanaFile.upload >= 1"
                                class="mb-0"
                                :type="
                                  form.umum.rencanaFile.progress >= 100
                                    ? 'green'
                                    : 'orange'
                                "
                                :value="form.umum.rencanaFile.progress"
                              ></base-progress>
                              <hour-glass
                                v-if="form.umum.rencanaFile.upload == 1"
                                class="file-upload-animation"
                                size="24px"
                              ></hour-glass>
                              <span v-if="form.umum.rencanaFile.upload == 2">
                                <i
                                  class="
                                    ni ni-check-bold
                                    text-primary
                                    file-upload-done
                                  "
                                ></i>
                              </span>
                            </base-input>
                            <small
                              v-if="form.umum.rencanaFile.upload == 2"
                              class="d-block mt--3 text-justify">
                              <a :href="`${baseURL}/${form.umum.rencanaFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                            </small>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                            >Kondisi jaringan internet/GSM pada lokasi remote
                            area</label
                          >
                          <div class="col-lg-10">
                            <html-editor
                              v-model="form.umum.ifTambang.kondisiInternet"
                            ></html-editor>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Nama Penanggung Jawab SIUP</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Nama Penanggung Jawab SIUP"
                          rules="required"
                          v-model="form.umum.nameSIUP"
                        ></base-input>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Lampiran SIUP</label
                      >
                      <div class="col-lg-10">
                        <base-input rules="required" name="Lampiran SIUP">
                          <file-input
                            :disabled="uploading"
                            accept="application/pdf"
                            ref="siupFile"
                            @change="uploadFile('umum', 'siupFile')"
                          ></file-input>
                          <base-progress
                            v-if="form.umum.siupFile.upload >= 1"
                            class="mb-0"
                            :type="
                              form.umum.siupFile.progress >= 100
                                ? 'green'
                                : 'orange'
                            "
                            :value="form.umum.siupFile.progress"
                          ></base-progress>
                          <hour-glass
                            v-if="form.umum.siupFile.upload == 1"
                            class="file-upload-animation"
                            size="24px"
                          ></hour-glass>
                          <span v-if="form.umum.siupFile.upload == 2">
                            <i
                              class="
                                ni ni-check-bold
                                text-primary
                                file-upload-done
                              "
                            ></i>
                          </span>
                        </base-input>
                        <small
                          v-if="form.umum.siupFile.upload == 2"
                          class="d-block mt--3 text-justify">
                          <a :href="`${baseURL}/${form.umum.siupFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Alamat Perusahaan</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Alamat Perusahaan"
                          rules="required"
                          v-model="form.umum.compAddress"
                        ></base-input>
                        <small class="d-block mt--3 text-justify">
                          Bagi Industri yang memiliki alamat berbeda antara
                          kantor pusat dan kantor kegiatan (Unit Bisnis/site),
                          Mohon diisi alamat kantor unit bisnis
                        </small>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Jalan</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Jalan"
                          rules="required"
                          v-model="form.umum.compStreet"
                        ></base-input>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Provinsi</label
                      >
                      <div class="col-lg-10">
                        <base-input name="Provinsi" rules="required">
                          <el-select
                            v-model="form.umum.compProvince"
                            @change="getKabkot(form.umum.compProvince)"
                            filterable
                          >
                            <el-option
                              v-for="option in selects.options.prov"
                              :key="option._id"
                              :label="option.name"
                              :value="option._id"
                            ></el-option>
                          </el-select>
                        </base-input>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Kabupaten / Kota</label
                      >
                      <div class="col-lg-10">
                        <base-input name="Kabupaten / Kota" rules="required">
                          <el-select v-model="form.umum.compCity" filterable>
                            <el-option
                              v-for="option in selects.options.city"
                              :key="option._id"
                              :label="option.name"
                              :value="option._id"
                            ></el-option>
                          </el-select>
                        </base-input>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Telepon Kantor</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Telepon Kantor"
                          rules="required"
                          v-model="form.umum.compPhone"
                          type="tel"
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Email Kantor</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Email Kantor"
                          rules="required"
                          v-model="form.umum.compMail"
                          type="email"
                          autocomplete="username email"
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Permohonan Koneksi</label
                      >
                      <div class="col-lg-10">
                        <base-input rules="required" name="File Permohonan Koneksi">
                          <file-input
                            :disabled="uploading"
                            accept="application/pdf"
                            ref="compPermohonanKoneksi"
                            @change="uploadFile('umum', 'compPermohonanKoneksi')"
                          ></file-input>
                          <base-progress
                            v-if="form.umum.compPermohonanKoneksi && form.umum.compPermohonanKoneksi.upload >= 1"
                            class="mb-0"
                            :type="
                              form.umum.compPermohonanKoneksi &&
                              form.umum.compPermohonanKoneksi.progress >= 100
                                ? 'green'
                                : 'orange'
                            "
                            :value="form.umum.compPermohonanKoneksi && form.umum.compPermohonanKoneksi.progress"
                          ></base-progress>
                          <hour-glass
                            v-if="form.umum.compPermohonanKoneksi && form.umum.compPermohonanKoneksi.upload == 1"
                            class="file-upload-animation"
                            size="24px"
                          ></hour-glass>
                          <span v-if="form.umum.compPermohonanKoneksi && form.umum.compPermohonanKoneksi.upload == 2">
                            <i
                              class="
                                ni ni-check-bold
                                text-primary
                                file-upload-done
                              "
                            ></i>
                          </span>
                        </base-input>
                        <small class="d-block mt--3 text-justify">
                          Surat permohonan pendaftaran koneksi sparing kepada Direktur Pengendalian Pencemaran Air.
                        </small>
                        <small
                          v-if="form.umum.compPermohonanKoneksi && form.umum.compPermohonanKoneksi.upload == 2"
                          class="d-block mt-4 text-justify">
                          <a :href="`${baseURL}/${form.umum.compPermohonanKoneksi.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- PILIHAN PENDAFTARAN AIR LIMBAH ATAU NORMAL -->
                <div class="card bg-white border-0">
                  <div class="card-header px-4">Pilih Tipe Pendaftaran</div>
                  <div class="card-body p-4">
                    <template>
                      <div class="card bg-white border-0">
                        <div class="row justify-content-between p-4">
                          <div class="col-6">
                            <base-button
                              class="bg-secondary w-100"
                              @click="isSectionPendaftaran = 1"
                              >Pendaftaran Normal</base-button
                            >
                          </div>
                          <div class="col-6">
                            <base-button
                              class="bg-primary w-100"
                              @click="isSectionPendaftaran = 2"
                              >Pendaftaran Khusus Yang Menfaatkan Air
                              Limbah</base-button
                            >
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <!-- END PEMILIHAN PENDAFTARAN AIR LIMBAH ATAU NORMAL -->
                <!-- NEW MODULE -->
                <div
                  class="card bg-white border-0"
                  v-if="isSectionPendaftaran == 2"
                >
                  <div class="card-header px-4">
                    Khusus Industri Yang Menfaatkan Air Limbah 100% Ke Proses
                    Produksi
                  </div>
                  <div class="card-body p-4">
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label">Debit Penggunaan Air</label>
                      <div class="col-lg-2">
                        <base-input
                          name="Debit Penggunaan Air"
                          placeholder="Masukan nilai debit"
                          rules="required"
                          v-model="form.prosesProduksi.debitPenggunaan.value" />
                      </div>
                      <div class="col-3">
                          <base-input name="Satuan Debit Penggunaan Air" rules="required">
                          <el-select v-model="form.prosesProduksi.debitPenggunaan.satuan">
                            <el-option v-for="(unit, index) in debitUnit" :key="index"
                              :label="unit"
                              :value="unit" />
                          </el-select>
                        </base-input>
                      </div>
                      <div class="col-lg">
                        <base-input
                          name="Keterangan Debit Penggunaan Air"
                          placeholder="Keterangan (Proses dan Teknologi yang digunakan) "
                          rules="required"
                          v-model="form.prosesProduksi.debitPenggunaan.keterangan" />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label">Debit Air Limbah Total</label>
                      <div class="col-lg-2">
                        <base-input
                          name="Debit Air Limbah Total"
                          placeholder="Masukan nilai debit"
                          rules="required"
                          v-model="form.prosesProduksi.debitLimbahTotal.value" />
                      </div>
                      <div class="col-3">
                          <base-input name="Satuan Debit Air Limbah Total" rules="required">
                          <el-select v-model="form.prosesProduksi.debitLimbahTotal.satuan">
                            <el-option v-for="(unit, index) in debitUnit" :key="index"
                              :label="unit"
                              :value="unit" />
                          </el-select>
                        </base-input>
                      </div>
                      <div class="col-lg">
                        <base-input
                          name="Keterangan Debit Air Limbah Total"
                          placeholder="Keterangan (Proses dan Teknologi yang digunakan)"
                          rules="required"
                          v-model="form.prosesProduksi.debitLimbahTotal.keterangan" />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label">Debit Air Reuse</label>
                      <div class="col-lg-2">
                        <base-input
                          name="Debit Air Reuse"
                          placeholder="Masukan nilai debit"
                          rules="required"
                          v-model="form.prosesProduksi.debitReuse.value" />
                      </div>
                      <div class="col-3">
                          <base-input name="Satuan Debit Air Reuse" rules="required">
                          <el-select v-model="form.prosesProduksi.debitReuse.satuan">
                            <el-option v-for="(unit, index) in debitUnit" :key="index"
                              :label="unit"
                              :value="unit" />
                          </el-select>
                        </base-input>
                      </div>
                      <div class="col-lg">
                        <base-input
                          name="Keterangan Debit Air Reuse"
                          placeholder="Keterangan (Proses dan Teknologi yang digunakan)"
                          rules="required"
                          v-model="form.prosesProduksi.debitReuse.keterangan" />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label">Debit Air Recycle</label>
                      <div class="col-lg-2">
                        <base-input
                          name="Debit Air Recycle"
                          placeholder="Masukan nilai debit"
                          rules="required"
                          v-model="form.prosesProduksi.debitRecycle.value"
                        ></base-input>
                      </div>
                      <div class="col-3">
                          <base-input name="Satuan Debit Air Recycle" rules="required">
                          <el-select v-model="form.prosesProduksi.debitRecycle.satuan">
                            <el-option v-for="(unit, index) in debitUnit" :key="index"
                              :label="unit"
                              :value="unit" />
                          </el-select>
                        </base-input>
                      </div>
                      <div class="col-lg">
                        <base-input
                          name="Keterangan Debit Air Recycle"
                          placeholder="Keterangan (Proses dan Teknologi yang digunakan)"
                          rules="required"
                          v-model="form.prosesProduksi.debitRecycle.keterangan" />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label">Debit Air Recovery</label>
                      <div class="col-lg-2">
                        <base-input
                          name="Debit Air Recovery"
                          placeholder="Masukan nilai debit"
                          rules="required"
                          v-model="form.prosesProduksi.debitRecovery.value" />
                      </div>
                      <div class="col-3">
                          <base-input name="Satuan Debit Air Recovery" rules="required">
                          <el-select v-model="form.prosesProduksi.debitRecovery.satuan">
                            <el-option v-for="(unit, index) in debitUnit" :key="index"
                              :label="unit"
                              :value="unit" />
                          </el-select>
                        </base-input>
                      </div>
                      <div class="col-lg">
                        <base-input
                          name="Keterangan"
                          placeholder="Keterangan (Proses dan Teknologi yang digunakan)"
                          rules="required"
                          v-model="form.prosesProduksi.debitRecovery.keterangan"/>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label">Debit Air Limbah Diolah IPAL</label>
                      <div class="col-lg-2">
                        <base-input
                          name="Debit Air Limbah Diolah IPAL"
                          placeholder="Masukan nilai debit"
                          rules="required"
                          v-model="form.prosesProduksi.debitOlahIPAL.value" />
                      </div>
                      <div class="col-3">
                          <base-input name="Satuan Debit Air Limbah Diolah IPAL" rules="required">
                          <el-select v-model="form.prosesProduksi.debitOlahIPAL.satuan">
                            <el-option v-for="(unit, index) in debitUnit" :key="index"
                              :label="unit"
                              :value="unit" />
                          </el-select>
                        </base-input>
                      </div>
                      <div class="col-lg">
                        <base-input
                          name="Keterangan Debit Air Limbah Diolah IPAL"
                          placeholder="Keterangan (Proses dan Teknologi yang digunakan)"
                          rules="required"
                          v-model="form.prosesProduksi.debitOlahIPAL.keterangan" />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label">
                        Unggah Neraca Air Dan Unggah Air Limbah
                      </label>
                      <div class="col-lg-10">
                        <base-input rules="required" name="File Neraca Air Dan Unggah Air Limbah">
                          <file-input
                            :disabled="uploading"
                            accept="application/pdf"
                            ref="fileNeracaAirLimbah"
                            @change="
                              uploadFile(
                                'prosesProduksi',
                                'fileNeracaAirLimbah'
                              )
                            "
                          ></file-input>
                          <base-progress
                            v-if="
                              form.prosesProduksi.fileNeracaAirLimbah.upload >=
                              1
                            "
                            class="mb-0"
                            :type="
                              form.prosesProduksi.fileNeracaAirLimbah
                                .progress >= 100
                                ? 'green'
                                : 'orange'
                            "
                            :value="
                              form.prosesProduksi.fileNeracaAirLimbah.progress
                            "
                          ></base-progress>
                          <hour-glass
                            v-if="
                              form.prosesProduksi.fileNeracaAirLimbah.upload ==
                              1
                            "
                            class="file-upload-animation"
                            size="24px"
                          ></hour-glass>
                          <span
                            v-if="
                              form.prosesProduksi.fileNeracaAirLimbah.upload ==
                              2
                            "
                          >
                            <i
                              class="
                                ni ni-check-bold
                                text-primary
                                file-upload-done
                              "
                            ></i>
                          </span>
                        </base-input>
                        <small
                          v-if="form.prosesProduksi.fileNeracaAirLimbah.upload == 2"
                          class="d-block mt--3 text-justify">
                          <a :href="`${baseURL}/${form.prosesProduksi.fileNeracaAirLimbah.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- END NEW MODULE -->
                <div
                  class="card bg-white border-0"
                  v-if="isSectionPendaftaran == 1"
                >
                  <div class="card-header px-4">
                    Identifikasi Sumber Pencemar
                  </div>
                  <div class="card-body p-4">
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Izin Pembuangan Air Limbah ke Media Air</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Izin Pembuangan Air Limbah ke Media Air"
                          rules="required"
                        >
                          <file-input
                            :disabled="uploading"
                            accept="application/pdf"
                            ref="permitFile"
                            @change="uploadFile('teknis', 'permitFile')"
                          ></file-input>
                          <base-progress
                            v-if="form.teknis.permitFile.upload >= 1"
                            class="mb-0"
                            :type="
                              form.teknis.permitFile.progress >= 100
                                ? 'green'
                                : 'orange'
                            "
                            :value="form.teknis.permitFile.progress"
                          ></base-progress>
                          <hour-glass
                            v-if="form.teknis.permitFile.upload == 1"
                            class="file-upload-animation"
                            size="24px"
                          ></hour-glass>
                          <span v-if="form.teknis.permitFile.upload == 2">
                            <i
                              class="
                                ni ni-check-bold
                                text-primary
                                file-upload-done
                              "
                            ></i>
                          </span>
                        </base-input>
                        <small v-if="form.teknis.permitFile.upload == 2">
                          <a :href="`${baseURL}/${form.teknis.permitFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Pejabat Penerbit Izin</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Pejabat Penerbit Izin"
                          rules="required"
                          v-model="form.teknis.permitPerson"
                        ></base-input>
                        <small class="d-block mt--3 text-justify">
                          Contoh Kepala Dinas Modal dan Pelayanan Terpadu Satu
                          Pintu (DPM-PTSP) Provinsi DKI Jakarta
                        </small>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label
                        class="col-lg-2 col-form-label form-control-label mt--2"
                        >Nomor Izin Pembuangan Air Limbah (Definitif)</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Nomor Izin Pembuangan Air Limbah (Definitif)"
                          rules="required"
                          v-model="form.teknis.permitNumber"
                        ></base-input>
                        <small class="d-block mt--3 text-justify">
                          Diisi nomor izin pembuangan air limbah, bukan surat
                          pemenuhan komitmen. Contoh : Nomor :
                          503/KEP.B75BFFFC-PTSP/2019.
                        </small>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Tanggal Izin Terbit</label
                      >
                      <div class="col-lg-10">
                        <base-input class="m-0" rules="required" name="Tanggal Izin Terbit">
                          <flat-picker
                            name="Tanggal Izin Terbit"
                            rules="required"
                            slot-scope="{ focus, blur }"
                            @on-open="focus"
                            @on-close="blur"
                            :config="selects.configs.flatpickr"
                            class="form-control datepicker"
                            v-model="form.teknis.permitDatePublish"
                          ></flat-picker>
                        </base-input>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Berlaku</label
                      >
                      <div class="col-lg-10">
                        <base-input class="m-0" rules="required" name="Berlaku">
                          <flat-picker
                            name="Berlaku"
                            rules="required"
                            slot-scope="{ focus, blur }"
                            @on-open="focus"
                            @on-close="blur"
                            :config="selects.configs.flatpickr"
                            class="form-control datepicker"
                            v-model="form.teknis.permitDateExpire"
                          ></flat-picker>
                        </base-input>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Sumber Air Limbah</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Sumber Air Limbah"
                          rules="required"
                          v-model="form.teknis.wasteSource"
                        ></base-input>
                        <small class="d-block mt--3 text-justify">
                          Air Limbah proses produksi/air limbah utilitas/air
                          limbah domestik/air limbah pencucian atau pengolahan
                          mineral/air limbah penambangan mineral/air limbah
                          pencucian atau pengolahan batu bara/air limbah
                          penambangan batu bara.
                        </small>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label
                        for="example-number-input"
                        class="col-lg-2 col-form-label form-control-label"
                        >Jumlah Titik Penaatan</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Jumlah Titik Penaatan"
                          rules="required"
                          type="number"
                          v-model="countTitik"
                        />
                        <small class="d-block mt--3 text-justify"
                          >Jumlah titik penaatan yang diwajibkan didalam
                          izin.</small
                        >
                      </div>
                    </div>
                    <div
                      v-for="(titik, index) in form.teknis.spotList"
                      :key="index"
                    >
                      <div class="form-group row">
                        <label
                          class="col-lg-2 col-form-label form-control-label"
                          >Nama Titik Penaatan {{ index + 1 }}</label
                        >
                        <div class="col-lg-10">
                          <base-input
                            name="Nama Titik Penaatan"
                            rules="required"
                            v-model="titik.spotName"
                          />
                          <small
                            v-if="index === 0"
                            class="d-block mt--3 text-justify"
                          >
                            Nama titik penaatan yang akan didaftarkan untuk
                            SPARING WAJIB sama dengan titik penaatan aktif pada SIMPEL PPA
                          </small>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label
                          class="col-lg-2 col-form-label form-control-label"
                          >Lintang</label
                        >
                        <div class="col-lg-10">
                          <base-input
                            name="Lintang"
                            rules="required"
                            type="number"
                            v-model="titik.spotLoc[0]"
                          />
                          <small class="d-block mt--3 text-justify"
                            >Contoh: -7.77751</small
                          >
                          <br />
                          <small
                            v-if="index === 0"
                            class="d-block mt--3 text-justify"
                          >
                            Titik penaatan yang akan didaftarkan untuk SPARING.
                          </small>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label
                          class="col-lg-2 col-form-label form-control-label"
                          >Bujur</label
                        >
                        <div class="col-lg-10">
                          <base-input
                            name="Bujur"
                            rules="required"
                            type="number"
                            v-model="titik.spotLoc[1]"
                          />
                          <small class="d-block mt--3 text-justify"
                            >Contoh: 110.37804</small
                          >
                          <br />
                          <small
                            v-if="index === 0"
                            class="d-block mt--3 text-justify"
                          >
                            Titik penaatan yang akan didaftarkan untuk SPARING.
                          </small>
                        </div>
                      </div>
                      <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label">
                        Nama Badan Air Penerima Air Limbah
                      </label>
                      <div class="col-lg-10">
                        <base-input
                          name="Nama Badan Air Penerima Air Limbah"
                          rules="required"
                          v-model="titik.penerimaAirLimbah" />
                      </div>
                      </div>
                      <div class="form-group row">
                        <label class="col-lg-2 col-form-label form-control-label">DAS</label>
                        <div class="col-lg-10">
                          <base-input
                            name="DAS"
                            rules="required"
                            v-model="titik.das" />
                        </div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label
                        class="col-lg-2 col-form-label form-control-label mt--2"
                        >Jenis Teknologi Pengolahan Air Limbah</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Jenis Teknologi Pengolahan Air Limbah"
                          rules="required"
                          v-model="form.teknis.processingTechnique"
                        />
                        <small class="d-block mt--3 text-justify">
                          Disesuaikan dengan Izin pembuangan air limbah atau
                          izin lingkungan/AMDAL/UKL UPL/RKL RPL. Contoh: Aerob,
                          Anaerob, dll.
                        </small>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Jenis Air Limbah</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Jenis Air Limbah"
                          rules="required"
                          v-model="form.teknis.wasteType"
                        />
                        <small class="d-block mt--3 text-justify">
                          Contoh: air terproduksi, air limbah proses, air limbah
                          lokasi penambangan, dll.
                        </small>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label">Debit</label>
                      <div class="col-lg-10 d-flex px-0">
                        <div class="col-9" id="debit">
                          <base-input
                            name="debit"
                            rules="required"
                            v-model="form.teknis.debit" />
                          <small class="d-block mt--3 text-justify">Debit Maksimum yang wajib di dalam izin</small>
                        </div>
                        <div class="col-3">
                          <base-input name="Satuan debit" rules="required">
                          <el-select v-model="form.teknis.satuanDebit ">
                            <el-option v-for="(unit, index) in debitUnit" :key="index"
                              :label="unit"
                              :value="unit" />
                          </el-select>
                        </base-input>
                        </div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Kapasitas Produksi Sesuai Izin</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Kapasitas Produksi Sesuai Izin"
                          rules="required"
                          type="number"
                          v-model="form.teknis.capacityPermit"
                        />
                        <small class="d-block mt--3 text-justify"
                          >Izin Lingkungan/AMDAL/UKL UPL/RKL RPL</small
                        >
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Kapasitas Produksi Senyatanya</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Kapasitas Produksi Senyatanya"
                          rules="required"
                          type="number"
                          v-model="form.teknis.capacityActual"
                        />
                        <small class="d-block mt--3 text-justify">
                          Pencatatan logbook bulanan selama 1 atau 2 tahun terakhir.
                          Kapasitas produksi rata-rata bulanan.
                        </small>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Frekuensi Pembuangan Air Limbah</label
                      >
                      <div class="col-lg-10">
                        <base-input name="Per tahun" rules="required">
                          <el-select v-model="form.teknis.frequenceDet">
                            <el-option
                              label="Terus Menerus/Kontinyu"
                              value="Terus Menerus/Kontinyu"
                            ></el-option>
                            <el-option
                              label="Tidak Rutin/Intermiten"
                              value="Tidak Rutin/Intermiten"
                            ></el-option>
                          </el-select>
                        </base-input>
                      </div>
                    </div>
                    <div
                      v-if="
                        form.teknis.frequenceDet === 'Terus Menerus/Kontinyu'
                      "
                      class="card bg-white border-0"
                    >
                      <div class="card-header px-4">
                        Detail Frekuensi Pembuangan Air Limbah
                      </div>
                      <div class="card-body p-4">
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                            >Per hari</label
                          >
                          <div class="col-lg-10">
                            <base-input name="Per hari" rules="required">
                              <el-select v-model="form.frekuensi.jam">
                                <el-option
                                  v-for="item in 24"
                                  :key="item + ' jam'"
                                  :label="item + ' jam'"
                                  :value="item"
                                ></el-option>
                              </el-select>
                            </base-input>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                            >Per minggu</label
                          >
                          <div class="col-lg-10">
                            <base-input name="Per minggu" rules="required">
                              <el-select v-model="form.frekuensi.hari">
                                <el-option
                                  v-for="item in 7"
                                  :key="item + ' hari'"
                                  :label="item + ' hari'"
                                  :value="item"
                                ></el-option>
                              </el-select>
                            </base-input>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                            >Per tahun</label
                          >
                          <div class="col-lg-10">
                            <base-input name="Per tahun" rules="required">
                              <el-select v-model="form.frekuensi.bulan">
                                <el-option
                                  v-for="item in 12"
                                  :key="item + ' bulan'"
                                  :label="item + ' bulan'"
                                  :value="item"
                                ></el-option>
                              </el-select>
                            </base-input>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="
                        form.teknis.frequenceDet === 'Tidak Rutin/Intermiten'
                      "
                      class="card bg-white border-0"
                    >
                      <div class="card-header px-4">
                        Detail Frekuensi Pembuangan Air Limbah
                      </div>
                      <div class="card-body p-4">
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                            >Latar Belakang</label
                          >
                          <div class="col-lg-10">
                            <html-editor
                              v-model="form.frekuensi.latarBelakang"
                            ></html-editor>
                            <small class="d-block mt--3 text-justify">
                              Penjelasan (deskripsi) dilakukan pembuangan air
                              limbah secara intermiten
                            </small>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                            >Detail Engineering IPAL</label
                          >
                          <div class="col-lg-10">
                            <html-editor
                              v-model="form.frekuensi.detEngIPAL"
                            ></html-editor>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                            >Foto IPAL</label
                          >
                          <div class="col-lg-10">
                            <base-input name="Foto IPAL" rules="required">
                              <file-input
                                :disabled="uploading"
                                accept="image/x-png, image/jpeg, application/pdf"
                                ref="fotoIPAL"
                                @change="uploadFile('frekuensi', 'fotoIPAL')"
                              ></file-input>
                              <base-progress
                                v-if="form.frekuensi.fotoIPAL.upload >= 1"
                                class="mb-0"
                                :type="
                                  form.frekuensi.fotoIPAL.progress >= 100
                                    ? 'green'
                                    : 'orange'
                                "
                                :value="form.frekuensi.fotoIPAL.progress"
                              ></base-progress>
                              <hour-glass
                                v-if="form.frekuensi.fotoIPAL.upload == 1"
                                class="file-upload-animation"
                                size="24px"
                              ></hour-glass>
                              <span v-if="form.frekuensi.fotoIPAL.upload == 2">
                                <i
                                  class="
                                    ni ni-check-bold
                                    text-primary
                                    file-upload-done
                                  "
                                ></i>
                              </span>
                            </base-input>
                            <small class="d-block mt--3 text-justify"
                              >Bangunan IPAL dan outlet.</small
                            >
                            <small
                              v-if="form.frekuensi.fotoIPAL.upload == 2"
                              class="d-block mt-4 text-justify">
                              <a :href="`${baseURL}${form.frekuensi.fotoIPAL.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                            </small>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                            >Per hari</label
                          >
                          <div class="col-lg-10">
                            <base-input name="Per hari" rules="required">
                              <el-select v-model="form.frekuensi.jam">
                                <el-option
                                  v-for="item in 24"
                                  :key="item + ' jam'"
                                  :label="item + ' jam'"
                                  :value="item"
                                ></el-option>
                              </el-select>
                            </base-input>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                            >Per minggu</label
                          >
                          <div class="col-lg-10">
                            <base-input name="Per minggu" rules="required">
                              <el-select v-model="form.frekuensi.hari">
                                <el-option
                                  v-for="item in 7"
                                  :key="item + ' hari'"
                                  :label="item + ' hari'"
                                  :value="item"
                                ></el-option>
                              </el-select>
                            </base-input>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                            >Per tahun</label
                          >
                          <div class="col-lg-10">
                            <base-input name="Per tahun" rules="required">
                              <el-select v-model="form.frekuensi.bulan">
                                <el-option
                                  v-for="item in 12"
                                  :key="item + ' bulan'"
                                  :label="item + ' bulan'"
                                  :value="item"
                                ></el-option>
                              </el-select>
                            </base-input>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                            >Metode Pengukuran Debit</label
                          >
                          <div class="col-lg-10">
                            <html-editor
                              v-model="form.frekuensi.metUkurDebit"
                            ></html-editor>
                            <small class="d-block mt--3 text-justify"
                              >Metode pengukuran debit yang dilakukan secara
                              manual.</small
                            >
                          </div>
                        </div>
                        <div class="form-group row">
                          <label
                            class="col-lg-2 col-form-label form-control-label"
                            >Logbook Pembuangan Air Limbah</label
                          >
                          <div class="col-lg-10">
                            <base-input name="Logbook" rules="required">
                              <file-input
                                :disabled="uploading"
                                accept="application/pdf"
                                ref="logBook"
                                @change="uploadFile('frekuensi', 'logBook')"
                              ></file-input>
                              <base-progress
                                v-if="form.frekuensi.logBook.upload >= 1"
                                class="mb-0"
                                :type="
                                  form.frekuensi.logBook.progress >= 100
                                    ? 'green'
                                    : 'orange'
                                "
                                :value="form.frekuensi.logBook.progress"
                              ></base-progress>
                              <hour-glass
                                v-if="form.frekuensi.logBook.upload == 1"
                                class="file-upload-animation"
                                size="24px"
                              ></hour-glass>
                              <span v-if="form.frekuensi.logBook.upload == 2">
                                <i
                                  class="
                                    ni ni-check-bold
                                    text-primary
                                    file-upload-done
                                  "
                                ></i>
                              </span>
                            </base-input>
                            <small
                              v-if="form.frekuensi.logBook.upload == 2"
                              class="d-block mt--3 text-justify">
                              <a :href="`${baseURL}/${form.frekuensi.logBook.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- <div class="form-group row">
                <label class="col-lg-2 col-form-label form-control-label"
                  >Frekuensi Pembuangan Air Limbah</label
                >
                <div class="col-lg-10">
                  <base-checkbox
                    v-model="form.teknis.isContinue"
                    class="mt-2 mb-3"
                    >{{ frequencyText }}</base-checkbox
                  >
                  <small class="d-block mt--3 text-justify">
                    Terus menerus/kontinyu adalah pembuangan air limbah dengan
                    frekuensi minimal 20 jam.
                    <br />Tidak rutin/intermiten adalah pembuangan air limbah
                    dengan frekuensi kurang dari 20 jam.
                  </small>
                </div>
                    </div>-->
                  </div>
                </div>
                <div
                  class="card bg-white border-0"
                  v-if="isSectionPendaftaran == 1"
                >
                  <div class="card-header px-4">Persyaratan Teknis</div>
                  <div class="card-body p-4">
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Lulus Uji Konektifitas</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Lulus Uji Konektifitas"
                          rules="required"
                        >
                          <el-select v-model="form.validitas.lulusUji">
                            <el-option
                              label="Individu"
                              value="Individu"
                            ></el-option>
                            <el-option
                              label="Penyedia Barang dan Jasa Alat Sparing"
                              value="Penyedia Barang dan Jasa Alat Sparing"
                            ></el-option>
                          </el-select>
                        </base-input>
                        <small class="d-block mt--3 text-justify">
                          Individu dipilih bagi industri yang memasang dan
                          mengoperasikan tanpa bekerja sama dengan penyedia
                          barang/jasa alat sensor dan logger.
                        </small>
                      </div>
                    </div>
                    <div
                      v-if="form.validitas.lulusUji === 'Individu'"
                      class="form-group row"
                    >
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Nomor Surat Lulus Uji Konektivitas</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Brand"
                          rules="required"
                          v-model="form.validitas.noSurat"
                        />
                        <small class="d-block mt--3 text-justify"
                          >Nomor surat Lulus Uji Konektivitas diterbitkan oleh
                          KLHK</small
                        >
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label">
                        Surat Keterangan Lulus Uji Konektivitas
                      </label>
                      <div class="col-lg-10">
                        <base-input name="Lulus Uji Konektivitas" rules="required">
                          <file-input
                            :disabled="uploading"
                            accept="application/pdf"
                            ref="konektifitasFile"
                            @change="uploadFile('validitas', 'konektifitasFile')" />
                          <base-progress
                            v-if="form.validitas.konektifitasFile.upload >= 1"
                            class="mb-0"
                            :type="
                              form.validitas.konektifitasFile.progress >= 100
                                ? 'green'
                                : 'orange'
                            "
                            :value="form.validitas.konektifitasFile.progress"
                          ></base-progress>
                          <hour-glass
                            v-if="form.validitas.konektifitasFile.upload == 1"
                            class="file-upload-animation"
                            size="24px"
                          ></hour-glass>
                          <span
                            v-if="form.validitas.konektifitasFile.upload == 2"
                          >
                            <i
                              class="
                                ni ni-check-bold
                                text-primary
                                file-upload-done
                              "
                            ></i>
                          </span>
                        </base-input>
                        <small class="d-block mt--3 text-justify"
                          >Wajib yang masih berlaku</small
                        >
                        <small
                          v-if="form.validitas.konektifitasFile.upload == 2"
                          class="d-block mt-4 text-justify">
                          <a :href="`${baseURL}/${form.validitas.konektifitasFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </div>
                    </div>

                    <div
                      v-if="
                        form.validitas.lulusUji ===
                        'Penyedia Barang dan Jasa Alat Sparing'
                      "
                      class="form-group row"
                    >
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Nama Penyedia Barang dan Jasa</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Brand"
                          rules="required"
                          v-model="form.validitas.namaPenyedia"
                        />
                        <small class="d-block mt--3 text-justify"
                          >Surat Keterangan Lulus Uji Konektivitas.</small
                        >
                      </div>
                    </div>
                    <div
                      v-if="
                        form.validitas.lulusUji ===
                        'Penyedia Barang dan Jasa Alat Sparing'
                      "
                      class="form-group row"
                    >
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Kontrak Kerjasama</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Surat Keterangan Lulus Uji Konektivitas"
                          rules="required"
                        >
                          <file-input
                            :disabled="uploading"
                            accept="application/pdf"
                            ref="kontrak"
                            @change="uploadFile('validitas', 'kontrak')"
                          ></file-input>
                          <base-progress
                            v-if="form.validitas.kontrak.upload >= 1"
                            class="mb-0"
                            :type="
                              form.validitas.kontrak.progress >= 100
                                ? 'green'
                                : 'orange'
                            "
                            :value="form.validitas.kontrak.progress"
                          ></base-progress>
                          <hour-glass
                            v-if="form.validitas.kontrak.upload == 1"
                            class="file-upload-animation"
                            size="24px"
                          ></hour-glass>
                          <span v-if="form.validitas.kontrak.upload == 2">
                            <i
                              class="
                                ni ni-check-bold
                                text-primary
                                file-upload-done
                              "
                            ></i>
                          </span>
                        </base-input>
                        <small
                          v-if="form.validitas.kontrak.upload == 2"
                          class="d-block mt--3 text-justify">
                          <a :href="`${baseURL}/${form.validitas.kontrak.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </div>
                    </div>
                    <div
                      v-if="form.validitas.lulusUji !== null"
                      class="form-group row"
                    >
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Info Alat</label
                      >
                      <div class="col-lg-10">
                        <base-input name="Per tahun" rules="required">
                          <el-select v-model="form.validitas.infoAlat">
                            <el-option label="Baru" value="Baru"></el-option>
                            <el-option label="Lama" value="Lama"></el-option>
                          </el-select>
                        </base-input>
                        <small class="d-block mt--3 text-justify">
                          Alat lama adalah sensor yang sudah terpasang sebelum
                          Permen LH 93/2018.
                        </small>
                      </div>
                    </div>

                    <div
                      v-if="form.validitas.lulusUji !== null"
                      class="form-group row"
                    >
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Hasil Kalibrasi Saat Awal Pemasangan Alat</label
                      >
                      <div
                        v-if="form.validitas.lulusUji !== null"
                        class="col-lg-10"
                      >
                        <base-input
                          name="Hasil Kalibrasi Saat Awal Pemasangan Alat"
                          rules="required"
                        >
                          <file-input
                            :disabled="uploading"
                            accept="application/pdf"
                            ref="kalibrasiFile"
                            @change="uploadFile('validitas', 'kalibrasiFile')"
                          ></file-input>
                          <base-progress
                            v-if="form.validitas.kalibrasiFile.upload >= 1"
                            class="mb-0"
                            :type="
                              form.validitas.kalibrasiFile.progress >= 100
                                ? 'green'
                                : 'orange'
                            "
                            :value="form.validitas.kalibrasiFile.progress"
                          ></base-progress>
                          <hour-glass
                            v-if="form.validitas.kalibrasiFile.upload == 1"
                            class="file-upload-animation"
                            size="24px"
                          ></hour-glass>
                          <span v-if="form.validitas.kalibrasiFile.upload == 2">
                            <i
                              class="
                                ni ni-check-bold
                                text-primary
                                file-upload-done
                              "
                            ></i>
                          </span>
                        </base-input>
                        <small class="d-block mt--3 text-justify"
                          >Sertifikat hasil uji kalibrasi.</small
                        >
                        <small
                          v-if="form.validitas.kalibrasiFile.upload == 2"
                          class="d-block mt-4 text-justify">
                          <a :href="`${baseURL}/${form.validitas.kalibrasiFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </div>
                    </div>

                    <div
                      v-if="form.validitas.lulusUji !== null"
                      class="form-group row"
                    >
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Hasil Kalibrasi Alat Rutin</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Hasil Kalibrasi Alat Rutin"
                          rules="required"
                        >
                          <file-input
                            :disabled="uploading"
                            accept="application/pdf"
                            ref="kalibrasiRutinFile"
                            @change="
                              uploadFile('validitas', 'kalibrasiRutinFile')
                            "
                          ></file-input>
                          <base-progress
                            v-if="form.validitas.kalibrasiRutinFile.upload >= 1"
                            class="mb-0"
                            :type="
                              form.validitas.kalibrasiRutinFile.progress >= 100
                                ? 'green'
                                : 'orange'
                            "
                            :value="form.validitas.kalibrasiRutinFile.progress"
                          ></base-progress>
                          <hour-glass
                            v-if="form.validitas.kalibrasiRutinFile.upload == 1"
                            class="file-upload-animation"
                            size="24px"
                          ></hour-glass>
                          <span
                            v-if="form.validitas.kalibrasiRutinFile.upload == 2"
                          >
                            <i
                              class="
                                ni ni-check-bold
                                text-primary
                                file-upload-done
                              "
                            ></i>
                          </span>
                        </base-input>
                        <small class="d-block mt--3 text-justify"
                          >Sertifikat hasil uji kalibrasi.</small
                        >
                        <small
                          v-if="form.validitas.kalibrasiRutinFile.upload == 2"
                          class="d-block mt-4 text-justify">
                          <a :href="`${baseURL}/${form.validitas.kalibrasiRutinFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </div>
                    </div>
                    <div
                      v-if="form.validitas.lulusUji !== null"
                      class="form-group row"
                    >
                      <label class="col-lg-2 col-form-label form-control-label">
                        Hasil Uji Kinerja Dari Laboratorium Yang Ditunjuk Oleh
                        KLHK
                      </label>
                      <div class="col-lg-10">
                        <base-input
                          name="Hasil Uji Kinerja Dari Laboratorium Yang Ditunjuk Oleh KLHK"
                          rules="required"
                        >
                          <file-input
                            :disabled="uploading"
                            accept="application/pdf"
                            ref="kinerjaFile"
                            @change="uploadFile('validitas', 'kinerjaFile')"
                          ></file-input>
                          <base-progress
                            v-if="form.validitas.kinerjaFile.upload >= 1"
                            class="mb-0"
                            :type="
                              form.validitas.kinerjaFile.progress >= 100
                                ? 'green'
                                : 'orange'
                            "
                            :value="form.validitas.kinerjaFile.progress"
                          ></base-progress>
                          <hour-glass
                            v-if="form.validitas.kinerjaFile.upload == 1"
                            class="file-upload-animation"
                            size="24px"
                          ></hour-glass>
                          <span v-if="form.validitas.kinerjaFile.upload == 2">
                            <i
                              class="
                                ni ni-check-bold
                                text-primary
                                file-upload-done
                              "
                            ></i>
                          </span>
                        </base-input>
                        <small class="d-block mt--3 text-justify">
                          Uji kinerja alat wajib dilaksanakan di laboratorium
                          yang ditunjuk oleh KLHK cq. Pusat Standarisasi
                          Lingkungan dan Kehutanan. Laboratorium dimaksud adalah
                          laboratorium yang melaksanakan pengujian kinerja alat
                          pemantauan online air sesuai prosedur dalam petunjuk
                          teknis Uji Kinerja Alat Pemantauan Online untuk Air
                          mengacu kepada SNI ISO 15839:2003.
                        </small>
                        <small
                          v-if="form.validitas.kinerjaFile.upload == 2"
                          class="d-block mt-4 text-justify">
                          <a :href="`${baseURL}/${form.validitas.kinerjaFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </div>
                    </div>

                    <!-- <div class="form-group row">
                <label class="col-lg-2 col-form-label form-control-label"
                  >Hasil Uji Validitas Dari Laboratorium Yang Ditunjuk Oleh
                  KLHK</label
                >
                <div class="col-lg-10">
                  <base-input name="Hasil Kalibrasi Alat" rules="required">
                    <file-input
                      ref="validitasFile"
                      @change="uploadFile('validitas', 'validitasFile')"
                    ></file-input>
                    <hour-glass
                      v-if="form.validitas.validitasFile.upload == 1"
                      class="file-upload-animation"
                      size="24px"
                    ></hour-glass>
                    <span v-if="form.validitas.validitasFile.upload == 2">
                      <i
                        class="ni ni-check-bold text-primary file-upload-done"
                      ></i>
                    </span>
                  </base-input>
                  <small class="d-block mt--3 text-justify"
                    >Hasil Uji Kinerja Alat</small
                  >
                </div>
                    </div>-->
                    <div
                      v-if="form.validitas.lulusUji !== null"
                      class="form-group row"
                    >
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Surat Dukungan Dari Brand Sensor</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Surat Dukungan Dari Brand Sensor"
                          rules="required"
                        >
                          <file-input
                            :disabled="uploading"
                            accept="application/pdf"
                            ref="dukunganBrand"
                            @change="uploadFile('surat', 'dukunganBrand')"
                          ></file-input>
                          <base-progress
                            v-if="form.surat.dukunganBrand.upload >= 1"
                            class="mb-0"
                            :type="
                              form.surat.dukunganBrand.progress >= 100
                                ? 'green'
                                : 'orange'
                            "
                            :value="form.surat.dukunganBrand.progress"
                          ></base-progress>
                          <hour-glass
                            v-if="form.surat.dukunganBrand.upload == 1"
                            class="file-upload-animation"
                            size="24px"
                          ></hour-glass>
                          <span v-if="form.surat.dukunganBrand.upload == 2">
                            <i
                              class="
                                ni ni-check-bold
                                text-primary
                                file-upload-done
                              "
                            ></i>
                          </span>
                        </base-input>
                        <small class="d-block mt--3 text-justify"
                          >Upload Surat Dukungan Dari Brand Sensor</small
                        >
                        <small
                          v-if="form.surat.dukunganBrand.upload == 2"
                          class="d-block mt-4 text-justify">
                          <a :href="`${baseURL}/${form.surat.dukunganBrand.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </div>
                    </div>
                    <div
                      v-if="form.validitas.lulusUji !== null"
                      class="form-group row"
                    >
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Surat Pernyataan</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Surat Pernyataan dari Vendor Sensor"
                          rules="required"
                        >
                          <file-input
                            :disabled="uploading"
                            accept="application/pdf"
                            ref="pernyataanVendor"
                            @change="uploadFile('surat', 'pernyataanVendor')"
                          ></file-input>
                          <base-progress
                            v-if="form.surat.pernyataanVendor.upload >= 1"
                            class="mb-0"
                            :type="
                              form.surat.pernyataanVendor.progress >= 100
                                ? 'green'
                                : 'orange'
                            "
                            :value="form.surat.pernyataanVendor.progress"
                          ></base-progress>
                          <hour-glass
                            v-if="form.surat.pernyataanVendor.upload == 1"
                            class="file-upload-animation"
                            size="24px"
                          ></hour-glass>
                          <span v-if="form.surat.pernyataanVendor.upload == 2">
                            <i
                              class="
                                ni ni-check-bold
                                text-primary
                                file-upload-done
                              "
                            ></i>
                          </span>
                        </base-input>
                        <small class="d-block mt--3 text-justify">
                          Khusus untuk perusahaan atau vendor yang merakit alat
                          sensor,
                          <b>secara mandiri</b> menyampaikan surat pernyataan.
                        </small>
                        <small
                          v-if="form.surat.pernyataanVendor.upload == 2"
                          class="d-block mt-4 text-justify">
                          <a :href="`${baseURL}/${form.surat.pernyataanVendor.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="card bg-white border-0"
                  v-if="isSectionPendaftaran == 1"
                >
                  <div class="card-header px-4">Data Logger</div>
                  <div class="card-body p-4">
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Brand</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Brand Logger"
                          rules="required"
                          v-model="form.logger[0].brand"
                        />
                        <small class="d-block mt--3 text-justify">
                          Jika menggunakan data logger Lokal (Rakitan Lokal),
                          disampaikan spesifikasinya
                        </small>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Model</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Model"
                          rules="required"
                          v-model="form.logger[0].model"
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Serial Number</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Serial Number"
                          rules="required"
                          v-model="form.logger[0].sn"
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >MAC Address</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="MAC Address"
                          rules="required"
                          v-model="form.logger[0].mac"
                        />
                        <small class="d-block mt--3 text-justify"
                          >Contoh: OA:0E:AA:8R:77</small
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="card bg-white border-0"
                  v-if="isSectionPendaftaran == 1"
                >
                  <div class="card-header px-4">Sensor</div>
                  <div class="card-body p-4">
                    <div v-for="(item, index) in form.sensor" :key="item.name">
                      <div class="form-group row">
                        <label
                          class="col-lg-2 col-form-label form-control-label"
                          >{{ item.label }}</label
                        >
                        <div class="col-lg-10">
                          <base-checkbox
                            v-model="form.sensor[index].active"
                            class="mt-2 mb-3"
                          >
                            {{
                              form.sensor[index].active
                                ? "Digunakan"
                                : "Tidak digunakan"
                            }}
                          </base-checkbox>
                          <small class="d-block mt--3 text-justify">
                            Aktifkan checkbox jika sensor digunakan untuk
                            mengisi data sensor
                          </small>
                        </div>
                      </div>
                      <template v-if="form.sensor[index].active">
                        <div class="row">
                          <div class="col-lg-2"></div>
                          <div class="form-group col-lg-10 p-0">
                            <label
                              class="
                                col-12 col-form-label
                                form-control-label
                                py-0
                              "
                              >Brand</label
                            >
                            <div class="col-12">
                              <base-input
                                rules="required"
                                :name="`brand ${form.sensor[index].name}`"
                                v-model="form.sensor[index].brand"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-2"></div>
                          <div class="form-group col-lg-10 p-0">
                            <label
                              class="
                                col-12 col-form-label
                                form-control-label
                                py-0
                              "
                              >Probe</label
                            >
                            <div class="col-12">
                              <base-input
                                :name="`Probe ${form.sensor[index].name}`"
                                rules="required"
                                v-model="form.sensor[index].probe"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-2"></div>
                          <div class="form-group col-lg-10 p-0">
                            <label
                              class="
                                col-11 col-form-label
                                form-control-label
                                py-0
                              "
                              >Brosur</label
                            >
                            <div class="col-12">
                              <base-input
                                :name="`Brosur ${form.sensor[index].name}`"
                                rules="required"
                              >
                                <file-input
                                  :disabled="uploading"
                                  accept="application/pdf"
                                  :ref="'brosurFile' + index"
                                  @change="uploadSensorFile(index)"
                                />
                                <base-progress
                                  v-if="
                                    form.sensor[index].brosurFile.upload >= 1
                                  "
                                  class="mb-0"
                                  :type="
                                    form.sensor[index].brosurFile.progress >=
                                    100
                                      ? 'green'
                                      : 'orange'
                                  "
                                  :value="
                                    form.sensor[index].brosurFile.progress
                                  "
                                ></base-progress>
                                <hour-glass
                                  v-if="
                                    form.sensor[index].brosurFile.upload == 1
                                  "
                                  class="file-upload-animation"
                                  size="24px"
                                ></hour-glass>
                                <span
                                  v-if="
                                    form.sensor[index].brosurFile.upload == 2
                                  "
                                >
                                  <i
                                    class="
                                      ni ni-check-bold
                                      text-primary
                                      file-upload-done
                                    "
                                  ></i>
                                </span>
                              </base-input>
                              <small
                                v-if="form.sensor[index].brosurFile.upload == 2"
                                class="d-block mt--3 text-justify">
                                <a :href="`${baseURL}/${form.sensor[index].brosurFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                              </small>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-2"></div>
                          <div class="form-group col-lg-10">
                            <label
                              class="
                                col-11 col-form-label
                                form-control-label
                                px-0
                              "
                              >Range Pengukuran Sensor</label
                            >
                            <div class="row">
                              <div class="col-6">
                                <div class="form-group row">
                                  <div class="col-lg-12">
                                    <base-input
                                      :name="`Range Pengukuran Sensor ${form.sensor[index].name} Minimal`"
                                      rules="required"
                                      type="number"
                                      v-model="form.sensor[index].minMeasure"
                                    />
                                    <small class="d-block mt--4 text-justify"
                                      >Minimum</small
                                    >
                                  </div>
                                </div>
                              </div>
                              <div class="col-6">
                                <div class="form-group row">
                                  <div class="col-lg-12">
                                    <base-input
                                      rules="required"
                                      :name="`Range Pengukuran Sensor ${form.sensor[index].name} Maksimal`"
                                      type="number"
                                      v-model="form.sensor[index].maxMeasure"
                                    />
                                    <small class="d-block mt--4 text-justify"
                                      >Maximum</small
                                    >
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-2"></div>
                          <div class="form-group col-lg-10">
                            <label
                              class="
                                col-11 col-form-label
                                form-control-label
                                px-0
                              "
                              >Baku Mutu Air Limbah Sesuai Izin</label
                            >
                            <div v-if="item.name === 'pH'" class="row">
                              <div class="col-6">
                                <div class="form-group row">
                                  <div class="col-lg-12">
                                    <base-input
                                      :name="`Baku Mutu ${form.sensor[index].name} Minimal`"
                                      rules="required"
                                      type="number"
                                      v-model="form.sensor[index].min"
                                    />
                                    <small class="d-block mt--4 text-justify"
                                      >Minimum</small
                                    >
                                  </div>
                                </div>
                              </div>
                              <div class="col-6">
                                <div class="form-group row">
                                  <div class="col-lg-12">
                                    <base-input
                                      type="number"
                                      :name="`Baku Mutu ${form.sensor[index].name} Maksimal`"
                                      rules="required"
                                      v-model="form.sensor[index].max"
                                    />
                                    <small class="d-block mt--4 text-justify"
                                      >Maximum</small
                                    >
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div v-else-if="item.name === 'Debit'" class="row">
                              <div class="col-12">
                                <div class="form-group row">
                                  <div class="col-lg-9">
                                    <base-input
                                      type="number"
                                      rules="required"
                                      name="Debit maksimum"
                                      v-model="form.sensor[index].max" />
                                    <small class="d-block mt--4 text-justify" >Maximum</small>
                                  </div>
                                  <div class="col-3">
                                    <base-input name="Satuan sensor debit" rules="required">
                                      <el-select v-model="form.sensor[index].satuanDebit ">
                                        <el-option v-for="(unit, index) in debitUnit" :key="index"
                                          :label="unit"
                                          :value="unit" />
                                      </el-select>
                                    </base-input>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div v-else class="row">
                              <div class="col-12">
                                <div class="form-group row">
                                  <div class="col-lg-12">
                                    <base-input
                                      type="number"
                                      rules="required"
                                      :name="`${form.sensor[index].name} maksimum`"
                                      v-model="form.sensor[index].max"
                                    />
                                    <small class="d-block mt--4 text-justify"
                                      >Maximum</small
                                    >
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-2"></div>
                          <div class="form-group col-lg-10 p-0">
                            <label
                              class="
                                col-12 col-form-label
                                form-control-label
                                py-0
                              "
                              >Metode Pengukuran</label
                            >
                            <div class="col-12">
                              <base-input
                                rules="required"
                                :name="`Metode Pengukuran ${form.sensor[index].name}`"
                                v-model="form.sensor[index].metodePengukuran"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-2"></div>
                          <div class="form-group col-lg-10 p-0">
                            <label class="col-12 col-form-label form-control-label py-0">
                              Jadwal Kalibrasi
                            </label>
                            <div class="col-12">
                              <base-input rules="required" :name="`Jadwal Kalibrasi ${form.sensor[index].name}`">
                                <el-select v-model="form.sensor[index].jadwalKalibrasi">
                                  <el-option v-for="bulan in 12" :key="bulan" :label="`${bulan} Bulan`" :value="`${bulan} Bulan`" />
                                </el-select>
                              </base-input>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-2"></div>
                          <div class="form-group col-lg-10 p-0">
                            <label class="col-12 col-form-label form-control-label py-0">Tanggal Kalibrasi</label>
                            <div class="col-12">
                              <base-input class="m-0" rules="required" :name="`Tanggal Kalibrasi ${form.sensor[index].name}`">
                                <flat-picker
                                  :config="selects.configs.flatpickr"
                                  class="form-control datepicker"
                                  v-model="form.sensor[index].tanggalKalibrasi"
                                />
                              </base-input>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-2"></div>
                          <div class="form-group col-lg-10 p-0">
                            <label
                              class="
                                col-12 col-form-label
                                form-control-label
                                py-0
                              "
                              >Metode Kalibrasi</label
                            >
                            <div class="col-12">
                              <base-input
                                rules="required"
                                :name="`Metode Kalibrasi ${form.sensor[index].name}`"
                                v-model="form.sensor[index].metodeKalibrasi"
                              />
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                    <base-input
                      :rules="{ required: { allowFalse: false } }"
                      name="Sensor"
                    >
                      <base-checkbox v-model="form.sensorDone"
                        >Data sensor sudah benar</base-checkbox
                      >
                    </base-input>
                  </div>
                </div>
                <!-- <div class="card bg-white border-0">
            <div class="card-header px-4">Dokumen Tambahan</div>
            <div class="card-body p-4"></div>
                </div>-->
                <div class="row">
                  <div class="col-10"></div>
                  <div v-if="isEditData == 1" class="col-2">
                    <base-button
                      class="w-100"
                      size="md"
                      type="primary"
                      @click="checkForm"
                      >Simpan</base-button
                    >
                  </div>
                  <div v-if="isEditData == 2" class="col-2">
                    <base-button
                      class="w-100"
                      size="md"
                      type="primary"
                      @click="checkForm"
                      >Ubah</base-button
                    >
                  </div>
                </div>
              </form>
            </validation-observer>
          </template>
        </div>
      </div>
    </div>
    <Modal
      v-if="isShowModalForceUpdate"
      :show="isShowModalForceUpdate"
      modalContentClasses="zmdl-content"
      modalClasses="modal-dialog-scrollable"
      headerClasses="pb-0"
      @close="isShowModalForceUpdate = false"
      size="xl">
      <template v-slot:header>
        <div class="modal-title">
          <p class="mdl-title">Update data</p>
        </div>
      </template>
      <validation-observer ref="formValidatorForceUpdate">
        <div class="px-4 border-top pt-4">
          <div class="form-group row">
            <p class="pl-3 col-form-label form-control-label">Permohonan koneksi</p>
            <div class="col-lg-12">
              <base-input rules="required" name="File Permohonan koneksi">
                <file-input
                  :disabled="uploading"
                  accept="application/pdf"
                  ref="compPermohonanKoneksi"
                  @change="uploadFile('umum', 'compPermohonanKoneksi')"
                ></file-input>
                <base-progress
                  v-if="form.umum.compPermohonanKoneksi && form.umum.compPermohonanKoneksi.upload >= 1"
                  class="mb-0"
                  :type="
                    form.umum.compPermohonanKoneksi &&
                    form.umum.compPermohonanKoneksi.progress >= 100
                      ? 'green'
                      : 'orange'
                  "
                  :value="form.umum.compPermohonanKoneksi && form.umum.compPermohonanKoneksi.progress"
                ></base-progress>
                <hour-glass
                  v-if="form.umum.compPermohonanKoneksi && form.umum.compPermohonanKoneksi.upload == 1"
                  class="file-upload-animation"
                  size="24px"
                ></hour-glass>
                <span v-if="form.umum.compPermohonanKoneksi && form.umum.compPermohonanKoneksi.upload == 2">
                  <i
                    class="
                      ni ni-check-bold
                      text-primary
                      file-upload-done
                    "
                  ></i>
                </span>
              </base-input>
              <small class="d-block mt--3 text-justify">
                Surat permohonan pendaftaran koneksi sparing kepada Direktur Pengendalian Pencemaran Air.
              </small>
              <small
                v-if="form.umum.compPermohonanKoneksi"
                class="d-block mt-4 text-justify">
                <a :href="`${baseURL}/${form.umum.compPermohonanKoneksi.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
              </small>
            </div>
          </div>

          <div v-for="(item, index) in form.sensor" :key="item.name">
            <div class="form-group row">
              <p class="pl-3 col-form-label form-control-label">{{ item.label }}</p>
              <div class="col-lg-12">
                <base-checkbox
                  v-model="form.sensor[index].active"
                  class="mt-2 mb-3"
                >
                  {{
                    form.sensor[index].active
                      ? "Digunakan"
                      : "Tidak digunakan"
                  }}
                </base-checkbox>
                <small class="d-block mt--3 text-justify">
                  Aktifkan checkbox jika sensor digunakan untuk
                  mengisi data sensor
                </small>
              </div>
            </div>

            <template v-if="form.sensor[index].active">
              <div class="form-group row">
                <p class="pl-3 col-form-label form-control-label">Jadwal Kalibrasi</p>
                <div class="col-lg-12">
                  <el-select v-model="form.sensor[index].jadwalKalibrasi" rules="required">
                    <el-option v-for="bulan in 12" :key="bulan" :label="`${bulan} Bulan`" :value="`${bulan} Bulan`" />
                  </el-select>
                </div>
              </div>

              <div class="form-group row">
                <p class="pl-3 col-form-label form-control-label">Tanggal Kalibrasi</p>
                <div class="col-lg-12">
                  <base-input class="m-0" rules="required" :name="`Update Tanggal Kalibrasi ${form.sensor[index].name}`">
                    <flat-picker
                      :config="selects.configs.flatpickr"
                      class="form-control datepicker"
                      v-model="form.sensor[index].tanggalKalibrasi"
                    />
                  </base-input>
                </div>
              </div>
              <template v-if="item.name === 'Debit' && item.active">
                <div class="form-group row">
                  <p class="pl-3 col-form-label form-control-label">Satuan Debit</p>
                  <div class="col-lg-12">
                    <base-input name="Satuan Debit Penggunaan Air" rules="required">
                      <el-select v-model="form.prosesProduksi.debitPenggunaan.satuan">
                        <el-option v-for="(unit, index) in debitUnit" :key="index"
                          :label="unit"
                          :value="unit" />
                      </el-select>
                    </base-input>
                  </div>
                </div>
              </template>
            </template>
          </div>

          <base-button
            class="w-100"
            size="md"
            type="primary"
            @click="updateForceData"
          >
            Update
          </base-button>
        </div>
      </validation-observer>
    </Modal>
    <Modal
      :show="showNoteModal"
      modalClasses="modal-dialog-scrollable"
      headerClasses="pb-0"
      @close="showNoteModal = false"
      size="lg">
      <div class="px-4">
        <div class="form-group row">
          <label class="col-lg-12 col-form-label form-control-label">
            Tulis keterangan mengenai perubahan atau perbaikan data (min. 100 karakter)
          </label>
          <div class="col-lg-12">
            <textarea class="w-100 form-control" rows="5" v-model="updateNote" />
            <small>{{ updateNote.length }} karakter</small>
          </div>
        </div>
        <div class="form-group row px-3 float-right mb-0">
          <button class="btn btn-warning" @click="showNoteModal = false">Tutup</button>
          <button class="btn btn-primary" @click="updateHandler" :disabled="updateNote.length < 100">Simpan</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import HtmlEditor from "@/components/Inputs/HtmlEditor";
import { Table, TableColumn, Select, Option } from "element-ui";
import { BasePagination, BaseInput } from "@/components";
import { HourGlass } from "vue-loading-spinner";
import FileInput from "@/components/Inputs/FileInput";
import flatPicker from "vue-flatpickr-component";
import Axios from "axios";
import Moment from "moment";
import "flatpickr/dist/flatpickr.css";
import swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import defaults from "@/util/defaults";
import CheckStatus from "@/views/Pages/Pendaftaran/CheckStatus.vue";
import Modal from "@/components/Modal.vue";

const debitUnit = ['m3/detik', 'm3/menit', 'm3/jam', 'm3/hari', 'm3/bulan'];
export default {
  components: {
    Modal,
    HtmlEditor,
    HourGlass,
    FileInput,
    BaseInput,
    flatPicker,
    [Select.name]: Select,
    [Option.name]: Option,
    CheckStatus,
  },
  data() {
    return {
      isShowModalForceUpdate: false,
      showNoteModal: false,
      updateNote: "",
      forceUpdateData: null,
      edit: false,
      editID: "",
      isEditData: 0,
      isSectionPendaftaran: 0,
      uploading: false,
      isDataCorrect: true,
      res: { comp: null, user: null, logger: null },
      temptSelect: null,
      baseURL: defaults.baseURL,
      debitUnit,
      form: {
        akun: {
          personName: null,
          personPhone: null,
          personMail: null,
          personMailID: null,
          personPassword: null,
          personConfirmPassword: null,
        },
        umum: {
          compName: null,
          compNameID: null,
          compType: null,
          compAddress: null,
          compStreet: null,
          compCity: null,
          compProvince: null,
          compPhone: null,
          compMail: null,
          nameSIUP: null,
          ifTambang: {
            status: null,
            jenKegiatan: null,
            kondisiInternet: "",
          },
          rencanaFile: {
            path: "",
            upload: 0,
            progress: 0,
          },
          siupFile: {
            path: "",
            upload: 0,
            progress: 0,
          },
          compPermohonanKoneksi: {
            path: "",
            upload: 0,
            progress: 0,
          },
          updatedAt: 0,
          createdAt: null,
        },
        prosesProduksi: {
          debitPenggunaan: {
            value: null,
            satuan: null,
            keterangan: null,
          },
          debitLimbahTotal: {
            value: null,
            satuan: null,
            keterangan: null,
          },
          debitReuse: {
            value: null,
            satuan: null,
            keterangan: null,
          },
          debitRecycle: {
            value: null,
            satuan: null,
            keterangan: null,
          },
          debitRecovery: {
            value: null,
            satuan: null,
            keterangan: null,
          },
          debitOlahIPAL: {
            value: null,
            satuan: null,
            keterangan: null,
          },
          fileNeracaAirLimbah: {
            path: "",
            upload: 0,
            progress: 0,
          },
        },
        teknis: {
          permitFile: {
            path: "",
            upload: 0,
            progress: 0,
          },
          permitPerson: null,
          permitNumber: null,
          permitDatePublish: new Date(),
          permitDateExpire: new Date(),
          wasteSource: null,
          spotCount: null,
          spotList: [],
          processingTechnique: null,
          wasteType: null,
          debit: null,
          satuanDebit : null,
          capacityPermit: null,
          capacityActual: null,
          frequenceDet: "",
        },
        validitas: {
          infoAlat: null,
          lulusUji: null,
          namaPenyedia: null,
          noSurat: null,
          jadwalKalibrasi: null,
          kontrak: {
            path: "",
            upload: 0,
            progress: 0,
          },
          kinerjaFile: {
            path: "",
            upload: 0,
            progress: 0,
          },
          konektifitasFile: {
            path: "",
            upload: 0,
            progress: 0,
          },
          kalibrasiFile: {
            path: "",
            upload: 0,
            progress: 0,
          },
          kalibrasiRutinFile: {
            path: "",
            upload: 0,
            progress: 0,
          },
          validitasFile: {
            path: "",
            upload: 0,
            progress: 0,
          },
        },
        frekuensi: {
          latarBelakang: "",
          detEngIPAL: "",
          fotoIPAL: {
            path: "",
            upload: 0,
            progress: 0,
          },
          jam: null,
          hari: null,
          bulan: null,
          metUkurDebit: "",
          logBook: {
            path: "",
            upload: 0,
            progress: 0,
          },
        },
        logger: [
          {
            brand: null,
            model: null,
            sn: null,
            mac: null,
          },
        ],
        sensor: [
          {
            name: "pH",
            label: "pH",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              path: "",
              upload: 0,
              progress: 0,
            },
            min: null,
            max: null,
            minMeasure: null,
            maxMeasure: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            tanggalKalibrasi: new Date(),
            metodeKalibrasi: null,
          },
          {
            name: "COD",
            label: "COD",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              path: "",
              upload: 0,
              progress: 0,
            },
            min: null,
            max: null,
            minMeasure: null,
            maxMeasure: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            tanggalKalibrasi: new Date(),
            metodeKalibrasi: null,
          },
          {
            name: "TSS",
            label: "TSS",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              path: "",
              upload: 0,
              progress: 0,
            },
            min: null,
            max: null,
            minMeasure: null,
            maxMeasure: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            tanggalKalibrasi: new Date(),
            metodeKalibrasi: null,
          },
          {
            name: "NH3N",
            label: "NH3N",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              path: "",
              upload: 0,
              progress: 0,
            },
            min: null,
            max: null,
            minMeasure: null,
            maxMeasure: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            tanggalKalibrasi: new Date(),
            metodeKalibrasi: null,
          },
          {
            name: "Debit",
            label: "Debit",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              path: "",
              upload: 0,
              progress: 0,
            },
            min: null,
            max: null,
            minMeasure: null,
            maxMeasure: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            tanggalKalibrasi: new Date(),
            metodeKalibrasi: null,
          },
        ],
        sensorDone: false,
        surat: {
          dukunganBrand: {
            path: "",
            upload: 0,
            progress: 0,
          },
          pernyataanVendor: {
            path: "",
            upload: 0,
            progress: 0,
          },
        },
      },
      selects: {
        configs: {
          flatpickr: {
            allowInput: true,
            altFormat: "d/m/Y",
            altInput: false,
            dateFormat: "d/m/Y",
            mode: "single",
          },
        },
        options: {
          role: [
            {
              label: "Pusat",
              value: "admin",
            },
            {
              label: "Provinsi",
              value: "prov",
            },
            {
              label: "Kab/Kot",
              value: "kabkot",
            },
            {
              label: "Industri",
              value: "comp",
            },
          ],
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
          prov: [],
          city: [],
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
          parameter: [
            {
              label: "pH",
              value: "ph",
            },
            {
              label: "COD",
              value: "cod",
            },
            {
              label: "TSS",
              value: "tss",
            },
            {
              label: "NH3N",
              value: "nh3n",
            },
            {
              label: "Debit",
              value: "debit",
            },
          ],
        },
        type: null,
        prov: null,
        city: null,
        comp: null,
        time: null,
      },
      countTitik: 0,
    };
  },
  watch: {
    countTitik() {
      if (this.countTitik < 1) {
        return 0;
      }
      this.form.teknis.spotCount = this.countTitik;
      let array = [];
      for (let i = 0; i < this.countTitik; i++) {
        array.push({
          spotName: "",
          spotLoc: [null, null],
        });
      }
      this.form.teknis.spotList = array;
      return array.length;
    },
  },
  computed: {
    frequencyText() {
      if (this.form.teknis.isContinue) return "Terus Menerus / Kontinyu";
      else return "Tidak Rutin / Intermiten";
    },
    sensorStatus(index) {
      if (this.form.sensor[index]) return "Digunakan";
      else return "Tidak digunakan";
    },
  },
  methods: {
    async updateForceData() {
      if (!await this.$refs.formValidatorForceUpdate.validate()) {
        this.errorSwal("Tolong lengkapi data");
        return
      }

      const jadwalKalibrasi = this.form.sensor.map((sensor) => {
        if (sensor.active) {
          const [date, month, year] = sensor.tanggalKalibrasi && sensor.tanggalKalibrasi.split(/[\/-]/)
          const newDate = new Date(year, month, date)
          const [jadwal] = sensor.jadwalKalibrasi && sensor.jadwalKalibrasi.split(" ");
          return {
            jadwalKalibrasi: +jadwal,
            tanggalKalibrasi: Moment(newDate).unix()
          }
        } else {
          return {
            jadwalKalibrasi: null,
            tanggalKalibrasi: null
          }
        }
      })
      const params = {
        jadwalKalibrasi,
        compPermohonanKoneksi: { path: this.form.umum.compPermohonanKoneksi && this.form.umum.compPermohonanKoneksi.path },
        satuanDebit: this.form.prosesProduksi.debitPenggunaan.satuan
      }
      try {
        const { data, status } = await Axios.put(
          `${defaults.baseURL}/pendaftaran/update/kalibrasi/${JSON.parse(localStorage.getItem('auth-data')).userRole.compID}`,
          params
        )

        if (status === 200) {
          localStorage.removeItem('forceUpdate')
          this.isShowModalForceUpdate = false;
          swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Successfully updated',
            showConfirmButton: false,
            timer: 1500
          })
          this.$router.push({ name: 'home' });
        }
       
      } catch(err) {
        this.isShowModalForceUpdate = true;
          swal.fire({
            position: 'top',
            icon: 'warning',
            title: "Failed updated, please check again your input.",
            showConfirmButton: false,
            timer: 1500
          })
      }
    },
    adjustFuckingDateFormat(date) {
      if (!date) return;
      if (isNaN(date)) return date;
      return Moment.unix(date).format("DD/MM/YYYY");
    },
    getDatatoEdit() {
      Axios.get(
        `${defaults.baseURL}/form/pendaftaran-get/${this.editID}`
      ).then((res) => {
        this.form = res.data;
        // this.form = { ...res.data, ...this.form };
        this.form.umum.compNameID = res.data.umum.compName
        this.form.akun.personMailID = res.data.akun.personMail
        this.form.sensor[0].tanggalKalibrasi = this.adjustFuckingDateFormat(res.data.sensor[0].tanggalKalibrasi)
        this.form.sensor[1].tanggalKalibrasi = this.adjustFuckingDateFormat(res.data.sensor[1].tanggalKalibrasi)
        this.form.sensor[2].tanggalKalibrasi = this.adjustFuckingDateFormat(res.data.sensor[2].tanggalKalibrasi)
        this.form.sensor[3].tanggalKalibrasi = this.adjustFuckingDateFormat(res.data.sensor[3].tanggalKalibrasi)
        this.form.sensor[4].tanggalKalibrasi = this.adjustFuckingDateFormat(res.data.sensor[4].tanggalKalibrasi)
      });
    },
    updateHandler() {
      this.form.umum.updatedAt = Moment().unix();
      this.form.rejected = false;
      this.form.resubmision = true;
      this.form.note = this.updateNote;
      Axios.put(`${defaults.baseURL}/pendaftaran`, this.form)
        .then((res) => {
          if(res){
            swal.fire("Tersimpan", "Data telah diperbaharui", "success").then(() => {
              this.updateNote = "";
              this.$router.push("/");
            });
          }
        })
        .catch((err) => {
          this.errorSwal("Update Error");
        });
    },
    fillThePain() {},
    uploadFile(category, field) {
      this.uploading = true;
      if (!this.form[category][field]) {
        this.form[category][field] = {
          path: "",
          upload: 0,
          progress: 0,
        }
      }
      // this.form[category] = field
      this.form[category][field].upload = 1;
      let formData = new FormData();
      formData.append("picture", this.$refs[field].files[0]);

      Axios.post(`${defaults.baseURL}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: function (progressEvent) {
          this.form[category][field].progress = parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        }.bind(this),
      })
        .then((res) => {
          this.form[category][field].upload = 2;
          this.form[category][field].path = res.data.path;
          this.uploading = false;
        })
        .catch((err) => {
          this.form[category][field].upload = 0;
          this.uploading = false;
          this.errorSwal("Silakan Upload Ulang");
          console.log(err);
        });
    },
    uploadSensorFile(index) {
      this.uploading = true;
      this.form.sensor[index].brosurFile.upload = 1;
      let formData = new FormData();
      formData.append("picture", this.$refs["brosurFile" + index][0].files[0]);
      Axios.post(`${defaults.baseURL}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: function (progressEvent) {
          this.form.sensor[index].brosurFile.progress = parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        }.bind(this),
      })
        .then((res) => {
          this.form.sensor[index].brosurFile.upload = 2;
          this.form.sensor[index].brosurFile.path = res.data.path;
          this.uploading = false;
        })
        .catch((err) => {
          this.form.sensor[index].brosurFile.upload = 0;
          this.uploading = false;
          this.errorSwal("Silakan Upload Ulang");
        });
    },
    changeSensorFile(index, files) {
      this.form.sensor[index].brosur = files;
    },
    changeTeknisPermitFile(files) {},
    errorSwal(message) {
      swal.fire({
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 3000,
      })
    },
    async checkForm() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (!tempValidate) {
        this.errorSwal("TOLONG LENGKAPI DATA ANDA!!!!!");
      } else {
        this.handleSubmit();
      }
    },
    async handleSubmit() {
      if (!this.form.umum.compProvince || !this.form.umum.compCity) {
        this.errorSwal("Silakan Isi Provinsi & Kabupaten Terlebih Dahulu!");
        return;
      }
      if (
        this.form.akun.personPassword !== this.form.akun.personConfirmPassword
      ) {
        this.errorSwal("Password yg anda ketik tidak sama!");
        return;
      }
      if (this.isEditData == 2) {
        this.showNoteModal = true;
      }
      if (this.isEditData == 1) {
        swal.fire({
          title: "Apakah Data Sudah Benar?",
          text: "Apakah Data Sudah Benar?!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Simpan",
          cancelButtonText: "Batal",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed)  this.registerHandler();
        })
      }
    },
    registerHandler() {
      this.form.umum.createdAt = Moment().unix();
      Axios.post(`${defaults.baseURL}/pendaftaran`, this.form)
        .then((res) => {
          if (res.status == 200) {
            swal.fire(
              "Tersimpan",
              "Data anda telah teregister dengan ID Pendaftaran: " + `<b><p class="text-danger">${res.data._id}</p></b>`,
              "success"
            ).then(() =>{
              this.$router.push("/");
            });
          }
          else if(res.status == 208){
            this.errorSwal(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
          this.errorSwal(err);
        });
    },
    changeUmumPermitFile(files) {
      this.form.umum.permitFile = files;
    },
    getKabkot(data) {
      const list = this.tempSelect.kabkotList;
      const filterList = list.filter((l) => l.provID === data);
      this.selects.options.city = filterList;
      this.form.umum.compCity = null;
    },
    getList() {
      Axios.get(
       `${defaults.baseURL}/report/list/5f340d5e328182315c11ee98`
      ).then((res) => {
        this.selects.options.prov = res.data.provList;
        this.selects.options.city = res.data.kabkotList;
        this.selects.options.comp = res.data.compList;
        this.tempSelect = res.data;
      });
    },
    changeParamCount() {
      this.form.parm = [];
      for (let i = 0; i < this.form.pcnt; i++) {
        this.form.parm.push({
          name: null,
          min: 0,
          max: 0,
        });
      }
    },
    unixTS2DMY(timestamp) {
      return Moment.unix(timestamp).format("DD/MM/YYYY");
    },
    login() {
      Axios.post(this.$store.getters.getAPI.url + "/user/login", this.model)
        .then((res) => {
          var auth = JSON.stringify(res.data);
          localStorage.setItem("auth-data", auth);
          this.$store.commit("setData", res.data);
          this.$notify({
            message: "Welcome to <b>IPC IEMS Platform</b>",
            timeout: 5000,
            icon: "ni ni-bell-55",
            type: "success",
          });
          // return this.$router.push("/ISPU/ISPUDashboard").catch(() => {});
        })
        .catch((err) => {
          this.$notify({
            message: "Invalid Email or Password",
            timeout: 5000,
            icon: "ni ni-bell-55",
            type: "warning",
          });
        });
      // this will be called only after form is valid. You can do api call here to login
    },
  },
  beforeMount() {
    this.$store.commit("setAuthLayoutButton", {
      name: "Kembali",
      path: "/home",
    });
  },
  created() {
    const forceUpdateData = JSON.parse(localStorage.getItem('forceUpdate'))
    if (forceUpdateData && Object.keys(forceUpdateData).length && forceUpdateData.show) {
      this.isShowModalForceUpdate = true;
      this.forceUpdateData = forceUpdateData;
      const sensors = forceUpdateData.data.sensor.map((sensor) => {
        return {
          ...sensor,
          tanggalKalibrasi: Moment.unix(sensor.tanggalKalibrasi).format("DD-MM-YYYY")
        }
      })
      this.form.sensor = sensors
      this.form.umum.compPermohonanKoneksi = forceUpdateData.data.umum.compPermohonanKoneksi
      this.form.prosesProduksi.debitPenggunaan.satuan = forceUpdateData.data.sensor.find((data) => data.label === 'Debit').satuanDebit
    }
    this.getList();
    // this.generateData();
  },
};
</script>

<style lang="scss">
#daftar {
  .input-note {
    font-size: 0.75rem;
    margin-top: -1rem;
  }
  .file-upload-animation {
    position: absolute;
    top: 12px;
    right: 100px;
    z-index: 1;
  }
  .file-upload-done {
    position: absolute;
    top: 16px;
    right: 104px;
    z-index: 1;
  }
}
</style>
