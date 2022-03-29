<template>
  <div v-if="val" class="h-status" :class="staCls">
    <span>{{ text || state.capitalize() }}</span>
  </div>
</template>

<script>
export default {
  props: {
    val: String,
    text: String,
  },
  computed: {
    state() {
      return this.val.toLowerCase();
    },
    staCls() {
      let cls = "gray";
      if (this.state == "success") cls = "suc-1";
      else if (this.state == "running") cls = "warn-1";
      else if (/fail|error|cancel|timeout/i.test(this.state)) cls = "fail-1";
      return cls;
    },
  },
};
</script>
