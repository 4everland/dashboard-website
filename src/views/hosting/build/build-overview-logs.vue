<template>
  <div>
    <e-toggle-card
      class="mt-5"
      title="Resolve IPNS"
      :value="getOpen(-1)"
      :icon="getIcon(-1)"
      v-if="ipnsDeployIpfs || ipnsDeployOther"
    >
      <template #time v-if="info && info.endAt">
        <div class="fz-14 gray">
          <e-time :endAt="info.endAt">{{ info.createAt }}</e-time>
        </div>
      </template>
      <!-- <build-log v-if="info" :list="logs" :errMsg="errMsg" /> -->

      <div class="fz-14">
        IPNS:
        {{ projInfo.ipfsPath ? projInfo.ipfsPath.replace("/ipns/", "") : "-" }}
      </div>
      <div class="fz-14 mt-4">
        <span v-if="isFail && !info.cid">Failure: The Hash not found</span>
        <span v-else>
          IPFS Hash: {{ info.cid ? info.cid : "Resolving pending" }}
        </span>
      </div>
    </e-toggle-card>
    <e-toggle-card
      class="mt-5"
      :title="gitHubDeploy || web3TplDeploy ? 'Building' : 'Pinning'"
      :value="getOpen(0)"
      :icon="getIcon(0)"
    >
      <template #time v-if="info && info.endAt">
        <div class="fz-14 gray">
          <e-time :endAt="info.endAt">{{ info.createAt }}</e-time>
        </div>
      </template>
      <div v-if="info">
        <build-log v-if="info && !hashDeploy" :list="logs" :errMsg="errMsg" />
        <div v-else class="fz-14">
          <p v-if="web3TplDeploy">
            Start: Download the file directory and update the configuration
            file...
          </p>
          <p v-if="isFail && !isSyncErr">{{ errMsg }}</p>
          <p v-else>
            {{ web3TplDeploy ? "Generate Hash" : "IPFS Hash" }}:
            {{ ipfsHash ? ipfsHash : "Resolving pending" }}
          </p>
        </div>
      </div>
      <div class="fz-14 gray" v-else>Pending</div>
    </e-toggle-card>

    <e-toggle-card
      v-if="showHash"
      class="mt-5"
      title="Assigning Domains"
      :value="getOpen(1)"
      :icon="getIcon(1)"
    >
      <div v-if="domains.length">
        <p v-for="(it, i) in domains" :key="i">
          <h-domain
            :val="it"
            class="fz-14"
            :disabled="!projInfo.online"
          ></h-domain>
        </p>
      </div>
      <div v-else class="fz-14 gray">
        <span>Pending</span>
      </div>
    </e-toggle-card>
    <e-toggle-card
      v-if="
        (showHash && !ipfsDeployIpfs && !ipnsDeployIpfs) ||
        (showHash && web3TplDeploy)
      "
      class="mt-5"
      :title="
        'Syncing to ' +
        (info.platform == 'GREENFIELD'
          ? 'BNB Greenfield Testnet'
          : info.platform)
      "
      :value="getOpen(2)"
      :icon="getIcon(2)"
    >
      <e-kv
        min-width="70px"
        :label="`${info.platform} Hash:`"
        v-if="info && info.hash && info.platform != 'GREENFIELD'"
      >
        <a
          class="u"
          :href="$utils.getCidLink(info.hash, info.platform, projInfo.online)"
          target="_blank"
          >{{ showHashVal(info.hash, info.platform) }}</a
        >
      </e-kv>
      <e-kv
        min-width="70px"
        :label="`BNB Greenfield Testnet :`"
        v-else-if="info && info.greenfield && info.platform == 'GREENFIELD'"
      >
        <a
          class="u"
          :href="$utils.getGreenfieldLink(info.greenfield.tx)"
          target="_blank"
          >{{ showHashVal(greenfieldHash, info.platform) }}</a
        >
      </e-kv>
      <div class="fz-14 gray" v-else>
        <div v-if="isSyncErr" class="red-1">Not synchronized</div>
        <div v-else-if="info && info.platform == 'IC'">
          Syncing to IC may take more time to complete,
          <e-link href="/hosting/projects">click here</e-link> for other
          operations without waiting.
        </div>
        <div v-else-if="info && info.platform == 'AR'">
          Syncing to AR may take more time to complete,
          <e-link href="/hosting/projects">click here</e-link> for other
          operations without waiting.
        </div>
        <span v-else>
          <h-status :val="state"></h-status>
        </span>
      </div>
    </e-toggle-card>
  </div>
