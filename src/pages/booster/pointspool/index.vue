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
            <div class="empty text-center" v-if="!earnList.length">
              <img src="/img/booster/svg/empty.svg" width="200" alt="" />
              <div>Empty</div>
            </div>
            <div
              class="d-flex justify-space-between align-center"
              v-for="(item, i) in earnList"
              :key="i"
              style="padding: 10px 0"
              @click="openEarn(item)"
            >
              <div class="d-flex justify-start align-center">
                <div>
                  <img :src="item.projectLogoUrl" width="44" alt="" />
                </div>
                <div style="margin-left: 12px">
                  <div class="item-title">{{ item.projectName }}</div>
                  <div class="item-text">
                    {{ $utils.formatCompactNumbers(item.projectTotalPoints)
                    }}{{ " " }}${{ item.projectName }}
                  </div>
                </div>
              </div>
              <v-btn v-if="item.type === 'unlocked'" class="earning-btn">
                <img src="/img/booster/earnings/check.svg" width="16" alt="" />
                <span class="btn-text">Earning</span>
              </v-btn>
              <v-btn v-else-if="item.type === 'locked'" class="unLock-btn">
                <img src="/img/booster/earnings/lock.svg" width="16" alt="" />
                <span class="btn-text">Locked</span>
              </v-btn>
              <div
                v-else-if="item.type === 'distributing'"
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
            <div class="empty text-center" v-if="!earnList.length">
              <img src="/img/booster/svg/empty.svg" width="200" alt="" />
              <div>Empty</div>
            </div>
            <div
              class="d-flex justify-space-between align-center"
              v-for="(item, i) in earnList"
              :key="i"
              style="padding: 10px 0"
              @click="openEarn(item)"
            >
              <div class="d-flex justify-start align-center">
                <div>
                  <img :src="item.projectLogoUrl" width="44" alt="" />
                </div>
                <div style="margin-left: 12px">
                  <div class="item-title">{{ item.projectName }}</div>
                  <div class="item-text">
                    {{ $utils.formatCompactNumbers(item.projectTotalPoints)
                    }}{{ " " }}${{ item.projectName }}
                  </div>
                </div>
              </div>
              <v-btn class="earning-btn" >
                <img src="/img/booster/earnings/check.svg" width="16" alt="" />
                <span class="btn-text">Earning</span>
              </v-btn>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="empty text-center" v-if="!earnList.length">
              <img src="/img/booster/svg/empty.svg" width="200" alt="" />
              <div>Empty</div>
            </div>
            <div
              class="d-flex justify-space-between align-center"
              v-for="(item, i) in earnList"
              :key="i"
              style="padding: 10px 0"
              @click="openEarn(item)"
            >
              <div class="d-flex justify-start align-center">
                <div>
                  <img :src="item.projectLogoUrl" width="44" alt="" />
                </div>
                <div style="margin-left: 12px">
                  <div class="item-title">{{ item.projectName }}</div>
                  <div class="item-text">
                    {{ $utils.formatCompactNumbers(item.projectTotalPoints)
                    }}{{ " " }}${{ item.projectName }}
                  </div>
                </div>
              </div>
              <v-btn class="unLock-btn">
                <img src="/img/booster/earnings/lock.svg" width="16" alt="" />
                <span class="btn-text">Locked</span>
              </v-btn>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="empty text-center" v-if="!earnList.length">
              <img src="/img/booster/svg/empty.svg" width="200" alt="" />
              <div>Empty</div>
            </div>
            <div
              class="d-flex justify-space-between align-center"
              v-for="(item, i) in earnList"
              :key="i"
              style="padding: 10px 0"
              @click="openEarn(item)"
            >
              <div class="d-flex justify-start align-center">
                <div>
                  <img :src="item.projectLogoUrl" width="44" alt="" />
                </div>
                <div style="margin-left: 12px">
                  <div class="item-title">{{ item.projectName }}</div>
                  <div class="item-text">
                    {{ $utils.formatCompactNumbers(item.projectTotalPoints) }}
                    {{ " " }}${{ item.projectName }}
                  </div>
                </div>
              </div>
              <div class="ended">
                <span class="btn-text">Ended</span>
              </div>
            </div>
          </v-tab-item>
          <booster-pagination
            v-show="earnList.length != 0"
            :length="totalPages"
            class="mt-5"
            v-model="page"
            @input="init"
          ></booster-pagination>
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
import { bus } from "@/utils/bus";
import { fetchPoolProjectList, fetchProjectTasks } from "@/api/booster";
import BoosterPagination from "../components/booster-pagination.vue";
export default {
  components: {
    EarnDialog,
    BoosterPagination,
  },
  computed: {
    filteredEarnList() {
      if (this.tab === 0) {
        return this.dataList;
      } else {
        return this.dataList.filter((item) => {
          if (this.tab === 1) {
            return item.type === "unlocked";
          } else if (this.tab === 2) {
            return item.type === "locked";
          } else {
            return item.type === "ended";
          }
        });
      }
    },
  },
  data() {
    return {
      dialog: false,
      tab: null,
      showEarn: false,
      partnerInfo: {},
      earnList: [],
      dataList: [],
      page: 1,
      size: 10,
      totalPages: 0,
    };
  },
  mounted() {
    bus.$on("refreshPartnerList", (info) => {
      this.init();
    });
    this.init();
  },
  beforeDestroy() {
    bus.$off("refreshPartnerList");
  },
  
  methods: {
    async init() {
      const res = await fetchPoolProjectList();
      if (res.code === 200) {
        this.dataList = res.data;
      }
      this.totalPages = Math.ceil(res.data.length / this.size);
      this.updateEarnList();
    },
    updateEarnList() {
      const filteredData = this.filteredEarnList;
      let num1 = this.size * (this.page - 1);
      let num2 = this.size * this.page;
      this.earnList = filteredData.slice(num1, num2);
    },
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
  watch: {
    page(val) {
      this.page = val;
      this.updateEarnList();
    },
    tab() {
      this.page = 1;
      this.updateEarnList();
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
.ruleDialog {
  background: linear-gradient(
      180deg,
      rgba(57, 59, 62, 0.9) 25.52%,
      rgba(36, 39, 42, 0.9) 100%
    ),
    #4c5277;
  background-blend-mode: overlay;
  color: #ffffff;
  .ruleDialog-toolbar {
    color: #fff;
    background: transparent;
    box-shadow: none;
    .v-toolbar__title {
      width: 80%;
      text-align: center;
    }
  }
  .swap-rule-title {
    font-family: "Inter", sans-serif;
    font-size: 14px;
    color: #ffffff;
    font-weight: 700;
    position: relative;
    padding-left: 12px;
    line-height: 20px;
  }
  .swap-rule-title::before {
    content: "•";
    position: absolute;
    width: 20px;
    left: 0;
  }
  .swap-rule-content {
    font-family: "Inter", sans-serif;
    font-size: 12px;
    line-height: 16px;
    color: #ffffffbf;
  }
  .rulelist {
    background: transparent;
    color: #fff;
    .v-list-item {
      color: #fff;
    }
  }
}
.empty {
  margin: 50px 0;
}
</style>
  