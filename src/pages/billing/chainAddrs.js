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
  optimismRecharge,
  scrollUSDC,
  scrollUSDT,
  scrollDAI,
  scrollETH,
  scrollRecharge,
} from "../plugins/pay/contracts/contracts-addr";
import Vue from "vue";
export const chainAddrs = [
  {
    name: "Polygon",
    coin: {
      usdc: {
        name: "USDC",
        addr: MumbaiUSDC,
      },
      usdt: {
        name: "USDT",
        addr: MumbaiUSDT,
      },
      dai: {
        name: "DAI",
        addr: MumbaiDAI,
      },
      usdce: {
        name: "USDC.e",
        addr: MumbaiUSDCE,
      },
    },
    landRecharge: MumbaiLandRecharge,
    chainId: Vue.prototype.$inDev ? 80001 : 137,
  },
  {
    name: "Ethereum",
    coin: {
      usdc: {
        name: "USDC",
        addr: GoerliUSDC,
      },
      usdt: {
        name: "USDT",
        addr: GoerliUSDT,
      },
      dai: {
        name: "DAI",
        addr: GoerliDAI,
      },
    },
    landRecharge: GoerliLandRecharge,
    chainId: Vue.prototype.$inDev ? 11155111 : 1,
  },
  {
    name: "BSC",
    coin: {
      usdc: {
        name: "USDC",
        addr: ChapelUSDC,
      },
      usdt: {
        name: "USDT",
        addr: ChapelUSDT,
      },
      dai: {
        name: "DAI",
        addr: ChapelDAI,
      },
    },
    landRecharge: ChapelLandRecharge,
    chainId: Vue.prototype.$inDev ? 97 : 56,
  },
  {
    name: "Arbitrum",
    coin: {
      usdc: {
        name: "USDC",
        addr: ArbitrumUSDC,
      },
      usdt: {
        name: "USDT",
        addr: ArbitrumUSDT,
      },
      dai: {
        name: "DAI",
        addr: ArbitrumDAI,
      },
    },
    landRecharge: ArbitrumLandRecharge,
    chainId: Vue.prototype.$inDev ? 421613 : 42161,
  },
  {
    name: "zkSync",
    coin: {
      usdc: {
        name: "USDC",
        addr: zkSyncUSDC,
      },
      usdt: {
        name: "USDT",
        addr: zkSyncUSDT,
      },
      dai: {
        name: "DAI",
        addr: zkSyncDAI,
      },
    },
    landRecharge: zkSyncLandRecharge,
    chainId: Vue.prototype.$inDev ? 280 : 324,
  },
  {
    name: "Optimism",
    coin: {
      usdc: {
        name: "USDC",
        addr: optimisUSDC,
      },
      usdt: {
        name: "USDT",
        addr: optimisUSDT,
      },
      dai: {
        name: "DAI",
        addr: optimisDAI,
      },
      eth: {
        name: "ETH",
        addr: Vue.prototype.$inDev ? "" : "",
      },
    },
    landRecharge: optimismRecharge,
    chainId: 10,
  },
  {
    name: "Scroll",
    coin: {
      usdc: {
        name: "USDC",
        addr: scrollUSDC,
      },
      usdt: {
        name: "USDT",
        addr: scrollUSDT,
      },
      dai: {
        name: "DAI",
        addr: scrollDAI,
      },
      eth: {
        name: "ETH",
        addr: scrollETH,
      },
    },
    landRecharge: scrollRecharge,
    chainId: 534352,
  },
  // {
  //   name: "everPay",
  //   coin: {
  //     usdc: "",
  //     usdt: "",
  //     dai: "",
  //   },
  //   landRecharge: "",
  //   chainId: 9999999,
  // },
];
