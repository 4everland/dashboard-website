<template>
  <div class="d-md-none d-block">
    <div
      v-if="isTgMiniApp && !userInfo.wallet"
      class="trigger-icon pos-a"
      style="right: 193px; top: 61px"
      @click="onConnetc"
    >
      <img src="/img/booster/new/icon-connect.png" width="48" alt="" />
      <div class="trigger-text connect fz-12 fw-b text-center" style="width: 52px;">Connect</div>
    </div>
    <div
      v-if="isTgMiniApp"
      class="trigger-icon pos-a"
      style="right: 132px; top: 61px"
      @click="showBindExchange"
    >
      <img src="/img/booster/new/bind_2x.gif" width="48" alt="" />
      <div class="trigger-text connect fz-12 fw-b text-center">Airdrop</div>
    </div>
    <TokenDialog
      class="pos-a"
      style="right: 71px; top: 61px"
      v-if="isTgMiniApp"
    ></TokenDialog>

    <div
      v-if="asMobile"
      class="trigger-icon pos-a"
      id="activity_Account"
      style="right: 10px; top: 61px"
      @click="
        () =>
          !this.boostLocked ? this.$store.commit('SET_PROFILE_BAR', true) : ''
      "
    >
      <img src="/img/booster/icon-account.png" width="48" alt="" />
      <div class="trigger-text staking fz-12 fw-b text-center" style="width: 52px;">Account</div>
    </div>
    

    <!-- <div
      v-if="isTgMiniApp"
      class="trigger-icon pos-a"
      style="right: 67px; top: 57px"
      @click="
        () =>
          !this.boostLocked ? this.$store.dispatch('StakeDrawerToggle') : ''
      "
    >
      <img src="/img/booster/staking-icon.png" width="56" alt="" />
      <div class="trigger-text staking fz-12 fw-b text-center">STAKING</div>
    </div> -->
    <!-- <div
      v-if="isTgMiniApp && !userInfo.wallet"
      class="trigger-icon pos-a"
      style="right: 8px; top: 202px"
      @click="onConnetc"
    >
      <img src="/img/booster/wallet-connect-icon.png" width="56" alt="" />
      <div class="trigger-text connect fz-12 fw-b text-center">CONNECT</div>
    </div> -->
    <WalletConnect />

    <TgStartBoostLoading v-if="tgMiniOverlayLoading"></TgStartBoostLoading>

    <div v-else>
      <div class="not-login" v-if="boostLocked">
        <div class="card-storage mb-1 pos-r">
          <img
            class="pos-a"
            style="left: 50%; top: -20px"
            src="/img/booster/boost-icon.png"
            width="64"
            alt=""
          />
          <div class="boost-btn pos-a cursor-p" @click="handleStartBoost">
            START BOOST
          </div>
        </div>
      </div>
      <div v-else>
        <div
          class="daily-boost"
          @click="$emit('dailyClaim')"
          v-if="showDailySign"
        >
          <div style="position: relative">
            <div style="width: 10px; height: 10px"></div>
          </div>
          <img
            class="daily-boost-btn"
            src="/img/booster/daily-boost-btn.png"
            width="121"
            alt=""
          />
        </div>
        <div class="lightning-bg" v-if="!showDailySign">
          <dotlottie-player
            src="https://lottie.host/10211de3-1cbf-40d2-b3bb-e15c9c53e18f/84965ekRhy.json"
            background="transparent"
            speed="0.5"
            style="width: 100%"
            direction="1"
            playMode="normal"
            loop
            autoplay
          ></dotlottie-player>
        </div>

        <div
          class="point-square"
          @click="handleClaim"
          @touchstart="onPress"
          @touchend="onUp"
          @touchcancel="onUp"
          @mousedown="onPress"
          @mouseup="onUp"
          @mouseleave="onUp"
        >
          <div style="position: relative">
            <div style="width: 10px; height: 10px"></div>
          </div>
          <div class="top-card square-box" id="mobile-point-send">
            <div
              class="points fz-12 d-flex align-center"
              style="gap: 4px"
              :class="{
                locked: computedPoints < 1,
                explored: isExplored || computedPoints >= boosterInfo.capacity,
              }"
            >
              <span> {{ displayPoints }}/{{ boosterInfo.capacity }}</span>
            </div>
            <div class="protect-mask" v-if="isProtecting">
              <div class="protect-time">
                <img src="/img/booster/svg/protect-icon.svg" width="8" alt="" />
                <span>{{ protectTime }}</span>
              </div>
            </div>
            <img :src="displaySquare" width="80" alt="" />
            <img
              v-show="computedPoints > 1"
              class="pos-a"
              style="left: 50%; top: 30%; transform: translateX(-50%)"
              src="/img/booster/svg/finger.svg"
              width="16"
              alt=""
            />

            <!-- <div
              class="full-explored-tips"
              v-if="isExplored || computedPoints >= boosterInfo.capacity"
            >
              Claim to restart
            </div> -->
          </div>
        </div>

        <div class="gold-square" @click="handleStartReward" v-if="taskEnd">
          <div class="coin-card-light">
            <img src="/img/booster/icon-small-light.png" width="61" alt="" />
          </div>
          <div class="coin-card" id="mobile-gold-ball">
            <img src="/img/booster/spin/reward-ball.png" width="80" alt="" />
            <div class="ball-text">$100</div>
          </div>
        </div>

        <!-- <div class="gold-square" @click="airdropDialog = true" style="margin-top: 80px">
          <div class="top-card square-box-up" id="mobile-gold-ball">
            <img src="/img/booster/spin/reward-ball.png" width="80" alt="" />
          </div>
        </div> -->

        <div
          v-if="!taskEnd"
          class="points-swap d-flex flex-column align-center justify-center"
          @click="handleStartSpin"
          style="
            box-shadow: 0px 0px 20px 0px #ff940840, 0px 0px 10px 0px #f8630080,
              0px 0px 2.5px 0px #ffad08bf;
          "
        >
          <div class="points-text">${{ spinStartInfo.cashValue }} Withdraw</div>
          <v-progress-linear
            :value="pointPercent"
            height="10"
            rounded
            class="progress-time"
          ></v-progress-linear>
          <div class="fz-10 countTime" v-if="spinStartInfo">
            <count-down :endTimeStamp="spinStartInfo.endAt"></count-down>
          </div>
          <img
            class="right-img"
            src="/img/booster/spin/background-right.png"
            width="8"
            height="48"
            alt=""
          />
          <v-icon small class="right-icon">mdi-menu-right</v-icon>
        </div>

        <div
          v-if="asMobile"
          class="trigger-icon pos-a"
          style="left: 8px; top: 76%"
          @click="
            () =>
              !this.boostLocked ? this.$store.commit('SET_TOOL_BAR', true) : ''
          "
        >
          <img src="/img/booster/new/icon-tools.png" width="48" alt="" />
          <div class="trigger-text tools fz-12 fw-b text-center">Tools</div>
        </div>

        <div
          v-if="asMobile"
          class="trigger-icon pos-a"
          style="left: 64px; top: 76%"
          @click="
            () =>
              !this.boostLocked ? this.$store.dispatch('TaskDrawerToggle') : ''
          "
        >
          <img src="/img/booster/new/icon-earn.png" width="48" alt="" />
          <div class="trigger-text tools fz-12 fw-b text-center">Earn</div>
          <v-badge
              v-if="asMobile"
              class="undo-badge"
              style="position: absolute; right: 8px; top: 8px"
              v-show="taskUndo"
              color="red"
              dot
            >
            </v-badge>
        </div>

        <div
          v-if="asMobile"
          class="trigger-icon pos-a"
          style="left: 120px; top: 76%"
          @click="
            () =>
              !this.boostLocked ? this.$store.commit('SET_INVITE_BAR', true) : ''
          "
        >
          <img src="/img/booster/new/icon-invite.png" width="48" alt="" />
          <div class="trigger-text tools fz-12 fw-b text-center">Invite</div>
        </div>
        <div
          v-if="isTgMiniApp"
          class="trigger-icon pos-a"
          style="left: 176px; top: 76%"
          @click="
            () =>
              !this.boostLocked ? this.$store.dispatch('StakeDrawerToggle') : ''
          "
        >
          <img src="/img/booster/new/icon-staking.png" width="48" alt="" />
          <div class="trigger-text tools fz-12 fw-b text-center">Staking</div>
        </div>


        <div
          v-if="asMobile"
          class="trigger-icon pos-a"
          style="right: 0px; top: 76%"
          @click="
            () =>
              !this.boostLocked ? this.toggleExplore() : ''
          "
        >
          <img src="/img/booster/new/icon-explore.png" width="99" alt="" style="margin-top: 8px" />
          <div
              v-if="!boostLocked && exploreRemain > 0"
              class="count pos-a"
            >
              x{{ exploreRemain }}
          </div>
        </div>
        

        <div class="nodeBoostWrap">
          <div class="nodeboost-title pa-4 ">
            Node Boost
          </div>
          <div class="nodeboost-content px-4">
            <div class="d-flex justify-space-between">
              <div class="nodeboost-item" :class="{ 'storage-activity': !storageLocked }">
                <div class="storage-boost">
                  <div style="position: relative">
                    <div class="text-center">
                      <img
                        v-if="storageLocked"
                        class="storage-boost-img"
                        src="/img/booster/new/icon-storage.png"
                        height="58"
                        alt=""
                        />
                      <img
                        v-else
                        class="storage-boost-img"
                        src="/img/booster/new/icon-storage-active.png"
                        height="58"
                        alt=""
                        />
                    </div>
                  </div>
                  <div class="top-card" id="storage-boost" v-if="storageLocked">
                    <div class="card-storage" :class="{ locked: storageLocked }">
                      <div class="task-title d-flex align-center" style="gap: 2px">
                        <img src="/img/booster/svg/locked-icon.svg" width="16" alt="" />
                        <span class="text-center"> STORAGE<br> BOOST</span>
                      </div>
                      <div class="mt-1 fz-10 text-center">+100 pts/h & 2,500<br> Capacity</div>
                    </div>
                  </div>

                  <div class="unlocked-card text-center" id="storage-boost">
                    <div class="card-storage" v-if="!storageLocked">
                      <div
                        class="unlocked-card-title d-flex align-center justify-center"
                        
                        style="gap: 2px"
                      >
                        <span class="text-center"> STORAGE <br> BOOST</span>
                        
                      </div>
                      <div class="mt-1 fz-10 text-center">+100 pts/h & 2,500<br> Capacity</div>
                    </div>
                    <v-btn
                      v-else
                      class="unlock-btn"
                      min-width="56"
                      height="19"
                      :loading="unlockLoading == 0"
                      @click="handleUnlock(0)"
                      >Unlock</v-btn>
                  </div>
                </div>
              </div>
              <div class="nodeboost-item" :class="{ 'computing-activity': !computingLocked }">
                <div class="computing-boost">
                  <div style="position: relative">
                    <div class="text-center">
                      <img
                        v-if="computingLocked"
                        class="storage-boost-img"
                        src="/img/booster/new/icon-computing.png"
                        height="58"
                        alt=""
                        />
                        <img
                        v-else
                        class="storage-boost-img"
                        src="/img/booster/new/icon-computing-active.png"
                        height="58"
                        alt=""
                        />
                    </div>
                  </div>
                  <div class="top-card" v-if="computingLocked">
                    <div class="card-storage" :class="{ locked: computingLocked }">
                      <div class="task-title d-flex align-center" style="gap: 2px">
                        <img src="/img/booster/svg/locked-icon.svg" width="16" alt="" />
                        <span class="text-center"> COMPUTING<br>BOOST</span>
                      </div>
                      <div class="mt-1 fz-10 text-center">+100 pts/h & 2,500<br> Capacity</div>
                    </div>
                  </div>
                  <div class="unlocked-card text-center">
                    <div class="card-storage" v-if="!computingLocked">
                      <div
                        class="unlocked-card-title d-flex align-center justify-center"
                        v-if="!computingLocked"
                        style="gap: 2px"
                      >
                        <span class="text-center"> COMPUTING<br> BOOST</span>
                      </div>
                      <div class="mt-1 fz-10 text-center">+100 pts/h & 2,500<br> Capacity</div>
                    </div>
                    <v-btn
                      v-else
                      class="unlock-btn"
                      min-width="56"
                      height="19"
                      :loading="unlockLoading == 1"
                      @click="handleUnlock(1)"
                      >Unlock</v-btn
                    >
                  </div>
                </div>
                
              </div>
              <div class="nodeboost-item" :class="{ 'network-activity': !networkLocked }">
                <div class="network-boost">
                  <div style="position: relative">
                    <div class="text-center">
                      <img
                        v-if="networkLocked"
                        class="storage-boost-img"
                        src="/img/booster/new/icon-network-boost.png"
                        height="58"
                        alt=""
                        />
                      <img
                        v-else
                        class="storage-boost-img"
                        src="/img/booster/new/icon-network-boost-active.png"
                        height="58"
                        alt=""
                        />
                    </div>
                  </div>
                  <div class="top-card" v-if="networkLocked">
                    <div class="card-storage" :class="{ locked: networkLocked }">
                      <div class="task-title d-flex align-center" style="gap: 2px">
                        <img src="/img/booster/svg/locked-icon.svg" width="16" alt="" />

                        <span class="text-center">NETWORK<br> BOOST</span>
                      </div>
                      <div class="mt-1 fz-10 text-center">+100 pts/h & 2,500 <br>Capacity</div>
                    </div>
                  </div>
                  <div class="unlocked-card text-center">
                    <div class="card-storage" v-if="!networkLocked">
                    <div
                      class="unlocked-card-title d-flex align-center justify-center"
                      
                      style="gap: 2px"
                    >
                      <span class="text-center"> NETWORK<br> BOOST</span>
                    </div>
                    <div class="mt-1 fz-10 text-center">+100 pts/h & 2,500 <br>Capacity</div>
                  </div>
                    <v-btn
                      v-else
                      min-width="56"
                      class="unlock-btn"
                      height="19"
                      :loading="unlockLoading == 2"
                      @click="handleUnlock(2)"
                      >Unlock</v-btn
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <mobile-points-sheet v-model="sheet"></mobile-points-sheet>
    <AirdropDialog v-model="airdropDialog"></AirdropDialog>
    <StartQuery v-model="startQuery"></StartQuery>
  </div>
