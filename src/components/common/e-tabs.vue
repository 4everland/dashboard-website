<template>
  <div v-if="asMobile && vertical">
    <v-expansion-panels v-model="curIdx">
      <v-expansion-panel v-for="(it, i) in list" :key="i">
        <v-expansion-panel-header>
          {{ it.text }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <component
            :is="it.comp"
            v-bind="it.props"
            :info="info"
            :active="i == curIdx"
            v-if="it.comp && activeIdxList.includes(i)"
          ></component>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>

  <div v-else class="e-settings" :class="vertical ? 'd-flex' : ''">
    <div>
      <v-tabs
        class="tabs"
        :class="vertical ? 'v3-vertical bdr-1' : 'v3-horizon'"
        color="black"
        v-model="curIdx"
        :height="vertical ? null : 44"
        :hide-slider="vertical"
        :vertical="vertical"
      >
        <v-tab
          v-for="(it, i) in list"
          :key="i"
          class="tab"
          :class="{ 'fw-b': curIdx == i }"
        >
          {{ it.text }}
        </v-tab>
      </v-tabs>
    </div>
    <div class="" :class="vertical ? 'flex-1 ml-5' : 'mt-5'">
      <keep-alive
        v-if="bucket"
        :include="['bucket-overview', 'bucket-statistics']"
      >
        <component
          v-if="bucket"
          :is="list[curIdx].comp"
          v-bind="list[curIdx].props"
          :info="info"
        ></component>
      </keep-alive>
      <template v-else>
        <component
          :is="it.comp"
          v-bind="it.props"
          :info="info"
          :active="curItem.comp == it.comp"
          v-show="curItem.comp == it.comp"
          v-for="(it, i) in activeList"
          :key="i"
        ></component>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
    info: Object,
    defTab: Number,
    vertical: Boolean,
    bucket: Boolean,
    width: {
      type: String,
      default: "200px",
    },
    noRouter: Boolean,
    ignorePath: Boolean,
  },
  data() {
    const tabKey = this.vertical ? "sub" : "tab";
    return {
      initPath: "",
      tabKey,
      curIdx: 0,
      activeIdxList: [0],
    };
  },
  watch: {
    curIdx(val) {
      if (this.path != this.initPath && !this.ignorePath) return;
      if (!this.activeIdxList.includes(val)) {
        this.activeIdxList.push(val);
      }
      // if (this.noRouter) return;
      const it = this.list[val];
      if (!it) return;
      const query = { ...this.$route.query };
      const tabVal = it.text.replaceAll(" ", "_").toLowerCase();
      if (query[this.tabKey] == tabVal) return;
      query[this.tabKey] = tabVal;
      for (const key in query) {
        if (!["sub", "tab"].includes(key)) delete query[key];
      }
      if (!this.vertical) {
        delete query.sub;
      }
      this.$router.replace({
        query,
      });
    },
    "$route.query.tab"() {
      if (!this.vertical) this.curIdx = this.getIdx();
    },
    "$route.query.sub"() {
      if (this.vertical) this.curIdx = this.getIdx();
    },
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    path() {
      return this.$route.path;
    },
    curItem() {
      return this.list[this.curIdx] || {};
    },
    activeList() {
      return this.list.filter((_, i) => {
        return this.activeIdxList.includes(i);
      });
    },
  },
  mounted() {
    this.initPath = this.path;
    this.curIdx = this.getIdx();
  },
  methods: {
    getIdx() {
      const tab = this.$route.query[this.tabKey] || this.defTab;
      let curIdx = 0;
      if (tab > -1) curIdx = tab * 1;
      else if (tab) {
        this.list.forEach((it, i) => {
          if (it.text.toLowerCase() == tab.replaceAll("_", " ").toLowerCase())
            curIdx = i * 1;
        });
      }
      return curIdx;
    },
  },
  components: {
    // Bucket
    BucketFolder: () => import("@/views/bucket/components/bucket-folder"),
    BucketOverview: () => import("@/views/bucket/components/bucket-overview"),
    BucketSnapshots: () => import("@/views/bucket/components/bucket-snapshots"),
    BucketStatistics: () =>
      import("@/views/bucket/components/bucket-statistics"),
    // Projects
    ProjOverview: () => import("@/views/hosting/project/proj-overview"),
    ProjDeployments: () => import("@/views/hosting/project/proj-deployments"),
    ProjCommits: () => import("@/views/hosting/project/proj-commits"),
    ProjSettings: () => import("@/views/hosting/project/proj-settings"),
    // Projects-Settings
    StProjGeneral: () => import("@/views/hosting/settings/st-proj-general"),
    StProjDomains: () => import("@/views/hosting/settings/st-proj-domains"),
    StProjGit: () => import("@/views/hosting/settings/st-proj-git"),
    StProjEnv: () => import("@/views/hosting/settings/st-proj-env"),
    StProjAdvanced: () => import("@/views/hosting/settings/st-proj-advanced"),

    // Hosting-Domain
    DomainDomains: () => import("@/views/hosting/domain/domain-domains"),
    DomainEns: () => import("@/views/hosting/domain/domain-ens"),
    DomainSns: () => import("@/views/hosting/domain/domain-sns"),

    // Build-Overview/Build-Source
    BuildOverview: () => import("@/views/hosting/build/build-overview"),
    BuildSource: () => import("@/views/hosting/build/build-source"),

    // Settings-Page
    StAccount: () => import("@/views/settings/st-account"),
    StGeneral: () => import("@/views/settings/st-general"),

    // Gateway-detail
    GatewaySettings: () => import("@/views/gateway/gateway-settings"),
    GatewayAllowlists: () => import("@/views/gateway/gateway-allowlists"),
    GatewayDomains: () => import("@/views/gateway/gateway-domains"),
  },
};
</script>

<style lang="scss">
// .tabs {
//   font-family: "Arial-BoldMT", "Arial";
// }
.v-tab {
  font-family: "Arial-MT";

  letter-spacing: normal !important;
}
.v-tab--active {
  font-family: "Arial-BoldMT", "Arial";
}
.e-settings {
  .v3-horizon {
    .v-slide-group__content {
      border-bottom: 1px solid #d0dae9;
    }
    .v-tab {
      min-width: 110px;
    }
  }
  .theme--light.v-tabs > .v-tabs-bar {
    background-color: transparent;
  }
  .v-tabs-slider {
    background: #775da6;
  }

  .v3-vertical {
    height: 100%;
    .v-tab {
      text-align: left;
    }
    .v-tab--active {
      color: #775da6;
      &::after {
        position: absolute;
        content: "";
        right: -1px;
        top: 50%;
        transform: translateY(-50%);
        height: 20px;
        width: 3px;
        background: #775da6;
        border-radius: 1px;
      }
    }
  }
}
</style>