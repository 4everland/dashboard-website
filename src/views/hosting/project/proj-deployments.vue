<template>
  <div>
    <div>
      <v-skeleton-loader v-if="!list" type="article" />

      <div class="mt-12" v-else-if="!list.length">
        <e-empty> No deployments </e-empty>
      </div>

      <div
        class="main-wrap auto mb-4 bg-hover-f9"
        v-for="it in list"
        @click="onClick(it)"
        :key="it.taskId"
      >
        <v-row class="d-flex">
          <v-col cols="12" md="9">
            <div>
              <a class="b fw-b fz-18">{{ it.title }}</a>
            </div>
            <div class="al-c mt-2">
              <span class="mr-5 fz-14" v-if="!asMobile">{{ it.platform }}</span>
              <img
                :src="`/img/svg/hosting/h-${it.platform.toLowerCase()}.svg`"
                height="20"
              />
              <a
                class="u ml-2 fz-13"
                :href="projectLink(it)"
                target="_blank"
                @click.stop="onStop"
                style="min-width: 100px"
                v-if="it.cid && it.state == 'SUCCESS'"
              >
                <span v-if="it.platform == 'IPFS'">
                  <!-- {{ it.cid.cutStr(4, 4) }} -->
                  {{ it.cid }}
                </span>
                <span v-if="it.platform == 'IC'">
                  <!-- {{ it.canister.cutStr(4, 4) }} -->
                  {{ it.canister }}
                </span>
                <span v-if="it.platform == 'AR'">
                  <!-- {{ it.arHash.cutStr(4, 4) }} -->
                  {{ it.arHash }}
                </span>
              </a>
              <span
                class="ml-2 fz-13 d-ib"
                v-else-if="it.state == 'FAILURE'"
                style="min-width: 100px"
                >Not synchronized</span
              >
              <span
                class="ml-2 fz-13 d-ib"
                v-else-if="it.state == 'SYNCING'"
                style="min-width: 100px"
                >Syncing</span
              >
              <span v-else class="ml-2 fz-13 d-ib" style="min-width: 100px">{{
                getPlatformName(it)
              }}</span>
              <!-- <template v-if="it.commits">
                <div class="fz-14 ml-5" @click.stop="onStop">
                  <h-branch :info="it" />
                </div>
                <div class="flex-1 ml-5 shrink-1 fz-13">
                  <div
                    :style="{
                      'max-width': asMobile ? '220px' : '300px',
                    }"
                  >
                    <e-commit
                      :info="it.commits"
                      @click.native.stop="onStop"
                    ></e-commit>
                  </div>
                </div>
              </template> -->
              <!-- <template v-if="hashDeploy(it.deployType)">
                <div v-if="it.deployType == 'CID'" class="ml-5">
                  <span class="deploy-origin-type fz-14">IPFS</span>
                  <span class="ml-3 fz-14">Deployment Through IPFS</span>
                </div>
                <div v-else></div>
              </template> -->
            </div>
          </v-col>

          <v-col cols="12" md="3">
            <div class="al-c mt-2">
              <div class="mr-auto ta-c">
                <h-status :val="it.state" />
                <div>
                  <e-time :endAt="it.endAt || nowDate" spanClass="fz-13 gray">{{
                    it.createAt
                  }}</e-time>
                </div>
              </div>
              <span class="gray fz-13 shrink-0 mr-6">
                <e-time :value="it.createAt"></e-time>
              </span>
              <v-menu left offset-x>
                <template v-slot:activator="{ attrs, on }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon size="22">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    link
                    v-clipboard="opt.name == 'copy' ? it.domain || '' : ''"
                    @click="onOpt(opt, it)"
                    v-for="(opt, i) in getOptList(it)"
                    v-show="getShow(opt, it)"
                    :key="i"
                  >
                    <v-list-item-title>
                      <!-- <v-icon size="16">mdi-{{ opt.icon }}</v-icon> -->
                      <span class="fz-15 ml-2">{{ opt.text }}</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
    <div
      v-if="!limit && list && !finished"
      class="pd-20 gray ta-c fz-18 mt-5"
      :class="{
        'hover-1': !loading,
      }"
      @click="onLoad"
      v-intersect="onLoad"
    >
      {{ loading ? "Loading..." : "Load More" }}
    </div>
  </div>
</template>

<script>
import HStatus from "@/views/hosting/common/h-status";
import HBranch from "@/views/hosting/common/h-branch";
import ECommit from "@/views/hosting/common/e-commit";
import { mapState } from "vuex";

