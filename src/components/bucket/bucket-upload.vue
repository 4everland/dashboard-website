<template>
  <div class="uploder-container">
    <e-menu offset-y open-on-hover nudge-bottom="11">
      <v-btn slot="ref" rounded color="primary">
        <img src="img/svg/upload.svg" width="16" />
        <span class="ml-2">Upload</span>
        <v-icon size="18">mdi-chevron-down</v-icon>
      </v-btn>
      <v-list dense>
        <v-list-item link @click="$refs.uploadInput.onClick(false)">
          <img src="img/icon/ic-download.svg" width="14" class="mr-2" />
          <span class="gray-7">Selected File</span>
        </v-list-item>
        <v-list-item link @click="$refs.uploadInput.onClick(true)">
          <img src="img/icon/ic-download.svg" width="14" class="mr-2" />
          <span class="gray-7">Selected Folder</span>
        </v-list-item>
      </v-list>
    </e-menu>
    <input-upload v-model="files" ref="uploadInput"></input-upload>
  </div>
</template>

<script>
import { bus } from "../../main";
import { TaskWrapper } from "./task.js";
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
      const idx = arr.findIndex((item) => item == "storage");
      const path = "bucket://" + arr.slice(idx + 1, arr.length).join("/");
      return path;
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
  },
  methods: {
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
            Key: this.info.Prefix + webkitRelativePath + file.name,
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
              this.info.Prefix +
              webkitRelativePath,
          },
          this.baseUrl + "/" + this.info.Prefix + webkitRelativePath + file.name
        );
      });
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
        // return bus.$emit("getList");
      }
      const fill = this.limit - processing.length;
      const min = idles.length <= fill ? idles.length : fill;

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
      this.addTasks(this.files, 10);
      this.files = [];
      this.$refs.uploadInput.handleRmoveAll();
      this.processTask();
      bus.$emit("taskData", this.tasks, true);
    },
    onCancel() {
      this.$router.go(-1);
    },
    async overStorage() {
      try {
        const { data } = await this.$http.get("$v3/usage");
        console.log(data);
        const { ipfsStorage, usedIpfsStorage } = data;
        return ipfsStorage - usedIpfsStorage;
      } catch (err) {
        console.log(err);
      }
    },
  },
  watch: {
    length(value) {
      if (this.page > value) {
        this.page = value;
      }
    },
    async files(newVal, oldVal) {
      if (oldVal.length == 0 && newVal.length) {
        this.page = 1;
      }
      if (newVal.length) {
        const residue = await this.overStorage();
        console.log(residue);
        const totalSizeVal = newVal.reduce((pre, current) => {
          return pre + current.size;
        }, 0);

        if (totalSizeVal > residue) {
          this.isStorageFull = true;
        } else {
          this.isStorageFull = false;
        }
        this.onConfirm();
      }
    },
  },
};
</script>
