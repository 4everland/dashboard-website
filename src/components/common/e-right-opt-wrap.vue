<template>
  <div class="pos-r">
    <div
      :class="!asMobile || fix ? 'pos-a right-0' : 'ta-r mb-5'"
      style="top: -50px"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fix: Boolean,
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>