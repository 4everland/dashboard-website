<template>
  <div>
    <v-dialog v-model="showDialog" max-width="680" persistent>
      <div class="pa-10">
        <div class="mb-6 text-body1">
          Your wallet address is detected as being associated with the Github
          account below, do you want to bind this account for data
          synchronisation?
          <br />
          If so, you will need to verify your Github account.
        </div>
        <div class="grey lighten-4 text-center mb-6 text-body1 py-4">
          <v-icon>mdi-github</v-icon>
          {{ githubName }}
        </div>
        <div class="text-center">
          <v-btn outlined rounded width="120" class="mr-8" @click="createNew"
            >Create new</v-btn
          >
          <v-btn
            rounded
            width="120"
            color="#34A9FF"
            class="white--text"
            @click="bind"
            >Bind</v-btn
          >
        </div>
      </div>
      <div></div>
    </v-dialog>
  </div>
</template>
<script>
import Axios from "axios";

export default {
  data() {
    return {
      showDialog: false,
      githubName: "",
    };
  },
  mounted() {
    this.getInfo();
    this.checkBind();
  },
  methods: {
    async getInfo(flag) {
      const { code } = this.$route.query;
      if (code && !flag) {
        return;
      }
      const { data } = await this.$http.get("/flc", {
        params: {
          _auth: 1,
        },
      });
      if (data.res) {
        this.githubName = data.github.name;
        this.showDialog = true;
      }
    },
    async createNew() {
      await this.$http.get("/flc/done", {
        params: {
          _auth: 1,
        },
      });
      this.showDialog = false;
    },
    async bind() {
      let walletAddress = JSON.parse(localStorage.userInfo).wallet.address;
      const { data } = await this.$http.post(
        "/bind",
        {
          type: 1,
          apply: walletAddress,
        },
        {
          params: {
            _auth: 1,
          },
        }
      );
      if (data.applyR) {
        location.href = data.applyR;
      }
    },
    async checkBind() {
      const { code } = this.$route.query;
      if (!code || code == localStorage.last_github_code) return;
      localStorage.last_github_code = code;
      try {
        await this.$http.get(`/auth/vcode/${code}`, {
          params: {
            _auth: 1,
            type: 1,
          },
          noTip: true,
        });
        this.$alert(" Successfully bound your account.").then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.log(error);
        if (error.code == 5110) {
          this.$alert("Account verification failed").then(() => {
            var url = window.location.href;
            if (url.indexOf("?") != -1) {
              url = url.split("?")[0];
              window.history.pushState({}, 0, url);
            }
            this.getInfo(true);
          });
          return;
        }
      }
    },
    logout() {
      location.reload();
    },

    async isSolana() {
      const isSolana = this.userInfo.solana;
      if (isSolana) {
        const Array = await this.getSignaturesForAddress();
        this.checkBlock(Array);
      }
    },
    async getSignaturesForAddress(signature) {
      // const account = this.userInfo.solana.address;
      // console.log(account);
      let Param = {
        limit: 1000,
        commitment: "confirmed",
      };
      if (signature) {
        Param.before = signature;
      }
      try {
        const { data } = await Axios.post(process.env.VUE_APP_SOLANA_URL, {
          jsonrpc: "2.0",
          id: 1,
          method: "getSignaturesForAddress",
          params: ["Vote111111111111111111111111111111111111111", Param],
        });
        const array = data.result;
        return array;
      } catch (error) {
        console.log(error);
        setTimeout(async () => {
          const signature = this.signature;
          const Array = await this.getSignaturesForAddress(signature);
          this.checkBlock(Array);
        }, 11000);
      }
    },
    async checkBlock(array) {
      if (!array) {
        return;
      }
      const length = array.length;
      let flag = array.find((element) => {
        return element.slot <= 135140758;
      });
      if (flag) {
        console.log(flag);
      } else {
        const signature = array[length - 1].signature;
        this.signature = signature;
        const Array = await this.getSignaturesForAddress(signature);
        this.checkBlock(Array);
      }
    },
  },
};
</script>
