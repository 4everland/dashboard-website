<template>
  <div class="booster-overview">
    <div style="position: relative">
      <img src="/img/booster/bg.png" width="100%" alt="" />
      <div class="storage-boost">
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

      <div class="computing-boost">
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

            <div class="scale">
              <img :src="item.activityIcon" width="130" alt="" />
              <span>{{ item.name }}</span>
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
      activity: [
        {
          icon: "/img/booster/svg/explore.svg",
          activityIcon: "/img/booster/svg/explore-active.svg",
          name: "Explore",
          path: "/booster/explore",
        },
        {
          icon: "/img/booster/svg/explore.svg",
          activityIcon: "/img/booster/svg/explore-active.svg",
          name: "Explore",
          path: "/booster/explore",
        },
        {
          icon: "/img/booster/svg/tasks.svg",
          activityIcon: "/img/booster/svg/tasks-active.svg",
          name: "Tasks",
          path: "/booster/explore",
        },
        {
          icon: "/img/booster/svg/staking.svg",
          activityIcon: "/img/booster/svg/staking-active.svg",
          name: "Staking",
          path: "/booster/explore",
        },
        {
          icon: "/img/booster/svg/explore.svg",
          activityIcon: "/img/booster/svg/explore-active.svg",
          name: "Explore",
          path: "/booster/explore",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.booster-overview {
  background: #000;
  position: relative;
  width: 100%;
  height: 100%;
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
  .overview-activity {
    position: absolute;
    bottom: 24px;
    width: 100%;
    padding: 0 24px;
    .activity {
      border: 1px solid rgba(255, 255, 255, 0.25);
      height: 64px;
      .activity-item {
        padding: 8px 16px;
        border-right: 1px solid rgba(255, 255, 255, 0.25);
        .scale {
          z-index: 9999;
          display: none;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 110%;
          height: 120%;
          border: 1px solid #6172f3;
        }
      }
      .activity-item:hover .scale {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 16px;
        background: linear-gradient(
            113deg,
            rgba(97, 114, 243, 0) 19.38%,
            rgba(97, 114, 243, 0.5) 84.92%
          ),
          url(<path-to-image>) lightgray 50% / cover no-repeat;

        font-weight: bold;
      }
    }
  }
}
</style>
