<template>
  <div>
    <div class="d-flex flex-wrap justify-space-around">
      <div
        @click="onSelect(it.chainId, it.label)"
        class="network-label pa-3 al-c cursor-p d-flex mt-4"
        :class="{
          'border2 active font-weight-bold': actived(it.chainId, it.label),
        }"
        v-for="(it, i) in chainList"
        :key="i"
      >
        <v-icon
          size="16"
          :color="actived(it.chainId, it.label) ? $color1 : '#555'"
          >mdi-{{
            actived(it.chainId, it.label)
              ? "circle-slice-8"
              : "checkbox-blank-circle-outline"
          }}</v-icon
        >
        <img
          class="mx-2"
          style="vertical-align: middle"
          :src="it.img"
          height="20"
        />
        <span
          class="nowrap"
          :class="{
            'color-1': actived(it.chainId, it.label),
          }"
          >{{ it.name }}</span
        >
        <v-tooltip top v-if="it.label == 'everPay'">
          <template v-slot:activator="{ on, attrs }">
            <v-icon small color="#6C7789" class="ml-2" v-bind="attrs" v-on="on">
              mdi-alert-circle-outline
            </v-icon>
          </template>
          <div style="width: 300px">
            When you deposit using everPay, the 4EVER cross-chain bridge will
            automatically complete your transaction, using USDC on Polygon.
          </div>
        </v-tooltip>
      </div>
    </div>
    <ever-pay ref="everPay" v-if="selected == 'everPay'"></ever-pay>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import everPay from "../../../views/pay/ever-pay.vue";

export default {
  components: {
    everPay,
  },
  props: {
    allow: Array,
  },
  computed: {
    ...mapState({
      isZksyncLite: (s) => s.isZksyncLite,
      isEverpay: (s) => s.isEverpay,
    }),
    ...mapGetters(["walletObj"]),
    actived() {
      return function (chainId, label) {
        if (chainId == 1 && chainId == this.selected) {
          if (this.isZksyncLite) {
            if (label == "ZksyncLite") {
              return true;
            }
            return false;
          } else if (this.isEverpay) {
            if (label == "everPay") {
              return true;
            }
            return false;
          } else {
            if (label == "Ethereum") {
              return true;
            }
            return false;
          }
        }
        return this.selected == chainId;
      };
    },
    chainList() {
      const list = [
        {
          label: "Polygon",
          name: "Polygon",
          img: "/img/svg/billing/ic-polygon-0.svg",
          chainId: this.$inDev ? 80001 : 137,
        },
        {
          label: "Ethereum",
          name: "Ethereum",
          img: "/img/svg/billing/ic-ethereum.svg",
          chainId: this.$inDev ? 11155111 : 1,
        },
        {
          Label: "opBNB",
          name: "opBNB",
          img: "/img/svg/billing/ic-opbnb-test.svg",
          chainId: this.$inDev ? 5611 : 204,
        },
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
        {
          label: "everPay",
          name: "everPay",
          img: "/img/svg/billing/ic-everpay.svg",
          chainId: 9999999,
        },
        {
          label: "Scroll",
          name: "Scroll",
          img: "/img/svg/billing/ic-scroll.svg",
          chainId: 534352,
        },
        {
          label: "Blast",
          name: "Blast",
          img: "/img/svg/billing/ic-blast.svg",
          chainId: 81457,
        },
        {
          label: "Taiko",
          name: "Taiko",
          img: "/img/svg/billing/ic-taiko.svg",
          chainId: 167000,
        },
        {
          label: "ZksyncLite",
          name: "Zksync Lite",
          img: "/img/svg/logo-no-letters.svg",
          chainId: 1,
        },
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
      if (this.isEverpay) {
        this.selected = 9999999;
      } else {
        this.selected = parseInt(this.walletObj.chainId);
      }
      this.$emit("onNetwork", this.selected);
    },
    async onSelect(chainId, label) {
      try {
        // if (this.selected == chainId) return;
        this.selected = chainId;
        if (chainId == 9999999) {
          localStorage.setItem("isEverpay", 1);
          this.$store.commit("SET_IS_EVERPAY", true);
          localStorage.removeItem("isZksyncLite");
          this.$store.commit("SET_IS_ZKSYNCLITE", false);
        } else if (label == "ZksyncLite") {
          await this.switchNet(chainId);
          localStorage.setItem("isZksyncLite", 1);
          this.$store.commit("SET_IS_ZKSYNCLITE", true);
          localStorage.removeItem("isEverpay");
          this.$store.commit("SET_IS_EVERPAY", false);
        } else {
          await this.switchNet(chainId);
          localStorage.removeItem("isEverpay");
          localStorage.removeItem("isZksyncLite");
          this.$store.commit("SET_IS_EVERPAY", false);
          this.$store.commit("SET_IS_ZKSYNCLITE", false);
        }
        // this.$emit("onNetwork", this.selected);
      } catch (error) {
        // user cancel
        console.log(error, "==================");
        this.initSeleted();
      }
    },

    async switchNet(id) {
      const chainId = "0x" + id.toString(16);
      try {
        await this.walletObj.request({
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
            "https://rpc.ankr.com/polygon",
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
        534352: {
          chainId,
          chainName: "Scroll",
          rpcUrls: ["https://rpc.scroll.io"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
        },
        81457: {
          chainId,
          chainName: "Blast Mainnet",
          rpcUrls: ["https://rpc.blast.io"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          blockExplorerUrls: ["https://blastscan.io"],
        },
        167000: {
          chainId,
          chainName: "Taiko Mainnet",
          rpcUrls: ["https://rpc.taiko.xyz"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          blockExplorerUrls: ["https://taikoscan.network"],
        },
      }[id];
      if (!params) return;
      try {
        await this.walletObj.request(
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
    selected(val) {
      if (val == 9999999) {
        this.$emit("onNetwork", val);
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
  border: 1px solid var(--v-primary-base) !important;
}
</style>
