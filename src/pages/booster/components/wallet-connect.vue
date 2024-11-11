<template>
  <div class="invite-drawer-box">
    <v-navigation-drawer
      class="invite-drawer"
      :absolute="!asMobile"
      :fixed="asMobile"
      bottom
      right
      temporary
      :hide-overlay="!asMobile"
      color="#1E2234"
      :value="showConnectDrawer"
      @input="handleToggle"
    >
      <v-container fluid style="padding: 24px 16px">
        <div class="drawer-title mb-6">Connect Your Wallet</div>

        <div class="mobile-invite-panel-content">
          <div
            class="wallet-item"
            v-for="(item, index) in walletList"
            :key="item.type"
          >
            <div class="wallet-icon-box">
              <img :src="item.icon" width="44" alt="" />
              <div>{{ item.name }}</div>
            </div>
            <div>
              <v-btn
                class="drawer-btn"
                :loading="loadingIndex == index"
                @click="onConnect(item.type)"
                >Connect</v-btn
              >
            </div>
          </div>
        </div>
      </v-container>
    </v-navigation-drawer>
    <v-navigation-drawer
      class="invite-drawer"
      :absolute="!asMobile"
      :fixed="asMobile"
      bottom
      right
      temporary
      :hide-overlay="!asMobile"
      color="#1E2234"
      :value="showConnectLoadingDrawer"
      @input="handleToggle"
    >
      <v-container fluid style="padding: 24px 16px">
        <div class="drawer-title mb-6">OKX Wallet</div>
        <div class="mobile-invite-panel-content">
          <div class="text-center">
            <img
              class="rotate"
              src="/img/booster/wallet/loading.png"
              width="48"
            />
          </div>
        </div>
        <div class="my-5">Continue in OKX Wallet</div>
        <div class="my-5">
          <v-btn
            v-if="!walletAccount"
            class="confrm-btn"
            @click="onConnect(walletType)"
            >Open Wallet</v-btn
          >
          <v-btn v-else class="confrm-btn" @click="onSign(walletType)"
            >Confrm</v-btn
          >
        </div>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { mapState } from "vuex";

import { OKXUniversalProvider } from "@okxconnect/universal-provider";
import { OmniConnect } from "@bitget-wallet/omni-connect";

import { fetchWeb3codeBind, fetchWeb3Vcode } from "@/api/login.js";

import { ConnectWalletCon, onSignWalletCon } from "@/utils/login";

const connector = new OmniConnect({
  metadata: {
    name: "4EVERLAND",
    iconUrl: "https://dashboard.4everland.org/favicon.ico",
    url: "https://4everland.org/",
  },
  namespace: {
    eip155: {
      chains: ["1"],
    },
  },
});

