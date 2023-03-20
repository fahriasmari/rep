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
        <h1 class="display-3 font-weight-light text-white m-0">Informasi</h1>
        <h2 class="text-white mx-4 my-0">-</h2>
        <h4 class="text-default m-0">Detail Pendaftar</h4>
      </div>
      <base-header class="pb-8" type="primary"></base-header>

      <div class="container-fluid mt--7">
        <div class="row justify-content-center mb--4">
          <div class="col">
            <div id="umum" class="card">
              <div class="card-header">
                <h3 class="mb-0">Akun</h3>
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

            <div
              id="teknis"
              class="card"
              v-if="info.prosesProduksi.debitLimbahTotal.value == null || info.prosesProduksi.debitLimbahTotal.value == ''"
            >
              <div class="card-header">
                <h3 class="mb-0">Teknis</h3>
              </div>
              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Izin Pembuangan Air Limbah ke Media Air</strong>
                  </div>
                  <div class="col-lg-10">
                    <a :href="`${baseURL}/${info.teknis.permitFile.path}`" target="blank">
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.teknis.permitFile.path
                          ? " File Terupload"
                          : " File Belum Terupload"
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
                    <span>{{ info.teknis.permitDatePublish }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Berlaku</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.teknis.permitDateExpire }}</span>
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

            <!-- Khusus Industri Yang Memanfaatkan air limbah 100% ke proses produksi -->
            <div
              class="card"
              v-if="
                info.prosesProduksi.debitPenggunaan.value != null || info.prosesProduksi.debitLimbahTotal.value != ''
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
                            ? `${baseURL}/${info.prosesProduksi.fileNeracaAirLimbah.path}`
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
              class="card"
              v-if="info.prosesProduksi.debitLimbahTotal.value == null || info.prosesProduksi.debitLimbahTotal.value == ''"
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
              v-if="info.prosesProduksi.debitLimbahTotal.value == null || info.prosesProduksi.debitLimbahTotal.value == ''"
            >
              <div class="card-header">
                <h3 class="m-0">Validitas Data</h3>
              </div>
              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>
                      Hasil Uji Kinerja Dari Laboratorium Yang Ditunjuk Oleh
                      KLHK
                    </strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="`${baseURL}/${info.validitas.kinerjaFile.path}`"
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.validitas.kinerjaFile.path
                          ? " File Terupload"
                          : " File Belum Terupload"
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
                      :href="`${baseURL}/${info.validitas.konektifitasFile.path}`"
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.validitas.konektifitasFile.path
                          ? " File Terupload"
                          : " File Belum Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Hasil Kalibrasi Alat</strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="`${baseURL}/${info.validitas.kalibrasiFile.path}`"
                      target="blank"
                    >
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.validitas.kalibrasiFile.path
                          ? " File Terupload"
                          : " File Belum Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>
                      Hasil Uji Validitas Dari Laboratorium Yang Ditunjuk Oleh
                      KLHK
                    </strong>
                  </div>
                  <div class="col-lg-10">
                    <a :href="`${baseURL}/${info.validitas.kinerjaFile.path}`" target="blank">
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.validitas.kinerjaFile.path
                          ? " File Terupload"
                          : " File Belum Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="card"
              v-if="info.prosesProduksi.debitLimbahTotal.value == null || info.prosesProduksi.debitLimbahTotal.value == ''"
            >
              <div class="card-header">
                <h3 class="m-0">Data Logger</h3>
              </div>

              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>ID</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ info.logger[0].id }}</span>
                  </div>
                </div>
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
              v-if="info.prosesProduksi.debitLimbahTotal.value == null || info.prosesProduksi.debitLimbahTotal.value == ''"
            >
              <div class="card-header">
                <h3 class="m-0">Sensor</h3>
              </div>
              <div class="card-body">
                <template v-for="item in info.sensor">
                  <div :key="item.name" class="row mb-4">
                    <div class="col-lg-2">
                      <strong>{{ item.label }}</strong>
                    </div>
                    <div class="col-lg-10">
                      <span>{{
                        item.active ? "Digunakan" : "Tidak digunakan"
                      }}</span>
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
                            <a :href="`${baseURL}/${item.brosurFile.path}`" target="blank">
                              <span>
                                <i
                                  class="ni ni-cloud-download-95 text-primary"
                                ></i>
                              </span>
                              <span>{{
                                item.brosurFile.path
                                  ? " File Terupload"
                                  : " File Belum Terupload"
                              }}</span>
                            </a>
                          </div>
                        </div>
                        <div class="row mb-2">
                          <div class="col-2">
                            <strong>Range</strong>
                          </div>
                          <div class="col-10">
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
                        </div>
                        <div class="row mb-2">
                          <div class="col-2">
                            <strong>Metode Pengukuran</strong>
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
                </template>
              </div>
            </div>
            <div
              class="card"
              v-if="info.prosesProduksi.debitLimbahTotal.value == null || info.prosesProduksi.debitLimbahTotal.value == ''"
            >
              <div class="card-header">
                <h3 class="m-0">Dokumen Tambahan</h3>
              </div>
              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Surat Dukungan Dari Brand Sensor</strong>
                  </div>
                  <div class="col-lg-10">
                    <a :href="`${baseURL}/${info.surat.dukunganBrand.path}`" target="blank">
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.surat.dukunganBrand.path
                          ? " File Terupload"
                          : " File Belum Terupload"
                      }}</span>
                    </a>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Surat Pernyataan dari Vendor Sensor</strong>
                  </div>
                  <div class="col-lg-10">
                    <a :href="`${baseURL}/${info.surat.pernyataanVendor.path}`" target="blank">
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>{{
                        info.surat.pernyataanVendor.path
                          ? " File Terupload"
                          : " File Belum Terupload"
                      }}</span>
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
</template>
<script>
const axios = require("axios");
import defaults from "@/util/defaults";

