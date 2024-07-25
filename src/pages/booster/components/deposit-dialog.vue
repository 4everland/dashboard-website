<template>
  <div>
    <v-overlay :value="value" opacity="1" v-if="asMobile">
      <div class="start-boosting d-flex flex-column justify-center">
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="18"
          alt=""
        />
        <div class="first-dialog-title py-2 fz-20 text-center mb-2">
          Claim LAND
        </div>
        <div class="first-dialog-content">
          <div class="paragraph d-flex align-center justify-space-between">
            <span>Amount</span>
            <span>50,000 LAND ($0.05)</span>
          </div>
          <div class="paragraph d-flex align-center justify-space-between">
            <span>Network</span>
            <v-select
              style="max-width: 194px"
              class="hide-msg network-select"
              dense
              solo
              item-value="chainId"
              :items="chainList"
              v-model="selected"
              :menu-props="{
                'offset-y': true,
                'content-class': 'select-menu',
              }"
            >
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <img :src="item.img" width="20" alt="" />
                  <span class="ml-2" style="color: #fff">{{ item.name }}</span>
                </div>
              </template>
              <template v-slot:item="{ item }">
                <div class="d-flex align-center">
                  <img :src="item.img" width="20" alt="" />
                  <span class="ml-2" style="color: #fff">{{ item.name }}</span>
                </div>
              </template>
              <template v-slot:append>
                <img
                  :src="'/img/booster/svg/down-arrow.svg'"
                  width="16"
                  alt=""
                />
              </template>
            </v-select>
          </div>

          <div
            class="act-btn d-flex align-center justify-center mt-10"
            style="gap: 16px"
          >
            <v-btn
              outlined
              color="rgba(255, 255, 255, 0.60)"
              @click="$emit('input', false)"
              >Cancel</v-btn
            >
            <v-btn
              style="
                border: 1px solid #0e6cc6;
                background: linear-gradient(
                  180deg,
                  #00070c 0%,
                  #074178 113.39%
                );
                text-shadow: 0px 0px 8px #6172f3;
              "
              outlined
              color="#fff"
              >Claim</v-btn
            >
          </div>
        </div>
      </div>
    </v-overlay>

    <v-dialog
      v-else
      max-width="592px"
      :value="value"
      persistent
      content-class="booster-dialog"
      style="background-color: transparent; box-shadow: none; height: 524px"
    >
      <div class="booster-module-dialog">
        <div class="start-boosting-dialog">
          <div class="deposit-dialog-title text-center fz-20 mb-5">
            Claim LAND
          </div>
          <div class="paragraph d-flex align-center justify-space-between">
            <span>Amount</span>
            <span>50,000 LAND ($0.05)</span>
          </div>
          <div class="paragraph d-flex align-center justify-space-between">
            <span>Network</span>
            <v-select
              style="max-width: 194px"
              class="hide-msg network-select"
              dense
              solo
              item-value="chainId"
              :items="chainList"
              v-model="selected"
              @change="(v) => onSelect(v)"
              :menu-props="{
                'content-class': 'select-menu',
                minWidth: '320px',
                left: true,
                'nudge-top': '-45px',
              }"
            >
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <img :src="item.img" width="20" alt="" />
                  <span class="ml-2" style="color: #fff">{{ item.name }}</span>
                </div>
              </template>
              <template v-slot:item="{ item }">
                <div class="d-flex align-center">
                  <img :src="item.img" width="20" alt="" />
                  <span class="ml-2" style="color: #fff">{{ item.name }}</span>
                </div>
              </template>
              <template v-slot:append>
                <img
                  :src="'/img/booster/svg/down-arrow.svg'"
                  width="16"
                  alt=""
                />
              </template>
            </v-select>
          </div>

          <div
            class="act-btn d-flex align-center justify-center mt-10"
            style="gap: 16px"
          >
            <v-btn
              outlined
              color="rgba(255, 255, 255, 0.60)"
              @click="$emit('input', false)"
              >Cancel</v-btn
            >
            <v-btn
              style="
                border: 1px solid #0e6cc6;
                background: linear-gradient(
                  180deg,
                  #00070c 0%,
                  #074178 113.39%
                );
                text-shadow: 0px 0px 8px #6172f3;
              "
              @click="handleRechargeLand"
              outlined
              :loading="load"
              color="#fff"
              >Claim</v-btn
            >
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { BlastOracleLand__factory } from "@4everland-contracts";
import { BigNumber, providers } from "ethers";
import { Web3Provider } from "zksync-web3";
import { mapGetters, mapState } from "vuex";
import {
  ChapelLandRecharge,
  ArbitrumLandRecharge,
  zkSyncLandRecharge,
  GoerliLandRecharge,
  MumbaiLandRecharge,
  opBNBRecharge,
  optimismRecharge,
  blastRecharge,
  polygonZkEVMRecharge,
  scrollRecharge,
  taikoRecharge,
} from "@/plugins/pay/contracts/contracts-addr";
import { parseEther } from "ethers/lib/utils";
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      chainList: [
        {
          label: "Polygon",
          name: "Polygon",
          img: "/img/svg/billing/ic-polygon-0.svg",
          chainId: this.$inDev ? 80001 : 137,
          contractAddr: MumbaiLandRecharge,
        },
        {
          label: "PolygonZkEVM",
          name: "Polygon zkEVM",
          img: "/img/svg/billing/ic-polygon-zkEVM.png",
          chainId: this.$inDev ? 1442 : 1101,
          contractAddr: polygonZkEVMRecharge,
        },
        {
          label: "Ethereum",
          name: "Ethereum",
          img: "/img/svg/billing/ic-ethereum.svg",
          chainId: this.$inDev ? 11155111 : 1,
          contractAddr: GoerliLandRecharge,
        },
        {
          Label: "opBNB",
          name: "opBNB",
          img: "/img/svg/billing/ic-opbnb-test.svg",
          chainId: this.$inDev ? 5611 : 204,
          contractAddr: opBNBRecharge,
        },
        {
          label: "BSC",
          name: "BSC",
          img: "/img/svg/billing/ic-bsc.png",
          chainId: this.$inDev ? 97 : 56,
          contractAddr: ChapelLandRecharge,
        },
        {
          label: "Arbitrum",
          name: "Arbitrum",
          img: "/img/svg/billing/ic-arbitrum.png",
          chainId: this.$inDev ? 421613 : 42161,
          contractAddr: ArbitrumLandRecharge,
        },
        {
          label: "zkSync",
          name: "zkSync Era",
          img: "/img/svg/logo-no-letters.svg",
          chainId: this.$inDev ? 280 : 324,
          contractAddr: zkSyncLandRecharge,
        },
        {
          label: "Optimism",
          name: "Optimism",
          img: "/img/svg/billing/ic-optimism.svg",
          chainId: 10,
          contractAddr: optimismRecharge,
        },
        {
          label: "Scroll",
          name: "Scroll",
          img: "/img/svg/billing/ic-scroll.svg",
          chainId: 534352,
          contractAddr: scrollRecharge,
        },
        {
          label: "Blast",
          name: "Blast",
          img: "/img/svg/billing/ic-blast.svg",
          chainId: 81457,
          contractAddr: blastRecharge,
        },
        {
          label: "Taiko",
          name: "Taiko",
          img: "/img/svg/billing/ic-taiko.svg",
          chainId: 167000,
          contractAddr: taikoRecharge,
        },
      ],
      selected: null,
      load: false,
    };
  },
  computed: {
    ...mapGetters(["walletObj"]),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    ...mapState({
      userInfo: (s) => s.userInfo,
      connectAddr: (s) => s.connectAddr,
    }),
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
      console.log(parseInt(this.walletObj.chainId));
      this.selected = parseInt(this.walletObj.chainId);
    },
    async onSelect(chainId) {
      try {
        // if (this.selected == chainId) return;
        this.selected = chainId;
        await this.switchNet(chainId);
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
    async handleRechargeLand() {
      this.load = true;
      try {
        const accounts = await this.walletObj.request({
          method: "eth_requestAccounts",
        });
        let address = accounts[0];
        let provider = new providers.Web3Provider(this.walletObj);
        if (this.selected == (this.$inDev ? "280" : "324")) {
          provider = new Web3Provider(this.walletObj);
        }
        let signer = provider.getSigner();

        const curNetwork = this.chainList.filter(
          (it) => it.chainId == this.selected
        );
        let contractAddr = null;
        if (curNetwork.length) {
          contractAddr = curNetwork[0].contractAddr;
        }
        console.log(curNetwork, "====");

        console.log(contractAddr);

        const BlastOracleLand = BlastOracleLand__factory.connect(
          contractAddr,
          signer
        );

        const price = await BlastOracleLand.callStatic.fetchPrice();

        let mintPrice = parseEther("0.05").mul((1e18).toString()).div(price);

        // const balance = await this.fetchBalance(address);
        // if (balance.lte(mintPrice)) {
        //   throw new Error("Insufficient balance in your wallet.");
        // }

        const gasLimit = await BlastOracleLand.estimateGas.mintByETH(
          this.userInfo.euid,
          {
            value: mintPrice,
          }
        );
        const gasPrice = await provider.getGasPrice();
        let tx = await BlastOracleLand.mintByETH(this.userInfo.euid, {
          value: mintPrice,
          gasLimit: gasLimit.mul(12).div(10),
          gasPrice: gasPrice.mul(12).div(10),
        });

        const receipt = await tx.wait();
        this.$store.dispatch("getBalance");

        console.log(receipt, "receipt");
        this.$toast2("LAND Claimed successfully");
      } catch (error) {
        console.log(error);
        this.onErr(error);
      }
      this.load = false;
    },
    onErr(err, retry) {
      if (!err) return console.log("---- err null");
      console.log(err);
      if (/unknown account/.test(err.message)) {
        return this.getAccount();
      }
      const { data } = err;
      let msg = err.message;
      if (data) {
        msg = data.message || msg;
      }
      if (/repriced/i.test(msg) && /replaced/i.test(msg)) {
        return this.$toast("Transaction was replaced.");
      }
      window.gtag("event", "contract_error", {
        message: msg,
      });
      if (/missing revert data/i.test(msg)) {
        msg = "Network Error";
      } else if (/user rejected/i.test(msg)) {
        msg = "Your transaction has been canceled.";
      } else if (/transaction failed/i.test(msg)) {
        msg = "Transaction Failed";
      } else if (/ipfs/.test(msg) && /invalid params/.test(msg)) {
        msg = "IPFS Storage Expired, extending service duration is required.";
      } else if (
        /exceeds balance/i.test(msg) ||
        msg == "overflow" ||
        /insufficient funds/i.test(msg)
      ) {
        msg = "Insufficient balance in your wallet.";
      } else if (msg.length > 100) {
        const mat = /^(.+)\[/.exec(msg);
        if (mat) msg = mat[1];
      }
      if (/already pending for origin/gi.test(msg)) {
        msg = "Wrong network, please switch your wallet network and try again.";
      }
      if (retry) {
        return this.$confirm(msg, "Network Error", {
          confirmText: "Retry",
        });
      }
      return this.$alert(msg, "Error");
    },
  },
};
</script>

<style lang="scss" scoped>
.start-boosting {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);
  .close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .first-dialog-title {
    background: rgba(0, 129, 248, 0.1);
    text-shadow: 0px 0px 8px #6172f3;
  }
}

