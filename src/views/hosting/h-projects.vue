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
    <e-right-opt-wrap>
      <e-menu open-on-hover offset-y>
        <v-btn slot="ref" outlined min-width="100">
          <!-- <img src="/img/svg/hosting/ic-sort.svg" width="12" /> -->
          <span class="ml-2">{{
            sortType == "Active" ? sortArr[0] : sortArr[1]
          }}</span>
          <v-icon>mdi-chevron-down</v-icon>
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
      <v-btn class="ml-5" color="primary" to="/hosting/new">
        <img src="/img/svg/add1.svg" width="12" />
        <span class="ml-2">New Project</span>
      </v-btn>
    </e-right-opt-wrap>

    <div class="pt-4">
      <v-expansion-panels v-model="curIdx" multiple>
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
                src="/img/svg/hosting/ic-expand.svg"
                height="20"
                class="ic-expand trans-300"
              />
            </template>
            <v-row>
              <v-col cols="12" md="4">
                <div class="d-flex al-c grow-0">
                  <v-img
                    :src="$getImgSrc(it.previewImage)"
                    @click.stop="$navTo(getDetailPath(it))"
                    lazy-src="/img/bg/empty/project.png"
                    max-height="60"
                    max-width="60"
                    :aspect-ratio="1"
                    class="bdrs-8 bd-1"
                  />
                  <div class="ml-5 flex-1">
                    <div class="d-flex al-c">
                      <h3
                        @click.stop="$navTo(getDetailPath(it))"
                        :style="{
                          'min-width': asMobile ? '100px' : '160px',
                        }"
                        class="mb-0 hover-1"
                      >
                        {{
                          it.name.cutStr(asMobile ? 6 : 10, asMobile ? 4 : 6)
                        }}
                      </h3>
                      <div class="ml-auto" v-if="asMobile">
                        <!-- @click.native.stop="onStatus(it)" -->
                        <h-status :val="it.state"></h-status>
                      </div>
                    </div>
                    <div class="al-c mt-4">
                      <img
                        :src="`/img/svg/hosting/h-${it.platform.toLowerCase()}.svg`"
                        height="20"
                      />
                      <a
                        class="u ml-2 fz-12 gray"
                        :href="$utils.getCidLink(it.hash, it.platform)"
                        target="_blank"
                        @click.stop="onStop"
                        v-if="it.hash && it.state == 'SUCCESS'"
                      >
                        {{ it.hash.cutStr(4, 4) }}
                      </a>
                      <span v-else-if="it.state == 'FAILURE'" class="ml-1 fz-14"
                        >Not synchronized</span
                      >
                      <span v-else-if="it.state == 'SYNCING'" class="ml-1 fz-14"
                        >Syncing</span
                      >
                      <span v-else class="ml-1 fz-14">{{
                        it.platform == "IC" ? "Internet Computer" : it.platform
                      }}</span>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="ta-c mb-4 mt-2" v-if="!asMobile">
                  <!-- @click.native.stop="onStatus(it)" -->
                  <h-status :val="it.state"></h-status>
                </div>
                <div class="d-flex al-c" v-if="it.repo && it.repo.id">
                  <e-icon-link
                    @click.native.stop="onStop"
                    class="mr-6 shrink-0"
                    img="/img/svg/hosting/m-branch.svg"
                    :link="
                      (it.repo.cloneUrl || '').replace(
                        '.git',
                        '/tree/' + it.repo.defaultBranch
                      )
                    "
                  >
                    {{ it.repo.defaultBranch }}
                  </e-icon-link>
                  <e-commit
                    @click.native.stop="onStop"
                    :info="it.commit"
                    class="line-1"
                  ></e-commit>
                </div>
              </v-col>
              <v-col cols="12" md="4" class="d-flex al-c">
                <div class="ml-auto mr-6 ta-r" style="min-width: 70px">
                  <e-time span-class="gray-6 fz-14">{{ it.buildAt }}</e-time>
                </div>
                <v-btn
                  :to="getDetailPath(it)"
                  @click.stop="onStop"
                  class="mr-3"
                  color="primary"
                  small
                  >View Detail</v-btn
                >
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-skeleton-loader type="article" v-if="!it.statisList" />
            <div class="mt-2" v-else>
              <e-link
                class="d-b mb-5"
                v-for="(row, j) in it.statisList"
                :key="j"
                :href="j == 0 ? `/hosting/statistics/${it.name}/${it.id}` : ''"
              >
                <component :is="row.comp" :info="row.data" />
              </e-link>
              <div class="mt-5 d-flex al-c f-wrap">
                <div class="d-flex" v-if="it.repo && it.repo.name">
                  <e-icon-link
                    class="mr-5 shrink-1"
                    img="/img/svg/hosting/m-github.svg"
                    :link="(it.repo.cloneUrl || '').replace('.git', '')"
                  >
                    <span class="ml-1 gray-6">{{
                      `${it.repo.namespace}/${it.repo.name}`.cutStr(30)
                    }}</span>
                  </e-icon-link>
                  <e-time span-class="gray-6 fz-14">{{
                    it.repo.updateAt
                  }}</e-time>
                </div>

                <div class="d-flex al-c ml-auto">
                  <v-btn icon :to="getDetailPath(it, '?tab=settings')">
                    <img src="/img/svg/hosting/ic-setting.svg" width="16" />
                  </v-btn>
                  <v-btn icon class="ml-3" @click="onDelete(it)">
                    <img src="/img/svg/hosting/ic-delete.svg" width="16" />
                  </v-btn>
                  <v-btn
                    v-if="it.taskId"
                    color="primary"
                    class="ml-6"
                    small
                    outlined
                    :to="getBuildPath(it)"
                    >View Build Logs</v-btn
                  >
                </div>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
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
          <v-btn color="primary" to="/hosting/new">Create a New Project</v-btn>
        </div>
      </div>
      <div class="mt-8" v-else-if="limit">
        <v-btn color="primary" outlined to="/hosting/projects">View More</v-btn>
      </div>
    </div>
    <div class="mt-6" v-if="pageLen > 1">
      <v-pagination
        @input="onPage"
        v-model="page"
        :length="pageLen"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        :total-visible="7"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import HStatus from "@/views/hosting/common/h-status";
