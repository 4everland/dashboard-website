<template>
  <div>
    <v-overlay :value="value" opacity="1" v-if="asMobile" z-index="10">
      <div class="start-boosting d-flex flex-column justify-center">
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="18"
          alt=""
        />
        <div class="first-dialog-title py-2 fz-20 text-center mb-2">
          Stake 4EVER KEY
        </div>
        <div class="first-dialog-content">
          <div class="paragraph d-flex align-center justify-space-between">
            <span>Balance</span>
            <span> {{ keyBalance }}</span>
          </div>
          <ul class="stake-tips">
            <li>
              After staking, the balance will be updated periodically or
              manually refreshed.
            </li>
            <li>Each staked 4EVER key contributes to a 1% Staking Yield.</li>
            <li>
              The staked 4EVER Key won't be locked, allowing you to trade
              freely.
            </li>
          </ul>
          <div
            class="act-btn d-flex align-center justify-center mt-10"
            style="gap: 16px"
          >
            <v-btn
              outlined
              color="rgba(255, 255, 255, 0.60)"
              @click="$emit('input', false)"
              width="180"
              >Cancel</v-btn
            >
            <v-btn
              style="
                border: 1px solid #0e6cc6;
                background: linear-gradient(
                  180deg,
                  #00070c 0%,
                  #074178 113.39%
                );
                text-shadow: 0px 0px 8px #6172f3;
              "
              outlined
              color="#fff"
              width="180"
              @click="onStake"
              :loading="stakeLoading"
              :disabled="keyBalance == '0'"
              >Stake</v-btn
            >
          </div>
        </div>
      </div>
    </v-overlay>

    <v-dialog
      v-else
      max-width="592px"
      :value="value"
      persistent
      content-class="booster-dialog"
      style="background-color: transparent; box-shadow: none; height: 524px"
    >
      <div class="booster-module-dialog">
        <div class="start-boosting-dialog">
          <div class="deposit-dialog-title text-center fz-20 mb-5">
            Stake 4EVER KEY
          </div>
          <div class="paragraph d-flex align-center justify-space-between">
            <span>Balance</span>
            {{ keyBalance }}
          </div>
          <ul class="stake-tips mt-4">
            <li>
              After staking, the balance will be updated periodically or
              manually refreshed.
            </li>
            <li>Each staked 4EVER key contributes to a 1% Staking Yield.</li>
            <li>
              The staked 4EVER Key won't be locked, allowing you to trade
              freely.
            </li>
          </ul>
          <div
            class="act-btn d-flex align-center justify-center mt-10"
            style="gap: 16px"
          >
            <v-btn
              outlined
              color="rgba(255, 255, 255, 0.60)"
              @click="$emit('input', false)"
              width="180"
              >Cancel</v-btn
            >
            <v-btn
              style="
                border: 1px solid #0e6cc6;
                background: linear-gradient(
                  180deg,
                  #00070c 0%,
                  #074178 113.39%
                );
                text-shadow: 0px 0px 8px #6172f3;
              "
              color="#fff"
              outlined
              @click="onStake"
              :loading="stakeLoading"
              :disabled="keyBalance == '0'"
              width="180"
              >Stake</v-btn
            >
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { fetchKeyBalanceStake } from "@/api/booster";

export default {
  props: {
    value: Boolean,
    keyBalance: String,
  },
  data() {
    return {
      stakeLoading: false,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  created() {},

  methods: {
    async onStake() {
      if (this.keyBalance == "0") {
        this.$toast2(
          "Sorry, balance cannot be less than 0 4EVER Key.",
          "error"
        );
        return;
      }
      this.stakeLoading = true;
      try {
        const { data } = await fetchKeyBalanceStake();
        this.stakeLoading = false;
        this.$toast2("Successfully staked!");
        this.$emit("input", false);
        this.$emit("onStaked");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
.select-menu {
  border-radius: 4px !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}
</style>
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

  .first-dialog-title {
    background: rgba(0, 129, 248, 0.1);
    text-shadow: 0px 0px 8px #6172f3;
  }
}

::v-deep .booster-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
  // backdrop-filter: blur(6.5px) !important;
}
.booster-module-dialog {
  padding: 13px;
  height: 420px;
  background: url("/img/booster/svg/dialog-bg.svg") no-repeat;
  background-size: contain;
}
.start-boosting-dialog {
  position: relative;
  height: 100%;
  padding: 20px 8px;
  color: #fff;
  border-radius: 5px;
  border-radius: 5px;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);

  .close-btn {
    position: absolute;
    right: 10px;
    top: 5px;
    cursor: pointer;
  }
  .deposit-dialog-title {
    padding: 4px 60px;
    background: rgba(0, 129, 248, 0.1);
    text-shadow: 0px 0px 8px #6172f3;
  }
}

.paragraph {
  padding: 16px 24px;
  margin-bottom: 8px;
  background: url("/img/booster/svg/fringe-bg.svg");
}

.network-select {
  color: #fff;
  border-radius: 4px;
  border: 0.5px solid rgba(255, 255, 255, 0.3);
  background: rgba(49, 49, 49, 0.9);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.35);
}

.v-list.v-select-list.v-sheet.theme--light.v-list--dense.theme--light {
  border-radius: 4px !important;
  // border: 0.5px solid rgba(255, 255, 255, 0.3) !important;
  background: rgba(49, 49, 49, 0.9) !important;
}

::v-deep .theme--light.v-btn.v-btn--disabled {
  color: rgba(255, 255, 255, 0.3) !important;
  cursor: not-allowed !important;
}
.stake-tips {
  padding: 0 24px;
  color: #fff;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  opacity: 0.6;
}

ul,
li {
  list-style: outside;
}
</style>
