<template>
  <div>
    <v-dialog
      v-if="info"
      v-model="showPop"
      max-width="948"
      content-class="deploy-success-dialog no-scroll"
    >
      <div class="pa-6 pos-r">
        <div class="pos-a success-title">
          <h3 class="fz-20">Congratulations!</h3>
          <div class="gray fz-14">
            Your project has been successfully deployed.
          </div>
        </div>
        <div class="pt-10 pb-8 d-flex al-c pos-r" style="height: 300px">
          <!--  -->
          <v-img
            class="bdrs-5 pos-a img-bg"
            style="left: -64px"
            src1="https://4ever-web.4everland.store/bg/party.gif"
            :src="$getImgSrc(info.screenshotPath)"
            lazy-src="/img/bg/empty/project.png"
            aspect-ratio="1.6"
            width="400"
          />
          <div class="ml-auto pos-r" style="width: 530px; z-index: 599">
            <div class="fz-14 mt-5">
              <div class="al-c">
                <img
                  width="40"
                  src="/img/svg/hosting/share_twitter.svg"
                  alt=""
                />
                <div class="ml-3">
                  <p class="dialog-title">Share on X</p>
                  <div class="fz-13">
                    <span class="gray-6">Let more people know your DWeb.</span>
                  </div>
                </div>

                <img
                  @click="handleShare"
                  width="20"
                  class="ml-auto cursor-p"
                  src="/img/svg/hosting/deploy_share.svg"
                  alt=""
                />
              </div>

              <div class="al-c">
                <img width="40" src="/img/svg/hosting/universe.svg" alt="" />
                <div class="ml-3">
                  <p class="mt-5 dialog-title">4EVERLAND Universe</p>
                  <div class="fz-13">
                    <span class="gray-6"
                      >Join 4EVERLAND Universe to make your project more
                      eye-catching!</span
                    >
                    <a
                      class="ml-3 u fw-b primary--text"
                      href="https://docs.google.com/forms/d/e/1FAIpQLSeLHwlNcFieeHhoyYJiKDydeZJShhwlerWE9ZsdNrdbgQgLCg/viewform"
                      target="_blank"
                      >Apply</a
                    >
                  </div>
                </div>
              </div>

              <div class="al-c">
                <img width="40" src="/img/svg/hosting/hosting-cli.svg" alt="" />
                <div class="ml-3">
                  <p class="mt-5 dialog-title">Hosting CLI</p>
                  <p class="mt-1 gray-6 fz-13">
                    We also offer CLI deployment methods. Click here to
                    <a
                      href="https://docs.hosting.4everland.org/cli/"
                      class="u fw-b primary--text"
                      target="_blank"
                      >learn more</a
                    >.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ta-c">
          <v-btn
            :to="`/hosting/project/${info.buildConfig.name}/${info.buildConfig.projectId}`"
            color="primary"
            width="300"
            class="mr-0 mb-3 mr-sm-5"
          >
            <img
              src="/img/svg/hosting/detail_icon.svg"
              width="20"
              class="mr-2"
            />
            <span class="fz-12 fw-b"> PROJECT DETAIL </span>
          </v-btn>
          <v-btn
            class="mb-3"
            :href="'//' + info.domain"
            target="_blank "
            outlined
            width="300"
          >
            <img
              src="/img/svg/hosting/visit_icon.svg"
              width="20"
              class="mr-2"
            />
            <span class="fz-12 fw-b">VISIT</span>
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
    <div class="ta-c" v-if="!isDone && !hashDeploy">
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
    hashDeploy() {
      if (!this.info) return true;
      return this.info.deployType == "CID" || this.info.deployType == "IPNS";
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
          if (path == "/hosting/new" && query.taskId) {
            this.showPop = true;
            this.$flowersAnimation();
          }
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
      if (this.info.deployType == "IPNS" || this.info.deployType == "CID")
        return;
      try {
        const { data } = await this.$http.get(
          "$hosting/project/task/error/" + this.info.taskId
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
        await this.$http.post(`$hosting/project/${this.info.taskId}/cancel`);
        await this.$alert("Cancelled successfully.");
      } catch (error) {
        //
      }
      this.goHome();
    },
    onInfo(obj) {
      this.info = obj;
    },
    async handleShare() {
      try {
        await this.$http.post("$auth/share", {}, { noTip: 1 });
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURI(
            `I've deployed a wonderful Dapp through @4everland_org Hosting, which helps developers quickly build, publish, and manage Dwebs. Come and experience it!  
  Click here to access: https://${this.info.domain}`
          )}&hashtags=IPFS,Arweave,Dfinity,Web3,BNBGreenfield`
        );
      } catch (error) {
        console.log(error);
      }
    },
  },
  components: {
    BuildOverviewLogs,
  },
};
</script>

<style lang="scss" scoped>
.dialog-title {
  color: var(--v-primary-base);
  font-size: 14px;
  font-weight: bold;
}
.success-title {
  background: #fe69c7;
  border-radius: 4px;
  padding: 32px 24px 16px 24px;

  color: #fff;
  right: 50px;
  top: -30px;
  > h3 {
    font-size: 32px;
  }
  > div {
    color: #fff;
  }
}
.img-bg {
  border: 4px solid #fff;
  box-shadow: 0px 16px 24px 0px rgba(0, 0, 0, 0.1);
}
</style>
