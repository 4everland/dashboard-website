<template>
  <a :href="link" target="_blank" class="u" v-if="isLink">
    <slot></slot>
  </a>
  <router-link v-else-if="to" :to="to" class="link">
    <slot></slot>
  </router-link>
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
    isLink() {
      return (this.href || "").includes("//");
    },
    link() {
      return this.isLink ? this.href : "";
    },
    to() {
      let to = this.isLink ? "" : (this.href || "").replace("#", "");
      if (to && !/^\//.test(to)) to = "/" + to;
      return to;
    },
  },
  methods: {
    onClick() {
      this.$router.push(this.to);
    },
  },
};
</script>