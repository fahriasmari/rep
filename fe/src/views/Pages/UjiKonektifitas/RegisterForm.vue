<template>
<div class="row">
  <validation-observer ref="formValidator" class="w-100">
    <form class="col-12">
      <div class="card bg-white border-0">
        <div class="card-header px-4">Informasi Umum</div>
        <div class="card-body p-4">
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Nama Perusahaan</label>
            <div class="col-lg-10">
              <base-input
                name="Nama Perusahaan"
                rules="required"
                v-model="form.umum.companyName" />
              <base-input
                name="Nama Perusahaan ID"
                type="hidden"
                v-model="form.umum.companyID" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Lampiran SIUP</label>
            <div class="col-lg-10">
              <base-input name="Lampiran SIUP" rules="required" >
                <file-input
                  :disabled="uploading"
                  accept="application/pdf"
                  ref="siupFile"
                  @change="uploadFile('umum', 'siupFile')" />
                <base-progress
                  v-if="form.umum.siupFile.upload >= 1"
                  class="mb-0"
                  :type="form.umum.siupFile.progress >= 100 ? 'green' : 'orange'"
                  :value="form.umum.siupFile.progress" />
              </base-input>
              <small
                v-if="form.umum.siupFile.upload == 2 || form.umum.siupFile.path"
                class="d-block mt--3 text-justify">
                <a :href="`${baseURL}${form.umum.siupFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
              </small>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Nama Penanggung Jawab sesuai dengan SIUP</label>
            <div class="col-lg-10">
              <base-input
                name="Nama Penanggung Jawab"
                rules="required"
                v-model="form.umum.responsiblePerson" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Alamat Perusahaan</label>
            <div class="col-lg-10">
              <base-input
                name="Alamat Perusahaan"
                rules="required"
                v-model="form.umum.companyAddress" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Provinsi</label>
            <div class="col-lg-10">
              <base-input name="Provinsi" rules="required">
                <el-select
                  v-model="form.umum.companyProvince"
                  @change="getCity(form.umum.companyProvince)"
                  filterable>
                  <el-option
                    v-for="option in provinces"
                    :key="option._id"
                    :label="option.name"
                    :value="option._id" />
                </el-select>
              </base-input>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Kabupaten / Kota</label>
            <div class="col-lg-10">
              <base-input name="Kabupaten / Kota" rules="required">
                <el-select v-model="form.umum.companyCity" filterable>
                  <el-option
                    v-for="option in cities"
                    :key="option._id"
                    :label="option.name"
                    :value="option._id" />
                </el-select>
              </base-input>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Nomor Telepon Kantor</label>
            <div class="col-lg-10">
              <base-input
                name="Nomor Telepon Kantor"
                rules="required"
                v-model="form.umum.companyPhone"
                type="tel" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Email Kantor</label>
            <div class="col-lg-10">
              <base-input
                name="Email Kantor"
                rules="required"
                v-model="form.umum.companyMail"
                type="email"
                autocomplete="username email" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Nama Penanggung Jawab Peserta Uji</label>
            <div class="col-lg-10">
              <base-input
                name="Nama Penanggung Jawab Peserta Uji"
                rules="required"
                v-model="form.umum.responsibleTestPerson" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Nomor Telepon Penanggun Jawab Uji</label>
            <div class="col-lg-10">
              <base-input
                name="Nomor Telepon Penanggun Jawab Uji"
                rules="required"
                v-model="form.umum.responsibleTestPhone"
                type="tel" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Alamat Email Penanggun Jawab Uji</label>
            <div class="col-lg-10">
              <base-input
                name="Alamat Email Penanggun Jawab Uji"
                rules="required"
                v-model="form.umum.responsibleTestMail"
                type="email"
                autocomplete="username email" />
            </div>
          </div>
        </div>
      </div>

      <!-- INFORMASI DATA LOGGER -->
      <div class="card bg-white border-0">
        <div class="card-header px-4">Informasi Data Logger</div>
        <div v-for="(logger, index) in form.logger" :key="index" class="card-body pb-0">
          <p class="font-weight-bold text-primary">
            Data Logger #{{ index + 1}}
            <template  v-if="index > 0">
              |  
            <base-button class="bg-danger btn-sm" @click="removeLogger(index)">
              <i class="fas fa-trash-alt"></i>
              Hapus
            </base-button>
            </template>
          </p>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Brand</label>
            <div class="col-lg-10">
              <base-input
                :name="`Data Logger Brand ${index + 1}`"
                rules="required"
                v-model="form.logger[index].brand" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Model / Tipe</label>
            <div class="col-lg-10">
              <base-input
                :name="`Data Logger Model / Tipe ${index + 1}`"
                rules="required"
                v-model="form.logger[index].type" />
            </div>
          </div>
          <hr v-if="form.logger.length > 1 && form.logger.length != index+1" />
        </div>
        <div class="d-flex justify-content-end pr-4 pb-4">
          <base-button class="bg-secondary" @click="addLogger">
            <i class="fa fa-plus" aria-hidden="true"></i>
            Tambah Data Logger
          </base-button>
        </div>
      </div>

      <!-- INFORMASI DATA SENSOR -->
      <div class="card bg-white border-0">
        <div class="card-header px-4">Informasi Sensor</div>
        <!-- pH -->
        <div class="px-4 pt-4">
          <p class="sensor-header">pH</p>
        </div>
        <div v-for="(ph, index) in form.sensor.ph" :key="`ph${index}`" class="card-body pb-0">
          <p class="font-weight-bold text-primary">
            Sensor #{{ index + 1}} |  
            <base-button class="bg-danger btn-sm" @click="removeSensor('ph', index)">
              <i class="fas fa-trash-alt"></i>
              Hapus
            </base-button>
          </p>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Brand</label>
            <div class="col-lg-10">
              <base-input
                :name="`Brand pH ${index + 1}`"
                rules="required"
                v-model="form.sensor.ph[index].brand" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Probe</label>
            <div class="col-lg-10">
              <base-input
                :name="`Probe pH ${index + 1}`"
                rules="required"
                v-model="form.sensor.ph[index].probe" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Range Pengukuran</label>
            <div class="col-lg-10 d-flex px-0">
              <div class="col">
                <small>Minimal</small>
                <base-input
                  :name="`Minimal Pengukuran pH ${index + 1}`"
                  rules="required"
                  v-model="form.sensor.ph[index].minMeasurement" />
              </div>
              <div class="col">
                <small>Maksimal</small>
                <base-input
                  :name="`Maksimal Pengukuran pH ${index + 1}`"
                  rules="required"
                  v-model="form.sensor.ph[index].maxMeasurement" />
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Metode Pengukuran</label>
            <div class="col-lg-10">
              <base-input
                :name="`Metode Pengukuran pH ${index + 1}`"
                rules="required"
                v-model="form.sensor.ph[index].measurementMethod" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Jadwal Kalibrasi</label>
            <div class="col-lg-10">
              <base-input :name="`Jadwal Kalibrasi pH ${index + 1}`" rules="required">
                <el-select v-model="form.sensor.ph[index].calibrationSchedule">
                  <el-option v-for="bulan in 12" :key="bulan" :label="`${bulan} Bulan`" :value="`${bulan} Bulan`" />
                </el-select>
              </base-input>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Metode Kalibrasi</label>
            <div class="col-lg-10">
              <base-input
                :name="`Metode Kalibrasi pH ${index + 1}`"
                rules="required"
                v-model="form.sensor.ph[index].calibrationMethod" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Brosur Spesifikasi Sensor</label>
            <div class="col-lg-10">
              <base-input :name="`Brosur Spesifikasi Sensor pH ${index + 1}`" rules="required">
                <file-input
                  :disabled="uploading"
                  accept="application/pdf"
                  :ref="`brochureFile-ph-${index}`"
                  @change="uploadSensorFile('ph', index, 'brochureFile')" />
                <base-progress
                  v-if="form.sensor.ph[index].brochureFile.upload >= 1"
                  class="mb-0"
                  :type="form.sensor.ph[index].brochureFile.progress >= 100 ? 'green' : 'orange'"
                  :value="form.sensor.ph[index].brochureFile.progress" />
              </base-input>
              <small
                v-if="form.sensor.ph[index].brochureFile.upload == 2 || form.sensor.ph[index].brochureFile.path"
                class="d-block mt--3 text-justify">
                <a :href="`${baseURL}${form.sensor.ph[index].brochureFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
              </small>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Dukungan Brand Sensor</label>
            <div class="col-lg-10">
              <base-input :name="`Dukungan Brand Sensor pH ${index + 1}`" rules="required">
                <file-input
                  :disabled="uploading"
                  accept="application/pdf"
                  :ref="`supportFile-ph-${index}`"
                  @change="uploadSensorFile('ph', index, 'supportFile')" />
                <base-progress
                  v-if="form.sensor.ph[index].supportFile.upload >= 1"
                  class="mb-0"
                  :type="form.sensor.ph[index].supportFile.progress >= 100 ? 'green' : 'orange'"
                  :value="form.sensor.ph[index].supportFile.progress" />
              </base-input>
              <small
                v-if="form.sensor.ph[index].supportFile.upload == 2 || form.sensor.ph[index].supportFile.path"
                class="d-block mt--3 text-justify">
                <a :href="`${baseURL}${form.sensor.ph[index].supportFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
              </small>
            </div>
          </div>
          <hr v-if="form.sensor.ph.length > 1 && form.sensor.ph.length != index+1" />
        </div>
        <div class="d-flex justify-content-end pr-4 pb-4">
          <base-button class="bg-secondary" @click="addSensor('ph')">
            <i class="fa fa-plus" aria-hidden="true"></i>
            Tambah Sensor pH
          </base-button>
        </div>

        <!-- COD -->
        <div class="px-4 pt-4">
          <p class="sensor-header">COD</p>
        </div>
        <div v-for="(cod, index) in form.sensor.cod" :key="`cod${index}`" class="card-body pb-0">
          <p class="font-weight-bold text-primary">
            Sensor #{{ index + 1}} |  
            <base-button class="bg-danger btn-sm" @click="removeSensor('cod', index)">
              <i class="fas fa-trash-alt"></i>
              Hapus
            </base-button>
          </p>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Brand</label>
            <div class="col-lg-10">
              <base-input
                :name="`Brand COD ${index + 1}`"
                rules="required"
                v-model="form.sensor.cod[index].brand" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Probe</label>
            <div class="col-lg-10">
              <base-input
                :name="`Probe COD ${index + 1}`"
                rules="required"
                v-model="form.sensor.cod[index].probe" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Range Pengukuran</label>
            <div class="col-lg-10 d-flex px-0">
              <div class="col">
                <small>Minimal</small>
                <base-input
                  :name="`Minimal Pengukuran COD ${index + 1}`"
                  rules="required"
                  v-model="form.sensor.cod[index].minMeasurement" />
              </div>
              <div class="col">
                <small>Maksimal</small>
                <base-input
                  :name="`Maksimal Pengukuran COD ${index + 1}`"
                  rules="required"
                  v-model="form.sensor.cod[index].maxMeasurement" />
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Metode Pengukuran</label>
            <div class="col-lg-10">
              <base-input
                :name="`Metode Pengukuran COD ${index + 1}`"
                rules="required"
                v-model="form.sensor.cod[index].measurementMethod" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Jadwal Kalibrasi</label>
            <div class="col-lg-10">
              <base-input :name="`Jadwal Kalibrasi COD ${index + 1}`" rules="required">
                <el-select v-model="form.sensor.cod[index].calibrationSchedule">
                  <el-option v-for="bulan in 12" :key="bulan" :label="`${bulan} Bulan`" :value="`${bulan} Bulan`" />
                </el-select>
              </base-input>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Metode Kalibrasi</label>
            <div class="col-lg-10">
              <base-input
                :name="`Metode Kalibrasi COD ${index + 1}`"
                rules="required"
                v-model="form.sensor.cod[index].calibrationMethod" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Brosur Spesifikasi Sensor</label>
            <div class="col-lg-10">
              <base-input :name="`Brosur Spesifikasi Sensor COD ${index + 1}`" rules="required" >
                <file-input
                  :disabled="uploading"
                  accept="application/pdf"
                  :ref="`brochureFile-cod-${index}`"
                  @change="uploadSensorFile('cod', index, 'brochureFile')" />
                <base-progress
                  v-if="form.sensor.cod[index].brochureFile.upload >= 1"
                  class="mb-0"
                  :type="form.sensor.cod[index].brochureFile.progress >= 100 ? 'green' : 'orange'"
                  :value="form.sensor.cod[index].brochureFile.progress" />
              </base-input>
              <small
                v-if="form.sensor.cod[index].brochureFile.upload == 2 || form.sensor.cod[index].brochureFile.path"
                class="d-block mt--3 text-justify">
                <a :href="`${baseURL}${form.sensor.cod[index].brochureFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
              </small>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Dukungan Brand Sensor</label>
            <div class="col-lg-10">
              <base-input :name="`Dukungan Brand Sensor COD ${index + 1}`" rules="required">
                <file-input
                  :disabled="uploading"
                  accept="application/pdf"
                  :ref="`supportFile-cod-${index}`"
                  @change="uploadSensorFile('cod', index, 'supportFile')" />
                <base-progress
                  v-if="form.sensor.cod[index].supportFile.upload >= 1"
                  class="mb-0"
                  :type="form.sensor.cod[index].supportFile.progress >= 100 ? 'green' : 'orange'"
                  :value="form.sensor.cod[index].supportFile.progress" />
              </base-input>
              <small
                v-if="form.sensor.cod[index].supportFile.upload == 2 || form.sensor.cod[index].supportFile.path"
                class="d-block mt--3 text-justify">
                <a :href="`${baseURL}${form.sensor.cod[index].supportFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
              </small>
            </div>
          </div>
          <hr v-if="form.sensor.cod.length > 1 && form.sensor.cod.length != index+1" />
        </div>
        <div class="d-flex justify-content-end pr-4 pb-4">
          <base-button class="bg-secondary" @click="addSensor('cod')">
            <i class="fa fa-plus" aria-hidden="true"></i>
            Tambah Sensor COD
          </base-button>
        </div>

        <!-- TSS -->
        <div class="px-4 pt-4">
          <p class="sensor-header">TSS</p>
        </div>
        <div v-for="(tss, index) in form.sensor.tss" :key="`tss${index}`" class="card-body pb-0">
          <p class="font-weight-bold text-primary">
            Sensor #{{ index + 1}} |  
            <base-button class="bg-danger btn-sm" @click="removeSensor('tss', index)">
              <i class="fas fa-trash-alt"></i>
              Hapus
            </base-button>
          </p>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Brand</label>
            <div class="col-lg-10">
              <base-input
                :name="`Brand TSS ${index + 1}`"
                rules="required"
                v-model="form.sensor.tss[index].brand" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Probe</label>
            <div class="col-lg-10">
              <base-input
                :name="`Probe TSS ${index + 1}`"
                rules="required"
                v-model="form.sensor.tss[index].probe" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Range Pengukuran</label>
            <div class="col-lg-10 d-flex px-0">
              <div class="col">
                <small>Minimal</small>
                <base-input
                  :name="`Minimal Pengukuran TSS ${index + 1}`"
                  rules="required"
                  v-model="form.sensor.tss[index].minMeasurement" />
              </div>
              <div class="col">
                <small>Maksimal</small>
                <base-input
                  :name="`Maksimal Pengukuran TSS ${index + 1}`"
                  rules="required"
                  v-model="form.sensor.tss[index].maxMeasurement" />
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Metode Pengukuran</label>
            <div class="col-lg-10">
              <base-input
                :name="`Metode Pengukuran TSS ${index + 1}`"
                rules="required"
                v-model="form.sensor.tss[index].measurementMethod" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Jadwal Kalibrasi</label>
            <div class="col-lg-10">
              <base-input :name="`Jadwal Kalibrasi TSS ${index + 1}`" rules="required">
                <el-select v-model="form.sensor.tss[index].calibrationSchedule">
                  <el-option v-for="bulan in 12" :key="bulan" :label="`${bulan} Bulan`" :value="`${bulan} Bulan`" />
                </el-select>
              </base-input>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Metode Kalibrasi</label>
            <div class="col-lg-10">
              <base-input
                :name="`Metode Kalibrasi TSS ${index + 1}`"
                rules="required"
                v-model="form.sensor.tss[index].calibrationMethod" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Brosur Spesifikasi Sensor</label>
            <div class="col-lg-10">
              <base-input :name="`Brosur Spesifikasi Sensor TSS ${index + 1}`" rules="required" >
                <file-input
                  :disabled="uploading"
                  accept="application/pdf"
                  :ref="`brochureFile-tss-${index}`"
                  @change="uploadSensorFile('tss', index, 'brochureFile')" />
                <base-progress
                  v-if="form.sensor.tss[index].brochureFile.upload >= 1"
                  class="mb-0"
                  :type="form.sensor.tss[index].brochureFile.progress >= 100 ? 'green' : 'orange'"
                  :value="form.sensor.tss[index].brochureFile.progress" />
              </base-input>
              <small
                v-if="form.sensor.tss[index].brochureFile.upload == 2 || form.sensor.tss[index].brochureFile.path"
                class="d-block mt--3 text-justify">
                <a :href="`${baseURL}${form.sensor.tss[index].brochureFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
              </small>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Dukungan Brand Sensor</label>
            <div class="col-lg-10">
              <base-input :name="`Dukungan Brand Sensor TSS ${index + 1}`" rules="required">
                <file-input
                  :disabled="uploading"
                  accept="application/pdf"
                  :ref="`supportFile-tss-${index}`"
                  @change="uploadSensorFile('tss', index, 'supportFile')" />
                <base-progress
                  v-if="form.sensor.tss[index].supportFile.upload >= 1"
                  class="mb-0"
                  :type="form.sensor.tss[index].supportFile.progress >= 100 ? 'green' : 'orange'"
                  :value="form.sensor.tss[index].supportFile.progress" />
              </base-input>
              <small
                v-if="form.sensor.tss[index].supportFile.upload == 2 || form.sensor.tss[index].supportFile.path"
                class="d-block mt--3 text-justify">
                <a :href="`${baseURL}${form.sensor.tss[index].supportFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
              </small>
            </div>
          </div>
          <hr v-if="form.sensor.tss.length > 1 && form.sensor.tss.length != index+1" />
        </div>
        <div class="d-flex justify-content-end pr-4 pb-4">
          <base-button class="bg-secondary" @click="addSensor('tss')">
            <i class="fa fa-plus" aria-hidden="true"></i>
            Tambah Sensor TSS
          </base-button>
        </div>

        <!-- NH3N -->
        <div class="px-4 pt-4">
          <p class="sensor-header">NH3N</p>
        </div>
        <div v-for="(nh3n, index) in form.sensor.nh3n" :key="`nh3n${index}`" class="card-body pb-0">
        <p class="font-weight-bold text-primary">
            Sensor #{{ index + 1}} | 
            <base-button class="bg-danger btn-sm" @click="removeSensor('nh3n', index)">
              <i class="fas fa-trash-alt"></i>
              Hapus
            </base-button>
          </p>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Brand</label>
            <div class="col-lg-10">
              <base-input
                :name="`Brand NH3N ${index + 1}`"
                rules="required"
                v-model="form.sensor.nh3n[index].brand" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Probe</label>
            <div class="col-lg-10">
              <base-input
                :name="`Probe NH3N ${index + 1}`"
                rules="required"
                v-model="form.sensor.nh3n[index].probe" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Range Pengukuran</label>
            <div class="col-lg-10 d-flex px-0">
              <div class="col">
                <small>Minimal</small>
                <base-input
                  :name="`Minimal Pengukuran NH3N ${index + 1}`"
                  rules="required"
                  v-model="form.sensor.nh3n[index].minMeasurement" />
              </div>
              <div class="col">
                <small>Maksimal</small>
                <base-input
                  :name="`Maksimal Pengukuran NH3N ${index + 1}`"
                  rules="required"
                  v-model="form.sensor.nh3n[index].maxMeasurement" />
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Metode Pengukuran</label>
            <div class="col-lg-10">
              <base-input
                :name="`Metode Pengukuran NH3N ${index + 1}`"
                rules="required"
                v-model="form.sensor.nh3n[index].measurementMethod" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Jadwal Kalibrasi</label>
            <div class="col-lg-10">
              <base-input :name="`Jadwal Kalibrasi NH3N ${index + 1}`" rules="required">
                <el-select v-model="form.sensor.nh3n[index].calibrationSchedule">
                  <el-option v-for="bulan in 12" :key="bulan" :label="`${bulan} Bulan`" :value="`${bulan} Bulan`" />
                </el-select>
              </base-input>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Metode Kalibrasi</label>
            <div class="col-lg-10">
              <base-input
                :name="`Metode Kalibrasi NH3N ${index + 1}`"
                rules="required"
                v-model="form.sensor.nh3n[index].calibrationMethod" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Brosur Spesifikasi Sensor</label>
            <div class="col-lg-10">
              <base-input :name="`Brosur Spesifikasi Sensor NH3N ${index + 1}`" rules="required" >
                <file-input
                  :disabled="uploading"
                  accept="application/pdf"
                  :ref="`brochureFile-nh3n-${index}`"
                  @change="uploadSensorFile('nh3n', index, 'brochureFile')" />
                <base-progress
                  v-if="form.sensor.nh3n[index].brochureFile.upload >= 1"
                  class="mb-0"
                  :type="form.sensor.nh3n[index].brochureFile.progress >= 100 ? 'green' : 'orange'"
                  :value="form.sensor.nh3n[index].brochureFile.progress" />
              </base-input>
              <small
                v-if="form.sensor.nh3n[index].brochureFile.upload == 2 || form.sensor.nh3n[index].brochureFile.path"
                class="d-block mt--3 text-justify">
                <a :href="`${baseURL}${form.sensor.nh3n[index].brochureFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
              </small>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Dukungan Brand Sensor</label>
            <div class="col-lg-10">
              <base-input :name="`Dukungan Brand Sensor NH3N ${index + 1}`" rules="required">
                <file-input
                  :disabled="uploading"
                  accept="application/pdf"
                  :ref="`supportFile-nh3n-${index}`"
                  @change="uploadSensorFile('nh3n', index, 'supportFile')" />
                <base-progress
                  v-if="form.sensor.nh3n[index].supportFile.upload >= 1"
                  class="mb-0"
                  :type="form.sensor.nh3n[index].supportFile.progress >= 100 ? 'green' : 'orange'"
                  :value="form.sensor.nh3n[index].supportFile.progress" />
              </base-input>
              <small
                v-if="form.sensor.nh3n[index].supportFile.upload == 2 || form.sensor.nh3n[index].supportFile.path"
                class="d-block mt--3 text-justify">
                <a :href="`${baseURL}${form.sensor.nh3n[index].supportFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
              </small>
            </div>
          </div>
          <hr v-if="form.sensor.nh3n.length > 1 && form.sensor.nh3n.length != index+1" />
        </div>
        <div class="d-flex justify-content-end pr-4 pb-4">
          <base-button class="bg-secondary" @click="addSensor('nh3n')">
            <i class="fa fa-plus" aria-hidden="true"></i>
            Tambah Sensor NH3N
          </base-button>
        </div>

        <!-- DEBIT -->
        <div class="px-4 pt-4">
          <p class="sensor-header">Debit</p>
        </div>
        <div v-for="(debit, index) in form.sensor.debit" :key="`debit${index}`" class="card-body pb-0">
        <p class="font-weight-bold text-primary">
            Sensor #{{ index + 1}} | 
            <base-button class="bg-danger btn-sm" @click="removeSensor('debit', index)">
              <i class="fas fa-trash-alt"></i>
              Hapus
            </base-button>
          </p>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Brand</label>
            <div class="col-lg-10">
              <base-input
                :name="`Brand Debit ${index + 1}`"
                rules="required"
                v-model="form.sensor.debit[index].brand" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Probe</label>
            <div class="col-lg-10">
              <base-input
                :name="`Probe Debit ${index + 1}`"
                rules="required"
                v-model="form.sensor.debit[index].probe" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Range Pengukuran</label>
            <div class="col-lg-10 d-flex px-0">
              <div class="col">
                <small>Minimal</small>
                <base-input
                  :name="`Minimal Pengukuran Debit ${index + 1}`"
                  rules="required"
                  v-model="form.sensor.debit[index].minMeasurement" />
              </div>
              <div class="col">
                <small>Maksimal</small>
                <base-input
                  :name="`Maksimal Pengukuran Debit ${index + 1}`"
                  rules="required"
                  v-model="form.sensor.debit[index].maxMeasurement" />
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Metode Pengukuran</label>
            <div class="col-lg-10">
              <base-input
                :name="`Metode Pengukuran Debit ${index + 1}`"
                rules="required"
                v-model="form.sensor.debit[index].measurementMethod" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Jadwal Kalibrasi</label>
            <div class="col-lg-10">
              <base-input :name="`Jadwal Kalibrasi Debit ${index + 1}`" rules="required">
                <el-select v-model="form.sensor.debit[index].calibrationSchedule">
                  <el-option v-for="bulan in 12" :key="bulan" :label="`${bulan} Bulan`" :value="`${bulan} Bulan`" />
                </el-select>
              </base-input>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Metode Kalibrasi</label>
            <div class="col-lg-10">
              <base-input
                :name="`Metode Kalibrasi Debit ${index + 1}`"
                rules="required"
                v-model="form.sensor.debit[index].calibrationMethod" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Brosur Spesifikasi Sensor</label>
            <div class="col-lg-10">
              <base-input :name="`Brosur Spesifikasi Sensor Debit ${index + 1}`" rules="required" >
                <file-input
                  :disabled="uploading"
                  accept="application/pdf"
                  :ref="`brochureFile-debit-${index}`"
                  @change="uploadSensorFile('debit', index, 'brochureFile')" />
                <base-progress
                  v-if="form.sensor.debit[index].brochureFile.upload >= 1"
                  class="mb-0"
                  :type="form.sensor.debit[index].brochureFile.progress >= 100 ? 'green' : 'orange'"
                  :value="form.sensor.debit[index].brochureFile.progress" />
              </base-input>
              <small
                v-if="form.sensor.debit[index].brochureFile.upload == 2 || form.sensor.debit[index].brochureFile.path"
                class="d-block mt--3 text-justify">
                <a :href="`${baseURL}${form.sensor.debit[index].brochureFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
              </small>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-2 col-form-label form-control-label">Dukungan Brand Sensor</label>
            <div class="col-lg-10">
              <base-input :name="`Dukungan Brand Sensor Debit ${index + 1}`" rules="required">
                <file-input
                  :disabled="uploading"
                  accept="application/pdf"
                  :ref="`supportFile-debit-${index}`"
                  @change="uploadSensorFile('debit', index, 'supportFile')" />
                <base-progress
                  v-if="form.sensor.debit[index].supportFile.upload >= 1"
                  class="mb-0"
                  :type="form.sensor.debit[index].supportFile.progress >= 100 ? 'green' : 'orange'"
                  :value="form.sensor.debit[index].supportFile.progress" />
              </base-input>
              <small
                v-if="form.sensor.debit[index].supportFile.upload == 2 || form.sensor.debit[index].supportFile.path"
                class="d-block mt--3 text-justify">
                <a :href="`${baseURL}${form.sensor.debit[index].supportFile.path}`" target="_blank" class="rounded bg-primary p-2 text-white">Lihat file</a>
              </small>
            </div>
          </div>
          <hr v-if="form.sensor.debit.length > 1 && form.sensor.debit.length != index+1" />
        </div>
        <div class="d-flex justify-content-end pr-4 pb-4">
          <base-button class="bg-secondary" @click="addSensor('debit')">
            <i class="fa fa-plus" aria-hidden="true"></i>
            Tambah Sensor Debit
          </base-button>
        </div>
      </div>

      <div class="d-flex justify-content-end pr-4 pb-4">
          <base-button v-if="data" class="bg-primary" :disabled="disabled" @click="update">
            Ubah
          </base-button>
          <base-button v-else class="bg-primary" :disabled="disabled" @click="submit">
            Simpan
          </base-button>
        </div>
    </form>
  </validation-observer>
