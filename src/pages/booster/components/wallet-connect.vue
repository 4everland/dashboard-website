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
      style="z-index:999"
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
      @input="handleLoadingToggle"
      style="z-index:999"
    >
      <v-container fluid style="padding: 24px 16px">
        <div class="drawer-title mb-6">
          {{ walletType }} Wallet {{ walletType == "Bitget" ? "Lite" : "" }}
        </div>
        <div class="mobile-invite-panel-content">
          <div class="text-center">
            <img
              class="rotate"
              src="/img/booster/wallet/loading.png"
              width="48"
            />
          </div>
        </div>
        <div v-if="!walletAccount" class="my-5">
          Continue in {{ walletType }} Wallet
          {{ walletType == "Bitget" ? "Lite" : "" }}
        </div>
        <div v-else class="my-5">
          Confirm the signature in your wallet to complete the connect.
        </div>
        <div class="my-5">
          <v-btn
            v-if="!walletAccount"
            class="confirm-btn"
            @click="onConnect(walletType)"
            >Open Wallet</v-btn
          >
          <v-btn v-else class="confirm-btn" @click="onSign(walletType)"
            >Confirm</v-btn
          >
        </div>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { bus } from "@/utils/bus";
import { mapState, mapGetters } from "vuex";
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
    ...mapGetters(["showConnectDrawer"]),

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
      showConnectLoadingDrawer: false,
      walletConnectLoading: false,
      loadingIndex: null,
      walletType: null,
      walletAccount: null,
      walletList: [
        {
          name: "OKX Wallet",
          icon: "/img/booster/wallet/wallet-okx.png",
          type: "OKX",
        },
        {
          name: "WalletConnect",
          icon: "/img/booster/wallet/wallet-walletconnect.png",
          type: "WalletcConnect",
        },
        {
          name: "Bitget Wallet Lite",
          icon: "/img/booster/wallet/wallet-bitget.jpg",
          type: "Bitget",
        },
      ],
    };
  },
  created() {},
  mounted() {
    this.initOkx();
    this.subscription();
  },
  methods: {
    onShowConnect() {
      this.$store.dispatch("ConnectDrawerState", { state });
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
      this.walletAccount = null;
      switch (type) {
        case "OKX":
          this.connectOkxWallet(type);
          break;
        case "WalletcConnect":
          this.onBindWithWalletConnect();
          break;
        case "Bitget":
          this.connectBitget(type);
          break;
        default:
          break;
      }
    },
    async onSign(type) {
      switch (type) {
        case "OKX":
          this.signWithOkx();
          break;
        case "WalletcConnect":
          this.onBindWithWalletConnect();
          break;
        case "Bitget":
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
      try {
        this.showLoading(type);
        const session = await this.okxUniversalProvider.connect({
          namespaces: {
            eip155: {
              chains: ["eip155:1"],
              rpcMap: {},
              defaultChain: "1",
            },
          },
          // optionalNamespaces: {},
          sessionConfig: {
            redirect: "tg://resolve",
          },
        });
        const accounts = session.namespaces.eip155.accounts;
        const account = accounts[0].split(":")[2];
        console.log(account);
        this.walletAccount = account;
        this.msg = await this.getMsg("7");
      } catch (error) {
        console.log("进入错误");
        console.log(error);
        await this.okxUniversalProvider.disconnect();
        this.loadingIndex = null;
        this.walletType = null;
        this.walletAccount = null;
      }
    },
    async signWithOkx() {
      // window.open(
      //   "https://www.okx.com/download?deeplink=okx%3A%2F%2Fweb3%2Fwallet%2Fconnect",
      //   "_self"
      // );

      try {
        const msg = this.msg;
        let chain = "eip155:1";
        let data = {};

        data = {
          method: "personal_sign",
          params: [msg],
          redirect: "tg://resolve",
        };

        const signature = await this.okxUniversalProvider.request(data, chain);

        console.log(signature);

        if (signature) {
          this.onVcode(7, signature);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async onBindWithWalletConnect() {
      const type = 99;
      this.walletConnectLoading = true;
      window.walletConnectModal.subscribeModal((state) => {
        if (!state.open) {
          this.walletConnectLoading = false;
          let modalElement = document.getElementById("wcm-modal");
          if (modalElement) {
            // 设置 z-index 为 100
            modalElement.style.zIndex = 100;
          }
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
    },
    async signWithBitget() {
      try {
        const address = this.walletAccount;
        const msg = this.msg;
        console.log(msg);

        await connector.signMessage({
          method: "personal_sign",
          params: [address, msg],
        });
      } catch (error) {
        console.log(error);
      }
    },
    async setBitgetInfo(account) {
      try {
        this.walletAccount = account;
        this.msg = await this.getMsg("104");
        console.log("walletAccount", this.walletAccount);
      } catch (error) {
        this.loadingIndex = null;
        this.walletType = null;
        this.walletAccount = null;
      }
    },
    async subscription() {
      const _that = this;
      const subscription = connector.onStatusChange(
        (walletInfo) => {
          console.log("onStatusChange", walletInfo);
          const { id, namespaceKey, event, connected, result } = walletInfo;
          switch (event) {
            case "Connect":
              _that.setBitgetInfo(result?.address);
              break;
            case "Disconnect":
              // connected or disconnect logic..
              _that.walletAccount = result?.address;
              break;
            case "SignMessage":
              if (result?.signature) {
                _that.onVcode(104, result?.signature);
              }
              break;
            case "SignTransaction":
            case "SendTransaction":
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
      try {
        let params = {
          type,
        };

        const { data } = await fetchWeb3Vcode(code, params);

        this.$store.dispatch("ConnectDrawerState", { state: false });
        this.showConnectLoadingDrawer = false;
        this.loadingIndex = null;
        this.walletType = null;
        this.walletAccount = null;

        if (data.nodeToken) {
          localStorage.nodeToken = data.nodeToken;
        }
        bus.$emit('showQueryDialogEvent');
        this.$toast2("Connect successfully!", "success");
        this.$setMsg({
          name: "updateUser",
        });
      } catch (error) {
        console.log(error);
      }
    },
    handleToggle(state) {
      this.$store.dispatch("ConnectDrawerState", { state });
    },
    handleLoadingToggle(val) {
      this.showConnectLoadingDrawer = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.invite-drawer-box {
  ::v-deep .invite-drawer {
    width: 100% !important;
    height: 40% !important;
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
    img {
      border-radius: 8px;
    }
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

.confirm-btn {
  background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
  box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
  color: #fff !important;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  width: 100%;
}
</style>
