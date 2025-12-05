<template>
  <div class="pos-r">
    <div
      ref="con"
      class="ov-a"
      :style="{
        height: height,
      }"
    >
      <div class="mb-2" v-for="(it, i) in list" :key="i">
        <e-kv :label="new Date(it.timestamp).format('HH:mm:ss.S')">
          <span class="wb-all">{{ info.platform == "WALRUS" ? it.content.startsWith("deploy site success:") ? "deploy site success: "+info.walrus.siteIdentifier : it.content : it.content }}</span>
        </e-kv>
      </div>
      <div v-if="errMsg">
        <e-kv>
          <span class="red-1">{{ errMsg }}</span>
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
export default {
  props: {
    taskId: String,
    list: Array,
    info: Object,
    height: {
      type: String,
      default: "140px",
    },
    errMsg: String,
  },
  data() {
    return {
      isBtm: true,
      newNum: 0,
    };
  },
  watch: {
    list(val, oldVal) {
      const num = val.length - oldVal.length;
      if (!this.isBtm && num) this.newNum = num;
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
