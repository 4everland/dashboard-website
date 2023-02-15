<style lang="scss">
.proj-settings {
  .bd-1 {
    border-radius: 2px;
    padding: 16px;
  }
}
</style>

<template>
  <div class="main-wrap">
    <v-skeleton-loader type="article" v-if="!info.id" />
    <e-tabs
      v-else
      class="proj-settings"
      :list="list"
      vertical
      query-key="sub"
    ></e-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      info: (s) => s.projectInfo,
      list() {
        // const domains =
        //   this.info.platform == "IPFS"
        //     ? [
        //         {
        //           comp: "st-proj-domains",
        //           text: "Domains",
        //         },
        //       ]
        //     : [];

        const domains =
          this.info.deployType == "CID" ||
          this.info.deployType == "IPNS" ||
          this.info.cli
            ? []
            : [
                {
                  comp: "st-proj-git",
                  text: "Git",
                },
                {
                  comp: "st-proj-env",
                  text: "Environment Variable",
                },
              ];
        return [
          {
            comp: "st-proj-general",
            text: "General",
          },
          // ...domains,
          {
            comp: "st-proj-domains",
            text: "Domains",
          },
          ...domains,
          {
            comp: "st-proj-advanced",
            text: "Advanced",
          },
        ];
      },
    }),
  },
  data() {
    return {};
  },
};
</script>