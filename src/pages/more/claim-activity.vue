<template>
  <div class="claim-container h-flex">
    <e-header v-if="!asMobile"></e-header>
    <div v-else class="claim-header py-4 px-3 d-flex al-c space-btw">
      <div class="al-c">
        <img
          src="/img/svg/logo-m.svg"
          style="vertical-align: bottom"
          width="43"
          alt=""
        />

        <div class="network al-c ml-2 pa-2" @click="sheet = !sheet">
          <img
            style="vertical-align: bottom"
            :src="curNetwork.icon || '/img/claim/error-network.svg'"
            height="24"
            alt=""
          />
          <img class="ml-1" src="/img/claim/down-arrow.svg" width="16" alt="" />
        </div>
      </div>
      <div>
        <e-menu offset-y open-on-hover v-if="userInfo.uid">
          <v-btn slot="ref" text>
            <e-team-avatar
              class="cursor-p mr-2"
              :src="userInfo.avatar"
              :size="30"
              :uid="userInfo.uid"
            >
            </e-team-avatar>
            <img
              class="ml-1"
              src="/img/claim/down-arrow.svg"
              width="16"
              alt=""
            />
          </v-btn>
          <v-list class="cursor-p menu-list">
            <v-list-item class="menu-item" @click="onLogout">
              <span class="fz-12">Logout</span>
            </v-list-item>
          </v-list>
        </e-menu>
        <v-btn
          class="hidden-md-and-up"
          text
          icon
          @click.stop="showDrawer = !showDrawer"
        >
          <v-icon>{{ mdiMenu }}</v-icon>
        </v-btn>
      </div>
    </div>

    <div class="claim-body flex-1 h-flex">
      <div class="network-card pa-6">
        <div class="mb-2 fw-b">Network</div>
        <div v-if="!asMobile" class="al-c space-btw">
          <e-menu
            ref="menu"
            bottom
            :close-on-content-click="false"
            right
            open-on-hover
            @input="
              (val) => {
                menuOpen = val;
              }
            "
          >
            <div
              slot="ref"
              class="select-network pa-2 d-flex al-c"
              style="width: 250px"
            >
              <div
                class="pa-1 mr-2"
                style="background: #fff; border-radius: 4px"
                v-show="curNetwork.chainId"
              >
                <img
                  style="vertical-align: bottom"
                  :src="curNetwork.icon"
                  height="22"
                  alt=""
                />
              </div>
              <div class="fw-b">{{ curNetwork.name }}</div>
              <img
                class="ml-auto"
                src="/img/claim/down-arrow.svg"
                width="24"
                alt=""
              />
            </div>

            <v-list>
              <ul
                class="network-list pa-4"
                style="max-height: 200px; width: 250px; overflow: auto"
              >
                <li
                  class="network-item pa-2 al-c"
                  :class="curChainId == item.chainId ? 'activity' : ''"
                  v-for="item in networkList"
                  :key="item.type"
                  @click="handleOnNetwork(item)"
                >
                  <img
                    :src="
                      curChainId == item.chainId
                        ? '/img/claim/selected.svg'
                        : '/img/claim/unselected.svg'
                    "
                    width="16"
                    alt=""
                  />
                  <div
                    class="pa-1 ml-2"
                    style="background: #fff; border-radius: 4px"
                  >
                    <img
                      style="vertical-align: bottom"
                      :src="item.icon"
                      height="22"
                      alt=""
                    />
                  </div>
                  <div
                    class="ml-2"
                    :class="curChainId == item.chainId ? 'fw-b' : ''"
                  >
                    {{ item.name }}
                  </div>
                </li>
              </ul>
            </v-list>
          </e-menu>
          <v-btn
            elevation="0"
            color="#6941C6"
            width="130px"
            style="color: #fff; font-weight: bold"
            :disabled="!curNetwork.chainId"
            :loading="load"
            @click="handleRechargeLand"
            >Claim</v-btn
          >
        </div>
        <div v-else>
          <div
            class="select-network mb-6 pa-2 d-flex al-c"
            @click="sheet = !sheet"
          >
            <div
              class="pa-1 mr-2"
              style="background: #fff; border-radius: 4px"
              v-show="curNetwork.chainId"
            >
              <img
                style="vertical-align: bottom"
                :src="curNetwork.icon"
                height="22"
                alt=""
              />
            </div>
            <div class="fw-b">{{ curNetwork.name }}</div>
            <img
              class="ml-auto"
              src="/img/claim/down-arrow.svg"
              width="24"
              alt=""
            />
          </div>
          <v-btn
            elevation="0"
            color="#6941C6"
            width="100%"
            style="color: #fff; font-weight: bold"
            light
            :disabled="!curNetwork.chainId"
            :loading="load"
            @click="handleRechargeLand"
            >Claim</v-btn
          >
        </div>
      </div>
      <v-bottom-sheet v-model="sheet" content-class="claim-bottom-sheet">
        <v-sheet class="text-center">
          <div class="pa-6">
            <div class="mb-4 al-c space-btw">
              <span class="fw-b">Choose Network</span>
              <span class="fz-12 cancel" @click="sheet = !sheet">Cancel</span>
            </div>
            <ul class="network-list" style="max-height: 400px; overflow: auto">
              <li
                class="network-item pa-2 al-c"
                :class="curChainId == item.chainId ? 'activity' : ''"
                v-for="item in networkList"
                :key="item.type"
                @click="handleOnNetwork(item)"
              >
                <img
                  :src="
                    curChainId == item.chainId
                      ? '/img/claim/selected.svg'
                      : '/img/claim/unselected.svg'
                  "
                  width="16"
                  alt=""
                />
                <div
                  class="pa-1 ml-2"
                  style="background: #fff; border-radius: 4px"
                >
                  <img
                    style="vertical-align: bottom"
                    :src="item.icon"
                    height="22"
                    alt=""
                  />
                </div>
                <div
                  class="ml-2"
                  :class="curChainId == item.chainId ? 'fw-b' : ''"
                >
                  {{ item.name }}
                </div>
              </li>
            </ul>
          </div>
        </v-sheet>
      </v-bottom-sheet>
    </div>
    <v-navigation-drawer v-model="showDrawer" right temporary fixed>
      <v-list>
        <template v-for="item in links">
          <v-list-group v-if="item.childs" :key="item.text" no-action>
            <template #activator>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </template>
            <v-list-item
              v-for="child in item.childs"
              :key="child.text"
              :href="child.href"
              :target="child.target"
            >
              <v-list-item-title>
                <span>
                  {{ child.text }}
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            :href="item.href"
            :target="item.target"
          >
            <v-list-item-title>
              <span>
                {{ item.text }}
              </span>
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-dialog
      v-model="showDialog"
      max-width="300"
      content-class="claim-activity-dialog"
      persistent
    >
      <div class="claim-dialog-container">
        <div class="claimg-dialog-bg">
          <img src="/img/claim/conguratulation.png" width="200" alt="" />
        </div>
        <div class="claim-dialog-content px-4 py-6 ta-c">
          <div class="claim-dialog-title mb-2">Congratulations!</div>
          <div class="fz-12 mb-3">
            Claim for 50,000 LAND has been placed successfully
          </div>
          <v-btn
            color="#6941C6"
            width="100%"
            style="color: #fff; font-weight: bold"
            @click="showDialog = !showDialog"
            >Back</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mdiMenu } from "@mdi/js";
