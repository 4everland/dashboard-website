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
            v-for="(item, index) in desserts"
            :key="item.name"
            @click="handleClick(index)"
          >
            <td>{{ item.month }}</td>
            <td>{{ item.land }}</td>
            <td>{{ item.usdc }}</td>
          </tr>
        </tbody>
      </billing-table>

      <div class="pie-info ml-6">
        <BillingMonthlyPie :data="curData" />
      </div>
    </div>
  </div>
</template>

<script>
import BillingMonthlyPie from "../component/billing-monthly-pie.vue";
import BillingTable from "../component/billing-table.vue";
export default {
  components: {
    BillingMonthlyPie,
    BillingTable,
  },
  name: "billing-monthly-bill",
  data() {
    return {
      desserts: [
        {
          month: "2023-11",
          land: 159,
          usdc: "2221 U",
        },
        {
          month: "2023-10",
          land: 159,
          usdc: "2221 U",
        },
        {
          month: "2023-9",
          land: 159,
          usdc: "2221 U",
        },
        {
          month: "2023-11",
          land: 159,
          usdc: "2221 U",
        },
        {
          month: "2023-11",
          land: 159,
          usdc: "2221 U",
        },
        {
          month: "2023-11",
          land: 159,
          usdc: "2221 U",
        },
        {
          month: "2023-11",
          land: 159,
          usdc: "2221 U",
        },
        {
          month: "2023-11",
          land: 159,
          usdc: "2221 U",
        },
        {
          month: "2023-11",
          land: 159,
          usdc: "2221 U",
        },
        {
          month: "2023-11",
          land: 159,
          usdc: "2221 U",
        },
        {
          month: "2023-11",
          land: 159,
          usdc: "2221 U",
        },
      ],
      curIndex: 0,
    };
  },
  computed: {
    curData() {
      return this.desserts[this.curIndex];
    },
  },
  mounted() {
    console.log("billmonth");
  },
  methods: {
    handleClick(index) {
      this.curIndex = index;
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
