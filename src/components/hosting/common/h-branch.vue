<template>
  <div class="d-flex al-c">
    <v-icon size="18" :color="$color1">{{ icon }}</v-icon>
    <a
      v-if="href"
      :href="href"
      class="ml-2 b u"
      target="_blank"
      :style="{
        color,
      }"
    >
      {{ branch }}
    </a>
  </div>
</template>

<script>
export default {
  props: {
    info: Object,
    color: String,
    icon: {
      type: String,
      default: "mdi-github",
    },
  },
  computed: {
    branch() {
      const config = this.info.buildConfig || this.info.config || {};
      return config.currentBranch;
    },
    href() {
      const { prefix } = this.info.commits || {};
      if (prefix) return prefix + "tree/" + this.branch;
      const { namespace, name } = this.info.repo || {};
      if (!name) return null;
      return `https://github.com/${namespace}/${name}/tree/${this.branch}`;
    },
  },
};
</script>