<template>
  <div class="booster-container">
    <Navbar class="nav" @open-drawer="drawer = true"></Navbar>
    <AsideDrawer
      v-model="drawer"
      @showDepositDialog="
        () => {
          this.drawer = false;
          this.showDeposit = true;
        }
      "
    ></AsideDrawer>
    <router-view></router-view>
    <DepositDialog
      v-model="showDeposit"
      :depositLand="depositLand"
      :report="report"
    ></DepositDialog>
  </div>
</template>

<script>
import Navbar from "./nav-bar.vue";
import AsideDrawer from "./aside-drawer.vue";
import DepositDialog from "../components/deposit-dialog.vue";
import { bus } from "@/utils/bus";

export default {
  components: {
    Navbar,
    DepositDialog,
    AsideDrawer,
  },
  data() {
    return {
      drawer: false,
      showDeposit: false,
      depositLand: 10000,
      report: false,
    };
  },

  created() {
    this.$store.dispatch("getBoosterUserInfo");
    bus.$on("showDepositDialog", ({ land, report }) => {
      if (report) {
        this.report = report;
      } else {
        this.report = false;
      }
      if (land > 10000) {
        this.depositLand = land;
      } else {
        this.depositLand = 10000;
      }
      this.showDeposit = true;
    });
  },
};
</script>

<style lang="scss" scoped>
img {
  vertical-align: middle;
}
.booster-container {
  position: relative;
  height: 100%;
  color: #fff;
}
</style>
