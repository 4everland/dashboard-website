<template>
  <div class="overview-activity">
    <div class="activity">
      <div
        class="activity-item"
        :class="[
          item.isOpen ? 'mobile-item-active' : 'mobile-item',
          notLogin || boostLocked ? 'item-disabled' : '',
        ]"
        v-for="(item, index) in activity"
        :key="index"
        @mouseenter="currentHoverIdx = index"
        @mouseleave="currentHoverIdx = -1"
        @click="item.action"
      >
        <div class="item-box">
          <div class="icon-box">
            <img
              class="pc-icon"
              :src="
                currentHoverIdx == index && !notLogin && !boostLocked
                  ? item.activityIcon
                  : item.icon
              "
              alt=""
            />
            <img class="mobile-icon" :src="item.activityIcon" alt="" />
            <div
              v-if="item.name == 'Explore' && !boostLocked && exploreRemain > 0"
              class="count pos-a"
            >
              x{{ exploreRemain }}
            </div>
          </div>

          <div v-if="item.isOpen" class="mobile-name">
            {{ item.name }}
          </div>
          <div v-if="!item.isOpen" class="come-soon">
            <img src="/img/booster/nav/comesoon.png" alt="" />
          </div>
        </div>
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
    ...mapGetters(["notLogin", "boostLocked", "balance"]),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },

    activity() {
      let _this = this;
      let Arr = [
        {
          icon: "/img/booster/nav/gift.png",
          activityIcon: "/img/booster/nav/gift.png",
          name: "Tool",
          path: "/boost/explore",
          isOpen: true,
          action() {
            _this.toggleToolDrawer();
          },
        },
        {
          icon: "/img/booster/nav/staking.png",
          activityIcon: "/img/booster/nav/staking-active.png",
          name: "Staking",
          path: "/boost/explore",
          isOpen: true,
          action() {
            _this.toggleStakeDrawer();
          },
        },
        {
          icon: "/img/booster/nav/explore.png",
          activityIcon: "/img/booster/nav/explore-active.png",
          name: "Explore",
          path: "/boost/explore",
          isOpen: true,
          action() {
            _this.toggleExplore();
          },
        },
        {
          icon: "/img/booster/nav/tasks.png",
          activityIcon: "/img/booster/nav/tasks-active.png",
          name: "Tasks",
          path: "/boost/explore",
          isOpen: true,
          action() {
            _this.toggleTaskDrawer();
          },
        },
        {
          icon: "/img/booster/nav/gaming.png",
          activityIcon: "/img/booster/nav/gaming.png",
          name: "Coming soon",
          path: "/boost/explore",
          isOpen: false,
          action() {},
        },
      ];
      return Arr;
    },
  },
  data() {
    return {
      currentHoverIdx: -1,
    };
  },
  methods: {
    toggleStakeDrawer() {
      if (this.notLogin) {
        // this.$router.push("/login");
        return;
      }
      if (this.boostLocked) {
        // this.$emit("handleStartBoost");
        return;
      }

      this.$store.dispatch("StakeDrawerToggle");
    },
    toggleExplore() {
      if (this.notLogin) {
        // this.$router.push("/login");
        return;
      }
      if (this.boostLocked) {
        // this.$emit("handleStartBoost");
        return;
      }
      if (this.exploreRemain < 1)
        return this.$toast2(
          "Whoops, you've used all your exploration times. Try again tomorrow!",
          "error"
        );
      this.$router.push("/boost/explore");
    },
    toggleTaskDrawer() {
      if (this.notLogin) {
        // this.$router.push("/login");
        return;
      }
      if (this.boostLocked) {
        // this.$emit("handleStartBoost");
        return;
      }
      this.$store.dispatch("TaskDrawerToggle");
    },
    toggleToolDrawer() {
      if (this.notLogin) {
        // this.$router.push("/login");
        return;
      }
      if (this.boostLocked) {
        // this.$emit("handleStartBoost");
        return;
      }
      this.$store.commit("SET_TOOL_BAR", true);
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
    display: flex;
    align-items: center;
    // .activity-item::before {
    //   content: "";
    //   width: 100%;
    //   height: 100%;
    //   position: absolute;
    //   left: 0;
    //   background-color: rgba(0, 0, 0, 0.25);
    //   filter: blur(2px);
    // }
    .activity-item {
      height: 100%;
      padding: 0 16px;
      flex: 1;
      border-right: 1px solid rgba(255, 255, 255, 0.25);
      display: flex;
      align-items: center;
      position: relative;
      .item-box {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .icon-box {
        position: relative;
      }
      .count {
        position: absolute;
        right: 0;
        top: 4px;
        font-size: 12px;
        line-height: 9px;
        padding: 2px 4px;
        background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
        box-shadow: 0px 1.582px 4.746px 0px rgba(0, 50, 228, 0.4);
        border-radius: 12px;
      }
      .pc-icon {
        display: block;
        width: 56px;
        height: 56px;
      }
      .mobile-icon {
        display: none;
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
      .come-soon {
        width: 90%;
        position: absolute;
        // transform: translateX(-40px);
        img {
          width: 100%;
          display: block;
        }
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

    .mobile-item-active {
      cursor: pointer;
    }
    .mobile-item {
      cursor: not-allowed;
    }

    .activity-item:hover {
      background: linear-gradient(
          113deg,
          rgba(97, 114, 243, 0) 19.38%,
          rgba(97, 114, 243, 0.5) 84.92%
        ),
        url("/img/booster/hover-linea-bg.png") lightgray 50% / cover no-repeat;
      border: 1px solid #6172f3;
      backdrop-filter: blur(2px);
      font-weight: bold;
    }
    .mobile-item:hover {
      background: unset;
      border: unset;
      border-right: 1px solid rgba(255, 255, 255, 0.25);
    }
    .item-disabled:hover {
      background: unset;
      border: unset;
      border-right: 1px solid rgba(255, 255, 255, 0.25);
      backdrop-filter: unset;
      font-weight: unset;
      cursor: not-allowed;
    }
  }
}

@media screen and (max-width: 768px) {
  .overview-activity {
    min-height: 70px;
    position: fixed;
    left: 0;
    right: 0;
    padding: 0;
    bottom: 0;
    margin: auto;
    background-image: url("/img/booster/nav/mobile-bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position-y: 24px;
    padding-bottom: 24px;
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
          justify-content: center;
        }
        .pc-icon {
          display: none;
        }
        .mobile-icon {
          display: block;
          width: 34px;
        }
      }
      .mobile-item-active {
        background-image: url("/img/booster/nav/mobile-item-active.png");
        .item-box {
          justify-content: center;
        }
        .pc-icon {
          display: none;
        }
        .mobile-icon {
          display: block;
          width: 34px;
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
      .mobile-item-active:hover {
        background: unset;
        background-image: url("/img/booster/nav/mobile-item-active.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        border: none;
        backdrop-filter: unset;
        font-weight: unset;
      }
      .mobile-item:hover {
        background: unset;
        background-image: url("/img/booster/nav/mobile-item.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        border: none;
        backdrop-filter: unset;
        font-weight: unset;
      }
      .come-soon {
        display: none !important;
      }
    }
    .item-fixed {
      position: fixed;
    }
  }
}
</style>
