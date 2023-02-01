<template>
  <div>
    <v-row>
      <v-col cols="12" md="4" v-for="(it, i) in list" :key="i">
        <div class="item bg-white pa-5 bd-1 bdrs-10">
          <div class="d-flex al-c">
            <img :src="`/img/svg/settings/${it.icon}.svg`" height="30" />
            <b class="ml-3">{{ it.title }}</b>
          </div>
          <div class="mt-2 gray fz-14" style="min-height: 40px">
            {{ it.desc }}
          </div>
          <div class="mt-3 d-flex al-c">
            <v-btn
              v-if="it.type == 1 && it.account"
              color="primary"
              small
              min-width="75"
              @click="onDisconnect(it)"
              >Disconnect</v-btn
            >
            <v-btn
              v-else
              color="primary"
              :disabled="!!it.account"
              small
              min-width="75"
              @click="onBind(it)"
              >{{ it.account ? "Verified" : "Verify" }}</v-btn
            >
            <span v-if="it.account" class="ml-auto gray fz-13">
              {{ it.account.cutStr(6, 6) }}
            </span>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { providers } from "ethers";
import { ConnectOkx, ConnectPetra } from "@/utils/login";
import * as fcl from "@onflow/fcl";
fcl
  .config()
  .put("accessNode.api", process.env.VUE_APP_FLOW_API)
  .put("app.detail.title", "4EVERLAND")
  .put(
    "app.detail.icon",
    "https://eco.4everland.space/logo/4EVERLAND-logo3.png"
  )
  .put("discovery.wallet", process.env.VUE_APP_FLOW_DISCOVERY);
