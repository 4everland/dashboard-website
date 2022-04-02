<template>
  <div>
    <v-dialog v-if="info" v-model="showPop" max-width="650">
      <div class="pa-5 d-flex al-c">
        <!-- :src="$getImgSrc(info.screenshotPath)" -->
        <!-- lazy-src="img/bg/empty/project.png" -->
        <img
          class="bdrs-5"
          src="https://4ever-web.4everland.store/bg/party.gif"
          aspect-ratio="1"
          width="220"
        />
        <div class="ml-5 flex-1">
          <h3 class="fz-20">Congratulations!</h3>
          <div class="fz-14 mt-5 gray-6">
            <p>Your project has been successfully deployed.</p>
            <p class="mt-4">
              We also offer CLI deployment methods. Click here to
              <a href="https://docs.hosting.4everland.org/cli/" target="_blank"
                >learn more</a
              >.
            </p>
          </div>
          <div class="mt-8">
            <v-btn
              :href="'//' + info.domain"
              target="_blank"
              color="primary"
              rounded
              small
              width="120"
            >
              <span>Visit</span>
              <img
                src="img/svg/hosting/share-open.svg"
                width="14"
                class="ml-2"
              />
            </v-btn>
            <v-btn
              to="/hosting/projects"
              @click="showPop = false"
              outlined
              rounded
              small
              min-width="130"
              class="ml-3"
            >
              Open Dashboard
            </v-btn>
          </div>
        </div>
      </div>
    </v-dialog>

    <div class="main-wrap">
      <h3>
        Deploy <span v-if="info">{{ info.buildConfig.name }}</span>
      </h3>

      <div class="d-flex al-c gray fz-15" v-if="info">
        <template v-if="info.isFail">
          <img src="img/svg/common/ic-error.svg" width="18" />
          <span class="ml-3">{{ errMsg || "Build failed" }}</span>
        </template>
        <template v-else-if="!isDone">
          <v-progress-circular
            :size="15"
            :width="1.5"
            color="#999"
            indeterminate
          />
          <div class="ml-3">
            Deployment started <e-time>{{ info.createAt }}</e-time>
          </div>
        </template>
      </div>
      <build-overview-logs @done="isDone = true" @info="onInfo" />
    </div>

    <div class="ta-r mt-4" v-if="!isDone">
      <v-btn rounded outlined @click="onCancel">Cancel</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDone: false,
      info: null,
      showPop: false,
      errMsg: "",
    };
  },
  watch: {
    isDone(val) {
      if (val)
        setTimeout(() => {
          const { path, query } = this.$route;
          if (path == "/hosting/new" && query.taskId) this.showPop = true;
        }, 500);
    },
    showPop(val) {
      if (!val) this.goHome();
    },
    async "info.isFail"(val) {
      if (!val) {
        this.errMsg = "";
        return;
      }
      try {
        const { data } = await this.$http2.get(
          "/project/task/error/" + this.info.taskId
        );
        if (data) this.errMsg = data.capitalize();
      } catch (error) {
        console.log(error);
      }
    },
  },
  methods: {
    goHome() {
      this.$router.replace("/hosting/projects");
    },
    onCancel() {
      this.$confirm("", "Are you sure to quit this deployment ?").then(() => {
        this.goHome();
      });
    },
    onInfo(obj) {
      this.info = obj;
    },
  },
};
</script>