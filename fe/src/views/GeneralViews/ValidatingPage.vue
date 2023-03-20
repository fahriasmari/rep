<template>
  <div>
    <div class="cover" :style="{backgroundImage: `url('img/theme/img-background-full.png')`}"></div>
    <!-- Header -->
    <div class="d-none header bg-gradient-info py-7 py-lg-8 pt-lg-9">
      <div class="container">
        <div class="header-body text-center mb-7">
          <div class="row justify-content-center">
            <div class="col-xl-5 col-lg-6 col-md-8 px-5">
              <h1 class="text-light">Ooops!</h1>
              <p
                class="text-lead text-white"
              >Page not found. Don't worry though, we have plenty of other pages to explore</p>

              <router-link
                to="/dashboard"
                class="font-weight-bold text-white mt-5"
              >Back to dashboard</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg
          x="0"
          y="0"
          viewBox="0 0 2560 100"
          preserveAspectRatio="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon class="fill-default" points="2560 0 2560 100 0 100" />
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <section class="d-none py-6">
      <div class="container">
        <div class="row row-grid align-items-center">
          <div class="col-md-6">
            <img src="img/theme/landing-2.png" class="img-fluid" />
          </div>
          <div class="col-md-6">
            <div class="pr-md-5">
              <h1 class="text-light">Explore pages</h1>
              <p
                class="text-light"
              >If you want to get inspiration or just show something directly to your clients, you can jump start your development with our pre-built example pages.</p>
              <router-link to="/pages/user" class="font-weight-bold text-warning mt-5">Explore pages</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="container vh-100 d-flex flex-column align-items-center justify-content-center">
      <router-link class="mb-4" to="/">
        <img src="img/brand/img-logo-color.png" />
      </router-link>
      <h1 class="text-white">Data anda sedang dalam proses validasi</h1>
      <small class="text-white">Harap menunggu proses validasi selesai</small>
      <small class="text-white">
        Jika proses validasi sudah lebih dari 7 hari kerja setelah pendaftaran hubungi tim SPARING melalui
        <a
          class="text-white"
          href="mailto:sparing.menlhk@gmail.com"
        >sparing.menlhk@gmail.com</a>.
      </small>
      <small class="text-white">Klik link berikut untuk kembali ke beranda</small>
      <router-link to="/home" class="font-weight-bold text-white mt-4">Kembali ke beranda</router-link>
    </div>
  </div>
</template>1

<script>
export default {
  name: "not-found",
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