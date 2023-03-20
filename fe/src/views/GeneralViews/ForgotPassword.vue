<template>
  <div>
    <div class="cover" :style="{backgroundImage: `url('img/theme/img-background-full.png')`}"></div>
    <div class="container pt-8">
      <div class="row justify-content-center">
        <div class="col col-lg-5 col-md-7">
          <validation-observer ref="formValidator" class="w-100">
            <form class="col-12">
              <div class="bg-warning p-2 rounded my-4 text-white text-center">Sedang dalam tahap finalisasi</div>
              <card class="p-4">
                <div class="form-row mb-4">
                  <p class="pl-1">Masukkan email anda, kami akan mengirimkan email untuk mengganti password</p>
                  <div class="col-12">
                    <base-input
                      name="email"
                      v-model="form.email"
                      type="email"
                      autocomplete="username email"
                      placeholder="Email"
                      required/>
                  </div>
                </div>
                <base-button type="primary" class="w-100" click="sendMail">Kirim Email</base-button>
                <base-button class="w-100 mt-4" @click="backToLogin">Kembali</base-button>
              </card>
            </form>
          </validation-observer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import defaults from "@/util/defaults";
import router from "@/routes/router";

export default {
  name: "recovery",
  data() {
    return {
      form: {
        step: 0,
        email: null,
        password: null,
        confirmPassword: null,
      },
      render: {
        email: {
          validity: true,
        },
        password: {
          validity: true,
        },
      },
    };
  },
  methods: {
    async sendMail() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (tempValidate) {
        try {
          // const response = await axios.post(`${defaults.baseURL}/recovery/post-email`, {
          //   email: this.form.email,
          // });
          this.$notify({
            message: "Email berhasil dikirimkan",
            timeout: 5000,
            icon: "ni ni-bell-55",
            type: "success",
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
    backToLogin() {
      router.push('/login');
    }
  },
};
</script>

<style lang="scss" scoped>
.cover {
  height: 100vh;
  min-height: 500px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  width: 100%;
  z-index: -1;
}
</style>