::v-deep .booster-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
  // backdrop-filter: blur(6.5px) !important;
}
.booster-module-dialog {
  padding: 13px;
  height: 420px;
  background: url("/img/booster/svg/dialog-bg.svg") no-repeat;
  background-size: contain;
}
.start-boosting-dialog {
  position: relative;
  height: 100%;
  padding: 20px 8px;
  color: #fff;
  border-radius: 5px;
  border-radius: 5px;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);

  .close-btn {
    position: absolute;
    right: 10px;
    top: 5px;
    cursor: pointer;
  }
  .deposit-dialog-title {
    padding: 4px 60px;
    background: rgba(0, 129, 248, 0.1);
    text-shadow: 0px 0px 8px #6172f3;
  }
}

.paragraph {
  padding: 16px 24px;
  margin-bottom: 8px;
  background: url("/img/booster/svg/fringe-bg.svg");
}

.network-select {
  color: #fff;
  border-radius: 4px;
  border: 0.5px solid rgba(255, 255, 255, 0.3);
  background: rgba(49, 49, 49, 0.9);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.35);
}
.select-menu {
  .v-list.v-select-list.v-sheet.theme--light.v-list--dense.theme--light {
    border-radius: 4px !important;
    border: 0.5px solid rgba(255, 255, 255, 0.3) !important;
    background: rgba(49, 49, 49, 0.9) !important;
  }
}
</style>
