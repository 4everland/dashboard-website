<template>
  <div class="billing-monthly-bill-container pos-r">
    <div style="width: 100px" class="mb-6">
      <v-select
        class="hide-msg bd-1"
        dense
        solo
        :items="items"
        v-model="curYear"
        @change="getList"
      />
    </div>
    <div
      class="billing-monthly-bill-content d-flex flex-column-reverse flex-md-row"
      v-if="list.length"
    >
      <billing-table class="flex-1">
        <thead>
          <tr>
            <th class="text-left">Months</th>
            <th class="text-left">LAND consumed</th>
            <th class="text-left">Equal to USD</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in list"
            :key="index"
            @click="handleClick(index)"
            :class="{ active: index == curIndex }"
          >
            <td>{{ new Date(item.timestamp * 1000).format("yy-MM") }}</td>
            <td>{{ $utils.formatLand(item.landConumed) }}</td>
            <td>{{ item.formatU }}</td>
          </tr>
        </tbody>
      </billing-table>

      <div class="pie-info" v-if="curData">
        <BillingMonthlyPie :curInfo="curData" />
      </div>
    </div>
    <div class="pos-a no-date h-flex al-c" v-else>
      <img src="/img/svg/new-billing/no-date.svg" width="240" alt="" />
      <span class="mt-3 fz-14">No Data</span>
    </div>
  </div>
</template>

<script>
import { BigNumber } from "ethers";
import BillingMonthlyPie from "../component/billing-monthly-pie.vue";
import BillingTable from "../component/billing-table.vue";
import { formatUnits } from "ethers/lib/utils";
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
      curYear: new Date().getFullYear().toString(),
    };
  },
  computed: {
    curData() {
      return this.list[this.curIndex];
    },
    items() {
      return Array.from(
        { length: new Date().getFullYear() - 2022 },
        (_, i) => ({
          text: (2023 + i).toString(),
          value: (2023 + i).toString(),
        })
      );
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
              timestamp: +new Date(this.curYear) / 1e3,
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
            Number(
              formatUnits(BigNumber.from(obj[key].landConumed), 24)
            ).toFixed(2) + "U";
        }
        this.list = Object.values(obj).reverse();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.billing-monthly-bill-container {
  min-height: 77vh;
  margin-top: 24px;
}
.no-date {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.billing-monthly-bill-content {
  gap: 24px;
  flex-direction: row-reverse;
}

@media screen and (max-width: 960px) {
  .pie-info {
    width: 100% !important;
  }
}
.pie-info {
  width: 368px;
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}
</style>
