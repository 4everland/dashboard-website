<template>
  <div>
    <e-tabs :list="list" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["teamInfo"]),
    hasAccess() {
      return (
        this.teamInfo.status !== "DISABLED" &&
        this.teamInfo.access.includes("MEMBER") &&
        this.teamInfo.isMember
      );
    },
    list() {
      if (this.teamInfo.isOwner)
        return [
          {
            text: "Profile",
            comp: "account-profile",
          },
          {
            text: "Account Binding",
            comp: "account-binding",
          },
          {
            text: "General",
            comp: "account-general",
          },
        ];
      if (this.hasAccess) {
        return [
          {
            text: "Profile",
            comp: "account-profile",
          },
          {
            text: "General",
            comp: "account-general",
          },
        ];
      }
      return [
        {
          text: "General",
          comp: "account-general",
        },
      ];
    },
  },
};
</script>