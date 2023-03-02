<template>
  <div>
    <e-tabs :list="list" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // list: [
      //   {
      //     text: "Profile",
      //     comp: "account-profile",
      //   },
      //   {
      //     text: "Account Binding",
      //     comp: "st-account",
      //   },
      //   {
      //     text: "General",
      //     comp: "st-general",
      //   },
      // ],
    };
  },
  computed: {
    ...mapGetters(["teamInfo"]),
    hasAccess() {
      if (this.teamInfo.type == "INDIVIDUAL") return true;
      return false;
    },
    list() {
      // this.hasAccess;
      // return [];
      if (this.hasAccess)
        return [
          {
            text: "Profile",
            comp: "account-profile",
          },
          {
            text: "Account Binding",
            comp: "st-account",
          },
          {
            text: "General",
            comp: "st-general",
          },
        ];
      return [
        {
          text: "Profile",
          comp: "account-profile",
        },
      ];
    },
  },
};
</script>