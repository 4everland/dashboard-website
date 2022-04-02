<template>
  <div>
    <e-toggle-card
      class="mt-5"
      title="Building"
      :value="getOpen(0)"
      :icon="getIcon(0)"
    >
      <template #time v-if="isFail">
        <div class="fz-14 gray" v-if="info">
          <e-time :endAt="info.endAt">{{ info.createAt }}</e-time>
        </div>
      </template>
      <build-log v-if="info" :list="logs" />
      <div class="fz-14 gray" v-else>Pending</div>
    </e-toggle-card>
    <e-toggle-card
      class="mt-5"
      title="Syncing to IPFS"
      :value="getOpen(1)"
      :icon="getIcon(1)"
    >
      <e-kv label="IPFS Hash" v-if="info && info.cid">{{ info.cid }}</e-kv>
      <div class="fz-14 gray" v-else>Pending</div>
    </e-toggle-card>
    <e-toggle-card
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
      <div v-else class="fz-14 gray">Pending</div>
    </e-toggle-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      curIdx: 0,
      logs: [],
      info: null,
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
    state(val) {
      this.$emit("state", val);
      this.getInfo();
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
        const { cid, state = "" } = info;
        this.state = state.toLowerCase();
        this.isDone = this.state == "success";
        info.isFail = /fail|timeout|error|cancel/.test(this.state);
        this.info = info;
        this.$emit("info", info);
        this.logs = data.log;
        if (this.isDone) {
          this.curIdx = 2;
          this.$store.dispatch("getProjectInfo", this.info.projectId);
        } else if (cid) {
          this.curIdx = 2;
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
      if (i == 0 && this.isFail) return "fail";
      if (this.isFail) return "pending";
      if (i < this.curIdx || this.isDone) return "checked";
      return i == this.curIdx ? "loading" : "pending";
    },
  },
};
</script>