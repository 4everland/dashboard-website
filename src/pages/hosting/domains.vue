<template>
  <div>
    <e-right-opt-wrap>
      <v-btn color="primary" min-width="100" @click="showPop = true">
        <img src="/img/svg/add1.svg" width="12" />
        <span class="ml-2">Add</span>
      </v-btn>
      <v-btn
        @click="onDelete"
        :loading="deleting"
        outlined
        v-show="selected.length > 0"
        class="ml-5"
        min-width="36"
      >
        <img src="/img/svg/delete.svg" width="12" />
        <span class="ml-2">Delete</span>
      </v-btn>
    </e-right-opt-wrap>
    <e-tabs ref="domain-tabs" :list="tabList" />
    <v-dialog v-model="showPop" max-width="600">
      <div class="pd-30">
        <h2 class="fz-20">Add Domain</h2>
        <v-window v-model="curStep">
          <v-window-item :value="0">
            <div class="gray fz-14 mt-1">
              Select a project to add your domains
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
                        :src="`/img/svg/hosting/h-${it.platform.toLowerCase()}.svg`"
                        height="20"
                      />
                      <span class="ml-1 fz-14">{{ it.platform }}</span>

                      <!-- @click="onSelect(it)" -->
                      <v-btn
                        small
                        color="primary"
                        class="ml-auto"
                        :disabled="!supportDomain(it.platform)"
                        :to="`/hosting/project/${it.name}/${it.id}?tab=settings&sub=domains`"
                        >Select</v-btn
                      >
                    </div>
                  </div>
                  <div class="ta-c pa-2">
                    <v-btn text color="primary" to="/hosting/new">
                      <!-- <img src="/img/svg/add2.svg" width="12" /> -->
                      <v-icon size="16">mdi-folder-plus</v-icon>
                      <span class="ml-1">Create New Project</span>
                    </v-btn>
                  </div>
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
// const domainOptions = require("@/assets/domain/domainList.json");

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
      // tabList: [
      //   {
      //     text: "Domains",
      //     comp: "domain-domains",
      //   },
      //   {
      //     text: "ENS",
      //     comp: "domain-ens",
      //   },
      //   {
      //     text: "SNS",
      //     comp: "domain-sns",
      //   },
      // ],
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
      domainOptions: [],
    };
  },
  computed: {
    noticeMsg() {
      return this.$store.state.noticeMsg;
    },
    projList() {
      return this.projects.filter((it) => {
        if (!this.keyword.trim()) return true;
        return new RegExp(this.keyword, "i").test(it.name);
      });
    },
    supportDomain() {
      return function (platform) {
        let tab = this.$route.query.tab;
        if (!tab) {
          tab = "domains";
        }
        if (platform == "IPFS") return true;
        if ((platform == "IC" || platform == "AR") && tab == "domains")
          return true;
        return false;
      };
    },
    tabList() {
      let list = [
        {
          text: "Domains",
          comp: "domain-domains",
        },
      ];

      this.domainOptions.forEach((element) => {
        let obj = {
          id: element.key,
          text: element.name,
          comp: "domain-mix",
          props: {
            type: element.key,
          },
        };
        list.push(obj);
      });
      return list;
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
    noticeMsg({ name, data }) {
      if (name == "domains-selected") {
        this.selected = data.val;
        this.type = data.type;
      }
    },
  },
  mounted() {
    this.getDomainOptions();
  },
  methods: {
    async getDomainOptions() {
      this.$axios.get("/domainList.json").then((res) => {
        const { data } = res;
        this.allOptions = data.list;
        let Array = data.list.filter((item) => {
          return item.display === "true";
        });
        this.domainOptions = Array;
      });
    },
    async onDelete() {
      try {
        let html = `The following domains will be permanently deleted along with associated <b>aliases</b> and <b>certs</b>. If the domain is used as Staging Domain it will be <b>cleared</b>. Are you sure you want to continue?`;
        html += '<div class="pd-10"></div>';
        const now = new Date();
        for (const it of this.selected) {
          let createAt = it.createAt;
          const timeStr = String(createAt);
          if (timeStr.length == 10) {
            createAt = createAt * 1e3;
          }
          const time = new Date(createAt).toNiceTime(now);
          html += `<div class="mt-2 fz-14">${
            it.domain || it.value
          } <span class="fl-r gray">added ${time}</span></div>`;
        }
        await this.$confirm(html, "Delete Domains");
        this.deleting = true;
        await this.onTypeDelete();
        this.$toast(this.selected.length + " domain(s) deleted successfully");
        this.selected = [];
      } catch (error) {
        //
      }
      this.deleting = false;
    },
    async onTypeDelete() {
      // switch (this.type) {
      //   case "domains":
      //     const ids = this.selected.map((it) => it.domainId).join(",");
      //     await this.$http.delete("$hosting/domain/" + ids);
      //     break;
      //   case "ens":
      //     const ensProjectIds = this.selected
      //       .map((it) => it.projectId)
      //       .join(",");
      //     await this.$http.delete("$hosting/project/ipns", {
      //       params: {
      //         projectIds: ensProjectIds,
      //         type: "ENS",
      //       },
      //     });
      //     break;
      //   case "sns":
      //     const snsProjectIds = this.selected
      //       .map((it) => it.projectId)
      //       .join(",");
      //     await this.$http.delete("$hosting/project/ipns", {
      //       params: {
      //         projectIds: snsProjectIds,
      //         type: "SNS",
      //       },
      //     });
      //     break;
      // }
      if (this.type == "domains") {
        const ids = this.selected.map((it) => it.domainId).join(",");
        await this.$http.delete("$hosting/domain/" + ids);
      } else {
        const ids = this.selected.map((it) => it.id).join(",");
        await this.$http.delete("$hosting/project/decentralized/domain", {
          params: {
            ids: ids,
          },
        });
      }
      this.$setMsg({
        name: "domains-delete",
        data: { type: this.type },
      });
    },
    async getProjects() {
      try {
        const { data } = await this.$http.get("$hosting/project/v3/list", {
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
            `The specified value “${this.domain}” is an unqualified domain name.`
          );
        }
        this.adding = true;
        const projectId = this.chooseProj.id;
        await this.$http.post("$hosting/domain", {
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
    tabsChange(e) {},
  },
};
</script>
