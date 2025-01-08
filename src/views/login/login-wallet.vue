<template>
  <div class="wallet-block">
    <div class="wallet-box">
      <div
        class="wallet-item"
        v-for="(item, index) in walletItem"
        :key="item.name"
        v-ripple="{ class: `info--text` }"
        @click="onConnect(item)"
      >
        <div class="wallet-item-name">
          <img class="wallet-item-icon" :src="item.icon" alt="" />
          <span class="name">{{ item.name }}</span>
        </div>
        <div class="d-flex align-center">
          <!-- <span class="item-name" :class="{ 'item-name-pop': index == 0 }">{{
            item.btnText
          }}</span> -->
          <v-btn
            disabled
            :loading="walletConnectLoading && loadingName == item.name"
            icon
          ></v-btn>
        </div>
      </div>
    </div>
    <div id="grecaptcha" data-callback="onSubmit" data-size="invisible"></div>
    <div>
      <v-dialog
        v-model="showQrcode"
        max-width="358"
        :retain-focus="false"
        content-class="qrcode-dialog"
      >
        <div class="qrcode-content">
          <div class="qrcode-title d-flex align-center justify-space-between">
            <span>{{ loadingName }}</span>
            <v-btn
              icon
              color="#fff"
              class="close-icon"
              @click="showQrcode = false"
            >
              <v-icon> mdi-close</v-icon>
            </v-btn>
          </div>

          <div class="qrcode" :style="dialogIcon">
            <v-img max-height="300" max-width="300" :src="qrCodeUrl"></v-img>
          </div>
          <div class="qrcode-footer">
            <div
              class="d-flex align-center justify-space-between fz-16 fw-b"
              style="color: #0f172a"
            >
              <span>Scan To Use {{ loadingName }}</span>
              <v-btn
                icon
                plain
                v-clipboard="qrcodeUri"
                @success="$toast('Copied!')"
                ><img src="/img/svg/account/copy.svg" width="24" alt=""
              /></v-btn>
            </div>
            <div class="mt-2">
              Scan this QR code with your mobile wallet or camera to get
              connected.
            </div>
          </div>
        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import SignClient from "@walletconnect/sign-client";
import qrcode from "qrcode";
import WalletList from "./WalletList";
import {
  ConnectPhantom,
  SignPhantom,
  ConnectFlow,
  SignFlow,
  ConnectPetra,
  SignPetra,
  ConnectWalletCon,
  SignWalletCon,
  ConnectBinance,
  SignBinance,
} from "@/utils/login";
import * as fcl from "@onflow/fcl";

import { sendWeb3Login, fetchWeb3code, sendStoken } from "@/api/login.js";

let _signClient = null;

