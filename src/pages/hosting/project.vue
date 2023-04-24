<template>
  <div>
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
  },
  data() {
    const { projName, id } = this.$route.params;
    return {
      id,
      projName,
      // list,
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