export default {
  computed: {
    ...mapState({
      showInviteDrawer: (s) => s.moduleBooster.showInviteDrawer,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  data() {
    return {
      okxUniversalProvider: null,
      showConnectDrawer: false,
      showConnectLoadingDrawer: false,
      walletConnectLoading: false,
      loadingIndex: null,
      walletType: null,
      walletAccount: null,
      walletList: [
        {
          name: "OKX Wallet",
          icon: "/img/booster/wallet/wallet-okx.png",
          type: "okx",
        },
        {
          name: "WalletConnect",
          icon: "/img/booster/wallet/wallet-walletconnect.png",
          type: "walletconnect",
        },
        {
          name: "Bitget Wallet",
          icon: "/img/booster/wallet/wallet-bitget.png",
          type: "bitget",
        },
      ],
    };
  },
  created() {
    this.initOkx();
  },
  methods: {
    onShowConnect() {
      this.showConnectDrawer = true;
    },
    async initOkx() {
      this.okxUniversalProvider = await OKXUniversalProvider.init({
        dappMetaData: {
          name: "4EVERLAND",
          icon: "https://dashboard.4everland.org/favicon.ico",
        },
      });
    },
    async onConnect(type) {
      switch (type) {
        case "okx":
          this.connectOkxWallet(type);
          break;
        case "walletconnect":
          this.onBindWithWalletConnect();
          break;
        case "bitget":
          this.connectBitget();
          break;
        default:
          break;
      }
    },
    async onSign(type) {
      switch (type) {
        case "okx":
          this.signWithOkx();
          break;
        case "walletconnect":
          this.onBindWithWalletConnect();
          break;
        case "bitget":
          this.signWithBitget();
          break;
        default:
          break;
      }
    },
    async showLoading(type) {
      this.walletType = type;
      this.showConnectLoadingDrawer = true;
    },
    async connectOkxWallet(type) {
      this.showLoading(type);
      const session = await this.okxUniversalProvider.connect({
        namespaces: {
          eip155: {
            chains: ["eip155:1"],
            rpcMap: {
              1: "", // set your own rpc url
            },
            defaultChain: "1",
          },
        },
        // optionalNamespaces: {},
        // sessionConfig: {
        //   redirect: "tg://resolve",
        // },
      });
      const accounts = session.namespaces.eip155.accounts;
      const account = accounts[0].split(":")[2];
      console.log(account);
      this.walletAccount = account;
    },
    async signWithOkx() {
      const msg = await this.getMsg("7");
      console.log(msg);
      let chain = "eip155:1";
      let params = {};
      params = {
        method: "personal_sign",
        params: [msg],
      };

      const signature = await this.okxUniversalProvider.request(params, chain);
      console.log(signature);

      if (signature) {
        this.onVcode(7, signature);
      }
    },
    async onBindWithWalletConnect() {
      const type = 99;
      this.walletConnectLoading = true;
      window.walletConnectModal.subscribeModal((state) => {
        if (!state.open) {
          this.walletConnectLoading = false;
        }
      });
      const { session, account } = await ConnectWalletCon();
      if (!account) {
        return;
      }
      const params = {
        type: type,
        apply: account,
      };
      const nonce = await this.onExchangeCode(params);
      if (!nonce) {
        return;
      }
      this.walletConnectLoading = false;
      const signature = await onSignWalletCon(session, account, nonce);
      if (signature) {
        this.onVcode(type, signature);
      }
    },
    async connectBitget(type) {
      this.showLoading(type);
      connector.connect();
      this.subscription();
    },
    async signWithBitget() {
      try {
        const address = this.walletAccount;
        const msg = await this.getMsg("104");
        console.log(msg);

        await connector.signMessage({
          method: "personal_sign",
          params: [address, msg],
        });
      } catch (error) {
        console.log(error);
      }
    },
    async subscription() {
      const subscription = connector.onStatusChange(
        (walletInfo) => {
          console.log("onStatusChange", walletInfo);
          const { id, namespaceKey, event, connected, result } = walletInfo;
          switch (event) {
            case "connect":
              this.walletAccount = result?.address;
              break;
            case "disconnect":
              // connected or disconnect logic..
              this.walletAccount = result?.address;
              break;
            case "signMessage":
              const signature = result?.signature;
              if (signature) {
                this.onVcode(104, signature);
              }
              break;
            case "signTransaction":
            case "sendTransaction":
              // handle result?.signature, result?.reciept
              break;
            default:
              break;
          }
        },
        (err) => {
          const { code, message } = err;
          console.error(`error stream: code: ${code}, message: ${message}`);
        }
      );
    },
    async getMsg(type) {
      const account = this.walletAccount;
      const params = {
        type,
        apply: account,
      };
      const nonce = await this.onExchangeCode(params);
      const msg = "0x" + Buffer.from(nonce).toString("hex");
      console.log(msg);
      return msg;
    },
    async onExchangeCode(params) {
      try {
        const { data } = await fetchWeb3codeBind(params);
        return data.applyR;
      } catch (error) {
        console.log(error);
        this.$toast2(error.message, "error");
      }
    },
    async onVcode(type, code) {
      this.showConnectDrawer = false;
      try {
        let params = {
          type,
        };

        const { data } = await fetchWeb3Vcode(code, params);
        if (data.nodeToken) {
          localStorage.nodeToken = data.nodeToken;
        }

        this.$toast2("Connect successfully!", "success");
        this.$setMsg({
          name: "updateUser",
        });
      } catch (error) {
        console.log(error);
      }
    },
    handleToggle(val) {
      this.showConnectDrawer = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.invite-drawer-box {
  ::v-deep .invite-drawer {
    width: 100% !important;
    height: 30% !important;
    max-height: 100% !important;

    overflow: scroll;
    .drawer-title {
      font-size: 20px;
      font-weight: 500;
      color: #fff;
      text-shadow: 0px 0px 8px #6172f3;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

@media (min-width: 960px) {
  .invite-drawer-box {
    ::v-deep .invite-drawer {
      top: 74px !important;
      right: 24px !important;
      width: 558px !important;
      height: calc(100% - 74px - 64px - 24px) !important;
    }
  }
}

.wallet-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
  .wallet-icon-box {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .drawer-btn {
    background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
    box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
    color: #fff !important;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
  }
}

.rotate {
  animation: rotate 2s linear infinite;
  -webkit-animation: rotate 2s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes rotate {
  0% {
    transform: rotate(0);
  }

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.confrm-btn {
  background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
  box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
  color: #fff !important;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  width: 100%;
}
</style>
