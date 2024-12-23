<template>
  <div>
    <div class="profile-drawer-box">
      <v-navigation-drawer
        class="invite-drawer"
        :absolute="!asMobile"
        :fixed="asMobile"
        bottom
        right
        temporary
        :hide-overlay="!asMobile"
        color="#1E2234"
        :value="showProfileDrawer"
        @input="handleToggle"
      >
        <v-container fluid style="padding: 24px 16px">
          <div class="drawer-title">Account</div>
          <div class="account-container">
            <div class="d-flex align-center land-balance">
              <e-team-avatar
                :src="userInfo.avatar"
                :size="40"
                :uid="userInfo.uid"
              ></e-team-avatar>
              <div class="ml-1">
                <div class="fw-b" v-if="isTgMiniApp">
                  {{ userInfo.telegramAccount.name }}
                </div>
                <div :class="isTgMiniApp ? 'tg-username' : 'pc-username'">
                  {{ (userInfo.username || "unkown").cutStr(6, 4) }}
                </div>
              </div>

              <v-btn
                class="connect-btn ml-auto"
                @click="handleShowConnect"
                v-if="isTgMiniApp && !userInfo.wallet"
              >
                <img src="/img/booster/svg/wallet.svg" width="16" alt="" />
                <span class="ml-1"> Connect </span>
              </v-btn>
            </div>

            <div class="mt-4">
              <div class="land-title">LAND Balance</div>
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <span>{{ balance.land }}</span>
                  <span>{{ balance.unit }}</span>
                  <v-btn
                    small
                    color="#fff"
                    icon
                    :loading="reloadBalance"
                    @click.stop="handleGetBalance"
                  >
                    <v-icon color="#fff">mdi-refresh</v-icon>
                  </v-btn>
                </div>
                <v-btn
                  class="deposit-btn"
                  color="#6172F3"
                  @click="handleToDeposit"
                  :width="asMobile ? '80px' : '116px'"
                >
                  <img
                    v-if="!asMobile"
                    src="/img/booster/svg/pig_bank.svg"
                    width="16"
                    alt=""
                  />
                  <span class="ml-1" style="color: #fff">Deposit</span>
                </v-btn>
              </div>
            </div>
          </div>
          <div class="assets assets-tab">
            <div class="assets-title">My Assets</div>
            <v-tabs v-model="tab" background-color="#1E2234" centered>
              <v-tab>Token Balance</v-tab>
              <v-tab>Points Balance</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" background-color="#1E2234">
              <v-tab-item>
                <div
                  class="d-flex align-center justify-space-between assets-item"
                >
                  <div
                    class="d-flex align-center"
                    style="gap: 8px"
                    @click="showWithdrawLogDialog = true"
                  >
                    <img
                      src="/img/booster/ton-invite-icon.png"
                      width="40"
                      alt=""
                    />

                    <div class="d-flex flex-column">
                      <div class="d-flex align-center">
                        <span>Ton</span>
                        <img
                          class="cursor-p"
                          src="/img/booster/svg/right-arrow.svg"
                          width="16"
                          alt=""
                        />
                      </div>
                      <ICountUp
                        class="fz-12"
                        style="color: #94a3b8"
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
                    </div>
                  </div>

                  <v-btn
                    class="withdraw-btn"
                    :width="asMobile ? '80px' : '116px'"
                    :disabled="tonCount <= 0"
                    @click="showWithdrawDialog = true"
                  >
                    <img
                      class="mr-1"
                      v-if="!asMobile"
                      src="/img/booster/svg/withdraw-icon.svg"
                      width="16"
                      alt=""
                    />
                    <span>Withdraw</span>
                  </v-btn>
                </div>
              </v-tab-item>
              <v-tab-item>
                <div v-if="!showPointsBalance" v-for="(item, index) in tokenList" :key="index">
                  <div
                    class="d-flex align-center justify-space-between assets-item"
                    @click="showBalance(item.projectId)"
                  >
                    <div class="d-flex align-center" style="gap: 8px">
                      <img :src="item.logoUrl" width="40" alt="" />

                      <div class="d-flex flex-column">
                        <div class="d-flex align-center">
                          <span>{{ item.name }}</span>
                        </div>
                        <div class="balance-number">
                          {{ Number(item.balance).toFixed(2) }}
                        </div>
                      </div>
                    </div>
                    <img
                      class="cursor-p"
                      src="/img/booster/svg/right-arrow.svg"
                      width="24"
                      alt=""
                    />
                  </div>
                </div>
                <booster-pagination
                  v-show="tokenList.length != 0"
                  :length="totalPages"
                  class="mt-5"
                  v-model="page"
                  @input="getTokenList"
                ></booster-pagination>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-container>
        <WithdrawDialog
          v-model="showWithdrawDialog"
          :amount="tonCount"
        ></WithdrawDialog>
        <WithdrawLogDialog v-model="showWithdrawLogDialog"></WithdrawLogDialog>

        <PointsBalance
          v-model="showPointsBalance"
          :projectId="projectId"
        ></PointsBalance>
      </v-navigation-drawer>
    </div>
    <!-- <WalletConnect ref="walletConnect" /> -->
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import WithdrawDialog from "./withdraw-dialog.vue";
import WithdrawLogDialog from "./withdraw-log-dialog.vue";
import PointsBalance from "./points-balance-history.vue";
// import WalletConnect from "../components/wallet-connect.vue";
import ICountUp from "vue-countup-v2";
import { bus } from "@/utils/bus";
import { fetchTokenList } from "@/api/booster";
import BoosterPagination from "./booster-pagination.vue";