import { mapGetters, mapState } from "vuex";
import { BlastOracleLand__factory } from "@4everland-contracts";
import { providers } from "ethers";
import { Web3Provider } from "zksync-web3";
import { parseEther } from "ethers/lib/utils";

import uidToEuid from "@/utils/uid2euid";
import {
  ChapelLandRecharge,
  ArbitrumLandRecharge,
  zkSyncLandRecharge,
  GoerliLandRecharge,
  MumbaiLandRecharge,
  opBNBRecharge,
  optimismRecharge,
  lineaRecharge,
  blastRecharge,
  polygonZkEVMRecharge,
} from "../../plugins/pay/contracts/contracts-addr";

export default {
  data() {
    return {
      mdiMenu,
      sheet: false,
      showDrawer: false,
      showDialog: false,
      load: false,
      curChainId: "",
      source: "",
      networkList: [
        {
          name: "Polygon",
          icon: require("/public/img/svg/billing/ic-polygon-0.svg"),
          type: "Polygon",
          chainId: this.$inDev ? 80001 : 137,
          contractAddr: MumbaiLandRecharge,
        },
        {
          name: "Polygon zkEVM",
          icon: require("/public/img/svg/billing/ic-polygon-zkEVM.svg"),
          type: "PolygonZkEVM",
          chainId: this.$inDev ? 1442 : 1101,
          contractAddr: polygonZkEVMRecharge,
        },
        {
          name: "Ethereum",
          icon: require("/public/img/svg/billing/ic-ethereum.svg"),
          type: "Ethereum",
          chainId: this.$inDev ? 11155111 : 1,
          contractAddr: GoerliLandRecharge,
        },
        {
          name: "opBNB",
          icon: require("/public/img/svg/billing/ic-opbnb-test.svg"),
          type: "OpBNB",
          chainId: this.$inDev ? 5611 : 204,
          contractAddr: opBNBRecharge,
        },
        {
          name: "BSC",
          icon: require("/public/img/svg/billing/ic-bsc.png"),
          type: "BSC",
          chainId: this.$inDev ? 97 : 56,
          contractAddr: ChapelLandRecharge,
        },
        {
          name: "Arbitrum",
          icon: require("/public/img/svg/billing/ic-arbitrum.png"),
          type: "Arbitrum",
          chainId: this.$inDev ? 421613 : 42161,
          contractAddr: ArbitrumLandRecharge,
        },
        {
          name: "zkSync Era",
          icon: require("/public/img/svg/logo-no-letters.svg"),
          type: "zkSyncV2",
          chainId: this.$inDev ? 280 : 324,
          contractAddr: zkSyncLandRecharge,
        },
        {
          name: "Optimism",
          icon: require("/public/img/svg/billing/ic-optimism.svg"),
          type: "Optimism",
          chainId: 10,
          contractAddr: optimismRecharge,
        },
        {
          name: "Linea",
          icon: require("/public/img/svg/billing/ic-linea.svg"),
          type: "Linea",
          chainId: this.$inDev ? 59140 : 59144,
          contractAddr: lineaRecharge,
        },
        {
          name: "Blast",
          icon: require("/public/img/svg/billing/ic-blast.svg"),
          type: "Blast",
          chainId: this.$inDev ? 168587773 : 81457,
          contractAddr: blastRecharge,
        },
      ],
      links: [
        {
          text: "Blogs",
          href: "https://medium.com/4everland",
          target: "_blank",
        },
        {
          text: "Docs",
          href: "https://docs.4everland.org/",
          target: "_blank",
        },
        {
          text: "Community",
          href: "http://discord.gg/4everland",
          target: "_blank",
        },
      ],
      menuOpen: false,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.name == "xs";
    },
    ...mapState({
      teamId: (s) => s.teamId,
      userInfo: (s) => s.userInfo,
    }),
    ...mapGetters(["walletObj"]),
    euid() {
      return uidToEuid(this.teamId);
    },
    curNetwork() {
      const curNetwork = this.networkList.filter(
        (it) => it.chainId == this.curChainId
      );

      if (curNetwork.length) {
        return curNetwork[0];
      }
      return {
        name: "Please Select Network",
        icon: "",
        type: "",
        chainId: "",
        landRechargeAddr: "",
      };
    },
  },
  created() {
    if (!localStorage.token) {
      this.onLogout();
    }
    this.source = this.$route.query.source;
    this.walletObj.on("chainChanged", this.initSeleted);
    this.initSeleted();
  },
  beforeDestroy() {
    this.walletObj.removeListener("accountsChanged", this.initSeleted);
  },
  methods: {
    initSeleted() {
      console.log(this.walletObj);
      this.curChainId = parseInt(this.walletObj.chainId);

      console.log(this.curChainId);
    },
    async handleOnNetwork(item) {
      console.log(item);
      try {
        if (this.curChainId == item.chainId) return;
        this.curChainId = item.chainId;
        await this.switchNet(item.chainId);
        this.sheet = false;
      } catch (error) {
        // user cancel
        console.log(error, "==================");
        this.initSeleted();
      }
    },
    async handleRechargeLand() {
      this.load = true;
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        let address = accounts[0];
        let provider = new providers.Web3Provider(this.walletObj);
        if (this.curChainId == (this.$inDev ? "280" : "324")) {
          provider = new Web3Provider(this.walletObj);
        }
        let signer = provider.getSigner();

        const BlastOracleLand = BlastOracleLand__factory.connect(
          this.curNetwork.contractAddr,
          signer
        );

        const price = await BlastOracleLand.callStatic.fetchPrice();

        let tx = await BlastOracleLand.mintByETH(this.euid, {
          value: parseEther("0.05").mul(parseEther("1")).div(price),
        });
        await this.$http.post(`$bill-consume/activity/recharge/report`, {
          source: this.source,
          hash: tx.hash,
          address,
          chainId: this.curChainId,
        });
        console.log(+new Date());
        const receipt = await tx.wait();
        console.log(receipt, "receipt");

        // await this.$http.post(`$bill-consume/activity/recharge/report`, {
        //   source: this.source,
        //   hash: receipt.transactionHash,
        //   address,
        //   chainId: this.curChainId,
        // });
        this.showDialog = true;
      } catch (error) {
        console.log(error);
        this.onErr(error);
      }
      this.load = false;
    },
    onLogout() {
      this.$clearLogin();
      localStorage.loginTo = location.pathname + location.search;
      location.href = this.$getLoginUrl();
      return;
    },
    async getAccount() {
      await this.$store.dispatch("getWalletAccount");
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
          const res = await this.addChain(chainId, id);
          console.log(res);
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
          chainName: "opBNB Mainnet",
          rpcUrls: ["https://opbnb-rpc.publicnode.com"],
          nativeCurrency: {
            name: "BNB Coin",
            symbol: "BNB",
            decimals: 18,
          },
          blockExplorerUrls: ["https://mainnet.opbnbscan.com"],
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
        throw error;
      }
    },
  },
};
</script>

