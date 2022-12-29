export default {
  data() {
    return {
      usageInfo: null,
    };
  },
  computed: {
    typeList() {
      const info = this.usageInfo;
      const getSize = this.$utils.getFileSize;
      if (!info) return [];
      return [
        {
          label: "Bandwidth",
          name: "TRAFFIC",
          // Free resources 100GB per month, of which 5GB used, 0GB purchased
          desc: `Free resources ${
            getSize(info.freeBandwidth) || "100GB"
          } per month, ${getSize(info.purchasedBandwidth) || "0GB"} purchased.`,
          ...this.getPercBy("band"),
        },
        {
          label: "Build Minutes",
          name: "BUILD_TIME",
          desc: `Free resources ${
            info.freeBuildMinutes || 250
          } Minutes per month,  ${
            info.purchasedBuildMinutes || 0
          } Minutes purchased.`,
          ...this.getPercBy("time"),
        },
        {
          label: "IPFS Storage",
          name: "IPFS_STORAGE",
          expired: info.ipfsStorageExpired
            ? `${new Date(info.ipfsStorageExpired * 1000).format("date")}`
            : null,
          // ${new Date(info.ipfsStorageStart * 1e3).format("date")} -
          desc: info.ipfsStorage
            ? `Free resources ${getSize(info.ipfsDefaultStorage)} a year, ${
                getSize(info.ipfsStorage - info.ipfsDefaultStorage) || "0G"
              } purchased.`
            : "",
          ...this.getPercBy("ipfs"),
          descTip:
            "When the service expires, we will keep the stored content for up to 7 days.",
        },
        {
          label: "Arweave Storage",
          name: "AR_STORAGE",
          tip: "Arweave is a permanent storage service.",
          desc: `Free resources ${getSize(info.arDefaultStorage)}, ${
            getSize(info.arStorage - info.arDefaultStorage) || "0GB"
          } purchased.`,
          ...this.getPercBy("ar"),
        },
      ];
    },
  },
  methods: {
    getPercBy(name) {
      return {
        ...this.getPercByName(name),
        name,
      };
    },
    getPercByName(name) {
      const info = this.usageInfo;
      if (name == "band") {
        return this.getPerc(
          info.usedFreeBandwidth + info.usedPurchasedBandwidth,
          info.freeBandwidth + info.purchasedBandwidth
        );
      } else if (name == "ipfs") {
        return this.getPerc(info.usedIpfsStorage, info.ipfsStorage);
      } else if (name == "ar") {
        return this.getPerc(info.usedArStorage, info.arStorage);
      } else if (name == "time") {
        return this.getPerc(
          parseInt(info.usedFreeBuildMinutes + info.usedPurchasedBuildMinutes),
          info.freeBuildMinutes + info.purchasedBuildMinutes,
          "Minutes"
        );
      }
    },
    getPerc(used, total, unit = "GB") {
      const getSize = this.$utils.getFileSize;
      if (!total)
        return {
          perc: 0,
          percTxt: "0",
          unit: "GB",
        };
      let percTxt = "";
      let usedTxt = "";
      if (unit == "GB") {
        const usedObj = getSize(used, true);
        const totalObj = getSize(total, true);
        usedTxt = usedObj.num + " " + usedObj.unit;
        let childUnit = usedObj.unit;
        // if (usedObj.unit == totalObj.unit) childUnit = "";
        percTxt = `${usedObj.num} ${childUnit} / ${totalObj.num} ${totalObj.unit}`;
      } else {
        usedTxt = used + " Min";
        percTxt = `${used} Min / ${total} Min`;
      }
      let tip = "";
      let over = used - total;
      if (over > 0) {
        if (unit == "GB") over = getSize(over);
        else over += " " + unit;
        tip = `(Recharge used ${over})`;
      }
      let perc = (used * 100) / total;
      perc = this.$utils.cutFixed(perc, 2); //Math.max(perc > 0 ? 0.5 : 0.2, perc);
      return {
        perc,
        color: perc < 80 ? "#775DA6" : "#df4f4f",
        percTxt,
        usedTxt,
        unit,
        rechargeTip: tip,
      };
    },
    async getUsage() {
      try {
        const { data } = await this.$http.get(`$v3/usage`);
        data.purchasedBuildMinutes = parseInt(data.purchasedBuildMinutes);
        this.usageInfo = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
