<template>
  <div>
    <v-dialog
      max-width="100%"
      content-class="daily-boost-dialog"
      v-model="value"
      overlay-opacity="0.9"
      @click:outside="$emit('input', false)"
    >
      <div class="daily-boost">
        <div class="spin-win">
          <img src="/img/booster/spin/SpinTimes.png" width="240" alt="" />
        </div>
         <div class="win-background d-flex flex-column align-center justify-center">
            <div class="win-text">SPIN to win 50 Points</div>
            <div class="win-text">Claim $0.1 for free</div>
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
      countdown: 0,
    };
  },

  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      dailySign: (s) => s.moduleBooster.dailySign,
    }),
  },
  mounted() {
    this.startCountdown()
  },
  methods: {
    startCountdown() {
      this.countdown = 2;
      this.countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.$emit('input', false);
          clearInterval(this.countdownInterval);
        }
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .daily-boost-dialog {
  background: black !important;
  box-shadow: none !important;
  overflow: initial !important;
  margin: 0 !important;
}
.daily-boost {
  position: relative;
  width: 100%;
  border-radius: 16px;
  animation: zoom 1s ease infinite; 
  .spin-win {
    position: absolute;
    top: -140px;
    left: -40px;
    z-index: 1;
 }
 .win-background {
    width: 100%;
    height: 94px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    background: linear-gradient(180deg, #FFD748 25.31%, rgba(255, 215, 72, 0) 59.56%),
        linear-gradient(90deg, rgba(255, 142, 38, 0) 0%, #FF8E26 100%),
        linear-gradient(0deg, #FFEA30, #FFEA30);  
}
 .win-text{
    font-size: 24px;
    font-style: italic;
    font-weight: 700;
    line-height: 29px;
    text-align: center;

 }
}

@keyframes zoom {
  0%, 100% {
    transform: translateY(0); /* 最初和最后状态不偏移 */
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateY(-5px); /* 向上移动5像素 */
  }
  20%, 40%, 60%, 80% {
    transform: translateY(5px); /* 向下移动5像素 */
  }

}

</style>
