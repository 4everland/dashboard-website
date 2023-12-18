<template>
  <div class="wallet-block">
    <div class="wallet-box">
      <div
        class="wallet-item"
        v-for="(item, index) in walletItem"
        :key="item.name"
        v-ripple="{ class: `info--text` }"
        @click="onVerify(item.name)"
      >
        <div class="wallet-item-name">
          <img :src="item.icon" alt="" />
          <span class="name">{{ item.name }}</span>
        </div>
        <div class="d-flex align-center">
          <span class="item-name" :class="{ 'item-name-pop': index == 0 }">{{
            item.btnText
          }}</span>
          <v-btn
            v-if="item.loading"
            disabled
            :loading="walletConnectLoading"
            icon
          ></v-btn>
        </div>
      </div>
    </div>
    <div id="grecaptcha" data-callback="onSubmit" data-size="invisible"></div>
  </div>
</template>

<script>
import {
  ExchangeCode,
  ConnectMetaMask,
  SignMetaMask,
  ConnectOkx,
  SignOkx,
  ConnectPhantom,
  SignPhantom,
  ConnectFlow,
  SignFlow,
  ConnectPetra,
  SignPetra,
  ConnectCoinBase,
  SignCoinBase,
  ConnectWalletCon,
  SignWalletCon,
  ConnectBitget,
  SignBitget,
} from "@/utils/login";
import * as fcl from "@onflow/fcl";

export default {
  props: {
    mode: String,
  },
  data() {
    return {
      inviteCode: null,
      sitekey: "6LdPnxclAAAAACTzYeZDztp3dcCKFUIG_5r313JV",
      walletName: "",
      walletConnectLoading: false,
      walletItem: [
        {
          name: "MetaMask",
          icon: require("@/assets/imgs/metamask.png"),
          btnText: "Popular",
        },
        {
          name: "Coinbase Wallet",
          icon: require("@/assets/imgs/coinbase.png"),
          btnText: "",
        },
        {
          name: "WalletConnect",
          icon: require("@/assets/imgs/walletConnect.svg"),
          btnText: "",
          loading: true,
        },
        {
          name: "OKX Wallet",
          icon: require("@/assets/imgs/okx.png"),
          btnText: "",
        },
        {
          name: "Bitget Wallet",
          icon: require("@/assets/imgs/Bitget.svg"),
          btnText: "",
        },
        {
          name: "Phantom",
          icon: require("@/assets/imgs/phantom.png"),
          btnText: "",
        },
        {
          name: "Petra",
          icon: require("@/assets/imgs/petra.svg"),
          btnText: "",
        },

        {
          name: "Flow",
          icon: require("@/assets/imgs/flow.svg"),
          btnText: "",
        },
      ],
    };
  },
  mounted() {
    const { inviteCode } = this.$route.query;
    if (inviteCode) {
      this.inviteCode = inviteCode;
    }
  },
  methods: {
    onLoginData(data) {
      console.log(data);
      localStorage.authData = JSON.stringify(data);
      localStorage.token = data.accessToken;
      if (this.mode == "refresh") {
        location.reload();
      } else {
        let loginTo = sessionStorage.loginTo || localStorage.loginTo || "/";
        localStorage.loginTo = "";
        location.href = loginTo;
      }
    },
    async ssoLogin(stoken) {
      this.$loading();
      try {
        const { data } = await this.$http.post(`$auth/st/${stoken}`);
        this.onLoginData(data);
      } catch (error) {
        //
      } finally {
        this.$loading.close();
      }
    },
    connect(name, token) {
      this.capToken = token;
      switch (name) {
        case "MetaMask":
          this.metaMaskConnect();
          break;
        case "OKX Wallet":
          this.okxConnect();
          break;
        case "Phantom":
          this.phantomConnect();
          break;
        case "Flow":
          this.flowConnect();
          break;
        case "Petra":
          this.petraConnect();
          break;
        case "Coinbase Wallet":
          this.coinbaseConnect();
          break;
        case "WalletConnect":
          this.walletConnect();
          break;
        case "Bitget Wallet":
          this.bitgetConnect();
          break;
        default:
          break;
      }
    },
    async metaMaskConnect() {
      const accounts = await ConnectMetaMask();
      if (!accounts) {
        return;
      }
      const nonce = await ExchangeCode(accounts[0]);
      if (!nonce) {
        return;
      }
      const stoken = await SignMetaMask(
        accounts[0],
        nonce,
        this.inviteCode,
        this.capToken
      );
      if (stoken) {
        this.ssoLogin(stoken);
      }
    },
    async okxConnect() {
      const accounts = await ConnectOkx();
      if (!accounts) {
        return;
      }
      const nonce = await ExchangeCode(accounts[0]);
      if (!nonce) {
        return;
      }
      // window.alert(nonce);
      const stoken = await SignOkx(
        accounts[0],
        nonce,
        this.inviteCode,
        this.capToken
      );
      if (stoken) {
        this.ssoLogin(stoken);
      }
    },
    async phantomConnect() {
      const publicKey = await ConnectPhantom();
      if (!publicKey) {
        return;
      }
      const nonce = await ExchangeCode(publicKey);
      if (!nonce) {
        return;
      }
      const stoken = await SignPhantom(
        publicKey,
        nonce,
        this.inviteCode,
        this.capToken
      );
      if (stoken) {
        this.ssoLogin(stoken);
      }
    },
    async flowConnect() {
      fcl.unauthenticate();
      // anywhere on the page
      const currentUser = await ConnectFlow();
      if (!currentUser.addr) {
        return;
      }
      const nonce = await ExchangeCode(currentUser.addr);
      if (!nonce) {
        return;
      }
      const stoken = await SignFlow(
        currentUser.addr,
        nonce,
        this.inviteCode,
        this.capToken
      );
      if (stoken) {
        this.ssoLogin(stoken);
      }
    },
    async petraConnect() {
      const account = await ConnectPetra();
      if (!account) {
        return;
      }
      const nonce = await ExchangeCode(account);
      if (!nonce) {
        return;
      }
      const stoken = await SignPetra(
        account,
        nonce,
        this.inviteCode,
        this.capToken
      );
      if (stoken) {
        this.ssoLogin(stoken);
      }
    },
    async coinbaseConnect() {
      const accounts = await ConnectCoinBase();
      if (!accounts) {
        return;
      }
      const nonce = await ExchangeCode(accounts[0]);
      if (!nonce) {
        return;
      }
      const stoken = await SignCoinBase(
        accounts[0],
        nonce,
        this.inviteCode,
        this.capToken
      );
      if (stoken) {
        this.ssoLogin(stoken);
      }
    },
    async walletConnect() {
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
      const nonce = await ExchangeCode(account);
      if (!nonce) {
        return;
      }
      this.walletConnectLoading = false;
      const stoken = await SignWalletCon(
        account,
        nonce,
        this.inviteCode,
        this.capToken,
        session
      );
      if (stoken) {
        this.ssoLogin(stoken);
      }
    },
    async bitgetConnect() {
      const accounts = await ConnectBitget();
      if (!accounts) {
        return;
      }
      const nonce = await ExchangeCode(accounts[0]);
      if (!nonce) {
        return;
      }
      // window.alert(nonce);
      const stoken = await SignBitget(
        accounts[0],
        nonce,
        this.inviteCode,
        this.capToken
      );
      if (stoken) {
        this.ssoLogin(stoken);
      }
    },

    onVerify(name) {
      this.$emit("walletVerify", name);
    },
  },
};
</script>

