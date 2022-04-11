<template>
  <a
    :href="link"
    :target="isHash ? '' : '_blank'"
    :class="isHash ? '' : 'u'"
    v-if="href"
  >
    <slot></slot>
  </a>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    href: String,
  },
  computed: {
    isHash() {
      return /^#/.test(this.href);
    },
    link() {
      if (this.href && this.href.indexOf("//") == -1 && !this.isHash)
        return "//" + this.href;
      return this.href;
    },
  },
};
</script>