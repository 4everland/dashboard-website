<template>
  <div class="uploder-container">
    <div class="choose-dir">
      <h3 class="choose-dir-title">Upload To</h3>
      <!-- Switch Current Dir -->
      <v-btn
        :color="curDir == 'Current' ? 'primary' : ''"
        rounded
        :outlined="curDir == 'Current' ? false : true"
        @click="
          curDir = 'Current';
          specifiedDir = '';
        "
      >
        <img src="img/svg/upload.svg" width="16" />
        <span class="ml-2">Current</span>
      </v-btn>
      <v-btn
        :color="curDir == 'Specified' ? 'primary' : ''"
        :outlined="curDir == 'Specified' ? false : true"
        rounded
        class="ml-7"
        @click="curDir = 'Specified'"
      >
        <img src="img/svg/upload.svg" width="16" />
        <span class="ml-2">Specified</span>
      </v-btn>

      <div class="current-dir px-2 mt-10" v-if="curDir == 'Current'">
        {{ path }}
      </div>
      <div class="specified-dir d-flex align-center mt-7" v-else>
        <div class="appoint-dir d-flex align-center">{{ path }}</div>
        <v-text-field
          v-model="specifiedDir"
          class="hide-msg bd-1 specified-dir-input"
          dense
          solo
          height="50"
        ></v-text-field>
      </div>
    </div>
    <div class="files-upload-container">
      <h3 class="title">Files to Upload</h3>
      <!-- upload-area -->
      <div class="files-to-upload">
        <input-upload v-model="files" ref="uploadInput"></input-upload>
      </div>

      <!-- upload-list -->
      <div class="table-container">
        <div class="total-files-info">
          <span>Number of Files: {{ files.length }}</span>
          <span class="ml-13">Total Size: {{ totalSize }} </span>
        </div>
        <v-data-table
          :headers="headers"
          :items="list"
          class="elevation-1"
          hide-default-footer
        >
          <template #item.action="{ item }">
            <span
              style="cursor: pointer; color: #34a9ff"
              @click="$refs.uploadInput.handleRemove(item.id)"
              >Remove</span
            >
          </template>
        </v-data-table>

        <template v-if="list.length == 0">
          <e-empty :loading="false">
            {{ false ? `Loading files...` : `No folders or files` }}
          </e-empty>
        </template>
        <div class="table-footer py-8">
          <v-pagination
            v-if="length > 1"
            v-model="page"
            :length="length"
            @input="handleSkip"
          ></v-pagination>
        </div>
        <div
          class="upload-opreation d-flex justify-center"
          v-if="list.length !== 0"
        >
          <v-btn rounded color="primary" @click="onConfirm">
            <span class="ml-2">upload</span>
          </v-btn>
          <v-btn rounded color="primary" class="ml-7">
            <span class="ml-2">cancel</span>
          </v-btn>
        </div>
        {{ info }}
        <!-- {{ $store.state.upload.specifiedPath }} -->
      </div>
    </div>

    <!-- <navigation-drawers
      :drawer.sync="isDrawers"
      :tasks="tasks"
      @handleClearRecords="handleClearRecords"
      @handleCancelUpload="handleCancelUpload"
      @handleRetryUpload="handleRetryUpload"
    ></navigation-drawers> -->
  </div>
</template>

<script>
import Vue from "vue";
import { Upload } from "@aws-sdk/lib-storage";
import { bus } from "../../main";
class TaskWrapper {
  id;
  s3;
  status;
  param;
  progress;
  task;

