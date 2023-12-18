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
} from "../../plugins/pay/contracts/contracts-addr";
import { mapGetters } from "vuex";
import { IQuoter__factory, UNILand__factory } from "@4everland-contracts";
import { providers } from "ethers";
import {
  solidityPack,
  parseUnits,
  formatEther,
  parseEther,
} from "ethers/lib/utils";
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
    opLandRecharge() {
      const addr = "0x3cA298d7A98262C0598dd91Ce926f23e51c4b293";
      const provider = new providers.Web3Provider(this.walletObj);
      return UNILand__factory.connect(addr, provider);
    },
  },
  methods: {
    async handleOpLandRecharge() {
      const tx = await this.opLandRecharge.mintByETH(this.euid, {
        value: parseEther("0.2"),
      });
      const receipt = await tx.wait();
      console.log(receipt);
    },
    async usdc2eth() {
      const provider = new providers.Web3Provider(this.walletObj);
      const quoter = IQuoter__factory.connect(
        "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
        provider.getSigner()
      );
      const path = solidityPack(
        ["address", "uint24", "address"],
        [
          "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", // usdc addr
          500, //
          optimisETH,
        ]
      );
      const res = await quoter.callStatic.quoteExactOutput(
        path,
        parseUnits("2000", 6)
      );
      console.log("res", res);
      // mul(1001).div(1000);
      console.log(formatEther(res));
    },
  },
};
