<template>
  <div class="booster-container">
    <Navbar
      class="nav"
      @open-drawer="drawer = true"
      v-if="!meta.hideBoostNav"
    ></Navbar>

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
      v-if="!isTgMiniApp"
      v-model="showDeposit"
      :depositLand="depositLand"
      :report="report"
    ></DepositDialog>

    <TonDeposit
      v-else
      v-model="showDeposit"
      :depositLand="depositLand"
      :report="report"
    ></TonDeposit>
  </div>
</template>

<script>
import Navbar from "./nav-bar.vue";
import AsideDrawer from "./aside-drawer.vue";
import DepositDialog from "../components/deposit-dialog.vue";
import { bus } from "@/utils/bus";
import TonDeposit from "../components/ton-deposit.vue";
import { validPlayBot } from "@/api/booster";
import { conversionAds } from "@/api/ton-ads";

export default {
  components: {
    Navbar,
    DepositDialog,
    AsideDrawer,
    TonDeposit,
  },
  data() {
    return {
      drawer: false,
      showDeposit: false,
      depositLand: 0,
      report: false,
    };
  },
  computed: {
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
    meta() {
      return this.$route.meta || {};
    },
  },

  async created() {
    bus.$on("showDepositDialog", ({ land, report }) => {
      if (report) {
        this.report = report;
      } else {
        this.report = false;
      }
      this.depositLand = land;
      this.showDeposit = true;
    });
    try {
      await this.$store.dispatch("getBoosterUserInfo");
      this.$store.dispatch("getExploreRemain");
      this.handleValid();
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async handleValid() {
      try {
        let code = this.$tg.initDataUnsafe.start_param;

        if (code) {
          code = decodeURI(code);
          if (code == "t-peaai") {
            const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
            await conversionAds(userId);
          }
          await validPlayBot(code);
        }
      } catch (error) {
        console.log(error);
      }
    },
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
  background: #000;
}
</style>
