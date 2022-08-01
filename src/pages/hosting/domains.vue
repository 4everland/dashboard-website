<template>
  <div>
    <div class="mb-5">
      <v-btn color="primary" min-width="100" @click="showPop = true">
        <img src="img/svg/add1.svg" width="12" />
        <span class="ml-2">Add</span>
      </v-btn>

      <v-btn
        @click="onDelete"
        :loading="deleting"
        outlined
        class="ml-5"
        min-width="36"
        v-show="selected.length"
      >
        <img src="img/svg/delete.svg" width="12" />
        <span class="ml-2">Delete</span>
      </v-btn>
    </div>
    <e-tabs :list="tabList" />
    <div class="main-wrap">
      <v-data-table
        v-model="selected"
        :loading="loading"
        :show-select="list.length > 0"
        item-key="domainId"
        :headers="headers"
        :items="list"
        no-data-text=""
        loading-text=""
        hide-default-footer
        :checkbox-color="$color1"
        @click:row="onRow"
      >
        <template v-slot:item.domain="{ item }">
          <v-btn
            text
            x-small
            class="e-btn-text"
            :color="item.valid ? 'success' : 'error'"
            :to="getPath(item)"
          >
            <b>{{ item.domain }}</b>
          </v-btn>
        </template>
      </v-data-table>
      <div class="mt-8" v-if="!list.length">
        <e-empty :loading="loading">
          {{ loading ? "Loading domains..." : "No domains" }}
        </e-empty>
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

    <v-dialog v-model="showPop" max-width="600">
      <div class="pd-30">
        <h2 class="fz-20">Add Domain</h2>
        <v-window v-model="curStep">
          <v-window-item :value="0">
            <div class="gray fz-14 mt-1">
              Select a project to add your domains to:
            </div>
            <div class="mt-6">
              <div v-if="!projects">
                <v-skeleton-loader type="article" />
              </div>
              <template v-else>
                <div>
                  <v-text-field
                    class="hide-msg bd-1"
                    dense
                    solo
                    clearable
                    label="Search"
                    prepend-inner-icon="mdi-magnify"
                    v-model="keyword"
                  ></v-text-field>
                </div>

                <div class="bg-f6 pa-2 mt-5">
                  <div class="ov-a" style="max-height: 40vh">
                    <div
                      class="d-flex al-c pa-3 mt-1"
                      v-for="(it, i) in projList"
                      :key="i"
                    >
                      <v-icon size="16">mdi-folder-outline</v-icon>
                      <b class="ml-2" style="min-width: 140px">{{ it.name }}</b>

                      <img
                        class="ml-3"
                        :src="`img/svg/hosting/h-${it.platform.toLowerCase()}.svg`"
                        height="20"
                      />
                      <span class="ml-1 fz-14">{{ it.platform }}</span>

                      <!-- @click="onSelect(it)" -->
                      <v-btn
                        small
                        color="primary"
                        class="ml-auto"
                        :to="`/hosting/project/${it.name}/${it.id}?tab=settings&sub=domains`"
                        :disabled="it.platform != 'IPFS'"
                        >Select</v-btn
                      >
                    </div>
                  </div>
                  <a
                    href="#/hosting/new"
                    class="d-flex al-c f-center mt-3 pa-3 gray fz-15"
                  >
                    <img src="img/svg/add2.svg" width="12" />
                    <span class="color-1 ml-2">Create New Project</span>
                  </a>
                </div>
              </template>
            </div>
          </v-window-item>
          <v-window-item :value="1">
            <div class="mt-5">
              <p><b>Project</b>：{{ chooseProj.name }}</p>
              <p class="gray">Enter The Domain</p>
            </div>
            <div class="mt-5">
              <v-text-field
                dense
                outlined
                autofocus
                v-model.trim="domain"
                placeholder="mywebsite.com"
                @keyup.enter="onAdd"
              />
            </div>
          </v-window-item>
        </v-window>

        <div class="ta-c mt-8">
          <v-btn @click="showPop = false" outlined>Cancel</v-btn>
          <v-btn
            color="primary"
            class="ml-6"
            v-if="curStep > 0"
            :loading="adding"
            @click="onAdd"
          >
            Add
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "Domain", value: "domain" },
        {
          text: "Nameservers",
          value: "nameServers",
        },
        { text: "CreateAt", value: "createTime" },
      ],
      list: [],
      tabList: [
        {
          text: "Domains",
          comp: "build-overview",
        },
        {
          text: "ENS",
          comp: "build-overview",
        },
        {
          text: "SNS",
          comp: "build-overview",
        },
      ],
      page: 1,
      pageLen: 1,
      total: 0,
      selected: [],
      loading: false,
      showPop: false,
      curStep: 0,
      chooseProj: {},
      projects: null,
      adding: false,
      domain: "",
      deleting: false,
      keyword: "",
    };
  },
  computed: {
    projList() {
      return this.projects.filter((it) => {
        if (!this.keyword.trim()) return true;
        return new RegExp(this.keyword, "i").test(it.name);
      });
    },
  },
  watch: {
    showPop(val) {
      if (val) {
        this.curStep = 0;
        if (!this.projects) this.getProjects();
      }
    },
    selected(val) {
      console.log(val);
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    getPath(item) {
      return `/hosting/project/${item.projectName || "project"}/${
        item.projectId
      }?tab=settings&sub=domains`;
    },
    onRow(it) {
      const url = this.getPath(it);
      this.$router.push(url);
    },
    async onDelete() {
      try {
        let html = `The following domains will be permanently deleted along with associated <b>aliases</b> and <b>certs</b>. If the domain is used as Staging Domain it will be <b>cleared</b>. Are you sure you want to continue?`;
        html += '<div class="pd-10"></div>';
        const now = new Date();
        for (const it of this.selected) {
          const time = new Date(it.createAt * 1e3).toNiceTime(now);
          html += `<div class="mt-2 fz-14">${it.domain} <span class="fl-r gray">added ${time}</span></div>`;
        }
        await this.$confirm(html, "Delete Domains");
        const ids = this.selected.map((it) => it.domainId).join(",");
        this.deleting = true;
        await this.$http2.delete("/domain/" + ids);
        await this.getList();
        this.$toast(this.selected.length + " domain(s) deleted successfully");
        this.selected = [];
      } catch (error) {
        //
      }
      this.deleting = false;
    },
    async getProjects() {
      try {
        const { data } = await this.$http2.get("/project/v3/list", {
          params: {
            size: 100,
          },
        });
        this.projects = data.list;
      } catch (error) {
        this.$confirm(error.message, "Error", {
          confirmText: "Retry",
        }).then(() => {
          this.getProjects();
        });
      }
    },
    onSelect(it) {
      this.chooseProj = it;
      this.curStep = 1;
    },
    async onAdd() {
      try {
        if (!this.$regMap.domain.test(this.domain)) {
          return this.$alert(
            `The specified value “${this.domain}” is not a fully qualified domain name.`
          );
        }
        this.adding = true;
        const projectId = this.chooseProj.id;
        await this.$http2.post("/domain", {
          domain: this.domain,
          projectId,
        });
        this.domain = "";
        this.$toast("Added successfully");
        this.showPop = false;
        this.$router.push(
          `/project/${this.chooseProj.name}/${projectId}/settings?tab=1`
        );
        // this.getList();
      } catch (error) {
        console.log(error);
      }
      this.adding = false;
    },
    onPage() {
      this.getList();
    },
    async getList() {
      try {
        this.loading = true;
        const params = {
          page: this.page - 1,
          size: 10,
        };
        const { data } = await this.$http2.get("/domain/list", {
          params,
        });
        this.list = data.content.map((it) => {
          it.createTime = new Date(it.createAt * 1e3).format();
          return it;
        });
        this.pageLen = Math.max(
          1,
          Math.ceil(data.numberOfElements / params.size)
        );
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>
