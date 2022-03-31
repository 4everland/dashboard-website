<template>
  <div>
    <v-skeleton-loader type="article" v-if="!info.id" />
    <e-tabs :list="list" vertical query-key="sub" v-else></e-tabs>
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
          comp: "st-project-general",
          text: "General",
        },
        {
          comp: "st-project-domains",
          text: "Domains",
        },
      ],
    };
  },
};
</script>