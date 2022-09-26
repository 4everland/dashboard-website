<template>
  <div v-show="isShow">
    <e-expansion-panel :length="tasks.length > 6 ? 6 : tasks.length">
      <template #header>
        <div class="control-header al-c">
          <div v-if="allUploaded || allFailed" class="control-header-content">
            <v-icon
              class="mr-1"
              size="20"
              :color="allUploaded ? '#00BD9A' : 'red'"
            >
              {{
                allUploaded
                  ? "mdi-check-circle-outline"
                  : " mdi-close-circle-outline"
              }}
            </v-icon>
            Uploaded {{ allUploaded ? "Successfully" : "Failed" }} ({{
              uploadedFiles
            }}/{{ allFiles }})
          </div>
          <div v-if="warning" class="control-header-content">
            <v-icon size="20" class="mr-1" color="warning"
              >mdi-alert-circle-outline</v-icon
            >
            {{ uploadedFiles }} Files Uploaded {{ failedFiles }} Files Failed
          </div>
          <div
            v-if="isUploading || hasPause"
            class="al-c control-header-content"
          >
            <img
              width="15"
              class="mr-3 upload-icon"
              src="/img/svg/bucket/upload-icon.svg"
              alt=""
            />
            Uploading ({{ uploadedFiles }}/{{ allFiles }})
          </div>
        </div>
      </template>
      <template #control="{ handleClick, isShowBody }">
        <v-icon size="20" class="ml-2" @click="handleClick">{{
          isShowBody ? "mdi-chevron-down" : "mdi-chevron-up"
        }}</v-icon>
      </template>
      <div class="ml-auto">
        <v-tooltip top v-if="isUploading">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              size="22"
              v-bind="attrs"
              v-on="on"
              @click="handleAllStopUploading"
            >
              mdi-pause</v-icon
            >
          </template>
          <span>Suspend all</span>
        </v-tooltip>

        <v-tooltip top v-if="isPause">
          <template v-slot:activator="{ on, attrs }">
            <v-icon size="22" v-bind="attrs" v-on="on" @click="handleStartAll">
              mdi-play-outline</v-icon
            >
          </template>
          <span>Continue all </span>
        </v-tooltip>

        <v-tooltip top v-if="warning || allFailed">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              size="22"
              v-bind="attrs"
              v-on="on"
              @click="handleFailedRetry"
            >
              mdi-reload</v-icon
            >
          </template>
          <span>Retry all</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              size="20"
              class="ml-2"
              v-bind="attrs"
              v-on="on"
              @click="handleCancelAll"
              >mdi-close</v-icon
            >
          </template>
          <span>{{ allUploaded ? "Close" : "Cancel all" }} </span>
        </v-tooltip>
      </div>
      <template #content>
        <ul class="control-content" ref="controlContent">
          <li class="file-item pos-r" v-for="item in tasks" :key="item.id">
            <div
              class="progress-bg"
              :style="{ width: item.progress + '%' }"
            ></div>
            <div class="file al-c mx-7">
              <div class="file-info">
                <div class="file-name">{{ item.fileInfo.name }}</div>
                <div>
                  <span class="complete-size">{{
                    $utils.getFileSize(item.uploadFileSize)
                  }}</span
                  >/<span class="total-size">{{
                    $utils.getFileSize(item.fileSize)
                  }}</span>
                  <span class="status ml-2">{{ status(item.status) }} </span>
                </div>
              </div>
              <div class="file-control ml-auto">
                <v-icon
                  v-if="item.status == 3"
                  class="ml-auto"
                  size="20"
                  color="#5EB1FF"
                  >mdi-check-circle-outline</v-icon
                >
                <div v-else>
                  <!-- <v-icon
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
                  > -->
                  <v-icon
                    size="20"
                    class="ml-2"
                    v-if="item.status == 1 || item.status == 0"
                    @click="handleCancelUpload(item.id)"
                    >mdi-pause</v-icon
                  >
                  <v-icon
                    size="20"
                    class="ml-2"
                    v-if="item.status == 2"
                    @click="handleRetryUpload(item.id)"
                    >mdi-play-outline</v-icon
                  >

                  <v-icon
                    size="22"
                    class="ml-2"
                    v-if="item.status == 4"
                    @click="handleRetryUpload(item.id)"
                  >
                    mdi-reload</v-icon
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
            </div>
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
    };
  },
  computed: {
    status() {
      return function (status) {
        if (status == 0) {
          return "Preparing";
        } else if (status == 1) {
          return "Uploading";
        } else if (status == 2) {
          return "Suspended";
        } else if (status == 3) {
          return "";
        } else if (status == 4) {
          return "Upload Failed";
        } else {
          return "Undefined";
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
    headerBg() {
      if (this.allUploaded) {
        return "#E7F9EA";
      }
      if (this.allFailed || this.warning) {
        return "#FEFAEC";
      }
      return "#fff";
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
    async handleAllStopUploading() {
      this.tasks.forEach((item) => {
        if (item.status == 0 || item.status == 1) {
          item.cancelTask();
        }
      });
    },
    async handleCancelAll() {
      await this.handleAllStopUploading();
      this.tasks = [];
      this.isShow = false;
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
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
.control-header {
  font-size: 14px;
  color: #0b0817;
  .upload-icon {
    animation: float 1s ease infinite;
  }
  .control-header-content {
    transition: all 1s ease;
  }
}

.control-content {
  list-style: none;
  margin: 0;
  padding: 0;
  .file-item {
    height: 50px;
    margin-bottom: 10px;
    box-sizing: border-box;

    .progress-bg {
      position: absolute;
      width: 0;
      height: 100%;
      background: #e0f2ff;
      transition: 1s all ease;
    }
    .progress-bg::after {
      content: "";
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      width: 2px;
      height: 100%;
      background: #5eb1ff;
    }
  }
  overflow: scroll;
  .file {
    position: relative;
    z-index: 2;
    padding: 5px 0;
    height: 100%;
    box-sizing: border-box;
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
  }
}
</style>