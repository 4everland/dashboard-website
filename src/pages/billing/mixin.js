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
        },
        {
          name: "Ethereum",
          coin: {
            usdc: GoerliUSDC,
            usdt: GoerliUSDT,
            dai: GoerliDAI,
          },
          landRecharge: GoerliLandRecharge,
        },
        {
          name: "BSC",
          coin: {
            usdc: ChapelUSDC,
            usdt: ChapelUSDT,
            dai: ChapelDAI,
          },
          landRecharge: ChapelLandRecharge,
        },
        {
          name: "Arbitrum",
          coin: {
            usdc: ArbitrumUSDC,
            usdt: ArbitrumUSDT,
            dai: ArbitrumDAI,
          },
          landRecharge: ArbitrumLandRecharge,
        },
        {
          name: "zkSync",
          coin: {
            usdc: zkSyncUSDC,
          },
          landRecharge: zkSyncLandRecharge,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["walletObj"]),
  },
  created() {
    console.log(MumbaiUSDC);
  },
};
