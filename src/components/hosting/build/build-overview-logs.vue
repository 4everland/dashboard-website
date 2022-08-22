<template>
  <div>
    <e-toggle-card
      class="mt-5"
      title="Building"
      :value="getOpen(0)"
      :icon="getIcon(0)"
    >
      <template #time v-if="info && info.endAt">
        <div class="fz-14 gray">
          <e-time :endAt="info.endAt">{{ info.createAt }}</e-time>
        </div>
      </template>
      <build-log v-if="info" :list="logs" />
      <div class="fz-14 gray" v-else>Pending</div>
    </e-toggle-card>
    <e-toggle-card
      v-if="showHash"
      class="mt-5"
      :title="'Syncing to ' + info.platform"
      :value="getOpen(1)"
      :icon="getIcon(1)"
    >
      <e-kv
        min-width="70px"
        :label="`${info.platform} Hash:`"
        v-if="info && info.hash"
      >
        <a
          class="u"
          :href="$utils.getCidLink(info.hash, info.platform)"
          target="_blank"
          >{{ info.hash }}</a
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
    <e-toggle-card
      v-if="showHash"
      class="mt-5"
      title="Assigning Domains"
      :value="getOpen(2)"
      :icon="getIcon(2)"
    >
      <div v-if="domains.length && isDone">
        <p v-for="(it, i) in domains" :key="i">
          <h-domain :val="it" class="fz-14"></h-domain>
        </p>
      </div>
      <div v-else class="fz-14 gray">
        <span>Pending</span>
      </div>
    </e-toggle-card>
  </div>
</template>

<script>
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
    };
  },
  computed: {
    ...mapState({
      projInfo: (s) => s.projectInfo,
      buildInfo: (s) => s.buildInfo,
    }),
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
    showHash() {
      return (
        (this.info.platform &&
          ((this.projInfo.latest || {}).taskId == this.info.taskId ||
            this.$route.query.prod)) ||
        this.info.platform == "IPFS" ||
        this.info.platform == "AR"
      );
    },
  },
  watch: {
    taskId() {
      this.getInfo();
    },
    buildInfo({ name, data }) {
      if (data.taskId == this.taskId) {
        console.log(this.taskId, name);
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
        const { data } = await this.$http2.get(
          `/project/task/object/${this.taskId}`
        );
        const info = data.task;
        if (data.hash) info.hash = data.hash;
        const { hash, state = "", platform } = info;
        const isIpfs = platform == "IPFS";
        this.state = state.toLowerCase();
        this.isDone = this.state == "success";
        info.isFail = /fail|timeout|error|cancel/.test(this.state);
        this.info = info;
        this.$emit("info", info);
        this.logs = data.log;
        if (this.isDone) {
          this.curIdx = isIpfs ? 2 : 1;
          this.$store.dispatch("getProjectInfo", this.info.projectId);
        } else if (this.isSyncErr) {
          this.curIdx = 1;
        } else if (hash || this.state == "syncing") {
          this.curIdx = isIpfs ? 2 : 1;
        }
      } catch (error) {
        console.log(error);
      }
    },
    getOpen(i) {
      return i > -1 && i <= this.curIdx;
    },
    getIcon(i) {
      if (!this.info) return "";
      if (i == 0) {
        if (this.isSyncErr) return "checked";
        if (this.isFail) return "fail";
      }
      if (this.isSyncErr && i == 1) return "fail";
      if (this.isFail) return "pending";
      if (i < this.curIdx || this.isDone) return "checked";
      return i == this.curIdx ? "loading" : "pending";
    },
  },
};
</script>