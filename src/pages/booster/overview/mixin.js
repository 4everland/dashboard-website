import { mapGetters, mapState } from "vuex";
import { claimPoints } from "@/api/booster";
import { sendStoken } from "@/api/login.js";
import { coinMove } from "../../../utils/animation";
import TgStartBoostLoading from "../components/tg-start-boost-loading.vue";

export default {
  data() {
    return {
      computedPoints: 0,
      interval: 1000,
      timer: null,
      tgLoading: false,
      unlockLoading: -1,
    };
  },
  components: {
    TgStartBoostLoading,
  },
  computed: {
    ...mapState({
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
      updateBoostUserInfo: (s) => s.moduleBooster.updateBoostUserInfo,
      tgMiniOverlayLoading: (s) => s.moduleBooster.tgMiniOverlayLoading,
    }),
    ...mapGetters([
      "boostLocked",
      "baseRate",
      "boostRate",
      "currentComputed",
      "totalRate",
      "notLogin",
    ]),
    storageBoost() {
      return this.boosterInfo.baseRate.filter((it) => it.name == "storage");
    },
    networkBoost() {
      return this.boosterInfo.baseRate.filter((it) => it.name == "network");
    },
    computeBoost() {
      return this.boosterInfo.baseRate.filter((it) => it.name == "compute");
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
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
    isExplored() {
      return this.boosterInfo.negative > 0;
    },
    displayPoints() {
      if (this.isExplored)
        return this.boosterInfo.capacity - this.boosterInfo.negative;
      return this.computedPoints >= this.boosterInfo.capacity
        ? this.boosterInfo.capacity
        : this.computedPoints.toFixed(3);
    },
    displaySquare() {
      if (this.isExplored) return "/img/booster/3d-square-explored.png";
      return this.computedPoints < 1
        ? "/img/booster/3d-square-unlock.png"
        : this.computedPoints >= this.boosterInfo.capacity
        ? "/img/booster/3d-square-explored.png"
        : "/img/booster/3d-square.png";
    },
  },

  async created() {
    this.timer = setInterval(() => {
      this.computedPoints =
        this.computedPoints == 0 ? this.currentComputed : this.computedPoints;

      this.computedPoints += (this.totalRate * this.interval) / 3600000;
      if (this.computedPoints > this.boosterInfo.capacity) {
        this.computedPoints = this.boosterInfo.capacity;
      }
    }, this.interval);

    if (this.$route.query && this.$route.query.st) {
      const stoken = this.$route.query.st;
      const { data } = await sendStoken(stoken);
      this.onLoginData(data);
    }
  },
  methods: {
    handleStartBoost() {
      if (this.notLogin) {
        localStorage.loginTo = location.pathname + location.search;
        this.$router.push("/login");
      } else {
        this.$emit("handleStartBoost");
      }
    },

    async handleUnlock(index) {
      this.$emit("handleUnlock", index);
    },
    async handleClaim() {
      try {
        if (this.computedPoints < 1)
          return this.$toast2("Points below 1 unclaimable.", "info");
        if (this.asMobile) {
          coinMove("mobile-point-send", "mobile-point-receive");
        } else {
          coinMove("point-send", "point-receive");
        }
        clearInterval(this.timer);
        this.computedPoints = 0;
        const data = await claimPoints();
        console.log(data);
        await this.$store.dispatch("getBoosterUserInfo");

        this.timer = setInterval(() => {
          this.computedPoints =
            this.computedPoints == 0
              ? this.currentComputed
              : this.computedPoints;
          this.computedPoints += (this.totalRate * this.interval) / 3600000;
        }, this.interval);
      } catch (error) {
        console.log(error);
      }
    },
    onLoginData(data) {
      localStorage.authData = JSON.stringify(data);
      localStorage.token = data.accessToken;
      localStorage.nodeToken = data.nodeToken;
      let query = this.$route.query;
      let queryKeys = Object.keys(query).filter((it) => it != "st");
      let queryObj = {};
      if (queryKeys.length > 0) {
        queryKeys.forEach((it) => {
          queryObj[it] = query[it];
        });
      }
      if (this.$route.query) {
        this.$router.replace({
          path: "/boost",
          query: queryObj,
        });
      }
      location.reload();
    },
  },

  watch: {
    updateBoostUserInfo() {
      this.computedPoints = this.currentComputed;
    },
  },
};
