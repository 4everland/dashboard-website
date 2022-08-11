<style lang="scss">
.e-tabs-2 {
  .v-tabs-slider-wrapper {
    padding: 0 15px;
  }
}
</style>

<template>
  <div>
    <div class="pos-s z-1" style="top: 60px">
      <v-tabs v-model="tabIdx" class="bdrs-6 shadow-2 e-tabs-2">
        <v-tab v-for="(it, i) in list" :key="i">{{ it.label }}</v-tab>
      </v-tabs>
    </div>
    <v-card class="mt-5 shadow-2" v-for="(it, i) in list" :key="i">
      <div class="pa-5">
        <div class="al-c">
          <img :src="`/img/svg/overview/${it.icon}`" width="16" />
          <span class="ml-3 fz-15">{{ it.label }}</span>
        </div>
      </div>
    </v-card>
    <div class="pa-3 mt-3 gray fz-14">
      <p>Tips：</p>
      <p>
        1. Please Note: The price calculator provides a reference price, but the
        specific deduction depends on the order result.
      </p>
      <p>
        2. In pay-per-use billing mode, the amount shown in the price calculator
        is rounded to two decimal places if any, and the third place is rounded
        off. If the rounded amount is less than 0.01USD, it will be displayed as
        0.01USD.
      </p>
    </div>
    <div
      class="mt-2 pos-s btm-0 pa-4 bdrs-6 shadow-2"
      style="background: #fff5eb"
    >
      <div class="al-c">
        <span class="fz-14 gray-6">Configuration costs</span>
        <usage-preview :previewList="previewList" :list="list" />
      </div>
    </div>
  </div>
</template>

<script>
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
      usageInfo: {},
      form: {},
      feeForm: {},
    };
  },
  computed: {
    list() {
      const info = this.priceInfo;
      return [
        {
          label: "Bandwidth",
          icon: "bandwidth.svg",
          id: ResourceType.Bandwidth,
          desc: "（Need to enter an integer multiple of 100.）",
          key: "bandwidth",
          unit: "GB",
          unitPrice: info.trafficUnitPrice || 0,
        },
        {
          label: "IPFS",
          icon: "ipfs.svg",
          id: ResourceType.IPFSStorage,
          key: "ipfs",
          unit: "GB / Mon",
          unitPrice: info.ipfsStorageUnitPrice || 0,
        },
        {
          label: "Arweave",
          icon: "ar.svg",
          id: ResourceType.ARStorage,
          key: "ar",
          unit: "MB",
          unitPrice: info.arStorageUnitPrice || 0,
        },
        {
          label: "Build Minutes",
          icon: "buildtime.svg",
          id: ResourceType.BuildingTime,
          key: "buildMinutes",
          unit: "Min",
          unitPrice: info.buildTimeUnitPrice || 0,
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
  mounted() {
    const form = {};
    this.list.forEach((it) => {
      form[it.key] = 0;
    });
    this.form = form;
    this.getInfo();
  },
  methods: {
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