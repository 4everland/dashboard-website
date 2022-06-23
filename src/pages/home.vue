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
    const { invite, redirectTo, token } = this.$route.query;
    if (invite) {
      localStorage.inviteCode = invite;
    }
    if (redirectTo) {
      localStorage.redirectTo = redirectTo;
    }
    if (token) {
      localStorage.token = token;
    }
    if (!localStorage.token) {
      location.href = this.$getLoginUrl();
    } else {
      const toUrl = localStorage.redirectTo;
      if (toUrl) {
        setTimeout(() => {
          localStorage.redirectTo = "";
          location.href =
            toUrl + "/#/?token=" + encodeURIComponent(localStorage.token);
        }, 2e3);
      } else this.$router.replace("/overview");
    }
  },
};
</script>