export default {
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      showProfileDrawer: (s) => s.moduleBooster.showProfileDrawer,
      tonCount: (s) => s.moduleBooster.tonCount,
      info: (s) => s.projectInfo,
    }),
    ...mapGetters(["balance", "notLogin"]),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
  },

  data() {
    return {
      reloadBalance: false,
      showWithdrawDialog: false,
      showWithdrawLogDialog: false,
      showPointsBalance: false,
      tab: 0,
      tokenList: [],
      size: 10,
      page: 1,
      type: "point",
      projectId: "",
      totalPages: 0,
    };
  },
  mounted() {
    this.getTokenList();
  },
  methods: {
    handleToggle(val) {
      if (val) {
        this.$store.dispatch("getBoostTonCount");
      } else {
        this.$store.commit("SET_PROFILE_BAR", val);
      }
    },
    async handleGetBalance() {
      try {
        this.reloadBalance = true;
        await this.$store.dispatch("getBalance");
        this.reloadBalance = false;
      } catch (error) {
        console.log(error);
      }
    },
    handleShowConnect() {
      this.$store.commit("SET_PROFILE_BAR", false);
      this.$store.dispatch("ConnectDrawerState", { state: true });
    },
    handleToDeposit() {
      if (this.isTgMiniApp) {
        bus.$emit("showDepositDialog", { land: 0 });
        return this.$emit("input", false);
      }
      if (!this.notLogin) this.$router.push("/billing/deposit");
    },
    async getTokenList() {
      try {
        const { data } = await fetchTokenList(this.type,this.page,this.size);
        this.tokenList = data.content;
        this.totalPages = data.totalPages;
      } catch (error) {
        console.log(error);
      }
      
    },
    showBalance(projectId) {
      this.projectId = projectId;
      this.showPointsBalance = true;
    },
  },
  components: {
    ICountUp,
    WithdrawDialog,
    WithdrawLogDialog,
    PointsBalance,
    BoosterPagination
  },
  watch: {
    showProfileDrawer(val) {
      if (!val) {
        this.showWithdrawDialog = false;
        this.showWithdrawLogDialog = false;
        this.showPointsBalance = false;
      }
      this.getTokenList();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .profile-drawer-box {
  .invite-drawer {
    width: 100% !important;
    height: 86% !important;
    max-height: 100% !important;
    background-image: url("/img/booster/drawer/profile-bg.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    overflow: scroll;
  }
  .drawer-title {
    font-size: 20px;
    font-weight: 500;
    color: #fff;
    text-shadow: 0px 0px 8px #6172f3;
  }
  .account-container {
    gap: 8px;
    margin: 16px 0;
    padding: 16px;
    border-radius: 8px;
    background: #000;
  }
  .land-title,
  .assets-title {
    font-size: 16px;
    color: #fff;
    text-shadow: 0px 0px 8px #6172f3;
  }
  .assets {
    margin-top: 16px;
    padding: 8px 0 16px 0;
    // border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  }
  .assets-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    padding-bottom: 12px;
    margin-bottom: 16px;
  }
  .balance-number {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
    color: #94a3b8;
  }
  .land-title {
    margin-bottom: 8px;
  }
  .land-balance {
    padding: 8px 0 16px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  }
  .assets-title {
    margin-bottom: 16px;
  }
  .deposit-btn,
  .withdraw-btn {
    letter-spacing: 0;
    padding: 8px;
    color: #fff;
    border-radius: 4px;
    background: #6172f3;
  }

  .deposit-btn.v-btn--disabled,
  .withdraw-btn.v-btn--disabled {
    // background: linear-gradient(0deg, #eaecf0 0%, #eaecf0 100%),
    //   linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%) !important;
    color: #fff !important;
    opacity: 0.5 !important;
    background: #31383f !important;
  }

  .tg-username {
    color: #94a3b8;
    font-size: 12px;
  }
  .pc-username {
    font-weight: bold;
  }
  .connect-btn {
    letter-spacing: 0;
    color: #fff;
    border-radius: 4px;

    background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
    box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
  }
}
.v-tabs {
  .v-tab {
    color: #d0d5dd !important;
    min-width: 0 !important;
    padding: 0;
    height: 24px;
    margin-left: 20px;
    font-size: 16px;
  }
  .v-tab.v-tab--active {
    color: #fff !important;
    font-weight: bold !important;
  }
}
.v-tabs-bar .v-tabs-slider {
  min-width: 0 !important;
}
.theme--light.v-tabs-items {
  background: transparent !important;
}
@media (min-width: 960px) {
  .profile-drawer-box {
    ::v-deep .invite-drawer {
      top: 74px !important;
      right: 24px !important;
      width: 558px !important;
      height: calc(100% - 74px - 64px - 24px) !important;
    }

    .account-container {
      margin: 24px 0;
    }
    .assets {
      margin-top: 24px;
    }
  }
}
</style>