export default {
  components: {},
  data() {
    return {
      baseURL: defaults.baseURL,
      info: {
        akun: {
          personName: "",
          personPhone: "",
          personMail: "",
        },
        umum: {
          compName: "",
          compType: "",
          compAddress: "",
          compStreet: "",
          compCity: "",
          compProvince: "",
          compPhone: "",
          compMail: "",
        },
        prosesProduksi:{
          debitLimbahTotal :{
            value:"", 
            keterangan: ""
          },
          debitOlahIPAL :{
            value: "", 
            keterangan: ""
          },
          debitPenggunaan :{
            value: "", 
            keterangan: ""
          },
          debitRecovery :{
            value: "", 
            keterangan: ""
          },
          debitRecycle :{
            value: "", 
            keterangan: ""
          },
          debitReuse :{
            value: "", 
            keterangan: ""
          },
          fileNeracaAirLimbah :{
            path: "", 
            upload: 0,
            progress: 0
          },
        },
        teknis: {
          permitFile: {
            label: "",
            path: "",
            upload: 0,
          },
          permitPerson: "",
          permitNumber: "",
          permitDatePublish: "",
          permitDateExpire: "",
          wasteSource: "",
          spotCount: "",
          spotName: "",
          spotLocation: ["", ""],
          processingTechnique: "",
          wasteType: "",
          debit: "",
          capacityPermit: "",
          capacityActual: "",
          isContinue: false,
          frequenceDet: "",
        },
        validitas: {
          kinerjaFile: {
            label: "",
            path: "",
            upload: 0,
          },
          konektifitasFile: {
            label: "",
            path: "",
            upload: 0,
          },
          kalibrasiFile: {
            label: "",
            path: "",
            upload: 0,
          },
          validitasFile: {
            label: "",
            path: "",
            upload: 0,
          },
        },
        frekuensi: {
          jam: "",
          hari: "",
          bulan: "",
        },
        logger: [
          {
            id: "",
            brand: "",
            model: "",
            sn: "",
            mac: "",
          },
        ],
        sensor: [
          {
            name: "ph",
            label: "pH",
            active: false,
            brand: "",
            probe: "",
            brosurFile: {
              label: "",
              path: "",
              upload: 0,
            },
            min: "",
            max: "",
            metodePengukuran: "",
            jadwalKalibrasi: "",
            metodeKalibrasi: "",
          },
          {
            name: "cod",
            label: "COD",
            active: false,
            brand: "",
            probe: "",
            brosurFile: {
              label: "",
              path: "",
              upload: 0,
            },
            min: "",
            max: "",
            metodePengukuran: "",
            jadwalKalibrasi: "",
            metodeKalibrasi: "",
          },
          {
            name: "tss",
            label: "TSS",
            active: false,
            brand: "",
            probe: "",
            brosurFile: {
              label: "",
              path: "",
              upload: 0,
            },
            min: "",
            max: "",
            metodePengukuran: "",
            jadwalKalibrasi: "",
            metodeKalibrasi: "",
          },
          {
            name: "nh3n",
            label: "NH3N",
            active: false,
            brand: "",
            probe: "",
            brosurFile: {
              label: "",
              path: "",
              upload: 0,
            },
            min: "",
            max: "",
            metodePengukuran: "",
            jadwalKalibrasi: "",
            metodeKalibrasi: "",
          },
          {
            name: "debit",
            label: "Debit",
            active: false,
            brand: "",
            probe: "",
            brosurFile: {
              label: "",
              path: "",
              upload: 0,
            },
            min: "",
            max: "",
            metodePengukuran: "",
            jadwalKalibrasi: "",
            metodeKalibrasi: "",
          },
        ],
        surat: {
          dukunganBrand: {
            label: "",
            path: "",
            upload: 0,
          },
          pernyataanVendor: {
            label: "",
            path: "",
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
    getInfo() {
      const authData = JSON.parse(localStorage.getItem("auth-data"));
      axios
        .get(`${defaults.baseURL}/form/detail-pendaftaran/${authData._id}`)
        .then((res) => {
          console.log(res.data);
          this.info = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
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
