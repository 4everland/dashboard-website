<template>
  <div>
    <v-alert text type="info" dismissible v-if="!userInfo.email">
      <router-link to="/settings?tab=account_binding&type=3">
        Please subscribe your email address to receive updates and notices for
        your account.
      </router-link>
    </v-alert>
    <e-tabs :list="list" />
  </div>
</template>

<script>
export default {
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  data() {
    return {
      list: [
        {
          text: "Hosting",
          comp: "h-projects",
          props: {
            limit: 5,
          },
        },
        {
          text: "Bucket",
          comp: "s-bucket",
        },
      ],
    };
  },
};
</script>