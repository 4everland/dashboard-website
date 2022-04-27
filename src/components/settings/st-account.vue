<template>
  <div>
    <v-row>
      <v-col cols="12" md="4" v-for="(it, i) in list" :key="i">
        <div class="item bg-f8a pa-5 bd-1 bdrs-10">
          <div class="d-flex al-c">
            <img :src="`img/svg/settings/${it.icon}.svg`" height="30" />
            <b class="ml-3">{{ it.title }}</b>
          </div>
          <div class="mt-2 gray fz-14" style="min-height: 40px">
            {{ it.desc }}
          </div>
          <div class="mt-3 d-flex al-c">
            <v-btn
              color="primary"
              :disabled="!!it.account"
              rounded
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
let MetaMask;
try {
  MetaMask = new providers.Web3Provider(window.ethereum);
  // eslint-disable-next-line no-empty
} catch (error) {}
export default {
  data() {
    return {
      phantomAddr: "",
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
      return [
        {
          title: "Github",
          desc: "Get verified by connecting your github account.",
          icon: "m-github",
          type: 1,
          account: github.name || github.email,
        },
        {
          title: "MetaMask",
          desc: "Get verified by connecting your metamask account.",
          icon: "m-metamask",
          type: 2,
          account: (info.wallet || {}).address,
        },
        {
          title: "Phantom",
          desc: "Get verified by connecting your phantom account.",
          icon: "m-phantom",
          type: 4,
          account: (info.solana || {}).address,
        },
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
    async onVcode(type, code) {
      try {
        const item = this.list.find((el) => {
          return el.type == type;
        });
        this.$loading("Binding " + item.title);
        this.$loading.close();
        // const { data } =
        await this.$http.get(`/auth/vcode/${code}`, {
          params: {
            _auth: 1,
            type,
          },
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
          this.verifyMetaMask();
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
        const { data } = await this.$http.post(
          "/bind",
          {
            type: it.type,
            apply,
          },
          {
            params: {
              _auth: 1,
            },
          }
        );
        console.log(data);
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
    async exchangeCode(type) {
      let apply = this.connectAddr;
      if (type == 4) {
        apply = this.phantomAddr;
      }
      const { data } = await this.$http.post(
        `/bind`,
        {
          type,
          apply,
        },
        {
          params: {
            _auth: 1,
          },
        }
      );
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
  },
};
</script>
