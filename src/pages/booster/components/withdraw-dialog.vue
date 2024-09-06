<template>
  <div>
    <v-overlay :value="value" opacity="1" v-if="asMobile">
      <div
        class="withdraw-overlay d-flex flex-column align-center justify-center"
      >
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="18"
          alt=""
        />

        <div class="withdraw-title">Withdraw</div>
        <div
          class="withdraw-amount-paragraph my-4 d-flex align-center justify-space-between"
          style="width: 100%"
        >
          <div>Balance</div>
          <div class="d-flex align-center">
            <img src="/img/booster/invite/usdt.png" width="24" alt="" />
            <span class="ml-1 fz-14">0.5USDT</span>
          </div>
        </div>
        <div class="withdraw-tips d-flex align-center fz-14">
          <div>🔈</div>
          <div>
            <div>The minimum withdrawal amount is 1 USDT.</div>
            <div>Withdrawal will be processed within 24 hours.</div>
          </div>
        </div>

        <v-btn
          class="withdraw-btn mt-8"
          width="200"
          height="48"
          @click="$toast2('Cash withdrawals will be available soon!', 'info')"
        >
          Withdraw
        </v-btn>
      </div>
    </v-overlay>

    <v-dialog
      v-else
      max-width="592px"
      :value="value"
      persistent
      content-class="booster-dialog"
      style="background-color: transparent; box-shadow: none"
    >
      <div class="booster-module-dialog">
        <div class="withdraw-content">
          <img
            class="close-btn"
            @click="$emit('input', false)"
            src="/img/booster/svg/close.svg"
            width="18"
            alt=""
          />
          <div class="withdraw-title">Withdraw</div>

          <div
            class="withdraw-amount-paragraph my-4 d-flex align-center justify-space-between"
            style="width: 100%"
          >
            <div>Balance</div>
            <div class="d-flex align-center">
              <img src="/img/booster/invite/usdt.png" width="24" alt="" />
              <span class="ml-1 fz-14">0.5USDT</span>
            </div>
          </div>
          <div class="withdraw-tips d-flex align-center fz-14">
            <div>🔈</div>
            <div>
              <div>The minimum withdrawal amount is 1 USDT.</div>
              <div>Withdrawal will be processed within 24 hours.</div>
            </div>
          </div>

          <v-btn
            class="withdraw-btn mt-auto"
            width="200"
            height="48"
            @click="$toast2('Cash withdrawals will be available soon!', 'info')"
          >
            Withdraw
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
    return {
      // overlay: false,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
.withdraw-overlay {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);
  .close-btn {
    position: absolute;
    right: 20px;
    top: 105px;
    cursor: pointer;
  }
}

::v-deep .booster-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}
.booster-module-dialog {
  padding: 13px;
  height: 325px;
  background: url("/img/booster/svg/withdraw-dialog-bg.svg") no-repeat;
  background-size: contain;
  background-position: center;

  .withdraw-content {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 8px;
    color: #fff;
    border-radius: 5px;
    background: linear-gradient(
        180deg,
        rgba(0, 10, 16, 0.5) 66.24%,
        rgba(0, 62, 112, 0.5) 100%
      ),
      rgba(5, 5, 5, 0.8);
    backdrop-filter: blur(4px);
  }
}
.withdraw-title {
  padding: 8px 64px;
  background: rgba(0, 129, 248, 0.1);
  text-align: center;
  text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.25);
  font-size: 20px;
}
.withdraw-amount-paragraph {
  padding: 0 24px;
  height: 55px;
  background: linear-gradient(
      270deg,
      rgba(0, 114, 248, 0) 0.18%,
      rgba(0, 114, 248, 0.2) 100.11%
    ),
    url("/img/booster/svg/fringe-bg.svg");
}
.withdraw-tips {
  padding: 4px 20px;
  gap: 12px;
  color: rgba(255, 255, 255, 0.75);

  border-radius: 80px;
  background: rgba(97, 114, 243, 0.25);
}
.withdraw-btn {
  font-size: 16px;
  letter-spacing: 0;
  border-radius: 4px;
  color: #fff !important;
  text-shadow: 0px 0px 8px #6172f3;
  border: 1px solid #0e6cc6;
  background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
  box-shadow: 0px -4px 8px 0px rgba(0, 133, 195, 0.25),
    0px 4px 8px 0px rgba(0, 133, 195, 0.25);
}
</style>
