<template>
  <div class="pa-5 bd-1 bdrs-3 bg-white">
    <div class="d-flex al-c hover-1" @click="isShow = !isShow">
      <v-icon
        :color="color"
        :class="{
          'rotate-90': isShow,
        }"
        >mdi-menu-right</v-icon
      >
      <span class="fz-14">{{ title }}</span>
    </div>
    <div class="mt-5" v-if="isShow">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
    title: String,
    color: {
      type: String,
      default: "#34A9FF",
    },
  },
  data() {
    return {
      isShow: this.value,
    };
  },
  watch: {
    value(val) {
      this.isShow = val;
    },
    isShow(val) {
      this.$emit("input", val);
    },
  },
};
</script>