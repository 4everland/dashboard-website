<template>
  <div class="pos-r">
    <div
      :class="!asMobile || fix ? 'pos-a right-0' : 'ta-r mb-5'"
      :style="{
        top: (top || -50) + 'px',
        ...customStyle,
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fix: Boolean,
    top: Number,
    customStyle: Object,
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>