<template>
  <div>
    <!-- Page content -->
    <div id="daftar" class="container pt-8 mb-4">
      <div class="row">
        <div class="col-12">
          <div class="card bg-white border-0">
            <div class="p-4">
              <h2 class="text-justify">PELAPORAN KENDALA PANDEMI COVID-19</h2>
              <p class="mb-2 text-justify">
                Pelaporan Kendala PANDEMI COVID-19 hanya dapat diisi khusus
                untuk Penanggung jawab usaha dan/atau kegiatan yang
                <b>
                  mengalami kendala pemasangan dan pengoperasian SPARING
                  dikarenakan Pandemi COVID-19 </b
                >, maka wajib memenuhi ketentuan sesuai Surat Edaran Menteri
                Lingkungan Hidup Nomor SE.5/Menlhk/Setjen/KUM.1/6/2020 tentang
                Protokol Pelaksanaan Pemantauan dan Pelaporan Kualitas
                Lingkungan Pada Masa Pandemi COVID-19.
              </p>
              <p>Ketentuan dalam SE. 5/Menlhk/Setjen/KUM.1/6/2020 yaitu:</p>
              <ol>
                <li>
                  Sudah melaksanakan ketentuan Pasal 2 Peraturan Menteri
                  Lingkungan Hidup Nomor P.93/MENLHK/SETJEN/KUM.1/8/2018 tentang
                  Pemantauan Kualitas Air Limbah Secara Terus Menerus Dan Dalam
                  Jaringan Bagi Usaha Dan/Atau Kegiatan jo Peraturan Menteri
                  Lingkungan Hidup Nomor P.80/MENLHK/SETJEN/KUM.1/10/2019 dengan
                  menyampaikan bukti pengadaan SPARING (dokumen tender)
                </li>
                <li>
                  Bagi perusahaan yang sudah selesai melaksanakan pengadaan
                  SPARING tetapi terkendala dalam pemasangan SPARING wajib
                  menyampaikan: bukti pemenang dan jadwal pemasangan SPARING
                </li>
                <li>
                  Bagi perusahaan yang sudah memasang SPARING tetapi belum
                  mengoperasikan SPARING wajib menyampaikan bukti berupa:
                  instalasi SPARING (foto instalasi, foto alat sensor, dokumen
                  pemasangan), rencana masa uji coba/commissioning, rencana
                  pengoperasian SPARING
                </li>
                <li>
                  Bukti sebagaimana dimaksud dalam angka 1-3 dan peraturan
                  pemberlakuan Pembatasan Sosial Berskala Besar (PSBB) setiap
                  daerah disampaikan kepada Kementerian Lingkungan Hidup dan
                  Kehutanan Up. Direktur Jenderal Pengendalian Pencemarandan
                  Kerusakan Lingkungan, JL. D.I Panjaitan Kav.24 Kebon Nanas
                  Jakarta Timur, Gedung B lantai 4.
                </li>
              </ol>
              <p>
                Surat dan bukti sebagaimana angka 4 dapat di unggah/upload
                melalui fitur Pelaporan Kendala PANDEMI COVID-19. Penanggung
                jawab usaha dan/atau kegiatan yang terkendala pandemi COVID-19
                dapat mendapatkan USER NAME, PASSWORD, UID (User Identification)
                setelah menyelesaikan pemasangan dan pengoperasian, kemudian
                melaksanakan pendaftaran di fitur pendaftaran laman
                <a href="http://sparing.ppkl.menlhk.go.id"
                  >http://sparing.ppkl.menlhk.go.id</a
                >.
              </p>
              <br />
              <span>
                Tim SPARING<br />
                Direktorat Pengendalian Pencemaran air<br />
                JL.DI Panjaitan Kav. 24 Kebon Nanas Jakarta Timur<br />
                Gedung B lantai 5<br />
                Email: sparing.menlhk@gmail.com<br />
                Fathia Rizki 0813 10837646 ( hanya melayani via pesan WA/SMS,
                jam pelayanan hari kerja 08.00-15.00 WIB)<br />
              </span>
            </div>
          </div>
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
                <h2 class="text-justify">
                  EDIT PELAPORAN KENDALA PANDEMI COVID-19
                </h2>
                <div class="form-group row">
                  <label class="col-lg-2 col-form-label form-control-label"
                    >Masukkan ID Pendaftaran</label
                  >
                  <div class="col-8">
                    <base-input
                      name="ID Pendaftaran"
                      rules
                      v-model="editID"
                    ></base-input>
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
            <div class="card">
              <div class="card-header">
                Upload Bukti Pemasangan SPARING Terkait COVID-19
              </div>
              <div class="card-body">
                <validation-observer ref="formValidator">
                  <form>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Nama Perusahaan</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Nama Perusahaan"
                          rules="required"
                          v-model="form.bukti.detail.compName"
                        ></base-input>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Jenis Industri</label
                      >
                      <div class="col-lg-10">
                        <base-input name="Jenis Industri" rules="required">
                          <el-select v-model="form.bukti.detail.compType">
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
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Alamat Perusahaan</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Alamat Perusahaan"
                          rules="required"
                          v-model="form.bukti.detail.compAddress"
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
                            v-model="form.bukti.detail.compProvince"
                            @change="getKabkot(form.bukti.detail.compProvince)"
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
                          <el-select v-model="form.bukti.detail.compCity" filterable>
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
                          v-model="form.bukti.detail.compPhone"
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
                          v-model="form.bukti.detail.compMail"
                          type="email"
                          autocomplete="username email"
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-lg-2 col-form-label form-control-label"
                        >Kontak Personal Sparing</label
                      >
                      <div class="col-lg-10">
                        <base-input
                          name="Kontak Personal Sparing"
                          rules="required"
                          v-model="form.bukti.detail.compCP"
                        ></base-input>
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
                          v-model="form.bukti.detail.personPhone"
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
                          v-model="form.bukti.detail.personMail"
                          type="email"
                          autocomplete="username email"
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-2 col-form-label form-control-label"
                        >Tahapan Pemasangan SPARING</label
                      >
                      <div class="col-lg-10">
                        <base-input name="Tahapan Pemasangan SPARING" rules="required">
                          <el-select
                            class="w-100"
                            v-model="form.bukti.detail.tahap"
                          >
                            <el-option
                              v-for="option in selects.options.tahap"
                              :key="option.label"
                              :label="option.label"
                              :value="option.value"
                            />
                          </el-select>
                        </base-input>
                        <small class="d-block mt--3 text-justify">
                          <strong>Tender</strong>, belum ada pemenang tender dan
                          jadwal pemasangan, belum terpasang
                          <br />
                          <strong>Pemasangan</strong>, sudah ada pemenang tender
                          dan jadwal pemasangan, belum terpasang
                          <br />
                          <strong>Pengoperasian</strong>, sudah terpasang
                        </small>
                      </div>
                    </div>
                    <template>
                      <div class="form-group row">
                        <label class="col-2 col-form-label form-control-label"
                          >Bukti Pengadaan Sparing (Dokumen Tender)</label
                        >
                        <div class="col-lg-10">
                          <base-input
                            name="Bukti Pengadaan Sparing"
                            :rules="isEditData === 2 ? '': 'required'">
                            <file-input
                              :disabled="uploading"
                              accept="application/pdf"
                              ref="fileTender"
                              @change="uploadFile('bukti', 'fileTender')"
                            ></file-input>
                          <base-progress
                            v-if="form.bukti.fileTender.upload >= 1"
                            class="mb-0"
                            :type="
                              form.bukti.fileTender.progress >= 100
                                ? 'green'
                                : 'orange'
                            "
                            :value="form.bukti.fileTender.progress"
                          ></base-progress>
                          <hour-glass
                            v-if="form.bukti.fileTender.upload == 1"
                            class="file-upload-animation"
                            size="24px"
                          ></hour-glass>
                          <span v-if="form.bukti.fileTender.upload == 2">
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
                            v-if="form.bukti.fileTender.upload == 2 || form.bukti.fileTender.path"
                            class="d-block mt--3 text-justify">
                            <a :href="form.bukti.fileTender.path" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                          </small>
                        </div>
                      </div>
                    </template>
                    <template v-if="form.bukti.detail.tahap === 'Pemasangan'">
                      <div class="form-group row">
                        <label class="col-2 col-form-label form-control-label"
                          >Pemenang Sparing</label
                        >
                        <div class="col-lg-10">
                          <base-input
                            name="Pemenang Sparing"
                            :rules="isEditData === 2 ? '': 'required'">
                            <file-input
                              :disabled="uploading"
                              accept="application/pdf"
                              ref="fileVendor"
                              @change="uploadFile('bukti', 'fileVendor')"
                            ></file-input>
                            <base-progress
                              v-if="form.bukti.fileVendor.upload >= 1"
                              class="mb-0"
                              :type="
                                form.bukti.fileVendor.progress >= 100
                                  ? 'green'
                                  : 'orange'
                              "
                              :value="form.bukti.fileVendor.progress"
                            ></base-progress>
                            <hour-glass
                              v-if="form.bukti.fileVendor.upload == 1"
                              class="file-upload-animation"
                              size="24px"
                            ></hour-glass>
                            <span v-if="form.bukti.fileVendor.upload == 2">
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
                            v-if="form.bukti.fileVendor.upload == 2 || form.bukti.fileVendor.path"
                            class="d-block mt--3 text-justify">
                            <a :href="form.bukti.fileVendor.path" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                          </small>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label class="col-2 col-form-label form-control-label"
                          >Jadwal Pemasangan Sparing</label
                        >
                        <div class="col-lg-10">
                          <base-input
                            name="Jadwal Pemasangan Sparing"
                            :rules="isEditData === 2 ? '': 'required'">
                            <file-input
                              :disabled="uploading"
                              accept="application/pdf"
                              ref="fileJadwal"
                              @change="uploadFile('bukti', 'fileJadwal')"
                            ></file-input>
                            <base-progress
                              v-if="form.bukti.fileJadwal.upload >= 1"
                              class="mb-0"
                              :type="
                                form.bukti.fileJadwal.progress >= 100
                                  ? 'green'
                                  : 'orange'
                              "
                              :value="form.bukti.fileJadwal.progress"
                            ></base-progress>
                            <hour-glass
                              v-if="form.bukti.fileJadwal.upload == 1"
                              class="file-upload-animation"
                              size="24px"
                            ></hour-glass>
                            <span v-if="form.bukti.fileJadwal.upload == 2">
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
                            v-if="form.bukti.fileJadwal.upload == 2 || form.bukti.fileJadwal.path"
                            class="d-block mt--3 text-justify">
                            <a :href="form.bukti.fileJadwal.path" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                          </small>
                        </div>
                      </div>
                    </template>
                    <template
                      v-if="form.bukti.detail.tahap === 'Pengoperasian'"
                    >
                      <div class="form-group row">
                        <label class="col-2 col-form-label form-control-label"
                          >Foto Instalasi</label
                        >
                        <div class="col-lg-10">
                          <base-input
                            name="Foto Instalasi"
                            :rules="isEditData === 2 ? '': 'required'">
                            <file-input
                              :disabled="uploading"
                              accept="image/x-png, image/jpeg"
                              ref="photoPemasangan"
                              @change="uploadFile('bukti', 'photoPemasangan')"
                            ></file-input>
                            <base-progress
                              v-if="form.bukti.photoPemasangan.upload >= 1"
                              class="mb-0"
                              :type="
                                form.bukti.photoPemasangan.progress >= 100
                                  ? 'green'
                                  : 'orange'
                              "
                              :value="form.bukti.photoPemasangan.progress"
                            ></base-progress>
                            <hour-glass
                              v-if="form.bukti.photoPemasangan.upload == 1"
                              class="file-upload-animation"
                              size="24px"
                            ></hour-glass>
                            <span v-if="form.bukti.photoPemasangan.upload == 2">
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
                            v-if="form.bukti.photoPemasangan.upload == 2 || form.bukti.photoPemasangan.path"
                            class="d-block mt--3 text-justify">
                            <a :href="form.bukti.photoPemasangan.path" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                          </small>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label class="col-2 col-form-label form-control-label"
                          >Foto Sparing</label
                        >
                        <div class="col-lg-10">
                          <base-input
                            name="Foto Sparing"
                            :rules="isEditData === 2 ? '': 'required'">
                            <file-input
                              :disabled="uploading"
                              accept="image/x-png, image/jpeg"
                              ref="photoSPARING"
                              @change="uploadFile('bukti', 'photoSPARING')"
                            ></file-input>
                            <base-progress
                              v-if="form.bukti.photoSPARING.upload >= 1"
                              class="mb-0"
                              :type="
                                form.bukti.photoSPARING.progress >= 100
                                  ? 'green'
                                  : 'orange'
                              "
                              :value="form.bukti.photoSPARING.progress"
                            ></base-progress>
                            <hour-glass
                              v-if="form.bukti.photoSPARING.upload == 1"
                              class="file-upload-animation"
                              size="24px"
                            ></hour-glass>
                            <span v-if="form.bukti.photoSPARING.upload == 2">
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
                            v-if="form.bukti.photoSPARING.upload == 2 || form.bukti.photoSPARING.path"
                            class="d-block mt--3 text-justify">
                            <a :href="form.bukti.photoSPARING.path" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                          </small>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label class="col-2 col-form-label form-control-label"
                          >Dokumen Pemasangan</label
                        >
                        <div class="col-lg-10">
                          <base-input
                            name="Dokumen Pemasangan"
                            :rules="isEditData === 2 ? '': 'required'">
                            <file-input
                              :disabled="uploading"
                              accept="application/pdf"
                              ref="filePemasangan"
                              @change="uploadFile('bukti', 'filePemasangan')"
                            ></file-input>
                            <base-progress
                              v-if="form.bukti.filePemasangan.upload >= 1"
                              class="mb-0"
                              :type="
                                form.bukti.filePemasangan.progress >= 100
                                  ? 'green'
                                  : 'orange'
                              "
                              :value="form.bukti.filePemasangan.progress"
                            ></base-progress>
                            <hour-glass
                              v-if="form.bukti.filePemasangan.upload == 1"
                              class="file-upload-animation"
                              size="24px"
                            ></hour-glass>
                            <span v-if="form.bukti.filePemasangan.upload == 2">
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
                            v-if="form.bukti.filePemasangan.upload == 2 || form.bukti.filePemasangan.path"
                            class="d-block mt--3 text-justify">
                            <a :href="form.bukti.filePemasangan.path" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                          </small>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label class="col-2 col-form-label form-control-label"
                          >Perencanaan Masa Uji / Commisioning</label
                        >
                        <div class="col-lg-10">
                          <base-input
                            name="Perencanaan Masa Uji / Commisioning"
                            :rules="isEditData === 2 ? '': 'required'">
                            <file-input
                              :disabled="uploading"
                              accept="application/pdf"
                              ref="fileCommission"
                              @change="uploadFile('bukti', 'fileCommission')"
                            ></file-input>
                            <base-progress
                              v-if="form.bukti.fileCommission.upload >= 1"
                              class="mb-0"
                              :type="
                                form.bukti.fileCommission.progress >= 100
                                  ? 'green'
                                  : 'orange'
                              "
                              :value="form.bukti.fileCommission.progress"
                            ></base-progress>
                            <hour-glass
                              v-if="form.bukti.fileCommission.upload == 1"
                              class="file-upload-animation"
                              size="24px"
                            ></hour-glass>
                            <span v-if="form.bukti.fileCommission.upload == 2">
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
                            v-if="form.bukti.fileCommission.upload == 2 || form.bukti.fileCommission.path"
                            class="d-block mt--3 text-justify">
                            <a :href="form.bukti.fileCommission.path" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                          </small>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label class="col-2 col-form-label form-control-label"
                          >Rencana Pengoperasian Sparing</label
                        >
                        <div class="col-lg-10">
                          <base-input
                            name="Rencana Pengoperasian Sparing"
                            :rules="isEditData === 2 ? '': 'required'">
                            <file-input
                              :disabled="uploading"
                              accept="application/pdf"
                              ref="filePengoperasion"
                              @change="uploadFile('bukti', 'filePengoperasion')"
                            ></file-input>
                            <base-progress
                              v-if="form.bukti.filePengoperasion.upload >= 1"
                              class="mb-0"
                              :type="
                                form.bukti.filePengoperasion.progress >= 100
                                  ? 'green'
                                  : 'orange'
                              "
                              :value="form.bukti.filePengoperasion.progress"
                            ></base-progress>
                            <hour-glass
                              v-if="form.bukti.filePengoperasion.upload == 1"
                              class="file-upload-animation"
                              size="24px"
                            ></hour-glass>
                            <span v-if="form.bukti.filePengoperasion.upload == 2">
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
                            v-if="form.bukti.filePengoperasion.upload == 2 || form.bukti.filePengoperasion.path"
                            class="d-block mt--3 text-justify">
                            <a :href="form.bukti.filePengoperasion.path" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
                          </small>
                        </div>
                      </div>
                    </template>
                  </form>
                  <div class="row">
                    <div class="col-10"></div>
                    <div v-if="!edit" class="col-2">
                      <base-button
                        class="w-100"
                        size="md"
                        type="primary"
                        @click="checkFormRegister"
                        >Simpan</base-button
                      >
                    </div>
                    <div v-if="edit" class="col-2">
                      <base-button
                        class="w-100"
                        size="md"
                        type="primary"
                        @click="checkFormUpdate"
                        >Ubah</base-button
                      >
                    </div>
                  </div>
                </validation-observer>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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

