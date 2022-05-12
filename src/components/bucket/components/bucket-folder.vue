<template>
  <div class="bucket-item-container">
    <div v-if="inFolder">
      <!-- Task List -->
      <div @click="$refs.navDrawers.drawer = true" class="task-list">
        <span class="task-count" v-show="uploadingTaskLength != 0">{{
          uploadingTaskLength > 99 ? "99+" : uploadingTaskLength
        }}</span>
        <img src="img/svg/common/task-list.svg" alt="" width="54" />
      </div>
      <!-- Switch Tab -->
      <!-- <div>
        <v-tabs
          class="v3-horizon file-tab"
          color="black"
          v-model="curIdx"
          hide-slider
          :vertical="vertical"
        >
          <v-tab>Overview</v-tab>
          <v-tab>File</v-tab>
          <v-tab>Statict</v-tab>
        </v-tabs>
      </div> -->
      <div class="file-container">
        <!-- Operation Tab -->
        <div class="operation-tab d-flex">
          <!-- Upload Btn -->
          <v-btn color="primary" rounded @click="handleClickUpload">
            <img src="img/svg/upload.svg" width="16" />
            <span>Upload</span>
          </v-btn>
          <!-- Fragments Btn -->
          <v-btn class="ml-5" rounded outlined @click="drawer = true">
            <img src="img/svg/parts_icon.svg" width="12" />
            <span>Fragments</span>
          </v-btn>
          <!-- Create New Folder  -->
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
          <e-menu offset-y open-on-hover :disabled="!selected.length">
            <v-btn
              slot="ref"
              class="ml-5"
              rounded
              outlined
              :disabled="!selected.length"
            >
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
          <!-- Selected Files -->
          <div class="selected-content d-flex align-center">
            <span class="selected-title">Selected:</span>
            <span class="selected-count">{{ selected.length }}/100</span>
          </div>
          <!-- Search-Input -->
          <div class="ml-5" style="min-width: 150px">
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
            <v-btn color="#000" rounded text x-small @click.stop="onRow(item)">
              <v-icon v-if="!item.isFile" size="18" class="mr-2"
                >mdi-folder</v-icon
              >
              <b>{{ item.name.cutStr(10, 10) }}</b></v-btn
            >
            <v-btn
              icon
              small
              color="primary"
              v-if="item.isFile && bucketInfo.originList.length"
              @click.stop="onStop"
              :href="getViewUrl(item)"
              target="_blank"
            >
              <img src="img/svg/view.svg" width="14" />
            </v-btn>
          </template>
          <template v-slot:item.domain="{ item }">
            <div v-if="item.domainInfo">
              <span>{{ item.domainInfo.domain.cutStr(10, 20) }}</span>
            </div>
          </template>
          <template v-slot:item.hash="{ item }">
            <v-btn
              rounded
              color="primary"
              x-small
              text
              target="_blank"
              v-if="item.hash"
              @click.stop="onStop"
              :href="`https://${item.hash}.ipfs.dweb.link`"
            >
              <span class="d-ib" style="width: 80px">
                {{ item.hash.cutStr(5, 4) }}
              </span>
            </v-btn>
            <v-btn
              v-if="item.hash"
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
            {{
              tableLoading ? "Loading files..." : "No folders or files found"
            }}
          </div>
        </div>
      </div>
    </div>
    <!-- Upload Component -->
    <div v-if="inUpload">
      <bucket-upload
        ref="bucketUpload"
        :info="pathInfo"
        :baseUrl="bucketInfo.originList[0]"
      ></bucket-upload>
    </div>
    <!-- Upload/Delete Folders Component -->
    <navigation-drawers
      ref="navDrawers"
      :deleteFolder.sync="deleteFolder"
      :deleteFolderTasks="deleteFoldersTasks"
      @uploadingLength="uploadingLength"
      @handlePasueDeleteFolder="handlePasueDeleteFolder"
      @handleStartDeleteFolder="handleStartDeleteFolder"
      @handleRemoveDeleteFolder="handleRemoveDeleteFolder"
      @handleDeleteFolderStartAll="handleDeleteFolderStartAll"
      @handleDeleteFolderPauseAll="handleDeleteFolderPauseAll"
      @handleDeleteFolderRemoveAll="handleDeleteFolderRemoveAll"
    ></navigation-drawers>
  </div>
</template>

