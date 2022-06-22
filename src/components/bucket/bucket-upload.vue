<template>
  <div class="uploder-container">
    <div class="files-upload-container">
      <div class="al-c mb-4">
        <v-btn icon @click="handleBackFolder">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h3 class="title ma-0 ml-2">Files to Upload</h3>
      </div>
      <!-- upload-area -->
      <div class="files-to-upload">
        <input-upload v-model="files" ref="uploadInput"></input-upload>
      </div>

      <!-- upload-list -->
      <div class="table-container">
        <div class="upload-info d-flex flex-column flex-md-row align-md-end">
          <div
            class="
              choose-dir
              flex-column flex-sm-row
              d-flex
              align-center
              flex-1
            "
          >
            <div class="mr-3 label text-center">Upload to:</div>
            <div
              class="dir-container current-dir-all flex-1"
              v-if="curDir == 'Current'"
            >
              {{ path }}
            </div>
            <div
              class="dir-container d-flex flex-sm-grow-1"
              :class="[
                curDir == 'Specified' ? 'choose-specified' : '',
                isValidate ? '' : 'no-validate',
              ]"
              v-else
            >
              <div class="current-dir">
                {{ path.cutStr(10, 10) }}
              </div>
              <div class="specified-dir flex-1" v-if="curDir !== 'Current'">
                <v-text-field
                  ref="specifiedRef"
                  v-model="specifiedDir"
                  class="specified-dir-input"
                  :rules="[rules.counter, rules.validate]"
                  solo
                  autofocus
                  counter
                  maxlength="200"
                  clearable
                ></v-text-field>
              </div>
              <e-tooltip
                right
                bottom
                max-width="500"
                class="tool-tip"
                v-if="curDir !== 'Current'"
              >
                <v-icon
                  slot="ref"
                  size="20"
                  class="pa-1 d-ib ml-2"
                  style="line-height: inherit"
                  >mdi-alert-circle-outline</v-icon
                >
                <p>
                  1.A folder name can contain only UTF-8 characters and cannot
                  contain emojis.
                </p>
                <p>
                  2.Forward slashes (/) are used in a folder name to indicate
                  the path of the folder. You can create a subfolder by
                  specifying a folder name that includes multiple forward
                  slashes. A folder name cannot start with a forward slash (/)
                  or consecutive backslashes (\). A folder name cannot contain
                  consecutive forward slashes (/).
                </p>
                <p>
                  3.The name of a subfolder cannot contain consecutive periods
                  (..).
                </p>
                <p>4.A folder name must be 1 to 200 characters in length.</p>
              </e-tooltip>
            </div>
            <div class="switch-btn mt-3 mt-sm-0">
              <span
                v-if="curDir !== 'Current'"
                @click="
                  curDir = 'Current';
                  specifiedDir = '';
                "
                >Current</span
              >
              <span v-else @click="curDir = 'Specified'">Specified</span>
            </div>
          </div>
          <div class="total-files-info shrink-0 ml-4" v-show="files.length">
            <span>{{ files.length }} Files</span>
            <span class="ml-4">{{ totalSize }} </span>
          </div>
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
            {{ false ? `Loading files...` : `No files` }}
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
          <v-btn
            rounded
            color="primary"
            @click="onConfirm"
            :disabled="!isValidate"
          >
            <span>Upload</span>
          </v-btn>
          <v-btn rounded outlined class="ml-7" @click="onCancel">
            <span>Cancel</span>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "../../main";
