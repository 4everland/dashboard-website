<template>
  <div class="bucket-item-container">
    <div class="file-container" v-if="inFolder">
      <!-- Operation Tab -->
      <div class="operation-tab d-flex">
        <!-- Upload Btn -->
        <bucket-upload
          ref="bucketUpload"
          :info="pathInfo"
          :baseUrl="bucketInfo.originList[0]"
        ></bucket-upload>
        <v-btn
          class="ml-5"
          rounded
          outlined
          :disabled="folderLen >= 20"
          @click="addFolder"
        >
          <!-- <v-icon size="15">mdi-folder-plus-outline</v-icon> -->
          <img src="img/svg/add0.svg" width="12" />
          <span class="ml-2">New Folder</span>
        </v-btn>
        <!-- Fragments Btn -->
        <v-btn class="ml-5" rounded outlined @click="drawer = true">
          <img src="img/svg/parts_icon.svg" width="12" />
          <span class="ml-2">Fragments</span>
        </v-btn>
        <div class="ml-5">
          <e-menu
            offset-y
            open-on-hover
            nudge-bottom="11"
            :disabled="!selected.length"
          >
            <v-btn slot="ref" rounded outlined :disabled="!selected.length">
              <!-- <v-icon>mdi-dots-vertical</v-icon> -->
              <span>Actions</span>
              <v-icon size="18">mdi-chevron-down</v-icon>
            </v-btn>
            <v-list dense>
              <template v-if="selected.length == 1">
                <!-- <v-list-item :to="getPath(selected[0])"> Open </v-list-item> -->
                <template v-if="selected[0].isFile">
                  <v-list-item :href="getViewUrl(selected[0])" target="_blank">
                    <img
                      src="img/icon/ic-download.svg"
                      width="15"
                      class="mr-2"
                    />
                    <span class="gray-7">Download</span>
                  </v-list-item>
                  <v-list-item
                    link
                    v-clipboard="getViewUrl(selected[0])"
                    @success="onCopied"
                  >
                    <img src="img/icon/ic-copy.svg" width="14" class="mr-2" />
                    <span class="gray-7">Copy Path</span>
                  </v-list-item>
                  <v-list-item link @click="onRename(selected[0].name)">
                    <img src="img/icon/ic-rename.svg" width="14" class="mr-2" />
                    <span class="gray-7">Rename</span>
                  </v-list-item>
                  <v-list-item
                    link
                    @click="onSyncAR(selected[0].name)"
                    v-if="!bucketInfo.isAr && selectArStatus != 'synced'"
                  >
                    <img src="img/icon/ic-ar.svg" width="14" class="mr-2" />
                    <span class="gray-7">Sync to AR</span>
                  </v-list-item>
                </template>
              </template>
              <v-list-item link @click="onDelete()">
                <img src="img/icon/ic-delete.svg" width="14" class="mr-2" />
                <span class="red-2">Delete</span>
              </v-list-item>
            </v-list>
          </e-menu>
        </div>
        <!-- Selected Files -->
        <div
          class="selected-content d-flex al-c ml-auto"
          v-if="selected.length"
        >
          <div class="selected-title mr-2">Selected:</div>
          <div>
            <span class="selected-count"> {{ selected.length }}</span>
            <span class="mx-1">/</span>
            <span>{{ list.length }}</span>
          </div>
        </div>
        <!-- Search-Input -->
        <div
          :class="selected.length ? 'ml-5' : 'ml-auto'"
          style="min-width: 150px"
        >
          <v-text-field
            class="hide-msg bd-1"
            dense
            rounded
            solo
            clearable
            label="Search"
            prepend-inner-icon="mdi-magnify"
            v-model="searchKey"
          ></v-text-field>
        </div>
        <bucket-parts-list
          v-model="drawer"
          :pathInfo="pathInfo"
        ></bucket-parts-list>
      </div>
      <!-- Files Table -->
      <v-data-table
        class="hide-bdb"
        :headers="headers"
        :items="list"
        :loading="tableLoading"
        v-model="selected"
        :show-select="list.length > 0"
        item-key="name"
        no-data-text=""
        loading-text=""
        :checkbox-color="$color1"
        hide-default-footer
        disable-pagination
        @click:row="onRow"
      >
        <template v-slot:item.name="{ item }">
          <v-btn
            color="#000"
            class="e-btn-text"
            rounded
            text
            x-small
            @click.stop="onRow(item)"
          >
            <v-icon v-if="!item.isFile" size="18" class="mr-2"
              >mdi-folder</v-icon
            >
            <b>{{ item.name.cutStr(10, 10) }}</b></v-btn
          >
          <v-btn
            class="e-btn-text"
            icon
            small
            color="primary"
            v-if="item.isFile && bucketInfo.originList.length"
            @click.stop="onStop"
            :href="getViewUrl(item)"
            target="_blank"
          >
            <img src="img/svg/view.svg" width="14" class="ml-2" />
          </v-btn>
        </template>
        <!-- <template v-slot:item.domain="{ item }">
          <div v-if="item.domainInfo">
            <span>{{ item.domainInfo.domain.cutStr(10, 20) }}</span>
          </div>
        </template> -->
        <template v-slot:item.hash="{ item }">
          <v-btn
            style="width: 80px"
            class="e-btn-text item-hash"
            rounded
            color="primary"
            x-small
            text
            target="_blank"
            v-if="item.hash"
            @click.stop="onStop"
            :href="`https://${item.hash}.ipfs.dweb.link`"
          >
            <span class="d-ib">
              {{ item.hash.cutStr(5, 4) }}
            </span>
          </v-btn>
          <v-btn
            v-if="item.hash"
            class="e-btn-text ml-2"
            icon
            small
            @click.stop="onStop"
            v-clipboard="item.hash"
            @success="$toast('Copied to clipboard !')"
          >
            <!-- <v-icon size="14" color="primary">mdi-content-copy</v-icon> -->
            <img src="img/svg/copy.svg" width="12" />
          </v-btn>
        </template>
        <template v-slot:item.arAct="{ item }">
          <div class="hide-msg d-flex al-c">
            <v-switch
              v-model="item.isAr"
              dense
              :loading="item.arLoading"
              :disabled="item.arLoading || item.arCancel"
              @click.stop.prevent="onSyncBucket(item)"
            ></v-switch>
            <e-tooltip top v-if="item.arCancel && !tableLoading">
              <v-btn slot="ref" plain x-small @click.stop="getList">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <span>Closing. Click to refresh.</span>
            </e-tooltip>
          </div>
        </template>
        <template v-slot:item.arStatus="{ item }">
          <sync-state :val="item.arStatus"></sync-state>
        </template>
      </v-data-table>
      <!-- Loading Img -->
      <div
        class="ta-c"
        :class="tableLoading ? 'mt-10' : 'mt-15'"
        v-if="!list.length"
      >
        <img
          :src="`img/svg/common/empty${tableLoading ? 1 : 2}.svg`"
          :height="tableLoading ? 100 : 130"
        />
        <div class="mt-5 gray fz-17">
          {{ tableLoading ? "Loading files..." : "No folders or files found" }}
        </div>
      </div>

      <div
        class="pd-20 gray ta-c fz-16 mt-5"
        v-show="list.length == 100 || curPage !== 0"
      >
        <!-- <v-btn outlined rounded v-if="list.length" @click="onLoadMore">{{
          loadingMore ? "Loading..." : "Load More"
        }}</v-btn> -->
        <v-btn
          :disabled="curPage == 0"
          outlined
          rounded
          @click="onLoadPre"
          class="mr-5"
          >Previous</v-btn
        >
        <v-btn
          min-width="100"
          outlined
          rounded
          :disabled="!hasMore"
          @click="onLoadMore"
          >Next</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "../../../main";

