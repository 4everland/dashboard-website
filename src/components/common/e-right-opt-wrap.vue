<template>
  <div class="pos-r">
    <div :class="asMobile ? 'ta-r mb-5' : 'pos-a right-0'" style="top: -50px">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>