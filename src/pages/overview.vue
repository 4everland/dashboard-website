<template>
  <div>
    <!-- <v-alert
      text
      type="info"
      dismissible
      dense
      v-if="userInfo.email && !noTip"
      @input="onCloseTip"
    >
      <router-link to="/settings?tab=account_binding&type=3">
        Subscribe to stay up to date on the 4EVERLAND latest news and events.
      </router-link>
    </v-alert> -->
    <!-- <e-tabs :list="list" /> -->
    <!-- {{ usageList }} -->
    <v-row>
      <v-col v-for="(it, i) in usageList" :key="i">
        <v-card class="pa-3">
          <div class="d-flex al-end lh-1">
            <h2>{{ it.num }}</h2>
            <span class="gray">
              {{ it.unitTxt }}
            </span>
          </div>
          <p>{{ it.label }}</p>
        </v-card>
      </v-col>
    </v-row>
    <v3-overview />
    <new-user-tips />
  </div>
</template>

<script>
export default {
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  data() {
    return {
      usageInfo: {},
    };
  },
  computed: {
    usageList() {
      const info = this.usageInfo;
      return [
        {
          label: "IPFS",
          ...this.getPerc(info.usedIpfsStorage, info.ipfsStorage),
        },
        {
          label: "Arweave",
          ...this.getPerc(info.usedArStorage, info.arStorage),
        },
        {
          label: "Bandwidth",
          ...this.getPerc(
            info.usedFreeBandwidth + info.usedPurchasedBandwidth,
            info.freeBandwidth + info.purchasedBandwidth
          ),
        },
        {
          label: "Build Minutes",
          ...this.getPerc(
            parseInt(
              info.usedFreeBuildMinutes + info.usedPurchasedBuildMinutes
            ),
            info.freeBuildMinutes + info.purchasedBuildMinutes,
            "Minutes"
          ),
        },
        {
          num: "0.00",
          unitTxt: "USDC",
          label: "Balance",
        },
      ];
    },
  },
  created() {
    // this.isSolana(); // move to: overview/new-user-tips.vue
    this.getUsageInfo();
  },
  methods: {
    getPerc(used, total, unit = "GB") {
      if (!total) {
        return {
          loading: true,
        };
      }
      const getSize = this.$utils.getFileSize;
      let unitTxt = "";
      let num = "";
      if (unit == "GB") {
        const usedObj = getSize(used, true);
        const totalObj = getSize(total, true);
        num = usedObj.num;
        unitTxt = `${usedObj.unit}/${totalObj.num}${totalObj.unit}`;
      } else {
        num = used;
        unitTxt = `Min/${total.toFixed(0)}Min`;
      }
      let perc = (used * 100) / total;
      perc = Math.max(perc > 0 ? 0.5 : 0, perc);
      return {
        perc,
        num,
        unitTxt,
      };
    },
    async getUsageInfo() {
      try {
        const { data } = await this.$http.get(`$v3/usage`);
        this.usageInfo = data;
      } catch (error) {
        console.log(error);
      }
    },
    onCloseTip() {
      localStorage.noEmailTip = "1";
      this.noTip = true;
    },
  },
};
</script>
