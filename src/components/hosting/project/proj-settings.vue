<style lang="scss">
.proj-settings {
  .bd-1 {
    border-radius: 2px;
    padding: 16px;
  }
}
</style>

<template>
  <div>
    <v-skeleton-loader type="article" v-if="!info.id" />
    <e-tabs
      class="proj-settings"
      :list="list"
      vertical
      query-key="sub"
      v-else
    ></e-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      info: (s) => s.projectInfo,
    }),
  },
  data() {
    return {
      list: [
        {
          comp: "st-proj-general",
          text: "General",
        },
        {
          comp: "st-proj-domains",
          text: "Domains",
        },
        {
          comp: "st-proj-git",
          text: "Git",
        },
        {
          comp: "st-proj-env",
          text: "Environment Variable",
        },
        {
          comp: "st-proj-advanced",
          text: "Advanced",
        },
      ],
    };
  },
};
</script>