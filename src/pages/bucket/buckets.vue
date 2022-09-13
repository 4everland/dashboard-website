<template>
  <div>
    <!-- Task List -->
    <div @click.stop="handleOpen" class="task-list" v-if="!inFile">
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
    <!-- <navigation-drawers v-if="!inFile" ref="navDrawers"></navigation-drawers> -->

    <div class="control">
      <upload-control v-if="!inFile" ref="uploadControl"></upload-control>
      <delete-control
        v-if="!inFile"
        ref="deleteControl"
        class="mt-4"
      ></delete-control>
    </div>
  </div>
</template>

<script>
import Storage from "@/views/bucket/storage";
// import NavigationDrawers from "@/views/bucket/components/navigation-drawers";
import UploadControl from "@/views/bucket/components/upload-control";
import DeleteControl from "@/views/bucket/components/delete-control";
import { bus } from "../../utils/bus";
import initS3 from "./initS3";
export default {
  mixins: [initS3],
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
    if (this.$s3) return;
    this.initS3();
    bus.$on("uploadingLength", (uploadingLength) => {
      this.uploadingTaskLength = uploadingLength;
    });
  },
  methods: {
    handleOpen() {
      // this.$refs.navDrawers.drawer = true;
      this.$refs.uploadControl.isShow = true;
      this.$refs.deleteControl.isShow = true;
    },
  },
  components: {
    Storage,
    // NavigationDrawers,
    UploadControl,
    DeleteControl,
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
.control {
  z-index: 999;
  position: fixed;
  right: 24px;
  bottom: 24px;
}
</style>