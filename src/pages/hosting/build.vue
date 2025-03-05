<template>
  <div>
    <div class="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbsItems">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <e-tabs :list="list" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          text: "Overview",
          comp: "build-overview",
        },
        {
          text: "Source",
          comp: "build-source",
        },
      ],
      breadcrumbsItems: [
        {
          text: "project",
          disabled: false,
          href: "/hosting/projects",
        },
        {
          text: this.$route.params.projName,
          disabled: false,
          href: `/hosting/project/${this.$route.params.projName}/${this.$route.params.id}`,
        },
        {
          text: 'Deployments',
          disabled: false,
          href: `/hosting/project/${this.$route.params.projName}/${this.$route.params.id}?tab=deployments`,
        },
        {
          text: this.$route.params.taskId.cutStr(6, 4),
          disabled: true,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {

  .breadcrumbs {
    position: static !important;
  }
  .v-breadcrumbs {
    padding: 0 0 16px 0;
    margin-top:-12px;
  }
}
.breadcrumbs {
  position: fixed;
  top: 0;
  left: 230px;
  z-index: 10;
}
</style>