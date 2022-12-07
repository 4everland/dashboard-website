<template>
  <div>
    <div class="mb-8 mt-5" v-if="allowNoLogin && !userInfo.uid">
      <div class="m-auto" style="max-width: 500px">
        <div class="ta-c mb-5 gray">Log in or sign up to clone and deploy.</div>
        <login-wallet class="bg-white" mode="refresh" />
      </div>
    </div>
    <div class="main-wrap">
      <h3>Github Configuration</h3>
      <div class="gray fz-14" style="max-width: 600px">
        To ensure you can easily update your project after deploying it, a Git
        repository must be created. Every push to that Git repository will be
        deployed automatically.
      </div>
      <v-skeleton-loader type="article" v-if="loading" v-show="!allowNoLogin" />
      <div class="mt-5" v-else>
        <div class="d-flex al-c">
          <e-icon-link img="/img/svg/hosting/m-github.svg" :link="info.url">
            {{ info.namespace }}/{{ info.name }}
          </e-icon-link>
          <e-icon-link
            class="ml-6"
            img="/img/svg/hosting/m-branch.svg"
            :link="info.url + '/tree/' + info.defaultBranch"
          >
            {{ info.defaultBranch }}
          </e-icon-link>
          <e-icon-link
            height="15px"
            class="ml-6"
            img="/img/svg/hosting/m-folder.svg"
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
            <v-text-field
              v-model.trim="name"
              outlined
              dense
              @keyup.enter="onCreate"
            />
            <v-btn
              class="ml-5"
              color="primary"
              :loading="creating"
              @click="onCreate"
              >{{ isBind ? "Create" : "Bind and Create" }}</v-btn
            >
          </div>
        </div>
      </div>
    </div>

    <div class="main-wrap mt-5">
      <h3>Hosting Platform</h3>

      <div class="gray fz-14">
        We offer IPFS, Arweave and IC hosting options for your website, please
        select one.
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
import { mapState } from "vuex";
import LoginWallet from "@/views/login/login-wallet.vue";
import EIconLink from "@/views/hosting/common/e-icon-link";

export default {
  components: {
    LoginWallet,
    EIconLink,
  },
  props: {
    query: Object,
  },
  computed: {
    ...mapState({
      allowNoLogin: (s) => s.allowNoLogin,
      userInfo: (s) => s.userInfo,
      isFocus: (s) => s.isFocus,
    }),
  },
  data() {
    return {
      info: null,
      loading: true,
      creating: false,
      name: "",
      isPrivate: true,
      platList: [
        {
          label: "IPFS",
          name: "IPFS",
          icon: "h-ipfs.svg",
        },
        {
          label: "Internet Computer",
          name: "IC",
          icon: "h-ic.svg",
        },
      ],
      platform: "IPFS",
      isBind: true,
    };
  },
  watch: {
    query() {
      this.getInfo();
    },
    async isFocus(val) {
      if (val && this.isOpenInstall) {
        this.isOpenInstall = false;
        this.$loading();
        await this.checkBind();
        this.$loading.close();
        if (this.isBind) this.onCreate();
      }
    },
  },
  mounted() {
    console.log(this.query);
    this.getInfo();
  },
  methods: {
    async checkBind() {
      try {
        const { data } = await this.$http2.get("/user/git-namespaces", {
          noTip: true,
        });
        this.isBind = !!data.length;
      } catch (error) {
        this.isBind = false;
      }
    },
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
      if (this.allowNoLogin) {
        this.checkBind();
      }
    },
    async getGitInfo() {
      try {
        this.$loading("Fetch Repo...");
        const { data: accountList } = await this.$http2.get(
          "/user/git-namespaces"
        );
        const account = accountList.filter((it) => it.ownerType == "User")[0];
        if (!account) throw new Error("No Github account");
        const { data } = await this.$http2.get("/repo/refresh/list", {
          params: {
            githubId: account.githubId,
            page: 0,
            word: this.gitName,
          },
        });
        const item = data.repoList.filter((it) => it.name == this.gitName)[0];
        if (!item) throw new Error("Failed to fetch git repo");
        this.$emit("git-repo", item);
        const query = this.query;
        let link = "/hosting/new?type=clone-flow&c=" + this.gitName;
        for (const key in query) {
          if (["type", "c", "s"].includes(key)) continue;
          link += `&${key}=${encodeURIComponent(query[key])}`;
        }
        console.log(link);
        this.$router.replace(link);
      } catch (error) {
        console.log(error);
        await this.$sleep(100);
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
        if (!this.isBind) {
          this.addNew();
          return;
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
        if (error.code == 10026) {
          setTimeout(() => {
            this.$confirm("Please bind Github first").then(() => {
              this.addNew();
            });
          }, 100);
        }
      }
      this.$loading.close();
    },
    async addNew() {
      try {
        this.$loading();
        const { data } = await this.$http2.get("/githubapp/install");
        this.isOpenInstall = true;
        this.$openWindow(data.installUrl);
      } catch (error) {
        //
      }
      this.$loading.close();
    },
  },
};
</script>