export default {
  props: {
    mode: String,
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  data() {
    return {
      inviteCode: null,
      sitekey: "6LdPnxclAAAAACTzYeZDztp3dcCKFUIG_5r313JV",
      walletName: "",
      walletConnectLoading: false,
      loadingName: null,
      dialogIcon: {
        "--icon": "",
      },
      loadingIcon: null,
      walletItem: WalletList,
      showQrcode: false,
      qrCodeUrl: "",
      qrcodeUri: "",
      providerDetails: {},
    };
  },
  mounted() {
    window.addEventListener("eip6963:announceProvider", this.eventHandler);

    window.dispatchEvent(new Event("eip6963:requestProvider"));

    const { inviteCode } = this.$route.query;
    if (inviteCode) {
      this.inviteCode = inviteCode;
    }
  },
  beforeDestroy() {
    window.removeEventListener("eip6963:announceProvider", this.eventHandler);
  },
  methods: {
    async eventHandler(event) {
      const newProviderDetail = { ...event.detail };
      const {
        info: { name },
      } = newProviderDetail;
      if (!this.providerDetails[name]) {
        try {
          // this.$set(this.providerDetails, name, newProviderDetail);
          this.providerDetails[name] = newProviderDetail;
        } catch (error) {
          console.log(error);
        }
      }
    },
    async onConnect(item) {
      if (!item.isEvm) {
        this.onConnectWithOther(item);
        return;
      } else if (!this.providerDetails[item.name]) {
        this.onShowQrcode(item);
      } else {
        const providerDetail = this.providerDetails[item.name];
        let accounts = [];
        try {
          accounts = await providerDetail.provider.request({
            method: "eth_requestAccounts",
          });
          const account = accounts[0];
          const nonce = await this.onExchangeCode(account);
          const stoken = await this.onSign(
            account,
            nonce,
            item,
            providerDetail
          );
          if (stoken) {
            await this.ssoLogin(stoken);
          }
        } catch (err) {
          console.error(err);
        }
      }
    },
    async onExchangeCode(account) {
      try {
        const { data } = await fetchWeb3code(account);
        return data.nonce;
      } catch (error) {
        console.log(error);
      }
    },
    async onSign(account, nonce, wallet, providerDetail) {
      try {
        const msg = "0x" + Buffer.from(nonce).toString("hex");
        const signature = await providerDetail.provider.request({
          method: "personal_sign",
          params: [msg, account],
        });

        const send_data = {
          signature,
          appName: "BUCKET",
          inviteCode: this.inviteCode,
          type: "ETH",
          walletType: wallet.walletType,
        };

        const { data } = await sendWeb3Login(account, send_data);
        return data.stoken;
      } catch (error) {
        console.log(error);
      }
    },
    onLoginData(data) {
      console.log(data);
      localStorage.authData = JSON.stringify(data);
      localStorage.token = data.accessToken;
      localStorage.nodeToken = data.nodeToken;
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
        const { data } = await sendStoken(stoken);
        this.onLoginData(data);
      } catch (error) {
        //
      } finally {
        this.$loading.close();
      }
    },
    onConnectWithOther(item) {
      switch (item.name) {
        case "Phantom":
          this.phantomConnect(item);
          break;
        case "Flow":
          this.flowConnect(item);
          break;
        case "Petra":
          this.petraConnect(item);
          break;
        case "WalletConnect":
          this.walletConnect(item);
          break;
        case "Binance Wallet":
          this.binanceConnect(item);
          break;
        default:
          break;
      }
    },
    async phantomConnect() {
      const publicKey = await ConnectPhantom();
      if (!publicKey) {
        return;
      }
      const nonce = await this.onExchangeCode(publicKey);
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
      const nonce = await this.onExchangeCode(currentUser.addr);
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
      const nonce = await this.onExchangeCode(account);
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
    async walletConnect() {
      this.walletConnectLoading = true;
      this.loadingName = "WalletConnect";
      window.walletConnectModal.subscribeModal((state) => {
        if (!state.open) {
          this.walletConnectLoading = false;
        }
      });
      const { session, account } = await ConnectWalletCon();
      if (!account) {
        return;
      }
      const nonce = await this.onExchangeCode(account);
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
    async binanceConnect() {
      const accounts = await ConnectBinance();

      if (!accounts) return;

      const account = accounts[0];

      const nonce = await this.onExchangeCode(account);
      if (!nonce) {
        return;
      }
      const stoken = await SignBinance(
        account,
        nonce,
        this.inviteCode,
        this.capToken
      );
      if (stoken) {
        this.ssoLogin(stoken);
      }
    },
    async onShowQrcode(item) {
      this.walletConnectLoading = true;
      this.loadingName = item.name;
      const { session, account } = await this.init_signClient();
      if (!account) {
        return;
      }
      const nonce = await this.onExchangeCode(account);

      const stoken = await this.onQrcodeSign(account, nonce, item, session);
      if (stoken) {
        await this.ssoLogin(stoken);
      }
    },
    showImTokenQrcode(url, uri) {
      this.qrCodeUrl = url;
      this.qrcodeUri = uri;
      this.chooseIcon();
      this.showQrcode = true;
      this.walletConnectLoading = false;
    },
    onVerify(name) {
      this.$emit("walletVerify", name);
    },
    chooseIcon() {
      let url = this.walletItem.filter((item) => {
        return item.name == this.loadingName;
      });
      console.log(url);
      this.dialogIcon["--icon"] = `url(${url[0].icon})`;
    },
    async init_signClient() {
      _signClient = await SignClient.init({
        projectId: "0c6d755f31c61d762715e95f767f7ef8",
        metadata: {
          name: "4EVERLAND",
          description:
            "As a Web3 infrastructure, 4EVERLAND simplifies the hosting of front-end, the storage of data, and access to the emerging open web, making projects faster and easier to manage.",
          url: "https://dashboard.4everland.org/",
          icons: ["https://4evericon.4everland.store/1024.png"],
        },
      });

      try {
        const { uri, approval } = await _signClient.connect({
          // Optionally: pass a known prior pairing (e.g. from `_signClient.core.pairing.getPairings()`) to skip the `uri` step.
          // pairingTopic: pairing?.topic,
          // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
          requiredNamespaces: {
            eip155: {
              methods: [
                "eth_sendTransaction",
                "eth_signTransaction",
                "eth_sign",
                "personal_sign",
                "eth_signTypedData",
              ],
              chains: ["eip155:1"],
              events: ["chainChanged", "accountsChanged"],
            },
          },
        });
        // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
        if (uri) {
          const url = await qrcode.toDataURL(uri);
          this.showImTokenQrcode(url, uri);
          // Await session approval from the wallet.
          const session = await approval();
          // Handle the returned session (e.g. update UI to "connected" state).
          // Close the QRCode modal in case it was open.
          walletConnectModal.closeModal();

          if (_signClient.session.length) {
            const lastKeyIndex = _signClient.session.keys.length - 1;
            const _session = _signClient.session.get(
              _signClient.session.keys[lastKeyIndex]
            );
            const allNamespaceAccounts = Object.values(_session.namespaces)
              .map((namespace) => namespace.accounts)
              .flat();

            const [namespace, reference, account] =
              allNamespaceAccounts[0].split(":");

            return { session, account };
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    async onQrcodeSign(account, nonce, wallet, session) {
      try {
        const msg = "0x" + Buffer.from(nonce).toString("hex");
        const signature = await _signClient.request({
          topic: session.topic,
          chainId: "eip155:1",
          request: {
            method: "personal_sign",
            params: [msg, account],
          },
        });

        const send_data = {
          signature,
          appName: "BUCKET",
          inviteCode: this.inviteCode,
          type: "ETH",
          walletType: wallet.walletType,
        };
        const { data } = await sendWeb3Login(account, send_data);
        return data.stoken;
      } catch (error) {
        console.log(error);
      }
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

      &-icon {
        width: 32px;
        margin-right: 16px;
        border-radius: 4px;
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

.qrcode-dialog {
  border-radius: 16px !important;
}
.qrcode-content {
  border-radius: 16px;
  background: #6172f3;
}
.qrcode-footer {
  padding: 16px 20px;
  color: #64748b;
  font-size: 12px;
  text-align: center;
  border-radius: 0 0 16px 16px;
  border-top: 1px solid #cbd5e1;
  background: #fff;
}
.qrcode-title {
  padding: 10px 20px;
  font-size: 20px;
  font-weight: bold;
  position: relative;
  border-radius: 16px 16px 0 0;
  color: #fff;
}
.qrcode {
  width: 100%;
  height: 318px;
  padding: 20px;
  border-radius: 16px 16px 0 0;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  background: #fff;
}
.qrcode::after {
  content: "";
  // background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCA0NSA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQzLjYgNy40QzQzLjEgNS4zIDQyLjIgNCA0MS4yIDNDNDAuMiAyIDM4LjggMSAzNi44IDAuNUMzNC44IDAgMzAuMiAwIDMwLjIgMEgxMy45QzEzLjkgMCA5LjQgMCA3LjMgMC41QzUuMyAxIDQgMS45IDIuOSAyLjlDMS45IDMuOSAwLjkgNS4zIDAuNSA3LjNDMCA5LjMgMCAxMy45IDAgMTMuOVYzMC4yQzAgMzAuMiAwIDM0LjcgMC41IDM2LjhDMSAzOC45IDEuOSA0MC4yIDIuOSA0MS4zQzMuOSA0Mi4zIDUuMyA0My4yIDcuMyA0My44QzkuMyA0NC4zIDEzLjkgNDQuMyAxMy45IDQ0LjNIMzAuMkMzMC4yIDQ0LjMgMzQuNyA0NC4zIDM2LjggNDMuOEMzOC45IDQzLjMgNDAuMiA0Mi40IDQxLjIgNDEuM0M0Mi4yIDQwLjMgNDMuMiAzOC45IDQzLjYgMzYuOUM0NC4xIDM0LjkgNDQuMSAzMC4zIDQ0LjEgMzAuM1YxNEM0NC4xIDE0IDQ0LjEgOS41IDQzLjYgNy40Wk0yMi4yIDMyLjdDMTUuMiAzMy4zIDguNyAyOS4yIDguMiAyMi44QzcuNyAxNy42IDExLjEgMTUuMyAxMy43IDE1LjFDMTYuNCAxNC45IDE4LjcgMTYuNyAxOC45IDE4LjlDMTkuMSAyMSAxNy43IDIyIDE2LjggMjIuMUMxNiAyMi4yIDE1LjEgMjEuNyAxNSAyMC44QzE0LjkgMjAgMTUuMyAxOS45IDE1LjIgMTlDMTUuMSAxNy41IDEzLjcgMTcuMyAxMi45IDE3LjRDMTIgMTcuNSAxMC4zIDE4LjUgMTAuNiAyMS4xQzEwLjggMjMuNyAxMy40IDI1LjcgMTYuOCAyNS40QzIwLjQgMjUuMSAyMyAyMi40IDIzLjIgMTguNUMyMy4yIDE4LjMgMjMuMyAxOC4xIDIzLjMgMTcuOUMyMy40IDE3LjggMjMuNCAxNy44IDIzLjQgMTcuN0MyMy41IDE3LjUgMjMuNiAxNy40IDIzLjcgMTcuM0wyNCAxN0MyNS42IDE1LjYgMzEuMyAxMi4xIDM2LjcgMTMuMkgzNi44QzM3IDEzLjIgMzcuMSAxMy4zIDM3LjEgMTMuNUMzOC4xIDI2LjEgMjkuNyAzMi4xIDIyLjIgMzIuN1oiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcikiLz4KPHBhdGggZD0iTTIyLjIgMzIuNzAwMUMxNS4yIDMzLjMwMDEgOC43IDI5LjIwMDEgOC4yIDIyLjgwMDFDNy43IDE3LjYwMDEgMTEuMSAxNS4zMDAxIDEzLjcgMTUuMTAwMUMxNi40IDE0LjkwMDEgMTguNyAxNi43MDAxIDE4LjkgMTguOTAwMUMxOS4xIDIxLjAwMDEgMTcuNyAyMi4wMDAxIDE2LjggMjIuMTAwMUMxNiAyMi4yMDAxIDE1LjEgMjEuNzAwMSAxNSAyMC44MDAxQzE0LjkgMjAuMDAwMSAxNS4zIDE5LjkwMDEgMTUuMiAxOS4wMDAxQzE1LjEgMTcuNTAwMSAxMy43IDE3LjMwMDEgMTIuOSAxNy40MDAxQzEyIDE3LjUwMDEgMTAuMyAxOC41MDAxIDEwLjYgMjEuMTAwMUMxMC44IDIzLjcwMDEgMTMuNCAyNS43MDAxIDE2LjggMjUuNDAwMUMyMC40IDI1LjEwMDEgMjMgMjIuNDAwMSAyMy4yIDE4LjUwMDFDMjMuMiAxOC4zMDAxIDIzLjMgMTguMTAwMSAyMy4zIDE3LjkwMDFDMjMuNCAxNy44MDAxIDIzLjQgMTcuODAwMSAyMy40IDE3LjcwMDFDMjMuNSAxNy41MDAxIDIzLjYgMTcuNDAwMSAyMy43IDE3LjMwMDFMMjQgMTcuMDAwMUMyNS42IDE1LjYwMDEgMzEuMyAxMi4xMDAxIDM2LjcgMTMuMjAwMUgzNi44QzM3IDEzLjIwMDEgMzcuMSAxMy4zMDAxIDM3LjEgMTMuNTAwMUMzOC4xIDI2LjEwMDEgMjkuNyAzMi4xMDAxIDIyLjIgMzIuNzAwMVoiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXIiIHgxPSI0Mi44NzA0IiB5MT0iMS40MDM3IiB4Mj0iLTAuMDU2NjkyNyIgeTI9IjQ0LjA0NTIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzExQzREMSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDYyQUQiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K);
  background-image: var(--icon);
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  width: 45px;
  height: 45px;
  position: absolute;
  border-radius: 4px;
}

.v-dialog,
.v-dialog--active {
  border-radius: 10px;
}
</style>
