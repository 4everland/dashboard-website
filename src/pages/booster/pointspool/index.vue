<template>
  <div class="earn-container">
    <div class="container-top">
      <div class="nav-bar">
        <div class="nav-mobile d-flex align-center justify-space-between">
          <div class="logo d-flex align-center" @click="backtoindex">
            <img src="/img/booster/spin/chevron-left.png" width="24" alt="" />
          </div>
          <div class="mobile-title">Unlock Diverse Earnings</div>
          <div>
            <div
              class="spin-rules d-flex justify-center align-center"
              @click="opendialog"
            >
              <img src="/img/booster/spin/rules-icon.svg" width="16" alt="" />
              &nbsp;Rules
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="earn-list">
      <div class="item-tab">
        <v-tabs v-model="tab" left background-color="#000">
          <v-tab>All</v-tab>
          <v-tab>Unlocked</v-tab>
          <v-tab>Locked</v-tab>
          <v-tab>Ended</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <div
              class="d-flex justify-space-between align-center"
              v-for="(item, i) in earnList"
              :key="i"
              style="padding: 10px 0"
            >
              <div class="d-flex justify-start align-center">
                <div>
                  <img :src="item.logo" width="44" alt="" />
                </div>
                <div style="margin-left: 12px">
                  <div class="item-title">{{ item.title }}</div>
                  <div class="item-text">{{ item.text }}</div>
                </div>
              </div>
              <v-btn
                v-if="item.status === 'unlock'"
                class="earning-btn"
                @click="openEarn(item)"
              >
                <img src="/img/booster/earnings/check.svg" width="16" alt="" />
                <span class="btn-text">Earning</span>
              </v-btn>
              <v-btn v-else-if="item.status === 'lock'" class="unLock-btn">
                <img src="/img/booster/earnings/lock.svg" width="16" alt="" />
                <span class="btn-text">UnLock</span>
              </v-btn>
              <div
                v-else-if="item.status === 'distributing'"
                class="distributing"
              >
                <img src="/img/booster/earnings/data.svg" width="16" alt="" />
                <span class="btn-text">Distributing</span>
              </div>
              <div v-else class="ended">
                <span class="btn-text">Ended</span>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div
              class="d-flex justify-space-between align-center"
              v-for="(item, i) in filteredEarnList"
              :key="i"
              style="padding: 10px 0"
            >
              <div class="d-flex justify-start align-center">
                <div>
                  <img :src="item.logo" width="44" alt="" />
                </div>
                <div style="margin-left: 12px">
                  <div class="item-title">{{ item.title }}</div>
                  <div class="item-text">{{ item.text }}</div>
                </div>
              </div>
              <v-btn class="earning-btn" @click="openEarn">
                <img src="/img/booster/earnings/check.svg" width="16" alt="" />
                <span class="btn-text">Earning</span>
              </v-btn>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div
              class="d-flex justify-space-between align-center"
              v-for="(item, i) in filteredEarnList"
              :key="i"
              style="padding: 10px 0"
            >
              <div class="d-flex justify-start align-center">
                <div>
                  <img :src="item.logo" width="44" alt="" />
                </div>
                <div style="margin-left: 12px">
                  <div class="item-title">{{ item.title }}</div>
                  <div class="item-text">{{ item.text }}</div>
                </div>
              </div>
              <v-btn class="unLock-btn">
                <img src="/img/booster/earnings/lock.svg" width="16" alt="" />
                <span class="btn-text">UnLock</span>
              </v-btn>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div
              class="d-flex justify-space-between align-center"
              v-for="(item, i) in filteredEarnList"
              :key="i"
              style="padding: 10px 0"
            >
              <div class="d-flex justify-start align-center">
                <div>
                  <img :src="item.logo" width="44" alt="" />
                </div>
                <div style="margin-left: 12px">
                  <div class="item-title">{{ item.title }}</div>
                  <div class="item-text">{{ item.text }}</div>
                </div>
              </div>
              <div class="ended">
                <span class="btn-text">Ended</span>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card class="ruleDialog">
        <v-toolbar dark class="ruleDialog-toolbar">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Withdraw Rules</v-toolbar-title>
        </v-toolbar>
        <v-list class="rulelist">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="swap-rule-title"
                >Points Withdraw</v-list-item-title
              >
              <div class="swap-rule-content">
                Everyone can withdraw their $4EVER Points for Ton based on their
                allocated ‘Points Quota’. The more points you have, the more Ton
                you can withdraw.
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="swap-rule-title"
                >Points Quota</v-list-item-title
              >
              <div class="swap-rule-content">
                The Points Quota specifies how many points can be withdrawn for
                Ton, with an withdraw rate of 100 points=$0.1. The Quotas is
                valid for 24 hours before they expire.
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="swap-rule-title"
                >Spin</v-list-item-title
              >
              <div class="swap-rule-content">
                You earn one ‘Spin’ time for each friend you successfully invite
                to join 4EVER Boost during the each withdraw round. After each
                round, your invites will reset.
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="swap-rule-title">TON</v-list-item-title>
              <div class="swap-rule-content">
                The Ton amount you receive may vary due to the fluctuating value
                of Ton, reflecting the actual amount credited to your account.
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <EarnDialog v-model="showEarn" :info="partnerInfo"></EarnDialog>
  </div>