import mixin from "../storage-mixin";
import { DeleteTaskWrapper } from "../task.js";
export default {
  mixins: [mixin],
  props: {
    active: Boolean,
  },
  data() {
    return {
      searchKey: "",
      drawer: false,
      tableLoading: true,
      vertical: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "Size", value: "size" },
        { text: "IPFS Hash", value: "hash" },
        { text: "Last Modified", value: "updateAt" },
        { text: "AR Status", value: "arStatus" },
      ],
      selected: [],
      deleteFolder: false,
      deleteFoldersTasks: [],
      deleteFolderLimit: 2,
      isUploadDir: false,
    };
  },
  async created() {
    bus.$on("handleDeleteFolderRemoveAll", () => {
      this.deleteFoldersTasks = [];
      bus.$emit("deleteFolderTasks", this.deleteFoldersTasks);
    });

    bus.$on("handleRemoveDeleteFolder", (deleteFoldersTasks) => {
      bus.$emit("deleteFolderTasks", deleteFoldersTasks);
    });
    bus.$on("getList", () => this.getList());
    bus.$on("getOriginDeleteFolderTasks", (originDeleteFolderTasks) => {
      this.deleteFoldersTasks = originDeleteFolderTasks;
    });

    bus.$emit("originDeleteFolderTasks");
  },
  computed: {
    selectArStatus() {
      if (this.selected.length == 1) {
        return this.selected[0].arStatus;
      }
      return null;
    },
  },

  methods: {
    onCopied() {
      this.$toast("Copied to clipboard !");
    },
    onRouteChange() {
      if (!this.inStorage || this.inFile) return;
      this.curPage = 0;
      this.continuationTokenArr = [""];
      this.selected = [];
      this.folderList = [];
      this.getList();
      this.checkNew();
    },
    addDeleteFolderTask(limit) {
      this.deleteFolderLimit = limit;
      let arr = this.$route.path.split("/");
      let index = arr.findIndex((it) => it == "storage");
      const Prefix = arr.slice(index + 2).join("/");
      const deleteFoldersArr = this.selected.filter((it) => {
        const currentFolderName = Prefix + it.name + "/";
        const currentBucketName = this.pathInfo.Bucket;
        let isExist = this.deleteFoldersTasks.findIndex((item) => {
          return (
            item.param.Prefix == currentFolderName &&
            item.param.Bucket == currentBucketName
          );
        });
        if (isExist !== -1) {
          let arr = this.deleteFoldersTasks.filter((item) => item.status == 0);
          this.deleteFoldersTasks[isExist].retryTasks();

          if (!arr.length) {
            this.processDeleteFolderTask();
          }
        }
        return !it.isFile && isExist == -1;
      });
      // console.log(deleteFoldersArr);

      const deleteFoldersTask = deleteFoldersArr.map((it) => {
        return new DeleteTaskWrapper(
          this,
          this.s3,
          {
            Bucket: this.pathInfo.Bucket,
            Prefix: Prefix + it.name + "/",
          },
          this.genID()
        );
      });
      this.deleteFoldersTasks = deleteFoldersTask.concat(
        this.deleteFoldersTasks
      );
    },
    async startDeleteFolder(task) {
      bus.$emit("deleteFolderTasks", this.deleteFoldersTasks);
      await task.startTasks();
      this.processDeleteFolderTask();
    },
    async processDeleteFolderTask() {
      let processing = this.deleteFoldersTasks.filter(
        (item) => item.status == 1
      );
      // console.log(processing);
      if (processing.length >= this.deleteFolderLimit) return;
      const idles = this.deleteFoldersTasks.filter((item) => item.status == 0);
      // console.log(idles, "idles");
      if (!idles.length) return;
      const fill = this.deleteFolderLimit - processing.length;
      // console.log(fill);
      const min = idles.length <= fill ? idles.length : fill;
      for (let i = 0; i < min; i++) {
        this.startDeleteFolder(idles[i]);
      }
    },
    genID(length) {
      return Number(
        Math.random().toString().substr(3, length) + Date.now()
      ).toString(36);
    },
    uploadingLength(value) {
      this.uploadingTaskLength = value;
    },
    // handlePasueDeleteFolder(id) {
    //   const index = this.deleteFoldersTasks.findIndex((it) => it.id == id);
    //   this.deleteFoldersTasks[index].stopTasks();
    // },
    // handleStartDeleteFolder(id) {
    //   const index = this.deleteFoldersTasks.findIndex((it) => it.id == id);
    //   let arr = this.deleteFoldersTasks.filter((item) => item.status == 0);
    //   this.deleteFoldersTasks[index].retryTasks();
    //   if (!arr.length) {
    //     this.processDeleteFolderTask();
    //   }
    // },
    // handleRemoveDeleteFolder(id) {
    //   let index = this.deleteFoldersTasks.findIndex((it) => it.id == id);
    //   this.deleteFoldersTasks.splice(index, 1);
    // },

    // handleDeleteFolderStartAll() {
    //   let arr = this.deleteFoldersTasks.filter((item) => item.status == 0);
    //   this.deleteFoldersTasks.forEach((it) => {
    //     if (it.status !== 2) return;
    //     it.retryTasks();
    //   });
    //   if (!arr.length) {
    //     this.processDeleteFolderTask();
    //   }
    // },
    // handleDeleteFolderPauseAll() {
    //   this.deleteFoldersTasks.forEach((item) => {
    //     if (item.status == 3) return;
    //     item.stopTasks();
    //   });
    // },
    // handleDeleteFolderRemoveAll() {
    //   this.deleteFoldersTasks = [];
    // },
    isUploading(value) {
      this.taskIsUploading = value;
    },
  },
  watch: {
    path() {
      this.onRouteChange();
    },
    active(val) {
      if (val) {
        this.getList();
      }
    },
  },
};
</script>

