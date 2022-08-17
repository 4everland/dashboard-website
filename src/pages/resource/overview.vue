<style lang="scss">
.circular-0 {
  .v-progress-circular__underlay {
    stroke: #e5e9ea;
  }
}
</style>

<template>
  <div>
    <v-row>
      <v-col cols="12" md="7">
        <pay-act />
      </v-col>
      <v-col cols="12" md="5">
        <pay-balance />
      </v-col>
    </v-row>
    <v-card class="mt-5">
      <div class="pa-5">
        <div class="al-c hover-1" @click="$navTo('/resource/allocation')">
          <span class="gray-5">Resource Allocation</span>
          <span class="gray fz-14 ml-auto">More</span>
          <v-icon>mdi-chevron-right</v-icon>
        </div>
        <div class="pa-5" v-if="!info">
          <v-skeleton-loader type="article"></v-skeleton-loader>
        </div>
        <v-row class="mt-4" v-else>
          <v-col v-for="(it, i) in list" :key="i" cols="6" md="3" class="ta-c">
            <div class="al-c f-center mb-3">
              <span>{{ it.label }}</span>
              <e-tooltip top>
                <v-icon slot="ref" color="#999" size="14" class="ml-2"
                  >mdi-alert-circle</v-icon
                >
                <span>{{ it.desc }} </span>
              </e-tooltip>
            </div>
            <v-progress-circular
              class="circular-0"
              :rotate="-90"
              :size="130"
              :width="20"
              :value="it.perc"
              :color="it.color"
            >
              <span class="fz-17 gray-3">{{ it.perc }}%</span>
            </v-progress-circular>
            <div class="mt-3 gray fz-13" style="min-height: 40px">
              <p>{{ it.percTxt }}</p>
            </div>
            <div>
              <e-link :href="'/resource/subscribe?i=' + i">Subscribe</e-link>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: null,
    };
  },
  computed: {
    list() {
      const info = this.info;
      if (!info) return [];
      info.purchasedBuildMinutes = parseInt(info.purchasedBuildMinutes);
      const getSize = this.$utils.getFileSize;
      return [
        {
          label: "Bandwidth",
          name: "TRAFFIC",
          // Free resources 100GB per month, of which 5GB used, 0GB purchased
          desc: `Free resources ${
            getSize(info.freeBandwidth) || "100GB"
          } per month, ${getSize(info.purchasedBandwidth) || "0GB"} purchased.`,
          ...this.getPerc(
            info.usedFreeBandwidth + info.usedPurchasedBandwidth,
            info.freeBandwidth + info.purchasedBandwidth
          ),
        },
        {
          label: "IPFS Storage",
          name: "IPFS_STORAGE",
          desc: info.ipfsStorage
            ? `Free resources ${getSize(info.ipfsDefaultStorage)} a year, ${
                getSize(info.ipfsStorage - info.ipfsDefaultStorage) || "0G"
              } purchased，${new Date(info.ipfsStorageStart * 1e3).format(
                "date"
              )} - ${new Date(info.ipfsStorageExpired * 1000).format("date")}.`
            : "",
          ...this.getPerc(info.usedIpfsStorage, info.ipfsStorage),
          descTip:
            "When the service expires, we will keep the stored content for up to 7 days.",
        },
        {
          label: "Arweave",
          name: "AR_STORAGE",
          tip: "Arweave is a permanent storage service.",
          desc: `Free resources ${getSize(info.arDefaultStorage)}, ${
            getSize(info.arStorage - info.arDefaultStorage) || "0GB"
          } purchased.`,
          ...this.getPerc(info.usedArStorage, info.arStorage),
        },
        {
          label: "Build Minutes",
          name: "BUILD_TIME",
          desc: `Free resources ${
            info.freeBuildMinutes || 250
          } Minutes per month,  ${
            info.purchasedBuildMinutes || 0
          } Minutes purchased.`,
          ...this.getPerc(
            parseInt(
              info.usedFreeBuildMinutes + info.usedPurchasedBuildMinutes
            ),
            info.freeBuildMinutes + info.purchasedBuildMinutes,
            "Minutes"
          ),
        },
      ];
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getPerc(used, total, unit = "GB") {
      const getSize = this.$utils.getFileSize;
      if (!total)
        return {
          perc: 0,
          percTxt: "0",
          unit: "GB",
        };
      let percTxt = "";
      let usedTxt = "";
      if (unit == "GB") {
        const usedObj = getSize(used, true);
        const totalObj = getSize(total, true);
        usedTxt = usedObj.num + " " + usedObj.unit;
        let childUnit = "";
        if (usedObj.unit != totalObj.unit) childUnit = usedObj.unit;
        percTxt = `${usedObj.num} ${childUnit} / ${totalObj.num} ${totalObj.unit}`;
      } else {
        usedTxt = used + " Minutes";
        percTxt = `${used} / ${total} ${unit}`;
      }
      let tip = "";
      let over = used - total;
      if (over > 0) {
        if (unit == "GB") over = getSize(over);
        else over += " " + unit;
        tip = `(Recharge used ${over})`;
      }
      let perc = (used * 100) / total;
      perc = this.$utils.cutFixed(perc, 2); //Math.max(perc > 0 ? 0.5 : 0.2, perc);
      return {
        perc,
        color: perc < 80 ? "#775DA6" : "#df4f4f",
        percTxt,
        usedTxt,
        unit,
        rechargeTip: tip,
      };
    },
    async getInfo() {
      try {
        const { data } = await this.$http.get(`$v3/usage`);
        this.info = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>