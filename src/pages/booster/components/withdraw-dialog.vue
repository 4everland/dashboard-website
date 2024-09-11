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
          class="withdraw-amount-paragraph mt-6 d-flex align-center justify-space-between"
          style="width: 100%"
        >
          <div>Balance</div>
          <div class="d-flex align-center">
            <img src="/img/booster/ton-icon.png" width="24" alt="" />
            <span class="ml-1 fz-14">{{ amount }}Ton</span>
          </div>
        </div>
        <div class="withdraw-log">
          <div class="withdraw-log-title">Balance history</div>
          <div
            class="d-flex flex-column"
            style="gap: 8px; height: 117px; overflow: auto"
          >
            <div
              v-for="item in usdtLogs"
              :key="item.id"
              class="d-flex align-center justify-space-between fz-14"
              style="line-height: 16px"
            >
              <span class="withdraw-log-text"
                >Invite {{ item.from.replace("invite_milestones_", "") }} new
                boosters {{ item.value }} Ton.</span
              >
              <span class="withdraw-log-created">
                {{ new Date(item.createdAt).format() }}</span
              >
            </div>
          </div>
        </div>
        <div class="withdraw-tips d-flex align-center fz-12">
          🔈 The minimum withdrawal amount is 1 USDT.Withdrawal will be
          processed within 24 hours.
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
            class="withdraw-amount-paragraph mt-6 d-flex align-center justify-space-between"
            style="width: 100%"
          >
            <div>Balance</div>
            <div class="d-flex align-center">
              <img src="/img/booster/ton-icon.png" width="24" alt="" />
              <span class="ml-1 fz-14">{{ amount }}Ton</span>
            </div>
          </div>

          <div class="withdraw-log">
            <div class="withdraw-log-title">Balance history</div>
            <div
              class="d-flex flex-column"
              style="gap: 8px; height: 117px; overflow: auto"
            >
              <div
                v-for="item in usdtLogs"
                :key="item.id"
                class="d-flex align-center justify-space-between fz-14"
                style="line-height: 16px"
              >
                <span class="withdraw-log-text"
                  >Invite {{ item.from.replace("invite_milestones_", "") }} new
                  boosters {{ item.value }} Ton.</span
                >
                <span class="withdraw-log-created">
                  {{ new Date(item.createdAt).format() }}</span
                >
              </div>
            </div>
          </div>
          <div class="withdraw-tips d-flex align-center fz-12">
            🔈 The minimum withdrawal amount is 1 USDT.Withdrawal will be
            processed within 24 hours.
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
import { fetchClaimUSDTLog } from "@/api/booster";
export default {
  props: {
    value: Boolean,
    amount: Number,
  },
  data() {
    return {
      size: 5,
      page: 1,
      usdtLogs: [],
    };
  },
  computed: {
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
  height: 489px;
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

.withdraw-log {
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
.withdraw-tips {
  width: 100%;
  padding: 2px 8px;
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
