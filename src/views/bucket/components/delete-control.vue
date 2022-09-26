<template>
  <div v-show="isShow">
    <e-expansion-panel
      ref="ePanel"
      :length="deleteFolderTasks.length > 6 ? 6 : deleteFolderTasks.length"
      @showBody="showBody"
    >
      <template #header>
        <div class="control-header al-c">
          <div v-if="hasDeleteing || hasPause" class="al-c">
            <img
              width="17"
              class="dustbin-icon"
              src="/img/svg/bucket/dustbin-icon.svg"
              alt=""
            />
            <span class="ml-3">Deleting ({{ compeleteFiles }})</span>
          </div>
          <div v-else-if="allCompelete || allFailedStatus" class="al-c">
            <v-icon size="20" :color="allCompelete ? '#00BD9A' : 'red'">{{
              allCompelete
                ? "mdi-check-circle-outline"
                : " mdi-close-circle-outline"
            }}</v-icon>
            <span class="ml-2"
              >Deleted {{ allCompelete ? "Successfully" : "Failed" }} ({{
                compeleteFiles
              }})</span
            >
          </div>
          <div v-else class="al-c">
            <v-icon size="20" color="warning">mdi-alert-circle-outline</v-icon>
            <span class="ml-2"
              >Deleted ({{ compeleteFiles }}), some failed</span
            >
          </div>
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
        <v-icon size="20" class="ml-2" @click="handleAllClose"
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
            <div class="file mx-7 al-c">
              <div class="file-info">
                <div class="file-name">
                  {{ item.param.Bucket }}/{{ item.param.Prefix }}
                </div>
                <div class="al-c">
                  <div style="min-width: 100px">
                    <span>Deleted</span>
                    <span class="ml-2">{{ item.deleteCount }}</span>
                  </div>
                  <div class="ml-5">{{ status(item.status) }}</div>
                </div>
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
    bus.$on("hiddenOtherBody", (arr) => {
      arr.includes("delete") ? (this.$refs.ePanel.isShowBody = false) : null;
    });
  },
  computed: {
    status() {
      return function (status) {
        if (status == 0) {
          return "Waiting";
        } else if (status == 1) {
          return "Deleting";
        } else if (status == 2) {
          return "Suspended";
        } else if (status == 3) {
          return "Delete completed";
        } else if (status == 4) {
          return "Failed";
        } else {
          return "Undefined";
        }
      };
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
    hasPause() {
      return this.deleteFolderTasks.some((it) => it.status == 2);
    },
  },
  methods: {
    showBody() {
      bus.$emit("hiddenOtherBody", ["pin", "upload"]);
    },
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
      let index = this.deleteFolderTasks.findIndex((it) => it.id == id);
      this.handlePasueDeleteFolder(id);
      this.deleteFolderTasks.splice(index, 1);
      bus.$emit("handleRemoveDeleteFolder", this.deleteFolderTasks);
    },
    handleAllClose() {
      this.handleDeleteFolderPauseAll();
      this.deleteFolderTasks = [];
      bus.$emit("handleDeleteFolderRemoveAll");
      this.isShow = false;
    },
  },
  watch: {
    isShow(newVal) {
      if (newVal) {
        bus.$emit("hiddenOtherBody", ["pin", "upload"]);
      }
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
  .dustbin-icon {
    animation: float 1s ease infinite;
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