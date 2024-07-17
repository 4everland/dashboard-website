<template>
  <div>
    <div class="not-login d-none d-md-block">
      <div style="position: relative">
        <img src="/img/booster/svg/light-circle.svg" width="10" alt="" />
      </div>
      <div class="top-card">
        <div class="card-storage mb-1 pos-r">
          <img
            class="pos-a"
            style="left: 37%; top: -20px"
            src="/img/booster/boost-icon.png"
            width="64"
            alt=""
          />
          <div
            class="boost-btn pos-a cursor-p"
            @click="$emit('handleStartBoost')"
          >
            Boost
          </div>
        </div>
        <img src="/img/booster/svg/storage-line.svg" width="280" alt="" />
      </div>
    </div>

    <div class="user-card d-none d-md-block">
      <div class="user-card-item fz-12">
        <div class="user-card-item-title">Total $4EVER points</div>
        <div class="linear-border mb-1"></div>
        <div class="user-card-item-content">
          <div class="content-rate d-flex align-center">
            <img src="/img/booster/svg/union.svg" width="52" alt="" />

            <v-menu
              offset-y
              content-class="pc-log-menu"
              nudge-top="75"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <div class="ml-auto" v-on="on" v-bind="attrs">
                  44002
                  <img
                    src="/img/booster/svg/log.svg"
                    v-on="on"
                    v-bind="attrs"
                    width="16"
                    alt=""
                  />
                </div>
              </template>
              <div class="pc-log-panel">
                <div class="pc-log-panel-content">
                  <div
                    class="pc-log-panel-basic-item d-flex align-center fz-14"
                  >
                    <div>
                      <span>Invite link:</span>
                      <span> ddddld..d.dd..d./ X ID</span>
                    </div>
                    <img
                      class="ml-auto cursor-p"
                      src="/img/booster/svg/copy.svg"
                      width="24"
                      alt=""
                    />
                  </div>
                  <div
                    class="pc-log-panel-basic-item d-flex align-center fz-14"
                  >
                    <div>
                      <span>Invite link:</span>
                      <span> ddddld..d.dd..d./ X ID</span>
                    </div>
                    <img
                      class="ml-auto cursor-p"
                      src="/img/booster/svg/copy.svg"
                      width="24"
                      alt=""
                    />
                  </div>
                  <div
                    class="pc-log-panel-basic-item d-flex align-center fz-14"
                  >
                    <div>
                      <span>Invite link:</span>
                      <span> ddddld..d.dd..d./ X ID</span>
                    </div>
                    <img
                      class="ml-auto cursor-p"
                      src="/img/booster/svg/expanded.svg"
                      width="24"
                      alt=""
                    />
                  </div>
                  <div
                    class="pc-log-panel-basic-item d-flex align-center fz-14"
                  >
                    <div>
                      <span>Invite link:</span>
                      <span> ddddld..d.dd..d./ X ID</span>
                    </div>
                    <img class="ml-auto" src="" width="24" alt="" />
                  </div>

                  <div class="fz-12 pc-log-panel-basic-item-desc">
                    * You will get +10 capacity for every new booster you
                    invited.
                  </div>
                </div>
              </div>
            </v-menu>
          </div>
        </div>
      </div>
      <div class="user-card-item fz-12 mt-2">
        <div class="user-card-item-title">Current Production Rate</div>
        <div class="linear-border mb-1"></div>
        <div class="user-card-item-content">
          <div class="content-rate d-flex align-center justify-space-between">
            <img src="/img/booster/svg/union.svg" width="52" alt="" />
            <div>50/H</div>
          </div>
          <div class="content-detail pt-2 fz-12">
            <div class="d-flex align-center justify-space-between">
              <span>Base Production Rate</span>
              <span>20/H</span>
            </div>
            <div class="d-flex align-center justify-space-between mt-1">
              <span>Boost Production Rate</span>
              <span>+5/H</span>
            </div>
            <div class="d-flex align-center justify-space-between mt-1">
              <span>Staking Weight</span>
              <span>10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="point-square d-none d-md-block">
      <div style="position: relative">
        <div style="width: 10px; height: 10px"></div>
      </div>
      <div class="top-card">
        <span class="points fz-14"> 31/10000 </span>
        <img src="/img/booster/3d-square.png" width="120" alt="" />
      </div>
    </div>
    <div class="storage-boost d-none d-md-block">
      <div style="position: relative">
        <img src="/img/booster/svg/light-circle.svg" width="10" alt="" />
      </div>
      <div class="top-card">
        <div
          class="card-storage mb-1 d-flex align-center justify-space-between"
        >
          <img src="/img/booster/storage-icon.png" width="64" alt="" />
          <div class="card-storage-status flex-1">
            <div class="d-flex align-center justify-space-between">
              <span class="fz-12">Status</span>
              <img src="/img/booster/svg/actived.svg" width="16" alt="" />
            </div>
            <div class="task-title">Storage Boost</div>
            <div class="d-flex align-center justify-space-between fz-12">
              <span>Base</span>
              <span>20/H</span>
            </div>
          </div>
        </div>
        <img src="/img/booster/svg/storage-line.svg" width="280" alt="" />
      </div>
    </div>
    <div class="computing-boost d-none d-md-block">
      <div style="position: relative">
        <img src="/img/booster/svg/light-circle.svg" width="10" alt="" />
      </div>
      <div class="top-card">
        <div
          class="card-storage mb-1 d-flex align-center justify-space-between"
          :class="{ locked: locked }"
        >
          <img
            :src="
              locked
                ? '/img/booster/svg/locked-icon.svg'
                : '/img/booster/storage-icon.png'
            "
            width="64"
            alt=""
          />
          <div class="card-storage-status flex-1">
            <div
              v-show="locked"
              class="d-flex align-center justify-space-between fz-12"
            >
              <span>Status</span>
              <img src="/img/booster/svg/actived.svg" width="16" alt="" />
            </div>
            <div v-show="!locked" class="fz-12 text-center">
              Unlock at 10,000 points
            </div>
            <div class="task-title">Computing Boost</div>
            <div class="d-flex align-center justify-space-between fz-12">
              <span>Base</span>
              <span>20/H</span>
            </div>
          </div>
        </div>
        <img src="/img/booster/svg/right_line_white.svg" width="280" alt="" />
      </div>
    </div>
    <div class="network-boost d-none d-md-block">
      <div style="position: relative">
        <img src="/img/booster/svg/light-circle.svg" width="10" alt="" />
      </div>
      <div class="top-card">
        <div
          class="card-storage mb-1 d-flex align-center justify-space-between"
          :class="{ locked: locked }"
        >
          <img
            :src="
              locked
                ? '/img/booster/svg/locked-icon.svg'
                : '/img/booster/storage-icon.png'
            "
            width="64"
            alt=""
          />
          <div class="card-storage-status flex-1">
            <div
              v-show="locked"
              class="d-flex align-center justify-space-between fz-12"
            >
              <span>Status</span>
              <img src="/img/booster/svg/actived.svg" width="16" alt="" />
            </div>
            <div v-show="!locked" class="fz-12 text-center">
              Unlock at 10,000 points
            </div>
            <div class="task-title">Network Boost</div>
            <div class="d-flex align-center justify-space-between fz-12">
              <span>Base</span>
              <span>20/H</span>
            </div>
          </div>
        </div>
        <img src="/img/booster/svg/right_line_white.svg" width="280" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      locked: true,
    };
  },
  methods: {
    handleBoost() {
      const logined = true;
      if (logined) {
        this.sta;
      } else {
        this.$router.push("/login");
      }
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
  top: 12%;
  padding: 16px;
  width: 264px;
  background: url("/img/booster/user_card_bg.png") no-repeat;
  background-size: 100% 100%;
  > img {
    position: absolute;
  }

  .user-card-item {
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
  left: 45%;
  top: 56%;
  .top-card {
    position: absolute;
    bottom: 22%;
    right: -226%;

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
}
.point-square {
  position: absolute;
  left: 49%;
  top: 30%;
  .top-card {
    position: absolute;
    bottom: 22%;
    left: -449%;
    .points {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%);
      font-weight: bold;
      text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.5);
    }
  }
}

.card-storage.locked {
  background: url("/img/booster/svg/card_background_white.svg") no-repeat;
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
  height: 98px;
  padding: 0 8px;
  background: url("/img/booster/svg/card_background_blue.svg") no-repeat;
  background-size: 100%;
  .card-storage-status {
    .task-title {
      text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.5);
      font-size: 20px;
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
  left: 23%;
  top: 63%;
  .top-card {
    position: absolute;
    bottom: 22%;
    right: -226%;
  }
}

.computing-boost {
  position: absolute;
  left: 23%;
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
</style>
