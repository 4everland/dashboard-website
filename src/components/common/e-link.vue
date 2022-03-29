<template>
  <a :href="link" target="_blank" class="u" v-if="href">
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
    link() {
      if (this.href && this.href.indexOf("//") == -1) return "//" + this.href;
      return this.href;
    },
  },
};
</script>