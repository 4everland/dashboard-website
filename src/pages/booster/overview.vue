<template>
  <div class="booster-overview">
    <div style="position: relative">
      <img
        :src="asMobile ? '/img/booster/mobile-bg.png' : '/img/booster/bg.png'"
        width="100%"
        alt=""
      />
      <overview-pc></overview-pc>
      <!-- <overview-h5></overview-h5> -->
      <bottom-bar />
    </div>
  </div>
</template>

<script>
import OverviewPc from "./overview/overview-pc.vue";
import OverviewH5 from "./overview/overview-h5.vue";
import BottomBar from "./components/bottom-bar.vue";

export default {
  data() {
    return {};
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  components: {
    OverviewPc,
    OverviewH5,
    BottomBar,
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
  .linear-border {
    height: 1px;
    width: 100%;
    background: linear-gradient(
      90deg,
      rgba(97, 114, 243, 0.05) 0%,
      #94acfb 100%
    );
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
}
</style>
