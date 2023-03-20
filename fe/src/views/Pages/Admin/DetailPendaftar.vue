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
        <h4 class="text-default m-0">Detail Industri</h4>
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
                          ? `${baseUrl}/${info.prosesProduksi.fileNeracaAirLimbah.path}`
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
                    <strong>Berlaku</strong>
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
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>Nama Badan Air Penerima Air Limbah</strong>
                    </div>
                    <div class="col-lg-10">
                      <span>{{ spot.penerimaAirLimbah }}</span>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col-lg-2">
                      <strong>DAS</strong>
                    </div>
                    <div class="col-lg-10">
                      <span>{{ spot.das }}</span>
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
                    <span>{{ info.teknis.debit }} {{ info.teknis.satuanDebit }}</span>
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
                    <span>{{ info.validitas.noSurat }}</span>
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
                          <strong>Metode Kalibrasi</strong>
                        </div>
                        <div class="col-10">{{ item.metodeKalibrasi }}</div>
                      </div>
                    </template>
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
import swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import defaults from "@/util/defaults";
import moment from "moment";

export default {
  components: {},
  data() {
    return {
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
    toListPendaftaran() {
      // this.$router.push("/admin/list/pendaftar");
      this.$router.go(-1);
    },
    showTTE() {
      this.$store.commit("setTTE", this.info._id);
      this.$router.push("/tte");
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
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY");
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
