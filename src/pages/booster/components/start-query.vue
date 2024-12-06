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
        <div class="airdrop-content">
          <div class="start-title">$4EVER Airdrop Query</div>
          <div class="start-text">
            Click the button below to start the query
          </div>
          <div class="circle-img">
            <img src="/img/booster/earnings/circle.png" width="40" alt="" />
          </div>
          <div class="d-flex justify-center">
            <div class="unlock">
              <img
                src="/img/booster/earnings/unlock-dark.png"
                width="64"
                alt=""
              />
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
  .airdrop-content {
    width: 327px;
    height: 400px;
    margin: 0 auto;
    border-radius: 16px;
    background: url("/img/booster/earnings/start-query.png") no-repeat #000000;
    background-size: contain;
    padding-top: 80px;
    .start-title {
      width: 255px;
      margin: 0 36px;
      color: #fff;
      font-size: 32px;
      font-weight: 700;
      line-height: 32px;
      text-align: center;
      text-shadow: 0px 0px 8px #ffffff80;
    }
    .start-text {
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
      text-align: center;
      color: #fff;
      margin-top: 8px;
    }
    .circle-img {
      text-align: center;
      margin-top: -20px;
    }
    .unlock {
      margin-top: 117px;
    }
  }
}
</style>
        