<template>
  <div class="mobile-points fz-12" id="navtop-mobile-points">
    <div class="mobile-points-content d-flex align-center" style="gap: 4px">
      <img src="/img/booster/4ever-point-icon.png" width="24" alt="" />
      <ICountUp
        id="mobile-point-receive"
        class="points-count mx-1"
        :delay="1000"
        :endVal="boosterInfo.totalPoint"
        :options="{
          useEasing: true,
          useGrouping: true,
          separator: ',',
          decimal: '.',
          prefix: '',
          suffix: '',
        }"
      />
    </div>
    <div
      style="width: 1px; height: 16px; background: rgba(255, 255, 255, 0.25)"
    ></div>
    <div class="rate d-flex align-center" @click="handleShowMoileSheet">
      <img src="/img/booster/3d-square-full.png" width="24" alt="" />
      <span>{{ Math.ceil(totalRate) }} pts/h</span>
      <img
        class="ml-2"
        src="/img/booster/svg/right-arrow.svg"
        width="12"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import ICountUp from "vue-countup-v2";
import { mapState, mapGetters } from "vuex";
import { bus } from "@/utils/bus";
export default {
  components: {
    ICountUp,
  },
  computed: {
    ...mapState({
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
      updateBoostUserInfo: (s) => s.moduleBooster.updateBoostUserInfo,
    }),
    ...mapGetters([
      "boostLocked",
      "baseRate",
      "boostRate",
      "currentComputed",
      "totalRate",
      "notLogin",
    ]),
  },
  methods: {
    handleShowMoileSheet() {
      bus.$emit("showMobileSheet");
    },
  },
};
</script>

<style lang="scss" scoped>
.mobile-points {
  display: inline-flex;
  padding: 2px 8px;
  align-items: center;
  gap: 8px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.05);

  .points-count {
    text-shadow: 0px 0px 4px rgba(106, 217, 255, 0.25);
    font-family: "DIN Alternate";
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.56px;
  }
}
.box-shadow-animate {
  animation: boxShadowAnimation 1.5s forwards;
}
@keyframes boxShadowAnimation {
  0% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  100% {
    box-shadow: 0 0 50px rgba(255, 255, 255, 0);
  }
}
</style>
