<template>
  <div>
    <div>
      <div class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1">
        <h1 class="display-3 font-weight-light text-white m-0">Admin</h1>
        <h2 class="text-white mx-4 my-0">-</h2>
        <h4 class="text-default m-0">Detail Pendaftar Uji Konektifitas</h4>
      </div>
      <base-header class="pb-8" type="primary">
        <div class="row justify-content-end">
          <base-button class="col- mt-3 mb--3 mr-3" @click="backToList">Kembali</base-button>
        </div>
      </base-header>

      <div class="container-fluid mt--7">
        <div class="row justify-content-center mb--4">
          <div v-if="!isLoading" class="col">
            <div class="card">
              <div class="card-header">
                <h3 class="mb-0">Umum</h3>
              </div>
              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>ID Pendaftaran</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ id }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>UID</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ detail.uid || "-" }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Tanggal Uji</strong>
                  </div>
                  <div class="col-lg-10">
                    <span v-if="modalData.validitas.length">{{ dateFormat(modalData.validitas.at(0).tanggal_uji, "DD/MM/YYYY") }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Status Pendaftaran</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ modalData.isValidated ? "Tervalidasi" : "Belum Tervalidasi" }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Dibuat pada</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ createdAt }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Nama Perusahaan</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ detail.umum.companyName }}</span>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Nama Penanggung Jawab SIUP</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ detail.umum.responsiblePerson }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Lampiran SIUP</strong>
                  </div>
                  <div class="col-lg-10">
                    <a
                      :href="detail.umum.siupFile.path? `${baseURL}/${detail.umum.siupFile.path}` : ''"
                      target="_blank">
                      <span>
                        <i class="ni ni-cloud-download-95 text-primary"></i>
                      </span>
                      <span>
                        {{ detail.umum.siupFile.path ? "File Terupload" : 'Tidak ada' }}</span>
                    </a>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Alamat Perusahaan</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ detail.umum.companyAddress }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Kabupaten / Kota</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ city }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Provinsi</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ province }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Telepon Kantor</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ detail.umum.companyPhone }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Email Kantor</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ detail.umum.companyMail }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Nama Penanggung Jawab Uji</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ detail.umum.responsibleTestPerson }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Nomor Handphone Penanggung Jawab Uji</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ detail.umum.responsibleTestPhone }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Email Penanggung Jawab Uji</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ detail.umum.responsibleTestMail }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3 class="m-0">Data Logger</h3>
              </div>
              <div class="card-body" v-for="(logger, index) in detail.logger" :key="index">
                <p class="font-weight-bold text-primary">Data Logger #{{ index + 1}}</p>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Brand</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ logger.brand }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-2">
                    <strong>Model / Type</strong>
                  </div>
                  <div class="col-lg-10">
                    <span>{{ logger.type }}</span>
                  </div>
                </div>
              </div>
            </div>

              <!-- Sensor -->
            <div v-if="this.detail.sensor.ph.length > 0" class="card">
              <div class="card-header">
                <h3 class="m-0">Sensor pH</h3>
              </div>
              <div class="card-body" v-for="(ph, index) in detail.sensor.ph" :key="index">
                <p class="font-weight-bold text-primary">Data Sensor pH #{{ index + 1}}</p>
                <div class="row mb-4">
                  <div class="col-lg-10">
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Brand</strong>
                        </div>
                        <div class="col-10">{{ ph.brand }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Probe</strong>
                        </div>
                        <div class="col-10">{{ ph.probe }}</div>
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
                                  <strong>Minimal</strong>
                                </div>
                                <div class="col-12">
                                  {{ ph.minMeasurement }}
                                </div>
                              </div>
                            </div>
                            <div class="col-6">
                              <div class="row">
                                <div class="col-12">
                                  <strong>Maksimal</strong>
                                </div>
                                <div class="col-12">
                                  {{ ph.maxMeasurement }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Metode Pengukuran</strong>
                        </div>
                        <div class="col-10">{{ ph.measurementMethod }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Jadwal Kalibrasi</strong>
                        </div>
                        <div class="col-10">{{ ph.calibrationSchedule }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Metode Kalibrasi</strong>
                        </div>
                        <div class="col-10">{{ ph.calibrationMethod }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Brochure File</strong>
                        </div>
                        <div class="col-10">
                           <a
                              :href="(ph.brochureFile && ph.brochureFile.path ? `${baseURL}/${ph.brochureFile.path}` : '')"
                              target="_blank">
                              <span>
                                <i class="ni ni-cloud-download-95 text-primary"></i>
                              </span>
                              <span>
                                {{ (ph.brochureFile && ph.brochureFile.path ? "File Terupload" : 'Tidak ada' )}}</span>
                            </a>
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Support File</strong>
                        </div>
                        <div class="col-10">
                           <a
                              :href="ph.supportFile && ph.supportFile.path ? `${baseURL}/${ph.supportFile.path}` : ''"
                              target="_blank">
                              <span>
                                <i class="ni ni-cloud-download-95 text-primary"></i>
                              </span>
                              <span>
                                {{ ph.supportFile && ph.supportFile.path ? "File Terupload" : 'Tidak ada' }}</span>
                            </a>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="this.detail.sensor.cod.length  > 0" class="card">
              <div class="card-header">
                <h3 class="m-0">Sensor COD</h3>
              </div>
              <div class="card-body" v-for="(cod, index) in detail.sensor.cod" :key="index">
                <p class="font-weight-bold text-primary">Data Sensor COD #{{ index + 1}}</p>
                <div class="row mb-4">
                  <div class="col-lg-10">
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Brand</strong>
                        </div>
                        <div class="col-10">{{ cod.brand }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Probe</strong>
                        </div>
                        <div class="col-10">{{ cod.probe }}</div>
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
                                  <strong>Minimal</strong>
                                </div>
                                <div class="col-12">
                                  {{ cod.minMeasurement }}
                                </div>
                              </div>
                            </div>
                            <div class="col-6">
                              <div class="row">
                                <div class="col-12">
                                  <strong>Maksimal</strong>
                                </div>
                                <div class="col-12">
                                  {{ cod.maxMeasurement }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Metode Pengukuran</strong>
                        </div>
                        <div class="col-10">{{ cod.measurementMethod }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Jadwal Kalibrasi</strong>
                        </div>
                        <div class="col-10">{{ cod.calibrationSchedule }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Metode Kalibrasi</strong>
                        </div>
                        <div class="col-10">{{ cod.calibrationMethod }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Brochure File</strong>
                        </div>
                        <div class="col-10">
                           <a
                              :href="cod.brochureFile && cod.brochureFile.path ? `${baseURL}/${cod.brochureFile.path}` : ''"
                              target="_blank">
                              <span>
                                <i class="ni ni-cloud-download-95 text-primary"></i>
                              </span>
                              <span>
                                {{ cod.brochureFile && cod.brochureFile.path ? "File Terupload" : 'Tidak ada' }}</span>
                            </a>
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Support File</strong>
                        </div>
                        <div class="col-10">
                           <a
                              :href="cod.supportFile && cod.supportFile.path ? `${baseURL}/${cod.supportFile.path}` : ''"
                              target="_blank">
                              <span>
                                <i class="ni ni-cloud-download-95 text-primary"></i>
                              </span>
                              <span>
                                {{ cod.supportFile && cod.supportFile.path ? "File Terupload" : 'Tidak ada' }}</span>
                            </a>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="this.detail.sensor.tss.length  > 0" class="card">
              <div class="card-header">
                <h3 class="m-0">Sensor TSS</h3>
              </div>
              <div class="card-body" v-for="(tss, index) in detail.sensor.tss" :key="index">
                <p class="font-weight-bold text-primary">Data Sensor TSS #{{ index + 1}}</p>
                <div class="row mb-4">
                  <div class="col-lg-10">
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Brand</strong>
                        </div>
                        <div class="col-10">{{ tss.brand }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Probe</strong>
                        </div>
                        <div class="col-10">{{ tss.probe }}</div>
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
                                  <strong>Minimal</strong>
                                </div>
                                <div class="col-12">
                                  {{ tss.minMeasurement }}
                                </div>
                              </div>
                            </div>
                            <div class="col-6">
                              <div class="row">
                                <div class="col-12">
                                  <strong>Maksimal</strong>
                                </div>
                                <div class="col-12">
                                  {{ tss.maxMeasurement }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Metode Pengukuran</strong>
                        </div>
                        <div class="col-10">{{ tss.measurementMethod }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Jadwal Kalibrasi</strong>
                        </div>
                        <div class="col-10">{{ tss.calibrationSchedule }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Metode Kalibrasi</strong>
                        </div>
                        <div class="col-10">{{ tss.calibrationMethod }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Brochure File</strong>
                        </div>
                        <div class="col-10">
                          <a
                              :href="(tss.brochureFile && tss.brochureFile.path ? `${baseURL}/${tss.brochureFile.path}` : '')"
                              target="_blank">
                              <span>
                                <i class="ni ni-cloud-download-95 text-primary"></i>
                              </span>
                              <span>
                                {{ tss.brochureFile && tss.brochureFile.path ? "File Terupload" : 'Tidak ada' }}</span>
                            </a>
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Support File</strong>
                        </div>
                        <div class="col-10">
                           <a
                              :href="tss.supportFile && tss.supportFile.path ? `${baseURL}/${tss.supportFile.path}` : ''"
                              target="_blank">
                              <span>
                                <i class="ni ni-cloud-download-95 text-primary"></i>
                              </span>
                              <span>
                                {{ tss.supportFile && tss.supportFile.path ? "File Terupload" : 'Tidak ada' }}</span>
                            </a>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="this.detail.sensor.nh3n.length > 0" class="card">
              <div class="card-header">
                <h3 class="m-0">Sensor NH3N</h3>
              </div>
              <div class="card-body" v-for="(nh3n, index) in detail.sensor.nh3n" :key="index">
                <p class="font-weight-bold text-primary">Data Sensor NH3N #{{ index + 1}}</p>
                <div class="row mb-4">
                  <div class="col-lg-10">
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Brand</strong>
                        </div>
                        <div class="col-10">{{ nh3n.brand }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Probe</strong>
                        </div>
                        <div class="col-10">{{ nh3n.probe }}</div>
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
                                  <strong>Minimal</strong>
                                </div>
                                <div class="col-12">
                                  {{ nh3n.minMeasurement }}
                                </div>
                              </div>
                            </div>
                            <div class="col-6">
                              <div class="row">
                                <div class="col-12">
                                  <strong>Maksimal</strong>
                                </div>
                                <div class="col-12">
                                  {{ nh3n.maxMeasurement }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Metode Pengukuran</strong>
                        </div>
                        <div class="col-10">{{ nh3n.measurementMethod }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Jadwal Kalibrasi</strong>
                        </div>
                        <div class="col-10">{{ nh3n.calibrationSchedule }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Metode Kalibrasi</strong>
                        </div>
                        <div class="col-10">{{ nh3n.calibrationMethod }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Brochure File</strong>
                        </div>
                        <div class="col-10" >
                           <a
                              :href="nh3n.brochureFile && nh3n.brochureFile.path ? `${baseURL}/${nh3n.brochureFile.path}` : ''"
                              target="_blank">
                              <span>
                                <i class="ni ni-cloud-download-95 text-primary"></i>
                              </span>
                              <span>
                                {{ nh3n.brochureFile && nh3n.brochureFile.path ? "File Terupload" : 'Tidak ada' }}</span>
                            </a>
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Support File</strong>
                        </div>
                        <div class="col-10">
                           <a
                              :href="nh3n.supportFile && nh3n.supportFile.path? `${baseURL}/${nh3n.supportFile.path}` : ''"
                              target="_blank">
                              <span>
                                <i class="ni ni-cloud-download-95 text-primary"></i>
                              </span>
                              <span>
                                {{ nh3n.supportFile && nh3n.supportFile.path ? "File Terupload" : 'Tidak ada' }}</span>
                            </a>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="this.detail.sensor.debit.length > 0" class="card">
              <div class="card-header">
                <h3 class="m-0">Sensor Debit</h3>
              </div>
              <div class="card-body" v-for="(debit, index) in detail.sensor.debit" :key="index">
                <p class="font-weight-bold text-primary">Data Sensor Debit #{{ index + 1}}</p>
                <div class="row mb-4">
                  <div class="col-lg-10">
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Brand</strong>
                        </div>
                        <div class="col-10">{{ debit.brand }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Probe</strong>
                        </div>
                        <div class="col-10">{{ debit.probe }}</div>
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
                                  <strong>Minimal</strong>
                                </div>
                                <div class="col-12">
                                  {{ debit.minMeasurement }}
                                </div>
                              </div>
                            </div>
                            <div class="col-6">
                              <div class="row">
                                <div class="col-12">
                                  <strong>Maksimal</strong>
                                </div>
                                <div class="col-12">
                                  {{ debit.maxMeasurement }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Metode Pengukuran</strong>
                        </div>
                        <div class="col-10">{{ debit.measurementMethod }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Jadwal Kalibrasi</strong>
                        </div>
                        <div class="col-10">{{ debit.calibrationSchedule }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Metode Kalibrasi</strong>
                        </div>
                        <div class="col-10">{{ debit.calibrationMethod }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Brochure File</strong>
                        </div>
                        <div class="col-10">
                           <a
                              :href="debit.brochureFile && debit.brochureFile.path ? `${baseURL}/${debit.brochureFile.path}` : ''"
                              target="_blank">
                              <span>
                                <i class="ni ni-cloud-download-95 text-primary"></i>
                              </span>
                              <span>
                                {{ debit.brochureFile && debit.brochureFile.path ? "File Terupload" : 'Tidak ada' }}</span>
                            </a>
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-2">
                          <strong>Support File</strong>
                        </div>
                        <div class="col-10">
                           <a
                              :href="debit.supportFile && debit.supportFile.path? `${baseURL}/${debit.supportFile.path}` : ''"
                              target="_blank">
                              <span>
                                <i class="ni ni-cloud-download-95 text-primary"></i>
                              </span>
                              <span>
                                {{ debit.supportFile && debit.supportFile.path ? "File Terupload" : 'Tidak ada' }}</span>
                            </a>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row justify-content-end position-fixed right-0" style="top:50%">
              <base-button @click="validasiHandler" class="mx-3 mb-4" type="danger">
                {{ modalData.isValidated ? "Riwayat Validasi" : "Validasi" }}
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalValidasi v-if="showModal" :data="modalData" :show-modal="showModal" @close="onCloseModal" />
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import defaults from "@/util/defaults";
import ModalValidasi from "./ModalValidasi.vue";

export default {
   components: {
    ModalValidasi,
  },
  data() {
    return {
      detail: {},
      modalData: {},
      id: null,
      createdAt: null,
      baseURL: defaults.baseURL,
      province: null,
      city: null,
      isLoading: true,
      showModal: false,
    };
  },
  methods: {
    async getData() {
      const id = this.$route.params.id;
      const { data } = await axios.get(`${defaults.baseURL}/api/v1/ujikonek/list/${id}`);
      this.detail = data.data;
      this.id = data._id;
      this.modalData = {
        id: data._id,
        companyName: data.data.umum.companyName,
        validitas: data.validitas.sort((a, b) => b.created_time - a.created_time),
        isValidated: data.validated,
      };
      this.createdAt = this.dateFormat(data.created_time, "DD/MM/YYYY HH:mm");
      this.getProvince();
      this.isLoading = false;
    },
    async getProvince() {
      const { data } = await axios.get(`${defaults.baseURL}/report/list/5f340d5e328182315c11ee98`);
      this.province = data.provList.find((item) => item._id === this.detail.umum.companyProvince).name;
      this.city = data.kabkotList.find((item) => item._id === this.detail.umum.companyCity).name;
    },
    backToList() {
      this.$router.push("/admin/list/ujikonek");
    },
    validasiHandler() {
      this.showModal = true;
    },
    onCloseModal() {
      this.showModal = false;
      this.getData();
    },
    dateFormat(date, format) {
      if  (date) return moment.unix(date).format(format);
      return "-";
    },
  },
  created() {
    this.getData();
  },
};
</script>
