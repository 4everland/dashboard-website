<template>
  <div class="billing-monthly-bill-container">
    <div class="d-flex">
      <billing-table class="flex-1">
        <thead>
          <tr>
            <th class="text-left">Months</th>
            <th class="text-left">LAND consumed</th>
            <th class="text-left">Equal to USDC</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) of list"
            :key="index"
            @click="handleClick(index)"
          >
            <td>{{ new Date(index * 1000).format("date") }}</td>
            <td>{{ $utils.formatLand(item.landConumed) }}</td>
            <td>{{ item.formatU }}</td>
          </tr>
        </tbody>
      </billing-table>

      <div class="pie-info ml-6" v-if="curData">
        <BillingMonthlyPie :curInfo="curData" />
      </div>
    </div>
  </div>
</template>

<script>
import { BigNumber } from "ethers";
import BillingMonthlyPie from "../component/billing-monthly-pie.vue";
import BillingTable from "../component/billing-table.vue";
import { formatUnits, parseEther } from "ethers/lib/utils";
export default {
  components: {
    BillingMonthlyPie,
    BillingTable,
  },
  name: "billing-monthly-bill",
  data() {
    return {
      curIndex: 0,
      list: {},
    };
  },
  computed: {
    curData() {
      return this.list[this.curIndex];
    },
  },
  created() {
    this.getList();
  },

  methods: {
    handleClick(index) {
      this.curIndex = index;
    },

    async getList() {
      try {
        const { data } = await this.$http.get(
          "$bill-analytics/bill/land-used/analytics",
          {
            params: {
              analyticsType: "MONTH",
              timestamp: +new Date("2023") / 1e3,
            },
          }
        );
        let obj = {};

        data.forEach((it) => {
          if (!Object.prototype.hasOwnProperty.call(obj, it.timestamp)) {
            obj[it.timestamp] = {
              info: [],
              landConumed: 0,
              formatU: 0,
              timestamp: 0,
            };
          }
          obj[it.timestamp].info.push(it);
          obj[it.timestamp].timestamp = it.timestamp;
        });
        for (const key in obj) {
          obj[key].landConumed = obj[key].info
            .reduce(
              (pre, it) => (pre = pre.add(BigNumber.from(it.landUsed))),
              BigNumber.from("0")
            )
            .toString();
          obj[key].formatU =
            formatUnits(parseEther(obj[key].landConumed), 24) + "U";
        }
        this.list = obj;

        console.log(this.list);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pie-info {
  width: 368px;
  height: 400px;
  display: flex;
  padding: 16px;
  margin-top: 80px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}
</style>
