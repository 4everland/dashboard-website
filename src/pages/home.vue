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
    if (!localStorage.token) {
      location.href = this.$loginUrl;
    } else {
      this.$router.replace("/overview");
    }
  },
};
</script>
