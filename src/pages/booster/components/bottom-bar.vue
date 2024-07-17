<template>
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
    <!-- <nft-drawer /> -->
  </div>
</template>

<script>
import NftDrawer from "./nft-drawer.vue";

export default {
  components: { NftDrawer },
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
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
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
        url("/img/booster/hover-linea-bg.png") lightgray 50% / cover no-repeat;

      font-weight: bold;
    }
  }
}
</style>
