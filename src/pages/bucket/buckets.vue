<template>
  <div style="height: 100%">
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
import UploadControl from "@/views/bucket/components/upload-control";
import DeleteControl from "@/views/bucket/components/delete-control";
import PinCidControl from "@/views/bucket/components/pin-cid-control";

import { bus } from "../../utils/bus";
export default {
  data() {
    return {
      list: [
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
        {
          text: "Settings",
          comp: "bucket-overview",
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
    this.$store.dispatch("initS3");
  },
  mounted() {
    bus.$on("showOperationBar", (val) => {
      this.isShowOperationBar = val;
    });
  },
  methods: {},
  components: {
    Storage,
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
