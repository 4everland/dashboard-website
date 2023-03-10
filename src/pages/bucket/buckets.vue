<template>
  <div>
    <!-- <keep-alive v-if="inFolder || inFile"> -->
    <e-tabs
      v-if="inFolder"
      :list="list"
      :defTab="1"
      bucket
      noRouter
      ignorePath
    />
    <!-- </keep-alive> -->
    <storage v-if="!inFolder" />

    <!-- Upload/Delete Folders Component -->
    <!-- <navigation-drawers v-if="!inFile" ref="navDrawers"></navigation-drawers> -->

    <div
      class="control"
      :style="{
        transform: isShowOperationBar
          ? 'translateY(-70px)'
          : 'translateY(-24px)',
      }"
    >
      <pin-cid-control v-if="!inFile"></pin-cid-control>
      <upload-control v-if="!inFile" class="mt-4"></upload-control>
      <delete-control v-if="!inFile" class="mt-4"></delete-control>
    </div>
  </div>
</template>

<script>
import Storage from "@/views/bucket/storage";
// import NavigationDrawers from "@/views/bucket/components/navigation-drawers";
import UploadControl from "@/views/bucket/components/upload-control";
import DeleteControl from "@/views/bucket/components/delete-control";
import PinCidControl from "@/views/bucket/components/pin-cid-control";

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
          text: "Snapshots",
          comp: "bucket-snapshots",
        },
        {
          text: "Statistics",
          comp: "bucket-statistics",
        },
      ],
      isShowOperationBar: false,
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
  },
  mounted() {
    bus.$on("showOperationBar", (val) => {
      this.isShowOperationBar = val;
    });
  },
  methods: {},
  components: {
    Storage,
    // NavigationDrawers,
    UploadControl,
    DeleteControl,
    PinCidControl,
  },
};
</script>

<style lang="scss" scoped>
.control {
  z-index: 2;
  position: fixed;
  right: 24px;
  bottom: 0px;
  transition: all 0.2s ease;
}
</style>