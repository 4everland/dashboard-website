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

      <!-- <div
        class="pos-a"
        style="left: 50%; top: 50%; transform: translate(-50%, -50%)"
      >
        <vue-turnstile
          ref="turnstile"
          :site-key="siteKey"
          @verified="onVerified"
          @error="onError"
        />
      </div> -->

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
    <audio ref="audioPlayer" src="/audio/collect.mp3"></audio>
    <mobile-points-sheet v-model="sheet"></mobile-points-sheet>
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
import MobilePointsSheet from "../components/mobile-points-sheet.vue";
import { bus } from "@/utils/bus";

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
      sheet: false,
      isloading: false,
    };
  },
  components: {
    ExploreBar,
    VueTurnstile,
    MobilePointsSheet,
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
      let url = "https://static.4everland.org/";
      // let url = this.$inDev
      //   ? "https://test-boost.4everland.store/"
      //   : "https://static.4everland.org/";
      if (this.asMobile) {
        return "/img/booster/mobile-bg-unlocked-new1.png"
      } else {
        if (!this.storageLocked && !this.networkLocked && !this.computingLocked)
          return "https://static.4everland.org/boost/background/bg.webm";
        if (!this.storageLocked && !this.networkLocked)
          return "https://static.4everland.org/boost/background/bg-s2n.webm";
        if (!this.storageLocked && !this.computingLocked)
          return "https://static.4everland.org/boost/background/bg-s2c.webm";
        if (!this.networkLocked && !this.computingLocked)
          return "https://static.4everland.org/boost/background/bg-n2c.webm";
        if (!this.storageLocked)
          return "https://static.4everland.org/boost/background/bg-storage.webm";
        if (!this.networkLocked)
          return "https://static.4everland.org/boost/background/bg-network.webm";
        if (!this.computingLocked)
          return "https://static.4everland.org/boost/background/bg-computed.webm";
        if (this.info.baseRate.length == 0)
          return "https://static.4everland.org/boost/background/bg-locked.png";

        return "https://static.4everland.org/boost/background/bg-unlocked.webm";
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
    // this.showExploring = true;
    await this.getExploreInfo();
    this.pointCount();
    bus.$on("showMobileSheet", () => {
      this.sheet = true;
    });
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
      if (this.isloading) return;
      if (loading) {
        this.showExploring = true;
      }
      try {
        this.isloading = true;
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
          this.isloading = false;
        }
      } catch (error) {
        this.isloading = false;
        this.$toast2(error.message, "error");
      }
      this.showExploring = false;
    },

    handleExplore() {
      this.$router.replace({ name: "booster-explore" });
      // this.showExploring = true;
      // this.$refs.turnstile.execute();
      this.getExploreInfo();
    },
    playaudio() {
      const audio = this.$refs.audioPlayer;
      audio.play();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      
    },
    async handleShadow() {
      const box = document.getElementById("navtop-mobile-points");
      box.classList.add('box-shadow-animate');
      await this.$sleep(500);
      box.classList.remove('box-shadow-animate');
    },

    async handleClaim() {
      try {
        // if (!this.token) return;
        if (this.computedPoints < this.info.capacity) return;
        let id = this.$route.params.id;
        clearInterval(this.timer);
        // this.computedPoints = 0;
        const data = await claimExplorePoints(id);
        if (data.data) {
          if (this.asMobile) {
            this.playaudio();
            coinMove("point-explore-send", "mobile-point-receive");
            await this.$sleep(2000)
            this.handleShadow();
          } else {
            coinMove("point-explore-send", "point-receive");
            this.$toast2(
              `Successfully collected, you earn a ${data.data}-point share.`,
              "success"
            );
          }
          
        } else {
          this.$toast2(data.message, "error");
        }
        this.getExploreInfo(false);
        this.$store.dispatch("getBoosterUserInfo");
      } catch (error) {
        console.log(error);
      }
    },
    // async onVerified(val) {
    //   // console.log(val);
    //   this.showExploring = true;
    //   this.token = val;
    //   await this.getExploreInfo();
    //   this.pointCount();
    //   this.showExploring = false;
    // },

    // onError() {
    //   this.$refs.turnstile.reset();
    //   // this.showExploring = false
    // },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .point-square {
    left: 48% !important;
    top: 41% !important;
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

  .booster-overview-bg {
    max-height: initial !important;
    width: 100%;
    display: block;
    object-fit: cover;
    min-height: 100vh;
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
  .explore-bar-mobile {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 76%;
    bottom: unset;
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
.nodeBoostWrap{
  width: 100%;
  position: absolute;
  top: 85%;
  background:
    linear-gradient(180deg, rgba(58, 71, 98, 0.25) 0%, rgba(58, 71, 98, 0) 69.08%),
    linear-gradient(154.45deg, rgba(97, 114, 243, 0) 42.1%, #6172F3 100%),#06090F;
  border: 1px solid rgba(98,112,151);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-image-slice: 1;
  border-bottom-color: transparent;
  padding-bottom: 20px;
  .nodeboost-title{
    font-size: 16px;
    color: #fff;
    text-shadow: 0px 0px 8px #6172F3;
    font-weight: bold;
    height: 75px;
  }
  .nodeboost-item{
    position: relative;
    width: 30%;
    background: linear-gradient(162.54deg, #0C111D 15.68%, #182230 91.11%);
    border-radius: 8px;
    border-bottom-right-radius: 16px;
    height: 90px;
    .storage-boost, .computing-boost, .network-boost{
      margin-top:-18px;
    }
  }
  .storage-activity {
    background: linear-gradient(162.54deg, #1102FC 15.68%, #0FE1F8 91.11%);
  }
  .computing-activity {
    background: linear-gradient(162.54deg, #6938EF 15.68%, #6172F3 91.11%);
  }
  .network-activity {
    background: linear-gradient(162.54deg, #009393 15.68%, #1EEFA4 91.11%);
  }
}
.card-storage {
  white-space: nowrap;
  padding: 4px;
  border-radius: 4px;
  backdrop-filter: blur(2px);
  > img {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
  }
  .task-title {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 4px;
    color: rgba(255, 255, 255, 0.75);
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    background: url("/img/booster/svg/fringe-bg.svg") no-repeat 100%;
    text-shadow: none;
    line-height: 10px;
  }
}
.unlocked-card-title {
  white-space: nowrap;
  padding: 2px 4px;
  border-top: 1px solid rgba(164, 188, 253, 0.25);
  border-bottom: 1px solid rgba(164, 188, 253, 0.25);
  background: rgba(97, 114, 243, 0.1);
  backdrop-filter: blur(2px);
  color: rgba(255, 255, 255, 1);
  text-align: center;
  font-size: 10px;
  font-weight: 400;
}
</style>
