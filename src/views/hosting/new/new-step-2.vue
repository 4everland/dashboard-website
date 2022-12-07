<template>
  <div>
    <v-dialog v-if="info" v-model="showPop" max-width="720">
      <div class="pa-6">
        <h3 class="fz-20">Congratulations!</h3>
        <div class="gray fz-14 mt-1">
          Your project has been successfully deployed.
        </div>
        <div class="pa-3 pl-0 d-flex al-c">
          <!--  -->
          <v-img
            class="bdrs-5"
            src1="https://static1.4everland.org/bg/party.gif"
            :src="$getImgSrc(info.screenshotPath)"
            lazy-src="/img/bg/empty/project.png"
            aspect-ratio="1"
            max-width="180"
          />
          <div class="ml-5 flex-1">
            <div class="fz-14 mt-5">
              <p>Share on Twitter</p>
              <div class="fz-13">
                <span class="gray-6">Let more people know your DWeb.</span>
                <a
                  class="ml-3 u"
                  :href="`https://twitter.com/intent/tweet?text=${encodeURI(
                    `I've deployed a wonderful Dapp through @4everland_org Hosting, which helps developers quickly build, publish, and manage Dwebs. Come and experience it!  
  Click here to access: https://${info.domain}`
                  )}&hashtags=IPFS,Arweave,Dfinity,Web3`"
                  target="_blank"
                  >Share</a
                >
              </div>
              <p class="mt-5">4EVERLAND Universe</p>
              <div class="fz-13">
                <span class="gray-6"
                  >Join 4EVERLAND Universe to make your project more
                  eye-catching!</span
                >
                <a
                  class="ml-3 u"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeLHwlNcFieeHhoyYJiKDydeZJShhwlerWE9ZsdNrdbgQgLCg/viewform"
                  target="_blank"
                  >Apply</a
                >
              </div>
              <p class="mt-5">Hosting CLI</p>
              <p class="mt-1 gray-6 fz-13">
                We also offer CLI deployment methods. Click here to
                <a
                  href="https://docs.hosting.4everland.org/cli/"
                  class="u"
                  target="_blank"
                  >learn more</a
                >.
              </p>
            </div>
          </div>
        </div>
        <div class="mt-5 ta-c">
          <v-btn
            :to="`/hosting/project/${info.buildConfig.name}/${info.buildConfig.projectId}`"
            color="primary"
            min-width="130"
            class="mr-5"
          >
            Project Detail
          </v-btn>
          <v-btn
            :href="'//' + info.domain"
            target="_blank"
            outlined
            width="120"
          >
            <span>Visit</span>
            <img
              src="/img/svg/hosting/share-open.svg"
              width="14"
              class="ml-2"
            />
          </v-btn>
        </div>
      </div>
    </v-dialog>

    <div class="main-wrap">
      <h3>
        Deploy <span v-if="info">{{ info.buildConfig.name }}</span>
      </h3>

      <div class="d-flex al-c gray fz-15" v-if="info">
        <template v-if="info.isFail">
          <img src="/img/svg/common/ic-error.svg" width="18" />
          <span class="ml-3">{{ failMsg }}</span>
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
      <build-overview-logs in-new @done="isDone = true" @info="onInfo" />
    </div>

    <div class="ta-c mt-4" v-if="!isDone">
      <v-btn outlined @click="onCancel">Cancel</v-btn>
    </div>
  </div>
</template>

<script>
import BuildOverviewLogs from "@/views/hosting/build/build-overview-logs";
export default {
  data() {
    return {
      isDone: false,
      info: null,
      showPop: false,
      errMsg: "",
    };
  },
  computed: {
    failMsg() {
      if (this.info && /fail/i.test(this.info.syncState))
        return "Syncing failed";
      return this.errMsg || "Build failed";
    },
  },
  async created() {
    const { id } = this.$route.query;
    console.log(id);
    await this.$store.dispatch("getProjectInfo", id);
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
    async onCancel() {
      try {
        let html = `Canceling this deployment will immediately stop the build, with no way to resume.<br><br>
Are you sure you want to continue?`;
        await this.$confirm(html, "Cancel Deployment");
        this.$loading();
        await this.$http2.post(`/project/${this.info.taskId}/cancel`);
        await this.$alert("Cancelled successfully.");
      } catch (error) {
        //
      }
      this.goHome();
    },
    onInfo(obj) {
      this.info = obj;
    },
  },
  components: {
    BuildOverviewLogs,
  },
};
</script>