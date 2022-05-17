<template>
  <div>
    <v-alert
      text
      type="info"
      dismissible
      v-if="userInfo.email && !noTip"
      @input="onCloseTip"
    >
      <router-link to="/settings?tab=account_binding&type=3">
        Subscribe to stay up to date on the 4EVERLAND latest news and events.
      </router-link>
    </v-alert>
    <e-tabs :list="list" />
    <new-user-tips />
  </div>
</template>

<script>
import newUserTips from "@/components/overview/s-newUserTips.vue";

export default {
  components: { newUserTips },
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
      noTip: !!localStorage.noEmailTip,
    };
  },
  methods: {
    onCloseTip() {
      localStorage.noEmailTip = "1";
      this.noTip = true;
    },
  },
};
</script>