<style lang="scss">
.wallet-block {
  height: 400px;
  position: relative;
  &::after {
    content: "";
    height: 50px;
    position: absolute;
    left: 0px;
    right: 0px;
    z-index: 10;
    pointer-events: none;
    transition: opacity 1s ease-in-out 0s;
    background: linear-gradient(
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.9) 80%
    );
    bottom: 0px;
    opacity: 1;
  }
  .wallet-box {
    height: 100%;
    overflow: hidden auto;
    // padding: 0 30px;
    padding-bottom: 20px;
    .wallet-item {
      width: 100%;
      max-width: 480px;
      height: 56px;
      background: rgba(140, 140, 161, 0.05);
      border-radius: 8px;
      margin: 0 auto;
      margin-top: 12px;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }

      &-name {
        display: flex;
        align-items: center;
      }

      img {
        width: 32px;
        margin-right: 16px;
      }

      .name {
        font-size: 16px;
        font-family: Arial-BoldMT, Arial;
        font-weight: normal;
        color: #495667;
      }

      .item-name {
        display: inline-block;
        color: #735ea1;
        font-size: 10px;
        text-align: center;
        padding: 4px 8px;
      }

      .item-name-pop {
        background: linear-gradient(270deg, #735ea1 0%, #9747ff 100%);
        border-radius: 8px 0px;
        color: #fff;
      }

      .start-btn {
        color: #3eadff;
        border-radius: 6px;
      }

      &:first-child .start-btn {
        color: #fff;
      }
    }
  }
}
</style>
