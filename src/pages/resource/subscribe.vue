<style lang="scss">
.e-tabs-2 {
  .v-tabs-slider-wrapper {
    padding: 0 15px;
  }
}
</style>

<template>
  <div>
    <v-skeleton-loader type="article" v-if="!usageInfo" />
    <template v-else>
      <div class="pos-s z-1" style="top: 60px">
        <v-tabs v-model="tabIdx" class="bdrs-6 shadow-2 e-tabs-2">
          <v-tab @click="onTab" v-for="(it, i) in list" :key="i">{{
            it.label
          }}</v-tab>
        </v-tabs>
      </div>
      <v-card
        class="mt-5 shadow-2"
        :ref="'card' + i"
        v-for="(it, i) in list"
        :key="i"
      >
        <div class="pa-5">
          <div class="al-c">
            <img :src="`/img/svg/overview/${it.icon}`" width="16" />
            <span class="ml-3 fz-15">{{ it.label }}</span>
          </div>
          <div class="mt-6">
            <e-kv :label="it.label">
              {{ it.percTxt }}
            </e-kv>
          </div>
        </div>
      </v-card>
      <div class="pa-3 mt-3 gray fz-14">
        <p>Tips：</p>
        <p>
          1. Please Note: The price calculator provides a reference price, but
          the specific deduction depends on the order result.
        </p>
        <p>
          2. In pay-per-use billing mode, the amount shown in the price
          calculator is rounded to two decimal places if any, and the third
          place is rounded off. If the rounded amount is less than 0.01USD, it
          will be displayed as 0.01USD.
        </p>
      </div>
      <div style="height: 40vh"></div>
      <div
        class="mt-2 pos-s btm-0 pa-3 bdrs-6 shadow-2"
        style="background: #fff5eb"
      >
        <div class="al-c">
          <span class="fz-14 gray-6">Configuration costs</span>
          <usage-preview :previewList="previewList" :list="list" />
          <b class="red-1 fz-25 ml-3">{{ totalPrice }}</b>
          <span class="gray-6 ml-2 fz-15">USD</span>
          <v-btn
            color="error"
            depressed
            class="ml-auto"
            to="/resource/subscribe/order"
            >Confirm</v-btn
          >
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import mixin from "./mixin";

const ResourceType = {
  BuildingTime: 1,
  Bandwidth: 2,
  ARStorage: 3,
  IPFSStorage: 4,
};

