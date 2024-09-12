<template>
  <div>
    <div class="user-card d-none d-md-block">
      <div class="user-card-item fz-12">
        <div class="user-card-item-title mb-1">Earning Rate</div>
        <div class="linear-border mb-1"></div>
        <div class="user-card-item-content">
          <div class="content-rate d-flex align-center justify-space-between">
            <!-- <img src="/img/booster/svg/union.svg" width="52" alt="" /> -->
            <div>{{ Math.ceil(totalRate) }} pts/h</div>
            <v-btn
              class="act-btn"
              height="24"
              max-width="62"
              @click="$store.commit('TASKDRAWER_TOGGLE')"
            >
              <img src="/img/booster/svg/more.svg" width="12" alt="" />
              <span class="ml-1">More</span>
            </v-btn>
          </div>
          <div class="content-detail pt-2 fz-12">
            <div class="d-flex align-center justify-space-between">
              <span>Base Rate</span>
              <span>{{ baseRate }} pts/h</span>
            </div>
            <div class="d-flex align-center justify-space-between mt-1">
              <span>Boost Rate</span>
              <span>+{{ boostRate }} pts/h</span>
            </div>
            <div class="d-flex align-center justify-space-between mt-1">
              <span>Staking Yield</span>
              <span>{{ boosterInfo.rateBuff }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TgStartBoostLoading v-if="tgMiniOverlayLoading"></TgStartBoostLoading>

    <div v-else>
      <div class="not-login d-none d-md-block" v-if="boostLocked">
        <div style="position: relative; width: 10px; height: 10px"></div>
        <div class="top-card">
          <div class="card-storage mb-1 pos-r">
            <img
              class="pos-a"
              style="left: 50%; top: -20px; transform: translateX(-50%)"
              src="/img/booster/boost-icon.png"
              width="80"
              alt=""
            />
            <div class="boost-btn pos-a cursor-p" @click="handleStartBoost">
              START BOOST
            </div>
          </div>
          <!-- <img src="/img/booster/svg/start-boost-line.svg" width="330" alt="" /> -->
        </div>
      </div>

      <div v-else>
        <div
          class="point-square d-none d-md-block cursor-p"
          @click="hanleClaim"
        >
          <div style="position: relative; width: 10px; height: 10px"></div>
          <div class="top-card square-box" id="point-send">
            <div
              class="points fz-14 d-flex align-center"
              :class="{ locked: computedPoints < 1, explored: isExplored }"
            >
              <span class="mr-1">
                {{ displayPoints }}/{{ boosterInfo.capacity }}</span
              >

              <v-tooltip
                top
                max-width="300"
                v-if="isExplored || computedPoints >= boosterInfo.capacity"
              >
                <template v-slot:activator="{ on, attrs }">
                  <img
                    src="/img/booster/svg/tips.svg"
                    v-on="on"
                    v-bind="attrs"
                    width="18"
                    alt=""
                  />
                </template>
                <span>Claim and restart generating points.</span>
              </v-tooltip>
            </div>

            <img :src="displaySquare" width="120" alt="" />
            <img
              v-show="computedPoints > 1"
              class="pos-a"
              style="left: 50%; top: 40%; transform: translateX(-50%)"
              src="/img/booster/svg/finger.svg"
              width="16"
              alt=""
            />
          </div>
        </div>
        <div class="storage-boost d-none d-md-block">
          <div style="position: relative; width: 10px; height: 10px"></div>
          <div class="top-card">
            <div
              class="card-storage mb-1 d-flex align-center justify-space-between"
              :class="{ locked: storageLocked }"
            >
              <div class="card-storage-icon">
                <img
                  :src="
                    storageLocked
                      ? '/img/booster/svg/locked-icon.svg'
                      : '/img/booster/storage-icon.png'
                  "
                  width="64"
                  alt=""
                />
                <v-btn
                  v-show="storageLocked"
                  height="29"
                  class="unlock-btn"
                  :loading="unlockLoading == 0"
                  @click="handleUnlock(0)"
                  >Unlock</v-btn
                >
              </div>
              <div class="card-storage-status flex-1">
                <div
                  v-if="!storageLocked"
                  class="d-flex align-center justify-space-between fz-12"
                >
                  <span>Status</span>
                  <img src="/img/booster/svg/actived.svg" width="16" alt="" />
                </div>
                <div v-else class="fz-12 text-center">
                  Unlock with 1 million LAND
                </div>
                <div class="task-title">STORAGE BOOST</div>
                <div class="d-flex align-center justify-space-between fz-12">
                  +100 pts/h & 2,500 Capacity
                </div>
              </div>
            </div>
            <img
              :src="
                storageLocked
                  ? '/img/booster/svg/storage-line-white.svg'
                  : '/img/booster/svg/storage-line.svg'
              "
              width="280"
              alt=""
            />
          </div>
        </div>
        <div class="computing-boost d-none d-md-block">
          <div style="position: relative; width: 10px; height: 10px"></div>
          <div class="top-card">
            <div
              class="card-storage mb-1 d-flex align-center justify-space-between"
              :class="{ locked: computingLocked }"
            >
              <div class="card-storage-icon">
                <img
                  :src="
                    computingLocked
                      ? '/img/booster/svg/locked-icon.svg'
                      : '/img/booster/storage-icon.png'
                  "
                  width="64"
                  alt=""
                />
                <v-btn
                  v-show="computingLocked"
                  class="unlock-btn"
                  height="29"
                  :loading="unlockLoading == 1"
                  @click="handleUnlock(1)"
                  >Unlock</v-btn
                >
              </div>
              <div class="card-storage-status flex-1">
                <div
                  v-if="!computingLocked"
                  class="d-flex align-center justify-space-between fz-12"
                >
                  <span>Status</span>
                  <img src="/img/booster/svg/actived.svg" width="16" alt="" />
                </div>
                <div v-else class="fz-12 text-center">
                  Unlock with 1 million LAND
                </div>
                <div class="task-title">COMPUTING BOOST</div>
                <div class="d-flex align-center justify-space-between fz-12">
                  +100 pts/h & 2,500 Capacity
                </div>
              </div>
            </div>
            <img
              :src="
                computingLocked
                  ? '/img/booster/svg/right_line_white.svg'
                  : '/img/booster/svg/right_line_blue.svg'
              "
              width="280"
              alt=""
            />
          </div>
        </div>
        <div class="network-boost d-none d-md-block">
          <div style="position: relative; width: 10px; height: 10px"></div>
          <div class="top-card">
            <div
              class="card-storage mb-1 d-flex align-center justify-space-between"
              :class="{ locked: networkLocked }"
            >
              <div class="card-storage-icon">
                <img
                  :src="
                    networkLocked
                      ? '/img/booster/svg/locked-icon.svg'
                      : '/img/booster/storage-icon.png'
                  "
                  width="64"
                  alt=""
                />

                <v-btn
                  v-show="networkLocked"
                  class="unlock-btn"
                  height="29"
                  :loading="unlockLoading == 2"
                  @click="handleUnlock(2)"
                  >Unlock</v-btn
                >
              </div>
              <div class="card-storage-status flex-1">
                <div
                  v-if="!networkLocked"
                  class="d-flex align-center justify-space-between fz-12"
                >
                  <span>Status</span>
                  <img src="/img/booster/svg/actived.svg" width="16" alt="" />
                </div>
                <div v-else class="fz-12 text-center">
                  Unlock with 1 million LAND
                </div>
                <div class="task-title">NETWORK BOOST</div>
                <div class="d-flex align-center justify-space-between fz-12">
                  +100 pts/h & 2,500 Capacity
                </div>
              </div>
            </div>
            <img
              :src="
                networkLocked
                  ? '/img/booster/svg/right_line_white.svg'
                  : '/img/booster/svg/right_line_blue.svg'
              "
              width="280"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "./mixin";
export default {
  mixins: [mixin],
};
</script>

<style>
.pc-log-menu {
  border-radius: 0;
}
.pc-log-panel {
  color: #fff;
  padding: 32px 20px;
  width: 518px;
  min-height: 600px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(54, 59, 64, 0.9);
}
.pc-log-panel-content {
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-image: linear-gradient(
      to right,
      rgba(164, 188, 253, 0),
      rgba(164, 188, 253, 1)
    )
    1;
}
.pc-log-panel-basic-item {
  padding: 4px 20px;
  margin-bottom: 12px;
  backdrop-filter: blur(2px);
}
.pc-log-panel-basic-item-desc {
  padding: 4px 20px;
  backdrop-filter: blur(2px);
  color: rgba(255, 255, 255, 0.4);
}
</style>

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
.corner {
  position: relative;
  .top-left {
    position: absolute;
    left: -1px;
    top: -1px;
    padding: 8px;
    border-style: solid;
    border-color: #fff;
    border-width: 2px 0 0 2px;
  }
  .top-right {
    position: absolute;
    right: -1px;
    top: -1px;
    padding: 8px;
    border-style: solid;
    border-color: #fff;
    border-width: 2px 2px 0 0;
  }
  .bottom-left {
    position: absolute;
    right: -1px;
    bottom: -1px;
    padding: 8px;
    border-style: solid;
    border-color: #fff;
    border-width: 0 2px 2px 0;
  }
  .bottom-right {
    position: absolute;
    left: -1px;
    bottom: -1px;
    padding: 8px;
    border-style: solid;
    border-color: #fff;
    border-width: 0 0 2px 2px;
  }
}

.linear-border {
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, rgba(97, 114, 243, 0.05) 0%, #94acfb 100%);
}

.user-card {
  position: absolute;
  right: 20px;
  top: 86px;
  padding: 16px;
  width: 264px;
  background: url("/img/booster/user_card_bg.png") no-repeat;
  background-size: 100% 100%;
  > img {
    position: absolute;
  }

  .user-card-item {
    .user-card-item-title {
      width: 100%;
    }
    .user-card-item-content {
      padding: 4px 16px;
      background: linear-gradient(
        90deg,
        rgba(97, 114, 243, 0.05) 0%,
        rgba(97, 114, 243, 0.5) 100%
      );
      backdrop-filter: blur(2px);

      .content-rate {
        font-family: "DIN Alternate";
        font-size: 24px;
        font-weight: 700;
      }
      .content-detail {
        border-top: 1px solid rgba(164, 188, 253, 0.25);
      }
    }
  }
}

.not-login {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .card-storage {
    background: url("/img/booster/svg/card_background_blue.svg") no-repeat;
    background-size: contain;
    fill: none;
    backdrop-filter: none;
    height: 131px;
  }
  .top-card {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .boost-btn {
      width: 232px;
      left: 50%;
      transform: translateX(-50%);
      bottom: 16%;
      text-align: center;
      padding: 4px 8px;
      font-weight: bold;
      font-size: 20px;
      border-radius: 4px;
      background: rgba(97, 114, 243, 0.75);
      box-shadow: 0px 0px 16px 0px rgba(137, 234, 251, 0.5);
      backdrop-filter: blur(2px);
    }
  }
}
.point-square {
  position: absolute;
  left: 50.3%;
  top: 30%;
  .top-card {
    position: absolute;
    bottom: 22%;
    left: -449%;
    .points {
      z-index: 10;
      padding: 0px 8px;
      position: absolute;
      top: 68%;
      left: 50%;
      transform: translateX(-50%);
      font-weight: bold;
      text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.5);
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
        linear-gradient(0deg, #121536 0%, #121536 100%),
        rgba(97, 114, 243, 0.75);
    }
  }
}

.card-storage.locked {
  background: url("/img/booster/svg/card_background_white.svg") no-repeat;
  background-size: 100%;
  .card-storage-icon {
    position: relative;
    .unlock-btn {
      letter-spacing: 0;
      position: absolute;
      bottom: 0;
      left: 50%;
      color: #fff;
      transform: translateX(-50%);
      font-size: 14px;
      padding: 4px 8px;
      border-radius: 2px;
      background: rgba(97, 114, 243, 0.75);
      box-shadow: 0px 0px 8px 0px rgba(137, 234, 251, 0.5);
      backdrop-filter: blur(2px);
      cursor: pointer;
    }
  }
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
  width: 280px;
  height: 98px;
  padding: 0 8px;
  background: url("/img/booster/svg/card_background_blue2.svg") no-repeat;
  background-size: contain;
  fill: rgba(97, 114, 243, 0.05);
  backdrop-filter: blur(10px);
  .card-storage-status {
    .task-title {
      text-align: center;
      text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.5);
      font-size: 18px;
      font-weight: 700;
      padding: 8px;
      margin: 4px 0;
      border-top: 1px solid #a4bcfd;
      border-bottom: 1px solid #a4bcfd;
      background: rgba(97, 114, 243, 0.1);
    }
  }
}

.storage-boost {
  position: absolute;
  left: 19%;
  top: 63%;
  .top-card {
    position: absolute;
    bottom: 22%;
    right: -226%;
  }
}

.computing-boost {
  position: absolute;
  left: 25%;
  top: 34%;
  .top-card {
    position: absolute;
    bottom: 22%;
    left: -500%;
  }
}

.network-boost {
  position: absolute;
  right: 19%;
  bottom: 32%;
  .top-card {
    position: absolute;
    bottom: 22%;
    left: -500%;
  }
}

.act-btn {
  border-radius: 4px;
  opacity: 1;
  color: #fff !important;
  font-size: 12px;
  letter-spacing: 0;
  background: linear-gradient(
    97deg,
    #0fe1f8 -22.19%,
    #1102fc 99.83%
  ) !important;
  box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
}
</style>
