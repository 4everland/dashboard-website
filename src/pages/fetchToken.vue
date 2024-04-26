<template>
  <div class="pa-4">Redirecting...</div>
</template>

<script>
export default {
  created() {
    if (localStorage.token) {
      this.goUrl();
    } else {
      localStorage.loginTo = location.pathname + location.search;
      this.$router.push("/login");
    }
  },
  methods: {
    goUrl() {
      const { type } = this.$route.query;
      if (type == "chat") {
        this.goChat();
      } else {
        this.$router.push("/overview");
      }
    },
    goChat() {
      this.$goChat("/login?t=" + encodeURIComponent(localStorage.token), 2);
    },
  },
};
</script>

<style lang="scss" scoped></style>