<style >
.file-tab .v-slide-group__content {
  background: #f8fafb;
}
.v-data-table__mobile-row svg {
  width: 150px;
}
.e-btn-text {
  padding: 0 !important;
  font-weight: normal !important;
  font-size: 14px !important;
}
.e-btn-text b {
  font-weight: 500 !important;
}
.e-btn-text::before {
  background: transparent !important;
}
</style>
<style lang="scss" scoped>
.item-hash {
  transition: all 0.1s ease-in;
}
.item-hash:hover {
  opacity: 0.8;
}
.bucket-item-container {
  background: #fff;

  .file-container {
    position: relative;
    min-height: 1000px;
    .operation-tab {
      padding: 6px 0 26px 0;
      .selected-content {
        color: #0b0817;
        .selected-title {
          color: #6c7789;
        }
        .selected-count {
          color: #1e8e3e;
        }
      }
    }
  }
}

.v3-horizon {
  .v-slide-group__content {
    padding-top: 4px;
    padding-left: 2px;
  }
  .v-tab {
    // width: 157px;
    background: #f7fafb;
    font-size: 16px;
    // letter-spacing: 0;
  }
  .v-tab--active {
    background: #fff;
    box-shadow: 0 0 4px rgb(205 205 205 / 50%);
    font-weight: bold;
    pointer-events: none;
    &,
    &:before {
      border-radius: 12px 12px 0 0;
    }
  }
}
</style>