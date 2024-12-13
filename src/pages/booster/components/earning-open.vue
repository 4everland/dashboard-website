<template>
  <div>
    <v-dialog
      max-width="400"
      content-class="earn-boost-dialog"
      :value="value"
      overlay-opacity="0.9"
      overlay-color="black"
      persistent
    >
      <div class="earn-dialog">
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="20"
          alt=""
        />
        <div class="earn-content">
          <img
            class="logo"
            :src="info.logo"
            width="80"
            alt=""
          />
          <div class="d-flex justify-end align-center">
            <v-btn class="earning-btn">
              <img
                class="hot-icon"
                src="/img/booster/progress-hot.png"
                height="32"
                alt=""
              />
              <span class="btn-text">{{ info.text }}</span>
            </v-btn>
          </div>
          <div>
            <div class="title mt-8">{{ info.title }}</div>
            <div class="text mt-2">
              Tomarket is a play-to-earn bot that lets you win Tether and TON by
              playing games and completing exciting tasks!
            </div>
            <div
              class="countdown d-flex justify-space-between align-center mt-2"
            >
              <div>Ended</div>
              <div class="d-flex align-center">
                <div class="timer">30</div>
                &nbsp;D:
                <div class="timer">22</div>
                &nbsp;H:
                <div class="timer">32</div>
                &nbsp;M:
                <div class="timer">09</div>
                &nbsp;S
              </div>
            </div>
            <div class="unlock-node mt-4">Complete To Unlock Tomarket Node</div>
            <div class="back-step">
              <div class="d-flex justify-space-between align-center mt-2 step">
                <div class="d-flex justify-start">
                  <div class="step-number">1</div>
                  <div class="step-text">Follow @Tomarket on X</div>
                </div>
                <v-btn class="go-btn">
                  <span class="btn-text">Go</span>
                </v-btn>
              </div>
            </div>
            <div class="back-step">
              <div class="d-flex justify-space-between align-center mt-2 step">
                <div class="d-flex justify-start">
                  <div class="step-number">2</div>
                  <div class="step-text">Share on X</div>
                </div>
                <v-btn class="go-btn">
                  <span class="btn-text">Go</span>
                </v-btn>
              </div>
            </div>
            <div class="back-step">
              <div class="d-flex justify-space-between align-center mt-2 step">
                <div class="d-flex justify-start">
                  <div class="step-number">3</div>
                  <div class="step-text">Join Telegram</div>
                </div>
                <v-btn class="go-btn">
                  <span class="btn-text">Go</span>
                </v-btn>
              </div>
            </div>
            <div class="back-step">
              <div class="d-flex justify-space-between align-center mt-2 step">
                <div class="d-flex justify-start">
                  <div class="step-number">4</div>
                  <div class="step-text">Join Discord</div>
                </div>
                <v-btn class="go-btn">
                  <span class="btn-text">Go</span>
                </v-btn>
              </div>
            </div>
            <div class="d-flex justify-start mt-2">
              <div>
                <img
                  src="/img/booster/earnings/subtract.png"
                  width="16"
                  alt=""
                />
              </div>
              <div class="view">
                Unlock to view your balance in Account. Rewards will be
                distributed after the event.
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>
  
  <script>
export default {
  props: {
    value: Boolean,
    info: Object,
  },
  data() {
    return {};
  },
  watch: {
    value(newVal, oldVal) {
      if(newVal === true){
        console.log('info', this.info)
      }
    }
  },
  computed: {

  },

  methods: {},
  components: {},
};
</script>
  
  <style lang="scss" scoped>
::v-deep .earn-boost-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
  margin: 24px 12px !important;
}

.earn-dialog {
  position: relative;
  width: 100%;
  padding: 36px 16px 24px 16px;
  border-radius: 16px;
  .close-btn {
    position: absolute;
    right: 18px;
    top: 0;
    cursor: pointer;
  }
  .earn-content {
    color: #fff;
    width: 327px;
    border-radius: 16px;
    border: 1px solid;
    padding: 12px;
    border-image-source: linear-gradient(
      165.76deg,
      rgba(69, 81, 111, 0.5) -11.63%,
      #11b7ff 88.45%
    );
    border-image-slice: 1;

    background: linear-gradient(179.52deg, #000a10 8.53%, #003e70 99.59%),
      linear-gradient(
        180deg,
        rgba(17, 2, 252, 0.15) 28.41%,
        rgba(15, 225, 248, 0) 100%
      );
    .logo {
      position: absolute;
      top: 0;
      left: 20%;
      transform: translateX(-50%);
      z-index: 3;
    }
    .earning-btn {
      height: 34px;
      padding: 8px 16px;
      border-radius: 4px;
      background: linear-gradient(99.62deg, #dc33d6 0%, #ff3821 100%);
      .btn-text {
        font-size: 14px;
        font-weight: 700;
        line-height: 16px;
        color: #fff;
      }
      .hot-icon {
        margin-bottom: 4px;
      }
    }
    .title {
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
    }
    .text {
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      color: #0fe1f8;
    }
    .countdown {
      font-size: 14px;
      font-weight: 300;
      line-height: 17px;
      text-align: left;
      color: #ffce56;
      .timer {
        width: 20px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        border-radius: 2px;
        background: #ffce56;
        color: #000;
        font-size: 12px;
        font-weight: 400;
        margin-left:2px;
      }
    }
    .unlock-node {
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
      text-shadow: 0px 0px 10px #6172f3;
    }
    .back-step {
      background: linear-gradient(
        270.31deg,
        rgba(255, 255, 255, 0) 0.18%,
        rgba(0, 114, 248, 0.2) 100.11%
      );
    }
    .step {
      padding: 8px 12px;
      background: linear-gradient(
        135deg,
        rgb(33, 61, 92) 0,
        rgb(33, 61, 92) 10%,
        transparent 10%,
        transparent 50%,
        rgb(33, 61, 92) 50%,
        rgb(33, 61, 92) 60%,
        transparent 60%,
        transparent 100%
      );
      background-size: 8px 8px;
      color: #fff;
      .step-number {
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 700;
        background: #6172f380;
      }
      .step-text {
        font-size: 14px;
        font-weight: 400;
        margin-left: 8px;
      }
      .go-btn {
        padding: 4px 16px;
        border-radius: 4px;
        background: linear-gradient(96.98deg, #0fe1f8 -22.19%, #1102fc 99.83%);
        .btn-text {
          font-size: 14px;
          font-weight: 400;
          color: #fff;
        }
      }
    }
    .view {
      font-size: 12px;
      font-weight: 400;
      line-height: 14.52px;
      color: #c0c1c2;
      margin-left: 4px;
    }
  }
}
.cancel-btn {
  color: #fff !important;
  font-weight: 500;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  background: transparent !important;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
}
</style>
  