<template>
  <div class="booster-overview">
    <div style="position: relative">
      <img v-if="!isVideo" class="booster-overview-bg" :src="bgImg" alt="" />
      <video
        v-else
        class="booster-overview-bg vid"
        :src="bgImg"
        autoplay
        loop
        muted
      ></video>

      <div
        class="pos-a"
        style="left: 50%; top: 50%; transform: translate(-50%, -50%)"
      >
        <vue-turnstile
          ref="turnstile"
          :site-key="siteKey"
          @verified="onVerified"
          @error="onError"
        />
      </div>

      <div class="point-square">
        <div style="position: relative">
          <div style="width: 10px; height: 10px"></div>
        </div>
        <div
          class="top-card square-box cursor-p"
          id="point-explore-send"
          @click="handleClaim"
        >
          <span class="points fz-14">
            {{ displayPoints }}/{{ info.capacity }}
          </span>
          <img :src="displaySquare" :width="asMobile ? 80 : 120" alt="" />
          <img
            class="pos-a"
            style="left: 50%; top: 40%; transform: translateX(-50%)"
            src="/img/booster/svg/finger.svg"
            width="16"
            alt=""
          />
        </div>
      </div>
      <ExploreBar
        class="explore-bar"
        :uid="info.uid"
        :address="info.address"
        :totalPoint="info.totalPoint"
        @onExplore="handleExplore"
      ></ExploreBar>
    </div>

    <v-dialog
      v-model="showExploring"
      max-width="240"
      persistent
      content-class="exploring-dialog"
    >
      <div
        class="exploring-dialog-content d-flex flex-column align-center justify-center"
      >
        <dotlottie-player
          src="https://lottie.host/0fcf9393-b0fc-4f31-9d06-fa0896d3bdc6/dkjFgkEUlS.json"
          background="transparent"
          speed="1"
          style="width: 188px; height: 166px"
          loop
          autoplay
        ></dotlottie-player>
        <div class="pb-4">LOADING...</div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import {
  fectchExploreId,
  fectchExploreInfo,
  claimExplorePoints,
} from "@/api/booster";
import ExploreBar from "../components/explore-bar.vue";
import { coinMove } from "../../../utils/animation";
import VueTurnstile from "@gaviti/vue-turnstile";

