<template>
  <div style="height: 100%">
    <div class="breadcrumbs" v-if="inFolder && !showBreadcrumbs">
      <v-breadcrumbs :items="breadcrumbsItems">
        <template v-slot:item="{ item }">
          <router-link
            v-if="!item.disabled"
            :to="item.to"
            class="breadcrumb-link"
          >
            {{ item.text }}
          </router-link>
          <span v-else>
            {{ item.text }}
          </span>
        </template>
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <div class="Buckets" v-else-if="!showBreadcrumbs">Bucket</div>
    <!-- <keep-alive v-if="inFolder || inFile"> -->
    <e-tabs v-if="inFolder" :list="list" bucket noRouter ignorePath />
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
      currentFolder: "",
      isShowOperationBar: false,
      breadcrumbsItems: [],
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
    showBreadcrumbs() {
      return this.$route.path.indexOf("/bucket/storage");
    },
  },
  created() {
    this.$store.dispatch("initS3");
  },
  mounted() {
    // console.log('----',this.$route.path)
    bus.$on("showOperationBar", (val) => {
      this.isShowOperationBar = val;
    });
    this.updateCurrentFolder(this.path);
  },
  watch: {
    path(newPath) {
      this.updateCurrentFolder(newPath);
    },
  },

  methods: {
    updateCurrentFolder(path) {
      const cleanPath = path.split("?")[0];
      const prefix = "/bucket/storage/";
      const remainingPath = cleanPath.replace(prefix, "");
      const parts = remainingPath.split("/").filter(Boolean);
      const firstPartAfterPrefix = parts[0] || "";
      this.currentFolder = firstPartAfterPrefix;
      this.breadcrumbsItems = [
        {
          text: "Bucket",
          disabled: false,
          to: "/bucket/storage/",
        },
        {
          text: this.currentFolder,
          disabled: true,
        },
      ];
    },
  },
  components: {
    Storage,
    UploadControl,
    DeleteControl,
    PinCidControl,
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .breadcrumbs {
    position: static !important;
  }
  .v-breadcrumbs {
    padding: 0 0 16px 0;
    margin-top: -12px;
  }
  .Buckets {
    position: static !important;
    padding: 0 0 16px 0;
    margin-top: -12px;
  }
}

.Buckets {
  font-size: 20px;
  position: fixed;
  top: 16px;
  left: 260px;
  z-index: 10;
}
.breadcrumbs {
  position: fixed;
  top: 0;
  left: 230px;
  z-index: 10;
}
.control {
  z-index: 2;
  position: fixed;
  right: 24px;
  bottom: 0px;
  transition: all 0.2s ease;
}
</style>
