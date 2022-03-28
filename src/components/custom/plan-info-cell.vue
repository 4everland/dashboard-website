<template>
  <v-icon
    v-if="typeof value == 'boolean'"
    :color="value ? '#67C669' : '#F15C5C'"
    >mdi-{{ value ? "check" : "close" }}</v-icon
  >
  <span v-else v-html="html"></span>
</template>

<script>
export default {
  props: {
    value: null,
  },
  computed: {
    html() {
      let val = this.value;
      const mat = /^(\d+)\s+(\S+)/.exec(val);
      if (mat) {
        return `<b>${mat[1]}</b><span class="op-5 ml-1 scale-9 d-ib">${mat[2]}</span>`;
      }
      return `<b>${val}</b>`;
    },
  },
};
</script>