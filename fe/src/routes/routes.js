import axios from "axios";

import DashboardLayout from "@/views/Layout/DashboardLayout.vue";
import AuthLayout from "@/views/Pages/AuthLayout.vue";
import FullLayout from "@/views/Pages/FullLayout.vue";
import NotFound from "@/views/GeneralViews/NotFoundPage.vue";
import Validating from "@/views/GeneralViews/ValidatingPage.vue";
import tte from "@/views/GeneralViews/ttePage.vue";
import Recovery from "@/views/GeneralViews/Recovery.vue";
import ForgotPassword from "@/views/GeneralViews/ForgotPassword.vue";
import defaults from "@/util/defaults";

// Stand Alone Page
const Pendaftaran = () => import("@/views/Pages/Pendaftaran.vue");
const peraturan = () => import("@/views/Pages/Peraturan.vue");
const Pertanggungan = () => import("@/views/Pages/Pertanggungan.vue");
const Login = () => import("@/views/Pages/Login.vue");
const Home = () => import("@/views/Pages/Home.vue");
const Logout = () => import("@/views/Pages/Logout.vue");
const TV = () => import("@/views/Pages/TV.vue");
const UjiKonektifitas = () =>
  import("@/views/Pages/UjiKonektifitas/BaseUjiKonektifitas.vue");
const listUjiKonektifitas = () =>
  import("@/views/Pages/UjiKonektifitas/ListUjiKonektifitas.vue");
const detailUjiKonektifitas = () =>
  import("@/views/Pages/UjiKonektifitas/DetailUjiKonektifitas.vue");
// Import MENU
const projectSites = () => import("@/views/Pages/ProjectSites.vue");
// const dashboard = () => import("@/views/Pages/Dashboard.vue");
const DashboardNew = () => import("@/views/Pages/DashboardNew.vue");
const dashboardAdmin = () => import("@/views/Pages/DashboardAdmin.vue");
const myProfile = () => import("@/views/Pages/MyProfile/BaseMyProfile.vue");
const analytics = () => import("@/views/Pages/Analytics.vue");
const errorLogs = () => import("@/views/Pages/ErrorLogs.vue");
const errorLogsHourly = () => import("@/views/Pages/ErrorLogsHourly.vue");
const errorLogsDay = () => import("@/views/Pages/ErrorLogsDay.vue");
const errorLogsOneMonth = () => import("@/views/Pages/ErrorLogsOneMonth.vue");
const errorLogsTwoMonth = () => import("@/views/Pages/ErrorLogsTwoMonth.vue");
// const informasi = () => import("@/views/Pages/Informasi.vue");
const listedData = () => import("@/views/Pages/Reports/ListedData.vue");
const statusPengirimanData = () =>
  import("@/views/Pages/Reports/statusPengiriman.vue");
const hourlyData = () => import("@/views/Pages/Reports/HourlyData.vue");
const dailyData = () => import("@/views/Pages/Reports/DailyData.vue");
const monthlyData = () => import("@/views/Pages/Reports/MonthlyData.vue");
const dataLogger = () => import("@/views/Pages/Admin/DataLogger.vue");
const dataLoggerForm = () => import("@/views/Pages/Admin/DataLoggerForm.vue");
const industri = () => import("@/views/Pages/Admin/Industri.vue");
const industriForm = () => import("@/views/Pages/Admin/IndustriForm.vue");
const user = () => import("@/views/Pages/Admin/User.vue");
const userForm = () => import("@/views/Pages/Admin/UserForm.vue");
const listPendaftar = () => import("@/views/Pages/Admin/ListPendaftaran.vue");
const listPertanggungan = () =>
  import("@/views/Pages/Admin/ListPertanggungan.vue");
const detailPendaftar = () => import("@/views/Pages/Admin/DetailPendaftar.vue");
const detailValidasi = () => import("@/views/Pages/Admin/DetailValidasi.vue");
const detailPertanggungan = () =>
  import("@/views/Pages/Admin/DetailPertanggungan.vue");
const pengumuman = () => import("@/views/Pages/Pengumuman.vue");
const faq = () => import("@/views/Pages/Faq.vue");
const pertanyaanUmum = () => import("@/views/Pages/Admin/PertanyaanUmum.vue");
const publikasi = () => import("@/views/Pages/Admin/Publikasi.vue");
const validasiPendaftaran = () =>
  import("@/views/Pages/Admin/ValidasiPendaftaran.vue");
const UjiKalibrasi = () => import("@/views/Pages/UjiKalibrasi/ListUjiKalibrasi.vue");
const pelaporanKondisi = () => import("@/views/Pages/PelaporanKondisi.vue");
const kondisiTidakNormal = () =>
  import("@/views/Pages/KondisiTidakNormal/BaseKondisiTidakNormal.vue");
