<template>
  <div>
    <!-- Page content -->
    <div class="container">
      <div class="row align-items-center justify-content-center vh-100">
        <div class="col-lg-5 col-md-7">
          <div class="card bg-white border-0 mb-0">
            <div
              class="
                card-header
                bg-transparent
                d-flex
                align-items-center
                justify-content-center
              "
            >
              <img
                src="img/brand/img-logo-color.png"
                alt="Login Logo"
                style="height: 2rem"
                class="mr-2"
              />
              <h2 class="m-0">SPARING KLHK</h2>
            </div>
            <div class="card-body px-lg-5 py-lg-5">
              <validation-observer ref="formValidator">
                <form role="form">
                  <base-input
                    alternative
                    class="mb-3"
                    name="Email"
                    :rules="{ required: true, email: true }"
                    prepend-icon="ni ni-circle-08"
                    placeholder="Email"
                    v-model="model.userEmail"
                  ></base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    name="Password"
                    :rules="{ required: true, min: 6 }"
                    prepend-icon="ni ni-lock-circle-open"
                    append-icon="ni ni-lock-circle-open"
                    :type="isShowPassword ? 'text' : 'password'"
                    placeholder="Password"
                    v-model="model.userPassword"
                  >
                    <template #append>
                      <span
                        @click="isShowPassword = !isShowPassword"
                        style="cursor: pointer"
                      >
                        {{ isShowPassword ? "hide" : "show" }}
                      </span>
                    </template>
                  </base-input>

                  <!-- <base-checkbox v-model="model.rememberMe">Remember me</base-checkbox> -->
                  <div class="text-center">
                    <base-button
                      type="primary"
                      native-type="submit"
                      @click="login"
                      class="w-100"
                      >Masuk</base-button
                    >
                  </div>
                  <router-link to="/forgot-password" class="forgot-password">
                    Lupa Password?
                  </router-link>
                </form>
              </validation-observer>
            </div>
          </div>
          <!-- <div class="row mt-3">
            <div class="col-6">
              <router-link to="/dashboard" class="text-light">
                <small>Lupa password?</small>
              </router-link>
            </div>
            <div class="col-6 text-right">
              <router-link to="/daftar/baru" class="text-light">
                <small>Buat akun baru</small>
              </router-link>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from "axios";
import defaults from "@/util/defaults";
export default {
  data() {
    return {
      isShowPassword: false,
      model: {
        userEmail: "",
        userPassword: ""
        // rememberMe: false,
      }
    };
  },
  beforeMount() {
    this.$store.commit("setAuthLayoutButton", {
      name: "Kembali",
      path: "/home"
    });
    var token = JSON.parse(localStorage.getItem("auth-data"));
    !token
      ? console.log("")
      : this.$router.push("content/projectsites").catch(() => {});
  },
  methods: {
    login() {
      Axios.post(`${defaults.baseURL}/user/login`, this.model)
        .then(res => {
          var auth = JSON.stringify(res.data);
          const authLevel = res.data.userRole.role;
          localStorage.setItem("auth-data", auth);
          this.$store.commit("setUserData", {
            token: res.data.token,
            _id: res.data._id,
            mail: res.data.userEmail,
            role: res.data.userRole
          });

          this.$store.commit("setAuthLevel", authLevel);
          this.$notify({
            message: "Welcome to <b>KLHK SPARING Platform</b>",
            timeout: 5000,
            icon: "ni ni-bell-55",
            type: "success"
          });
          return this.$router.push("/content/projectsites").catch(() => {});
        })
        .catch(err => {
          this.$notify({
            message: err.response.data,
            timeout: 5000,
            icon: "ni ni-bell-55",
            type: "warning"
          });
        });

      // this will be called only after form is valid. You can do api call here to login
    }
  }
};
</script>

<style>
.forgot-password {
  display: block;
  text-align: center;
  margin-top: 1rem;
  font-size: 14px;
}
</style>
