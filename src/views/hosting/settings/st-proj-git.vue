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
            By default, every commit pushed to the
            <span class="color-1">`main`</span> branch will trigger a Production
            Deployment instead of the usual Preview Deployment. You can switch
            to a different branch here.
          </div>
          <div class="mt-5 d-flex al-c hide-msg">
            <div style="width: 30%">
              <div class="gray-6 fz-14 mb-2">
                <span>Branch</span>
              </div>
              <v-text-field
                v-model="currentBranch"
                disabled
                outlined
                dense
              ></v-text-field>
              <!-- <v-select
                v-model="currentBranch"
                :items="branches"
                label="Branch"
                readonly
              >
              </v-select> -->
            </div>
            <div class="flex-1 hide-msg ml-8">
              <div class="gray-6 fz-14 mb-4">
                <span>Deploy Hook</span>
                <e-tooltip top>
                  <v-icon slot="ref" size="14" color="#999" class="ml-2"
                    >mdi-alert-circle</v-icon
                  >
                  <span
                    >Deloyhooks allow external services to be notified when
                    certain events happen. When the specified events happen,
                    we’ll update the deployment.</span
                  >
                </e-tooltip>
              </div>
              <v-switch
                @change="setHook"
                v-model="hookSwitch"
                dense
                :loading="savingHook"
              ></v-switch>
            </div>
          </div>
        </div>
      </div>

      <st-proj-git-hook :info="info" :branch="currentBranch" />
      <!-- :branches="branches" -->
    </template>
  </div>
</template>

<script>
import StProjGitHook from "@/views/hosting/settings/st-proj-git-hook";
import NewStep0Git from "@/views/hosting/new/new-step-0-git";
import { mapState } from "vuex";

export default {
  data() {
    return {
      savingConnect: false,
      currentBranch: "",
      branches: [],
      savingHook: false,
      showConnect: false,
      keyword: "",
      hookSwitch: true,
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
    isFocus(val) {
      if (val && this.isAddClick) {
        this.isAddClick = false;
        this.getRepoList();
      }
    },
  },
  mounted() {
    this.currentBranch = this.info.config.currentBranch;
    this.hookSwitch = this.info.config.gitHook;
    console.log(this.info);
  },
  methods: {
    onConnect(it) {
      this.setConnect(it.id);
    },
    onUpdted() {
      this.$setMsg({
        name: "updateProject",
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
    async saveProject(body) {
      await this.$http2.put("/project/config/" + this.info.id, body);
      this.onUpdted();
    },
    async setHook() {
      try {
        this.savingHook = true;
        await this.saveProject({
          hookSwitch: this.hookSwitch,
        });
        this.$toast("Updated Web Hook successfully.");
        this.showConnect = false;
      } catch (error) {
        //
      }
      this.savingHook = false;
    },
  },
  components: {
    StProjGitHook,
    NewStep0Git,
  },
};
</script>