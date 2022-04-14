<template>
  <div>
    <div class="mt-12" v-if="noRepo || (list && !list.length)">
      <e-empty>
        {{ noRepo ? "Unconnected to Github" : "No commits" }}
      </e-empty>
    </div>
    <div v-else-if="!list">
      <v-skeleton-loader type="article" />
    </div>
    <div class="pr-6 pos-r" v-else>
      <v-timeline dense align-top>
        <v-timeline-item small v-for="(it, i) in list" :key="i">
          <div class="color-1 fw-b">{{ it.date }}</div>
          <div class="mt-3 mb-5">
            <div
              class="bd-1 pd-12-15 mb-3 bdrs-5 d-flex al-c"
              v-for="row in it.rows"
              :key="row.sha"
            >
              <div>
                <e-commit :info="row" class="fz-14"></e-commit>
                <div class="mt-1 gray fz-13">
                  <span :title="row.date.format()">{{
                    row.date.format("HH:mm")
                  }}</span>
                </div>
              </div>
              <div class="ml-auto" v-if="info.online !== false">
                <v-btn color="primary" small @click="onDeploy(row)"
                  >Deploy</v-btn
                >
              </div>
            </div>
          </div>
          <!-- <v-divider></v-divider> -->
        </v-timeline-item>
      </v-timeline>
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
    noRepo() {
      const { id } = this.info.repo || {};
      return !id;
    },
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      page: 1,
      list: null,
      finished: false,
      loading: false,
      refreshing: false,
    };
  },
  watch: {
    info() {
      this.getList();
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    async onDeploy(row) {
      try {
        const hash = row.sha.substr(0, 6) + " - " + row.message;
        await this.$confirm(
          `Are you sure to deploy this commit?<p class="mt-3 gray fz-14">${hash}</p>`
        );
        this.$loading();
        const {
          data: { taskId },
        } = await this.$http2.post(`/project/${this.id}/build`, {
          commitHash: row.sha,
          message: row.message,
        });
        this.$loading.close();
        this.$router.push(
          `/hosting/build/${this.info.name}/${this.id}/${taskId}?ftab=commits`
        );
      } catch (error) {
        //
      }
    },
    onLoad() {
      if (this.loading) return;
      this.loading = true;
      this.getList();
    },
    async getList() {
      const { repo, config } = this.info;
      if (!repo || !repo.id) return;
      if (this.loading) {
        this.page += 1;
      } else {
        this.page = 0;
        this.finished = false;
        this.refreshing = true;
        this.list = null;
      }
      try {
        const { data } = await this.$http2.get(`/repo/commits/${repo.id}`, {
          params: {
            branch: config.currentBranch,
            page: this.page,
            size: 20,
          },
        });
        this.finished = data.length < 20;
        const list = this.page == 0 ? [] : [...this.list];
        for (const row of data) {
          row.date = new Date(row.date);
          const date = row.date.format("date");
          let item = list.filter((it) => it.date == date)[0];
          if (!item) {
            item = {
              date,
              rows: [],
            };
            list.push(item);
          }
          if (item.rows.filter((it) => it.sha == row.sha).length) {
            continue;
          }
          item.rows.push(row);
        }
        this.list = list;
      } catch (error) {
        console.log(error);
      }
      this.refreshing = false;
      setTimeout(() => {
        this.loading = false;
      }, 100);
    },
  },
};
</script>