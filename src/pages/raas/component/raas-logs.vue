<template>
  <div class="detail-logs">
    <div class="top-btn-box">
      <div class="type-box">
        <v-btn
          v-for="(item, index) in btnList"
          :key="item.type"
          class="type-btn"
          :class="btnActive == index ? 'active' : ''"
          elevation="0"
          @click="chooseType(item, index)"
          >{{ item.text }}</v-btn
        >
      </div>
    </div>
    <div class="mt-2">
      <SimpleCodeEditor
        theme="github"
        wrap
        :modelValue.sync="logs"
        width="100%"
        height="500px"
        readOnly
      ></SimpleCodeEditor>
    </div>
  </div>
</template>

<script>
import { fetchRollupLogs } from "@/api/raas.js";
import SimpleCodeEditor from "@/views/hosting/common/simple-code-editor";

export default {
  name: "DashboardWebsiteRaasLogs",
  components: { SimpleCodeEditor },
  data() {
    return {
      btnActive: 0,
      id: null,
      type: "sequncer",
      btnList: [
        {
          text: "Sequncer",
          type: "sequncer",
        },
        {
          text: "Batcher",
          type: "batcher",
        },
        {
          text: "Proposer",
          type: "proposer",
        },
      ],
      logs: "",
    };
  },

  mounted() {
    this.id = this.$route.params.id;
    this.getLogs();
  },

  methods: {
    async getLogs() {
      const id = this.id;
      const type = this.type;
      const endTime = Math.floor(Date.now() / 1000);
      const startTime = endTime - 5 * 60;
      const params = {
        from: startTime,
        to: endTime,
      };
      const { data } = await fetchRollupLogs(id, type, params);
      let logStr = "";
      data.items.forEach((item) => {
        logStr += item.content + "\n\n";
      });
      this.logs = logStr;
    },
    async chooseType(item, index) {
      this.btnActive = index;
      this.type = item.type;
      this.getLogs();
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-logs {
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #cbd5e1;
  background: #fff;
  .top-btn-box {
    display: flex;
    align-items: center;
    .type-box {
      display: flex;
      gap: 8px;
      .type-btn {
        color: #0f172a;
        font-family: "SF Pro Text";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        border-radius: 4px;
        border: 1px solid #cbd5e1;
        background: #fff;
      }
      .active {
        font-weight: 700;
        color: #735ea1;
        border: 1px solid rgba(115, 94, 161, 0.25);
        background: #f3e8ff;
      }
    }
  }
}
</style>
