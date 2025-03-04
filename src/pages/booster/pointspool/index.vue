<template>
  <div class="earn-container">
    <div class="container-top">
      <div class="nav-bar">
        <div class="nav-mobile d-flex align-center justify-space-between">
          <div class="logo d-flex align-center" @click="backtoindex">
            <img src="/img/booster/spin/chevron-left.png" width="24" alt="" />
          </div>
          
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
      <div class="mx-4">
        <h3 class="mobile-title fz-16 mb-2">Aggregator Mining</h3>
        <div class="mobile-subtitle fz-12">
          Complete tasks to start mining and share abundant points and token rewards.
        </div>
      </div>
    </div>
    <div class="earn-list">
      <div class="item-tab">
        <v-tabs class="tabWrap"
          v-model="tab"
          centered
          background-color="#121536"
        >
          <v-tab>
            <div class="itemActive">All</div>
          </v-tab>
          <v-tab>
            <div class="itemActive">Activated</div>
          </v-tab>
          <v-tab>
            <div class="itemActive">Inactive</div>
          </v-tab>
          <v-tab>
            <div class="itemActive">Ended</div>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="pt-3">
          <v-tab-item>
            <div class="empty text-center" v-if="!earnList.length">
              <img src="/img/booster/svg/empty.svg" width="200" alt="" />
              <div>Empty</div>
            </div>
            <div
              class="d-flex justify-space-between align-center"
              v-for="(item, i) in earnList"
              :key="i"
              style="padding: 4px 0"
              @click="openEarn(item)"
            >
              <div class="d-flex justify-start align-center">
                <div>
                  <img :src="item.projectLogoUrl" width="44" class="projectImg" alt="" />
                </div>
                <div style="margin-left: 12px">
                  <div class="item-title">{{ item.projectName }}</div>
                  <div class="item-text">
                    {{ $utils.formatCompactNumbers(item.projectTotalPoints+item.projectInitTotalPoints)
                    }}{{ " " }}{{ item.projectName }} {{ item.projectName == 'LSP Finance' ? 'Gems' : item.rewardType == 'POINT'? 'Points': item.rewardType == 'TOKEN' ? 'Tokens': 'Gems' }}
                  </div>
                </div>
              </div>
              <v-btn v-if="item.type === 'unlocked'" class="earning-btn">
                <img src="/img/booster/earnings/check.svg" width="16" alt="" />
                <span class="btn-text">Mining</span>
              </v-btn>
              <v-btn v-else-if="item.type === 'locked'" class="unLock-btn">
                <span class="btn-text">Start Mining</span>
              </v-btn>
              <div
                v-else-if="item.type === 'distributing'"
                class="distributing"
              >
                <img src="/img/booster/earnings/data.svg" width="16" alt="" />
                <span class="btn-text">Distributing</span>
              </div>
              <div
                v-else-if="item.type === 'distributed'"
                class="distributing"
              >
                <img src="/img/booster/earnings/icon_check.png" width="16" alt="" />
                <span class="btn-text">Distributed</span>
              </div>
              <div v-else class="ended">
                <img src="/img/booster/earnings/icon_mining_check.png" width="16" alt="" />
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
              style="padding: 4px 0"
              @click="openEarn(item)"
            >
              <div class="d-flex justify-start align-center">
                <div>
                  <img :src="item.projectLogoUrl" width="44" class="projectImg" alt="" />
                </div>
                <div style="margin-left: 12px">
                  <div class="item-title">{{ item.projectName }}</div>
                  <div class="item-text">
                    {{ $utils.formatCompactNumbers(item.projectTotalPoints+item.projectInitTotalPoints)
                    }}{{ " " }}{{ item.projectName }} {{ item.projectName == 'LSP Finance' ? 'Gems' : item.rewardType == 'POINT'? 'Points': item.rewardType == 'TOKEN' ? 'Tokens': 'Gems' }}
                  </div>
                </div>
              </div>
              <v-btn class="earning-btn">
                <img src="/img/booster/earnings/check.svg" width="16" alt="" />
                <span class="btn-text">Mining</span>
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
              style="padding: 4px 0"
              @click="openEarn(item)"
            >
              <div class="d-flex justify-start align-center">
                <div>
                  <img :src="item.projectLogoUrl" width="44" class="projectImg" alt="" />
                </div>
                <div style="margin-left: 12px">
                  <div class="item-title">{{ item.projectName }}</div>
                  <div class="item-text">
                    {{ $utils.formatCompactNumbers(item.projectTotalPoints+item.projectInitTotalPoints)
                    }}{{ " " }}{{ item.projectName }} {{ item.projectName == 'LSP Finance' ? 'Gems' : item.rewardType == 'POINT'? 'Points': item.rewardType == 'TOKEN' ? 'Tokens': 'Gems' }}
                  </div>
                </div>
              </div>
              <v-btn class="unLock-btn">
                <span class="btn-text">Start Mining</span>
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
              style="padding: 4px 0"
              @click="openEarn(item)"
            >
              <div class="d-flex justify-start align-center">
                <div>
                  <img :src="item.projectLogoUrl" width="44" class="projectImg" alt="" />
                </div>
                <div style="margin-left: 12px">
                  <div class="item-title">{{ item.projectName }}</div>
                  <div class="item-text">
                    {{ $utils.formatCompactNumbers(item.projectTotalPoints+item.projectInitTotalPoints) }}
                    {{ " " }}{{ item.projectName }} {{ item.projectName == 'LSP Finance' ? 'Gems' : item.rewardType == 'POINT'? 'Points': item.rewardType == 'TOKEN' ? 'Tokens': 'Gems' }}
                  </div>
                </div>
              </div>
              
              <div
                v-if="item.type === 'distributing'"
                class="distributing"
              >
                <img src="/img/booster/earnings/data.svg" width="16" alt="" />
                <span class="btn-text">Distributing</span>
              </div>
              <div
                v-else-if="item.type === 'distributed'"
                class="distributing"
              >
                <img src="/img/booster/earnings/icon_check.png" width="16" alt="" />
                <span class="btn-text">Distributed</span>
              </div>
              <div v-else class="ended">
                <img src="/img/booster/earnings/icon_mining_check.png" width="16" alt="" />
                <span class="btn-text">Ended</span>
              </div>
            </div>
          </v-tab-item>
          <booster-pagination
            v-show="earnList.length != 0"
            :length="totalPages"
            class="mt-5"
            v-model="page"
            @input="getList"
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
          <v-toolbar-title>4EVERLAND Aggregator Mining Rules</v-toolbar-title>
        </v-toolbar>
        <v-list class="rulelist">
          <v-list-item>
            <v-list-item-content>
              <div class="swap-title-content">
                <span class="rules-text">4EVERLAND Aggregator Mining</span> is a Telegram Mining brought to you by 4EVERLAND and our <strong class="rules-text">eco projects</strong>, where you can earn airdrops and token rewards from multiple projects at the same time!
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="swap-title"
                >1. Engagement Process</v-list-item-title
              >
              <div class="swap-rule-content">
                <span class="rules-text">Start Boost:</span> To qualify for mining, all new users must first launch  4EVERLAND TG MiniApp before moving on to the next step.
              </div>
              <div class="swap-rule-content">
                <span class="rules-text">Complete Tasks:</span> Go to the
                <span class="rules-text">Mining</span> module and complete the simple tasks set by our project partners.
              </div>
              <div class="swap-rule-content">
                <span class="rules-text">Airdrops/Token Rewards:</span> Log in daily to collect your mining rewards.
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="swap-title"
                >2.Rewards Breakdown
              </v-list-item-title>
              <div class="swap-rule-title">Rewards rules:</div>
              <div class="pl-4">
                <div class="swap-rule-content">
                  The rewards generated are based on your individual <span class="rules-text">earning rate.</span>
                </div>
                <div class="swap-rule-content">
                  Rewards are generated
                  <span class="rules-text">every 4 hours.</span> If you have 6 unclaimed rewards, it will pause, so be sure to claim them on time.
                </div>
              </div>
              <div class="swap-rule-title">Distribution Instructions:</div>
              <div class="pl-4">
                <div class="swap-rule-content">
                  Project mining will stop once points and tokens are fully mined. You can then check the
                  <span class="rules-text">distribution status</span> in the
                  <span class="rules-text">Mining</span> module.
                </div>
                <div class="swap-rule-content">
                  Mining rewards will be distributed to your linked EVM wallet by the mining project. Please follow this <a target="_blank" class="rules-text" style="text-decoration: underline;"  href="https://docs.4everland.org/get-started/quick-start-guide/account/linking-wallet-to-your-4everland-account">tutorial</a> to link your wallet if you haven't done so before.

                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="swap-title"
                >3.Friendly Reminder</v-list-item-title
              >
              <div class="swap-rule-content">
                Users who fail to complete the required project tasks will not receive mining rewards.
              </div>
              <div class="swap-rule-content">
                <span class="rules-text">Cheating methods,</span> including
                scripts or automated tools, etc,
                <span class="rules-text">are not allowed.</span>
                Anyone caught violating this rule will be disqualified and will
                lose their rewards.
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <div class="swap-title-content">
                If you have any questions, please contact us for assistance.
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
            return item.type === "ended" || item.type === "distributing" || item.type === "distributed";
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
      this.getList();
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
      if(this.$route.query.id) {
        this.partnerInfo = this.dataList.find(
          (item) => item.id === this.$route.query.id
        );
        this.showEarn = true;
      }
    },
    async getList() {
      const res = await fetchPoolProjectList();
      if (res.code === 200) {
        this.dataList = res.data;
      }
      this.totalPages = Math.ceil(res.data.length / this.size);
      this.updateEarnList();
    },
    updateEarnList() {
      const filteredData = this.filteredEarnList;
      this.totalPages = Math.ceil(filteredData.length / this.size);
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
    "$route.query"() {
      console.log('val');
      if (val) {
        
        // this.partnerInfo = info;
        // this.showEarn = true;
      }
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
    height: 188px;
    background: url("/img/booster/earnings/mining-bg.png");
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
    margin-top: -20px;
    padding-top: 0px;
    background: #0C111D;
    .projectImg {
      border-radius: 44px;
    }
    .tabWrap {
      height: 35px;
      border-radius: 100px;
    }
    ::v-deep .v-tabs {
      .v-tab {
        color: #d0d5dd !important;
        padding: 0;
        font-size: 16px;
        min-width: 90px;
      }
      .v-tabs-bar {
          height: 35px;
          padding: 4px;
          margin: 0 5px;
        }
      .v-ripple__container {
          display: none;
        }
      .v-tab.v-tab--active {
        color: #fff !important;
        font-weight: bold !important;
        .itemActive {
          border-radius: 100px;
          padding: 3px 5px;
          background: #6172F3;
          font-weight: 700;
          min-width: 90px;
        }
      }
    }
    .v-tab:before {
      background: transparent !important;
    }
    ::v-deep .v-tabs-bar .v-tabs-slider {
      width: 0 !important;
      height: 0;
    }
    .theme--light.v-tabs-items {
      background: transparent !important;
      padding: 0 16px;
      height: 650px;
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
        background: transparent;
      }
      .unLock-btn {
        width: 113px;
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
        background: transparent;
      }
      .ended {
        height: 33px;
        padding: 8px 16px;
        border-radius: 4px;
        background: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .btn-text {
        font-size: 14px;
        font-weight: 400;
        color: #fff;
        margin-left: 4px;
        letter-spacing: normal;
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
      
      font-size: 1rem;
      text-align: center;
      padding-left: 8px !important;
    }
  }
  .swap-title {
    font-weight: 700;
  }
  .swap-rule-title {
    font-family: "Inter", sans-serif;
    font-size: 14px;
    color: #ffffff;
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
  .swap-title-content {
    font-family: "Inter", sans-serif;
    font-size: 12px;
    line-height: 16px;
    color: #ffffffbf;
  }
  .swap-rule-content {
    margin-top:3px;
    font-family: "Inter", sans-serif;
    font-size: 12px;
    line-height: 16px;
    color: #ffffffbf;
    position: relative;
    padding-left: 12px;
  }
  .rules-text {
    font-weight: 500;
    color: #fff;
  }
  .swap-rule-content::before {
    content: "•";
    position: absolute;
    width: 20px;
    left: 0;
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
  