let MetaMask;
try {
  MetaMask = new providers.Web3Provider(window.ethereum);
  // eslint-disable-next-line no-empty
} catch (error) {}
export default {
  data() {
    return {
      phantomAddr: "",
      flowAddr: "",
      okxAddr: "",
      petraAddr: "",
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
      if (info.wallet?.walletType == "METAMASK" || noWallet)
        wArr.push({
          title: "MetaMask",
          desc: "Get verified by connecting your metamask account.",
          icon: "m-metamask",
          type: 2,
          account: (info.wallet || {}).address,
        });
      if (info.solana || info.wallet?.walletType == "PHANTOM" || noWallet)
        wArr.push({
          title: "Phantom",
          desc: "Get verified by connecting your phantom account.",
          icon: "m-phantom",
          type: 4,
          account: (info.solana || {}).address,
        });
      if (info.wallet?.walletType == "PETRA" || noWallet)
        wArr.push({
          title: "Petra",
          desc: "Get verified by connecting your Petra account.",
          icon: "m-petra",
          type: 8,
          account: (info.wallet || {}).address,
        });
      if (info.wallet?.walletType == "OKX" || noWallet)
        wArr.push({
          title: "OKX",
          desc: "Get verified by connecting your OKX account.",
          icon: "m-okx",
          type: 7,
          account: (info.wallet || {}).address,
        });
      if (info.onFlow || info.wallet?.walletType == "ONFLOW" || noWallet)
        wArr.push({
          title: "Flow",
          desc: "Get verified by connecting your flow account.",
          icon: "m-flow",
          type: 5,
          account: (info.onFlow || {}).address,
        });
      return [
        {
          title: "Github",
          desc: "Get verified by connecting your github account.",
          icon: "m-github",
          type: 1,
          account: github.name || github.email,
        },
        ...wArr,
        {
          title: "Email",
          desc: "Verify your email address to receive updates and notices for your account.",
          icon: "m-email",
          type: 3,
          account: info.email,
        },
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
    connectAddr(val) {
      if (this.binding == 2 && val) {
        this.binding = null;
        this.verifyMetaMask();
      }
    },
    phantomAddr(val) {
      if (this.binding == 4 && val) {
        this.binding = null;
        this.verifyPhantom();
      }
    },
    flowAddr(val) {
      if (this.binding == 5 && val) {
        this.binding = null;
        this.verifyFlow();
      }
    },
    okxAddr(val) {
      if (this.binding == 7 && val) {
        this.binding = null;
        this.verifyOkx();
      }
    },
    petraAddr(val) {
      if (this.binding == 8 && val) {
        this.binding = null;
        this.verifyPetra();
      }
    },
  },
  mounted() {
    this.onGithubCode();
    this.checkQuery();
  },
  methods: {
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
        // const { data } =
        await this.$http.get(`$auth/auth/vcode/${code}`, {
          params,
        });
        this.$setMsg({
          name: "updateUser",
        });
        this.$toast(item.title + " binded successfully!");
        this.onBindSuc();
      } catch (error) {
        console.log(error);
      }
    },
    async onBind(it) {
      if (it.type == 2) {
        this.binding = 2;
        if (!this.connectAddr) {
          this.$setMsg({
            name: "showMetaConnect",
          });
        } else {
          this.verifyMetaMask();
        }
        return;
      }
      if (it.type == 4) {
        this.binding = 4;
        if (!this.phantomAddr) {
          const publicKey = await this.connectPhantom();
          this.phantomAddr = publicKey;
        } else {
          this.verifyPhantom();
        }
        return;
      }
      if (it.type == 5) {
        this.binding = 5;
        if (!this.flowAddr) {
          const currentUser = await this.connectFlow();
          this.flowAddr = currentUser.addr;
        } else {
          this.verifyFlow();
        }
        return;
      }
      if (it.type == 7) {
        this.binding = 7;
        if (!this.okxAddr) {
          const currentUser = await this.connectOkx();
          this.okxAddr = currentUser;
        } else {
          this.verifyOkx();
        }
        return;
      }
      if (it.type == 8) {
        this.binding = 8;
        if (!this.petraAddr) {
          const currentUser = await this.connectPetra();
          this.petraAddr = currentUser;
        } else {
          this.verifyPetra();
        }
        return;
      }
      // if (it.type != 1) return this.$toast("todo");
      try {
        let apply = "";
        if (it.type == 3) {
          const { value } = await this.$prompt(
            "Verify your email to stay up to date on the 4EVERLAND latest news and events.",
            "Verify Email",
            {
              confirmText: "Send",
              inputAttrs: {
                label: `Your email adress`,
                rules: [
                  (v) => this.$regMap.email.test(v) || "Invalid email adress.",
                ],
                required: true,
              },
            }
          );
          apply = value;
        }
        this.$loading();
        const { data } = await this.$http.post("$auth/bind", {
          type: it.type,
          apply,
        });
        const url = data.applyR;
        if (it.type == 3) {
          const { value } = await this.$prompt(
            "A verify code has benn sended to your email address",
            "Verify Email",
            {
              confirmText: "Verify",
              inputAttrs: {
                label: `Verify code`,
                rules: [(v) => v.trim().length >= 4 || "Invalid code."],
                required: true,
              },
            }
          );
          await this.$sleep(100);
          this.onVcode(3, value);
        } else if (it.type == 1) {
          location.href = url;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async onUnbind(it) {
      const type = it.type;
      const { data } = await this.$http.post(`$auth/unbind`, {
        type,
      });
      console.log(data);
      this.$toast("Disconnect" + item.title + " successfully");
    },
    async onDisconnect(it) {
      const info = this.userInfo;
      if (info.wallet) {
        this.$confirm(
          "You are about to unbind a GitHub account. After then, the projects in Hosting will no longer be updated and maintained, and you won't be able to access the dashboard via GitHub. Please confirm before proceeding.",
          "Disconnect Github",
          {
            confirmText: "OK",
          }
        ).then(() => {
          this.onUnbind(it);
        });
      } else {
        this.$alert(
          "Failed to unbind a GitHub account, please try again after binding any wallet address.",
          "Alert"
        );
      }
    },
    async exchangeCode(type) {
      let apply = this.connectAddr;
      if (type == 4) {
        apply = this.phantomAddr;
      }
      if (type == 5) {
        apply = this.flowAddr;
      }
      if (type == 7) {
        apply = this.okxAddr;
      }
      if (type == 8) {
        apply = this.petraAddr;
      }

      const { data } = await this.$http.post(`$auth/bind`, {
        type,
        apply,
      });
      return data.applyR;
    },
    async verifyMetaMask() {
      try {
        this.$loading();
        const nonce = await this.exchangeCode(2);
        const sig = await MetaMask.getSigner().signMessage(nonce);
        this.$loading.close();
        if (sig) {
          this.onVcode(2, sig);
        }
      } catch (error) {
        this.$alert(error.message);
      }
    },
    async connectPhantom() {
      try {
        const isPhantomInstalled = window.solana && window.solana.isPhantom;
        if (!isPhantomInstalled) {
          window.open("https://phantom.app/", "_blank");
          return console.log("Please install Phantom to use this app.");
        }
        const resp = await window.solana.connect();
        return resp.publicKey.toString();
      } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
      }
    },
    async verifyPhantom() {
      try {
        this.$loading();
        const nonce = await this.exchangeCode(4);
        const encodedMessage = new TextEncoder().encode(nonce);
        const signedMessage = await window.solana.request({
          method: "signMessage",
          params: {
            message: encodedMessage,
          },
        });
        const sig = signedMessage.signature;
        this.$loading.close();
        if (sig) {
          this.onVcode(4, sig);
        }
      } catch (error) {
        this.$alert(error.message);
      }
    },
    async connectFlow() {
      fcl.unauthenticate();
      try {
        await fcl.authenticate();
        return fcl.currentUser.snapshot();
      } catch (err) {
        console.log(err);
      }
    },
    async verifyFlow() {
      try {
        this.$loading();
        const nonce = await this.exchangeCode(5);
        const MSG = Buffer.from(nonce).toString("hex");
        const signUserMessage = await fcl.currentUser.signUserMessage(MSG);
        const sig = signUserMessage[0].signature;
        const keyId = signUserMessage[0].keyId;
        this.$loading.close();
        if (sig) {
          this.onVcode(5, sig, keyId);
        }
      } catch (error) {
        this.$alert(error.message);
      }
    },
    async connectOkx() {
      const accounts = await ConnectOkx();
      const account = accounts[0];
      return account;
    },
    async verifyOkx() {
      try {
        this.$loading();
        const account = this.okxAddr;
        const nonce = await this.exchangeCode(7);
        const sig = await window.okxwallet.request({
          method: "personal_sign",
          params: [account, nonce],
        });
        this.$loading.close();
        if (sig) {
          this.onVcode(7, sig);
        }
      } catch (error) {
        this.$alert(error.message);
      }
    },
    async connectPetra() {
      const account = await ConnectPetra();
      return account;
    },
    async verifyPetra() {
      try {
        this.$loading();
        const nonce = await this.exchangeCode(8);
        const { signature } = await window.aptos.signMessage({
          nonce,
          message: nonce,
        });
        const sig = signature;
        this.$loading.close();
        if (sig) {
          this.onVcode(8, sig);
        }
      } catch (error) {
        this.$alert(error.message);
      }
    },
  },
};
</script>
