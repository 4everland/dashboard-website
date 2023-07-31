<template>
  <div class="uploder-container">
    <e-menu offset-y open-on-hover nudge-bottom="11">
      <v-btn slot="ref" color="primary">
        <img src="/img/svg/upload.svg" width="16" />
        <span class="ml-2">Upload</span>
        <v-icon size="18">mdi-chevron-down</v-icon>
      </v-btn>
      <v-list dense>
        <v-list-item link @click="$refs.uploadInput.onClick(false)">
          <!-- <img src="/img/icon/ic-download.svg" width="14" class="mr-2" /> -->
          <span class="gray-7">Selected File</span>
        </v-list-item>

        <v-list-item link @click="$refs.uploadInput.onClick(true)">
          <!-- <img src="/img/icon/ic-download.svg" width="14" class="mr-2" /> -->
          <span class="gray-7">Selected Folder</span>
        </v-list-item>

        <v-list-item link @click="isPinCidDialog = true">
          <!-- <img src="/img/icon/ic-download.svg" width="14" class="mr-2" /> -->
          <span class="gray-7">Selected CID</span>
        </v-list-item>
      </v-list>
    </e-menu>
    <input-upload v-model="files" ref="uploadInput"></input-upload>

    <v-dialog v-model="isPinCidDialog" max-width="600">
      <div class="pa-6">
        <h2>Pin By CID</h2>
        <div class="mt-7 fz-14 pl-6">
          This function allows you to pin content to 4EVERLAND bucket using an
          IPFS Content Identifier. (CID)
        </div>
        <div class="gray tips mt-3 fz-12 pl-6">
          The IPFS network is large and it may take some time. Currently, the
          Bucket does not support uploading root CIDs, so please use the 4EVER
          Pin instead.
        </div>
        <div class="mt-5 pl-6">
          <v-form ref="form" v-model="valid">
            <div>
              <span class="ops-item fz-14">IPFS CID</span>
              <v-text-field
                persistent-placeholder
                dense
                v-model="form.cid"
                autocomplte="off"
                :rules="cidRules"
                :disabled="pinCidLoading"
              />
            </div>
            <div>
              <span class="ops-item fz-14">Set a Name</span>
              <v-text-field
                dense
                persistent-placeholder
                v-model="form.name"
                autocomplte="off"
                :rules="nameRules"
                :counter="30"
                :disabled="pinCidLoading"
              />
            </div>
          </v-form>
        </div>
        <div class="mt-5 pl-6 ta-c">
          <v-btn width="180" outlined @click="isPinCidDialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            width="180"
            class="ml-5"
            :disabled="!valid"
            @click="handleSubmit"
            :loading="pinCidLoading"
          >
            Search and Pin
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import InputUpload from "@/views/bucket/components/input-upload";
import { mapState } from "vuex";
import { bus } from "../../utils/bus";
import { TaskWrapper, PinCidTaskWrapper } from "./task.js";
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
      isPinCidDialog: false,
      pinCidLoading: false,
      valid: false,
      form: {
        cid: null,
        name: null,
      },
      nameRules: [
        (v) => !!(v || "").trim() || "Invalid",
        (v) => !/\//.test(v) || "/ is not allowed.",
        (v) => (v && v.length > 30 ? "more than 30 chars!" : true),
      ],
      cidRules: [
        (v) => !!(v || "").trim() || "Invalid CID",
        (v) =>
          /^([A-Za-z0-9]{46}|[A-Za-z0-9]{59})$/.test(v) ? true : "Invalid CID",
      ],
      accessKeyExpired: false,
    };
  },
  async created() {
    bus.$on("handleClearRecords", (id) => {
      let index = this.tasks.findIndex((it) => it.id == id);
      if (index !== -1) {
        this.tasks.splice(index, 1);
      }
      bus.$emit("taskData", this.tasks);
    });
    bus.$on("handleClearAllRecords", () => {
      this.tasks = [];
      bus.$emit("taskData", this.tasks);
    });
  },
  computed: {
    ...mapState({
      s3: (s) => s.moduleS3.s3,
      s3m: (s) => s.moduleS3.s3m,
    }),
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
          this.s3,
          {
            Bucket: this.info.Bucket,
            Key: this.info.Prefix + webkitRelativePath + file.name,
            Body: file,
            ContentType: file.type,
          },
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
      try {
        await task.startTask();
        this.processTask();
        this.accessKeyExpired = false;
      } catch (error) {
        console.log(error);
        if (this.accessKeyExpired) return;
        if (error.message == "InvalidAccessKeyId") {
          this.accessKeyExpired = true;
          localStorage.removeItem("stsData1");
          await this.$store.dispatch("initS3");
          this.processTask(true);
        }
      }
    },
    async processTask(val) {
      if (val) {
        this.tasks
          .filter((task) => task.status != 3)
          .forEach((task) => task.updateS3Instance(this.s3));
      }
      let processing = this.tasks.filter((task) => {
        return task.status == 1;
      });
      if (processing.length >= this.limit) {
        return;
      }
      const idles = this.tasks.filter((task) => {
        return task.status == 0;
      });
      if (idles.length == 0) return;
      const fill = this.limit - processing.length;
      const min = idles.length <= fill ? idles.length : fill;

      for (let i = 0; i < min; i++) {
        this.start(idles[i]);
      }
    },
    async onConfirm() {
      if (this.isStorageFull) return this.$utils.resourceInsufficient();
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
        const result = await this.$http({
          url: "/buckets/extra",
          methods: "get",
          params: {
            name: this.info.Bucket,
          },
        });
        let curBucketInfo = result.data.list[0];
        let isCurBucketAr = curBucketInfo.arweave.sync;
        let arStorageByte = null;
        const { data } = await this.$http.get("$v3/usage/ipfs");
        let ipfsStorageByte = data.storageByte;
        if (isCurBucketAr) {
          const { data } = await this.$http.get("$v3/usage/ar");
          arStorageByte = data.storageByte;
        }
        return { ipfsStorageByte, arStorageByte };
      } catch (err) {
        console.log(err);
      }
    },
    async handleSubmit() {
      let valid = this.$refs.form.validate();
      if (!valid) return;
      //.......
      // this.pinCidLoading = true;
      const form = JSON.parse(JSON.stringify(this.form));
      const pinTask = new PinCidTaskWrapper(form, this.s3, this.info);
      pinTask.aleadyPin();

      bus.$emit("pinTask", pinTask);
      this.isPinCidDialog = false;
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
        this.$loading();
        const { ipfsStorageByte, arStorageByte } = await this.overStorage();
        const totalSizeVal = newVal.reduce((pre, current) => {
          return pre + current.size;
        }, 0);
        if (!arStorageByte) {
          if (totalSizeVal > ipfsStorageByte) {
            this.isStorageFull = true;
          } else {
            this.isStorageFull = false;
          }
        } else {
          if (totalSizeVal > ipfsStorageByte || totalSizeVal > arStorageByte) {
            this.isStorageFull = true;
          } else {
            this.isStorageFull = false;
          }
        }

        this.$loading.close();
        this.onConfirm();
      }
    },
    isPinCidDialog(newVal) {
      if (!newVal) return this.$refs.form.reset();
    },
  },
  components: {
    InputUpload,
  },
};
</script>
