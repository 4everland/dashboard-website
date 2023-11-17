<template>
  <div class="billing-transction pos-r">
    <div style="width: 150px" class="mt-4">
      <e-date-pick outlined dense v-model="date"></e-date-pick>
    </div>
    <billing-table v-if="list.length">
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Date</th>
          <th class="text-left">Time</th>
          <th class="text-left">Land</th>
          <th class="text-left">Type</th>
          <th class="text-left">Resources consumed</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" :key="item.index">
          <td>{{ index }}</td>
          <td>{{ new Date(item.timestamp * 1e3).format("date") }}</td>
          <td>{{ item.timeSection }}</td>
          <td>{{ $utils.formatLand(item.landUsed) }} LAND</td>
          <td>{{ item.resourceType }}</td>
          <td>{{ $utils.getFileSize(item.resourceUsed) }}</td>
        </tr>
      </tbody>
    </billing-table>
    <div class="pos-a no-date h-flex al-c" v-else>
      <img src="/img/svg/new-billing/no-date.svg" width="240" alt="" />
      <span class="mt-3 fz-14">no-data</span>
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
    };
  },
  mounted() {
    console.log("transction");
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
          const time = new Date(it.timestamp * 1e3).getHours();
          const preTime = new Date(it.timestamp * 1e3).getHours() - 1;
          it.timeSection = preTime + ":00 - " + time + ":00";
          const resourceTypeObj = {
            IPFS_STORAGE: "IPFS Storage",
            AR_STORAGE: "Arweave",
            BUILE_TIME: "Build Time",
            TRAFFIC: "Bandwidth",
            COMPUTE_UNIT: "RPC Request",
          };

          it.resourceType = resourceTypeObj[it.resourceType];
        });

        this.list = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    date() {
      console.log(222, this.date);
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
