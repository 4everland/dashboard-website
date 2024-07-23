<template>
  <div class="d-md-none d-block">
    <div
      class="points-card fz-12 d-flex align-center justify-center"
      @click="handleOpenSheet"
    >
      <div class="rate-box">
        <img src="/img/booster/3d-square.png" width="40" alt="" />
        <span class="text fw-b">{{ totalRate }}/H</span>
      </div>
      <span> Points {{ boosterInfo.totalPoint }} </span>
      <img src="" alt="" />
    </div>
    <img
      v-if="boostLocked"
      class="start-booster-btn"
      @click="$emit('handleStartBoost')"
      src="/img/booster/mobile/mobile-boost-start.png"
      width="80%"
      alt=""
    />
    <div v-else>
      <div class="storage-boost">
        <div style="position: relative">
          <div style="width: 10px; height: 10px"></div>
        </div>
        <div class="top-card">
          <div class="card-storage" :class="{ locked: storageLocked }">
            <img src="/img/booster/storage-icon.png" width="48" alt="" />
            <div class="card-storage-status">
              <div
                v-if="!storageLocked"
                class="d-flex align-center justify-space-between"
              >
                <span class="fz-12">Status</span>
                <img src="/img/booster/svg/actived.svg" width="16" alt="" />
              </div>
              <div v-else class="text-center fz-12">
                <div class="unlock-btn" @click="handleUnlock(0)">Unlock</div>
                <div>Unlock with 50,000 LAND</div>
              </div>

              <div class="task-title">Storage Boost</div>
              <div class="d-flex align-center justify-space-between fz-12">
                <span>Base</span>
                <span>20/H</span>
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
            <img src="/img/booster/storage-icon.png" width="48" alt="" />
            <div class="card-storage-status">
              <div
                v-if="!computingLocked"
                class="d-flex align-center justify-space-between"
              >
                <span class="fz-12">Status</span>
                <img src="/img/booster/svg/actived.svg" width="16" alt="" />
              </div>
              <div v-else class="text-center fz-12">
                <div class="unlock-btn" @click="handleUnlock(1)">Unlock</div>
                <div>Unlock with 50,000 LAND</div>
              </div>
              <div class="task-title">Computing Boost</div>
              <div class="d-flex align-center justify-space-between fz-12">
                <span>Base</span>
                <span>20/H</span>
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
              class="pos-a"
              src="/img/booster/storage-icon.png"
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
                <div class="unlock-btn" @click="handleUnlock(2)">Unlock</div>
                <div>Unlock with 50,000 LAND</div>
              </div>
              <div class="task-title">Network Boost</div>
              <div class="d-flex align-center justify-space-between fz-12">
                <span>Base</span>
                <span>20/H</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="point-square">
        <div style="position: relative">
          <div style="width: 10px; height: 10px"></div>
        </div>
        <div class="top-card">
          <span class="points fz-14"> 31/{{ boosterInfo.capacity }} </span>
          <img src="/img/booster/3d-square.png" width="64" alt="" />
        </div>
      </div>
    </div>
    <mobile-points-sheet ref="pointsSheet"></mobile-points-sheet>
  </div>
</template>

<script>
import MobilePointsSheet from "../components/mobile-points-sheet.vue";
import { mapGetters, mapState } from "vuex";
import { unlockStage } from "@/api/booster";
export default {
  data() {
    return {};
  },

  computed: {
    ...mapState({
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
    }),
    ...mapGetters(["boostLocked", "baseRate", "boostRate"]),
    totalRate() {
      return (
        (this.baseRate + this.boostRate) * (1 + this.boosterInfo.rateBuff / 100)
      );
    },
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
  },
  components: {
    MobilePointsSheet,
  },
  methods: {
    handleOpenSheet() {
      this.$refs.pointsSheet.sheet = true;
    },
    async handleUnlock(index) {
      try {
        const { data } = await unlockStage(index);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
      transform: translateX(-50%);
      padding: 2px 4px;
      border-radius: 2px;
      background: rgba(97, 114, 243, 0.75);
      box-shadow: 0px 0px 8px 0px rgba(137, 234, 251, 0.5);
      backdrop-filter: blur(2px);
    }
    .task-title {
      text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.5);
      font-size: 16px;
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
    position: absolute;
    left: 0;
    top: 40%;
    font-weight: bold;
    font-size: 14px;
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