</div>
</template>

<script>
import { Select, Option } from "element-ui";
import { BaseInput } from "@/components";
import FileInput from "@/components/Inputs/FileInput";
import axios from "axios";
import swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { jenisIndustri } from "@/data/jenis-industri";
import defaults from "@/util/defaults";

const uploadFile = { path: "", upload: 0, progress: 0 };
const sensorField = {
  brand: null,
  probe: null,
  maxMeasurement: null,
  minMeasurement: null,
  measurementMethod: null,
  calibrationSchedule: null,
  calibrationMethod: null
};

export default {
  components: {
    FileInput,
    BaseInput,
    [Select.name]: Select,
    [Option.name]: Option,
  },

  props: {
    data: {
      type: Object,
      defaults: {},
    },
    id: {
      type: String,
      defaults: "",
    },
  },

  data() {
    return {
      provinces: [],
      cities: [],
      region: [],
      uploading: false,
      disabled: false,
      baseURL: defaults.baseURL,
      form: {
        umum: {
          companyName: null,
          companyID: null,
          companyType: null,
          siupFile: { ...uploadFile },
          responsiblePerson: null,
          companyAddress: null,
          companyProvince: null,
          companyCity: null,
          companyPhone: null,
          companyMail: null,
          responsibleTestPerson: null,
          responsibleTestPhone: null,
          responsibleTestMail: null,
        },
        logger: [{ brand: null, type: null }],
        sensor: {
          ph: [{ ...sensorField, brochureFile: { ...uploadFile }, supportFile: { ...uploadFile } }],
          cod: [{ ...sensorField, brochureFile: { ...uploadFile }, supportFile: { ...uploadFile } }],
          tss: [{ ...sensorField, brochureFile: { ...uploadFile }, supportFile: { ...uploadFile } }],
          nh3n: [{ ...sensorField, brochureFile: { ...uploadFile }, supportFile: { ...uploadFile } }],
          debit: [{ ...sensorField, brochureFile: { ...uploadFile }, supportFile: { ...uploadFile } }],
        },
      },
      jenisIndustri,
    }
  },
  methods: {
    async getProvince() {
      try {
        const region = await axios.get(`${defaults.baseURL}/report/list/5f340d5e328182315c11ee98`);
        this.provinces = region.data.provList;
        this.region = region.data.kabkotList;
        this.cities = region.data.kabkotList;
      } catch (err) {
        console.log(err);
      }
    },
    getCity(province) {
      this.cities = this.region.filter(item => item.provID === province);
    },
    addLogger() {
      this.form.logger.push({
        brand: null,
        type: null
      })
    },
    removeLogger(index) {
      this.form.logger.splice(index, 1);
    },
    addSensor(unit) {
      this.form.sensor[unit].push({ ...sensorField, brochureFile: { ...uploadFile }, supportFile: { ...uploadFile } })
    },
    removeSensor(unit, index) {
      this.form.sensor[unit].splice(index, 1);
    },
    uploadFile(category, field) {
      this.uploading = true;
      this.form[category][field].upload = 1;
      let formData = new FormData();
      formData.append("picture", this.$refs[field].files[0]);

      axios.post(`${defaults.baseURL}/file`, formData, {
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
          swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: `Silakan Upload Ulang`,
          });
        });
    },
    uploadSensorFile(category, index, field) {
      this.uploading = true;
      this.form.sensor[category][index][field].upload = 1;
      let formData = new FormData();
      formData.append("picture", this.$refs[`${field}-${category}-${index}`][0].files[0]);
      axios.post(`${defaults.baseURL}/file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: function (progressEvent) {
            this.form.sensor[category][index][field].progress = parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        }.bind(this),
      })
        .then((res) => {
          this.form.sensor[category][index][field].upload = 2;
          this.form.sensor[category][index][field].path = res.data.path;
          this.uploading = false;
        })
        .catch((err) => {
          this.form.sensor[category][index][field].upload = 0;
          this.uploading = false;
          swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: `Silakan Upload Ulang`,
          });
        });
    },
    async submit() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (!tempValidate) {
        swal.fire({
            icon: 'error',
            text: `Data belum lengkap`,
          });
      } else {
        this.disabled = true;
        const data = await axios.post(`${defaults.baseURL}/api/v1/ujikonek/create`, { form: this.form });
        if (data.status === 200) {
          swal.fire({
            icon: 'success',
            title: 'Tersimpan',
            text: `Data anda telah teregister dengan ID Pendaftaran: ${data.data.data._id}`,
          }).then(async () => {
            this.disabled = false;
            await this.$router.push("/");
          });
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
    async update() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (!tempValidate) {
        swal.fire({
            icon: 'error',
            text: `Data belum lengkap`,
          });
      } else {
        this.disabled = true;
        const data = await axios.put(`${defaults.baseURL}/api/v1/ujikonek/${this.id}`, this.form);
        if (data.status === 200) {
          swal.fire({
            icon: 'success',
            title: 'Tersimpan',
            text: `Perubahan data telah tersimpan`,
          }).then(async () => {
            this.disabled = false;
            await this.$router.push("/");
          });
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
  },
  created() {
    this.getProvince();
  },
  mounted() {
    if (this.data) {
      this.form = this.data;
    }
  },
}
</script>
<style scoped>
.sensor-header {
  padding: 14px 10px;
  border-radius: 6px;
  background-color: #7C9552;
  color: #ffffff;
  font-weight: 600;
}
</style>