<template>
  <div>
    <div style="width: 150px" class="mt-4">
      <e-date-pick outlined dense></e-date-pick>
    </div>
    <billing-table>
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
        <tr v-for="(item, index) in desserts" :key="item.index">
          <td>{{ index }}</td>
          <td>{{ item.chain }}</td>
          <td>{{ item.landAmount }}</td>
          <td>{{ item.amout }}</td>
          <td>{{ item.txHash }}</td>
          <td>{{ item.createAt }}</td>
        </tr>
      </tbody>
    </billing-table>
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
      desserts: [
        {
          name: "Frozen Yogurt",
          chain: "Ethereum",
          landAmount: "223,223,221,322",
          amout: "200USDC",
          txHash: "abc112mxznnaklqlsa122",
          createAt: "Apr 20 2023 14:15:03",
        },
        {
          name: "Frozen Yogurt",
          chain: "Ethereum",
          landAmount: "223,223,221,322",
          amout: "200USDC",
          txHash: "abc112mxznnaklqlsa122",
          createAt: "Apr 20 2023 14:15:03",
        },
        {
          name: "Frozen Yogurt",
          chain: "Ethereum",
          landAmount: "223,223,221,322",
          amout: "200USDC",
          txHash: "abc112mxznnaklqlsa122",
          createAt: "Apr 20 2023 14:15:03",
        },
        {
          name: "Frozen Yogurt",
          chain: "Ethereum",
          landAmount: "223,223,221,322",
          amout: "200USDC",
          txHash: "abc112mxznnaklqlsa122",
          createAt: "Apr 20 2023 14:15:03",
        },
        {
          name: "Frozen Yogurt",
          chain: "Ethereum",
          landAmount: "223,223,221,322",
          amout: "200USDC",
          txHash: "abc112mxznnaklqlsa122",
          createAt: "Apr 20 2023 14:15:03",
        },
        {
          name: "Frozen Yogurt",
          chain: "Ethereum",
          landAmount: "223,223,221,322",
          amout: "200USDC",
          txHash: "abc112mxznnaklqlsa122",
          createAt: "Apr 20 2023 14:15:03",
        },
        {
          name: "Frozen Yogurt",
          chain: "Ethereum",
          landAmount: "223,223,221,322",
          amout: "200USDC",
          txHash: "abc112mxznnaklqlsa122",
          createAt: "Apr 20 2023 14:15:03",
        },
        {
          name: "Frozen Yogurt",
          chain: "Ethereum",
          landAmount: "223,223,221,322",
          amout: "200USDC",
          txHash: "abc112mxznnaklqlsa122",
          createAt: "Apr 20 2023 14:15:03",
        },
        {
          name: "Frozen Yogurt",
          chain: "Ethereum",
          landAmount: "223,223,221,322",
          amout: "200USDC",
          txHash: "abc112mxznnaklqlsa122",
          createAt: "Apr 20 2023 14:15:03",
        },
        {
          name: "Frozen Yogurt",
          chain: "Ethereum",
          landAmount: "223,223,221,322",
          amout: "200USDC",
          txHash: "abc112mxznnaklqlsa122",
          createAt: "Apr 20 2023 14:15:03",
        },
      ],
    };
  },
  mounted() {
    console.log("transction");
  },
};
</script>

<style lang="scss" scoped></style>