export default {
  // mixins: [mixin],
  data() {
    return {
      tabIdx: 0,
      priceInfo: {},
      usageInfo: null,
      form: {},
      feeForm: {},
      scrollMap: [],
    };
  },
  computed: {
    ...mapState({
      scrollTop: (s) => s.scrollTop,
    }),
    list() {
      const price = this.priceInfo;
      const info = this.usageInfo;
      if (!info) return [];
      return [
        {
          label: "Bandwidth",
          icon: "bandwidth.svg",
          id: ResourceType.Bandwidth,
          key: "bandwidth",
          unit: "GB",
          unitPrice: price.trafficUnitPrice || 0,
          ...this.getPerc(
            info.usedFreeBandwidth + info.usedPurchasedBandwidth,
            info.freeBandwidth + info.purchasedBandwidth
          ),
        },
        {
          label: "IPFS Storage",
          icon: "ipfs.svg",
          id: ResourceType.IPFSStorage,
          key: "ipfs",
          unit: "GB / Mon",
          unitPrice: price.ipfsStorageUnitPrice || 0,
          ...this.getPerc(info.usedIpfsStorage, info.ipfsStorage),
        },
        {
          label: "Arweave",
          icon: "ar.svg",
          id: ResourceType.ARStorage,
          key: "ar",
          unit: "MB",
          unitPrice: price.arStorageUnitPrice || 0,
          ...this.getPerc(info.usedArStorage, info.arStorage),
        },
        {
          label: "Build Minutes",
          icon: "buildtime.svg",
          id: ResourceType.BuildingTime,
          key: "buildMinutes",
          unit: "Min",
          unitPrice: price.buildTimeUnitPrice || 0,
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
    minSend() {
      return this.isPolygon ? 0.01 : 20;
    },
    previewList() {
      const ipfsFee = this.feeForm[ResourceType.IPFSStorage];
      return this.list
        .map((it) => {
          const value = this.form[it.key] || 0;
          let price = (value * it.unitPrice) / 100;
          let until = "used up";
          if (it.key == "ipfs") {
            if (!this.ipfsExpired) price = this.getFee(ipfsFee);
            else price *= this.ipfsMon;
            // console.log("ipfs preview", value, price);
            if (price) {
              let start = this.usageInfo.ipfsStorageExpired;
              start = start ? start * 1e3 : Date.now();
              until = new Date(start + this.ipfsMon * 30 * 86400 * 1e3).format(
                "date"
              );
            }
          }
          return {
            label: it.label,
            key: it.key,
            value,
            price,
            unit: it.unit,
            until: "Until " + until,
          };
        })
        .filter((it) => {
          return it.price > 0;
        });
    },
    totalPrice() {
      return this.previewList
        .reduce((a, b) => {
          let price = b.price;
          return a + price;
        }, 0)
        .toFixed(2)
        .replace(".00", "");
    },
    ipfsExpired() {
      return this.usageInfo.ipfsExpired;
    },
  },
  watch: {
    scrollTop(val) {
      let toIdx = 0;
      for (const i in this.scrollMap) {
        const top = this.scrollMap[i];
        if (val >= top) toIdx = i;
      }
      this.tabIdx = toIdx * 1;
    },
  },
  mounted() {
    const form = {};
    this.list.forEach((it) => {
      form[it.key] = 0;
    });
    this.form = form;
    this.getInfo();
  },
  methods: {
    onTab() {
      this.$nextTick(() => {
        const top = this.scrollMap[this.tabIdx] || 0;
        window.scrollTo(0, top);
      });
    },
    getPerc(used, total, unit = "GB") {
      const getSize = this.$utils.getFileSize;
      let percTxt = "";
      if (unit == "GB") {
        const usedObj = getSize(used, true);
        const totalObj = getSize(total, true);
        let childUnit = "";
        if (usedObj.unit != totalObj.unit) childUnit = usedObj.unit;
        percTxt = `${usedObj.num} ${childUnit} / ${totalObj.num} ${totalObj.unit}`;
      } else {
        percTxt = `${used} / ${total} Min`;
      }
      let perc = (used * 100) / total;
      perc = this.$utils.cutFixed(perc, 2);
      return {
        perc,
        percTxt,
      };
    },
    getCardTop() {
      this.$nextTick(() => {
        const arr = [];
        for (const i in this.list) {
          const el = this.$refs["card" + i][0].$el;
          arr[i] = el.offsetTop - 60;
        }
        this.scrollMap = arr;
      });
    },
    async getInfo() {
      try {
        const { data } = await this.$http.get("$v3/common/resource/price");
        for (const key in data) {
          let m = key == "buildTimeUnitPrice" ? 60 : Math.pow(1024, 3);
          if (key == "arStorageUnitPrice") m = Math.pow(1024, 2);
          if (/ipfs/i.test(key)) m *= 86400 * 30;
          data[key] = (data[key] * m * 100) / 1e18;
        }
        this.priceInfo = data;

        const { data: usageInfo } = await this.$http.get(`$v3/usage`);
        this.usageInfo = usageInfo;
        this.getCardTop();
      } catch (error) {
        this.$confirm(error.message, {
          confirmText: "Try Again",
        })
          .then(() => {
            this.getInfo();
          })
          .catch(() => {
            this.$router.push("/resource");
          });
      }
    },
    getFee(fee) {
      if (!fee) return 0;
      return (
        this.formatToken(fee.length == 2 ? fee[0].add(fee[1]) : fee, 4) * 1
      );
    },
  },
};
</script>