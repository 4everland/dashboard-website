<template>
  <div>
    <!-- Task List -->
    <div @click.stop="$refs.navDrawers.drawer = true" class="task-list">
      <span class="task-count" v-show="uploadingTaskLength != 0">{{
        uploadingTaskLength > 99 ? "99+" : uploadingTaskLength
      }}</span>
      <img src="/img/svg/common/task-list.svg" alt="" width="54" />
    </div>
    <keep-alive v-if="inFolder || inFile">
      <e-tabs v-if="inFolder" :list="list" :defTab="1" noRouter ignorePath />
    </keep-alive>
    <storage v-if="!inFolder" />

    <!-- Upload/Delete Folders Component -->
    <navigation-drawers ref="navDrawers"></navigation-drawers>
  </div>
</template>

<script>
import Vue from "vue";
import Storage from "@/views/bucket/storage";
import NavigationDrawers from "@/views/bucket/components/navigation-drawers";
// import BucketFolder from "@/views/bucket/components/bucket-folder";

// Vue.component("bucket-folder", BucketFolder);
// Vue.component("bucket-folder", BucketFolder);
// Vue.component("bucket-folder", BucketFolder);

import { bus } from "../../main";
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
      uploadingTaskLength: false,
    };
  },
  computed: {
    path() {
      return this.$route.path;
    },
    inFolder() {
      return this.path !== "/bucket/storage/" && /\/$/.test(this.path);
    },
    inFile() {
      return !/\/$/.test(this.path);
    },
  },
  created() {
    bus.$on("uploadingLength", (uploadingLength) => {
      this.uploadingTaskLength = uploadingLength;
    });
  },
  components: {
    Storage,
    NavigationDrawers,
  },
};
</script>

<style lang="scss" scoped>
.task-list {
  position: fixed;
  z-index: 999;
  bottom: 80px;
  right: 20px;
  color: #775da6;
  font-size: 16px;
  cursor: pointer;
  .task-count {
    position: absolute;
    right: -2px;
    top: -2px;
    width: 30px;
    height: 30px;
    font-size: 20px;
    text-align: center;
    color: #fff;
    background: #ff6960;
    border-radius: 50%;
    transform: scale(0.7);
  }
}
</style>