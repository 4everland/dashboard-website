<template>
  <div>
    <v-dialog
      max-width="400"
      content-class="daily-boost-dialog coin_show"
      v-model="value"
      overlay-opacity="0.9"
      @click:outside="$emit('input', false)"
    >
      <div class="daily-boost coin_show" v-if="showNextSpinTime">
        <div class="d-flex align-center justify-center">
         <img
            src="/img/booster/spin/congratulations.png"
            width="24"
            alt=""
            />
          <div class="congratulations">Congratulations!</div>
        </div>
        <div class="received-text">Spin Times</div>
        <img
          class="lightning"
          src="/img/booster/spin/spin-times.png"
          width="120"
          alt=""
        />
       <div class="pattern_light">
         <img
          src="/img/booster/spin/pattern_light.png"
          width="240"
          alt=""
        />
        <div class="reward-number"><span style="font-size:30px">X</span>{{ spinStartInfo.remainSpins }}</div>
       </div>
        <div style="padding-top:60px;">
           <v-btn
              class="reward-btn"
              @click="handleShowNextStartSpin"
              style="width: 80%;"
              height="44"
            >
              <div class="btn-text">Continue(<span>{{ countdown }}</span>)</div>
            </v-btn>
        </div>
      </div>

      <div class="daily-boost" v-if="!showNextSpinTime">
        <div class="d-flex align-center justify-center">
         <img
            src="/img/booster/spin/congratulations.png"
            width="24"
            alt=""
            />
          <div class="congratulations">Congratulations!</div>
        </div>
        <div class="received-text">Points Quota</div>
        <img
          class="lightning"
          src="/img/booster/spin/points-quota.png"
          width="120"
          alt=""
        />
       <div class="pattern_light">
         <img
          src="/img/booster/spin/pattern_light.png"
          width="240"
          alt=""
        />
        <div class="reward-number"><span style="font-size:30px">+</span>{{ spinStartInfo.currentDuration }}</div>
       </div>
        <div style="padding-top:60px;">
           <v-btn
              class="reward-btn"
              @click="handleQuoteNext"
              style="width: 80%;"
              height="44"
            >
              <div class="btn-text">Continue(<span>{{ countdown }}</span>)</div>
            </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";


export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      list: [],
      checkinInfo: null,
      checkinLoading: false,
      countdown: 10,
      showDialog: false,
      countdownInterval: null,
      showNextSpinTime: false,
    };
  },
  watch: {
    value(newVal, oldVal) {
      if(newVal === true){
        this.startCountdown()
      }
    },
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
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
    checkinDisabled() {
      if (!this.checkinInfo) return true;
      return this.checkinInfo.actStatus !== "CLAIM";
    },
    todayInfoReward() {
      const list = this.list.filter((it) => it.day == this.today);
      if (list.length > 0) {
        return list[0].reward;
      }
      return "10";
    },
  },
  mounted(){

  },
  methods: { 
    sleep(timestamp) {
      return new Promise((resolve) => {
        setTimeout(resolve, timestamp);
      });
    },
    startCountdown() {
      this.countdown = 10;
      this.countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.resetCountdown();
          this.$emit('input', false);
        }
      }, 1000);
    },
    resetCountdown() {
      clearInterval(this.countdownInterval);
      this.countdown = 10;
    },
    async handleQuoteNext(){
      this.showNextSpinTime = true;
      this.$emit('input', false);
      await this.sleep(300);
      this.$emit('input', true);
    },
    handleShowNextStartSpin() {
      this.$emit('input', false);
      this.$emit('openStartNext')
    }
  },
};
</script>
<style lang="scss" src="../spin.scss"></style>
<style lang="scss" scoped>
::v-deep .daily-boost-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}
@media screen and (max-width: 900px) {
  .daily-sign-footer {
    flex-direction: column-reverse;
  }
}
.daily-boost {
  position: relative;
  width: 100%;
  padding: 36px 16px 24px 16px;
  border-radius: 16px;
  .close-btn {
    position: absolute;
    right: 0;
    top: -40px;
    cursor: pointer;
  }
  .lightning {
    position: relative;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
  }
  .dialog-spin{
    position: absolute;
    top: 0;
    left: 8px;
  }
  .pattern_light{
    position: absolute;
    top: 52px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    .reward-number{
      font-size: 40px;
      font-style: italic;
      font-weight: 700;
      line-height: 48px;
      text-align: center;
      margin-right:24px;
      color: #FFDE7F;
      margin-top: -58px;
    }
  }
  .congratulations{
      font-size: 16px;
      font-weight: 500;
      line-height: 19px;
      text-align: center;
      color: #FFF;
    }
  .received-text{
    font-size: 32px;
    font-style: italic;
    font-weight: 700;
    line-height: 39px;
    text-align: center;
    color: #FFF;
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
  margin-left: 10%;
  background: linear-gradient(180deg, #ffa927 0%, rgba(255, 169, 39, 0) 59.56%),
    linear-gradient(270deg, rgba(255, 114, 114, 0) 27%, #ff7272 100%),
    linear-gradient(327deg, #ff7c32 2.65%, rgba(255, 169, 39, 0) 33.12%),
    linear-gradient(to bottom right, rgba(199, 81, 255, 0) 0%, #c751ff 50%)
      bottom right / 50% 50% no-repeat,
    linear-gradient(to bottom left, rgba(199, 81, 255, 0) 0%, #c751ff 50%)
      bottom left / 50% 50% no-repeat,
    linear-gradient(to top left, rgba(199, 81, 255, 0) 0%, #c751ff 50%) top left /
      50% 50% no-repeat,
    linear-gradient(to top right, rgba(199, 81, 255, 0) 0%, #c751ff 50%) top
      right / 50% 50% no-repeat,
    linear-gradient(90deg, rgba(255, 53, 53, 0) 28%, #ff3535 100%), #ff35ba;
  box-shadow: 0px 3px 1px 0px rgba(255, 255, 255, 0.4) inset,
    0px 4px 1px 0px rgba(255, 255, 255, 0.86) inset,
    0px 0px 6px 0px rgba(0, 0, 0, 0.2) inset,
    0px -2px 5px 0px rgba(0, 0, 0, 0.3) inset;
  .btn-text{
    font-family: Inter;
    font-size: 16px;
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
