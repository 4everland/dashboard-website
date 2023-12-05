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
          <td>{{ index + 1 }}</td>
          <td>{{ item.network }}</td>
          <td>{{ item.landAmount }}</td>
          <td>{{ item.amount }} {{ item.coinType }}</td>
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
              :style="{ background: item.status == 1 ? '#0A9E71' : '#f99536' }"
            ></span>
            <span class="ml-2" style="text-transform: capitalize">{{
              item.status == 1 ? "success" : "pending"
            }}</span>
          </td>
        </tr>
      </tbody>
    </billing-table>
    <div class="pos-a no-date h-flex al-c" v-else>
      <img src="/img/svg/new-billing/no-date.svg" width="240" alt="" />
      <span class="mt-3 fz-14">No Data</span>
    </div>

    <bottom-detector
      v-if="list.length"
      @arriveBottom="loadMore"
      :loadingMore="loadingMore"
      :noMore="finished"
    ></bottom-detector>
  </div>
</template>

<script>
import { BigNumber } from "ethers";
import BillingTable from "../component/billing-table.vue";
import {
  MumbaiUSDC,
  MumbaiUSDCE,
  MumbaiUSDT,
  MumbaiDAI,
  GoerliUSDC,
  GoerliUSDT,
  GoerliDAI,
  ChapelUSDC,
  ChapelUSDT,
  ChapelDAI,
  ArbitrumUSDC,
  ArbitrumUSDT,
  ArbitrumDAI,
  zkSyncUSDC,
  zkSyncUSDT,
  zkSyncDAI,
} from "@/plugins/pay/contracts/contracts-addr";
import { formatEther } from "ethers/lib/utils";

const everPayDAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
const everPayUSDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const everPayUSDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
export default {
  components: {
    BillingTable,
  },
  name: "billing-recharge",
  data() {
    return {
      list: [],
      coinInfo: {
        USDC: [
          MumbaiUSDC,
          GoerliUSDC,
          ChapelUSDC,
          ArbitrumUSDC,
          zkSyncUSDC,
          everPayUSDC,
        ],
        USDCE: [MumbaiUSDCE],
        USDT: [
          MumbaiUSDT,
          GoerliUSDT,
          ChapelUSDT,
          ArbitrumUSDT,
          zkSyncUSDT,
          everPayUSDT,
        ],
        DAI: [
          MumbaiDAI,
          GoerliDAI,
          ChapelDAI,
          ArbitrumDAI,
          zkSyncDAI,
          everPayDAI,
        ],
      },
      finished: false,
      loadingMore: false,
      page: 1,
      size: 20,
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
              page: this.page++,
              size: this.size,
            },
          }
        );
        console.log(data);
        const originMergeTransaction = this.transactionCacheMatch(data.items);

        let list = originMergeTransaction.map((it) => {
          it.amount = Number(formatEther(BigNumber.from(it.amount))).toFixed(2);

          it.landAmount = this.$utils.formatLand(it.landAmount);
          it.network = this.getChainType(it.network);
          let coinType = "USDC";
          for (const key in this.coinInfo) {
            let findCoinAddr = this.coinInfo[key].find(
              (item) => item == it.amountType
            );
            if (findCoinAddr) coinType = key;
          }

          if (coinType == "USDCE") {
            coinType = "USDC.e";
          }
          it.coinType = coinType;
          return it;
        });
        if (list.length < this.size) {
          this.finished = true;
        }
        this.list = [...this.list, ...list];
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async loadMore() {
      this.loadingMore = true;
      try {
        await this.getList();
      } catch (error) {
        console.log(error);
      }
      this.loadingMore = false;
    },
    getChainType(id) {
      id *= 1;
      if ([137, 80001].includes(id)) return "Polygon";
      if ([56, 97].includes(id)) return "BSC";
      if ([42161].includes(id)) return "Arbitrum";
      if ([280, 324].includes(id)) return "zkSync";
      if ([9999999].includes(id)) return "everPay";
      if ([1, 11155111].includes(id)) return "Ethereum";
      if ([99999991].includes(id))
        return "Redeem Historical Remaining Resources";
      if ([99999992].includes(id)) return " ";
      return "";
    },

    transactionCacheMatch(originList) {
      if (!localStorage.getItem("transactionCache")) return originList;
      let cacheList = JSON.parse(localStorage.getItem("transactionCache"));
      let ltTenMinsTransactionList = cacheList.filter((it) => {
        let timestamp = +new Date() / 1e3;
        return (
          timestamp > Number(it.createdAt) &&
          timestamp <= Number(it.createdAt) + 60 * 10
        );
      });

      const unRecordList = ltTenMinsTransactionList.filter((item) => {
        let i = originList.findIndex((it) => it.txHash == item.txHash);
        return i == -1;
      });

      localStorage.setItem("transactionCache", JSON.stringify(unRecordList));
      return [...unRecordList, ...originList];
    },
  },
};
</script>

<style lang="scss" scoped>
.billing-recharge {
  min-height: 77vh;
  // overflow-y: scroll;
}
.no-date {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.text-left {
  color: red;
}
</style>
