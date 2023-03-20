<template>
  <div class="container-fluid mt-10">
    <div class="row justify-content-center mb--4">
      <div v-if="!isLoading" class="col">
        <div class="row mb-4">
          <div class="col-12">
            <div class="float-right btn btn-sm btn-primary" @click="showTTE">Lembar TTE</div>
          </div>
        </div>
        <div id="akun" class="pt-4">
          <div>
            <h3>Akun</h3>
            <hr>
          </div>
          <div>
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
        <div id="umum" class="pt-6">
          <div>
            <h3>Umum</h3>
            <hr>
          </div>
          <div>
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
            <div class="row mb-4" v-if="info.umum.hasOwnProperty('compPermohonanKoneksi')">
              <div class="col-lg-2">
                <strong>Surat permohonan pendaftaran koneksi sparing kepada Direktur Pengendalian Pencemaran Air</strong>
              </div>
              <div class="col-lg-10">
                <a :href="`${baseURL}/${info.umum.compPermohonanKoneksi.path}`" target="blank">
                  <span>
                    <i class="ni ni-cloud-download-95 text-primary"></i>
                  </span>
                  <span>{{
                    info.umum.compPermohonanKoneksi.path
                      ? " File Terupload"
                      : " File Belum Terupload"
                  }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          id="teknis"
          class="pt-6"
          v-if="!info.prosesProduksi.debitLimbahTotal.value">
          <div>
            <h3>Teknis</h3>
            <hr />
          </div>
          <div>
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
                <span>{{ info.teknis.debit }} {{ info.teknis.satuanDebit}}</span>
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
          class="mt-6"
          v-if="info.prosesProduksi.debitPenggunaan.value || info.prosesProduksi.debitLimbahTotal.value">
          <div>
            <h3 class="m-0">
              Khusus Industri Yang Memanfaatkan air limbah 100% ke proses
              produksi
            </h3>
            <hr />
          </div>
          <div>
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
                      !info.prosesProduksi.fileNeracaAirLimbah.path
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
          class="mt-6"
          v-if="!info.prosesProduksi.debitLimbahTotal.value">
          <div>
            <h3>Frekuensi Pembuangan Air Limbah</h3>
            <hr />
          </div>
          <div>
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
            <div v-if="info.teknis.frequenceDet === 'Tidak Rutin/Intermiten'">
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
                      !info.frekuensi.fotoIPAL.path
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
                      !info.frekuensi.logBook.path
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
          class="mt-6"
          v-if="!info.prosesProduksi.debitLimbahTotal.value">
          <div>
            <h3>Validitas Data</h3>
            <hr />
          </div>
          <div>
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
          class="mt-6"
          v-if="!info.prosesProduksi.debitLimbahTotal.value">
          <div>
            <h3>Data Logger</h3>
            <hr />
          </div>

          <div>
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
          class="mt-6"
          v-if="!info.prosesProduksi.debitLimbahTotal.value">
          <div>
            <h3>Sensor</h3>
            <hr />
          </div>
          <div>
            <div v-for="item in info.sensor" :key="item.name" class="row mb-4">
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
                            <div class="col-12">
                              {{ item.minMeasure || 0 }}
                              <span v-if="item.name ==='Debit'">{{ item.satuanDebit }}</span>
                              <span v-else-if="item.name !=='pH'">mg/L</span>
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
                              <span v-if="item.name ==='Debit'">{{ item.satuanDebit }}</span>
                              <span v-else-if="item.name !=='pH'">mg/L</span>
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
                                <div class="col-12">{{ item.min || 0 }}</div>
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
                      <strong>Tanggal Kalibrasi</strong>
                    </div>
                    <div class="col-10">{{ formatUnixDate(item.tanggalKalibrasi) }}</div>
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
        <div
          class="my-6"
          v-if="!info.prosesProduksi.debitLimbahTotal.value">
          <div>
            <h3>Dokumen Tambahan</h3>
            <hr />
          </div>
          <div>
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
</template>
<script>
const axios = require("axios");
import defaults from "@/util/defaults";
import moment from "moment";

export default {
  components: {},
  data() {
    return {
      baseURL: defaults.baseURL,
      isLoading: true,
      info: {},
    };
  },
  methods: {
    getInfo() {
      const authData = JSON.parse(localStorage.getItem("auth-data"));
      axios
        .get(`${defaults.baseURL}/form/detail-pendaftaran/${authData._id}`)
        .then((res) => {
          this.info = res.data;
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showTTE() {
      this.$store.commit("setTTE", this.info._id);
      this.$router.push("/tte");
    },
    formatDate(date) {
      if (!date) return
      if (date.includes("T")) {
        return moment(date, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("DD/MM/YYYY");
      }
      return date;
    },
    formatUnixDate(date) {
      if (!date) return "-";
      if (isNaN(date)) return date;
      return moment.unix(date).format("DD/MM/YYYY");
    },
  },
  created() {
    this.getInfo();
  },
};
</script>
