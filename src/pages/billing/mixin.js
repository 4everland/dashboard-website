import {
  MumbaiUSDC,
  MumbaiUSDCE,
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
  zkSyncUSDT,
  zkSyncDAI,
  zkSyncLandRecharge,
  optimisUSDC,
  optimisUSDT,
  optimisDAI,
  optimisETH,
  optimismRecharge,
  scrollUSDC,
  scrollUSDT,
  scrollDAI,
  scrollETH,
  scrollRecharge,
  blastRecharge,
  opBNBRecharge,
  taikoRecharge,
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
            usdce: MumbaiUSDCE,
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
            eth: "",
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
            bnb: "",
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
            usdt: zkSyncUSDT,
            dai: zkSyncDAI,
          },
          landRecharge: zkSyncLandRecharge,
          chainId: this.$inDev ? 280 : 324,
        },
        {
          name: "Optimism",
          coin: {
            usdc: optimisUSDC,
            usdt: optimisUSDT,
            dai: optimisDAI,
            eth: optimisETH,
          },
          landRecharge: optimismRecharge,
          chainId: 10,
        },
        {
          name: "Scroll",
          coin: {
            usdc: scrollUSDC,
            usdt: scrollUSDT,
            dai: scrollDAI,
            eth: scrollETH,
          },
          landRecharge: scrollRecharge,
          chainId: 534352,
        },
        {
          name: "Blast",
          coin: {
            eth: "",
          },
          landRecharge: blastRecharge,
          chainId: 81457,
        },
        {
          name: "Taiko",
          coin: {
            eth: "",
          },
          landRecharge: taikoRecharge,
          chainId: 167000,
        },
        {
          name: "opBNB",
          coin: {
            bnb: "",
          },
          landRecharge: opBNBRecharge,
          chainId: this.$inDev ? 5611 : 204,
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
        {
          name: "ZksyncLite",
          coin: {
            eth: "",
          },
          landRecharge: "0xE663E0E3f9b034E9911d4746760efE00115D11E5",
          chainId: 1,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["walletObj"]),
  },
};