export default {
  props: {
    limit: Number,
    active: Boolean,
  },
  computed: {
    ...mapState({
      info: (s) => s.projectInfo,
      userInfo: (s) => s.userInfo,
      nowDate: (s) => s.nowDate,
      projInfo: (s) => s.projectInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    projectLink(it) {
      return function (it) {
        let link = null;
        if (it.platform == "IPFS") {
          link = it.cid;
        } else if (it.platform == "IC") {
          link = it.canister;
        } else {
          link = it.arHash;
        }
        return this.$utils.getCidLink(link, it.platform, this.projInfo.online);
      };
    },
    hashDeploy() {
      return function (type) {
        return type == "CID" || type == "IPNS";
      };
    },
    ownerGithub() {
      return this.info.ownerGithub;
    },
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      list: null,
      page: 0,
      finished: false,
      loading: false,
      refreshing: false,
      lastState: null,
    };
  },
  watch: {
    active(val) {
      if (val) {
        this.list = null;
        this.getList();
      }
    },
    info() {
      if (this.info.id == this.id) {
        this.getList();
      }
    },
  },
  async created() {
    const { id } = this.$route.params;
    await this.$store.dispatch("getProjectInfo", id);
    this.getList();
  },
  methods: {
    onStop() {},
    onClick(it) {
      let link = `/hosting/build/${it.buildConfig.name}/${this.id}/${it.taskId}`;

      if (it.isFirst) link += "?prod=1";
      this.$navTo(link);
    },
    getOptList(it) {
      let arr = [];
      if (
        (!this.hashDeploy(it.deployType) || it.state == "FAILURE") &&
        this.ownerGithub
      ) {
        arr.push({
          text: "Redeploy",
          name: "deploy",
          icon: "send",
        });
      }
      if (it.canRollback && it.platform != "IC")
        arr.push({
          text: "Rollback",
          name: "rollback",
          icon: "arrow-u-left-top",
        });
      return [
        ...arr,
        {
          text: "Inspect Deployment",
          link: "/hosting/build/{projName}/{id}/{taskId}",
          icon: "card-search-outline",
        },
        {
          text: "View Source",
          link: "/hosting/build/{projName}/{id}/{taskId}?tab=source",
          icon: "xml",
        },
        {
          text: "Copy URL",
          name: "copy",
          icon: "link-variant",
        },
      ];
    },
    getShow(opt, it) {
      if (it.cli && opt.name == "deploy") return false;
      return true;
    },
    onOpt(opt, it) {
      let { name, link } = opt;
      if (link) {
        link = link
          .replace("{id}", this.id)
          .replace("{taskId}", it.taskId)
          .replace("{projName}", it.buildConfig.name);
        // console.log(link);
        this.$router.push(link);
      } else if (name == "copy") {
        this.$toast("Copied!");
      } else if (name == "deploy") {
        this.onDeploy(it);
      } else if (name == "rollback") {
        this.onRollback(it);
      }
    },
    async onRollback(it) {
      try {
        let html =
          "The rollback will point to the latest domain without redeploying and will not consume any resources.";
        html +=
          '<div class="mt-3 op-7 fz-14">We recommend that you disable the deploy hook feature in order to prevent project updates from automatically being triggered by the Github updates.</div>';
        await this.$confirm(html, "Rollback to production", {
          confirmText: "Rollback",
        });
        this.$loading();
        await this.$http.put("$hosting/project/task/rollback/" + it.taskId);
        this.list = null;
        await this.$store.dispatch("getProjectInfo", this.id);
        this.$toast("Rollback successfully");
      } catch (error) {
        //
      }
      this.$loading.close();
    },
    async onDeploy(it) {
      console.log(it);
      try {
        let html =
          "Your new deployment will have the same source code as your current deployment, but with the latest configuration from your project settings.";
        await this.$confirm(html, "Redeploy", {
          confirmText: "Redeploy",
        });
        this.$loading();
        const { id } = this.$route.params;
        await this.$store.dispatch("getProjectInfo", id);

        if (it.deployType == "CID" || it.deployType == "IPNS") {
          await this.$http.post(
            `$hosting/project/task/cid/${it.projectId}/deploy/create`
          );
          this.$router.replace("/hosting/projects");
        } else {
          const { data } = await this.$http.post(
            `$hosting/project/${it.taskId}/redeploy`
          );
          this.$router.replace(
            `/hosting/build/${it.buildConfig.name}/${this.id}/${data.taskId}`
          );
        }
      } catch (error) {
        console.log(error, "deploy");
        if (error.code == 10014)
          this.$router.push(
            `/hosting/project/${this.info.name}/${this.info.id}?tab=settings&sub=git`
          );
      }
      this.$loading.close();
    },
    onLoad() {
      if (this.loading || this.refreshing || this.finished) return;
      this.loading = true;
      this.getList();
    },
    async getList() {
      try {
        if (this.loading) {
          this.page += 1;
        } else {
          if (this.refreshing) return;
          this.page = 0;
          this.refreshing = true;
          this.finished = false;
          this.isFirst = false;
        }
        const params = {
          page: this.page,
          size: this.limit || 10,
        };
        const { data } = await this.$http.get(
          `$hosting/project/task/${this.id}/list`,
          {
            params,
          }
        );
        const rows = data.content.map((it) => {
          it.title = it.platform == "IC" ? it.taskId : it.domain;
          if (it.state == "SUCCESS") {
            if (!this.isFirst) {
              this.isFirst = true;
              it.isFirst = true;
            } else it.canRollback = true;
          }
          return it;
        });
        this.finished = rows.length < params.size;
        if (this.loading) {
          this.list = [...this.list, ...rows];
          console.log(list, "list");
        } else {
          this.list = rows;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
      this.refreshing = false;
    },
    getPlatformName(it) {
      if (it.platform == "IPFS") return it.platform;
      if (it.platform == "IC") return "Internet Computer";
      if (it.platform == "AR") return "Arweave";
    },
  },
  components: {
    HStatus,
    HBranch,
    ECommit,
  },
};
</script>
<style lang="scss" scoped>
.deploy-origin-type {
  padding: 3px 9px;
  color: #fff;
  background: #e4eaf3;
  border-radius: 2px;
}
</style>
