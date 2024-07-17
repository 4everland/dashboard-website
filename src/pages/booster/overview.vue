<template>
  <div class="booster-overview">
    <div style="position: relative">
      <img
        :src="asMobile ? '/img/booster/mobile-bg.png' : '/img/booster/bg.png'"
        style="max-height: 100vh; width: 100%; display: block"
        alt=""
      />
      <overview-pc @handleStartBoost="showStartBoost = true"></overview-pc>
      <overview-h5 @handleStartBoost="showStartBoost = true"></overview-h5>
      <start-boosting v-model="showStartBoost"></start-boosting>
      <end-boosting v-model="showEndBoost"></end-boosting>
      <deposit-dialog v-model="showDeposit"></deposit-dialog>
      <bottom-bar />
    </div>
  </div>
</template>

<script>
import OverviewPc from "./overview/overview-pc.vue";
import OverviewH5 from "./overview/overview-h5.vue";
import StartBoosting from "./components/start-boosting.vue";
import EndBoosting from "./components/end-boosting.vue";
import DepositDialog from "./components/deposit-dialog.vue";
import BottomBar from "./components/bottom-bar.vue";

export default {
  data() {
    return {
      showStartBoost: false,
      showEndBoost: false,
      showDeposit: true,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  components: {
    OverviewPc,
    OverviewH5,
    StartBoosting,
    EndBoosting,
    DepositDialog,
    BottomBar,
  },
};
</script>

<style lang="scss" scoped>
.booster-overview {
  background: #000;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
