<template>
  <div class="overview-activity">
    <div class="activity">
      <div
        class="activity-item"
        :class="item.isOpen ? 'mobile-item-active' : 'mobile-item'"
        v-for="(item, index) in activity"
        :key="index"
        @mouseenter="currentHoverIdx = index"
        @mouseleave="currentHoverIdx = -1"
        @click="item.action"
      >
        <div class="item-box">
          <img class="mobile-icon" :src="item.activityIcon" alt="" />
          <div v-if="item.isOpen" class="mobile-name">
            {{ item.name }}
          </div>
        </div>

        <!-- <div class="d-flex align-center justify-space-between">
          <img :src="item.icon" :width="'48px'" alt="" />
          <span>{{ item.name }}</span>
        </div> -->

        <!-- <div class="scale corner">
          <span class="top-left"></span>
          <span class="top-right"></span>
          <span class="bottom-left"></span>
          <span class="bottom-right"></span>
          <img :src="item.activityIcon" width="130" alt="" />
          <span>{{ item.name }}</span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  components: {},
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      exploreRemain: (s) => s.moduleBooster.exploreRemain,
    }),
    ...mapGetters(["notLogin", "balance"]),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  data() {
    let _this = this;
    return {
      activity: [
        {
          icon: "/img/booster/nav/gift.svg",
          activityIcon: "/img/booster/nav/gift.svg",
          name: "Coming soon",
          path: "/booster/explore",
          isOpen: false,
          action() {},
        },
        {
          icon: "/img/booster/nav/staking.svg",
          activityIcon: "/img/booster/nav/staking-active.svg",
          name: "Staking",
          path: "/booster/explore",
          isOpen: true,
          action() {
            _this.toggleStakeDrawer();
          },
        },
        {
          icon: "/img/booster/nav/explore.svg",
          activityIcon: "/img/booster/nav/explore-active.svg",
          name: "Explore",
          path: "/booster/explore",
          isOpen: true,
          action() {
            if (_this.exploreRemain < 1)
              return _this.$toast2(
                "Whoops, you've used all your exploration times. Try again tomorrow!",
                "error"
              );

            if (_this.notLogin) return;

            _this.$router.push("/booster/explore");
          },
        },
        {
          icon: "/img/booster/nav/tasks.svg",
          activityIcon: "/img/booster/nav/tasks-active.svg",
          name: "Tasks",
          path: "/booster/explore",
          isOpen: true,
          action() {
            _this.toggleTaskDrawer();
          },
        },
        {
          icon: "/img/booster/nav/gaming.svg",
          activityIcon: "/img/booster/nav/gaming.svg",
          name: "Coming soon",
          path: "/booster/explore",
          isOpen: false,
          action() {
            console.log(_this);
          },
        },
      ],
    };
  },
  methods: {
    toggleStakeDrawer() {
      if (this.notLogin) {
        return;
      }
      this.$store.dispatch("StakeDrawerToggle");
    },
    toggleTaskDrawer() {
      if (this.notLogin) {
        return;
      }
      this.$store.dispatch("TaskDrawerToggle");
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
  bottom: 0px;
  width: 100%;
  padding: 0 24px;
  .activity {
    border: 1px solid rgba(255, 255, 255, 0.25);
    height: 64px;
    display: flex;
    align-items: center;
    .activity-item {
      padding: 8px 16px;
      flex: 1;
      border-right: 1px solid rgba(255, 255, 255, 0.25);
      .item-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .mobile-icon {
        width: 48px;
        height: 48px;
      }
      .mobile-name {
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        color: #fff;
        text-align: center;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
      }
      .scale {
        z-index: 9999;
        display: none;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
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

@media screen and (max-width: 768px) {
  .overview-activity {
    bottom: 30px;
    padding: 0;
    .activity {
      height: auto;
      border: none;
      display: flex;
      gap: 16px;
      justify-content: center;
      .activity-item {
        width: 56px;
        height: 56px;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        border: none;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        flex: none;
      }

      .mobile-item {
        background-image: url("/img/booster/nav/mobile-item.png");
        .item-box {
        }
        .mobile-icon {
          width: 24px;
          height: 24px;
        }
      }
      .mobile-item-active {
        background-image: url("/img/booster/nav/mobile-item-active.png");
        .mobile-icon {
          width: 48px;
          height: 48px;
        }
        .mobile-name {
          position: absolute;
          width: 60px;
          height: 20px;
          flex-shrink: 0;
          background-image: url("/img/booster/nav/mobile-name-bg.svg");
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          color: #fff;
          text-align: center;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
        }
      }
    }
  }
}
</style>
