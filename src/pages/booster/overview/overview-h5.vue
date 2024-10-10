<template>
  <div class="d-md-none d-block">
    <TokenDialog
      class="pos-a"
      style="right: 8px; top: 70px"
      v-if="isTgMiniApp"
    ></TokenDialog>
    <div
      v-if="isTgMiniApp"
      class="trigger-icon pos-a"
      style="right: 8px; top: 136px"
      @click="$store.commit('SET_INVITE_BAR', true)"
    >
      <img src="/img/booster/ton-claim-icon.png" width="56" alt="" />
      <div class="trigger-text fz-12 fw-b text-center">CLAIM</div>
    </div>

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
        <div class="storage-boost">
          <div style="position: relative">
            <div style="width: 10px; height: 10px"></div>
          </div>
          <div class="top-card" id="storage-boost" v-if="storageLocked">
            <div class="card-storage" :class="{ locked: storageLocked }">
              <div class="task-title d-flex align-center" style="gap: 2px">
                <img src="/img/booster/svg/locked-icon.svg" width="16" alt="" />
                <span> STORAGE BOOST</span>
              </div>
              <div class="mt-1 fz-10">+100 pts/h & 2,500 Capacity</div>
            </div>
          </div>

          <div class="unlocked-card" id="storage-boost">
            <div
              class="unlocked-card-title d-flex align-center"
              v-if="!storageLocked"
              style="gap: 2px"
            >
              <img src="/img/booster/svg/actived.svg" width="16" alt="" />
              <span> STORAGE BOOST</span>
            </div>

            <v-btn
              v-else
              class="unlock-btn"
              min-width="56"
              height="19"
              :loading="unlockLoading == 0"
              @click="handleUnlock(0)"
              >Unlock</v-btn
            >
          </div>
        </div>
        <div class="computing-boost">
          <div style="position: relative">
            <div style="width: 10px; height: 10px"></div>
          </div>
          <div class="top-card" v-if="computingLocked">
            <div class="card-storage" :class="{ locked: computingLocked }">
              <div class="task-title d-flex align-center" style="gap: 2px">
                <img src="/img/booster/svg/locked-icon.svg" width="16" alt="" />
                <span> COMPUTING BOOST</span>
              </div>
              <div class="mt-1 fz-10">+100 pts/h & 2,500 Capacity</div>
            </div>
          </div>
          <div class="unlocked-card">
            <div
              class="unlocked-card-title d-flex align-center"
              v-if="!computingLocked"
              style="gap: 2px"
            >
              <img src="/img/booster/svg/actived.svg" width="16" alt="" />
              <span> COMPUTING BOOST</span>
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
        <div class="network-boost">
          <div style="position: relative">
            <div style="width: 10px; height: 10px"></div>
          </div>
          <div class="top-card" v-if="networkLocked">
            <div class="card-storage" :class="{ locked: networkLocked }">
              <div class="task-title d-flex align-center" style="gap: 2px">
                <img src="/img/booster/svg/locked-icon.svg" width="16" alt="" />

                NETWORK BOOST
              </div>
              <div class="mt-1 fz-10">+100 pts/h & 2,500 Capacity</div>
            </div>
          </div>
          <div class="unlocked-card">
            <div
              class="unlocked-card-title d-flex align-center"
              v-if="!networkLocked"
              style="gap: 2px"
            >
              <img src="/img/booster/svg/actived.svg" width="16" alt="" />
              <span> NETWORK BOOST</span>
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

        <div class="daily-boost">
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
      </div>
    </div>

    <mobile-points-sheet v-model="sheet"></mobile-points-sheet>
  </div>
</template>

<script>
import MobilePointsSheet from "../components/mobile-points-sheet.vue";
import TokenDialog from "../components/token-dialog.vue";
import mixin from "./mixin";
import { bus } from "@/utils/bus";

export default {
  mixins: [mixin],
  data() {
    return {
      sheet: false,
    };
  },
  computed: {
    isTg() {
      return process.env.VUE_APP_TG_VERSION == "true";
    },
  },
  created() {
    bus.$on("showMobileSheet", () => {
      this.sheet = true;
    });
  },
  beforeDestroy() {
    clearInterval(this.protectTimer);
  },
  components: {
    MobilePointsSheet,
    TokenDialog,
  },
  watch: {
    "boosterInfo.protectExpiredAt"() {
      this.protectCardTime();
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

.square-box {
  animation: bounce 2s infinite linear;
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
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(2px);
  > img {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
  }
  .task-title {
    font-size: 12px;
    font-weight: 700;
    padding: 2px 4px;
    color: rgba(255, 255, 255, 0.5);
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    background: url("/img/booster/svg/fringe-bg.svg") no-repeat 100%;
    text-shadow: none;
  }
}
.unlocked-card-title {
  white-space: nowrap;
  padding: 2px 4px;
  border-top: 1px solid rgba(164, 188, 253, 0.25);
  border-bottom: 1px solid rgba(164, 188, 253, 0.25);
  background: rgba(97, 114, 243, 0.1);
  backdrop-filter: blur(2px);
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  font-size: 12px;
  font-weight: 400;
}
.storage-boost {
  position: absolute;
  left: 20%;
  top: 50%;
  .top-card {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -800%;
  }
  .unlocked-card {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 400%;
  }
}
.computing-boost {
  position: absolute;
  right: 25%;
  top: 58%;
  .top-card {
    position: absolute;
    right: 50%;
    transform: translateX(50%);
    top: -800%;
  }
  .unlocked-card {
    position: absolute;
    right: 50%;
    transform: translateX(50%);
    top: 450%;
  }
}
.network-boost {
  position: absolute;
  left: 24%;
  bottom: 25%;
  .top-card {
    position: absolute;
    right: 50%;
    transform: translateX(50%);
    top: -850%;
  }
  .unlocked-card {
    position: absolute;
    right: 50%;
    transform: translateX(50%);
    top: 200%;
  }
}

.daily-boost {
  position: absolute;
  left: 49%;
  top: 40%;

  .daily-boost-btn {
    position: absolute;
    right: 50%;
    transform: translateX(50%);
    top: 200%;
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
  top: 11%;
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
    bottom: 15%;
    width: 60px;
    height: 20px;
    line-height: 20px;
    background: url("/img/booster/svg/ton-text-bg.svg");
    backdrop-filter: blur(2px);
  }
}
</style>