const kondisiTidakNormalDetail = () =>
  import("@/views/Pages/KondisiTidakNormal/DetailKondisiTidakNormal.vue");
const kondisiTidakNormalForm = () =>
  import("@/views/Pages/KondisiTidakNormal/FormKondisiTidakNormal.vue");
// const beritaAcara2 = () => import("@/views/Pages/BeritaAcara.vue");
// const beritaAcaraForm = () => import("@/views/Pages/BeritaAcaraForm.vue");
const beritaAcara = () =>
  import("@/views/Pages/BeritaAcara/ListBeritaAcara.vue");
const bantuanSparing = () =>
  import("@/views/Pages/BantuanSparing/ListBantuanSparing.vue");
const manualReport = () =>
  import("@/views/Pages/ManualReport/ListManualReport.vue");
const beforeEnter = async (_to, _from, next) => {
  const token = JSON.parse(localStorage.getItem("auth-data"));
  // !token ? next({ name: "Login" }) : next();
  if (!token) {
    next({ name: "Login" });
  } else {
    try {
      const authData = JSON.parse(localStorage.getItem("auth-data"));
      const roles = ["admin", "prov", "kabkot"];
      const isAdmin = roles.includes(token.userRole.role);

      if (isAdmin) next();

      if (authData.userRole.compID) {
        const { data } = await axios.get(
          `${defaults.baseURL}/pendaftaran/cek-kalibrasi/${authData.userRole.compID}`
        );

        if (Object.keys(data).length && data.show) {
          localStorage.setItem("forceUpdate", JSON.stringify(data));
          next({ name: "Pendaftaran SPARING" });
        } else {
          next();
        }
      }
    } catch (err) {
      console.error("err", err);
    }
  }
};

let menu = {
  beforeEnter,
  path: "/content",
  component: DashboardLayout,
  redirect: "/content",
  name: "content",
  children: [
    {
      path: "projectsites",
      name: "Project Sites",
      component: projectSites
    },
    {
      path: "dashboard-admin",
      name: "Dashboard Admin",
      component: dashboardAdmin
    },
    {
      path: "profil-perusahaan",
      name: "profil-perusahaan",
      component: myProfile
    },
    // {
    //   path: "dashboard",
    //   name: "Dashboard",
    //   component: dashboard
    // },
    {
      path: "dashboard-new",
      name: "Dashboard New",
      component: DashboardNew
    },
    {
      beforeEnter: (to, form, next) => {
        const token = JSON.parse(localStorage.getItem("auth-data"));
        const userRole = token.userRole.role;
        userRole !== "comp" ? next() : next({ path: "/content/projectsites" });
      },
      path: "analytics",
      name: "Analytics",
      component: analytics
    },
    {
      path: "errorlogs",
      name: "Error Logs",
      component: errorLogs
    },
    {
      path: "errorlogshourly",
      name: "Error Logs Hourly",
      component: errorLogsHourly
    },
    {
      path: "errorlogsday",
      name: "Error Logs Day",
      component: errorLogsDay
    },
    {
      path: "error-logs-one-month",
      name: "error-logs-one-month",
      component: errorLogsOneMonth
    },
    {
      path: "error-logs-two-month",
      name: "error-logs-two-month",
      component: errorLogsTwoMonth
    },
    {
      path: "pengumuman/:render",
      name: "Pengumuman",
      component: pengumuman
    },
    {
      path: "pelaporan-kondisi/:render",
      name: "Pelaporan Kondisi",
      component: pelaporanKondisi
    },
    {
      path: "pelaporan-kondisi-tidak-normal",
      name: "pelaporan-kondisi-tidak-normal",
      component: kondisiTidakNormal
    },
    {
      path: "detail-kondisi-tidak-normal/:id",
      name: "detail-kondisi-tidak-normal",
      component: kondisiTidakNormalDetail
    },
    {
      path: "tambah-kondisi-tidak-normal",
      name: "tambah-kondisi-tidak-normal",
      component: kondisiTidakNormalForm
    },
    {
      path: "uji-kalibrasi",
      name: "Uji Kalibrasi",
      component: UjiKalibrasi,
    },
    // {
    //   path: "berita-acara/:render",
    //   name: "Berita Acara Verifikasi Lapangan",
    //   component: beritaAcara2
    // },
    // {
    //   path: "beritaAcara-form",
    //   name: "Form Berita Acara Verifikasi Lapangan",
    //   component: beritaAcaraForm
    // },
    {
      path: "weekly-manual-report",
      name: "weekly-manual-report",
      component: manualReport
    },
    {
      path: "list-berita-acara",
      name: "berita-acara-verifikasi-lapangan",
      component: beritaAcara
    },
    {
      path: "bantuan-sparing",
      name: "bantuan-sparing",
      component: bantuanSparing
    }
  ]
};

