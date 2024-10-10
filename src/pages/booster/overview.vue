<template>
  <div class="booster-overview">
    <div class="booster-overview-content" style="position: relative">
      <img class="booster-overview-bg" v-if="!isVideo" :src="bgImg" alt="" />
      <video
        v-else
        class="booster-overview-bg vid"
        :src="bgImg"
        autoplay
        loop
        muted
      ></video>

      <TgStartBoostOverlay
        v-if="isTgMiniApp && boostLocked"
      ></TgStartBoostOverlay>
      <template v-else>
        <div
          v-if="!boosterInfo.preActivities && !isTgMiniApp"
          class="booster-overview-task"
          @click="handleShowStartBoost"
        >
          <img src="/img/booster/Logo.png" alt="" />
          <span>Claim +30pts/h</span>
        </div>
        <overview-pc
          v-if="!asMobile"
          @handleStartBoost="handleShowStartBoost"
          @handleUnlock="handleShowUnlock"
        ></overview-pc>
        <overview-h5
          v-else
          @handleStartBoost="handleShowStartBoost"
          @handleUnlock="handleShowUnlock"
        ></overview-h5>
        <start-boosting
          v-model="showStartBoost"
          @showEndPoints="showEndBoost = true"
        ></start-boosting>
        <unlock-dialog
          v-model="showUnlockDialog"
          :unlockStage="unlockStage"
        ></unlock-dialog>
        <EasterEgg v-model="showEasterEggDialog"></EasterEgg>
        <DailySignDialog v-model="showDailySign"></DailySignDialog>
        <bottom-bar @handleStartBoost="handleShowStartBoost"></bottom-bar>
        <nft-drawer></nft-drawer>
        <task-drawer></task-drawer>
        <tool-drawer></tool-drawer>
        <invite-drawer></invite-drawer>
        <bind-dialog v-model="showBindWallet"></bind-dialog>
      </template>
      <!-- <end-boosting v-model="showEndBoost"></end-boosting> -->
    </div>
  </div>
</template>

<script>
import OverviewPc from "./overview/overview-pc.vue";
import OverviewH5 from "./overview/overview-h5.vue";
import StartBoosting from "./components/start-boosting.vue";
import EndBoosting from "./components/end-boosting.vue";
import NftDrawer from "./components/nft-drawer.vue";
import TaskDrawer from "./components/task-drawer.vue";
import ToolDrawer from "./components/tool-drawer.vue";
import InviteDrawer from "./components/invite-drawer.vue";

import BottomBar from "./components/bottom-bar.vue";
import BindDialog from "./components/bind-dialog.vue";
import UnlockDialog from "./components/unlock-dialog.vue";
import TgStartBoostOverlay from "./components/tg-start-boost-overlay.vue";
import EasterEgg from "./components/easter-egg.vue";
import DailySignDialog from "./components/daily-sign-dialog.vue";

