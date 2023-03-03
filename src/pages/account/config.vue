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
      if (this.teamInfo.type == "INDIVIDUAL") return true;
      return false;
    },
    list() {
      if (this.hasAccess)
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