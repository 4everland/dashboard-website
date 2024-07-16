<template>
  <div class="nft-drawer-box">
    <!-- <v-btn color="primary" @click="drawer = !drawer">open</v-btn> -->
    <v-navigation-drawer
      class="nft-drawer"
      v-model="drawer"
      absolute
      bottom
      temporary
      hide-overlay
      color="#4C5277"
      width="558"
      height="648"
    >
      <div>123</div>
    </v-navigation-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      drawer: true,
      items: [
        { title: "Dashboard", icon: "mdi-view-dashboard" },
        { title: "Photos", icon: "mdi-image" },
        { title: "About", icon: "mdi-help-box" },
      ],
      right: null,
    };
  },
};
</script>
<style lang="scss" scoped>
.nft-drawer-box {
  position: relative;
  top: -714px;
  .nft-drawer {
    width: 558px;
    height: 648px;
  }
}
</style>