import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      computedPoints: 0,
      showExploring: false,
      interval: 1000,
      info: {
        address: "",
        baseRate: [],
        boosts: [],
        capacity: 100,
        claimable: 0,
        computeTimestamp: 0,
        computed: 0,
        rateBuff: 0,
        totalPoint: 0,
        uid: "",
      },
      timer: null,
      token: "",
      siteKey: process.env.VUE_APP_CF_TURNSTILE_SITE_KEY,
    };
  },
  components: {
    ExploreBar,
    VueTurnstile,
  },
  computed: {
    ...mapState({
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
      exploreRemain: (s) => s.moduleBooster.exploreRemain,
      currentDate: (s) => s.moduleBooster.currentDate,
    }),
    ...mapGetters(["notLogin", "totalRate"]),

    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    storageBoost() {
      return this.info.baseRate.filter((it) => it.name == "storage");
    },
    networkBoost() {
      return this.info.baseRate.filter((it) => it.name == "network");
    },
    computeBoost() {
      return this.info.baseRate.filter((it) => it.name == "compute");
    },
    storageLocked() {
      return this.storageBoost.length == 0;
    },
    networkLocked() {
      return this.networkBoost.length == 0;
    },
    computingLocked() {
      return this.computeBoost.length == 0;
    },
    bgImg() {
      if (this.asMobile) {
        if (!this.storageLocked && !this.networkLocked && !this.computingLocked)
          return "https://booster.4everland.store/mobile-bg.png";
        if (!this.storageLocked && !this.networkLocked)
          return "https://booster.4everland.store/mobile-bg-s2n.png";
        if (!this.storageLocked && !this.computingLocked)
          return "https://booster.4everland.store/mobile-bg-s2c.png";
        if (!this.networkLocked && this.computingLocked)
          return "https://booster.4everland.store/mobile-bg-n2c.png";
        if (!this.storageLocked)
          return "https://booster.4everland.store/mobile-bg-storage.png";
        if (!this.networkLocked)
          return "https://booster.4everland.store/mobile-bg-network.png";
        if (!this.computingLocked)
          return "https://booster.4everland.store/mobile-bg-computed.png";

        if (this.info.baseRate.length == 0) {
          return "https://booster.4everland.store/mobile-bg-locked.png";
        }
        return "https://booster.4everland.store/mobile-bg-unlocked.png";
      } else {
        if (!this.storageLocked && !this.networkLocked && !this.computingLocked)
          return "https://booster.4everland.store/bg.webm";
        if (!this.storageLocked && !this.networkLocked)
          return "https://booster.4everland.store/bg-s2n.webm";
        if (!this.storageLocked && !this.computingLocked)
          return "https://booster.4everland.store/bg-s2c.webm";
        if (!this.networkLocked && !this.computingLocked)
          return "https://booster.4everland.store/bg-n2c.webm";
        if (!this.storageLocked)
          return "https://booster.4everland.store/bg-storage.webm";
        if (!this.networkLocked)
          return "https://booster.4everland.store/bg-network.webm";
        if (!this.computingLocked)
          return "https://booster.4everland.store/bg-computed.webm";
        if (this.info.baseRate.length == 0)
          return "https://booster.4everland.store/bg-locked.png";

        return "https://booster.4everland.store/bg-unlocked.webm";
      }
    },
    isVideo() {
      return /.webm/.test(this.bgImg);
    },
    currentComputed() {
      let curTimestamp = +new Date() / 1000;
      if (this.info.computeTimestamp != 0) {
        const basicComputed = this.info.baseRate.reduce((pre, it) => {
          if (curTimestamp < this.info.computeTimestamp) return pre;
          return (
            pre + ((curTimestamp - this.info.computeTimestamp) / 3600) * it.rate
          );
        }, 0);

        const boostComputed = this.info.boosts.reduce((pre, it) => {
          let endTimeStamp = curTimestamp;
          if (it.end > 0 && endTimeStamp > it.end) {
            endTimeStamp = it.end;
          }
          if (endTimeStamp < this.info.computeTimestamp) {
            return pre;
          }
          return (
            pre + ((endTimeStamp - this.info.computeTimestamp) / 3600) * it.rate
          );
        }, 0);
        return (
          (basicComputed + boostComputed) * (this.info.rateBuff / 100 + 1) +
          this.info.computed
        );
      }
      const basicComputed = this.info.baseRate.reduce((pre, it) => {
        if (curTimestamp < it.start) return pre;
        return pre + ((curTimestamp - it.start) / 3600) * it.rate;
      }, 0);
      const boostComputed = this.info.boosts.reduce((pre, it) => {
        let endTimeStamp = curTimestamp;
        if (it.end > 0 && endTimeStamp > it.end) {
          endTimeStamp = it.end;
        }
        if (endTimeStamp < it.start) {
          return pre;
        }
        return pre + ((endTimeStamp - it.start) / 3600) * it.rate;
      }, 0);

      return (basicComputed + boostComputed) * (this.info.rateBuff / 100 + 1);
    },
    baseRate() {
      return this.info.baseRate.reduce((prev, it) => it.rate + prev, 0);
    },
    boostRate() {
      return this.info.boosts.reduce((prev, it) => {
        if (this.currentDate > it.end && it.end > 0) {
          return 0 + prev;
        }
        return it.rate + prev;
      }, 0);
    },
    exploreUserTotalRate() {
      return (this.baseRate + this.boostRate) * (1 + this.info.rateBuff / 100);
    },
    displayPoints() {
      if (this.info.negative) return this.info.capacity - this.info.negative;
      return this.computedPoints > this.info.capacity
        ? this.info.capacity
        : this.computedPoints.toFixed(3);
    },
    displaySquare() {
      return "/img/booster/3d-square-explored.png";
    },
  },

  async created() {
    if (this.notLogin) return this.$router.replace("/boost");
    this.showExploring = true;
    // await this.getExploreInfo();
    // this.pointCount();
  },

  methods: {
    pointCount() {
      this.computedPoints =
        this.computedPoints == 0 ? this.currentComputed : this.computedPoints;
      this.computedPoints +=
        (this.exploreUserTotalRate * this.interval) / 3600000;
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.computedPoints =
          this.computedPoints == 0 ? this.currentComputed : this.computedPoints;
        this.computedPoints +=
          (this.exploreUserTotalRate * this.interval) / 3600000;
      }, this.interval);
    },

    async getExploreId() {
      const { data, message, code } = await fectchExploreId(this.token);
      this.$store.dispatch("getExploreRemain");
      if (code == 11005) {
        this.$router.push("/boost");
      }
      if (!data) throw new Error(message, code);
      return data.explorationId;
    },
    async getExploreInfo(loading = true) {
      // if (loading) {
      //   this.showExploring = true;
      // }
      try {
        let id = this.$route.params.id;
        if (!id) {
          id = await this.getExploreId();
          this.$router.replace({ name: "booster-explore", params: { id } });
        }
        const { data } = await fectchExploreInfo(id);
        if (data) {
          this.info = data.node;
          this.computedPoints = 0;
          this.pointCount();
        }
      } catch (error) {
        this.$toast2(error.message, "error");
      }
      // this.showExploring = false;
    },

    handleExplore() {
      this.$router.replace({ name: "booster-explore" });
      this.showExploring = true;
      this.$refs.turnstile.execute();
      // this.getExploreInfo();
    },

    async handleClaim() {
      try {
        if (!this.token) return;
        if (this.computedPoints < this.info.capacity) return;
        let id = this.$route.params.id;
        clearInterval(this.timer);
        // this.computedPoints = 0;
        const data = await claimExplorePoints(id);
        if (data.data) {
          if (this.asMobile) {
            coinMove("point-explore-send", "mobile-point-receive");
          } else {
            coinMove("point-explore-send", "point-receive");
          }
          this.$toast2(
            `Successfully collected, you earn a ${data.data}-point share.`,
            "success"
          );
        } else {
          this.$toast2(data.message, "error");
        }
        this.getExploreInfo(false);
        this.$store.dispatch("getBoosterUserInfo");
      } catch (error) {
        console.log(error);
      }
    },
    async onVerified(val) {
      // console.log(val);
      this.showExploring = true;
      this.token = val;
      await this.getExploreInfo();
      this.pointCount();
      this.showExploring = false;
    },

    onError() {
      this.$refs.turnstile.reset();
      // this.showExploring = false
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .point-square {
    left: 48% !important;
    top: 21% !important;
  }
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(-10%);
  }
  50% {
    transform: translateY(0);
  }
}

