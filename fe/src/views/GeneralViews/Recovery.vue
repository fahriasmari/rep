<template>
  <div>
    <div class="cover" :style="{backgroundImage: `url('img/theme/img-background-full.png')`}"></div>
    <div class="container pt-8">
      <div class="row justify-content-center">
        <div class="col col-lg-5 col-md-7">
          <validation-observer ref="formValidator" class="w-100">
            <form class="col-12">
              <card class="p-4">
                <div class="form-row mb-4">
                  <p class="pl-1">Masukkan password baru anda</p>
                  <div class="col-12">
                    <base-input
                      type="password"
                      name="password"
                      v-model="form.password"
                      placeholder="Password Baru"
                      required />
                    <base-input
                      type="password"
                      name="confirmPassword"
                      v-model="form.confirmPassword"
                      placeholder="Ketik Ulang Password Baru"
                      required />
                    <small
                      v-if="!isMatch"
                      class="d-block mt--3 text-justify text-danger">
                      Password yang anda masukan tidak sama
                    </small>
                  </div>
                </div>
                <base-button type="primary" class="w-100" @click="handleSubmit">Ubah Password</base-button>
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

export default {
  name: "recovery",
  data() {
    return {
      isMatch: true,
      form: {
        password: null,
        confirmPassword: null,
      },
    };
  },
  methods: {
    async handleSubmit() {
      const tempValidate = await this.$refs.formValidator.validate();
      if (tempValidate) {
        if (this.form.password === this.form.confirmPassword) {
          this.isMatch = true;
          this.submit();
        } else {
          this.isMatch = false;
        }
      }
    },
    async submit() {
      const { data } = await axios.post(`${defaults.baseURL}/recovery/post-password`, {
        password: this.form.password,
      });
       this.$notify({
        message: "Password berhasil diubah",
        timeout: 5000,
        icon: "ni ni-bell-55",
        type: "success",
      });
    },
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