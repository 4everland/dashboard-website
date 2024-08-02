<template>
  <div class="tg-start-boost" v-if="isShow">
    <div class="start-boost-bg">
      <div class="start-boost-content">
        <img src="/img/booster/boost-icon.png" width="64" alt="" />
        <div class="start-boost-title mt-3">Welcome</div>
        <div class="mt-1">
          Unlock at 10,000 points Unlock at 10,000 points Unlock at 10,000
          points Unlock at
        </div>
        <v-btn class="start-btn mt-4" @click="handleStart">START MINING</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["notLogin"]),
    isTg() {
      return process.env.VUE_APP_TG_VERSION == "true";
    },

    isShow() {
      return false;
      // return this.notLogin && this.isTg;
    },
  },
  methods: {
    handleStart() {
      console.log(2);

      // location.href = 'hb.4everland.app/tg.html?uid=2'
    },
  },
};
</script>

<style lang="scss" scoped>
.tg-start-boost {
  z-index: 99;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
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
      fill: rgba(97, 114, 243, 0.05);
      backdrop-filter: blur(4px);

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
