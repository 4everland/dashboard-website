<template>
  <div>
    <v-dialog
      max-width="400"
      content-class="daily-boost-dialog coin_show"
      v-model="value"
      overlay-opacity="0.9"
      overlay-color="black"
      persistent
    >
      <div class="daily-boost" v-if="spinPlayReward.rewardType=='spin'"> 
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
        <div class="reward-number"><span style="font-size:30px">+</span>{{ spinPlayReward.rewardValue }}</div>
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

      <div class="daily-boost" v-if="spinPlayReward.rewardType =='points'">
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
        <div class="reward-number"><span style="font-size:30px">+</span>{{ spinPlayReward.rewardValue }}</div>
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
      countdown: 5,
      showDialog: false,
      countdownInterval: null,
    };
  },

  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      dailySign: (s) => s.moduleBooster.dailySign,
      spinStartInfo: (s) => s.moduleBooster.spinStartInfo,
      spinPlayReward: (s) => s.moduleBooster.spinPlayReward,
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
  watch: {
    value(newVal, oldVal) {
      if(newVal === true){
        this.startCountdown()
      }
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
      this.countdown = 5;
      this.countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.resetCountdown();
          this.$emit('input', false);
          if(this.spinPlayReward.rewardType =='points'){
            this.$emit('showpoint');
          }
        }
      }, 1000);
    },
    resetCountdown() {
      clearInterval(this.countdownInterval);
      this.countdown = 5;
    },
    async handleQuoteNext(){
      this.resetCountdown();
      this.$emit('input', false);
      this.$emit('showpoint');
    },
    handleShowNextStartSpin() {
      this.resetCountdown();
      this.$emit('input', false);
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
