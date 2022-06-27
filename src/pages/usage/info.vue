<style lang="scss">
.usage-info {
  .label {
    width: 120px;
  }
  .m-progress {
    .v-progress-linear {
      background: #f9fbfc;
      .v-progress-linear__background {
        display: none;
      }
      &,
      & .v-progress-linear__determinate {
        border-radius: 100px;
      }
    }
  }
}
</style>

<template>
  <div class="usage-info">
    <div class="main-wrap pa-3" style="min-height: 240px">
      <v-skeleton-loader type="article" v-if="!info" />
      <div
        v-else
        class="d-flex mt-8 mb-8 lh-1"
        v-for="(it, i) in list"
        :key="i"
      >
        <div class="label ta-r fz-15 mr-1 pos-r">
          <e-tooltip top v-if="it.tip">
            <v-icon color="#999" size="18" slot="ref" class="mr-1"
              >mdi-alert-circle</v-icon
            >
            <span>{{ it.tip }}</span>
          </e-tooltip>
          <span>{{ it.label }}:</span>
        </div>
        <div style="width: 50%">
          <div class="ml-2">
            <div class="m-progress">
              <v-progress-linear
                :color="it.color || 'primary'"
                :value="it.perc || 0"
                height="14"
                rounded
              ></v-progress-linear>
            </div>
            <p class="mt-3 fz-12 gray">
              {{ it.desc }}
            </p>
          </div>
        </div>
        <div class="color-1 fz-13 ml-2">{{ it.percTxt || "/" }}</div>
        <span class="gray ml-2 fz-13">{{ it.rechargeTip }}</span>
      </div>
    </div>

    <div class="mt-5 ml-5 ta-r">
      <v-btn color="primary" to="/usage/more" rounded>Buy more >></v-btn>
    </div>
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
      const getSize = this.$utils.getFileSize;

      return [
        {
          label: "Bandwidth",
          // Free resources 100GB per month, of which 5GB used, 0GB purchased
          desc: `（Free resources ${
            getSize(info.freeBandwidth) || "100GB"
          } per month, ${
            getSize(info.purchasedBandwidth) || "0GB"
          } purchased）`,
          ...this.getPerc(
            info.usedFreeBandwidth + info.usedPurchasedBandwidth,
            info.freeBandwidth + info.purchasedBandwidth
          ),
        },
        {
          label: "Storage IPFS",
          desc: info.ipfsStorage
            ? `（Free resources 4 GB a year, ${
                getSize(info.ipfsStorage - info.ipfsDefaultStorage) || "0G"
              } purchased，${
                getSize(info.usedIpfsStorage) || "0GB"
              } used，${new Date(info.ipfsStorageExpired * 1000).format()}）`
            : "",
          ...this.getPerc(info.usedIpfsStorage, info.ipfsStorage),
        },
        {
          label: "Storage AR",
          tip: "Arweave is a permanent storage service.",
          desc: `（Free 100MB，${
            getSize(info.arStorage - info.arDefaultStorage) || "0GB"
          } purchased）`,
          ...this.getPerc(info.usedArStorage, info.arStorage),
        },
        {
          label: "Build Minutes",
          desc: `（Free resources ${
            info.freeBuildMinutes || 250
          }Minutes per month,  ${
            info.purchasedBuildMinutes || 0
          }Minutes purchased）`,
          ...this.getPerc(
            info.usedFreeBuildMinutes + info.usedPurchasedBuildMinutes,
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
      if (unit == "GB") {
        const usedObj = getSize(used, true);
        const totalObj = getSize(total, true);
        let childUnit = "";
        if (usedObj.unit != totalObj.unit) childUnit = usedObj.unit;
        percTxt = `${usedObj.num} ${childUnit} / ${totalObj.num} ${totalObj.unit}`;
      } else {
        percTxt = `${used} / ${total} ${unit}`;
      }
      let tip = "";
      if (used > total) {
        tip = `(Recharge used ${getSize(used - total)})`;
      }
      let perc = Math.round((used * 100) / total);
      perc = Math.max(1, perc);
      return {
        perc,
        percTxt,
        unit,
        rechargeTip: tip,
      };
    },
    async getInfo() {
      try {
        const { data } = await this.$http.get(`$v3/usage`);
        console.log(data);
        this.info = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>