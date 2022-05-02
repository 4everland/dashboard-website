<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      width="900"
      class="drawer-container ov-a"
      stateless
      fixed
      right
      temporary
    >
      <div class="d-flex justify-space-between pr-6">
        <span class="fw-b fz-18">Task List</span>
        <img
          style="cursor: pointer"
          @click="handleCloseTaskList"
          src="../../../../public/img/svg/close_icon.svg"
          alt=""
        />
      </div>
      <div class="tips py-3">
        Tip：If you refresh or close the browser, the ongoing upload task is
        canceled and all upload records are cleared.
      </div>
      <div class="task-content">
        <div class="d-flex task-list-tabs">
          <div
            class="px-10 py-5"
            :class="currentTab == 0 ? 'active' : ''"
            @click="currentTab = 0"
          >
            Upload Task
          </div>
          <div
            class="px-10 py-5 ml-2"
            :class="currentTab == 1 ? 'active' : ''"
            @click="currentTab = 1"
          >
            Delete Folder
          </div>
        </div>

        <!-- Upload Task -->
        <div class="upload-task" v-show="currentTab == 0">
          <ul class="status-tabs d-flex align-center">
            <li
              class="status-tab"
              @click="handleChangeStatusBar(0)"
              :class="status == 0 ? 'active' : ''"
            >
              <span>All</span>
              <span>({{ allList }})</span>
            </li>
            <li
              class="status-tab"
              :class="status == 1 ? 'active' : ''"
              @click="handleChangeStatusBar(1)"
            >
              <span>Uploading</span> <span>({{ uploadingList }})</span>
            </li>
            <li
              class="status-tab"
              @click="handleChangeStatusBar(2)"
              :class="status == 2 ? 'active' : ''"
            >
              <span>Stopped</span> <span>({{ stoppedList }})</span>
            </li>
            <li
              class="status-tab"
              @click="handleChangeStatusBar(3)"
              :class="status == 3 ? 'active' : ''"
            >
              <span>Uploaded</span> <span>({{ uploadedList }})</span>
            </li>
            <li
              class="status-tab"
              @click="handleChangeStatusBar(4)"
              :class="status == 4 ? 'active' : ''"
            >
              <span>Upload Failed</span> <span>({{ failedList }})</span>
            </li>
          </ul>

          <div>
            <v-btn
              rounded
              color="primary"
              class="my-5"
              v-show="status == 0 || status == 1"
              :disabled="isUploadAllStop"
              @click="handleAllStopUploading"
            >
              <span>Stop Uploading</span>
            </v-btn>

            <v-btn
              rounded
              color="primary"
              class="my-5 mr-5"
              v-show="status == 2 || status == 4"
              @click="handleStartAll"
              :disabled="isUploadAllStart && !list.length"
            >
              <span>Start All</span>
            </v-btn>
            <v-btn
              rounded
              color="primary"
              class="my-5"
              outlined
              v-show="status == 2 || status == 3 || status == 4"
              @click="handleClearAllRecords"
              :disabled="!list.length"
            >
              <span>Clear All Records</span>
            </v-btn>
          </div>

          <div class="table-container">
            <v-data-table
              :headers="headers"
              :items="list.slice((this.page - 1) * 10, this.page * 10)"
              class="elevation-1 task-table"
              hide-default-footer
            >
              <template #item.fileInfo[path]="{ item }">
                <span style="word-break: break-all">{{
                  item.fileInfo.path
                }}</span>
              </template>
              <template #item.fileInfo[name]="{ item }">
                <span class="name">{{ item.fileInfo.name.slice(0, 8) }}..</span>
              </template>
              <template #item.status="{ item }">
                <span v-show="item.status == 3" style="color: #ff8843"
                  >Uploaded</span
                >
                <span v-show="item.status == 2" style="color: #6a778b"
                  >Stopped</span
                >
                <span v-show="item.status == 4" style="color: #ff6960"
                  >Upload Failed</span
                >
                <span v-show="item.status == 0" style="color: #24bc96"
                  >Preparing</span
                >
                <span v-show="item.status == 1" style="color: #34a9ff"
                  >{{ item.progress }}%</span
                >
              </template>
              <template #item.action="{ item }">
                <span
                  class="opeartion"
                  v-show="item.status == 4 || item.status == 2"
                  @click="handleRetryUpload(item.id)"
                  >Retry</span
                >

                <span
                  class="opeartion"
                  v-show="item.status !== 3 && item.status !== 2"
                  @click="handleCancelUpload(item.id)"
                  >Cancel</span
                >
                <span class="opeartion" v-show="item.status == 3">Share</span>
                <span
                  class="opeartion"
                  v-show="
                    item.status == 3 || item.status == 2 || item.status == 4
                  "
                  @click="handleClearRecords(item.id)"
                  >Clear Records</span
                >

                <!-- <span style="cursor: pointer">Cancel</span> -->
              </template>
            </v-data-table>
            <template v-if="length == 0">
              <e-empty :loading="false">
                {{ false ? `Loading files...` : `No folders or files` }}
              </e-empty>
            </template>
            <div class="table-footer d-flex align-center justify-center pt-6">
              <v-pagination
                v-if="length > 1"
                total-visible="10"
                v-model="page"
                :length="length"
                @input="handleSkip"
              ></v-pagination>
            </div>
          </div>
        </div>

        <!-- Delete Folder -->
        <div v-show="currentTab == 1" class="delete-folder-task">
          <div class="tips">
            <img
              class="icon"
              src="img/icon/bucketUpload/ic-warning.svg"
              alt=""
            />
            <span class="ml-2"
              >If you refresh or close the page when the folder is being
              deleted, the displayed number of deleted files may be
              inaccurate.</span
            >
          </div>
          <div class="my-5">
            <v-btn
              rounded
              color="primary"
              @click="handleDeleteFolderStartAll"
              :disabled="!deleteFolderTasks.some((it) => it.status == 2)"
            >
              Start All
            </v-btn>
            <v-btn
              rounded
              color="primary"
              class="ml-5"
              outlined
              @click="handleDeleteFolderPauseAll"
              :disabled="
                !deleteFolderTasks.some(
                  (it) => it.status !== 2 && it.status !== 3
                )
              "
            >
              Pause All
            </v-btn>
            <v-btn
              rounded
              outlined
              color="primary"
              class="ml-5"
              @click="handleDeleteFolderRemoveAll"
              :disabled="!deleteFolderTasks.length"
            >
              Removed
            </v-btn>
          </div>
          <v-data-table
            :headers="deleteFolderHeaders"
            :items="
              deleteFolderList.slice(
                (this.deleteFolderPage - 1) * 10,
                this.deleteFolderPage * 10
              )
            "
            item-key="param[Prefix]"
            class="elevation-1 task-table"
            hide-default-footer
          >
            <template #item.status="{ item }">
              <p
                v-if="item.status == 3"
                class="complete delete-folder-status mb-0"
              >
                COMPLETE
              </p>
              <p
                v-if="item.status == 2"
                class="pause delete-folder-status mb-0"
              >
                PAUSED
              </p>
              <p
                v-if="item.status == 1"
                class="
                  deleteing
                  delete-folder-status
                  d-flex
                  align-center
                  justify-center
                  mb-0
                "
              >
                <v-progress-circular
                  style="width: 20px"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <span class="ml-4">DELETEING</span>
              </p>
              <p v-if="item.status == 0" class="mb-0 delete-folder-status">
                <span class="ml-4">WAITING</span>
              </p>
            </template>
            <template #item.action="{ item }">
              <span
                v-show="item.status == 2"
                class="px-3 opeartion"
                @click="handleStartDeleteFolder(item.id)"
                >Start</span
              >
              <span
                v-show="item.status == 1 || item.status == 0"
                class="px-3 opeartion"
                @click="handlePasueDeleteFolder(item.id)"
                >Pause</span
              >
              <span
                class="px-3 opeartion"
                @click="handleRemoveDeleteFolder(item.id)"
                >Remove</span
              >
            </template>
          </v-data-table>
          <template v-if="deleteFolderLength == 0">
            <e-empty :loading="false">
              {{ false ? `Loading files...` : `No folders or files` }}
            </e-empty>
          </template>
          <div class="table-footer d-flex align-center justify-center pt-6">
            <v-pagination
              v-if="deleteFolderLength > 1"
              total-visible="10"
              v-model="page"
              :length="deleteFolderLength"
              @input="handleSkip"
            ></v-pagination>
          </div>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { bus } from "../../../main";

