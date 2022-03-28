<template>
  <div class="pos-r">
    <div
      ref="con"
      class="ov-a"
      :style="{
        'max-height': maxHeight,
      }"
    >
      <div class="mb-2" v-for="(it, i) in list" :key="i">
        <e-kv :label="new Date(it.timestamp).format('HH:mm:ss.S')">
          <span class="wb-all">{{ it.content }}</span>
        </e-kv>
      </div>
    </div>
    <div class="pos-a btm-0 right-0 z-10 pa-2" v-if="!isBtm">
      <v-chip
        small
        outlined
        :color="newNum > 0 ? 'success' : 'primary'"
        style="background: #fff !important"
        @click="goLogEnd(true)"
        >{{
          newNum > 0
            ? `${newNum} new log${newNum > 1 ? "s" : ""}`
            : "Go to last line"
        }}</v-chip
      >
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    taskId: String,
    logs: Array,
    maxHeight: {
      type: String,
      default: "140px",
    },
  },
  computed: {
    ...mapState({
      buildInfo: (s) => s.buildInfo,
    }),
    list() {
      return [...this.logs, ...this.newLogs];
    },
  },
  data() {
    return {
      newLogs: [],
      isBtm: true,
      newNum: 0,
    };
  },
  watch: {
    buildInfo({ name, data }) {
      if (data.taskId == this.taskId) {
        console.log(this.taskId, name);
        const last = this.list[this.list.length - 1];
        if (name != "log") {
          if (data.state == "SUCCESS") {
            this.$emit("done");
          }
        } else if (last && last.content != data.content) {
          this.newLogs.push(data);
          if (!this.isBtm) this.newNum++;
          this.$emit("push", data);
        }
        // this.state = data.state.toLowerCase();
      }
    },
    list() {
      this.goLogEnd();
    },
  },
  mounted() {
    this.goLogEnd();
  },
  methods: {
    goLogEnd(force) {
      if (this.isBtm === false && !force) {
        return;
      }
      this.$nextTick(() => {
        const el = this.$refs.con;
        if (el) {
          if (!el.onscroll) {
            el.onscroll = () => {
              if (this.endGap)
                this.isBtm = el.scrollHeight - el.scrollTop <= this.endGap + 5;
            };
          }
          el.scrollTo(0, el.scrollHeight);
          this.isBtm = true;
          setTimeout(() => {
            this.endGap = el.scrollHeight - el.scrollTop;
          }, 10);
        }
      });
    },
    scrollToLog() {
      const el = this.$refs.con;
      if (el) {
        window.scrollTo(0, el.offsetTop);
      }
      this.goLogEnd();
    },
  },
};
</script>