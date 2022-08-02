<template>
  <div>
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
      this.$emit("chooseDelete", val);
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
