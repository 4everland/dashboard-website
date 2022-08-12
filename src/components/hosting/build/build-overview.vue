<template>
  <div>
    <div class="main-wrap auto">
      <v-skeleton-loader type="article" v-if="!info" />
      <v-row v-else>
        <v-col cols="12" md="3">
          <e-link :href="info.domain">
            <v-img
              class="bd-1 bdrs-5 w100p"
              :src="$getImgSrc(info.screenshotPath)"
              lazy-src="/img/bg/empty/project.png"
              aspect-ratio="1"
              max-height="230"
            ></v-img>
          </e-link>
        </v-col>
        <v-col cols="12" md="6">
          <v-row class="pt-1">
            <v-col>
              <e-kv2 label="Status">
                <h-status :val="state"></h-status>
              </e-kv2>
            </v-col>
            <v-col>
              <e-kv2 label="Environment"> Production </e-kv2>
            </v-col>
            <v-col>
              <e-kv2 label="Duration">
                <e-time :endAt="info.endAt || nowDate">{{
                  info.createAt
                }}</e-time>
              </e-kv2>
            </v-col>
            <v-col>
              <e-kv2 label="Created">
                <e-time>{{ info.createAt }}</e-time>
              </e-kv2>
            </v-col>
          </v-row>

          <e-kv2 label="Domain" class="mt-7">
            <e-link :href="'//' + info.domain">
              {{ info.domain }}
            </e-link>
          </e-kv2>

          <div class="mt-7 d-flex">
            <e-kv2 label="Branch">
              <div class="d-flex al-c f-wrap">
                <h-branch :info="info" class="fz-15" />
                <e-commit :info="info.commits" class="fz-14 ml-3"></e-commit>
              </div>
            </e-kv2>
            <e-kv2
              class="ml-auto"
              :label="info.platform"
              style="min-width: 120px"
              v-if="
                info.platform && (projInfo.latest || {}).taskId == info.taskId
              "
            >
              <div class="al-c" v-if="info.hash">
                <e-link
                  class="fz-14"
                  :href="$utils.getCidLink(info.hash, info.platform)"
                >
                  <span>{{ info.hash.cutStr(4, 4) }}</span>
                </e-link>
                <img
                  src="/img/svg/copy.svg"
                  width="12"
                  class="ml-3 hover-1"
                  @success="$toast('Copied to clipboard !')"
                  v-clipboard="info.hash"
                />
              </div>
              <span v-else class="fz-14">Pending</span>
            </e-kv2>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="d-flex">
            <e-menu left offset-x>
              <v-btn slot="ref" text icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
              <v-list>
                <v-list-item
                  link
                  v-clipboard="
                    opt.name == 'copy' ? 'https://' + info.domain || '' : ''
                  "
                  @click="onOpt(opt)"
                  v-for="(opt, i) in optList"
                  :key="i"
                >
                  <v-list-item-title :class="opt.cls">
                    <v-icon size="16" :color="opt.iconColor"
                      >mdi-{{ opt.icon }}</v-icon
                    >
                    <span class="fz-15 ml-2">{{ opt.text }}</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </e-menu>
            <div class="flex-1 ml-5 pr-4">
              <div v-if="!info.cli" class="mb-5">
                <v-btn
                  color="error"
                  outlined
                  block
                  :loading="deploying"
                  @click="onBtn1"
                >
                  {{ btn1Txt }}
                </v-btn>
              </div>
              <v-btn
                block
                :disabled="!isSuccess || !visitUrl"
                color="primary"
                :href="visitUrl"
                target="_blank"
              >
                Visit
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <build-overview-logs
      v-show="info"
      @info="info = $event"
      @state="state = $event"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      info: null,
      state: "",
      deploying: false,
      optList: [
        {
          text: "Copy URL",
          name: "copy",
          icon: "link-variant",
        },
        {
          text: "Delete",
          name: "delete",
          icon: "delete",
          cls: "red-1",
          iconColor: "error",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      nowDate: (s) => s.nowDate,
      projInfo: (s) => s.projectInfo,
    }),
    isSuccess() {
      return this.state == "success";
    },
    showCancel() {
      return ["queued", "running"].includes(this.state);
    },
    btn1Txt() {
      if (this.showCancel) return "Cancel";
      return "Redeploy";
    },
    visitUrl() {
      const { domain } = this.info;
      if (domain) return "//" + domain;
      return "";
    },
  },
  methods: {
    onOpt(opt) {
      let { name } = opt;
      if (name == "copy") {
        this.$toast("Copied to clipboard !");
      } else if (name == "delete") {
        this.onDelete();
      }
    },
    onBtn1() {
      if (this.showCancel) this.onCancel();
      else this.onDeploy();
    },
    async onDeploy() {
      const { projName, id } = this.$route.params;
      try {
        let html =
          "You are about to create a new Deployment with the same source code as your current Deployment, but with the newest configuration from your Project Settings.";
        // html += '<p class="mt-3">The following Domains will point to your new Deployment:</p>'
        await this.$confirm(html, "Redeploy to Production", {
          confirmText: "Redeploy",
        });
        this.deploying = true;

        const { data } = await this.$http2.post(
          `/project/${this.info.taskId}/redeploy`
        );
        this.$router.replace(`/hosting/build/${projName}/${id}/${data.taskId}`);
        setTimeout(() => {
          location.reload();
        }, 800);
      } catch (error) {
        console.log(error, "build err");
        if (error.code == 10014)
          this.$router.push(`/hosting/project/${projName}/${id}?tab=settings`);
      }
      this.deploying = false;
    },
    async onCancel() {
      try {
        let html = `Canceling this deployment will immediately stop the build, with no way to resume.<br><br>
Are you sure you want to continue?`;
        await this.$confirm(html, "Cancel Deployment");
        this.$loading();
        await this.$http2.post(`/project/${this.info.taskId}/cancel`);
        this.$alert("Cancelled successfully.").then(() => {
          location.reload();
        });
      } catch (error) {
        //
      }
      this.$loading.close();
    },
    async onDelete() {
      try {
        let html = `<div class="fz-14 mt-2">
<b>NOTE</b>: Deployments that are not actively receiving any traffic do not generate any costs nor count towards any limits.<br><br>
Deleting this deployment will prevent you from instantly reverting and might break links used in integrations, such as the ones in the pull requests of your Git provider.<br><br>
Are you sure you want to continue?
</div>
`;
        await this.$confirm(html, "Delete Deployment");
        this.$loading();
        await this.$http2.delete("/project/task/object/" + this.info.taskId);
        this.$toast("Deleted successfully.");
        this.$router.back();
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
  },
};
</script>