<script>
import mixin from "../storage-mixin";
import Vue from "vue";
class DeleteTaskWrapper {
  that;
  s3;
  param;
  id;
  marker;
  lastMarker;
  deleteCount;
  status;
  curFiles;

  constructor(that, s3, param, id) {
    this.that = that;
    this.s3 = s3;
    this.param = param;
    this.id = id;
    this.status = 0; // pre delete
    this.deleteCount = 0;
  }

  async startTasks() {
    try {
      if (this.status !== 0 && this.status !== 1) return;

      this.status = 1; // deleteing

      console.log(this.param.Prefix, this.param.Bucket);
      const listResult = await this.s3.listObjectsV2({
        Bucket: this.param.Bucket,
        MaxKeys: 100,
        Delimiter: "",
        Prefix: this.param.Prefix,
      });
      if (!listResult.Contents) {
        this.curFiles = [];
      } else {
        this.curFiles = listResult.Contents.map((it) => {
          return { Key: it.Key };
        });
      }

      if (this.curFiles.length && this.status == 1) {
        const deleteResult = await this.s3.deleteObjects({
          Bucket: this.param.Bucket,
          Delete: {
            Objects: this.curFiles,
            Quiet: false,
          },
        });
        // console.log(deleteResult);
        for (let i = 0; i < deleteResult.Deleted.length; i++) {
          this.deleteCount += 1;
          await Vue.prototype.$sleep(20);
        }
        await this.startTasks();
      } else if (!this.curFiles.length) {
        this.status = 3; // success
        this.that.selected = [];
        this.that.getList();
      } else {
        console.log("here");
      }
    } catch (error) {
      console.log(error);
    }
  }
  stopTasks() {
    this.status = 2; //stop
  }
  retryTasks() {
    this.status = 0; // retry
  }
}
export default {
  mixins: [mixin],
  data() {
    return {
      searchKey: "",
      drawer: false,
      tableLoading: true,
      curIdx: 1,
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
      uploadingTaskLength: 0,
    };
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
    // async getList() {
    //   this.tableLoading = true;
    //   this.getObjects();
    // },
    onCopied() {
      this.$toast("Copied to clipboard !");
    },
    handleClickUpload() {
      // this.$router.push({
      //   path: this.$route.path,
      //   query: {
      //     action: "upload",
      //   },
      // });
      this.inUpload = true;
    },
    onRouteChange() {
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
    handlePasueDeleteFolder(id) {
      const index = this.deleteFoldersTasks.findIndex((it) => it.id == id);
      this.deleteFoldersTasks[index].stopTasks();
    },
    handleStartDeleteFolder(id) {
      const index = this.deleteFoldersTasks.findIndex((it) => it.id == id);
      let arr = this.deleteFoldersTasks.filter((item) => item.status == 0);
      this.deleteFoldersTasks[index].retryTasks();
      if (!arr.length) {
        this.processDeleteFolderTask();
      }
    },
    handleRemoveDeleteFolder(id) {
      let index = this.deleteFoldersTasks.findIndex((it) => it.id == id);
      this.deleteFoldersTasks.splice(index, 1);
    },

    handleDeleteFolderStartAll() {
      let arr = this.deleteFoldersTasks.filter((item) => item.status == 0);
      this.deleteFoldersTasks.forEach((it) => {
        if (it.status !== 2) return;
        it.retryTasks();
      });
      if (!arr.length) {
        this.processDeleteFolderTask();
      }
    },
    handleDeleteFolderPauseAll() {
      this.deleteFoldersTasks.forEach((item) => {
        if (item.status == 3) return;
        item.stopTasks();
      });
    },
    handleDeleteFolderRemoveAll() {
      this.deleteFoldersTasks = [];
    },
    isUploading(value) {
      this.taskIsUploading = value;
    },
  },
  watch: {
    path() {
      this.onRouteChange();
    },
  },
};
</script>

<style >
.file-tab .v-slide-group__content {
  background: #f8fafb;
}
</style>
<style lang="scss" scoped>
.bucket-item-container {
  background: #fff;
  .task-list {
    position: fixed;
    bottom: 80px;
    right: 20px;
    color: #34a9ff;
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
  .file-container {
    position: relative;
    min-height: 1000px;
    // margin-left: 10px;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
    padding: 0 30px;
    .operation-tab {
      padding: 26px 0;
      .selected-content {
        font-size: 18px;
        color: #6c7789;
        .selected-count {
          color: #0b0817;
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