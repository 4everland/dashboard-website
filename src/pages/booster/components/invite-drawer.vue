<template>
  <div class="invite-drawer-box">
    <v-navigation-drawer
      class="invite-drawer"
      :absolute="!asMobile"
      :fixed="asMobile"
      bottom
      right
      temporary
      :hide-overlay="!asMobile"
      color="#1E2234"
      :value="showInviteDrawer"
      @input="handleToggle"
      touchless
    >
      <v-container
        fluid
        class="d-flex flex-column"
        style="padding: 24px 0 24px 16px; height: 100%"
      >
        <div
          class="d-flex align-center justify-space-between mb-6"
          style="gap: 8px"
        >
          <div class="drawer-title">Invite to Earn Ton Rewards!</div>
          <div class="usdt-withdraw d-flex align-center justify-space-between">
            <div>
              <div class="fz-12">Balance</div>
              <div
                class="d-flex align-center"
                @click="showWithdrawLogDialog = true"
              >
                <img src="/img/booster/ton-invite-icon.png" width="16" alt="" />
                <ICountUp
                  class="usdt-enabled ml-1 fz-20"
                  :delay="1000"
                  :endVal="tonCount"
                  :options="{
                    decimalPlaces: 4,
                    useEasing: true,
                    useGrouping: true,
                    separator: ',',
                    decimal: '.',
                    prefix: '',
                    suffix: '',
                  }"
                />
                <img
                  class="cursor-p"
                  src="/img/booster/svg/right-arrow-b.svg"
                  width="16"
                  alt=""
                />
              </div>
            </div>

            <v-btn
              class="withdraw-btn"
              :disabled="tonCount <= 0"
              @click="handleWithdraw"
              >Withdraw
            </v-btn>
          </div>
        </div>

        <InviteTaskContent class="flex-1"></InviteTaskContent>
        <WithdrawDialog
          v-model="showWithdrawDialog"
          :amount="tonCount"
        ></WithdrawDialog>

        <WithdrawLogDialog v-model="showWithdrawLogDialog"></WithdrawLogDialog>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { mapState } from "vuex";
import ICountUp from "vue-countup-v2";
import WithdrawDialog from "./withdraw-dialog.vue";
import WithdrawLogDialog from "./withdraw-log-dialog.vue";
import InviteTaskContent from "./invite-components/invite-task-content.vue";
export default {
  computed: {
    ...mapState({
      showInviteDrawer: (s) => s.moduleBooster.showInviteDrawer,
      tonCount: (s) => s.moduleBooster.tonCount,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTg() {
      return process.env.VUE_APP_TG_VERSION == "true";
    },
  },
  components: {
    InviteTaskContent,
    ICountUp,
    WithdrawDialog,
    WithdrawLogDialog,
  },

  data() {
    return {
      showWithdrawDialog: false,
      showWithdrawLogDialog: false,
    };
  },
  methods: {
    handleToggle(val) {
      if (val) {
        this.$store.dispatch("getInviteInfo");
        this.$store.dispatch("getBoostTonCount");
        this.$store.dispatch("getInviteCount");
      } else {
        this.$store.commit("SET_INVITE_BAR", val);
      }
    },
    handleWithdraw() {
      this.showWithdrawDialog = true;
    },
  },
  watch: {
    showInviteDrawer(val) {
      if (!val) {
        this.showWithdrawDialog = false;
        this.showWithdrawLogDialog = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.invite-drawer-box {
  ::v-deep .invite-drawer {
    width: 100% !important;
    height: 80% !important;
    max-height: 100% !important;
    background-image: url("/img/booster/drawer/invite-bg.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    overflow: scroll;
    .drawer-title {
      font-size: 20px;
      font-weight: 500;
      color: #fff;
      text-shadow: 0px 0px 8px #6172f3;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .usdt-withdraw {
      gap: 8px;
      width: 216px;
      padding: 8px;
      color: #000;
      border-radius: 16px 0px 0px 16px;
      background: linear-gradient(0deg, #fff 0%, #fff 100%),
        linear-gradient(99deg, #ffe205 35.35%, #ffc305 56.77%);

      .usdt-enabled {
        font-family: "DIN Alternate";
        font-weight: 700;
      }
      .withdraw-btn {
        letter-spacing: 0;
        padding: 8px;
        color: #fff;
        border-radius: 8px;
        background: #6172f3;
      }

      .withdraw-btn.v-btn--disabled {
        background: linear-gradient(0deg, #eaecf0 0%, #eaecf0 100%),
          linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%) !important;
      }
    }
  }
}

@media (min-width: 960px) {
  .invite-drawer-box {
    ::v-deep .invite-drawer {
      top: 74px !important;
      right: 24px !important;
      width: 558px !important;
      height: calc(100% - 74px - 64px - 24px) !important;
    }
  }
}
</style>
