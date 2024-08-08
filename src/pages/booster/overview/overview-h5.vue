<template>
  <div class="d-md-none d-block">
    <div
      class="points-card fz-12 d-flex align-center justify-center"
      @click="handleOpenSheet"
    >
      <div class="rate-box">
        <img src="/img/booster/3d-square-full.png" width="40" alt="" />
        <span class="text fw-b">{{ Math.ceil(totalRate) }}/H</span>
      </div>
      <div>
        Points

        <ICountUp
          :delay="1000"
          :endVal="boosterInfo.totalPoint"
          :options="{
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
          Start Boosting
        </div>
      </div>
    </div>

    <div v-else>
      <div class="storage-boost">
        <div style="position: relative">
          <div style="width: 10px; height: 10px"></div>
        </div>
        <div class="top-card">
          <div class="card-storage" :class="{ locked: storageLocked }">
            <img
              :src="
                storageLocked
                  ? '/img/booster/svg/locked-icon.svg'
                  : '/img/booster/storage-icon.png'
              "
              width="48"
              alt=""
            />
            <div class="card-storage-status">
              <div
                v-if="!storageLocked"
                class="d-flex align-center justify-space-between"
              >
                <span class="fz-12">Status</span>
                <img src="/img/booster/svg/actived.svg" width="16" alt="" />
              </div>
              <div v-else class="text-center fz-12">
                <v-btn
                  class="unlock-btn"
                  height="22"
                  :loading="unlockLoading == 0"
                  @click="handleUnlock(0)"
                  >Unlock</v-btn
                >
                <div>Unlock with 1 million LAND</div>
              </div>

              <div class="task-title">STORAGE BOOST</div>
              <div class="d-flex align-center justify-space-between fz-12">
                <span>Base Rate</span>
                <span>100 pts/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="computing-boost">
        <div style="position: relative">
          <div style="width: 10px; height: 10px"></div>
        </div>
        <div class="top-card">
          <div class="card-storage" :class="{ locked: computingLocked }">
            <img
              :src="
                computingLocked
                  ? '/img/booster/svg/locked-icon.svg'
                  : '/img/booster/storage-icon.png'
              "
              width="48"
              alt=""
            />
            <div class="card-storage-status">
              <div
                v-if="!computingLocked"
                class="d-flex align-center justify-space-between"
              >
                <span class="fz-12">Status</span>
                <img src="/img/booster/svg/actived.svg" width="16" alt="" />
              </div>
              <div v-else class="text-center fz-12">
                <v-btn
                  class="unlock-btn"
                  height="22"
                  :loading="unlockLoading == 1"
                  @click="handleUnlock(1)"
                  >Unlock</v-btn
                >
                <div>Unlock with 1 million LAND</div>
              </div>
              <div class="task-title">COMPUTING BOOST</div>
              <div class="d-flex align-center justify-space-between fz-12">
                <span>Base Rate</span>
                <span>100 pts/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="network-boost">
        <div style="position: relative">
          <div style="width: 10px; height: 10px"></div>
        </div>
        <div class="top-card">
          <div class="card-storage" :class="{ locked: networkLocked }">
            <img
              :src="
                networkLocked
                  ? '/img/booster/svg/locked-icon.svg'
                  : '/img/booster/storage-icon.png'
              "
              width="48"
              alt=""
            />
            <div class="card-storage-status">
              <div
                v-if="!networkLocked"
                class="d-flex align-center justify-space-between"
              >
                <span class="fz-12">Status</span>
                <img src="/img/booster/svg/actived.svg" width="16" alt="" />
              </div>
              <div v-else class="text-center fz-12">
                <v-btn
                  class="unlock-btn"
                  height="22"
                  :loading="unlockLoading == 2"
                  @click="handleUnlock(2)"
                  >Unlock</v-btn
                >
                <div>Unlock with 1 million LAND</div>
              </div>
              <div class="task-title">NETWORK BOOST</div>
              <div class="d-flex align-center justify-space-between fz-12">
                <span>Base Rate</span>
                <span>100 pts/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="point-square" @click="hanleClaim">
        <div style="position: relative">
          <div style="width: 10px; height: 10px"></div>
        </div>
        <div class="top-card square-box">
          <span class="points fz-12">
            {{
              computedPoints > boosterInfo.capacity
                ? boosterInfo.capacity
                : computedPoints.toFixed(3)
            }}/{{ boosterInfo.capacity }}
          </span>
          <img
            :src="
              computedPoints >= boosterInfo.capacity
                ? '/img/booster/3d-square-full.png'
                : '/img/booster/3d-square.png'
            "
            width="64"
            alt=""
          />
          <img
            class="pos-a"
            style="left: 50%; top: 30%; transform: translateX(-50%)"
            src="/img/booster/svg/finger.svg"
            width="16"
            alt=""
          />
        </div>
      </div>
    </div>

    <TgStartBoostOverlay
      :tgLoading="tgLoading"
      @handleTgStart="handleTGStartBoost"
    ></TgStartBoostOverlay>
    <mobile-points-sheet ref="pointsSheet"></mobile-points-sheet>
  </div>
