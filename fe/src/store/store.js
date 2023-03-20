import Vue from "vue";
import Vuex from "vuex";
import defaults from "@/util/defaults";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    token: null,
    api: {
      url: defaults.baseURL
    },
    tte: null,
    auth: {
      name: "KLHK Pusat",
      level: 0
    },
    data: {
      admin: {
        pendaftar: null,
        covid: null
      }
    },
    render: {
      AuthLayout: {
        menuButton: {
          name: "Masuk",
          path: "/login"
        }
      },
      DashboardLayout: {
        notification: {
          status: false,
          popped: false
        }
      },
      panduanSparing: false
    },
    userData: {
      _id: "",
      userEmail: "",
      userRole: {
        role: "",
        kabkotID: "",
        provId: "",
        compID: ""
      }
    },
    userEditData: {},
    beritaAcaraEditData: {},
    compEditData: {}
  },
  mutations: {
    tooglePanduan(state) {
      state.render.panduanSparing
        ? (state.render.panduanSparing = false)
        : (state.render.panduanSparing = true);
    },
    setPendaftarData(state, data) {
      state.data.admin.pendaftar = data;
    },
    setCOVIDData(state, data) {
      state.data.admin.covid = data;
    },
    setTTE(state, data) {
      state.tte = data;
    },
    toggleNotificationBubble(state) {
      if (state.render.DashboardLayout.notification.popped)
        state.render.DashboardLayout.notification.popped = false;
      else state.render.DashboardLayout.notification.popped = true;
    },
    setAuthLevel(state, data) {
      if (data === "admin") {
        state.auth.level = 0;
      }
      if (data === "prov") {
        state.auth.level = 1;
      }
      if (data === "kabkot") {
        state.auth.level = 2;
      }
      if (data === "comp") {
        state.auth.level = 3;
      }
    },
    setUserData(state, data) {
      state.token = data.token;
      state.userData._id = data._id;
      state.userData.userEmail = data.userEmail;
      state.userData.userRole = data.userRole;
      if (data.name != "Admin") {
        state.auth.name = data.name;
      }
    },
    setAuthLayoutButton(state, payload) {
      state.render.AuthLayout.menuButton = payload;
    },
    setUserEditData(state, payload) {
      state.userEditData = payload;
    },
    setBeritaAcaraEditData(state, payload) {
      state.beritaAcaraEditData = payload;
    },
    setCompEditData(state, payload) {
      state.compEditData = payload;
    }
  },
  getters: {}
});
