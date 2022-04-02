<style lang="scss">
.billing2 {
  .circular-0 {
    .v-progress-circular__underlay {
      stroke: #d8ecf7;
    }
  }
  .circular-1 {
    .v-progress-circular__underlay {
      stroke: #93dbb5;
    }
  }
  .circular-2 {
    .v-progress-circular__underlay {
      stroke: #e0c6e9;
    }
  }
}
</style>

<template>
  <div class="billing2">
    <v-card outlined>
      <div class="card-head-1 d-flex al-end">
        <div>Hosting Usage</div>
        <span class="ml-2 gray fz-12" v-if="info.indexStartTime"
          >{{ new Date(info.indexStartTime).format("date") }} to
          {{ new Date(info.indexEndTime).format("date") }}</span
        >
      </div>
      <div class="bdt-1 pd-20 ta-c">
        <v-skeleton-loader type="article" v-if="loadingInfo" />
        <v-row v-else>
          <v-col cols="12" md="6" lg="4" v-for="(it, i) in usageList" :key="i">
            <h4 class="mb-3">{{ it.title }}</h4>
            <v-progress-circular
              :class="'circular-' + i"
              :rotate="-90"
              :size="136"
              :width="12"
              :value="it.value"
              :color="it.color"
            >
              <b class="fz-25">{{ it.used }}</b>
              <sub class="gray ml-1">{{ it.unit }}</sub>
            </v-progress-circular>
            <div class="mt-3">{{ it.total }} {{ it.unit }}</div>
          </v-col>
        </v-row>
      </div>
      <div class="bdt-1 pd-15-20 d-flex al-c" v-if="info.plan">
        <div class="mr-auto">
          <p>
            <span class="label-1">Plan:</span>
            <b class="ml-2">{{ info.plan }}</b>
          </p>
          <p class="gray fz-14" v-if="info.startTime && info.plan != 'Free'">
            Current billing period starts from
            {{ new Date(info.startTime).format("date") }} to
            {{ new Date(info.endTime).format("date") }}.
            <e-tooltip right max-width="300" v-if="info.totalStorage == 40">
              <v-icon slot="ref" size="16" class="pa-1 d-ib"
                >mdi-help-circle-outline</v-icon
              >
              <span
                >Subscribers who register before December 2, 2021 will have
                access to 100M bandwidth and 40G storage until December 31,
                2021.</span
              >
            </e-tooltip>
          </p>
        </div>
        <v-btn color="primary" small to="/plan">Change Plan</v-btn>
      </div>
    </v-card>

    <v-card outlined class="mt-5">
      <div class="card-head-1">Bucket Usage</div>
      <div class="bdt-1"></div>
      <st-billing-bucket />
    </v-card>

    <v-card outlined class="mt-5">
      <div class="card-head-1">Activity History</div>
      <div class="bdt-1 pa-4">
        <v-data-table
          class="mt-4"
          :loading="loadingList"
          :headers="headers"
          :items="list"
          hide-default-footer
        >
          <template v-slot:item.pay="{ item }">
            <div class="d-flex al-c">
              <img
                :src="`img/svg/settings/c-${item.token.toLowerCase()}.svg`"
                height="20"
              />
              <span class="ml-2">{{ item.pay }} {{ item.token }}</span>
            </div>
          </template>
          <template v-slot:item.txHash="{ item }">
            <v-chip
              small
              :href="`https://${$inDev ? 'goerli.' : ''}etherscan.io/tx/${
                item.txHash
              }`"
              target="_blank"
            >
              <v-icon size="14" class="mr-1">mdi-link-variant</v-icon>
              {{ item.txHash.cutStr(5, 5) }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </div>
</template>

<script>
const tokenMap1 = {
  "0x2d2C8ab3A4006823260F862FF042b8cFDBcCE0C7": "DAI",
  "0x3858561E92C4F44fa2e4fBC3Ef57ac02Bc2754eF": "USDC",
  "0x2b10a378fa4C6B3cb8df4EAb64Fb269CBA08E188": "USDT",

  "0x998d6e0EFC50A349bCE64cC8d62d17DC2B34cFBF": "DAI",
  "0x317e9ca06E7b27bb77df8BbA1dcEBB84DDD79CD8": "USDC",
  "0x742Af74e3f07bD1be9038fF2767ff8BB00424fc8": "USDT",
  "0x6b175474e89094c44da98b954eedeac495271d0f": "DAI",
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "USDC",
  "0xdac17f958d2ee523a2206206994597c13d831ec7": "USDT",
};
const tokenMap = {};
for (const key in tokenMap1) {
  tokenMap[key.toUpperCase()] = tokenMap1[key];
}

export default {
  data() {
    return {
      value: 10,
      info: {},
      loadingInfo: true,
      loadingList: false,
      headers: [
        { text: "Payment", value: "pay" },
        { text: "TxHash", value: "txHash" },
        { text: "CreateAt", value: "createAt" },
        { text: "Status", value: "status" },
      ],
      list: [],
    };
  },
  computed: {
    usageList() {
      const info = this.info;
      return [
        {
          title: "Bandwidth",
          total: info.totalBandwidth,
          used: info.usedBandwidth.toFixed(2),
          value: parseInt((info.usedBandwidth * 100) / info.totalBandwidth),
          unit: "GB",
          color: "primary",
        },
        {
          title: "Storage",
          total: info.totalStorage,
          used: info.usedStorage.toFixed(2),
          value: parseInt((info.usedStorage * 100) / info.totalStorage),
          unit: "GB",
          color: "success",
        },
        {
          title: "Build Minutes",
          total: info.totalBuildMinutes,
          used: info.usedBuildMinutes,
          value: parseInt(
            (info.usedBuildMinutes * 100) / info.totalBuildMinutes
          ),
          unit: "Min",
          color: "#BA79D2",
        },
      ];
    },
  },
  created() {
    this.getData();
  },
  methods: {
    async getList() {
      try {
        this.loadingList = true;
        let { data } = await this.$http2.get("/payment/activity/history");
        this.list = data.map((it) => {
          it.createAt = new Date(it.createAt).format();
          it.token = tokenMap[it.token.toUpperCase()];
          it.pay = parseInt(it.pay / (it.token == "DAI" ? 1e18 : 1e6));
          it.status = it.status ? "success" : "pending";
          return it;
        });
      } catch (error) {
        console.log(error);
      }
      this.loadingList = false;
    },
    async getData() {
      try {
        this.loadingInfo = true;
        const { data } = await this.$http2.get("/consumption/info");
        this.info = data;
        this.loadingInfo = false;
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      this.getList();
    },
  },
};
</script>