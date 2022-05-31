<style lang="scss">
.mobile .projects .v-expansion-panel-header .mdi-chevron-down {
  position: relative;
  right: -16px;
}
.v-item--active .ic-expand {
  transform: rotateX(180deg);
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
    <div class="mb-5 d-flex al-c" v-if="!limit && list.length">
      <v-btn color="primary" rounded to="/hosting/new">
        <img src="img/svg/add1.svg" width="12" />
        <span class="ml-2">New Project</span>
      </v-btn>
      <e-menu open-on-hover offset-y>
        <v-btn slot="ref" outlined rounded min-width="100" class="ml-5">
          <img src="img/svg/hosting/ic-sort.svg" width="12" />
          <span class="ml-2">{{
            sortType == "Active" ? sortArr[0] : sortArr[1]
          }}</span>
        </v-btn>
        <v-list dense>
          <v-list-item-group v-model="sortIdx" color="primary">
            <v-list-item
              @click="onSort(i)"
              v-for="(txt, i) in sortArr"
              :key="i"
            >
              <v-list-item-title>
                <span class="fz-15">{{ txt }}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </e-menu>
    </div>
    <v-expansion-panels v-model="curIdx" multiple :disabled="limit > 0">
      <v-expansion-panel
        class="mb-3"
        v-for="it in list.slice(0, limit)"
        :key="it.id"
        @change="onOpen(it)"
      >
        <v-expansion-panel-header @click="onItem(it)">
          <template v-slot:actions>
            <!-- <v-icon color="primary"> $expand </v-icon> -->
            <img
              src="img/svg/hosting/ic-expand.svg"
              height="20"
              class="ic-expand trans-300"
            />
          </template>
          <v-row>
            <v-col cols="12" md="5">
              <div class="d-flex al-c grow-0">
                <v-img
                  :src="$getImgSrc(it.previewImage)"
                  lazy-src="img/bg/empty/project.png"
                  max-height="60"
                  max-width="60"
                  :aspect-ratio="1"
                  class="bdrs-8 bd-1"
                />
                <div class="ml-5">
                  <h3>{{ it.name }}</h3>
                  <div class="d-flex al-c mt-4" v-if="it.repo && it.repo.id">
                    <e-icon-link
                      class="mr-5 shrink-1"
                      img="img/svg/hosting/m-github-1.svg"
                      :link="it.repo.cloneUrl.replace('.git', '')"
                    >
                      <span class="ml-1 gray-6">{{
                        `${it.repo.namespace}/${it.repo.name}`.cutStr(30)
                      }}</span>
                    </e-icon-link>
                    <e-time span-class="gray-6">{{ it.repo.updateAt }}</e-time>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="4" md="2" class="d-flex al-c f-center">
              <h-status :val="it.state"></h-status>
            </v-col>
            <v-col cols="8" md="5" class="d-flex al-c">
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
                <e-link
                  class="pa-3 d-b"
                  :href="
                    j < 2 ? `#/hosting/statistics/${it.name}/${it.id}` : ''
                  "
                >
                  <component :is="row.comp" :info="row.data" />
                </e-link>
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
              <v-btn
                @click="onDelete(it)"
                color="error"
                small
                outlined
                rounded
                class="ml-3"
                >Delete</v-btn
              >
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="mt-6" v-if="pageLen > 1 && !limit">
      <v-pagination
        @input="onPage"
        v-model="page"
        :length="pageLen"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        :total-visible="7"
      ></v-pagination>
    </div>

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
import mixin from "./settings/st-proj-advanced-mix";

export default {
  mixins: [mixin],
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
    inCurPath() {
      return !this.curPath || this.curPath == this.path;
    },
    pageLen() {
      return Math.ceil(this.total / this.pageSize);
    },
  },
  data() {
    return {
      curIdx: [],
      list: [],
      total: 0,
      loading: false,
      curPath: "",
      page: 1,
      pageSize: 5,
      sortType: "Active", // "All",
      sortIdx: 0,
      sortArr: ["Last Update", "Create Time"],
      refreshAt: Date.now(),
    };
  },
  watch: {
    buildInfo({ data }) {
      if (data.state != this.lastState) {
        console.log(data.taskId, data.state);
        this.lastState = data.state;
        if (this.inCurPath) this.getList();
        else this.needRefresh = true;
      }
    },
    inCurPath(val) {
      // console.log(this.curPath, val);
      if (val) {
        const now = Date.now();
        if (now - this.refreshAt > 10e3) {
          this.needRefresh = true;
        }
        if (this.needRefresh) {
          this.refreshAt = now;
          this.getList();
          this.needRefresh = false;
        }
      }
    },
  },
  mounted() {
    this.getList();
    this.curPath = this.path;
  },
  methods: {
    onStop() {},
    onSort(i) {
      this.sortType = i == 0 ? "Active" : "All";
      this.page = 1;
      this.getList();
    },
    async onDelete(it) {
      try {
        await this.onDelProj(it);
        this.getList();
      } catch (error) {
        console.log(error);
      }
    },
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
            comp: "e-grid-card",
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
            comp: "e-grid-card",
            data: [
              {
                title: "Bandwidth used",
                ...this.$utils.getFileSize(data.usedBandwidth, 1),
              },
              {
                title: "Build Minutes used",
                unit: "Minutes",
                num: data.usedBuildMinutes.toFixed(2),
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
    onPage() {
      this.getList();
    },
    async getList() {
      try {
        if (this.limit) {
          this.sortType = "Active";
        }
        this.curIdx = [];
        if (this.list.length) this.$loading();
        else this.loading = true;
        const {
          data: { list, total },
        } = await this.$http2.get("/project/v3/list", {
          params: {
            page: this.page - 1,
            size: this.pageSize,
            sortType: this.sortType.toUpperCase(),
          },
        });
        this.list = list;
        this.total = total;
        if (this.page > 1 && !list.length) {
          this.page = 1;
          this.getList();
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
      this.$loading.close();
    },
  },
};
</script>
