<template>
  <div>
    <v-overlay :value="value" opacity="1" v-if="asMobile">
      <div
        class="withdraw-overlay d-flex flex-column align-center justify-center"
      >
        <div class="withdraw-title">Withdraw Ton</div>
        <div
          class="withdraw-amount-paragraph mt-6 d-flex align-center justify-space-between"
          style="width: 100%"
        >
          <div>Balance</div>
          <div class="d-flex align-center">
            <img src="/img/booster/ton-icon.png" width="24" alt="" />
            <span class="ml-1 fz-14">{{ amount }} Ton</span>
          </div>
        </div>

        <ul class="withdraw-tips fz-12 mt-4">
          <li>The minimum withdrawal amount is 0.1 Ton.</li>
          <li>Withdrawals may take time. Please be patient!</li>
        </ul>

        <div class="mt-8 d-flex align-center" style="gap: 30px">
          <v-btn
            outlined
            class="cancel-btn"
            color="#fff"
            width="140"
            height="48"
            @click="$emit('input', false)"
          >
            Cancel
          </v-btn>

          <v-btn
            class="withdraw-btn"
            width="140"
            height="48"
            :loading="loading"
            @click="handleTonWithdraw"
          >
            Withdraw
          </v-btn>
        </div>
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
          <div class="withdraw-title">Withdraw Ton</div>

          <div
            class="withdraw-amount-paragraph mt-6 d-flex align-center justify-space-between"
            style="width: 100%"
          >
            <div>Balance</div>
            <div class="d-flex align-center">
              <img src="/img/booster/ton-icon.png" width="24" alt="" />
              <span class="ml-1 fz-14">{{ amount }} Ton</span>
            </div>
          </div>

          <ul class="withdraw-tips fz-12 mt-4">
            <li>The minimum withdrawal amount is 0.1 Ton.</li>
            <li>Withdrawals may take time. Please be patient!</li>
          </ul>

          <div class="mt-auto d-flex align-center" style="gap: 8px">
            <v-btn
              outlined
              class="cancel-btn"
              color="#fff"
              width="200"
              height="48"
              @click="$emit('input', false)"
            >
              Cancel
            </v-btn>
            <v-btn
              class="withdraw-btn"
              width="200"
              height="48"
              :loading="loading"
              @click="handleTonWithdraw"
            >
              Withdraw
            </v-btn>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { fetchClaimUSDTLog, tonWithdraw } from "@/api/booster";
import { toUserFriendlyAddress } from "@tonconnect/ui";
import { mapState, mapGetters } from "vuex";

export default {
  props: {
    value: Boolean,
    amount: Number,
  },
  data() {
    return {
      size: 10,
      page: 1,
      usdtLogs: [],
      loading: false,
    };
  },
  computed: {
    ...mapState({
      tonConnectUI: (s) => s.moduleBooster.tonConnectUI,
    }),
    ...mapGetters(["tonConnected"]),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  methods: {
    async getList() {
      try {
        const { data } = await fetchClaimUSDTLog(this.page, this.size);
        console.log(data);
        this.usdtLogs = data.content;
      } catch (error) {
        console.log(error);
      }
    },
    async handleTonWithdraw() {
      if (this.amount < 0.02) return this.$toast2("At Least 0.02 Ton", "info");
      try {
        if (!this.tonConnected) {
          await this.tonConnectUI.connectWallet();
        }
        this.loading = true;
        const address = toUserFriendlyAddress(
          this.tonConnectUI.account.address
        );
        console.log(address, "===== friendaddr");
        const { data, code, message } = await tonWithdraw(address, "0.1");
        console.log(data, code, message);
        if (code == 200) {
          this.$emit("input", false);
          this.$toast2(
            "Your withdrawal request submitted, thank you for your patience.",
            "success"
          );
          this.$store.dispatch("getBoostTonCount");
        } else {
          this.$toast2(message, "error");
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.getList();
      }
    },
  },
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
  height: 339px;
  // background: url("/img/booster/svg/withdraw-dialog-bg.svg") no-repeat;
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

.withdraw-log {
  padding: 0 8px;
  margin: 24px 0;
  width: 100%;
  font-weight: 400;
  .withdraw-log-title {
    color: #a4bcfd;
    line-height: normal;
    margin-bottom: 12px;
  }
  .withdraw-log-text {
    color: rgba(255, 255, 255, 0.75);
  }
  .withdraw-log-created {
    color: rgba(255, 255, 255, 0.5);
  }
}
ul,
li {
  list-style: disc;
}
.withdraw-tips {
  width: 100%;
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
.cancel-btn {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
}
</style>
