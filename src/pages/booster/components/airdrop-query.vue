<template>
  <div>
    <v-dialog
      max-width="400"
      content-class="airdrop-boost-dialog"
      :value="value"
      overlay-opacity="0.5"
      persistent
    >
      <div class="airdrop-dialog">
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="20"
          alt=""
        />
        <div class="airdrop-header">
          <img
            class="head-img"
            src="/img/booster/earnings/airdrop-head.png"
            width="295"
            alt=""
          />
          <div class="airdrop-title d-flex justify-space-between align-center">
            <div class="mr-3">
              <div>Airdrop Query</div>
              <div class="title-border"></div>
            </div>
            <div class="user d-flex justify-center align-center">
              <div>
                <img
                  class="head-img"
                  src="/img/booster/earnings/avatar.png"
                  width="24"
                  alt=""
                />
              </div>
              <div class="user-name">ergoueth</div>
            </div>
          </div>
        </div>
        <div class="airdrop-content">
          <div>
            <div class="d-flex justify-space-between">
              <div class="list-left">
                <div class="list-title">Hold and stake -4EVER</div>
                <div class="list-text mb-1">Based on staked T-4EVER.</div>
              </div>
              <div class="list-right">
                <img
                  src="/img/booster/earnings/waiting-icon.png"
                  width="24"
                  alt=""
                />
              </div>
            </div>
            <img
              class="mb-1"
              style="width: 100%"
              src="/img/booster/earnings/diver-dark.png"
              height="9"
              alt=""
            />
          </div>
          <div>
            <div class="d-flex justify-space-between">
              <div class="list-left">
                <div class="list-title2">Hold and stake -4EVER</div>
                <div class="list-text mb-1">Based on staked T-4EVER.</div>
              </div>
              <div class="list-right">
                <img
                  src="/img/booster/earnings/completed.png"
                  width="24"
                  alt=""
                />
              </div>
            </div>
            <img
              class="mb-1"
              style="width: 100%"
              src="/img/booster/earnings/diver-light.png"
              height="9"
              alt=""
            />
          </div>
          <v-btn class="submit-btn">
            <span class="number">99888</span>
            <span class="btn-text">4EVER</span>
          </v-btn>
          <v-btn class="share-btn">
            <span class="btn-text">Share to X</span>
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>
  <script>
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {};
  },

  mounted() {},
  methods: {},
  components: {},
};
</script>
      
  <style lang="scss" scoped>
::v-deep .airdrop-boost-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}

.airdrop-dialog {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 36px 16px;
  border-radius: 16px;
  .close-btn {
    position: absolute;
    right: 18px;
    top: 0;
    cursor: pointer;
  }
  .airdrop-header {
    width: 295px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    .airdrop-title {
      position: absolute;
      top: 20px;
      left: 0;
      width: 100%;
      padding: 0 12px;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
      text-align: left;
      color: #fff;
      text-shadow: 0px 0px 8px #ffffff80;
      .title-border {
        width: 24px;
        height: 4px;
        background: #fff;
        margin-top: 8px;
      }
      .user {
        padding: 4px 8px;
        border-radius: 8px;
        background: #00000080;
        .user-name {
          font-size: 12px;
          font-weight: 700;
          line-height: 16px;
          margin-left: 8px;
        }
      }
    }
  }
  .airdrop-content {
    width: 327px;
    height: 421px;
    margin: 0 auto;
    top: 72px;
    padding: 24px 16px;
    gap: 24px;
    border-radius: 16px;
    margin-top: -7px;
    background: linear-gradient(179.52deg, #000a10 8.53%, #003e70 99.59%),
      linear-gradient(
        180deg,
        rgba(17, 2, 252, 0.15) 28.41%,
        rgba(15, 225, 248, 0) 100%
      );

    border: 1px solid;
    border-image-source: linear-gradient(
      165.76deg,
      rgba(69, 81, 111, 0.5) -11.63%,
      #11b7ff 88.45%
    );
    border-image-slice: 1;
    .list-title {
      font-size: 14px;
      font-weight: 700;
      line-height: 16px;
      color: #ffffff;
    }
    .list-title2 {
      font-size: 14px;
      font-weight: 700;
      line-height: 16px;
      color: #0fe1f8;
    }
    .list-text {
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      color: #ffffffbf;
    }
    .list-right {
      position: relative;
      top: 16px;
      right: 12px;
    }
    .submit-btn {
      margin-top: 12px;
      width: 295px;
      height: 53px;
      padding: 8px 16px;
      border-radius: 16px;
      position: relative;
      overflow: hidden;
      .number {
        font-family: DIN Alternate;
        font-size: 32px;
        font-weight: 700;
        line-height: 37.25px;
        color: #40e8ff;
      }
      .btn-text {
        font-size: 16px;
        font-weight: 700;
        line-height: 20px;
        color: #fff;
        margin-top: 8px;
      }
      background: url("/img/booster/earnings/grid.png") no-repeat #000000;
      background-size: contain;
    }
    .share-btn {
      margin-top: 24px;
      width: 295px;
      height: 44px;
      padding: 8px 16px;
      border-radius: 16px;
      border: 1px;
      background: linear-gradient(90.97deg, #0fe1f8 0.68%, #1102fc 99.51%);
      .btn-text {
        font-size: 16px;
        font-weight: 700;
        line-height: 20px;
        color: #fff;
      }
    }
  }
}
</style>
      