<template>
  <div class="billing-transction pos-r">
    <div style="width: 150px" class="mt-4">
      <e-date-pick
        outlined
        dense
        v-model="date"
        :isAllow="isAllow"
      ></e-date-pick>
    </div>
    <billing-table v-if="list.length">
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Date</th>
          <th class="text-left">Time(UTC)</th>
          <th class="text-left">Land</th>
          <th class="text-left">Item</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" :key="item.index">
          <td>{{ index + 1 }}</td>
          <td>{{ new Date(item.timestamp * 1e3).format("date-utc") }}</td>
          <td>{{ item.timeSection }}</td>
          <td>{{ item.landUsed }} LAND</td>
          <td>{{ item.msg }}</td>
        </tr>
      </tbody>
    </billing-table>
    <div class="pos-a no-date h-flex al-c" v-else>
      <img src="/img/svg/new-billing/no-date.svg" width="240" alt="" />
      <span class="mt-3 fz-14">No Data</span>
    </div>
  </div>
</template>

<script>
import eDatePick from "../../../views/hosting/statistics/e-date-pick.vue";
import BillingTable from "../component/billing-table.vue";

export default {
  components: {
    eDatePick,
    BillingTable,
  },
  name: "billing-transction",
  data() {
    return {
      list: [],
      date: null,
      start: "2023-11-26".toDate() * 1,
    };
  },
  methods: {
    async getHoursBill() {
      try {
        const { data } = await this.$http.get(
          "$bill-analytics/bill/land-used/analytics",
          {
            params: {
              analyticsType: "HOUR",
              timestamp: this.date,
            },
          }
        );
        data.forEach((it) => {
          const time = new Date(it.timestamp * 1e3).getUTCHours();
          const nextTime = new Date(it.timestamp * 1e3).getUTCHours() + 1;
          it.timeSection = time + ":00 - " + nextTime + ":00";
          const resourceTypeObj = {
            IPFS_STORAGE: "IPFS Storage",
            AR_STORAGE: "Arweave",
            BUILD_TIME: "Build Time",
            TRAFFIC: "Bandwidth",
            COMPUTE_UNIT: "RPC Request",
            AI_RPC: "AI RPC",
            RAAS: "RaaS",
          };

          let formatLand = this.$utils.formatLand(it.landUsed, true);
          it.landUsed =
            Number(formatLand.land) == 0
              ? "< 1"
              : formatLand.land + " " + formatLand.unit;

          if (it.resourceType == "BUILD_TIME") {
            it.resourceUsed = this.$utils.getResourceTypeSize(
              it.resourceUsed,
              false,
              "BUILD_TIME"
            );
            it.msg = resourceTypeObj[it.resourceType] + " " + it.resourceUsed;
          } else if (it.resourceType == "COMPUTE_UNIT") {
            it.resourceUsed = this.$utils.getNumCount(it.resourceUsed) + " CUs";
            it.msg = resourceTypeObj[it.resourceType] + " " + it.resourceUsed;
          } else if (it.resourceType == "AI_RPC") {
            // it.resourceUsed = this.$utils.getNumCount(it.resourceUsed) + " CUs";
            let formatLand = this.$utils.formatLand(
              it.resourceUsed,
              true,
              false
            );
            it.resourceUsed =
              Number(formatLand.land) == 0
                ? "< 1 LAND"
                : formatLand.land + " " + formatLand.unit + " LAND";
            it.msg = resourceTypeObj[it.resourceType] + " " + it.resourceUsed;
          } else if (
            it.resourceType == "IPFS_STORAGE" ||
            it.resourceType == "AR_STORAGE" ||
            it.resourceType == "TRAFFIC"
          ) {
            it.resourceUsed = this.$utils.getFileSize(it.resourceUsed);
            it.msg = resourceTypeObj[it.resourceType] + " " + it.resourceUsed;
          } else {
            it.msg = resourceTypeObj[it.resourceType] + ":" + it.message;
            it.timeSection = new Date(it.timestamp).toLocaleTimeString();
          }
          it.resourceType = resourceTypeObj[it.resourceType];
        });

        this.list = data.sort((a, b) => b.timestamp - a.timestamp);
      } catch (error) {
        console.log(error);
      }
    },
    isAllow(val) {
      const date = val.toDate();
      return date < new Date() && date > this.start;
    },
  },
  watch: {
    date() {
      this.getHoursBill();
    },
  },
};
</script>

<style lang="scss" scoped>
.billing-transction {
  min-height: 77vh;
}
.no-date {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
