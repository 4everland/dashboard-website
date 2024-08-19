<template>
  <div class="tg-start-boost">
    <TgStartBoostLoading v-if="loading"></TgStartBoostLoading>
    <div class="start-boost-bg" v-else>
      <div class="start-boost-content">
        <img src="/img/booster/boost-icon.png" width="64" alt="" />
        <div class="start-boost-title mt-3">Welcome</div>
        <div class="mt-1">
          4EVER Boost is live! Let's start earning together!
        </div>
        <v-btn
          class="start-btn mt-4"
          :loading="tgLoading"
          @click="handleTgStart"
          >START MINING</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TgStartBoostLoading from "./tg-start-boost-loading.vue";
import { initTgBoost } from "@/api/booster";
import { sendTGStoken, sendStoken } from "@/api/login.js";

export default {
  data() {
    return {
      loading: true,
      tgLoading: false,
    };
  },

  async created() {
    setTimeout(() => {
      this.loading = false;
      console.log(this.loading, "loading...");
    }, 3000);

    if (this.isTg) {
      await this.tgMiniAppLogin();
    }
    this.$store.dispatch("getBoosterUserInfo");
    this.$store.dispatch("getExploreRemain");
  },
  computed: {
    ...mapGetters(["notLogin", "boostLocked"]),
    isTg() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
  },
  methods: {
    async handleTGStartBoost() {
      let code = this.$tg.initDataUnsafe.start_param;
      if (code) {
        code = decodeURI(code);
      }
      this.tgLoading = true;
      await initTgBoost(code || "");
      this.tgLoading = false;
      this.$store.dispatch("getBoosterUserInfo");
    },

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
