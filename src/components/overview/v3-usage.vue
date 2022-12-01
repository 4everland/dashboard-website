<template>
  <v-row>
    <v-col style="min-width: 200px" v-for="(it, i) in usageList" :key="i">
      <v-card style="min-width: 120px">
        <div class="pa-1" v-if="it.loading">
          <v-skeleton-loader type="article" />
        </div>
        <div
          class="ov-wrap-1 pos-r"
          :class="{
            'pb-6': it.isBalance,
          }"
          v-else
        >
          <img
            v-if="it.icon"
            :src="`/img/svg/overview/${it.icon}`"
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
          <div
            class="al-c fz-13 gray"
            :style="{
              marginTop: it.isBalance ? '11px' : '12px',
            }"
          >
            <template v-if="it.isBalance">
              <v-btn
                color="primary"
                small
                class="pl-2 pr-2"
                to="/resource/subscribe"
                >Purchase</v-btn
              >
              <v-btn
                outlined
                small
                class="pl-2 pr-2 ml-4"
                to="/resource/deposit"
                >Deposit</v-btn
              >
              <!-- <span>Airdropped</span>
              <b class="link ml-1">{{ accoutInfo.freeOrder || 0 }}</b>
              <span class="ml-auto">Purchased</span>
              <b class="link ml-1">{{ accoutInfo.paidOrder || 0 }}</b> -->
            </template>
            <template v-else>
              <v-progress-linear
                :color="it.color || 'primary'"
                :value="it.perc || 0"
                height="6"
              ></v-progress-linear>
              <span class="ml-3 fz-14"> {{ it.perc }}% </span>
            </template>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      usageInfo: {},
      accoutInfo: {},
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    usageList() {
      const info = this.usageInfo;
      return [
        {
          label: "IPFS Storage",
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
          num: this.accoutInfo.balance,
          isBalance: true,
          loading: !this.accoutInfo.loaded,
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
    onClick(it) {
      if (it.isBalance) this.$navTo("/billing/bills");
    },
    getPerc(used, total, unit = "GB") {
      if (typeof total != "number" || isNaN(total)) {
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
        unitTxt = `${usedObj.unit} / ${totalObj.num}${totalObj.unit}`;
      } else {
        num = used;
        unitTxt = `Min / ${total.toFixed(0)}Min`;
      }
      let perc = total ? (used * 100) / total : 0;
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
        await this.getBalance();
      } catch (error) {
        console.log(error);
      }
    },
    async getBalance() {
      // const { data } = await this.$http.get("$v3/account/order");
      const {
        data: { balance },
      } = await this.$http.get("$v3/account/balance");
      this.accoutInfo = {
        // ...data,
        balance: this.$utils.cutFixed(balance, 4),
        loaded: true,
      };
    },
  },
};
</script>
