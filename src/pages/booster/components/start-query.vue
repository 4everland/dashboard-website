<template>
  <div>
    <v-dialog
      max-width="400"
      content-class="airdrop-boost-dialog"
      :value="value"
      overlay-opacity="0.9"
      overlay-color="black"
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
          <div class="start-title airdrop_text">$4EVER Airdrop Query</div>
          <div class="start-text airdrop_text">
            Click the button below to start the query
          </div>
          <div class="circle-img airdrop_img">
            <img src="/img/booster/earnings/circle.png" width="120" alt="" />
          </div>
          <div class="d-flex justify-center">
            <div class="unlock d-flex justify-center align-center" v-if="!showbutton">
              <div >
                <img
                  src="/img/booster/earnings/unlock-dark.png"
                  width="64"
                  alt=""
                />
              </div>
            </div>
            <div class="unlock light-btn d-flex justify-center align-center queryItem" @click="handleShowQuery" v-if="showbutton">
              <div class="light-img">
                <img
                  class="light-img-out"
                  src="/img/booster/earnings/btn-unlock-air.png"
                  width="64"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>
<script>
import { bus } from "@/utils/bus";
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      showbutton: false,
    };
  },

  mounted() {
    
    bus.$on("showStartQueryEvent", () => {
      this.showbutton = false;
      setTimeout(() => {
        this.showbutton = true;
      }, 3000);
    });
  },
  methods: {
    handleShowQuery() {
      this.$emit('input', false);
      bus.$emit('showQueryDialogEvent');
    },
  },
  components: {},
};
</script>
<style lang="scss" src="../spin.scss"></style>
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
    position: relative;
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
      margin-top: -65px;
    }
    .unlock {
      margin-top: 75px;
    }
  }
}

.light-btn {
  position: relative;
  height: 66px;
  width: 66px;
  border: 0;
  border-radius: 16px;
  overflow: hidden;
}
.light-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: conic-gradient(
    from var(--rotation),
    transparent,
    #0FE1F8 60deg,
    transparent 61deg
  );
  animation: spin 4s infinite linear;
}
@property --rotation {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0deg;
}
@keyframes spin {
  0% {
    --rotation: 0deg;
  }

  100% {
    --rotation: 360deg;
  }
}
.light-btn::after {
  content: "";
  position: absolute;
  inset: 3px;
  border-radius: 999px;
  background: var(--bg);
}
.light-img {
  height: 64px;
  width: 64px;
  border-radius: 16px;
  background: #000000;
  position: relative;
  z-index: 2;
  cursor: pointer;
}
.light-img-out {
  filter: drop-shadow(0px 0px 10px #6172f3);
}
</style>
        