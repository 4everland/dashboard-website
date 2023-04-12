<style lang="scss">
.plat-item {
  padding: 14px 12px;
  background: #eef0f4;
  cursor: pointer;
  &:hover {
    background: #eee;
  }
  &.active {
    background: #634695;
    color: #fff;
  }
}
.beta-icon {
  position: absolute;
  right: -55px;
  top: -7px;
}
</style>

<template>
  <div v-if="info" class="hide-msg">
    <div class="main-wrap">
      <h3>Github Repository</h3>
      <!-- <div class="gray fz-14">Import project from github repository.</div> -->
      <div class="d-flex al-c">
        <e-icon-link img="/img/svg/hosting/m-github.svg" :link="info.cloneUrl">
          {{ info.namespace }}/{{ info.name }}
        </e-icon-link>
        <e-icon-link
          class="ml-6"
          img="/img/svg/hosting/m-branch.svg"
          :link="info.cloneUrl.replace('.git', '/tree/' + form.currentBranch)"
        >
          {{ form.currentBranch }}
        </e-icon-link>
      </div>
    </div>

    <div class="main-wrap mt-5">
      <h3>Hosting Platform</h3>
      <v-row>
        <v-col
          cols="12"
          md="4"
          v-for="(it, i) in platList"
          :key="i"
          @click="form.platform = it.name"
        >
          <div
            class="d-flex al-c bdrs-3 plat-item"
            :class="{
              active: form.platform == it.name,
            }"
          >
            <img :src="'/img/svg/hosting/' + it.icon" height="30" />
            <div class="ml-2 fw-b fz-16 pos-r">
              <span> {{ it.label }}</span>
            </div>
            <img
              class="ml-auto"
              v-if="it.name == 'IC'"
              :src="
                form.platform == it.name
                  ? '/img/svg/hosting/h-beta.svg'
                  : '/img/svg/hosting/h-beta-active.svg'
              "
              height="20"
              alt=""
            />
          </div>
        </v-col>
        <v-col v-if="form.platform == 'AR'">
          <div class="gray fz-14">
            <v-icon size="14" class="mr-1">mdi-alert-circle</v-icon> All assets
            in Arweave are linked using relative paths due to its features.
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="main-wrap mt-5">
      <h3>Basic Configuration</h3>
      <v-row>
        <v-col cols="6" md="4">
          <h4>Project Name</h4>
          <v-text-field v-model="form.name" outlined dense />
        </v-col>
        <v-col cols="6" md="4">
          <h4>Branch</h4>
          <v-select
            v-model="form.currentBranch"
            :items="branchList"
            outlined
            dense
            :menu-props="{ offsetY: true }"
          >
          </v-select>
        </v-col>
        <v-col cols="6" md="4">
          <h4>Root Directory</h4>
          <e-menu offset-y offset-overflow>
            <v-text-field
              slot="ref"
              v-model="form.rootDirectory"
              outlined
              dense
            ></v-text-field>
            <div class="bg-white ov-a" style="max-height: 300px">
              <div class="pa-10 ta-c" v-if="!dirList.length">
                <v-progress-circular
                  :size="40"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
              </div>
              <v-radio-group v-model="form.rootDirectory" v-else>
                <v-treeview
                  dense
                  :open="[srcDir]"
                  :load-children="getRepoDir"
                  :items="dirList"
                >
                  <template v-slot:prepend="{ item }">
                    <v-radio v-if="item.radio" :value="item.id"></v-radio>
                  </template>
                </v-treeview>
              </v-radio-group>
            </div>
          </e-menu>
        </v-col>
      </v-row>
    </div>
    <div class="main-wrap mt-5">
      <h3>Build Configuration</h3>
      <v-row>
        <v-col cols="6" md="4">
          <h4>Framework Preset</h4>
          <v-select
            v-model="form.framework"
            outlined
            dense
            :items="frameworks"
            item-text="name"
            item-value="slug"
          >
          </v-select>
        </v-col>
        <v-col cols="6" md="4">
          <h4>
            <span>Build Command</span>
            <build-cmd-tip />
          </h4>
          <build-cmd
            v-model="form.buildCommand"
            :placeholder="buildCommandHint"
            :scripts="scripts"
          ></build-cmd>
        </v-col>
        <v-col cols="6" md="4">
          <h4>
            <span>Output Directory</span>
            <build-output-tip />
          </h4>
          <v-text-field
            v-model="form.outputDirectory"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="4">
          <h4>
            <span>Node.js Version</span>
          </h4>

          <v-select
            v-model="form.nodeVersion"
            outlined
            class="show-msg"
            :error="nodeVersionError"
            :error-messages="nodeErrorMessage"
            dense
            :items="nodeVersionList"
            item-text="name"
            item-value="value"
          >
          </v-select>
        </v-col>
        <v-col cols="6" md="4">
          <h4>
            <span>Rewrite</span>
            <e-tooltip right max-width="300">
              <v-icon slot="ref" size="16" class="ml-2" :color="$color1">
                mdi-help-circle-outline
              </v-icon>
              <p>
                If a URL doesn't exist, it will be redirected to the specified
                target location.
              </p>
            </e-tooltip>
          </h4>
          <v-text-field v-model="form.rewrite" outlined dense></v-text-field>
        </v-col>
        <v-col cols="6" md="4">
          <h4>
            <span>Deploy Hooks</span>
            <e-tooltip right max-width="300">
              <v-icon slot="ref" size="16" class="ml-2" :color="$color1">
                mdi-help-circle-outline
              </v-icon>
              <p>
                Deloyhooks allow external services to be notified when certain
                events happen. When the specified events happen, we’ll update
                the deployment.
              </p>
            </e-tooltip>
          </h4>
          <v-switch v-model="form.hookSwitch" dense></v-switch>
        </v-col>
      </v-row>
      <env-form class="mt-5" v-model="form.env" />
      <div class="gray mt-5 fz-14 al-c">
        <v-icon size="14" class="mr-2">mdi-alert-circle</v-icon>
        <span
          >4EVERLAND Hosting only serves static pages (Server-Side-Rendering is
          not supported now)</span
        >
      </div>
    </div>
    <div class="ta-c mt-4">
      <v-btn
        color="primary"
        @click="onDeploy"
        min-width="100"
        :disabled="nodeVersionError"
        >Deploy</v-btn
      >
      <v-btn outlined class="ml-6" min-width="100" @click="$emit('back')"
        >Back</v-btn
      >
    </div>
  </div>
  <div v-else-if="isTpl">
    <new-step-1-tpl :query="query" @git-repo="repoInfo = $event" />
    <div class="ta-c mt-4">
      <v-btn outlined class="ml-6" min-width="100" @click="$emit('back')"
        >Back</v-btn
      >
    </div>
  </div>
  <div v-else-if="isHash">
    <new-step-1-hash
      @onHashDeloy="onHashDeloy"
      @back="$emit('back')"
    ></new-step-1-hash>
  </div>

  <div v-else-if="isWeb3Tpl">
    <new-step-1-web3-tpl
      @onHashDeloy="onHashDeloy"
      @back="$emit('back')"
    ></new-step-1-web3-tpl>
  </div>
