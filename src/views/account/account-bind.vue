<template>
  <div class="bg-white px-8 bd-1 bdrs-10">
    <div class="item py-4" v-for="(it, i) in list" :key="i">
      <div class="al-c">
        <img :src="it.icon" alt="" height="50" />
        <div
          class="mt-2 ml-4 fz-14 d-flex flex-column"
          style="min-height: 40px"
        >
          <span class="fz-16">{{ it.title }}</span>
          <span class="mt-2 gray">{{ it.account ? it.account : it.desc }}</span>
        </div>
        <div class="ml-auto d-flex al-c">
          <v-btn
            v-if="it.type == 1 && it.account"
            color="primary"
            width="160"
            max-width="160"
            min-width="75"
            @click="onDisconnect(it)"
            >Disconnect</v-btn
          >

          <v-btn
            v-else-if="it.type == 3"
            color="primary"
            min-width="75"
            width="160"
            max-width="160"
            @click="onBind(it)"
            >{{ it.account ? "Rebind" : "Verify" }}</v-btn
          >
          <v-btn
            v-else
            color="primary"
            :disabled="!!it.account"
            min-width="75"
            width="160"
            max-width="160"
            @click="onBind(it)"
            >{{ it.account ? "Verified" : "Verify" }}</v-btn
          >
        </div>
      </div>
    </div>
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

import WalletList from "@/views/login/WalletList.js";

import { mapState } from "vuex";

import {
  ConnectPhantom,
  GetSignPhantom,
  ConnectFlow,
  GetSignFlow,
  ConnectPetra,
  ConnectWalletCon,
  onSignWalletCon,
  ConnectBinance,
  getSignBinance,
} from "@/utils/login";

import * as fcl from "@onflow/fcl";

import { fetchWeb3codeBind } from "@/api/login.js";

fcl
  .config()
  .put("accessNode.api", process.env.VUE_APP_FLOW_API)
  .put("app.detail.title", "4EVERLAND")
  .put(
    "app.detail.icon",
    "https://eco.4everland.space/logo/4EVERLAND-logo3.png"
  )
  .put("discovery.wallet", process.env.VUE_APP_FLOW_DISCOVERY);

let _signClient = null;

