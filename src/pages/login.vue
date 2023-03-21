<template>
  <div class="page-login">
    <app-header />
    <v-container>
      <v-row>
        <v-col cols="12" class="ma-auto">
          <div class="text-center text-h3 font-bold font-weight-bold ma-16" style="color: #495667">
            Login to 4EVERLAND
          </div>

          <div class="wallet">
            <div class="font-weight-bold text-Subtitle-1 mb-4 ml-1" style="color: #495667">
              Connect your wallet
            </div>
            <login-wallet ref="wallet" @walletVerify="onVerify"></login-wallet>
            <!-- <div class="line"></div> -->
            <v-btn block :elevation="0" class="github-btn" @click="onVerify('github')">
              <v-icon class="mr-4"> mdi-github </v-icon>
              Continue with GitHub</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="gitOverlay" width="500">
      <div class="connect-box pa-14">
        <div class="text-caption grey--text text--darken-2 mb-7">
          Github has been disabled for new users, please login with your wallet
          instead.
        </div>
        <v-btn class="start-btn text-subtitle-1 font-weight-black px-10 white--text"
          @click="gitOverlay = false">OK</v-btn>
      </div>
    </v-dialog>
    <v-dialog v-model="lockOverlay" width="500">
      <div class="connect-box pa-14">
        <div class="text-caption grey--text text--darken-2 mb-7">
          Metamask is locked, please open the extension before continuing.
        </div>
        <v-btn class="start-btn text-subtitle-1 font-weight-black px-10 white--text"
          @click="lockOverlay = false">RETRY</v-btn>
      </div>
    </v-dialog>
    <div id="grecaptcha" data-callback="onSubmit" data-size="invisible"></div>
  </div>
</template>

<script>
import * as fcl from "@onflow/fcl";
import AppHeader from "@/views/login/AppHeader.vue";
import AppFooter from "@/views/login/AppFooter.vue";
import LoginWallet from "@/views/login/login-wallet.vue";

const authApi = process.env.VUE_APP_AUTH_URL;
export default {
  name: "Home",
  components: { AppHeader, AppFooter, LoginWallet },
  data() {
    return {
      connectOverlay: false,
      gitOverlay: false,
      lockOverlay: false,
      accounts: "",
      inviteCode: null,
      dialogShow: false,
      sitekey: "6LdPnxclAAAAACTzYeZDztp3dcCKFUIG_5r313JV"

    };
  },
  created() {
    if (localStorage.token) {
      this.$router.replace("/");
    }
  },
  mounted() {
    const { code, inviteCode, loginTo } = this.$route.query;
    if (loginTo) {
      localStorage.loginTo = loginTo;
    }
    if (inviteCode) {
      this.inviteCode = inviteCode;
    }
    if (code) {
      this.getAuth(code);
    }
    this.loaded()

  },
  methods: {
    async onLogin(token) {
      this.$loading();
      try {
        const params = {
          platform: "github",
          appName: "BUCKET",
          entrance: 2,
          inviteCode: this.inviteCode,
          capT: token
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
      this.$loading();
      try {
        const res = await this.$http.post(
          `/auth/${code}`,
          {
            inviteCode: this.inviteCode,
          },
          {
            params: {
              _auth: 1,
            },
          }
        );
        if (res.code === 430) {
          this.gitOverlay = true;
        }
        if (res.code === 200 && res.data.stoken) {
          const stoken = res.data.stoken;
          if (stoken) {
            this.$refs.wallet.ssoLogin(stoken);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    async signMessage() {
      const MSG = Buffer.from("FOO").toString("hex");
      try {
        return await fcl.currentUser.signUserMessage(MSG);
      } catch (error) {
        console.log(error);
      }
    },
    onVerify(name) {
      this.walletName = name
      window.grecaptcha.execute();
    },
    submit(token) {
      if (this.walletName == 'github') {
        this.onLogin(token)
      } else {
        this.$refs.wallet.connect(this.walletName, token)
      }
    },
    loaded() {
      setTimeout(() => {
        window.grecaptcha.render("grecaptcha", {
          sitekey: this.sitekey,
          callback: this.submit
        });
      }, 200);
    }
  },
};
</script>

<style lang="scss">
.page-login {
  background-color: #fff;
  height: 100%;

  .wallet {
    width: 100%;
    max-width: 430px;
    margin: 0 auto;

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
