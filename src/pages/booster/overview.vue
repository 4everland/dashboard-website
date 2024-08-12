<template>
  <div class="booster-overview">
    <div class="booster-overview-content" style="position: relative">
      <img
        class="booster-overview-bg"
        id="booster-overview-bg"
        :src="bgImg"
        alt=""
      />
      <div
        v-if="!boosterInfo.preActivities && !isTg"
        class="booster-overview-task"
        @click="handleShowStartBoost"
      >
        <img src="/img/booster/Logo.png" alt="" />
        <span>Claim +20pts/h</span>
      </div>
      <overview-pc
        @handleStartBoost="handleShowStartBoost"
        @handleUnlock="handleShowUnlock"
      ></overview-pc>
      <overview-h5
        @handleStartBoost="handleShowStartBoost"
        @handleUnlock="handleShowUnlock"
      ></overview-h5>
      <start-boosting
        v-model="showStartBoost"
        @showEndPoints="showEndBoost = true"
      ></start-boosting>
      <end-boosting v-model="showEndBoost"></end-boosting>
      <unlock-dialog
        v-model="showUnlockDialog"
        :unlockStage="unlockStage"
      ></unlock-dialog>

      <bottom-bar @handleStartBoost="handleShowStartBoost"></bottom-bar>
      <nft-drawer v-if="userInfo.uid"></nft-drawer>
      <task-drawer v-if="userInfo.uid"></task-drawer>
      <bind-dialog v-model="showBindWallet"></bind-dialog>
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
import BottomBar from "./components/bottom-bar.vue";
import BindDialog from "./components/bind-dialog.vue";
import UnlockDialog from "./components/unlock-dialog.vue";
import { mapState } from "vuex";

export default {
  data() {
    return {
      showStartBoost: false,
      showEndBoost: false,
      showBindWallet: false,
      showUnlockDialog: false,
      timer: null,
      unlockStage: 0,
    };
  },
  computed: {
    ...mapState({
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
      userInfo: (s) => s.userInfo,
    }),
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
          return "/img/booster/mobile-bg.png";
        if (!this.storageLocked && !this.networkLocked)
          return "/img/booster/mobile-bg-s2n.png";
        if (!this.storageLocked && !this.computingLocked)
          return "/img/booster/mobile-bg-s2c.png";
        if (!this.networkLocked && !this.computingLocked)
          return "/img/booster/mobile-bg-n2c.png";
        if (!this.storageLocked) return "/img/booster/mobile-bg-storage.png";
        if (!this.networkLocked) return "/img/booster/mobile-bg-network.png";
        if (!this.computingLocked) return "/img/booster/mobile-bg-computed.png";

        if (this.boosterInfo.baseRate.length == 0) {
          return "/img/booster/mobile-bg-locked.png";
        }
        return "/img/booster/mobile-bg-unlocked.png";
      } else {
        if (!this.storageLocked && !this.networkLocked && !this.computingLocked)
          return "/img/booster/bg.png";
        if (!this.storageLocked && !this.networkLocked)
          return "/img/booster/bg-s2n.png";
        if (!this.storageLocked && !this.computingLocked)
          return "/img/booster/bg-s2c.png";
        if (!this.networkLocked && !this.computingLocked)
          return "/img/booster/bg-n2c.png";
        if (!this.storageLocked) return "/img/booster/bg-storage.png";
        if (!this.networkLocked) return "/img/booster/bg-network.png";
        if (!this.computingLocked) return "/img/booster/bg-computed.png";
        if (this.boosterInfo.baseRate.length == 0) {
          return "/img/booster/bg-locked.png";
        }
        return "/img/booster/bg-unlocked.png";
      }
    },
    isTg() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
  },

  created() {
    this.timer = setInterval(() => {
      this.$store.commit("updateDate");
    }, 1000);

    if (!localStorage.token) {
      localStorage.loginTo = location.pathname + location.search;
    }
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
          path: "/booster",
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
      if (from.path == "/booster/explore") {
        vm.$store.dispatch("getBoosterUserInfo");
      }
    });
  },
  methods: {
    handleShowStartBoost() {
      if (!this.userInfo.wallet) {
        this.showBindWallet = true;
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
  },
};
</script>

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
  }
}
</style>
