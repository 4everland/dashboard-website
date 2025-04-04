<template>
  <div class="bucket-item-container bg-white">
    <div class="file-container" v-if="inFolder">
      <!-- Operation Tab -->
      <v-row class="operation-tab align-center">
        <!-- Upload Btn -->
        <v-col class="d-flex" style="padding-right: 0">
          <bucket-upload
            ref="bucketUpload"
            :info="pathInfo"
            :baseUrl="bucketInfo.originList[0]"
          ></bucket-upload>
          <v-btn
            class="ml-2"
            outlined
            :disabled="folderLen >= 20"
            @click="addFolder"
          >
            <!-- <v-icon size="15">mdi-folder-plus-outline</v-icon> -->
            <img src="/img/svg/add0.svg" width="12" />
            <span class="ml-2">New Folder</span>
          </v-btn>
          <!-- Fragments Btn -->
          <v-btn class="ml-2" outlined @click="drawer = true">
            <img src="/img/svg/parts_icon.svg" width="12" />
            <span class="ml-2">Fragments</span>
          </v-btn>
          <bucket-parts-list
            v-model="drawer"
            :pathInfo="pathInfo"
          ></bucket-parts-list>
        </v-col>
        <!-- Search-Input -->
        <div class="search-input">
          <div
            :class="selected.length ? 'ml-auto' : 'ml-auto'"
            style="min-width: 150px; width: 282px !important"
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
        </div>
      </v-row>
      <!-- File-header -->
      <div class="d-flex justify-space-between pt-4">
        <div class="breadcrumbs-files">
          <v-breadcrumbs :items="breadcrumbsItems">
            <template v-slot:item="{ item }">
              <v-menu
                v-if="item.text === '...'"
                open-on-hover
                offset-y
                rounded-lg
                close-on-content-click
              >
                <template v-slot:activator="{ on, attrs }">
                  <div>
                    <!-- <v-icon class="folder-icon">mdi-folder</v-icon> -->
                    <span v-bind="attrs" v-on="on" class="ellipsis">
                      {{ item.text }}
                    </span>
                  </div>
                </template>
                <v-list>
                  <v-list-item
                  dense
                    v-for="(ellipsisItem, index) in ellipsisItems"
                    :key="index"
                    @click="navigateTo(ellipsisItem.to)"
                  >
                    <v-list-item-title class="d-flex align-center menu-list-item"
                      ><v-icon class="folder-icon mr-2">mdi-folder</v-icon
                      >{{ ellipsisItem.text }}</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
              <router-link
                v-else-if="!item.disabled"
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
        <div
          class="d-flex align-center justify-end"
          @click="fileInfoDrawer = !fileInfoDrawer"
          :class="fileInfoDrawer ? 'file-head' : 'file-head-close'"
        >
          <div v-show="fileInfoDrawer">
            <v-icon class="mr-1 file-icon">mdi-information-outline</v-icon>
            <span v-if="selected.length > 1"
              >Select {{ selected.length }} files</span
            >
            <span v-if="selected.length == 1"
              >{{ selected[0].isFile ? "File" : "Folder" }} Info</span
            >
            <span v-if="selected.length == 0">Flie Info</span>
          </div>
          <div v-if="!fileInfoDrawer">
            <v-icon class="mr-1 file-icon">mdi-information-outline</v-icon>
            <span>Flie Info</span>
          </div>
          <!-- <div
            @click="fileInfoDrawer = !fileInfoDrawer"
            class="fz-12 d-flex align-center pack-up"
          >
            <img
              :style="fileInfoDrawer ? '' : 'transform: rotate(180deg)'"
              src="/img/svg/bucketFileInfo/right-arrow.svg"
              width="12"
            />
            <span class="ml-2">{{ fileInfoDrawer ? "Close" : "Open" }}</span>
          </div> -->
        </div>
      </div>
      <div class="d-flex" style="height: 100%; min-height: 700px">
        <div class="table-data flex-1">
          <!-- Files Table -->
          <v-data-table
            v-show="list.length"
            class="hide-bdb data-table"
            mobile-breakpoint="1000"
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
                <b>{{ item.name.cutStr(15, 10) }}</b>
              </v-btn>
            </template>
            <template v-slot:item.hash="{ item }">
              <div class="d-flex align-center" v-if="item.hash !== '--'">
                <a
                  :href="ipfsLink(item.hash)"
                  class="hash-link"
                  style="color: #0b0817"
                  target="_blank"
                  v-if="item.hash"
                  @click.stop
                  >{{ item.hash.cutStr(5, 4) }}</a
                >
                <v-btn
                  v-if="item.hash"
                  class="e-btn-text ml-2"
                  icon
                  small
                  @click.stop
                  v-clipboard="item.hash"
                  @success="$toast('Copied!')"
                >
                  <img src="/img/svg/copy.svg" width="12" />
                </v-btn>
              </div>
              <span v-else>--</span>
            </template>

            <template v-slot:item.arHash="{ item }">
              <div v-if="item.hash == '--'">--</div>
              <div class="d-flex align-center" v-else-if="item.arHash">
                <a
                  :href="$utils.getCidLink(item.arHash, 'AR')"
                  class="hash-link"
                  style="color: #0b0817"
                  target="_blank"
                  v-if="item.arHash"
                  @click.stop
                  >{{ item.arHash.cutStr(5, 4) }}</a
                >
                <v-btn
                  v-if="item.arHash"
                  class="e-btn-text ml-2"
                  icon
                  small
                  @click.stop
                  v-clipboard="item.arHash"
                  @success="$toast('Copied!')"
                >
                  <img src="/img/svg/copy.svg" width="12" />
                </v-btn>
              </div>
              <div v-else>
                <span class="mr-2 gray">Pending</span>
                <v-btn
                  small
                  icon
                  @click.stop="handleGetARHash(item)"
                  :loading="item.arLoading"
                >
                  <v-icon size="20">mdi-refresh</v-icon>
                </v-btn>
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
              outlined
              class="ml-4"
              v-show="selected.length == 1 && !isFile"
              @click="handleSnapshot"
            >
              <span class="gray-2">Snapshot</span>
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
      <div class="pa-6">
        <h3>Snapshot</h3>
        <div class="pl-6 pt-5">
          <div class="fz-14 mb-2">
            You are taking a snapshot of the current folder and generating a
            CID. Do you require the simultaneous publication of this CID to the
            IPFS network?
          </div>

          <v-radio-group v-model="isPublish" mandatory row>
            <v-radio label="Yes, please" :value="true"></v-radio>
            <v-radio
              class="un-publish"
              label="No, I'll do it manually."
              :value="false"
            ></v-radio>
          </v-radio-group>
          <div class="tip-wrap fz-14">
            {{
              isPublish
                ? "Able to query the CID immediately on the IPFS network and obtain the data."
                : "With only the CID generated, the data cannot be queried on the IPFS network. You can publish it manually in the snapshots list later."
            }}
          </div>

          <div class="fz-14 mt-4 gray">
            Please do not modify the contents of the folder during the ongoing
            Snapshot, as it will result in failure.
          </div>

          <div class="snapshot-action al-c justify-center">
            <v-btn
              width="180"
              color="primary"
              class="mr-8"
              @click="confirmSnapshot"
              :loading="this.generateSnapshotLoading"
              >Snapshot</v-btn
            >
            <v-btn outlined width="180" @click="showSnapshotDialog = false"
              >Cancel</v-btn
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

