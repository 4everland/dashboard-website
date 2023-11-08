<template>
  <div class="billing-recharge pos-r">
    <billing-table v-if="list.length">
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
        <tr v-for="(item, index) in list" :key="item.index">
          <td>{{ index }}</td>
          <td>{{ item.network }}</td>
          <td>{{ item.landAmount }}</td>
          <td>{{ item.amount }}</td>
          <td>
            <a target="__blank" :href="$getTxLink(item.txHash, item.network)">
              {{ item.txHash.cutStr(6, 6) }}
            </a>
          </td>
          <td>{{ new Date(item.createdAt * 1000).format("date") }}</td>
          <td>
            <span
              class="d-ib"
              style="width: 8px; height: 8px; border-radius: 50%"
              :style="{ background: '#0A9E71' }"
            ></span>
            <span class="ml-2" style="text-transform: capitalize">success</span>
          </td>
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
import { BigNumber } from "ethers";
import BillingTable from "../component/billing-table.vue";

export default {
  components: {
    BillingTable,
  },
  name: "billing-recharge",
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    this.getList();
  },

  methods: {
    async getList() {
      try {
        const { data } = await this.$http.get(
          "$bill-consume/assets/record/list",
          {
            params: {
              page: 0,
              size: 10,
            },
          }
        );

        console.log(data);

        this.list = data.items.map((it) => {
          it.amount = BigNumber.from(it.amount)
            .div((1e18).toString())
            .toString();

          it.landAmount = this.$utils.formatLand(it.landAmount);
          it.network = this.getChainType(it.network);
          return it;
        });
      } catch (error) {
        console.log(error);
      }
    },
    getChainType(id) {
      id *= 1;
      if ([137, 80001].includes(id)) return "Polygon";
      if ([56, 97].includes(id)) return "BSC";
      if ([42161].includes(id)) return "Arbitrum";
      if ([280, 324].includes(id)) return "zkSync";
      if ([9999999].includes(id)) return "everPay";
      if ([1, 5].includes(id)) return "Ethereum";
      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.billing-recharge {
  height: 77vh;
}
.no-date {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