<style>
.v-menu__content {
  border-radius: 8px;
}
.claim-activity-dialog {
  border-radius: 16px;
  overflow: inherit;
}

/* .v-dialog.v-dialog--active.v-bottom-sheet {
  border-radius: 20px;
} */
.claim-bottom-sheet,
.claim-bottom-sheet .v-sheet {
  border-radius: 16px 16px 0 0 !important;
}
</style>

<style lang="scss" scoped>
.claim-container {
  background: #f3e8ff;
  height: 100%;

  .claim-header {
    background: #fff;
    .network {
      border-radius: 56px;
      background: #f8fafc;
    }
  }

  @media screen and (min-width: 600px) {
    .claim-body {
      width: 686px;
      margin: 0 auto;
      background-size: contain !important;
    }
    .network-card {
      width: 445px;
      margin: 0 auto 220px !important;
    }
  }
  .claim-body {
    justify-content: flex-end;
    background: url("/img/claim/bg.png") no-repeat;
    background-size: cover;
    background-position: center;
    .network-card {
      margin: 0 16px 100px 16px;
      border-radius: 16px;
      background: #fff;
      .select-network {
        border-radius: 8px;
        background: #f8fafc;
      }
    }
  }
}

.cancel {
  color: #64748b;
}
.network-list {
  list-style: none;
  padding-left: 0;

  .network-item {
    border-radius: 8px;
    border: 1px solid #cbd5e1;
  }
  .network-item.activity {
    background: #f8fafc;
    border: 1px solid transparent;
  }
  .network-item + .network-item {
    margin-top: 8px;
  }
}

.claim-dialog-container {
  background: #f3e8ff;
  border-radius: 16px;
  .claimg-dialog-bg {
    position: relative;
    height: 80px;
    background: url("/img/claim/conguratulation-bg.png") no-repeat;
    background-size: cover;

    img {
      left: 27%;
      top: -100%;
      // transform: translateX(-50%);
      position: absolute;
    }
  }
  .claim-dialog-content {
    position: relative;
    z-index: 99999;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0px -4px 4px 0px rgba(105, 65, 198, 0.1);
    .claim-dialog-title {
      color: #6941c6;
      font-style: italic;
      font-weight: 900;
    }
  }
}
</style>
