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
        <h4 class="text-default m-0">Detail Pendaftar</h4>
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
                <h3 class="mb-0">Akun</h3>
                <base-button
                  size="sm"
                  v-if="info.validated"
                  type="primary"
                  @click="showTTE"
                  >Lembar TTE</base-button
                >
              </div>

              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Nama Kontak Person</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.akun.personName }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Nomor Handphone</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.akun.personPhone }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Email Kontak Person</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.akun.personMail }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Password Akun</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.akun.personPassword }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div id="umum" class="card">
              <div class="card-header">
                <h3 class="mb-0">Umum</h3>
              </div>
              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Nama Perusahaan</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.umum.compName }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>ID Pendaftaran</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info._id }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Jenis Industri</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.umum.compType }}</span>
                  </div>
                </div>

                <div
                  v-if="
                    info.umum.compType === 'Pertambangan Emas dan Tembaga' ||
                    info.umum.compType === 'Pertambangan Batu Bara' ||
                    info.umum.compType === 'Pertambangan Nikel'
                  "
                >
                  <!-- <div class="col-12">
                    <h4>Detail {{ info.umum.compType }}</h4>
                  </div> -->
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Status Tambang</strong>
                    </div>
                    <div class="col-lg-10">
                      <span>{{ info.umum.ifTambang.status }}</span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Jenis Kegiatan</strong>
                    </div>
                    <div class="col-lg-10">
                      <span>{{ info.umum.ifTambang.jenKegiatan }}</span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Rencana penetapan titik penaatan</strong>
                    </div>
                    <div class="col-lg-10">
                      <a
                        :href="
                          info.umum.rencanaFile.path
                            ? `${baseURL}/${info.umum.rencanaFile.path}`
                            : ''
                        "
                        target="blank"
                      >
                        <span>
                          <i class="ni ni-cloud-download-95 text-primary"></i>
                        </span>
                        <span>{{
                          info.umum.rencanaFile.path === "" ||
                          info.umum.rencanaFile.path === undefined ||
                          info.umum.rencanaFile.path === null
                            ? " Belum ada  File Terupload"
                            : " File Terupload"
                        }}</span>
                      </a>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong
                        >Kondisi jaringan internet/GSM pada lokasi remote
                        area</strong
                      >
                    </div>
                    <div class="col-lg-10">
                      <span v-html="info.umum.ifTambang.kondisiInternet"></span>
                    </div>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Nama Penanggung Jawab SIUP</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.umum.nameSIUP }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Lampiran SIUP</strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="
                        info.umum.siupFile.path
                          ? `${baseURL}/${info.umum.siupFile.path}`
                          : ''
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.umum.siupFile.path === "" ||
                        info.umum.siupFile.path === undefined ||
                        info.umum.siupFile.path === null
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Surat Permohonan Koneksi</strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="
                        info.umum.compPermohonanKoneksi && info.umum.compPermohonanKoneksi.path
                          ? `${baseURL}/${info.umum.compPermohonanKoneksi && info.umum.compPermohonanKoneksi.path}`
                          : ''
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.umum.compPermohonanKoneksi && info.umum.compPermohonanKoneksi.path === "" ||
                        info.umum.compPermohonanKoneksi && info.umum.compPermohonanKoneksi.path === undefined ||
                        info.umum.compPermohonanKoneksi && info.umum.compPermohonanKoneksi.path === null
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Alamat Perusahaan</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.umum.compAddress }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Jalan</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.umum.compStreet }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Kabupaten / Kota</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.umum.compCityName }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Provinsi</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.umum.compProvinceName }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Telepon Kantor</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.umum.compPhone }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Email Kantor</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.umum.compMail }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Khusus Industri Yang Memanfaatkan air limbah 100% ke proses produksi -->
            <div
              class="card"
              v-if="
                info.prosesProduksi != null &&
                info.prosesProduksi.debitPenggunaan.value != null
              "
            >
              <div class="card-header">
                <h3 class="m-0">
                  Khusus Industri Yang Memanfaatkan air limbah 100% ke proses
                  produksi
                </h3>
              </div>
              <div class="card-body">
                <template>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Debit penggunaan air</strong>
                    </div>
                    <div class="col-lg-10">
                      <template>
                        <div class="row mb-2">
                          <div class="col-2">
                            <strong>m3/hari</strong>
                          </div>
                          <div class="col-10">
                            {{ info.prosesProduksi.debitPenggunaan.value }}
                          </div>
                        </div>
                        <div class="row mb-2">
                          <div class="col-2">
                            <strong
                              >Keterangan (Proses dan Teknologi yang digunakan)
                            </strong>
                          </div>
                          <div class="col-10">
                            {{ info.prosesProduksi.debitPenggunaan.keterangan }}
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Debit air limbah Total</strong>
                    </div>
                    <div class="col-lg-10">
                      <template>
                        <div class="row mb-2">
                          <div class="col-2">
                            <strong>m3/hari</strong>
                          </div>
                          <div class="col-10">
                            {{ info.prosesProduksi.debitLimbahTotal.value }}
                          </div>
                        </div>
                        <div class="row mb-2">
                          <div class="col-2">
                            <strong
                              >Keterangan (Proses dan Teknologi yang digunakan)
                            </strong>
                          </div>
                          <div class="col-10">
                            {{
                              info.prosesProduksi.debitLimbahTotal.keterangan
                            }}
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Debit air reuse</strong>
                    </div>
                    <div class="col-lg-10">
                      <template>
                        <div class="row mb-2">
                          <div class="col-2">
                            <strong>m3/hari</strong>
                          </div>
                          <div class="col-10">
                            {{ info.prosesProduksi.debitReuse.value }}
                          </div>
                        </div>
                        <div class="row mb-2">
                          <div class="col-2">
                            <strong
                              >Keterangan (Proses dan Teknologi yang digunakan)
                            </strong>
                          </div>
                          <div class="col-10">
                            {{ info.prosesProduksi.debitReuse.keterangan }}
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Debit air recycle</strong>
                    </div>
                    <div class="col-lg-10">
                      <template>
                        <div class="row mb-2">
                          <div class="col-2">
                            <strong>m3/hari</strong>
                          </div>
                          <div class="col-10">
                            {{ info.prosesProduksi.debitRecycle.value }}
                          </div>
                        </div>
                        <div class="row mb-2">
                          <div class="col-2">
                            <strong
                              >Keterangan (Proses dan Teknologi yang digunakan)
                            </strong>
                          </div>
                          <div class="col-10">
                            {{ info.prosesProduksi.debitRecycle.keterangan }}
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Debit air recovery</strong>
                    </div>
                    <div class="col-lg-10">
                      <template>
                        <div class="row mb-2">
                          <div class="col-2">
                            <strong>m3/hari</strong>
                          </div>
                          <div class="col-10">
                            {{ info.prosesProduksi.debitRecovery.value }}
                          </div>
                        </div>
                        <div class="row mb-2">
                          <div class="col-2">
                            <strong
                              >Keterangan (Proses dan Teknologi yang digunakan)
                            </strong>
                          </div>
                          <div class="col-10">
                            {{ info.prosesProduksi.debitRecovery.keterangan }}
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Debit air limbah diolah IPAL</strong>
                    </div>
                    <div class="col-lg-10">
                      <template>
                        <div class="row mb-2">
                          <div class="col-2">
                            <strong>m3/hari</strong>
                          </div>
                          <div class="col-10">
                            {{ info.prosesProduksi.debitOlahIPAL.value }}
                          </div>
                        </div>
                        <div class="row mb-2">
                          <div class="col-2">
                            <strong
                              >Keterangan (Proses dan Teknologi yang digunakan)
                            </strong>
                          </div>
                          <div class="col-10">
                            {{ info.prosesProduksi.debitOlahIPAL.keterangan }}
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Lampiran neraca air dan neraca air limbah</strong>
                    </div>
                    <div class="col-lg-10">
                      <a
                        :href="
                          info.prosesProduksi.fileNeracaAirLimbah.path
                          ? `${baseURL}${info.prosesProduksi.fileNeracaAirLimbah.path}`
                            : ''
                        "
                        target="blank"
                      >
                        <span>
                          <i class="ni ni-cloud-download-95 text-primary"></i>
                        </span>
                        <span>{{
                          info.prosesProduksi.fileNeracaAirLimbah.path === "" ||
                          info.prosesProduksi.fileNeracaAirLimbah.path ===
                            undefined ||
                          info.prosesProduksi.fileNeracaAirLimbah.path === null
                            ? " Belum ada  File Terupload"
                            : " File Terupload"
                        }}</span>
                      </a>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- end khusus industri air limbah -->
            <div
              id="teknis"
              class="card"
              v-if="info.prosesProduksi.debitLimbahTotal.value == null"
            >
              <div class="card-header">
                <h3 class="mb-0">Identifikasi Sumber Pencemaran</h3>
              </div>
              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Izin Pembuangan Air Limbah ke Media Air</strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="
                        info.teknis.permitFile.path
                          ? `${baseURL}/${info.teknis.permitFile.path}`
                          : ''
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.teknis.permitFile.path === "" ||
                        info.teknis.permitFile.path === undefined ||
                        info.teknis.permitFile.path === null
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Pejabat Penerbit Izin</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.teknis.permitPerson }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong
                      >Nomor Izin Pembuangan Air Limbah (Definitif)</strong
                    >
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.teknis.permitNumber }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Tanggal Izin Terbit</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ formatDate(info.teknis.permitDatePublish) }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Berlaku sampai</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ formatDate(info.teknis.permitDateExpire) }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Sumber Air Limbah</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.teknis.wasteSource }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Jumlah Titik Penaatan</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.teknis.spotCount }}</span>
                  </div>
                </div>
                <div
                  v-for="(spot, index) in info.teknis.spotList"
                  :key="spot.spotName"
                >
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Nama Badan Air Penerima Air Limbah {{ index + 1 }}</strong>
                    </div>
                    <div class="col-lg-10">
                      <span>{{ spot.penerimaAirLimbah }}</span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Nama Titik Penaatan {{ index + 1 }}</strong>
                    </div>
                    <div class="col-lg-10">
                      <span>{{ spot.spotName }}</span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Lintang</strong>
                    </div>
                    <div class="col-lg-10">
                      <span>{{ spot.spotLoc[0] }}</span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Bujur</strong>
                    </div>
                    <div class="col-lg-10">
                      <span>{{ spot.spotLoc[1] }}</span>
                    </div>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Jenis Teknologi Pengolahan Air Limbah</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.teknis.processingTechnique }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Jenis Air Limbah</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.teknis.wasteType }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Debit</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.teknis.debit }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Kapasitas Produksi Sesuai Izin</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.teknis.capacityPermit }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Kapasitas Produksi Senyatanya</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.teknis.capacityActual }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="card"
              v-if="info.prosesProduksi.debitLimbahTotal.value == null"
            >
              <div class="card-header">
                <h3 class="m-0">Frekuensi Pembuangan Air Limbah</h3>
              </div>

              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Frekuensi Pembuangan Air Limbah</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>
                      {{ info.teknis.frequenceDet }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="info.teknis.frequenceDet === 'Tidak Rutin/Intermiten'"
                >
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Latar Belakang</strong>
                    </div>
                    <div class="col-lg-10">
                      <span v-html="info.frekuensi.latarBelakang"></span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Detail Engineering IPAL</strong>
                    </div>
                    <div class="col-lg-10">
                      <span v-html="info.frekuensi.detEngIPAL"></span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Foto IPAL</strong>
                    </div>
                    <div class="col-lg-10">
                      <a
                        :href="
                          info.frekuensi.fotoIPAL.path
                            ? `${baseURL}/${info.frekuensi.fotoIPAL.path}`
                            : ''
                        "
                        target="blank"
                      >
                        <span>
                          <i class="ni ni-cloud-download-95 text-primary"></i>
                        </span>
                        <span>{{
                          info.frekuensi.fotoIPAL.path === "" ||
                          info.frekuensi.fotoIPAL.path === undefined ||
                          info.frekuensi.fotoIPAL.path === null
                            ? " Belum ada  File Terupload"
                            : " File Terupload"
                        }}</span>
                      </a>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Metode Pengukuran Debit</strong>
                    </div>
                    <div class="col-lg-10">
                      <span v-html="info.frekuensi.metUkurDebit"></span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Logbook Pembuangan Air Limbah</strong>
                    </div>
                    <div class="col-lg-10">
                      <a
                        :href="
                          info.frekuensi.logBook.path
                            ? `${baseURL}/${info.frekuensi.logBook.path}`
                          : ''
                        "
                        target="blank"
                      >
                        <span>
                          <i class="ni ni-cloud-download-95 text-primary"></i>
                        </span>
                        <span>{{
                          info.frekuensi.logBook.path === "" ||
                          info.frekuensi.logBook.path === undefined ||
                          info.frekuensi.logBook.path === null
                            ? " Belum ada  File Terupload"
                            : " File Terupload"
                        }}</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Per hari</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.frekuensi.jam + " jam" }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Per minggu</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.frekuensi.hari + " hari" }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Per tahun</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.frekuensi.bulan + " bulan" }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="validitas"
              class="card"
              v-if="info.prosesProduksi.debitLimbahTotal.value == null"
            >
              <div class="card-header">
                <h3 class="m-0">Persyaratan Teknis</h3>
              </div>
              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Lulus Uji Kontektifitas</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.validitas.lulusUji }}</span>
                  </div>
                </div>
                <div
                  v-if="info.validitas.lulusUji === 'Individu'"
                  class="row mb-4"
                >
                  <div class="col-lg-2">
                    <strong>Nomor Surat Lulus Uji Konektivitas</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.validitas.noSurat || "-" }}</span>
                  </div>
                </div>
                <div
                  v-if="info.validitas.lulusUji === 'Individu'"
                  class="row mb-4"
                >
                  <div class="col-lg-2">
                    <strong>Surat Lulus Uji Konektivitas</strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="
                        info.validitas.konektifitasFile.path
                          ? `${baseURL}/${info.validitas.konektifitasFile.path}`
                          : ''
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.validitas.konektifitasFile.path === "" ||
                        info.validitas.konektifitasFile.path === undefined ||
                        info.validitas.konektifitasFile.path === null
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>

                <div
                  v-if="
                    info.validitas.lulusUji ===
                    'Penyedia Barang dan Jasa Alat Sparing'
                  "
                  class="row mb-4"
                >
                  <div class="col-lg-2">
                    <strong>Nama Penyedia Barang dan Jasa</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.validitas.namaPenyedia }}</span>
                  </div>
                </div>
                <div
                  v-if="
                    info.validitas.lulusUji ===
                    'Penyedia Barang dan Jasa Alat Sparing'
                  "
                  class="row mb-4"
                >
                  <div class="col-lg-2">
                    <strong>Kontrak Kerjasama</strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="
                        info.validitas.kontrak.path
                          ? `${baseURL}/${info.validitas.kontrak.path}`
                          : ''
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.validitas.kontrak.path === "" ||
                        info.validitas.kontrak.path === undefined ||
                        info.validitas.kontrak.path === null
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Info Alat</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.validitas.infoAlat || "-" }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Lulus Uji Konektivitas</strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="
                        info.validitas.konektifitasFile.path
                          ? `${baseURL}/${info.validitas.konektifitasFile.path}`
                          : ''
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.validitas.konektifitasFile.path === "" ||
                        info.validitas.konektifitasFile.path === undefined ||
                        info.validitas.konektifitasFile.path === null
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Hasil Kalibrasi Saat Awal Pemasangan Alat</strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="
                        info.validitas.kalibrasiFile.path
                          ? `${baseURL}/${info.validitas.kalibrasiFile.path}`
                          : ''
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.validitas.kalibrasiFile.path === "" ||
                        info.validitas.kalibrasiFile.path === undefined ||
                        info.validitas.kalibrasiFile.path === null
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Hasil Kalibrasi Alat Rutin</strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="
                        info.validitas.kalibrasiRutinFile.path
                          ? `${baseURL}/${info.validitas.kalibrasiRutinFile.path}`
                          : ''
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.validitas.kalibrasiRutinFile.path === "" ||
                        info.validitas.kalibrasiRutinFile.path === undefined ||
                        info.validitas.kalibrasiRutinFile.path === null
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>
                      Hasil Uji Kinerja Dari Laboratorium Yang Ditunjuk Oleh
                      KLHK
                    </strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="
                      info.validitas.kinerjaFile.path
                        ? `${baseURL}/${info.validitas.kinerjaFile.path}`
                          : ''
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{ info.validitas.kinerjaFile.label }}</span>
                      <span>{{
                        info.validitas.kinerjaFile.path === "" ||
                        info.validitas.kinerjaFile.path === undefined ||
                        info.validitas.kinerjaFile.path === null
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Surat Dukungan Dari Brand Sensor</strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="
                        info.surat.dukunganBrand.path
                          ? `${baseURL}/${info.surat.dukunganBrand.path}`
                          : ''
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.surat.dukunganBrand.path === "" ||
                        info.surat.dukunganBrand.path === undefined ||
                        info.surat.dukunganBrand.path === null
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Surat Pernyataan</strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="`${baseURL}/${info.surat.pernyataanVendor.path}`
                      "
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.surat.pernyataanVendor.path === "" ||
                        info.surat.pernyataanVendor.path === undefined ||
                        info.surat.pernyataanVendor.path === null
                          ? " Belum ada  File Terupload"
                          : " File Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="card">
              <div class="card-header">
                <h3 class="m-0">Frekuensi Pembuangan Air Limbah</h3>
              </div> -->

            <div
              class="card"
              v-if="info.prosesProduksi.debitLimbahTotal.value == null"
            >
              <div class="card-header">
                <h3 class="m-0">Data Logger</h3>
              </div>
              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Brand</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.logger[0].brand }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Model</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.logger[0].model }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Serial Number</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.logger[0].sn }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>MAC Address</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.logger[0].mac }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="card"
              v-if="info.prosesProduksi.debitLimbahTotal.value == null"
            >
              <div class="card-header">
                <h3 class="m-0">Sensor</h3>
              </div>
              <div class="card-body">
                <div v-for="item in info.sensor" :key="item.name" class="row mb-4">
                  <div class="col-lg-2">
                    <strong>{{ item.label }}</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>
                      {{ item.active ? "Digunakan" : "Tidak digunakan" }}
                    </span>
                    <template v-if="item.active">
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Brand</strong>
                        </div>
                        <div class="col-10">{{ item.brand }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Probe</strong>
                        </div>
                        <div class="col-10">{{ item.probe }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Brosur</strong>
                        </div>
                        <div class="col-10">
                          <a
                            :href="
                            item.brosurFile.path
                              ? `${baseURL}/${item.brosurFile.path}`
                                : ''
                            "
                            target="blank"
                          >
                            <span>
                              <i
                                class="ni ni-cloud-download-95 text-primary"
                              ></i>
                            </span>
                            <span>{{
                              item.brosurFile.path === "" ||
                              item.brosurFile.path === undefined ||
                              item.brosurFile.path === null
                                ? " Belum ada  File Terupload"
                                : " File Terupload"
                            }}</span>
                          </a>
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Range Pengukuran</strong>
                        </div>
                        <div class="col-10">
                          <div class="row">
                            <div class="col-6">
                              <div class="row">
                                <div class="col-12">
                                  <strong>Min</strong>
                                </div>
                                <div class="col-12">
                                  {{ item.minMeasure }}
                                </div>
                              </div>
                            </div>
                            <div class="col-6">
                              <div class="row">
                                <div class="col-12">
                                  <strong>Max</strong>
                                </div>
                                <div class="col-12">
                                  {{ item.maxMeasure }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Baku Mutu Air Limbah</strong>
                        </div>
                        <div v-if="item.name === 'pH'" class="col-10">
                          <div class="row">
                            <div class="col-6">
                              <div class="row">
                                <div class="col-12">
                                  <strong>Min</strong>
                                </div>
                                <div class="col-12">{{ item.min }}</div>
                              </div>
                            </div>
                            <div class="col-6">
                              <div class="row">
                                <div class="col-12">
                                  <strong>Max</strong>
                                </div>
                                <div class="col-12">{{ item.max }}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-else class="col-10">
                          <div class="row">
                            <div class="col-12">
                              <div class="row">
                                <div class="col-12">
                                  <strong>Max</strong>
                                </div>
                                <div class="col-12">
                                  {{ item.max }}
                                  <span v-if="item.name ==='Debit'">{{ item.satuanDebit }}</span>
                                  <span v-else>mg/L</span>
                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Metode Pengukuran Sensor</strong>
                        </div>
                        <div class="col-10">{{ item.metodePengukuran }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Jadwal Kalibrasi</strong>
                        </div>
                        <div class="col-10">{{ item.jadwalKalibrasi }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Tanggal Kalibrasi</strong>
                        </div>
                        <div class="col-10">{{ formatUnixDate(item.tanggalKalibrasi) }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Metode Kalibrasi</strong>
                        </div>
                        <div class="col-10">{{ item.metodeKalibrasi }}</div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div class="row justify-content-end">
              <base-button
                @click="verify(info)"
                class="mx-3 mb-4 btn-validate"
                type="danger">
                {{ info.validated ? "Riwayat Validasi" : "Validasi" }}
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal
      v-if="showVerifyModal"
      :show="showVerifyModal"
      modalContentClasses="zmdl-content"
      modalClasses="modal-dialog-scrollable"
      headerClasses="pb-0"
      @close="showVerifyModal = false"
      size="xl">
      <template v-slot:header>
        <div class="modal-title">
          <p class="mdl-title">Validasi Pendaftaran Sparing</p>
        </div>
      </template>
      <div class="px-4 border-top pt-4">
        <template v-if="!info.validated">
          <div class="form-group row">
            <p class="pl-3 col-form-label form-control-label">{{ verifyCompany }}</p>
            <div class="col-lg-12">
              <html-editor v-model="verifyNote"></html-editor>
            </div>
          </div>
          <div class="mdl-btn-wrap mb-6">
            <button class="mdl-btn mdl-btn-reject" @click="reject">Tolak</button>
            <button class="mdl-btn mdl-btn-accept" @click="accept">Setujui</button>
          </div>
        </template>
        <div>
          <ValidationHistory :data="histories" :is-loading-data="isLoadingData" @on-change-tab="getData" />
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
const axios = require("axios");
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import Modal from "@/components/Modal.vue";
import defaults from "@/util/defaults";
import HtmlEditor from "@/components/Inputs/HtmlEditor";
import moment from "moment";
import ValidationHistory from "@/views/Pages/Pendaftaran/ValidationHistory.vue";

export default {
  components: {
    Modal,
    HtmlEditor,
    ValidationHistory
  },
  data() {
    return {
      isLoadingData: false,
      showVerifyModal: false,
      verifyNote: "",
      verifyId: null,
      verifyCompany: null,
      verifyStatus: null,
      histories: [],
      baseURL: defaults.baseURL,
      prosesProduksi  : null,
      prosesNormal    : null,
      info: {
        akun: {
          personName: null,
          personPhone: null,
          personMail: null,
        },
        umum: {
          compName: null,
          compType: null,
          compAddress: null,
          compStreet: null,
          compCity: null,
          compProvince: null,
          compPhone: null,
          compMail: null,
        },
        prosesProduksi: {
          debitPenggunaan: { value: null, keterangan: null },
          debitLimbahTotal: { value: null, keterangan: null },
          debitReuse: { value: null, keterangan: null },
          debitRecycle: { value: null, keterangan: null },
          debitRecovery: { value: null, keterangan: null },
          debitOlahIPAL: { value: null, keterangan: null },
          fileNeracaAirLimbah: { path: null, upload: null, progress: null },
        },
        teknis: {
          permitFile: {
            label: null,
            path: null,
            upload: 0,
          },
          frequenceDet: null,
          permitPerson: null,
          permitNumber: null,
          permitDatePublish: null,
          permitDateExpire: null,
          wasteSource: null,
          spotCount: null,
          spotName: null,
          spotLocation: [null, null],
          processingTechnique: null,
          wasteType: null,
          debit: null,
          capacityPermit: null,
          capacityActual: null,
          isContinue: false,
        },
        validitas: {
          kinerjaFile: {
            label: null,
            path: null,
            upload: 0,
          },
          konektifitasFile: {
            label: null,
            path: null,
            upload: 0,
          },
          kalibrasiFile: {
            label: null,
            path: null,
            upload: 0,
          },
          validitasFile: {
            label: null,
            path: null,
            upload: 0,
          },
        },
        frekuensi: {
          jam: null,
          hari: null,
          bulan: null,
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
            name: "ph",
            label: "pH",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              label: null,
              path: null,
              upload: 0,
            },
            min: null,
            max: null,
            minMeasure: null,
            maxMeasure: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            metodeKalibrasi: null,
          },
          {
            name: "cod",
            label: "COD",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              label: null,
              path: null,
              upload: 0,
            },
            min: null,
            max: null,
            minMeasure: null,
            maxMeasure: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            metodeKalibrasi: null,
          },
          {
            name: "tss",
            label: "TSS",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              label: null,
              path: null,
              upload: 0,
            },
            min: null,
            max: null,
            minMeasure: null,
            maxMeasure: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            metodeKalibrasi: null,
          },
          {
            name: "nh3n",
            label: "NH3N",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              label: null,
              path: null,
              upload: 0,
            },
            min: null,
            max: null,
            minMeasure: null,
            maxMeasure: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            metodeKalibrasi: null,
          },
          {
            name: "debit",
            label: "Debit",
            active: false,
            brand: null,
            probe: null,
            brosurFile: {
              label: null,
              path: null,
              upload: 0,
            },
            min: null,
            max: null,
            minMeasure: null,
            maxMeasure: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            metodeKalibrasi: null,
          },
        ],
        surat: {
          dukunganBrand: {
            label: null,
            path: null,
            upload: 0,
          },
          pernyataanVendor: {
            label: null,
            path: null,
            upload: 0,
          },
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
    verify(data) {
      this.showVerifyModal = true;
      this.verifyId = data._id;
      this.verifyCompany = data.umum.compName;
      this.getValidationHistory();
    },
    reject() {
      Swal.fire({
        title: 'Apakah anda yakin akan menolak pendaftaran?',
        confirmButtonText: 'Tolak',
        showCancelButton: true,
        cancelButtonText: 'Batal',
        icon: 'question',
      }).then((result) => {
        if (result.isConfirmed) {
          this.verifyStatus = "rejected";
          this.submitData();
        }
      })
    },
    accept() {
      Swal.fire({
        title: 'Apakah anda yakin akan menerima pendaftaran?',
        confirmButtonText: 'Terima',
        showCancelButton: true,
        cancelButtonText: 'Batal',
        icon: 'question',
      }).then((result) => {
        if (result.isConfirmed) {
          this.verifyStatus = "validated";
          this.submitData();
        }
      })
    },
    async submitData() {
      const payload = {
        keterangan: this.verifyNote,
        user_id: JSON.parse(localStorage.getItem("auth-data")).name,
        action: this.verifyStatus
      };
      const response = await axios.put(`${defaults.baseURL}/pendaftaran/validasi/${this.verifyId}`, payload);
      // const response = await axios.put(`${defaults.baseURL}/form/validate-pendaftaran/${this.verifyId}`, payload);
      if (response.status === 200) {
        Swal.fire('Data berhasil disimpan!', '', 'success')
      } else {
        Swal.fire('Data gagal disimpan!', '', 'error')
      }
      this.verifyNote = "";
      this.showVerifyModal = false;
    },
    async getData(type) {
      if (type === 'validasi') this.getValidationHistory();
      if (type === 'perubahanData') this.getChangesData()
      if (type === 'perubahanDokumen') this.getChangesDocument();
    },
    async getValidationHistory() {
      // const { data } = await axios.get(`${defaults.baseURL}/form/list-histori-pendaftaran/${this.verifyId}`);
      try {
        this.isLoadingData = true;
        const { data } = await axios.get(`${defaults.baseURL}/pendaftaran/validasi/${this.verifyId}`);
        const [history] = data;

        if (Object.keys(history)) {
          this.histories = history.histori_pendaftaran.map((v, index) => {
            return {
              no: index + 1,
              companyName: history.compName,
              ...v
            }
          }).sort((a, b) => b.created_time - a.created_time);
        } else {
          this.histories = [];
        }
      } finally {
        this.isLoadingData = false;
      }
    },
    async getChangesData() {
      try {
        this.isLoadingData = true;
        const { data } = await axios.get(`${defaults.baseURL}/pendaftaran/updateHistory/${this.verifyId}`);
        // const { data } = await axios.get(`${defaults.baseURL}/pendaftaran/updateHistory/6361302df73a06f2cc44893b`);
        if (data.length) {
          this.histories = data.map((v, index) => {
            return {
              no: index + 1,
              name: v.formregiscomp.compNameID,
              updatedAt: v.timestamp,
              changes: v.field
            }
          }).sort((a, b) => b.updatedAt - a.updatedAt);
        } else {
          this.histories = [];
      }
      } finally {
        this.isLoadingData = false;
      }
    },
    async getChangesDocument() {
      try {
        this.isLoadingData = true;
        const { data } = await axios.get(`${defaults.baseURL}/form/histori-company/${this.verifyId}`);
        // const { data } = await axios.get(`${defaults.baseURL}/form/histori-company/6361302df73a06f2cc44893b`);
        if ('detail_dokumen' in data) {
          const { detail_dokumen } = data;
          this.histories = detail_dokumen.map((doc, index) => {
          return {
            no: index + 1,
            documentName: doc.nama_dokumen,
            documentType: doc.tipe_dokumen,
            updatedAt: doc.updated_time,
            oldDocument: doc.path,
          }
        })
          .filter((item) => item.documentName)
          .sort((a, b) => b.updatedAt - a.updatedAt);
        } else {
          this.histories = [];
        }
        
      } finally {
        this.isLoadingData = false;
      }
    },
    formatDate(date) {
      if (date && date.includes("T")) {
        return moment(date, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("DD/MM/YYYY");
      }
      return date;
    },
    formatUnixDate(date) {
      if (!date) return "-";
      if (isNaN(date)) return date;
      return moment.unix(date).format("DD/MM/YYYY");
    },
    toListPendaftaran() {
      // this.$router.push("/admin/list/pendaftar");
      this.$router.go(-1);
    },
    showTTE() {
      this.$store.commit("setTTE", this.info._id);
      this.$router.push("/tte");
    },
    validasiHandler() {
      Swal
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
          if(result.isConfirmed){
            axios
            .put(
              `${defaults.baseURL}/form/validate-pendaftaran/${this.info._id}`
            )
            .then((res) => {
              Swal.fire({
                title: "Berhasil",
                text: "Proses validasi berhasil",
                icon: "success",
              });

              this.$router.push("/admin/list/pendaftar");
            })
            .catch((err) => {
              Swal.fire({
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
          }
          else if(result.isDismissed){
            Swal.fire({
                title: "Anda telah membatalkan proses validasi ini",
                text: "Proses validasi berhasil dibatalkan",
                icon: "warning",
            });
          }
          
        });
    },
    
    getInfo() {
      if (this.$store.state.data.admin.pendaftar) {
        this.info = this.$store.state.data.admin.pendaftar;

        if (this.info.prosesProduksi == undefined) {
          var data_old = this.info;
          var datase;
          datase = {
            akun: data_old.akun,
            frekuensi: data_old.frekuensi,
            logger: data_old.logger,
            sensor: data_old.sensor,
            surat: data_old.surat,
            teknis: data_old.teknis,
            umum: data_old.umum,
            validated: data_old.validated,
            validitas: data_old.validitas,
            _id: data_old._id,
            prosesProduksi: {
              debitLimbahTotal: {
                keterangan: null,
                value: null,
              },
              debitOlahIPAL: {
                keterangan: null,
                value: null,
              },
              debitPenggunaan: {
                keterangan: null,
                value: null,
              },
              debitRecovery: {
                keterangan: null,
                value: null,
              },
              debitRecycle: {
                keterangan: null,
                value: null,
              },
              debitReuse: {
                keterangan: null,
                value: null,
              },
              fileNeracaAirLimbah: {
                path: null,
                progress: null,
                upload: null,
              },
            },
          };

          this.info = datase;
        }
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
/* added */
.status {
  border-radius: 10px;
  padding: 5px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0;
}
.status-waiting {
  border: 1.5px solid #F2994A;
  color: #F2994A;
}
.status-rejected {
  border: 1.5px solid #EB5757;
  color: #EB5757;
}
.status-accepted {
  border: 1.5px solid #3D9973;
  color: #3D9973;
}
.search-button {
  display: flex;
  justify-content: space-between;
  margin: 20px;
}
.action-btn {
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 400;
  border: transparent;
  color: #ffffff;
  margin-right: 10px;
  margin-bottom: 10px;
}
.action-btn:focus {
  outline: none;
}
.action-btn-view {
  background-color: #007BFF;
}
.action-btn-edit {
  background-color: #E08315;
}
.action-btn-deactive {
  background-color: #EB5757;
}
.action-btn-verify {
  background-color: #495057;
}
.mdl-title {
  font-size: 18px;
  font-weight: 600;
  color: #6C757D;
  width: 100%;
}
.mdl-btn-wrap {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: 10px 0;
}
.mdl-btn {
  border-radius: 4px;
  padding: 6px 12px;
  border: transparent;
  color: #ffffff;
  width: 50%;
  margin-right: 0;
}
.mdl-btn:focus {
  outline: none;
}
.mdl-btn-accept {
  background-color: #3D9973;
  
}
.mdl-btn-reject {
  background-color: #EB5757;
}
.btn-validate {
    position: fixed;
    top: 50%;
    left: 92%;
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
