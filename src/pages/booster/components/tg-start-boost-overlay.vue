<template>
  <div class="tg-start-boost">
    <TgStartBoostLoading v-if="overlayLoading"></TgStartBoostLoading>
    <div class="start-boost-bg" v-else>
      <div class="start-boost-content">
        <img src="/img/booster/boost-icon.png" width="64" alt="" />
        <div class="start-boost-title mt-3">Welcome</div>
        <div class="mt-1">
          4EVER Boost is live! Let's start earning together!
        </div>
        <v-btn
          class="start-btn mt-4"
          :loading="btnLoading"
          @click="handleTGStartBoost"
          >START BOOST</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import TgStartBoostLoading from "./tg-start-boost-loading.vue";
import { initTgBoost } from "@/api/booster";
import { sendTGStoken, sendStoken } from "@/api/login.js";
import { bus } from "@/utils/bus";
import { conversionAds } from "@/api/ton-ads";

export default {
  data() {
    return {
      btnLoading: false,
      overlayLoading: true,
    };
  },

  async created() {
    if (this.isTgMiniApp) {
      await this.tgMiniAppLogin();
    }
  },
  computed: {
    ...mapState({
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
    }),
    ...mapGetters(["notLogin", "boostLocked"]),
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
  },
  methods: {
    async handleTGStartBoost() {
      let code = this.$tg.initDataUnsafe.start_param;

      if (code) {
        code = decodeURI(code);
      }
      this.btnLoading = true;
      await initTgBoost(code || "");
      this.btnLoading = false;
      await this.$store.dispatch("getBoosterUserInfo");
      this.overlayLoading = false;
      if (this.boosterInfo.totalPoint > 0) {
        bus.$emit("showEndBoostEvent");
      }
    },

    async tgMiniAppLogin() {
      const { data: datas } = await sendTGStoken(this.$tg.initData);
      console.log(datas);
      const { data } = await sendStoken(datas.stToken);
      this.onLoginData(data);
    },
    async onLoginData(data) {
      try {
        localStorage.authData = JSON.stringify(data);
        localStorage.token = data.accessToken;
        localStorage.nodeToken = data.nodeToken;
        this.$store.dispatch("getBalance");
        await this.$store.dispatch("getBoosterUserInfo");
        this.$store.dispatch("getExploreRemain");
        this.getUesrInfo();
      } catch (error) {
        console.log(error);
        if (error.code == 11013) {
          await this.handleTGStartBoost();
        }
      }
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
  components: {
    TgStartBoostLoading,
  },
};
</script>

<style lang="scss" scoped>
.tg-start-boost {
  z-index: 100;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6.5px);
  .start-boost-bg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: url("/img/booster/svg/mobile-tg-background.svg") no-repeat;
    background-size: contain;
    width: 312px;
    height: 197px;
    .start-boost-content {
      padding: 0 16px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: absolute;
      left: 50%;
      top: -20px;
      font-size: 12px;
      transform: translateX(-50%);
      .start-boost-title {
        font-size: 20px;
        text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.5);
      }

      .start-btn {
        padding: 12px 32px;
        border-radius: 4px;
        background: rgba(97, 114, 243, 0.75);
        box-shadow: 0px 0px 16px 0px rgba(137, 234, 251, 0.5);
        backdrop-filter: blur(2px);
        color: #fff !important;
      }
    }
  }
}
</style>
