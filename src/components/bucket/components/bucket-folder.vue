<template>
  <div class="bucket-item-container bg-white">
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
          outlined
          :disabled="folderLen >= 20"
          @click="addFolder"
        >
          <!-- <v-icon size="15">mdi-folder-plus-outline</v-icon> -->
          <img src="/img/svg/add0.svg" width="12" />
          <span class="ml-2">New Folder</span>
        </v-btn>
        <!-- Fragments Btn -->
        <v-btn class="ml-5" outlined @click="drawer = true">
          <img src="/img/svg/parts_icon.svg" width="12" />
          <span class="ml-2">Fragments</span>
        </v-btn>
        <!-- Search-Input -->
        <div
          :class="selected.length ? 'ml-auto' : 'ml-auto'"
          style="min-width: 150px"
        >
          <v-text-field
            class="hide-msg bd-1"
            dense
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
      <!-- File-header -->
      <div class="d-flex justify-end pt-4">
        <div
          class="file-head d-flex align-center pl-5"
          :class="fileInfoDrawer ? 'justify-space-between' : 'justify-end'"
          style="float: right"
        >
          <div v-show="fileInfoDrawer">
            <span v-if="selected.length > 1"
              >Select {{ selected.length }} files</span
            >
            <span v-if="selected.length == 1"
              >{{ selected[0].isFile ? "File" : "Folder" }} Info</span
            >
            <span v-if="selected.length == 0">Flie Info</span>
          </div>
          <div
            @click="fileInfoDrawer = !fileInfoDrawer"
            class="fz-12 d-flex align-center pack-up"
          >
            <img
              :style="fileInfoDrawer ? '' : 'transform: rotate(180deg)'"
              src="/img/svg/bucketFileInfo/right-arrow.svg"
              width="12"
            />
            <span class="ml-2">{{ fileInfoDrawer ? "Pack up" : "Open" }}</span>
          </div>
        </div>
      </div>
      <div class="d-flex" style="height: 100%; min-height: 700px">
        <div class="table-data flex-1">
          <!-- Files Table -->
          <v-data-table
            v-show="list.length"
            class="hide-bdb"
            fixed-header
            :headers="headers"
            :items="list"
            :loading="tableLoading"
            v-model="selected"
            :show-select="list.length > 0"
            item-key="name"
            no-data-text=""
            loading-text=""
            checkbox-color="#34A9FF"
            hide-default-footer
            disable-pagination
            @click:row="onRow"
            height="700"
          >
            <template v-slot:item.name="{ item }">
              <v-btn
                color="#000"
                class="e-btn-text"
                text
                x-small
                @click.stop="onRow(item)"
              >
                <v-icon v-if="!item.isFile" size="18" class="mr-2"
                  >mdi-folder</v-icon
                >
                <b>{{ item.name.cutStr(5, 5) }}</b></v-btn
              >
            </template>
            <template v-slot:item.hash="{ item }">
              <div class="d-flex align-center" v-if="item.hash !== '--'">
                <a
                  :href="$utils.getCidLink(item.hash)"
                  class="hash-link"
                  style="color: #0b0817"
                  target="_blank"
                  v-if="item.hash"
                  @click.stop="onStop"
                  >{{ item.hash.cutStr(5, 4) }}</a
                >
                <v-btn
                  v-if="item.hash"
                  class="e-btn-text ml-2"
                  icon
                  small
                  @click.stop="onStop"
                  v-clipboard="item.hash"
                  @success="$toast('Copied to clipboard !')"
                >
                  <img src="/img/svg/copy.svg" width="12" />
                </v-btn>
              </div>
              <span v-else>--</span>
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
          </v-data-table>
          <!-- Loading Img -->
          <div
            class="ta-c loading-img"
            :class="tableLoading ? 'mt-10' : 'mt-15'"
            v-if="!list.length"
          >
            <img
              :src="`/img/svg/common/empty${tableLoading ? 1 : 2}.svg`"
              :height="tableLoading ? 100 : 130"
            />
            <div class="mt-5 gray fz-17">
              {{
                tableLoading ? "Loading files..." : "No folders or files found"
              }}
            </div>
          </div>
          <div
            class="pd-20 gray ta-c fz-16 mt-5"
            v-show="list.length == 100 || curPage !== 0"
          >
            <v-btn
              :disabled="curPage == 0"
              outlined
              @click="onLoadPre"
              class="mr-5"
              >Previous</v-btn
            >
            <v-btn
              min-width="100"
              outlined
              :disabled="!hasMore"
              @click="onLoadMore"
              >Next</v-btn
            >
          </div>
          <operation-bar
            :selected="selected"
            :inFile="true"
            :isNotAr="!bucketInfo.isAr && selectArStatus != 'synced'"
            :clipboardVal="selected.length ? getViewUrl(selected[0]) : ''"
            @download="handleDownload"
            @onRename="onRename(selected[0].name)"
            @onSyncAR="onSyncAR(selected[0].name)"
            @handleClearSelected="selected = []"
            @handleDeleteSelected="onDelete()"
          ></operation-bar>
        </div>
        <bucket-fileInfo
          :isAr="bucketInfo.isAr"
          :selected="selected"
          :fileInfoDrawer.sync="fileInfoDrawer"
          :bucketInfo="bucketInfo"
          @onSyncAR="onSyncAR"
        ></bucket-fileInfo>
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
        { text: "IPFS Hash", value: "hash" },
        { text: "Size", value: "size" },
        { text: "Last Modified", value: "updateAt" },
        // { text: "AR Status", value: "arStatus" },
      ],
      selected: [],
      deleteFolder: false,
      deleteFoldersTasks: [],
      deleteFolderLimit: 2,
      isUploadDir: false,
      fileInfoDrawer: true,
    };
  },
  async created() {
    bus.$on("uploadingLength", (uploadingLength) => {
      if (uploadingLength == 0) {
        this.getList();
      }
    });
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
    onStop() {},
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
    handleDownload() {
      window.open(this.getViewUrl(this.selected[0]));
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
    selected: {
      handler(val) {
        if (val.length) {
          this.fileInfoDrawer = true;
        }
      },
      deep: true,
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
.hash-link {
  display: block;
  min-width: 80px;
  color: #0b0817;
}
.bucket-item-container {
  padding: 18px 13px 33px 32px;
  border-radius: 10px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.11);
  background: #fff;
  overflow: hidden;
  .file-container {
    position: relative;
    // min-height: 1000px;
    .file-head {
      width: 25%;
      .pack-up {
        cursor: pointer;
      }
    }
    .operation-tab {
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
    .table-data {
      position: relative;
      .loading-img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
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