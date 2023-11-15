import {
  MumbaiUSDC,
  MumbaiUSDT,
  MumbaiDAI,
  MumbaiLandRecharge,
  GoerliUSDC,
  GoerliUSDT,
  GoerliDAI,
  GoerliLandRecharge,
  ChapelUSDC,
  ChapelUSDT,
  ChapelDAI,
  ChapelLandRecharge,
  ArbitrumUSDC,
  ArbitrumUSDT,
  ArbitrumDAI,
  ArbitrumLandRecharge,
  zkSyncUSDC,
  zkSyncLandRecharge,
} from "../../plugins/pay/contracts/contracts-addr";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      chainAddrs: [
        {
          name: "Polygon",
          coin: {
            usdc: MumbaiUSDC,
            usdt: MumbaiUSDT,
            dai: MumbaiDAI,
          },
          landRecharge: MumbaiLandRecharge,
          chainId: this.$inDev ? 80001 : 137,
        },
        {
          name: "Ethereum",
          coin: {
            usdc: GoerliUSDC,
            usdt: GoerliUSDT,
            dai: GoerliDAI,
          },
          landRecharge: GoerliLandRecharge,
          chainId: this.$inDev ? 11155111 : 1,
        },
        {
          name: "BSC",
          coin: {
            usdc: ChapelUSDC,
            usdt: ChapelUSDT,
            dai: ChapelDAI,
          },
          landRecharge: ChapelLandRecharge,
          chainId: this.$inDev ? 97 : 56,
        },
        {
          name: "Arbitrum",
          coin: {
            usdc: ArbitrumUSDC,
            usdt: ArbitrumUSDT,
            dai: ArbitrumDAI,
          },
          landRecharge: ArbitrumLandRecharge,
          chainId: this.$inDev ? 421613 : 42161,
        },
        {
          name: "zkSync",
          coin: {
            usdc: zkSyncUSDC,
          },
          landRecharge: zkSyncLandRecharge,
          chainId: this.$inDev ? 280 : 324,
        },
        {
          name: "everPay",
          coin: {
            usdc: "",
            usdt: "",
            dai: "",
          },
          landRecharge: "",
          chainId: 9999999,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["walletObj"]),
  },
  created() {
    // console.log(MumbaiUSDC);
  },
};
