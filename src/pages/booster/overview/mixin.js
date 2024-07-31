import { mapGetters, mapState } from "vuex";
import { unlockStage, claimPoints } from "@/api/booster";
import { bus } from "@/utils/bus";

export default {
  data() {
    return {
      computedPoints: 0,
      interval: 1000,
      timer: null,
    };
  },
  computed: {
    ...mapState({
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
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
  },

  created() {
    this.timer = setInterval(() => {
      this.computedPoints =
        this.computedPoints == 0 ? this.currentComputed : this.computedPoints;
      this.computedPoints += (this.totalRate * this.interval) / 3600000;
    }, this.interval);
  },
  methods: {
    handleStartBoost() {
      if (this.notLogin) {
        this.$router.push("/login");
      } else {
        this.$emit("handleStartBoost");
      }
    },
    async handleUnlock(index) {
      try {
        const data = await unlockStage(index);
        if (data.code == 10002) {
          this.$toast2(data.message, "error");
          bus.$emit("showDepositDialog", { land: data.data.land });
        } else {
          this.$store.dispatch("getBoosterUserInfo");
          this.$store.dispatch("getBalance");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async hanleClaim() {
      try {
        const data = await claimPoints();
        console.log(data);
        clearInterval(this.timer);
        this.computedPoints = 0;
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
  },
};