  constructor(s3, param, id, fileInfo) {
    this.id = id;
    this.s3 = s3;
    this.status = 0; //waitingUpload
    this.param = param;
    this.fileInfo = fileInfo;
  }
  async startTask() {
    try {
      this.task = new Upload({
        client: this.s3,
        queueSize: 3,
        params: this.param,
      });
      this.task.on("httpUploadProgress", (e) => {
        this.progress = ((e.loaded / e.total) * 100) | 0;
      });
      this.progress = 0;
      this.status = 1; // uploading
      await this.task.done();
      this.status = 3; // success

      console.log(this.id, this.status);
    } catch (e) {
      console.log(e.message);
      if (e.message == "Upload aborted.") {
        this.status = 2; // cancel/ stop
      } else {
        this.status = 4; // failed
        Vue.prototype.$alert("The storage space is full");
        console.log(this.id, this.status, e);
      }
    }
  }
  async cancelTask() {
    if (this.task) {
      await this.task.abort();
    }
    this.status = 2; //cancel/stop
    console.log(this.id, this.status);
  }
  resetStatus() {
    this.status = 0;
  }
}
export default {
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      curDir: "Current",
      files: [],
      limit: 2,
      tasks: [],
      headers: [
        {
          text: "Name",
          align: "center",
          sortable: false,
          value: "name",
        },
        { text: "Size", value: "size", sortable: false, align: "center" },
        { text: "Type", value: "type", sortable: false, align: "center" },
        { text: "Status", value: "status", sortable: false, align: "center" },
        { text: "Action", value: "action", sortable: false, align: "center" },
      ],
      page: 1,
      specifiedDir: "",
      webkitRelativePath: "",
    };
  },
  mounted() {
    bus.$on("handleAllStopUploading", () => {
      console.log(111);
      this.tasks.forEach((item) => {
        if (item.status == 0 || item.status == 1) {
          item.cancelTask();
        }
      });
    });
    bus.$on("handleStartAll", () => {
      console.log(111);
      let arr = this.tasks.filter((item) => item.status == 0);
      console.log(this.tasks);
      this.tasks.forEach((item) => {
        console.log(item);
        if (item.status == 2 || item.status == 4) {
          item.resetStatus();
          if (!arr.length) {
            this.processTask();
          }
        }
      });
    });
    bus.$on("handleCancelUpload", (id) => {
      console.log(this.task);
      let index = this.tasks.findIndex((item) => item.id == id);
      this.tasks[index].cancelTask();
    });
    bus.$on("handleRetryUpload", (id) => {
      console.log(this.tasks);
      let index = this.tasks.findIndex((item) => item.id == id);
      let arr = this.tasks.filter((item) => item.status == 0);
      this.tasks[index].resetStatus();
      if (!arr.length) {
        this.processTask();
      }
    });
    bus.$on("handleClearRecords", (id) => {
      let index = this.tasks.findIndex((it) => it.id == id);
      this.tasks.splice(index, 1);
    });

    bus.$on("handleClearAllRecords", (status) => {
      this.tasks = this.tasks.filter((it) => it.status !== status);
      bus.$emit("taskData", this.tasks);
    });
  },
  computed: {
    path() {
      const arr = this.$route.path.split("/");
      console.log(arr);
      if (this.curDir == "Specified") {
        return "bucket://" + this.info.Bucket + "/";
      } else {
        const idx = arr.findIndex((item) => item == "storage");
        const path = "bucket://" + arr.slice(idx + 1, arr.length).join("/");
        return path;
      }
    },
    list() {
      return this.files
        .slice((this.page - 1) * 10, this.page * 10)
        .map((item) => {
          return {
            name: (item.name || "").cutStr(20, 10),
            size: this.$utils.getFileSize(item.size),
            id: item.id,
            type: item.type,
            status: "Ready for Upload",
            actions: "",
          };
        });
    },
    length() {
      return Math.ceil(this.files.length / 10);
    },
    totalSize() {
      const totalSize = this.files.reduce((pre, current) => {
        return pre + current.size;
      }, 0);
      return this.$utils.getFileSize(totalSize);
    },
  },
  methods: {
    handleSkip(item) {
      this.page = item;
    },
    async addTasks(files, limit) {
      this.limit = limit;
      const newTasks = files.map((file) => {
        let webkitRelativePath = null;
        let isWebkitRelativePath = file.webkitRelativePath.indexOf("/");
        if (isWebkitRelativePath == -1) {
          webkitRelativePath = "";
        } else {
          let arr = file.webkitRelativePath.split("/");
          arr.pop();
          webkitRelativePath = arr.join("/") + "/";
          console.log(webkitRelativePath);
        }
        return new TaskWrapper(
          this.$s3,
          {
            Bucket: this.info.Bucket,
            Key:
              (this.curDir == "Specified" ? "" : this.info.Prefix) +
              this.specifiedDir +
              webkitRelativePath +
              file.name,
            Body: file,
            ContentType: file.type,
          },
          file.id,
          {
            name: file.name,
            path:
              "Bucket://" +
              this.info.Bucket +
              "/" +
              (this.curDir == "Specified" ? "" : this.info.Prefix) +
              this.specifiedDir +
              webkitRelativePath,
          }
        );
      });
      console.log(newTasks);
      this.tasks = newTasks.concat(this.tasks);
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
      console.log("idles", idles);
      const fill = this.limit - processing.length;
      const min = idles.length <= fill ? idles.length : fill;
      console.log("min", min);

      for (let i = 0; i < min; i++) {
        this.start(idles[i]);
      }
    },
    onConfirm() {
      this.addTasks(this.files, 10);
      this.files = [];
      this.$refs.uploadInput.handleRmoveAll();
      this.processTask();
      bus.$emit("taskData", this.tasks);
      // setInterval(this.processTask, 5000);
    },
    // handleCancelUpload(id) {
    //   let index = this.tasks.findIndex((item) => item.id == id);
    //   this.tasks[index].cancelTask();
    // },
    // handleRetryUpload(id) {
    //   let index = this.tasks.findIndex((item) => item.id == id);
    //   let arr = this.tasks.filter((item) => item.status == 0);
    //   this.tasks[index].resetStatus();
    //   if (!arr.length) {
    //     this.processTask();
    //   }
    // },
    // handleClearRecords(id) {
    //   let index = this.tasks.findIndex((it) => it.id == id);
    //   this.tasks.splice(index, 1);
    // },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.v-application .elevation-1 {
  box-shadow: none !important;
  color: #0b0817 !important;
}

>>> .v-input {
  height: 50px;
  border: none;
}

.choose-dir {
  width: 100%;
  padding: 30px;
  height: 240px;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
  .choose-dir-title {
    font-size: 18px;
    color: #0b0817;
    line-height: 20px;
    margin-bottom: 30px;
  }
  .current-dir {
    height: 25px;
    line-height: 25px;
    color: #0b0817;
    font-size: 18px;
    font-weight: 400;
    word-wrap: break-word;
  }
  .specified-dir {
    border: 1px solid #d0dae9;
    .appoint-dir {
      height: 25px;
      line-height: 25px;
      color: #0b0817;
      font-size: 18px;
      font-weight: 400;
      padding: 0 21px 0 18px;
      border-right: 1px solid #d0dae9;
    }
    .specified-dir-input {
      border: none;
    }
  }
}

.files-upload-container {
  padding: 30px;
  margin-top: 30px;
  background: #ffffff;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);

  .title {
    margin-bottom: 13px;
    font-size: 18px;
    color: #0b0817;
  }

  .table-container {
    .total-files-info {
      margin-bottom: 11px;
      font-size: 16px;
      font-weight: 400;
      color: #6a778b;
      line-height: 22px;
    }
  }
}
</style>