</template>

<script>
import MobilePointsSheet from "../components/mobile-points-sheet.vue";
import mixin from "./mixin";
import ICountUp from "vue-countup-v2";
import TgStartBoostOverlay from "../components/tg-start-boost-overlay.vue";
export default {
  mixins: [mixin],
  data() {
    return {};
  },
  components: {
    MobilePointsSheet,
    ICountUp,
    TgStartBoostOverlay,
  },
  methods: {
    handleOpenSheet() {
      this.$refs.pointsSheet.sheet = true;
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
}
.card-storage.locked {
  background: url("/img/booster/svg/mobile_card_background_white.svg") no-repeat;
  background-size: 100%;

  .card-storage-status {
    .task-title {
      color: rgba(255, 255, 255, 0.25);
      border-top: 1px solid rgba(255, 255, 255, 0.25);
      border-bottom: 1px solid rgba(255, 255, 255, 0.25);
      background: url("/img/booster/svg/fringe-bg.svg") no-repeat 100%;
      text-shadow: none;
    }
  }
}
.card-storage {
  width: 172px;
  height: 107px;
  padding: 0 8px;
  background: url("/img/booster/svg/mobile_card_background_blue.svg") no-repeat;
  background-size: 100%;
  fill: rgba(97, 114, 243, 0.05);
  backdrop-filter: blur(4px);
  > img {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
  }
  .card-storage-status {
    padding-top: 27px;
    .unlock-btn {
      position: absolute;
      left: 50%;
      top: 4%;
      color: #fff;
      letter-spacing: 0;
      transform: translateX(-50%);
      padding: 2px 4px;
      border-radius: 2px;
      background: rgba(97, 114, 243, 0.75);
      box-shadow: 0px 0px 8px 0px rgba(137, 234, 251, 0.5);
      backdrop-filter: blur(2px);
    }
    .task-title {
      text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.5);
      font-size: 14px;
      font-weight: 700;
      padding: 4px 8px;
      margin: 4px 0;
      border-top: 1px solid #a4bcfd;
      border-bottom: 1px solid #a4bcfd;
      background: rgba(97, 114, 243, 0.1);
    }
  }
}

.storage-boost {
  position: absolute;
  left: 24%;
  top: 26%;
  .top-card {
    position: absolute;
    left: -800%;
    top: -800%;
  }
}
.computing-boost {
  position: absolute;
  right: 24%;
  top: 59%;
  .top-card {
    position: absolute;
    left: -800%;
    top: -800%;
  }
}
.network-boost {
  position: absolute;
  left: 24%;
  bottom: 25%;
  .top-card {
    position: absolute;
    left: -800%;
    top: -800%;
  }
}

.point-square {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 30%;
  .points {
    z-index: 10;
    padding: 0px 8px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 55%;
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
</style>
