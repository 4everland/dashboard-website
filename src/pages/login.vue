<template>
  <div class="ta-c mt-15">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
</template>

<script>
export default {
  async mounted() {
    const { stoken, test } = this.$route.query;
    if (stoken) {
      this.ssoLogin(stoken);
    } else if (test) {
      this.$prompt("", "Test Token").then(({ value }) => {
        localStorage.clear();
        localStorage.token = value.replace(/'/g, "");
        location.href = "index.html";
      });
    } else if (localStorage.token) {
      location.href = "index.html";
    } else {
      this.onLogin();
    }
  },
  methods: {
    async ssoLogin(stoken) {
      try {
        const { data } = await this.$http.post(`/st/${stoken}`, null, {
          params: {
            _auth: 1,
          },
        });
        this.$onLoginData(data);
      } catch (error) {
        this.onErr(error);
      }
    },
    async onLogin() {
      try {
        const params = {
          _auth: 1,
          redirect_url: location.origin,
          platform: "github",
        };
        if (localStorage.inviteBy) {
          params.inviteCode = localStorage.inviteBy;
        }
        const { data } = await this.$http.get("/login", {
          params,
        });
        location.href = data.login_url;
      } catch (error) {
        this.onErr(error);
      }
    },
    onErr(error) {
      console.log(error);
      this.$alert(error.message).then(() => {
        location.href = this.$loginUrl;
      });
    },
  },
};
</script>
