<template>
  <div>
    <div class="wallet-box">
      <div
        class="wallet-item"
        v-for="(item, index) in walletItem"
        :key="item.name"
        v-ripple="{ class: `info--text` }"
        @click="connect(item.name)"
      >
        <div class="wallet-item-name">
          <span class="name">{{ item.name }}</span>
        </div>
        <div class="d-flex align-center">
          <span class="item-name" :class="{ 'item-name-pop': index == 0 }">{{
            item.btnText
          }}</span>
          <img :src="item.icon" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ExchangeCode,
  ConnectMetaMask,
  SignMetaMask,
  ConnectPhantom,
  SignPhantom,
  ConnectFlow,
  SignFlow,
} from "@/utils/login";
import * as fcl from "@onflow/fcl";

export default {
  props: {
    mode: String,
  },
  data() {
    return {
      walletItem: [
        {
          name: "MetaMask",
          icon: require("@/assets/imgs/metamask.png"),
          btnText: "Popular",
        },
        {
          name: "Phantom",
          icon: require("@/assets/imgs/phantom.png"),
          btnText: "Solana",
        },
        {
          name: "Lilico",
          icon: require("@/assets/imgs/flow.svg"),
          btnText: "Flow",
        },
      ],
    };
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
    connect(name) {
      switch (name) {
        case "MetaMask":
          this.metaMaskConnect();
          break;
        case "Phantom":
          this.phantomConnect();
          break;
        case "Flow":
          this.flowConnect();
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
      const stoken = await SignMetaMask(accounts, nonce, this.inviteCode);
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
      const stoken = await SignPhantom(publicKey, nonce, this.inviteCode);
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
      const stoken = await SignFlow(currentUser.addr, nonce, this.inviteCode);
      if (stoken) {
        this.ssoLogin(stoken);
      }
    },
  },
};
</script>

<style lang="scss">
.wallet-box {
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  // padding: 0 30px;
  .wallet-item {
    height: 70px;
    padding: 25px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border-bottom: 1px solid #e6e8eb;
    &:last-child {
      border-bottom: none;
    }
    &-name {
      display: flex;
      align-items: center;
    }
    img {
      width: 24px;
    }
    .name {
      font-size: 20px;
      font-family: Arial-BoldMT, Arial;
      font-weight: normal;
      color: #495667;
    }
    .item-name {
      width: 60px;
      height: 22px;
      line-height: 22px;
      display: inline-block;
      background-color: #dfdbe7;
      color: #847f8e;
      border-radius: 2px;
      font-size: 12px;
      text-align: center;
      margin-right: 16px;
    }
    .item-name-pop {
      background-color: #775da6;
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
</style>
