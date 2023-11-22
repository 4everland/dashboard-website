<template>
  <div>
    <v-skeleton-loader
      class="mt-2"
      type="article"
      max-width="500"
    ></v-skeleton-loader>
  </div>
</template>

<script>
export default {
  mounted() {
    const { invite, token } = this.$route.query;
    if (invite) {
      localStorage.inviteCode = invite;
    }
    if (token) {
      localStorage.token = token;
    }
    if (!localStorage.token) {
      location.href = this.$getLoginUrl();
    } else if (localStorage.loginTo) {
      localStorage.loginTo = "";
      location.href = loginTo;
    } else {
      this.$router.replace("/overview");
      if (token)
        setTimeout(() => {
          location.reload();
        }, 1e3);
    }
  },
};
</script>
