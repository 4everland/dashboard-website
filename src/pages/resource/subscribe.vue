<template>
  <div>
    <v-tabs v-model="tabIdx">
      <v-tab v-for="(it, i) in list" :key="i">{{ it.label }}</v-tab>
    </v-tabs>
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
  mixins: [mixin],
  data() {
    return {
      tabIdx: 0,
      priceInfo: {},
      usageInfo: null,
      form: {},
    };
  },
  computed: {
    list() {
      const info = this.priceInfo;
      return [
        {
          label: "Bandwidth",
          id: ResourceType.Bandwidth,
          desc: "（Need to enter an integer multiple of 100.）",
          key: "bandwidth",
          unit: "GB",
          unitPrice: info.trafficUnitPrice || 0,
        },
        {
          label: "IPFS",
          id: ResourceType.IPFSStorage,
          key: "ipfs",
          unit: "GB / Mon",
          unitPrice: info.ipfsStorageUnitPrice || 0,
        },
        {
          label: "Arweave",
          id: ResourceType.ARStorage,
          key: "ar",
          unit: "MB",
          unitPrice: info.arStorageUnitPrice || 0,
        },
        {
          label: "Build Minutes",
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
  },
};
</script>