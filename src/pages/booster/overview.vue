<template>
  <div class="booster-overview">
    <div style="position: relative">
      <img
        :src="asMobile ? '/img/booster/mobile-bg.png' : '/img/booster/bg.png'"
        style="max-height: 100vh; width: 100%"
        alt=""
      />
      <overview-pc @handleStartBoost="showStartBoost = true"></overview-pc>
      <overview-h5 @handleStartBoost="showStartBoost = true"></overview-h5>
      <start-boosting v-model="showStartBoost"></start-boosting>
      <end-boosting v-model="showEndBoost"></end-boosting>
      <deposit-dialog v-model="showDeposit"></deposit-dialog>
      <!-- <div class="not-login d-none d-md-block">
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
            <div class="boost-btn pos-a">Boost</div>
          </div>
          <img src="/img/booster/svg/storage-line.svg" width="280" alt="" />
        </div>
      </div>

      <div class="user-card d-none d-md-block">
        <div class="user-card-item fz-12">
          <div class="user-card-item-title">Total $4EVER points</div>
          <div class="linear-border mb-1"></div>
          <div class="user-card-item-content">
            <div class="content-rate d-flex align-center justify-space-between">
              <img src="/img/booster/svg/union.svg" width="52" alt="" />
              <div>44002</div>
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
      <div class="overview-activity">
        <div class="activity d-flex">
          <div
            class="activity-item flex-1"
            style="position: relative"
            v-for="(item, index) in activity"
            :key="index"
            @mouseenter="currentHoverIdx = index"
            @mouseleave="currentHoverIdx = -1"
          >
            <div class="d-flex align-center justify-space-between">
              <img :src="item.icon" :width="'48px'" alt="" />
              <span>{{ item.name }}</span>
            </div>

            <div class="scale corner">
              <span class="top-left"></span>
              <span class="top-right"></span>
              <span class="bottom-left"></span>
              <span class="bottom-right"></span>
              <img :src="item.activityIcon" width="130" alt="" />
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import OverviewPc from "./overview/overview-pc.vue";
import OverviewH5 from "./overview/overview-h5.vue";
import StartBoosting from "./components/start-boosting.vue";
import EndBoosting from "./components/end-boosting.vue";
import DepositDialog from "./components/deposit-dialog.vue";
export default {
  data() {
    return {
      showStartBoost: false,
      showEndBoost: false,
      showDeposit: true,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  components: {
    OverviewPc,
    OverviewH5,
    StartBoosting,
    EndBoosting,
    DepositDialog,
  },
};
</script>

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
.booster-overview {
  background: #000;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