</template>

<script>
import NewStep1Tpl from "@/views/hosting/new/new-step-1-tpl";
import NewStep1Hash from "@/views/hosting/new/new-step-1-hash";
import NewStep1Web3Tpl from "@/views/hosting/new/new-step-1-web3-tpl";
import BuildCmd from "@/views/hosting/common/build-cmd";
import BuildCmdTip from "@/views/hosting/build/build-cmd-tip";
import BuildOutputTip from "@/views/hosting/build/build-output-tip";
import EIconLink from "@/views/hosting/common/e-icon-link";
import EnvForm from "@/views/hosting/common/env-form";
import frameworks from "../../../plugins/config/frameworks";

const srcDir = "./";
const semver = require("semver");

export default {
  props: {
    data: Object,
  },
  computed: {
    query() {
      return this.$route.query;
    },
    isTpl() {
      return this.query.type == "clone-flow";
    },
    isWeb3Tpl() {
      return this.query.type == "web3Tpl";
    },
    info() {
      if (this.isTpl || this.isHash) return this.repoInfo;
      return this.data;
    },
    isHash() {
      return this.query.type == "hash";
    },
  },
  data() {
    return {
      repoInfo: null,
      frameworks,
      dirList: [],
      srcDir,
      form: {
        name: "",
        currentBranch: "",
        rootDirectory: srcDir,
        framework: "",
        buildCommand: "",
        outputDirectory: "",
        hookSwitch: true,
        env: [],
        platform: "IPFS",
        nodeVersion: "",
        rewrite: "",
      },
      buildCommandHint: "",
      scripts: null,
      rootDirList: [],
      branchList: [],
      platList: [
        {
          label: "IPFS",
          name: "IPFS",
          icon: "h-ipfs.svg",
        },
        {
          label: "Arweave",
          name: "AR",
          icon: "h-ar.svg",
        },
        {
          label: "Internet Computer",
          name: "IC",
          icon: "h-ic.svg",
        },
      ],
      nodeVersionList: [
        {
          name: "18.x",
          value: "LTS",
        },
        {
          name: "16.x",
          value: "MAINTENANCE_1",
        },
        {
          name: "14.x",
          value: "MAINTENANCE_2",
        },
      ],
      nodeVersionError: false,
      nodeErrorMessage: "",
    };
  },
  watch: {
    info() {
      this.onInit();
    },
    query(obj) {
      if (obj.s) this.repoInfo = null;
    },
    "form.currentBranch"(val) {
      if (this.dirBranch && val != this.dirBranch) {
        this.getRepoDir();
      }
    },
    "form.framework"(val) {
      this.onFramework(val);
    },
  },
  created() {
    this.onInit();
  },
  methods: {
    async onInit() {
      let { c, e, env, root } = this.query;
      if (env) e = env;
      if (!this.info || !c) return;
      const { id, name, defaultBranch = "", frameWorkAdvice = "" } = this.info;
      let envList = [];
      if (e) {
        envList = decodeURIComponent(e)
          .split(";")
          .map((txt) => {
            return txt.split(":");
          })
          .filter((it) => it.length == 2)
          .map((arr) => {
            return {
              key: arr[0],
              value: arr[1],
            };
          });
      }
      Object.assign(this.form, {
        repoId: id,
        name,
        currentBranch: defaultBranch,
        rootDirectory: root || srcDir,
        framework: frameWorkAdvice,
        env: envList,
        platform: "IPFS",
        buildCommand: this.query.build || "",
      });
      this.branchList = defaultBranch ? [defaultBranch] : [];
      this.dirList = [];
      this.$loading();
      try {
        await this.getBranchList();
        await this.detectFramework();
      } catch (error) {
        //
      }
      this.$loading.close();
    },
    async onDeploy() {
      const body = {
        ...this.form,
      };
      if (!body.outputDirectory && body.framework == "vue") {
        body.outputDirectory = "dist";
      }
      // console.log(body);
      try {
        this.$loading();
        const { data } = await this.$http.post("$hosting/project", body);
        const {
          data: { taskId },
        } = await this.$http.post(`$hosting/project/${data.projectId}/build`);
        this.$router.replace(
          `/hosting/new?id=${data.projectId}&taskId=${taskId}`
        );
        this.$emit("next");
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
    onHashDeloy({ projectId, taskId }) {
      this.$router.replace(`/hosting/new?id=${projectId}&taskId=${taskId}`);
      this.$emit("next");
    },
    onWeb3TplDeploy({ projectId, taskId }) {
      this.$router.replace(`/hosting/new?id=${projectId}&taskId=${taskId}`);
      this.$emit("next");
    },
    onFramework(val) {
      const item = this.$getFramework(val);
      const { buildCommand = {}, outputDirectory = {} } = item.settings || {};
      const obj = {
        outputDirectory: this.query.output || outputDirectory.value || "./",
      };
      if (buildCommand.value) {
        obj.buildCommand = this.query.build || buildCommand.value;
      }
      Object.assign(this.form, obj);
      this.buildCommandHint = buildCommand.placeholder || "";
    },
    async detectFramework() {
      try {
        this.scripts = null;
        let params = {};
        const form = this.form;
        if (form.rootDirectory != srcDir) {
          params.path = form.rootDirectory.replace(/^\//, "");
        }
        const { data } = await this.$http.get(
          "$hosting/project/detect-framework/" + this.info.id,
          { params }
        );
        let { scripts, framework = null } = data;
        let engines = null;
        if (data.engines) {
          engines = JSON.parse(data.engines);
          // let node = this.matchNodeVersion(engines.node);
          let supportedNodeList = ["14.21.1", "16.18.1", "18.12.1"];
          let node = this.matchNodeVersion(supportedNodeList, engines.node);
          switch (node) {
            case "14":
              form.nodeVersion = "MAINTENANCE_2";
              break;
            case "16":
              form.nodeVersion = "MAINTENANCE_1";
              break;
            case "18":
              form.nodeVersion = "LTS";
              break;
            default:
              form.nodeVersion = "MAINTENANCE_2";
              this.nodeVersionError = true;
              this.nodeErrorMessage = `"node": "${engines.node}" does not match the version of Node.js that is supported!`;
              break;
          }
        } else {
          form.nodeVersion = "MAINTENANCE_2";
        }

        //  do something node version choose
        const obj = {
          framework,
        };
        if (scripts) {
          this.scripts = JSON.parse(scripts);
          const { build } = this.scripts;
          if (
            build &&
            !this.query.build &&
            ["nextjs", "nuxtjs"].indexOf(framework) == -1
          ) {
            obj.buildCommand = "npm run build";
          }
        }
        this.form = {
          ...form,
          ...obj,
        };
      } catch (error) {
        console.log(error);
      }
    },
    async getBranchList() {
      try {
        const { data } = await this.$http.get(
          "$hosting/project/branch/repo/" + this.info.id
        );
        this.branchList = data;
        this.form.currentBranch = data[0];
        this.getRepoDir();
      } catch (error) {
        console.log(error);
      }
    },
    async getRepoDir(item) {
      const params = {};
      if (item) {
        params.rootPath = item.id;
      } else {
        this.dirList = [];
      }
      this.dirBranch = params.ref = this.form.currentBranch;
      const { name, namespace } = this.info;
      let { data } = await this.$http.get(
        `$hosting/repo/${namespace}/dir/${name}/ref`,
        {
          params,
        }
      );
      data = data
        .map((it) => {
          it.id = it.fullPath;
          if (it.type == "dir") {
            it.children = [];
            if (!item) it.radio = true;
          }
          return it;
        })
        .sort((a) => {
          return a.type == "dir" ? -1 : 1;
        });
      if (item) {
        item.children = data;
      } else {
        this.dirList = [
          {
            name,
            id: srcDir,
            type: "dir",
            radio: true,
            children: data,
          },
        ];
      }
    },
    // matchNodeVersion(nodeVersion) {
    //   let nodeVersionList = [
    //     {
    //       name: "18.x",
    //       value: "18",
    //     },
    //     {
    //       name: "16.x",
    //       value: "16",
    //     },
    //     {
    //       name: "14.x",
    //       value: "14",
    //     },
    //   ];
    //   if (nodeVersion.indexOf("||") > 0) {
    //     let versionList = nodeVersion.split("||");
    //     versionList = versionList.map((it) => {
    //       return this.getMajorVersion(it);
    //     });
    //     console.log(versionList);
    //     for (const item of nodeVersionList) {
    //       for (const it of versionList) {
    //         if (item.value == it) {
    //           return it;
    //         }
    //       }
    //     }
    //     return "14";
    //   } else {
    //     let match = this.getMajorVersion(nodeVersion);
    //     let versionList = nodeVersionList.map((it) => it.value);
    //     if (versionList.findIndex((it) => it == match) > -1) return match;
    //     return "14";
    //     // if (versionList.includes(match)) return match;
    //   }
    // },
    // getMajorVersion(nodeVersion) {
    //   let majorVersion = nodeVersion.split(".")[0];
    //   let match = majorVersion.trim().replace(/\^|~|>|>=|<|<=|=/g, "");
    //   return match;
    // },

    matchNodeVersion(supportedNodeList, userNodeVersion) {
      for (const node of supportedNodeList) {
        console.log(node, userNodeVersion);
        console.log(semver.satisfies(node, userNodeVersion));
        if (semver.satisfies(node, userNodeVersion)) return node.split(".")[0];
      }
      return undefined;
    },
  },
  components: {
    NewStep1Tpl,
    NewStep1Hash,
    BuildCmd,
    BuildCmdTip,
    BuildOutputTip,
    EIconLink,
    EnvForm,
    NewStep1Web3Tpl,
  },
};
</script>
<style lang="scss">
.show-msg .v-text-field__details {
  display: block !important;
  padding-top: 10px !important;
}
.show-msg .v-messages {
  display: block !important;
}
</style>
