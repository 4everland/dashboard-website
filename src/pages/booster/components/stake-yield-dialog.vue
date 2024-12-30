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
          Get Staking Yield
        </div>
        <div class="first-dialog-content">
          <div class="paragraph d-flex align-center justify-space-between">
            <span>Wallet address</span>
            <span class="font-weight-bold">{{
              (userInfo.username || "Not bound").cutStr(4, 4)
            }}</span>
          </div>
          <div class="paragraph d-flex align-center justify-space-between">
            <span>$4EVER balance</span>
            <span>100</span>
          </div>
          <ul class="stake-tips">
            <li>
              Randomly snapshot your $4EVER balance to update staking yield.
            </li>
            <li>Every 100 $4EVER contributes to a 0.0005% staking yield.</li>
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
              v-if="!userInfo.username"
              class="get-btn"
              outlined
              color="#fff"
              width="180"
              @click="onConnetc"
              >Connect Wallet</v-btn
            >
            <v-btn
              v-else
              class="get-btn"
              :disabled="disabled"
              outlined
              color="#fff"
              width="180"
              @click="getHold"
              >Continue</v-btn
            >
          </div>
        </div>
      </div>
      <!-- <WalletConnect class="wallet-connect" /> -->
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
            Get Staking Yield
          </div>
          <div class="paragraph d-flex align-center justify-space-between">
            <span>Wallet address</span>
            <span>{{ (userInfo.username || "Not bound").cutStr(4, 4) }}</span>
          </div>
          <div class="paragraph d-flex align-center justify-space-between">
            <span>$4EVER balance</span>
            <span>{{ balance }}</span>
          </div>
          <ul class="stake-tips mt-4">
            <li>
              Randomly snapshot your $4EVER balance to update staking yield.
            </li>
            <li>Every 100 $4EVER contributes to a 0.0005% staking yield.</li>
          </ul>
          <div
            class="act-btn d-flex align-center justify-center mt-8"
            style="gap: 16px"
          >
            <v-btn
              outlined
              color="rgba(255, 255, 255, 0.60)"
              @click="$emit('input', false)"
              width="240px"
              height="56px"
              >Cancel</v-btn
            >
            <v-btn
              v-if="!userInfo.username"
              class="get-btn"
              color="#fff"
              outlined
              @click="onConnetc"
              width="240px"
              height="56px"
              >Connect Wallet</v-btn
            >
            <v-btn
              v-else
              class="get-btn"
              color="#fff"
              outlined
              :disabled="disabled"
              @click="getHold"
              width="240px"
              height="56px"
              >Continue</v-btn
            >
          </div>
        </div>
      </div>
      <!-- <WalletConnect  /> -->
    </v-dialog>
  </div>
</template>
  
  <script>
import { mapState, mapGetters } from "vuex";
import { fetch4everBalance, handle4everStake } from "@/api/booster.js";

export default {
  props: {
    value: Boolean,
    keyBalance: String,
  },
  data() {
    return {
      stakeLoading: false,
      balance: 0,
      disabled: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  created() {},
  mounted() {
    this.getBalance();
  },
  methods: {
    async getBalance() {
      try {
        const { data } = await fetch4everBalance();
        this.balance = data.balance;
        if (!this.balance) {
          this.disabled = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getHold() {
      try {
        await handle4everStake();
      } catch (error) {
        console.log(error);
      }
      this.$emit("input", false);
      this.$store.dispatch("HoldProveState", { state: true });
    },
    onConnetc() {
      if (this.asMobile) {
        let state = true;
        this.$store.dispatch("ConnectDrawerState", { state: true });
      } else {
        this.$router.push("/account/config");
      }
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
  color: #0fe1f8;
  font-family: Inter;
  font-weight: 400;
  line-height: 20px;
}
.get-btn {
  border: 1px solid #0e6cc6;
  text-shadow: 0px 0px 8px #6172f3;
  background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
  box-shadow: 0px 4px 8px 0px #0085c340, 0px -4px 8px 0px #0085c340;
}
.wallet-connect {
  position: relative;
  z-index: 12;
}
ul,
li {
  list-style: outside;
}
</style>
  