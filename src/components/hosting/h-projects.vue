<style lang="scss">
.mobile .projects .v-expansion-panel-header .mdi-chevron-down {
  position: relative;
  right: -16px;
}
.projects {
  .v-expansion-panel {
    &::before,
    &::after {
      display: none;
    }
    box-shadow: 0 0 1px #999;
    &:hover {
      box-shadow: 0 1px 4px rgb(153 153 153 / 40%);
    }
    &.v-expansion-panel--active {
      box-shadow: 0 1px 4px rgb(153 153 153 / 45%);
      &:hover {
        box-shadow: 0 1px 4px rgb(153 153 153 / 60%);
      }
    }
  }

  .theme--light.v-expansion-panels .v-expansion-panel--disabled {
    color: rgba(0, 0, 0, 0.87);
    .v-expansion-panel-header {
      pointer-events: all;
    }
  }
}
</style>

<template>
  <div class="projects">
    <div class="mb-5" v-if="!limit && list.length">
      <v-btn color="primary" rounded to="/hosting/new">
        <img src="img/svg/add1.svg" width="12" />
        <span class="ml-2">New Project</span>
      </v-btn>
    </div>
    <v-expansion-panels v-model="curIdx" multiple :disabled="limit > 0">
      <v-expansion-panel
        class="mb-3"
        v-for="(it, i) in list.slice(0, limit)"
        :key="i"
        @change="onOpen(it)"
      >
        <v-expansion-panel-header @click="onItem(it)">
          <v-row>
            <v-col cols="8" md="4">
              <div class="d-flex al-c grow-0">
                <img
                  :src="it.previewImage || 'img/bg/empty/project.png'"
                  height="60"
                  width="60"
                  class="bdrs-8 bd-1"
                />
                <div class="ml-3">
                  <h3>{{ it.name }}</h3>
                </div>
              </div>
            </v-col>
            <v-col cols="4" v-if="!asMobile" class="d-flex al-c f-center">
              <h-status :val="it.state"></h-status>
            </v-col>
            <v-col cols="4" :class="asMobile ? 'ta-c' : 'd-flex al-c'">
              <div v-if="asMobile" class="mb-2">
                <h-status :val="it.state"></h-status>
              </div>
              <v-btn
                :to="getDetailPath(it)"
                @click.stop="onStop"
                class="ml-auto mr-2"
                color="primary"
                rounded
                small
                >View Detail</v-btn
              >
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-skeleton-loader type="article" v-if="!it.statisList" />
          <div class="mt-2" v-else>
            <v-row class="statis-row">
              <v-col
                cols="12"
                md="6"
                lg="4"
                v-for="(row, j) in it.statisList"
                :key="j"
              >
                <div class="pa-3">
                  <component :is="row.comp" :info="row.data" />
                </div>
              </v-col>
              <!-- <v-col cols="4">
                <rect-data :list="it.statis2" />
              </v-col> -->
            </v-row>
            <div class="mt-5 ta-r">
              <v-btn
                v-if="it.taskId"
                color="primary"
                small
                rounded
                outlined
                :to="`/hosting/build/${it.name}/${it.id}/${it.taskId}`"
                >View Build Logs</v-btn
              >
              <v-btn v-else color="error" small outlined rounded class="ml-3"
                >Delete</v-btn
              >
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div class="ta-c">
      <div :class="!limit ? 'main-wrap' : ''" class="pb-15" v-if="!list.length">
        <div
          :style="{
            height: loading ? '80px' : '60px',
          }"
        ></div>
        <e-empty :loading="loading" :title="loading ? '' : 'No Projects, Yet!'">
          {{
            loading
              ? "Loading projects..."
              : "Create a project from a template, or import a Git repository."
          }}
        </e-empty>
        <div class="mt-10" v-if="!loading">
          <v-btn color="primary" rounded to="/hosting/new"
            >Create a New Project</v-btn
          >
        </div>
      </div>
      <div class="mt-8" v-else-if="limit">
        <v-btn color="primary" rounded outlined to="/hosting/projects"
          >View More</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    limit: Number,
  },
  computed: {
    ...mapState({
      buildInfo: (s) => s.buildInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    path() {
      return this.$route.path;
    },
    inPage() {
      return !this.pagePath || this.pagePath == this.path;
    },
  },
  data() {
    return {
      curIdx: [],
      list: [],
      loading: false,
      pagePath: "",
    };
  },
  watch: {
    buildInfo({ data }) {
      if (data.state != this.lastState) {
        console.log(data.taskId, data.state);
        this.lastState = data.state;
        if (this.inPage) this.getList();
        else this.needRefresh = true;
      }
    },
    inPage(val) {
      // console.log(this.pagePath, val);
      if (val && this.needRefresh) {
        this.needRefresh = false;
        this.getList();
      }
    },
  },
  mounted() {
    this.getList();
    this.pagePath = this.path;
  },
  methods: {
    onStop() {},
    getDetailPath(it) {
      return `/hosting/project/${it.name}/${it.id}`;
    },
    onItem(it) {
      if (!this.limit) return;
      const path = this.getDetailPath(it);
      this.$router.push(path);
    },
    async onOpen(it) {
      if (it.loading || it.statisList) return;
      try {
        it.loading = true;
        const { data } = await this.$http2.get("/project/v3/detail/" + it.id);
        console.log(data);
        data.name = it.name;
        const statisList = [
          {
            comp: "rect-data",
            data: [
              {
                title: "New Users",
                num: data.newUsers,
              },
              {
                title: "Total Users",
                num: data.totalUsers,
              },
              {
                title: "Total UV",
                num: data.totalUV,
              },
              {
                title: "Total PV",
                num: data.totalPV,
              },
            ],
          },
          {
            comp: "rect-data",
            data: [
              {
                title: "Bandwidth used",
                ...this.$utils.getFileSize(data.usedBandwidth, 1),
              },
              {
                title: "Build Minutes used",
                unit: "Minutes",
                num: data.usedBuildMinutes,
              },
              {
                title: "Storage used",
                ...this.$utils.getFileSize(data.usedStorage, 1),
              },
            ],
          },
          {
            comp: "h-build-domain",
            data,
          },
        ];
        this.$set(it, "statisList", statisList);
        if (data.latest) {
          this.$set(it, "taskId", data.latest.taskId);
        }
      } catch (error) {
        console.log(error);
      }
      it.loading = false;
    },
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http2.get("/project/v3/list");
        this.list = data.list;
        // .map((it) => {
        //   return it;
        // });
        this.total = data.total;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>