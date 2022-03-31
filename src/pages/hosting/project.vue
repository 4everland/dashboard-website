<template>
  <div>
    <e-tabs :list="list" />
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
  },
  data() {
    const { projName, id } = this.$route.params;
    return {
      id,
      projName,
      list,
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
        this.$confirm(error.message, "", {
          confirmText: "Retry",
        }).then(() => {
          this.getInfo();
        });
      }
    },
  },
};
</script>