</template>

<script>
import EToggleCard from "@/views/hosting/common/e-toggle-card";
import BuildLog from "@/views/hosting/common/build-log";
import HDomain from "@/views/hosting/common/h-domain";
import HStatus from "@/views/hosting/common/h-status";
import { mapState } from "vuex";

export default {
  props: {
    inNew: Boolean,
  },
  data() {
    return {
      curIdx: 0,
      logs: [],
      info: {
        platform: null,
      },
      isDone: false,
      state: "",
      errMsg: "",
      openIds: [],
      timer: null,
    };
  },
  computed: {
    ...mapState({
      projInfo: (s) => s.projectInfo,
      buildInfo: (s) => s.buildInfo,
    }),
    ipfsHash() {
      if (this.ipfsDeploy)
        return this.info.cid || this.projInfo.ipfsPath.replace("/ipfs/", "");
      return this.info.cid;
    },
    taskId() {
      const { query, params } = this.$route;
      const { taskId } = {
        ...query,
        ...params,
      };
      return taskId;
    },
    domains() {
      if (!this.info) return [];
      let arr = [];
      if (this.projInfo.taskId == this.taskId) {
        arr = this.projInfo.domains.map((it) => it.domain);
      }
      const { domain } = this.info;
      if (!arr.includes(domain)) arr.push(domain);
      return arr;
    },
    isFail() {
      return this.info && this.info.isFail;
    },
    isSyncErr() {
      return (
        /fail/i.test(this.info.syncState) || this.info.state == "CANCELLED"
      );
    },
    isSyncing() {
      return this.info && this.state == "syncing";
    },
    isPending() {
      return this.info && this.state == "pending";
    },
    isRunning() {
      return this.info && this.state == "running";
    },
    showHash() {
      return (
        (this.info.platform &&
          ((this.projInfo.latest || {}).taskId == this.info.taskId ||
            this.$route.query.prod)) ||
        this.info.platform == "IPFS" ||
        this.info.platform == "AR"
      );
    },
    hashDeploy() {
      return this.info.deployType == "CID" || this.info.deployType == "IPNS";
    },
    ipfsDeployIpfs() {
      return this.info.deployType == "CID" && this.info.platform == "IPFS";
    },
    ipnsDeployIpfs() {
      return this.info.deployType == "IPNS" && this.info.platform == "IPFS";
    },
    ipnsDeployOther() {
      return this.info.deployType == "IPNS" && this.info.platform != "IPFS";
    },

    ipfsDeploy() {
      return this.info.deployType == "CID";
    },
    ipnsDeploy() {
      return this.info.deployType == "IPNS";
    },
    web3TplDeploy() {
      return this.projInfo.web3TemplateId;
    },
    gitHubDeploy() {
      return this.projInfo.deployType == "GITHUB";
    },
    getIcon() {
      return function (i) {
        if ((this.isPending || this.isRunning) && !this.info.cid) {
          if (i == -1) {
            return "loading";
          } else {
            if (!this.ipnsDeploy && i == 0) return "loading";
            return "pending";
          }
        } else if ((this.isPending || this.isRunning) && this.info.cid) {
          if (i == -1) {
            return "checked";
          } else {
            if (this.ipnsDeploy && i == 0) return "loading";
            if (i == 0) return "checked";
            return "pending";
          }
        } else if (this.isSyncing) {
          if (i != 2) {
            return "checked";
          }
          return "loading";
        } else if (this.isSyncErr) {
          if (i != 2) {
            return "checked";
          }
          return "fail";
        } else if (this.isFail) {
          if (this.ipnsDeploy) {
            if (i == 0) return "fail";
            if (i < 0) return "checked";
            if (i > 0) return "pending";
          } else {
            if (i == 0) return "fail";
            if (i > 0) return "pending";
          }
        } else if (this.isDone) {
          return "checked";
        } else {
          return "pending";
        }
      };
    },
    getIpns() {
      return function (val) {
        return val.replace("/ipns/", "");
      };
    },
    greenfieldHash() {
      if (this.info.platform == "GREENFIELD" && this.info.greenfield) {
        return this.info.greenfield.bucket + "/" + this.info.greenfield.object;
      }
      return "";
    },
    showHashVal() {
      return function (val, plat) {
        if (plat == "IC") {
          return "ic://" + val;
        } else if (plat == "AR") {
          return "ar://" + val;
        } else if (plat == "GREENFIELD") {
          return "gnfs://" + val;
        } else if (plat == "IPNS") {
          return "ipns://" + val;
        } else {
          return "ipfs://" + val;
        }
      };
    },
  },
  watch: {
    taskId() {
      this.getInfo();
    },
    buildInfo({ name, data }) {
      console.log(data);
      if (data.taskId == this.taskId) {
        console.log(this.taskId, name, this.logs, "logs");
        const last = this.logs[this.logs.length - 1];
        if (name != "log") {
          if (data.state == "SUCCESS") {
            this.getInfo();
          }
        } else if (last && last.content != data.content) {
          this.logs.push(data);
        }
        this.state = data.state.toLowerCase();
      }
    },
    isDone(val) {
      this.$emit("done", val);
    },
    state(val, oldVal) {
      this.$emit("state", val);
      if (oldVal) this.getInfo();
    },
  },

  mounted() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      if (!this.taskId) return;
      try {
        const { data } = await this.$http.get(
          `$hosting/project/task/object/${this.taskId}`
        );
        const info = data.task;
        console.log(info);

        if (data.hash) info.hash = data.hash;
        this.errMsg = data.errorMessage || "";
        const { hash, state = "" } = info;
        this.state = state.toLowerCase();
        this.isDone = this.state == "success";
        info.isFail = /fail|timeout|error|cancel/.test(this.state);
        this.info = info;
        this.$emit("info", info);
        this.initOpenIds();

        // if (!data.log) {
        //   const log = {
        //     timestamp: info.endAt || info.createAt,
        //   };
        //   if (this.isFail) log.content = "deploy failed.";
        //   else if (this.state == "syncing" || this.isDone)
        //     log.content = "deploy site successfully " + info.cid;
        //   else log.content = "deploying...";
        //   data.log = [log];
        // }

        this.logs = data.log || [];
        if (info.deployType == "IPNS") {
          if (info.cid) {
            this.timer ? clearInterval(this.timer) : false;
            this.openIds = [-1, 0];
          } else {
            if (!this.timer) {
              this.timer = setInterval(() => {
                this.getInfo();
              }, 3000);
            }
            if (info.state == "FAILURE") {
              clearInterval(this.timer);
            }
          }
        }
        if (this.isDone) {
          if (this.ipfsDeploy || this.gitHubDeploy) {
            this.openIds = [0, 1, 2];
          }
          if (this.ipnsDeploy) {
            this.openIds = [-1, 0, 1, 2];
          }
          this.$store.dispatch("getProjectInfo", this.info.projectId);
        } else if (hash || this.state == "syncing" || this.isSyncErr) {
          if (this.ipfsDeploy || this.gitHubDeploy) {
            this.openIds = [0, 1];
          }
          if (this.ipnsDeploy) {
            this.openIds = [-1, 0, 1];
          }
        } else if (this.isFail) {
          if (this.ipfsDeploy || this.gitHubDeploy) {
            this.openIds = [0];
          }
          if (this.ipnsDeploy) {
            this.openIds = [-1, 0];
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    initOpenIds() {
      if (this.ipnsDeploy) {
        this.openIds = [-1];
      } else {
        this.openIds = [0];
      }
    },
    getOpen(i) {
      return this.openIds.includes(i);
    },
  },
  components: {
    EToggleCard,
    BuildLog,
    HDomain,
    HStatus,
  },
};
</script>