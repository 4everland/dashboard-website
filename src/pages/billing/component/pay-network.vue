<template>
  <div>
    <div class="d-flex flex-wrap space-btw">
      <div
        @click="onSelect(it.chainId)"
        class="network-label py-3 al-c cursor-p justify-center d-flex mt-4"
        :class="{
          active: selected == it.chainId,
        }"
        v-for="(it, i) in chainList"
        :key="i"
      >
        <v-icon size="16" :color="selected == it.chainId ? $color1 : '#555'"
          >mdi-{{
            selected == it.chainId
              ? "circle-slice-8"
              : "checkbox-blank-circle-outline"
          }}</v-icon
        >
        <img
          class="ml-3"
          style="vertical-align: middle"
          :src="it.img"
          height="20"
        />

        <span
          class="ml-2"
          style="width: 90px"
          :class="{
            'color-1': selected == it.chainId,
          }"
          >{{ it.name }}</span
        >
      </div>
    </div>
    <ever-pay ref="everPay" v-if="selected == 'everPay'"></ever-pay>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import everPay from "../../../views/pay/ever-pay.vue";

export default {
  components: {
    everPay,
  },
  props: {
    allow: Array,
  },
  computed: {
    ...mapGetters(["walletObj"]),
    chainList() {
      const list = [
        {
          label: "Polygon",
          name: "Polygon",
          img: "/img/svg/billing/ic-polygon-0.svg",
          chainId: this.$inDev ? 80001 : 137,
        },
        // {
        //   label: "Ethereum",
        //   name: "Ethereum",
        //   img: "/img/svg/billing/ic-ethereum.svg",
        //   chainId: this.$inDev ? 11155111 : 1,
        // },
        {
          label: "BSC",
          name: "BSC",
          img: "/img/svg/billing/ic-bsc.png",
          chainId: this.$inDev ? 97 : 56,
        },
        {
          label: "Arbitrum",
          name: "Arbitrum",
          img: "/img/svg/billing/ic-arbitrum.png",
          chainId: this.$inDev ? 421613 : 42161,
        },
        {
          label: "zkSync",
          name: "zkSync Era",
          img: "/img/svg/logo-no-letters.svg",
          chainId: this.$inDev ? 280 : 324,
        },
        {
          label: "Optimism",
          name: "Optimism",
          img: "/img/svg/billing/ic-optimism.svg",
          chainId: 10,
        },
        // {
        //   label: "everPay",
        //   name: "everPay",
        //   img: "/img/svg/billing/ic-everpay.svg",
        //   chainId: 9999999,
        // },
      ];
      if (!this.allow) return list;
      return list.filter((it) => this.allow.includes(it.label));
    },
  },
  data() {
    return {
      selected: "",
    };
  },
  created() {
    this.walletObj.on("chainChanged", this.initSeleted);
    this.initSeleted();
  },
  beforeDestroy() {
    this.walletObj.removeListener("accountsChanged", this.initSeleted);
  },
  methods: {
    initSeleted() {
      if (localStorage.isEverpay) {
        this.selected = 9999999;
      } else {
        this.selected = parseInt(this.walletObj.chainId);
      }
      this.$emit("onNetwork", this.selected);
    },
    async onSelect(chainId) {
      try {
        if (this.selected == chainId) return;
        this.selected = chainId;
        if (chainId == 9999999) {
          localStorage.setItem("isEverpay", 1);
        } else {
          localStorage.removeItem("isEverpay");
          await this.switchNet(chainId);
        }
        this.$emit("onNetwork", this.selected);
      } catch (error) {
        // user cancel
        console.log(error, "==================");
        this.initSeleted();
      }
    },

    async switchNet(id) {
      console.log(window.ethereum);
      const chainId = "0x" + id.toString(16);
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
      } catch (error) {
        console.log("switch error 2", error);
        if (error.code == 4902 || error.data?.originalError.code == 4902) {
          await this.addChain(chainId, id);
        } else {
          throw new Error(error.message);
        }
      }
    },
    async addChain(chainId, id) {
      let params = {
        137: {
          chainId,
          chainName: "Polygon Mainnet",
          rpcUrls: [
            "https://polygon.llamarpc.com",
            // "https://polygon-rpc.com",
          ],
          nativeCurrency: {
            name: "Polygon Coin",
            symbol: "MATIC",
            decimals: 18,
          },
          blockExplorerUrls: ["https://polygonscan.com"],
        },
        11155111: {
          chainId,
          chainName: "Spolia",
          rpcUrls: ["https://eth-sepolia.public.blastapi.io"],
          nativeCurrency: {
            name: "Sepolia-ETH",
            symbol: "SepoliaETH",
            decimals: 18,
          },
          // blockExplorerUrls: ["https://goerli.etherscan.io/"],
        },
        56: {
          chainId,
          chainName: "BSC Mainnet",
          rpcUrls: ["https://rpc.ankr.com/bsc"],
          nativeCurrency: {
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18,
          },
          blockExplorerUrls: ["https://bscscan.com"],
        },
        80001: {
          chainId,
          chainName: "polygon mumbai",
          rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
          nativeCurrency: {
            name: "matic Coin",
            symbol: "MATIC",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        97: {
          chainId,
          chainName: "BSC Chapel",
          rpcUrls: ["https://bsc-testnet.public.blastapi.io"],
          nativeCurrency: {
            name: "BNB Coin",
            symbol: "tBNB",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },

        421613: {
          chainId,
          chainName: "Arbitrum Goerli",
          rpcUrls: ["https://endpoints.omniatech.io/v1/arbitrum/goerli/public"],
          nativeCurrency: {
            name: "Arbitrum Coin",
            symbol: "AGOR",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        42161: {
          chainId,
          chainName: "Arbitrum One",
          rpcUrls: ["https://arb1.arbitrum.io/rpc"],
          nativeCurrency: {
            name: "Arbitrum Coin",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        280: {
          chainId,
          chainName: "zkSync Era Testnet",
          rpcUrls: ["https://testnet.era.zksync.dev"],
          nativeCurrency: {
            name: "zkSync Coin",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        324: {
          chainId,
          chainName: "zkSync Era Mainnet",
          rpcUrls: ["https://mainnet.era.zksync.io"],
          nativeCurrency: {
            name: "zkSync Coin",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        5611: {
          chainId,
          chainName: "opBNB Testnet",
          rpcUrls: ["https://opbnb-testnet-rpc.bnbchain.org"],
          nativeCurrency: {
            name: "BNB Coin",
            symbol: "tBNB",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        204: {
          chainId,
          chainName: "opBNB",
          rpcUrls: ["https://opbnb-mainnet-rpc.bnbchain.org"],
          nativeCurrency: {
            name: "BNB Coin",
            symbol: "BNB",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        1442: {
          chainId,
          chainName: "Polygon zkEVM Testnet",
          rpcUrls: ["https://rpc.public.zkevm-test.net"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        1101: {
          chainId,
          chainName: "Polygon zkEVM",
          rpcUrls: ["https://rpc.ankr.com/polygon_zkevm"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        59140: {
          chainId,
          chainName: "Linea Test",
          rpcUrls: ["https://rpc.goerli.linea.build"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        59144: {
          chainId,
          chainName: "Linea",
          rpcUrls: ["https://linea-mainnet.infura.io/v3"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        10: {
          chainId,
          chainName: "Optimism LlamaNodes",
          rpcUrls: ["https://optimism.llamarpc.com"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
      }[id];
      if (!params) return;
      try {
        await window.ethereum.request(
          {
            method: "wallet_addEthereumChain",
            params: [params],
          },
          this.connectAddr
        );
      } catch (error) {
        console.log("add chain err", error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.network-label {
  width: 164px;
  background: #fff;
  border-radius: 4px;
}
.network-label.active {
  font-weight: bold;
  border: 1px solid #735ea1;

  // background: #f3e8ff;
}
</style>
