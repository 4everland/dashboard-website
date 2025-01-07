import { mapGetters, mapState } from "vuex";
import { bus } from "@/utils/bus";
import { claimPoints } from "@/api/booster";
import { sendStoken } from "@/api/login.js";
import { coinMove } from "../../../utils/animation";
import TgStartBoostLoading from "../components/tg-start-boost-loading.vue";
import CountDown from "../components/count-down.vue";

export default {
  data() {
    return {
      computedPoints: 0,
      interval: 1000,
      timer: null,
      tgLoading: false,
      unlockLoading: -1,
      protectTime: "",
      protectTimer: null,
      isProtecting: false,
      tabTimer: null,
      endTimeStake: 1733803200
    };
  },
  components: {
    TgStartBoostLoading,
    CountDown
  },
  computed: {
    ...mapState({
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
      updateBoostUserInfo: (s) => s.moduleBooster.updateBoostUserInfo,
      tgMiniOverlayLoading: (s) => s.moduleBooster.tgMiniOverlayLoading,
      dailySign: (s) => s.moduleBooster.dailySign,
      tonConnectUI: (s) => s.moduleBooster.tonConnectUI,
      userInfo: (s) => s.userInfo,
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

    showDailySign() {
      if (!this.dailySign) return "DONE";
      return this.dailySign[0].actStatus !== "DONE";
    },
    stakeEnd() {
      const curTimeStamp = +new Date() / 1e3;
      return curTimeStamp > this.endTimeStake;
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

    if (this.boosterInfo.protectExpiredAt > 0) {
      this.protectCardTime();
    }
    if (this.$route.query && this.$route.query.st) {
      const stoken = this.$route.query.st;
      const { data } = await sendStoken(stoken);
      this.onLoginData(data);
    }
    this.$store.dispatch("getDailySign");
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
    showBindExchange(){
      bus.$emit('showBindExchangeEvent');
    },
    showStartQueryDialog(){
      let info = this.userInfo.username;
      let airInfo = localStorage.getItem("airdrop" + info);
      if(!airInfo){
        bus.$emit('showStartQueryEvent');
      } else {
        bus.$emit('showQueryDialogEvent');
      }
    },

    async handleUnlock(index) {
      this.$emit("handleUnlock", index);
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
        if (this.computedPoints < 1)
          return this.$toast2("Points below 1 unclaimable.", "info");
        if (this.asMobile) {
          this.playaudio();
          coinMove("mobile-point-send", "mobile-point-receive");
          await this.$sleep(2000)
          this.handleShadow();
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
    protectCardTime() {
      if (this.boosterInfo.protectExpiredAt * 1000 > +new Date()) {
        if (this.protectTimer) {
          clearInterval(this.protectTimer);
        }
        this.protectTimer = setInterval(() => {
          let seconds =
            this.boosterInfo.protectExpiredAt - Math.ceil(+new Date() / 1000);
          if (seconds < 0) {
            this.protectTime = "";
            clearInterval(this.protectTimer);
            this.isProtecting = false;
            return;
          }
          this.isProtecting = true;
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          const remainingSeconds = seconds % 60;

          this.protectTime = `${String(hours).padStart(2, "0")}:${String(
            minutes
          ).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
        }, 1000);
      }
    },
    onPress(e) {
      // e.preventDefault();
      this.tabTimer = setTimeout(() => {
        this.$store.commit("SET_EASTER_EGG_DIALOG", true);
      }, 2000);
    },
    onUp() {
      clearInterval(this.tabTimer);
    },
  },
  watch: {
    updateBoostUserInfo() {
      this.computedPoints = this.currentComputed;
    },
  },
};
