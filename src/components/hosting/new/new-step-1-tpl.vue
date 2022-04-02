<template>
  <div>
    <div class="main-wrap">
      <h3>Github Configuration</h3>
      <div class="gray fz-14" style="max-width: 600px">
        To ensure you can easily update your project after deploying it, a Git
        repository must be created. Every push to that Git repository will be
        deployed automatically.
      </div>
      <v-skeleton-loader type="article" v-if="loading" />
      <div class="mt-5" v-else>
        <div class="d-flex al-c">
          <e-icon-link img="img/svg/hosting/m-github.svg" :link="info.url">
            {{ info.namespace }}/{{ info.name }}
          </e-icon-link>
          <e-icon-link
            class="ml-6"
            img="img/svg/hosting/m-branch.svg"
            :link="info.url + '/tree/' + info.defaultBranch"
          >
            {{ info.defaultBranch }}
          </e-icon-link>
          <e-icon-link
            height="15px"
            class="ml-6"
            img="img/svg/hosting/m-folder.svg"
            :link="info.url + '/tree/' + info.defaultBranch + info.dir"
          >
            {{ info.dir }}
          </e-icon-link>

          <div class="ml-10 pl-10 bdl-1 hide-msg d-flex al-c">
            <span class="mr-3">Private</span>
            <v-switch v-model="isPrivate"></v-switch>
          </div>
        </div>
        <div class="mt-8" style="max-width: 600px">
          <h4>Project Name</h4>
          <div class="d-flex al-c hide-msg">
            <v-text-field v-model.trim="name" outlined dense />
            <v-btn
              class="ml-5"
              color="primary"
              rounded
              :loading="creating"
              @click="onCreate"
              >Create</v-btn
            >
          </div>
        </div>
      </div>
    </div>
    <div class="main-wrap mt-5">
      <h3>Basic Configuration</h3>
      <div class="gray fz-14">
        Contains some basic options like project name and branch selection.
      </div>
    </div>
    <div class="main-wrap mt-5">
      <h3>Build Configuration</h3>
      <div class="gray fz-14">
        Contains project build commands and framework related settings.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    query: Object,
  },
  data() {
    return {
      info: null,
      loading: true,
      creating: false,
      name: "",
      isPrivate: true,
    };
  },
  watch: {
    query() {
      this.getInfo();
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      const { s: url } = this.query;
      if (!url) return;
      try {
        this.loading = true;
        const { data } = await this.$http2.get("/template/git-repo", {
          params: {
            url,
          },
        });
        this.info = data;
        let name = data.name.replace(/\./g, "-");
        if (data.dir != "/") {
          name = /\/([^/]*)$/.exec(data.dir)[1] + "-project";
        }
        this.name = name;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async getGitInfo() {
      try {
        this.$loading("Fetch Repo...");
        const { data: accountList } = await this.$http2.get(
          "/user/git-namespaces"
        );
        if (!accountList.length) throw new Error("No Github account");
        const { data } = await this.$http2.get("/repo/refresh/list", {
          params: {
            githubId: accountList[0].githubId,
            page: 0,
            word: this.gitName,
          },
        });
        const item = data.repoList.filter((it) => it.name == this.gitName)[0];
        if (!item) throw new Error("Failed to fetch git repo");
        this.$emit("git-repo", item);
        const { e } = this.query;
        let link = "/hosting/new?type=clone-flow&c=" + this.gitName;
        if (e) link += `&e=${encodeURIComponent(e)}`;
        this.$router.replace(link);
      } catch (error) {
        console.log(error);
        await this.$sleep(100)
        this.$confirm(error.message, "Network Error", {
          confirmText: "Retry",
        }).then(() => {
          this.getGitInfo();
        });
      }
    },
    async onCreate() {
      try {
        const name = this.name.trim();
        if (!name) {
          return this.$toast("Invalid Name");
        }
        this.$loading("Create Repo...");
        const { data: pushUrl } = await this.$http2.get("/repo/create/new", {
          params: {
            name,
            isPrivate: this.isPrivate,
          },
        });
        const { data: gitName } = await this.$http2.post(
          "/template/clone-push",
          {
            pushUrl,
            ...this.info,
          }
        );
        this.gitName = gitName;
        await this.getGitInfo();
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
  },
};
</script>
