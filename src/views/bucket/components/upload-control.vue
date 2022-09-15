<template>
  <div v-show="isShow">
    <e-expansion-panel :length="tasks.length > 6 ? 6 : tasks.length">
      <template #header>
        <div class="control-header al-c">
          <div v-if="allUploaded || allFailed">
            <v-icon size="20" color="success">mdi-check-circle</v-icon>
            File Upload {{ allUploaded ? "Success" : "Failed" }} ({{
              uploadedFiles
            }}/{{ allFiles }})
          </div>
          <div v-if="warning">
            <v-icon size="20" color="warning">mdi-alert-circle</v-icon>
            {{ uploadedFiles }} Files Uploaded {{ failedFiles }} Files Failed
          </div>
          <div v-if="isUploading || hasPause">
            <v-icon size="20" :color="isUploading ? 'blue' : 'grey'">
              mdi-arrow-up-bold-circle-outline</v-icon
            >
            Uploading.... ({{ uploadedFiles }}/{{ allFiles }})
          </div>
        </div>
      </template>
      <template #control="{ handleClick, isShowBody }">
        <v-icon size="20" class="ml-2" @click="handleClick">{{
          isShowBody ? "mdi-chevron-down" : "mdi-chevron-up"
        }}</v-icon>
      </template>
      <div class="ml-auto">
        <v-icon size="22" v-if="isUploading" @click="handleAllStopUploading">
          mdi-pause</v-icon
        >
        <v-icon size="22" v-if="isPause" @click="handleStartAll">
          mdi-play-outline</v-icon
        >
        <v-icon
          size="22"
          v-if="warning || allFailed"
          @click="handleFailedRetry"
        >
          mdi-reload</v-icon
        >
        <v-icon size="20" class="ml-2" @click="isShow = false"
          >mdi-close</v-icon
        >
      </div>
      <template #content>
        <ul class="control-content" ref="controlContent">
          <li class="file-item" v-for="item in tasks" :key="item.id">
            <div class="file al-c">
              <img
                width="24"
                src="/img/svg/bucketFileInfo/word_icon.svg"
                alt=""
              />
              <div class="file-info ml-3">
                <div class="file-name">{{ item.fileInfo.name }}</div>
                <div>
                  <span class="complete-size">{{
                    $utils.getFileSize(item.uploadFileSize)
                  }}</span
                  >/<span class="total-size">{{
                    $utils.getFileSize(item.fileSize)
                  }}</span>
                  <span
                    class="status ml-2"
                    :style="{ color: status(item.status).color }"
                    >{{ status(item.status).status }}
                  </span>
                </div>
              </div>
              <div class="file-control ml-auto">
                <v-icon
                  size="22"
                  v-if="item.status != 3"
                  @click="
                    item.status == 2 || item.status == 4
                      ? handleRetryUpload(item.id)
                      : handleCancelUpload(item.id)
                  "
                  >{{
                    item.status == 2 || item.status == 4
                      ? "mdi-play-outline"
                      : "mdi-pause"
                  }}</v-icon
                >
                <v-icon
                  v-if="item.status != 3"
                  size="20"
                  class="ml-2"
                  @click="handleClearRecords(item.id)"
                  >mdi-close</v-icon
                >
              </div>
            </div>
            <v-progress-linear
              v-show="!(item.status == 2 || item.status == 4)"
              :indeterminate="!item.progress"
              color="green"
              height="2"
              :value="item.progress"
            ></v-progress-linear>
          </li>
        </ul>
      </template>
    </e-expansion-panel>
  </div>
</template>

