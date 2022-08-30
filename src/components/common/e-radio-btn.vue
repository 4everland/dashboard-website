<template>
  <div class="al-c bdrs-5 bd-1 ov-h">
    <div
      @click="curIdx = i"
      class="pa-1 fz-14 ta-c cursor-p"
      :style="{
        'min-width': minWidth,
      }"
      :class="{
        'bg-1': i == curIdx,
      }"
      v-for="(it, i) in list"
      :key="i"
    >
      {{ it.label }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: Array,
    value: Number,
    minWidth: {
      type: String,
      default: "70px",
    },
  },
  computed: {
    list() {
      return this.options.map((it) => {
        if (typeof it == "string")
          return {
            label: it,
            value: it,
          };
        return it;
      });
    },
  },
  data() {
    return {
      curIdx: this.value || 0,
    };
  },
  watch: {
    curIdx(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.curIdx = val;
    },
  },
};
</script>