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
            class="hide-bdb data-table"
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
          <operation-bar ref="operationBar">
            <v-checkbox
              v-model="checked"
              @change="handleChangeCheck"
              class="px-4"
              color="#34A9FF"
            ></v-checkbox>
            <v-btn
              outlined
              class="ml-4"
              @click="handleDownload"
              v-show="selected.length == 1 && isFile"
            >
              <span class="gray-2">Download</span>
            </v-btn>
            <v-btn
              outlined
              class="ml-4"
              v-show="selected.length == 1 && isFile"
              v-clipboard="selected.length ? getViewUrl(selected[0]) : ''"
              @success="onCopied"
            >
              <span class="gray-2">Copy Path</span>
            </v-btn>
            <v-btn
              outlined
              class="ml-4"
              v-show="selected.length == 1 && isFile"
              @click="onRename(selected[0].name)"
            >
              <span class="gray-2">Rename</span>
            </v-btn>
            <v-btn
              outlined
              class="ml-4"
              v-show="selected.length == 1 && isFile"
              @click="handleSyncAr(selected[0].name)"
            >
              <span
                v-if="!bucketInfo.isAr && selectArStatus != 'synced'"
                class="gray-2"
                >Sync to AR</span
              >
              <span v-else class="gray-2">Verify on AR</span>
            </v-btn>

            <v-btn
              style="border-color: #6c7789"
              outlined
              class="ml-4"
              v-show="selected.length == 1 && !isFile"
              @click="handleSnapshot"
            >
              <span class="gray">Snapshot</span>
            </v-btn>
            <v-btn
              style="border-color: #6c7789"
              outlined
              class="ml-4"
              v-show="selected.length >= 1"
              @click="onDelete()"
            >
              <span class="gray">Delete</span>
            </v-btn>
            <div class="ml-auto">
              select: {{ selected.length }} / {{ list.length }}
            </div>
          </operation-bar>
        </div>
        <bucket-fileInfo
          ref="fileInfo"
          :isAr="bucketInfo.isAr"
          :selected.sync="selected"
          :fileInfoDrawer.sync="fileInfoDrawer"
          :bucketInfo="bucketInfo"
          @onSyncAR="onSyncAR"
          @getFileInfo="getFileInfo"
        ></bucket-fileInfo>
      </div>
    </div>

    <v-dialog v-model="showSnapshotDialog" max-width="600">
      <div class="px-7 py-6">
        <h2>Snapshot</h2>
        <div class="pl-6 pt-7">
          <div class="fz-14 gray">
            The CID for your folder will be generated if you Snapshot a folder,
            and you can publish it in the Snapshots list. Continue?
          </div>
          <div class="snapshot-action al-c justify-center">
            <v-btn
              outlined
              width="180"
              class="mr-8"
              @click="showSnapshotDialog = fasle"
              >Cancel</v-btn
            >
            <v-btn
              width="180"
              color="primary"
              @click="confirmSnapshot"
              :loading="this.generateSnapshotLoading"
              >Snapshot</v-btn
            >
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import BucketUpload from "@/views/bucket/bucket-upload";
import BucketPartsList from "@/views/bucket/bucket-parts-list";
import BucketFileInfo from "@/views/bucket/components/bucket-fileInfo";

import { mapState } from "vuex";
import { bus } from "../../../utils/bus";
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
        { text: "IPFS CID", value: "hash" },
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
      fileInfo: null,
      checked: false,
      showSnapshotDialog: false,
      generateSnapshotLoading: false,
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
  activated() {
    this.$router
      .push({
        path: this.$route.path.split("/").slice(0, 4).join("/") + "/",
        query: { tab: "files" },
      })
      .catch((err) => err);
  },
  computed: {
    ...mapState({
      s3: (s) => s.s3,
      s3m: (s) => s.s3m,
    }),
    isFile() {
      if (this.selected.length && this.selected[0].isFile) return true;
      return false;
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
          this.genID(),
          this.s3m
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
    async handleSyncAr(name) {
      await this.onSyncAR(name);
      this.$refs.fileInfo.headObject();
    },
    getFileInfo(fileInfo) {
      this.fileInfo = fileInfo;
    },
    handleChangeCheck(val) {
      if (!val) return (this.selected = []);
    },
    handleSnapshot() {
      this.showSnapshotDialog = true;
    },
    async confirmSnapshot() {
      try {
        const data = {
          bucket: this.pathInfo.Bucket,
          prefix: this.selected[0].name + "/",
        };
        this.generateSnapshotLoading = true;
        await this.$http.post("/snapshots", data);
        this.generateSnapshotLoading = false;
        this.showSnapshotDialog = false;
        this.$toast("create snapshot success!");
        this.selected = [];
      } catch (err) {
        console.log(err);
      }
    },
  },
  watch: {
    path() {
      this.onRouteChange();
    },
    selected: {
      handler(val) {
        if (val.length) {
          bus.$emit("showOperationBar", true);
          this.fileInfoDrawer = true;
          this.$refs.operationBar.isShow = this.checked = true;
        } else {
          bus.$emit("showOperationBar", false);
          this.$refs.operationBar.isShow = this.checked = false;
        }
      },
      deep: true,
    },
  },
  components: {
    BucketUpload,
    BucketPartsList,
    BucketFileInfo,
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
/* .data-table tr:nth-of-type(odd) {
  background: #f7f9fb;
} */
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
.snapshot-action {
  margin-top: 68px;
}
</style>