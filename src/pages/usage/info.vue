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
    <div class="main-wrap auto pa-3">
      <div class="d-flex mt-8 mb-8 lh-1" v-for="(it, i) in list" :key="i">
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
      <v-btn color="primary" to="/usage/more" rounded>Get more >></v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
    };
  },
  computed: {
    list() {
      const info = this.info;
      const getSize = this.$utils.getFileSize;
      return [
        {
          label: "Bandwidth",
          desc: `（Free ${getSize(info.freeBandwidth) || "100GB"} per month,  ${
            getSize(info.purchasedBandwidth) || "0GB"
          } purchased）`,
          ...this.getPerc(
            info.usedFreeBandwidth + info.usedPurchasedBandwidth,
            info.freeBandwidth + info.purchasedBandwidth
          ),
        },
        {
          label: "Storage IPFS",
          desc: `（Free 4 GB a year, ${
            getSize(info.purchasedIpfsStorage) || "0G"
          } purchased，${
            getSize(info.usedIpfsStorage) || "0GB"
          } used，${new Date(info.ipfsStorageExpired || 0).format()}）`,
          ...this.getPerc(info.usedIpfsStorage, info.ipfsStorage),
        },
        {
          label: "Storage AR",
          tip: "AR is permanent storage.",
          desc: `（Free 100MB，${
            getSize(info.purchasedArStorage) || "0GB"
          } purchased）`,
          ...this.getPerc(info.usedArStorage, info.arStorage),
        },
        {
          label: "Build Minutes",
          desc: `（Free ${info.freeBuildMinutes || 250}Minutes  per month,  ${
            info.purchasedBuildMinutes || 0
          }Minutes purchased）`,
          ...this.getPerc(
            info.usedFreeBuildMinutes + info.usedPurchasedBuildMinutes,
            info.freeBuildMinutes + info.purchasedBuildMinutes,
            "Minutes"
          ),
          // rechargeTip: "（ Recharge used 50MB）",
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
          percTxt: "0/",
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
      return {
        perc: Math.round((used * 100) / total),
        percTxt,
        unit,
      };
    },
    async getInfo() {
      try {
        const { data } = await this.$http2.get(`/usage`);
        console.log(data);
        this.info = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>