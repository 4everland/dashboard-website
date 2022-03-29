<template>
  <div>
    <e-toggle-card class="mt-5" title="Building" :value="cardOpen(0)">
      <build-log :logs="logs" @done="isDone = true" />
    </e-toggle-card>
    <e-toggle-card class="mt-5" title="Syncing to IPFS" :value="cardOpen(1)">
      <e-kv label="IPFS Hash" v-if="info && info.cid">{{ info.cid }}</e-kv>
      <div class="fz-14 gray" v-else>Pending</div>
    </e-toggle-card>
    <e-toggle-card class="mt-5" title="Assigning Domains" :value="cardOpen(2)">
      <div class="fz-14 gray">Pending</div>
    </e-toggle-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curIdx: 0,
      logs: [],
      info: null,
      isDone: false,
    };
  },
  computed: {
    taskId() {
      const { query, params } = this.$route;
      const { taskId } = {
        ...query,
        ...params,
      };
      return taskId;
    },
  },
  watch: {
    taskId() {
      this.getInfo();
    },
    isDone(val) {
      this.$emit("done", val);
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
        const { cid, state } = (this.info = data.task);
        this.isDone = state.toLowerCase() == "success";
        if (this.isDone) this.curIdx = 2;
        else if (cid) this.curIdx = 1;
        this.$emit("info", this.info);
        this.logs = data.log;
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