import { TaskWrapper } from "./task.js";
import { mapActions } from "vuex";
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
        validate: this.validate,
      },
      isStorageFull: false,
    };
  },
  async created() {
    // await this.$store.dispatch("getUsageInfo");
    bus.$on("handleClearRecords", (id) => {
      let index = this.tasks.findIndex((it) => it.id == id);
      if (index !== -1) {
        this.tasks.splice(index, 1);
      }
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
      const totalSizeVal = this.files.reduce((pre, current) => {
        return pre + current.size;
      }, 0);
      return this.$utils.getFileSize(totalSizeVal);
    },
    isValidate() {
      return typeof this.validate(this.specifiedDir) == "string" ? false : true;
    },
  },
  methods: {
    // ...mapActions(["getUsageInfo"]),
    validate(value) {
      if (value == null || value == "") return true;

      let reg = new RegExp("^[a-z\\d-_/\\u4E00-\\u9FA5]+$");
      if (reg.test(value)) {
        if (value.indexOf("//") != -1) {
          return "Folder names can consist only of lowercase letters, numbers, underscode (_), and hyphens (-).";
        }
        let foldersCountMax = value.split("/");
        if (foldersCountMax.length > 18) {
          return "You can create up to 18 folders.";
        }
        let folderNameMax = foldersCountMax.some((it) => it.length > 60);
        if (folderNameMax) {
          return "The maximum folder name length is 60 characters.";
        }
        if (value.indexOf("/", value.length - 1) != -1 || value[0] == "/") {
          return "Folder names can consist only of lowercase letters, numbers, underscode (_), and hyphens (-).";
        }

        return true;
      } else {
        return "Folder names can consist only of lowercase letters, numbers, underscode (_), and hyphens (-).";
      }
    },
    handleSkip(item) {
      this.page = item;
    },
    handleBackFolder() {
      this.$emit("handleBackFolder");
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
              (this.curDir == "Specified" && this.specifiedDir != ""
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
            (this.curDir == "Specified" ? "/" : "") +
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
    async onConfirm() {
      // await this.getUsageInfo();
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
          bus.$emit("taskData", this.tasks, true);
        }
      } else {
        this.addTasks(this.files, 10);
        this.files = [];
        this.$refs.uploadInput.handleRmoveAll();
        this.processTask();
        bus.$emit("taskData", this.tasks, true);
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

      // const totalSizeVal = newVal.reduce((pre, current) => {
      //   return pre + current.size;
      // }, 0);
      // if (
      //   totalSizeVal >
      //   this.$store.state.usageInfo.ipfsTotal -
      //     this.$store.state.usageInfo.ipfsUsed
      // ) {
      //   this.isStorageFull = true;
      // } else {
      //   this.isStorageFull = false;
      // }
    },
  },
};
</script>
<style>
/* .specified-dir-input .v-text-field__details {
  min-height: 0;
  margin-bottom: 0;
} */
.specified-dir-input .v-input__control .v-input__slot {
  /* width: 340px !important; */
  box-shadow: none !important;
  font-size: 14px !important;
}
.specified-dir-input .v-input__control input {
  color: #6a778b !important;
}

.specified-dir-input .v-input__control .v-counter {
  position: absolute;
  right: 35px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
}

.specified-dir-input .v-input__control .v-messages {
  position: absolute;
  left: 0;
  bottom: -30px;
  width: 100%;
}
.tool-tip + span {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  line-height: 48px !important;
}
</style>
<style lang="scss" scoped>
.v-application .elevation-1 {
  box-shadow: none !important;
  color: #0b0817 !important;
}

.upload-info {
  padding: 20px 0;
  .choose-dir {
    .label {
      min-width: 100px;
    }
    .current-dir-all {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dir-container {
      width: 100%;
      position: relative;
      // width: 600px;
      height: 50px;
      // padding: 0 20px;
      margin: 20px 0;
      padding-left: 20px;
      padding-right: 80px;
      line-height: 50px;
      color: #79838e;
      font-size: 14px;
      border-radius: 6px;
      border: 1px solid #d0dae9;
      background: #f8fafb;
      .current-dir {
        padding-right: 10px;
        position: relative;
        font-size: 14px;
        color: #79838e;
        white-space: nowrap;
      }
    }
    .choose-specified.dir-container {
      background: #fff;
      .current-dir::after {
        content: "";
        display: block;
        height: 20px;
        width: 1px;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background: #d0dae9;
      }
    }
    .no-validate.dir-container {
      border-color: red;
    }
    .switch-btn {
      font-size: 16px;
      color: #34a9ff;
      cursor: pointer;
      padding: 0 30px;
    }
  }
}

.files-upload-container {
  background: #ffffff;

  .title {
    margin-bottom: 0;
    font-size: 18px;
    color: #0b0817;
  }

  .table-container {
    .total-files-info {
      margin-left: 10px;
      text-align: right;
      font-size: 14px;
      font-weight: 400;
      color: #6a778b;
      line-height: 22px;
    }
  }
}
</style>