.points-card {
  position: absolute;
  right: 8px;
  top: 80px;
  width: 127px;
  height: 42px;
  background: url("/img/booster/mobile/card_background_points.png") no-repeat;
  background-size: 100%;
  .rate-box {
    position: absolute;
    left: -20px;
    bottom: -5px;
    .text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.square-box {
  animation: bounce 2s infinite linear;
}
.booster-overview {
  background: #000;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .booster-overview-bg {
    max-height: 100vh;
    width: 100%;
    display: block;
  }
  .booster-overview-bg.vid {
    object-fit: cover;
  }

  .point-square {
    position: absolute;
    left: 49.5%;

    top: 31%;
    .top-card {
      position: absolute;
      bottom: 22%;
      left: -311%;
      .points {
        position: absolute;
        top: 68%;
        left: 50%;
        transform: translateX(-50%);
        font-weight: bold;
        text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.5);
        padding: 0px 8px;
        border-radius: 16px;
        border: 1px solid rgba(18, 21, 54, 0.5);
        background: linear-gradient(
            0deg,
            rgba(255, 173, 8, 0.5) 0%,
            rgba(255, 173, 8, 0.5) 100%
          ),
          linear-gradient(0deg, #121536 0%, #121536 100%),
          rgba(97, 114, 243, 0.75);
        box-shadow: 0px 0px 4px 0px rgba(255, 255, 255, 0.5);
      }
    }
  }

  .explore-bar {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
  }
}
::v-deep .exploring-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
  // backdrop-filter: blur(6.5px) !important;
}
.exploring-dialog-content {
  color: #fff;
  border-radius: 24px;
  background: rgba(35, 36, 42, 0.9);
  backdrop-filter: blur(8.649999618530273px);
}
</style>
