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
            class="ml-6"
            img="img/svg/hosting/m-folder.svg"
            :link="info.url + '/tree/' + info.defaultBranch + info.dir"
          >
            {{ info.dir }}
          </e-icon-link>
        </div>
        <div class="mt-8" style="max-width: 600px">
          <h4>Project Name</h4>
          <div class="d-flex al-c hide-msg">
            <v-text-field v-model="name" outlined dense />
            <v-btn class="ml-5" color="primary" rounded>Create</v-btn>
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
      name: "",
      isPrivate: false,
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
      if (!url) return this.$alert("parameter s required");
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
    async onCreate() {
      try {
        if (!this.name) {
          return this.$toast("Invalid Name");
        }
        this.creating = true;
        const { data: pushUrl } = await this.$http2.get("/repo/create/new", {
          params: {
            name: this.name,
            isPrivate: this.isPrivate,
          },
          noTip: true,
        });
        const { data } = await this.$http2.post("/template/clone-push", {
          pushUrl,
          ...this.info,
        });
        let link = "/new?c=" + data;
        const { e } = this.$route.query;
        if (e) link += `&e=${encodeURIComponent(e)}`;
        console.log(link);
        this.$router.replace(link);
      } catch (error) {
        if (error.code == 10026) {
          this.$confirm(error.message).then(() => {
            this.setGithub();
          });
        } else {
          this.$alert(error.message);
        }
      }
      this.creating = false;
    },
    async setGithub() {
      this.isAddClick = true;
      try {
        this.$loading();
        const { data } = await this.$http2.get("/githubapp/install");
        this.$openWindow(data.installUrl);
      } catch (error) {
        //
      }
      this.$loading.close();
    },
  },
};
</script>