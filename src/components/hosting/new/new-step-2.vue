<template>
  <div v-if="taskId">
    <div class="main-wrap">
      <h3>Deploy</h3>
      <div class="d-flex al-c" v-if="!isDone">
        <v-progress-circular
          :size="15"
          :width="1.5"
          color="#999"
          indeterminate
        />
        <div class="gray fz-15 ml-3">
          <div v-if="info">
            Deployment started <e-time>{{ Date.now() }}</e-time>
          </div>
          <span v-else>Start Building</span>
        </div>
      </div>

      <e-toggle-card class="mt-5" title="Building" :value="cardOpen(0)">
        <build-log :logs="logs" @done="isDone = true" />
      </e-toggle-card>
      <e-toggle-card class="mt-5" title="Syncing to IPFS" :value="cardOpen(1)">
        <e-kv label="IPFS Hash">Pending</e-kv>
      </e-toggle-card>
      <e-toggle-card
        class="mt-5"
        title="Assigning Domains"
        :value="cardOpen(2)"
      >
        <div>test</div>
      </e-toggle-card>
    </div>
    <div class="ta-r mt-4" v-if="!isDone">
      <v-btn rounded outlined @click="onCancel">Cancel</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curIdx: 0,
      logs: [
        {
          timestamp: Date.now(),
          content: "test1",
        },
        {
          timestamp: Date.now(),
          content: "test1",
        },
        {
          timestamp: Date.now(),
          content: "test1",
        },
        {
          timestamp: Date.now(),
          content: "test1",
        },
        {
          timestamp: Date.now(),
          content: "test1",
        },
        {
          timestamp: Date.now(),
          content: "test1 9923 ddd ddd sss dddd sss ddd",
        },
      ],
      info: null,
      isDone: !false,
    };
  },
  computed: {
    taskId() {
      return this.$route.query.taskId;
    },
  },
  watch: {
    taskId() {
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
        this.isDone = false;
        this.info = null;
        this.logs = [];
        const { data } = await this.$http2.get(
          `/project/task/object/${this.taskId}`
        );
        this.info = data.task;
        this.logs = data.log;
      } catch (error) {
        console.log(error);
      }
    },
    cardOpen(i) {
      return i > -1 && i <= this.curIdx;
    },
    onCancel() {
      this.$confirm("", "Are you sure to quit this deployment ?").then(() => {
        this.$router.replace("/hosting/projects");
      });
    },
  },
};
</script>