export default {
  components: {
    HourGlass,
    FileInput,
    BaseInput,
    flatPicker,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {
      isEditData: 0,
      uploading: false,
      isDataCorrect: true,
      res: { comp: null, user: null, logger: null },
      temptSelect: null,
      form: {
        tahap: 0,
        bukti: {
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
      },
      selects: {
        configs: {
          flatpickr: {
            allowInput: true,
            dateFormat: "d/m/Y",
            mode: "single",
          },
        },
        options: {
          tahap: [
            {
              label: "Tender",
              value: "Tender",
            },
            {
              label: "Pemasangan",
              value: "Pemasangan",
            },
            {
              label: "Pengoperasian",
              value: "Pengoperasian",
            },
          ],
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
      edit: false,
      editID: "",
      tempSelect: null,
    };
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
    async checkFormRegister() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (!tempValidate) {
        this.errorSwal("TOLONG LENGKAPI DATA ANDA!!!!!");
      } else {
        this.confirmSwal();
      }
    },
    async checkFormUpdate() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (!tempValidate) {
        this.errorSwal("TOLONG LENGKAPI DATA ANDA!!!!!");
      } else {
        this.confirmUpdateSwal();
      }
    },
    getDatatoEdit() {
      Axios.get(`${defaults.baseURL}/covid/${this.editID}`).then(
        (res) => {
          // console.log(res.data);
          this.form.bukti = res.data;
          this.edit = true;
        }
      );
    },
    uploadFile(category, field) {
      this.uploading = true;
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
          this.form[category][field].path = `${defaults.baseURL}${res.data.path}`;
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
      this.form.sensor[index].brosurFile.upload = 1;
      let formData = new FormData();
      formData.append("picture", this.$refs.brosurFile[index].files[0]);
      Axios.post(`${defaults.baseURL}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          this.form.sensor[index].brosurFile.upload = 2;
          this.form.sensor[index].brosurFile.path = `${defaults.baseURL}${res.data.path}`;
        })
        .catch((err) => {
          console.log(err);
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
        timer: 1500,
      });
    },
    confirmSwal() {
      swal
        .fire({
          title: "Apakah Data Sudah Benar?",
          text: "Apakah Data Sudah Benar?!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Simpan",
          reverseButtons: true,
        })
        .then((result) => {
          this.registerHandler();
        });
    },
    confirmUpdateSwal() {
      swal
        .fire({
          title: "Apakah Data Sudah Benar?",
          text: "Apakah Data Sudah Benar?!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Simpan",
          reverseButtons: true,
        })
        .then((result) => {
          this.updateHandler();
        });
    },
    updateHandler() {
      Axios.put(`${defaults.baseURL}/covid`, this.form.bukti)
        .then((res) => {
          swal.fire("Tersimpan", "Data anda telah terupdate", "success")
          .then(() => {
            this.$router.push("/");
            this.form = {}
          });
        })
        .catch((err) => {
          this.errorSwal("Terjadi Error pada data!");
        });
    },
    registerHandler() {
      Axios.post(`${defaults.baseURL}/covid`, this.form.bukti)
        .then((res) => {
          swal.fire(
            "Tersimpan",
            "Data anda telah terregister dengan ID Pendaftaran: " +
              res.data._id,
            "success"
          ).then(() => {
            this.$router.push("/");
            this.form = {}
          });
        })
        .catch((err) => {
          this.errorSwal("Terjadi Error pada data!");
        });
    },

    changeUmumPermitFile(files) {
      this.form.umum.permitFile = files;
    },
    changeValiditasKinerja(files) {
      this.form.validitas.kinerja = files;
    },
    changeValiditasKonektifitas(files) {
      this.form.validitas.konektifitas = files;
    },
    changeValiditasKalibrasi(files) {
      this.form.validitas.kalibrasi = files;
    },
    changeValiditas(files) {
      this.form.validitas.validitas = files;
    },
    getKabkot(data) {
      const list = this.tempSelect.kabkotList;
      const filterList = list.filter((l) => l.provID === data);
      this.selects.options.city = filterList;
      this.form.bukti.detail.compCity = null;
      // this.form.user.userRole.kabkotID = null;
      // this.form.user.userRole.compID = null;
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
