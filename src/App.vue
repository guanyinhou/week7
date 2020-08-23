<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <Toast />
    <router-view />
  </div>
</template>

<style lang="scss">
@import "./assets/scss/all.scss";
</style>

<script>
import Toast from "@/components/Toast.vue";
export default {
  components: {
    Toast
  }
};
</script>
