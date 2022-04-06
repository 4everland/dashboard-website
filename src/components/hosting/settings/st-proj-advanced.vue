<template>
  <div>
    <div class="bd-1">
      <h3>Directory Listing</h3>
      <div class="d-flex al-c">
        <div class="gray mt-1 fz-14">
          If no index file is present within a directory, the directory contents
          will be displayed.
        </div>
        <div class="ml-auto hide-msg">
          <v-switch v-model="directoryList"></v-switch>
        </div>
      </div>
    </div>

    <div class="bd-1 mt-5">
      <h3>Your Statistics</h3>
      <div class="d-flex al-c mt-1">
        <div class="gray fz-14">
          DApps statistics are displayed on the 4EVERLAND website. If you don't
          want to display it, close the button to hide DApps statistics, but all
          your data is still visible.
        </div>
        <div class="ml-auto">
          <v-switch v-model="isStatis" disabled></v-switch>
        </div>
      </div>
    </div>

    <div class="bd-1 mt-5">
      <div>
        <h3>Delete Project</h3>
        <div class="d-flex al-c">
          <div class="gray fz-14">
            The project will be deleted permanently including deployments and
            domains. You can't undo this action.
          </div>
          <v-btn color="error" small class="ml-auto" @click="onDelete"
            >Delete</v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import mixin from "./st-proj-advanced-mix";

export default {
  mixins: [mixin],
  data() {
    return {
      directoryList: false,
      isStatis: true,
    };
  },
  computed: {
    ...mapState({
      info: (s) => s.projectInfo,
      userInfo: (s) => s.userInfo,
    }),
  },
  watch: {
    async directoryList(val) {
      try {
        this.$loading();
        await this.saveProject({
          directoryList: val,
        });
        this.$loading.close();
      } catch (error) {
        this.directoryList = !val;
      }
    },
  },
  created() {
    this.directoryList = this.info.config.directoryList;
  },
  methods: {
    async onDelete() {
      try {
        await this.onDelProj(this.info);
        this.$router.replace("/hosting/projects");
      } catch (error) {
        console.log(error);
      }
    },
    async saveProject(body) {
      return this.$http2.put("/project/config/" + this.info.id, body);
    },
  },
};
</script>