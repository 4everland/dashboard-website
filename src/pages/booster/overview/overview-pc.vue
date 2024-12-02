<template>
  <div>
    <div class="user-card d-none d-md-block">
      <div class="user-card-item fz-12">
        <div
          class="user-card-item-title d-flex align-center justify-space-between mb-2"
        >
          <div>{{ Math.ceil(totalRate) }} pts/h</div>
          <v-btn
            class="act-btn"
            height="27"
            max-width="83"
            @click="
              () =>
                !this.boostLocked ? this.$store.commit('TASKDRAWER_TOGGLE') : ''
            "
          >
            <img src="/img/booster/svg/more.svg" width="16" alt="" />
            <span class="ml-1 fz-16">More</span>
          </v-btn>
        </div>
        <div class="linear-border mb-2"></div>
        <div class="user-card-item-content">
          <div class="content-rate" @click="handleTest">
            <!-- <img src="/img/booster/svg/union.svg" width="52" alt="" /> -->
            Earning Rate
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
          </div>
        </div>
        <div class="user-card-item-content mt-2">
          <div class="content-rate mb-1">Staking Yield</div>
          <div class="content-detail pt-2 fz-12">
            <div class="d-flex align-center justify-space-between mb-1">
              <span>{{ boosterInfo.rateBuff }}%</span>
              <v-btn
                class="staking-btn"
                width="86"
                height="27"
                @click="
                  () =>
                    !this.boostLocked
                      ? this.$store.dispatch('StakeDrawerToggle')
                      : ''
                "
              >
                <img src="/img/booster/stake-icon.png" alt="" width="22" />
                Staking</v-btn
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="trigger-icon pos-a"
      style="left: 20px; top: 100px"
      @click="showBindExchange"
    >
      <img src="/img/booster/new/bind_4x.gif" width="96" alt="" />
      <div class="trigger-text bind fz-22 fw-b text-center">Bind</div>
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
        </div>
      </div>

      <div v-else>
        <div
          class="point-square d-none d-md-block cursor-p"
          @mousedown="onPress"
          @mouseup="onUp"
          @mouseleave="onUp"
          @click="handleClaim"
        >
          <div style="position: relative; width: 10px; height: 10px"></div>
          <div class="top-card square-box" id="point-send">
            <div
              class="points fz-14 d-flex align-center"
              :class="{
                locked: computedPoints < 1,
                explored: isExplored || computedPoints >= boosterInfo.capacity,
              }"
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
                <span>Claim to restart</span>
              </v-tooltip>
            </div>

            <div class="protect-mask" v-if="isProtecting">
              <div class="protect-time">
                <img
                  src="/img/booster/svg/protect-icon.svg"
                  width="12"
                  alt=""
                />
                <span>{{ protectTime }}</span>
              </div>
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
              class="card-storage d-flex align-center justify-space-between"
              :class="{ locked: storageLocked }"
            >
              <div class="card-storage-status flex-1">
                <div
                  class="task-title d-flex align-center justify-center"
                  style="gap: 4px"
                >
                  <img
                    :src="
                      storageLocked
                        ? '/img/booster/svg/locked-icon.svg'
                        : '/img/booster/svg/actived.svg'
                    "
                    width="24"
                    alt=""
                  />
                  <span> STORAGE BOOST</span>
                </div>
                <div
                  class="d-flex align-center justify-space-between fz-12 mt-1"
                  style="gap: 8px"
                  v-if="storageLocked"
                >
                  <span>+100 pts/h & 2,500 Capacity</span>
                  <v-btn
                    height="24"
                    class="unlock-btn"
                    :loading="unlockLoading == 0"
                    @click="handleUnlock(0)"
                    >Unlock</v-btn
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="computing-boost d-none d-md-block">
          <div style="position: relative; width: 10px; height: 10px"></div>
          <div class="top-card">
            <div
              class="card-storage d-flex align-center justify-space-between"
              :class="{ locked: computingLocked }"
            >
              <div class="card-storage-status flex-1">
                <div
                  class="task-title d-flex align-center justify-center"
                  style="gap: 4px"
                >
                  <img
                    :src="
                      computingLocked
                        ? '/img/booster/svg/locked-icon.svg'
                        : '/img/booster/svg/actived.svg'
                    "
                    width="24"
                    alt=""
                  />

                  <span>COMPUTING BOOST</span>
                </div>
                <div
                  class="d-flex align-center justify-space-between fz-12 mt-1"
                  style="gap: 8px"
                  v-if="computingLocked"
                >
                  <span> +100 pts/h & 2,500 Capacity</span>
                  <v-btn
                    class="unlock-btn"
                    height="24"
                    :loading="unlockLoading == 1"
                    @click="handleUnlock(1)"
                    >Unlock</v-btn
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="network-boost d-none d-md-block">
          <div style="position: relative; width: 10px; height: 10px"></div>
          <div class="top-card">
            <div
              class="card-storage d-flex align-center justify-space-between"
              :class="{ locked: networkLocked }"
            >
              <div class="card-storage-status flex-1">
                <div
                  class="task-title d-flex align-center justify-center"
                  style="gap: 4px"
                >
                  <img
                    :src="
                      networkLocked
                        ? '/img/booster/svg/locked-icon.svg'
                        : '/img/booster/svg/actived.svg'
                    "
                    width="24"
                    alt=""
                  />
                  <span> NETWORK BOOST </span>
                </div>
                <div
                  v-if="networkLocked"
                  class="d-flex align-center justify-space-between fz-12 mt-1"
                  style="gap: 8px"
                >
                  +100 pts/h & 2,500 Capacity
                  <v-btn
                    class="unlock-btn"
                    height="24"
                    :loading="unlockLoading == 2"
                    @click="handleUnlock(2)"
                    >Unlock</v-btn
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
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
            width="181"
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
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "./mixin";
export default {
  mixins: [mixin],
  beforeDestroy() {
    clearInterval(this.protectTimer);
  },
  watch: {
    "boosterInfo.protectExpiredAt"() {
      this.protectCardTime();
    },
  },
  methods: {
    async handleTest() {
      console.log(this.tonConnectUI);

      const data = await this.tonConnectUI.getWallets();
      console.log(data);
    },
  },
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
      color: #fff;
      font-family: "DIN Alternate";
      font-size: 20px;
      font-weight: 700;
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
        font-size: 12px;
      }
      .content-detail {
        border-top: 1px solid rgba(164, 188, 253, 0.25);
      }
      .staking-btn {
        letter-spacing: 0;
        font-style: italic;
        font-weight: bold;
        color: #fff;
        border-radius: 4px;
        background: linear-gradient(90deg, #f8008c 0%, #f86300 100%);
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
    width: 280px;
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
    font-size: 12px;
    padding: 0px 2px;
    border-radius: 20px;
    background: #a4bcfd;
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
  padding: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  .unlock-btn {
    letter-spacing: 0;
    color: #fff;
    font-size: 14px;
    padding: 4px 8px;
    border-radius: 2px;
    background: rgba(97, 114, 243, 0.75);
    box-shadow: 0px 0px 8px 0px rgba(137, 234, 251, 0.5);
    backdrop-filter: blur(2px);
  }
  .card-storage-status {
    .task-title {
      font-weight: 700;
      color: rgba(255, 255, 255, 0.25);
      border-top: 1px solid rgba(255, 255, 255, 0.25);
      border-bottom: 1px solid rgba(255, 255, 255, 0.25);
      background: url("/img/booster/svg/fringe-bg.svg") no-repeat 100%;
      text-shadow: none;
    }
  }
}
.card-storage {
  white-space: nowrap;
  .task-title {
    text-align: center;
    text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.5);
    font-size: 16px;
    padding: 8px;
    border-top: 1px solid rgba(164, 188, 253, 0.25);
    border-bottom: 1px solid rgba(164, 188, 253, 0.25);
    background: rgba(97, 114, 243, 0.1);
    backdrop-filter: blur(4px);
  }
}

