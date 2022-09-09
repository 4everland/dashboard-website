<template>
  <div v-show="isShow">
    <e-expansion-panel
      :length="deleteFolderTasks.length > 6 ? 6 : deleteFolderTasks.length"
    >
      <template #header>
        <div class="control-header al-c">
          <v-icon size="20" color="success">mdi-check-circle</v-icon>
          <span class="ml-2">Deleting...({{ compeleteFiles }})</span>
        </div>
      </template>
      <template #control="{ handleClick, isShowBody }">
        <v-icon size="20" class="ml-2" @click="handleClick">{{
          isShowBody ? "mdi-chevron-down" : "mdi-chevron-up"
        }}</v-icon>
      </template>
      <div class="ml-auto">
        <v-icon
          size="22"
          v-if="showAllPause"
          @click="handleDeleteFolderPauseAll"
        >
          mdi-pause</v-icon
        >
        <v-icon
          size="22"
          v-if="showAllStart"
          @click="handleDeleteFolderStartAll"
        >
          mdi-play-outline</v-icon
        >
        <v-icon size="20" v-if="showAllRetry" @click="handleRetryFailed">
          mdi-reload</v-icon
        >
        <v-icon size="20" class="ml-2" @click="isShow = false"
          >mdi-close</v-icon
        >
      </div>
      <template #content>
        <ul class="control-content" ref="controlContent">
          <li
            class="file-item"
            v-for="item in deleteFolderTasks"
            :key="item.id"
          >
            <div class="file al-c">
              <img
                width="24"
                src="/img/svg/bucketFileInfo/word_icon.svg"
                alt=""
              />
              <div class="file-info ml-3">
                <div class="file-name">
                  {{ item.param.Bucket }}/{{ item.param.Prefix }}
                </div>
                <div>
                  <span>Deleted</span>
                  <span class="ml-2">{{ item.deleteCount }}</span>
                </div>
              </div>
              <div class="ml-3" :style="{ color: status(item.status).color }">
                {{ status(item.status).status }}
              </div>
              <div class="file-control ml-auto">
                <v-icon
                  size="22"
                  v-if="item.status != 3"
                  @click="
                    item.status == 2 || item.status == 4
                      ? handleStartDeleteFolder(item.id)
                      : handlePasueDeleteFolder(item.id)
                  "
                >
                  {{
                    item.status == 2 || item.status == 4
                      ? "mdi-play-outline"
                      : "mdi-pause"
                  }}
                </v-icon>
                <v-icon
                  size="20"
                  class="ml-2"
                  v-if="item.status != 3"
                  @click="handleRemoveDeleteFolder(item.id)"
                  >mdi-close</v-icon
                >
              </div>
            </div>
            <v-progress-linear
              v-show="!(item.status == 2 || item.status == 4)"
              :indeterminate="!item.status == 3"
              color="green"
              height="2"
              :value="item.status == 3 ? 100 : 0"
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
      deleteFolderTasks: [],
      deleteFolderLimit: 2,
    };
  },
  mounted() {
    bus.$on("deleteFolderTasks", (deleteFolderTasks) => {
      this.isShow = true;
      if (this.deleteFolderTasks) {
        let noExistDeleteTasks = [];
        deleteFolderTasks.forEach((item) => {
          let index = this.deleteFolderTasks.findIndex((it) => {
            return it.id == item.id;
          });
          if (index == -1) {
            noExistDeleteTasks.push(item);
          }
        });
        this.deleteFolderTasks = noExistDeleteTasks.concat(
          this.deleteFolderTasks
        );
      } else {
        this.deleteFolderTasks = deleteFolderTasks;
      }
    });
    bus.$on("originDeleteFolderTasks", () => {
      if (this.deleteFolderTasks.length) {
        bus.$emit("getOriginDeleteFolderTasks", this.deleteFolderTasks);
      }
    });
  },
  computed: {
    status() {
      return function (status) {
        if (status == 0) {
          return {
            color: "#24bc96",
            status: "Waiting",
          };
        } else if (status == 1) {
          return {
            color: "#775da6",
            status: "Deleteing",
          };
        } else if (status == 2) {
          return {
            color: "#6a778b",
            status: "Paused",
          };
        } else if (status == 3) {
          return {
            color: "#ff8843",
            status: "Compelete",
          };
        } else if (status == 4) {
          return {
            color: "#ff6960",
            status: "Failed",
          };
        } else {
          return {
            color: "#24bc96",
            status: "Undefined",
          };
        }
      };
    },
    compeleteTasks() {
      return this.deleteFolderTasks.filter((it) => it.status == 3);
    },
    compeleteFiles() {
      let count = 0;
      this.deleteFolderTasks.forEach((it) => {
        count += it.deleteCount;
      });
      return count;
    },
    allCompelete() {
      return this.deleteFolderTasks.every((it) => it.status == 3);
    },
    // 0 --waiting 1 -- deleting  2--stoped  3--deleted  4-failed
    showAllPause() {
      return this.deleteFolderTasks.some(
        (it) => it.status == 0 || it.status == 1
      );
    },
    showAllStart() {
      const stoppedTasks = this.deleteFolderTasks.filter(
        (it) => it.status == 2
      );
      if (!this.showAllPause && stoppedTasks.length) {
        return true;
      }
      return false;
    },
    showAllRetry() {
      if (this.allCompelete) return false;
      return this.deleteFolderTasks.every(
        (it) => it.status == 3 || it.status == 4
      );
    },
    allFailedStatus() {
      return this.deleteFolderTasks.every((it) => it.status == 4);
    },

    hasDeleteing() {
      return this.deleteFolderTasks.some(
        (it) => it.status == 1 || it.status == 0
      );
    },
  },
  methods: {
    handleStartDeleteFolder(id) {
      const index = this.deleteFolderTasks.findIndex((it) => it.id == id);
      let arr = this.deleteFolderTasks.filter((item) => item.status == 0);
      this.deleteFolderTasks[index].retryTasks();
      console.log(arr, this.deleteFolderTasks);
      if (!arr.length) {
        this.processDeleteFolderTask();
      }
    },
    handlePasueDeleteFolder(id) {
      const index = this.deleteFolderTasks.findIndex((it) => it.id == id);
      this.deleteFolderTasks[index].stopTasks();
    },
    async startDeleteFolder(task) {
      await task.startTasks();
      this.processDeleteFolderTask();
    },
    async processDeleteFolderTask() {
      let processing = this.deleteFolderTasks.filter(
        (item) => item.status == 1
      );
      if (processing.length >= this.deleteFolderLimit) return;
      const idles = this.deleteFolderTasks.filter((item) => item.status == 0);
      if (!idles.length) return;
      const fill = this.deleteFolderLimit - processing.length;
      // console.log(fill);
      const min = idles.length <= fill ? idles.length : fill;
      for (let i = 0; i < min; i++) {
        this.startDeleteFolder(idles[i]);
      }
    },
    handleDeleteFolderPauseAll() {
      this.deleteFolderTasks.forEach((item) => {
        if (item.status == 3) return;
        item.stopTasks();
      });
    },
    handleDeleteFolderStartAll() {
      let arr = this.deleteFolderTasks.filter((item) => item.status == 0);
      this.deleteFolderTasks.forEach((it) => {
        if (it.status !== 2) return;
        it.retryTasks();
      });
      if (!arr.length) {
        this.processDeleteFolderTask();
      }
    },
    handleRetryFailed() {
      let arr = this.deleteFolderTasks.filter((item) => item.status == 0);
      const failedTasks = this.deleteFolderTasks.filter((it) => it.status == 4);
      if (failedTasks.length) {
        failedTasks.forEach((it) => {
          it.retryTasks();
          if (!arr.length) {
            this.processDeleteFolderTask();
          }
        });
      }
    },

    handleRemoveDeleteFolder(id) {
      console.log(this.deleteFolderTasks);
      let index = this.deleteFolderTasks.findIndex((it) => it.id == id);
      this.deleteFolderTasks.splice(index, 1);
      bus.$emit("handleRemoveDeleteFolder", this.deleteFolderTasks);
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
    font-size: 14px;
    .file-info {
      font-size: 12px;
      color: #999;
      .file-name {
        width: 150px;
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