<template>
  <div>
    <!-- Page content -->
    <div id="peraturan" class="container pt-8 mb-4">
      <div class="row">
        <div class="col-12">
          <div class="card bg-white border-0">
            <div class="p-4">
              <h2 class="text-justify">Tabel Unduh Publikasi</h2>
            </div>
            <div class="m-10">
              <el-table :data="tableFile" >
                <el-table-column
                  label="No"
                  prop="no"
                  width="100"
                ></el-table-column>
                <el-table-column label="Judul" prop="judul"></el-table-column>

                <el-table-column width="150">
                  <template v-slot="{ row }">
                    <base-button
                      size="sm"
                      type="primary"
                      @click="toDownload(row)"
                      >Download</base-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HtmlEditor from "@/components/Inputs/HtmlEditor";
import { Table, TableColumn, Select, Option } from "element-ui";
import { BasePagination, BaseInput } from "@/components";
import { HourGlass } from "vue-loading-spinner";
import FileInput from "@/components/Inputs/FileInput";
import flatPicker from "vue-flatpickr-component";
import Moment from "moment";
import "flatpickr/dist/flatpickr.css";
import swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import defaults from "@/util/defaults";
import axios from "axios";

export default {
  components: {
    HtmlEditor,
    HourGlass,
    FileInput,
    BaseInput,
    flatPicker,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      tableFile: [
        {
          no: 1,
          title: "PEMBAHASAN KOMITMEN IMPLEMENTASI PERMENLHK NO. P.93 TAHUN 2018 jo. P.80 TAHUN 2019 TENTANG PEMANTAUAN KUALITAS AIR LIMBAH SECARA TERUS MENERUS & DALAM JARINGAN BAGI USAHA DAN/ATAU KEGIATAN (SPARING)",
          url: `${defaults.baseURL}/storage/2021-12-30T093252.364ZMateri Penyampaian Komitmen Industri Wajib SPARING 27 Desember 2021.pdf`,
        },
        {
          no: 2,
          title: "Surat Keterangan Lulus Uji Konektivitas Tahun 2021",
          url: `${defaults.baseURL}/storage/SURAT KETERANGAN LULUS UJI KONEKTIVITAS TAHUN 2021.pdf`,
        },
        {
          no: 3,
          title: "Materi Bimtek Peraturan SPARING 2021- Citarum",
          url: `${defaults.baseURL}/storage/BIMTEK%20PERATURAN%20SPARING_2021T093626.475Z%20CITARUM-AF.pdf`,
        },
        {
          no: 4,
          title: "Petunjuk Teknis Sparing",
          url: `${defaults.baseURL}/storage/Petunjuk%20Teknis%20SPARING_2021T093626.475Z.pdf`,
        },
        {
          no: 5,
          title: "Materi Peraturan SPARING PEMDA",
          url: `${defaults.baseURL}/storage/Petunjuk%20Teknis%20SPARING_PEMDA2021T093626.475Z.pdf`,
        },
        {
          no: 6,
          title: "Bimtek Peraturan Sparing 2021",
          url: `${defaults.baseURL}/storage/2020-08-26T093626.475ZBIMTEK PERATURAN SPARING (c).pdf`,
        },
        {
          no: 7,
          title: "Juknis Sparing 2021",
          url: `${defaults.baseURL}/storage/2020-08-26T093626.475ZJUKNIS SPARING 2021 (c).pdf`,
        },
        {
          no: 8,
          title: "Mekanisme Implementasi Dan Pusat Data Sparing 2021",
          url: `${defaults.baseURL}/storage/2020-08-26T093626.475ZMEKANISME IMPLEMENTASI dan PUSAT DATA SPARING 2021 (c).pdf`,
        },
        {
          no: 9,
          title:
            "Surat Edaran Protokol Pelaksanaan Pemantauan dan Pelaporan Kualitas Lingkungan pada Masa Pandemi Covid-19",
          url: `${defaults.baseURL}/storage/2020-08-26T09:36:26.475ZSurat Edaran Protokol Pelaksanaan Pemantauan dan Pelaporan Kualitas Lingkungan pada Masa Pandemi Covid-19 (c).pdf`,
        },
        {
          no: 10,
          title:
            "Peraturan Menteri Lingkungan Hidup Nomor P.93/MENLHK/SETJEN/KUM.1/8/2018 tentang Pemantauan Kualitas Air Limbah Secara Terus Menerus Dan Dalam Jaringan Bagi Usaha Dan/Atau Kegiatan jo Peraturan Menteri Lingkungan Hidup Nomor P.80/MENLHK/SETJEN/KUM.1/10/2019",
          url: `${defaults.baseURL}/storage/2020-08-26T09:32:19.818ZMaster Buku Peraturan.pdf`,
        },
        {
          no: 11,
          title: "Surat Keterangan Lulus Uji Konektivitas Tahun 2020",
          url: `${defaults.baseURL}/storage/2020-09-07T10:02:29.740ZSURAT%20KETERANGAN%20LULUS%20UJI%20KONEKTIVITAS%20TAHUN%202020.pdf`,
        },
        {
          no: 12,
          title: "Surat Keterangan Lulus Uji Konektivitas Tahun 2019",
          url: `${defaults.baseURL}/storage/2020-08-26T09:32:52.364ZSurat Keterangan Lulus Uji Konektifitas.pdf`,
        },
        // {
        //   no: 13,
        //   title: "Mekanisme Implementasi SPARING DLH",
        //   url: `${defaults.baseURL}/storage/2020-08-26T09:32:52.364ZSurat Keterangan Lulus Uji Konektifitas.pdf`,
        // },
        {
          no: 13,
          title: "Berita Uji Konektivitas 2021",
          url: `${defaults.baseURL}/storage/2021-08-06T093252.364ZBerita Uji Konektivitas 2021.pdf`,
        },
        {
          no: 14,
          title: "UN.593 PPI - Undangan SPARING",
          url: `${defaults.baseURL}/storage/2021-12-22T093252.364ZUN.593 PPI - Undangan SPARING.pdf`,
        },
        
      ],
      isDataCorrect: true,
      res: { comp: null, user: null, logger: null },
      temptSelect: null,
      form: {
        akun: {
          personName: null,
          personPhone: null,
          personMail: null,
          personPassword: null,
          personConfirmPassword: null,
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
          nameSIUP: null,
          ifTambang: {
            status: null,
            jenKegiatan: null,
            kondisiInternet: "",
          },
          rencanaFile: {
            path: "",
            upload: 0,
          },
          siupFile: {
            path: "",
            upload: 0,
          },
        },
        teknis: {
          permitFile: {
            path: "",
            upload: 0,
          },
          permitPerson: null,
          permitNumber: null,
          permitDatePublish: new Date(),
          permitDateExpire: null,
          wasteSource: null,
          spotCount: null,
          spotList: [],
          processingTechnique: null,
          wasteType: null,
          debit: null,
          capacityPermit: null,
          capacityActual: null,
          frequenceDet: "",
        },
        validitas: {
          infoAlat: null,
          lulusUji: null,
          namaPenyedia: null,
          noSurat: null,
          kontrak: {
            path: "",
            upload: 0,
          },
          kinerjaFile: {
            path: "",
            upload: 0,
          },
          konektifitasFile: {
            path: "",
            upload: 0,
          },
          kalibrasiFile: {
            path: "",
            upload: 0,
          },
          kalibrasiRutinFile: {
            path: "",
            upload: 0,
          },
          validitasFile: {
            path: "",
            upload: 0,
          },
        },
        frekuensi: {
          latarBelakang: "",
          detEngIPAL: "",
          fotoIPAL: {
            path: "",
            upload: 0,
          },
          jam: null,
          hari: null,
          bulan: null,
          metUkurDebit: "",
          detEngIPAL: "",
          logBook: {
            path: "",
            upload: 0,
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
            },
            min: null,
            max: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
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
            },
            min: null,
            max: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
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
            },
            min: null,
            max: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
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
            },
            min: null,
            max: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
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
            },
            min: null,
            max: null,
            metodePengukuran: null,
            jadwalKalibrasi: null,
            metodeKalibrasi: null,
          },
        ],
        sensorDone: false,
        surat: {
          dukunganBrand: {
            path: "",
            upload: 0,
          },
          pernyataanVendor: {
            path: "",
            upload: 0,
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
    toDownload(row) {
      
       let url = defaults.baseURL+row.lampiran;
      // window.location.href = row.url;
      window.open(url, "_blank");
    },
    fillThePain() {},
    uploadFile(category, field) {
      this.form[category][field].upload = 1;
      let formData = new FormData();
      formData.append("picture", this.$refs[field].files[0]);
      axios.post(`${defaults.baseURL}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          this.form[category][field].upload = 2;
          this.form[category][field].path = res.data.path;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploadSensorFile(index) {
      this.form.sensor[index].brosurFile.upload = 1;
      let formData = new FormData();
      // console.log(this.form.sensor[index].brosurFile.upload);
      formData.append("picture", this.$refs.brosurFile[index].files[0]);
        axios.post(`${defaults.baseURL}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          this.form.sensor[index].brosurFile.upload = 2;
          this.form.sensor[index].brosurFile.path = res.data.path;
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
        timer: 3000,
      });
    },
    handleSubmit() {
      if (
        this.form.akun.personPassword !== this.form.akun.personConfirmPassword
      ) {
        this.errorSwal("Password yg anda ketik tidak sama!");
        return;
      }
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
    registerHandler() {
      const formDataComp = {
        compName: this.form.umum.compName,
        compAddress: this.form.umum.compAddress,
        compTlp: this.form.umum.compPhone,
        compType: this.form.teknis.wasteType,
        compPermit: this.form.teknis.permitFile.path,
        compWasteSource: this.form.teknis.wasteSource,
        compInstance: this.form.teknis.permitPerson,
        compPermitData: this.form.teknis.permitNumber,
        compTech: this.form.teknis.processingTechnique,
      };
      axios.post(`${defaults.baseURL}/form/pendaftaran`, this.form)
        .then((resForm) => {
          // this.res.logger = resLogger;
          swal.fire("Tersimpan", "Data anda telah terregister", "success");
        })
        .catch((err) => {
          this.errorSwal("Terjadi Error pada data!");
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
    async getList() {
      const { data } = await axios.get(`${defaults.baseURL}/api/v1/publikasi/list`);
      const sortedData = data.data.sort((a, b) => b.created_time - a.created_time)
      let no = 1;
      for(let i=0; i<sortedData.length;i++){
        sortedData[i].no = no++;
      }
      this.tableFile = sortedData
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
      axios.post(this.$store.getters.getAPI.url + "/user/login", this.model)
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
#peraturan {
  .el-table {
    .el-table__row {
      &:hover {
        background: transparent;
        cursor: unset;
      }
    }
  }
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
