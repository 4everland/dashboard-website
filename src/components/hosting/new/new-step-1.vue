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
          cols="4"
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

              <img
                class="beta-icon"
                v-if="it.name == 'IC'"
                src="/img/svg/hosting/h-beta.svg"
                height="20"
                alt=""
              />
            </div>
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
          <e-menu offset-y>
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
      <div class="gray mt-5 fz-14">
        Tips: 4EVERLAND HOSTING only serves static pages (Server-Side-Rendering
        is not supported now)
      </div>
    </div>
    <div class="ta-c mt-4">
      <v-btn color="primary" @click="onDeploy" min-width="100">Deploy</v-btn>
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
</template>

<script>
import frameworks from "../../../plugins/config/frameworks";

const srcDir = "./";

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
    info() {
      if (this.isTpl) return this.repoInfo;
      return this.data;
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
          label: "Internet Computer",
          name: "IC",
          icon: "h-ic.svg",
        },
        // {
        //   label: "Arweave",
        //   name: "AR",
        //   icon: "h-ar.svg",
        // },
      ],
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
      const { c, e } = this.query;
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
        rootDirectory: srcDir,
        framework: frameWorkAdvice,
        env: envList,
        platform: "IPFS",
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
        const { data } = await this.$http2.post("/project", body);
        const {
          data: { taskId },
        } = await this.$http2.post(`/project/${data.projectId}/build`);
        this.$router.replace(
          `/hosting/new?id=${data.projectId}&taskId=${taskId}`
        );
        this.$emit("next");
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
    onFramework(val) {
      const item = this.$getFramework(val);
      const { buildCommand = {}, outputDirectory = {} } = item.settings || {};
      const obj = {
        outputDirectory: outputDirectory.value || "./",
      };
      if (!this.scripts) {
        obj.buildCommand = buildCommand.value || "";
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
        const { data } = await this.$http2.get(
          "/project/detect-framework/" + this.info.id,
          { params }
        );
        let { scripts, framework = null } = data;
        const obj = {
          framework,
        };
        if (scripts) {
          this.scripts = JSON.parse(scripts);
          const { build } = this.scripts;
          if (build && framework != "nextjs") {
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
        const { data } = await this.$http2.get(
          "/project/branch/repo/" + this.info.id
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
      let { data } = await this.$http2.get(
        `/repo/${namespace}/dir/${name}/ref`,
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
  },
};
</script>