<script>
import { bus } from "../../../utils/bus";
export default {
  data() {
    return {
      isShow: false,
      tasks: [],
      limit: 10,
      distance: null,
      list: [],
      min_height: 0,
      total_height: 0,
      runList: [],
      cache_screens: 1,
      maxNum: 0,
    };
  },
  computed: {
    status() {
      return function (status) {
        if (status == 0) {
          return {
            color: "#24bc96",
            status: "Preparing",
          };
        } else if (status == 1) {
          return {
            color: "#775da6",
            status: "Uploading",
          };
        } else if (status == 2) {
          return {
            color: "#6a778b",
            status: "Stopped",
          };
        } else if (status == 3) {
          return {
            color: "#ff8843",
            status: "Uploaded",
          };
        } else if (status == 4) {
          return {
            color: "#ff6960",
            status: "Upload Failed",
          };
        } else {
          return {
            color: "#24bc96",
            status: "Undefined",
          };
        }
      };
    },
    allFiles() {
      return this.tasks.length;
    },
    uploadedFiles() {
      return this.tasks.filter((it) => it.status == 3).length;
    },
    failedFiles() {
      return this.tasks.filter((it) => it.status == 4).length;
    },
    isPause() {
      return this.tasks.some((it) => it.status == 2) && !this.isUploading;
    },
    isUploading() {
      return this.tasks.some((it) => it.status == 1 || it.status == 0);
    },
    hasPause() {
      return this.tasks.some((it) => it.status == 2);
    },
    allUploaded() {
      if (!this.tasks.length) return false;
      return this.tasks.every((it) => it.status == 3);
    },
    allFailed() {
      if (!this.tasks.length) return false;
      return this.tasks.every((it) => it.status == 4);
    },
    warning() {
      if (this.allFailed) return false;
      const hasPause = this.tasks.some((it) => it.status == 2);
      if (hasPause) return false;
      const hasUploading = this.tasks.some(
        (it) => it.status == 1 || it.status == 0
      );
      if (hasUploading) return false;
      if (this.failedFiles > 0) return true;
      return false;
    },
  },
  mounted() {
    bus.$on("taskData", (tasks, isTrue) => {
      this.isShow = true;
      if (this.tasks.length) {
        let noExistTasks = [];
        tasks.forEach((item) => {
          let index = this.tasks.findIndex((it) => {
            return it.id == item.id;
          });
          if (index == -1) {
            noExistTasks.push(item);
          }
        });
        this.tasks = noExistTasks.concat(this.tasks);
      } else {
        this.tasks = tasks;
      }
    });
  },
  methods: {
    async handleCancelUpload(id) {
      let index = this.tasks.findIndex((item) => item.id == id);
      await this.tasks[index].cancelTask();
    },
    async handleClearRecords(id) {
      let index = this.tasks.findIndex((it) => it.id == id);
      await this.tasks[index].cancelTask();
      if (index !== -1) {
        this.tasks.splice(index, 1);
      }
      bus.$emit("handleClearRecords", id);
    },
    handleRetryUpload(id) {
      let index = this.tasks.findIndex((item) => item.id == id);
      let arr = this.tasks.filter((item) => item.status == 0);
      this.tasks[index].resetStatus();
      if (!arr.length) {
        this.processTask();
      }
    },
    handleAllStopUploading() {
      this.tasks.forEach((item) => {
        if (item.status == 0 || item.status == 1) {
          item.cancelTask();
        }
      });
    },
    handleStartAll() {
      let arr = this.tasks.filter((item) => item.status == 0);
      this.tasks.forEach((item) => {
        if (item.status == 2 || item.status == 4) {
          item.resetStatus();
          if (!arr.length) {
            this.processTask();
          }
        }
      });
    },
    handleFailedRetry() {
      let arr = this.tasks.filter((item) => item.status == 0);
      let failedFiles = this.tasks.filter((item) => item.status == 4);
      failedFiles.forEach((item) => {
        item.resetStatus();
        if (!arr.length) {
          this.processTask();
        }
      });
    },
    async start(task) {
      await task.startTask();
      this.processTask();
    },
    async processTask() {
      let processing = this.tasks.filter((task) => {
        return task.status == 1;
      });
      if (processing.length >= this.limit) {
        return;
      }
      const idles = this.tasks.filter((task) => {
        return task.status == 0;
      });
      if (idles.length == 0) {
        return;
      }
      const fill = this.limit - processing.length;
      const min = idles.length <= fill ? idles.length : fill;
      for (let i = 0; i < min; i++) {
        this.start(idles[i]);
      }
    },
  },
  watch: {
    tasks: {
      handler(newValue) {
        let uploadingLength = newValue.filter(
          (it) => it.status == 1 || it.status == 0
        ).length;
        bus.$emit("uploadingLength", uploadingLength);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.control-header {
  font-size: 14px;
}

.control-content {
  list-style: none;
  margin: 0;
  padding: 0;
  .file-item {
    height: 60px;
    box-sizing: border-box;
  }
  overflow: scroll;
  .file {
    padding: 5px 0;
    .file-info {
      font-size: 12px;
      color: #999;
      .file-name {
        width: 250px;
        color: #000;
        font-size: 14px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .file-control {
      opacity: 0;
      transition: all 0.5s ease;
    }
  }
  .file:hover .file-control {
    opacity: 1;
  }
}
</style>