import ECommit from "@/views/hosting/common/e-commit";
import EIconLink from "@/views/hosting/common/e-icon-link";
import HProjStatis from "@/views/hosting/common/h-proj-statis";
import HBuildDomain from "@/views/hosting/common/h-build-domain";
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
        // console.log(data.taskId, data.state);
        this.lastState = data.state;
        if (this.inCurPath) this.getList();
        else this.needRefresh = true;
      }
    },
    // inCurPath(val) {
    //   // console.log(this.curPath, val);
    //   if (val) {
    //     const now = Date.now();
    //     if (now - this.refreshAt > 10e3) {
    //       this.needRefresh = true;
    //     }
    //     if (this.needRefresh) {
    //       this.refreshAt = now;
    //       this.getList();
    //       this.needRefresh = false;
    //     }
    //   }
    // },
  },

  activated() {
    this.getList();
  },
  mounted() {
    // this.getList();
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
        if (this.list.length == 1) this.page = 1;
        this.getList();
      } catch (error) {
        console.log(error);
      }
    },
    getDetailPath(it, query = "") {
      return `/hosting/project/${it.name}/${it.id}` + query;
    },
    getBuildPath(it) {
      return `/hosting/build/${it.name}/${it.id}/${it.taskId}`;
    },
    onItem(it) {
      if (!this.limit) return;
      const path = this.getDetailPath(it);
      this.$router.push(path);
    },
    async onStatus(it) {
      this.$loading();
      try {
        await this.onOpen(it);
        const path = this.getBuildPath(it);
        this.$router.push(path);
      } catch (error) {
        //
      }
      this.$loading.close();
    },
    async onOpen(it) {
      if (it.loading || it.statisList) return;
      try {
        it.loading = true;
        const { data } = await this.$http2.get("/project/v3/detail/" + it.id);
        data.name = it.name;
        const statisList = [
          {
            comp: "h-proj-statis",
            data: [
              [
                {
                  title: "New Users",
                  num: data.newUsers,
                },
                {
                  title: "Unique Visitor",
                  num: data.uv, // data.totalUV,
                },
                {
                  title: "Page Views",
                  num: data.pv, // data.totalPV,
                },
              ],
              [
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
      this.list = [];
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
        this.list = list.map((it) => {
          if (!it.platform) it.platform = "IPFS";
          return it;
        });
        this.total = total;
        if (!total) {
          this.$router.replace("/hosting/new");
        }
        if (list.length) {
          setTimeout(() => {
            this.curIdx = [0];
            this.onOpen(list[0]);
          }, 10);
        }
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
  components: {
    HStatus,
    ECommit,
    EIconLink,
    HProjStatis,
    HBuildDomain,
  },
};
</script>