</template>
  
  <script>
import EarnDialog from "../components/earning-open.vue";
export default {
  components: {
    EarnDialog,
  },
  computed: {
    filteredEarnList() {
      if (this.tab === 0) {
        return this.earnList;
      } else {
        if (this.tab === 1) {
          return this.earnList.filter((item) => {
            return item.status === "unlock";
          });
        }else if(this.tab === 2){
          return this.earnList.filter((item) => {
            return item.status === "lock";
          });
        }else{
          return this.earnList.filter((item) => {
            return item.status === "ended";
          });
        }
      }
    },
  },
  data() {
    return {
      dialog: false,
      tab: null,
      showEarn: false,
      partnerInfo: {},
      earnList: [
        {
          logo: require("/public/img/booster/earnings/tomarket.png"),
          title: "Tomarket",
          text: "10M $Tomarket",
          status: "unlock",
        },
        {
          logo: require("/public/img/booster/earnings/piggy.png"),
          title: "PiggyPiggy",
          text: "10M $PiggyPiggy",
          status: "unlock",
        },
        {
          logo: require("/public/img/booster/earnings/duckchain.png"),
          title: "DuckChain",
          text: "10M $DuckChain",
          status: "lock",
        },
        {
          logo: require("/public/img/booster/earnings/capybara-logo.png"),
          title: "Capybara",
          text: "10M $Capybara",
          status: "lock",
        },
        {
          logo: require("/public/img/booster/earnings/yescoin.png"),
          title: "Yescoin",
          text: "10M $Yescoin",
          status: "lock",
        },
        {
          logo: require("/public/img/booster/earnings/ton-lucky.png"),
          title: "TON Lucky",
          text: "10M $TON Lucky",
          status: "distributing",
        },
        {
          logo: require("/public/img/booster/earnings/cherry-game.png"),
          title: "Cherry Game",
          text: "10M $Cherry Game",
          status: "ended",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    opendialog() {
      this.dialog = true;
    },
    openEarn(info) {
      this.partnerInfo = info;
      this.showEarn = true;
    },
    backtoindex() {
      this.$router.push("/boost");
    },
  },
};
</script>
  
<style lang="scss" scoped>
@media screen and (max-width: 960px) {
}
.earn-container {
  background: #000;
  .container-top {
    height: 125px;
    background: url("/img/booster/earnings/head-top.png");
    background-size: contain;
    .nav-bar {
      height: 64px;
      padding: 20px 0;
      .logo {
        margin-left: 12px;
      }
      .mobile-title {
        font-size: 16px;
        font-weight: 700;
        line-height: 20px;
      }
      .spin-rules {
        width: 67px;
        height: 23px;
        font-size: 12px;
        font-weight: 400;
        background: #12153680;
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
        text-align: center;
        line-height: 23px;
      }
    }
  }
  .earn-list {
    position: relative;
    top: -28px;
    // height: 87vh;
    // bottom: 0;
    border-radius: 24px 24px 0px 0px;
    border: 1px 0px 0px 0px;
    padding-top: 12px;
    background: linear-gradient(0deg, #06090f, #06090f),
      linear-gradient(
        180deg,
        rgba(58, 71, 98, 0.25) 0%,
        rgba(58, 71, 98, 0) 69.08%
      );
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
      padding: 0 16px;
      .item-text {
        font-size: 12px;
        font-weight: 400;
        color: #a4bcfd;
      }
      .earning-btn {
        width: 102px;
        height: 33px;
        padding: 8px 16px;
        border-radius: 4px;
        opacity: 0px;
        border: 1px solid;
        background: #00305ccc;
        border-color: linear-gradient(
          96.98deg,
          #43e7fa -22.19%,
          #4135fd 99.83%
        );
      }
      .unLock-btn {
        width: 102px;
        height: 33px;
        padding: 8px 16px;
        border-radius: 4px;
        background: linear-gradient(96.98deg, #0fe1f8 -22.19%, #1102fc 99.83%);
      }
      .distributing {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 129px;
        height: 33px;
        padding: 8px 16px;
        border-radius: 21px;
        background: #31383f;
        border: 1px solid #ffffff1a;
      }
      .ended {
        height: 33px;
        padding: 8px 16px;
        line-height: 18px;
        border-radius: 21px;
        background: #31383f;
      }
      .btn-text {
        font-size: 14px;
        font-weight: 400;
        color: #fff;
        margin-left: 4px;
      }
    }
  }
}
</style>
  