<template>
  <div></div>
</template>

<script>
import Loading from "vue-loading-overlay";
export default {
  components: {
    Loading,
  },
  created() {
    let loader = this.$loading.show({ loader: "dots" });
    this.toLogout();
    setTimeout(() => {
      loader.hide();
    }, 1500);

    this.$router.push("/login").catch(() => {});
  },
  methods: {
    toLogout() {
      localStorage.removeItem("auth-data");
    },
  },
};
</script>

<style>
</style>
