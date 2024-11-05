<template>
  <div>
    <v-dialog
      max-width="400"
      content-class="daily-boost-dialog"
      v-model="value"
      overlay-opacity="0.9"
      overlay-color="black"
      @click:outside="$emit('input', false)"
    >
      <div class="daily-boost">
        <img
          class="lightning"
          src="/img/booster/spin/icon_congratulations.png"
          width="94"
          alt=""
        />
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="20"
          alt=""
        />

        <div class="spin-background">
          <div class="congratulations">Congratulations!</div>
          <div class="swap">You have swapped {{spinStartInfo.duration}} points for</div>
          <div class="reward-number">{{spinClaimedInfo ? spinClaimedInfo.toFixed(2): 0}} Ton</div>
          <div class="view-account d-flex justify-center align-center">
            <img
              src="/img/booster/spin/annotation-alert.svg"
              width="16"
              alt=""
            />
            <div>&nbsp; It can be viewed in your account.</div>
          </div>
          <v-btn class="reward-btn" style="width: 90%" height="44" @click="handleClaimSwap">
            <div class="btn-text">OK</div>
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
      spinClaimedInfo: (s) => s.moduleBooster.spinClaimedInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {
    handleClaimSwap() {
      let info = this.userInfo.username ? this.userInfo.username.cutStr(6, 4): 'unknown';
      this.$store.commit("SET_SPIN_INFO", {});
      localStorage.removeItem('spinInfo'+info);
      this.$emit('input', false);  
      // this.$router.push('/boost?info=swapcuccess');
      this.$router.push({
        path: '/boost',
        query: {
          info: 'swapcuccess',
        }
      });
      setTimeout(() => {
        bus.$emit("showSwapSuccess");
      },1000)
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .daily-boost-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
  margin: 24px 12px !important;
}

.daily-boost {
  position: relative;
  width: 100%;
  padding: 36px 16px 24px 16px;
  border-radius: 16px;
  background: #121536;
  .close-btn {
    position: absolute;
    right: 18px;
    top: 18px;
    cursor: pointer;
  }
  .lightning {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
  }
    .reward-number {
      font-family: Inter;
      font-size: 32px;
      font-style: italic;
      font-weight: 700;
      line-height: 48.41px;
      text-align: center;
      margin-right: 24px;
      color: #ffde7f;
      text-shadow: 1px 2px 0px 0px #FF9408, 0.5px 0.75px 0px 0px #FFF6B6 inset;
    }

  .congratulations {
    margin-top: 30px;
    font-family: Inter;
    font-size: 20px;
    font-style: italic;
    font-weight: 900;
    line-height: 24px;
    text-align: center;
    text-transform: uppercase;
    color: #fff;
  }
  .swap {
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 16.94px;
    text-align: center;
    margin-top: 8px;
    color: #FFFFFF;
  }
  .view-account{
    margin-top: 12px;
    height: 32px;
    font-family: Inter;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    text-align: center;
    color: #0FE1F8;
    background: linear-gradient(90deg, rgba(3, 156, 255, 0) 0%, rgba(3, 156, 255, 0.5) 36.5%, rgba(3, 156, 255, 0.5) 67.5%, rgba(3, 156, 255, 0) 100%);
  }
}

.reward-btn {
  position: relative;
  color: #fff !important;
  padding: 0 !important;
  letter-spacing: 0;
  backdrop-filter: blur(2px);
  border-radius: 12px;
  margin-top: 20px;
  margin-left: 5%;
  background: linear-gradient(315.05deg, #1102fc 3.4%, #0fe1f8 92.46%);
  .btn-text {
    font-family: Inter;
    font-size: 14px;
    font-weight: 700;
    line-height: 19px;
  }
}

.cancel-btn {
  color: #fff !important;
  font-weight: 500;
  font-family: Inter;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  background: transparent !important;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
}
</style>
