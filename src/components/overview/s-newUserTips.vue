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
          <v-btn rounded color="#fff" class="mr-8" @click="createNew"
            >Create new</v-btn
          >
          <v-btn rounded color="#34A9FF" class="white--text" @click="bind"
            >Bind</v-btn
          >
        </div>
      </div>
      <div></div>
    </v-dialog>
    <v-dialog v-model="showSuccess" max-width="680" persistent>
      <div class="pa-10">
        <div class="mb-6 text-body1">
          Successfully bound your account, please login again.
        </div>

        <div class="text-center">
          <v-btn rounded color="#34A9FF" class="white--text" @click="logout"
            >OK</v-btn
          >
        </div>
      </div>
      <div></div>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showDialog: false,
      showSuccess: false,
      githubName: "",
    };
  },
  mounted() {
    this.getInfo();
    this.checkBind();
  },
  methods: {
    async getInfo() {
      const { code } = this.$route.query;
      if (code) {
        localStorage.last_github_code = code;
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
        });
        localStorage.token = "";
        this.showSuccess = true;
      } catch (error) {
        console.log(error);
      }
    },
    logout() {
      location.reload();
    },
  },
};
</script>
