<template>
  <div>
    <div class="storage-boost">
      <div style="position: relative">
        <div style="width: 10px; height: 10px"></div>
      </div>
      <div class="top-card">
        <div class="card-storage" :class="{ locked }">
          <img src="/img/booster/storage-icon.png" width="48" alt="" />
          <div class="card-storage-status">
            <div
              v-if="!locked"
              class="d-flex align-center justify-space-between"
            >
              <span class="fz-12">Status</span>
              <img src="/img/booster/svg/actived.svg" width="16" alt="" />
            </div>
            <div v-else class="text-center fz-12">
              <div class="unlock-btn">Unlock</div>
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
        <div class="card-storage" :class="{ locked }">
          <img src="/img/booster/storage-icon.png" width="48" alt="" />
          <div class="card-storage-status">
            <div
              v-if="!locked"
              class="d-flex align-center justify-space-between"
            >
              <span class="fz-12">Status</span>
              <img src="/img/booster/svg/actived.svg" width="16" alt="" />
            </div>
            <div v-else class="text-center fz-12">
              <div class="unlock-btn">Unlock</div>
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
        <div class="card-storage" :class="{ locked }">
          <img
            class="pos-a"
            src="/img/booster/storage-icon.png"
            width="48"
            alt=""
          />
          <div class="card-storage-status">
            <div
              v-if="!locked"
              class="d-flex align-center justify-space-between"
            >
              <span class="fz-12">Status</span>
              <img src="/img/booster/svg/actived.svg" width="16" alt="" />
            </div>
            <div v-else class="text-center fz-12">
              <div class="unlock-btn">Unlock</div>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      locked: true,
    };
  },
};
</script>

<style lang="scss" scoped>
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
</style>