export default {
  props: {
    deleteFolder: {
      type: Boolean,
      default: false,
    },
    deleteFolderTasks: {
      type: Array,
      default: () => {},
    },
    prefix: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      drawer: true,
      tasks: [],
      status: 0,
      currentTab: 0,
      headers: [
        {
          text: "Name",
          align: "center",
          sortable: false,
          value: "fileInfo[name]",
        },
        {
          text: "Upload To",
          value: "fileInfo[path]",
          sortable: false,
          align: "center",
          width: 200,
        },
        { text: "Status", value: "status", sortable: false, align: "center" },
        {
          text: "Action",
          value: "action",
          sortable: false,
          align: "center",
          width: 300,
        },
      ],
      deleteFolderHeaders: [
        {
          text: "Folder Name",
          align: "center",
          sortable: false,
          value: "param[Prefix]",
        },
        {
          text: "Bucket",
          align: "center",
          sortable: false,
          value: "param[Bucket]",
        },
        {
          text: "Number of Deleted Files",
          align: "center",
          sortable: false,
          value: "deleteCount",
        },
        {
          text: "Status",
          align: "center",
          sortable: false,
          value: "status",
          width: 200,
        },
        {
          text: "Action",
          align: "center",
          sortable: false,
          value: "action",
        },
      ],

      page: 1,
      deleteFolderPage: 1,
    };
  },
  created() {},
  mounted() {
    bus.$on("taskData", (tasks) => {
      this.drawer = true;
      this.tasks = tasks;
    });
  },
  computed: {
    list() {
      return this.tasks.filter((it) => {
        if (this.status == 0) return it;
        if (this.status == 1) return it.status == 1 || it.status == 0;
        // if (this.status == 2) return it.status == 2;
        // if (this.status == 3) return it.status == 3;
        // if (this.status == 4) return it.status == 4;
        return it.status == this.status;
      });
    },
    allList() {
      return this.tasks.length;
    },
    uploadingList() {
      return this.tasks.filter((it) => it.status == 1 || it.status == 0).length;
    },
    stoppedList() {
      return this.tasks.filter((it) => it.status == 2).length;
    },
    uploadedList() {
      return this.tasks.filter((it) => it.status == 3).length;
    },
    failedList() {
      return this.tasks.filter((it) => it.status == 4).length;
    },
    length() {
      return Math.ceil(this.list.length / 10);
    },

    deleteFolderList() {
      return this.deleteFolderTasks;
    },
    deleteFolderLength() {
      return Math.ceil(this.deleteFolderList.length / 10);
    },
    isUploadAllStop() {
      return !this.tasks.some((i) => i.status == 0 || i.status == 1);
    },
    isUploadAllStart() {
      return !this.tasks.some((i) => i.status == 2);
    },
  },
  methods: {
    handleCloseTaskList() {
      this.drawer = false;
      this.$emit("update:deleteFolder", false);
    },
    handleChangeStatusBar(value) {
      this.status = value;
      this.page = 1;
    },
    handleChangeStatus(value) {
      this.status = value;
    },
    handleSkip(item) {
      this.page = item;
    },
    handleClearRecords(id) {
      bus.$emit("handleClearRecords", id);
    },
    handleCancelUpload(id) {
      bus.$emit("handleCancelUpload", id);
    },
    handleRetryUpload(id) {
      bus.$emit("handleRetryUpload", id);
    },
    handleAllStopUploading() {
      bus.$emit("handleAllStopUploading");
    },
    handleStartAll() {
      bus.$emit("handleStartAll");
    },
    handleClearAllRecords() {
      bus.$emit("handleClearAllRecords", this.status);
    },
    handlePasueDeleteFolder(id) {
      console.log(id);
      this.$emit("handlePasueDeleteFolder", id);
    },
    handleStartDeleteFolder(id) {
      this.$emit("handleStartDeleteFolder", id);
    },
    handleRemoveDeleteFolder(id) {
      this.$emit("handleRemoveDeleteFolder", id);
    },

    handleDeleteFolderStartAll() {
      this.$emit("handleDeleteFolderStartAll");
    },
    handleDeleteFolderPauseAll() {
      this.$emit("handleDeleteFolderPauseAll");
    },
    handleDeleteFolderRemoveAll() {
      this.$emit("handleDeleteFolderRemoveAll");
    },
  },
  watch: {
    deleteFolder(newValue) {
      console.log(newValue);
      if (newValue) {
        this.drawer = true;
        this.currentTab = 1;
      }
    },
  },
};
</script>
<style >
.task-table td {
  padding: 20px 0 !important;
  font-size: 16px !important;
}
</style>
<style lang="scss" scoped>
.v-application .elevation-1 {
  box-shadow: none !important;
  color: #0b0817 !important;
}
.name {
  color: #34a9ff;
}
.opeartion {
  color: #34a9ff;
  font-size: 16px;
  padding: 0 5px;
  cursor: pointer;
}
.v-tab {
  font-size: 14px;
  font-weight: 400;
  color: #6a778b;
  border-bottom: 1px solid #d0dae9;
}
.v-tab.v-tab--active {
  color: #34a9ff;
}
.v-tab.v-tab--active span:nth-of-type(1) {
  font-size: 20px;
}
.drawer-container {
  padding: 24px 0 24px 24px;
  bottom: 0;
  box-sizing: border-box;
  border-radius: 20px 0 0 20px;
  height: 100vh !important;
  overflow: auto;
  .tips {
    color: #6a778b;
    font-size: 14px;
  }
  .task-content {
    background: #f8fafb;
    border-radius: 8px 0 0 8px;
    padding: 18px 0 21px 19px;
    .task-list-tabs {
      > div {
        font-size: 18px;
        color: #6c7789;
        border-radius: 20px 20px 0 0;
        background: #f8fafb;
        cursor: pointer;
      }
      .active {
        color: #0b0817;
        font-weight: bold;
        background: #fff;
      }
    }
    .upload-task {
      padding: 30px 0 0 25px;
      box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
      background: #fff;
      .status-tabs {
        list-style: none;
        border-bottom: 1px solid #d0dae9;
        .status-tab {
          font-size: 14px;
          padding: 10px 20px;
          cursor: pointer;
        }
        .active {
          position: relative;
          color: #34a9ff;
        }
        .active span:nth-of-type(1) {
          font-size: 16px;
        }
        .active::after {
          content: "";
          display: block;
          position: absolute;
          height: 2px;
          width: 30px;
          background: #34a9ff;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
        }
      }
    }
    .delete-folder-task {
      padding: 30px 0 0 25px;
      box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
      background: #fff;
      .tips {
        padding: 10px;
        color: #ff6960;
        background: #fff2f2;
        border-radius: 6px;
        .icon {
          vertical-align: sub;
        }
      }
      .delete-folder-status {
        height: 40px;
        line-height: 40px;
      }
      .complete {
        color: #00bd9a;
      }
      .pause {
        color: #ff8843;
      }
      .deleteing {
        color: #ff6960;
      }
    }
  }
}
</style>
