<template>
  <div>
    <e-toggle-card class="mt-5" title="Building" :value="cardOpen(0)">
      <build-log v-if="info" :list="logs" />
      <div class="fz-14 gray" v-else>Pending</div>
    </e-toggle-card>
    <e-toggle-card class="mt-5" title="Syncing to IPFS" :value="cardOpen(1)">
      <e-kv label="IPFS Hash" v-if="info && info.cid">{{ info.cid }}</e-kv>
      <div class="fz-14 gray" v-else>Pending</div>
    </e-toggle-card>
    <e-toggle-card class="mt-5" title="Assigning Domains" :value="cardOpen(2)">
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
  },
  watch: {
    taskId() {
      this.getInfo();
    },
    buildInfo({ name, data }) {
      if (data.taskId == this.taskId) {
        console.log(this.taskId, name);
        const last = this.list[this.list.length - 1];
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
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      if (!this.taskId) return;
      try {
        this.isDone = false;
        this.info = null;
        this.logs = [];
        const { data } = await this.$http2.get(
          `/project/task/object/${this.taskId}`
        );
        this.$emit("info", data.task);
        this.logs = data.log;
        const { cid, state = "" } = (this.info = data.task);
        this.state = state.toLowerCase();
        this.isDone = this.state == "success";
        if (this.isDone) {
          this.curIdx = 2;
          this.$store.dispatch("getProjectInfo", this.info.projectId);
        } else if (cid) {
          this.curIdx = 1;
        }
      } catch (error) {
        console.log(error);
      }
    },
    cardOpen(i) {
      return i > -1 && i <= this.curIdx;
    },
  },
};
</script>