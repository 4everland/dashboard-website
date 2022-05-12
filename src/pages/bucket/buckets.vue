<template>
  <div class="container">
    <keep-alive>
      <e-tabs v-if="inFolder" :list="list" noRouter />
    </keep-alive>
    <div v-if="!inFolder">
      <storage></storage>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          text: "Overview",
          comp: "bucket-overview",
        },
        {
          text: "Files",
          comp: "bucket-folder",
        },
        {
          text: "Statistics",
          comp: "bucket-statistics",
        },
      ],
    };
  },
  computed: {
    path() {
      return this.$route.path;
    },
    inFolder() {
      return this.path !== "/bucket/storage/" && /\/$/.test(this.path);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>