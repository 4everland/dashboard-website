<template>
  <div>
    <div class="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbsItems">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <v-skeleton-loader
      v-if="!info.deployType"
      type="article"
    ></v-skeleton-loader>
    <e-tabs v-else :list="list" />
  </div>
</template>

<script>
import { mapState } from "vuex";
const list = [
  {
    text: "Overview",
    comp: "proj-overview",
  },
  {
    text: "Deployments",
    comp: "proj-deployments",
  },
  {
    text: "Commits",
    comp: "proj-commits",
  },
  {
    text: "Edit",
    comp: "proj-Edit",
  },
  {
    text: "Domains",
    comp: "proj-Domains",
  },
  {
    text: "Settings",
    comp: "proj-settings",
  },
];

export default {
  computed: {
    ...mapState({
      info: (s) => s.projectInfo,
      noticeMsg: (s) => s.noticeMsg,
      buildInfo: (s) => s.buildInfo,
    }),
    list() {
      let list = [
        {
          text: "Overview",
          comp: "proj-overview",
        },
        {
          text: "Deployments",
          comp: "proj-deployments",
        },
        {
          text: "Commits",
          comp: "proj-commits",
        },
        {
          text: "Edit",
          comp: "proj-Edit",
        },
        {
          text: "Domains",
          comp: "proj-Domains",
        },
        {
          text: "Settings",
          comp: "proj-settings",
        },
      ];
      if (this.hashDeploy) {
        list = list.filter((it) => it.text != "Commits");
      }
      if ((this.hashDeploy && !this.web3Deploy) || !this.hashDeploy) {
        list = list.filter((it) => it.text != "Edit");
      }
      // if (this.greenfieldPlatform) {
      //   list = list.filter((it) => it.text != "Domains");
      // }
      return list;
    },

    hashDeploy() {
      return (
        this.info.deployType == "CID" ||
        this.info.deployType == "IPNS" ||
        this.info.cli
      );
    },
    web3Deploy() {
      return this.info.web3TemplateId;
    },
    // greenfieldPlatform() {
    //   return this.info.platform == "GREENFIELD";
    // },
  },
  data() {
    const { projName, id } = this.$route.params;
    return {
      id,
      projName,
      // list,
      breadcrumbsItems: [
        {
          text: "Projects",
          disabled: false,
          href: "/hosting/projects",
        },
        {
          text: this.$route.params.projName,
          disabled: true,
        },
      ],
    };
  },
  watch: {
    noticeMsg({ name }) {
      if (name == "updateProject") this.getInfo();
    },
    buildInfo({ data }) {
      console.log("project", data.state);
      const { taskId } = this.info.latest || {};
      if (data.state != this.lastState && data.taskId == taskId) {
        this.lastState = data.state;
        this.getInfo();
      }
    },
  },
  mounted() {
    this.$setState({
      allowNoLogin: false,
    });
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        if (this.info.id != this.id) {
          this.$setState({
            projectInfo: {},
          });
        }
        await this.$store.dispatch("getProjectInfo", this.id);
        // console.log(this.info);
      } catch (error) {
        this.$confirm(error.message, "Network Error", {
          confirmText: "Retry",
        }).then(() => {
          this.getInfo();
        });
      }
    },
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
