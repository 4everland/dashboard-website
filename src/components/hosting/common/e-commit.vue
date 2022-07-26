<template>
  <a v-if="info && href" :href="href" target="_blank" class="b u">
    {{ (info.hash || info.sha).substr(0, 6) }} —
    {{ (info.message || "").cutStr(60, 20) }}
  </a>
</template>

<script>
export default {
  props: {
    info: Object,
  },
  computed: {
    href() {
      let { htmlUrl, url, prefix, hash, repo } = this.info || {};
      if (htmlUrl) return htmlUrl;
      if (url) return url;
      if (prefix) return prefix + "commit/" + hash;
      const { namespace, name } = repo || {};
      if (!name) return null;
      return `https://github.com/${namespace}/${name}/commit/${hash}`;
    },
  },
};
</script>