import { mapState, mapGetters } from "vuex";
import { bus } from "../../../utils/bus";
import mixin from "../storage-mixin";
import { DeleteTaskWrapper } from "../task.js";
export default {
  name: "bucket-folder",
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
      accessKeyExpired: false,
      isPublish: true,
      breadcrumbsItems: [],
      ellipsisItems: [],
    };
  },
  async created() {
    bus.$on("uploadingLength", async (uploadingLength) => {
      if (uploadingLength == 0) {
        await this.$sleep(1000);
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
      .replace({
        path: this.$route.path.split("/").slice(0, 4).join("/") + "/",
        query: { tab: "files" },
      })
      .catch((err) => err);
  },
  mounted() {},
  computed: {
    ...mapGetters(["bucketDefaultGateWay"]),
    ...mapState({
      s3: (s) => s.moduleS3.s3,
      s3m: (s) => s.moduleS3.s3m,
    }),
    isFile() {
      if (this.selected.length && this.selected[0].isFile) return true;
      return false;
    },

    headers() {
      if (this.bucketInfo.isAr) {
        return [
          { text: "Name", value: "name" },
          { text: "Arweave Hash", value: "arHash" },
          { text: "Size", value: "size" },
          { text: "Last Modified", value: "updateAt" },
        ];
      }
      return [
        { text: "Name", value: "name" },
        { text: "IPFS CID", value: "hash" },
        { text: "Size", value: "size" },
        { text: "Last Modified", value: "updateAt" },
      ];
    },
    path() {
      return this.$route.path;
    },
  },
  methods: {
    onCopied() {
      this.$toast("Copied!");
    },
    onRouteChange() {
      if (!this.inStorage || this.inFile || this.$route.query.tab != "files")
        return;

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
      const deleteFoldersTask = deleteFoldersArr.map((it) => {
        return new DeleteTaskWrapper(
          this,
          {
            Bucket: this.pathInfo.Bucket,
            Prefix: Prefix + it.name + "/",
          },
          this.s3m
        );
      });
      this.deleteFoldersTasks = deleteFoldersTask.concat(
        this.deleteFoldersTasks
      );
    },
    async startDeleteFolder(task) {
      try {
        bus.$emit("deleteFolderTasks", this.deleteFoldersTasks);
        await task.startTasks();
        this.processDeleteFolderTask();
        this.accessKeyExpired = false;
      } catch (error) {
        if (this.accessKeyExpired) return;
        if (error.message == "InvalidAccessKeyId") {
          this.accessKeyExpired = true;
          localStorage.removeItem("stsData1");
          await this.$store.dispatch("initS3");
          this.processDeleteFolderTask(true);
        }
      }
    },
    async processDeleteFolderTask(val) {
      if (val) {
        this.deleteFoldersTasks
          .filter((task) => task.status != 3)
          .forEach((task) => task.updateS3mInstance(this.s3m));
      }
      let processing = this.deleteFoldersTasks.filter(
        (item) => item.status == 1
      );
      if (processing.length >= this.deleteFolderLimit) return;
      const idles = this.deleteFoldersTasks.filter((item) => item.status == 0);
      if (!idles.length) return;
      const fill = this.deleteFolderLimit - processing.length;
      const min = idles.length <= fill ? idles.length : fill;
      for (let i = 0; i < min; i++) {
        this.startDeleteFolder(idles[i]);
      }
    },

    handleGetARHash(item) {
      item.arLoading = true;
      this.s3.headObject(
        { Bucket: this.pathInfo.Bucket, Key: this.pathInfo.Prefix + item.name },
        (err, data) => {
          if (err) {
            item.arLoading = false;
            return this.onErr(err);
          }
          const meta = data.Metadata;
          let arStatus = meta["arweave-status"];
          if (!arStatus) {
            arStatus = this.defArStatus;
          }
          if (meta["arweave-hash"]) {
            item.arHash = meta["arweave-hash"];
          }
          item.arLoading = false;
        }
      );
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
          prefix: this.pathInfo.Prefix + this.selected[0].name + "/",
        };
        this.generateSnapshotLoading = true;
        const { data: result } = await this.$http.post("/snapshots", data);
        if (this.isPublish) {
          await this.snapshotPublish(result.id);
        }
        this.generateSnapshotLoading = false;
        this.showSnapshotDialog = false;
        this.$toast("create snapshot success!");
        this.selected = [];
        this.$router.replace({
          query: {
            tab: "snapshots",
          },
        });
      } catch (err) {
        console.log(err);
      }
    },

    async snapshotPublish(id) {
      try {
        await this.$http.post(`/snapshots/${id}`, null, {
          noTip: true,
        });
      } catch (error) {
        console.log(error.code);
        if (error.code == 409) {
          await this.snapshotPublish(id);
        }
      }
    },
    ipfsLink(ipfs) {
      return this.bucketDefaultGateWay + "/ipfs/" + ipfs;
    },
    generateBreadcrumbs(path) {
      const cleanPath = path.split("?")[0];
      const parts = cleanPath.split("/").filter(Boolean);

      const bucketItem = {
        text: "Bucket",
        disabled: false,
        to: "/bucket/storage/",
      };

      const remainingParts = parts.slice(2);
      const remainingBreadcrumbs = remainingParts.map((part, index) => ({
        text: part.length > 10 ? part.cutStr(6, 4) : part,
        disabled: index === remainingParts.length - 1,
        to: `/bucket/storage/${remainingParts
          .slice(0, index + 1)
          .join("/")}/?tab=files`,
      }));

      const breadcrumbs = [bucketItem, ...remainingBreadcrumbs];

      if (breadcrumbs.length > 5) {
        this.ellipsisItems = breadcrumbs.slice(2, -2);
        this.breadcrumbsItems = [
          breadcrumbs[0],
          breadcrumbs[1],
          { text: "...", disabled: true, to: "#" },
          breadcrumbs[breadcrumbs.length - 2],
          breadcrumbs[breadcrumbs.length - 1],
        ];
      } else {
        this.breadcrumbsItems = breadcrumbs;
      }
    },

    navigateTo(path) {
      this.$router.push(path);
    },
  },
  mounted() {
    this.generateBreadcrumbs(this.path);
  },
  watch: {
    path(newPath) {
      this.onRouteChange();
      this.generateBreadcrumbs(newPath);
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

<style>
.v-data-table > .v-data-table__wrapper > table > thead > tr > th:first-child,
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
.v-data-table > .v-data-table__wrapper > table > tbody > tr > th:first-child {
  padding-left: 12px !important;
}
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
.v-radio .v-label {
  font-size: 14px !important;
}
.un-publish {
  margin-left: 40px;
}
</style>
<style lang="scss" scoped>
.hash-link {
  display: block;
  min-width: 80px;
  color: #0b0817;
}
.bucket-item-container {
  width: 100%;
  padding: 4px 12px 33px 12px;
  border-radius: 10px;
  // box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.11);
  background: #fff;
  overflow: hidden;
  .file-container {
    position: relative;
    // min-height: 1000px;
    .file-head {
      height: 32px;
      border-radius: 100px;
      padding: 8px;
      background: #f5f8ff;
      border: 1px solid #e0eaff;
      font-size: 14px;
      color: #6172f3;
      cursor: pointer;
      .file-icon {
        font-size: 14px;
        color: #6172f3;
      }
    }
    .file-head-close {
      height: 32px;
      border-radius: 100px;
      padding: 8px;
      border: 1px solid #eaecf0;
      font-size: 14px;
      color: #101828;
      cursor: pointer;
      .file-icon {
        font-size: 14px;
        color: #101828;
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
      .search-input {
        width: 282px;
        margin-right: 12px !important;
        .hide-msg.v-input {
          border-color: #eaecf0;
        }
      }
    }
    .table-data {
      position: relative;
      width: 200px;
      .loading-img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
.folder-icon {
  font-size: 18px;
}
.menu-list-item{
  font-size: 14px;
  color: #808080;
}
.v-menu__content{
  margin-top: -4px;
}
.ellipsis {
  cursor: pointer;
  color: #646F82;
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
  margin-top: 38px;
}
</style>
