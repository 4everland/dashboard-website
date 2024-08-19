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
import { sendTGStoken, sendStoken } from "@/api/login.js";

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
  computed: {
    isTg() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
  },
  async created() {
    if (this.isTg) {
      await this.tgMiniAppLogin();
    }

    this.$store.dispatch("getBoosterUserInfo");
    this.$store.dispatch("getExploreRemain");
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

  methods: {
    async tgMiniAppLogin() {
      const { data: datas } = await sendTGStoken(this.$tg.initDataUnsafe);
      console.log(datas);
      const { data } = await sendStoken(datas.stToken);
      this.onLoginData(data);
    },
    onLoginData(data) {
      localStorage.authData = JSON.stringify(data);
      localStorage.token = data.accessToken;
      localStorage.nodeToken = data.nodeToken;
      this.$store.dispatch("getBalance");
      this.$store.dispatch("getBoosterUserInfo");
      this.getUesrInfo();
    },

    async getUesrInfo() {
      const { data } = await this.$http.get("$auth/user");
      localStorage.userInfo = JSON.stringify(data);
      this.$setState({
        userInfo: data,
        allowNoLogin: this.allowNoLogin && !data.github,
      });
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
}
</style>