export default {
  data() {
    return {
      phantomAddr: "",
      flowAddr: "",
      okxAddr: "",
      petraAddr: "",
      walletAddr: "",
      loadingName: null,
      dialogIcon: {
        "--icon": "",
      },
      loadingIcon: null,
      showQrcode: false,
      qrCodeUrl: "",
      qrcodeUri: "",
      providerDetails: {},
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      connectAddr: (s) => s.connectAddr,
    }),
    list() {
      const info = this.userInfo;
      const github = info.github || {};
      const wArr = [];
      const noWallet = !info.wallet && !info.solana && !info.onFlow;

      let publicApp = [
        {
          title: "Twitter",
          desc: "Get verified by connecting your twttier account.",
          icon: "/img/svg/settings/m-twitter.svg",
          type: 10,
          account: (info.twitterAccount || {}).name,
        },
        {
          title: "Telegram",
          desc: "Get verified by connecting your telegram account.",
          icon: "/img/svg/settings/m-tg.svg",
          type: 10,
          account: (info.telegramAccount || {}).name,
        },
        {
          title: "Discord",
          desc: "Get verified by connecting your discord account.",
          icon: "/img/svg/settings/m-dc.svg",
          type: 10,
          account: (info.discordAccount || {}).name,
        },
      ];
      let walletArr = WalletList.map((item) => {
        item.title = item.name;
        item.desc = `Get verified by connecting your ${item.name} account.`;
        item.account = (info.wallet || {}).address;

        return item;
      });
      if (noWallet) {
        wArr.push(...walletArr);
      } else {
        // const walletItem = walletArr.filter((item) => {
        //   return item.walletType == info.wallet?.walletType;
        // });

        // wArr.push(...walletArr);

        const walletItem = [];
        const walletType = info.wallet.walletType;

        switch (walletType) {
          case "PHANTOM":
            walletItem.push({
              title: "Phantom",
              account: (info.wallet || {}).address,
              icon: require("@/assets/imgs/phantom.png"),
            });
            break;
          case "PETRA":
            walletItem.push({
              title: "Petra",
              account: (info.wallet || {}).address,
              icon: require("@/assets/imgs/petra.svg"),
            });
            break;
          case "ONFLOW":
            walletItem.push({
              title: "Flow",
              account: (info.wallet || {}).address,
              icon: require("@/assets/imgs/flow.svg"),
            });
            break;
          default:
            walletItem.push({
              title: "EVM Wallet",
              account: (info.wallet || {}).address,
              icon: require("@/assets/imgs/EVM_Wallet.png"),
            });
        }

        wArr.push(...walletItem);
      }
      return [
        {
          title: "Github",
          desc: "Get verified by connecting your github account.",
          icon: "/img/svg/settings/m-github.svg",
          type: 1,
          account: github.name || github.email,
        },
        ...wArr,
        {
          title: "Email",
          desc: "Verify your email address to receive updates and notices for your account.",
          icon: "/img/svg/settings/m-email.svg",
          type: 3,
          account: info.email,
        },
        ...publicApp,
      ];
    },
    query() {
      return this.$route.query;
    },
  },
  watch: {
    query() {
      this.checkQuery();
    },
  },
  mounted() {
    window.addEventListener("eip6963:announceProvider", this.eventHandler);

    window.dispatchEvent(new Event("eip6963:requestProvider"));

    this.onGithubCode();
    this.checkQuery();
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
    checkQuery() {
      const { type, redirect } = this.query;
      if (type) {
        const item = this.list.filter((it) => it.type == type)[0];
        if (item) {
          if (redirect) localStorage.bind_redirect = redirect;
          this.onBind(item);
        }
      }
    },
    onBindSuc() {
      const link = localStorage.bind_redirect;
      if (link) {
        this.$navTo(link);
        localStorage.bind_redirect = "";
      }
    },
    async onGithubCode() {
      const { code } = this.$route.query;
      if (!code || code == localStorage.last_github_code) return;
      localStorage.last_github_code = code;
      this.onVcode(1, code);
    },
    async onVcode(type, code, keyId) {
      try {
        const item = this.list.find((el) => {
          return el.type == type;
        });
        this.$loading("Binding " + item.title);
        this.$loading.close();
        let params = {
          type,
        };
        if (type == 5) {
          params.keyId = keyId;
        }
        const { data } = await this.$http.get(`$auth/auth/vcode/${code}`, {
          params,
        });
        if (data.nodeToken) {
          localStorage.nodeToken = data.nodeToken;
        }
        this.$setMsg({
          name: "updateUser",
        });
        this.$toast(item.title + " binded successfully!");
        this.showQrcode = false;
        this.onBindSuc();
      } catch (error) {
        console.log(error);
      }
    },
    async onBind(item) {
      if (!item.isEvm) {
        this.onConnectWithOther(item);
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
          const params = {
            type: item.type,
            apply: account,
          };
          const nonce = await this.onExchangeCode(params);
          const signature = await this.onSign(account, nonce, providerDetail);
          if (signature) {
            this.onVcode(item.type, signature);
          }
        } catch (err) {
          console.error(err);
        }
      }
    },
    async onUnbind(it) {
      const type = it.type;
      const data = await this.$http.post(`$auth/unbind`, {
        type,
      });
      if (data.code == 200) {
        this.$toast("Disconnect " + it.account + " successfully");
        this.$setMsg("updateUser");
      }
    },
    async onDisconnect(it) {
      const info = this.userInfo;
      if (info.wallet) {
        this.$confirm(
          "You will not be able to login to the Dashboard with Github, and the hosted projects will not be updated andmaintained if you unbundle your Github account. Are you sure you want to proceed?",
          "Disconnect Github",
          {
            confirmText: "OK",
          }
        ).then(() => {
          this.onUnbind(it);
        });
      } else {
        this.$alert(
          "Failed to unbundle the Github account, please try again after binding any wallet address.",
          "Alert"
        );
      }
    },

    async onExchangeCode(params) {
      try {
        const { data } = await fetchWeb3codeBind(params);
        return data.applyR;
      } catch (error) {
        console.log(error);
      }
    },

    async onSign(account, nonce, providerDetail) {
      try {
        const msg = "0x" + Buffer.from(nonce).toString("hex");
        const signature = await providerDetail.provider.request({
          method: "personal_sign",
          params: [msg, account],
        });

        return signature;
      } catch (error) {
        console.log(error);
      }
    },
    async onShowQrcode(item) {
      this.walletConnectLoading = true;
      this.loadingName = item.name;
      const { session, account } = await this.init_signClient();
      if (!account) {
        return;
      }
      const params = {
        type: item.type,
        apply: account,
      };
      const nonce = await this.onExchangeCode(params);

      const signature = await this.onQrcodeSign(account, nonce, session);
      if (signature) {
        this.onVcode(item.type, signature);
      }
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
    showImTokenQrcode(url, uri) {
      this.qrCodeUrl = url;
      this.qrcodeUri = uri;
      this.chooseIcon();
      this.showQrcode = true;
      this.walletConnectLoading = false;
    },
    chooseIcon() {
      let url = WalletList.filter((item) => {
        return item.name == this.loadingName;
      });
      console.log(url);
      this.dialogIcon["--icon"] = `url(${url[0].icon})`;
    },
    async onQrcodeSign(account, nonce, session) {
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

        return signature;
      } catch (error) {
        console.log(error);
      }
    },
    async onBindWithGithub(item) {
      this.$loading();
      const { data } = await this.$http.post("$auth/bind", {
        type: item.type,
        apply: "",
        entranceId: 100,
      });
      const url = data.applyR;
      location.href = url;
    },
    async onBindWithEmail(item) {
      const { value: email } = await this.$prompt(
        "Verify your email to stay up to date on the 4EVERLAND latest news and events.",
        "Verify Email",
        {
          confirmText: "Send",
          inputAttrs: {
            label: `Your email address`,
            rules: [
              (v) => this.$regMap.email.test(v) || "Invalid email address.",
            ],
            required: true,
          },
        }
      );
      this.$loading();
      await this.$http.post("$auth/bind", {
        type: item.type,
        apply: email,
        entranceId: 100,
      });
      const { value: verifyCode } = await this.$prompt(
        "The verification code has been sent to your email address.",
        "Verify Email",
        {
          confirmText: "Verify",
          inputAttrs: {
            label: `Verify code`,
            rules: [(v) => v.trim().length >= 4 || "Invalid code."],
            required: true,
          },
          persistent: true,
        }
      );
      await this.$sleep(100);
      this.onVcode(item.type, verifyCode);
    },
    async onBindWithMedia(item) {
      this.$loading();
      const { data } = await this.$http.get(
        `$auth/redirection/${item.title.toLowerCase()}`
      );
      this.$loading.close();
      return window.open(data);
    },
    async onBindWithPhantom(item) {
      const publicKey = await ConnectPhantom();
      if (!publicKey) {
        return;
      }
      const params = {
        type: item.type,
        apply: publicKey,
      };
      const nonce = await this.onExchangeCode(params);
      if (!nonce) {
        return;
      }
      const signature = await GetSignPhantom(publicKey, nonce);
      if (signature) {
        this.onVcode(item.type, signature);
      }
    },
    async onBindWithFlow(item) {
      fcl.unauthenticate();
      // anywhere on the page
      const currentUser = await ConnectFlow();
      if (!currentUser.addr) {
        return;
      }
      const params = {
        type: item.type,
        apply: currentUser.addr,
      };
      const nonce = await this.onExchangeCode(params);
      if (!nonce) {
        return;
      }
      const { signature, keyId } = await GetSignFlow(currentUser.addr, nonce);
      if (signature) {
        this.onVcode(item.type, signature, keyId);
      }
    },
    async onBindWithPetra(item) {
      const account = await ConnectPetra();
      if (!account) {
        return;
      }
      const params = {
        type: item.type,
        apply: account,
      };
      const nonce = await this.onExchangeCode(params);
      if (!nonce) {
        return;
      }
      const { signature } = await window.aptos.signMessage({
        nonce,
        message: nonce,
      });

      if (signature) {
        this.onVcode(item.type, signature);
      }
    },
    async onBindWithWalletConnect(item) {
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
      const params = {
        type: item.type,
        apply: account,
      };
      const nonce = await this.onExchangeCode(params);
      if (!nonce) {
        return;
      }
      this.walletConnectLoading = false;
      const signature = await onSignWalletCon(session, account, nonce);
      if (signature) {
        this.onVcode(item.type, signature);
      }
    },
    async onBindWithBinance(item) {
      this.walletConnectLoading = true;
      this.loadingName = "Binance Wallet";

      const accounts = await ConnectBinance();
      const account = accounts[0];
      if (!account) {
        return;
      }
      const params = {
        type: item.type,
        apply: account,
      };
      const nonce = await this.onExchangeCode(params);
      if (!nonce) {
        return;
      }
      this.walletConnectLoading = false;
      const signature = await getSignBinance(account, nonce);
      if (signature) {
        this.onVcode(item.type, signature);
      }
    },
    onConnectWithOther(item) {
      switch (item.type) {
        case 1:
          this.onBindWithGithub(item);
          break;
        case 3:
          this.onBindWithEmail(item);
          break;
        case 4:
          this.onBindWithPhantom(item);
          break;
        case 5:
          this.onBindWithFlow(item);
          break;
        case 8:
          this.onBindWithPetra(item);
          break;
        case 10:
          this.onBindWithMedia(item);
          break;
        case 99:
          this.onBindWithWalletConnect(item);
          break;
        case 103:
          this.onBindWithBinance(item);
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.item + .item {
  border-top: 1px solid #d0dae9;
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

:deep .v-dialog,
.v-dialog--active {
  border-radius: 16px !important;
}
</style>
