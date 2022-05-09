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
        <img
          :src="
            curDir == 'Current'
              ? 'img/icon/bucketUpload/ic-current-active.svg'
              : 'img/icon/bucketUpload/ic-current.svg'
          "
          width="16"
        />
        <span class="ml-2">Current</span>
      </v-btn>
      <v-btn
        :color="curDir == 'Specified' ? 'primary' : ''"
        :outlined="curDir == 'Specified' ? false : true"
        rounded
        class="ml-7"
        @click="curDir = 'Specified'"
      >
        <img
          :src="
            curDir == 'Specified'
              ? 'img/icon/bucketUpload/ic-specified.svg'
              : 'img/icon/bucketUpload/ic-specified-active.svg'
          "
          width="16"
        />
        <span class="ml-2">Specified</span>
      </v-btn>

      <div class="current-dir px-2 mt-10" v-if="curDir == 'Current'">
        {{ path }}
      </div>
      <div class="specified-dir d-flex align-center mt-7" v-else>
        <div class="appoint-dir d-flex align-center">{{ path }}</div>
        <v-text-field
          ref="specifiedRef"
          v-model="specifiedDir"
          class="bd-1 specified-dir-input"
          :rules="[rules.counter, rules.validate]"
          clearable
          counter
          maxlength="200"
        ></v-text-field>
        <e-tooltip right bottom max-width="500">
          <v-icon slot="ref" size="24" class="pa-1 d-ib ml-2"
            >mdi-alert-circle-outline</v-icon
          >
          <p>
            1.A folder name can contain only UTF-8 characters and cannot contain
            emojis.
          </p>
          <p>
            2.Forward slashes (/) are used in a folder name to indicate the path
            of the folder. You can create a subfolder by specifying a folder
            name that includes multiple forward slashes. A folder name cannot
            start with a forward slash (/) or consecutive backslashes (\). A
            folder name cannot contain consecutive forward slashes (/).
          </p>
          <p>
            3.The name of a subfolder cannot contain consecutive periods (..).
          </p>
          <p>4.A folder name must be 1 to 200 characters in length.</p>
        </e-tooltip>
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
          <template #item.type="{ item }">
            <span>
              {{ item.type ? item.type : "--" }}
            </span>
          </template>
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
            total-visible="10"
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
          <v-btn rounded color="primary" class="ml-7" @click="onCancel">
            <span class="ml-2">cancel</span>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Upload } from "@aws-sdk/lib-storage";
import { bus } from "../../main";
// import { TaskWrapper } from "./task";
class TaskWrapper {
  id;
  s3;
  status;
  param;
  progress;
  task;
  failedMessage;
  url;
  constructor(s3, param, id, fileInfo, url) {
    this.id = id;
    this.s3 = s3;
    this.status = 0; //waitingUpload
    this.param = param;
    this.fileInfo = fileInfo;
    this.url = url;
  }
  async startTask() {
    try {
      this.task = new Upload({
        client: this.s3,
        queueSize: 3,
        params: this.param,
      });
      this.task.on("httpUploadProgress", (e) => {
        console.log("httpUploadProgress", e);
        this.progress = ((e.loaded / e.total) * 100) | 0;
      });
      this.progress = 0;
      this.status = 1; // uploading

      await this.task.done();
      this.status = 3; // success
    } catch (e) {
      console.log(111, e);
      // console.log(e.message);
      if (e.message == "Upload aborted.") {
        this.status = 2; // cancel/ stop
      } else {
        this.status = 4; // failed
        // Vue.prototype.$alert(e.message);
        this.failedMessage = e.message;
      }
    }
  }
  async cancelTask() {
    if (this.task) {
      await this.task.abort();
    }
    this.status = 2; //cancel/stop
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
    baseUrl: {
      type: String,
      default: "",
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
      rules: {
        counter: (value) => {
          if (value == null) {
            value = "";
          }
          return value.length <= 200 || "Max 200 characters";
        },
        validate: (value) => {
          if (value == null || value == "") return true;
          if (/^(?![\\\/])[a-z\d-_/]+(?<![\\\/])$/.test(value)) {
            if (value.indexOf("//") != -1) {
              return "Folder names can consist only of lowercase letters, numbers, underscode (_), and hyphens (-)";
            }
            let foldersCountMax = value.split("/");
            if (foldersCountMax.length > 18) {
              return "can not > 18";
            }
            let folderNameMax = foldersCountMax.some((it) => it.length > 60);
            if (folderNameMax) {
              return "can not > 60";
            }

            return true;
          } else {
            return "Folder names can consist only of lowercase letters, numbers, underscode (_), and hyphens (-)";
          }
        },
      },
      isStorageFull: false,
    };
  },
  async created() {
    await this.$store.dispatch("getUsageInfo");

    bus.$on("handleClearRecords", (id) => {
      let index = this.tasks.findIndex((it) => it.id == id);
      this.tasks.splice(index, 1);
      bus.$emit("taskData", this.tasks);
    });
    bus.$on("handleClearAllRecords", (status) => {
      this.tasks = this.tasks.filter((it) => it.status !== status);
      bus.$emit("taskData", this.tasks);
    });
  },
  computed: {
    path() {
      const arr = this.$route.path.split("/");
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
      if (
        totalSize >
        this.$store.state.usageInfo.ipfsTotal -
          this.$store.state.usageInfo.ipfsUsed
      ) {
        this.isStorageFull = true;
      } else {
        this.isStorageFull = false;
      }
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
        }
        return new TaskWrapper(
          this.$s3,
          {
            Bucket: this.info.Bucket,
            Key:
              (this.curDir == "Specified"
                ? this.specifiedDir + "/"
                : this.info.Prefix) +
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
          },
          this.baseUrl +
            "/" +
            (this.curDir == "Specified" ? "" : this.info.Prefix) +
            this.specifiedDir +
            webkitRelativePath +
            file.name
        );
      });
      // console.log(newTasks);
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
      // console.log("idles", idles);
      const fill = this.limit - processing.length;
      const min = idles.length <= fill ? idles.length : fill;
      // console.log("min", min);

      for (let i = 0; i < min; i++) {
        this.start(idles[i]);
      }
    },
    onConfirm() {
      if (this.isStorageFull)
        return this.$alert(
          "Insufficient storage space is available to upload the file."
        );
      this.page = 1;
      if (this.curDir == "Specified") {
        let isValidate = this.$refs.specifiedRef.validate(true);
        if (isValidate) {
          this.addTasks(this.files, 10);
          this.files = [];
          this.$refs.uploadInput.handleRmoveAll();
          this.processTask();
          bus.$emit("taskData", this.tasks);
          this.tasks = [];
        }
      } else {
        this.addTasks(this.files, 10);
        this.files = [];
        this.$refs.uploadInput.handleRmoveAll();
        this.processTask();
        bus.$emit("taskData", this.tasks);
        // this.tasks = [];
      }
    },
    onCancel() {
      this.$router.go(-1);
    },
  },
  watch: {
    length(value) {
      if (this.page > value) {
        this.page = value;
      }
    },
    files(newVal, oldVal) {
      if (oldVal.length == 0 && newVal.length) {
        this.page = 1;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.v-application .elevation-1 {
  box-shadow: none !important;
  color: #0b0817 !important;
}
>>> .v-input {
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
    padding-right: 20px;
    border: 1px solid #d0dae9;
    .appoint-dir {
      height: 25px;
      line-height: 25px;
      color: #0b0817;
      font-size: 18px;
      font-weight: 400;
      padding: 0 21px 0 18px;
      margin-right: 20px;
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