<template>
  <div class="booster-container">
    <Navbar class="nav"></Navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from "./nav-bar.vue";
export default {
  components: {
    Navbar,
  },
};
</script>

<style lang="scss" scoped>
.booster-container {
  position: relative;
  height: 100%;
  color: #fff;
}
</style>
