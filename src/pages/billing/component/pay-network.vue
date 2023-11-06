<template>
  <div>
    <div class="d-flex flex-wrap">
      <div
        @click="onSelect(it.label)"
        class="network-label py-3 cursor-p justify-center d-flex"
        :class="{
          active: selected == it.label,
        }"
        v-for="(it, i) in payList"
        :key="i"
      >
        <v-icon size="16" :color="selected == it.label ? $color1 : '#555'"
          >mdi-{{
            selected == it.label
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
            'color-1': selected == it.label,
          }"
          >{{ it.name }}</span
        >
      </div>
    </div>
    <ever-pay ref="everPay" v-if="selected == 'everPay'"></ever-pay>
  </div>
</template>

<script>
import { providers } from "ethers"; //, utils
import { Web3Provider } from "zksync-web3";
import ethContract from "../../../plugins/pay/contracts/src-chain-contracts";
import bscContract from "../../../plugins/pay/contracts/src-chain-contracts-bsc";
import polygonContract from "../../../plugins/pay/contracts/dst-chain-contracts";
import ArbitrumContract from "../../../plugins/pay/contracts/src-chain-contracts-arbitrum";
import zkSyncContract from "../../../plugins/pay/contracts/src-chain-contracts-zkSync";
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
    payList() {
      if (!this.allow) return this.list;
      return this.list.filter((it) => this.allow.includes(it.label));
    },
    chainList() {
      return [
        {
          name: "Polygon",
          chainId: this.$inDev ? 80001 : 137,
        },
        {
          name: "BSC",
          chainId: this.$inDev ? 97 : 56,
        },
        {
          name: "Arbitrum",
          chainId: this.$inDev ? 421613 : 42161,
        },
        {
          name: "Ethereum",
          chainId: this.$inDev ? 5 : 1,
        },
        {
          name: "zkSync",
          chainId: this.$inDev ? 280 : 324,
        },
        {
          name: "OpBNB",
          chainId: this.$inDev ? 5611 : 204,
        },
        {
          name: "PolygonZkEVM",
          chainId: this.$inDev ? 1442 : 1101,
        },
        {
          name: "Linea",
          chainId: this.$inDev ? 59140 : 59144,
        },
        {
          name: "everPay",
          chainId: this.$inDev ? 59140 : 59144,
        },
      ];
    },
    chainId() {
      return parseInt(this.walletObj.chainId);
    },
  },
  data() {
    return {
      list: [
        {
          label: "Polygon",
          name: "Polygon",
          img: "/img/svg/billing/ic-polygon-0.svg",
        },
        {
          label: "Ethereum",
          name: "Ethereum",
          img: "/img/svg/billing/ic-ethereum.svg",
        },
        {
          label: "BSC",
          name: "BSC",
          img: "/img/svg/billing/ic-bsc.png",
        },
        {
          label: "Arbitrum",
          name: "Arbitrum",
          img: "/img/svg/billing/ic-arbitrum.png",
        },
        {
          label: "zkSync",
          name: "zkSync Era",
          img: "/img/svg/logo-no-letters.svg",
        },
        {
          label: "everPay",
          name: "everPay",
          img: "/img/svg/billing/ic-everpay.svg",
        },
      ],
      selected: "",
    };
  },
  created() {
    this.initSeleted();
  },
  methods: {
    initSeleted() {
      this.selected = this.chainList.find((item) => {
        return item.chainId == parseInt(this.walletObj.chainId);
      }).name;
      this.setContract();
    },
    async onSelect(chainName) {
      try {
        if (this.selected == chainName) return;
        this.selected = chainName;
        await this.switchNet(chainName);
        this.setContract();
      } catch (error) {
        // user cancel
        console.log(error, "==================");
        this.initSeleted();
      }
    },

    setContract() {
      const provider = new providers.Web3Provider(this.walletObj);
      let zkprovider = new Web3Provider(this.walletObj);
      let contract = null;
      switch (this.selected) {
        case "Polygon":
          polygonContract.setProvider(provider);
          contract = polygonContract;
          break;

        case "BSC":
          bscContract.setProvider(provider);
          contract = bscContract;
          break;
        case "Arbitrum":
          ArbitrumContract.setProvider(provider);
          this.curContract = ArbitrumContract;
          break;
        case "zkSync":
          zkSyncContract.setProvider(zkprovider);
          contract = zkSyncContract;
          break;

        default:
          ethContract.setProvider(provider);
          contract = ethContract;
          break;
      }
      this.$emit("onNetwork", this.selected);
      this.$store.commit("SET_CONTRACT", contract);
    },

    getChainId(type) {
      if (type == "Polygon") return this.$inDev ? 80001 : 137;
      if (type == "BSC") return this.$inDev ? 97 : 56;
      if (type == "Arbitrum") return this.$inDev ? 421613 : 42161;
      if (type == "zkSync") return this.$inDev ? 280 : 324;
      if (type == "OpBNB") return this.$inDev ? 5611 : 204;
      if (type == "PolygonZkEVM") return this.$inDev ? 1442 : 1101;
      if (type == "Linea") return this.$inDev ? 59140 : 59144;
      return this.$inDev ? 5 : 1;
    },
    async switchNet(chainName) {
      const id = this.getChainId(chainName);
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
        5: {
          chainId,
          chainName: "Goerli Testnet",
          rpcUrls: ["https://rpc.ankr.com/eth_goerli"],
          nativeCurrency: {
            name: "Goerli-ETH",
            symbol: "G-ETH",
            decimals: 18,
          },
          blockExplorerUrls: ["https://goerli.etherscan.io/"],
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
  watch: {
    chainId() {
      if (this.selected == "everpay") return;
      this.initSeleted();
    },
  },
};
</script>

<style lang="scss" scoped>
.network-label {
  width: 172px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
}
.network-label.active {
  font-weight: bold;
  border: 1px solid #735ea1;
  background: #f3e8ff;
}
.network-label + .network-label {
  margin-left: 8px;
}
</style>