.storage-boost {
  position: absolute;
  left: 15%;
  top: 75%;
  .top-card {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}

.computing-boost {
  position: absolute;
  left: 28%;
  top: 38%;
  .top-card {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}

.network-boost {
  position: absolute;
  right: 16%;
  bottom: 25%;
  .top-card {
    position: absolute;
    right: 50%;
    transform: translateX(50%);
  }
}

.daily-boost {
  position: absolute;
  left: 51%;
  bottom: 23%;

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
  top: 22%;
  width: 35%;
  img {
    width: 100%;
  }
}

.act-btn {
  border-radius: 4px;
  opacity: 1;
  color: #fff !important;
  letter-spacing: 0;
  background: linear-gradient(
    97deg,
    #0fe1f8 -22.19%,
    #1102fc 99.83%
  ) !important;
  box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
}
.trigger-icon {
  cursor: pointer;
  .trigger-text {
    position: absolute;
    left: 0;
    bottom: 15%;
    width: 52px;
    padding: 2px 1.5px;
    line-height: 12px;
    backdrop-filter: blur(2px);
    border-radius: 4px;
  }
  .bind {
    width: 100px;
    height: 24px;
    line-height: 20px;
    background: linear-gradient(180deg, rgba(97, 114, 243, 0.5) 0%, rgba(97, 114, 243, 0.125) 166.67%);
    backdrop-filter: blur(4px)
  }
}
</style>
