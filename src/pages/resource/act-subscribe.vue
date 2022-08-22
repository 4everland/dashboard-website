<style lang="scss">
.e-tabs-2 {
  .v-tabs-slider-wrapper {
    padding: 0 15px;
  }
}
</style>

<template>
  <div>
    <e-right-opt-wrap>
      <v-btn to="/resource/price-docs" outlined small>Price Docs</v-btn>
    </e-right-opt-wrap>
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
          <div class="mt-6 al-c">
            <e-kv class="flex-1" :label="it.label + ':'">
              {{ it.percTxt }}
            </e-kv>
            <e-kv class="flex-1" label="Expiration date" v-if="it.expireTime">
              {{ new Date(it.expireTime * 1e3).format() }}
            </e-kv>
          </div>
          <div class="mt-6 al-c" v-if="it.key == 'ipfs'">
            <e-radio-btn
              :options="['Expansion', 'Renewal']"
              v-model="ipfsIdx"
            ></e-radio-btn>
            <span class="ml-4 gray-7 fz-14">
              {{
                ipfsIdx == 0
                  ? "Expand storage capacity without changing the expiration date. "
                  : "Extend expiration date without changing the storage capacity."
              }}
            </span>
          </div>
          <div class="mt-6" v-show="it.key == 'ipfs' && ipfsIdx == 1">
            <e-kv label="Pick plan:" center>
              <pay-choose-num :options="it.monOpts" unit="Mon"></pay-choose-num>
            </e-kv>
          </div>
          <div class="mt-6" v-show="it.key != 'ipfs' || ipfsIdx == 0">
            <e-kv label="Pick plan:" center>
              <pay-choose-num
                :options="it.opts"
                :unit="it.unit"
              ></pay-choose-num>
            </e-kv>
          </div>
          <div class="mt-6">
            <e-kv label="Selected:" center>
              <span class="color-1 fz-18"> 0 </span>
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
      <div style="height: 50vh"></div>

      <pay-confirm
        label="Configuration costs"
        :price="totalPrice"
        to="/resource/subscribe/order"
      >
        <usage-preview :previewList="previewList" :list="list" />
      </pay-confirm>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
const Mb = Math.pow(1024, 2);
const Gb = Math.pow(1024, 3);

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
      ipfsIdx: 0,
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
          opts: [500 * Gb, 1000 * Gb, 2 * 1024 * Gb],
          unit: "GB",
          unitPrice: price.trafficUnitPrice || 0,
          ...this.getPerc(
            info.usedFreeBandwidth + info.usedPurchasedBandwidth,
            info.freeBandwidth + info.purchasedBandwidth
          ),
        },
        {
          label: "Build Minutes",
          icon: "buildtime.svg",
          id: ResourceType.BuildingTime,
          key: "buildMinutes",
          opts: [500, 1000, 1500],
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
        {
          label: "IPFS Storage",
          icon: "ipfs.svg",
          id: ResourceType.IPFSStorage,
          key: "ipfs",
          opts: [100 * Mb, 200 * Mb, 300 * Mb],
          monOpts: [1, 3, 6],
          unit: "GB",
          unitPrice: price.ipfsStorageUnitPrice || 0,
          expireTime: info.ipfsStorageExpired,
          ...this.getPerc(info.usedIpfsStorage, info.ipfsStorage),
        },
        {
          label: "Arweave",
          icon: "ar.svg",
          id: ResourceType.ARStorage,
          key: "ar",
          opts: [100 * Gb, 200 * Gb, 300 * Gb],
          unit: "GB",
          unitPrice: price.arStorageUnitPrice || 0,
          ...this.getPerc(info.usedArStorage, info.arStorage),
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
        usageInfo.purchasedBuildMinutes = parseInt(
          usageInfo.purchasedBuildMinutes
        );
        this.usageInfo = usageInfo;
        this.getCardTop();
        const { i } = this.$route.query;
        if (i > -1) {
          this.tabIdx = i * 1;
          this.onTab();
        }
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