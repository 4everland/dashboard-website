<template>
  <div>
    <billing-table>
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Network</th>
          <th class="text-left">LAND Amount</th>
          <th class="text-left">Amount</th>
          <th class="text-left">Tx Hash</th>
          <th class="text-left">CreateAt</th>
          <th class="text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in desserts" :key="item.index">
          <td>{{ index }}</td>
          <td>{{ item.chain }}</td>
          <td>{{ item.landAmount }}</td>
          <td>{{ item.amout }}</td>
          <td>
            <a href="#">
              {{ item.txHash.cutStr(6, 6) }}
            </a>
          </td>
          <td>{{ item.createAt }}</td>
          <td>
            <span
              class="d-ib"
              style="width: 8px; height: 8px; border-radius: 50%"
              :style="{ background: 'red' }"
            ></span>
            <span class="ml-2" style="text-transform: capitalize">success</span>
          </td>
        </tr>
      </tbody>
    </billing-table>
  </div>
</template>

<script>
import BillingTable from "../component/billing-table.vue";

export default {
  components: {
    BillingTable,
  },
  name: "billing-recharge",
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
    this.getList();
  },

  methods: {
    async getList() {
      try {
        const { data } = await this.$http.get("$bill/assets/record/list");
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