import { bus } from "@/utils/bus";
import { mapState, mapGetters } from "vuex";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
const driverObj = driver({
  showProgress: true,
  nextBtnText: "Next  &raquo;",
  prevBtnText: "Skip",
  showButtons: ["next", "close"],
  doneBtnText: "Done",
  allowClose: false,
  steps: [
    {
      element: "#mobile-point-send",
      popover: {
        description: "Click to Claim Points!",
        side: "left",
        align: "start",
      },
    },
    {
      element: ".token-dialog-icon",
      popover: {
        description:
          "Backed by BNBCHAIN, Arweave, and IPFS! Grab Your Airdrop Ticket: $4EVER Points!",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: ".activity-item:nth-child(4)",
      popover: {
        description: "Complete Tasks for More Points!",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: ".mobile-points",
      popover: {
        description: "Boost Earning Rate for Faster Point Generation!",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#storage-boost",
      popover: {
        description:
          "Unlock Storage, Network, and Computing Nodes to achieve massive points!",
        side: "top",
        align: "start",
      },
    },
    {
      element: ".activity-item:nth-child(3)",
      popover: {
        description: "Explore Daily and 'Steal' Points from Others!",
        side: "right",
        align: "start",
      },
    },
  ],
  onPopoverRender: (popover, { config, state }) => {
    const firstButton = document.createElement("button");
    const nextBtn = document.querySelector(".driver-popover-next-btn");
    firstButton.innerText = "Skip";
    firstButton.style.color = "#fff";
    firstButton.style.fontWeight = "900";
    firstButton.style.background = "transparent";
    firstButton.style.textShadow = "none";
    firstButton.style.border = "none";
    popover.footerButtons.insertBefore(firstButton, nextBtn);

    firstButton.addEventListener("click", () => {
      driverObj.destroy();
    });
  },
});

export default {
  data() {
    return {
      showStartBoost: false,
      showEndBoost: false,
      showUnlockDialog: false,
      timer: null,
      unlockStage: 0,
      showDailySign: true,
    };
  },
  computed: {
    ...mapState({
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
      showEasterEggDialog: (s) => s.moduleBooster.showEasterEggDialog,
      userInfo: (s) => s.userInfo,
    }),
    ...mapGetters(["notLogin", "boostLocked", "balance", "showBindWallet"]),

    storageBoost() {
      return this.boosterInfo.baseRate.filter((it) => it.name == "storage");
    },
    networkBoost() {
      return this.boosterInfo.baseRate.filter((it) => it.name == "network");
    },
    computeBoost() {
      return this.boosterInfo.baseRate.filter((it) => it.name == "compute");
    },
    storageLocked() {
      return this.storageBoost.length == 0;
    },
    networkLocked() {
      return this.networkBoost.length == 0;
    },
    computingLocked() {
      return this.computeBoost.length == 0;
    },
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    bgImg() {
      if (this.asMobile) {
        if (!this.storageLocked && !this.networkLocked && !this.computingLocked)
          return "https://static.4everland.org/boost/background/mobile-bg.png";
        if (!this.storageLocked && !this.networkLocked)
          return "https://static.4everland.org/boost/background/mobile-bg-s2n.png";
        if (!this.storageLocked && !this.computingLocked)
          return "https://static.4everland.org/boost/background/mobile-bg-s2c.png";
        if (!this.networkLocked && !this.computingLocked)
          return "https://static.4everland.org/boost/background/mobile-bg-n2c.png";
        if (!this.storageLocked)
          return "https://static.4everland.org/boost/background/mobile-bg-storage.png";
        if (!this.networkLocked)
          return "https://static.4everland.org/boost/background/mobile-bg-network.png";
        if (!this.computingLocked)
          return "https://static.4everland.org/boost/background/mobile-bg-computed.png";

        if (this.boosterInfo.baseRate.length == 0) {
          return "https://static.4everland.org/boost/background/mobile-bg-locked.png";
        }
        return "https://static.4everland.org/boost/background/mobile-bg-unlocked.png";
      } else {
        if (!this.storageLocked && !this.networkLocked && !this.computingLocked)
          return "https://static.4everland.org/boost/background/bg.webm";
        if (!this.storageLocked && !this.networkLocked)
          return "https://static.4everland.org/boost/background/bg-s2n.webm";
        if (!this.storageLocked && !this.computingLocked)
          return "https://static.4everland.org/boost/background/bg-s2c.webm";
        if (!this.networkLocked && !this.computingLocked)
          return "https://static.4everland.org/boost/background/bg-n2c.webm";
        if (!this.storageLocked)
          return "https://static.4everland.org/boost/background/bg-storage.webm";
        if (!this.networkLocked)
          return "https://static.4everland.org/boost/background/bg-network.webm";
        if (!this.computingLocked)
          return "https://static.4everland.org/boost/background/bg-computed.webm";
        if (this.boosterInfo.baseRate.length == 0)
          return "https://static.4everland.org/boost/background/bg-locked.png";

        return "https://static.4everland.org/boost/background/bg-unlocked.webm";
      }
    },
    isVideo() {
      return /.webm/.test(this.bgImg);
    },
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
  },

  async created() {
    bus.$on("showEndBoostEvent", () => {
      this.showEndBoost = true;
    });
    this.timer = setInterval(() => {
      this.$store.commit("updateDate");
    }, 1000);

    // if (!localStorage.token) {
    //   localStorage.loginTo = location.pathname + location.search;
    // }
    if (this.$route.query && this.$route.query.showStart) {
      this.showStartBoost = true;
      let query = this.$route.query;
      let queryKeys = Object.keys(query).filter((it) => it != "showStart");
      let queryObj = {};
      if (queryKeys.length > 0) {
        queryKeys.forEach((it) => {
          queryObj[it] = query[it];
        });
      }
      if (this.$route.query) {
        this.$router.replace({
          path: "/boost",
          query: queryObj,
        });
      }
    }
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },
  beforeRouteEnter(_, from, next) {
    next((vm) => {
      if (from.path == "/boost/explore") {
        vm.$store.dispatch("getBoosterUserInfo");
      }
    });
  },
  methods: {
    handleShowStartBoost() {
      if (!this.userInfo.wallet && this.boostLocked) {
        this.$store.dispatch("BindWalletToggle");
      } else {
        this.showStartBoost = true;
      }
    },
    handleShowUnlock(val) {
      this.unlockStage = val;
      this.showUnlockDialog = true;
    },
  },

  components: {
    OverviewPc,
    OverviewH5,
    StartBoosting,
    EndBoosting,
    NftDrawer,
    TaskDrawer,
    BottomBar,
    BindDialog,
    UnlockDialog,
    TgStartBoostOverlay,
    ToolDrawer,
    InviteDrawer,
    EasterEgg,
    DailySignDialog,
  },

  watch: {
    boostLocked(val) {
      if (localStorage.guide) return;
      if (!val && this.isTgMiniApp) {
        setTimeout(() => {
          driverObj.drive();
          localStorage.setItem("guide", "1");
        }, 2000);
      }
    },
  },
};
</script>

<style>
:not(body):has(> .driver-active-element) {
  overflow: initial !important;
}
.driver-popover-arrow {
  display: none;
}
.driver-popover {
  /* background: #17191d; */
  background: #6172f3 !important;
  color: #fff;
}
.driver-popover-prev-btn {
  text-shadow: none !important;
  border: none !important;
  color: #101828 !important;
}

.driver-popover-next-btn {
  padding: 6px 12px !important;
  text-shadow: none !important;
  border: none !important;
  background: #fff !important;
  color: #6172f3 !important;
  font-weight: bolder !important;
}
.driver-popover-progress-text {
  color: #eaecf0;
}
</style>
<style lang="scss" scoped>
.booster-overview-task {
  position: absolute;
  top: 88px;
  left: 38px;
  cursor: pointer;
  img {
    width: 94px;
  }
  span {
    width: 120px;
    display: block;
    font-size: 14px;
    padding: 4px 8px;
    align-items: center;
    border-radius: 4px;
    background: rgba(71, 205, 137, 0.75);
    box-shadow: 0px 0px 8px 0px rgba(137, 234, 251, 0.5);
    backdrop-filter: blur(2px);
    position: absolute;
    text-align: center;
    bottom: -10px;
    white-space: nowrap;
    left: 50%;
    transform: translate(-50%, -50%); /* 50%为自身尺寸的一半 */
    -webkit-transform: translate(-50%, -50%);
  }
}

@media screen and(max-width: 960px) {
  .booster-overview-bg {
    max-height: initial !important;
    min-height: 100vh !important;
  }
  .booster-overview-task {
    position: absolute;
    top: 128px;
    right: 20px;
    left: unset;
    cursor: pointer;
    img {
      width: 64px;
    }
    span {
      width: 100px;
      font-size: 12px;
      padding: 2px 4px;
    }
  }
}
.booster-overview {
  background: #000;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .booster-overview-bg {
    max-height: 100vh;
    width: 100%;
    display: block;
    object-fit: cover;
  }
}
</style>
