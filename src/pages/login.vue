<template>
  <div class="home">
    <app-header />
    <v-container>
      <v-row class="mt-16">
        <v-col cols="12" class="ma-auto">
          <div
            class="text-center text-h3 font-bold font-weight-bold ma-16"
            style="color: #495667"
          >
            Login to 4EVERLAND
          </div>

          <div class="wallet">
            <div
              class="font-weight-bold text-Subtitle-1 mb-4 ml-1"
              style="color: #495667"
            >
              Connect your wallet
            </div>
            <div class="wallet-box">
              <div
                class="wallet-item"
                v-for="item in walletItem"
                :key="item.name"
                v-ripple="{ class: `info--text` }"
                @click="connect(item.name)"
              >
                <div class="wallet-item-name">
                  <span class="name">{{ item.name }}</span>
                </div>
                <img :src="item.icon" alt="" />

                <!-- <v-btn
                  :elevation="0"
                  class="start-btn text-subtitle-2"
                  :color="index == 0 ? '#34A9FF' : '#eef7ff'"
                  small
                  >{{ item.btnText }}</v-btn
                > -->
              </div>
            </div>
            <!-- <div class="line"></div> -->
            <v-btn block :elevation="0" class="github-btn" @click="onLogin">
              <v-icon class="mr-4"> mdi-github </v-icon>
              Continue with GitHub</v-btn
            >
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="gitOverlay" width="500">
      <div class="connect-box pa-14">
        <div class="text-caption grey--text text--darken-2 mb-7">
          New Github accounts will no longer be supported, please connect your
          wallet to login instead.
        </div>
        <v-btn
          class="start-btn text-subtitle-1 font-weight-black px-10 white--text"
          @click="gitOverlay = false"
          >OK</v-btn
        >
      </div>
    </v-dialog>
    <v-dialog v-model="lockOverlay" width="500">
      <div class="connect-box pa-14">
        <div class="text-caption grey--text text--darken-2 mb-7">
          Metamask is locked, please open the extension before continuing.
        </div>
        <v-btn
          class="start-btn text-subtitle-1 font-weight-black px-10 white--text"
          @click="lockOverlay = false"
          >RETRY</v-btn
        >
      </div>
    </v-dialog>
  </div>
</template>
<script>
import * as fcl from "@onflow/fcl";
import AppHeader from "@/components/login/AppHeader.vue";
import AppFooter from "@/components/login/AppFooter.vue";
import {
  ExchangeCode,
  ConnectMetaMask,
  SignMetaMask,
  ConnectPhantom,
  SignPhantom,
  ConnectFlow,
  SignFlow,
} from "@/utils/index.js";
const authApi = process.env.VUE_APP_AUTH_URL;
const BUCKET_HOST = process.env.VUE_APP_BUCKET_HOST;
export default {
  name: "Home",
  components: { AppHeader, AppFooter },
  data() {
    return {
      connectOverlay: false,
      gitOverlay: false,
      lockOverlay: false,
      accounts: "",
      inviteCode: null,
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
          name: "Flow",
          icon: require("@/assets/imgs/flow.svg"),
          btnText: "Flow",
        },
      ],
    };
  },
  created() {
    const code = this.$route.query.code;
    const inviteCode = this.$route.query.inviteCode;
    if (inviteCode) {
      this.inviteCode = inviteCode;
    }
    if (code) {
      this.getAuth(code);
    }
  },
  mounted() {},
  methods: {
    async onLogin() {
      try {
        const params = {
          platform: "github",
          appName: "BUCKET",
          entrance: 2,
          inviteCode: this.inviteCode,
        };
        const { data } = await this.$axios.get(`${authApi}/login`, {
          params,
        });
        location.href = data.data.login_url;
      } catch (error) {
        console.log(error);
      }
    },
    async getAuth(code) {
      try {
        const { data } = await this.$axios.post(`${authApi}/auth/${code}`, {
          inviteCode: this.inviteCode,
        });
        if (data.code === 430) {
          this.gitOverlay = true;
        }
        if (data.code === 200 && data.data.stoken) {
          // location.href = `${BUCKET_HOST}/login?stoken=${data.data.stoken}`;
          const stoken = data.data.stoken;
        }
      } catch (error) {
        console.log(error);
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
    },
    async signMessage() {
      const MSG = Buffer.from("FOO").toString("hex");
      try {
        return await fcl.currentUser.signUserMessage(MSG);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  .wallet {
    width: 100%;
    max-width: 430px;
    margin: 0 auto;
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
        .start-btn {
          color: #3eadff;
          border-radius: 6px;
        }
        &:first-child .start-btn {
          color: #fff;
        }
      }
    }
    .line {
      width: 112px;
      height: 1px;
      border-bottom: 1px solid #e6e8eb;
      margin: 0 auto;
      margin-top: 24px;
    }
    .github-btn {
      width: 100%;
      max-width: 430px;
      height: 60px;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      border: 1px solid #e6e8eb;
      background-color: #fff;
      color: #b7babe;
      margin: 0 auto;
      margin-top: 38px;
      font-size: 18px;
    }
  }
}
.connect-box {
  width: 500px;
  min-height: 200px;
  background-color: #fff;
  border-radius: 15px;
  text-align: center;
  margin: 0 auto;
  .start-btn {
    background: linear-gradient(90deg, #fdb6fe, #acc0fd, #31adfe);
    border-radius: 44px;
  }
}
</style>
