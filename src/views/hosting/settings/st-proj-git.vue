<template>
  <div>
    <div class="bd-1">
      <div class="d-flex al-c">
        <div>
          <h3>Connected Git Repository</h3>
          <div class="gray mt-1 fz-14">
            Seamlessly create Deployments for any commits pushed to your Git
            repository.
          </div>
        </div>
      </div>
      <div class="mt-5 b-1">
        <div class="d-flex al-c f-wrap" v-if="repoName">
          <v-icon color="#4A96FA" size="32">mdi-github</v-icon>
          <div class="ml-5 mr-auto">
            <h4 class="color-1">
              <a :href="info.repo.cloneUrl.replace('.git', '')" target="_blank">
                {{ info.repo.pathPre }}
              </a>
            </h4>
            <div class="gray fz-13">
              Connected at <e-time :value="info.repo.updateAt"></e-time>
            </div>
          </div>
          <v-btn @click="setConnect()" :loading="savingConnect" outlined small>
            Disconnect
          </v-btn>
        </div>
        <template v-else>
          <div v-if="!showConnect">
            <v-btn color="primary" @click="showConnect = true">
              <v-icon>mdi-github</v-icon>
              <span class="ml-2">Connect Github</span>
            </v-btn>
          </div>
          <div v-else>
            <new-step-0-git @select="onConnect" in-setting />
          </div>
        </template>
      </div>
    </div>

    <template v-if="repoName">
      <div class="bd-1 mt-5">
        <div>
          <h3>Production Branch</h3>
          <div class="gray mt-1 fz-14">
            By default,every commit pushed to the
            <span class="color-1">`main`</span> branch will trigger a Production
            Deployment instead of the usual Preview Deployment. You can switch
            to a different branch here.
          </div>
          <div class="mt-3 d-flex al-c">
            <v-select
              v-model="currentBranch"
              :items="branches"
              label="Select Branch"
            >
            </v-select>
            <v-btn
              :disabled="currentBranch == info.config.currentBranch"
              :loading="savingBranch"
              @click="setBranch"
              color="primary"
              min-width="100"
              class="ml-5"
              >Save</v-btn
            >
          </div>
        </div>
      </div>

      <st-proj-git-hook :info="info" :branches="branches" />
    </template>
  </div>
</template>

<script>
import StProjGitHook from "@/views/hosting/settings/st-proj-git-hook";
import { mapState } from "vuex";

export default {
  data() {
    return {
      savingConnect: false,
      currentBranch: "",
      branches: [],
      savingBranch: false,
      showConnect: false,
      keyword: "",
    };
  },
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
      info: (s) => s.projectInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    repoName() {
      return this.info.repo.name;
    },
    repoResList() {
      return this.repoList.filter((it) => {
        if (!this.keyword.trim()) return true;
        return new RegExp(this.keyword, "i").test(it.namespace + "/" + it.name);
      });
    },
  },
  watch: {
    info() {
      this.getBranch();
    },
    isFocus(val) {
      if (val && this.isAddClick) {
        this.isAddClick = false;
        this.getRepoList();
      }
    },
  },
  mounted() {
    this.currentBranch = this.info.config.currentBranch;
    this.getBranch();
  },
  methods: {
    onConnect(it) {
      this.setConnect(it.id);
    },
    onUpdted() {
      this.$setState({
        noticeMsg: {
          name: "updateProject",
        },
      });
    },
    async setConnect(repoId) {
      try {
        const { id } = this.info;
        let url = "/project/repo/" + id;
        let method = "delete";
        if (repoId) {
          url = `/project/repo/${id}/${repoId}`;
          method = "put";
          this.$loading();
        }
        this.savingConnect = true;
        await this.$http2[method](url);
        this.onUpdted();
        if (repoId) {
          this.keyword = "";
          this.$toast("Connected Git Repository successfully");
        }
      } catch (error) {
        console.log(error);
      }
      this.savingConnect = false;
      this.$loading.close();
    },
    async getBranch() {
      if (!this.repoName) return;
      this.branches = [];
      try {
        const { data } = await this.$http2.get(
          `/project/branch/${this.info.id}`,
          {
            noTip: 1,
          }
        );
        // console.log(data)
        const branches = [...(data.other || [])];
        if (data.current) branches.unshift(data.current);
        else data.current = branches[0];
        this.branches = branches;
        this.currentBranch = data.current;
        console.log(this.branches, this.currentBranch);
      } catch (error) {
        console.log(error);
      }
    },
    async setBranch() {
      try {
        this.savingBranch = true;
        await this.$http2.put("/project/branch/git/" + this.info.id, {
          name: this.currentBranch,
        });
        this.onUpdted();
        this.$toast("Updated Production Branch successfully.");
        this.showConnect = false;
      } catch (error) {
        //
      }
      this.savingBranch = false;
    },
  },
  components: {
    StProjGitHook,
  },
};
</script>