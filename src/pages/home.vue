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
    const { invite } = this.$route.query;
    if (invite) {
      localStorage.inviteCode = invite;
    }
    if (!localStorage.token) {
      location.href = this.$getLoginUrl();
    } else {
      this.$router.replace("/overview");
    }
  },
};
</script>