</template>

<script>
import { mapState } from "vuex";

import MobilePointsSheet from "../components/mobile-points-sheet.vue";
import TokenDialog from "../components/token-dialog.vue";
import AirdropDialog from "../components/airdrop-query.vue";
import StartQuery from "../components/start-query.vue";
import WalletConnect from "../components/wallet-connect.vue";
import countDown from "../components/count-down.vue";
import mixin from "./mixin";
import { bus } from "@/utils/bus";
import { fetchSpinStart } from "@/api/booster";
import { tonMove } from "../../../utils/animation";

export default {
  mixins: [mixin],
  data() {
    return {
      sheet: false,
      showGoldCoin: false,
      airdropDialog: false,
      startQuery:false,
      timeLeft: localStorage.getItem("countdownTime")
        ? parseInt(localStorage.getItem("countdownTime"))
        : 86400,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      spinStartInfo: (s) => s.moduleBooster.spinStartInfo,
      exploreRemain: (s) => s.moduleBooster.exploreRemain,
      taskUndo: (s) => s.moduleBooster.taskUndo,
    }),
    percent() {
      const curTimeStamp = +new Date() / 1e3;
      let percent =
        Math.ceil(curTimeStamp - this.spinStartInfo.startAt) / 86400;
      if (percent > 1) {
        percent = 1;
      }
      return percent * 100;
    },
    pointPercent() {
      const percent =
        this.spinStartInfo.currentDuration / this.spinStartInfo.duration;
      return percent * 100;
    },
    showGoldBall() {
      if (Object.keys(this.spinStartInfo).length > 0) {
        return this.percent >= 100 || this.spinStartInfo.claimAt != null;
      } else {
        return true;
      }
    },
    showGoldProgress() {
      const curTimeStamp = +new Date() / 1e3;
      let leftTime = this.spinStartInfo.endAt - curTimeStamp;
      return this.spinStartInfo.claimAt == null && leftTime > 0;
    },
    taskEnd() {
      const curTimeStamp = +new Date() / 1e3;
      if (Object.keys(this.spinStartInfo).length > 0) {
        return (
          curTimeStamp > this.spinStartInfo.endAt ||
          this.spinStartInfo.claimAt != null
        );
      } else {
        return true;
      }
    },
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  created() {
    bus.$on("showMobileSheet", () => {
      this.sheet = true;
    });
    bus.$on("showSwapSuccess", () => {
      this.showTonReceive();
      this.$store.dispatch("getBoosterUserInfo");
    });
  },
  beforeDestroy() {
    clearInterval(this.protectTimer);
  },
  components: {
    MobilePointsSheet,
    TokenDialog,
    WalletConnect,
    countDown,
    AirdropDialog,
    StartQuery
  },
  watch: {
    "boosterInfo.protectExpiredAt"() {
      this.protectCardTime();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    handleStartGetReward() {
      this.$router.push('/boost/earnings');
    },
    onConnetc() {
      let state = true;
      this.$store.dispatch("ConnectDrawerState", { state });
    },
    init() {
      let info = this.userInfo.username
        ? this.userInfo.username.cutStr(6, 4)
        : "unknown";
      let spinInfo = localStorage.getItem("spinInfo" + info);
      if (spinInfo) {
        this.$store.commit("SET_SPIN_INFO", JSON.parse(spinInfo));
      } else {
        this.showGoldCoin = true;
      }
    },
    toggleExplore() {
      if (this.boostLocked) return;
      if (this.exploreRemain < 1)
        return this.$toast2(
          "Whoops, you've used all your exploration times. Try again tomorrow!",
          "error"
        );
      this.$router.push("/boost/explore");
    },
    showTonReceive() {
      tonMove("mobile-gold-ball", "activity_Account");
    },
    handleStartSpin() {
      let info = this.userInfo.username
        ? this.userInfo.username.cutStr(6, 4)
        : "unknown";
      localStorage.removeItem("spinFirstStep" + info);
      this.$router.push("/boost/spin");
    },
    async handleStartReward() {
      const data = await fetchSpinStart();
      if (data.data) {
        this.$store.commit("SET_SPIN_INFO", data.data);
        let info = this.userInfo.username
          ? this.userInfo.username.cutStr(6, 4)
          : "unknown";
        //this.$store.dispatch("getSpinInfo");
        localStorage.setItem("spinInfo" + info, JSON.stringify(data.data));
        localStorage.setItem("spinFirstStep" + info, 1);
        this.$emit("startReward");
      } else {
        this.$toast2("Sorry, try it again later", "info");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(-10%);
  }
  50% {
    transform: translateY(0);
  }
}
@keyframes bounceup {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10%);
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.square-box {
  animation: bounce 2s infinite linear;
}
.square-box-up {
  animation: bounceup 2s infinite linear;
}
.not-login {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .card-storage {
    width: 280px;
    height: 98px;
    background: url("/img/booster/svg/mobile_card_locked.svg") no-repeat;
    background-size: contain;
  }
  .boost-btn {
    width: 232px;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10%;
    text-align: center;
    padding: 0 8px;
    font-weight: bold;
    font-size: 20px;
    border-radius: 4px;
    background: rgba(97, 114, 243, 0.75);
    box-shadow: 0px 0px 16px 0px rgba(137, 234, 251, 0.5);
    backdrop-filter: blur(2px);
  }
}
.points-card {
  position: absolute;
  right: 8px;
  top: 80px;
  width: 127px;
  height: 42px;
  background: url("/img/booster/mobile/card_background_points.png") no-repeat;
  background-size: 100%;
  .rate-box {
    position: absolute;
    left: -20px;
    bottom: -5px;
    .text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .arrow-btn {
    position: absolute;
    right: 10px;
    transition: all 0.3s ease;
    transform-origin: center;
  }
  .arrow-btn.rotate {
    rotate: 180deg;
  }
}
.unlock-btn {
  color: #fff !important;
  font-size: 12px;
  padding: 0 !important;
  letter-spacing: 0;
  border-radius: 2px;
  background: rgba(97, 114, 243, 0.75) !important;
  box-shadow: 0px 0px 8px 0px rgba(137, 234, 251, 0.5);
  backdrop-filter: blur(2px);
}

.card-storage {
  white-space: nowrap;
  padding: 4px;
  border-radius: 4px;
  backdrop-filter: blur(2px);
  > img {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
  }
  .task-title {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 4px;
    color: rgba(255, 255, 255, 0.75);
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    background: url("/img/booster/svg/fringe-bg.svg") no-repeat 100%;
    text-shadow: none;
    line-height: 10px;
  }
}
.unlocked-card-title {
  white-space: nowrap;
  padding: 2px 4px;
  border-top: 1px solid rgba(164, 188, 253, 0.25);
  border-bottom: 1px solid rgba(164, 188, 253, 0.25);
  background: rgba(97, 114, 243, 0.1);
  backdrop-filter: blur(2px);
  color: rgba(255, 255, 255, 1);
  text-align: center;
  font-size: 10px;
  font-weight: 400;
}
.storage-boost {
  .top-card {
    
  }
  .unlocked-card {
  }
}
.ball-text {
  font-size: 14px;
  font-weight: 700;
  line-height: 12px;
  text-align: center;
  margin-top: -20px;
}
.computing-boost {
  .top-card {
  }
  .unlocked-card {

  }
}
.network-boost {
  .top-card {
  }
  .unlocked-card {
  }
}

.daily-boost {
  position: absolute;
  left: 47%;
  top: 56%;

  .daily-boost-btn {
    position: absolute;
    right: 50%;
    transform: translateX(50%);
    top: 200%;
    cursor: pointer;
  }
}

.lightning-bg {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 40%;
  width: 50%;
  img {
    width: 100%;
  }
}

.protect-mask {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: url("/img/booster/protect.png") no-repeat;
  background-size: 100%;

  .protect-time {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    color: #2d3282;
    font-size: 8px;
    padding: 0px 2px;
    border-radius: 20px;
    background: #a4bcfd;
  }
}

.point-square {
  position: absolute;
  left: 50.5%;
  transform: translateX(-50%);
  top: 31%;
  .points {
    z-index: 10;
    padding: 0px 8px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 65%;
    font-weight: bold;
    border-radius: 16px;
    border: 1px solid rgba(18, 21, 54, 0.5);
    background: rgba(97, 114, 243, 0.75);
    box-shadow: 0px 0px 4px 0px rgba(255, 255, 255, 0.5);
  }

  .points.locked {
    background: rgba(52, 64, 84, 0.75);
  }
  .points.explored {
    background: linear-gradient(
        0deg,
        rgba(255, 173, 8, 0.5) 0%,
        rgba(255, 173, 8, 0.5) 100%
      ),
      linear-gradient(0deg, #121536 0%, #121536 100%), rgba(97, 114, 243, 0.75);
  }

  .full-explored-tips {
    white-space: nowrap;
    position: absolute;
    font-size: 12px;
    left: 50%;
    top: -6%;
    padding: 0px 8px;
    font-weight: bold;
    border-radius: 16px 16px 16px 0;
    background: #f04438;
  }
}

.gold-square {
  position: absolute;
  left: -5px;
  top: 45px;
  .coin-card-light{
    position: absolute;
    left: 9px;
    top: 10px;
    z-index: 0;
    img {
      animation: rotate 5s linear infinite;
    }
  }
  .coin-card {
    position: relative;
    z-index: 1;
  }
  .points {
    z-index: 10;
    padding: 0px 8px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 65%;
    font-weight: bold;
    border-radius: 16px;
    border: 1px solid rgba(18, 21, 54, 0.5);
    background: rgba(97, 114, 243, 0.75);
    box-shadow: 0px 0px 4px 0px rgba(255, 255, 255, 0.5);
  }
}

.start-booster-btn {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%);
  cursor: pointer;
}
.trigger-icon {
  cursor: pointer;
  .trigger-text {
    position: absolute;
    left: 0;
    bottom: 5%;
    width: 52px;
    padding: 2px 1.5px;
    line-height: 12px;
    backdrop-filter: blur(2px);
    border-radius: 4px;
  }
  .tools {
    width: 48px;
    font-weight: normal;
    font-size: 10px;
  }
  .claim {
    background: linear-gradient(
      135deg,
      rgba(15, 225, 248, 0.5) 14.29%,
      rgba(97, 114, 243, 0.5) 97.32%
    );
  }
  .staking {
    background: linear-gradient(
      148deg,
      rgba(255, 222, 127, 0.5) 13.1%,
      rgba(248, 99, 0, 0.13) 82.44%
    );
  }
  .tools {
    background: linear-gradient(180deg, rgba(97, 114, 243, 0.5) 0%, rgba(97, 114, 243, 0.125) 166.67%);
    backdrop-filter: blur(4px)
  }
  .partner {
    background: linear-gradient(120deg, rgba(97, 114, 243, 0.5) 24.53%, rgba(17, 2, 252, 0.5) 74.37%);

  }
  .connect {
    background: linear-gradient(
      120deg,
      rgba(97, 114, 243, 0.5) 24.53%,
      rgba(17, 2, 252, 0.5) 74.37%
    );
  }
}
.points-swap {
  position: absolute;
  left: 0;
  top: 10%;
  width: 100px;
  height: 48px;
  gap: 0px;
  border-radius: 0px 8px 8px 0px;
  background-image: url("/img/booster/spin/hands-coin.png"),
    linear-gradient(180deg, #ffad08, #ffde7f);
  background-size: auto, auto;
  background-position: left, 0 0;
  box-shadow: 0px 0px 20px 0px #ff940840;
  box-shadow: 0px 0px 10px 0px #f8630080;

  box-shadow: 0px 0px 2.5px 0px #ffad08bf;

  .right-img {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
  }
  .right-icon {
    position: absolute;
    right: -4px;
    top: 30%;
    z-index: 2;
  }
  .progress-time {
    width: 80px;
    margin: 2px 0;
    border: 1px solid #12153680;
    background: #121536bf;
  }
  .points-text {
    font-size: 12px !important;
    font-weight: 700 !important;
    line-height: 12px !important;
    text-align: center !important;
    color: #121536 !important;
  }
}
.countTime {
  color: #121536;
  line-height: 12px;
}
.nodeBoostWrap{
  width: 100%;
  position: absolute;
  top: 85%;
  background:
    linear-gradient(180deg, rgba(58, 71, 98, 0.25) 0%, rgba(58, 71, 98, 0) 69.08%),
    linear-gradient(154.45deg, rgba(97, 114, 243, 0) 42.1%, #6172F3 100%),#06090F;
  border: 1px solid rgba(98,112,151);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-image-slice: 1;
  border-bottom-color: transparent;
  padding-bottom: 20px;
  .nodeboost-title{
    font-size: 16px;
    color: #fff;
    text-shadow: 0px 0px 8px #6172F3;
    font-weight: bold;
    height: 75px;
  }
  .nodeboost-item{
    position: relative;
    width: 30%;
    background: linear-gradient(162.54deg, #0C111D 15.68%, #182230 91.11%);
    border-radius: 8px;
    border-bottom-right-radius: 16px;
    height: 130px;
    .storage-boost, .computing-boost, .network-boost{
      margin-top:-18px;
    }
  }
  .storage-activity {
    background: linear-gradient(162.54deg, #1102FC 15.68%, #0FE1F8 91.11%);
  }
  .computing-activity {
    background: linear-gradient(162.54deg, #6938EF 15.68%, #6172F3 91.11%);
  }
  .network-activity {
    background: linear-gradient(162.54deg, #009393 15.68%, #1EEFA4 91.11%);
  }
}
::v-deep .undo-badge .v-badge__badge {
  width: 10px;
  height: 10px;
  border-radius: 100%;
}
.count {
  position: absolute;
  right: 57px;
  top: 2px;
  font-size: 12px;
  line-height: 9px;
  padding: 4px;
  background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
  box-shadow: 0px 1.582px 4.746px 0px rgba(0, 50, 228, 0.4);
  border-radius: 12px;
}
</style>
