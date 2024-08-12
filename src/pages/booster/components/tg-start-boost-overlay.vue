<template>
  <div class="tg-start-boost">
    <TgStartBoostLoading v-if="loading"></TgStartBoostLoading>
    <div class="start-boost-bg" v-else>
      <div class="start-boost-content">
        <img src="/img/booster/boost-icon.png" width="64" alt="" />
        <div class="start-boost-title mt-3">Welcome</div>
        <div class="mt-1">
          Unlock at 10,000 points Unlock at 10,000 points Unlock at 10,000
          points Unlock at
        </div>
        <v-btn
          class="start-btn mt-4"
          :loading="tgLoading"
          @click="$emit('handleTgStart')"
          >START MINING</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TgStartBoostLoading from "./tg-start-boost-loading.vue";
import { sendTGStoken, sendStoken } from "@/api/login.js";
export default {
  data() {
    return {
      loading: true,
    };
  },
  props: {
    tgLoading: {
      type: Boolean,
      default: false,
    },
  },
  async created() {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
    this.tgMiniAppLogin();
  },
  computed: {
    ...mapGetters(["notLogin", "boostLocked"]),
  },
  methods: {
    async tgMiniAppLogin() {
      if (localStorage.token) return;
      if (Object.keys(this.$tg.initDataUnsafe).length > 0) {
        const { data: datas } = await sendTGStoken(this.$tg.initDataUnsafe);
        console.log(datas);
        const { data } = await sendStoken(datas.stToken);
        this.onLoginData(data);
      }
    },
    onLoginData(data) {
      localStorage.authData = JSON.stringify(data);
      localStorage.token = data.accessToken;
      localStorage.nodeToken = data.nodeToken;
      this.$store.dispatch("getBalance");
      this.$store.dispatch("getBoosterUserInfo");
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
