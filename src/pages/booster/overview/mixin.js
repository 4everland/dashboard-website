import { mapGetters, mapState } from "vuex";
import { unlockStage, claimPoints } from "@/api/booster";
export default {
  data() {
    return {
      computedPoints: 0,
      interval: 2000,
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
    setInterval(() => {
      this.computedPoints =
        this.computedPoints == 0 ? this.currentComputed : this.computedPoints;
      this.computedPoints += (this.totalRate * this.interval) / 3600000;
    }, this.interval);
  },
  methods: {
    async handleUnlock(index) {
      try {
        const { data } = await unlockStage(index);
        console.log(data);
        this.$store.dispatch("getBoosterUserInfo");
      } catch (error) {
        console.log(error);
      }
    },
    async hanleClaim() {
      try {
        const data = await claimPoints();
        console.log(data);
        this.$store.dispatch("getBoosterUserInfo");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
