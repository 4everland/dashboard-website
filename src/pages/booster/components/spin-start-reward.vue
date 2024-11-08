<template>
  <div>
    <v-dialog
      max-width="400"
      content-class="daily-boost-dialog step1_show"
      v-model="value"
      overlay-opacity="0.9"
      overlay-color="black"
      persistent
    >
      <div class="spin-start-bg">
        <div class="d-flex align-center justify-center pt-11">
          <div class="spin-text-bg">
            ${{spinStartInfo.cashValue}}
          </div>
        </div>
        <div class="swaptext my-5 mb-10">Available to Withdraw</div>
        <div class="swapText2 py-3">Get {{spinStartInfo.duration}} points quota to start</div>
        <div class="d-flex align-center justify-center ">
            <v-btn
              class="reward-btn"
              style="width: 80%;"
              height="44"
              @click="handleStartGetReward()"
            >
              <div class="btn-text">Start</div>
            </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { onNext } from "@/api/booster";
import { bus } from "@/utils/bus";
import RewardDialog from "./reward-dialog.vue";

export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      list: [],
      checkinInfo: null,
      checkinLoading: false,
      showReward: false,
      today: 1,
    };
  },

  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      dailySign: (s) => s.moduleBooster.dailySign,
      spinStartInfo: (s) => s.moduleBooster.spinStartInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: { 
    handleStartGetReward() {
      this.$emit("input", false);
      this.$emit('openStartNext')
    }
  },
  components: {
    RewardDialog,
  },
};
</script>
<style lang="scss" src="../spin.scss"></style>
<style lang="scss" scoped>
::v-deep v-overlay__scrim {
  opacity: 0.9;
}
::v-deep .daily-boost-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}
.btn-text {
  letter-spacing:normal;
}

@media screen and (max-width: 900px) {
  .daily-sign-footer {
    flex-direction: column-reverse;
  }
}
.spin-start-bg {
  border-radius: 16px;
  height: 400px;
  background: url('/img/booster/spin/spin-start-bg.png');
  background-size: 100% 100%;

  .spin-text-bg{
    width: 224px;
    background: url('/img/booster/spin/spin-start-text-bg.png');
    background-size: 100% 100%;
    height: 144px;
    font-size: 48px;
    line-height: 300%;
    font-family: "Inter", sans-serif;
    font-style: italic;
    font-weight: 700;
    color: #FFDE7F;
    text-align: center;
    text-shadow: 1px 2px 0px #FF9408;
  }
  .swaptext{
    font-family: Inter;
    font-size: 24px;
    font-weight: 700;
    font-family: "Inter", sans-serif;
    line-height: 16.94px;
    text-align: center;
    color: #121536;
  }
  .swapText2{
    font-family: "Inter", sans-serif;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    color: #fff;
    margin-top:8px;
  }
  .reward-btn {
    font-size: 16px;
    font-weight: 700;
    color: #000;
    border-radius: 12px;
  }
}
</style>
