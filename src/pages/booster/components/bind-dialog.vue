<template>
  <div>
    <v-overlay :value="value" opacity="1" v-if="asMobile">
      <div class="start-boosting d-flex flex-column justify-center">
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="18"
          alt=""
        />
        <div class="text-center" style="margin-bottom: 44px">
          <img src="/img/booster/boost-icon.png" width="94" alt="" />
        </div>
        <div class="text-center fz-20 mb-4 fw-b">Bind Wallet</div>
        <div class="text-center fz-16">
          Please bind your wallet before proceeding
        </div>

        <div class="d-flex align-center justify-center mt-4">
          <div class="cancel-btn" @click="$emit('input', false)">Cancel</div>

          <div class="start-boost-btn" @click="onBind">Go</div>
        </div>
        <div class="text-center mt-4">
          <span class="mr-2" style="opacity: 0.6">What is a Wallet?</span>
          <a
            href="https://docs.4everland.org/get-started/quick-start-guide/login-options"
            target="_blank"
            rel="noopener noreferrer"
            >Learn more</a
          >
        </div>
      </div>
    </v-overlay>

    <v-dialog
      v-else
      max-width="738px"
      :value="value"
      persistent
      content-class="booster-dialog"
      style="background-color: transparent; box-shadow: none; height: 524px"
    >
      <div class="booster-module-dialog">
        <div class="start-boosting-dialog">
          <img
            class="close-btn"
            @click="$emit('input', false)"
            src="/img/booster/svg/close.svg"
            width="18"
            alt=""
          />

          <img
            class="boost-icon"
            src="/img/booster/boost-icon.png"
            width="94"
            alt=""
          />

          <div
            class="text-center fz-20 mb-4 fw-b"
            style="background: rgba(0, 129, 248, 0.1); padding: 4px 64px"
          >
            Bind Wallet
          </div>
          <div class="text-center fz-16">
            Please bind your wallet before proceeding
          </div>

          <div class="d-flex align-center justify-center mt-4">
            <div class="cancel-btn" @click="$emit('input', false)">Cancel</div>

            <div class="start-boost-btn" @click="onBind">Go</div>
          </div>
          <div class="text-center mt-4">
            <span class="mr-2" style="opacity: 0.6">What is a Wallet?</span>
            <a
              href="https://docs.4everland.org/get-started/quick-start-guide/login-options"
              target="_blank"
              rel="noopener noreferrer"
              >Learn more</a
            >
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
    return {
      // overlay: false,
      activity: [],
      inviteCode: "",
      loading: false,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  created() {},
  methods: {
    onBind() {
      this.$router.push("/account/config");
    },
  },
};
</script>

<style lang="scss" scoped>
.start-boosting {
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
    top: 20px;
  }
  .boosting-task {
    margin-bottom: 8px;
    background: url("/img/booster/svg/fringe-bg.svg");
    .idx {
      width: 26px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      color: #000;
      font-weight: bold;
      border-radius: 100%;
      background: rgba(255, 255, 255, 0.6);
    }
    .act-btn {
      color: #fff;
      width: 88px;
      height: 29px;
      line-height: 29px;
      text-align: center;
      border-radius: 4px;
      background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
      box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
    }
  }
  .cancel-btn {
    display: flex;
    width: 148px;
    padding: 8px 24px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(2px);
    margin-right: 30px;
    cursor: pointer;
  }
  .start-boost-btn {
    display: flex;
    padding: 8px 24px;
    width: 148px;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border-radius: 4px;
    border: 1px solid #0e6cc6;
    background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
    box-shadow: 0px -4px 8px 0px rgba(0, 133, 195, 0.25),
      0px 4px 8px 0px rgba(0, 133, 195, 0.25);
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
  height: 524px;
  background: url("/img/booster/svg/dialog-bg.svg") no-repeat;
  background-size: contain;
}
.start-boosting-dialog {
  position: relative;
  height: 100%;
  padding: 26px 7px 20px 7px;
  color: #fff;
  border-radius: 5px;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
  .boost-icon {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -50px;
  }
  .boosting-task {
    padding: 12px 24px;
    margin-bottom: 8px;
    background: url("/img/booster/svg/fringe-bg.svg");
    .idx {
      width: 26px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      color: #000;
      font-weight: bold;
      border-radius: 100%;
      background: rgba(255, 255, 255, 0.6);
    }
    .act-btn {
      color: #fff;
      width: 88px;
      height: 29px;
      line-height: 29px;
      text-align: center;
      border-radius: 4px;
      background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
      box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
      cursor: pointer;
    }
  }
  .boosting-task:hover {
    background: linear-gradient(
        270deg,
        rgba(0, 114, 248, 0) 0.18%,
        rgba(0, 114, 248, 0.2) 100.11%
      ),
      url("/img/booster/svg/fringe-bg.svg");
  }
  .cancel-btn {
    display: flex;
    width: 148px;
    padding: 8px 24px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(2px);
    margin-right: 30px;
    cursor: pointer;
  }
  .start-boost-btn {
    display: flex;
    padding: 8px 24px;
    width: 148px;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border-radius: 4px;
    border: 1px solid #0e6cc6;
    background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
    box-shadow: 0px -4px 8px 0px rgba(0, 133, 195, 0.25),
      0px 4px 8px 0px rgba(0, 133, 195, 0.25);
    cursor: pointer;
  }
}
.invite-content {
  padding: 8px;
  border-radius: 4px;
  border: 0.5px solid rgba(255, 255, 255, 0.3);
  background: rgba(49, 49, 49, 0.9);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.35);
  .invite-input {
    width: 100%;
    color: #fff;
  }
}
</style>
