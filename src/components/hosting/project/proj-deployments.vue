<template>
  <div>
    <div>
      <v-skeleton-loader v-if="!list" type="article" />

      <div class="mt-12" v-else-if="!list.length">
        <e-empty> No deployments </e-empty>
      </div>

      <div
        class="pd-20 bd-1 bdrs-3 mb-4"
        :class="{
          'd-flex al-c flex-wrap': !asMobile,
        }"
        v-for="it in list"
        :key="it.taskId"
      >
        <div
          class="d-flex"
          :style="
            asMobile
              ? 'margin-bottom: 10px;'
              : 'width: 300px; margin-right: 30px;'
          "
        >
          <div class="flex-1">
            <a
              :href="`#/hosting/build/${it.buildConfig.name}/${id}/${it.taskId}`"
              class="b"
              >{{ it.buildConfig.name }}</a
            >
            <div class="gray mt-1 fz-13">
              Production
              <!-- (Current) -->
            </div>
          </div>
          <div
            class="ml-5"
            style="width: 80px"
            :class="{
              'ta-r': asMobile,
            }"
          >
            <h-status :val="it.state" />
            <div class="mt-1">
              <e-time :endAt="it.endAt">{{ it.createAt }}</e-time>
            </div>
          </div>
        </div>
        <div class="d-flex al-c flex-1">
          <div class="flex-1 mr-5 shrink-1" v-if="it.commits">
            <div
              class="line-1"
              :style="{
                'max-width': asMobile ? '220px' : '300px',
              }"
            >
              <e-commit :info="it.commits"></e-commit>
            </div>
            <div class="fz-14 mt-1">
              <h-branch :info="it" />
            </div>
          </div>
          <span class="ml-auto"></span>
          <span class="gray fz-13 shrink-0" v-show="!asMobile">
            <e-time
              :value="it.createAt"
              :sub1="'by ' + userInfo.username"
            ></e-time>
          </span>
          <v-menu>
            <template v-slot:activator="{ attrs, on }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                link
                v-clipboard="opt.name == 'copy' ? it.domain || '' : ''"
                @click="onOpt(opt, it)"
                v-for="(opt, i) in optList"
                v-show="getShow(opt, it)"
                :key="i"
              >
                <v-list-item-title>
                  <v-icon size="16">mdi-{{ opt.icon }}</v-icon>
                  <span class="fz-15 ml-2">{{ opt.text }}</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>
    <div
      v-if="list && !finished"
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
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      info: (s) => s.projectInfo,
      userInfo: (s) => s.userInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      optList: [
        {
          text: "Redeploy",
          name: "deploy",
          icon: "send",
        },
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
      ],
      list: null,
      page: 0,
      finished: false,
      loading: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
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
        this.$toast("Copied to clipboard !");
      } else if (name == "deploy") {
        this.onDeploy(it);
      }
    },
    async onDeploy(it) {
      try {
        let html =
          "You are about to create a new Deployment with the same source code as your current Deployment, but with the newest configuration from your Project Settings.";
        await this.$confirm(html, "Redeploy to Production", {
          confirmText: "Redeploy",
        });
        this.$loading();
        const { data } = await this.$http2.post(
          `/project/${it.taskId}/redeploy`
        );
        this.$router.replace(
          `/hosting/build/${it.buildConfig.name}/${this.id}/${data.taskId}`
        );
      } catch (error) {
        console.log(error, "deploy");
        if (error.code == 10014)
          this.$router.push(
            `/hosint/project/${this.info.name}/${this.info.id}?tab=settings&sub=git`
          );
      }
      this.$loading.close();
    },
    onLoad() {
      if (this.loading) return;
      this.loading = true;
      this.getList();
    },
    async getList() {
      try {
        if (this.loading) {
          this.page += 1;
        } else {
          this.page = 0;
          this.finished = false;
        }
        const params = {
          page: this.page,
          size: 10,
        };
        const { data } = await this.$http2.get(
          `/project/task/${this.id}/list`,
          {
            params,
          }
        );
        const rows = data.content;
        this.finished = rows.length < params.size;
        if (this.loading) {
          this.list = [...this.list, ...rows];
        } else {
          this.list = rows;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>