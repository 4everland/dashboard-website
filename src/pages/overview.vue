<template>
  <div>
    <!-- <v-alert
      text
      type="info"
      dismissible
      dense
      v-if="userInfo.email && !noTip"
      @input="onCloseTip"
    >
      <router-link to="/settings?tab=account_binding&type=3">
        Subscribe to stay up to date on the 4EVERLAND latest news and events.
      </router-link>
    </v-alert> -->
    <!-- <e-tabs :list="list" /> -->
    <v3-overview />
    <new-user-tips />
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
      usageInfo: {},
    };
  },
  created() {
    // this.isSolana(); // move to: overview/new-user-tips.vue
  },
  methods: {
    onCloseTip() {
      localStorage.noEmailTip = "1";
      this.noTip = true;
    },
  },
};
</script>