let reports = {
  beforeEnter,
  path: "/reports",
  component: DashboardLayout,
  redirect: "/reports",
  name: "reports",
  children: [
    // {
    //   path: "listeddata",
    //   name: "Listed Data",
    //   component: listedData
    // },
    {
      path: "hourly-report",
      name: "hourly-report",
      component: hourlyData
    },
    {
      path: "daily-report",
      name: "daily-report",
      component: dailyData
    },
    {
      path: "monthly-report",
      name: "monthly-report",
      component: monthlyData
    },
    {
      path: "statusPengiriman",
      name: "Status Pengiriman",
      component: statusPengirimanData
    }
  ]
};

let admin = {
  beforeEnter: (to, form, next) => {
    const token = JSON.parse(localStorage.getItem("auth-data"));
    const userRole = token.userRole.role;
    userRole !== "admin" || !token
      ? next({ path: "/content/projectsites" })
      : next();
  },
  path: "/admin",
  component: DashboardLayout,
  redirect: "/admin",
  name: "admin",
  children: [
    {
      path: "datalogger",
      name: "Data Logger",
      component: dataLogger
    },
    {
      path: "dataloggerform",
      name: "Form Data Logger",
      component: dataLoggerForm
    },
    {
      path: "industri",
      name: "Industri",
      component: industri
    },
    {
      path: "industriform",
      name: "Form Industri",
      component: industriForm
    },
    {
      path: "user",
      name: "User",
      component: user
    },
    {
      path: "userform",
      name: "Form User",
      component: userForm
    },
    {
      path: "list/pendaftar",
      name: "List Pendaftar",
      component: listPendaftar
    },
    {
      path: "list/ujikonek",
      name: "List Uji Konek",
      component: listUjiKonektifitas
    },
    {
      path: "ujikonek/detail/:id",
      name: "Detail Uji Konek",
      component: detailUjiKonektifitas
    },
    {
      path: "list/pertanggungan",
      name: "List Pertanggungan",
      component: listPertanggungan
    },
    {
      path: "detail/pendaftar",
      name: "Detail Pendaftar",
      component: detailPendaftar
    },
    {
      path: "detail/validasi",
      name: "Detail Validasi",
      component: detailValidasi
    },
    {
      path: "detail/pertanggungan",
      name: "Detail Pertanggungan",
      component: detailPertanggungan
    },
    {
      path: "faq",
      name: "Pertanyaan Umum",
      component: pertanyaanUmum
    },
    {
      path: "publikasi",
      name: "Publikasi",
      component: publikasi
    },
    {
      path: "validasi-pendaftaran",
      name: "validasi-pendaftaran",
      component: validasiPendaftaran
    }
  ]
};

let dashboardPages = {
  path: "/",
  component: DashboardLayout,
  redirect: "/",
  name: "home"
  // children: [
  //   {
  //     path: "informasi",
  //     name: "Informasi",
  //     component: informasi
  //   }
  // ]
};

let fullPages = {
  path: "/",
  component: FullLayout,
  redirect: "/",
  name: "Entry",
  children: [
    {
      path: "entry/sparing",
      name: "Pendaftaran SPARING",
      component: Pendaftaran
    },
    {
      path: "entry/covid-19",
      name: "Pertanggungan COVID-19",
      component: Pertanggungan
    },
    {
      path: "entry/ujikonek",
      name: "Uji Konektifitas",
      component: UjiKonektifitas
    },
    {
      path: "peraturan",
      name: "Peraturan",
      component: peraturan
    },
    {
      path: "faq",
      name: "Faq",
      component: faq
    },
    {
      path: "test",
      name: "test",
      component: TV
    },
    {
      path: "password-recovery",
      name: "Password Recovery",
      component: Recovery
    },
    {
      path: "forgot-password",
      name: "Forgot Password",
      component: ForgotPassword
    }
  ]
};

let authPages = {
  path: "/",
  component: AuthLayout,
  name: "Authentication",
  children: [
    {
      path: "/home",
      name: "Home",
      component: Home,
      meta: {
        noBodyBackground: true
      }
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        noBodyBackground: true
      }
    },
    {
      path: "/logout",
      name: "Logout",
      component: Logout,
      meta: {
        noBodyBackground: true
      }
    }
  ]
};

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  menu,
  reports,
  admin,
  authPages,
  fullPages,
  dashboardPages,
  { path: "/validating", component: Validating },
  { path: "/tte", component: tte },
  { path: "*", component: NotFound }
];
export default routes;
