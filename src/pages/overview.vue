<style lang="scss">
.ov-wrap-1 {
  padding: 30px 15px;
}
</style>

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
        <v-card style="min-width: 120px">
          <div class="pa-1" v-if="it.loading">
            <v-skeleton-loader type="article" />
          </div>
          <div class="ov-wrap-1 pos-r" v-else>
            <img
              v-if="it.icon"
              :src="`img/svg/overview/${it.icon}`"
              :style="it.iconStyle || 'width: 24px'"
              class="pos-a top-0 right-0 mt-3 mr-3"
            />
            <div class="d-flex al-end lh-1">
              <span class="purple-1 fz-22">{{ it.num }}</span>
              <span class="fz-12 ml-2">
                {{ it.unitTxt }}
              </span>
            </div>
            <p class="mt-3 fz-14 gray-8">{{ it.label }}</p>
            <div class="mt-3 al-c fz-14 gray">
              <template v-if="it.isBalance">
                <span>Purchsed: </span>
                <u class="link ml-2">0</u>
                <span class="ml-auto">Finished: </span>
                <u class="link ml-2">0</u>
              </template>
              <template v-else>
                <v-progress-linear
                  :color="it.color || 'primary'"
                  :value="it.perc || 0"
                  height="6"
                  rounded
                ></v-progress-linear>
                <span class="ml-3 fz-14"> {{ it.perc }}% </span>
              </template>
            </div>
          </div>
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
          icon: "ipfs.svg",
          ...this.getPerc(info.usedIpfsStorage, info.ipfsStorage),
        },
        {
          label: "Arweave",
          icon: "ar.svg",
          color: "#F9837C",
          ...this.getPerc(info.usedArStorage, info.arStorage),
        },
        {
          label: "Bandwidth",
          icon: "bandwidth.svg",
          color: "#70B6C1",
          ...this.getPerc(
            info.usedFreeBandwidth + info.usedPurchasedBandwidth,
            info.freeBandwidth + info.purchasedBandwidth
          ),
        },
        {
          label: "Build Minutes",
          icon: "buildtime.svg",
          color: "#F3CC5C",
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
          isBalance: true,
          loading: !info.ipfsStorage,
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
      if (perc > 0) perc = Math.max(0.01, perc.toFixed(2));
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
